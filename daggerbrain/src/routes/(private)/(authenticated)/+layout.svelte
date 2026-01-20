<script lang="ts">
	import { setUserContext } from '$lib/state/user.svelte';
	import { setCompendiumContext } from '$lib/state/compendium.svelte';
	import { setHomebrewContext } from '$lib/state/homebrew.svelte';
	import { onDestroy } from 'svelte';

	let { children } = $props();

	const userCtx = setUserContext();
	const homebrewCtx = setHomebrewContext();
	const compendiumCtx = setCompendiumContext();

	onDestroy(() => {
		userCtx.destroy();
		homebrewCtx.destroy();
		compendiumCtx.destroy();
	});
</script>

{@render children()}
