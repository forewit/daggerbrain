<script lang="ts">
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';

	const context = getCharacterContext();
	let character = $derived(context.character);

	const compendium = getCompendiumContext();
	let guardian_class_id = $derived(compendium.classes.guardian.compendium_id);

</script>

{#if character && (character.primary_class_id === guardian_class_id || character.secondary_class_id === guardian_class_id)}
	<div class="-mb-2 flex flex-col items-center gap-2 border-y py-2">

	</div>
{/if}
