<script lang="ts">
  import type { Experience, LevelUpOption, Traits, Character, Card } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import Square from "@lucide/svelte/icons/square";
  import SquareCheck from "@lucide/svelte/icons/square-check";
  import * as Select from "$lib/components/ui/select/";
  import * as Dialog from "$lib/components/ui/dialog/";
  import { TIER_2_BASE_OPTIONS } from "$lib/ts/rules";
  import { DOMAINS, TRAITS } from "$lib/ts/constants";
  import CardCarousel from "../../cards/card-carousel.svelte";
  import DialogClose from "$lib/components/ui/dialog/dialog-close.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  let {
    level_up_choices = $bindable(),
    experiences,
    class: className = "",
    max_choices = 2,
    level,
    character = $bindable(),
  }: {
    level_up_choices: LevelUpOption[][];
    experiences: Experience[];
    class?: string;
    max_choices?: number;
    level: number;
    character: Character;
  } = $props();

  let domain_card_dialog_open = $state(false);

  let all_previous_tier_2_choices: LevelUpOption[] = $derived(
    level_up_choices
      .filter((choices, i) => choices !== null && i < level)
      .flatMap((choices) => choices)
      .filter((choice, i) => choice !== null)
      .filter((choice) => TIER_2_BASE_OPTIONS.some((option) => option.id === choice.id))
  );

  let tier_2_options_used: (Omit<
    LevelUpOption,
    "marked_traits" | "experience_indexes" | "domain_cards_added"
  > & {
    used: number;
    previously_marked_traits: (keyof Traits | "")[];
    previously_domain_cards_added: Card<"domain">[];
  })[] = $derived(
    TIER_2_BASE_OPTIONS.map((option) => ({
      ...option,
      used:
        all_previous_tier_2_choices.filter((choice) => choice.id === option.id).length +
        choices.filter((choice) => choice.id === option.id).length,
      previously_marked_traits: all_previous_tier_2_choices
        .filter((choice) => choice.id === option.id)
        .flatMap((choice) => choice.marked_traits),
      previously_domain_cards_added: all_previous_tier_2_choices
        .filter((choice) => choice.id === option.id)
        .flatMap((choice) => choice.domain_cards_added),
    }))
  );

  let choices: {
    id: string;
    marked_traits: (keyof Traits | "")[];
    experience_indexes: number[];
    domain_cards_added: Card<"domain">[];
  }[] = $state(
    (() => {
      // If we have existing choices for this level, use them
      if (level_up_choices[level] && level_up_choices[level].length > 0) {
        // Ensure we have the right number of choices, filling with defaults if needed
        const existingChoices = level_up_choices[level];
        const result = Array(max_choices)
          .fill(null)
          .map((_, i) => {
            if (i < existingChoices.length) {
              return {
                id: existingChoices[i].id || "",
                marked_traits: (existingChoices[i].marked_traits || ["", ""]) as (
                  | keyof Traits
                  | ""
                )[],
                experience_indexes: existingChoices[i].experience_indexes || [-1, -1],
                domain_cards_added: existingChoices[i].domain_cards_added || [],
              };
            }
            return {
              id: "",
              marked_traits: ["", ""] as (keyof Traits | "")[],
              experience_indexes: [-1, -1],
              domain_cards_added: [],
            };
          });
        return result;
      }
      // If no existing choices, create new array with defaults
      return Array(max_choices)
        .fill(null)
        .map(() => ({
          id: "",
          marked_traits: ["", ""] as (keyof Traits | "")[],
          experience_indexes: [-1, -1],
          domain_cards_added: [],
        }));
    })()
  );

  let available_domain_cards: Card<"domain">[] = $derived.by(() => {
    if (!character.primary_class) return [];
    const primary_domain = character.primary_class.primary_domain;
    const secondary_domain = character.primary_class.secondary_domain;
    const domain_cards = Object.values(
      DOMAINS[primary_domain as keyof typeof DOMAINS].cards
    ).concat(Object.values(DOMAINS[secondary_domain as keyof typeof DOMAINS].cards));

    return domain_cards.filter(
      (card) =>
        card.level_requirement <= level &&
        !choices.some((choice) => choice.domain_cards_added.includes(card))
    );
  });

  // update the appropriate character level_up_choices
  $effect(() => {
    level_up_choices[level] = choices
      .map((choice) => {
        let base_option = TIER_2_BASE_OPTIONS.find((option) => option.id === choice.id);
        if (base_option) {
          return {
            ...base_option,
            marked_traits: choice.marked_traits,
            experience_indexes: choice.experience_indexes,
            domain_cards_added: choice.domain_cards_added,
          };
        }
        return null;
      })
      .filter((option) => option !== null);
  });

  // if the option is used more than the max, remove it from the choice_ids
  $effect(() => {
    tier_2_options_used.forEach((option) => {
      if (option.used > option.max) {
        console.warn(`Option ${option.id} used more than the max of ${option.max}`);
        choices.forEach((choice) => {
          if (choice.id === option.id) {
            choice.id = "";
            choice.marked_traits = ["", ""];
          }
        });
      }
    });
  });

  // check if any there are any previously marked traits in the choices
  $effect(() => {
    choices.forEach((choice) => {
      if (choice.id === "tier_2_traits") {
        choice.marked_traits.forEach((trait, i) => {
          if (
            trait &&
            tier_2_options_used.some((option) =>
              option.previously_marked_traits.includes(trait as keyof Traits)
            )
          ) {
            console.warn(`Trait ${trait} is already used in another option`);
            choice.marked_traits[i] = "";
          }
        });
      }
    });
  });

  // remove the domain card if it has been previously added
  // $effect(() => {
  //   choices.forEach((choice) => {
  //     if (choice.id === "tier_2_domain_card") {
  //       choice.domain_cards_added = choice.domain_cards_added.filter(
  //         (card) =>
  //           !tier_2_options_used.some((option) =>
  //             option.previously_domain_cards_added.includes(card)
  //           )
  //       );
  //     }
  //   });
  // });

  // reset the choices when the option is changed
  $effect(() => {
    choices.forEach((choice) => {
      if (choice.id !== "tier_2_traits") {
        choice.marked_traits = ["", ""];
      }
      if (choice.id !== "tier_2_experience_bonus") {
        choice.experience_indexes = [-1, -1];
      }
      if (choice.id !== "tier_2_domain_card") {
        choice.domain_cards_added = [];
      }
    });
  });
  let width: number = $state(300);
