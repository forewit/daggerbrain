<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import Label from "$lib/components/ui/label/label.svelte";

  let { data } = $props();

  const app = getAppContext();
  const character = $derived(app.characters.find((c) => c.uid === data.uid));
</script>

<div
  class={cn(
    "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
    "max-w-6xl mx-auto px-4 py-2"
  )}
>
  <p class="text-2xl font-bold py-2">Experiences</p>

  <div class="flex flex-col gap-4 text-nowrap">
    <Label>Experiences</Label>
    <Label>Description</Label>
    <Label>Background Questions</Label>
    <Label>Connections</Label>
  </div>
</div>
