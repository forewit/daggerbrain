<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Character } from "$lib/ts/types";

  let { class: className = "", evasion = $bindable() }: { class?: string; evasion: number } =
    $props();
</script>

<div class={cn("w-[90px] text-center border-2 rounded-md p-2", className)}>
  <p class="text-lg font-bold">
    {evasion}
  </p>
  <p class="text-sm font-medium">Evasion</p>
</div>
