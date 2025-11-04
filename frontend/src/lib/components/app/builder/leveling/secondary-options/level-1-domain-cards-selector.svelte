<script lang="ts">
  import type { Card, Character } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import { buttonVariants } from "$lib/components/ui/button";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import * as Dialog from "$lib/components/ui/dialog/";
  import DomainCard from "../../../cards/domain-card.svelte";
  import { DOMAINS } from "$lib/ts/constants/constants";

  let {
    character = $bindable(),
  }: {
    character: Character;
  } = $props();

  let available_domain_cards: Card<"domain">[] = $derived.by(() => {
    if (!character.primary_class) return [];
    const primary_domain = character.primary_class.primary_domain;
    const secondary_domain = character.primary_class.secondary_domain;
    const domain_cards = Object.values(
      DOMAINS[primary_domain as keyof typeof DOMAINS].cards
    ).concat(Object.values(DOMAINS[secondary_domain as keyof typeof DOMAINS].cards));

    return domain_cards.filter((card) => card.level_requirement === 1);
  });

  const dialog_description = $derived.by(() => {
    if (!character.primary_class) return "";
    return `Choose a domain card from the <b>${
      DOMAINS[character.primary_class.primary_domain as keyof typeof DOMAINS].name
    }</b> and <b>${
      DOMAINS[character.primary_class.secondary_domain as keyof typeof DOMAINS].name
    }</b> domains.`;
  });
</script>

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
      <!-- Domain Card A -->
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
              {@html dialog_description}
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

      <!-- Domain Card B -->
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
              {@html dialog_description}
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

