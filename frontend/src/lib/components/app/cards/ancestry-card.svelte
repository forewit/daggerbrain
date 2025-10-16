<script lang="ts">
  import type { Card } from "$lib/ts/types";
  import { cn } from "$lib/utils";

  let {
    card = $bindable(),
    class: className = "",
    size = "normal",
    hideCredits = $bindable(false),
    hideImage = $bindable(false),
  }: {
    card: Card<"ancestry">;
    class?: string;
    hideCredits?: boolean;
    hideImage?: boolean
    size?: "small" | "normal";
  } = $props();


// !todo: allow for default colors
</script>

<div
  class={cn(
    "overflow-hidden flex flex-col bg-white relative border-2 border-accent rounded-[20px]",
    size === "small" ? "w-[360px] h-auto" : "w-[360px] h-[504px]",
    className
  )}
>
  <div
    class="relative flex-1 min-h-0 flex flex-col bg-white w-full overflow-y-auto overflow-x-hidden"
  >
    <!-- image and divider -->
    <div class={cn("relative h-[105px] shrink grow max-h-[55%] bg-background", hideImage && "h-auto")}>
      {#if !hideImage}
      <div class="absolute inset-0 overflow-hidden" draggable="false" style="touch-action: none;">
        <img
          alt="ancestry art"
          draggable="false"
          src={card.image_url}
          style="filter: brightness(1) contrast(1) saturate(1); transform: translate(0px, 0px) scale(1); transition-property: filter, transform; pointer-events: none; user-select: none;"
        />
      </div>
      {/if}
      <img
        alt="Ancestry Divider"
        class="absolute -bottom-[31px] z-40 h-auto min-h-[65px] object-contain w-full"
        src="/images/card/dividers/ancestry-divider.png"
      />
      <p
        class="absolute -bottom-[25px] right-4.5 z-50 text-[12px] uppercase text-black tracking-[2px] font-bold"
      >
        ancestry
      </p>
    </div>

    <!-- content -->
    <div
      style="scrollbar-width: thin;"
      class="flex flex-col justify-start relative overflow-y-auto px-[11px] z-40 text-black pt-1"
    >
      <div class="flex flex-col items-start">
        <p class="w-full max-w-[71%] font-[1000] text-2xl pb-1 pl-1.5 pt-[6px] uppercase">
          {card.title}
        </p>
        <p class="italic text-sm w-full px-1.5 pt-0.5 pb-1">
          {@html card.description_html}
        </p>
      </div>
      <div class="px-1 flex flex-col gap-2 mt-0.5 text-sm flex-1 border-2 border-transparent">
        <p>
          <b><em>{card.top_feature.title}:</em></b>
          {@html card.top_feature.description_html}
        </p>
        <p>
          <b><em>{card.bottom_feature.title}:</em></b>
          {@html card.bottom_feature.description_html}
        </p>
      </div>
    </div>
  </div>

  <!-- credits -->
  <div
    class={cn(
      "flex shrink-0 pt-1 pb-2 items-end justify-between data-[align-right=true]:justify-end px-3 w-full bottom-0 bg-white z-40 text-[10px] sm:text-xs",
      hideCredits && "h-2 opacity-0"
    )}
  >
    <div class="flex items-center flex-1">
      <img
        alt="Quill Icon"
        class="w-3.5 h-3.5 relative text-primary"
        src="/images/card/quill-icon.png"
      />
      <p class="text-[10px] text-black italic w-full relative top-[2px]">{card.artist_name}</p>
    </div>
    <div class="flex items-end gap-1 relative bottom-0">
      <p class="text-[8px] text-background/50 italic flex flex-1 relative top-[1px]">
        Daggerheart™ Compatible. Terms at Daggerheart.com
      </p>
      <img alt="CGL Logo" class="w-5 h-5 text-primary" src="/images/logos/cgl-logo.svg" />
    </div>
  </div>
</div>
