<script lang="ts">
  import type { LevelUpOption, Traits, Character, Card } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import Square from "@lucide/svelte/icons/square";
  import SquareCheck from "@lucide/svelte/icons/square-check";
  import * as Select from "$lib/components/ui/select/";
  import * as Dialog from "$lib/components/ui/dialog/";
  import * as Collapsible from "$lib/components/ui/collapsible/";
  import {
    ALL_LEVEL_UP_OPTIONS,
    BLANK_LEVEL_UP_CHOICE,
    BLANK_LEVEL_UP_OPTION,
    TIER_2_BASE_OPTIONS,
    TIER_3_BASE_OPTIONS,
    TIER_4_BASE_OPTIONS,
  } from "$lib/ts/constants/rules";
  import { DOMAINS, TRAITS } from "$lib/ts/constants/constants";
  import DomainCard from "../../cards/domain-card.svelte";
  import { getCharacterContext } from "$lib/ts/character.svelte";
  import { buttonVariants } from "$lib/components/ui/button";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import Dropdown from "$lib/components/app/builder/dropdown.svelte";
  import CheckCheck from "@lucide/svelte/icons/check-check";
  import Check from "@lucide/svelte/icons/check";
  import SubclassCard from "../../cards/subclass-card.svelte";

  let {
    class: className = "",
    level,
  }: {
    class?: string;
    level: number;
  } = $props();

  const context = getCharacterContext();
  let character = $derived(context.character);

  let previously_chosen_domain_cards: Card<"domain">[] = $derived.by(() => {
    if (!character) return [];
    const domain_cards = Object.values(character.level_up_domain_cards[1]).filter(
      (card) => card !== null
    );

    for (let i = 2; i <= level; i++) {
      const level_up_domain_cards =
        character.level_up_domain_cards[i as keyof typeof character.level_up_domain_cards];
      if (level_up_domain_cards.A !== null) domain_cards.push(level_up_domain_cards.A);

      const choices = character.level_up_choices[i as keyof typeof character.level_up_choices];
      if (choices.A.option_id === "tier_2_domain_card") {
        if (choices.A.selected_domain_card !== null)
          domain_cards.push(choices.A.selected_domain_card);
      }
      if (choices.B.option_id === "tier_2_domain_card") {
        if (choices.B.selected_domain_card !== null)
          domain_cards.push(choices.B.selected_domain_card);
      }
      if (choices.A.option_id === "tier_3_domain_card") {
        if (choices.A.selected_domain_card !== null)
          domain_cards.push(choices.A.selected_domain_card);
      }
      if (choices.B.option_id === "tier_3_domain_card") {
        if (choices.B.selected_domain_card !== null)
          domain_cards.push(choices.B.selected_domain_card);
      }
      if (choices.A.option_id === "tier_4_domain_card") {
        if (choices.A.selected_domain_card !== null)
          domain_cards.push(choices.A.selected_domain_card);
      }
      if (choices.B.option_id === "tier_4_domain_card") {
        if (choices.B.selected_domain_card !== null)
          domain_cards.push(choices.B.selected_domain_card);
      }
    }
    return domain_cards;
  });

  let available_domain_cards: Card<"domain">[] = $derived.by(() => {
    if (!character?.primary_class) return [];
    const primary_domain = character.primary_class.primary_domain;
    const secondary_domain = character.primary_class.secondary_domain;
    const domain_cards = Object.values(
      DOMAINS[primary_domain as keyof typeof DOMAINS].cards
    ).concat(Object.values(DOMAINS[secondary_domain as keyof typeof DOMAINS].cards));

    return domain_cards.filter((card) => card.level_requirement <= level);
  });

  let width: number = $state(300);

  let highlighted = $derived.by(() => {
    if (!character) return false;
    const choices = character.level_up_choices[level as keyof typeof character.level_up_choices];
    const chosen_options = {
      A:
        choices.A.option_id === null
          ? BLANK_LEVEL_UP_OPTION
          : ALL_LEVEL_UP_OPTIONS[choices.A.option_id],
      B:
        choices.B.option_id === null
          ? BLANK_LEVEL_UP_OPTION
          : ALL_LEVEL_UP_OPTIONS[choices.B.option_id],
    };
    return (
      ((choices.A.option_id === null || choices.B.option_id === null) &&
        !(chosen_options.A.costs_two_choices || chosen_options.B.costs_two_choices)) ||
      character.level_up_domain_cards[level as keyof typeof character.level_up_domain_cards].A ===
        null ||
      (choices.A.option_id === "tier_2_domain_card" && choices.A.selected_domain_card === null) ||
      (choices.B.option_id === "tier_2_domain_card" && choices.B.selected_domain_card === null) ||
      (choices.A.option_id === "tier_2_traits" &&
        (choices.A.marked_traits.A === null || choices.A.marked_traits.B === null)) ||
      (choices.B.option_id === "tier_2_traits" &&
        (choices.B.marked_traits.A === null || choices.B.marked_traits.B === null)) ||
      (choices.A.option_id === "tier_2_experience_bonus" &&
        (choices.A.selected_experiences.A === null || choices.A.selected_experiences.B === null)) ||
      (choices.B.option_id === "tier_2_experience_bonus" &&
        (choices.B.selected_experiences.A === null || choices.B.selected_experiences.B === null)) ||
      (choices.A.option_id === "tier_3_domain_card" && choices.A.selected_domain_card === null) ||
      (choices.B.option_id === "tier_3_domain_card" && choices.B.selected_domain_card === null) ||
      (choices.A.option_id === "tier_3_traits" &&
        (choices.A.marked_traits.A === null || choices.A.marked_traits.B === null)) ||
      (choices.B.option_id === "tier_3_traits" &&
        (choices.B.marked_traits.A === null || choices.B.marked_traits.B === null)) ||
      (choices.A.option_id === "tier_3_experience_bonus" &&
        (choices.A.selected_experiences.A === null || choices.A.selected_experiences.B === null)) ||
      (choices.B.option_id === "tier_3_experience_bonus" &&
        (choices.B.selected_experiences.A === null || choices.B.selected_experiences.B === null)) ||
      (choices.A.option_id === "tier_3_subclass_upgrade" &&
        choices.A.selected_subclass_upgrade === null) ||
      (choices.B.option_id === "tier_3_subclass_upgrade" &&
        choices.B.selected_subclass_upgrade === null) ||
      (choices.A.option_id === "tier_4_domain_card" && choices.A.selected_domain_card === null) ||
      (choices.B.option_id === "tier_4_domain_card" && choices.B.selected_domain_card === null) ||
      (choices.A.option_id === "tier_4_traits" &&
        (choices.A.marked_traits.A === null || choices.A.marked_traits.B === null)) ||
      (choices.B.option_id === "tier_4_traits" &&
        (choices.B.marked_traits.A === null || choices.B.marked_traits.B === null)) ||
      (choices.A.option_id === "tier_4_experience_bonus" &&
        (choices.A.selected_experiences.A === null || choices.A.selected_experiences.B === null)) ||
      (choices.B.option_id === "tier_4_experience_bonus" &&
        (choices.B.selected_experiences.A === null || choices.B.selected_experiences.B === null)) ||
      (choices.A.option_id === "tier_4_subclass_upgrade" &&
        choices.A.selected_subclass_upgrade === null) ||
      (choices.B.option_id === "tier_4_subclass_upgrade" &&
        choices.B.selected_subclass_upgrade === null)
    );
  });

  let tier_2_options_open = $state(false);
  let tier_3_options_open = $state(false);
  let tier_4_options_open = $state(true);
