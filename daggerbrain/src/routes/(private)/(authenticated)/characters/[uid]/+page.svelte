<script lang="ts">
	import CharacterSheet from '$lib/components/app/sheet/character-sheet.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';

	const context = getCharacterContext();
	let character = $derived(context?.character);

</script>


{#if character}
	{#if Object.values(character.selected_traits).includes(null) || !character.primary_class_id}
		<div class="flex flex-col items-center justify-center gap-4 px-4 py-12">
			{#if !character.primary_class_id}
				<p class="text-sm text-muted-foreground italic">This character is missing a class.</p>
				{#if context.canEdit}
					<Button href={`${character.id}/class/`}>Edit Character</Button>
				{/if}
			{:else}
				<p class="text-sm text-muted-foreground italic">This character is missing traits.</p>
				{#if context.canEdit}
					<Button href={`${character.id}/traits/`}>Edit Character</Button>
				{/if}
			{/if}
		</div>
	{:else}
		<CharacterSheet class="mb-24" />
	{/if}
{/if}
