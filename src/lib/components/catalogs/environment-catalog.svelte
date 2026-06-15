<script lang="ts">
	import type { Environment, CompendiumContent } from '@convex/schemas/compendium';
	import { type EnvironmentType, type SourceKey } from '@convex/schemas/rules';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import Search from '@lucide/svelte/icons/search';
	import Dropdown from '$lib/components/utility/dropdown.svelte';
	import HomebrewBadge from '$lib/components/decorations/badges/homebrew-badge.svelte';
	import CampaignBadge from '$lib/components/decorations/badges/campaign-badge.svelte';
	import EnvironmentCard from '$lib/components/compendium-items/environment.svelte';
	import { getSourcesContext } from '$lib/state/sources.svelte';

	let {
		onSelect,
		disabledIds = [],
		compendium,
		available_source_keys
	}: {
		onSelect: (environment_id: string) => void;
		disabledIds?: string[];
		compendium: CompendiumContent;
		available_source_keys: SourceKey[];
	} = $props();

	const sourceCtx = getSourcesContext();

	let searchQuery = $state('');
	let tierFilter = $state<'1' | '2' | '3' | '4' | ''>('');
	let typeFilter = $state<EnvironmentType | ''>('');
	let sourceFilter = $state<SourceKey | ''>('');

	const environmentTypes: EnvironmentType[] = ['Exploration', 'Social', 'Traversal', 'Event'];

	function matchesSearch(environment: Environment, query: string): boolean {
		if (!query.trim()) return true;
		const q = query.toLowerCase();
		return (
			environment.title.toLowerCase().includes(q) ||
			environment.description.toLowerCase().includes(q) ||
			environment.type.toLowerCase().includes(q) ||
			environment.impulses?.toLowerCase().includes(q)
		);
	}

	function getTierNumber(tier: '1' | '2' | '3' | '4'): number {
		return parseInt(tier);
	}

	const allEnvironments = $derived(Object.entries(compendium.environments));

	const filteredEnvironments = $derived(
		allEnvironments.filter(([id, env]) => {
			if (!matchesSearch(env, searchQuery)) return false;
			if (tierFilter !== '' && env.tier !== getTierNumber(tierFilter)) return false;
			if (typeFilter !== '' && env.type !== typeFilter) return false;
			if (sourceFilter !== '' && env.source_key !== sourceFilter) return false;
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
			<Input bind:value={searchQuery} placeholder="Search environments..." class="pl-9" />
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
				onValueChange={(v) => (typeFilter = v as EnvironmentType | '')}
			>
				<Select.Trigger class="w-32">
					{typeFilter || 'All Types'}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="">All Types</Select.Item>
					{#each environmentTypes as type}
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
		{:else if filteredEnvironments.length === 0}
			<p class="py-4 text-center text-sm text-muted-foreground">
				{searchQuery.trim() ? 'No environments match your search' : 'No environments available'}
			</p>
		{:else}
			{#each filteredEnvironments as [id, environment]}
				{#snippet title_snippet()}
					<div class="gap-4 text-left">
						<p class="text-md font-medium">{environment.title}</p>
						<p
							class="flex items-center gap-1.5 truncate text-[10px] leading-none text-muted-foreground italic"
						>
							{#if environment.source_key === 'Homebrew'}
								<HomebrewBadge class="size-3" />
							{:else if environment.source_key === 'Campaign'}
								<CampaignBadge class="size-3" />
							{/if}
							Tier {environment.tier} · {environment.type}
						</p>
					</div>
				{/snippet}

				<Dropdown {title_snippet} class="border-2">
					<div class="flex flex-col gap-3">
						<Button size="sm" disabled={disabledIds.includes(id)} onclick={() => onSelect(id)}>
							{disabledIds.includes(id) ? 'Added' : 'Select'}
						</Button>
						<EnvironmentCard {environment} />
					</div>
				</Dropdown>
			{/each}
		{/if}
	</div>
</div>
