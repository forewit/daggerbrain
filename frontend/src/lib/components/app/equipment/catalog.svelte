<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { get_all_weapons, get_all_armor, get_all_consumables } from "$lib/ts/character/helpers";
  import type { Weapon, Armor, Consumable } from "$lib/ts/character/types";
  import WeaponDetails from "./weapon-details.svelte";
  import ArmorDetails from "./armor-details.svelte";
  import ConsumableDetails from "./consumable-details.svelte";
  import Dropdown from "../leveling/dropdown.svelte";
  import * as ButtonGroup from "$lib/components/ui/button-group";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";
  import Search from "@lucide/svelte/icons/search";

  let searchQuery = $state("");
  let typeFilter = $state<"Primary" | "Secondary" | "Armor" | "Consumables" | null>(null);
  let tierFilter = $state<"1" | "2" | "3" | "4" | null>(null);

  // Clear tier filter when consumables filter is selected (consumables don't have tiers)
  $effect(() => {
    if (typeFilter === "Consumables" && tierFilter !== null) {
      tierFilter = null;
    }
  });

  // Get all items
  let allWeapons = $derived(get_all_weapons());
  let allArmor = $derived(get_all_armor());
  let allConsumables = $derived(get_all_consumables());

  const context = getCharacterContext();
  let character = $derived(context.character);

  function addWeaponToInventory(weapon: Weapon) {
    if (!character) return;
    // Only add if not already in inventory
    if (!(weapon.id in character.inventory.weapons)) {
      character.inventory.weapons[weapon.id] = {
        quantity: 1,
        choices: {},
      };
    } else {
      character.inventory.weapons[weapon.id].quantity++;
    }
  }

  function addArmorToInventory(armor: Armor) {
    if (!character) return;
    // Only add if not already in inventory
    if (!(armor.id in character.inventory.armor)) {
      character.inventory.armor[armor.id] = {
        quantity: 1,
        choices: {},
      };
    } else {
      character.inventory.armor[armor.id].quantity++;
    }
  }

  function addConsumableToInventory(consumable: Consumable) {
    if (!character) return;
    // Only add if not already in inventory
    if (!(consumable.id in character.inventory.consumables)) {
      character.inventory.consumables[consumable.id] = {
        quantity: 1,
        choices: {},
      };
    } else {
      character.inventory.consumables[consumable.id].quantity++;
    }
  }

  // Helper function to strip HTML tags for search
  function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim();
  }

  // Helper function to check if item matches search
  function matchesSearch(item: Weapon | Armor | Consumable, query: string): boolean {
    if (!query) return true;
    const searchLower = query.toLowerCase();
    const titleMatch = item.title.toLowerCase().includes(searchLower);
    const descMatch = stripHtml(item.description_html).toLowerCase().includes(searchLower);
    return titleMatch || descMatch;
  }

  // Filter weapons
  let filteredWeapons = $derived(
    allWeapons.filter((weapon) => {
      // Search filter
      if (!matchesSearch(weapon, searchQuery)) return false;

      // Type filter - filter by category
      if (typeFilter === "Primary" && weapon.category !== "Primary") return false;
      if (typeFilter === "Secondary" && weapon.category !== "Secondary") return false;

      // Tier filter
      if (tierFilter !== null) {
        const weaponTier = context.get_tier_from_level(weapon.level_requirement);
        if (weaponTier !== tierFilter) return false;
      }

      return true;
    })
  );

  // Filter armor
  let filteredArmor = $derived(
    allArmor.filter((armor) => {
      // Search filter
      if (!matchesSearch(armor, searchQuery)) return false;

      // Tier filter
      if (tierFilter !== null) {
        const armorTier = context.get_tier_from_level(armor.level_requirement);
        if (armorTier !== tierFilter) return false;
      }

      return true;
    })
  );

  // Filter consumables (consumables don't have tier/level requirements)
  let filteredConsumables = $derived(
    allConsumables.filter((consumable) => {
      // Search filter
      if (!matchesSearch(consumable, searchQuery)) return false;
      return true;
    })
  );

  // Check if user has applied any filter or search
  let hasActiveFilter = $derived(
    searchQuery.trim() !== "" || typeFilter !== null || tierFilter !== null
  );

  // Combined filtered items based on type filter
  // Only show results if user has applied a filter or entered a search query
  let filteredItems = $derived.by(() => {
    // Don't show anything until user interacts (filter or search)
    if (!hasActiveFilter) {
      return [];
    }

    if (typeFilter === "Primary" || typeFilter === "Secondary") {
      return filteredWeapons.map((w) => ({ type: "weapon" as const, item: w }));
    } else if (typeFilter === "Armor") {
      return filteredArmor.map((a) => ({ type: "armor" as const, item: a }));
    } else if (typeFilter === "Consumables") {
      return filteredConsumables.map((c) => ({ type: "consumable" as const, item: c }));
    } else {
      // No type filter - combine all
      return [
        ...filteredWeapons.map((w) => ({ type: "weapon" as const, item: w })),
        ...filteredArmor.map((a) => ({ type: "armor" as const, item: a })),
        ...filteredConsumables.map((c) => ({ type: "consumable" as const, item: c })),
      ];
    }
  });
