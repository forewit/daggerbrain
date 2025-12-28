<script lang="ts">
	import Dice from '$lib/components/app/dice/dice.svelte';
	import CharacterSheet from '$lib/components/app/sheet/character-sheet.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import { page } from '$app/stores';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	const context = getCharacterContext();
	let character = $derived(context.character);
	const user = getUserContext();
	const characterId = $derived($page.params.uid);

	let characterNotFound = $derived.by(() => {
		if (user.loading) return false;
		return !user.all_characters.some((c) => c.id === characterId);
	});
</script>

{#if user.loading}
	<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
		<!-- Keep the page height so the footer doesn't jump while loading -->
		<div class="absolute inset-0 flex items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	</div>
{:else if characterNotFound}
	<div class="flex flex-col items-center justify-center gap-4 px-4 py-12">
		<p class="text-sm text-muted-foreground italic">Character not found</p>
		<Button href="/characters">Back to Characters</Button>
	</div>
{:else if character}
	{#if Object.values(character.selected_traits).includes(null) || !character.primary_class_id}
		<div class="flex flex-col items-center justify-center gap-4 px-4 py-12">
			{#if !character.primary_class_id}
				<p class="text-sm text-muted-foreground italic">Your character is missing a class.</p>
				<Button href={`${character.id}/class/`}>Edit Character</Button>
			{:else}
				<p class="text-sm text-muted-foreground italic">Your character is missing traits.</p>
				<Button href={`${character.id}/traits/`}>Edit Character</Button>
			{/if}
		</div>
	{:else}
		<CharacterSheet class="mb-24" />
		<!-- <Dice
    class="bottom-6 left-6 z-45"
    onRollEnd={(notation, total) => {
      console.log(notation, total);
    }}
  /> -->
	{/if}
{/if}
