---
name: Premium Character Slots Feature
overview: Implement premium feature gating for character slots using Clerk's billing features. Users without the 'unlimited_slots' feature will be limited to 3 active characters, with UI to manage slots and route protection to prevent unauthorized access.
todos:
  - id: add-auth-helpers
    content: Add helper functions in utils.ts to access auth object and check unlimited_slots feature flag
    status: pending
  - id: update-character-queries
    content: Modify get_all_characters to filter by active slots when user lacks unlimited_slots feature
    status: pending
  - id: create-user-remote-functions
    content: Create users.remote.ts with update_character_slots command to manage user slot assignments
    status: pending
  - id: restrict-character-creation
    content: Add check in create_character to prevent creation when user has 3 active slots and no unlimited_slots feature
    status: pending
  - id: update-characters-page-ui
    content: Update characters list page to show active characters only, add Manage Active Characters button, disable New Character when at limit, and add visual badges
    status: pending
  - id: create-manage-slots-dialog
    content: Create manage-character-slots.svelte dialog component similar to conditions-content.svelte for selecting up to 3 active characters
    status: pending
  - id: add-route-protection
    content: Create +layout.server.ts for character detail pages to check access based on feature flag and active slots
    status: pending
  - id: create-error-page
    content: Create +error.svelte page for unauthorized character access attempts
    status: pending
  - id: update-user-context
    content: Add feature flag and active slots state to user.svelte.ts context
    status: pending
---

# Premium Character Slots Feature Implementation

## Overview

Implement feature flag checking using Clerk's `has()` function to gate the `unlimited_slots` feature. Users without this feature will be limited to 3 active characters stored in the `users_table` columns (`character_slot_1`, `character_slot_2`, `character_slot_3`).

## Implementation Steps

### 1. Server-side Feature Flag Checking

- **File**: `daggerbrain/src/lib/remote/utils.ts`
- Add helper function `get_auth()` to return the auth object from `event.locals.auth()` for use with `has()` method
- Add helper function `has_unlimited_slots(event)` that checks `user.has({ feature: 'unlimited_slots' })`

### 2. Add User Slot Query

- **File**: `daggerbrain/src/lib/remote/users.remote.ts` (new file)
- Add query `get_user_slots()` to fetch the user's current active character slots from `users_table`
- Note: `get_all_characters()` remains unchanged and returns all user characters (filtering happens in UI)

### 3. Create User Slot Management Remote Functions

- **File**: `daggerbrain/src/lib/remote/users.remote.ts` (new file)
- Create `update_character_slots` command that:
- Takes an array of up to 3 character IDs
- Validates the character IDs belong to the user
- Updates `users_table` with the new slot assignments
- Returns success/error

### 4. Gate Character Creation and Updates

- **File**: `daggerbrain/src/lib/remote/characters.remote.ts`
- Modify `create_character()` to:
- Check for `unlimited_slots` feature flag
- If user doesn't have feature: check if they already have 3 active slots in `users_table`
- If at limit: throw an error preventing character creation
- If not at limit: proceed with creation
- Modify `update_character()` to:
- Check for `unlimited_slots` feature flag
- If user doesn't have feature: verify the character ID is in one of their active slots (`character_slot_1`, `character_slot_2`, `character_slot_3`)
- If character is not in active slots: throw an error preventing update
- If character is in active slots or user has feature: proceed with update

### 5. Update Characters List Page UI

- **File**: `daggerbrain/src/routes/(private)/characters/+page.svelte`
- Add feature flag check and active slots query (via new query or server load)
- Client-side filtering logic:
- If has `unlimited_slots`: 
- Show all characters from `get_all_characters()` normally (current behavior)
- "New Character" button always enabled
- If doesn't have `unlimited_slots`: 
- Filter `user.all_characters` to show only characters matching active slots (character_slot_1, character_slot_2, character_slot_3)
- Add visual badges/indicators showing which characters are "active"
- Add "Manage Active Characters" button below the character grid
- Disable "New Character" button if user has 3 active slots
- Show message/indicator when at limit
- Note: `get_all_characters()` returns all characters; filtering happens in UI

### 6. Create Manage Active Characters Dialog

- **File**: `daggerbrain/src/lib/components/app/manage-character-slots.svelte` (new file)
- Similar structure to `conditions-content.svelte` with collapsible items
- Display all user's characters with checkboxes/selection indicators
- Show which characters are currently active (3 max)
- Allow selecting/deselecting characters (swap behavior when selecting 4th)
- Show count of selected characters (X/3)
- Save button that calls `update_character_slots` remote function
- Close button/cancel functionality

### 7. Add Route Protection

- **File**: `daggerbrain/src/routes/(private)/characters/[uid]/+layout.server.ts` (new file)
- Create server load function that:
- Gets the character ID from params
- Checks for `unlimited_slots` feature flag
- If user has feature: allow access (return data normally)
- If user doesn't have feature: 
- Query `users_table` to check if character ID is in one of the 3 slots
- If not in slots: throw error (404 or 403)
- If in slots: allow access

### 8. Create Error Page for Unauthorized Access

- **File**: `daggerbrain/src/routes/(private)/characters/[uid]/+error.svelte` (new file)
- Display error message explaining the character is not in their active slots
- Provide link back to characters list page
- Optionally suggest upgrading to premium

### 9. Update User Context State

- **File**: `daggerbrain/src/lib/state/user.svelte.ts`
- Add query/state for checking `unlimited_slots` feature flag
- Add query for user's active slots
- Expose these to components that need them

## Key Files to Modify/Create

**Modify:**

- `daggerbrain/src/lib/remote/utils.ts` - Add auth helpers
- `daggerbrain/src/lib/remote/characters.remote.ts` - Update queries and creation logic
- `daggerbrain/src/routes/(private)/characters/+page.svelte` - Update UI with feature gating
- `daggerbrain/src/lib/state/user.svelte.ts` - Add feature flag state

**Create:**

- `daggerbrain/src/lib/remote/users.remote.ts` - User slot management functions
- `daggerbrain/src/lib/components/app/manage-character-slots.svelte` - Dialog component
- `daggerbrain/src/routes/(private)/characters/[uid]/+layout.server.ts` - Route protection
- `daggerbrain/src/routes/(private)/characters/[uid]/+error.svelte` - Error page

## Notes

- The `has()` method is available on `event.locals.auth()` which returns an auth object
- Character slot columns in `users_table` are: `character_slot_1`, `character_slot_2`, `character_slot_3`
- Maximum of 3 active slots for non-premium users
- Dialog should show all characters, not just inactive ones
- Visual badges should indicate active status