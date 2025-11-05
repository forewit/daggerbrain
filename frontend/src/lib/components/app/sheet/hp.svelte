<script lang="ts">
  import { cn } from "$lib/utils";
  import { getCharacterContext } from "$lib/ts/character.svelte";

  let { class: className = "" }: { class?: string } = $props();

  const context = getCharacterContext();
  let character = $derived(context.character);
</script>

{#if character}
<div class={cn("flex items-center gap-4 border-2 rounded-md h-12 px-4", className)}>
  <button
    onclick={() => {
      character.ephemeral_stats.marked_hp = 0;
    }}
    class="text-sm font-medium">HP</button
  >
  <div class="flex flex-wrap gap-2">
    {#each Array(context.max_hp) as _, index}
      <button
        aria-label="hp-slot"
        class="w-6 h-3 rounded-md border border-muted-foreground {index < character.ephemeral_stats.marked_hp
          ? 'bg-muted-foreground'
          : 'bg-transparent'} transition-colors"
        onclick={() => {
          if (index + 1 === character.ephemeral_stats.marked_hp) {
            character.ephemeral_stats.marked_hp = Math.max(0, character.ephemeral_stats.marked_hp - 1);
          } else {
            character.ephemeral_stats.marked_hp = index + 1;
          }
        }}
        type="button"
      ></button>
    {/each}
  </div>

  {#if context.max_hp === character.ephemeral_stats.marked_hp}
    <button
      onclick={() => {
        alert("Death Move");
      }}
      class="p-2 text-xs text-nowrap bg-border rounded-md hover:bg-muted-foreground/20 grid place-items-center leading-none"
    >
      Death Move
    </button>
  {/if}
</div>
{/if}