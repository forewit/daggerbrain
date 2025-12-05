<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Weapon, Armor, Consumable } from '$lib/types/compendium-types';
	import WeaponDetails from './weapon-details.svelte';
	import ArmorDetails from './armor-details.svelte';
	import ConsumableDetails from './consumable-details.svelte';
	import Dropdown from '../leveling/dropdown.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import Search from '@lucide/svelte/icons/search';

	let searchQuery = $state('');
	let typeFilter = $state<'Primary' | 'Secondary' | 'Armor' | 'Consumables' | null>(null);
	let tierFilter = $state<'1' | '2' | '3' | '4' | null>(null);

	// Clear tier filter when consumables filter is selected (consumables don't have tiers)
	$effect(() => {
		if (typeFilter === 'Consumables' && tierFilter !== null) {
			tierFilter = null;
		}
	});

	const context = getCharacterContext();
	const compendium = getCompendiumContext();
	let character = $derived(context.character);

	// Helper function to strip HTML tags for search
	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, '').trim();
	}

	// Helper function to check if item matches search
	function matchesSearch(item: Weapon | Armor | Consumable, query: string): boolean {
		if (!query) return true;
		const searchLower = query.toLowerCase();
		const titleMatch = item.title.toLowerCase().includes(searchLower);
		const descMatch = stripHtml(item.description_html).toLowerCase().includes(searchLower);
		return titleMatch || descMatch;
	}

	// Filter primary weapons
	let filteredPrimaryWeapons = $derived(
		Object.values(compendium.primary_weapons).filter((weapon) => {
			// Search filter
			if (!matchesSearch(weapon, searchQuery)) return false;

			// Type filter - only show if Primary filter is selected or no type filter
			if (typeFilter === 'Secondary') return false;

			// Tier filter
			if (tierFilter !== null) {
				const weaponTier = context.get_tier_from_level(weapon.level_requirement);
				if (weaponTier !== tierFilter) return false;
			}

			return true;
		})
	);

	// Filter secondary weapons
	let filteredSecondaryWeapons = $derived(
		Object.values(compendium.secondary_weapons).filter((weapon) => {
			// Search filter
			if (!matchesSearch(weapon, searchQuery)) return false;

			// Type filter - only show if Secondary filter is selected or no type filter
			if (typeFilter === 'Primary') return false;

			// Tier filter
			if (tierFilter !== null) {
				const weaponTier = context.get_tier_from_level(weapon.level_requirement);
				if (weaponTier !== tierFilter) return false;
			}

			return true;
		})
	);

	// Filter armor
	let filteredArmor = $derived(
		Object.values(compendium.armor).filter((armor) => {
			// Search filter
			if (!matchesSearch(armor, searchQuery)) return false;

			// Tier filter
			if (tierFilter !== null) {
				const armorTier = context.get_tier_from_level(armor.level_requirement);
				if (armorTier !== tierFilter) return false;
			}

			return true;
		})
	);

	// Filter consumables (consumables don't have tier/level requirements)
	let filteredConsumables = $derived(
		Object.values(compendium.consumables).filter((consumable) => {
			// Search filter
			if (!matchesSearch(consumable, searchQuery)) return false;
			return true;
		})
	);

	// Check if user has applied any filter or search
	let hasActiveFilter = $derived(
		searchQuery.trim() !== '' || typeFilter !== null || tierFilter !== null
	);

	// Combined filtered items based on type filter
	// Only show results if user has applied a filter or entered a search query
	let filteredItems = $derived.by(() => {
		// Don't show anything until user interacts (filter or search)
		if (!hasActiveFilter) {
			return [];
		}

		if (typeFilter === 'Primary') {
			return filteredPrimaryWeapons.map((w) => ({ type: 'weapon' as const, item: w }));
		} else if (typeFilter === 'Secondary') {
			return filteredSecondaryWeapons.map((w) => ({ type: 'weapon' as const, item: w }));
		} else if (typeFilter === 'Armor') {
			return filteredArmor.map((a) => ({ type: 'armor' as const, item: a }));
		} else if (typeFilter === 'Consumables') {
			return filteredConsumables.map((c) => ({ type: 'consumable' as const, item: c }));
		} else {
			// No type filter - combine all
			return [
				...filteredPrimaryWeapons.map((w) => ({ type: 'weapon' as const, item: w })),
				...filteredSecondaryWeapons.map((w) => ({ type: 'weapon' as const, item: w })),
				...filteredArmor.map((a) => ({ type: 'armor' as const, item: a })),
				...filteredConsumables.map((c) => ({ type: 'consumable' as const, item: c }))
			];
		}
	});
</script>

