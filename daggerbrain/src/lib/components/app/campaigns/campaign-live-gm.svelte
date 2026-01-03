<!-- src/lib/components/app/campaigns/campaign-live-gm.svelte -->
<script lang="ts">
	import Fear from '$lib/components/app/sheet/fear.svelte';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import { toast } from 'svelte-sonner';
	import { error } from '@sveltejs/kit';
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
			const updated = await campaignContext.updateState({
				fear_track: newValue
			});
			
			localFear = updated.fear_track;
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to update fear track');
		}
	}

	// WebSocket connection is now handled automatically by campaigns.svelte.ts
	// No need to manually start/stop polling
</script>

<!-- Fear Tracker -->
<Fear bind:fearValue={localFear} onUpdate={handleUpdateFear} isGM={true} />
