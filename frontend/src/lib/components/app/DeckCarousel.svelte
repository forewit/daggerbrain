<script lang="ts">
  import type { Deck } from "$lib/ts/types";
  import { cn, focusVisibleRingStyle } from "$lib/utils";
  import cardBack from "$lib/assets/images/card-back.png";
  import { onMount, tick } from "svelte";

  let { 
    class: className = "", 
    deck = $bindable(),
    selectedIndex = $bindable(0),
    scrollToIndex = $bindable<((index: number, behavior?: ScrollBehavior) => void) | undefined>()
  }: { 
    class?: string; 
    deck: Deck;
    selectedIndex?: number;
    scrollToIndex?: (index: number, behavior?: ScrollBehavior) => void;
  } = $props();

  // Initialize deck if empty
  if (!deck.urls || deck.urls.length === 0) {
    deck.urls = ["", "", "", "", ""];
  }

  let scrollContainer: HTMLDivElement;
  let cards: HTMLElement[] = [];

  // Update card transforms based on scroll position
  function updateCardTransforms() {
    if (!scrollContainer || cards.length === 0) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      
      // Calculate distance from center (-1 to 1, where 0 is centered)
      const distanceFromCenter = (cardCenter - containerCenter) / (containerRect.width / 2);
      const absDistance = Math.abs(distanceFromCenter);
      
      // Track which card is closest to center
      const distance = Math.abs(cardCenter - containerCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
      
      // Scale: 1 at center, down to 0.95 at edges
      const scale = Math.max(0.95, 1 - absDistance * 0.5);
      
      card.style.transform = `scale(${scale})`;
    });
    
    selectedIndex = closestIndex;
  }

  // Scroll to a specific card when clicked
  function scrollToCard(event: MouseEvent | KeyboardEvent) {
    const card = event.currentTarget as HTMLElement;
    card.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  // Public method to scroll to a specific card by index
  async function scrollToCardByIndex(index: number, behavior: ScrollBehavior = 'smooth') {
    await tick();
    // Refresh cards array in case new cards were added
    if (scrollContainer) {
      cards = Array.from(scrollContainer.querySelectorAll('.carousel-card'));
    }
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior,
        block: 'nearest',
        inline: 'center'
      });
    }
  }

  // Handle keyboard navigation
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToCard(event);
    }
  }

  onMount(() => {
    if (scrollContainer) {
      cards = Array.from(scrollContainer.querySelectorAll('.carousel-card'));
      
      // Initial update
      updateCardTransforms();
      
      // Update on scroll
      scrollContainer.addEventListener('scroll', updateCardTransforms);
      
      // Update on resize
      window.addEventListener('resize', updateCardTransforms);
      
      return () => {
        scrollContainer.removeEventListener('scroll', updateCardTransforms);
        window.removeEventListener('resize', updateCardTransforms);
      };
    }
  });

  // Expose the scroll function
  scrollToIndex = scrollToCardByIndex;
</script>

<div class={cn("flex flex-col relative", className)}>
  <!-- Carousel Container -->
  <div 
    bind:this={scrollContainer}
    class="relative overflow-x-auto overflow-y-hidden py-8 px-4 pointer-events-none scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    style="perspective: 1200px; -webkit-overflow-scrolling: touch;"
  >
    <div class="flex gap-3 sm:gap-4 items-center justify-start min-w-max pointer-events-none">
      <!-- Spacer to allow first card to be centered -->
      <div class="flex-shrink-0" style="width: calc(50vw - 7rem);"></div>
      
      {#each deck.urls as url, index}
        <div 
          class={cn(
            "carousel-card flex-shrink-0 ease-out cursor-pointer pointer-events-auto snap-center snap-normal origin-center relative",
            focusVisibleRingStyle,
            selectedIndex === index ? "z-20" : "z-10"
          )}
          onclick={scrollToCard}
          onkeydown={handleKeyDown}
          role="button"
          tabindex="0"
        >
          <div class={cn(
            "rounded-lg overflow-hidden border border-border transition-all card-shadow",
            selectedIndex === index 
              ? "border-primary card-shadow-lg scale-105" 
              : "hover:border-primary/50"
          )}>
            <img 
              src={url ? url : cardBack} 
              alt="Card {index + 1}" 
              class="h-80 aspect-[360/504] object-cover pointer-events-none select-none"
              draggable="false"
            />
          </div>
        </div>
      {/each}
      
      <!-- Spacer to allow last card to be centered -->
      <div class="flex-shrink-0" style="width: calc(50vw - 7rem);"></div>
    </div>
  </div>
  
  <!-- Navigation dots -->
  <div class="flex justify-center gap-1.5 py-3 relative z-10">
    {#each deck.urls as _, index}
      <button
        onclick={(e) => {
          e.stopPropagation();
          const card = cards[index];
          if (card) {
            card.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'center'
            });
          }
        }}
        class={cn(
          "h-1.5 rounded-full transition-all",
          selectedIndex === index 
            ? "w-6 bg-primary" 
            : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
        )}
        aria-label="Go to card {index + 1}"
      ></button>
    {/each}
  </div>
</div>
