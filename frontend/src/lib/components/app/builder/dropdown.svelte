<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";

  let {
    class: className = "",
    title = "",
    subtitle = "",
    children,
  }: { class?: string; title?: string; subtitle?: string; children?: Snippet } = $props();

  let open = $state(false);
</script>

<div class="relative">
  <button
    class={cn(
      "truncate z-10 w-full px-6 border-b bg-primary-muted relative rounded-lg h-14 flex items-center",
      className
    )}
    onclick={() => (open = !open)}
  >
    <p class="text-lg font-medium">{title}</p>
    <p class="truncate font-normal pl-4 text-muted-foreground ml-auto mr-3 text-sm">{subtitle}</p>
    <ChevronLeft class={cn("shrink-0 text-muted-foreground size-5 transition-all", open && "-rotate-90")} />
  </button>

  {#if open}
    <div class="z-5 -mt-2 relative p-4 pt-6 rounded-b-lg border-b bg-primary/5">
      {@render children?.()}
    </div>
  {/if}
</div>
