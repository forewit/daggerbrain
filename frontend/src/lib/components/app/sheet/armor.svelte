<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Character } from "$lib/ts/types";
  import Shield from "@lucide/svelte/icons/shield";

  let {
    class: className = "",
    armor = $bindable(),
  }: { class?: string; armor: Character["armor"] } = $props();
</script>

<div class={cn("flex gap-2 h-min text-center border-2 rounded-md p-2", className)}>
  <div class="">
    <p class="text-lg font-bold">
      {armor.max}
    </p>
    <p class="text-sm font-medium">Armor</p>
  </div>
  <div class="flex flex-wrap items-center gap-x-1 gap-y-0 w-14">
    {#each Array(armor.max) as _, index}
      <button
        aria-label="armor-slot"
        class="size-min outline-offset-2 rounded"
        onclick={() => {
          if (index + 1 === armor.marked) {
            armor.marked = Math.max(0, armor.marked - 1);
          } else {
            armor.marked = index + 1;
          }
        }}
        type="button"
      >
        <Shield
          class="size-4 transition-all text-muted-foreground {index < armor.marked
            ? 'fill-muted-foreground'
            : 'fill-transparent'}"
        />
      </button>
    {/each}
  </div>
</div>
