<script lang="ts">
    import { getAppContext } from "$lib/ts/app.svelte";
    import DeckCarousel from "$lib/components/app/DeckCarousel.svelte";
    import type { Card } from "$lib/ts/types";
    import { cn, fileToDataUrl } from "$lib/utils";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    
    let { data } = $props();
  
    const app = getAppContext();
  
    const character = $derived(app.characters.find((c) => c.uid === data.characterUid));
    
    let currentCardType = $state<'heritage' | 'domain' | 'class'>('heritage');
    let selectedIndices = $state({ heritage: 0, domain: 0, class: 0 });
    let fileInput = $state<HTMLInputElement>();
    let deleteDialogOpen = $state(false);
    let scrollContainer = $state<HTMLDivElement>();
    
    const cardTypes = [
      { key: 'heritage' as const, label: 'Heritage' },
      { key: 'domain' as const, label: 'Domain' },
      { key: 'class' as const, label: 'Class' },
    ];
    
    // Handle file upload
    async function handleFileUpload(event: Event) {
      if (!character) return;
      
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file && file.type.startsWith("image/")) {
        try {
          const dataUrl = await fileToDataUrl(file);
          const newCard: Card = { name: "", image_url: dataUrl };
          character.deck[currentCardType].push(newCard);
          // Reset the input
          target.value = "";
        } catch (error) {
          console.error("Error converting file to data URL:", error);
        }
      }
    }
    
    // Delete the currently selected card
    function deleteCurrentCard() {
      if (!character) return;
      
      const currentCards = character.deck[currentCardType];
      const currentIndex = selectedIndices[currentCardType];
      
      if (currentCards.length === 0) return;
      
      currentCards.splice(currentIndex, 1);
      
      // Adjust selected index if needed
      if (currentIndex >= currentCards.length && currentCards.length > 0) {
        selectedIndices[currentCardType] = currentCards.length - 1;
      }
      
      deleteDialogOpen = false;
    }
    
    // Trigger file input
    function triggerFileInput() {
      fileInput?.click();
    }
    
    // Create add card handler for specific card type
    function createAddCardHandler(cardType: 'heritage' | 'domain' | 'class') {
      return () => {
        currentCardType = cardType;
        fileInput?.click();
      };
    }
    
    // Handle scroll to update current card type
    function handleScroll() {
      if (!scrollContainer) return;
      
      const scrollTop = scrollContainer.scrollTop;
      const containerHeight = scrollContainer.clientHeight;
      const scrollPercentage = scrollTop / (scrollContainer.scrollHeight - containerHeight);
      
      const sectionIndex = Math.round(scrollPercentage * (cardTypes.length - 1));
      currentCardType = cardTypes[Math.max(0, Math.min(sectionIndex, cardTypes.length - 1))].key;
    }
  </script>

  
  {#if character}
    <!-- Page -->
    <main
      class={cn(
        app.pwa ? "h-lvh w-lvw" : "h-dvh w-dvw",
        "relative overflow-hidden flex flex-col"
      )}
    >
      <div
        class={cn(
          "pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
          "flex-1 flex flex-col overflow-hidden"
        )}
      >
        <!-- Header -->
        <div class="p-4 sm:p-6 flex-shrink-0">
          <div class="max-w-7xl mx-auto flex items-center gap-3">
            <Button variant="outline" href="/characters/{data.characterUid}" size="sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back
            </Button>
            <div class="flex-1">
              <h1 class="text-lg sm:text-xl font-semibold text-foreground">
                {character.name || 'Character'}'s Deck
              </h1>
              <p class="text-xs text-muted-foreground capitalize">{currentCardType} Cards</p>
            </div>
          </div>
        </div>

        <!-- Vertical Scrolling Carousels -->
        <div 
          bind:this={scrollContainer}
          onscroll={handleScroll}
          class="flex-1 overflow-y-auto overflow-x-hidden snap-y snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {#each cardTypes as { key, label }}
            <div class="flex-shrink-0 snap-start snap-always flex flex-col">

              
              <!-- Carousel Container -->
              <div class="flex-1 flex flex-col items-center justify-center">
                <DeckCarousel 
                  cards={character.deck[key]} 
                  bind:selectedIndex={selectedIndices[key]} 
                  onAddCard={createAddCardHandler(key)}
                  class="w-full" 
                />
              </div>
            </div>
          {/each}
        </div>
        
        <!-- Fixed Action Buttons -->
        <div class="flex-shrink-0 flex items-center justify-center gap-4 py-4 px-4 border-t border-border bg-background">
          <Button 
            variant="link" 
            onclick={() => deleteDialogOpen = true}
            disabled={character.deck[currentCardType].length === 0}
            class="text-destructive hover:text-destructive/80 p-0 h-auto"
            size="sm"
          >
            Delete Card
          </Button>
        </div>
        
        <!-- Hidden file input -->
        <input
          bind:this={fileInput}
          type="file"
          accept="image/*"
          onchange={handleFileUpload}
          class="hidden"
        />
      </div>
    </main>
    
    <!-- Delete Confirmation Dialog -->
    <Dialog.Root bind:open={deleteDialogOpen}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Delete Card</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to delete this {currentCardType} card? This action cannot be undone.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Button variant="outline" onclick={() => deleteDialogOpen = false}>
            Cancel
          </Button>
          <Button variant="destructive" onclick={deleteCurrentCard}>
            Delete
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  {/if}
  