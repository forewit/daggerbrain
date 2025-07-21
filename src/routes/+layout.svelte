<script lang="ts">
	import { setAppContext } from '$lib/state/app.svelte';
	import { onDestroy } from 'svelte';
	import '../app.css';

	let { children } = $props();

	const app = setAppContext();

	onDestroy(() => {
		app.destroy();
	});
</script>

{@render children()}
