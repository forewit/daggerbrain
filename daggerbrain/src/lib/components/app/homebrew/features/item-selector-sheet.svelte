<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import type {
		Weapon,
		Armor,
		Consumable,
		Loot,
		AdventuringGear
	} from '@shared/types/compendium.types';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import Search from '@lucide/svelte/icons/search';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Check from '@lucide/svelte/icons/check';
	import { cn } from '$lib/utils';
	import { SvelteSet } from 'svelte/reactivity';
	import HomebrewBadge from '../../homebrew/homebrew-badge.svelte';
	import CampaignBadge from '../../homebrew/campaign-badge.svelte';
	import Dropdown from '../../leveling/dropdown.svelte';
	import WeaponDetails from '../../equipment/weapon-details.svelte';
	import ArmorDetails from '../../equipment/armor-details.svelte';
	import ConsumableDetails from '../../equipment/consumable-details.svelte';
	import LootDetails from '../../equipment/loot-details.svelte';

	let {
		open = $bindable(false),
		itemTypes,
		onSelect,
		allowCustom = false,
		title = 'Select Item',
		description = 'Browse and select an item'
	}: {
		open?: boolean;
		itemTypes: ('weapon' | 'armor' | 'consumable' | 'loot' | 'gear')[];
		onSelect: (item: {
			id: string;
			title: string;
			type: 'weapon' | 'armor' | 'consumable' | 'loot' | 'gear';
		}) => void;
		allowCustom?: boolean;
		title?: string;
		description?: string;
	} = $props();

	const compendium = getCompendiumContext();
	const homebrew = getHomebrewContext();

	let searchQuery = $state('');
	let typeFilter = $state<'Weapons' | 'Armor' | 'Consumables' | 'Loot' | null>(null);
	let customItemOpen = $state(false);
	let customItemTitle = $state('');
	let customItemDisabled = $state(false);
	const disabledItems = new SvelteSet<string>();
	const ADD_BUTTON_DISABLE_DELAY_MS = 1200;

	// Set initial type filter based on itemTypes
	$effect(() => {
		if (itemTypes.length === 1) {
			if (itemTypes[0] === 'weapon') typeFilter = 'Weapons';
			else if (itemTypes[0] === 'armor') typeFilter = 'Armor';
			else if (itemTypes[0] === 'consumable') typeFilter = 'Consumables';
			else if (itemTypes[0] === 'loot') typeFilter = 'Loot';
		}
	});

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

	// Filter primary weapons
	let filteredPrimaryWeapons = $derived(
		Object.values(compendium.primary_weapons)
			.concat(Object.values(homebrew.primary_weapons))
			.filter((weapon) => matchesSearch(weapon, searchQuery))
	);

	// Filter secondary weapons
	let filteredSecondaryWeapons = $derived(
		Object.values(compendium.secondary_weapons)
			.concat(Object.values(homebrew.secondary_weapons))
			.filter((weapon) => matchesSearch(weapon, searchQuery))
	);

	// Filter armor
	let filteredArmor = $derived(
		Object.values(compendium.armor)
			.concat(Object.values(homebrew.armor))
			.filter((armor) => matchesSearch(armor, searchQuery))
	);

	// Filter consumables
	let filteredConsumables = $derived(
		Object.values(compendium.consumables)
			.concat(Object.values(homebrew.consumables))
			.filter((consumable) => matchesSearch(consumable, searchQuery))
	);

	// Filter loot
	let filteredLoot = $derived(
		Object.values(compendium.loot)
			.concat(Object.values(homebrew.loot))
			.filter((loot) => matchesSearch(loot, searchQuery))
	);

	// Check if user has applied any filter or search
	let hasActiveFilter = $derived(searchQuery.trim() !== '' || typeFilter !== null);

	// Combined filtered items based on type filter and itemTypes
	let filteredItems = $derived.by(() => {
		// Don't show anything until user interacts (filter or search)
		if (!hasActiveFilter) {
			return [];
		}

		const items: Array<
			| { type: 'weapon'; item: Weapon; category: 'Primary' | 'Secondary' }
			| { type: 'armor'; item: Armor }
			| { type: 'consumable'; item: Consumable }
			| { type: 'loot'; item: Loot }
		> = [];

		if (typeFilter === 'Weapons' && itemTypes.includes('weapon')) {
			filteredPrimaryWeapons.forEach((w) =>
				items.push({ type: 'weapon', item: w, category: 'Primary' })
			);
			filteredSecondaryWeapons.forEach((w) =>
				items.push({ type: 'weapon', item: w, category: 'Secondary' })
			);
		} else if (typeFilter === 'Armor' && itemTypes.includes('armor')) {
			filteredArmor.forEach((a) => items.push({ type: 'armor', item: a }));
		} else if (typeFilter === 'Consumables' && itemTypes.includes('consumable')) {
			filteredConsumables.forEach((c) => items.push({ type: 'consumable', item: c }));
		} else if (typeFilter === 'Loot' && itemTypes.includes('loot')) {
			filteredLoot.forEach((l) => items.push({ type: 'loot', item: l }));
		} else if (typeFilter === null) {
			// No type filter - include all based on itemTypes
			if (itemTypes.includes('weapon')) {
				filteredPrimaryWeapons.forEach((w) =>
					items.push({ type: 'weapon', item: w, category: 'Primary' })
				);
				filteredSecondaryWeapons.forEach((w) =>
					items.push({ type: 'weapon', item: w, category: 'Secondary' })
				);
			}
			if (itemTypes.includes('armor')) {
				filteredArmor.forEach((a) => items.push({ type: 'armor', item: a }));
			}
			if (itemTypes.includes('consumable')) {
				filteredConsumables.forEach((c) => items.push({ type: 'consumable', item: c }));
			}
			if (itemTypes.includes('loot')) {
				filteredLoot.forEach((l) => items.push({ type: 'loot', item: l }));
			}
		}

		return items;
	});

	function handleItemSelect(
		item: Weapon | Armor | Consumable | Loot,
		type: 'weapon' | 'armor' | 'consumable' | 'loot',
		category?: 'Primary' | 'Secondary'
	) {
		onSelect({
			id: item.compendium_id,
			title: item.title,
			type
		});
		const id = item.compendium_id;
		disabledItems.add(id);
		setTimeout(() => disabledItems.delete(id), ADD_BUTTON_DISABLE_DELAY_MS);
	}

	function handleCustomItem() {
		if (customItemTitle.trim()) {
			onSelect({
				id: customItemTitle.trim(),
				title: customItemTitle.trim(),
				type: 'gear'
			});
			customItemTitle = '';
			customItemDisabled = true;
			setTimeout(() => (customItemDisabled = false), ADD_BUTTON_DISABLE_DELAY_MS);
		}
	}

	function isHomebrew(item: Weapon | Armor | Consumable | Loot): boolean {
		return item.source_id === 'Homebrew';
	}

	function isCampaign(item: Weapon | Armor | Consumable | Loot): boolean {
		return item.source_id === 'Campaign';
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>{title}</Sheet.Title>
			<Sheet.Description>{description}</Sheet.Description>
		</Sheet.Header>

		<div class="flex flex-col gap-4 overflow-y-auto px-4 pb-6">
			<!-- Custom Item Collapsible -->
			{#if allowCustom}
				<Collapsible.Root bind:open={customItemOpen}>
					<Collapsible.Trigger
						class={cn(
							'flex w-full items-center justify-between rounded-md border bg-card px-3 py-2 text-sm',
							customItemOpen && 'rounded-b-none'
						)}
					>
						<span>Custom item</span>
						<ChevronLeft
							class={cn('size-4 transition-transform', customItemOpen && '-rotate-90')}
						/>
					</Collapsible.Trigger>
					<Collapsible.Content class="space-y-2 rounded-b-md border bg-card/50 p-2">
						<Input
							bind:value={customItemTitle}
							placeholder="Enter item title..."
							onkeydown={(e) => {
								if (e.key === 'Enter' && customItemTitle.trim()) {
									handleCustomItem();
								}
							}}
						/>
						<Button
							size="sm"
							disabled={!customItemTitle.trim() || customItemDisabled}
							onclick={handleCustomItem}
						>
							{#if customItemDisabled}
								<Check /> Added
							{:else}
								Add Item
							{/if}
						</Button>
					</Collapsible.Content>
				</Collapsible.Root>
			{/if}

			<!-- Search and Filters -->
			<div class="flex flex-col gap-2">
				<div class="relative">
					<Search
						class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input bind:value={searchQuery} placeholder="Search items..." class="pl-9" />
				</div>

				<!-- Type Filter Buttons -->
				{#if itemTypes.length > 1}
					<div class="flex flex-wrap justify-center gap-1">
						{#if itemTypes.includes('weapon')}
							<Button
								size="sm"
								variant={typeFilter === 'Weapons' ? 'default' : 'outline'}
								onclick={() => (typeFilter = typeFilter === 'Weapons' ? null : 'Weapons')}
							>
								Weapons
							</Button>
						{/if}
						{#if itemTypes.includes('armor')}
							<Button
								size="sm"
								variant={typeFilter === 'Armor' ? 'default' : 'outline'}
								onclick={() => (typeFilter = typeFilter === 'Armor' ? null : 'Armor')}
							>
								Armor
							</Button>
						{/if}
						{#if itemTypes.includes('consumable')}
							<Button
								size="sm"
								variant={typeFilter === 'Consumables' ? 'default' : 'outline'}
								onclick={() => (typeFilter = typeFilter === 'Consumables' ? null : 'Consumables')}
							>
								Consumables
							</Button>
						{/if}
						{#if itemTypes.includes('loot')}
							<Button
								size="sm"
								variant={typeFilter === 'Loot' ? 'default' : 'outline'}
								onclick={() => (typeFilter = typeFilter === 'Loot' ? null : 'Loot')}
							>
								Loot
							</Button>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Results -->
			<div class="flex flex-col gap-2">
				{#if !hasActiveFilter}
					<p class="py-4 text-center text-sm text-muted-foreground">
						Search or use the filters above
					</p>
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
										{#if isHomebrew(entry.item)}
											<HomebrewBadge type="weapon" id={entry.item.compendium_id} class="size-3" />
										{:else if isCampaign(entry.item)}
											<CampaignBadge type="weapon" id={entry.item.compendium_id} class="size-3" />
										{/if}
										{entry.category} Weapon
									</p>
								</div>
							{/snippet}

							<Dropdown {title_snippet} class="border-2">
								<div class="flex flex-col gap-3">
									<WeaponDetails weapon={entry.item} />
									<Button
										size="sm"
										disabled={disabledItems.has(entry.item.compendium_id)}
										onclick={() => handleItemSelect(entry.item, 'weapon', entry.category)}
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
										{#if isHomebrew(entry.item)}
											<HomebrewBadge
												type="armor"
												id={entry.item.compendium_id}
												class="-mt-0.5 size-3"
											/>
										{:else if isCampaign(entry.item)}
											<CampaignBadge type="armor" id={entry.item.compendium_id} class="size-3" />
										{/if}
										Armor
									</p>
								</div>
							{/snippet}

							<Dropdown {title_snippet} class="border-2">
								<div class="flex flex-col gap-3">
									<ArmorDetails armor={entry.item} />
									<Button
										size="sm"
										disabled={disabledItems.has(entry.item.compendium_id)}
										onclick={() => handleItemSelect(entry.item, 'armor')}
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
										disabled={disabledItems.has(entry.item.compendium_id)}
										onclick={() => handleItemSelect(entry.item, 'consumable')}
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
										onclick={() => handleItemSelect(entry.item, 'loot')}
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
	</Sheet.Content>
</Sheet.Root>
