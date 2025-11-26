<script lang="ts">
	import Dice from '$lib/components/app/dice/dice.svelte';
	import Sheet from '$lib/components/app/sheet/sheet.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';

	const context = getCharacterContext();
	let character = $derived(context.character);
</script>

{#if character}
	{#if Object.values(character.selected_traits).includes(null) || !character.primary_class_id}
		<div class="flex flex-col items-center justify-center gap-4 px-4 py-12">
			<p class="text-sm text-muted-foreground italic">Ready to finish setting up your character?</p>
			<Button
				href={!character.primary_class_id ? `${character.id}/class/` : `${character.id}/traits/`}
				>Edit Character</Button
			>
		</div>
	{:else}
		<Sheet class="mb-24" />
		<!-- <Dice
    class="bottom-6 left-6 z-45"
    onRollEnd={(notation, total) => {
      console.log(notation, total);
    }}
  /> -->
	{/if}
{/if}
