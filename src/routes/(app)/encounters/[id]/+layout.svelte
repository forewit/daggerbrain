<script lang="ts">
	import { page } from '$app/state';
	import type { Id } from '@convex/_generated/dataModel';
	import LoadError from '$lib/components/utility/load-error.svelte';
	import Loader from '$lib/components/utility/loader.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { setDiceContext } from '$lib/state/dice.svelte';
	import { getEncounterContext, setEncounterContext } from '$lib/state/encounters.svelte';
	import { getUserContext } from '$lib/state/user.svelte';

	let { children } = $props();

	const diceCtx = setDiceContext();
	setEncounterContext();
	const encounterCtx = getEncounterContext();
	const userCtx = getUserContext();
	const loadError = $derived(encounterCtx.error ?? userCtx.error);

	$effect(() => {
		const encounterId = page.params.id ?? null;
		encounterCtx.id = encounterId as Id<'encounters'>;
	});

	$effect(() => {
		if (loadError) {
			console.error('Error loading encounter page', loadError);
		}
	});

	onMount(() => {
		diceCtx.init();
	});

	onDestroy(() => {
		diceCtx.destroy();
	});

	const isLoading = $derived(encounterCtx.isLoading || userCtx.isLoading);
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<Loader {isLoading} />

	{#if isLoading}
		<div></div>
	{:else if loadError || !encounterCtx.encounter}
		<LoadError />
	{:else}
		{@render children?.()}
	{/if}
</div>
