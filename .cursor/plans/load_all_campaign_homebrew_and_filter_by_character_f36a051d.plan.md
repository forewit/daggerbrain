# Load All Campaign Homebrew and Filter by Character Campaign

## Overview
Currently, the compendium loads campaign homebrew reactively from the character context (only for the current character's campaign). We need to:
1. Load homebrew from ALL campaigns the user is a member of (from user context)
2. Store items organized by campaign ID in the compendium
3. Support loading multiple campaigns (not just the current character's)

## Architecture Decision

**Minimal change approach:** Replace the reactive effect that watches character context with an explicit `load_campaign_homebrew(campaignId)` function. This:
- Eliminates circular dependency (compendium doesn't need character context)
- Character context calls the function when needed (already implemented at line 546)
- Supports loading multiple campaigns by calling the function multiple times
- Minimal changes to existing architecture

## Changes Required

### 1. Update `compendium.svelte.ts`

**Current behavior (lines 394-483):**
- Loads campaign homebrew reactively from character context (lines 410-452)
- Only loads for the current character's campaign
- Stores in single `campaign_homebrew` state
- Merges directly into `all_*` collections

**New behavior:**
- Remove reactive effect that watches character context (lines 410-452)
- Replace `campaign_homebrew` (single campaign) with `all_campaign_homebrew: Record<string, CampaignHomebrew>` (multiple campaigns)
- Expose `load_campaign_homebrew(campaignId: string)` function
- Function loads homebrew for a specific campaign and stores it in the map
- Update merge logic to merge all campaigns from the map into `all_*` collections
- Remove `getCharacterContext()` import and usage

**Key changes:**
- Change `campaign_homebrew` from single object to `all_campaign_homebrew: Record<string, CampaignHomebrew>`
- Replace reactive `$effect` with explicit `load_campaign_homebrew` function
- Function should:
  - Check if campaign already loaded (avoid duplicate loads)
  - Fetch homebrew items for the campaign
  - Store in `all_campaign_homebrew[campaignId]`
  - Trigger merge effect to update `all_*` collections
- Update merge effect (lines 454-483) to iterate over all campaigns in the map

### 2. Update `character.svelte.ts`

**Current behavior:**
- Already calls `compendium.load_campaign_homebrew(character.campaign_id)` at line 546
- This is correct and should continue to work

**No changes needed** - the character context already triggers loading via the function call.

### 3. Loading Multiple Campaigns

**Future enhancement:** To load ALL campaigns the user has access to:
- Can add logic in user context or layout to call `load_campaign_homebrew` for each campaign in `user.all_campaigns`
- Or add a `load_all_campaigns_homebrew()` function that iterates over `user.all_campaigns`
- For now, character context loads its own campaign (minimal change approach)

**Note:** The function-based approach allows incremental loading - campaigns are loaded on-demand when characters are viewed.

## Files to Modify

1. **[daggerbrain/src/lib/state/compendium.svelte.ts](daggerbrain/src/lib/state/compendium.svelte.ts)**
   - Remove `getCharacterContext()` import (line 37)
   - Remove reactive effect that watches character context (lines 410-452)
   - Change `campaign_homebrew` to `all_campaign_homebrew: Record<string, CampaignHomebrew>` (line 395)
   - Add `load_campaign_homebrew(campaignId: string)` function
   - Update merge effect (lines 454-483) to iterate over all campaigns in the map
   - Expose `load_campaign_homebrew` function in return object

2. **[daggerbrain/src/lib/state/character.svelte.ts](daggerbrain/src/lib/state/character.svelte.ts)**
   - No changes needed - already calls `compendium.load_campaign_homebrew(character.campaign_id)` at line 546

## Implementation Details

### Compendium Structure
```typescript
let all_campaign_homebrew = $state<Record<string, CampaignHomebrew>>({});
```

### Loading Function
```typescript
function load_campaign_homebrew(campaignId: string) {
  // Skip if already loaded
  if (all_campaign_homebrew[campaignId]) return;
  
  // Fetch and store
  get_campaign_homebrew_items(campaignId)
    .then((items) => {
      all_campaign_homebrew[campaignId] = {
        primary_weapons: items.primary_weapons || {},
        // ... other types
      };
      // Merge effect will automatically update all_* collections
    })
    .catch((err) => {
      console.error('Failed to load campaign homebrew:', err);
    });
}
```

### Merge Logic Update
The existing merge effect (lines 454-483) needs to iterate over all campaigns:
```typescript
$effect(() => {
  // Merge all campaigns from the map
  for (const campaignId in all_campaign_homebrew) {
    const campaign = all_campaign_homebrew[campaignId];
    // Merge each campaign's items into all_* collections
  }
});
```

### Backward Compatibility
- All existing code using `compendium.*` collections will continue to work
- Items from all loaded campaigns will be available
- No breaking changes to the API

## Testing Considerations

- Verify `load_campaign_homebrew` function loads and stores campaign homebrew
- Verify multiple campaigns can be loaded (call function multiple times)
- Verify merge effect correctly combines all loaded campaigns
- Verify character context triggers loading correctly
- Verify components using compendium still work (backward compatibility)
- Verify no duplicate loads when function called multiple times for same campaign
