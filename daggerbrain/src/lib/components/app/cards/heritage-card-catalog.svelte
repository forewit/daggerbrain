<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/';
	import type { AncestryCard, CommunityCard, TransformationCard } from '$lib/types/compendium-types';
	import AncestryCardComponent from './full-cards/ancestry-card.svelte';
	import CommunityCardComponent from './full-cards/community-card.svelte';
	import TransformationCardComponent from './full-cards/transformation-card.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import Search from '@lucide/svelte/icons/search';

	type HeritageCard = AncestryCard | CommunityCard | TransformationCard;
	type HeritageCardType = 'ancestry' | 'community' | 'transformation';

	let {
		onCardClick = () => {}
	}: {
		onCardClick?: (card: HeritageCard) => void;
	} = $props();

	let searchQuery = $state('');
	let cardTypeFilter = $state<HeritageCardType | null>(null);

	const compendium = getCompendiumContext();

	// Get all heritage cards by combining ancestry, community, and transformation cards
	let allHeritageCards = $derived(
		[
			...Object.values(compendium.ancestry_cards),
			...Object.values(compendium.community_cards),
			...Object.values(compendium.transformation_cards)
		]
	);

	// Helper function to strip HTML tags for search
	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, '').trim();
	}

	// Helper function to check if card matches search
	function matchesSearch(card: HeritageCard, query: string): boolean {
		if (!query) return true;
		const searchLower = query.toLowerCase();
		const titleMatch = card.title.toLowerCase().includes(searchLower);
		
		// Search in description (if available)
		const descriptionMatch = card.description_html
			? stripHtml(card.description_html).toLowerCase().includes(searchLower)
			: false;
		
		// Search in features
		const featuresMatch = card.features.some((feature) =>
			stripHtml(feature.description_html).toLowerCase().includes(searchLower)
		);
		
		return titleMatch || descriptionMatch || featuresMatch;
	}

	// Filter heritage cards
	let filteredCards = $derived(
		allHeritageCards.filter((card) => {
			// Search filter
			if (!matchesSearch(card, searchQuery)) return false;

			// Card type filter
			if (cardTypeFilter !== null && cardTypeFilter !== card.card_type) return false;

			return true;
		})
	);

	// Check if user has applied any filter or search
	let hasActiveFilter = $derived(
		searchQuery.trim() !== '' || cardTypeFilter !== null
	);

	const allCardTypes: HeritageCardType[] = ['ancestry', 'community', 'transformation'];

	function getCardTypeName(cardType: HeritageCardType): string {
		return cardType.charAt(0).toUpperCase() + cardType.slice(1);
	}

	let cardTypeSelectOpen = $state(false);
</script>

<div class="flex flex-col gap-4">
	<!-- Search and Filters -->
	<div class="flex flex-col gap-2">
		<div class="relative">
			<Search
				class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input bind:value={searchQuery} placeholder="Search heritage cards..." class="pl-9" />
		</div>

		<div class="flex flex-col gap-2 sm:flex-row">
			<!-- Card Type Filter Select -->
			<Select.Root
				type="single"
				bind:open={cardTypeSelectOpen}
				value={cardTypeFilter ?? undefined}
				onValueChange={(value) => {
					cardTypeFilter = (value as HeritageCardType) || null;
				}}
			>
				<Select.Trigger class="w-full sm:w-[200px]">
					{#if cardTypeFilter === null}
						Select Type
					{:else}
						{getCardTypeName(cardTypeFilter)}
					{/if}
				</Select.Trigger>
				<Select.Content class="rounded-md">
					<Select.Item
						value=""
						disabled={cardTypeFilter === null}
						onclick={() => {
							cardTypeFilter = null;
						}}
						class="justify-center font-bold text-destructive hover:cursor-pointer"
					>
						-- Clear selection --
					</Select.Item>
					<Select.Label>Select Card Type</Select.Label>
					{#each allCardTypes as cardType}
						<Select.Item value={cardType} class="hover:cursor-pointer">
							{getCardTypeName(cardType)}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<!-- Results -->
	<div class="flex flex-col gap-2">
		{#if !hasActiveFilter}
			<p class="py-4 text-center text-sm text-muted-foreground">Search or use the filters above</p>
		{:else if filteredCards.length === 0}
			<p class="py-4 text-center text-sm text-muted-foreground">No results</p>
		{:else}
			{#each filteredCards as card (card.compendium_id)}
				{#snippet selectButton()}
					<Button
						size="sm"
						onclick={() => {
							onCardClick(card);
						}}
					>
						Select
					</Button>
				{/snippet}

				{#if card.card_type === 'ancestry'}
					<AncestryCardComponent card={card as AncestryCard} variant="responsive">
						{@render selectButton()}
					</AncestryCardComponent>
				{:else if card.card_type === 'community'}
					<CommunityCardComponent card={card as CommunityCard} variant="responsive">
						{@render selectButton()}
					</CommunityCardComponent>
				{:else if card.card_type === 'transformation'}
					<TransformationCardComponent card={card as TransformationCard} variant="responsive">
						{@render selectButton()}
					</TransformationCardComponent>
				{/if}
			{/each}
		{/if}
	</div>
</div>

