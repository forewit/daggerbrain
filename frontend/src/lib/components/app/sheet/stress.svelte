<script lang="ts">
  import { cn } from "$lib/utils";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";

  let {
    class: className = "",
    displayOnly = false,
    slotClasses = "",
  }: {
    class?: string;
    displayOnly?: boolean;
    slotClasses?: string;
  } = $props();

  const context = getCharacterContext();
  let character = $derived(context.character);
</script>

{#if character}
<div
  class={cn(
    "flex items-center gap-4 border-2 rounded-md h-12 px-4",
    displayOnly && "pointer-events-none",
    className
  )}
>
  <button
    onclick={() => {
      character.ephemeral_stats.marked_stress = 0;
    }}
    class="text-sm font-medium">STRESS</button
  >
  <div class="flex flex-wrap gap-2">
    {#each Array(context.max_stress) as _, index}
      <button
        aria-label="character.stress-slot"
        class={cn(
          "w-6 h-3 rounded-md border border-muted-foreground transition-colors",
          index < character.ephemeral_stats.marked_stress
            ? "bg-muted-foreground"
            : "bg-transparent",
          slotClasses
        )}
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

  {#if context.max_stress === character.ephemeral_stats.marked_stress && !displayOnly}
    <button
      onclick={() => {
        if (character.ephemeral_stats.marked_hp < context.max_hp)
          character.ephemeral_stats.marked_hp++;
      }}
      class="p-2 text-xs text-nowrap bg-border rounded-md hover:bg-muted-foreground/20 grid place-items-center leading-none"
    >
      Mark HP
      </button>
    {/if}
  </div>
{/if}
