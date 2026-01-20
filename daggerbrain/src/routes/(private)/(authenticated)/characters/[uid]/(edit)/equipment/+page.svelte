<script lang="ts">
	import { cn } from '$lib/utils';
	import Dropdown from '$lib/components/app/leveling/dropdown.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import Catalog from '$lib/components/app/equipment/catalog.svelte';
	import Inventory from '$lib/components/app/equipment/inventory.svelte';
	import ActiveEquipment from '$lib/components/app/equipment/active-equipment.svelte';
	import Gold from '$lib/components/app/sheet/gold.svelte';
	import ClassStartingEqiupment from '$lib/components/app/equipment/starting-equipment.svelte';

	let { data } = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);
</script>

{#if character}
	<div
		class={cn(
			//"pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
			'mx-auto max-w-2xl'
		)}
	>
		<div class="m-4 flex flex-col gap-4">
			<Dropdown title="Starting Equipment">
				<ClassStartingEqiupment />
			</Dropdown>

			<Dropdown title="Inventory">
				<div class="flex flex-col gap-4">
					<ActiveEquipment />
					<div class="">
						<Gold
							bind:gold_coins={character.inventory.gold_coins}
							class="justify-center px-2 pb-4"
						/>
						<Inventory />
					</div>
				</div>
			</Dropdown>

			<Dropdown title="Add Items">
				<Catalog />
			</Dropdown>
		</div>
	</div>
{/if}
