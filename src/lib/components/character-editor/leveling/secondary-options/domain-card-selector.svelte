<script lang="ts">
	import type { CompendiumContent, DomainCard } from '@convex/schemas/compendium';
	import type { Card } from '@convex/schemas/rules';
	import { cn } from '$lib/utils';
	import { renderMarkdown } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import * as Dialog from '$lib/components/ui/dialog/';
	import DomainCardComponent from '$lib/components/compendium-items/cards/domain-card.svelte';
	import CardCarousel from '$lib/components/utility/card-carousel.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';
	import type { DomainCardId } from '@convex/schemas/rules';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { auto_add_level_up_domain_card_to_loadout } from '../domain-card-utils';

	let {
		selected_card_id = $bindable(),
		available_cards,
		previously_chosen_card_ids,
		description_html,
		title = 'Select a Domain Card',
		auto_add_to_loadout = false,
		onSelectionChange = () => {}
	}: {
		selected_card_id: DomainCardId | undefined;
		available_cards: Record<string, DomainCard>;
		previously_chosen_card_ids: DomainCardId[];
		description_html: string;
		title?: string;
		auto_add_to_loadout?: boolean;
		onSelectionChange?: (selected: DomainCardId | undefined) => void;
	} = $props();

	const characterCtx = getCharacterContext();
	const character = $derived(characterCtx.character);
	const derived_character_data = $derived(characterCtx.derived_character_data);
	const compendium = $derived(characterCtx.character_compendium);

	// Helper function to compare DomainCardId objects
	function domainCardIdEqual(a: DomainCardId, b: DomainCardId): boolean {
		return a.domain_id === b.domain_id && a.card_id === b.card_id;
	}

	// Helper function to get DomainCardId from a card
	function getDomainCardId(cardId: string, card: DomainCard): DomainCardId {
		return {
			domain_id: card.domain_id,
			card_id: cardId
		};
	}

	// Helper function to get card from available_cards using DomainCardId
	function getCardById(id: DomainCardId | undefined): DomainCard | undefined {
		if (!id) return undefined;
		return available_cards[id.card_id];
	}

	const cardsArray = $derived(
		Object.entries(available_cards)
			.map(([id, card]) => ({ id: getDomainCardId(id, card), card }))
			.sort((a, b) => {
				if (a.card.level_requirement !== b.card.level_requirement) {
					return a.card.level_requirement - b.card.level_requirement;
				}
				return (a.card.domain_id ?? '').localeCompare(b.card.domain_id ?? '');
			})
	);

	const carouselCards = $derived(
		cardsArray.map(({ card, id }) => ({
			type: 'domain_card' as const,
			card,
			id: id.card_id
		}))
	);

	const disabled_indices = $derived(
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

	const highlighted_indices = $derived(
		new Set([
			cardsArray.findIndex(({ id }) => selected_card_id && domainCardIdEqual(id, selected_card_id))
		])
	);

	let selectedIndex = $state(0);
	const selectedCard = $derived(cardsArray[selectedIndex]);
	const isSelectedCardDisabled = $derived(
		selectedCard
			? previously_chosen_card_ids.some((id) => domainCardIdEqual(id, selectedCard.id))
			: false
	);

	let dialog_open = $state(false);

	function updateSelection(nextSelectedCardId: DomainCardId | undefined) {
		selected_card_id = nextSelectedCardId;
		onSelectionChange(nextSelectedCardId);
	}
</script>

{#if character && derived_character_data}
	<div class="flex flex-col gap-2">
		<div class="flex w-full items-center">
			<Dialog.Root bind:open={dialog_open}>
				<Dialog.Trigger
					class={cn(
						buttonVariants({ variant: 'outline' }),
						'flex grow items-center justify-between truncate bg-card/50 hover:bg-card/70',
						selected_card_id === undefined && 'text-muted-foreground hover:text-muted-foreground'
					)}
					style={cn(
						selected_card_id === undefined &&
							'outline-offset: 2px; outline-width: 2px; outline-color: var(--primary); outline-style: solid;'
					)}
				>
					<p class="truncate">
						{selected_card_id ? getCardById(selected_card_id)?.title : 'Select a domain card'}
					</p>
					<ChevronRight class="size-4 opacity-50" />
				</Dialog.Trigger>

				<Dialog.Content
					class="flex max-h-[90%] min-w-[calc(100%-1rem)] flex-col gap-4 overflow-y-auto md:min-w-3xl"
				>
					<Dialog.Header>
						<Dialog.Title>{title}</Dialog.Title>
					</Dialog.Header>
					<Dialog.Description>
						<p class="text-xs text-muted-foreground italic">
							{@html renderMarkdown(description_html)}
						</p>
					</Dialog.Description>
					<div class="relative">
						<CardCarousel
							cards={carouselCards}
							{compendium}
							bind:selectedIndex
							{disabled_indices}
							{highlighted_indices}
							emptyMessage="No Domain Cards"
						/>
						{#if cardsArray.length > 0}
							<Button
								size="sm"
								onclick={() => {
									if (highlighted_indices.has(selectedIndex)) {
										dialog_open = false;
										updateSelection(undefined);
									} else if (!isSelectedCardDisabled && selectedCard) {
										const previousSelectedCardId = selected_card_id;
										dialog_open = false;
										updateSelection(selectedCard.id);
										if (auto_add_to_loadout && character && derived_character_data) {
											auto_add_level_up_domain_card_to_loadout(
												character,
												derived_character_data,
												previousSelectedCardId,
												selectedCard.id
											);
										}
									}
								}}
								hidden={highlighted_indices.has(selectedIndex)}
								class={cn(
									'absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full',
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
						<!-- {#if selected_card_id !== undefined}
          <Dialog.Close
            class={cn(buttonVariants({ variant: "link" }), "text-destructive")}
            onclick={() => (selected_card_id = undefined)}
          >
            Clear selection
          </Dialog.Close>
        {/if} -->
						<Dialog.Close class={cn(buttonVariants({ variant: 'link' }))}>Close</Dialog.Close>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
			{#if selected_card_id !== undefined}
				<Button size="icon" variant="link" onclick={() => updateSelection(undefined)}>
					<CircleMinus class="size-4" />
				</Button>
			{/if}
		</div>
		{#if selected_card_id && getCardById(selected_card_id)}
			<div class="px-2">
				<DomainCardComponent
					card={getCardById(selected_card_id)!}
					{compendium}
					bind:choices={character.card_choices[selected_card_id.card_id]}
					bind:tokens={character.card_tokens[selected_card_id.card_id]}
					enable_choices
					enable_tokens
					experiences={character.experiences}
				/>
			</div>
		{/if}
	</div>
{/if}
