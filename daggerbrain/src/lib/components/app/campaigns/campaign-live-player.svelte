<!-- src/lib/components/app/campaigns/campaign-live-player.svelte -->
<script lang="ts">
	import Fear from '$lib/components/app/sheet/fear.svelte';
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

	// Fear tracker is read-only for players
	const fearValue = $derived(campaignState?.fear_track ?? 0);
</script>

<!-- Fear Tracker -->
<Fear fearValue={fearValue} onUpdate={() => {}} isGM={false} />
