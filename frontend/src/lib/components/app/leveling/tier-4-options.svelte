<script lang="ts">
  import type { LevelUpOption, Character } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import * as Select from "$lib/components/ui/select/";
  import {
    ALL_LEVEL_UP_OPTIONS,
    BLANK_LEVEL_UP_CHOICE,
    BLANK_LEVEL_UP_OPTION,
    TIER_2_BASE_OPTIONS,
    TIER_3_BASE_OPTIONS,
    TIER_4_BASE_OPTIONS,
  } from "$lib/ts/constants/rules";
  import { getCharacterContext } from "$lib/ts/character.svelte";
  import Dropdown from "./dropdown.svelte";
  import {
    get_previously_chosen_domain_cards,
    get_available_domain_cards,
  } from "./domain-card-utils";
  import { calculate_highlighted } from "./highlight-utils";
  import DomainCardSelector from "./secondary-options/domain-card-selector.svelte";
  import TraitsSelector from "./secondary-options/traits-selector.svelte";
  import ExperienceSelector from "./secondary-options/experience-selector.svelte";
  import TierOptionsGroup from "./tier-options-group.svelte";
  import SecondarySubclassSelector from "./secondary-options/secondary-subclass-selector.svelte";
  import SecondaryClassSelector from "./secondary-options/secondary-class-selector.svelte";

  let {
    class: className = "",
    level,
  }: {
    class?: string;
    level: number;
  } = $props();

  const context = getCharacterContext();
  let character = $derived(context.character);

  let previously_chosen_domain_cards = $derived.by(() => {
    return get_previously_chosen_domain_cards(character, level, [
      "tier_2_domain_card",
      "tier_3_domain_card",
      "tier_4_domain_card",
    ]);
  });

  let available_domain_cards = $derived.by(() => {
    return get_available_domain_cards(character, level, 7, true);
  });

  let width: number = $state(300);

  let highlighted = $derived.by(() => {
    return calculate_highlighted(character, level, ["tier_2", "tier_3", "tier_4"]);
  });

  let tier_2_options_open = $state(false);
  let tier_3_options_open = $state(false);
  let tier_4_options_open = $state(true);

  let after_remove_secondary_class: (() => void) | null = $state(null);

  let choices = $derived(
    character?.level_up_choices[level as keyof typeof character.level_up_choices] || {
      A: BLANK_LEVEL_UP_CHOICE,
      B: BLANK_LEVEL_UP_CHOICE,
    }
  );
  let chosen_options = $derived({
    A:
      !choices || choices.A.option_id === null
        ? BLANK_LEVEL_UP_OPTION
        : ALL_LEVEL_UP_OPTIONS[choices.A.option_id],
    B:
      !choices || choices.B.option_id === null
        ? BLANK_LEVEL_UP_OPTION
        : ALL_LEVEL_UP_OPTIONS[choices.B.option_id],
  });
  let level_up_domain_cards = $derived(
    character?.level_up_domain_cards[level as keyof typeof character.level_up_domain_cards] || {
      A: null,
      B: null,
    }
  );

  let select_open = $state(false);
</script>

