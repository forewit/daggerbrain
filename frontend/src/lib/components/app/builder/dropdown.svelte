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
    children,
  }: {
    class?: string;
    title?: string;
    subtitle?: string;
    disabled?: boolean;
    highlighted?: boolean;
    children?: Snippet;
  } = $props();

  let open = $state(false);
</script>

<div class={cn("relative", highlighted && "outline-2 outline-primary outline-offset-2 rounded-lg")}>
  <button
    class={cn(
      "truncate h-14 z-10 w-full px-6 border-b bg-primary-muted relative rounded-lg flex items-center",
      disabled && "opacity-50 pointer-events-none",
      className,

    )}
    onclick={() => (open = !open)}
    {disabled}
  >
    <p class="text-lg font-medium">{title}</p>
    <p class="truncate font-normal pl-4 text-muted-foreground ml-auto mr-3 text-sm">{subtitle}</p>
    <ChevronLeft
      class={cn("shrink-0 text-muted-foreground size-5 transition-all", open && "-rotate-90")}
    />
  </button>

  {#if open && !disabled}
    <div class="z-5 -mt-2 relative p-4 pt-6 rounded-b-lg border-b bg-primary/5">
      {@render children?.()}
    </div>
  {/if}
</div>
