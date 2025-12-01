<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import WeaponCard from './equipment/weapon-card.svelte';
	import ArmorCard from './equipment/armor-card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let {
		class: className = '',
		gotoInventory = () => {}
	}: { class?: string; gotoInventory?: () => void } = $props();

	const context = getCharacterContext();
</script>

<div class={cn(className)}>
	<!-- Armor Slot -->
	{#if context.active_armor !== null}
		<table class="w-full border-collapse">
			<colgroup>
				<col />
				<col class="w-20" />
				<col class="w-26" />
				<col class="hidden w-22 sm:table-column" />
			</colgroup>
			<thead>
				<tr class="border-b text-xs text-muted-foreground bg-card">
					<th class="px-4 py-2 text-left">Armor</th>
					<th class="px-4 py-2 text-center">Slots</th>
					<th class="px-4 py-2 text-center">Thresholds</th>
					<th class="hidden px-4 py-2 text-right sm:table-cell">Features</th>
				</tr>
			</thead>
			<tbody>
				<ArmorCard armor={context.active_armor} />
			</tbody>
		</table>
	{:else}
		<p class="p-1 pt-3 text-xs text-muted-foreground">
			Unarmored
			<Button
				size="sm"
				variant="link"
				class="ml-2 h-auto font-normal italic"
				onclick={gotoInventory}>Open Inventory?</Button
			>
		</p>
	{/if}

	<!-- Active Weapons -->
	<div class="grow pt-4">
		{#if context.derived_primary_weapon !== null || context.derived_secondary_weapon !== null}
			<table class="w-full border-collapse">
				<colgroup>
					<col />
					<col class="w-16" />
					<col class="w-18" />
					<col class="w-18" />
					<col class="hidden w-22 sm:table-column" />
				</colgroup>
				<thead>
					<tr class="border-b text-xs text-muted-foreground bg-card">
						<th class="px-4 py-2 text-left">Weapons</th>
						<th class="px-4 py-2 text-center">Range</th>
						<th class="px-4 py-2 text-center">To Hit</th>
						<th class="px-4 py-2 text-center">Damage</th>
						<th class="hidden px-4 py-2 text-right sm:table-cell">Features</th>
					</tr>
				</thead>
				<tbody>
					{#if context.derived_primary_weapon !== null}
						<WeaponCard class="" weapon={context.derived_primary_weapon} weaponType="primary" bind_choices />
					{/if}
					{#if context.derived_secondary_weapon !== null}
						<WeaponCard class="" weapon={context.derived_secondary_weapon} weaponType="secondary" bind_choices />
					{/if}
				</tbody>
			</table>
		{:else}
			<p class="p-1 pt-3 text-xs text-muted-foreground">Unarmed</p>
		{/if}
	</div>
</div>
