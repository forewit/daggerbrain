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
      "max-w-6xl mx-auto p-2"
    )}
  >
    <p class="text-2xl font-bold py-2">Class</p>

    <div class="flex flex-col gap-4 text-nowrap">
      <Label>Level</Label>
      <Label>Class</Label>
      <Label>Subclass</Label>
      <Label>Domain Cards</Label>
    </div>
  </div>
{/if}
