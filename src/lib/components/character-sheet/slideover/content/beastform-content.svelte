<script lang="ts">
	import BeastformsCatalog from '$lib/components/catalogs/beastforms-catalog.svelte';
	import BeastformComponent from '$lib/components/compendium-items/beastform.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { level_to_tier } from '$lib/utils';

	const characterCtx = getCharacterContext();
	const character = $derived(characterCtx.character);
	const chosenBeastform = $derived(character?.chosen_beastform);
	const derivedBeastform = $derived(characterCtx.derived_character_data?.derived_beastform);

	function handleBeastformClick(id: string) {
		if (!character) return;

		// Set the chosen beastform
		character.chosen_beastform = {
			beastform_id: id,
			apply_beastform_bonuses: false,
			choices: {},
			custom_title: undefined,
			custom_level_requirement: undefined
		};
	}

	function removeBeastform() {
		if (!character) return;
		character.chosen_beastform = undefined;
	}
</script>

{#if characterCtx.canEdit}
	<Sheet.Header>
		<Sheet.Title>Choose a Beastform</Sheet.Title>
		<Sheet.Description class="text-xs italic"
			>Select a beastform for your character. Evolved Beast and Hybrid beastforms require additional
			choices.</Sheet.Description
		>
	</Sheet.Header>

	<div class="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
		<!-- Current Beastform -->
		{#if chosenBeastform && derivedBeastform}
			<div class="flex flex-col gap-2">
				<BeastformComponent
					beastform={derivedBeastform}
					bind:choices={chosenBeastform.choices}
					compendium={characterCtx.character_compendium}
					proficiency={characterCtx.derived_character_data?.proficiency}
				/>
				<Button variant="link" size="sm" class="text-destructive" onclick={removeBeastform}>
					Remove
				</Button>
			</div>
		{/if}

		<!-- Beastform Catalog -->
		<div class="flex flex-col gap-2">
			<h3 class="text-sm font-medium">Browse Beastforms</h3>
			<BeastformsCatalog
				initialTierFilter={character
					? (String(level_to_tier(character.level)) as '1' | '2' | '3' | '4')
					: undefined}
				available_source_keys={characterCtx.available_source_keys}
				compendium={characterCtx.character_compendium}
				onSelect={handleBeastformClick}
				maxLevel={character?.level}
			/>
		</div>
	</div>
{/if}
