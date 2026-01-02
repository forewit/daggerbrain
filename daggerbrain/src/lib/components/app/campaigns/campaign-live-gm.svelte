<!-- src/lib/components/app/campaigns/campaign-live-gm.svelte -->
<script lang="ts">
	import Fear from '$lib/components/app/sheet/fear.svelte';
	import { update_campaign_state } from '$lib/remote/campaigns.remote';
	import { toast } from 'svelte-sonner';
	import { error } from '@sveltejs/kit';
	import type { Campaign, CampaignState } from '$lib/types/campaign-types';

	let {
		campaign,
		campaignId,
		campaignState,
		campaignStateRef = $bindable()
	}: {
		campaign: Campaign;
		campaignId: string;
		campaignState: CampaignState | null;
		campaignStateRef: { value: CampaignState | null };
	} = $props();

	// Local state for fear (for change tracking)
	let localFear = $state(campaignState?.fear_track ?? 0);

	// Update local state when campaignState changes
	$effect(() => {
		if (campaignState) {
			localFear = campaignState.fear_track ?? 0;
		}
	});

	async function handleUpdateFear(newValue: number) {
		if (!campaignId) return;
		localFear = newValue;

		// Auto-save fear changes
		try {
			const updated = await update_campaign_state({
				campaign_id: campaignId,
				fear_track: newValue
			});
			campaignStateRef.value = updated;
			localFear = updated.fear_track;
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to update fear track');
		}
	}
</script>

<!-- Fear Tracker -->
<Fear bind:fearValue={localFear} onUpdate={handleUpdateFear} isGM={true} />
