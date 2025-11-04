<script lang="ts">
  import type { Card, Class } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";
  import ClassBanner from "../class-banner.svelte";
  import { CLASSES, DOMAINS } from "$lib/ts/constants/constants";

  let {
    card = $bindable(),
    class: className = "",
    children,
    hideImage = false,
    variant = "responsive",
  }: {
    card: Card<"subclass_foundation" | "subclass_specialization" | "subclass_mastery">;
    class?: string;
    children?: Snippet;
    hideImage?: boolean;
    variant?: "responsive" | "card";
  } = $props();

  let clientWidth = $state(360);

  const character_class = CLASSES[card.class_name as keyof typeof CLASSES];
</script>

{#if variant === "responsive"}
  <div
    class={cn(
      "flex overflow-hidden border-accent border-2 rounded-xl bg-white text-black",
      className
    )}
  >
    <!-- image -->
    {#if !hideImage}
      <div class="flex-1 max-w-[180px] border-r-2 border-accent">
        <img src={card.image_url} alt="art" class="h-full object-cover" />
      </div>
    {/if}

    <!-- content -->
    <div class="flex-2 flex flex-col gap-2 px-3 py-2">
      <!-- title and community label -->
      <div class="relative flex flex-row-reverse flex-wrap gap-x-2 gap-y-3">
        <div class="mx-auto shadow-md px-2 py-1 bg-accent rounded h-min">
          <p class="text-xs uppercase text-black tracking-[2px] font-bold">
            {card.description_html}
          </p>
        </div>

        <p class="grow font-eveleth uppercase">
          {card.title}
        </p>
      </div>

      <!-- spellcast trait -->
      {#if (card as Card<"subclass_foundation">).spellcast_trait}
        <p class="text-xs text-center">
          <b><em>Spellcast Trait:</em></b>
          {(card as Card<"subclass_foundation">).spellcast_trait}
        </p>
      {/if}

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
    class={cn("max-w-[360px] min-w-[140px]", className)}
    style="height: {(clientWidth * 503) / 360}px;"
    bind:clientWidth
  >
    <div
      class="transition-none text-left flex flex-col h-[503px] w-[360px] bg-white rounded-[24px] border-[4px] border-accent overflow-hidden"
      style="transform: scale({clientWidth / 360}); transform-origin: top left;"
    >
      <!-- image and divider -->
      <div
        class="max-h-[55%] grow relative"
        style="background-image: url({card.image_url}); background-size: cover; background-position: center;"
      >
        <img
          src="/images/card/dividers/subclass-divider.png"
          alt="divider"
          class="absolute bottom-0 left-0 w-full object-cover z-4"
        />
        <ClassBanner {character_class} class="absolute -top-[2px] left-[14px] w-[75px]" />

        <div
          style="background: linear-gradient(to right, {DOMAINS[
            character_class.primary_domain as keyof typeof DOMAINS
          ].color}, {DOMAINS[character_class.secondary_domain as keyof typeof DOMAINS].color});"
          class="clip-card-type absolute left-[110px] bottom-[5px] w-[129px] h-[21px]"
        ></div>
        <p
          class="z-5 absolute uppercase leading-none bottom-[9px] left-[175px] -translate-x-1/2 text-[12px] font-bold text-white"
        >
          {character_class.name}
        </p>
      </div>

      <!-- content -->
      <div
        class="z-5 flex flex-col shrink-0 gap-[12px] px-[12px] pb-[6px] pt-[16px] -mt-[2px] bg-white"
      >
        <div class="flex flex-col gap-[4px]">
          <p class="font-eveleth text-center uppercase text-[20px] text-black leading-none">
            {card.title}
          </p>

          <p class="text-[14px] text-black italic text-center">
            {card.description_html}
          </p>

          {#if card.card_type === "subclass_foundation" && (card as Card<"subclass_foundation">).spellcast_trait}
            <p class="text-[14px] text-black text-center uppercase">
              <b>Spellcast Trait:</b>
              {(card as Card<"subclass_foundation">).spellcast_trait}
            </p>
          {/if}
        </div>

        {#each card.features as feature}
          <p class="text-[12px] text-black">
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

  <style>
    .clip-card-type {
      clip-path: polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%);
    }
  </style>
{/if}
