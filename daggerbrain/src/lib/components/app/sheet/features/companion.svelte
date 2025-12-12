<script lang="ts">
	import Companion from '$lib/components/app/cards/full-cards/companion.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';

	const context = getCharacterContext();
	let character = $derived(context.character);

	const compendium = getCompendiumContext();
	let beastbound_subclass_id = $derived(compendium.subclasses.ranger_beastbound.compendium_id);
</script>

{#if character && (character.primary_subclass_id === beastbound_subclass_id || character.secondary_subclass_id === beastbound_subclass_id)}
	<div class="flex flex-col items-center gap-2">
		<Companion/>
	</div>
{/if}




