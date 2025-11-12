<script lang="ts">
  import { capitalize } from "$lib/utils";
  import type { Weapon } from "$lib/ts/character/types";
  import Dropdown from "$lib/components/app/leveling/dropdown.svelte";

  let { weapon }: { weapon: Weapon } = $props();

  // Helper function to get tier from level requirement
  function getTier(levelRequirement: number): "1" | "2" | "3" | "4" {
    if (levelRequirement === 1) return "1";
    if (levelRequirement >= 2 && levelRequirement <= 4) return "2";
    if (levelRequirement >= 5 && levelRequirement <= 7) return "3";
    return "4";
  }

  let tier = getTier(weapon.level_requirement);
  let subtitle = `Tier ${tier} ${weapon.category} Weapon`;
</script>

<Dropdown title={weapon.title} subtitle={subtitle}>
  <div>
    <div>ID: {weapon.id}</div>
    <div>Title: {weapon.title}</div>
    <div>Category: {weapon.category}</div>
    <div>Level Requirement: {weapon.level_requirement}</div>
    <div>Burden: {weapon.burden}</div>
    <div>Range: {weapon.range}</div>
    <div>Attack Roll Bonus: {weapon.attack_roll_bonus}</div>
    <div>Damage Bonus: {weapon.damage_bonus}</div>
    <div>Damage Dice: {weapon.damage_dice}</div>
    <div>Available Damage Types: {weapon.available_damage_types.map(capitalize).join(", ")}</div>
    <div>Available Traits: {weapon.available_traits.map(capitalize).join(", ")}</div>
    <div>Description: {@html weapon.description_html}</div>
    <div>Features:</div>
    {#each weapon.features as feature}
      <div>
        <div>Feature Title: {feature.title}</div>
        <div>Feature Description: {@html feature.description_html}</div>
        <div>Character Modifiers: {feature.character_modifiers.length}</div>
        <div>Weapon Modifiers: {feature.weapon_modifiers.length}</div>
      </div>
    {/each}
  </div>
</Dropdown>