</script>

<div class={cn("flex flex-col gap-4", className)} bind:clientWidth={width}>
  {#each Array(max_choices) as _, i}
    <Select.Root type="single" bind:value={choices[i].id}>
      <Select.Trigger class="w-full">
        {TIER_2_BASE_OPTIONS.find((option) => option.id === choices[i].id)?.short_title ||
          "Select a tier 2 option"}
      </Select.Trigger>
      <Select.Content class="rounded-md " align="start">
        <div style="max-width: {width}px;" class="p-2">
          <Select.Item value="" class="justify-center hover:cursor-pointer text-sm">
            -- none selected --
          </Select.Item>
          <Select.Label>Tier 2 Options</Select.Label>

          {#each tier_2_options_used as option}
            <Select.Item
              value={option.id}
              disabled={option.used >= option.max && choices[i].id !== option.id}
              class="hover:cursor-pointer"
            >
              <div class="flex gap-1 w-14 shrink-0 justify-end">
                {#each Array(option.max) as _, i}
                  {#if i < option.used}
                    <SquareCheck class="size-4" />
                  {:else}
                    <Square class="size-4" />
                  {/if}
                {/each}
              </div>
              {option.title}
            </Select.Item>
          {/each}
        </div>
      </Select.Content>
    </Select.Root>

    <!-- secondary choices based on the selected option -->
    {#if choices[i].id === "tier_2_traits"}
      <div class="flex flex-col gap-2 bg-primary-muted p-2 rounded-md">
        <p class="p-2 pb-0 pt-1 text-xs italic font-medium">Choose 2 unmarked character traits.</p>
        <div class="flex gap-2">
          <Select.Root type="single" bind:value={choices[i].marked_traits[0]}>
            <Select.Trigger class="w-full"
              >{choices[i].marked_traits[0]
                ? TRAITS[choices[i].marked_traits[0] as keyof typeof TRAITS].name
                : "Select a trait"}</Select.Trigger
            >

            <Select.Content class="rounded-md " align="start">
              <div style="max-width: {width}px;" class="p-2">
                <Select.Item value="" class="justify-center hover:cursor-pointer text-sm">
                  -- none selected --
                </Select.Item>
                <Select.Label>Traits</Select.Label>
                {#each Object.keys(TRAITS) as trait}
                  <Select.Item
                    disabled={(tier_2_options_used.some(
                      (option) =>
                        option.id === "tier_2_traits" &&
                        option.previously_marked_traits.includes(trait as keyof Traits)
                    ) ||
                      choices.some((choice) =>
                        choice.marked_traits.includes(trait as keyof Traits)
                      )) &&
                      choices[i].marked_traits[0] !== trait}
                    value={trait}>{TRAITS[trait as keyof typeof TRAITS].name}</Select.Item
                  >
                {/each}
              </div>
            </Select.Content>
          </Select.Root>
          <Select.Root type="single" bind:value={choices[i].marked_traits[1]}>
            <Select.Trigger class="w-full"
              >{choices[i].marked_traits[1]
                ? TRAITS[choices[i].marked_traits[1] as keyof typeof TRAITS].name
                : "Select a trait"}</Select.Trigger
            >
            <Select.Content class="rounded-md " align="start">
              <div style="max-width: {width}px;" class="p-2">
                <Select.Item value="" class="justify-center hover:cursor-pointer text-sm">
                  -- none selected --
                </Select.Item>
                <Select.Label>Traits</Select.Label>
                {#each Object.keys(TRAITS) as trait}
                  <Select.Item
                    disabled={(tier_2_options_used.some(
                      (option) =>
                        option.id === "tier_2_traits" &&
                        option.previously_marked_traits.includes(trait as keyof Traits)
                    ) ||
                      choices.some((choice) =>
                        choice.marked_traits.includes(trait as keyof Traits)
                      )) &&
                      choices[i].marked_traits[1] !== trait}
                    value={trait}>{TRAITS[trait as keyof typeof TRAITS].name}</Select.Item
                  >
                {/each}
              </div>
            </Select.Content>
          </Select.Root>
        </div>
      </div>
    {:else if choices[i].id === "tier_2_experience_bonus"}
      <div class="flex flex-col gap-2 bg-primary-muted p-2 rounded-md">
        <p class="p-2 pb-0 pt-1 text-xs italic font-medium">Choose 2 Experiences.</p>
        <div class="flex gap-2">
          <Select.Root
            type="single"
            value={choices[i].experience_indexes[0].toString()}
            onValueChange={(value) => (choices[i].experience_indexes[0] = parseInt(value))}
          >
            <Select.Trigger class="w-full">
              {choices[i].experience_indexes[0] >= 0
                ? experiences[choices[i].experience_indexes[0]].title || "Unnamed Experience"
                : "Select an Experience"}
            </Select.Trigger>
            <Select.Content class="rounded-md" align="start">
              <div style="max-width: {width}px;" class="p-2">
                <Select.Item value="" class="justify-center hover:cursor-pointer text-sm">
                  -- none selected --
                </Select.Item>
                <Select.Label>Experiences</Select.Label>
                {#each experiences as experience, j}
                  <Select.Item
                    disabled={choices[i].experience_indexes[1] === j}
                    value={j.toString()}>{experience.title || "Unnamed Experience"}</Select.Item
                  >
                {/each}
              </div>
            </Select.Content>
          </Select.Root>
          <Select.Root
            type="single"
            value={choices[i].experience_indexes[1].toString()}
            onValueChange={(value) => (choices[i].experience_indexes[1] = parseInt(value))}
          >
            <Select.Trigger class="w-full">
              {choices[i].experience_indexes[1] >= 0
                ? experiences[choices[i].experience_indexes[1]].title || "Unnamed Experience"
                : "Select an Experience"}
            </Select.Trigger>
            <Select.Content class="rounded-md" align="start">
              <div style="max-width: {width}px;" class="p-2">
                <Select.Item value="" class="justify-center hover:cursor-pointer text-sm">
                  -- none selected --
                </Select.Item>
                <Select.Label>Experiences</Select.Label>
                {#each experiences as experience, j}
                  <Select.Item
                    disabled={choices[i].experience_indexes[0] === j}
                    value={j.toString()}>{experience.title || "Unnamed Experience"}</Select.Item
                  >
                {/each}
              </div>
            </Select.Content>
          </Select.Root>
        </div>
      </div>
    {:else if choices[i].id === "tier_2_domain_card"}
      <div class="flex flex-col gap-2 bg-primary-muted p-2 rounded-md">
        <p class="p-2 pb-0 pt-1 text-xs italic font-medium">
          Choose an additional domain card of your level or lower from a domain you have access to
          (up to level 4).
        </p>

        {#each available_domain_cards as card}
          <div class="flex flex-col gap-2">
            <p>{card.title}</p>
            <Button
              disabled={choices[i].domain_cards_added.includes(card)}
              onclick={() => {
                choices[i].domain_cards_added.push(card);
              }}
            >
              {choices[i].domain_cards_added.includes(card) ? "Selected" : "Select"}
            </Button>
          </div>
        {/each}
      </div>
    {/if}
  {/each}
</div>
