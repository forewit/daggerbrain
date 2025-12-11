<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';

	const context = getCharacterContext();
	let character = $derived(context.character);

	const compendium = getCompendiumContext();
	let wizard_class_id = $derived(compendium.classes.wizard.compendium_id);

	let strange_pattern_value = $derived(
		character
			? parseInt(character.class_choices[wizard_class_id]?.['strange_pattern']?.[0] || '1')
			: 1
	);
</script>

{#if character && (character.primary_class_id === wizard_class_id || character.secondary_class_id === wizard_class_id)}
	<div class="-mb-2 flex items-center justify-center gap-2 border-y py-2">
		<p class="text-xs font-medium text-muted-foreground">Strange Patterns</p>

		<Input
			type="number"
			min="1"
			max="12"
			inputmode="numeric"
			value={strange_pattern_value}
			oninput={(e) => {
				const numValue = parseInt((e.target as HTMLInputElement).value);
				if (!isNaN(numValue) && numValue >= 1 && numValue <= 12) {
					if (!character.class_choices[wizard_class_id])
						character.class_choices[wizard_class_id] = {};
					character.class_choices[wizard_class_id]['strange_pattern'] = [numValue.toString()];
				}
			}}
			class=" w-16"
		/>
	</div>
{/if}
