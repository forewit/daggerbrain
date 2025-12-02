<script lang="ts">
	import { cn } from '$lib/utils';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';

	const context = getCharacterContext();
	let character = $derived(context.character);
</script>

{#if character}
	<p class="pb-2 text-sm font-medium">Character Notes</p>
	<Textarea bind:value={character.notes} class="min-h-48 resize-y" />
{/if}
