<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import type {
		Weapon,
		Armor,
		Consumable,
		Loot,
		AdventuringGear
	} from '$lib/types/compendium-types';
	import WeaponCard from './equipment/weapon-row.svelte';
	import ArmorCard from './equipment/armor-row.svelte';
	import ConsumableCard from './equipment/consumable-row.svelte';
	import LootCard from './equipment/loot-row.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { cn } from '$lib/utils';
	import Search from '@lucide/svelte/icons/search';
	import { Button } from '$lib/components/ui/button';

	let {
		class: className = '',
		onAddItems = () => {},
		onItemClick = (
			_type: 'weapon' | 'armor' | 'consumable' | 'loot' | 'adventuring_gear',
			_item: Weapon | Armor | Consumable | Loot | AdventuringGear | null
		) => {}
	}: {
		class?: string;
		onAddItems?: () => void;
		onItemClick?: (
			type: 'weapon' | 'armor' | 'consumable' | 'loot' | 'adventuring_gear',
			item: Weapon | Armor | Consumable | Loot | AdventuringGear | null
		) => void;
	} = $props();

	const context = getCharacterContext();
	const compendium = getCompendiumContext();
	let character = $derived(context.character);
	let searchQuery = $state('');

	// Helper function to check if item matches search
	function matchesSearch(
		item: Weapon | Armor | Consumable | Loot | AdventuringGear,
		query: string
	): boolean {
		if (!query.trim()) return true;
		const searchLower = query.toLowerCase();
		return item.title.toLowerCase().includes(searchLower);
	}

	// Filtered weapons and armor
	let filteredWeapons = $derived(
		[...context.inventory_primary_weapons, ...context.inventory_secondary_weapons].filter(
			(weapon) => matchesSearch(weapon, searchQuery)
		)
	);

	let filteredArmor = $derived(
		Object.values(context.inventory_armor).filter((armor) => matchesSearch(armor, searchQuery))
	);

	// Filtered consumables
	let filteredConsumables = $derived.by(() => {
		if (!character) return [];
		const consumables: (Consumable & { quantity: number })[] = [];
		for (const [consumable_id, data] of Object.entries(character.inventory.consumables)) {
			const consumable = compendium.consumables[consumable_id];
			if (consumable && matchesSearch(consumable, searchQuery)) {
				consumables.push({ ...consumable, quantity: data.quantity });
			}
		}
		return consumables;
	});

	// Filtered loot
	let filteredLoot = $derived.by(() => {
		if (!character) return [];
		const lootItems: (Loot & { quantity: number })[] = [];
		for (const [loot_id, data] of Object.entries(character.inventory.loot)) {
			const loot = compendium.loot[loot_id];
			if (loot && matchesSearch(loot, searchQuery)) {
				lootItems.push({ ...loot, quantity: data.quantity });
			}
		}
		return lootItems;
	});

	// Filtered adventuring gear (with original index)
	let filteredAdventuringGear = $derived.by(() => {
		if (!character) return [];
		return character.inventory.adventuring_gear
			.map((gear, index) => ({ gear, originalIndex: index }))
			.filter(({ gear }) => matchesSearch(gear, searchQuery));
	});

	// Helper function to get weapon type for context functions
	function getWeaponType(weapon: Weapon): 'primary_weapon' | 'secondary_weapon' {
		return weapon.category === 'Primary' ? 'primary_weapon' : 'secondary_weapon';
	}
</script>

