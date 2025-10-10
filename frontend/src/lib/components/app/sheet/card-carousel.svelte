<script lang="ts">
  import type { Card } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import { onMount } from "svelte";

  let {
    class: className = "",
    cards = $bindable(),
  }: {
    class?: string;
    cards: Card<any>[];
  } = $props();

  let scrollContainer: HTMLDivElement;

  let gap = $state(10);
  let cardWidth = $state(240);
  let cardHeight = $derived(cardWidth * (503 / 360));
  let selectedIndex = $state(0);

  function handleScroll() {
    selectedIndex = Math.round(scrollContainer.scrollLeft / cardWidth);
  }

  onMount(() => {
    if (scrollContainer) {
      scrollContainer.scrollLeft = cardWidth;
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<svelte:head>
  {#each cards as card}
    {#if card.full_card_image_url}
      <link rel="preload" as="image" href={card.full_card_image_url} />
    {/if}
  {/each}
</svelte:head>

<div
  bind:this={scrollContainer}
  class={cn("relative snap-x snap-mandatory overflow-x-auto overflow-y-hidden p-1 ", className)}
  style="scrollbar-width:none;"
>
  <div class="flex items-center justify-start min-w-max" style="gap: {gap}px;">
    <div
      class="flex-shrink-0"
      style="width: calc(50vw - {gap * (cards.length - 1) + cardWidth / 2}px);"
    ></div>

    {#each cards as card, index}
      <button
        style="height: {cardHeight}px; width: {cardWidth}px;"
        class={cn(
          "rounded-xl snap-center transition-transform scale-95 will-change-transform",
          selectedIndex === index && "scale-100"
        )}
        onclick={(e) => {
          let el = e.currentTarget as HTMLButtonElement;
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        }}
      >
        <img
          src={card.full_card_image_url}
          alt={card.title}
          class="object-cover select-none"
          draggable="false"
          decoding="async"
          loading="eager"
        />
      </button>
    {/each}
    <div
      class="flex-shrink-0"
      style="width: calc(50vw - {gap * (cards.length - 1) + cardWidth / 2}px);"
    ></div>
  </div>
</div>
