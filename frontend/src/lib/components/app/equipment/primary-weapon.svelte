<script lang="ts">
  import { cn, capitalize } from "$lib/utils";
  import Hand from "@lucide/svelte/icons/hand";
  import * as Select from "$lib/components/ui/select/";
  import type { Weapon, Traits, DamageTypes } from "$lib/types/compendium-types";
  import { getCharacterContext } from "$lib/state/character.svelte";

  let {
    weapon,
    bind_choices = false,
    class: className = "",
  }: {
    weapon: Weapon;
    bind_choices?: boolean;
    class?: string;
  } = $props();

  const context = getCharacterContext();
  let character = $derived(context.character);

  // Get weapon choices from inventory.primary_weapons[weapon.id].choices
  // Structure: inventory.primary_weapons[weapon.id].choices[choice_id] = selection_id[]
  let weaponChoices = $derived.by(() => {
    if (!character || !character.inventory.primary_weapons[weapon.id]) return null;
    return character.inventory.primary_weapons[weapon.id].choices;
  });

  // Get current damage type and trait values from inventory choices
  // The choices are stored as arrays, so we take the first element
  let currentDamageType = $derived.by(() => {
    const choices = weaponChoices?.["damage_type"];
    if (choices && choices.length > 0) {
      return choices[0] as DamageTypes;
    }
    return weapon.available_damage_types[0] || null;
  });
  
  let currentTrait = $derived.by(() => {
    const choices = weaponChoices?.["trait"];
    if (choices && choices.length > 0) {
      return choices[0] as keyof Traits;
    }
    return weapon.available_traits[0] || null;
  });

  // Determine if selects should be shown
  let showDamageTypeSelect = $derived(bind_choices && weapon.available_damage_types.length > 1);
  let showTraitSelect = $derived(bind_choices && weapon.available_traits.length > 1);
</script>

<div
  class={cn(
    "relative bg-card/50 rounded-md px-4 min-h-10 py-2 flex items-center justify-end gap-3",
    className
  )}
>
  <p class="text-sm grow">{weapon.title}</p>

  <div class="flex flex-wrap items-center gap-1 justify-end">
    <div class="text-xs flex items-center gap-1 bg-primary-muted rounded-full px-2 py-1">
      {weapon.burden}<Hand class="size-3.5" />
    </div>
    {#if showDamageTypeSelect}
      <Select.Root
        type="single"
        value={currentDamageType || ""}
        onValueChange={(value) => {
          if (!character) return;
          if (!character.inventory.primary_weapons[weapon.id]) {
            // Initialize weapon entry if not present
            character.inventory.primary_weapons[weapon.id] = {
              quantity: 1,
              choices: {},
            };
          }
          // Update the damage_type choice (stored as array)
          character.inventory.primary_weapons[weapon.id].choices["damage_type"] = value === "" ? [] : [value];
        }}
      >
        <Select.Trigger
          class="text-xs bg-primary-muted rounded-full px-2 py-1 h-auto min-h-0 border-0 shadow-none hover:bg-primary-muted/80 w-auto [&_svg]:size-3 [&_svg]:opacity-50"
        >
          <span class="flex items-center gap-1">
            {weapon.damage_dice}
            {currentDamageType ? capitalize(currentDamageType) : "—"}
          </span>
        </Select.Trigger>
        <Select.Content>
          {#each weapon.available_damage_types as dt}
            <Select.Item value={dt}>{capitalize(dt)}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    {:else}
      <div class="text-xs bg-primary-muted rounded-full px-2 py-1">
        {weapon.damage_dice}
        {currentDamageType ? capitalize(currentDamageType) : ""}
      </div>
    {/if}
    {#if showTraitSelect}
      <Select.Root
        type="single"
        value={currentTrait || ""}
        onValueChange={(value) => {
          if (!character) return;
          if (!character.inventory.primary_weapons[weapon.id]) {
            // Initialize weapon entry if not present
            character.inventory.primary_weapons[weapon.id] = {
              quantity: 1,
              choices: {},
            };
          }
          // Update the trait choice (stored as array)
          character.inventory.primary_weapons[weapon.id].choices["trait"] = value === "" ? [] : [value];
        }}
      >
        <Select.Trigger
          class="text-xs bg-primary-muted rounded-full px-2 py-1 h-auto min-h-0 border-0 shadow-none hover:bg-primary-muted/80 w-auto [&_svg]:size-3 [&_svg]:opacity-50"
        >
          <span>{currentTrait ? capitalize(currentTrait) : "—"}</span>
        </Select.Trigger>
        <Select.Content>
          {#each weapon.available_traits as t}
            <Select.Item value={t}>{capitalize(t)}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    {:else}
      <div class="text-xs bg-primary-muted rounded-full px-2 py-1">
        {currentTrait ? capitalize(currentTrait) : "—"}
      </div>
    {/if}
    <div class="text-xs bg-primary-muted rounded-full px-2 py-1">
      {weapon.range}
    </div>
  </div>
</div>

