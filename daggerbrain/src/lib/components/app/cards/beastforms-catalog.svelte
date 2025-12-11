<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Beastform } from '$lib/types/compendium-types';
	import BeastformComponent from './full-cards/beastform.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import Dropdown from '../leveling/dropdown.svelte';
	import Search from '@lucide/svelte/icons/search';

	type TierFilter = 'all' | 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4';

	let {
		onBeastformClick = () => {},
		initialTierFilter = 'all' as TierFilter,
		maxLevel
	}: {
		onBeastformClick?: (beastform: Beastform) => void;
		initialTierFilter?: TierFilter;
		maxLevel?: number;
	} = $props();

	let searchQuery = $state('');
	let tierFilter = $state<TierFilter>(initialTierFilter);

	const compendium = getCompendiumContext();
	const context = getCharacterContext();

	// Get all beastforms from compendium
	let allBeastforms = $derived(Object.values(compendium.beastforms));

	// Helper function to strip HTML tags for search
	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, '').trim();
	}

	// Helper function to check if beastform matches search
	function matchesSearch(beastform: Beastform, query: string): boolean {
		if (!query) return true;
		const searchLower = query.toLowerCase();
		const nameMatch = beastform.name.toLowerCase().includes(searchLower);
		const categoryMatch = beastform.category.toLowerCase().includes(searchLower);

		// Search in advantages
		const advantagesMatch = beastform.advantages.some((adv) =>
			adv.toLowerCase().includes(searchLower)
		);

		// Search in features
		const featuresMatch = beastform.features.some((feature) =>
			stripHtml(feature.description_html).toLowerCase().includes(searchLower)
		);

		return nameMatch || categoryMatch || advantagesMatch || featuresMatch;
	}

	// Filter beastforms
	let filteredBeastforms = $derived(
		allBeastforms.filter((beastform) => {
			// Tier filter
			if (tierFilter !== 'all' && context) {
				const tier = context.level_to_tier(beastform.level_requirement);
				if (tierFilter === 'tier_1' && tier !== 1) return false;
				if (tierFilter === 'tier_2' && tier !== 2) return false;
				if (tierFilter === 'tier_3' && tier !== 3) return false;
				if (tierFilter === 'tier_4' && tier !== 4) return false;
			}

			// Search filter
			if (!matchesSearch(beastform, searchQuery)) return false;

			return true;
		})
	);

	// Check if user has applied any filter or search
	let hasActiveFilter = $derived(searchQuery.trim() !== '' || tierFilter !== 'all');
</script>

<div class="flex flex-col gap-4">
	<!-- Search and Filters -->
	<div class="flex flex-col gap-2">
		<div class="relative">
			<Search
				class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input bind:value={searchQuery} placeholder="Search beastforms..." class="pl-9" />
		</div>

		<div class="flex grow flex-wrap justify-center gap-x-0.5 gap-y-2">
			<!-- Tier Filter Buttons -->
			<div class="flex grow flex-wrap justify-center gap-1">
				<Button
					size="sm"
					variant={tierFilter === 'tier_1' ? 'default' : 'outline'}
					onclick={() => (tierFilter = tierFilter === 'tier_1' ? 'all' : 'tier_1')}
				>
					Tier 1
				</Button>
				<Button
					size="sm"
					variant={tierFilter === 'tier_2' ? 'default' : 'outline'}
					onclick={() => (tierFilter = tierFilter === 'tier_2' ? 'all' : 'tier_2')}
				>
					Tier 2
				</Button>
				<Button
					size="sm"
					variant={tierFilter === 'tier_3' ? 'default' : 'outline'}
					onclick={() => (tierFilter = tierFilter === 'tier_3' ? 'all' : 'tier_3')}
				>
					Tier 3
				</Button>
				<Button
					size="sm"
					variant={tierFilter === 'tier_4' ? 'default' : 'outline'}
					onclick={() => (tierFilter = tierFilter === 'tier_4' ? 'all' : 'tier_4')}
				>
					Tier 4
				</Button>
			</div>
		</div>
	</div>

	<!-- Results -->
	<div class="flex flex-col gap-2">
		{#if !hasActiveFilter}
			<p class="py-4 text-center text-sm text-muted-foreground">Search or use the filters above</p>
		{:else if filteredBeastforms.length === 0}
			<p class="py-4 text-center text-sm text-muted-foreground">No results</p>
		{:else}
			{#each filteredBeastforms as beastform (beastform.compendium_id)}
				{@const isDisabled = maxLevel !== undefined && beastform.level_requirement > maxLevel}
				{@const tier = context ? context.level_to_tier(beastform.level_requirement) : 1}

				{#snippet title_snippet()}
					<div class="gap-4 text-left">
						<p class="text-md font-medium">{beastform.name}</p>
						<p class="truncate text-[10px] leading-none text-muted-foreground italic">
							{beastform.category}
						</p>
					</div>
				{/snippet}

				<Dropdown {title_snippet} class="border-2">
					<div class="flex flex-col gap-3">
						<BeastformComponent {beastform} />
						<Button
							size="sm"
							disabled={isDisabled}
							onclick={() => {
								if (!isDisabled) {
									onBeastformClick(beastform);
								}
							}}
						>
							Select
						</Button>
					</div>
				</Dropdown>
			{/each}
		{/if}
	</div>
</div>
