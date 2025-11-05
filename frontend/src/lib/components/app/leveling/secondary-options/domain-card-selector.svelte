<script lang="ts">
  import type { Card } from "$lib/ts/character/types";
  import { cn } from "$lib/utils";
  import { buttonVariants } from "$lib/components/ui/button";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import * as Dialog from "$lib/components/ui/dialog/";
  import DomainCard from "$lib/components/app/cards/full-cards/domain-card.svelte";

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
</script>

<div class="flex flex-col gap-2 bg-primary/50 p-2 rounded-md">
  <p class="py-1 px-2 text-xs italic text-muted-foreground">
    {@html description_html}
  </p>
  <Dialog.Root>
    <Dialog.Trigger
      class={cn(
        buttonVariants({ variant: "outline" }),
        "w-full truncate flex items-center justify-between bg-card/50 hover:bg-card/70",
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
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto p-2">
        {#each Object.entries(available_cards) as [id, card]}
          <Dialog.Close
            class={cn(
              "w-full rounded-xl outline-offset-3 outline-primary hover:outline-4 hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default",
              selected_card_id === id && "outline-4"
            )}
            onclick={() => {
              selected_card_id = id;
            }}
            disabled={selected_card_id !== id &&
              previously_chosen_card_ids.some((card_id) => card_id === id)}
          >
            <DomainCard {card} class="w-full h-full" />
          </Dialog.Close>
        {/each}
      </div>
      <Dialog.Footer>
        {#if selected_card_id === null}
          <Dialog.Close class={cn(buttonVariants({ variant: "link" }))}>Cancel</Dialog.Close>
        {:else}
          <Dialog.Close
            class={cn(buttonVariants({ variant: "link" }), "text-destructive")}
            onclick={() => (selected_card_id = null)}
          >
            Clear selection
          </Dialog.Close>
        {/if}
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</div>
