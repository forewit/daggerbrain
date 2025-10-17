<script lang="ts">
  import type { Card } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";

  let {
    card = $bindable(),
    class: className = "",
    children,
  }: {
    card: Card<"transformation">;
    class?: string;
    children?: Snippet;
  } = $props();
</script>

<div
  class={cn(
    "flex overflow-hidden border-accent border-2 rounded-xl bg-white text-black",
    className
  )}
>
  <!-- image -->
  <div class="flex-1 max-w-[180px] border-r-2 border-accent">
    <img src={card.image_url} alt="art" class="h-full object-cover" />
  </div>

  <!-- content -->
  <div class="flex-2 flex flex-col gap-2 px-3 py-2">
    <!-- title and transformation label -->
    <div class="relative flex gap-2 justify-between">
      <p class="text-xl font-eveleth uppercase">
        {card.title}
      </p>

      <div class="shadow-md px-2 py-1 bg-accent rounded h-min">
        <p class=" text-xs uppercase text-black tracking-[2px] font-bold">Transformation</p>
      </div>  
    </div>

    <!-- description -->
    <p class="italic text-xs">
      {@html card.description_html}
    </p>

    <!-- features -->
    {#each card.features as feature}
      <p class="text-xs">
        <b><em>{feature.title}:</em></b>
        {@html feature.description_html}
      </p>
    {/each}
    {@render children?.()}
  </div>
</div>
