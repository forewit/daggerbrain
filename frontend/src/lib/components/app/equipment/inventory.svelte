<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import type { Weapon, Armor } from "$lib/ts/character/types";
  import WeaponDetails from "./weapon-details.svelte";
  import ArmorDetails from "./armor-details.svelte";
  import Dropdown from "../leveling/dropdown.svelte";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";
  import { cn } from "$lib/utils";

  const context = getCharacterContext();
  let character = $derived(context.character);

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

  function removeWeapon(weapon: Weapon) {
    if (!character) return;
    if (weapon.id in character.inventory.weapons) {
      delete character.inventory.weapons[weapon.id];
    }
    // Also unequip if currently equipped
    if (character.primary_weapon_id === weapon.id) {
      character.primary_weapon_id = null;
    }
    if (character.secondary_weapon_id === weapon.id) {
      character.secondary_weapon_id = null;
    }
  }

  function removeArmor(armor: Armor) {
    if (!character) return;
    if (armor.id in character.inventory.armor) {
      delete character.inventory.armor[armor.id];
    }
    // Also unequip if currently equipped
    if (character.armor_id === armor.id) {
      character.armor_id = null;
    }
  }

  // Helper function to check if character level meets requirement
  function canEquip(item: Weapon | Armor): boolean {
    if (!character) return false;
    return character.level >= item.level_requirement;
  }
</script>

<div class="flex flex-col gap-2">
  {#if Object.keys(context.inventory_weapons).length === 0 && Object.keys(context.inventory_armor).length === 0}
    <p class="text-sm text-muted-foreground text-center py-4">Your inventory is empty</p>
  {:else}
    {#each Object.values(context.inventory_weapons) as weapon (weapon.id)}
      {#snippet subtitle_snippet()}
        {@const canEquipItem = canEquip(weapon)}
        <Button
          size="sm"
          onclick={(e) => {
            if (!canEquipItem) {
              e.stopPropagation();
              return;
            }
            equipWeapon(weapon);
          }}
          title={canEquipItem ? undefined : "Level requirement not met"}
          class={cn(!canEquipItem && "cursor-not-allowed opacity-50 hover:bg-primary")}
        >
          Equip
        </Button>
      {/snippet}

      {#snippet title_snippet()}
        <div class="text-left gap-4">
          <p class="text-md font-medium">{weapon.title}</p>
          <p class="text-[10px] text-muted-foreground leading-none italic truncate">
            Tier {context.get_tier_from_level(weapon.level_requirement)}
            {weapon.category} Weapon
          </p>
        </div>
      {/snippet}

      <Dropdown {title_snippet} {subtitle_snippet} class="border-2">
        <WeaponDetails {weapon} />
        <div class="flex justify-center sm:justify-end mt-4">
          <Button
            variant="link"
            class="text-destructive"
            onclick={() => removeWeapon(weapon)}
          >
            Remove Item
          </Button>
        </div>
      </Dropdown>
    {/each}

    {#each Object.values(context.inventory_armor) as armor (armor.id)}
      {#snippet subtitle_snippet()}
        {@const canEquipItem = canEquip(armor)}
        <Button
          size="sm"
          onclick={() => equipArmor(armor)}
          disabled={!canEquipItem}
          title={canEquipItem ? undefined : "Level requirement not met"}
        >
          Equip
        </Button>
      {/snippet}

      {#snippet title_snippet()}
        <div class="text-left gap-4">
          <p class="text-md font-medium">{armor.title}</p>
          <p class="text-[10px] text-muted-foreground leading-none italic truncate">
            Tier {context.get_tier_from_level(armor.level_requirement)} Armor
          </p>
        </div>
      {/snippet}

      <Dropdown {title_snippet} {subtitle_snippet} class="border-2">
        <ArmorDetails {armor} />
        <div class="flex justify-center sm:justify-end mt-4">
          <Button variant="link" class="text-destructive" onclick={() => removeArmor(armor)}>
            Remove Item
          </Button>
        </div>
      </Dropdown>
    {/each}
  {/if}
</div>