<div class="flex flex-col gap-4">
	<!-- Search and Filters -->
	<div class="flex flex-col gap-2">
		<div class="relative">
			<Search
				class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input bind:value={searchQuery} placeholder="Search items..." class="pl-9" />
		</div>

		<div class="flex grow flex-wrap justify-center gap-x-0.5 gap-y-2">
			<!-- Type Filter Buttons -->
			<div class="flex flex-wrap justify-center gap-1">
				<Button
					size="sm"
					variant={typeFilter === 'Primary' ? 'default' : 'outline'}
					onclick={() => (typeFilter = typeFilter === 'Primary' ? null : 'Primary')}
				>
					Primary Weapons
				</Button>
				<Button
					size="sm"
					variant={typeFilter === 'Secondary' ? 'default' : 'outline'}
					onclick={() => (typeFilter = typeFilter === 'Secondary' ? null : 'Secondary')}
				>
					Secondary Weapons
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
			</div>

			<!-- Tier Filter Buttons -->
			<div class="flex grow flex-wrap justify-center gap-1">
				<Button
					size="sm"
					variant={tierFilter === '1' ? 'default' : 'outline'}
					disabled={typeFilter === 'Consumables'}
					onclick={() => (tierFilter = tierFilter === '1' ? null : '1')}
				>
					Tier 1
				</Button>
				<Button
					size="sm"
					variant={tierFilter === '2' ? 'default' : 'outline'}
					disabled={typeFilter === 'Consumables'}
					onclick={() => (tierFilter = tierFilter === '2' ? null : '2')}
				>
					Tier 2
				</Button>
				<Button
					size="sm"
					variant={tierFilter === '3' ? 'default' : 'outline'}
					disabled={typeFilter === 'Consumables'}
					onclick={() => (tierFilter = tierFilter === '3' ? null : '3')}
				>
					Tier 3
				</Button>
				<Button
					size="sm"
					variant={tierFilter === '4' ? 'default' : 'outline'}
					disabled={typeFilter === 'Consumables'}
					onclick={() => (tierFilter = tierFilter === '4' ? null : '4')}
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
		{:else if filteredItems.length === 0}
			<p class="py-4 text-center text-sm text-muted-foreground">No results</p>
		{:else}
			{#each filteredItems as entry (entry.item.id)}
				{#if entry.type === 'weapon'}
					{#snippet subtitle_snippet()}
						<Button
							size="sm"
							onclick={(e) => {
								e.stopPropagation();
								context.addToInventory(
									entry.item,
									entry.item.category === 'Primary' ? 'primary_weapon' : 'secondary_weapon'
								);
							}}>Add</Button
						>
					{/snippet}

					{#snippet title_snippet()}
						<div class="gap-4 text-left">
							<p class="text-md font-medium">{entry.item.title}</p>
							<p class="truncate text-[10px] leading-none text-muted-foreground italic">
								Tier {context.get_tier_from_level(entry.item.level_requirement)}
								{entry.item.category} Weapon
							</p>
						</div>
					{/snippet}

					<Dropdown {title_snippet} {subtitle_snippet} class="border-2">
						<WeaponDetails weapon={entry.item} />
					</Dropdown>
				{:else if entry.type === 'armor'}
					{#snippet subtitle_snippet()}
						<Button
							size="sm"
							onclick={(e) => {
								e.stopPropagation();
								context.addToInventory(entry.item, 'armor');
							}}>Add</Button
						>
					{/snippet}

					{#snippet title_snippet()}
						<div class="gap-4 text-left">
							<p class="text-md font-medium">{entry.item.title}</p>
							<p class="truncate text-[10px] leading-none text-muted-foreground italic">
								Tier {context.get_tier_from_level(entry.item.level_requirement)} Armor
							</p>
						</div>
					{/snippet}

					<Dropdown {title_snippet} {subtitle_snippet} class="border-2">
						<ArmorDetails armor={entry.item} />
					</Dropdown>
				{:else if entry.type === 'consumable'}
					{#snippet subtitle_snippet()}
						<Button
							size="sm"
							disabled={context.consumable_count >= context.max_consumables}
							onclick={(e) => {
								e.stopPropagation();
								context.addToInventory(entry.item, 'consumable');
							}}>Add</Button
						>
					{/snippet}

					{#snippet title_snippet()}
						<div class="gap-4 text-left">
							<p class="text-md font-medium">{entry.item.title}</p>
						</div>
					{/snippet}

					<Dropdown {title_snippet} {subtitle_snippet} class="border-2">
						<ConsumableDetails consumable={entry.item} />
					</Dropdown>
				{/if}
			{/each}
		{/if}
	</div>
</div>
