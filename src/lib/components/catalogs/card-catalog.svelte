<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/';
	import type { AncestryCard } from '@convex/schemas/compendium';
	import DomainCardComponent from '$lib/components/compendium-items/cards/domain-card.svelte';
	import AncestryCardComponent from '$lib/components/compendium-items/cards/ancestry-card.svelte';
	import CommunityCardComponent from '$lib/components/compendium-items/cards/community-card.svelte';
	import TransformationCardComponent from '$lib/components/compendium-items/cards/transformation-card.svelte';
	import Search from '@lucide/svelte/icons/search';
	import type { CompendiumContent } from '@convex/schemas/compendium';
	import type { Card } from '@convex/schemas/rules';

	type CardTypeFilter = 'all' | 'domain' | 'ancestry' | 'community' | 'transformation';

	let {
		onCardClick = () => {},
		initialCardTypeFilter = 'all',
		compendium
	}: {
		onCardClick?: (card: Card) => void;
		initialCardTypeFilter?: CardTypeFilter;
		compendium: CompendiumContent;
	} = $props();

	let searchQuery = $state('');
	// svelte-ignore state_referenced_locally
	let cardTypeFilter = $state<CardTypeFilter>(initialCardTypeFilter);
	let domainFilter = $state<string[]>([]);
	let levelFilter = $state<number[]>([]);

	// Get all cards from different sources
	const allCards = $derived.by(() => {
		const cards: Card[] = [];

		// Domain cards
		Object.entries(compendium.domain_cards).forEach(([id, card]) => {
			cards.push({ type: 'domain_card', id, card });
		});

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

		// Search in category (for domain cards)
		const categoryMatch =
			card.type === 'domain_card' && card.card.category.toLowerCase().includes(searchLower);

		return titleMatch || descriptionMatch || featuresMatch || categoryMatch;
	}

	// Filter cards
	const filteredCards = $derived(
		allCards.filter((card) => {
			// Card type filter
			if (cardTypeFilter !== 'all') {
				if (cardTypeFilter === 'domain' && card.type !== 'domain_card') return false;
				if (cardTypeFilter === 'ancestry' && card.type !== 'ancestry_card') return false;
				if (cardTypeFilter === 'community' && card.type !== 'community_card') return false;
				if (cardTypeFilter === 'transformation' && card.type !== 'transformation_card')
					return false;
			}

			// Search filter
			if (!matchesSearch(card, searchQuery)) return false;

			// Domain filter (only for domain cards)
			if (card.type === 'domain_card') {
				if (
					domainFilter.length > 0 &&
					(!card.card.domain_id || !domainFilter.includes(card.card.domain_id))
				)
					return false;
			}

			// Level filter (only for domain cards)
			if (card.type === 'domain_card') {
				if (levelFilter.length > 0 && !levelFilter.includes(card.card.level_requirement))
					return false;
			}

			return true;
		})
	);

	// Check if user has applied any filter or search
	let hasActiveFilter = $derived(
		searchQuery.trim() !== '' ||
			cardTypeFilter !== 'all' ||
			domainFilter.length > 0 ||
			levelFilter.length > 0
	);

	// Show domain-specific filters only when domain cards are selected
	let showDomainFilters = $derived(cardTypeFilter === 'all' || cardTypeFilter === 'domain');

	// Get domain names from compendium, with fallback
	function getDomainName(domain_id: string): string {
		return compendium.domains[domain_id]?.title || 'Unknown';
	}

	// All domains derived from compendium
	let all_domain_ids = $derived(Object.keys(compendium.domains));

	const allLevels = Array.from({ length: 10 }, (_, i) => i + 1);

	const cardTypeOptions: { value: CardTypeFilter; label: string }[] = [
		{ value: 'all', label: 'All' },
		{ value: 'domain', label: 'Domain' },
		{ value: 'ancestry', label: 'Ancestry' },
		{ value: 'community', label: 'Community' },
		{ value: 'transformation', label: 'Transformation' }
	];

	let domainSelectOpen = $state(false);
	let levelSelectOpen = $state(false);
</script>

<div class="flex flex-col gap-4">
	<!-- Search and Filters -->
	<div class="flex flex-col gap-2">
		<div class="relative">
			<Search
				class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input bind:value={searchQuery} placeholder="Search cards..." class="pl-9" />
		</div>

		<!-- Card Type Filter Buttons -->
		<div class="flex flex-wrap gap-2">
			{#each cardTypeOptions as option}
				<Button
					variant={cardTypeFilter === option.value ? 'default' : 'outline'}
					size="sm"
					onclick={() => {
						cardTypeFilter = option.value;
						// Clear domain-specific filters when switching away from domain cards
						if (option.value !== 'all' && option.value !== 'domain') {
							domainFilter = [];
							levelFilter = [];
						}
					}}
				>
					{option.label}
				</Button>
			{/each}
		</div>

		{#if showDomainFilters}
			<div class="flex flex-col gap-2 sm:flex-row">
				<!-- Domain Filter Select -->
				<Select.Root
					type="multiple"
					bind:open={domainSelectOpen}
					value={domainFilter}
					onValueChange={(value) => {
						domainFilter = value.filter((v) => !!v);
					}}
				>
					<Select.Trigger class="w-full sm:w-[200px]">
						{#if domainFilter.length === 0}
							Select Domains
						{:else}
							{domainFilter.map((id) => getDomainName(id)).join(', ')}
						{/if}
					</Select.Trigger>
					<Select.Content class="rounded-md">
						<Select.Item
							value=""
							disabled={domainFilter.length === 0}
							onclick={() => {
								domainFilter = [];
								domainSelectOpen = true;
							}}
							class="justify-center font-bold text-destructive hover:cursor-pointer"
						>
							-- Clear selection --
						</Select.Item>
						<Select.Label>Select Domains</Select.Label>
						{#each all_domain_ids as domainId}
							<Select.Item value={domainId} class="hover:cursor-pointer">
								{getDomainName(domainId)}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>

				<!-- Level Filter Select -->
				<Select.Root
					type="multiple"
					bind:open={levelSelectOpen}
					value={levelFilter.map((l) => l.toString())}
					onValueChange={(value) => {
						levelFilter = value.filter((v) => !!v).map((v) => parseInt(v));
					}}
				>
					<Select.Trigger class="w-full sm:w-[200px]">
						{#if levelFilter.length === 0}
							Select Levels
						{:else}
							{levelFilter.map((l) => `Level ${l}`).join(', ')}
						{/if}
					</Select.Trigger>
					<Select.Content class="rounded-md">
						<Select.Item
							value=""
							disabled={levelFilter.length === 0}
							onclick={() => {
								levelFilter = [];
								levelSelectOpen = true;
							}}
							class="justify-center font-bold text-destructive hover:cursor-pointer"
						>
							-- Clear selection --
						</Select.Item>
						<Select.Label>Select Levels</Select.Label>
						{#each allLevels as level}
							<Select.Item value={level.toString()} class="hover:cursor-pointer">
								Level {level}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		{/if}
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
							onCardClick(card);
						}}
					>
						Select
					</Button>
				{/snippet}

				{#if card.type === 'domain_card'}
					<DomainCardComponent card={card.card} {compendium} disabled variant="responsive">
						{@render selectButton()}
					</DomainCardComponent>
				{:else if card.type === 'ancestry_card'}
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
