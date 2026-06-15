<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/';
	import type { CompendiumContent, DomainCard } from '@convex/schemas/compendium';
	import DomainCardComponent from '$lib/components/compendium-items/cards/domain-card.svelte';
	import Search from '@lucide/svelte/icons/search';
	let {
		onSelect = () => {},
		disabledIds = [],
		compendium
	}: {
		onSelect?: (card: { type: 'domain_card'; id: string; card: DomainCard }) => void;
		disabledIds?: string[];
		compendium: CompendiumContent;
	} = $props();

	let searchQuery = $state('');
	let domainFilter = $state<string | null>(null);
	let levelFilter = $state<number | null>(null);

	// Helper function to check if card matches search
	function matchesSearch(card: DomainCard, query: string): boolean {
		if (!query) return true;
		const searchLower = query.toLowerCase();
		const titleMatch = card.title.toLowerCase().includes(searchLower);
		const categoryMatch = card.category.toLowerCase().includes(searchLower);

		// Search in features
		const featuresMatch = card.features.some((feature) =>
			feature.description_html.toLowerCase().includes(searchLower)
		);

		return titleMatch || categoryMatch || featuresMatch;
	}

	const allDomainCards = $derived(Object.entries(compendium.domain_cards));

	// Filter domain cards
	const filteredCards = $derived(
		allDomainCards.filter(([id, card]) => {
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
	function getDomainName(domain_id: string): string {
		return compendium.domains[domain_id]?.title || 'Unknown';
	}

	// All domains derived from compendium
	let allDomains = $derived(Object.keys(compendium.domains));

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
					domainFilter = value || null;
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
			{#each filteredCards as [id, card] (id)}
				{#snippet selectButton()}
					<Button
						size="sm"
						disabled={disabledIds.includes(id)}
						onclick={() => {
							onSelect({ type: 'domain_card', id, card });
						}}
					>
						{disabledIds.includes(id) ? 'Added' : 'Select'}
					</Button>
				{/snippet}

				<DomainCardComponent {card} {compendium} disabled variant="responsive">
					{@render selectButton()}
				</DomainCardComponent>
			{/each}
		{/if}
	</div>
</div>
