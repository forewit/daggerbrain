<script lang="ts">
	import { cn } from '$lib/utils';
	import Dropdown from '$lib/components/utility/dropdown.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import EquipmentCatalog from '$lib/components/catalogs/equipment-catalog.svelte';
	import Inventory from '$lib/components/character-editor/equipment/inventory.svelte';
	import ActiveEquipment from '$lib/components/character-editor/equipment/active-equipment.svelte';
	import Gold from '$lib/components/character-sheet/standalone/gold.svelte';
	import ClassStartingEqiupment from '$lib/components/character-editor/equipment/starting-equipment.svelte';

	let { data } = $props();

	const characterCtx = getCharacterContext();
	const character = $derived(characterCtx.character);
	const derived_character_data = $derived(characterCtx.derived_character_data);
</script>

{#if character && derived_character_data}
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
							isCoinMode={!!character?.settings.use_gold_coins}
							canEdit={characterCtx.canEdit}
							class="justify-center px-2 pb-4"
						/>
						<Inventory />
					</div>
				</div>
			</Dropdown>

			<Dropdown title="Add Items">
				<EquipmentCatalog
					onSelect={characterCtx.addToInventory}
					compendium={characterCtx.character_compendium}
					available_source_keys={characterCtx.available_source_keys}
					sources={characterCtx.sources}
					disable_consumables={derived_character_data.consumable_count >=
						derived_character_data.max_consumables}
				/>
			</Dropdown>
		</div>
	</div>
{/if}
