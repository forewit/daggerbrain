<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { get_all_weapons, get_all_armor } from "$lib/ts/character/helpers";
  import type { Weapon, Armor } from "$lib/ts/character/types";
  import WeaponDetails from "./weapon-details.svelte";
  import ArmorDetails from "./armor-details.svelte";

  let searchQuery = $state("");
  let typeFilter = $state<"Primary" | "Secondary" | "Armor" | null>(null);
  let tierFilter = $state<"1" | "2" | "3" | "4" | null>(null);

  // Get all items
  let allWeapons = $derived(get_all_weapons());
  let allArmor = $derived(get_all_armor());

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

  // Helper function to get tier from level requirement
  function getTier(levelRequirement: number): "1" | "2" | "3" | "4" {
    if (levelRequirement === 1) return "1";
    if (levelRequirement >= 2 && levelRequirement <= 4) return "2";
    if (levelRequirement >= 5 && levelRequirement <= 7) return "3";
    return "4";
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
        const weaponTier = getTier(weapon.level_requirement);
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
        const armorTier = getTier(armor.level_requirement);
        if (armorTier !== tierFilter) return false;
      }

      return true;
    })
  );

  // Combined filtered items based on type filter
  let filteredItems = $derived.by(() => {
    if (typeFilter === "Primary" || typeFilter === "Secondary") {
      return filteredWeapons.map((w) => ({ type: "weapon" as const, item: w }));
    } else if (typeFilter === "Armor") {
      return filteredArmor.map((a) => ({ type: "armor" as const, item: a }));
    } else {
      // No filter - combine both
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

    <div class="flex gap-2 flex-wrap">
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
    {#each filteredItems as entry (entry.item.id)}
      {#if entry.type === "weapon"}
        <WeaponDetails weapon={entry.item} />
      {:else}
        <ArmorDetails armor={entry.item} />
      {/if}
    {/each}
  </div>
</div>
