<script lang="ts">
  import type { LevelUpOption } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import Square from "@lucide/svelte/icons/square";
  import SquareCheck from "@lucide/svelte/icons/square-check";
  import Check from "@lucide/svelte/icons/check";
  import CheckCheck from "@lucide/svelte/icons/check-check";

  let {
    option_id,
    option,
    selected_choices,
    options_used,
    disabled = false,
    rule_disabled = false,
    on_click,
  }: {
    option_id: string;
    option: LevelUpOption;
    selected_choices: { A: string | null; B: string | null };
    options_used: Record<string, number>;
    disabled?: boolean;
    rule_disabled?: boolean;
    on_click: () => void;
  } = $props();
</script>

<button
  {disabled}
  class="text-left hover:cursor-pointer hover:bg-muted disabled:opacity-50 disabled:pointer-events-none disabled:cursor-default flex w-full select-none items-center gap-2 rounded-sm py-1.5 px-2 text-sm"
  onclick={on_click}
>
  <div class="w-14 shrink-0 flex justify-end">
    <div class={cn("gap-1 flex w-min relative")}>
      {#if rule_disabled}
        <span
          class="absolute top-1/2 -translate-y-1/2 -left-1 -right-1 h-[1px] bg-foreground"
        ></span>
      {/if}
      {#each Array(option.max) as _, i}
        {@const Icon =
          i < options_used[option_id] ? SquareCheck : Square}
        {@const double = option.costs_two_choices}

        {#if double}
          <div
            class="flex gap-1 rounded-xs outline-offset-1 outline-muted-foreground outline-2"
          >
            <Icon class="size-4" />
            <Icon class="size-4" />
          </div>
        {:else}
          <Icon class="size-4" />
        {/if}
      {/each}
    </div>
  </div>
  <p class={cn("grow")}>{@html option.title_html}</p>
  <div class="size-4">
    {#if (option_id === selected_choices.A && option_id === selected_choices.B) || (option_id === selected_choices.A && option.costs_two_choices) || (option_id === selected_choices.B && option.costs_two_choices)}
      <CheckCheck class="size-4" />
    {:else if option_id === selected_choices.A || option_id === selected_choices.B}
      <Check class="size-4" />
    {/if}
  </div>
</button>

