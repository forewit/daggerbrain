<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";

  let {
    class: className = "",
    title = "",
    subtitle = "",
    disabled = false,
    highlighted = false,
    title_snippet = null,
    subtitle_snippet = null,
    children,
  }: {
    class?: string;
    title?: string;
    title_snippet?: Snippet | null;
    subtitle?: string;
    subtitle_snippet?: Snippet | null;
    disabled?: boolean;
    highlighted?: boolean;
    children?: Snippet;
  } = $props();

  let open = $state(false);
</script>

<div
  class={cn(
    "relative",
    highlighted && !disabled && "outline-2 outline-primary outline-offset-2 rounded-lg"
  )}
>
  <button
    class={cn(
      "truncate h-14 z-10 w-full px-6 border-b bg-primary-muted relative rounded-lg flex items-center",
      disabled && "opacity-50 pointer-events-none",
      className
    )}
    onclick={() => (open = !open)}
    {disabled}
  >
    <!-- title -->
    {#if title_snippet}
      {@render title_snippet?.()}
    {:else}
      <p class="text-lg font-medium">{title}</p>
    {/if}

    <!-- subtitle -->
    <div class="ml-auto truncate pl-4 mr-3">
      {#if subtitle_snippet}
        {@render subtitle_snippet?.()}
      {:else}
        <p class="truncate font-normal text-muted-foreground text-sm">{subtitle}</p>
      {/if}
    </div>
    <ChevronLeft
      class={cn("shrink-0 text-muted-foreground size-5 transition-all", open && "-rotate-90")}
    />
  </button>

  {#if open && !disabled}
    <div class="z-5 -mt-2 relative p-4 pt-6 rounded-b-lg border-b border-x bg-primary/5">
      {@render children?.()}
    </div>
  {/if}
</div>
