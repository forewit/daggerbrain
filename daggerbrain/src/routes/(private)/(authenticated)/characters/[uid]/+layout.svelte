<script lang="ts">
	import { setCharacterContext } from '$lib/state/character.svelte';
	import { setCampaignContext } from '$lib/state/campaigns.svelte';
	import { setDiceContext } from '$lib/state/dice.svelte';
	import { page } from '$app/state';
	import { onDestroy, onMount } from 'svelte';

	let { children } = $props();
	const uid = page.params.uid!;
	const characterCtx = setCharacterContext(uid);
	const campaignCtx = setCampaignContext(); // Initialize without ID
	const diceCtx = setDiceContext();

	// Update campaign ID when character loads
	$effect(() => {
		const char = characterCtx.character;
		campaignCtx.campaignId = char?.campaign_id ?? undefined;
	});

	onMount(() => {
		diceCtx.init();
	});

	onDestroy(() => {
		diceCtx.destroy();
		characterCtx.destroy();
		campaignCtx.destroy();
	});
</script>

{@render children?.()}
