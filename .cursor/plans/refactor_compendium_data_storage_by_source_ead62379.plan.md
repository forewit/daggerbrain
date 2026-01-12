---
name: Refactor Compendium Data Storage by Source
overview: Refactor compendium data storage from type-based KV keys (classes, subclasses, domains, etc.) to source-based keys (SRD, etc.), where each source contains all its compendium data types in a single KV entry. This will reduce KV reads and simplify the compendium state management.
todos:
  - id: update-seed-script
    content: Update seed.ts to group compendium data by source_id and create source-based KV entries
    status: pending
  - id: create-source-type
    content: Create SourceCompendiumData type definition for the new structure
    status: pending
  - id: update-classes-remote
    content: Update classes.remote.ts to fetch from source-based KV entries
    status: pending
  - id: update-domains-remote
    content: Update domains.remote.ts to fetch from source-based KV entries
    status: pending
  - id: update-equipment-remote
    content: Update equipment.remote.ts to fetch from source-based KV entries
    status: pending
  - id: update-heritages-remote
    content: Update heritages.remote.ts to fetch from source-based KV entries
    status: pending
  - id: update-beastforms-remote
    content: Update beastforms.remote.ts to fetch from source-based KV entries
    status: pending
  - id: simplify-compendium-state
    content: Simplify compendium.svelte.ts to fetch sources and extract types, reducing from 15+ KV reads to 1-2 reads
    status: pending
---

# Refactor Compendium Data Storage by Source

## Current Structure

- KV keys are organized by data type: `classes`, `subclasses`, `domains`, `primary-weapons`, `secondary-weapons`, `armor`, `consumables`, `loot`, `ancestry-cards`, `community-cards`, `transformation-cards`, `beastforms`, `sources`, and domain-specific cards like `arcana-cards`, `blade-cards`, etc.
- Each remote function makes a separate KV read for its type
- The compendium state makes many separate fetches and merges them

## New Structure

- KV keys will be organized by source: `source:SRD`, `source:Void 1.5`, etc.
- Each source entry contains all data types: `{ classes: {...}, subclasses: {...}, domains: {...}, ... }`
- Remote functions can fetch from a specific source or merge from all sources
- The compendium state can fetch all enabled sources in parallel and extract types

## Implementation Plan

### 1. Update Seeding Script (`daggerbrain/src/lib/scripts/seed.ts`)

**Current approach**: The `generateCompendiumJson()` function creates separate KV entries for each type.

**New approach**:

- Group all imported compendium data by `source_id`
- For each source, create a single object containing all types:
  ```typescript
  {
    classes: Record<string, CharacterClass>,
    subclasses: Record<string, Subclass>,
    domains: Record<string, Domain>,
    domain_cards: {
      arcana: Record<string, DomainCard>,
      blade: Record<string, DomainCard>,
      // ... other domains
    },
    primary_weapons: Record<string, Weapon>,
    secondary_weapons: Record<string, Weapon>,
    armor: Record<string, Armor>,
    consumables: Record<string, Consumable>,
    loot: Record<string, Loot>,
    beastforms: Record<string, Beastform>,
    ancestry_cards: Record<string, AncestryCard>,
    community_cards: Record<string, CommunityCard>,
    transformation_cards: Record<string, TransformationCard>
  }
  ```

- Store with key format: `source:${source_id}` (e.g., `source:SRD`)
- Keep `sources` as a separate entry (unchanged) since it's metadata about sources themselves

**Changes needed**:

- Modify `generateCompendiumJson()` to iterate through all imported data, group by `source_id`, and create source-based entries
- Handle domain cards specially since they're currently stored as separate entries per domain

### 2. Update Remote Functions

All remote functions in `daggerbrain/src/lib/remote/compendium/` need to be updated:

#### Files to update:

- `classes.remote.ts`
- `domains.remote.ts`
- `equipment.remote.ts`
- `heritages.remote.ts`
- `beastforms.remote.ts`
- `sources.remote.ts` (may not need changes)

#### Pattern for each function:

**Current**: `kv.get('classes', 'json')`

**New**:

- Add optional `source_id?: SourceIds` parameter
- If `source_id` provided: fetch `source:${source_id}` and extract the specific type
- If not provided: fetch all sources (currently just `source:SRD`), merge the type across all sources
- Helper function to fetch and merge from all sources:
  ```typescript
  async function fetchTypeFromAllSources<T>(
    kv: KVNamespace,
    typeKey: string,
    validator: (data: unknown) => T
  ): Promise<Record<string, T>>
  ```


**Specific changes**:

- `get_all_classes()` → fetch from `source:SRD` (or all sources), extract `classes`
- `get_all_subclasses()` → fetch from `source:SRD`, extract `subclasses`
- `get_all_domains()` → fetch from `source:SRD`, extract `domains`
- `get_domain_cards(domainId)` → fetch from `source:SRD`, extract `domain_cards[domainId]`
- `get_all_primary_weapons()` → fetch from `source:SRD`, extract `primary_weapons`
- `get_all_secondary_weapons()` → fetch from `source:SRD`, extract `secondary_weapons`
- `get_all_armor()` → fetch from `source:SRD`, extract `armor`
- `get_all_consumables()` → fetch from `source:SRD`, extract `consumables`
- `get_all_loot()` → fetch from `source:SRD`, extract `loot`
- `get_all_beastforms()` → fetch from `source:SRD`, extract `beastforms`
- `get_all_ancestry_cards()` → fetch from `source:SRD`, extract `ancestry_cards`
- `get_all_community_cards()` → fetch from `source:SRD`, extract `community_cards`
- `get_all_transformation_cards()` → fetch from `source:SRD`, extract `transformation_cards`

