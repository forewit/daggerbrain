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
  }: {
    class?: string;
    cards: Card<CardType>[];
  } = $props();

  let scrollContainer: HTMLDivElement;

  let gap = $state(10);
  let cardWidth = $state(240);
  let cardHeight = $derived(cardWidth * (503 / 360));
  let selectedIndex = $state(0);

  function handleScroll() {
    const cw = cardWidth + gap;
    selectedIndex = Math.round(scrollContainer.scrollLeft / cw);
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
  class={cn("relative snap-x snap-x-mandatory overflow-x-auto overflow-y-hidden p-1 ", className)}
  style="scrollbar-width:none;"
>
  <div class="flex items-center justify-start min-w-max">
    <div
      style="width: calc(50vw - {(cardWidth + gap) / 2}px)"
      class="shrink-0 snap-align-none"
    ></div>

    {#each cards as card, index}
      <button
        style="height: {cardHeight}px; width: {cardWidth}px; margin-left: {gap /
          2}px; margin-right: {gap / 2}px;"
        class={cn(
          "rounded-xl snap-center transition-[scale] scale-95",
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
    <div
      style="width: calc(50vw - {(cardWidth + gap) / 2}px)"
      class="shrink-0 snap-align-none"
    ></div>
  </div>
</div>
