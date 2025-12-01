<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Tabs from '$lib/components/ui/tabs';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import ClassFeatures from './class-features.svelte';
	import Inventory from './inventory.svelte';
	import ActiveEquipment from './active-equipment.svelte';
	import Background from './background.svelte';
	import Notes from './notes.svelte';

	let { class: className = '' }: { class?: string } = $props();

	let tab = $state<'features' | 'weapons' | 'inventory' | 'background' | 'notes'>('features');

	const context = getCharacterContext();
</script>

<div class={cn('relative rounded-md border-2 p-4', className)}>
	<Tabs.Root bind:value={tab}>
		<Tabs.List class="mx-auto -mt-3 -mb-1 flex h-auto flex-wrap gap-y-1">
			<Tabs.Trigger value="weapons">Active Weapons & Armor</Tabs.Trigger>
			<Tabs.Trigger value="features">Class Features</Tabs.Trigger>
			<Tabs.Trigger value="inventory">Inventory</Tabs.Trigger>
			<Tabs.Trigger value="background">Background</Tabs.Trigger>
			<Tabs.Trigger value="notes">Notes</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="features">
			<ClassFeatures />
		</Tabs.Content>
		<Tabs.Content value="weapons">
			<ActiveEquipment gotoInventory={() => (tab = 'inventory')} />
		</Tabs.Content>
		<Tabs.Content value="inventory">
			<Inventory />
		</Tabs.Content>
		<Tabs.Content value="background">
			<Background />
		</Tabs.Content>
		<Tabs.Content value="notes">
			<Notes />
		</Tabs.Content>
	</Tabs.Root>
</div>
