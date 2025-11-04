<script lang="ts">
  import Dropdown from "$lib/components/app/builder/dropdown.svelte";
  import SubclassCard from "$lib/components/app/cards/subclass-card.svelte";
  import type { Card, Character, LevelUpOption } from "$lib/ts/types";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import * as Collapsible from "$lib/components/ui/collapsible/";
  import * as Dialog from "$lib/components/ui/dialog/index";
  import * as Select from "$lib/components/ui/select/";
  import Button, { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import { cn } from "$lib/utils";
  import { DOMAINS } from "$lib/ts/constants/constants";
  import DomainCard from "../../cards/domain-card.svelte";
  import ClassSelector from "./selectors/class-selector.svelte";

  let { character = $bindable(), class: className = "" }: { character: Character; class?: string } =
    $props();

  let subclassDialogOpen = $state(false);
  let subclassCardsOpen = $state(false);

  let available_domain_cards: Card<"domain">[] = $derived.by(() => {
    if (!character.primary_class) return [];
    const primary_domain = character.primary_class.primary_domain;
    const secondary_domain = character.primary_class.secondary_domain;
    const domain_cards = Object.values(
      DOMAINS[primary_domain as keyof typeof DOMAINS].cards
    ).concat(Object.values(DOMAINS[secondary_domain as keyof typeof DOMAINS].cards));

    return domain_cards.filter((card) => card.level_requirement === 1);
  });
</script>

<div class={cn("flex flex-col gap-4", className)}>
  <!-- Select a Class -->
  <ClassSelector bind:character />

  <!-- Select a Subclass -->
  <Dropdown
    highlighted={!character.primary_subclass}
    disabled={!character.primary_class}
    title="Subclass"
    subtitle={character.primary_subclass?.name}
  >
    {#if !character.primary_subclass}
      <Button onclick={() => (subclassDialogOpen = true)}>Choose a subclass</Button>
    {:else}
      <div class="flex flex-col gap-4">
        <p class="text-lg font-medium">{character.primary_subclass.name}</p>
        <p class="-mt-2 text-xs italic text-muted-foreground">
          {@html character.primary_subclass.description_html}
        </p>

        <SubclassCard card={character.primary_subclass.foundation_card} />

        {#if character.derived_stats.primary_class_mastery_level < 3}
          <Collapsible.Root bind:open={subclassCardsOpen}>
            <Collapsible.Trigger class="flex items-center text-left text-sm text-muted-foreground">
              <ChevronRight
                class={cn("w-k h-4 transition-transform", subclassCardsOpen && "rotate-90")}
              />
              Specialization and Mastery Cards
            </Collapsible.Trigger>
            <Collapsible.Content class="flex flex-col gap-3 py-4 opacity-70">
              <SubclassCard card={character.primary_subclass.specialization_card} />
              <SubclassCard card={character.primary_subclass.mastery_card} />
            </Collapsible.Content>
          </Collapsible.Root>
        {/if}

        <div class="flex justify-center sm:justify-end">
          <Button
            variant="link"
            class="text-destructive"
            onclick={() => (character.primary_subclass = null)}>Remove</Button
          >
        </div>
      </div>
    {/if}
  </Dropdown>

  <!-- Domain Cards -->
  <Dropdown
    title="Level 1"
    disabled={!character.primary_class}
    highlighted={character.level_up_domain_cards[1].A === null ||
      character.level_up_domain_cards[1].B === null}
    subtitle={[
      character.level_up_domain_cards[1].A?.title,
      character.level_up_domain_cards[1].B?.title,
    ]
      .filter((title) => title !== undefined)
      .join(", ")}
  >
    {#if character.primary_class}
      <div class="flex flex-col gap-2 bg-primary/50 p-2 rounded-md">
        <p class="py-1 px-2 text-xs italic text-muted-foreground">
          Choose up to 2 level 1 domain cards from the
          <b>{DOMAINS[character.primary_class.primary_domain as keyof typeof DOMAINS].name}</b>
          and
          <b>{DOMAINS[character.primary_class.secondary_domain as keyof typeof DOMAINS].name}</b>
          domains.
        </p>

        <div class="flex flex gap-2.5">
          <Dialog.Root>
            <Dialog.Trigger
              class={cn(
                buttonVariants({ variant: "outline" }),
                "w-full truncate flex items-center justify-between bg-card/50 hover:bg-card/70",
                character.level_up_domain_cards[1].A === null &&
                  "text-muted-foreground hover:text-muted-foreground"
              )}
              style={cn(
                character.level_up_domain_cards[1].A === null &&
                  "outline-offset: 2px; outline-width: 2px; outline-color: var(--primary); outline-style: solid;"
              )}
            >
              <p class="truncate">
                {character.level_up_domain_cards[1].A?.title || "Select a domain card"}
              </p>
              <ChevronRight class="size-4 opacity-50" />
            </Dialog.Trigger>

            <Dialog.Content
              class="flex flex-col gap-4 min-w-[calc(100%-1rem)] md:min-w-3xl max-h-[90%]"
            >
              <Dialog.Header>
                <Dialog.Title>Select a Level 1 Domain Card</Dialog.Title>
              </Dialog.Header>
              <Dialog.Description>
                <p class="text-xs italic text-muted-foreground">
                  Choose a domain card from the
                  <b
                    >{DOMAINS[character.primary_class.primary_domain as keyof typeof DOMAINS]
                      .name}</b
                  >
                  and
                  <b
                    >{DOMAINS[character.primary_class.secondary_domain as keyof typeof DOMAINS]
                      .name}</b
                  >
                  domains.
                </p>
              </Dialog.Description>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto p-2">
                {#each available_domain_cards as card}
                  <Dialog.Close
                    class={cn(
                      "w-full rounded-xl outline-offset-3 outline-primary hover:outline-4 hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default",
                      character.level_up_domain_cards[1].A?.title === card.title && "outline-4"
                    )}
                    onclick={() => (character.level_up_domain_cards[1].A = card)}
                    disabled={character.level_up_domain_cards[1].A?.title !== card.title &&
                      character.derived_domain_card_vault.some((c) => c.title === card.title)}
                  >
                    <DomainCard {card} class="w-full h-full" />
                  </Dialog.Close>
                {/each}
              </div>
              <Dialog.Footer>
                <Dialog.Close
                  class={cn(buttonVariants({ variant: "link" }), "text-destructive")}
                  onclick={() => (character.level_up_domain_cards[1].A = null)}
                >
                  Clear selection
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>

          <Dialog.Root>
            <Dialog.Trigger
              class={cn(
                buttonVariants({ variant: "outline" }),
                "w-full truncate flex items-center justify-between bg-card/50 hover:bg-card/70",
                character.level_up_domain_cards[1].B === null &&
                  "text-muted-foreground hover:text-muted-foreground"
              )}
              style={cn(
                character.level_up_domain_cards[1].B === null &&
                  "outline-offset: 2px; outline-width: 2px; outline-color: var(--primary); outline-style: solid;"
              )}
            >
              <p class="truncate">
                {character.level_up_domain_cards[1].B?.title || "Select a domain card"}
              </p>
              <ChevronRight class="size-4 opacity-50" />
            </Dialog.Trigger>

            <Dialog.Content
              class="flex flex-col gap-4 min-w-[calc(100%-1rem)] md:min-w-3xl max-h-[90%]"
            >
              <Dialog.Header>
                <Dialog.Title>Select a Level 1 Domain Card</Dialog.Title>
              </Dialog.Header>
              <Dialog.Description>
                <p class="text-xs italic text-muted-foreground">
                  Choose a domain card from the
                  <b
                    >{DOMAINS[character.primary_class.primary_domain as keyof typeof DOMAINS]
                      .name}</b
                  >
                  and
                  <b
                    >{DOMAINS[character.primary_class.secondary_domain as keyof typeof DOMAINS]
                      .name}</b
                  >
                  domains.
                </p>
              </Dialog.Description>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto p-2">
                {#each available_domain_cards as card}
                  <Dialog.Close
                    class={cn(
                      "w-full rounded-xl outline-offset-3 outline-primary hover:outline-4 hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default",
                      character.level_up_domain_cards[1].B?.title === card.title && "outline-4"
                    )}
                    onclick={() => (character.level_up_domain_cards[1].B = card)}
                    disabled={character.level_up_domain_cards[1].B?.title !== card.title &&
                      character.derived_domain_card_vault.some((c) => c.title === card.title)}
                  >
                    <DomainCard {card} class="w-full h-full" />
                  </Dialog.Close>
                {/each}
              </div>
              <Dialog.Footer>
                <Dialog.Close
                  class={cn(buttonVariants({ variant: "link" }), "text-destructive")}
                  onclick={() => (character.level_up_domain_cards[1].B = null)}
                >
                  Clear selection
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>
    {/if}
  </Dropdown>
</div>

<!-- Choose a Subclass dialog -->
<Dialog.Root bind:open={subclassDialogOpen}>
  <Dialog.Content class="flex flex-col min-w-[calc(100%-1rem)] md:min-w-3xl max-h-[90%]">
    <Dialog.Header>
      <Dialog.Title>Select a Subclass</Dialog.Title>
    </Dialog.Header>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto">
      <!-- each class -->
      {#if character.primary_class}
        {#each Object.values(character.primary_class.subclasses) as subclass}
          <div class="flex flex-col gap-3 border-2 rounded-md p-3 bg-primary-muted">
            <p class="text-lg font-medium">{subclass.name}</p>
            <p class="-mt-2 text-xs italic text-muted-foreground">
              {@html subclass.description_html}
            </p>
            {#if subclass.foundation_card.spellcast_trait}
              <p class="text-xs italic text-muted-foreground">
                <b class="text-foreground"><em>Spellcast Trait:</em></b>
                {subclass.foundation_card.spellcast_trait}
              </p>
            {/if}
            <Button
              class="mt-2"
              disabled={character.primary_subclass?.name === subclass.name}
              onclick={() => {
                character.primary_subclass = subclass;
                subclassDialogOpen = false;
              }}
            >
              {character.primary_subclass?.name === subclass.name
                ? "Selected"
                : "Select " + subclass.name}
            </Button>
          </div>
        {/each}
      {/if}
    </div>
    <Dialog.Footer>
      <Dialog.Close class={buttonVariants({ variant: "link" })}>Cancel</Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
