<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Tabs from '$lib/components/ui/tabs';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import ClassFeatures from './class-features/class-features.svelte';
	import Inventory from './inventory.svelte';
	import ActiveEquipment from './active-equipment.svelte';
	import Background from './background.svelte';
	import Notes from './notes.svelte';
	import Experiences from './experiences.svelte';
	let {
		class: className = '',
		onItemClick = () => {},
		onAdventuringGearClick = () => {},
		onExperienceClick = () => {},
		onAddItems = () => {},
		onBeastformCatalogClick = () => {}
	}: {
		class?: string;
		onItemClick?: (type: 'weapon' | 'armor' | 'consumable' | 'loot', id: string) => void;
		onAdventuringGearClick?: () => void;
		onExperienceClick?: () => void;
		onAddItems?: () => void;
		onBeastformCatalogClick?: () => void;
	} = $props();

	let tab = $state<'weapons' | 'features' | 'experiences' | 'inventory' | 'background' | 'notes'>(
		'weapons'
	);

	const context = getCharacterContext();
</script>

<div class={cn('relative overflow-hidden rounded-xl border-3 py-4', className)}>
	<Tabs.Root bind:value={tab}>
		<Tabs.List class="mx-auto -mt-2 mb-1 flex h-auto flex-wrap gap-y-1 px-2">
			<Tabs.Trigger value="weapons" class="flex-initial">Active Weapons & Armor</Tabs.Trigger>
			<Tabs.Trigger value="features" class="flex-initial">Class Features</Tabs.Trigger>
			<Tabs.Trigger value="experiences" class="flex-initial">Experiences</Tabs.Trigger>
			<Tabs.Trigger value="inventory" class="flex-initial">Inventory</Tabs.Trigger>
			<Tabs.Trigger value="background" class="flex-initial">Background</Tabs.Trigger>
			<Tabs.Trigger value="notes" class="flex-initial">Notes</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="weapons">
			<ActiveEquipment {onItemClick} />
		</Tabs.Content>
		<Tabs.Content value="features" class="px-4">
			<ClassFeatures {onBeastformCatalogClick} />
		</Tabs.Content>
		<Tabs.Content value="experiences">
			<Experiences {onExperienceClick} />
		</Tabs.Content>
		<Tabs.Content value="inventory">
			<Inventory {onItemClick} {onAdventuringGearClick} {onAddItems} />
		</Tabs.Content>
		<Tabs.Content value="background" class="px-4">
			<Background />
		</Tabs.Content>
		<Tabs.Content value="notes" class="px-4">
			<Notes />
		</Tabs.Content>
	</Tabs.Root>
</div>
