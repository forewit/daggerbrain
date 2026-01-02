<script lang="ts">
	import CharacterSheet from '$lib/components/app/sheet/character-sheet.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const context = getCharacterContext();
	let character = $derived(context.character);
</script>

{#if character}
	{#if Object.values(character.selected_traits).includes(null) || !character.primary_class_id}
		<div class="flex flex-col items-center justify-center gap-4 px-4 py-12">
			<p class="text-sm text-muted-foreground italic">Character is incomplete</p>
		</div>
	{:else}
		<CharacterSheet class="mb-24" />
	{/if}
{:else}
	<div class="flex flex-col items-center justify-center gap-4 px-4 py-12">
		<p class="text-sm text-muted-foreground italic">Character not found</p>
	</div>
{/if}

