<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/';
	import type {
		DomainCard,
		DomainIds,
		AncestryCard,
		CommunityCard,
		TransformationCard
	} from '$lib/types/compendium-types';
	import DomainCardComponent from './full-cards/domain-card.svelte';
	import AncestryCardComponent from './full-cards/ancestry-card.svelte';
	import CommunityCardComponent from './full-cards/community-card.svelte';
	import TransformationCardComponent from './full-cards/transformation-card.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import Search from '@lucide/svelte/icons/search';
	import { cn } from '$lib/utils';

	type CardTypeFilter = 'all' | 'domain' | 'ancestry' | 'community' | 'transformation';
	type AnyCard = DomainCard | AncestryCard | CommunityCard | TransformationCard;

	let {
		onCardClick = () => {},
		initialCardTypeFilter = 'all' as CardTypeFilter
	}: {
		onCardClick?: (card: AnyCard) => void;
		initialCardTypeFilter?: CardTypeFilter;
	} = $props();

	let searchQuery = $state('');
	let cardTypeFilter = $state<CardTypeFilter>(initialCardTypeFilter);
	let domainFilter = $state<DomainIds[]>([]);
	let levelFilter = $state<number[]>([]);

	const compendium = getCompendiumContext();

	// Get all cards from different sources
	let allCards = $derived.by(() => {
		const cards: AnyCard[] = [];

		// Domain cards
		Object.values(compendium.domain_cards).forEach((domainCards) => {
			Object.values(domainCards).forEach((card) => {
				cards.push(card);
			});
		});

		// Ancestry cards
		Object.values(compendium.ancestry_cards).forEach((card) => {
			cards.push(card);
		});

		// Community cards
		Object.values(compendium.community_cards).forEach((card) => {
			cards.push(card);
		});

		// Transformation cards
		Object.values(compendium.transformation_cards).forEach((card) => {
			cards.push(card);
		});

		return cards;
	});

	// Helper function to strip HTML tags for search
	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, '').trim();
	}

	// Helper function to check if card matches search
	function matchesSearch(card: AnyCard, query: string): boolean {
		if (!query) return true;
		const searchLower = query.toLowerCase();
		const titleMatch = card.title.toLowerCase().includes(searchLower);
		
		// Search in description (if available)
		const descriptionMatch = 'description_html' in card && 
			stripHtml(card.description_html).toLowerCase().includes(searchLower);
		
		// Search in features
		const featuresMatch = card.features.some((feature) =>
			stripHtml(feature.description_html).toLowerCase().includes(searchLower)
		);
		
		// Search in category (for domain cards)
		const categoryMatch = 'category' in card && 
			card.category.toLowerCase().includes(searchLower);
		
		return titleMatch || descriptionMatch || featuresMatch || categoryMatch;
	}

	// Filter cards
	let filteredCards = $derived(
		allCards.filter((card) => {
			// Card type filter
			if (cardTypeFilter !== 'all') {
				if (cardTypeFilter === 'domain' && card.card_type !== 'domain') return false;
				if (cardTypeFilter === 'ancestry' && card.card_type !== 'ancestry') return false;
				if (cardTypeFilter === 'community' && card.card_type !== 'community') return false;
				if (cardTypeFilter === 'transformation' && card.card_type !== 'transformation') return false;
			}

			// Search filter
			if (!matchesSearch(card, searchQuery)) return false;

			// Domain filter (only for domain cards)
			if (card.card_type === 'domain') {
				const domainCard = card as DomainCard;
				if (domainFilter.length > 0 && !domainFilter.includes(domainCard.domain_id)) return false;
			}

			// Level filter (only for domain cards)
			if (card.card_type === 'domain') {
				const domainCard = card as DomainCard;
				if (levelFilter.length > 0 && !levelFilter.includes(domainCard.level_requirement)) return false;
			}

			return true;
		})
	);

	// Check if user has applied any filter or search
	let hasActiveFilter = $derived(
		searchQuery.trim() !== '' || cardTypeFilter !== 'all' || domainFilter.length > 0 || levelFilter.length > 0
	);

	// Show domain-specific filters only when domain cards are selected
	let showDomainFilters = $derived(cardTypeFilter === 'all' || cardTypeFilter === 'domain');

	// Get domain names from compendium, with fallback
	function getDomainName(domainId: DomainIds): string {
		return compendium.domains[domainId]?.name || domainId.charAt(0).toUpperCase() + domainId.slice(1);
	}

	const allDomains: DomainIds[] = [
		'arcana',
		'blade',
		'bone',
		'codex',
		'grace',
		'midnight',
		'sage',
		'splendor',
		'valor'
	];

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
						domainFilter = value.filter((v) => !!v) as DomainIds[];
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
						{#each allDomains as domainId}
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

				{#if card.card_type === 'domain'}
					<DomainCardComponent card={card as DomainCard} variant="responsive">
						{@render selectButton()}
					</DomainCardComponent>
				{:else if card.card_type === 'ancestry'}
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

