<script lang="ts">
    import { getAppContext } from "$lib/ts/app.svelte";
    import DeckCarousel from "$lib/components/app/DeckCarousel.svelte";
    import { cn, fileToDataUrl } from "$lib/utils";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import { page } from "$app/stores";
    import { tick } from "svelte";
    
    let { data } = $props();
  
    const app = getAppContext();
  
    const character = $derived(app.characters.find((c) => c.uid === data.characterUid));
    
    // Read card index from URL parameter reactively
    const cardIndexFromUrl = $derived.by(() => {
      const cardParam = $page.url.searchParams.get('card');
      if (cardParam !== null) {
        const cardIndex = parseInt(cardParam, 10);
        if (!isNaN(cardIndex) && cardIndex >= 0) {
          return cardIndex;
        }
      }
      return 0;
    });
    
    let selectedIndex = $state(0);
    let fileInput = $state<HTMLInputElement>();
    let deleteDialogOpen = $state(false);
    let scrollToIndex: ((index: number, behavior?: ScrollBehavior) => void) | undefined = $state();
    
    // When URL changes or scrollToIndex becomes available, scroll to the card from URL
    $effect(() => {
      const targetIndex = cardIndexFromUrl;
      if (scrollToIndex && targetIndex > 0) {
        // Wait for DOM to be fully rendered before scrolling
        tick().then(() => {
          if (scrollToIndex) {
            scrollToIndex(targetIndex, 'auto');
          }
        });
      }
    });
    
    // Handle file upload
    async function handleFileUpload(event: Event) {
      if (!character) return;
      
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file && file.type.startsWith("image/")) {
        try {
          const dataUrl = await fileToDataUrl(file);
          character.deck.urls.push(dataUrl);
          // Reset the input
          target.value = "";
          
          // Scroll to the newly added card
          const newCardIndex = character.deck.urls.length - 1;
          if (scrollToIndex) {
            scrollToIndex(newCardIndex);
          }
        } catch (error) {
          console.error("Error converting file to data URL:", error);
        }
      }
    }
    
    // Delete the currently selected card
    function deleteCurrentCard() {
      if (!character || character.deck.urls.length === 0) return;
      
      character.deck.urls.splice(selectedIndex, 1);
      
      // Adjust selected index if needed
      if (selectedIndex >= character.deck.urls.length && character.deck.urls.length > 0) {
        selectedIndex = character.deck.urls.length - 1;
      }
      
      deleteDialogOpen = false;
    }
    
    // Trigger file input
    function triggerFileInput() {
      fileInput?.click();
    }
  </script>

  
  {#if character}
    <!-- Page -->
    <main
      style="scrollbar-width: none;"
      class={cn(
        app.pwa ? "h-lvh w-lvw" : "h-dvh w-dvw",
        "relative overflow-y-auto overflow-x-hidden flex flex-col"
      )}
    >
      <div
        class={cn(
          "pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
          "flex-1 flex flex-col"
        )}
      >
        <!-- Header -->
        <div class="p-4 sm:p-6">
          <div class="max-w-7xl mx-auto flex items-center gap-3 mb-4">
            <Button variant="outline" href="/characters/{data.characterUid}" size="sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back
            </Button>
            <div>
              <h1 class="text-lg sm:text-xl font-semibold text-foreground">
                {character.name || 'Character'}'s Deck
              </h1>
              <p class="text-xs text-muted-foreground">{character.deck.urls.length} cards</p>
            </div>
          </div>
        </div>

        <!-- Carousel -->
        <div class="flex-1 flex flex-col items-center justify-center w-full overflow-hidden min-h-0 py-4">
          {#if character.deck.urls.length === 0}
            <div class="w-full text-center px-4">
              <div class="bg-card border border-border rounded-lg p-8 sm:p-12 max-w-md mx-auto card-shadow">
                <div class="text-5xl mb-4 opacity-40">🃏</div>
                <h2 class="text-xl font-semibold mb-2">No cards yet</h2>
                <p class="text-sm text-muted-foreground mb-6">
                  Start building your deck by adding your first card
                </p>
                <Button 
                  onclick={triggerFileInput}
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Add Your First Card
                </Button>
              </div>
            </div>
          {:else}
            <div class="flex-1 flex items-center w-full overflow-hidden min-h-0">
              <DeckCarousel deck={character.deck} bind:selectedIndex bind:scrollToIndex class="w-full" />
            </div>
            
            <!-- Action Buttons Below Card -->
            <div class="flex items-center justify-center gap-4 py-4 px-4">
              <Button 
                onclick={triggerFileInput}
                size="sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add Card
              </Button>
              <Button 
                variant="link" 
                onclick={() => deleteDialogOpen = true}
                disabled={character.deck.urls.length === 0}
                class="text-destructive hover:text-destructive/80 p-0 h-auto"
                size="sm"
              >
                Delete Card
              </Button>
            </div>
          {/if}
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
            Are you sure you want to delete this card? This action cannot be undone.
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
  