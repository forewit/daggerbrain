<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte";
  import { cn } from "$lib/utils";
  import type { Traits } from "$lib/types/compendium-types";
  import { TRAITS } from "$lib/types/rules";

  let { class: className = "", traits = $bindable() }: { class?: string; traits: Traits } =
    $props();
</script>

<div class={cn(" grid grid-cols-3 justify-items-center sm:flex sm:justify-between gap-2", className)}>

  <div
    class="w-[90px] text-center border-2 rounded-md p-2"
  >
    <p class="text-lg font-bold">
      {traits.agility !== null && traits.agility > 0 ? "+" + traits.agility : traits.agility}
    </p>
    <p class="text-sm font-medium">{TRAITS.agility.name}</p>
    <div class="text-xs text-muted-foreground mt-1">
      {#each TRAITS.agility.examples as example}
        <p>{example}</p>
      {/each}
    </div>
  </div>

  <div
    class="w-[90px] text-center border-2 rounded-md p-2"
  >
    <p class="text-lg font-bold">
      {traits.strength !== null && traits.strength > 0 ? "+" + traits.strength : traits.strength}
    </p>
    <p class="text-sm font-medium">{TRAITS.strength.name}</p>
    <div class="text-xs text-muted-foreground mt-1">
      {#each TRAITS.strength.examples as example}
        <p>{example}</p>
      {/each}
    </div>
  </div>

  <div
    class="w-[90px] text-center border-2 rounded-md p-2"
  >
    <p class="text-lg font-bold">
      {traits.finesse !== null && traits.finesse > 0 ? "+" + traits.finesse : traits.finesse}
    </p>
    <p class="text-sm font-medium">{TRAITS.finesse.name}</p>
    <div class="text-xs text-muted-foreground mt-1">
      {#each TRAITS.finesse.examples as example}
        <p>{example}</p>
      {/each}
    </div>
  </div>

  <div
    class="w-[90px] text-center border-2 rounded-md p-2"
  >
    <p class="text-lg font-bold">
      {traits.instinct !== null && traits.instinct > 0 ? "+" + traits.instinct : traits.instinct}
    </p>
    <p class="text-sm font-medium">{TRAITS.instinct.name}</p>
    <div class="text-xs text-muted-foreground mt-1">
      {#each TRAITS.instinct.examples as example}
        <p>{example}</p>
      {/each}
    </div>
  </div>

  <div
    class="w-[90px] text-center border-2 rounded-md p-2"
  >
    <p class="text-lg font-bold">
      {traits.presence !== null && traits.presence > 0 ? "+" + traits.presence : traits.presence}
    </p>
    <p class="text-sm font-medium">{TRAITS.presence.name}</p>
    <div class="text-xs text-muted-foreground mt-1">
      {#each TRAITS.presence.examples as example}
        <p>{example}</p>
      {/each}
    </div>
  </div>

  <div
    class="w-[90px] text-center border-2 rounded-md p-2"
  >
    <p class="text-lg font-bold">
      {traits.knowledge !== null && traits.knowledge > 0 ? "+" + traits.knowledge : traits.knowledge}
    </p>
    <p class="text-sm font-medium">{TRAITS.knowledge.name}</p>
    <div class="text-xs text-muted-foreground mt-1">
      {#each TRAITS.knowledge.examples as example}
        <p>{example}</p>
      {/each}
    </div>
  </div>

</div>
