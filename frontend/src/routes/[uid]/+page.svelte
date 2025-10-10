<script lang="ts">
  import { cn } from "$lib/utils";
  import { getAppContext } from "$lib/ts/app.svelte";
  import Sheet from "$lib/components/app/sheet/sheet.svelte";

  const app = getAppContext();

  let { data } = $props();
</script>

<main
  style="scrollbar-width: none;"
  class={cn(
    app.pwa ? "h-lvh w-lvw" : "h-dvh w-dvw",
    "relative snap-y snap-mandatory overflow-y-auto overflow-x-hidden"
  )}
>
  <!-- Background -->
  <div
    class={cn(
      "pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
    )}
  >
    <Sheet characterUid={data.uid || ""} class="mb-24" />
  </div>
</main>