{#if character}
  <div class={cn(className)}>
    <Dropdown
      title="Level {level}"
      {highlighted}
      subtitle={[chosen_options.A.short_title, chosen_options.B.short_title]
        .filter((title) => title !== null)
        .join(", ")}
    >
      <div class="flex flex-col gap-4" bind:clientWidth={width}>
        <!-- level up domain cards -->
        <DomainCardSelector
          bind:selected_card={level_up_domain_cards.A}
          available_cards={available_domain_cards}
          previously_chosen_cards={previously_chosen_domain_cards}
          description_html="Take an additional domain card of your level or lower from a domain you have access to."
        />

        <!-- level up choices select -->
        <Select.Root
          type="single"
          bind:open={select_open}
          onOpenChange={(open) => {
            if (open) {
              tier_2_options_open =
                (choices.A.option_id !== null && choices.A.option_id.startsWith("tier_2")) ||
                (choices.B.option_id !== null && choices.B.option_id.startsWith("tier_2"));
              tier_3_options_open =
                (choices.A.option_id !== null && choices.A.option_id.startsWith("tier_3")) ||
                (choices.B.option_id !== null && choices.B.option_id.startsWith("tier_3"));
              tier_4_options_open = true;
            }
          }}
        >
          <Select.Trigger
            highlighted={(choices.A.option_id === null || choices.B.option_id === null) &&
              !(chosen_options.A.costs_two_choices || chosen_options.B.costs_two_choices)}
            class="w-full truncate bg-muted/80 hover:bg-muted/50"
          >
            <p class="truncate">
              {choices.A.option_id === null && choices.B.option_id === null
                ? "Select 2 level up options"
                : [chosen_options.A.short_title, chosen_options.B.short_title]
                    .map((title) => title || "(Choose 1 more)")
                    .join(", ")}
            </p>
          </Select.Trigger>
          <Select.Content class="rounded-md " align="start">
            <div style="max-width: {width}px;" class="p-2">
              <button
                data-slot="select-item"
                disabled={choices.A.option_id === null && choices.B.option_id === null}
                class="justify-center font-bold text-destructive hover:cursor-pointer hover:bg-muted disabled:opacity-50 disabled:pointer-events-none disabled:cursor-default flex w-full select-none items-center gap-2 rounded-sm py-1.5 px-2 text-sm"
                onclick={() => {
                  if (
                    choices.A.option_id === "tier_3_multiclass" ||
                    choices.A.option_id === "tier_4_multiclass"
                  ) {
                    after_remove_secondary_class = () => {
                      choices.A = BLANK_LEVEL_UP_CHOICE;
                      choices.B = BLANK_LEVEL_UP_CHOICE;
                    };
                  } else {
                    choices.A = BLANK_LEVEL_UP_CHOICE;
                    choices.B = BLANK_LEVEL_UP_CHOICE;
                  }
                }}
              >
                -- Clear selection --
              </button>
              <TierOptionsGroup
                tier_number={2}
                options={TIER_2_BASE_OPTIONS}
                on_close={() => (select_open = false)}
                bind:open={tier_2_options_open}
                bind:choices
                {chosen_options}
              />
              <TierOptionsGroup
                tier_number={3}
                options={TIER_3_BASE_OPTIONS}
                on_close={() => (select_open = false)}
                bind:open={tier_3_options_open}
                bind:choices
                {chosen_options}
              />
              <TierOptionsGroup
                tier_number={4}
                options={TIER_4_BASE_OPTIONS}
                on_close={() => (select_open = false)}
                bind:open={tier_4_options_open}
                bind:choices
                {chosen_options}
              />
            </div>
          </Select.Content>
        </Select.Root>

        <!-- secondary choices based on the selected option -->
        {#each ["A" as keyof typeof choices, "B" as keyof typeof choices] as key}
          {#if choices[key].option_id === "tier_2_traits" || choices[key].option_id === "tier_3_traits" || choices[key].option_id === "tier_4_traits"}
            <TraitsSelector
              bind:selected_traits={choices[key].marked_traits}
              marked_traits={context.tier_4_marked_traits}
              {width}
            />
          {:else if choices[key].option_id === "tier_2_experience_bonus" || choices[key].option_id === "tier_3_experience_bonus" || choices[key].option_id === "tier_4_experience_bonus"}
            <ExperienceSelector
              bind:selected_experiences={choices[key].selected_experiences}
              experiences={character.experiences}
              {width}
            />
          {:else if choices[key].option_id === "tier_2_domain_card" || choices[key].option_id === "tier_3_domain_card" || choices[key].option_id === "tier_4_domain_card"}
            {@const max_level = choices[key].option_id === "tier_2_domain_card" ? 4 : 7}
            {@const filtered_available_domain_cards = available_domain_cards.filter((card) => {
              card.level_requirement <= max_level;
            })}
            <DomainCardSelector
              bind:selected_card={choices[key].selected_domain_card}
              available_cards={filtered_available_domain_cards}
              previously_chosen_cards={previously_chosen_domain_cards}
              description_html={ALL_LEVEL_UP_OPTIONS[choices[key].option_id].title_html}
            />
          {:else if choices[key].option_id === "tier_3_subclass_upgrade" || choices[key].option_id === "tier_4_subclass_upgrade"}
            <SecondarySubclassSelector
              bind:selected_upgrade={choices[key].selected_subclass_upgrade}
              option_id={choices[key].option_id}
              options_used={context.options_used}
              {width}
            />
          {:else if choices[key].option_id === "tier_3_multiclass" || choices[key].option_id === "tier_4_multiclass"}
            <SecondaryClassSelector
              after_remove_secondary_class={() => {
                if (after_remove_secondary_class) {
                  after_remove_secondary_class();
                  after_remove_secondary_class = null;
                }
              }}
            />
          {/if}
        {/each}
      </div>
    </Dropdown>
  </div>
{/if}
