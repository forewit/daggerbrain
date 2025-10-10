<script lang="ts">
    import type { Card } from "$lib/ts/types";
    import { cn, focusVisibleRingStyle } from "$lib/utils";
    import { onMount, tick } from "svelte";

    let { 
      class: className = "", 
      cards = $bindable(),
      selectedIndex = $bindable(0),
      scrollToIndex = $bindable<((index: number) => void) | undefined>()
    }: { 
      class?: string; 
      cards: Card<any>[];
      selectedIndex?: number;
      scrollToIndex?: (index: number) => void;
    } = $props();

    // Initialize cards if empty with placeholder
    if (!cards || cards.length === 0) {
      cards = [{ 
        image_url: "", 
        full_card_image_url: "", 
        title: "", 
        description: "" 
      } as Card<any>];
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
        closestIndex = Math.min(cardElements.length - 1, cards.length - 1);
      }
      
      selectedIndex = closestIndex;
    }
  
    // Scroll to a specific card when clicked
    function scrollToCard(event: MouseEvent | KeyboardEvent) {
      const card = event.currentTarget as HTMLElement;
      card.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  
    // Public method to scroll to a specific card by index
    async function scrollToCardByIndex(index: number) {
      await tick();
      // Refresh cards array in case new cards were added
      if (scrollContainer) {
        cardElements = Array.from(scrollContainer.querySelectorAll('.carousel-card'));
      }
      if (cardElements[index]) {
        cardElements[index].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
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
      class="relative overflow-x-auto overflow-y-hidden py-2 px-4 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style="perspective: 1200px; -webkit-overflow-scrolling: touch;"
    >
      <div class="flex gap-3 sm:gap-4 items-center justify-start min-w-max">
        <!-- Spacer to allow first card to be centered -->
        <div class="flex-shrink-0" style="width: calc(50vw - 7rem);"></div>
        
        {#each cards as card, index}
          <div 
            class={cn(
              "carousel-card flex-shrink-0 ease-out cursor-pointer snap-center snap-normal origin-center relative",
              focusVisibleRingStyle,
              selectedIndex === index ? "z-20" : "z-10"
            )}
            onclick={scrollToCard}
            onkeydown={handleKeyDown}
            role="button"
            tabindex="0"
          >
            <div class={cn(
              "rounded-xl overflow-hidden transition-all card-shadow",
            )}>
              <img 
                src={card.full_card_image_url || card.image_url || "/assets/card/card-back.png"} 
                alt={card.title || `Card ${index + 1}`} 
                class="h-80 aspect-[360/504] object-cover select-none"
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
    </div>
  </div>