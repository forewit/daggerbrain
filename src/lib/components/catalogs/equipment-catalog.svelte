<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Select from '$lib/components/ui/select';
	import type {
		PrimaryWeapon,
		SecondaryWeapon,
		Armor,
		Consumable,
		Loot
	} from '@convex/schemas/compendium';
	import type { SourceKey } from '@convex/schemas/rules';
	import ArmorDetails from '$lib/components/compendium-items/equipment/armor-details.svelte';
	import ConsumableDetails from '$lib/components/compendium-items/equipment/consumable-details.svelte';
	import LootDetails from '$lib/components/compendium-items/equipment/loot-details.svelte';
	import PrimaryWeaponDetails from '$lib/components/compendium-items/equipment/primary-weapon-details.svelte';
	import SecondaryWeaponDetails from '$lib/components/compendium-items/equipment/secondary-weapon-details.svelte';
	import Dropdown from '$lib/components/utility/dropdown.svelte';
	import Search from '@lucide/svelte/icons/search';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Check from '@lucide/svelte/icons/check';
	import { cn, level_to_tier } from '$lib/utils';
	import { SvelteSet } from 'svelte/reactivity';
	import HomebrewBadge from '$lib/components/decorations/badges/homebrew-badge.svelte';
	import CampaignBadge from '$lib/components/decorations/badges/campaign-badge.svelte';
	import type { CompendiumContent } from '@convex/schemas/compendium';
	import type { SourceMetadata } from '@convex/schemas/sources';

	let {
		onSelect,
		compendium,
		available_source_keys,
		sources,
		disable_consumables = false
	}: {
		onSelect: (
			item:
				| { type: 'primary_weapon'; id: string }
				| { type: 'secondary_weapon'; id: string }
				| { type: 'armor'; id: string }
				| { type: 'loot'; id: string }
				| { type: 'consumable'; id: string }
				| { type: 'adventuring_gear'; title: string }
		) => void;
		compendium: CompendiumContent;
		available_source_keys: SourceKey[];
		sources: SourceMetadata[];
		disable_consumables: boolean;
	} = $props();

	let searchQuery = $state('');
	let typeFilter = $state<'Weapons' | 'Armor' | 'Consumables' | 'Loot' | null>(null);
	let tierFilter = $state<'1' | '2' | '3' | '4' | ''>('');
	let weaponTypeFilter = $state<'Magical' | 'Physical' | ''>('');
	let weaponCategoryFilter = $state<'Primary' | 'Secondary' | ''>('');
	let sourceFilter = $state<SourceKey | ''>('');
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

	// Helper function to check if item matches search
	function matchesSearch(
		item: PrimaryWeapon | SecondaryWeapon | Armor | Consumable | Loot,
		query: string
	): boolean {
		if (!query) return true;
		const searchLower = query.toLowerCase();
		const titleMatch = item.title.toLowerCase().includes(searchLower);
		const descMatch = item.description_html.toLowerCase().includes(searchLower);
		return titleMatch || descMatch;
	}

	// Helper to convert tier string to number
	function getTierNumber(tier: '1' | '2' | '3' | '4'): number {
		return parseInt(tier);
	}

	const allPrimaryWeapons = $derived(Object.entries(compendium.primary_weapons));
	// Filter primary weapons
	const filteredPrimaryWeapons = $derived(
		allPrimaryWeapons.filter(([id, weapon]) => {
			// Search filter
			if (!matchesSearch(weapon, searchQuery)) return false;

			// Tier filter
			if (tierFilter !== '') {
				const weaponTier = level_to_tier(weapon.level_requirement);
				if (weaponTier !== getTierNumber(tierFilter)) return false;
			}

			// Weapon type filter (Magical/Physical)
			if (weaponTypeFilter !== '') {
				if (weapon.type !== weaponTypeFilter) return false;
			}

			// Source filter
			if (sourceFilter !== '' && weapon.source_key !== sourceFilter) return false;

			return true;
		})
	);

	const allSecondaryWeapons = $derived(Object.entries(compendium.secondary_weapons));
	// Filter secondary weapons
	const filteredSecondaryWeapons = $derived(
		allSecondaryWeapons.filter(([id, weapon]) => {
			// Search filter
			if (!matchesSearch(weapon, searchQuery)) return false;

			// Tier filter
			if (tierFilter !== '') {
				const weaponTier = level_to_tier(weapon.level_requirement);
				if (weaponTier !== getTierNumber(tierFilter)) return false;
			}

			// Weapon type filter (Magical/Physical)
			if (weaponTypeFilter !== '') {
				if (weapon.type !== weaponTypeFilter) return false;
			}

			// Source filter
			if (sourceFilter !== '' && weapon.source_key !== sourceFilter) return false;

			return true;
		})
	);

	const allArmor = $derived(Object.entries(compendium.armor));
	// Filter armor
	const filteredArmor = $derived(
		allArmor.filter(([id, armor]) => {
			// Search filter
			if (!matchesSearch(armor, searchQuery)) return false;

			// Tier filter
			if (tierFilter !== '') {
				const armorTier = level_to_tier(armor.level_requirement);
				if (armorTier !== getTierNumber(tierFilter)) return false;
			}

			// Source filter
			if (sourceFilter !== '' && armor.source_key !== sourceFilter) return false;

			return true;
		})
	);

	const allConsumables = $derived(Object.entries(compendium.consumables));
	// Filter consumables (consumables don't have tier/level requirements)
	const filteredConsumables = $derived(
		allConsumables.filter(([id, consumable]) => {
			// Search filter
			if (!matchesSearch(consumable, searchQuery)) return false;

			// Source filter
			if (sourceFilter !== '' && consumable.source_key !== sourceFilter) return false;

			return true;
		})
	);

	const allLoot = $derived(Object.entries(compendium.loot));
	// Filter loot (loot doesn't have tier/level requirements)
	const filteredLoot = $derived(
		allLoot.filter(([id, loot]) => {
			// Search filter
			if (!matchesSearch(loot, searchQuery)) return false;

			// Source filter
			if (sourceFilter !== '' && loot.source_key !== sourceFilter) return false;

			return true;
		})
	);

	// Check if user has applied any filter or search
	const hasActiveFilter = $derived(
		searchQuery.trim() !== '' || typeFilter !== null || tierFilter !== '' || sourceFilter !== ''
	);

	type Item =
		| { type: 'primary_weapon'; item: PrimaryWeapon; id: string }
		| { type: 'secondary_weapon'; item: SecondaryWeapon; id: string }
		| { type: 'armor'; item: Armor; id: string }
		| { type: 'consumable'; item: Consumable; id: string }
		| { type: 'loot'; item: Loot; id: string };

	// Combined filtered items based on type filter
	// Only show results if user has applied a filter or entered a search query
	const filteredItems = $derived.by(() => {
		// Don't show anything until user interacts (filter or search)
		if (!hasActiveFilter) {
			return [];
		}
		const items: Item[] = [];

		if (!typeFilter || typeFilter === 'Weapons') {
			if (weaponCategoryFilter !== 'Secondary') {
				items.push(
					...filteredPrimaryWeapons.map(([id, w]) => ({
						id,
						type: 'primary_weapon' as const,
						item: w
					}))
				);
			}

			if (weaponCategoryFilter !== 'Primary') {
				items.push(
					...filteredSecondaryWeapons.map(([id, w]) => ({
						id,
						type: 'secondary_weapon' as const,
						item: w
					}))
				);
			}
		}

		if (!typeFilter || typeFilter === 'Armor') {
			items.push(
				...filteredArmor.map(([id, a]) => ({
					id,
					type: 'armor' as const,
					item: a
				}))
			);
		}

		if (!typeFilter || typeFilter === 'Consumables') {
			items.push(
				...filteredConsumables.map(([id, c]) => ({
					id,
					type: 'consumable' as const,
					item: c
				}))
			);
		}

		if (!typeFilter || typeFilter === 'Loot') {
			items.push(
				...filteredLoot.map(([id, l]) => ({
					id,
					type: 'loot' as const,
					item: l
				}))
			);
		}

		return items;
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
					const title = customItemTitle.trim();
					if (e.key === 'Enter' && title) {
						onSelect({ type: 'adventuring_gear', title });

						customItemTitle = '';
					}
				}}
			/>
			<Button
				size="sm"
				disabled={!customItemTitle.trim() || customItemDisabled}
				onclick={() => {
					const title = customItemTitle.trim();

					if (title) {
						onSelect({ type: 'adventuring_gear', title });
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
					onValueChange={(v) => (sourceFilter = v as SourceKey | '')}
				>
					<Select.Trigger class="w-32">
						{sourceFilter
							? sources.find((source) => source.source_key === sourceFilter)?.short_title ||
								sourceFilter
							: 'All Sources'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">All Sources</Select.Item>
						{#each available_source_keys as key}
							<Select.Item value={key}
								>{sources.find((source) => source.source_key === key)?.short_title ||
									key}</Select.Item
							>
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
					onValueChange={(v) => (sourceFilter = v as SourceKey | '')}
				>
					<Select.Trigger class="w-32">
						{sourceFilter
							? sources.find((source) => source.source_key === sourceFilter)?.short_title ||
								sourceFilter
							: 'All Sources'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">All Sources</Select.Item>
						{#each available_source_keys as key}
							<Select.Item value={key}
								>{sources.find((source) => source.source_key === key)?.short_title ||
									key}</Select.Item
							>
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
					onValueChange={(v) => (sourceFilter = v as SourceKey | '')}
				>
					<Select.Trigger class="w-32">
						{sourceFilter
							? sources.find((source) => source.source_key === sourceFilter)?.short_title ||
								sourceFilter
							: 'All Sources'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">All Sources</Select.Item>
						{#each available_source_keys as key}
							<Select.Item value={key}
								>{sources.find((source) => source.source_key === key)?.short_title ||
									key}</Select.Item
							>
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
					onValueChange={(v) => (sourceFilter = v as SourceKey | '')}
				>
					<Select.Trigger class="w-32">
						{sourceFilter
							? sources.find((source) => source.source_key === sourceFilter)?.short_title ||
								sourceFilter
							: 'All Sources'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">All Sources</Select.Item>
						{#each available_source_keys as key}
							<Select.Item value={key}
								>{sources.find((source) => source.source_key === key)?.short_title ||
									key}</Select.Item
							>
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
				{#if entry.type === 'primary_weapon'}
					{#snippet title_snippet()}
						<div class="gap-4 text-left">
							<p class="text-md font-medium">{entry.item.title}</p>
							<p
								class="flex items-center gap-1.5 truncate text-[10px] leading-none text-muted-foreground italic"
							>
								{#if entry.item.source_key === 'Homebrew'}
									<HomebrewBadge class="size-3" />
								{:else if entry.item.source_key === 'Campaign'}
									<CampaignBadge class="size-3" />
								{/if}
								Tier {level_to_tier(entry.item.level_requirement)}
								Primary Weapon
							</p>
						</div>
					{/snippet}

					<Dropdown {title_snippet} class="border-2">
						<div class="flex flex-col gap-3">
							<PrimaryWeaponDetails weapon={entry.item} />
							<Button
								size="sm"
								disabled={disabledItems.has(entry.id)}
								onclick={() => {
									onSelect(entry);
									disabledItems.add(entry.id);
									setTimeout(() => disabledItems.delete(entry.id), ADD_BUTTON_DISABLE_DELAY_MS);
								}}
							>
								{#if disabledItems.has(entry.id)}
									<Check /> Added
								{:else}
									Add
								{/if}
							</Button>
						</div>
					</Dropdown>
				{:else if entry.type === 'secondary_weapon'}
					{#snippet title_snippet()}
						<div class="gap-4 text-left">
							<p class="text-md font-medium">{entry.item.title}</p>
							<p
								class="flex items-center gap-1.5 truncate text-[10px] leading-none text-muted-foreground italic"
							>
								{#if entry.item.source_key === 'Homebrew'}
									<HomebrewBadge class="size-3" />
								{:else if entry.item.source_key === 'Campaign'}
									<CampaignBadge class="size-3" />
								{/if}
								Tier {level_to_tier(entry.item.level_requirement)}
								Secondary Weapon
							</p>
						</div>
					{/snippet}

					<Dropdown {title_snippet} class="border-2">
						<div class="flex flex-col gap-3">
							<SecondaryWeaponDetails weapon={entry.item} />
							<Button
								size="sm"
								disabled={disabledItems.has(entry.id)}
								onclick={() => {
									onSelect(entry);
									disabledItems.add(entry.id);
									setTimeout(() => disabledItems.delete(entry.id), ADD_BUTTON_DISABLE_DELAY_MS);
								}}
							>
								{#if disabledItems.has(entry.id)}
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
								{#if entry.item.source_key === 'Homebrew'}
									<HomebrewBadge class="-mt-0.5 size-3" />
								{:else if entry.item.source_key === 'Campaign'}
									<CampaignBadge class="size-3" />
								{/if}
								Tier {level_to_tier(entry.item.level_requirement)} Armor
							</p>
						</div>
					{/snippet}

					<Dropdown {title_snippet} class="border-2">
						<div class="flex flex-col gap-3">
							<ArmorDetails armor={entry.item} />
							<Button
								size="sm"
								disabled={disabledItems.has(entry.id)}
								onclick={() => {
									onSelect(entry);
									disabledItems.add(entry.id);
									setTimeout(() => disabledItems.delete(entry.id), ADD_BUTTON_DISABLE_DELAY_MS);
								}}
							>
								{#if disabledItems.has(entry.id)}
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
							<p
								class="flex items-center gap-1.5 truncate text-[10px] leading-none text-muted-foreground italic"
							>
								{#if entry.item.source_key === 'Homebrew'}
									<HomebrewBadge class="size-3" />
								{:else if entry.item.source_key === 'Campaign'}
									<CampaignBadge class="size-3" />
								{/if}
								Consumable
							</p>
						</div>
					{/snippet}

					<Dropdown {title_snippet} class="border-2">
						<div class="flex flex-col gap-3">
							<ConsumableDetails consumable={entry.item} />
							<Button
								size="sm"
								disabled={disable_consumables || disabledItems.has(entry.id)}
								onclick={() => {
									onSelect(entry);
									disabledItems.add(entry.id);
									setTimeout(() => disabledItems.delete(entry.id), ADD_BUTTON_DISABLE_DELAY_MS);
								}}
							>
								{#if disabledItems.has(entry.id)}
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
							<p
								class="flex items-center gap-1.5 truncate text-[10px] leading-none text-muted-foreground italic"
							>
								{#if entry.item.source_key === 'Homebrew'}
									<HomebrewBadge class="size-3" />
								{:else if entry.item.source_key === 'Campaign'}
									<CampaignBadge class="size-3" />
								{/if}
								Loot
							</p>
						</div>
					{/snippet}

					<Dropdown {title_snippet} class="border-2">
						<div class="flex flex-col gap-3">
							<LootDetails loot={entry.item} />
							<Button
								size="sm"
								disabled={disabledItems.has(entry.id)}
								onclick={() => {
									onSelect(entry);
									disabledItems.add(entry.id);
									setTimeout(() => disabledItems.delete(entry.id), ADD_BUTTON_DISABLE_DELAY_MS);
								}}
							>
								{#if disabledItems.has(entry.id)}
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
