<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Tabs from '$lib/components/ui/tabs';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import ClassFeatures from './class-features.svelte';
	import Inventory from './inventory.svelte';
	import ActiveEquipment from './active-equipment.svelte';
	import Background from './background.svelte';
	import Notes from './notes.svelte';
	import Experiences from './experiences.svelte';
	import type { Weapon, Armor, Consumable, Loot } from '$lib/types/compendium-types';

	let {
		class: className = '',
		onItemClick = (
			_type: 'weapon' | 'armor' | 'consumable' | 'loot',
			_item: Weapon | Armor | Consumable | Loot
		) => {},
		onExperienceClick = () => {},
		onAddItems = () => {}
	}: {
		class?: string;
		onItemClick?: (
			type: 'weapon' | 'armor' | 'consumable' | 'loot',
			item: Weapon | Armor | Consumable | Loot
		) => void;
		onExperienceClick?: () => void;
		onAddItems?: () => void;
	} = $props();

	let tab = $state<'weapons' | 'features' | 'experiences' | 'inventory' | 'background' | 'notes'>(
		'weapons'
	);

	const context = getCharacterContext();
</script>

<div class={cn('relative rounded-md border-2 p-4', className)}>
	<Tabs.Root bind:value={tab}>
		<Tabs.List class="mx-auto -mt-3 mb-1 flex h-auto flex-wrap gap-y-1">
			<Tabs.Trigger value="weapons" class="flex-initial">Active Weapons & Armor</Tabs.Trigger>
			<Tabs.Trigger value="features" class="flex-initial">Class Features</Tabs.Trigger>
			<Tabs.Trigger value="experiences" class="flex-initial">Experiences</Tabs.Trigger>
			<Tabs.Trigger value="inventory" class="flex-initial">Inventory</Tabs.Trigger>
			<Tabs.Trigger value="background" class="flex-initial">Background</Tabs.Trigger>
			<Tabs.Trigger value="notes" class="flex-initial">Notes</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="weapons">
			<ActiveEquipment gotoInventory={() => (tab = 'inventory')} {onItemClick} />
		</Tabs.Content>
		<Tabs.Content value="features">
			<ClassFeatures />
		</Tabs.Content>
		<Tabs.Content value="experiences">
			<Experiences {onExperienceClick} />
		</Tabs.Content>
		<Tabs.Content value="inventory">
			<Inventory {onItemClick} {onAddItems} />
		</Tabs.Content>
		<Tabs.Content value="background">
			<Background />
		</Tabs.Content>
		<Tabs.Content value="notes">
			<Notes />
		</Tabs.Content>
	</Tabs.Root>
</div>
