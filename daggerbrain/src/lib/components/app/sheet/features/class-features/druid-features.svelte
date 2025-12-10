<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import Label from '$lib/components/ui/label/label.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';

	const context = getCharacterContext();
	let character = $derived(context.character);

	const compendium = getCompendiumContext();
	let druid_class_id = $derived(compendium.classes.druid.compendium_id);
</script>

{#if character && (character.primary_class_id === druid_class_id || character.secondary_class_id === druid_class_id)}
	<div class="-mb-2 flex items-center gap-2 border-y py-2">
		<!-- todo: sheet to view beastforms -->
	</div>
{/if}
