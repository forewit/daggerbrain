<script lang="ts">
  import type { Card, CardType } from "$lib/ts/character/types";
  import { cn } from "$lib/utils";
  import { onMount, tick } from "svelte";
  import AncestryCard from "./full-cards/ancestry-card.svelte";
  import CommunityCard from "./full-cards/community-card.svelte";
  import DomainCard from "./full-cards/domain-card.svelte";
  import TransformationCard from "./full-cards/transformation-card.svelte";
  import SubclassCard from "./full-cards/subclass-card.svelte";

  let {
    class: className = "",
    cards = $bindable(),
    cardWidth = $bindable(240),
    selectedIndex = $bindable(0),
    disabled_indices = new Set<number>(),
    highlighted_indices = new Set<number>(),
    emptyMessage = "",
    scroll_to_index = -1,
  }: {
    class?: string;
    cards: Card<CardType>[];
    cardWidth?: number;
    selectedIndex?: number;
    disabled_indices?: Set<number>;
    highlighted_indices?: Set<number>;
    emptyMessage?: string;
    scroll_to_index?: number;
  } = $props();

  let scrollContainer: HTMLDivElement;
  let containerWidth: number = $state(null!);
  function handleScroll() {
    if (cards.length === 0) {
      selectedIndex = -1;
      return;
    }
    const i = Math.round(scrollContainer.scrollLeft / cardWidth);
    selectedIndex = Math.max(Math.min(i, cards.length - 1), 0);
  }

  

  onMount(() => {
    if (scrollContainer) {
      //scrollContainer.scrollLeft = cardWidth;
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  });

</script>

<div
  bind:this={scrollContainer}
  bind:clientWidth={containerWidth}
  class={cn(
    "relative snap-x snap-x-mandatory overflow-x-auto overflow-y-hidden p-2 flex items-center",
    className
  )}
  style="scrollbar-width:none;"
>
  <div
    class="shrink-0 snap-align-none h-2"
    style="width: {(containerWidth - cardWidth) / 2}px;"
  ></div>

  {#each cards as card, index (card.id)}
    <button
      class={cn(
        "rounded-xl snap-center scale-95 relative transition-scale duration-200",
        selectedIndex === index && "scale-100",
        disabled_indices.has(index) && "opacity-50"
      )}
      style="width: {cardWidth}px;"
      onclick={(e) => {
        let el = e.currentTarget as HTMLButtonElement;
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }}
    >
      <span
        class="absolute inset-0 rounded-2xl"
        style={cn(
          `width: ${cardWidth}px;`,
          highlighted_indices.has(index) &&
            "outline-offset: 2px; outline-width: 4px; outline-color: var(--primary); outline-style: solid;"
        )}
      ></span>
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

  {#if cards.length === 0}
    <div
      class="rounded-2xl snap-center relative border-4 border-dotted border-muted flex items-center justify-center"
      style="width: {cardWidth}px; height: {(cardWidth * 503) / 360}px;"
    >
      <p class="text-center font-eveleth text-lg text-muted">{emptyMessage}</p>
    </div>
  {/if}

  <div
    class="shrink-0 snap-align-none h-2"
    style="width: {(containerWidth - cardWidth) / 2}px;"
  ></div>
</div>
