<script lang="ts">
  import type { LevelUpOption, LevelUpChoice } from "$lib/ts/types";
  import { ALL_LEVEL_UP_OPTIONS } from "$lib/ts/constants/rules";
  import { cn } from "$lib/utils";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import * as Select from "$lib/components/ui/select/";
  import * as Collapsible from "$lib/components/ui/collapsible/";
  import OptionButton from "./option-button.svelte";
  import { getCharacterContext } from "$lib/ts/character.svelte";

  let {
    tier_number,
    options,
    open = $bindable(),
    choices = $bindable(),
    chosen_options,
  }: {
    tier_number: number;
    options: Record<string, LevelUpOption>;
    open?: boolean;
    choices: { A: LevelUpChoice; B: LevelUpChoice };
    chosen_options: { A: LevelUpOption; B: LevelUpOption };
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
    } else if (choices.A.option_id !== null && choices.B.option_id !== null) {
      if (choices.A.option_id === option_id && choices.B.option_id === option_id) {
        choices.A.option_id = null;
        choices.B.option_id = null;
      } else if (choices.A.option_id === option_id) {
        choices.A.option_id = null;
      } else if (choices.B.option_id === option_id) {
        choices.B.option_id = null;
      }
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
        <OptionButton
          {option_id}
          {option}
          selected_choices={{
            A: choices.A.option_id,
            B: choices.B.option_id,
          }}
          options_used={context.options_used}
          {disabled}
          {rule_disabled}
          on_click={() => handle_option_click(option_id)}
        />
      {/each}
    </Collapsible.Content>
  </Collapsible.Root>
</Select.Group>
