<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Character, Card } from "$lib/ts/types";
  import CardCarousel from "./card-carousel.svelte";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte";

  let { class: className = "", title="Deck", cards }: { class?: string; title: string; cards: Card<any>[] } = $props();

  const isMobile = new IsMobile();

  let expanded = $state(true);
  let scrollToIndex = $state<((index: number) => void) | undefined>();

  // Scroll to middle card when component mounts
  onMount(() => {
    if (!isMobile.current && scrollToIndex && cards.length > 0) {
      const middleIndex = Math.floor(cards.length / 2);
      scrollToIndex(middleIndex);
    }
  });
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
    <div transition:fade={{ duration: 120 }} class="flex flex-col gap-4">
      <CardCarousel {cards} bind:scrollToIndex />
    </div>
  {/if}
</div>