{#if character}
	{@const hasItems =
		context.inventory_primary_weapons.length > 0 ||
		context.inventory_secondary_weapons.length > 0 ||
		Object.keys(context.inventory_armor).length > 0 ||
		Object.keys(character.inventory.consumables).length > 0 ||
		Object.keys(character.inventory.loot).length > 0 ||
		character.inventory.adventuring_gear.length > 0}
	<div class={cn('flex flex-col gap-6', className)}>
		{#if !hasItems}
			<p class="py-4 text-center text-sm text-muted-foreground">Your inventory is empty</p>
		{:else}
			<!-- Search Box -->
			<div class="relative">
				<Search
					class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
				/>
				<Input bind:value={searchQuery} placeholder="Search inventory..." class="pl-9" />
			</div>

			<!-- Armor Table -->
			{#if filteredArmor.length > 0}
				<div class="flex flex-col gap-1">
					<table class="w-full border-collapse">
						<colgroup>
							<col />
							<col class="w-12" />
							<col class="w-29" />
							<col class="hidden w-20 sm:table-column" />
						</colgroup>
						<thead>
							<tr class="border-b bg-card text-xs text-muted-foreground">
								<th class="px-4 py-2 text-left">Armor</th>
								<th class="py-2 pr-4 text-center">Slots</th>
								<th class="py-2 pr-4 text-right sm:text-center">Base Thresholds</th>
								<th class="hidden py-2 pr-4 text-right sm:table-cell">Features</th>
							</tr>
						</thead>
						<tbody>
							{#each filteredArmor as armor (armor.id)}
								<ArmorCard
									{armor}
									showEquipButton={true}
									quantity={character.inventory.armor[armor.id]?.quantity ?? 1}
									onclick={() => onItemClick('armor', armor)}
								/>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<!-- Weapons Table -->
			{#if filteredWeapons.length > 0}
				<div class="flex flex-col gap-1">
					<table class="w-full border-collapse">
						<colgroup>
							<col />
							<col class="w-16" />
							<col class="w-18" />
							<col class="w-18" />
							<col class="hidden w-20 sm:table-column" />
						</colgroup>
						<thead>
							<tr class="border-b bg-card text-xs text-muted-foreground">
								<th class="px-4 py-2 text-left">Weapons</th>
								<th class="py-2 pr-4 text-center">Range</th>
								<th class="py-2 pr-4 text-center">To Hit</th>
								<th class="py-2 pr-4 text-right sm:text-center">Damage</th>
								<th class="hidden py-2 pr-4 text-right sm:table-cell">Features</th>
							</tr>
						</thead>
						<tbody>
							{#each filteredWeapons as weapon (weapon.id)}
								{@const inventory =
									weapon.category === 'Primary'
										? character.inventory.primary_weapons
										: character.inventory.secondary_weapons}
								{@const weaponType = getWeaponType(weapon)}
								<WeaponCard
									{weapon}
									showEquipButton={true}
									quantity={inventory[weapon.id]?.quantity ?? 1}
									onclick={() => onItemClick('weapon', weapon)}
								/>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<!-- Consumables Table -->
			{#if filteredConsumables.length > 0}
				<div class="flex flex-col gap-1">
					<table class="w-full border-collapse">
						<colgroup>
							<col />
							<col />
						</colgroup>
						<thead>
							<tr class="border-b bg-card text-xs text-muted-foreground">
								<th class="px-4 py-2 text-left">Consumables</th>
								<th class="py-2 pr-4 text-right">Description</th>
							</tr>
						</thead>
						<tbody>
							{#each filteredConsumables as consumable (consumable.id)}
								<ConsumableCard
									{consumable}
									quantity={consumable.quantity}
									onclick={() => onItemClick('consumable', consumable)}
								/>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<!-- Loot Table -->
			{#if filteredLoot.length > 0}
				<div class="flex flex-col gap-1">
					<table class="w-full border-collapse">
						<colgroup>
							<col />
							<col class="hidden sm:table-column" />
							<col class="hidden w-20 md:table-column" />
						</colgroup>
						<thead>
							<tr class="border-b bg-card text-xs text-muted-foreground">
								<th class="px-4 py-2 text-left sm:text-left">Loot</th>
								<th class="hidden py-2 pr-4 text-right sm:table-cell md:text-left">Description</th>
								<th class="hidden py-2 pr-4 text-right md:table-cell">Modifiers</th>
							</tr>
						</thead>
						<tbody>
							{#each filteredLoot as loot (loot.id)}
								<LootCard
									{loot}
									quantity={loot.quantity}
									onclick={() => onItemClick('loot', loot)}
								/>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<!-- Adventuring Gear -->
			{#if filteredAdventuringGear.length > 0}
				<div class="flex flex-col gap-1">
					<p class="border-b bg-card px-4 py-2 text-xs font-medium text-muted-foreground">
						Adventuring Gear
					</p>

					<button
						class="flex w-full items-center text-left text-xs px-4 py-2"
						onclick={() => onItemClick('adventuring_gear', null)}
					>
						<ul class="w-full">
							{#each filteredAdventuringGear as { gear, originalIndex } (originalIndex)}
								<li class="flex items-center">
									<span class="mr-3">•</span>
									{gear.title}
									{#if gear.quantity > 1}
										<span class="ml-1 text-xs text-muted-foreground italic">×{gear.quantity}</span>
									{/if}
								</li>
							{/each}
						</ul>
					</button>
				</div>
			{/if}

			{#if searchQuery.trim() && filteredWeapons.length === 0 && filteredArmor.length === 0 && filteredConsumables.length === 0 && filteredLoot.length === 0 && filteredAdventuringGear.length === 0}
				<p class="py-4 text-center text-sm text-muted-foreground">No results</p>
			{/if}
		{/if}

		<Button variant="outline" onclick={onAddItems}>Add Items</Button>
	</div>
{/if}
