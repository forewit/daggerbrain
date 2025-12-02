<script lang="ts" module>
	import type { Weapon, Armor, Consumable, Loot } from '$lib/types/compendium-types';

	export type SheetContent =
		| { type: 'weapon'; data: Weapon }
		| { type: 'armor'; data: Armor }
		| { type: 'consumable'; data: Consumable }
		| { type: 'loot'; data: Loot }
		| { type: 'experience' }
		| { type: 'catalog' }
		| null;
</script>

<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import WeaponContent from './weapon-content.svelte';
	import ArmorContent from './armor-content.svelte';
	import ConsumableContent from './consumable-content.svelte';
	import LootContent from './loot-content.svelte';
	import ExperienceContent from './experience-content.svelte';
	import CatalogContent from './catalog-content.svelte';

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
		<Sheet.Header>
			<Sheet.Title>
				{#if content?.type === 'weapon'}
					{content.data.title}
				{:else if content?.type === 'armor'}
					{content.data.title}
				{:else if content?.type === 'consumable'}
					{content.data.title}
				{:else if content?.type === 'loot'}
					{content.data.title}
				{:else if content?.type === 'experience'}
					Experiences
				{:else if content?.type === 'catalog'}
					Add Items
				{/if}
			</Sheet.Title>
			<Sheet.Description>
				{#if content?.type === 'weapon'}
					{content.data.category} Weapon
				{:else if content?.type === 'armor'}
					Armor
				{:else if content?.type === 'consumable'}
					Consumable
				{:else if content?.type === 'loot'}
					Loot
				{:else if content?.type === 'experience'}
					Character Experiences
				{:else if content?.type === 'catalog'}
					Browse and add items to your inventory
				{/if}
			</Sheet.Description>
		</Sheet.Header>

		<div class="py-4">
			{#if content?.type === 'weapon'}
				<WeaponContent weapon={content.data} />
			{:else if content?.type === 'armor'}
				<ArmorContent armor={content.data} />
			{:else if content?.type === 'consumable'}
				<ConsumableContent consumable={content.data} />
			{:else if content?.type === 'loot'}
				<LootContent loot={content.data} />
			{:else if content?.type === 'experience'}
				<ExperienceContent />
			{:else if content?.type === 'catalog'}
				<CatalogContent />
			{/if}
		</div>
	</Sheet.Content>
</Sheet.Root>
