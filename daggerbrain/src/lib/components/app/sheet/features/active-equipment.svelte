<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import WeaponCard from './equipment/weapon-row.svelte';
	import ArmorCard from './equipment/armor-row.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let {
		class: className = '',
		gotoInventory = () => {}
	}: { class?: string; gotoInventory?: () => void } = $props();

	const context = getCharacterContext();
</script>

<div class={cn(className)}>
	<!-- Armor Slot -->
	<table class="w-full border-collapse">
		<colgroup>
			<col />
			<col class="w-12" />
			<col class="w-29" />
			<col class="hidden w-20 sm:table-column" />
		</colgroup>
		<thead>
			<tr class="border-b bg-card text-xs text-muted-foreground">
				<th class="px-4 py-2 text-left">Armor</th>
				<th class="py-2 pr-4 text-center">Slots</th>
				<th class="py-2 pr-4 text-right sm:text-center">Base Thresholds</th>
				<th class="hidden py-2 pr-4 text-right sm:table-cell">Features</th>
			</tr>
		</thead>
		<tbody>
			{#if context.derived_armor !== null}
				<ArmorCard armor={context.derived_armor} />
			{/if}
		</tbody>
	</table>

	<!-- Active Weapons -->
	<div class="grow pt-4">
		<table class="w-full border-collapse">
			<colgroup>
				<col />
				<col class="w-16" />
				<col class="w-18" />
				<col class="w-18" />
				<col class="hidden w-20 sm:table-column" />
			</colgroup>
			<thead>
				<tr class="border-b bg-card text-xs text-muted-foreground">
					<th class="px-4 py-2 text-left">Weapons</th>
					<th class="py-2 pr-4 text-center">Range</th>
					<th class="py-2 pr-4 text-center">Hit</th>
					<th class="py-2 pr-4 text-right sm:text-center">Damage</th>
					<th class="hidden py-2 pr-4 text-right sm:table-cell">Features</th>
				</tr>
			</thead>
			<tbody>
				{#if context.derived_primary_weapon !== null}
					<WeaponCard weapon={context.derived_primary_weapon} />
				{/if}
				{#if context.derived_secondary_weapon !== null}
					<WeaponCard weapon={context.derived_secondary_weapon} />
				{/if}
				{#if context.derived_unarmed_attack !== null}
					<WeaponCard weapon={context.derived_unarmed_attack} />
				{/if}
			</tbody>
		</table>
	</div>
</div>
