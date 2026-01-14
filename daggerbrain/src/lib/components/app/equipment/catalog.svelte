<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Select from '$lib/components/ui/select';
	import type { Weapon, Armor, Consumable, Loot, SourceIds } from '@shared/types/compendium.types';
	import WeaponDetails from './weapon-details.svelte';
	import ArmorDetails from './armor-details.svelte';
	import ConsumableDetails from './consumable-details.svelte';
	import LootDetails from './loot-details.svelte';
	import Dropdown from '../leveling/dropdown.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import Search from '@lucide/svelte/icons/search';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Check from '@lucide/svelte/icons/check';
	import { cn } from '$lib/utils';
	import { SvelteSet } from 'svelte/reactivity';
	import HomebrewBadge from '../homebrew/homebrew-badge.svelte';
	import CampaignBadge from '../homebrew/campaign-badge.svelte';

	let searchQuery = $state('');
	let typeFilter = $state<'Weapons' | 'Armor' | 'Consumables' | 'Loot' | null>(null);
	let tierFilter = $state<'1' | '2' | '3' | '4' | ''>('');
	let weaponTypeFilter = $state<'Magical' | 'Physical' | ''>('');
	let weaponCategoryFilter = $state<'Primary' | 'Secondary' | ''>('');
	let sourceFilter = $state<SourceIds | ''>('');
	const ADD_BUTTON_DISABLE_DELAY_MS = 1200;

	let customItemOpen = $state(false);
	let customItemTitle = $state('');
	let customItemDisabled = $state(false);
	const disabledItems = new SvelteSet<string>();

	// Clear subfilters when main filter changes
	$effect(() => {
		if (typeFilter !== 'Weapons' && typeFilter !== 'Armor') {
			tierFilter = '';
		}
		if (typeFilter !== 'Weapons') {
			weaponTypeFilter = '';
			weaponCategoryFilter = '';
		}
		// Clear source filter when type filter changes for consistency
		if (typeFilter === null) {
			sourceFilter = '';
		}
	});

	const context = getCharacterContext();
	const compendium = getCompendiumContext();

	// Get available sources from whitelist, sorted by short_title
	let availableSources = $derived(
		Object.values(compendium.sources)
			.filter((source) => compendium.source_whitelist.has(source.source_id))
			.sort((a, b) => a.short_title.localeCompare(b.short_title))
	);

	// Helper function to strip HTML tags for search
	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, '').trim();
	}

	// Helper function to check if item matches search
	function matchesSearch(item: Weapon | Armor | Consumable | Loot, query: string): boolean {
		if (!query) return true;
		const searchLower = query.toLowerCase();
		const titleMatch = item.title.toLowerCase().includes(searchLower);
		const descMatch = stripHtml(item.description_html).toLowerCase().includes(searchLower);
		return titleMatch || descMatch;
	}

	// Helper to convert tier string to number
	function getTierNumber(tier: '1' | '2' | '3' | '4'): number {
		return parseInt(tier);
	}

	// Filter primary weapons
	let filteredPrimaryWeapons = $derived(
		Object.values(compendium.primary_weapons).filter((weapon) => {
			// Search filter
			if (!matchesSearch(weapon, searchQuery)) return false;

			// Tier filter
			if (tierFilter !== '') {
				const weaponTier = context.level_to_tier(weapon.level_requirement);
				if (weaponTier !== getTierNumber(tierFilter)) return false;
			}

			// Weapon type filter (Magical/Physical)
			if (weaponTypeFilter !== '') {
				if (weapon.type !== weaponTypeFilter) return false;
			}

			// Source filter
			if (sourceFilter !== '' && weapon.source_id !== sourceFilter) return false;

			return true;
		})
	);

	// Filter secondary weapons
	let filteredSecondaryWeapons = $derived(
		Object.values(compendium.secondary_weapons).filter((weapon) => {
			// Search filter
			if (!matchesSearch(weapon, searchQuery)) return false;

			// Tier filter
			if (tierFilter !== '') {
				const weaponTier = context.level_to_tier(weapon.level_requirement);
				if (weaponTier !== getTierNumber(tierFilter)) return false;
			}

			// Weapon type filter (Magical/Physical)
			if (weaponTypeFilter !== '') {
				if (weapon.type !== weaponTypeFilter) return false;
			}

			// Source filter
			if (sourceFilter !== '' && weapon.source_id !== sourceFilter) return false;

			return true;
		})
	);

	// Filter armor
	let filteredArmor = $derived(
		Object.values(compendium.armor).filter((armor) => {
			// Search filter
			if (!matchesSearch(armor, searchQuery)) return false;

			// Tier filter
			if (tierFilter !== '') {
				const armorTier = context.level_to_tier(armor.level_requirement);
				if (armorTier !== getTierNumber(tierFilter)) return false;
			}

			// Source filter
			if (sourceFilter !== '' && armor.source_id !== sourceFilter) return false;

			return true;
		})
	);

	// Filter consumables (consumables don't have tier/level requirements)
	let filteredConsumables = $derived(
		Object.values(compendium.consumables).filter((consumable) => {
			// Search filter
			if (!matchesSearch(consumable, searchQuery)) return false;

			// Source filter
			if (sourceFilter !== '' && consumable.source_id !== sourceFilter) return false;

			return true;
		})
	);

	// Filter loot (loot doesn't have tier/level requirements)
	let filteredLoot = $derived(
		Object.values(compendium.loot).filter((loot) => {
			// Search filter
			if (!matchesSearch(loot, searchQuery)) return false;

			// Source filter
			if (sourceFilter !== '' && loot.source_id !== sourceFilter) return false;

			return true;
		})
	);

	// Check if user has applied any filter or search
	let hasActiveFilter = $derived(
		searchQuery.trim() !== '' || typeFilter !== null || tierFilter !== '' || sourceFilter !== ''
	);

	// Combined filtered items based on type filter
	// Only show results if user has applied a filter or entered a search query
	let filteredItems = $derived.by(() => {
		// Don't show anything until user interacts (filter or search)
		if (!hasActiveFilter) {
			return [];
		}

		if (typeFilter === 'Weapons') {
			const items: Array<{ type: 'weapon'; item: Weapon }> = [];
			if (weaponCategoryFilter === '' || weaponCategoryFilter === 'Primary') {
				items.push(...filteredPrimaryWeapons.map((w) => ({ type: 'weapon' as const, item: w })));
			}
			if (weaponCategoryFilter === '' || weaponCategoryFilter === 'Secondary') {
				items.push(...filteredSecondaryWeapons.map((w) => ({ type: 'weapon' as const, item: w })));
			}
			return items;
		} else if (typeFilter === 'Armor') {
			return filteredArmor.map((a) => ({ type: 'armor' as const, item: a }));
		} else if (typeFilter === 'Consumables') {
			return filteredConsumables.map((c) => ({ type: 'consumable' as const, item: c }));
		} else if (typeFilter === 'Loot') {
			return filteredLoot.map((l) => ({ type: 'loot' as const, item: l }));
		} else {
			// No type filter - combine all
			const items: Array<
				| { type: 'weapon'; item: Weapon }
				| { type: 'armor'; item: Armor }
				| { type: 'consumable'; item: Consumable }
				| { type: 'loot'; item: Loot }
			> = [];
			// Only apply weapon category filter when weapons are included
			if (weaponCategoryFilter === '' || weaponCategoryFilter === 'Primary') {
				items.push(...filteredPrimaryWeapons.map((w) => ({ type: 'weapon' as const, item: w })));
			}
			if (weaponCategoryFilter === '' || weaponCategoryFilter === 'Secondary') {
				items.push(...filteredSecondaryWeapons.map((w) => ({ type: 'weapon' as const, item: w })));
			}
			items.push(
				...filteredArmor.map((a) => ({ type: 'armor' as const, item: a })),
				...filteredConsumables.map((c) => ({ type: 'consumable' as const, item: c })),
				...filteredLoot.map((l) => ({ type: 'loot' as const, item: l }))
			);
			return items;
		}
	});
