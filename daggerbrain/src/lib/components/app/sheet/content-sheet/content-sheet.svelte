<script lang="ts" module>
	export type SheetContent =
		| {
				type: 'weapon' | 'armor' | 'consumable' | 'loot';
				id: string;
		  }
		| {
				type:
					| 'adventuring_gear'
					| 'experience'
					| 'catalog'
					| 'domain-card-catalog'
					| 'heritage-card-catalog'
					| 'beastform-catalog'
					| 'conditions'
					| 'death-move'
					| 'downtime';
		  }
		| null;
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
	import DomainCardContent from './domain-card-content.svelte';
	import HeritageCardContent from './heritage-card-content.svelte';
	import BeastformContent from './beastform-content.svelte';
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
			<WeaponContent weaponId={content.id} />
		{:else if content?.type === 'armor'}
			<ArmorContent armorId={content.id} />
		{:else if content?.type === 'consumable'}
			<ConsumableContent consumableId={content.id} />
		{:else if content?.type === 'loot'}
			<LootContent lootId={content.id} />
		{:else if content?.type === 'adventuring_gear'}
			<AdventuringGearContent />
		{:else if content?.type === 'experience'}
			<ExperienceContent />
		{:else if content?.type === 'conditions'}
			<ConditionsContent />
		{:else if content?.type === 'catalog'}
			<CatalogContent />
		{:else if content?.type === 'domain-card-catalog'}
			<DomainCardContent />
		{:else if content?.type === 'heritage-card-catalog'}
			<HeritageCardContent />
		{:else if content?.type === 'beastform-catalog'}
			<BeastformContent />
		{:else if content?.type === 'death-move'}
			<DeathMoveContent />
		{:else if content?.type === 'downtime'}
			<DowntimeContent />
		{/if}
	</Sheet.Content>
</Sheet.Root>
