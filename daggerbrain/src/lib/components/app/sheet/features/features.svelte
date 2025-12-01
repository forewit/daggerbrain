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

	const context = getCharacterContext();
</script>

<div class={cn('relative rounded-md border-2 p-4', className)}>
	<Tabs.Root value="features">
		<Tabs.List class="mx-auto -mt-3 flex flex-wrap h-auto gap-y-1">
			<Tabs.Trigger value="weapons" class="text-xs">Active Weapons & Armor</Tabs.Trigger>
			<Tabs.Trigger value="features">Class Features</Tabs.Trigger>
			<Tabs.Trigger value="inventory">Inventory</Tabs.Trigger>
			<Tabs.Trigger value="background">Background</Tabs.Trigger>
			<Tabs.Trigger value="notes">Notes</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="features">
			<ClassFeatures />
		</Tabs.Content>
		<Tabs.Content value="weapons">
			<ActiveEquipment />
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
