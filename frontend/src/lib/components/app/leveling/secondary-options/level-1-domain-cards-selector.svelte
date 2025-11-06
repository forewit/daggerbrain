<script lang="ts">
  import type { Card, Character } from "$lib/ts/character/types";
  import { cn } from "$lib/utils";
  import { buttonVariants } from "$lib/components/ui/button";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import * as Dialog from "$lib/components/ui/dialog/";
  import DomainCard from "$lib/components/app/cards/full-cards/domain-card.svelte";
  import { DOMAINS } from "$lib/ts/content/domains/domains";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";
  import { get_available_domain_cards } from "../domain-card-utils";

  const context = getCharacterContext();
  let character = $derived(context.character);

  let available_domain_cards: Record<string, Card<"domain">> = $derived.by(() => {
    return get_available_domain_cards(context, 1, 1, false);
  });

  const dialog_description = $derived.by(() => {
    if (!context.primary_class) return "";
    return `Choose a domain card from the <b>${
      DOMAINS[context.primary_class.primary_domain_id].name
    }</b> and <b>${
      DOMAINS[context.primary_class.secondary_domain_id].name
    }</b> domains.`;
  });
</script>

{#if character}
  <div class="flex flex-col gap-2 bg-primary/50 p-2 rounded-md">
    {#if context.primary_class !== null}

    <p class="py-1 px-2 text-xs italic text-muted-foreground">
      Choose up to 2 level 1 domain cards from the
      <b>{DOMAINS[context.primary_class.primary_domain_id].name}</b>
      and
      <b>{DOMAINS[context.primary_class.secondary_domain_id].name}</b>
      domains.
    </p>
    {/if}

    <div class="flex flex gap-2.5">
      <!-- Domain Card A -->
      <Dialog.Root>
        <Dialog.Trigger
          class={cn(
            buttonVariants({ variant: "outline" }),
            "w-full truncate flex items-center justify-between bg-card/50 hover:bg-card/70",
            context.level_up_domain_cards[1].A === null &&
              "text-muted-foreground hover:text-muted-foreground"
          )}
          style={cn(
            context.level_up_domain_cards[1].A === null &&
              "outline-offset: 2px; outline-width: 2px; outline-color: var(--primary); outline-style: solid;"
          )}
        >
          <p class="truncate">
            {context.level_up_domain_cards[1].A?.title || "Select a domain card"}
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
            {#each Object.entries(available_domain_cards) as [id, card]}
              <Dialog.Close
                class={cn(
                  "w-full rounded-xl outline-offset-3 outline-primary hover:outline-4 hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default",
                  context.level_up_domain_cards[1].A?.title === card.title && "outline-4"
                )}
                onclick={() => (character.level_up_domain_card_ids[1].A = id)}
                disabled={character.level_up_domain_card_ids[1].A !== id &&
                  context.domain_card_vault.some((c) => c.title === card.title)}
              >
                <DomainCard {card} class="w-full h-full" bind_choice_select/>
              </Dialog.Close>
            {/each}
          </div>
          <Dialog.Footer>
            <Dialog.Close
              class={cn(buttonVariants({ variant: "link" }), "text-destructive")}
              onclick={() => (character.level_up_domain_card_ids[1].A = null)}
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
            context.level_up_domain_cards[1].B === null &&
              "text-muted-foreground hover:text-muted-foreground"
          )}
          style={cn(
            context.level_up_domain_cards[1].B === null &&
              "outline-offset: 2px; outline-width: 2px; outline-color: var(--primary); outline-style: solid;"
          )}
        >
          <p class="truncate">
            {context.level_up_domain_cards[1].B?.title || "Select a domain card"}
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
            {#each Object.entries(available_domain_cards) as [id, card]}
              <Dialog.Close
                class={cn(
                  "w-full rounded-xl outline-offset-3 outline-primary hover:outline-4 hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default",
                  character.level_up_domain_card_ids[1].B === id && "outline-4"
                )}
                onclick={() => (character.level_up_domain_card_ids[1].B = id)}
                disabled={character.level_up_domain_card_ids[1].B !== id &&
                  context.domain_card_vault.some((c) => c.title === card.title)}
              >
                <DomainCard {card} class="w-full h-full" bind_choice_select/>
              </Dialog.Close>
            {/each}
          </div>
          <Dialog.Footer>
            <Dialog.Close
              class={cn(buttonVariants({ variant: "link" }), "text-destructive")}
              onclick={() => (character.level_up_domain_card_ids[1].B = null)}
            >
              Clear selection
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  </div>
{/if}
