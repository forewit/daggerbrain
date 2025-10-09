<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Character } from "./types";
  import Check from "@lucide/svelte/icons/check";

  let { class: className = "", character = $bindable() }: { class?: string; character: Character } =
    $props();
</script>

<div class={cn("flex flex-col justify-center text-center gap-2", className)}>
  <p class="text-sm font-medium text-accent">HOPE</p>
  <div class="justify-center flex flex-wrap gap-4">
    {#each Array(character.hope.max) as _, index}
      <button
        aria-label="hope-slot"
        class={cn(
          "w-[16px] h-[16px] rounded-[2px] aspect-square border border-accent transition-all duration-300 transform rotate-45",
          index < character.hope.marked ? "bg-accent" : "bg-transparent",
          character.hope.marked === character.hope.max &&
            "shadow-[0_0_8px_rgba(253,212,113,0.4),0_0_16px_rgba(253,212,113,0.2)]"
        )}
        onclick={() => {
          if (index + 1 <= character.hope.marked) {
            // Clicking current value or lower subtracts 1 (minimum 0)
            character.hope.marked = Math.max(0, character.hope.marked - 1);
          } else {
            // Clicking higher adds 1 (maximum of hp max)
            character.hope.marked = Math.min(character.hope.max, character.hope.marked + 1);
          }
        }}
        type="button"
      ></button>
    {/each}
  </div>

  <div class="relative mx-auto">
    <button
      class="text-sm p-3 relative"
      onclick={() => {
        if (character.hope.marked >= 3) {
          character.hope.marked -= 3;
        }
      }}
    >
      <span class="italic font-medium pr-1">{character.class.hope_feature.title}:</span>
      {@html character.class.hope_feature.description}
    </button>
  </div>
</div>
