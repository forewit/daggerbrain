<script lang="ts">
	import type { Adversary, CompendiumContent } from '@convex/schemas/compendium';
	import { type AdversaryType, type SourceKey } from '@convex/schemas/rules';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import Search from '@lucide/svelte/icons/search';
	import Dropdown from '$lib/components/utility/dropdown.svelte';
	import HomebrewBadge from '$lib/components/decorations/badges/homebrew-badge.svelte';
	import CampaignBadge from '$lib/components/decorations/badges/campaign-badge.svelte';
	import AdversaryCardComponent from '$lib/components/compendium-items/adversary/adversary.svelte';
	import { ADVERSARY_TYPE_BATTLE_POINTS_MAP } from '@convex/constants/rules';
	import { getSourcesContext } from '$lib/state/sources.svelte';

	let {
		onSelect,
		disabledIds = [],
		compendium,
		available_source_keys
	}: {
		onSelect: (adversary_id: string) => void;
		disabledIds?: string[];
		compendium: CompendiumContent;
		available_source_keys: SourceKey[];
	} = $props();

	const sourceCtx = getSourcesContext();

	let searchQuery = $state('');
	let tierFilter = $state<'1' | '2' | '3' | '4' | ''>('');
	let typeFilter = $state<AdversaryType | ''>('');
	let sourceFilter = $state<SourceKey | ''>('');

	const adversaryTypes: AdversaryType[] = [
		'Bruiser',
		'Horde',
		'Leader',
		'Minion',
		'Ranged',
		'Skulk',
		'Social',
		'Solo',
		'Standard',
		'Support'
	];

	function matchesSearch(adversary: Adversary, query: string): boolean {
		if (!query.trim()) return true;
		const q = query.toLowerCase();
		return (
			adversary.title.toLowerCase().includes(q) ||
			adversary.description.toLowerCase().includes(q) ||
			adversary.type.toLowerCase().includes(q) ||
			adversary.motives_tactics?.toLowerCase().includes(q)
		);
	}

	function getTierNumber(tier: '1' | '2' | '3' | '4'): number {
		return parseInt(tier);
	}

	const allAdversaries = $derived(Object.entries(compendium.adversaries));

	const filteredAdversaries = $derived(
		allAdversaries.filter(([id, adv]) => {
			if (!matchesSearch(adv, searchQuery)) return false;
			if (tierFilter !== '' && adv.tier !== getTierNumber(tierFilter)) return false;
			if (typeFilter !== '' && adv.type !== typeFilter) return false;
			if (sourceFilter !== '' && adv.source_key !== sourceFilter) return false;
			return true;
		})
	);

	let hasActiveFilter = $derived(
		searchQuery.trim() !== '' || tierFilter !== '' || typeFilter !== '' || sourceFilter !== ''
	);
</script>

<div class="flex flex-col gap-4">
	<!-- Search and Filters -->
	<div class="flex flex-col gap-2">
		<div class="relative">
			<Search
				class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input bind:value={searchQuery} placeholder="Search adversaries..." class="pl-9" />
		</div>

		<div class="flex flex-wrap justify-center gap-1">
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

		<div class="flex flex-wrap justify-center gap-2">
			<Select.Root
				type="single"
				value={typeFilter}
				onValueChange={(v) => (typeFilter = v as AdversaryType | '')}
			>
				<Select.Trigger class="w-32">
					{typeFilter || 'All Types'}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="">All Types</Select.Item>
					{#each adversaryTypes as type}
						<Select.Item value={type}>{type}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

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
		{:else if filteredAdversaries.length === 0}
			<p class="py-4 text-center text-sm text-muted-foreground">
				{searchQuery.trim() ? 'No adversaries match your search' : 'No adversaries available'}
			</p>
		{:else}
			{#each filteredAdversaries as [id, adversary]}
				{#snippet title_snippet()}
					<div class="gap-4 text-left">
						<p class="text-md font-medium">{adversary.title}</p>
						<p
							class="flex items-center gap-1.5 truncate text-[10px] leading-none text-muted-foreground italic"
						>
							{#if adversary.source_key === 'Homebrew'}
								<HomebrewBadge class="size-3" />
							{:else if adversary.source_key === 'Campaign'}
								<CampaignBadge class="size-3" />
							{/if}
							Tier {adversary.tier} · {adversary.type} · {ADVERSARY_TYPE_BATTLE_POINTS_MAP[
								adversary.type
							]} Battle Points
						</p>
					</div>
				{/snippet}

				<Dropdown {title_snippet} class="border-2">
					<div class="flex flex-col gap-3">
						<Button size="sm" disabled={disabledIds.includes(id)} onclick={() => onSelect(id)}>
							{disabledIds.includes(id) ? 'Added' : 'Select'}
						</Button>
						<AdversaryCardComponent {adversary} disabled />
					</div>
				</Dropdown>
			{/each}
		{/if}
	</div>
</div>
