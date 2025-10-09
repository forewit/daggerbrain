<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte";
  import { cn } from "$lib/utils";
  import type { Traits } from "./types";

  let { class: className = "", traits = $bindable() }: { class?: string; traits: Traits } =
    $props();

  const traitNames = {
    agility: "Agility",
    strength: "Strength",
    finesse: "Finesse",
    instinct: "Instinct",
    presence: "Presence",
    knowledge: "Knowledge",
  };

  const traitExamples = {
    agility: ["Sprint", "Leap", "Maneuver"],
    strength: ["Lift", "Smash", "Grapple"],
    finesse: ["Control", "Hide", "Tinker"],
    instinct: ["Perceive", "Sense", "Navigate"],
    presence: ["Charm", "Perform", "Deceive"],
    knowledge: ["Recall", "Analyze", "Comprehend"],
  };

  const min = 0;
  const max = 9;
</script>

{#snippet trait(trait: keyof Traits)}
  <div class=" flex flex-col justify-center text-center border-2 border-gray-300 rounded-md p-2">
    <Input
      {min}
      {max}
      inputmode="numeric"
      type="number"
      bind:value={traits[trait]}
      oninput={(e) => {
        const value = (e.target as HTMLInputElement).value.slice(0, 1);
        traits[trait] = Math.min(Math.max(parseInt(value), min), max);
      }}
    />
    <p class="text-sm">{traitNames[trait]}</p>

    {#each traitExamples[trait] as example}
      <p class="text-xs">{example}</p>
    {/each}
  </div>
{/snippet}

<div class={cn("flex gap-2", className)}>
  {@render trait("agility")}
  {@render trait("strength")}
  {@render trait("finesse")}
  {@render trait("instinct")}
  {@render trait("presence")}
  {@render trait("knowledge")}
</div>
