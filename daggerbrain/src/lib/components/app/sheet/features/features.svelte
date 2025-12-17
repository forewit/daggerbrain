<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Tabs from '$lib/components/ui/tabs';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import ClassFeatures from './class-features/class-features.svelte';
	import Inventory from './inventory.svelte';
	import ActiveEquipment from './active-equipment.svelte';
	import Background from './background.svelte';
	import Notes from './notes.svelte';
	import Experiences from './experiences.svelte';
	import Beastforms from './beastforms.svelte';
	import Companion from './companion.svelte';
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

	const context = getCharacterContext();
	const compendium = getCompendiumContext();
	const character = $derived(context.character);
	const druid_class_id = $derived(compendium.classes.druid.compendium_id);
	const beastbound_subclass_id = $derived(compendium.subclasses.ranger_beastbound.compendium_id);

	const hasDruid = $derived(
		character &&
			(character.primary_class_id === druid_class_id ||
				character.secondary_class_id === druid_class_id)
	);
	const hasBeastbound = $derived(
		character &&
			(character.primary_subclass_id === beastbound_subclass_id ||
				character.secondary_subclass_id === beastbound_subclass_id)
	);

	type TabValue =
		| 'weapons'
		| 'features'
		| 'experiences'
		| 'inventory'
		| 'background'
		| 'notes'
		| 'beastform'
		| 'companion';
	let tab = $state<TabValue>('weapons');
</script>

<div class={cn('relative overflow-hidden rounded-xl border-3 py-4', className)}>
	<Tabs.Root bind:value={tab}>
		<Tabs.List class="mx-auto -mt-2 mb-1 flex h-auto flex-wrap gap-y-1 px-2">
			<Tabs.Trigger value="weapons" class="flex-initial">Weapons & Armor</Tabs.Trigger>
			<Tabs.Trigger value="features" class="flex-initial">Class Features</Tabs.Trigger>
			{#if hasDruid}
				<Tabs.Trigger value="beastform" class="flex-initial">Beastform</Tabs.Trigger>
			{/if}
			{#if hasBeastbound}
				<Tabs.Trigger value="companion" class="flex-initial">Companion</Tabs.Trigger>
			{/if}
			<Tabs.Trigger value="experiences" class="flex-initial">Experiences</Tabs.Trigger>
			<Tabs.Trigger value="inventory" class="flex-initial">Inventory</Tabs.Trigger>
			<Tabs.Trigger value="background" class="flex-initial">Background</Tabs.Trigger>
			<Tabs.Trigger value="notes" class="flex-initial">Notes</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="weapons">
			<ActiveEquipment {onItemClick} />
		</Tabs.Content>
		<Tabs.Content value="features" class="px-4">
			<ClassFeatures />
		</Tabs.Content>
		{#if hasDruid}
			<Tabs.Content value="beastform" class="px-4">
				<Beastforms {onBeastformCatalogClick} />
			</Tabs.Content>
		{/if}
		{#if hasBeastbound}
			<Tabs.Content value="companion" class="px-4">
				<Companion />
			</Tabs.Content>
		{/if}
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
