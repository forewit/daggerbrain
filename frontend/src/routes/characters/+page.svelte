<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import CharacterPreview from "$lib/components/app/CharacterPreview.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  const app = getAppContext();
</script>

<svelte:head>
  <title>Characters</title>
</svelte:head>

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
      <!-- Header Section -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <Button variant="outline" href="/" size="sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back
          </Button>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-foreground">
              Characters
            </h1>
            <p class="text-xs text-muted-foreground">
              {app.characters.length} character{app.characters.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
        <Button onclick={() => app.newCharacter()} size="sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          New Character
        </Button>
      </div>
      
      <!-- Characters Grid -->
      {#if app.characters.length === 0}
        <div class="bg-card border border-border rounded-lg p-12 text-center max-w-md mx-auto card-shadow">
          <div class="text-4xl mb-4">🎭</div>
          <h2 class="text-lg font-semibold mb-2">No characters yet</h2>
          <p class="text-sm text-muted-foreground mb-6">
            Create your first character to get started
          </p>
          <Button onclick={() => app.newCharacter()}>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create Character
          </Button>
        </div>
      {:else}
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {#each app.characters as character (character.uid)}
            <CharacterPreview characterUid={character.uid} />
          {/each}
        </div>
      {/if}
    </div>
  </div>
</main>
