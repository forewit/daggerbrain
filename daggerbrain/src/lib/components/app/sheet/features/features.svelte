<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Tabs from '$lib/components/ui/tabs';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import ClassFeatures from './class-features.svelte';

	let { class: className = '' }: { class?: string } = $props();

	const context = getCharacterContext();
</script>

<div class={cn('relative rounded-md border-2 p-4', className)}>
	<Tabs.Root value="features">
		<Tabs.List class="-mt-3 mx-auto">
			<Tabs.Trigger value="attacks" class="text-xs">Active Weapons & Armor</Tabs.Trigger>
			<Tabs.Trigger value="features">Class Features</Tabs.Trigger>

			<Tabs.Trigger value="inventory">Inventory</Tabs.Trigger>
			<Tabs.Trigger value="description">Background</Tabs.Trigger>
			<Tabs.Trigger value="notes">Notes</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="features">
			<ClassFeatures />
		</Tabs.Content>
		<Tabs.Content value="actions"></Tabs.Content>
		<Tabs.Content value="inventory"></Tabs.Content>
		<Tabs.Content value="description"></Tabs.Content>
		<Tabs.Content value="notes"></Tabs.Content>
	</Tabs.Root>
</div>
