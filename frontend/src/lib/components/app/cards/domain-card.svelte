<script lang="ts">
  import type { Card } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";
  import DomainBanner from "./domain-banner.svelte";
  import { DOMAINS } from "$lib/ts/constants";

  let {
    card = $bindable(),
    class: className = "",
    children,
  }: {
    card: Card<"domain">;
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
  <div class="flex-1 min-w-[60px] max-w-[180px] border-r-2 border-accent relative">
    <div
      style=""
      class={cn(
        "scale-90 shadow-lg text-white  absolute top-1 left-1 size-9.5 border-2 border-accent rounded-full bg-gray-800",
        card.recall_cost > 9 && "size-12"
      )}
    >
      <div
        class="pb-0.5 border border-gray-500 rounded-full size-full flex items-center justify-center"
      >
        <p class="text-lg font-medium text-right pt-1 pl-1">{card.recall_cost}</p>
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 16 16"
          class="size-3 shrink-0"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"
          ></path></svg
        >
      </div>
    </div>

    <img src={card.image_url} alt="art" class="h-full object-cover" />
  </div>

  <!-- content -->
  <div class="flex-2 flex flex-col gap-2 px-3 py-2 ">
    <!-- title and community label -->
    <div class="relative flex flex-row-reverse flex-wrap gap-2 justify-between">
      <div class="mr-auto shadow-md px-2 py-1 bg-accent rounded h-min">
        <p class="text-xs uppercase text-black tracking-[2px] font-bold">{card.type}</p>
      </div>

      <p class="grow text-wrap text-xl font-eveleth uppercase">
        {card.title}
      </p>


    </div>


    <!-- features -->
    {#each card.features as feature}
      <p class="text-xs">
        {@html feature.description_html}
      </p>
    {/each}
    {@render children?.()}
  </div>

  <!-- banner -->
   <div class="shrink-0">
    <DomainBanner
    domain_name={card.domain_name as keyof typeof DOMAINS}
    level_requirement={card.level_requirement}
    style="zoom: 0.75"
  />
   </div>
  
</div>
