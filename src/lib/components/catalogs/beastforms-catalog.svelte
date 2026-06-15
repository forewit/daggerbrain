<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import type { Beastform, CompendiumContent } from '@convex/schemas/compendium';
	import type { SourceKey } from '@convex/schemas/rules';
	import BeastformComponent from '$lib/components/compendium-items/beastform.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import Search from '@lucide/svelte/icons/search';
	import Dropdown from '$lib/components/utility/dropdown.svelte';
	import HomebrewBadge from '$lib/components/decorations/badges/homebrew-badge.svelte';
	import CampaignBadge from '$lib/components/decorations/badges/campaign-badge.svelte';
	import { level_to_tier } from '$lib/utils';
	import { getSourcesContext } from '$lib/state/sources.svelte';

	let {
		onSelect = () => {},
		initialTierFilter = '' as '1' | '2' | '3' | '4' | '',
		maxLevel,
		compendium,
		available_source_keys
	}: {
		onSelect?: (id: string) => void;
		initialTierFilter?: '1' | '2' | '3' | '4' | '';
		maxLevel?: number;
		available_source_keys: SourceKey[];
		compendium: CompendiumContent;
	} = $props();

	const sourceCtx = getSourcesContext();

	let searchQuery = $state('');
	// svelte-ignore state_referenced_locally
	let tierFilter = $state<'1' | '2' | '3' | '4' | ''>(initialTierFilter);
	let sourceFilter = $state<SourceKey | ''>('');

	// Helper function to check if beastform matches search
	function matchesSearch(beastform: Beastform, query: string): boolean {
		if (!query) return true;
		const searchLower = query.toLowerCase();
		const nameMatch = beastform.title.toLowerCase().includes(searchLower);
		const categoryMatch = beastform.category.toLowerCase().includes(searchLower);

		// Search in advantages
		const advantagesMatch = beastform.advantages.some((adv) =>
			adv.toLowerCase().includes(searchLower)
		);

		// Search in features
		const featuresMatch = beastform.features.some((feature) =>
			feature.description_html.toLowerCase().includes(searchLower)
		);

		return nameMatch || categoryMatch || advantagesMatch || featuresMatch;
	}

	// Helper to convert tier string to number
	function getTierNumber(tier: '1' | '2' | '3' | '4'): number {
		return parseInt(tier);
	}

	// Get all beastforms from compendium
	const allBeastforms = $derived(Object.entries(compendium.beastforms));

	// Filter beastforms
	const filteredBeastforms = $derived(
		allBeastforms.filter(([id, beastform]) => {
			// Tier filter
			if (tierFilter !== '') {
				const tier = level_to_tier(beastform.level_requirement);
				if (tier !== getTierNumber(tierFilter)) return false;
			}

			// Source filter
			if (sourceFilter !== '' && beastform.source_key !== sourceFilter) return false;

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
				onValueChange={(v) => (sourceFilter = v as SourceKey | '')}
			>
				<Select.Trigger class="w-32">
					{sourceFilter
						? sourceCtx.sources.find((source) => source.source_key === sourceFilter)?.short_title ||
							sourceFilter
						: 'All Sources'}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="">All Sources</Select.Item>
					{#each available_source_keys as key}
						<Select.Item value={key}
							>{sourceCtx.sources.find((source) => source.source_key === key)?.short_title ||
								key}</Select.Item
						>
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
			{#each filteredBeastforms as [id, beastform]}
				{@const isDisabled = maxLevel !== undefined && beastform.level_requirement > maxLevel}
				{@const tier = level_to_tier(beastform.level_requirement)}

				{#snippet title_snippet()}
					<div class="gap-4 text-left">
						<p class="text-md font-medium">{beastform.title}</p>
						<p
							class="flex items-center gap-1.5 truncate text-[10px] leading-none text-muted-foreground italic"
						>
							{#if beastform.source_key === 'Homebrew'}
								<HomebrewBadge class="size-3" />
							{:else if beastform.source_key === 'Campaign'}
								<CampaignBadge class="size-3" />
							{/if}
							Tier {tier}
							{beastform.category}
						</p>
					</div>
				{/snippet}

				<Dropdown {title_snippet} class="border-2">
					<div class="flex flex-col gap-3">
						<BeastformComponent {beastform} {compendium} />
						<Button
							size="sm"
							disabled={isDisabled}
							onclick={() => {
								if (!isDisabled) {
									onSelect(id);
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
