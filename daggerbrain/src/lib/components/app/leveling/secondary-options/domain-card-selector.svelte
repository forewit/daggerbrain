<script lang="ts">
	import type { DomainCard } from '$lib/types/compendium-types';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import * as Dialog from '$lib/components/ui/dialog/';
	import DomainCardComponent from '$lib/components/app/cards/full-cards/domain-card.svelte';
	import CardCarousel from '$lib/components/app/cards/card-carousel.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';
	import type { DomainCardId } from '$lib/types/character-types';

	let {
		selected_card_id = $bindable(),
		available_cards,
		previously_chosen_card_ids,
		description_html,
		title = 'Select a Domain Card'
	}: {
		selected_card_id: DomainCardId | null;
		available_cards: Record<string, DomainCard>;
		previously_chosen_card_ids: DomainCardId[];
		description_html: string;
		title?: string;
	} = $props();

	// Helper function to compare DomainCardId objects
	function domainCardIdEqual(a: DomainCardId, b: DomainCardId): boolean {
		return a.domainId === b.domainId && a.cardId === b.cardId;
	}

	// Helper function to get DomainCardId from a card
	function getDomainCardId(card: DomainCard): DomainCardId {
		return { domainId: card.domain_id, cardId: card.id };
	}

	// Helper function to get card from available_cards using DomainCardId
	function getCardById(id: DomainCardId | null): DomainCard | undefined {
		if (!id) return undefined;
		return available_cards[id.cardId];
	}

	let cardsArray = $derived(
		Object.entries(available_cards)
			.map(([_, card]) => ({ id: getDomainCardId(card), card }))
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
				.map((item, index) => {
					if (!selected_card_id) {
						return previously_chosen_card_ids.some((id) => domainCardIdEqual(id, item.id))
							? index
							: -1;
					}
					const isPreviouslyChosen = previously_chosen_card_ids.some((id) =>
						domainCardIdEqual(id, item.id)
					);
					const isSelected = domainCardIdEqual(item.id, selected_card_id);
					return isPreviouslyChosen && !isSelected ? index : -1;
				})
				.filter((index) => index !== -1)
		)
	);

	let highlighted_indices = $derived(
		new Set([
			cardsArray.findIndex(({ id }) => selected_card_id && domainCardIdEqual(id, selected_card_id))
		])
	);

	let selectedIndex = $state(0);
	let selectedCard = $derived(cardsArray[selectedIndex]);
	let isSelectedCardDisabled = $derived(
		selectedCard
			? previously_chosen_card_ids.some((id) => domainCardIdEqual(id, selectedCard.id))
			: false
	);

	let dialog_open = $state(false);
</script>

<div class="flex flex-col gap-2">
	<div class="flex w-full items-center">
		<Dialog.Root bind:open={dialog_open}>
			<Dialog.Trigger
				class={cn(
					buttonVariants({ variant: 'outline' }),
					'flex grow items-center justify-between truncate bg-card/50 hover:bg-card/70',
					selected_card_id === null && 'text-muted-foreground hover:text-muted-foreground'
				)}
				style={cn(
					selected_card_id === null &&
						'outline-offset: 2px; outline-width: 2px; outline-color: var(--primary); outline-style: solid;'
				)}
			>
				<p class="truncate">
					{selected_card_id ? getCardById(selected_card_id)?.title : 'Select a domain card'}
				</p>
				<ChevronRight class="size-4 opacity-50" />
			</Dialog.Trigger>

			<Dialog.Content class="flex max-h-[90%] min-w-[calc(100%-1rem)] flex-col gap-4 md:min-w-3xl">
				<Dialog.Header>
					<Dialog.Title>{title}</Dialog.Title>
				</Dialog.Header>
				<Dialog.Description>
					<p class="text-xs text-muted-foreground italic">
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
						scroll_to_index={cardsArray.findIndex(
							({ id }) => selected_card_id && domainCardIdEqual(id, selected_card_id)
						)}
					/>
					{#if cardsArray.length > 0}
						<Button
							size="sm"
							onclick={() => {
								if (highlighted_indices.has(selectedIndex)) {
									dialog_open = false;
									selected_card_id = null;
								} else if (!isSelectedCardDisabled && selectedCard) {
									dialog_open = false;
									selected_card_id = selectedCard.id;
								}
							}}
							hidden={highlighted_indices.has(selectedIndex)}
							class={cn(
								'absolute -bottom-[2px] left-1/2 -translate-x-1/2 rounded-full',
								isSelectedCardDisabled &&
									'cursor-default border-3 border-destructive bg-muted hover:bg-muted'
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
					<Dialog.Close class={cn(buttonVariants({ variant: 'link' }))}>Close</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
		{#if selected_card_id !== null}
			<Button size="icon" variant="link" onclick={() => (selected_card_id = null)}>
				<CircleMinus class="size-4" />
			</Button>
		{/if}
	</div>
	{#if selected_card_id !== null && getCardById(selected_card_id)}
		<div class="px-2">
			<DomainCardComponent
				card={getCardById(selected_card_id)!}
				bind_choice_select
				bind_token_count
			/>
		</div>
	{/if}
</div>
