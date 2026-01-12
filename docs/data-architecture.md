# Data Architecture

## Where Data Lives

### Database (D1 - SQLite)
- **Primary Storage**: Cloudflare D1 (SQLite database)
- **Schema Files**: `src/lib/server/db/`
  - `characters.schema.ts` - Character data, settings, choices, inventory
  - `campaigns.schema.ts` - Campaigns, members, state, characters join table, homebrew vault
  - `users.schema.ts` - User preferences (dismissed popups)
  - `homebrew.schema.ts` - User-created content (classes, weapons, armor, etc.)
- **Migrations**: `drizzle/` directory

### Storage (R2)
- **Images**: `R2_IMAGES` bucket - compendium images
- **User Content**: `R2_USERCONTENT` bucket - user-uploaded images

### State Management
- **Client State**: `src/lib/state/*.svelte.ts` - Reactive state using Svelte runes
- **Types**: `src/lib/types/` - TypeScript type definitions

## Permissions Patterns

### Character Permissions
**File**: `src/lib/remote/permissions.remote.ts` → `getCharacterAccess()`

- **Owner**: Full access (canView: true, canEdit: true)
  - Character's `clerk_user_id` matches current user
- **Campaign Member**: View access, edit only if GM
  - Character is in a campaign (`campaign_id` set)
  - User is a member of that campaign
  - If role is 'gm': canEdit = true, else canEdit = false
- **No Access**: canView: false, canEdit: false
  - Not owner and not a campaign member

**Character Claiming**: `getClaimCharacterAccess()`
- Character must be in the campaign
- `campaign_characters_table.claimable = 1`
- User must be a campaign member with role 'player' (not 'gm')
- User must not already have a non-claimable character in the campaign

### Campaign Permissions
**File**: `src/lib/remote/permissions.remote.ts` → `getCampaignAccess()`

- **GM**: Full access (canView: true, canEdit: true)
  - User is in `campaign_members_table` with role 'gm'
- **Player**: View access only (canView: true, canEdit: false)
  - User is in `campaign_members_table` with role 'player'
- **No Access**: canView: false, canEdit: false
  - User is not in `campaign_members_table`

### Homebrew Permissions
**File**: `src/lib/remote/permissions.remote.ts` → `getHomebrewAccess()`

- **Owner**: Full access (canView: true, canEdit: true)
  - Homebrew item's `clerk_user_id` matches current user
- **Campaign Member**: View only (canView: true, canEdit: false)
  - Homebrew item has `campaign_id` set
  - User is a member of that campaign
  - Only owner can edit, even in campaigns
- **No Access**: canView: false, canEdit: false
  - Not owner and not a campaign member

**Homebrew Types**: classes, subclasses, domains, domain_cards, primary_weapons, secondary_weapons, armor, loot, consumables, ancestry_cards, community_cards, transformation_cards, beastforms

### Permission Implementation
- **Remote Functions**: `src/lib/remote/permissions.remote.ts` - Permission queries (use `query()`)
- **Server Helpers**: `src/lib/server/permissions.ts` - Internal helpers for use within commands
- **Types**: `src/lib/types/permissions-types.ts` - Permission return types

## Campaign Data Sync (D1 + Durable Objects)

### Architecture
**D1 is the source of truth** - all data is persisted to D1 first, then synced to Durable Objects for real-time updates.

### Data Flow

1. **Client saves to D1**: State management calls remote `command()` which writes to D1
2. **Notify Durable Object**: After D1 write, remote function calls `notifyDurableObject()` 
   - Gets DO instance: `event.platform.env.CAMPAIGN_LIVE.idFromName(campaignId)`
   - Sends POST to `https://do-internal/notify` with update type and data
3. **DO broadcasts**: Durable Object updates in-memory cache and broadcasts to all connected WebSocket clients
4. **Clients receive updates**: WebSocket messages trigger state updates in `campaigns.svelte.ts`

### Durable Object State
**File**: `campaigns-do/src/campaign-live.ts` (separate worker)

- **In-memory only** (not persisted to DO storage)
- Maintains: `campaignState`, `characters` (Record<string, CampaignCharacterSummary>), `characterClaimable`, `version` counter
- **Version tracking**: Increments on each update to detect stale clients on reconnect
- **Reconnect handling**: If client's `lastKnownVersion < DO.version`, client must refresh from D1

### WebSocket Connection
**Endpoint**: `/api/campaigns/[id]/live` → forwards to Durable Object

- **Authentication**: Checks campaign membership via `getCampaignAccess()`
- **Headers**: Passes `X-User-Id` and `X-User-Role` to DO
- **Messages**: 
  - Client → DO: `rejoin`, `update_state`, `update_character`
  - DO → Client: `connected`, `state_update`, `character_added`, `character_diff_update`, `character_removed`, `refresh_required`

### Update Types
- **Character updates**: Partial `CampaignCharacterSummary` (marked_hp, marked_stress, marked_hope, marked_armor, active_conditions, name, level, image_url, derived_character_summary)
- **State updates**: `CampaignState` (fear_track, fear_visible_to_players, notes, countdowns)
- **Character added/removed**: Full character summary or characterId

### State Management Integration
**File**: `src/lib/state/campaigns.svelte.ts`

- Creates WebSocket connection via `createCampaignLiveConnection()`
- Handles reconnection with exponential backoff
- Merges WebSocket updates into local state using `deepMerge()`
- On `refresh_required`, reloads from D1 via remote functions

## File Structure

### State Management Files
- **`user.svelte.ts`**: User data, owned characters, owned campaigns, auto-save preferences
- **`character.svelte.ts`**: Single character state, derived calculations, permissions
- **`campaigns.svelte.ts`**: Campaign state, members, characters, live WebSocket connection
- **`homebrew.svelte.ts`**: User-created homebrew items (all types)
- **`compendium.svelte.ts`**: Base compendium data + homebrew + campaign homebrew, source filtering

### Types
**Location**: `src/lib/types/`

- `character-types.ts` - Character data structures
- `campaign-types.ts` - Campaign, members, state, character summaries
- `compendium-types.ts` - All compendium item types
- `homebrew-types.ts` - Homebrew type definitions
- `permissions-types.ts` - Permission return types
- `user-types.ts` - User data structures
- `rule-types.ts` - Game rules and choices
- `derived-character-types.ts` - Computed character properties

### Remote Functions
**Location**: `src/lib/remote/`

- `characters.remote.ts` - Character CRUD, notifies DO on updates
- `campaigns/campaigns.remote.ts` - Campaign CRUD, members, state, notifies DO
- `campaigns/campaign-homebrew.remote.ts` - Campaign vault operations
- `permissions.remote.ts` - Permission queries
- `homebrew/*.remote.ts` - Homebrew CRUD by category
- `compendium/*.remote.ts` - Read-only compendium queries
- `users.remote.ts` - User preferences
- `images.remote.ts` - Image uploads

### Database Schema
**Location**: `src/lib/server/db/`

- `schema.ts` - Exports all schemas
- Each schema file exports: table definition, select schema, insert schema, update schema
