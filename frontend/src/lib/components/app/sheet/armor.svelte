<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Character } from "$lib/ts/types";
  import Shield from "@lucide/svelte/icons/shield";

  let {
    class: className = "",
    max_armor,
    marked_armor = $bindable(),
  }: { class?: string; max_armor: number; marked_armor: number } = $props();

</script>

<div class={cn("flex gap-2 h-min text-center border-2 rounded-md p-2", className)}>
  <button onclick={() => (marked_armor = 0)}>
    <p class="text-lg font-bold">
      {max_armor}
    </p>
    <p class="text-sm font-medium">Armor</p>
  </button>
  <div
    class={cn(
      "grid grid-cols-4 place-items-center gap-x-1 gap-y-1.5 my-auto",
      max_armor === 0 && "hidden",
      max_armor < 7 && "grid-cols-3",
      max_armor < 3 && "grid-cols-2",
      max_armor < 2 && "grid-cols-1"
    )}
  >
    {#each Array(max_armor) as _, index}
      <button
        aria-label="armor-slot"
        class="size-min outline-offset-2 rounded"
        onclick={() => {
          if (index + 1 === marked_armor) {
            marked_armor = Math.max(0, marked_armor - 1);
          } else {
            marked_armor = index + 1;
          }
        }}
        type="button"
      >
        <Shield
          class="size-4 transition-all text-muted-foreground {index < marked_armor
            ? 'fill-muted-foreground'
            : 'fill-transparent'}"
        />
      </button>
    {/each}
  </div>
</div>
