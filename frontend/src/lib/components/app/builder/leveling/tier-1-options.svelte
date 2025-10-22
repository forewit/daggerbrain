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
  import ClassSummary from "../class-summary.svelte";
  import { CLASSES, DOMAINS } from "$lib/ts/constants";
  import DomainCard from "../../cards/domain-card.svelte";
  import { TIER_1_BASE_OPTIONS } from "$lib/ts/rules";

  let { character = $bindable(), class: className = "" }: { character: Character; class?: string } =
    $props();

  let classDialogOpen = $state(false);
  let removeClassDialogOpen = $state(false);
  let subclassDialogOpen = $state(false);
  let subclassCardsOpen = $state(false);
  let width: number = $state(300);


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
  {#if !character.primary_class}
    <Dropdown title="Class" highlighted>
      <Button onclick={() => (classDialogOpen = true)}>Choose a class</Button>
    </Dropdown>
  {:else}
    <Dropdown
      title="Class"
      subtitle={character.primary_class.name + ", " + character.primary_class.source}
    >
      <div class="flex flex-col gap-2">
        <ClassSummary character_class={character.primary_class} bannerClasses="-mt-4" />
        <div class="mt-4 flex flex-col gap-2">
          <p class="text font-medium">{character.primary_class.hope_feature.title}</p>
          <div class="text-muted-foreground mb-2 text-sm flex flex-col gap-2">
            {@html character.primary_class.hope_feature.description_html}
          </div>
        </div>
        {#each character.primary_class.class_features as feature}
          <div class="flex flex-col gap-2">
            <p class="text font-medium">{feature.title}</p>
            <div class="text-muted-foreground mb-2 text-sm flex flex-col gap-2">
              {@html feature.description_html}
            </div>
          </div>
        {/each}
        <div class="flex justify-between">
          <Button onclick={() => (classDialogOpen = true)}>Change class</Button>

          <Button
            variant="link"
            class="text-destructive"
            onclick={() => (removeClassDialogOpen = true)}>Remove</Button
          >
        </div>
      </div>
    </Dropdown>
  {/if}

  <!-- Select a Subclass -->
  {#if !character.primary_subclass}
    <Dropdown
      title="Subclass"
      disabled={!character.primary_class}
      highlighted={!!character.primary_class}
    >
      <Button onclick={() => (subclassDialogOpen = true)}>Choose a subclass</Button>
    </Dropdown>
  {:else}
    <Dropdown title="Subclass" subtitle={character.primary_subclass.name}>
      <div class="flex flex-col gap-4">
        <p class="text-lg font-medium">{character.primary_subclass.name}</p>
        <p class="-mt-2 text-xs italic text-muted-foreground">
          {@html character.primary_subclass.description_html}
        </p>

        <SubclassCard card={character.primary_subclass.foundation_card} />

        {#if character.derieved_stats.primary_class_mastery_level >= 2}
          <SubclassCard card={character.primary_subclass.specialization_card} />
        {/if}
        {#if character.derieved_stats.primary_class_mastery_level >= 3}
          <SubclassCard card={character.primary_subclass.mastery_card} />
        {/if}

        {#if character.derieved_stats.primary_class_mastery_level < 3}
          <Collapsible.Root bind:open={subclassCardsOpen}>
            <Collapsible.Trigger class="flex items-center text-left text-sm text-muted-foreground">
              <ChevronRight
                class={cn("w-k h-4 transition-transform", subclassCardsOpen && "rotate-90")}
              />
              Available at higher levels
            </Collapsible.Trigger>
            <Collapsible.Content class="flex flex-col gap-3 py-4 opacity-70">
              {#if character.derieved_stats.primary_class_mastery_level < 2}
                <SubclassCard card={character.primary_subclass.specialization_card} />
              {/if}
              <SubclassCard card={character.primary_subclass.mastery_card} />
            </Collapsible.Content>
          </Collapsible.Root>
        {/if}

        <div class="flex justify-between">
          <Button onclick={() => (subclassDialogOpen = true)}>Change subclass</Button>

          <Button
            variant="link"
            class="text-destructive"
            onclick={() => (character.primary_subclass = null)}>Remove</Button
          >
        </div>
      </div>
    </Dropdown>
  {/if}

  <!-- Domain Cards -->
  {#if !character.primary_class}
    <Dropdown title="Domain Cards" disabled={true} highlighted={!!character.primary_class} />
  {:else}
    <Dropdown
      title="Domain Cards"
      highlighted={!character.level_up_choices[1].A.id || character.level_up_choices[1].B.id}
      subtitle={character.level_up_choices[1].A?.domain_cards_added.map((c) => c.title).join(", ")}
    >
      <div class="flex flex-col gap-2" bind:clientWidth={width}>
        <p class="text-xs italic text-muted-foreground">
          Select up to 2 level 1 domain cards from the
          <b>{DOMAINS[character.primary_class.primary_domain as keyof typeof DOMAINS].name}</b>
          and
          <b>{DOMAINS[character.primary_class.secondary_domain as keyof typeof DOMAINS].name}</b>
          domains.
        </p>

        <Select.Root
          type="single"
          value={character.level_up_choices[1].A?.domain_cards_added[0]?.title || ""}
          onValueChange={(value) => {
            const card = available_domain_cards.find((card) => card.title === value);
            if (card) {
             character.level_up_choices[1].A?.domain_cards_added.push(card);
            } else  {
              character.level_up_choices[1].A.domain_cards_added = character.level_up_choices[1].A!.domain_cards_added.filter((c) => c.title !== value);
            }
          }}
        >
          <Select.Trigger class="w-full truncate">
            <p class="truncate">
              {character.level_up_choices[1][0].domain_cards_added[0]?.title ||
                "Select a domain card"}
            </p>
          </Select.Trigger>
          <Select.Content class="rounded-md w-full" align="start">
            <div style="max-width: {width}px;" class="p-2">
              <Select.Item value="" class="justify-center hover:cursor-pointer text-sm">
                -- none selected --
              </Select.Item>
              <Select.Label>Level 1 Domain Cards</Select.Label>
              {#each available_domain_cards as card}
                <Select.Item
                  class="w-full hover:cursor-pointer data-[highlighted]:bg-primary"
                  value={card.title}
                  disabled={character.level_up_choices[1][0].domain_cards_added.some(
                    (c) => c.title === card.title
                  )}
                >
                  <DomainCard {card} class="w-full" />
                </Select.Item>
              {/each}
            </div>
          </Select.Content>
        </Select.Root>
        <Select.Root
          type="single"
          value={character.level_up_choices[1][0].domain_cards_added.find((c) => c.title === value)?.title || ""}
          onValueChange={(value) => {
            const card = available_domain_cards.find((card) => card.title === value);
            if (card) {
              character.level_up_choices[1][0].domain_cards_added.push(card);
            } else {
              character.level_up_choices[1][0].domain_cards_added = character.level_up_choices[1][0].domain_cards_added.filter(
                (c) => c.title !== value
              );
            }
          }}
        >
          <Select.Trigger class="w-full truncate">
            <p class="truncate">
              {valu ||
                "Select a domain card"}
            </p>
          </Select.Trigger>
          <Select.Content class="rounded-md w-full" align="start">
            <div style="max-width: {width}px;" class="p-2">
              <Select.Item value="" class="justify-center hover:cursor-pointer text-sm">
                -- none selected --
              </Select.Item>
              <Select.Label>Level 1 Domain Cards</Select.Label>
              {#each available_domain_cards as card}
                <Select.Item
                  class="w-full hover:cursor-pointer data-[highlighted]:bg-primary"
                  value={card.title}
                  disabled={character.level_up_choices[1][0].domain_cards_added[0]?.title ===
                    card.title}
                >
                  <DomainCard {card} class="w-full" />
                </Select.Item>
              {/each}
            </div>
          </Select.Content>
        </Select.Root>
      </div>
    </Dropdown>
  {/if}
</div>

<!-- Choose a Class dialog -->
<Dialog.Root bind:open={classDialogOpen}>
  <Dialog.Content class="min-w-[calc(100%-1rem)] md:min-w-3xl max-h-[90%] overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Select a Class</Dialog.Title>
    </Dialog.Header>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <!-- each class -->
      {#each Object.values(CLASSES) as c}
        <div class="flex gap-3 border-2 rounded-md p-3 bg-primary-muted">
          <ClassSummary character_class={c} bannerClasses="-mt-3">
            <Button
              disabled={character.primary_class?.name === c.name}
              onclick={() => {
                character.primary_class = c;
                character.primary_subclass = null;
                classDialogOpen = false;
              }}
            >
              {character.primary_class?.name === c.name ? "Selected" : "Select " + c.name}
            </Button>
          </ClassSummary>
        </div>
      {/each}
    </div>
    <Dialog.Footer>
      <Dialog.Close class={buttonVariants({ variant: "link" })}>Cancel</Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- Remove a Class dialog -->
<Dialog.Root bind:open={removeClassDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Remove your class</Dialog.Title>
    </Dialog.Header>
    <Dialog.Description>Removing your class will</Dialog.Description>
    <Dialog.Footer>
      <Dialog.Close class={buttonVariants({ variant: "link" })}>Cancel</Dialog.Close>
      <Dialog.Close
        class={buttonVariants({ variant: "destructive" })}
        onclick={() => {
          character.primary_class = null;
          character.primary_subclass = null;
        }}>Remove</Dialog.Close
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- Choose a Subclass dialog -->
<Dialog.Root bind:open={subclassDialogOpen}>
  <Dialog.Content class="min-w-[calc(100%-1rem)] md:min-w-3xl max-h-[90%] overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Select a Subclass</Dialog.Title>
    </Dialog.Header>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
