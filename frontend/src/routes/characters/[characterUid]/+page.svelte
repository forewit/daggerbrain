<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn, fileToDataUrl } from "$lib/utils";
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import cardBack from "$lib/assets/images/card-back.png";
  
  let { data } = $props();

  const app = getAppContext();

  const character = $derived(app.characters.find((c) => c.uid === data.characterUid));
  
  let deleteDialogOpen = $state(false);
  let imageFileInput = $state<HTMLInputElement>();
  
  function handleDelete() {
    const uid = data.characterUid;
    if (!uid) return;
    app.deleteCharacter(uid);
    goto("/characters");
  }
  
  // Handle image file upload
  async function handleImageUpload(event: Event) {
    if (!character) return;
    
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      try {
        const dataUrl = await fileToDataUrl(file);
        character.image = dataUrl;
        // Reset the input
        target.value = "";
      } catch (error) {
        console.error("Error converting file to data URL:", error);
      }
    }
  }
  
  // Trigger file input
  function triggerImageInput() {
    imageFileInput?.click();
  }
</script>

{#if character}
  <!-- Page -->
  <main
    style="scrollbar-width: none;"
    class={cn(
      app.pwa ? "h-lvh w-lvw" : "h-dvh w-dvw",
      "relative overflow-y-auto overflow-x-hidden"
    )}
  >
    <div
      class={cn(
        "pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
        "p-4 sm:p-6 pb-16"
      )}
    >
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
          <Button variant="outline" href="/characters" size="sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back
          </Button>
          <Input 
            bind:value={character.name} 
            placeholder="Character name"
            class="text-xl sm:text-2xl font-bold h-10 sm:h-11 flex-1"
          />
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
          <!-- Left Column - Character Info -->
          <div class="bg-card border border-border rounded-lg p-4 card-shadow">
            <div class="flex lg:flex-col gap-4">
              <!-- Image Upload Section -->
              <div class="flex-shrink-0 w-32 sm:w-40 lg:w-full">
                {#if character.image}
                  <div class="relative group">
                    <button
                      onclick={triggerImageInput}
                      class="w-full cursor-pointer"
                      type="button"
                    >
                      <div class="aspect-square rounded-lg overflow-hidden bg-muted border border-border card-shadow">
                        <img 
                          src={character.image} 
                          alt={character.name} 
                          class="w-full h-full object-cover"
                        />
                      </div>
                    </button>
                    <button
                      onclick={() => character.image = ""}
                      class="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full w-7 h-7 flex items-center justify-center hover:bg-destructive/90 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                      aria-label="Remove image"
                      type="button"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                {:else}
                  <button
                    onclick={triggerImageInput}
                    class="w-full cursor-pointer hover:border-primary/50 transition-colors"
                    type="button"
                  >
                    <div class="aspect-square rounded-lg bg-muted flex items-center justify-center border border-dashed border-border">
                      <span class="text-4xl lg:text-5xl opacity-40">🎭</span>
                    </div>
                  </button>
                {/if}
              </div>
              
              <!-- Description -->
              <div class="flex-1 flex flex-col gap-3 justify-center lg:justify-start">
                <div class="space-y-2">
                  <Label for="description" class="text-xs font-medium text-muted-foreground uppercase">Description</Label>
                  <Textarea
                    id="description"
                    bind:value={character.description}
                    placeholder="Add a description..."
                    class="min-h-20 lg:min-h-32 resize-none"
                  />
                </div>
                
                <div class="flex justify-end pt-2 border-t border-border">
                  <Button 
                    variant="link" 
                    onclick={() => deleteDialogOpen = true} 
                    class="text-destructive hover:text-destructive/80 p-0 h-auto"
                    size="sm"
                  >
                    Delete Character
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right Column - Deck Preview -->
          <div class="bg-card border border-border rounded-lg p-4 card-shadow">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-sm font-medium">Deck</h2>
              <a 
                href="/characters/{data.characterUid}/deck"
                class="text-xs text-primary hover:underline"
              >
                View all {character.deck.heritage.length + character.deck.domain.length + character.deck.class.length}
              </a>
            </div>
            
            {#if character.deck.heritage.length + character.deck.domain.length + character.deck.class.length === 0}
              <div class="text-center py-16">
                <div class="text-4xl mb-3 opacity-40">🃏</div>
                <p class="text-sm text-muted-foreground mb-4">No cards yet</p>
                <Button 
                  href="/characters/{data.characterUid}/deck"
                  variant="outline"
                  size="sm"
                >
                  Add Cards
                </Button>
              </div>
            {:else}
              <div class="space-y-4">
                {#each [
                  { label: 'Ancestry', cards: character.deck.heritage },
                  { label: 'Domain', cards: character.deck.domain },
                  { label: 'Class', cards: character.deck.class },
                ] as { label, cards }}
                  {#if cards.length > 0}
                    <div>
                      <h3 class="text-xs font-medium text-muted-foreground uppercase mb-2">{label}</h3>
                      <div class="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:thin]">
                        {#each cards as card}
                          <a 
                            href="/characters/{data.characterUid}/deck"
                            class="aspect-[360/504] w-20 sm:w-24 flex-shrink-0 rounded-md overflow-hidden bg-muted border border-border hover:border-primary/50 transition-colors card-shadow snap-start"
                          >
                            <img 
                              src={card.image_url || cardBack} 
                              alt={card.name} 
                              class="w-full h-full object-cover"
                            />
                          </a>
                        {/each}
                      </div>
                    </div>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        </div>
        
        <!-- Hidden file input -->
        <input
          bind:this={imageFileInput}
          type="file"
          accept="image/*"
          onchange={handleImageUpload}
          class="hidden"
        />
      </div>
    </div>
  </main>
  
  <Dialog.Root bind:open={deleteDialogOpen}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Delete Character</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete "{character.name}"? This action cannot be undone.
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <Button variant="outline" onclick={() => deleteDialogOpen = false}>
          Cancel
        </Button>
        <Button variant="destructive" onclick={handleDelete}>
          Delete
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{/if}
