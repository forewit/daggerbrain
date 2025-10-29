<script lang="ts">
  import type { Card, CardType } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import { onMount } from "svelte";
  import AncestryCard from "./ancestry-card.svelte";
  import CommunityCard from "./community-card.svelte";
  import DomainCard from "./domain-card.svelte";
  import TransformationCard from "./transformation-card.svelte";
  import SubclassCard from "./subclass-card.svelte";

  let {
    class: className = "",
    cards = $bindable(),
    cardWidth = $bindable(240),
    selectedIndex = $bindable(0),
  }: {
    class?: string;
    cards: Card<CardType>[];
    cardWidth?: number;
    selectedIndex?: number;
  } = $props();

  let scrollContainer: HTMLDivElement;

  function handleScroll() {
    const i = Math.round(scrollContainer.scrollLeft / cardWidth);
    selectedIndex = Math.max(Math.min(i, cards.length - 1), 0);
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

<div
  bind:this={scrollContainer}
  class={cn("relative snap-x snap-x-mandatory overflow-x-auto overflow-y-hidden p-2 flex items-center", className)}
  style="scrollbar-width:none;"
>
    <div class="shrink-0 snap-align-none" style="width: calc(50% - {cardWidth / 2}px);"></div>

    {#each cards as card, index (card.title)}
      <button
        style="width: {cardWidth}px;"
        class={cn(
          "rounded-xl snap-center scale-95 relative transition-scale duration-200",
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
        {#if card.card_type === "domain"}
          <DomainCard card={card as Card<"domain">} variant="card" />
        {:else if card.card_type === "ancestry"}
          <AncestryCard card={card as Card<"ancestry">} variant="card" />
        {:else if card.card_type === "community"}
          <CommunityCard card={card as Card<"community">} variant="card" />
        {:else if card.card_type === "transformation"}
          <TransformationCard card={card as Card<"transformation">} variant="card" />
        {:else if card.card_type === "subclass_foundation" || card.card_type === "subclass_specialization" || card.card_type === "subclass_mastery"}
          <SubclassCard
            card={card as Card<
              "subclass_foundation" | "subclass_specialization" | "subclass_mastery"
            >}
            variant="card"
          />
        {/if}
      </button>
    {/each}

    <div class="shrink-0 snap-align-none" style="width: calc(50% - {cardWidth / 2}px);"></div>
</div>
