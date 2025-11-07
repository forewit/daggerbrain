<script lang="ts">
  import type { Card, Choice } from "$lib/ts/character/types";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";
  import DomainBanner from "../domain-banner.svelte";
  import { DOMAINS } from "$lib/ts/content/domains/domains";
  import * as Select from "$lib/components/ui/select";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";

  let {
    bind_choice_select = false,
    bind_token_count = false,
    card = $bindable(),
    class: className = "",
    variant = "responsive",
    children,
  }: {
    bind_choice_select?: boolean;
    bind_token_count?: boolean;
    card: Card<"domain">;
    variant?: "responsive" | "card";
    class?: string;
    children?: Snippet;
  } = $props();

  let clientWidth = $state(360);

  const context = getCharacterContext();
  let character = $derived(context.character);
</script>

{#snippet token_count()}
  {#if character && bind_token_count && card.tokens}
    {@const current_count = character.domain_card_tokens[card.id] || 0}
    <div class="flex items-center gap-2 justify-center">
      <!-- Minus Button -->
      <button
        type="button"
        onclick={() => {
          if (!character) return;
          const current = character.domain_card_tokens[card.id] || 0;
          character.domain_card_tokens[card.id] = Math.max(0, current - 1);
        }}
        disabled={current_count === 0}
        class="flex items-center justify-center size-7 rounded-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg transition-colors shadow-md"
        aria-label="Decrease token count"
      >
        −
      </button>

      <!-- Coin Stack -->
      <div class="relative flex items-center justify-center">
        <!-- Stack of coins (background coins) -->
        <div class="relative w-12 h-12">
          <!-- Bottom coin -->
          <div
            class="absolute inset-0 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 border-2 border-yellow-700"
            style="transform: translate(2px, 4px);"
          ></div>
          <!-- Middle coin -->
          <div
            class="absolute inset-0 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 border-2 border-yellow-700"
            style="transform: translate(1px, 2px);"
          ></div>
          <!-- Top coin with number -->
          <div
            class="absolute inset-0 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 border-2 border-yellow-700 flex items-center justify-center shadow-lg"
          >
            <span class="text-sm font-bold text-yellow-900 drop-shadow-sm">
              {current_count}
            </span>
          </div>
        </div>
      </div>

      <!-- Plus Button -->
      <button
        type="button"
        onclick={() => {
          if (!character) return;
          const current = character.domain_card_tokens[card.id] || 0;
          character.domain_card_tokens[card.id] = Math.min(99, current + 1);
        }}
        disabled={current_count === 99}
        class="flex items-center justify-center size-7 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg transition-colors shadow-md"
        aria-label="Increase token count"
      >
        +
      </button>
    </div>
  {/if}
{/snippet}

{#snippet choice_select()}
  {#if character && card.choices.length > 0 && bind_choice_select}
    {@const current_choice = card.choices.find(
      (choice) => choice.id === character.domain_card_choices[card.id]
    )}
    <Select.Root
      type="single"
      value={character.domain_card_choices[card.id] || ""}
      onValueChange={(value) => {
        if (!character) return;
        character.domain_card_choices[card.id] = value;
      }}
    >
      <Select.Trigger
        class="font-medium w-full border-black/30 data-[placeholder]:text-muted bg-white hover:bg-black/10 [&_svg:not([class*='text-'])]:text-muted text-background"
        highlighted={!character.domain_card_choices[card.id]}
      >
        <p class="text-xs">
          {current_choice?.name || "Select an option"}
        </p>
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="" class="justify-center hover:cursor-pointer">
          -- none selected --
        </Select.Item>
        <Select.Label>Select an option</Select.Label>
        {#each card.choices as choice}
          <Select.Item value={choice.id} class="hover:cursor-pointer">
            {choice.name}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  {/if}
{/snippet}

{#if variant === "responsive"}
  <div
    class={cn(
      "flex overflow-hidden border-accent border-2 rounded-xl bg-white text-black text-left",
      className
    )}
  >
    <!-- image -->
    <div class="flex-1 min-w-[60px] max-w-[180px] border-r-2 border-accent relative">
      <div
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
    <div class="flex-2 flex flex-col gap-2 px-3 py-2">
      <!-- title and community label -->
      <div class="relative flex flex-row-reverse flex-wrap gap-2 justify-between">
        <div class="mr-auto shadow-md px-2 py-1 bg-accent rounded h-min">
          <p class="text-xs uppercase text-black tracking-[2px] font-bold">{card.type}</p>
        </div>

        <p class="grow text-wrap font-eveleth uppercase">
          {card.title}
        </p>
      </div>

      <!-- features -->
      {#each card.features as feature}
        <p class="text-xs">
          {@html feature.description_html}
        </p>
      {/each}

      <!-- choices -->
      {@render choice_select()}

      <!-- token count -->
      {@render token_count()}

      <!-- optional children -->
      {@render children?.()}
    </div>

    <!-- banner -->
    <div class="shrink-0">
      <DomainBanner
        domain_id={card.domain_id}
        level_requirement={card.level_requirement}
        style="zoom: 0.75"
      />
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
          src="/images/card/dividers/domain-divider.png"
          alt="divider"
          class="absolute bottom-0 left-0 w-full object-cover z-4"
        />
        <DomainBanner
          domain_id={card.domain_id}
          level_requirement={card.level_requirement}
          class="absolute -top-[9px] left-[14px] w-[75px]"
        />
        <div
          class={cn(
            "scale-90 text-white  absolute top-[16px] right-[16px] size-[38px] border-2 border-accent rounded-full bg-gray-800",
            card.recall_cost > 9 && "size-[48px]"
          )}
        >
          <div
            class="pb-[2px] border border-gray-500 rounded-full size-full flex items-center justify-center"
          >
            <p class="text-[18px] font-medium text-right pt-[4px] pl-[4px]">{card.recall_cost}</p>
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 16 16"
              class="size-[12px] shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"
              ></path></svg
            >
          </div>
        </div>
        <div
          style="background: {DOMAINS[card.domain_id].color};"
          class="clip-card-type absolute left-[111px] bottom-[3px] w-[135px] h-[23px]"
        ></div>
        <p
          style="color: {DOMAINS[card.domain_id].foreground_color};"
          class="z-5 absolute uppercase leading-none bottom-[8px] left-[180px] -translate-x-1/2 text-[12px] font-bold"
        >
          {card.type}
        </p>
      </div>

      <!-- content -->
      <div
        class="z-5 flex flex-col shrink-0 gap-[12px] px-[12px] pb-[6px] pt-[16px] -mt-[2px] bg-white"
      >
        <p class="font-eveleth text-center uppercase text-[20px] text-black leading-none">
          {card.title}
        </p>

        {#each card.features as feature}
          <div class="text-[12px] text-black flex flex-col gap-[12px]">
            {@html feature.description_html}
          </div>
        {/each}

        {@render choice_select()}
        {@render token_count()}
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
