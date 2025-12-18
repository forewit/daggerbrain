<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import type { Weapon } from '$lib/types/compendium-types';
	import WeaponDetails from '../equipment/weapon-details.svelte';
	import Dropdown from '../leveling/dropdown.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import Search from '@lucide/svelte/icons/search';
	import { capitalize } from '$lib/utils';

	let searchQuery = $state('');
	let tierFilter = $state<'1' | '2' | '3' | '4' | ''>('');
	let weaponTypeFilter = $state<'Magical' | 'Physical' | ''>('');
	let categoryFilter = $state<'Primary' | 'Secondary' | ''>('');

	const context = getCharacterContext();
	const homebrew = getHomebrewContext();

	// Helper function to strip HTML tags for search
	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, '').trim();
	}

	// Helper function to check if item matches search
	function matchesSearch(item: Weapon, query: string): boolean {
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
		Object.entries(homebrew.primary_weapons)
			.map(([id, weapon]) => ({ id, weapon }))
			.filter(({ weapon }) => {
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

				// Category filter
				if (categoryFilter !== '') {
					if (weapon.category !== categoryFilter) return false;
				}

				return true;
			})
	);

	// Filter secondary weapons
	let filteredSecondaryWeapons = $derived(
		Object.entries(homebrew.secondary_weapons)
			.map(([id, weapon]) => ({ id, weapon }))
			.filter(({ weapon }) => {
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

				// Category filter
				if (categoryFilter !== '') {
					if (weapon.category !== categoryFilter) return false;
				}

				return true;
			})
	);

	// Check if user has applied any filter or search
	let hasActiveFilter = $derived(
		searchQuery.trim() !== '' || tierFilter !== '' || weaponTypeFilter !== '' || categoryFilter !== ''
	);

	// Combined filtered items
	let filteredItems = $derived.by(() => {
		// Don't show anything until user interacts (filter or search)
		if (!hasActiveFilter) {
			return [];
		}

		return [
			...filteredPrimaryWeapons.map(({ id, weapon }) => ({
				id,
				type: 'weapon' as const,
				item: weapon,
				category: 'Primary' as const
			})),
			...filteredSecondaryWeapons.map(({ id, weapon }) => ({
				id,
				type: 'weapon' as const,
				item: weapon,
				category: 'Secondary' as const
			}))
		];
	});

	// Handle delete
	async function handleDelete(id: string, category: 'Primary' | 'Secondary') {
		if (confirm('Are you sure you want to delete this weapon?')) {
			if (category === 'Primary') {
				await homebrew.deletePrimaryWeapon(id);
			} else {
				await homebrew.deleteSecondaryWeapon(id);
			}
		}
	}
</script>

<div class="flex flex-col gap-4">
	<!-- Search and Filters -->
	<div class="flex flex-col gap-2">
		<div class="relative">
			<Search
				class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input bind:value={searchQuery} placeholder="Search homebrew weapons..." class="pl-9" />
		</div>

		<!-- Filters -->
		<div class="flex flex-wrap justify-center gap-2">
			<!-- Category Filter -->
			<Select.Root
				type="single"
				value={categoryFilter}
				onValueChange={(v) => (categoryFilter = (v as 'Primary' | 'Secondary' | '') || '')}
			>
				<Select.Trigger class="w-32">
					{categoryFilter || 'All Categories'}
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
				onValueChange={(v) => (tierFilter = (v as '1' | '2' | '3' | '4' | '') || '')}
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
				onValueChange={(v) => (weaponTypeFilter = (v as 'Magical' | 'Physical' | '') || '')}
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
		</div>
	</div>

	<!-- Results -->
	<div class="flex flex-col gap-2">
		{#if !hasActiveFilter}
			<p class="py-4 text-center text-sm text-muted-foreground">Search or use the filters above</p>
		{:else if filteredItems.length === 0}
			<p class="py-4 text-center text-sm text-muted-foreground">No results</p>
		{:else}
			{#each filteredItems as entry (entry.id)}
				{#snippet title_snippet()}
					<div class="gap-4 text-left">
						<p class="text-md font-medium">{entry.item.title}</p>
						<p class="truncate text-[10px] leading-none text-muted-foreground italic">
							Tier {context.level_to_tier(entry.item.level_requirement)}
							{entry.item.category} Weapon
						</p>
					</div>
				{/snippet}

				<Dropdown {title_snippet} class="border-2">
					<div class="flex flex-col gap-3">
						<WeaponDetails weapon={entry.item} />
						<div class="flex gap-2">
							<Button
								size="sm"
								variant="destructive"
								onclick={() => handleDelete(entry.id, entry.category)}
							>
								Delete
							</Button>
						</div>
					</div>
				</Dropdown>
			{/each}
		{/if}
	</div>
</div>

