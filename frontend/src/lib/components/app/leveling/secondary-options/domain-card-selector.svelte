<script lang="ts">
  import type { Card } from "$lib/ts/character/types";
  import { cn } from "$lib/utils";
  import { buttonVariants } from "$lib/components/ui/button";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import * as Dialog from "$lib/components/ui/dialog/";
  import DomainCard from "$lib/components/app/cards/full-cards/domain-card.svelte";
  import CardCarousel from "$lib/components/app/cards/card-carousel.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import CircleMinus from "@lucide/svelte/icons/circle-minus";

  let {
    selected_card_id = $bindable(),
    available_cards,
    previously_chosen_card_ids,
    description_html,
    title = "Select a Domain Card",
  }: {
    selected_card_id: string | null;
    available_cards: Record<string, Card<"domain">>;
    previously_chosen_card_ids: string[];
    description_html: string;
    title?: string;
  } = $props();

  let cardsArray = $derived(
    Object.entries(available_cards)
      .map(([id, card]) => ({ id, card }))
      .sort((a, b) => {
        // Sort by level requirement first
        if (a.card.level_requirement !== b.card.level_requirement) {
          return a.card.level_requirement - b.card.level_requirement;
        }
        // Then sort by domain name
        return a.card.domain_id.localeCompare(b.card.domain_id);
      })
  );

  let disabled_indices = $derived(
    new Set(
      cardsArray
        .map((item, index) =>
          previously_chosen_card_ids.includes(item.id) && item.id !== selected_card_id ? index : -1
        )
        .filter((index) => index !== -1)
    )
  );

  let highlighted_indices = $derived(
    new Set([cardsArray.findIndex(({ id }) => id === selected_card_id)])
  );

  let selectedIndex = $state(0);
  let selectedCard = $derived(cardsArray[selectedIndex]);
  let isSelectedCardDisabled = $derived(
    selectedCard ? previously_chosen_card_ids.includes(selectedCard.id) : false
  );

  let dialog_open = $state(false);
</script>

<div class="flex flex-col gap-2">
  <div class="flex items-center w-full">
    <Dialog.Root bind:open={dialog_open}>
      <Dialog.Trigger
        class={cn(
          buttonVariants({ variant: "outline" }),
          "grow truncate flex items-center justify-between bg-card/50 hover:bg-card/70",
          selected_card_id === null && "text-muted-foreground hover:text-muted-foreground"
        )}
        style={cn(
          selected_card_id === null &&
            "outline-offset: 2px; outline-width: 2px; outline-color: var(--primary); outline-style: solid;"
        )}
      >
        <p class="truncate">
          {selected_card_id ? available_cards[selected_card_id]?.title : "Select a domain card"}
        </p>
        <ChevronRight class="size-4 opacity-50" />
      </Dialog.Trigger>

      <Dialog.Content class="flex flex-col gap-4 min-w-[calc(100%-1rem)] md:min-w-3xl max-h-[90%]">
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Description>
          <p class="text-xs italic text-muted-foreground">
            {@html description_html}
          </p>
        </Dialog.Description>
        <div class="relative overflow-y-auto">
          <CardCarousel
            cards={cardsArray.map(({ card }) => card)}
            bind:selectedIndex
            {disabled_indices}
            {highlighted_indices}
            emptyMessage="No Domain Cards"
            scroll_to_index={cardsArray.findIndex(({ id }) => id === selected_card_id)}
          />
          {#if cardsArray.length > 0}
            <Button
              size="sm"
              onclick={() => {
                if (highlighted_indices.has(selectedIndex)) {
                  dialog_open = false;
                  selected_card_id = null;
                } else if (!isSelectedCardDisabled) {
                  dialog_open = false;
                  selected_card_id = selectedCard.id;
                }
              }}
              hidden={highlighted_indices.has(selectedIndex)}
              class={cn(
                "absolute -bottom-[2px] left-1/2 -translate-x-1/2 rounded-full",
                isSelectedCardDisabled &&
                  "border-destructive border-3 bg-muted hover:bg-muted cursor-default"
              )}
            >
              {#if isSelectedCardDisabled}
                Already in vault
              {:else}
                Select card
              {/if}
            </Button>
          {/if}
        </div>
        <Dialog.Footer>
          <!-- {#if selected_card_id !== null}
          <Dialog.Close
            class={cn(buttonVariants({ variant: "link" }), "text-destructive")}
            onclick={() => (selected_card_id = null)}
          >
            Clear selection
          </Dialog.Close>
        {/if} -->
          <Dialog.Close class={cn(buttonVariants({ variant: "link" }))}>Close</Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
    {#if selected_card_id !== null}
      <Button
        size="icon"
        variant="link"
        class="text-destructive"
        onclick={() => (selected_card_id = null)}
      >
        <CircleMinus class="size-4" />
      </Button>
    {/if}
  </div>
  {#if selected_card_id !== null && available_cards[selected_card_id]}
    <div class="px-2">
      <DomainCard card={available_cards[selected_card_id]} bind_choice_select bind_token_count />
    </div>
  {/if}
</div>
