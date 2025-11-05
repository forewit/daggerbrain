<script lang="ts">
  import { cn } from "$lib/utils";
  import { getCharacterContext } from "$lib/ts/character.svelte";
  
  let { class: className = "" }: { class?: string } = $props();

  const context = getCharacterContext();
  let evasion = $derived(context.evasion);
</script>

<div class={cn("w-[90px] text-center border-2 rounded-md p-2", className)}>
  <p class="text-lg font-bold">
    {evasion}
  </p>
  <p class="text-sm font-medium">Evasion</p>
</div>
