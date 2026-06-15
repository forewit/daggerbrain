<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Tabs from '$lib/components/ui/tabs';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getLocalstorageContext } from '$lib/state/localstorage.svelte';
	import ClassFeatures from './tabs/class-features/class-features.svelte';
	import Inventory from './tabs/inventory.svelte';
	import ActiveEquipment from './tabs/active-equipment.svelte';
	import Background from './tabs/background.svelte';
	import Notes from './tabs/notes.svelte';
	import Beastforms from './tabs/beastforms.svelte';
	import Companion from './tabs/companion.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	let {
		class: className = '',
		hideSides = false,
		onItemClick = () => {},
		onAdventuringGearClick = () => {},
		onExperienceClick = () => {},
		onAddItems = () => {},
		onBeastformCatalogClick = () => {}
	}: {
		class?: string;
		hideSides?: boolean;
		onItemClick?: (
			options:
				| {
						type: 'primary_weapon' | 'secondary_weapon' | 'armor' | 'consumable' | 'loot';
						inventory_id: string;
				  }
				| {
						type: 'unarmed_attack' | 'unarmored';
				  }
		) => void;
		onAdventuringGearClick?: () => void;
		onExperienceClick?: () => void;
		onAddItems?: () => void;
		onBeastformCatalogClick?: () => void;
	} = $props();

	const characterCtx = getCharacterContext();
	const localstorageCtx = getLocalstorageContext();
	const derived_character_data = $derived(characterCtx.derived_character_data);

	type TabValue =
		| 'weapons'
		| 'features'
		| 'inventory'
		| 'background'
		| 'notes'
		| 'beastform'
		| 'companion';
	const fallbackTab: TabValue = 'weapons';
	let tab = $state<TabValue>(
		characterCtx.id
			? (localstorageCtx.app_preferences.character_feature_tab[characterCtx.id] ?? fallbackTab)
			: fallbackTab
	);

	const availableTabs = $derived.by<TabValue[]>(() => [
		'weapons',
		'features',
		...(derived_character_data?.hasBeastformClassFeature ? ['beastform' as const] : []),
		...(derived_character_data?.hasCompanionSubclassFeature ? ['companion' as const] : []),
		'inventory',
		'background',
		'notes'
	]);

	function handleBeastformClick() {
		setTab('beastform');
	}

	$effect(() => {
		if (!characterCtx.id) return;

		const nextTab = availableTabs.includes(tab) ? tab : fallbackTab;
		if (nextTab !== tab) {
			tab = nextTab;
			return;
		}

		localstorageCtx.app_preferences.character_feature_tab[characterCtx.id] = nextTab;
	});

	function setTab(nextTab: string) {
		const nextValue = nextTab as TabValue;

		if (!availableTabs.includes(nextValue) || nextValue === tab) return;
		tab = nextValue;
	}
</script>

<Tabs.Root value={tab} onValueChange={setTab} class="h-full">
	<div class={cn('relative z-11 grid h-full grid-rows-[auto_1fr]')}>
		<Tabs.List class="-mt-2 flex h-auto w-full flex-wrap gap-y-1 rounded-none p-2">
			<Tabs.Trigger value="weapons" class="h-auto flex-initial">Weapons & Armor</Tabs.Trigger>
			<Tabs.Trigger value="features" class="h-auto flex-initial">Class Features</Tabs.Trigger>
			{#if derived_character_data?.hasBeastformClassFeature}
				<Tabs.Trigger value="beastform" class="h-auto flex-initial">Beastform</Tabs.Trigger>
			{/if}
			{#if derived_character_data?.hasCompanionSubclassFeature}
				<Tabs.Trigger value="companion" class="h-auto flex-initial">Companion</Tabs.Trigger>
			{/if}
			<Tabs.Trigger value="inventory" class="h-auto flex-initial">Inventory</Tabs.Trigger>
			<Tabs.Trigger value="background" class="h-auto flex-initial">Background</Tabs.Trigger>
			<Tabs.Trigger value="notes" class="h-auto flex-initial">Notes</Tabs.Trigger>
		</Tabs.List>

		<div class="overflow-hidden">
			<div class="h-full overflow-y-auto">
				<div class="pt-2">
					<Tabs.Content value="weapons">
						<ActiveEquipment {onItemClick} onBeastformClick={handleBeastformClick} />
					</Tabs.Content>
					<Tabs.Content value="features" class="px-4">
						<ClassFeatures />
					</Tabs.Content>
					{#if derived_character_data?.hasBeastformClassFeature}
						<Tabs.Content value="beastform" class="px-4">
							<Beastforms {onBeastformCatalogClick} />
						</Tabs.Content>
					{/if}
					{#if derived_character_data?.hasCompanionSubclassFeature}
						<Tabs.Content value="companion" class="px-4">
							<Companion />
						</Tabs.Content>
					{/if}
					<Tabs.Content value="inventory">
						<Inventory {onItemClick} {onAdventuringGearClick} {onAddItems} />
					</Tabs.Content>
					<Tabs.Content value="background" class="px-4">
						<Background />
					</Tabs.Content>
					<Tabs.Content value="notes" class="px-4">
						<Notes />
					</Tabs.Content>
				</div>
			</div>
		</div>
	</div>
</Tabs.Root>
