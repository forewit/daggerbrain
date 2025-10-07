<script lang="ts">
  import { cn } from "$lib/utils";
  import * as Popover from "$lib/components/ui/popover";
  import Textarea from "../../textarea/textarea.svelte";
  import { focusVisibleRingStyle } from "$lib/utils";
  import { colors, type ColorKey } from "./types";



  let {
    class: className = "",
    color = $bindable("yellow"),
    text = $bindable(""),
  }: {
    class?: string;
    color?: ColorKey;
    text?: string;
  } = $props();

  let rotation = Math.floor(Math.random() * 5) - 2;
  let contentRef: HTMLTextAreaElement = $state(null!);
  let currentColor = $derived(colors[color]);
</script>

<div
  class={cn(
    currentColor,
    "min-w-48 max-w-48 min-h-44 relative shadow-lg transition-all",
    className
  )}
  style="transform: rotate({rotation}deg);"
>
  <!-- tape & color picker -->
  <Popover.Root>
    <Popover.Trigger
      class={cn(
        focusVisibleRingStyle,
        "block w-[130px] h-7 bg-[rgba(227,200,114,0.40)] shadow-sm rounded-[6px/18px_0] absolute -top-3.5 left-8 -rotate-[2deg]"
      )}
    ></Popover.Trigger>
    <Popover.Content
      sideOffset={-10}
      side="top"
      class="bg-card flex items-center gap-2 w-min py-2 px-4 rounded-full"
    >
      {#each Object.entries(colors) as [colorKey, colorClass]}
        <Popover.Close
          class={cn(focusVisibleRingStyle, colorClass, "border-3  h-8 w-8 rounded-full")}
          type="submit"
          onclick={() => {
            color = colorKey as ColorKey;
          }}
          onkeydown={(e) => {
            if (e.key === "Enter") {
              color = colorKey as ColorKey;
            }
          }}
        ></Popover.Close>
      {/each}
    </Popover.Content>
  </Popover.Root>

  <!-- content -->
  <Textarea
    bind:ref={contentRef}
    spellcheck={false}
    bind:value={text}
    class="min-h-44 w-full pt-4 border-none text-3xl md:text-3xl font-julia leading-[1.2] text-center resize-none"
  />
</div>
