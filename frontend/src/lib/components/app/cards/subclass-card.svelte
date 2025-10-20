<script lang="ts">
  import type { Card } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";

  let {
    card = $bindable(),
    class: className = "",
    children,
    hideImage = false,
  }: {
    card: Card<"subclass_foundation" | "subclass_specialization" | "subclass_mastery">;
    class?: string;
    children?: Snippet;
    hideImage?: boolean;
  } = $props();
</script>

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
    <div class="relative flex flex-row-reverse  flex-wrap gap-x-2 gap-y-3">
      <div class="mx-auto shadow-md px-2 py-1 bg-accent rounded h-min">
        <p class="text-xs uppercase text-black tracking-[2px] font-bold">
          {card.description_html}
        </p>
      </div>

      <p class="grow text-xl font-eveleth uppercase">
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
