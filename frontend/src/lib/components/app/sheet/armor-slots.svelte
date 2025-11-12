<script lang="ts">
  import { cn } from "$lib/utils";
  import Shield from "@lucide/svelte/icons/shield";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";

  let { class: className = "" }: { class?: string } = $props();

  const context = getCharacterContext();
  let character = $derived(context.character);
</script>

{#if character}
<div class={cn("flex gap-2 h-min text-center border-2 rounded-md p-2", className)}>
  <button onclick={() => (character.ephemeral_stats.marked_armor = 0)}>
    <p class="text-lg font-bold">
      {context.max_armor}
    </p>
    <p class="text-sm font-medium">Armor</p>
  </button>
  <div
    class={cn(
      "grid grid-cols-4 place-items-center gap-x-1 gap-y-1.5 my-auto",
      context.max_armor === 0 && "hidden",
      context.max_armor < 7 && "grid-cols-3",
      context.max_armor < 3 && "grid-cols-2",
      context.max_armor < 2 && "grid-cols-1"
    )}
  >
    {#each Array(context.max_armor) as _, index}
      <button
        aria-label="armor-slot"
        class="size-min outline-offset-2 rounded"
        onclick={() => {
          if (index + 1 === character.ephemeral_stats.marked_armor) {
            character.ephemeral_stats.marked_armor = Math.max(0, character.ephemeral_stats.marked_armor - 1);
          } else {
            character.ephemeral_stats.marked_armor = index + 1;
          }
        }}
        type="button"
      >
        <Shield
          class="size-4 transition-all text-muted-foreground {index < character.ephemeral_stats.marked_armor
            ? 'fill-muted-foreground'
            : 'fill-transparent'}"
        />
      </button>
    {/each}
  </div>
</div>
{/if}
