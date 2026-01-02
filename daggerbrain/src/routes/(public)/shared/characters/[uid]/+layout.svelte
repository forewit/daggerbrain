<script lang="ts">
	import { setCharacterContext } from '$lib/state/character.svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();

	// For public characters, we need to set up a character context
	// However, the current createCharacter expects the character to be in user.all_characters
	// For now, we'll set up the context with the character ID
	// The character will be loaded from the page data
	const context = setCharacterContext(data.uid);
</script>

{@render children?.()}

