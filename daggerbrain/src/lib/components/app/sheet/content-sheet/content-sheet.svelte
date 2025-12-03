<script lang="ts" module>
	import type { Weapon, Armor, Consumable, Loot, AdventuringGear } from '$lib/types/compendium-types';

	export type SheetContent =
		| { type: 'weapon'; data: Weapon }
		| { type: 'armor'; data: Armor }
		| { type: 'consumable'; data: Consumable }
		| { type: 'loot'; data: Loot }
		| { type: 'adventuring_gear' }
		| { type: 'experience' }
		| { type: 'conditions' }
		| { type: 'catalog' }
		| { type: 'death-move' }
		| { type: 'downtime' }
		| null;

	export type ItemType = 'weapon' | 'armor' | 'consumable' | 'loot' | 'adventuring_gear';
	export type Item = Weapon | Armor | Consumable | Loot | AdventuringGear | null;
	export type ItemClickHandler = (type: ItemType, item: Item) => void;
</script>

<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import WeaponContent from './weapon-content.svelte';
	import ArmorContent from './armor-content.svelte';
	import ConsumableContent from './consumable-content.svelte';
	import LootContent from './loot-content.svelte';
	import AdventuringGearContent from './adventuring-gear-content.svelte';
	import ExperienceContent from './experience-content.svelte';
	import ConditionsContent from './conditions-content.svelte';
	import CatalogContent from './catalog-content.svelte';
	import DeathMoveContent from './death-move-content.svelte';
	import DowntimeContent from './downtime-content.svelte';

	let {
		open = $bindable(false),
		content = null
	}: {
		open?: boolean;
		content?: SheetContent;
	} = $props();
</script>

<Sheet.Root bind:open>
	<Sheet.Content>
		{#if content?.type === 'weapon'}
			<WeaponContent weapon={content.data} />
		{:else if content?.type === 'armor'}
			<ArmorContent armor={content.data} />
		{:else if content?.type === 'consumable'}
			<ConsumableContent consumable={content.data} />
		{:else if content?.type === 'loot'}
			<LootContent loot={content.data} />
		{:else if content?.type === 'adventuring_gear'}
			<AdventuringGearContent />
		{:else if content?.type === 'experience'}
			<ExperienceContent />
		{:else if content?.type === 'conditions'}
			<ConditionsContent />
		{:else if content?.type === 'catalog'}
			<CatalogContent />
		{:else if content?.type === 'death-move'}
			<DeathMoveContent />
		{:else if content?.type === 'downtime'}
			<DowntimeContent />
		{/if}
	</Sheet.Content>
</Sheet.Root>
