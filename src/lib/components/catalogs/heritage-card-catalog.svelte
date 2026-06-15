<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/';
	import type {
		AncestryCard,
		CommunityCard,
		CompendiumContent,
		TransformationCard
	} from '@convex/schemas/compendium';
	import AncestryCardComponent from '$lib/components/compendium-items/cards/ancestry-card.svelte';
	import CommunityCardComponent from '$lib/components/compendium-items/cards/community-card.svelte';
	import TransformationCardComponent from '$lib/components/compendium-items/cards/transformation-card.svelte';
	import Search from '@lucide/svelte/icons/search';
	import type { Card } from '@convex/schemas/rules';

	type HeritageCardFilter = 'ancestry_card' | 'community_card' | 'transformation_card';

	let {
		onSelect = () => {},
		compendium
	}: {
		onSelect?: (card: Card) => void;
		compendium: CompendiumContent;
	} = $props();

	let searchQuery = $state('');
	let cardTypeFilter = $state<HeritageCardFilter | null>(null);

	// Helper function to check if card matches search
	// Helper function to check if card matches search
	function matchesSearch(card: Card, query: string): boolean {
		if (!query) return true;
		const searchLower = query.toLowerCase();
		const titleMatch = card.card.title.toLowerCase().includes(searchLower);

		// Search in description (if available)
		const descriptionMatch =
			card.type !== 'domain_card' && card.card.description_html.toLowerCase().includes(searchLower);

		// Search in features
		const featuresMatch = card.card.features.some((feature) =>
			feature.description_html.toLowerCase().includes(searchLower)
		);

		return titleMatch || descriptionMatch || featuresMatch;
	}

	// Get all heritage cards by combining ancestry, community, and transformation cards
	const allHeritageCards = $derived.by(() => {
		const cards: Card[] = [];

		// Ancestry cards
		Object.entries(compendium.ancestry_cards).forEach(([id, card]) => {
			cards.push({ type: 'ancestry_card', id, card });
		});

		// Community cards
		Object.entries(compendium.community_cards).forEach(([id, card]) => {
			cards.push({ type: 'community_card', id, card });
		});

		// Transformation cards
		Object.entries(compendium.transformation_cards).forEach(([id, card]) => {
			cards.push({
				type: 'transformation_card',
				id,
				card
			});
		});

		return cards;
	});

	// Filter heritage cards
	const filteredCards = $derived(
		allHeritageCards.filter((card) => {
			// Search filter
			if (!matchesSearch(card, searchQuery)) return false;

			// Card type filter
			if (cardTypeFilter !== null && cardTypeFilter !== card.type) return false;

			return true;
		})
	);

	// Check if user has applied any filter or search
	const hasActiveFilter = $derived(searchQuery.trim() !== '' || cardTypeFilter !== null);

	const cardTypeOptions: { value: HeritageCardFilter; label: string }[] = [
		{ value: 'ancestry_card', label: 'Ancestry' },
		{ value: 'community_card', label: 'Community' },
		{ value: 'transformation_card', label: 'Transformation' }
	];

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
					cardTypeFilter = (value as HeritageCardFilter) || null;
				}}
			>
				<Select.Trigger class="w-full sm:w-[200px]">
					{#if cardTypeFilter === null}
						Select Type
					{:else}
						{cardTypeOptions.find((o) => o.value === cardTypeFilter)?.label}
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
					{#each cardTypeOptions as cardType}
						<Select.Item value={cardType.value} class="hover:cursor-pointer">
							{cardType.label}
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
			{#each filteredCards as card (card.id)}
				{#snippet selectButton()}
					<Button
						size="sm"
						onclick={() => {
							onSelect(card);
						}}
					>
						Select
					</Button>
				{/snippet}

				{#if card.type === 'ancestry_card'}
					<AncestryCardComponent card={card.card} {compendium} disabled variant="responsive">
						{@render selectButton()}
					</AncestryCardComponent>
				{:else if card.type === 'community_card'}
					<CommunityCardComponent card={card.card} disabled variant="responsive">
						{@render selectButton()}
					</CommunityCardComponent>
				{:else if card.type === 'transformation_card'}
					<TransformationCardComponent card={card.card} disabled variant="responsive">
						{@render selectButton()}
					</TransformationCardComponent>
				{/if}
			{/each}
		{/if}
	</div>
</div>
