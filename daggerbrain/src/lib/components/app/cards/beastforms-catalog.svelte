<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import type { Beastform, SourceIds } from '@shared/types/compendium.types';
	import BeastformComponent from './full-cards/beastform.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import Dropdown from '../leveling/dropdown.svelte';
	import Search from '@lucide/svelte/icons/search';
	import HomebrewBadge from '../homebrew/homebrew-badge.svelte';
	import CampaignBadge from '../homebrew/campaign-badge.svelte';

	let {
		onBeastformClick = () => {},
		initialTierFilter = '' as '1' | '2' | '3' | '4' | '',
		maxLevel
	}: {
		onBeastformClick?: (beastform: Beastform) => void;
		initialTierFilter?: '1' | '2' | '3' | '4' | '';
		maxLevel?: number;
	} = $props();

	let searchQuery = $state('');
	// svelte-ignore state_referenced_locally
	let tierFilter = $state<'1' | '2' | '3' | '4' | ''>(initialTierFilter);
	let sourceFilter = $state<SourceIds | ''>('');

	const compendium = getCompendiumContext();
	const context = getCharacterContext();

	// Get available sources from whitelist, sorted by short_title
	let availableSources = $derived(
		Object.values(compendium.sources)
			.filter((source) => compendium.source_whitelist.has(source.source_id))
			.sort((a, b) => a.short_title.localeCompare(b.short_title))
	);

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

	// Helper to convert tier string to number
	function getTierNumber(tier: '1' | '2' | '3' | '4'): number {
		return parseInt(tier);
	}

	// Filter beastforms
	let filteredBeastforms = $derived(
		allBeastforms.filter((beastform) => {
			// Tier filter
			if (tierFilter !== '' && context) {
				const tier = context.level_to_tier(beastform.level_requirement);
				if (tier !== getTierNumber(tierFilter)) return false;
			}

			// Source filter
			if (sourceFilter !== '' && beastform.source_id !== sourceFilter) return false;

			// Search filter
			if (!matchesSearch(beastform, searchQuery)) return false;

			return true;
		})
	);

	// Check if user has applied any filter or search
	// Show results if a tier is selected, a source is selected, or there's a search query
	let hasActiveFilter = $derived(
		tierFilter !== '' || sourceFilter !== '' || searchQuery.trim() !== ''
	);
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
					variant={tierFilter === '1' ? 'default' : 'outline'}
					onclick={() => (tierFilter = tierFilter === '1' ? '' : '1')}
				>
					Tier 1
				</Button>
				<Button
					size="sm"
					variant={tierFilter === '2' ? 'default' : 'outline'}
					onclick={() => (tierFilter = tierFilter === '2' ? '' : '2')}
				>
					Tier 2
				</Button>
				<Button
					size="sm"
					variant={tierFilter === '3' ? 'default' : 'outline'}
					onclick={() => (tierFilter = tierFilter === '3' ? '' : '3')}
				>
					Tier 3
				</Button>
				<Button
					size="sm"
					variant={tierFilter === '4' ? 'default' : 'outline'}
					onclick={() => (tierFilter = tierFilter === '4' ? '' : '4')}
				>
					Tier 4
				</Button>
			</div>
		</div>

		<div class="flex flex-wrap justify-center gap-2">
			<!-- Source Select -->
			<Select.Root
				type="single"
				value={sourceFilter}
				onValueChange={(v) => (sourceFilter = v as SourceIds | '')}
			>
				<Select.Trigger class="w-32">
					{sourceFilter
						? compendium.sources[sourceFilter]?.short_title || sourceFilter
						: 'All Sources'}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="">All Sources</Select.Item>
					{#each availableSources as source}
						<Select.Item value={source.source_id}>{source.short_title}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
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
						<p
							class="flex items-center gap-1.5 truncate text-[10px] leading-none text-muted-foreground italic"
						>
							{#if beastform.source_id === 'Homebrew'}
								<HomebrewBadge type="beastform" id={beastform.compendium_id} class="size-3" />
							{:else if beastform.source_id === 'Campaign'}
								<CampaignBadge type="beastform" id={beastform.compendium_id} class="size-3" />
							{/if}
							Tier {tier}
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
