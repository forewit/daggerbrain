<script lang="ts">
  import { cn, capitalize } from "$lib/utils";
  import Hand from "@lucide/svelte/icons/hand";
  import * as Select from "$lib/components/ui/select/";
  import type { Weapon, DamageType } from "$lib/ts/character/types";
  import type { Traits } from "$lib/ts/character/types";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";

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

  // Determine which weapon choices to use based on weapon category
  let weaponChoices = $derived.by(() => {
    if (!character) return null;
    if (weapon.category === "Primary") {
      return character.primary_weapon_chocies;
    } else if (weapon.category === "Secondary") {
      return character.secondary_weapon_chocies;
    } else if (weapon.category === "Unarmed") {
      return character.unarmed_attack_chocies;
    }
    return null;
  });

  // Get current damage type and trait values
  let currentDamageType = $derived(
    weaponChoices?.damage_type || weapon.available_damage_types[0] || null
  );
  let currentTrait = $derived(weaponChoices?.trait || weapon.available_traits[0] || null);

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
          if (!weaponChoices) return;
          weaponChoices.damage_type = value === "" ? null : (value as DamageType);
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
          if (!weaponChoices) return;
          weaponChoices.trait = value === "" ? null : (value as keyof Traits);
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
