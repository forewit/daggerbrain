<script lang="ts">
	import { setCharacterContext } from '$lib/state/character.svelte';
	import { setCampaignContext } from '$lib/state/campaigns.svelte';
	import { setDiceContext } from '$lib/state/dice.svelte';
	import { page } from '$app/state';
	import { onDestroy, onMount } from 'svelte';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { getUserContext } from '$lib/state/user.svelte';

	let { children } = $props();
	const uid = page.params.uid!;
	const characterCtx = setCharacterContext(uid);
	const campaignCtx = setCampaignContext(); // Initialize without ID
	const diceCtx = setDiceContext();

	const userCtx = getUserContext();

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

{#if characterCtx.loading || userCtx.loading}
	<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
		<div class="absolute inset-0 flex items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	</div>
{:else}
	{@render children?.()}
{/if}
