<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import type { Weapon, Armor, Consumable, AdventuringGear } from "$lib/ts/character/types";
  import WeaponDetails from "./weapon-details.svelte";
  import ArmorDetails from "./armor-details.svelte";
  import ConsumableDetails from "./consumable-details.svelte";
  import Dropdown from "../leveling/dropdown.svelte";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";
  import { get_consumable } from "$lib/ts/character/helpers";
  import { cn } from "$lib/utils";
  import CircleMinus from "@lucide/svelte/icons/circle-minus";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import CirclePlus from "@lucide/svelte/icons/circle-plus";
  import Search from "@lucide/svelte/icons/search";
  import Minus from "@lucide/svelte/icons/minus";
  import X from "@lucide/svelte/icons/x";

  const context = getCharacterContext();
  let character = $derived(context.character);
  let searchQuery = $state("");

  // Helper function to check if item matches search
  function matchesSearch(
    item: Weapon | Armor | Consumable | AdventuringGear,
    query: string
  ): boolean {
    if (!query.trim()) return true;
    const searchLower = query.toLowerCase();
    return item.title.toLowerCase().includes(searchLower);
  }

  // Filtered weapons and armor
  let filteredWeapons = $derived(
    Object.values(context.inventory_weapons).filter((weapon) => matchesSearch(weapon, searchQuery))
  );

  let filteredArmor = $derived(
    Object.values(context.inventory_armor).filter((armor) => matchesSearch(armor, searchQuery))
  );

  // Filtered consumables
  let filteredConsumables = $derived.by(() => {
    if (!character) return [];
    const consumables: (Consumable & { quantity: number })[] = [];
    for (const [consumable_id, data] of Object.entries(character.inventory.consumables)) {
      const consumable = get_consumable(consumable_id);
      if (consumable && matchesSearch(consumable, searchQuery)) {
        consumables.push({ ...consumable, quantity: data.quantity });
      }
    }
    return consumables;
  });

  // Filtered adventuring gear (with original index)
  let filteredAdventuringGear = $derived.by(() => {
    if (!character) return [];
    return character.inventory.adventuring_gear
      .map((gear, index) => ({ gear, originalIndex: index }))
      .filter(({ gear }) => matchesSearch(gear, searchQuery));
  });

  function equipWeapon(weapon: Weapon) {
    if (!character) return;
    if (weapon.category === "Primary") {
      character.primary_weapon_id = weapon.id;
    } else if (weapon.category === "Secondary") {
      character.secondary_weapon_id = weapon.id;
    }
  }

  function equipArmor(armor: Armor) {
    if (!character) return;
    character.armor_id = armor.id;
  }

  function unequipArmor(armor: Armor) {
    if (!character) return;
    if (character.armor_id === armor.id) {
      character.armor_id = null;
    }
  }

  function unequipWeapon(weapon: Weapon) {
    if (!character) return;
    if (character.primary_weapon_id === weapon.id) {
      character.primary_weapon_id = null;
    }
    if (character.secondary_weapon_id === weapon.id) {
      character.secondary_weapon_id = null;
    }
  }
  function removeWeapon(weapon: Weapon) {
    if (!character) return;
    unequipWeapon(weapon);

    if (weapon.id in character.inventory.weapons) {
      character.inventory.weapons[weapon.id].quantity--;
      if (character.inventory.weapons[weapon.id].quantity <= 0) {
        delete character.inventory.weapons[weapon.id];
      }
    }
  }

  function removeArmor(armor: Armor) {
    if (!character) return;
    unequipArmor(armor);

    if (armor.id in character.inventory.armor) {
      character.inventory.armor[armor.id].quantity--;
      if (character.inventory.armor[armor.id].quantity <= 0) {
        delete character.inventory.armor[armor.id];
      }
    }
  }

  function removeConsumable(consumable: Consumable) {
    if (!character) return;

    if (consumable.id in character.inventory.consumables) {
      character.inventory.consumables[consumable.id].quantity--;
      if (character.inventory.consumables[consumable.id].quantity <= 0) {
        delete character.inventory.consumables[consumable.id];
      }
    }
  }

  function removeAdventuringGear(
    gear: AdventuringGear & { quantity: number },
    originalIndex: number
  ) {
    if (!character) return;

    if (gear.quantity > 1) {
      character.inventory.adventuring_gear[originalIndex].quantity--;
    } else {
      character.inventory.adventuring_gear.splice(originalIndex, 1);
    }
  }

  // Helper function to check if character level meets requirement
  function canEquip(item: Weapon | Armor): boolean {
    if (!character) return false;
    return character.level >= item.level_requirement;
  }

  // Helper function to check if weapon is equipped
  function isWeaponEquipped(weapon: Weapon): boolean {
    if (!character) return false;
    return character.primary_weapon_id === weapon.id || character.secondary_weapon_id === weapon.id;
  }

  // Helper function to check if armor is equipped
  function isArmorEquipped(armor: Armor): boolean {
    if (!character) return false;
    return character.armor_id === armor.id;
  }
