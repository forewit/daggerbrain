<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import type { Weapon, Armor, Consumable, AdventuringGear } from '$lib/types/compendium-types';
	import WeaponDetails from './weapon-details.svelte';
	import ArmorDetails from './armor-details.svelte';
	import ConsumableDetails from './consumable-details.svelte';
	import Dropdown from '../leveling/dropdown.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { cn } from '$lib/utils';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';
	import Search from '@lucide/svelte/icons/search';

	const context = getCharacterContext();
	const compendium = getCompendiumContext();
	let character = $derived(context.character);
	let searchQuery = $state('');

	// Helper function to check if item matches search
	function matchesSearch(
		item: Weapon | Armor | Consumable | AdventuringGear,
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
		character.inventory.adventuring_gear.length > 0}
	<div class="flex flex-col gap-4">
		{#if !hasItems}
			<p class="py-4 text-center text-sm text-muted-foreground">Your inventory is empty</p>
		{:else}
			<!-- Search Box -->
			<div class="relative mb-2">
				<Search
					class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
				/>
				<Input bind:value={searchQuery} placeholder="Search inventory..." class="pl-9" />
			</div>

			{#if filteredWeapons.length > 0}
				<div class="flex flex-col gap-1">
					<p class="ml-2 font-medium">Weapons</p>

					{#each filteredWeapons as weapon (weapon.id)}
						{#snippet subtitle_snippet()}
							{@const weaponType = getWeaponType(weapon)}
							{@const equipped = context.isItemEquipped(weapon, weaponType)}
							<div class="flex items-center gap-2">
								{#if equipped}
									<span class="text-xs text-muted-foreground italic">Equipped</span>
								{:else}
									{@const canEquipItem = context.canEquipItem(weapon)}
									<Button
										size="sm"
										onclick={(e) => {
											e.stopPropagation();
											if (canEquipItem) context.equipItem(weapon, weaponType);
										}}
										title={canEquipItem ? undefined : 'Level requirement not met'}
										class={cn(!canEquipItem && 'cursor-not-allowed opacity-50 hover:bg-primary')}
									>
										Equip
									</Button>
								{/if}
							</div>
						{/snippet}

						{#snippet title_snippet()}
							{@const inventory =
								weapon.category === 'Primary'
									? character.inventory.primary_weapons
									: character.inventory.secondary_weapons}
							{@const quantity = inventory[weapon.id]?.quantity ?? 0}
							<div class="gap-4 text-left">
								<p class="text-md font-medium">
									{weapon.title}
									{#if quantity > 1}
										<span class="ml-1 text-sm text-muted-foreground italic">x{quantity}</span>
									{/if}
								</p>
								<p class="truncate text-[10px] leading-none text-muted-foreground italic">
									Tier {context.get_tier_from_level(weapon.level_requirement)}
									{weapon.category} Weapon
								</p>
							</div>
						{/snippet}

						<Dropdown {title_snippet} {subtitle_snippet} class="border-2">
							<WeaponDetails {weapon} />
							{@const weaponType = getWeaponType(weapon)}
							<div class="mt-1 -mb-2 flex justify-center sm:justify-end">
								{#if context.isItemEquipped(weapon, weaponType)}
									<Button
										variant="outline"
										size="sm"
										onclick={() => context.unequipItem(weapon, weaponType)}
									>
										Unequip
									</Button>
								{/if}
								<Button
									variant="link"
									class="text-destructive"
									onclick={() => context.removeFromInventory(weapon, weaponType)}
								>
									Remove
								</Button>
							</div>
						</Dropdown>
					{/each}
				</div>
			{/if}

			{#if filteredArmor.length > 0}
				<div class="flex flex-col gap-1">
					<p class="ml-2 font-medium">Armor</p>

					{#each filteredArmor as armor (armor.id)}
						{#snippet subtitle_snippet()}
							{@const equipped = context.isItemEquipped(armor, 'armor')}
							<div class="flex items-center gap-2">
								{#if equipped}
									<span class="text-xs text-muted-foreground italic">Equipped</span>
								{:else}
									{@const canEquipItem = context.canEquipItem(armor)}
									<Button
										size="sm"
										onclick={(e) => {
											e.stopPropagation();
											if (canEquipItem) context.equipItem(armor, 'armor');
										}}
										disabled={!canEquipItem}
										title={canEquipItem ? undefined : 'Level requirement not met'}
									>
										Equip
									</Button>
								{/if}
							</div>
						{/snippet}

						{#snippet title_snippet()}
							{@const quantity = character.inventory.armor[armor.id]?.quantity ?? 0}
							<div class="gap-4 text-left">
								<p class="text-md font-medium">
									{armor.title}
									{#if quantity > 1}
										<span class="ml-1 text-sm text-muted-foreground italic">x{quantity}</span>
									{/if}
								</p>
								<p class="truncate text-[10px] leading-none text-muted-foreground italic">
									Tier {context.get_tier_from_level(armor.level_requirement)} Armor
								</p>
							</div>
						{/snippet}

						<Dropdown {title_snippet} {subtitle_snippet} class="border-2">
							<ArmorDetails {armor} />
							<div class="mt-1 -mb-2 flex justify-center sm:justify-end">
								{#if context.isItemEquipped(armor, 'armor')}
									<Button
										variant="outline"
										size="sm"
										onclick={() => context.unequipItem(armor, 'armor')}
									>
										Unequip
									</Button>
								{/if}
								<Button
									variant="link"
									class="text-destructive"
									onclick={() => context.removeFromInventory(armor, 'armor')}
								>
									Remove
								</Button>
							</div>
						</Dropdown>
					{/each}
				</div>
			{/if}

			{#if filteredConsumables.length > 0}
				<div class="flex flex-col gap-1">
					<p class="ml-2 font-medium">Consumables</p>

					{#each filteredConsumables as consumable (consumable.id)}
						{#snippet title_snippet()}
							{@const quantity = character.inventory.consumables[consumable.id]?.quantity ?? 0}
							<div class="gap-4 text-left">
								<p class="text-md font-medium">
									{consumable.title}
									{#if quantity > 1}
										<span class="ml-1 text-sm text-muted-foreground italic">x{quantity}</span>
									{/if}
								</p>
							</div>
						{/snippet}

						<Dropdown {title_snippet} class="border-2">
							<ConsumableDetails {consumable} />
							<div class="mt-1 -mb-2 flex justify-center sm:justify-end">
								<Button
									variant="link"
									class="text-destructive"
									onclick={() => context.removeFromInventory(consumable, 'consumable')}
								>
									Remove
								</Button>
							</div>
						</Dropdown>
					{/each}
				</div>
			{/if}

			{#if filteredAdventuringGear.length > 0}
				<div class="flex flex-col gap-1">
					<p class="ml-2 font-medium">Adventuring Gear</p>

					<ul class="">
						{#each filteredAdventuringGear as { gear, originalIndex } (originalIndex)}
							<li class="flex items-center text-sm text-muted-foreground">
								<span class="mr-3 ml-4">•</span>
								{gear.title}
								<Button
									variant="link"
									class="ml-auto h-auto text-foreground"
									onclick={() =>
										context.removeFromInventory(
											{ id: gear.title },
											'adventuring_gear',
											originalIndex
										)}
								>
									<CircleMinus class="size-4" />
								</Button>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if searchQuery.trim() && filteredWeapons.length === 0 && filteredArmor.length === 0 && filteredConsumables.length === 0 && filteredAdventuringGear.length === 0}
				<p class="py-4 text-center text-sm text-muted-foreground">No results</p>
			{/if}
		{/if}
	</div>
{/if}
