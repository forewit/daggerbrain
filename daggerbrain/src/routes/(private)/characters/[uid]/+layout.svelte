<script lang="ts">
	import { setCharacterContext } from '$lib/state/character.svelte';

	let { children, data } = $props();

	const context = setCharacterContext(data.uid);
</script>

{@render children?.()}
