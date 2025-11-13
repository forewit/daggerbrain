<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { get_all_weapons, get_all_armor } from "$lib/ts/character/helpers";
  import type { Weapon, Armor } from "$lib/ts/character/types";
  import WeaponDetails from "./weapon-details.svelte";
  import ArmorDetails from "./armor-details.svelte";
  import Dropdown from "../leveling/dropdown.svelte";
  import * as ButtonGroup from "$lib/components/ui/button-group";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";

  let searchQuery = $state("");
  let typeFilter = $state<"Primary" | "Secondary" | "Armor" | null>(null);
  let tierFilter = $state<"1" | "2" | "3" | "4" | null>(null);

  // Get all items
  let allWeapons = $derived(get_all_weapons());
  let allArmor = $derived(get_all_armor());

  const context = getCharacterContext();
  let character = $derived(context.character);

  function addWeaponToInventory(weapon: Weapon) {
    if (!character) return;
    // Only add if not already in inventory
    if (!(weapon.id in character.inventory.weapons)) {
      character.inventory.weapons[weapon.id] = {
        weapon_id: weapon.id,
        choices: {
          trait: null,
          damage_type: null,
        },
      };
    }
  }

  function addArmorToInventory(armor: Armor) {
    if (!character) return;
    // Only add if not already in inventory
    if (!(armor.id in character.inventory.armor)) {
      character.inventory.armor[armor.id] = {
        armor_id: armor.id,
      };
    }
  }

  // Helper function to strip HTML tags for search
  function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim();
  }

  // Helper function to check if item matches search
  function matchesSearch(item: Weapon | Armor, query: string): boolean {
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
    } else {
      // No type filter - combine both
      return [
        ...filteredWeapons.map((w) => ({ type: "weapon" as const, item: w })),
        ...filteredArmor.map((a) => ({ type: "armor" as const, item: a })),
      ];
    }
  });
</script>

<div class="flex flex-col gap-4">
  <!-- Search and Filters -->
  <div class="flex flex-col gap-2">
    <Input bind:value={searchQuery} placeholder="Search items..." />

    <div class="flex gap-x-0.5 gap-y-2 flex-wrap">
      <!-- Type Filter Buttons -->
      <div class="flex gap-1">
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
      </div>

      <div class="grow"></div>
      <!-- Tier Filter Buttons -->
      <div class="flex gap-1">
        <Button
          size="sm"
          variant={tierFilter === "1" ? "default" : "outline"}
          onclick={() => (tierFilter = tierFilter === "1" ? null : "1")}
        >
          Tier 1
        </Button>
        <Button
          size="sm"
          variant={tierFilter === "2" ? "default" : "outline"}
          onclick={() => (tierFilter = tierFilter === "2" ? null : "2")}
        >
          Tier 2
        </Button>
        <Button
          size="sm"
          variant={tierFilter === "3" ? "default" : "outline"}
          onclick={() => (tierFilter = tierFilter === "3" ? null : "3")}
        >
          Tier 3
        </Button>
        <Button
          size="sm"
          variant={tierFilter === "4" ? "default" : "outline"}
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
      {#each filteredItems as entry}
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
        {:else}
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
        {/if}
      {/each}
    {/if}
  </div>
</div>
