<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";

  let { class: className = "", characterUid = "" } = $props();

  const app = getAppContext();

  const character = $derived(app.characters.find((c) => c.uid === characterUid));
</script>

{#if character !== undefined}
  <a 
    href="/characters/{characterUid}"
    class={cn(
      "group block bg-card border border-border rounded-lg overflow-hidden transition-all hover:border-primary/50 card-shadow hover:card-shadow-lg",
      className
    )}
  >
    <div class="relative">
      {#if character.image}
        <div class="aspect-square w-full overflow-hidden bg-muted">
          <img 
            src={character.image} 
            alt={character.name} 
            class="w-full h-full object-cover" 
          />
        </div>
      {:else}
        <div class="aspect-square w-full bg-muted flex items-center justify-center">
          <span class="text-4xl opacity-40">🎭</span>
        </div>
      {/if}
    </div>
    
    <div class="p-3">
      <h3 class="text-sm font-semibold text-card-foreground truncate mb-1">
        {character.name || 'Unnamed Character'}
      </h3>
      <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        <span>{character.deck.heritage.length + character.deck.domain.length + character.deck.class.length}</span>
      </div>
    </div>
  </a>
{/if}