</script>

<div class="flex flex-col gap-4">
  <!-- Search and Filters -->
  <div class="flex flex-col gap-2">
    <div class="relative">
      <Search class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input bind:value={searchQuery} placeholder="Search items..." class="pl-9" />
    </div>

    <div class="flex gap-x-0.5 gap-y-2 flex-wrap">
      <!-- Type Filter Buttons -->
      <div class="flex gap-1 flex-wrap">
        <Button
          size="sm"
          variant={typeFilter === "Primary" ? "default" : "outline"}
          onclick={() => (typeFilter = typeFilter === "Primary" ? null : "Primary")}
        >
          Primary Weapons
        </Button>
        <Button
          size="sm"
          variant={typeFilter === "Secondary" ? "default" : "outline"}
          onclick={() => (typeFilter = typeFilter === "Secondary" ? null : "Secondary")}
        >
          Secondary Weapons
        </Button>
        <Button
          size="sm"
          variant={typeFilter === "Armor" ? "default" : "outline"}
          onclick={() => (typeFilter = typeFilter === "Armor" ? null : "Armor")}
        >
          Armor
        </Button>
        <Button
          size="sm"
          variant={typeFilter === "Consumables" ? "default" : "outline"}
          onclick={() => (typeFilter = typeFilter === "Consumables" ? null : "Consumables")}
        >
          Consumables
        </Button>
      </div>

      <!-- Tier Filter Buttons -->
      <div class="flex gap-1 flex-wrap">
        <Button
          size="sm"
          variant={tierFilter === "1" ? "default" : "outline"}
          disabled={typeFilter === "Consumables"}
          onclick={() => (tierFilter = tierFilter === "1" ? null : "1")}
        >
          Tier 1
        </Button>
        <Button
          size="sm"
          variant={tierFilter === "2" ? "default" : "outline"}
          disabled={typeFilter === "Consumables"}
          onclick={() => (tierFilter = tierFilter === "2" ? null : "2")}
        >
          Tier 2
        </Button>
        <Button
          size="sm"
          variant={tierFilter === "3" ? "default" : "outline"}
          disabled={typeFilter === "Consumables"}
          onclick={() => (tierFilter = tierFilter === "3" ? null : "3")}
        >
          Tier 3
        </Button>
        <Button
          size="sm"
          variant={tierFilter === "4" ? "default" : "outline"}
          disabled={typeFilter === "Consumables"}
          onclick={() => (tierFilter = tierFilter === "4" ? null : "4")}
        >
          Tier 4
        </Button>
      </div>
    </div>
  </div>

  <!-- Results -->
  <div class="flex flex-col gap-2">
    {#if !hasActiveFilter}
      <p class="text-sm text-muted-foreground text-center py-4">Search or use the filters above</p>
    {:else if filteredItems.length === 0}
      <p class="text-sm text-muted-foreground text-center py-4">No results</p>
    {:else}
      {#each filteredItems as entry (entry.item.id)}
        {#if entry.type === "weapon"}
          {#snippet subtitle_snippet()}
            <Button
              size="sm"
              onclick={(e) => {
                e.stopPropagation();
                addWeaponToInventory(entry.item);
              }}>Add</Button
            >
          {/snippet}

          {#snippet title_snippet()}
            <div class="text-left gap-4">
              <p class="text-md font-medium">{entry.item.title}</p>
              <p class="text-[10px] text-muted-foreground leading-none italic truncate">
                Tier {context.get_tier_from_level(entry.item.level_requirement)}
                {entry.item.category} Weapon
              </p>
            </div>
          {/snippet}

          <Dropdown {title_snippet} {subtitle_snippet} class="border-2">
            <WeaponDetails weapon={entry.item} />
          </Dropdown>
        {:else if entry.type === "armor"}
          {#snippet subtitle_snippet()}
            <Button
              size="sm"
              onclick={(e) => {
                e.stopPropagation();
                addArmorToInventory(entry.item);
              }}>Add</Button
            >
          {/snippet}

          {#snippet title_snippet()}
            <div class="text-left gap-4">
              <p class="text-md font-medium">{entry.item.title}</p>
              <p class="text-[10px] text-muted-foreground leading-none italic truncate">
                Tier {context.get_tier_from_level(entry.item.level_requirement)} Armor
              </p>
            </div>
          {/snippet}

          <Dropdown {title_snippet} {subtitle_snippet} class="border-2">
            <ArmorDetails armor={entry.item} />
          </Dropdown>
        {:else if entry.type === "consumable"}
          {#snippet subtitle_snippet()}
            <Button
              size="sm"
              onclick={(e) => {
                e.stopPropagation();
                addConsumableToInventory(entry.item);
              }}>Add</Button
            >
          {/snippet}

          {#snippet title_snippet()}
            <div class="text-left gap-4">
              <p class="text-md font-medium">{entry.item.title}</p>
            </div>
          {/snippet}

          <Dropdown {title_snippet} {subtitle_snippet} class="border-2">
            <ConsumableDetails consumable={entry.item} />
          </Dropdown>
        {/if}
      {/each}
    {/if}
  </div>
</div>
