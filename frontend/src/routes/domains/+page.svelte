<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";

  const app = getAppContext();
</script>


  <div
    class={cn(
      "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "max-w-6xl mx-auto px-4 py-2"
      )}
  >
    <p class="text-2xl font-bold py-2">Domains</p>
    <p class="text-xs italic font-muted-foreground">Under construction</p>
  </div>
