# Campaign Client Docs

This document explains campaign behavior from a client perspective: permissions, data shape, and when to call each campaign function.

## Data model (client-relevant)

A campaign is stored in `campaigns` and linked to users/characters through join tables:

- `campaigns`
  - `name`
  - `fear_track`
  - `countdowns`
  - `homebrew_vault` (references to homebrew compendium items)
  - optional: `fear_visible_to_players`, `public_notes`, `private_notes`, `current_encounter_id`
- `campaign_membership`
  - one row per user in a campaign
  - fields: `campaign_id`, `clerk_id`, `role` (`GM` | `Player`), `display_name`
- `campaign_invite_codes`
  - active join code for a campaign (`campaign_id`, `code`)
- `campaign_characters`
  - links characters to campaign and claim state
  - fields: `campaign_id`, `character_id`, optional `clerk_id`, `status` (`active` | `unclaimed`)

## Permissions model

Permissions are resolved server-side via campaign membership:

- Non-members: no access
- `GM`:
  - considered campaign owner (`isOwner = true`)
  - can edit campaign (`canEdit = true`)
  - can update campaign, remove campaign, rotate invite code, add/remove any campaign character
  - cannot use player-only character claim/unassign flow
- `Player`:
  - member access (`isOwner = false`, `canEdit = false`)
  - can read campaign data
  - can join/leave campaign
  - can add/remove their own characters
  - can claim one unclaimed campaign character at a time, and can unassign their claimed character

## Functions and when to call

### Read

- `campaigns.get({ id })`
  - Call when opening a campaign page.
  - Returns campaign access info (including `canEdit`/`isOwner`) plus resolved homebrew `compendium` entries from `homebrew_vault`.
  - Returns `null` if user is unauthenticated, campaign missing, or user is not a member.

### Campaign lifecycle

- `campaigns.add({ name, display_name })`
  - Call when creating a new campaign.
  - Creates campaign with defaults, creates GM membership for caller, generates invite code, and links campaign to user.
  - Returns new `campaignId`.

- `campaigns.update({ id, ...CampaignSchemaFields })`
  - Call when GM saves campaign settings/content.
  - Requires GM edit permissions.
  - Patches full campaign payload shape (same fields as campaign schema).

- `campaigns.remove({ id })`
  - Call when GM deletes a campaign permanently.
  - Removes memberships, invite codes, campaign-character links, user campaign links, then deletes campaign.

- `campaigns.leave({ id })`
  - Call when a player leaves a campaign.
  - Removes their membership and their character links in that campaign.
  - GMs cannot leave; they must delete the campaign.

### Joining and invite codes

- `campaigns.join({ invite_code, display_name })`
  - Call from invite-join UI.
  - Adds caller as `Player` membership and links campaign to user.
  - Returns `campaignId`.

- `campaigns.generateInviteCode({ campaign_id })`
  - Call when GM wants to rotate/regenerate an invite code.
  - Replaces existing campaign invite code with a newly generated unique code.

### Campaign character management

- `campaigns.addCharacter({ campaign_id, character_id })`
  - Call to add an existing owned character to campaign.
  - GM adds as `unclaimed`; player adds as `active` (claimed by self).
  - Enforces character not already in another campaign.
  - For players, enforces one claimed character in that campaign.

- `campaigns.removeCharacter({ campaign_id, character_id })`
  - Call to remove a character from campaign roster.
  - GM can remove any; player can remove only characters they own.
  - Unlinks `characters.campaign_id` and deletes campaign-character mapping.

- `campaigns.claimCharacter({ campaign_id, character_id })`
  - Player-only: call to claim a GM-added `unclaimed` character.
  - Enforces one claimed character per player per campaign.
  - Transfers character ownership to claiming player and updates user character counts (subject to global character limit).

- `campaigns.unassignCharacter({ campaign_id, character_id })`
  - Player-only: call to release a currently claimed campaign character back to `unclaimed`.
  - Does not remove character from campaign; it only clears claim state.

## Suggested client flow

1. Create campaign with `add`, then route to campaign page.
2. On page load, call `get` and drive UI from returned `canEdit` / `isOwner`.
3. Show GM-only controls (`update`, `generateInviteCode`, `remove`) only when authorized.
4. Use `join` for invite onboarding.
5. For roster actions, use `addCharacter`/`removeCharacter` for placement, and `claimCharacter`/`unassignCharacter` for player claim state transitions.
