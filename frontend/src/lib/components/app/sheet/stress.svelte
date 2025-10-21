<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Character } from "$lib/ts/types";

  let { class: className = "", character = $bindable() }: { class?: string; character: Character } = $props();
</script>

<div class={cn("flex items-center gap-4 border-2 rounded-md h-12 px-4", className)}>
  <button
    onclick={() => {
      character.ephemeral_stats.marked_stress = 0;
    }}
    class="text-sm font-medium">STRESS</button
  >
  <div class="flex flex-wrap gap-2">
    {#each Array(character.derieved_stats.max_stress) as _, index}
      <button
        aria-label="character.stress-slot"
        class="w-6 h-3 rounded-md border border-muted-foreground {index <
        character.ephemeral_stats.marked_stress
          ? 'bg-muted-foreground'
          : 'bg-transparent'} transition-colors"
        onclick={() => {
          if (index + 1 === character.ephemeral_stats.marked_stress) {
            character.ephemeral_stats.marked_stress = Math.max(
              0,
              character.ephemeral_stats.marked_stress - 1
            );
          } else {
            character.ephemeral_stats.marked_stress = index + 1;
          }
        }}
        type="button"
      ></button>
    {/each}
  </div>

  {#if character.derieved_stats.max_stress === character.ephemeral_stats.marked_stress}
    <button
      onclick={() => {
        if (character.ephemeral_stats.marked_hp < character.derieved_stats.max_hp)
          character.ephemeral_stats.marked_hp++;
      }}
      class="p-2 text-xs text-nowrap bg-border rounded-md hover:bg-muted-foreground/20 grid place-items-center leading-none"
    >
      Mark HP
    </button>
  {/if}
</div>
