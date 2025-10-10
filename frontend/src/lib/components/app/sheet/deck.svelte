<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Character, Card } from "$lib/ts/types";
  import CardCarousel from "./card-carousel.svelte";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";

  let {
    class: className = "",
    title = "Deck",
    cards,
  }: { class?: string; title: string; cards: Card<any>[] } = $props();

  let expanded = $state(true);
</script>

<div class={cn("", className)}>
  <button
    onclick={() => (expanded = !expanded)}
    class="z-20 mx-auto text-nowrap flex items-center font-medium text-muted-foreground mb-4"
  >
    {#if expanded}
      <ChevronDown class="w-k h-4" />
    {:else}
      <ChevronRight class="w-k h-4" />
    {/if}
    {title}
  </button>
  {#if expanded}
    <CardCarousel {cards} />
  {/if}
</div>
