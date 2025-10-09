<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Character } from "./types";

  let {
    class: className = "",
    armor = $bindable(),
  }: { class?: string; armor: Character["armor"] } = $props();
</script>

<div class={cn("flex gap-2 w-[90px] text-center border-2 rounded-md p-2", className)}>
  <div class="">
    <p class="text-lg font-bold">
      {armor.max}
    </p>
    <p class="text-sm font-medium">Armor</p>
  </div>
  <div class="flex flex-wrap justify-center gap-1">
    {#each Array(armor.max) as _, index}
      <button 
      aria-label="armor-slot"
        class="w-4 h-3 rounded-md border border-muted-foreground {index < armor.marked ? 'bg-muted-foreground' : 'bg-transparent'} transition-colors"
        onclick={() => {
          if (index + 1 <= armor.marked) {
            // Clicking current value or lower subtracts 1 (minimum 0)
            armor.marked = Math.max(0, armor.marked - 1);
          } else {
            // Clicking higher adds 1 (maximum of armor max)
            armor.marked = Math.min(armor.max, armor.marked + 1);
          }
        }}
        type="button"
      ></button>
    {/each}
  </div>
</div>
