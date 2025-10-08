<script lang="ts">
  import type { Card } from "$lib/ts/types";
  import { cn, focusVisibleRingStyle } from "$lib/utils";
  import cardBack from "$lib/assets/images/card-back.png";
  import { onMount, tick } from "svelte";

  let { 
    class: className = "", 
    cards = $bindable(),
    selectedIndex = $bindable(0),
    scrollToIndex = $bindable<((index: number, behavior?: ScrollBehavior) => void) | undefined>(),
    onAddCard = () => {}
  }: { 
    class?: string; 
    cards: Card[];
    selectedIndex?: number;
    scrollToIndex?: (index: number, behavior?: ScrollBehavior) => void;
    onAddCard?: () => void;
  } = $props();

  // Initialize cards if empty with placeholder
  if (!cards || cards.length === 0) {
    cards = [{ name: "", image_url: "" }];
  }

  let scrollContainer: HTMLDivElement;
  let cardElements: HTMLElement[] = [];

  // Update card transforms based on scroll position
  function updateCardTransforms() {
    if (!scrollContainer || cardElements.length === 0) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    let closestIndex = 0;
    let closestDistance = Infinity;

    cardElements.forEach((card, index) => {
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
    
    // Additional checks for edge cases
    const scrollLeft = scrollContainer.scrollLeft;
    const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    
    // If we're at or very close to the beginning of the scroll, select the first card
    if (scrollLeft <= 10) {
      closestIndex = 0;
    }
    // If we're at or very close to the end of the scroll, select the last card
    else if (scrollLeft >= maxScrollLeft - 10) {
      closestIndex = cardElements.length - 1;
    }
    
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
      cardElements = Array.from(scrollContainer.querySelectorAll('.carousel-card'));
    }
    if (cardElements[index]) {
      cardElements[index].scrollIntoView({
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

  // Handle add card click
  function handleAddCard(event: MouseEvent | KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    onAddCard();
  }

  onMount(() => {
    if (scrollContainer) {
      cardElements = Array.from(scrollContainer.querySelectorAll('.carousel-card'));
      
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
    class="relative overflow-x-auto overflow-y-hidden py-2 px-4 pointer-events-none scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    style="perspective: 1200px; -webkit-overflow-scrolling: touch;"
  >
    <div class="flex gap-3 sm:gap-4 items-center justify-start min-w-max pointer-events-none">
      <!-- Spacer to allow first card to be centered -->
      <div class="flex-shrink-0" style="width: calc(50vw - 7rem);"></div>
      
      {#each cards as card, index}
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
              src={card.image_url || cardBack} 
              alt={card.name || `Card ${index + 1}`} 
              class="h-80 aspect-[360/504] object-cover pointer-events-none select-none"
              draggable="false"
            />
          </div>
        </div>
      {/each}
      
      <!-- Add Card Button -->
      <div 
        class={cn(
          "carousel-card flex-shrink-0 ease-out cursor-pointer pointer-events-auto snap-center snap-normal origin-center relative",
          focusVisibleRingStyle,
          selectedIndex === cards.length ? "z-20" : "z-10"
        )}
        onclick={handleAddCard}
        onkeydown={handleAddCard}
        role="button"
        tabindex="0"
      >
        <div class={cn(
          "rounded-lg border-2 border-dashed transition-all card-shadow flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-sm",
          "shadow-inner border-muted-foreground/20",
          selectedIndex === cards.length 
            ? "border-primary card-shadow-lg scale-105 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg" 
            : "hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/2 hover:shadow-md"
        )}>
          <div class="flex items-center justify-center">
            <div class={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all",
              "bg-gradient-to-br from-background to-muted/50 shadow-lg border border-border/50",
              "hover:shadow-xl hover:scale-105 active:scale-95",
              selectedIndex === cards.length 
                ? "shadow-xl scale-110 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30" 
                : "hover:border-primary/30"
            )}>
              <svg class="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Spacer to allow last card to be centered -->
      <div class="flex-shrink-0" style="width: calc(50vw - 7rem);"></div>
    </div>
  </div>
  
  <!-- Navigation dots -->
  <div class="flex justify-center gap-1.5 py-3 relative z-10">
    {#each cards as _, index}
      <button
        onclick={(e) => {
          e.stopPropagation();
          const cardElement = cardElements[index];
          if (cardElement) {
            cardElement.scrollIntoView({
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
    <!-- Add card dot -->
    <button
      onclick={(e) => {
        e.stopPropagation();
        const addCardElement = cardElements[cards.length];
        if (addCardElement) {
          addCardElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }
      }}
      class={cn(
        "h-1.5 rounded-full transition-all",
        selectedIndex === cards.length 
          ? "w-6 bg-primary" 
          : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
      )}
      aria-label="Go to add card"
    ></button>
  </div>
</div>
