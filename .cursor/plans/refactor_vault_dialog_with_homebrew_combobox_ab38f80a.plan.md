---
name: ""
overview: ""
todos: []
---

# Refactor Add Homebrew to Vault Dialog

## Overview

Replace the two-step selection (type dropdown + item select) with a single searchable combobox that shows all homebrew items grouped by type, similar to `template-combobox.svelte` but searching the user's homebrew collection.

## Changes

### 1. Create New Component: `homebrew-items-combobox.svelte`

Create `daggerbrain/src/lib/components/app/campaigns/homebrew-items-combobox.svelte`:

- Similar structure to `template-combobox.svelte` but searches homebrew context instead of compendium
- Uses `Command.Root` with `Command.Input` for search functionality
- Groups items by homebrew type (weapon, armor, loot, etc.)
- Each group header includes the appropriate icon (Swords, Shield, PawPrint, etc.)
- Uses `Select.Root` wrapper like template-combobox
- Accepts props: `value` (bindable string), `disabled`
- Returns value as `${type}:${id}` format (e.g., "weapon:abc123") to encode both type and ID
- Internal items stored as `{id: string, name: string, type: HomebrewType}`

### 2. Update `campaign-vault.svelte`

- Remove the type dropdown section entirely
- Remove `selectedHomebrewType` state variable
- Replace the item select with the new `HomebrewItemsCombobox` component
- Change `selectedHomebrewId` to `selectedItem` (string in format `${type}:${id}`)
- Update `handleAddToVault` to parse the value: split by `:` to get `[type, id]`
- Simplify dialog - single combobox replaces both dropdowns

### 3. Implementation Details

**HomebrewItemsCombobox:**

- Derive all homebrew items from `HOMEBREW_TYPE_CONFIG` 
- Group by homebrew type (weapon, armor, loot, etc.)
- Each group header shows icon + type name (e.g., "⚔️ Weapon", "🛡️ Armor")
- Sort items alphabetically within each group
- For weapons, combine primary and secondary into one "Weapon" group
- For domain-cards, keep flat (all domain cards in one "Domain Card" group)
- Use icons from Create New Homebrew dialog (Swords, Shield, PawPrint, etc.)
- Search should match item names across all types
- Value format: `${type}:${id}` (e.g., "weapon:abc123", "armor:xyz789")

**Dialog Updates:**

- Remove `selectedHomebrewType` state
- The combobox value will be a string ID, but we need to determine the type
- Option A: Store items with both id and type in the combobox, return object
- Option B: Look up type from ID when needed (less efficient)
- Recommend Option A: modify combobox to work with `{id: string, type: HomebrewType}` objects

## Files to Modify

1. Create: `daggerbrain/src/lib/components/app/campaigns/homebrew-items-combobox.svelte`
2. Modify: `daggerbrain/src/lib/components/app/campaigns/campaign-vault.svelte`

## Icons Needed

Import the same icons used in Create New Homebrew dialog:

- Swords (weapon)
- Shield (armor)  
- PawPrint (beastform)
- Loot icon (loot)
- FlaskConical (consumable)
- GraduationCap (class)
- BookOpen (subclass)
- Card icon (all card types)