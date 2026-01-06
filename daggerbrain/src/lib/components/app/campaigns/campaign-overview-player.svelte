<!-- src/lib/components/app/campaigns/campaign-overview-player.svelte -->
<script lang="ts">
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import type { CampaignMember } from '$lib/types/campaign-types';
	import CampaignCharacters from './campaign-characters.svelte';

	let {
		availableCharacters,
		userMembership,
		user,
		campaignId
	}: {
		availableCharacters: Array<{ id: string; name: string }>;
		userMembership: CampaignMember | null;
		user: ReturnType<typeof import('$lib/state/user.svelte').getUserContext>;
		campaignId: string;
	} = $props();

	const campaignContext = getCampaignContext();

	// Get data from context
	const campaign = $derived(campaignContext.campaign);
</script>

{#if campaign}
<!-- Characters Section -->
<CampaignCharacters />
{/if}
