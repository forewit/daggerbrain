<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Class } from "$lib/ts/types";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";

  let {
    class: className = "",
    characterClass = $bindable(),
  }: { class?: string; characterClass: Class } = $props();

  let expanded = $state(true);
</script>

<div
  class={cn(
    "text-left flex flex-col relative p-4 gap-4 border-2 rounded-md transition-all",
    className
  )}
>
  <button
    onclick={() => (expanded = !expanded)}
    class="z-20 flex items-center text-nowrap text-muted-foreground p-2 absolute bg-background -top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 font-medium"
  >
    {#if expanded}
      <ChevronDown class="w-k h-4" />
    {:else}
      <ChevronRight class="w-k h-4" />
    {/if}
    Class Features
  </button>

  {#if expanded}
  <div class="flex flex-col gap-4">
  {#each characterClass.features as feature}
    <div class="text-sm relative">
      <p class="font-medium text-[1rem] pb-2">{feature.title}</p>
      <div class="pl-2 leading-relaxed flex flex-col gap-2">
        {@html feature.description}
      </div>
    </div>
  {/each}
</div>
  {/if}
</div>
