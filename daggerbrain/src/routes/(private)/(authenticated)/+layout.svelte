<script lang="ts">
	import { setUserContext } from '$lib/state/user.svelte';
	import { setCompendiumContext } from '$lib/state/compendium.svelte';
	import { setHomebrewContext } from '$lib/state/homebrew.svelte';

	let { children } = $props();

	setUserContext();
	setHomebrewContext();
	setCompendiumContext();
</script>

{@render children()}
