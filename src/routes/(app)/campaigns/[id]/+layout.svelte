<script lang="ts">
	import { page } from '$app/state';
	import type { Id } from '@convex/_generated/dataModel';
	import LoadError from '$lib/components/utility/load-error.svelte';
	import Loader from '$lib/components/utility/loader.svelte';
	import { getCampaignContext, setCampaignContext } from '$lib/state/campaign.svelte';
	import { setDiceContext } from '$lib/state/dice.svelte';
	import { setEncounterContext } from '$lib/state/encounters.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import { onDestroy, onMount } from 'svelte';

	let { children } = $props();

	setCampaignContext();
	setEncounterContext();
	const campaignCtx = getCampaignContext();
	const diceCtx = setDiceContext();
	const userCtx = getUserContext();
	const loadError = $derived(campaignCtx.error ?? userCtx.error);

	let unsubscribeRoll: (() => void) | undefined;
	let lastCampaignId = $state<string | undefined>();
	const pendingSyncedRollIds = new Set<string>();

	$effect(() => {
		const campaignId = page.params.id ?? undefined;
		campaignCtx.id = campaignId as Id<'campaigns'> | undefined;
	});

	$effect(() => {
		if (campaignCtx.id !== lastCampaignId) {
			lastCampaignId = campaignCtx.id;
			pendingSyncedRollIds.clear();
			diceCtx.history = [];
		}
	});

	$effect(() => {
		const remoteRolls = campaignCtx.diceHistory?.rolls ?? [];
		const merged = new Map<string, (typeof remoteRolls)[number]>();

		for (const roll of diceCtx.history) {
			merged.set(roll.id, roll);
		}

		for (const roll of remoteRolls) {
			const localRoll = merged.get(roll.id);
			if (localRoll?.status === 'rolling') continue;
			if (localRoll && pendingSyncedRollIds.has(roll.id)) {
				if (JSON.stringify(localRoll) === JSON.stringify(roll)) {
					pendingSyncedRollIds.delete(roll.id);
				} else {
					continue;
				}
			}
			merged.set(roll.id, roll);
		}

		const nextHistory = Array.from(merged.values())
			.sort((left, right) => left.timestamp - right.timestamp)
			.slice(-20);

		if (JSON.stringify(nextHistory) !== JSON.stringify(diceCtx.history)) {
			diceCtx.history = nextHistory;
		}
	});

	onMount(() => {
		diceCtx.init();
		unsubscribeRoll = diceCtx.onRollEnd((roll) => {
			const syncedRoll = {
				...roll,
				rollerName: roll.rollerName ?? campaignCtx.userMembership?.display_name ?? undefined
			};
			pendingSyncedRollIds.add(syncedRoll.id);
			diceCtx.history = diceCtx.history.map((entry) =>
				entry.id === syncedRoll.id ? syncedRoll : entry
			);
			campaignCtx.addRollToHistory(syncedRoll);
		});
	});

	onDestroy(() => {
		unsubscribeRoll?.();
		diceCtx.destroy();
	});

	const isLoading = $derived(campaignCtx.isLoading || userCtx.isLoading);
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<Loader {isLoading} />
	{#if isLoading}
		<div></div>
	{:else if loadError || !campaignCtx.campaign}
		<LoadError />
	{:else}
		{@render children?.()}
	{/if}
</div>
