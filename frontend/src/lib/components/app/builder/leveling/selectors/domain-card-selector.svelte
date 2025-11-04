<script lang="ts">
  import type { Card } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import { buttonVariants } from "$lib/components/ui/button";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import * as Dialog from "$lib/components/ui/dialog/";
  import DomainCard from "../../../cards/domain-card.svelte";

  let {
    selected_card = $bindable(),
    available_cards,
    previously_chosen_cards,
    description,
    width,
    title = "Select a Domain Card",
  }: {
    selected_card: Card<"domain"> | null;
    available_cards: Card<"domain">[];
    previously_chosen_cards: Card<"domain">[];
    description: string;
    width: number;
    title?: string;
  } = $props();
</script>

<div class="flex flex-col gap-2 bg-primary/50 p-2 rounded-md" bind:clientWidth={width}>
  <p class="py-1 px-2 text-xs italic text-muted-foreground">
    {@html description}
  </p>
  <Dialog.Root>
    <Dialog.Trigger
      class={cn(
        buttonVariants({ variant: "outline" }),
        "w-full truncate flex items-center justify-between bg-card/50 hover:bg-card/70",
        selected_card === null &&
          "text-muted-foreground hover:text-muted-foreground"
      )}
      style={cn(
        selected_card === null &&
          "outline-offset: 2px; outline-width: 2px; outline-color: var(--primary); outline-style: solid;"
      )}
    >
      <p class="truncate">
        {selected_card?.title || "Select a domain card"}
      </p>
      <ChevronRight class="size-4 opacity-50" />
    </Dialog.Trigger>

    <Dialog.Content
      class="flex flex-col gap-4 min-w-[calc(100%-1rem)] md:min-w-3xl max-h-[90%]"
    >
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
      </Dialog.Header>
      <Dialog.Description>
        <p class="text-xs italic text-muted-foreground">
          {@html description}
        </p>
      </Dialog.Description>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto p-2">
        {#each available_cards as card}
          <Dialog.Close
            class={cn(
              "w-full rounded-xl outline-offset-3 outline-primary hover:outline-4 hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default",
              selected_card?.title === card.title && "outline-4"
            )}
            onclick={() => {
              selected_card = card;
            }}
            disabled={selected_card?.title !== card.title &&
              previously_chosen_cards.some((c) => c.title === card.title)}
          >
            <DomainCard {card} class="w-full h-full" />
          </Dialog.Close>
        {/each}
      </div>
      <Dialog.Footer>
        {#if selected_card === null}
          <Dialog.Close class={cn(buttonVariants({ variant: "link" }))}>
            Cancel
          </Dialog.Close>
        {:else}
          <Dialog.Close
            class={cn(buttonVariants({ variant: "link" }), "text-destructive")}
            onclick={() => (selected_card = null)}
          >
            Clear selection
          </Dialog.Close>
        {/if}
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</div>

