<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Character } from "$lib/ts/types";

  let { class: className = "", hp = $bindable() }: { class?: string; hp: Character["hp"] } =
    $props();
</script>

<div class={cn("flex items-center gap-4 border-2 rounded-md h-12 px-4", className)}>
  <p class="text-sm font-medium">HP</p>
  <div class="flex flex-wrap gap-2">
    {#each Array(hp.max) as _, index}
      <button
        aria-label="hp-slot"
        class="w-6 h-3 rounded-md border border-muted-foreground {index < hp.marked
          ? 'bg-muted-foreground'
          : 'bg-transparent'} transition-colors"
        onclick={() => {
          if (index + 1 <= hp.marked) {
            // Clicking current value or lower subtracts 1 (minimum 0)
            hp.marked = Math.max(0, hp.marked - 1);
          } else {
            // Clicking higher adds 1 (maximum of hp max)
            hp.marked = Math.min(hp.max, hp.marked + 1);
          }
        }}
        type="button"
      ></button>
    {/each}
  </div>

  {#if hp.max === hp.marked}
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