</script>

<div class="flex flex-col gap-4">
	<!-- Custom Item Collapsible -->
	<Collapsible.Root bind:open={customItemOpen}>
		<Collapsible.Trigger
			class={cn(
				'flex w-full items-center justify-between rounded-md border bg-card px-3 py-2 text-sm',
				customItemOpen && 'rounded-b-none'
			)}
		>
			<span>Custom item</span>
			<ChevronLeft class={cn('size-4 transition-transform', customItemOpen && '-rotate-90')} />
		</Collapsible.Trigger>
		<Collapsible.Content class="space-y-2 rounded-b-md border bg-card/50 p-2">
			<Input
				bind:value={customItemTitle}
				placeholder="Enter item title..."
				onkeydown={(e) => {
					if (e.key === 'Enter' && customItemTitle.trim()) {
						context.addToInventory(
							{ compendium_id: customItemTitle.trim(), title: customItemTitle.trim() },
							'adventuring_gear'
						);
						customItemTitle = '';
					}
				}}
			/>
			<Button
				size="sm"
				disabled={!customItemTitle.trim() || customItemDisabled}
				onclick={() => {
					if (customItemTitle.trim()) {
						context.addToInventory(
							{ compendium_id: customItemTitle.trim(), title: customItemTitle.trim() },
							'adventuring_gear'
						);
						customItemTitle = '';
						customItemDisabled = true;
						setTimeout(() => (customItemDisabled = false), ADD_BUTTON_DISABLE_DELAY_MS);
					}
				}}
			>
				{#if customItemDisabled}
					<Check /> Added
				{:else}
					Add Item
				{/if}
			</Button>
		</Collapsible.Content>
	</Collapsible.Root>

	<!-- Search and Filters -->
	<div class="flex flex-col gap-2">
		<div class="relative">
			<Search
				class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input bind:value={searchQuery} placeholder="Search items..." class="pl-9" />
		</div>

		<!-- Type Filter Buttons -->
		<div class="flex flex-wrap justify-center gap-1">
			<Button
				size="sm"
				variant={typeFilter === 'Weapons' ? 'default' : 'outline'}
				onclick={() => (typeFilter = typeFilter === 'Weapons' ? null : 'Weapons')}
			>
				Weapons
			</Button>
			<Button
				size="sm"
				variant={typeFilter === 'Armor' ? 'default' : 'outline'}
				onclick={() => (typeFilter = typeFilter === 'Armor' ? null : 'Armor')}
			>
				Armor
			</Button>
			<Button
				size="sm"
				variant={typeFilter === 'Consumables' ? 'default' : 'outline'}
				onclick={() => (typeFilter = typeFilter === 'Consumables' ? null : 'Consumables')}
			>
				Consumables
			</Button>
			<Button
				size="sm"
				variant={typeFilter === 'Loot' ? 'default' : 'outline'}
				onclick={() => (typeFilter = typeFilter === 'Loot' ? null : 'Loot')}
			>
				Loot
			</Button>
		</div>

		<!-- Subfilters for Weapons -->
		{#if typeFilter === 'Weapons'}
			<div class="flex flex-wrap justify-center gap-2">
				<!-- Category Select (Primary/Secondary) -->
				<Select.Root
					type="single"
					value={weaponCategoryFilter}
					onValueChange={(v) => (weaponCategoryFilter = v as 'Primary' | 'Secondary' | '')}
				>
					<Select.Trigger class="w-36">
						{weaponCategoryFilter || 'All Categories'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">All Categories</Select.Item>
						<Select.Item value="Primary">Primary</Select.Item>
						<Select.Item value="Secondary">Secondary</Select.Item>
					</Select.Content>
				</Select.Root>

				<!-- Tier Select -->
				<Select.Root
					type="single"
					value={tierFilter}
					onValueChange={(v) => (tierFilter = v as '1' | '2' | '3' | '4' | '')}
				>
					<Select.Trigger class="w-28">
						{tierFilter ? `Tier ${tierFilter}` : 'All Tiers'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">All Tiers</Select.Item>
						<Select.Item value="1">Tier 1</Select.Item>
						<Select.Item value="2">Tier 2</Select.Item>
						<Select.Item value="3">Tier 3</Select.Item>
						<Select.Item value="4">Tier 4</Select.Item>
					</Select.Content>
				</Select.Root>

				<!-- Type Select (Magical/Physical) -->
				<Select.Root
					type="single"
					value={weaponTypeFilter}
					onValueChange={(v) => (weaponTypeFilter = v as 'Magical' | 'Physical' | '')}
				>
					<Select.Trigger class="w-28">
						{weaponTypeFilter || 'All Types'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">All Types</Select.Item>
						<Select.Item value="Physical">Physical</Select.Item>
						<Select.Item value="Magical">Magical</Select.Item>
					</Select.Content>
				</Select.Root>

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
		{/if}

		<!-- Subfilters for Armor -->
		{#if typeFilter === 'Armor'}
			<div class="flex flex-wrap justify-center gap-2">
				<!-- Tier Select -->
				<Select.Root
					type="single"
					value={tierFilter}
					onValueChange={(v) => (tierFilter = v as '1' | '2' | '3' | '4' | '')}
				>
					<Select.Trigger class="w-28">
						{tierFilter ? `Tier ${tierFilter}` : 'All Tiers'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">All Tiers</Select.Item>
						<Select.Item value="1">Tier 1</Select.Item>
						<Select.Item value="2">Tier 2</Select.Item>
						<Select.Item value="3">Tier 3</Select.Item>
						<Select.Item value="4">Tier 4</Select.Item>
					</Select.Content>
				</Select.Root>

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
		{/if}

		<!-- Subfilters for Consumables -->
		{#if typeFilter === 'Consumables'}
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
		{/if}

		<!-- Subfilters for Loot -->
		{#if typeFilter === 'Loot'}
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
		{/if}
	</div>

	<!-- Results -->
	<div class="flex flex-col gap-2">
		{#if !hasActiveFilter}
			<p class="py-4 text-center text-sm text-muted-foreground">Search or use the filters above</p>
		{:else if filteredItems.length === 0}
			<p class="py-4 text-center text-sm text-muted-foreground">No results</p>
		{:else}
			{#each filteredItems as entry}
				{#if entry.type === 'weapon'}
					{#snippet title_snippet()}
						<div class="gap-4 text-left">
							<p class="text-md font-medium">{entry.item.title}</p>
							<p
								class="flex items-center gap-1.5 truncate text-[10px] leading-none text-muted-foreground italic"
							>
								{#if entry.item.source_id === 'Homebrew'}
									<HomebrewBadge type="weapon" id={entry.item.compendium_id} class="size-3" />
								{:else if entry.item.source_id === 'Campaign'}
									<CampaignBadge type="weapon" id={entry.item.compendium_id} class="size-3" />
								{/if}
								Tier {context.level_to_tier(entry.item.level_requirement)}
								{entry.item.category} Weapon
							</p>
						</div>
					{/snippet}

					<Dropdown {title_snippet} class="border-2">
						<div class="flex flex-col gap-3">
							<WeaponDetails weapon={entry.item} />
							<Button
								size="sm"
								disabled={disabledItems.has(entry.item.compendium_id)}
								onclick={() => {
									context.addToInventory(
										entry.item,
										entry.item.category === 'Primary' ? 'primary_weapon' : 'secondary_weapon'
									);
									const id = entry.item.compendium_id;
									disabledItems.add(id);
									setTimeout(() => disabledItems.delete(id), ADD_BUTTON_DISABLE_DELAY_MS);
								}}
							>
								{#if disabledItems.has(entry.item.compendium_id)}
									<Check /> Added
								{:else}
									Add
								{/if}
							</Button>
						</div>
					</Dropdown>
				{:else if entry.type === 'armor'}
					{#snippet title_snippet()}
						<div class="gap-4 text-left">
							<p class="text-md font-medium">{entry.item.title}</p>
							<p
								class="flex items-center gap-1.5 truncate text-[10px] leading-none text-muted-foreground italic"
							>
								{#if entry.item.source_id === 'Homebrew'}
									<HomebrewBadge
										type="armor"
										id={entry.item.compendium_id}
										class="-mt-0.5 size-3"
									/>
								{:else if entry.item.source_id === 'Campaign'}
									<CampaignBadge type="armor" id={entry.item.compendium_id} class="size-3" />
								{/if}
								Tier {context.level_to_tier(entry.item.level_requirement)} Armor
							</p>
						</div>
					{/snippet}

					<Dropdown {title_snippet} class="border-2">
						<div class="flex flex-col gap-3">
							<ArmorDetails armor={entry.item} />
							<Button
								size="sm"
								disabled={disabledItems.has(entry.item.compendium_id)}
								onclick={() => {
									context.addToInventory(entry.item, 'armor');
									const id = entry.item.compendium_id;
									disabledItems.add(id);
									setTimeout(() => disabledItems.delete(id), ADD_BUTTON_DISABLE_DELAY_MS);
								}}
							>
								{#if disabledItems.has(entry.item.compendium_id)}
									<Check /> Added
								{:else}
									Add
								{/if}
							</Button>
						</div>
					</Dropdown>
				{:else if entry.type === 'consumable'}
					{#snippet title_snippet()}
						<div class="gap-4 text-left">
							<p class="text-md font-medium">{entry.item.title}</p>
						</div>
					{/snippet}

					<Dropdown {title_snippet} class="border-2">
						<div class="flex flex-col gap-3">
							<ConsumableDetails consumable={entry.item} />
							<Button
								size="sm"
								disabled={context.consumable_count >= context.max_consumables ||
									disabledItems.has(entry.item.compendium_id)}
								onclick={() => {
									context.addToInventory(entry.item, 'consumable');
									const id = entry.item.compendium_id;
									disabledItems.add(id);
									setTimeout(() => disabledItems.delete(id), ADD_BUTTON_DISABLE_DELAY_MS);
								}}
							>
								{#if disabledItems.has(entry.item.compendium_id)}
									<Check /> Added
								{:else}
									Add
								{/if}
							</Button>
						</div>
					</Dropdown>
				{:else if entry.type === 'loot'}
					{#snippet title_snippet()}
						<div class="gap-4 text-left">
							<p class="text-md font-medium">{entry.item.title}</p>
						</div>
					{/snippet}

					<Dropdown {title_snippet} class="border-2">
						<div class="flex flex-col gap-3">
							<LootDetails loot={entry.item} />
							<Button
								size="sm"
								disabled={disabledItems.has(entry.item.compendium_id)}
								onclick={() => {
									context.addToInventory(entry.item, 'loot');
									const id = entry.item.compendium_id;
									disabledItems.add(id);
									setTimeout(() => disabledItems.delete(id), ADD_BUTTON_DISABLE_DELAY_MS);
								}}
							>
								{#if disabledItems.has(entry.item.compendium_id)}
									<Check /> Added
								{:else}
									Add
								{/if}
							</Button>
						</div>
					</Dropdown>
				{/if}
			{/each}
		{/if}
	</div>
</div>
