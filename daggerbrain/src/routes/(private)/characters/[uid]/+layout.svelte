<script lang="ts">
	import { setCharacterContext } from '$lib/state/character.svelte';
	import { page } from '$app/state';

	let { children, data } = $props();
	const uid = page.params.uid!;
	const context = setCharacterContext(uid);
</script>

{@render children?.()}
