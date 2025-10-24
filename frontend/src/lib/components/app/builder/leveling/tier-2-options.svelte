<script lang="ts">
  import type { LevelUpOption, Traits, Character, Card } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import Square from "@lucide/svelte/icons/square";
  import SquareCheck from "@lucide/svelte/icons/square-check";
  import * as Select from "$lib/components/ui/select/";
  import * as Dialog from "$lib/components/ui/dialog/";
  import { BLANK_LEVEL_UP_OPTION, TIER_2_BASE_OPTIONS } from "$lib/ts/rules";
  import { DOMAINS, TRAITS } from "$lib/ts/constants";
  import DomainCard from "../../cards/domain-card.svelte";
  import { getCharacterContext } from "$lib/ts/character.svelte";
  import { buttonVariants } from "$lib/components/ui/button";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import Dropdown from "$lib/components/app/builder/dropdown.svelte";

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
    const domain_cards = Object.values(character.level_1_domain_cards).filter(
      (card) => card !== null
    );

    for (let i = 2; i <= level; i++) {
      const choices = character.level_up_choices[i as keyof typeof character.level_up_choices];
      if (choices.A.id === "tier_2_domain_card") {
        if (choices.A.domain_cards_added.A !== null)
          domain_cards.push(choices.A.domain_cards_added.A);
        if (choices.A.domain_cards_added.B !== null)
          domain_cards.push(choices.A.domain_cards_added.B);
      }
      if (choices.B.id === "tier_2_domain_card") {
        if (choices.B.domain_cards_added.A !== null)
          domain_cards.push(choices.B.domain_cards_added.A);
        if (choices.B.domain_cards_added.B !== null)
          domain_cards.push(choices.B.domain_cards_added.B);
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

    return domain_cards.filter((card) => card.level_requirement <= Math.min(level, 4));
  });

  let width: number = $state(300);

  let highlighted = $derived.by(() => {
    if (!character) return false;
    const choices = character.level_up_choices[level as keyof typeof character.level_up_choices];

    return (
      !choices.A.id ||
      !choices.B.id ||
      (choices.A.id === "tier_2_domain_card" && choices.A.domain_cards_added.A === null) ||
      (choices.B.id === "tier_2_domain_card" && choices.B.domain_cards_added.A === null) ||
      (choices.A.id === "tier_2_traits" &&
        (choices.A.marked_traits.A === null || choices.A.marked_traits.B === null)) ||
      (choices.B.id === "tier_2_traits" &&
        (choices.B.marked_traits.A === null || choices.B.marked_traits.B === null)) ||
      (choices.A.id === "tier_2_experience_bonus" &&
        (choices.A.selected_experiences.A === null || choices.A.selected_experiences.B === null)) ||
      (choices.B.id === "tier_2_experience_bonus" &&
        (choices.B.selected_experiences.A === null || choices.B.selected_experiences.B === null))
    );
  });
</script>

{#if character}
  {@const choices = character.level_up_choices[level as keyof typeof character.level_up_choices]}

  <div class={cn(className)}>
    <Dropdown
      title="Level {level}"
      {highlighted}
      subtitle={[choices.A.short_title, choices.B.short_title]
        .filter((title) => title !== null)
        .join(", ")}
    >
      <div class="flex flex-col gap-4" bind:clientWidth={width}>
        {#each ["A" as keyof typeof choices, "B" as keyof typeof choices] as key}
          <div class="flex flex-col gap-2">
            <Select.Root
              type="single"
              value={choices[key].id || ""}
              onValueChange={(value) => {
                const option = TIER_2_BASE_OPTIONS.find((option) => option.id === value);
                if (option) {
                  choices[key] = { ...choices[key], ...option };
                } else {
                  choices[key] = BLANK_LEVEL_UP_OPTION;
                }
              }}
            >
              <Select.Trigger
                highlighted={choices[key].id === null}
                class="w-full truncate bg-muted/80 hover:bg-muted/50"
              >
                <p class="truncate">
                  {TIER_2_BASE_OPTIONS.find((option) => option.id === choices[key].id)
                    ?.short_title || "Select a tier 2 option"}
                </p>
              </Select.Trigger>
              <Select.Content class="rounded-md " align="start">
                <div style="max-width: {width}px;" class="p-2">
                  <Select.Item value="" class="justify-center hover:cursor-pointer text-sm">
                    -- none selected --
                  </Select.Item>
                  <Select.Label>Tier 2 Options</Select.Label>

                  {#each TIER_2_BASE_OPTIONS as option}
                    <Select.Item
                      value={option.id}
                      disabled={context.options_used[option.id] >= context.options_max[option.id] &&
                        choices[key].id !== option.id}
                      class="hover:cursor-pointer"
                    >
                      <div class="flex gap-1 w-14 shrink-0 justify-end">
                        {#each Array(option.max) as _, i}
                          {#if i < context.options_used[option.id]}
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

            {#if choices[key].id === "tier_2_traits"}
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
                            disabled={context.tier_2_marked_traits[trait as keyof Traits]}
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
                            disabled={context.tier_2_marked_traits[trait as keyof Traits]}
                            value={trait}>{TRAITS[trait as keyof typeof TRAITS].name}</Select.Item
                          >
                        {/each}
                      </div>
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>
            {:else if choices[key].id === "tier_2_experience_bonus"}
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
            {:else if choices[key].id === "tier_2_domain_card"}
              <div
                class="flex flex-col gap-2 bg-primary/50 p-2 rounded-md"
                bind:clientWidth={width}
              >
                <p class="py-1 px-2 text-xs italic text-muted-foreground">
                  Choose an additional domain card of your level or lower from a domain you have
                  access to (up to level 4).
                </p>
                <Dialog.Root>
                  <Dialog.Trigger
                    class={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full truncate flex items-center justify-between bg-card/50 hover:bg-card/70",
                      choices[key].domain_cards_added.A === null &&
                        "text-muted-foreground hover:text-muted-foreground"
                    )}
                    style={choices[key].domain_cards_added.A === null &&
                      "outline-offset: 2px; outline-width: 2px; outline-color: var(--primary); outline-style: solid;"}
                  >
                    <p class="truncate">
                      {choices[key].domain_cards_added.A?.title || "Select a domain card"}
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
                        Choose an additional domain card of your level or lower from a domain you
                        have access to (up to level 4).
                      </p>
                    </Dialog.Description>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto ">
                      {#each available_domain_cards as card}
                        <Dialog.Close
                          class={cn(
                            "w-full rounded-xl outline-offset-3 outline-primary hover:outline-4 hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default",
                            choices[key].domain_cards_added.A?.title === card.title && "outline-4"
                          )}
                          onclick={() => {
                            choices[key].domain_cards_added.A = card;
                          }}
                          disabled={choices[key].domain_cards_added.A?.title !== card.title &&
                            previously_chosen_domain_cards.some((c) => c.title === card.title)}
                        >
                          <DomainCard {card} class="w-full h-full" />
                        </Dialog.Close>
                      {/each}
                    </div>
                    <Dialog.Footer>
                      <Dialog.Close
                        class={cn(buttonVariants({ variant: "link" }), "text-destructive")}
                        onclick={() => (choices[key].domain_cards_added.A = null)}
                      >
                        Clear selection
                      </Dialog.Close>
                    </Dialog.Footer>
                  </Dialog.Content>
                </Dialog.Root>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </Dropdown>
  </div>
{/if}
