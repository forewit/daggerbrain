<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import Label from "$lib/components/ui/label/label.svelte";

  let { data } = $props();

  const app = getAppContext();
  const character = $derived(app.characters.find((c) => c.uid === data.uid));
</script>

{#if character}
<div
class={cn(
  "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
  "max-w-2xl mx-auto"
)}
>
<div class="m-4 flex flex-col gap-4">
  <p class="text-2xl font-medium pb-2 border-b">Equipment</p>

  <Label>Weapons</Label>
  <Label>Armor</Label>
  <Label>Inventory</Label>
  <Label>Gold</Label>
</div>
</div>
{/if}
