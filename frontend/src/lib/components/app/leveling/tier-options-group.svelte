<script lang="ts">
  import type { LevelUpOption, LevelUpChoice } from "$lib/ts/character/types";
  import { ALL_LEVEL_UP_OPTIONS } from "$lib/ts/constants/rules";
  import { cn } from "$lib/utils";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import Square from "@lucide/svelte/icons/square";
  import SquareCheck from "@lucide/svelte/icons/square-check";
  import Check from "@lucide/svelte/icons/check";
  import CheckCheck from "@lucide/svelte/icons/check-check";
  import * as Select from "$lib/components/ui/select/";
  import * as Collapsible from "$lib/components/ui/collapsible/";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";

  let {
    tier_number,
    options,
    open = $bindable(),
    choices = $bindable(),
    chosen_options,
    on_close = ()=>{}
  }: {
    tier_number: number;
    options: Record<string, LevelUpOption>;
    open?: boolean;
    choices: { A: LevelUpChoice; B: LevelUpChoice };
    chosen_options: { A: LevelUpOption; B: LevelUpOption };
    on_close?: () => void;
  } = $props();

  const context = getCharacterContext();

  function calculate_disabled(
    option_id: string,
    option: LevelUpOption,
    tier_number: number
  ): { disabled: boolean; rule_disabled: boolean } {
    // Base disabled conditions
    const base_disabled =
      context.options_used[option_id] >= option.max ||
      (choices.A.option_id !== null && choices.B.option_id !== null) ||
      chosen_options.A.costs_two_choices ||
      chosen_options.B.costs_two_choices ||
      (option.costs_two_choices && (choices.A.option_id !== null || choices.B.option_id !== null));

    // Tier-specific disabled logic (rule-based conflicts)
    let rule_disabled = false;
    if (tier_number === 3) {
      rule_disabled =
        (option_id === "tier_3_multiclass" &&
          (context.options_used["tier_4_multiclass"] >= 1 ||
            context.options_used["tier_3_subclass_upgrade"] >= 1)) ||
        (option_id === "tier_3_subclass_upgrade" && context.options_used["tier_3_multiclass"] >= 1);
    } else if (tier_number === 4) {
      rule_disabled =
        (option_id === "tier_4_multiclass" &&
          (context.options_used["tier_3_multiclass"] >= 1 ||
            context.options_used["tier_4_subclass_upgrade"] >= 1)) ||
        (option_id === "tier_4_subclass_upgrade" && context.options_used["tier_4_multiclass"] >= 1);
    }

    return { disabled: base_disabled || rule_disabled, rule_disabled };
  }

  function handle_option_click(option_id: string) {
    // if one choice is available, set it to the selected option
    if (choices.A.option_id === null) {
      choices.A.option_id = option_id as keyof typeof ALL_LEVEL_UP_OPTIONS;
    } else if (choices.B.option_id === null) {
      choices.B.option_id = option_id as keyof typeof ALL_LEVEL_UP_OPTIONS;
    }
    // if both choices are !== null then call on_close
    if (choices.A.option_id !== null && choices.B.option_id !== null) {
      on_close();
    }
  }
</script>

<Select.Group>
  <Collapsible.Root bind:open>
    <Collapsible.Trigger class="w-full">
      <Select.GroupHeading class="flex items-center gap-2 hover:bg-muted text-accent my-0.5 py-1">
        <ChevronRight class={cn("size-4 opacity-50 stroke-3", open && "rotate-90")} />
        Tier {tier_number} Options
      </Select.GroupHeading>
    </Collapsible.Trigger>
    <Collapsible.Content>
      {#each Object.entries(options) as [option_id, option]}
        {@const { disabled, rule_disabled } = calculate_disabled(option_id, option, tier_number)}

        <button
          {disabled}
          class="text-left hover:cursor-pointer hover:bg-muted disabled:opacity-50 disabled:pointer-events-none disabled:cursor-default flex w-full select-none items-center gap-2 rounded-sm py-1.5 px-2 text-sm"
          onclick={() => handle_option_click(option_id)}
        >
          <div class="w-14 shrink-0 flex justify-end">
            <div class={cn("gap-1 flex w-min relative")}>
              {#if rule_disabled}
                <span
                  class="absolute top-1/2 -translate-y-1/2 -left-1 -right-1 h-[1px] bg-foreground"
                ></span>
              {/if}
              {#each Array(option.max) as _, i}
                {@const Icon = i < context.options_used[option_id] ? SquareCheck : Square}
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
            {#if (option_id === choices.A.option_id && option_id === choices.B.option_id) || (option_id === choices.A.option_id && option.costs_two_choices) || (option_id === choices.B.option_id && option.costs_two_choices)}
              <CheckCheck class="size-4" />
            {:else if option_id === choices.A.option_id || option_id === choices.B.option_id}
              <Check class="size-4" />
            {/if}
          </div>
        </button>
      {/each}
    </Collapsible.Content>
  </Collapsible.Root>
</Select.Group>