</script>

{#if character}
  {@const choices = character.level_up_choices[level as keyof typeof character.level_up_choices]}
  {@const chosen_options = {
    A:
      choices.A.option_id === null
        ? BLANK_LEVEL_UP_OPTION
        : ALL_LEVEL_UP_OPTIONS[choices.A.option_id],
    B:
      choices.B.option_id === null
        ? BLANK_LEVEL_UP_OPTION
        : ALL_LEVEL_UP_OPTIONS[choices.B.option_id],
  }}
  {@const level_up_domain_cards =
    character.level_up_domain_cards[level as keyof typeof character.level_up_domain_cards]}

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
        <div class="flex flex-col gap-2 bg-primary/50 p-2 rounded-md" bind:clientWidth={width}>
          <p class="py-1 px-2 text-xs italic text-muted-foreground">
            Take an additional domain card of your level or lower from a domain you have access to.
          </p>
          <Dialog.Root>
            <Dialog.Trigger
              class={cn(
                buttonVariants({ variant: "outline" }),
                "w-full truncate flex items-center justify-between bg-card/50 hover:bg-card/70",
                level_up_domain_cards.A === null &&
                  "text-muted-foreground hover:text-muted-foreground"
              )}
              style={cn(
                level_up_domain_cards.A === null &&
                  "outline-offset: 2px; outline-width: 2px; outline-color: var(--primary); outline-style: solid;"
              )}
            >
              <p class="truncate">
                {level_up_domain_cards.A?.title || "Select a domain card"}
              </p>
              <ChevronRight class="size-4 opacity-50" />
            </Dialog.Trigger>

            <Dialog.Content
              class="flex flex-col gap-4 min-w-[calc(100%-1rem)] md:min-w-3xl max-h-[90%]"
            >
              <Dialog.Header>
                <Dialog.Title>Select a Domain Card</Dialog.Title>
              </Dialog.Header>
              <Dialog.Description>
                <p class="text-xs italic text-muted-foreground">
                  Take an additional domain card of your level or lower from a domain you have
                  access to.
                </p>
              </Dialog.Description>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto p-2">
                {#each available_domain_cards as card}
                  <Dialog.Close
                    class={cn(
                      "w-full rounded-xl outline-offset-3 outline-primary hover:outline-4 hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default",
                      level_up_domain_cards.A?.title === card.title && "outline-4"
                    )}
                    onclick={() => {
                      level_up_domain_cards.A = card;
                    }}
                    disabled={level_up_domain_cards.A?.title !== card.title &&
                      previously_chosen_domain_cards.some((c) => c.title === card.title)}
                  >
                    <DomainCard {card} class="w-full h-full" />
                  </Dialog.Close>
                {/each}
              </div>
              <Dialog.Footer>
                {#if level_up_domain_cards.A === null}
                  <Dialog.Close class={cn(buttonVariants({ variant: "link" }))}>
                    Cancel
                  </Dialog.Close>
                {:else}
                  <Dialog.Close
                    class={cn(buttonVariants({ variant: "link" }), "text-destructive")}
                    onclick={() => (level_up_domain_cards.A = null)}
                  >
                    Clear selection
                  </Dialog.Close>
                {/if}
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </div>

        <!-- level up choices -->
        <Select.Root
          type="single"
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
                  choices.A = BLANK_LEVEL_UP_CHOICE;
                  choices.B = BLANK_LEVEL_UP_CHOICE;
                }}
              >
                -- Clear selection --
              </button>
              <Select.Group>
                <Collapsible.Root bind:open={tier_2_options_open}>
                  <Collapsible.Trigger class="w-full">
                    <Select.GroupHeading
                      class="flex items-center gap-2 hover:bg-muted text-accent my-0.5 py-1"
                    >
                      <ChevronRight
                        class={cn("size-4 opacity-50 stroke-3", tier_2_options_open && "rotate-90")}
                      />
                      Tier 2 Options
                    </Select.GroupHeading>
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    {#each Object.entries(TIER_2_BASE_OPTIONS) as [option_id, option]}
                      <button
                        disabled={context.options_used[option_id] >= option.max ||
                          (choices.A.option_id !== null && choices.B.option_id !== null) ||
                          chosen_options.A.costs_two_choices ||
                          chosen_options.B.costs_two_choices ||
                          (option.costs_two_choices &&
                            (choices.A.option_id !== null || choices.B.option_id !== null))}
                        class="text-left hover:cursor-pointer hover:bg-muted disabled:opacity-50 disabled:pointer-events-none disabled:cursor-default flex w-full select-none items-center gap-2 rounded-sm py-1.5 px-2 text-sm"
                        onclick={() => {
                          // if one choice is available, set it to the selected option
                          if (choices.A.option_id === null) {
                            choices.A.option_id = option_id as keyof typeof TIER_2_BASE_OPTIONS;
                          } else if (choices.B.option_id === null) {
                            choices.B.option_id = option_id as keyof typeof TIER_2_BASE_OPTIONS;
                          } else if (choices.A.option_id !== null && choices.B.option_id !== null) {
                            if (
                              choices.A.option_id === option_id &&
                              choices.B.option_id === option_id
                            ) {
                              choices.A.option_id = null;
                              choices.B.option_id = null;
                            } else if (choices.A.option_id === option_id) {
                              choices.A.option_id = null;
                            } else if (choices.B.option_id === option_id) {
                              choices.B.option_id = null;
                            }
                          }
                        }}
                      >
                        <div class="flex gap-1 w-14 shrink-0 justify-end">
                          {#each Array(option.max) as _, i}
                            {#if i < context.options_used[option_id]}
                              <SquareCheck class="size-4" />
                            {:else}
                              <Square class="size-4" />
                            {/if}
                          {/each}
                        </div>
                        <p class="grow">{@html option.title_html}</p>
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
              <Select.Group>
                <Collapsible.Root bind:open={tier_3_options_open}>
                  <Collapsible.Trigger class="w-full">
                    <Select.GroupHeading
                      class="flex items-center gap-2 hover:bg-muted text-accent my-0.5 py-1"
                    >
                      <ChevronRight
                        class={cn("size-4 opacity-50 stroke-3", tier_3_options_open && "rotate-90")}
                      />
                      Tier 3 Options
                    </Select.GroupHeading>
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    {#each Object.entries(TIER_3_BASE_OPTIONS) as [option_id, option]}
                      <button
                        disabled={context.options_used[option_id] >= option.max ||
                          (choices.A.option_id !== null && choices.B.option_id !== null) ||
                          chosen_options.A.costs_two_choices ||
                          chosen_options.B.costs_two_choices ||
                          (option.costs_two_choices &&
                            (choices.A.option_id !== null || choices.B.option_id !== null))}
                        class="text-left hover:cursor-pointer hover:bg-muted disabled:opacity-50 disabled:pointer-events-none disabled:cursor-default flex w-full select-none items-center gap-2 rounded-sm py-1.5 px-2 text-sm"
                        onclick={() => {
                          // if one choice is available, set it to the selected option
                          if (choices.A.option_id === null) {
                            choices.A.option_id = option_id as keyof typeof TIER_3_BASE_OPTIONS;
                          } else if (choices.B.option_id === null) {
                            choices.B.option_id = option_id as keyof typeof TIER_3_BASE_OPTIONS;
                          } else if (choices.A.option_id !== null && choices.B.option_id !== null) {
                            if (
                              choices.A.option_id === option_id &&
                              choices.B.option_id === option_id
                            ) {
                              choices.A.option_id = null;
                              choices.B.option_id = null;
                            } else if (choices.A.option_id === option_id) {
                              choices.A.option_id = null;
                            } else if (choices.B.option_id === option_id) {
                              choices.B.option_id = null;
                            }
                          }
                        }}
                      >
                        <div class="flex gap-1 w-14 shrink-0 justify-end">
                          {#each Array(option.max) as _, i}
                            {#if i < context.options_used[option_id]}
                              {#if option.costs_two_choices}
                                <div
                                  class="flex gap-1 rounded-xs outline-offset-1 outline-muted-foreground outline-2"
                                >
                                  <SquareCheck class="size-4" />
                                  <SquareCheck class="size-4" />
                                </div>
                              {:else}
                                <SquareCheck class="size-4" />
                              {/if}
                            {:else if option.costs_two_choices}
                              <div
                                class="flex gap-1 rounded-xs outline-offset-1 outline-muted-foreground outline-2"
                              >
                                <Square class="size-4" />
                                <Square class="size-4" />
                              </div>
                            {:else}
                              <Square class="size-4" />
                            {/if}
                          {/each}
                        </div>
                        <p class="grow">{@html option.title_html}</p>
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
              <Select.Group>
                <Collapsible.Root bind:open={tier_4_options_open}>
                  <Collapsible.Trigger class="w-full">
                    <Select.GroupHeading
                      class="flex items-center gap-2 hover:bg-muted text-accent my-0.5 py-1"
                    >
                      <ChevronRight
                        class={cn("size-4 opacity-50 stroke-3", tier_4_options_open && "rotate-90")}
                      />
                      Tier 4 Options
                    </Select.GroupHeading>
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    {#each Object.entries(TIER_4_BASE_OPTIONS) as [option_id, option]}
                      {@const disabled =
                        (option_id === "tier_4_multiclass" &&
                          (context.options_used["tier_3_multiclass"] >= 1 ||
                            context.options_used["tier_4_subclass_upgrade"] >= 1)) ||
                        (option_id === "tier_4_subclass_upgrade" &&
                          context.options_used["tier_4_multiclass"] >= 1)}
                      <button
                        disabled={context.options_used[option_id] >= option.max ||
                          (choices.A.option_id !== null && choices.B.option_id !== null) ||
                          chosen_options.A.costs_two_choices ||
                          chosen_options.B.costs_two_choices ||
                          (option.costs_two_choices &&
                            (choices.A.option_id !== null || choices.B.option_id !== null)) ||
                          disabled}
                        class="text-left hover:cursor-pointer hover:bg-muted disabled:opacity-50 disabled:pointer-events-none disabled:cursor-default flex w-full select-none items-center gap-2 rounded-sm py-1.5 px-2 text-sm"
                        onclick={() => {
                          // if one choice is available, set it to the selected option
                          if (choices.A.option_id === null) {
                            choices.A.option_id = option_id as keyof typeof TIER_4_BASE_OPTIONS;
                          } else if (choices.B.option_id === null) {
                            choices.B.option_id = option_id as keyof typeof TIER_4_BASE_OPTIONS;
                          } else if (choices.A.option_id !== null && choices.B.option_id !== null) {
                            if (
                              choices.A.option_id === option_id &&
                              choices.B.option_id === option_id
                            ) {
                              choices.A.option_id = null;
                              choices.B.option_id = null;
                            } else if (choices.A.option_id === option_id) {
                              choices.A.option_id = null;
                            } else if (choices.B.option_id === option_id) {
                              choices.B.option_id = null;
                            }
                          }
                        }}
                      >
                        <div class="w-14 shrink-0 flex justify-end">
                          <div class={cn("gap-1 flex w-min relative")}>
                            {#if disabled}
                              <span
                                class="absolute top-1/2 -translate-y-1/2 -left-1 -right-1 h-[1px] bg-foreground"
                              ></span>
                            {/if}
                            {#each Array(option.max) as _, i}
                              {@const Icon =
                                i < context.options_used[option_id] ? SquareCheck : Square}
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
                        <p class={cn("grow" /*, disabled && "line-through"*/)}>
                          {@html option.title_html}
                        </p>
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
            </div>
          </Select.Content>
        </Select.Root>

        <!-- secondary choices based on the selected option -->
        {#each ["A" as keyof typeof choices, "B" as keyof typeof choices] as key}
          {#if choices[key].option_id === "tier_2_traits" || choices[key].option_id === "tier_3_traits" || choices[key].option_id === "tier_4_traits"}
            <div class="flex flex-col gap-2 bg-primary/50 p-2 rounded-md">
              <p class="py-1 px-2 text-xs italic text-muted-foreground">
                Choose 2 unmarked character traits.
              </p>
              <div class="flex gap-2.5">
                <Select.Root
                  type="single"
                  value={choices[key].marked_traits.A?.toString() || ""}
                  onValueChange={(value) => {
                    const trait = value as keyof Traits;
                    choices[key].marked_traits.A = trait ? trait : null;
                  }}
                >
                  <Select.Trigger
                    highlighted={choices[key].marked_traits.A === null}
                    class="w-full truncate"
                  >
                    <p class="truncate">
                      {choices[key].marked_traits.A
                        ? TRAITS[choices[key].marked_traits.A as keyof typeof TRAITS].name
                        : "Select a trait"}
                    </p>
                  </Select.Trigger>

                  <Select.Content class="rounded-md " align="start">
                    <div style="max-width: {width}px;" class="p-2">
                      <Select.Item value="" class="justify-center hover:cursor-pointer text-sm">
                        -- none selected --
                      </Select.Item>
                      <Select.Label>Traits</Select.Label>
                      {#each Object.keys(TRAITS) as trait}
                        <Select.Item
                          disabled={context.tier_4_marked_traits[trait as keyof Traits]}
                          value={trait}>{TRAITS[trait as keyof typeof TRAITS].name}</Select.Item
                        >
                      {/each}
                    </div>
                  </Select.Content>
                </Select.Root>
                <Select.Root
                  type="single"
                  value={choices[key].marked_traits.B?.toString() || ""}
                  onValueChange={(value) => {
                    const trait = value as keyof Traits;
                    choices[key].marked_traits.B = trait ? trait : null;
                  }}
                >
                  <Select.Trigger
                    highlighted={choices[key].marked_traits.B === null}
                    class="w-full truncate"
                  >
                    <p class="truncate">
                      {choices[key].marked_traits.B
                        ? TRAITS[choices[key].marked_traits.B as keyof typeof TRAITS].name
                        : "Select a trait"}
                    </p>
                  </Select.Trigger>
                  <Select.Content class="rounded-md " align="end">
                    <div style="max-width: {width}px;" class="p-2">
                      <Select.Item value="" class="justify-center hover:cursor-pointer text-sm">
                        -- none selected --
                      </Select.Item>
                      <Select.Label>Traits</Select.Label>
                      {#each Object.keys(TRAITS) as trait}
                        <Select.Item
                          disabled={context.tier_4_marked_traits[trait as keyof Traits]}
                          value={trait}>{TRAITS[trait as keyof typeof TRAITS].name}</Select.Item
                        >
                      {/each}
                    </div>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
          {:else if choices[key].option_id === "tier_2_experience_bonus" || choices[key].option_id === "tier_3_experience_bonus" || choices[key].option_id === "tier_4_experience_bonus"}
            <div class="flex flex-col gap-2 bg-primary/50 p-2 rounded-md">
              <p class="py-1 px-2 text-xs italic font-medium text-muted-foreground">
                Choose 2 Experiences.
              </p>
              <div class="flex gap-2.5">
                <Select.Root
                  type="single"
                  value={choices[key].selected_experiences.A === null
                    ? ""
                    : choices[key].selected_experiences.A.toString()}
                  onValueChange={(value) => {
                    choices[key].selected_experiences.A = value !== "" ? parseInt(value) : null;
                  }}
                >
                  <Select.Trigger
                    highlighted={choices[key].selected_experiences.A === null}
                    class="w-full truncate"
                  >
                    <p class="truncate">
                      {choices[key].selected_experiences.A !== null
                        ? character.experiences[choices[key].selected_experiences.A].trim() ||
                          "Unnamed Experience"
                        : "Select an Experience"}
                    </p>
                  </Select.Trigger>
                  <Select.Content class="rounded-md" align="start">
                    <div style="max-width: {width}px;" class="p-2">
                      <Select.Item value="" class="justify-center hover:cursor-pointer text-sm">
                        -- none selected --
                      </Select.Item>
                      <Select.Label>Experiences</Select.Label>
                      {#each character.experiences as experience, j}
                        <Select.Item
                          disabled={choices[key].selected_experiences.B === j}
                          class="hover:cursor-pointer"
                          value={j.toString()}
                          >{experience.trim() || "Unnamed Experience"}</Select.Item
                        >
                      {/each}
                    </div>
                  </Select.Content>
                </Select.Root>
                <Select.Root
                  type="single"
                  value={choices[key].selected_experiences.B === null
                    ? ""
                    : choices[key].selected_experiences.B.toString()}
                  onValueChange={(value) => {
                    choices[key].selected_experiences.B = value !== "" ? parseInt(value) : null;
                  }}
                >
                  <Select.Trigger
                    highlighted={choices[key].selected_experiences.B === null}
                    class="w-full truncate"
                  >
                    <p class="truncate">
                      {choices[key].selected_experiences.B !== null
                        ? character.experiences[choices[key].selected_experiences.B].trim() ||
                          "Unnamed Experience"
                        : "Select an Experience"}
                    </p>
                  </Select.Trigger>
                  <Select.Content class="rounded-md" align="end">
                    <div style="max-width: {width}px;" class="p-2">
                      <Select.Item value="" class="justify-center hover:cursor-pointer text-sm">
                        -- none selected --
                      </Select.Item>
                      <Select.Label>Experiences</Select.Label>
                      {#each character.experiences as experience, j}
                        <Select.Item
                          disabled={choices[key].selected_experiences.A === j}
                          class="hover:cursor-pointer"
                          value={j.toString()}
                          >{experience.trim() || "Unnamed Experience"}</Select.Item
                        >
                      {/each}
                    </div>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
          {:else if choices[key].option_id === "tier_2_domain_card" || choices[key].option_id === "tier_3_domain_card" || choices[key].option_id === "tier_4_domain_card"}
            <div class="flex flex-col gap-2 bg-primary/50 p-2 rounded-md" bind:clientWidth={width}>
              <p class="py-1 px-2 text-xs italic text-muted-foreground">
                Choose an additional domain card of your level or lower from a domain you have
                access to (up to level 4).
              </p>
              <Dialog.Root>
                <Dialog.Trigger
                  class={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full truncate flex items-center justify-between bg-card/50 hover:bg-card/70",
                    choices[key].selected_domain_card === null &&
                      "text-muted-foreground hover:text-muted-foreground"
                  )}
                  style={cn(
                    choices[key].selected_domain_card === null &&
                      "outline-offset: 2px; outline-width: 2px; outline-color: var(--primary); outline-style: solid;"
                  )}
                >
                  <p class="truncate">
                    {choices[key].selected_domain_card?.title || "Select a domain card"}
                  </p>
                  <ChevronRight class="size-4 opacity-50" />
                </Dialog.Trigger>

                <Dialog.Content
                  class="flex flex-col gap-4 min-w-[calc(100%-1rem)] md:min-w-3xl max-h-[90%]"
                >
                  <Dialog.Header>
                    <Dialog.Title>Select a Domain Card</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Description>
                    <p class="text-xs italic text-muted-foreground">
                      Choose an additional domain card of your level or lower from a domain you have
                      access to (up to level 4).
                    </p>
                  </Dialog.Description>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto p-2">
                    {#each available_domain_cards as card}
                      <Dialog.Close
                        class={cn(
                          "w-full rounded-xl outline-offset-3 outline-primary hover:outline-4 hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default",
                          choices[key].selected_domain_card?.title === card.title && "outline-4"
                        )}
                        onclick={() => {
                          choices[key].selected_domain_card = card;
                        }}
                        disabled={choices[key].selected_domain_card?.title !== card.title &&
                          previously_chosen_domain_cards.some((c) => c.title === card.title)}
                      >
                        <DomainCard {card} class="w-full h-full" />
                      </Dialog.Close>
                    {/each}
                  </div>
                  <Dialog.Footer>
                    {#if choices[key].selected_domain_card === null}
                      <Dialog.Close class={cn(buttonVariants({ variant: "link" }))}>
                        Cancel
                      </Dialog.Close>
                    {:else}
                      <Dialog.Close
                        class={cn(buttonVariants({ variant: "link" }), "text-destructive")}
                        onclick={() => (choices[key].selected_domain_card = null)}
                      >
                        Clear selection
                      </Dialog.Close>
                    {/if}
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Root>
            </div>
          {:else if choices[key].option_id === "tier_3_subclass_upgrade" || choices[key].option_id === "tier_4_subclass_upgrade"}
            <div class="flex flex-col gap-2 bg-primary/50 p-2 rounded-md" bind:clientWidth={width}>
              <p class="py-1 px-2 text-xs italic text-muted-foreground">
                Take the next card for your subclass. If you have only the foundation card, take a
                specialization; if you have a specialization already, take a mastery.
              </p>

              <Select.Root
                value={choices[key].selected_subclass_upgrade || ""}
                type="single"
                onValueChange={(value) => {
                  if (value === "") choices[key].selected_subclass_upgrade = null;
                  else {
                    choices[key].selected_subclass_upgrade = value as "primary" | "secondary";
                  }
                }}
              >
                <Select.Trigger
                  class="w-full truncate"
                  highlighted={choices[key].selected_subclass_upgrade === null}
                >
                  {choices[key].selected_subclass_upgrade === "primary"
                    ? character.primary_class?.name + " • " + character.primary_subclass?.name
                    : choices[key].selected_subclass_upgrade === "secondary"
                      ? character.secondary_class?.name + " • " + character.secondary_subclass?.name
                      : "Select a subclass to upgrade"}
                </Select.Trigger>
                <Select.Content class="rounded-md" align="start">
                  <div style="max-width: {width}px;" class="p-2">
                    <Select.Item value="" class="justify-center hover:cursor-pointer text-sm">
                      -- none selected --
                    </Select.Item>
                    <Select.Label>Choose a subclass to upgrade</Select.Label>
                    {#if character.primary_subclass !== null && character.primary_class !== null}
                      <Select.Item value="primary">
                        {character.primary_class.name} • {character.primary_subclass.name}
                      </Select.Item>
                    {/if}
                    {#if character.secondary_subclass !== null && character.secondary_class !== null}
                      <Select.Item value="secondary">
                        {character.secondary_class.name} • {character.secondary_subclass.name}
                      </Select.Item>
                    {/if}
                  </div>
                </Select.Content>
              </Select.Root>

              {#if choices[key].selected_subclass_upgrade !== null && character.primary_subclass !== null}
                <p class="p-2">
                  {#if choices[key].selected_subclass_upgrade === "primary"}
                    {#if context.options_used["tier_3_subclass_upgrade"] >= 1 && context.options_used["tier_4_subclass_upgrade"] >= 1}
                      <!-- level that "tier_3_subclass_upgrade" was used at -->
                      {@const tier_3_subclass_upgrade_level = Object.values(
                        character.level_up_choices
                      ).findIndex(
                        (choice) =>
                          choice.A.option_id === "tier_3_subclass_upgrade" ||
                          choice.B.option_id === "tier_3_subclass_upgrade"
                      )}
                      {@const tier_4_subclass_upgrade_level = Object.values(
                        character.level_up_choices
                      ).findIndex(
                        (choice) =>
                          choice.A.option_id === "tier_4_subclass_upgrade" ||
                          choice.B.option_id === "tier_4_subclass_upgrade"
                      )}

                      {#if (choices[key].option_id === "tier_4_subclass_upgrade" && tier_3_subclass_upgrade_level < tier_4_subclass_upgrade_level) || (choices[key].option_id === "tier_3_subclass_upgrade" && tier_4_subclass_upgrade_level < tier_3_subclass_upgrade_level)}
                        <SubclassCard card={character.primary_subclass.mastery_card} />
                      {:else}
                        <SubclassCard card={character.primary_subclass.specialization_card} />
                      {/if}
                    {:else}
                      <SubclassCard card={character.primary_subclass.specialization_card} />
                    {/if}
                  {:else if choices[key].selected_subclass_upgrade === "secondary" && character.secondary_subclass !== null}
                    <SubclassCard card={character.secondary_subclass.specialization_card} />
                  {/if}
                </p>
              {/if}
            </div>
          {/if}
        {/each}
      </div>
    </Dropdown>
  </div>
{/if}
