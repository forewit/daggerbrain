<script lang="ts">
	import CampaignLiveDashboardGm from '$lib/components/campaigns/live/campaign-live-dashboard-gm.svelte';
	import CampaignLiveDashboardPlayer from '$lib/components/campaigns/live/campaign-live-dashboard-player.svelte';
	import { getCampaignContext } from '$lib/state/campaign.svelte';

	const campaignCtx = getCampaignContext();
	const isGM = $derived(campaignCtx.isGm);
</script>

{#if isGM}
	<CampaignLiveDashboardGm />
{:else}
	<CampaignLiveDashboardPlayer />
{/if}
