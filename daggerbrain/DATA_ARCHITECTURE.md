# Daggerbrain Data Architecture Documentation

## Overview

This document provides a comprehensive breakdown of permissions, data flow, and storage locations for **Campaigns**, **Characters**, and **Homebrew** content in the Daggerbrain application.

---

## Table of Contents

1. [Storage Architecture](#storage-architecture)
2. [Campaigns](#campaigns)
3. [Characters](#characters)
4. [Homebrew](#homebrew)
5. [Data Flow Diagrams](#data-flow-diagrams)
6. [Permission Matrix](#permission-matrix)
7. [Authentication & Authorization](#authentication--authorization)
8. [State Management](#state-management)

---

## Storage Architecture

### Storage Backends

The application uses multiple Cloudflare storage services:

- **D1 Database (SQLite)**: Primary persistent storage for all structured data
- **Cloudflare KV**: Fast read cache and write-through cache for campaign state and public content
- **R2 Storage**: Image storage (compendium images, user-uploaded images)
- **Durable Objects**: Real-time campaign state synchronization via WebSocket

### Storage Strategy

- **D1**: Source of truth for all persistent data
- **KV**: Write-through cache for frequently accessed data (campaign state, public homebrew/characters)
- **Durable Objects**: Authoritative source for live campaign sessions (fear track, notes, character updates)

### Storage Bindings (wrangler.jsonc)

```jsonc
{
  "d1_databases": [{
    "binding": "DB",
    "database_name": "daggerbrain-db"
  }],
  "kv_namespaces": [{
    "binding": "KV",
    "id": "c6a68fb4a3af4958a02aec33f40213ac"
  }],
  "r2_buckets": [
    { "binding": "R2_IMAGES", "bucket_name": "daggerbrain-images" },
    { "binding": "R2_USERCONTENT", "bucket_name": "daggerbrain-usercontent" }
  ],
  "durable_objects": [{
    "name": "CAMPAIGN_LIVE",
    "class_name": "CampaignLiveDO",
    "script_name": "campaigns-do"
  }]
}
```

---

## Campaigns

### Database Schema

**Table: `campaigns_table`** (D1)
- `id` (TEXT, PRIMARY KEY) - UUID
- `gm_user_id` (TEXT, NOT NULL) - Owner/Game Master (Clerk user ID)
- `name` (TEXT, NOT NULL)
- `description` (TEXT, nullable)
- `created_at` (INTEGER, NOT NULL) - Unix timestamp
- `updated_at` (INTEGER, NOT NULL) - Unix timestamp
- **Index**: `campaigns_table_gm_user_id_idx` on `gm_user_id`

**Table: `campaign_members_table`** (D1)
- `campaign_id` (TEXT, NOT NULL)
- `user_id` (TEXT, NOT NULL) - Clerk user ID
- `role` (TEXT, NOT NULL) - 'gm' | 'player'
- `joined_at` (INTEGER, NOT NULL) - Unix timestamp
- **Primary Key**: Composite (`campaign_id`, `user_id`)
- **Indexes**: 
  - `campaign_members_table_campaign_id_idx` on `campaign_id`
  - `campaign_members_table_user_id_idx` on `user_id`

**Table: `campaign_state_table`** (D1)
- `campaign_id` (TEXT, PRIMARY KEY)
- `fear_track` (INTEGER, NOT NULL, default: 0)
- `notes` (TEXT, nullable)
- `updated_at` (INTEGER, NOT NULL) - Unix timestamp

**Table: `campaign_homebrew_vault_table`** (D1)
- `id` (TEXT, PRIMARY KEY) - UUID
- `campaign_id` (TEXT, NOT NULL)
- `homebrew_type` (TEXT, NOT NULL) - Matches HomebrewType enum
- `homebrew_id` (TEXT, NOT NULL)
- `added_at` (INTEGER, NOT NULL) - Unix timestamp
- **Index**: `campaign_homebrew_vault_table_campaign_id_idx` on `campaign_id`

### KV Storage

**Key Pattern**: `campaign:{campaignId}:state`
- **Purpose**: Write-through cache for campaign state (fear_track, notes)
- **Strategy**: KV checked first, falls back to D1 if missing
- **Update**: Written to both D1 and KV on every update
- **TTL**: None (expirationTtl: undefined)
- **Note**: During live sessions, Durable Object is authoritative, not KV

**Key Pattern**: `campaign:{campaignId}:characters`
- **Purpose**: Cache for campaign character summaries
- **Content**: `Record<string, CampaignCharacterSummary>`
- **Update**: Updated when characters are assigned/removed/updated in campaign

### Durable Objects

**Binding**: `CAMPAIGN_LIVE`
- **Purpose**: Real-time synchronization for live campaign sessions
- **WebSocket Endpoint**: `/api/campaigns/[id]/live`
- **Data Maintained**:
  - Campaign state (fear_track, notes)
  - Character live updates (HP, stress, hope, armor, conditions)
- **Authority**: During active sessions, DO is source of truth
- **Persistence**: DO persists changes to D1 and KV asynchronously

### Remote Functions

**Queries** (Read-only, cached):
- `get_campaign(campaignId)` - Get campaign details
- `get_campaign_members(campaignId)` - Get all members
- `get_campaign_state(campaignId)` - Get state (checks KV first, then D1)
- `get_campaign_characters(campaignId)` - Get character summaries
- `get_campaign_homebrew_vault(campaignId)` - Get vault items
- `get_user_campaigns()` - Get all campaigns user is member of

**Commands** (Write operations):
- `create_campaign({ name, description })` - Create new campaign
- `update_campaign({ campaign_id, name?, description? })` - Update campaign
- `delete_campaign(campaignId)` - Delete campaign (GM only)
- `join_campaign(campaignId)` - Join as player
- `leave_campaign(campaignId)` - Leave campaign
- `update_campaign_state({ campaign_id, fear_track?, notes? })` - Update state (GM only)
- `assign_character_to_campaign({ character_id, campaign_id, claimable? })` - Assign character
- `claim_character({ character_id, campaign_id })` - Claim a claimable character

### Permissions

#### View Campaign
- ✅ **GM**: Can view their own campaigns
- ✅ **Player**: Can view campaigns they're members of
- ❌ **Non-member**: Cannot view campaign

**Check Location**: `src/routes/(private)/campaigns/[id]/+layout.server.ts`
- Verifies membership via `get_campaign_members()`
- Returns 403 if not a member
- Returns role ('gm' | 'player') to client

#### Edit Campaign (Name/Description)
- ✅ **GM**: Can edit (via `update_campaign` command)
- ❌ **Player**: Cannot edit
- **Validation**: Checks `campaign.gm_user_id === userId` in `update_campaign()`

#### Update Campaign State (Fear Track, Notes)
- ✅ **GM**: Can update via WebSocket (live sessions) or HTTP endpoint
- ❌ **Player**: Cannot update
- **Validation**: `is_campaign_gm()` check in `update_campaign_state()`
- **Live Sessions**: Updates go through WebSocket → Durable Object

#### Delete Campaign
- ✅ **GM**: Can delete their own campaigns
- ❌ **Player**: Cannot delete
- **Validation**: Checks `campaign.gm_user_id === userId` in `delete_campaign()`
- **Side Effects**: Removes all members, deletes campaign state, removes from vault

#### Join Campaign
- ✅ **Any authenticated user**: Can join via campaign ID
- **Action**: Creates entry in `campaign_members_table` with role 'player'
- **Validation**: Checks if already a member

#### Leave Campaign
- ✅ **Player**: Can leave (removes from `campaign_members_table`)
- ❌ **GM**: Cannot leave (would orphan campaign)
- **Validation**: Checks role before allowing leave

#### Add/Remove from Vault
- ✅ **GM**: Can add/remove any homebrew to/from their campaign vault
- ✅ **Owner**: Can add their own homebrew to campaigns they're GM of
- ❌ **Player**: Cannot modify vault

### Data Flow

#### Creating a Campaign
```
User Action → create_campaign() command
  ↓
1. Generate campaignId (crypto.randomUUID())
2. Get current timestamp
3. Insert into campaigns_table (D1)
   - Sets gm_user_id to current user
4. Insert GM into campaign_members_table (D1)
   - role: 'gm'
5. Insert initial state into campaign_state_table (D1)
   - fear_track: 0, notes: null
6. Write state to KV: campaign:{id}:state
7. Refresh get_user_campaigns() query cache
  ↓
Return campaignId
```

#### Reading Campaign State
```
User Request → get_campaign_state() query
  ↓
1. Check KV: campaign:{id}:state
   ├─ If found and valid (has updated_at) → Return KV data ✅
   └─ If missing/invalid → Continue
2. Read from campaign_state_table (D1)
3. If missing, create default state in D1
4. Write to KV (cache for next time)
5. Return state
```

#### Live Campaign Updates (WebSocket)
```
Client → WebSocket → /api/campaigns/[id]/live
  ↓
1. Authenticate user (get_auth from hooks.server.ts)
2. Verify campaign membership (get_campaign_members)
3. Connect to Durable Object (CAMPAIGN_LIVE.idFromName(campaignId))
  ↓
DO maintains state in memory
  ↓
Client sends: { type: 'update_state', updates: { fear_track?, notes? } }
  ↓
DO validates GM permissions
DO updates internal state
DO broadcasts to all connected clients
  ↓
DO persists to D1 and KV asynchronously
  ↓
All clients receive: { type: 'state_update', state: {...} }
```

#### Assigning Character to Campaign
```
User Action → assign_character_to_campaign() command
  ↓
1. Verify permissions:
   ├─ User owns character OR
   └─ User is GM of target campaign
2. Update character.campaign_id in characters_table (D1)
3. If claimable flag set, update character.claimable
4. Update campaign character summaries in KV
   └─ campaign:{campaignId}:characters
5. Refresh query caches
```

---

## Characters

### Database Schema

**Table: `characters_table`** (D1)

**Core Fields**:
- `id` (TEXT, PRIMARY KEY, default: crypto.randomUUID())
- `clerk_user_id` (TEXT, NOT NULL) - Owner (Clerk user ID)
- `name` (TEXT, NOT NULL, default: CHARACTER_DEFAULTS.name)
- `image_url` (TEXT, NOT NULL, default: CHARACTER_DEFAULTS.image_url)
- `visibility` (TEXT, NOT NULL, default: 'private') - 'private' | 'public'
- `campaign_id` (TEXT, nullable) - Optional campaign association
- `claimable` (INTEGER, NOT NULL, default: 0) - 0 = not claimable, 1 = claimable
- `settings` (TEXT, JSON) - CharacterSettings
- `derived_descriptors` (TEXT, JSON) - DerivedDescriptors

**Heritage Fields**:
- `ancestry_card_id` (TEXT, nullable)
- `custom_top_ancestry` (TEXT, nullable)
- `custom_bottom_ancestry` (TEXT, nullable)
- `community_card_id` (TEXT, nullable)
- `experiences` (TEXT, JSON) - string[]
- `transformation_card_id` (TEXT, nullable)
- `additional_ancestry_card_ids` (TEXT, JSON) - string[]
- `additional_community_card_ids` (TEXT, JSON) - string[]
- `additional_transformation_card_ids` (TEXT, JSON) - string[]

**Class Fields**:
- `class_choices` (TEXT, JSON) - Record<string, Record<string, string[]>>
- `primary_class_id` (TEXT, nullable)
- `primary_subclass_id` (TEXT, nullable)
- `secondary_class_id` (TEXT, nullable)
- `secondary_subclass_id` (TEXT, nullable)
- `secondary_class_domain_id_choice` (TEXT, nullable) - DomainIds

**Beastform/Companion Fields**:
- `chosen_beastform` (TEXT, JSON, nullable) - ChosenBeastform
- `companion` (TEXT, JSON, nullable) - Companion

**Description/Notes Fields**:
- `background_question_answers` (TEXT, JSON) - BackgroundQuestionAnswer[]
- `connection_answers` (TEXT, JSON) - ConnectionAnswer[]
- `character_descriptions` (TEXT, JSON) - CharacterDescriptions
- `notes` (TEXT, NOT NULL, default: CHARACTER_DEFAULTS.notes)

**Equipment Fields**:
- `active_armor_id` (TEXT, nullable)
- `active_primary_weapon_id` (TEXT, nullable)
- `active_secondary_weapon_id` (TEXT, nullable)
- `inventory` (TEXT, JSON) - Inventory

**Condition/Other Fields**:
- `active_conditions` (TEXT, JSON) - ConditionIds[]
- `additional_domain_card_ids` (TEXT, JSON) - DomainCardId[]

**Ephemeral Stats Fields** (set by player):
- `unarmed_attack_choices` (TEXT, JSON) - Record<string, string[]>
- `ancestry_card_choices` (TEXT, JSON) - Record<string, string[]>
- `community_card_tokens` (INTEGER, NOT NULL, default: 0)
- `domain_card_choices` (TEXT, JSON) - Record<string, Record<string, string[]>>
- `domain_card_tokens` (TEXT, JSON) - Record<string, number>
- `selected_traits` (TEXT, JSON) - Traits
- `marked_hp` (INTEGER, NOT NULL, default: CHARACTER_DEFAULTS.marked_hp)
- `marked_stress` (INTEGER, NOT NULL, default: CHARACTER_DEFAULTS.marked_stress)
- `marked_hope` (INTEGER, NOT NULL, default: CHARACTER_DEFAULTS.marked_hope)
- `marked_armor` (INTEGER, NOT NULL, default: CHARACTER_DEFAULTS.marked_armor)
- `loadout_domain_card_ids` (TEXT, JSON) - DomainCardId[]
- `bonus_max_loadout` (INTEGER, NOT NULL, default: CHARACTER_DEFAULTS.bonus_max_loadout)

**Leveling Fields**:
- `level` (INTEGER, NOT NULL, default: CHARACTER_DEFAULTS.level)
- `level_up_domain_card_ids` (TEXT, JSON) - LevelUpDomainCardIds
- `level_up_choices` (TEXT, JSON) - LevelUpChoices

**Indexes**:
- `characters_table_clerk_user_id_idx` on `clerk_user_id`
- `characters_table_campaign_id_idx` on `campaign_id`

### KV Storage

**Key Pattern**: `character:{characterId}:public`
- **Purpose**: Cache for public characters (when `visibility === 'public'`)
- **Strategy**: Written on character update if visibility is public
- **Content**: Full character data as JSON
- **Update**: Removed from KV if visibility changes from public to private

**Key Pattern**: `campaign:{campaignId}:characters`
- **Purpose**: Cache for campaign character summaries
- **Strategy**: Updated when characters are assigned/removed/updated in campaign
- **Content**: `Record<string, CampaignCharacterSummary>`
- **Structure**: Each summary includes: id, name, image_url, level, marked_hp, marked_stress, marked_hope, marked_armor, active_conditions

### Remote Functions

**Queries**:
- `get_all_characters()` - Get user's own characters (WHERE clerk_user_id = userId)
- `get_character_by_id(characterId)` - Get character with permission check

**Commands**:
- `create_character(options?)` - Create new character
  - Options: `{ campaign_id?, claimable? }`
- `update_character(data)` - Update character (owner or GM)
- `delete_character(characterId)` - Delete character (owner only)
- `assign_character_to_campaign({ character_id, campaign_id, claimable? })` - Assign to campaign
- `claim_character({ character_id, campaign_id })` - Claim a claimable character

### Permissions

#### View Character
- ✅ **Owner**: Always can view (`character.clerk_user_id === userId`)
- ✅ **Public**: Anyone can view if `visibility === 'public'`
- ✅ **Campaign Member**: Can view if character is in their campaign
- ❌ **Otherwise**: Cannot view

**Check Location**: `src/lib/remote/permissions.remote.ts::can_view_character()`
**Query**: `src/lib/remote/characters.remote.ts::get_character_by_id()`

**Logic Flow**:
1. Check if owner → return true
2. Check if public → return true
3. Check if in campaign and user is member → return true
4. Otherwise → return false

#### Edit Character
- ✅ **Owner**: Always can edit (`character.clerk_user_id === userId`)
- ✅ **GM**: Can edit characters in their campaigns
- ❌ **Player**: Cannot edit other players' characters
- ❌ **Non-member**: Cannot edit

**Check Location**: `src/lib/remote/permissions.remote.ts::can_edit_character()`
**Command**: `src/lib/remote/characters.remote.ts::update_character()`

**Logic Flow**:
1. Check if owner → return true
2. Check if in campaign → get members
3. Check if user is GM of campaign → return true
4. Otherwise → return false

#### Delete Character
- ✅ **Owner**: Can delete their own characters
- ❌ **GM**: Cannot delete (even in their campaign)
- ❌ **Others**: Cannot delete

**Validation**: Checks `character.clerk_user_id === userId` in `delete_character()`
**Side Effects**: Removes from KV cache, updates campaign character summaries

#### Claim Character
- ✅ **Player**: Can claim if:
  - Character is `claimable === 1`
  - Character is in the campaign
  - User is a campaign member with role 'player' (not GM)
  - User doesn't already have a character in the campaign
- ❌ **GM**: Cannot claim characters
- ❌ **Non-member**: Cannot claim

**Check Location**: `src/lib/remote/permissions.remote.ts::can_claim_character()`
**Command**: `src/lib/remote/campaigns.remote.ts::claim_character()`

**Claim Process**:
1. Verify `can_claim_character()` returns true
2. Update `character.clerk_user_id` to claiming user
3. Set `character.claimable = 0`
4. Update campaign character summaries in KV

### Data Flow

#### Creating a Character
```
User Action → create_character() command
  ↓
1. Generate characterId (crypto.randomUUID())
2. Insert into characters_table (D1)
   - Sets clerk_user_id to current user
   - Sets default values from CHARACTER_DEFAULTS
   - If campaign_id provided, sets it
   - If claimable flag provided, sets it
3. If campaign_id provided:
   └─ Update campaign character summaries in KV
      └─ campaign:{campaignId}:characters
4. Return characterId
```

#### Updating a Character
```
User Action → update_character() command
  ↓
1. Verify permissions:
   ├─ Check if owner (character.clerk_user_id === userId)
   └─ If not owner, check if GM of campaign
2. Get previous visibility value
3. Update characters_table (D1)
   - Note: derived_character field is stripped (not stored)
4. Handle KV materialization:
   ├─ If visibility === 'public':
   │  └─ Write to KV: character:{id}:public
   ├─ If visibility changed from public to private:
   │  └─ Remove from KV: character:{id}:public
   └─ If campaign_id exists:
      └─ Update campaign:{id}:characters in KV
5. Refresh query caches
```

#### Assigning Character to Campaign
```
User Action → assign_character_to_campaign() command
  ↓
1. Verify permissions:
   ├─ User owns character (character.clerk_user_id === userId) OR
   └─ User is GM of target campaign
2. Update character.campaign_id in characters_table (D1)
3. If claimable flag provided, update character.claimable
4. Update campaign character summaries in KV
   └─ campaign:{campaignId}:characters
   └─ Calls updateCampaignCharacterSummary() helper
5. Refresh query caches
```

#### Claiming a Character
```
Player Action → claim_character() command
  ↓
1. Verify can_claim_character() permissions:
   ├─ Character exists
   ├─ Character.claimable === 1
   ├─ Character.campaign_id === campaignId
   ├─ User is campaign member
   ├─ User role is 'player' (not GM)
   └─ User doesn't already have character in campaign
2. Update character.clerk_user_id to claiming user (D1)
3. Set character.claimable = 0 (D1)
4. Update campaign character summaries in KV
   └─ campaign:{campaignId}:characters
5. Refresh query caches
```

#### Reading Characters
```
User Request → get_all_characters() query
  ↓
1. Query characters_table WHERE clerk_user_id = userId (D1)
2. Return user's own characters only
   - Note: GMs don't see characters they created but were claimed
```

```
User Request → get_character_by_id() query
  ↓
1. Load character from characters_table (D1)
2. Check permissions (can_view_character logic):
   ├─ If owner → return
   ├─ If public → return
   └─ If in campaign and user is member → return
3. If not authorized → throw 403 error
```

---

## Homebrew

### Database Schema

All homebrew tables follow a similar pattern with these common fields:

**Common Fields**:
- `id` (TEXT, PRIMARY KEY) - UUID
- `clerk_user_id` (TEXT, NOT NULL) - Owner (Clerk user ID)
- `data` (TEXT, JSON, NOT NULL) - The actual homebrew content (validated against compendium types)
- `visibility` (TEXT, NOT NULL, default: 'private') - 'private' | 'public'
- `campaign_id` (TEXT, nullable) - Optional campaign association
- `created_at` (INTEGER, NOT NULL) - Unix timestamp
- `updated_at` (INTEGER, NOT NULL) - Unix timestamp
- **Indexes**: 
  - `homebrew_{type}_clerk_user_id_idx` on `clerk_user_id`
  - `homebrew_{type}_campaign_id_idx` on `campaign_id`

**Homebrew Tables**:
1. `homebrew_classes` - CharacterClass data
2. `homebrew_subclasses` - Subclass data
3. `homebrew_domains` - Domain data
4. `homebrew_domain_cards` - DomainCard data
5. `homebrew_primary_weapons` - Weapon data
6. `homebrew_secondary_weapons` - Weapon data
7. `homebrew_armor` - Armor data
8. `homebrew_loot` - Loot data
9. `homebrew_consumables` - Consumable data
10. `homebrew_ancestry_cards` - AncestryCard data
11. `homebrew_community_cards` - CommunityCard data
12. `homebrew_transformation_cards` - TransformationCard data
13. `homebrew_beastforms` - Beastform data

### KV Storage

**Key Pattern**: `homebrew:{type}:{id}:public`
- **Purpose**: Cache for public homebrew items
- **Strategy**: Written when visibility is set to 'public'
- **Content**: Full homebrew data as JSON with metadata
- **Update**: Removed from KV if visibility changes from public to private
- **Types**: All homebrew types are cached with this pattern

### Campaign Homebrew Vault

**Table**: `campaign_homebrew_vault_table` (D1)
- Links homebrew items to campaigns
- Allows GMs to add homebrew to campaign vault
- Campaign members can use vault items in their characters
- **Structure**: `{ id, campaign_id, homebrew_type, homebrew_id, added_at }`

**Remote Functions**:
- `get_campaign_homebrew_vault(campaignId)` - Get vault items
- `get_campaign_homebrew_items(campaignId)` - Get vault items with full data
- `add_homebrew_to_vault({ campaign_id, homebrew_type, homebrew_id })` - Add to vault
- `remove_homebrew_from_vault({ campaign_id, vault_id })` - Remove from vault

### Remote Functions

**Queries** (per type):
- `get_homebrew_classes()` - Get user's classes
- `get_homebrew_subclasses()` - Get user's subclasses
- `get_homebrew_domains()` - Get user's domains
- `get_homebrew_domain_cards()` - Get user's domain cards
- `get_homebrew_primary_weapons()` - Get user's primary weapons
- `get_homebrew_secondary_weapons()` - Get user's secondary weapons
- `get_homebrew_armor()` - Get user's armor
- `get_homebrew_loot()` - Get user's loot
- `get_homebrew_consumables()` - Get user's consumables
- `get_homebrew_ancestry_cards()` - Get user's ancestry cards
- `get_homebrew_community_cards()` - Get user's community cards
- `get_homebrew_transformation_cards()` - Get user's transformation cards
- `get_homebrew_beastforms()` - Get user's beastforms
- `get_homebrew_public({ type, uid })` - Get public homebrew (checks KV first)

**Commands** (per type):
- `create_homebrew_{type}(data)` - Create new homebrew
- `update_homebrew_{type}({ id, data })` - Update homebrew
- `delete_homebrew_{type}(id)` - Delete homebrew

**Filtering Logic** (for get queries):
- Returns items where:
  - `clerk_user_id === userId` (owner's items), OR
  - `visibility === 'public'` (public items), OR
  - `campaign_id IN user's campaigns` (campaign items)

### Permissions

#### View Homebrew
- ✅ **Owner**: Always can view (`homebrew.clerk_user_id === userId`)
- ✅ **Public**: Anyone can view if `visibility === 'public'`
- ✅ **Campaign Member**: Can view if homebrew is in their campaign vault
- ❌ **Otherwise**: Cannot view

**Check Location**: `src/lib/remote/permissions.remote.ts::can_view_homebrew()`

**Logic Flow**:
1. Fetch homebrew from appropriate table based on type
2. Check if owner → return true
3. Check if public → return true
4. Check if in campaign and user is member → return true
5. Otherwise → return false

#### Edit Homebrew
- ✅ **Owner**: Only the owner can edit
- ❌ **GM**: Cannot edit (even if in campaign vault)
- ❌ **Others**: Cannot edit

**Check Location**: `src/lib/remote/permissions.remote.ts::can_edit_homebrew()`
**Validation**: Checks `homebrew.clerk_user_id === userId` in all update commands

#### Delete Homebrew
- ✅ **Owner**: Can delete their own homebrew
- ❌ **GM**: Cannot delete (even if in campaign vault)
- ❌ **Others**: Cannot delete

**Validation**: Checks `homebrew.clerk_user_id === userId` in all delete commands

#### Add to Campaign Vault
- ✅ **GM**: Can add any homebrew to their campaign vault
- ✅ **Owner**: Can add their own homebrew to any campaign they're GM of
- ❌ **Player**: Cannot add to vault

**Command**: `src/lib/remote/campaign-homebrew.remote.ts::add_homebrew_to_vault()`

**Validation**:
1. Verify user is GM of campaign
2. Verify homebrew exists and user can view it
3. Check if already in vault (prevent duplicates)

#### Remove from Campaign Vault
- ✅ **GM**: Can remove items from their campaign vault
- ❌ **Player**: Cannot remove
- ❌ **Owner**: Cannot remove (only GM can)

**Command**: `src/lib/remote/campaign-homebrew.remote.ts::remove_homebrew_from_vault()`

**Validation**: Verifies user is GM of campaign

### Data Flow

#### Creating Homebrew
```
User Action → create_homebrew_{type}() command
  ↓
1. Generate id (crypto.randomUUID())
2. Validate data against schema (Zod validation)
3. Insert into homebrew_{type} table (D1)
   - Sets clerk_user_id to current user
   - Sets visibility to 'private' by default
   - Sets created_at and updated_at
4. If visibility === 'public', write to KV: homebrew:{type}:{id}:public
5. Return id
```

#### Updating Homebrew
```
User Action → update_homebrew_{type}() command
  ↓
1. Verify owner permissions (can_edit_homebrew)
2. Validate data against schema
3. Update homebrew_{type} table (D1)
   - Updates data, updated_at
4. Handle KV materialization:
   ├─ If visibility === 'public':
   │  └─ Write/Update KV: homebrew:{type}:{id}:public
   ├─ If visibility changed from public to private:
   │  └─ Remove from KV: homebrew:{type}:{id}:public
   └─ If visibility changed from private to public:
      └─ Write to KV: homebrew:{type}:{id}:public
5. Refresh query caches
```

#### Reading Homebrew
```
User Request → get_homebrew_{type}() query
  ↓
1. Query homebrew_{type} table (D1)
2. Filter results:
   ├─ WHERE clerk_user_id === userId (owner's items)
   ├─ OR visibility === 'public' (public items)
   └─ OR campaign_id IN user's campaigns (campaign items)
3. Parse JSON data field
4. Return filtered results as Record<string, Type>
```

#### Public Homebrew Access
```
Public Request → get_homebrew_public() query
  ↓
1. Check KV: homebrew:{type}:{uid}:public
   ├─ If found → Return (fast path) ✅
   └─ If missing → Continue
2. Determine homebrew table based on type
3. Query homebrew table (D1)
4. Verify visibility === 'public'
5. Parse JSON data field
6. Write to KV (cache for next time)
7. Check if user owns it → redirect to private view if so
8. Return homebrew data
```

#### Campaign Vault Operations
```
GM Action → add_homebrew_to_vault() command
  ↓
1. Verify GM permissions (is_campaign_gm)
2. Verify homebrew exists and user can view it
3. Check if already in vault (prevent duplicates)
4. Insert into campaign_homebrew_vault_table (D1)
   - Sets id, campaign_id, homebrew_type, homebrew_id, added_at
5. Refresh vault query cache
```

```
GM Action → remove_homebrew_from_vault() command
  ↓
1. Verify GM permissions (is_campaign_gm)
2. Verify vault item exists and belongs to campaign
3. Delete from campaign_homebrew_vault_table (D1)
4. Refresh vault query cache
```

---

## Data Flow Diagrams

### Campaign State Update Flow (Live Session)

```
┌─────────────┐
│   Client    │
│  (GM View)  │
└──────┬──────┘
       │
       │ WebSocket: { type: 'update_state', updates: {...} }
       ▼
┌─────────────────────┐
│  /api/campaigns/    │
│  [id]/live          │
│  (WebSocket)        │
│  +server.ts         │
└──────┬──────────────┘
       │
       │ 1. Authenticate (get_auth)
       │ 2. Verify membership
       │ 3. Forward to DO
       ▼
┌─────────────────────┐
│  Durable Object     │
│  (CAMPAIGN_LIVE)    │
│  - Validates GM     │
│  - Updates state    │
│  - Broadcasts       │
└──────┬──────────────┘
       │
       ├─► Broadcast to all connected clients
       │   { type: 'state_update', state: {...} }
       │
       └─► Persist to D1 + KV (async)
           ├─ campaign_state_table (D1)
           └─ campaign:{id}:state (KV)
```

### Character Update Flow

```
┌─────────────┐
│   Client    │
│  (Owner)    │
└──────┬──────┘
       │
       │ update_character() command
       ▼
┌─────────────────────┐
│  Permission Check   │
│  (Owner or GM)      │
│  can_edit_character()│
└──────┬──────────────┘
       │
       │ Update
       ▼
┌─────────────────────┐
│  characters_table   │
│  (D1)               │
└──────┬──────────────┘
       │
       ├─► If visibility === 'public':
       │   └─ KV: character:{id}:public
       │
       └─► If campaign_id exists:
           └─ Update campaign:{id}:characters (KV)
              └─ Calls updateCampaignCharacterSummary()
```

### Homebrew Creation Flow

```
┌─────────────┐
│   Client    │
│  (User)     │
└──────┬──────┘
       │
       │ create_homebrew_{type}() command
       ▼
┌─────────────────────┐
│  Validate Data      │
│  (Zod schema)       │
└──────┬──────────────┘
       │
       │ Generate ID
       ▼
┌─────────────────────┐
│  homebrew_{type}     │
│  (D1)                │
│  - clerk_user_id     │
│  - visibility: private│
│  - data (JSON)       │
└──────┬──────────────┘
       │
       └─► If visibility === 'public'
           └─ KV: homebrew:{type}:{id}:public
```

### Campaign Character Summary Update Flow

```
Character Update/Assign/Claim
  ↓
┌─────────────────────┐
│  updateCampaign     │
│  CharacterSummary() │
│  Helper Function    │
└──────┬──────────────┘
       │
       │ 1. Load all characters in campaign
       │ 2. Build summaries (id, name, image_url, 
       │    level, marked_hp, marked_stress, etc.)
       │ 3. Serialize to JSON
       │
       ▼
┌─────────────────────┐
│  KV: campaign:      │
│  {id}:characters    │
│  (Write)            │
└─────────────────────┘
```

---

## Permission Matrix

### Campaign Permissions

| Action | Owner (GM) | Player | Non-Member |
|--------|-----------|--------|------------|
| View Campaign | ✅ | ✅ | ❌ |
| Edit Name/Description | ✅ | ❌ | ❌ |
| Update State (Fear/Notes) | ✅ | ❌ | ❌ |
| Delete Campaign | ✅ | ❌ | ❌ |
| Add Members | ✅* | ❌ | ❌ |
| Remove Members | ✅* | ❌ | ❌ |
| Join Campaign | N/A | N/A | ✅ |
| Leave Campaign | ❌** | ✅ | N/A |
| Add to Vault | ✅ | ❌ | ❌ |
| Remove from Vault | ✅ | ❌ | ❌ |
| View Vault | ✅ | ✅ | ❌ |

*Via `join_campaign` command (anyone can join, but GM can invite)  
**GM cannot leave (would orphan campaign)

### Character Permissions

| Action | Owner | GM (in campaign) | Player (in campaign) | Public User | Other |
|--------|-------|------------------|---------------------|-------------|-------|
| View Character | ✅ | ✅ | ✅ | ✅* | ❌ |
| Edit Character | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete Character | ✅ | ❌ | ❌ | ❌ | ❌ |
| Assign to Campaign | ✅ | ✅** | ❌ | ❌ | ❌ |
| Remove from Campaign | ✅ | ✅** | ❌ | ❌ | ❌ |
| Claim Character | N/A | ❌ | ✅*** | ❌ | ❌ |
| Change Visibility | ✅ | ❌ | ❌ | ❌ | ❌ |

*Only if `visibility === 'public'`  
**GM can assign/remove any character to/from their campaign  
***Only if character is claimable and player doesn't have another character in campaign

### Homebrew Permissions

| Action | Owner | GM (in campaign) | Campaign Member | Public User | Other |
|--------|-------|------------------|-----------------|-------------|-------|
| View Homebrew | ✅ | ✅* | ✅* | ✅** | ❌ |
| Edit Homebrew | ✅ | ❌ | ❌ | ❌ | ❌ |
| Delete Homebrew | ✅ | ❌ | ❌ | ❌ | ❌ |
| Add to Vault | ✅*** | ✅ | ❌ | ❌ | ❌ |
| Remove from Vault | ❌ | ✅ | ❌ | ❌ | ❌ |
| Change Visibility | ✅ | ❌ | ❌ | ❌ | ❌ |
| Use in Character | ✅ | ✅* | ✅* | ✅** | ❌ |

*Only if homebrew is in campaign vault  
**Only if `visibility === 'public'`  
***Owner can add their homebrew to campaigns they're GM of

---

## Authentication & Authorization

### Authentication

**Provider**: Clerk (`svelte-clerk`)
- **Handler**: `src/hooks.server.ts` - `withClerkHandler()`
- **User ID**: Retrieved via `get_auth(event)` from `src/lib/remote/utils.ts`
- **Validation**: All remote functions require authentication (throws 401 if not authenticated)

### Authorization Patterns

**Permission Checks**:
- **Location**: `src/lib/remote/permissions.remote.ts`
- **Functions**:
  - `can_view_character(characterId)` - Returns boolean
  - `can_edit_character(characterId)` - Returns boolean
  - `can_view_homebrew({ homebrewType, homebrewId })` - Returns boolean
  - `can_edit_homebrew({ homebrewType, homebrewId })` - Returns boolean
  - `is_campaign_gm({ campaignId, userId? })` - Returns boolean
  - `is_campaign_member({ campaignId, userId? })` - Returns boolean
  - `has_character_in_campaign({ campaignId, userId? })` - Returns boolean
  - `can_claim_character({ characterId, campaignId })` - Returns boolean

**Route-Level Protection**:
- **Location**: `src/routes/(private)/campaigns/[id]/+layout.server.ts`
- **Check**: Verifies campaign membership before allowing access
- **Returns**: Role ('gm' | 'player') to client

**Command-Level Protection**:
- All write operations (commands) include permission checks
- Throws `error(403, ...)` if unauthorized
- Throws `error(404, ...)` if resource not found

---

## State Management

### Client-Side State (Svelte 5)

**Campaign State**: `src/lib/state/campaigns.svelte.ts`
- Uses Svelte 5 `$state` runes
- Manages: campaign, members, campaignState, characters, vaultItems
- Auto-loads on campaign ID change
- WebSocket connection for live updates
- Debounced auto-save for campaign name/description (300ms)

**Character State**: `src/lib/state/character.svelte.ts`
- Uses Svelte 5 `$state` runes
- Manages full character data and derived character
- Auto-saves on changes (debounced)

**Homebrew State**: `src/lib/state/homebrew.svelte.ts`
- Uses Svelte 5 `$state` runes
- Manages all homebrew collections
- Auto-saves on changes (debounced, 300ms)
- Uses `SvelteSet` for tracking in-flight saves

### Server-Side Caching

**SvelteKit Query/Command Pattern**:
- **Queries**: Read-only, automatically cached
- **Commands**: Write operations, invalidate related queries
- **Location**: `src/lib/remote/*.remote.ts`

**Query Refresh**:
- Commands call `.refresh()` on related queries after mutations
- Example: `get_user_campaigns().refresh()` after creating campaign

### KV Caching Strategy

**Write-Through Cache**:
- Data written to both D1 and KV simultaneously
- KV checked first on reads (fast path)
- Falls back to D1 if KV missing (handles eventual consistency)

**Cache Keys**:
- `campaign:{id}:state` - Campaign state
- `campaign:{id}:characters` - Campaign character summaries
- `character:{id}:public` - Public characters
- `homebrew:{type}:{id}:public` - Public homebrew

**Cache Invalidation**:
- KV updated immediately on writes
- KV removed when visibility changes from public to private
- KV updated when campaign character summaries change

---

## Key Files Reference

### Permissions
- `src/lib/remote/permissions.remote.ts` - All permission check functions

### Campaigns
- `src/lib/server/db/campaigns.schema.ts` - Database schema definitions
- `src/lib/remote/campaigns.remote.ts` - Remote functions (queries/commands)
- `src/lib/state/campaigns.svelte.ts` - Client-side state management
- `src/routes/(private)/campaigns/[id]/+layout.server.ts` - Route-level permission check
- `src/routes/api/campaigns/[id]/live/+server.ts` - WebSocket endpoint

### Characters
- `src/lib/server/db/characters.schema.ts` - Database schema definitions
- `src/lib/remote/characters.remote.ts` - Remote functions
- `src/lib/state/character.svelte.ts` - Client-side state management
- `src/routes/(private)/characters/[uid]/(edit)/+layout.svelte` - Edit route protection

### Homebrew
- `src/lib/server/db/homebrew.schema.ts` - Database schema definitions
- `src/lib/remote/homebrew/classes.remote.ts` - Class homebrew functions
- `src/lib/remote/homebrew/domains.remote.ts` - Domain homebrew functions
- `src/lib/remote/homebrew/equipment.remote.ts` - Equipment homebrew functions
- `src/lib/remote/homebrew/heritages.remote.ts` - Heritage homebrew functions
- `src/lib/remote/homebrew/beastforms.remote.ts` - Beastform homebrew functions
- `src/lib/remote/campaign-homebrew.remote.ts` - Campaign vault operations
- `src/lib/remote/homebrew-public.remote.ts` - Public homebrew access
- `src/lib/state/homebrew.svelte.ts` - Client-side state management

### Utilities
- `src/lib/remote/utils.ts` - Database, KV, R2 access helpers
- `src/hooks.server.ts` - Clerk authentication handler
- `src/app.d.ts` - TypeScript type definitions

### Types
- `src/lib/types/campaign-types.ts` - Campaign type definitions
- `src/lib/types/character-types.ts` - Character type definitions
- `src/lib/types/homebrew-types.ts` - Homebrew type definitions
- `src/lib/types/compendium-types.ts` - Compendium type definitions

---

## Important Notes

### D1 Eventual Consistency

The application uses KV as a write-through cache to work around D1's eventual consistency issues, especially for campaign state. The read pattern is:
1. Check KV first (fast, consistent)
2. If missing, read from D1
3. Write to KV (cache for next time)

### Live Sessions

During active campaign sessions, Durable Objects are the authoritative source for real-time state. Changes are persisted to D1 and KV asynchronously. The flow is:
1. Client sends update via WebSocket
2. Durable Object validates and updates
3. Durable Object broadcasts to all clients
4. Durable Object persists to D1 and KV (async)

### Public Content Caching

Public characters and homebrew are cached in KV for fast access without requiring authentication. The cache key pattern is:
- Characters: `character:{id}:public`
- Homebrew: `homebrew:{type}:{id}:public`

### Campaign Character Summaries

Campaign character data is cached in KV (`campaign:{id}:characters`) and updated whenever characters are assigned/removed/updated in a campaign. The summary includes:
- `id`, `name`, `image_url`
- `level`
- `marked_hp`, `marked_stress`, `marked_hope`, `marked_armor`
- `active_conditions`

### Auto-save

Client-side state management includes debounced auto-save functionality (300ms delay) for:
- Campaign name and description
- All homebrew collections
- Character data

### Visibility States

- **`private`**: Only owner and campaign members (if in campaign) can view
- **`public`**: Anyone can view (cached in KV for fast access)

### Claimable Characters

GMs can create characters and mark them as claimable (`claimable === 1`), allowing players to claim them. Once claimed:
- Ownership transfers to the claiming player (`clerk_user_id` updated)
- `claimable` flag set to 0
- Character can no longer be claimed

### Homebrew Campaign Association

Homebrew items can be associated with campaigns in two ways:
1. **Direct association**: `campaign_id` field in homebrew table (rare, legacy)
2. **Campaign vault**: Entry in `campaign_homebrew_vault_table` (preferred)

Campaign members can use vault items in their characters, but only the owner can edit the homebrew itself.

---

## Database Relationships

### Campaign → Members
- One-to-many via `campaign_members_table`
- Composite primary key: (`campaign_id`, `user_id`)

### Campaign → State
- One-to-one via `campaign_state_table`
- Primary key: `campaign_id`

### Campaign → Characters
- One-to-many via `characters_table.campaign_id`
- Characters can be in at most one campaign

### Campaign → Homebrew Vault
- One-to-many via `campaign_homebrew_vault_table`
- Many-to-many relationship (campaign can have many homebrew items, homebrew can be in many campaigns)

### User → Characters
- One-to-many via `characters_table.clerk_user_id`
- User owns characters

### User → Homebrew
- One-to-many via `homebrew_{type}.clerk_user_id`
- User owns homebrew items

### User → Campaigns
- Many-to-many via `campaign_members_table`
- User can be member of many campaigns
- User has role ('gm' | 'player') per campaign

---

## Error Handling

### Common Error Codes

- **401 Unauthorized**: User not authenticated
- **403 Forbidden**: User authenticated but lacks permission
- **404 Not Found**: Resource doesn't exist or user can't access it
- **500 Internal Server Error**: Server error

### Permission Check Failures

All permission checks throw errors:
- `can_view_*` functions throw 404 if resource not found, return false if no permission
- `can_edit_*` functions throw 404 if resource not found, return false if no permission
- Commands throw 403 if permission check fails

---

## Performance Considerations

### KV Caching

- KV is used as a write-through cache to improve read performance
- Reduces D1 read load for frequently accessed data
- Handles D1 eventual consistency issues

### Query Batching

- `get_user_campaigns()` batches queries to minimize D1 round trips
- Uses `inArray` for efficient batch queries
- Fetches related data (members, characters) in parallel

### WebSocket Updates

- Live campaign updates use WebSocket to avoid polling
- Durable Objects maintain state in memory for fast updates
- Changes broadcast to all connected clients immediately

### Auto-save Debouncing

- Client-side auto-save uses 300ms debounce to reduce write operations
- Tracks in-flight saves to prevent duplicate requests
- Only saves changed items (compares JSON strings)

---

*Last Updated: 2025-01-27*
*Documentation Version: 1.0*

