<script lang="ts">
  import { cn } from "$lib/utils";
  import Shield from "@lucide/svelte/icons/shield";
  import type { Armor } from "$lib/ts/character/types";

  let { armor, class: className = "" }: { armor: Armor; class?: string } = $props();
</script>

<div class={cn("bg-card/50 rounded-md px-4 min-h-10 py-2 flex justify-end items-center gap-3", className)}>
  <p class="text-sm grow">{armor.title}</p>

  <div class="flex flex-wrap items-center gap-1 justify-end">
    <div
      class="text-xs flex items-center gap-1 bg-primary-muted rounded-full px-2 py-1"
    >
      {armor.max_armor}<Shield class="size-3.5" />
    </div>
    <div class="text-xs bg-primary-muted rounded-full px-2 py-1">
      {armor.damage_thresholds.major} / {armor.damage_thresholds.severe}
    </div>
  </div>
</div>


