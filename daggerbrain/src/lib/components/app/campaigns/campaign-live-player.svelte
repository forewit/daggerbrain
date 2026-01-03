<!-- src/lib/components/app/campaigns/campaign-live-player.svelte -->
<script lang="ts">
	import Fear from '$lib/components/app/sheet/fear.svelte';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import type { Campaign, CampaignState } from '$lib/types/campaign-types';

	let {
		campaign,
		campaignId,
		campaignState
	}: {
		campaign: Campaign;
		campaignId: string;
		campaignState: CampaignState | null;
	} = $props();

	const campaignContext = getCampaignContext();

	// Fear tracker is read-only for players
	// Use context state directly instead of prop to ensure reactivity
	const fearValue = $derived(campaignContext.campaignState?.fear_track ?? 0);

	// WebSocket connection is now handled automatically by campaigns.svelte.ts
	// No need to manually start/stop polling
</script>

<!-- Fear Tracker -->
<Fear fearValue={fearValue} onUpdate={() => {}} isGM={false} />