</script>

{#if character}
  {@const hasItems =
    Object.keys(context.inventory_weapons).length > 0 ||
    Object.keys(context.inventory_armor).length > 0 ||
    Object.keys(character.inventory.consumables).length > 0 ||
    character.inventory.adventuring_gear.length > 0}
  <div class="flex flex-col gap-4">
    {#if !hasItems}
      <p class="text-sm text-muted-foreground text-center py-4">Your inventory is empty</p>
    {:else}
      <!-- Search Box -->
      <div class="relative mb-2">
        <Search
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
        />
        <Input bind:value={searchQuery} placeholder="Search inventory..." class="pl-9" />
      </div>

      {#if filteredWeapons.length > 0}
        <div class="gap-1 flex flex-col">
        <p class="ml-2 font-medium">Weapons</p>

        {#each filteredWeapons as weapon (weapon.id)}
          {#snippet subtitle_snippet()}
            {@const equipped = isWeaponEquipped(weapon)}
            <div class="flex items-center gap-2">
              {#if equipped}
                <span class="text-xs italic text-muted-foreground">Equipped</span>
              {:else}
                {@const canEquipItem = canEquip(weapon)}
                <Button
                  size="sm"
                  onclick={(e) => {
                    e.stopPropagation();
                    if (canEquipItem) equipWeapon(weapon);
                  }}
                  title={canEquipItem ? undefined : "Level requirement not met"}
                  class={cn(!canEquipItem && "cursor-not-allowed opacity-50 hover:bg-primary")}
                >
                  Equip
                </Button>
              {/if}
            </div>
          {/snippet}

          {#snippet title_snippet()}
            {@const quantity = character.inventory.weapons[weapon.id]?.quantity ?? 0}
            <div class="text-left gap-4">
              <p class="text-md font-medium">
                {weapon.title}
                {#if quantity > 1}
                  <span class="ml-1 text-sm italic text-muted-foreground">x{quantity}</span>
                {/if}
              </p>
              <p class="text-[10px] text-muted-foreground leading-none italic truncate">
                Tier {context.get_tier_from_level(weapon.level_requirement)}
                {weapon.category} Weapon
              </p>
            </div>
          {/snippet}

          <Dropdown {title_snippet} {subtitle_snippet} class="border-2">
            <WeaponDetails {weapon} />
            <div class="flex justify-center sm:justify-end mt-1 -mb-2">
              <!-- {#if isWeaponEquipped(weapon)}
                <Button variant="link" onclick={() => unequipWeapon(weapon)}>
                  <CircleMinus class="size-4" /> Unequip
                </Button>
              {:else}
                <Button variant="link" onclick={() => equipWeapon(weapon)}
                  ><CirclePlus class="size-4" /> Equip</Button
                >
              {/if} -->
              <Button variant="link" class="text-destructive" onclick={() => removeWeapon(weapon)}>
                <!-- <Trash2 class="size-4" /> -->
                Remove
              </Button>
            </div>
          </Dropdown>
        {/each}
        </div>
      {/if}

      {#if filteredArmor.length > 0}
        <div class="gap-1 flex flex-col">
          <p class="ml-2 font-medium">Armor</p>

          {#each filteredArmor as armor (armor.id)}
            {#snippet subtitle_snippet()}
              {@const equipped = isArmorEquipped(armor)}
              <div class="flex items-center gap-2">
                {#if equipped}
                  <span class="text-xs italic text-muted-foreground">Equipped</span>
                {:else}
                  {@const canEquipItem = canEquip(armor)}
                  <Button
                    size="sm"
                    onclick={(e) => {
                      e.stopPropagation();
                      if (canEquipItem) equipArmor(armor);
                    }}
                    disabled={!canEquipItem}
                    title={canEquipItem ? undefined : "Level requirement not met"}
                  >
                    Equip
                  </Button>
                {/if}
              </div>
            {/snippet}

            {#snippet title_snippet()}
              {@const quantity = character.inventory.armor[armor.id]?.quantity ?? 0}
              <div class="text-left gap-4">
                <p class="text-md font-medium">
                  {armor.title}
                  {#if quantity > 1}
                    <span class="ml-1 text-sm italic text-muted-foreground">x{quantity}</span>
                  {/if}
                </p>
                <p class="text-[10px] text-muted-foreground leading-none italic truncate">
                  Tier {context.get_tier_from_level(armor.level_requirement)} Armor
                </p>
              </div>
            {/snippet}

            <Dropdown {title_snippet} {subtitle_snippet} class="border-2">
              <ArmorDetails {armor} />
              <div class="flex justify-center sm:justify-end mt-1 -mb-2">
                <!-- {#if isArmorEquipped(armor)}
                <Button variant="link" onclick={() => unequipArmor(armor)}>
                  <CircleMinus class="size-4" /> Unequip
                </Button>
              {:else}
                <Button variant="link" onclick={() => equipArmor(armor)}
                  ><CirclePlus class="size-4" /> Equip</Button
                >
              {/if} -->
                <Button variant="link" class="text-destructive" onclick={() => removeArmor(armor)}>
                  <!-- <Trash2 class="size-4" /> -->
                  Remove
                </Button>
              </div>
            </Dropdown>
          {/each}
        </div>
      {/if}

      {#if filteredConsumables.length > 0}
        <div class="gap-1 flex flex-col">
          <p class="ml-2 font-medium">Consumables</p>

          {#each filteredConsumables as consumable (consumable.id)}
            {#snippet title_snippet()}
              {@const quantity = character.inventory.consumables[consumable.id]?.quantity ?? 0}
              <div class="text-left gap-4">
                <p class="text-md font-medium">
                  {consumable.title}
                  {#if quantity > 1}
                    <span class="ml-1 text-sm italic text-muted-foreground">x{quantity}</span>
                  {/if}
                </p>
              </div>
            {/snippet}

            <Dropdown {title_snippet} class="border-2">
              <ConsumableDetails {consumable} />
              <div class="flex justify-center sm:justify-end mt-1 -mb-2">
                <Button
                  variant="link"
                  class="text-destructive"
                  onclick={() => removeConsumable(consumable)}
                >
                  Remove
                </Button>
              </div>
            </Dropdown>
          {/each}
        </div>
      {/if}

      {#if filteredAdventuringGear.length > 0}
        <div class="gap-1 flex flex-col">
          <p class="ml-2 font-medium">Adventuring Gear</p>

          <ul class="">
            {#each filteredAdventuringGear as { gear, originalIndex } (originalIndex)}
              <li class="flex items-center text-sm text-muted-foreground">
                <span class="ml-4 mr-3">•</span>
                {gear.title}
                <Button
                  variant="link"
                  class="ml-auto h-auto text-foreground"
                  onclick={() => removeAdventuringGear(gear, originalIndex)}
                >
                  <CircleMinus class="size-4" />
                </Button>
              </li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if searchQuery.trim() && filteredWeapons.length === 0 && filteredArmor.length === 0 && filteredConsumables.length === 0 && filteredAdventuringGear.length === 0}
        <p class="text-sm text-muted-foreground text-center py-4">No results</p>
      {/if}
    {/if}
  </div>
{/if}