### 3. Simplify Compendium State (`daggerbrain/src/lib/state/compendium.svelte.ts`)

**Current complexity**:

- Makes 15+ separate `fetchWithRetry` calls (lines 219-278):
  - `get_all_ancestry_cards`
  - `get_all_community_cards`
  - `get_all_transformation_cards`
  - `get_all_beastforms`
  - `get_all_classes`
  - `get_all_subclasses`
  - `get_all_domains`
  - `get_all_primary_weapons`
  - `get_all_secondary_weapons`
  - `get_all_armor`
  - `get_all_loot`
  - `get_all_consumables`
  - `get_all_sources`
  - Plus 9 separate calls for domain cards (one per domain)
- Each call makes a separate KV read
- Each call has its own retry logic
- Total: ~15+ KV reads on initialization

**New simplified approach**:

- Create a single function `fetchSourceData(sourceId: SourceIds)` that fetches `source:${sourceId}` from KV
- Fetch all enabled sources in parallel (currently just `source:SRD` based on `source_whitelist`)
- Extract all types from the fetched source data in one pass
- Merge types across sources if multiple sources are enabled in the future
- This reduces from ~15+ separate KV reads to 1-2 reads (one per enabled source)

**Specific changes**:

- Replace lines 218-278 (all individual `fetchWithRetry` calls) with:
  ```typescript
  // Fetch all enabled sources in parallel
  const enabledSources = Array.from(source_whitelist);
  for (const sourceId of enabledSources) {
    fetchWithRetry(
      () => fetchSourceData(sourceId), // New helper that fetches source:${sourceId}
      (sourceData) => {
        // Extract all types from source data
        all_classes = { ...all_classes, ...sourceData.classes };
        all_subclasses = { ...all_subclasses, ...sourceData.subclasses };
        all_domains = { ...all_domains, ...sourceData.domains };
        all_domain_cards = mergeDomainCards(all_domain_cards, sourceData.domain_cards);
        all_primary_weapons = { ...all_primary_weapons, ...sourceData.primary_weapons };
        all_secondary_weapons = { ...all_secondary_weapons, ...sourceData.secondary_weapons };
        all_armor = { ...all_armor, ...sourceData.armor };
        all_loot = { ...all_loot, ...sourceData.loot };
        all_consumables = { ...all_consumables, ...sourceData.consumables };
        all_beastforms = { ...all_beastforms, ...sourceData.beastforms };
        all_ancestry_cards = { ...all_ancestry_cards, ...sourceData.ancestry_cards };
        all_community_cards = { ...all_community_cards, ...sourceData.community_cards };
        all_transformation_cards = { ...all_transformation_cards, ...sourceData.transformation_cards };
      }
    );
  }
  ```

- Remove the separate loop for domain cards (lines 259-278) - they're now included in source data
- Keep `get_all_sources()` call separate (sources metadata is still stored separately)
- The filtering by `source_whitelist` in derived values (lines 282-392) can be simplified or removed since we only fetch whitelisted sources
- The `$effect` hooks for merging homebrew (lines 81-194) can remain largely the same

**Result**:

- From ~15+ KV reads to 1-2 reads (one per enabled source)
- From ~15+ separate async operations to 1-2 parallel operations
- Much simpler initialization logic
- Easier to add new sources in the future

### 4. Type Definitions

Create a type for the source data structure:

```typescript
type SourceCompendiumData = {
  classes: Record<string, CharacterClass>;
  subclasses: Record<string, Subclass>;
  domains: Record<string, Domain>;
  domain_cards: Record<DomainIds, Record<string, DomainCard>>;
  primary_weapons: Record<string, Weapon>;
  secondary_weapons: Record<string, Weapon>;
  armor: Record<string, Armor>;
  consumables: Record<string, Consumable>;
  loot: Record<string, Loot>;
  beastforms: Record<string, Beastform>;
  ancestry_cards: Record<string, AncestryCard>;
  community_cards: Record<string, CommunityCard>;
  transformation_cards: Record<string, TransformationCard>;
};
```

## Benefits

1. **Reduced KV reads**: From 15+ reads to 1-2 reads (one per enabled source)
2. **Simpler state management**: Fetch sources once, extract types
3. **Better scalability**: Adding new sources is just adding another KV entry
4. **Atomic source updates**: All data for a source updates together
5. **Easier source filtering**: Can enable/disable entire sources at once

## Migration Notes

- This is a breaking change for KV structure
- Old KV entries (type-based) should be removed after migration
- The seeding script will need to be run to populate new structure
- All existing compendium data files remain unchanged (they're still organized by type, just grouped by source during seeding)