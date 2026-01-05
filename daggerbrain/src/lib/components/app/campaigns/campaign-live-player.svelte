<!-- src/lib/components/app/campaigns/campaign-live-player.svelte -->
<script lang="ts">
	import Fear from '$lib/components/app/sheet/fear.svelte';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';

	let {
		campaignId
	}: {
		campaignId: string;
	} = $props();

	const campaignContext = getCampaignContext();

	// Fear tracker is read-only for players
	const fearValue = $derived(campaignContext.campaignState?.fear_track ?? 0);

	// WebSocket connection is now handled automatically by campaigns.svelte.ts
	// No need to manually start/stop polling
</script>

<!-- Fear Tracker -->
<Fear fearValue={fearValue} onUpdate={() => {}} isGM={false} />
