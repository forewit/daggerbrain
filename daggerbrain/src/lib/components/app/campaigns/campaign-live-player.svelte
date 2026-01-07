<!-- src/lib/components/app/campaigns/campaign-live-player.svelte -->
<script lang="ts">
	import Fear from '$lib/components/app/sheet/fear.svelte';
	import Countdown from './countdown.svelte';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import type { Countdown as CountdownType } from '$lib/types/campaign-types';

	let {
		campaignId
	}: {
		campaignId: string;
	} = $props();

	const campaignContext = getCampaignContext();

	// Fear tracker is read-only for players
	const fearValue = $derived(campaignContext.campaignState?.fear_track ?? 0);

	// Only show countdowns that are visible to players
	const visibleCountdowns = $derived(
		(campaignContext.campaignState?.countdowns ?? []).filter(
			(cd: CountdownType) => cd.visibleToPlayers
		)
	);

	// WebSocket connection is now handled automatically by campaigns.svelte.ts
	// No need to manually start/stop polling
</script>

<div class="flex flex-col gap-6">
	<!-- Fear Tracker -->
	<Fear {fearValue} onUpdate={() => {}} isGM={false} />

	<!-- Visible Countdowns (Read-only) -->
	{#if visibleCountdowns.length > 0}
		<div>
			<h2 class="mb-4 text-lg font-semibold">Countdowns</h2>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each visibleCountdowns as countdown (countdown.id)}
					<Countdown {countdown} isGM={false} />
				{/each}
			</div>
		</div>
	{/if}
</div>
