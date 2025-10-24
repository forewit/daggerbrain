<script lang="ts">
  import type { Card } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";

  let {
    card = $bindable(),
    class: className = "",
    variant = "responsive",
    children,
  }: {
    card: Card<"community">;
    variant?: "responsive" | "card";
    class?: string;
    children?: Snippet;
  } = $props();

  let clientWidth = $state(360);
</script>

{#if variant === "responsive"}
  <div
    class={cn(
      "text-left flex overflow-hidden border-accent border-2 rounded-xl bg-white text-black",
      className
    )}
  >
    <!-- image -->
    <div class="flex-1 min-w-[60px] max-w-[180px] border-r-2 border-accent">
      <img src={card.image_url} alt="art" class="h-full w-full object-cover" />
    </div>

    <!-- content -->
    <div class="flex-2 flex flex-col gap-2 px-3 py-2">
      <!-- title and community label -->
      <div class="relative flex gap-2 justify-between">
        <p class="text-xl font-eveleth uppercase">
          {card.title}
        </p>

        <div class="shadow-md px-2 py-1 bg-accent rounded h-min">
          <p class=" text-xs uppercase text-black tracking-[2px] font-bold">Community</p>
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
{:else if variant === "card"}
  <div
    class={cn("text-left max-w-[360px] min-w-[140px]", className)}
    style="height: {(clientWidth * 503) / 360}px;"
    bind:clientWidth
  >
    <div
      class="flex flex-col h-[503px] w-[360px] bg-white rounded-[24px] border-[4px] border-accent overflow-hidden"
      style="transform: scale({clientWidth / 360}); transform-origin: top left;"
    >
      <!-- image and divider -->
      <div
        class="max-h-[55%] grow relative shrink"
        style="background-image: url({card.image_url}); background-size: cover; background-position: center;"
      >
        <img
          src="/images/card/dividers/communities-divider.webp"
          alt="divider"
          class="absolute bottom-0 left-0 w-full object-cover"
        />
        <p
          class="absolute uppercase leading-none bottom-[24px] right-[36px] text-[10px] text-black tracking-[2px] font-medium"
        >
          Community
        </p>
      </div>

      <!-- content -->
      <div class="flex flex-col shrink-0 gap-[6px] px-[12px] pb-[6px] pt-[14px]">
        <p class="z-5 font-eveleth uppercase text-[26px] text-black leading-none">{card.title}</p>
        <p class="italic text-[12px] text-black">
          {@html card.description_html}
        </p>
        {#each card.features as feature}
          <p class="text-[12px] text-black">
            <b><em>{feature.title}:</em></b>
            {@html feature.description_html}
          </p>
        {/each}
      </div>

      <!-- credits -->
      <div class="flex items-end px-3 pb-2 mt-auto leading-none shrink-0">
        <img src="/images/card/quill-icon.png" alt="quill" class="size-[14px]" />
        <p class="text-[9px] italic text-black grow">{card.artist_name}</p>
        <p class="text-[8px] px-[2px] text-muted-foreground italic text-black">
          Daggerheart™ Compatible. Terms at Daggerheart.com
        </p>
        <img src="/images/card/cgl-logo.svg" alt="CGL" class="size-[16px]" />
      </div>
    </div>
  </div>
{/if}
