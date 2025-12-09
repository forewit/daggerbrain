<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/';
	import type { DomainCard, DomainIds } from '$lib/types/compendium-types';
	import DomainCardComponent from './full-cards/domain-card.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import Search from '@lucide/svelte/icons/search';

	let {
		onCardClick = () => {}
	}: {
		onCardClick?: (card: DomainCard) => void;
	} = $props();

	let searchQuery = $state('');
	let domainFilter = $state<DomainIds | null>(null);
	let levelFilter = $state<number | null>(null);

	const compendium = getCompendiumContext();

	// Get all domain cards by flattening the nested structure
	let allDomainCards = $derived(
		Object.values(compendium.domain_cards).flatMap((domainCards) => Object.values(domainCards))
	);

	// Helper function to strip HTML tags for search
	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, '').trim();
	}

	// Helper function to check if card matches search
	function matchesSearch(card: DomainCard, query: string): boolean {
		if (!query) return true;
		const searchLower = query.toLowerCase();
		const titleMatch = card.title.toLowerCase().includes(searchLower);
		const categoryMatch = card.category.toLowerCase().includes(searchLower);

		// Search in features
		const featuresMatch = card.features.some((feature) =>
			stripHtml(feature.description_html).toLowerCase().includes(searchLower)
		);

		return titleMatch || categoryMatch || featuresMatch;
	}

	// Filter domain cards
	let filteredCards = $derived(
		allDomainCards.filter((card) => {
			// Search filter
			if (!matchesSearch(card, searchQuery)) return false;

			// Domain filter
			if (domainFilter !== null && domainFilter !== card.domain_id) return false;

			// Level filter
			if (levelFilter !== null && levelFilter !== card.level_requirement) return false;

			return true;
		})
	);

	// Check if user has applied any filter or search
	let hasActiveFilter = $derived(
		searchQuery.trim() !== '' || domainFilter !== null || levelFilter !== null
	);

	// Get domain names from compendium, with fallback
	function getDomainName(domainId: DomainIds): string {
		return (
			compendium.domains[domainId]?.name || domainId.charAt(0).toUpperCase() + domainId.slice(1)
		);
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
			<Input bind:value={searchQuery} placeholder="Search domain cards..." class="pl-9" />
		</div>

		<div class="flex flex-col gap-2 sm:flex-row">
			<!-- Domain Filter Select -->
			<Select.Root
				type="single"
				bind:open={domainSelectOpen}
				value={domainFilter ?? undefined}
				onValueChange={(value) => {
					domainFilter = (value as DomainIds) || null;
				}}
			>
				<Select.Trigger class="w-full sm:w-[200px]">
					{#if domainFilter === null}
						Select Domain
					{:else}
						{getDomainName(domainFilter)}
					{/if}
				</Select.Trigger>
				<Select.Content class="rounded-md">
					<Select.Item
						value=""
						disabled={domainFilter === null}
						onclick={() => {
							domainFilter = null;
							//domainSelectOpen = true;
						}}
						class="justify-center font-bold text-destructive hover:cursor-pointer"
					>
						-- Clear selection --
					</Select.Item>
					<Select.Label>Select Domain</Select.Label>
					{#each allDomains as domainId}
						<Select.Item value={domainId} class="hover:cursor-pointer">
							{getDomainName(domainId)}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<!-- Level Filter Select -->
			<Select.Root
				type="single"
				bind:open={levelSelectOpen}
				value={levelFilter !== null ? levelFilter.toString() : undefined}
				onValueChange={(value) => {
					levelFilter = value ? parseInt(value) : null;
				}}
			>
				<Select.Trigger class="w-full sm:w-[200px]">
					{#if levelFilter === null}
						Select Level
					{:else}
						Level {levelFilter}
					{/if}
				</Select.Trigger>
				<Select.Content class="rounded-md">
					<Select.Item
						value=""
						disabled={levelFilter === null}
						onclick={() => {
							levelFilter = null;
							//	levelSelectOpen = true;
						}}
						class="justify-center font-bold text-destructive hover:cursor-pointer"
					>
						-- Clear selection --
					</Select.Item>
					<Select.Label>Select Level</Select.Label>
					{#each allLevels as level}
						<Select.Item value={level.toString()} class="hover:cursor-pointer">
							Level {level}
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

				<DomainCardComponent {card} variant="responsive">
					{@render selectButton()}
				</DomainCardComponent>
			{/each}
		{/if}
	</div>
</div>
