<script lang="ts">
  import type { Armor } from "$lib/ts/character/types";
  import Dropdown from "$lib/components/app/leveling/dropdown.svelte";

  let { armor }: { armor: Armor } = $props();

  // Helper function to get tier from level requirement
  function getTier(levelRequirement: number): "1" | "2" | "3" | "4" {
    if (levelRequirement === 1) return "1";
    if (levelRequirement >= 2 && levelRequirement <= 4) return "2";
    if (levelRequirement >= 5 && levelRequirement <= 7) return "3";
    return "4";
  }

  let tier = getTier(armor.level_requirement);
  let subtitle = `Tier ${tier} Armor`;
</script>

<Dropdown title={armor.title} subtitle={subtitle}>
  <div>
    <div>ID: {armor.id}</div>
    <div>Title: {armor.title}</div>
    <div>Level Requirement: {armor.level_requirement}</div>
    <div>Max Armor: {armor.max_armor}</div>
    <div>Damage Thresholds - Major: {armor.damage_thresholds.major}</div>
    <div>Damage Thresholds - Severe: {armor.damage_thresholds.severe}</div>
    <div>Description: {@html armor.description_html}</div>
    <div>Features:</div>
    {#each armor.features as feature}
      <div>
        <div>Feature Title: {feature.title}</div>
        <div>Feature Description: {@html feature.description_html}</div>
        <div>Character Modifiers: {feature.character_modifiers.length}</div>
        <div>Weapon Modifiers: {feature.weapon_modifiers.length}</div>
      </div>
    {/each}
  </div>
</Dropdown>
