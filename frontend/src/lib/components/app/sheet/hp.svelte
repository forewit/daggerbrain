<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Character } from "$lib/ts/types";

  let { class: className = "", marked_hp = $bindable(), max_hp }: { class?: string; marked_hp: number; max_hp: number } =
    $props();
</script>

<div class={cn("flex items-center gap-4 border-2 rounded-md h-12 px-4", className)}>
  <button onclick={()=>{marked_hp = 0}} class="text-sm font-medium">HP</button>
  <div class="flex flex-wrap gap-2">
    {#each Array(max_hp) as _, index}
      <button
        aria-label="hp-slot"
        class="w-6 h-3 rounded-md border border-muted-foreground {index < marked_hp
          ? 'bg-muted-foreground'
          : 'bg-transparent'} transition-colors"
        onclick={() => {
          if (index + 1 === marked_hp) {
            marked_hp = Math.max(0, marked_hp - 1);
          } else {
            marked_hp = index + 1;
          }
        }}
        type="button"
      ></button>
    {/each}
  </div>

  {#if max_hp === marked_hp}
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
