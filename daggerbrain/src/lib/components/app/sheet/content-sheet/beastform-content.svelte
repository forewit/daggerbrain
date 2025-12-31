<script lang="ts">
	import BeastformsCatalog from '../../cards/beastforms-catalog.svelte';
	import BeastformComponent from '../../cards/full-cards/beastform.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Beastform } from '$lib/types/compendium-types';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';

	const context = getCharacterContext();
	let character = $derived(context.character);
	let chosenBeastform = $derived(character?.chosen_beastform);
	let derivedBeastform = $derived(context.derived_beastform);

	function handleBeastformClick(beastform: Beastform) {
		if (!character) return;

		// Set the chosen beastform
		character.chosen_beastform = {
			apply_beastform_bonuses: false,
			compendium_id: beastform.compendium_id,
			choices: {},
			custom_title: null,
			custom_level_requirement: null
		};
	}

	function removeBeastform() {
		if (!character) return;
		character.chosen_beastform = null;
	}
</script>

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
			<BeastformComponent beastform={derivedBeastform} show_choices={true} />
			<Button variant="link" size="sm" class="text-destructive" onclick={removeBeastform}>
				Remove
			</Button>
		</div>
	{/if}

	<!-- Beastform Catalog -->
	<div class="flex flex-col gap-2">
		<h3 class="text-sm font-medium">Browse Beastforms</h3>
		<BeastformsCatalog onBeastformClick={handleBeastformClick} maxLevel={character?.level} />
	</div>
</div>
