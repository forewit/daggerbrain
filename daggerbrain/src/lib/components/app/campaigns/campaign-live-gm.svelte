<!-- src/lib/components/app/campaigns/campaign-live-gm.svelte -->
<script lang="ts">
	import Fear from '$lib/components/app/sheet/fear.svelte';
	import CharacterPreview from './character-preview.svelte';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import { error } from '@sveltejs/kit';

	let {
		campaignId
	}: {
		campaignId: string;
	} = $props();

	const campaignContext = getCampaignContext();

	// Get data from context
	const campaignState = $derived(campaignContext.campaignState);
	const characters = $derived(campaignContext.characters);
	const characterList = $derived(Object.values(characters));

	// Local state for fear (for change tracking)
	let localFear = $state(0);

	// Update local state when campaignState changes
	$effect(() => {
		if (campaignState) {
			localFear = campaignState.fear_track ?? 0;
		}
	});

	async function handleUpdateFear(newValue: number) {
		if (!campaignId) return;
		
		localFear = newValue;

		// Auto-save fear changes via WebSocket
		try {
			await campaignContext.updateState({
				fear_track: newValue
			});
			// State will be updated via WebSocket message handler
			// The $effect watching campaignState will sync localFear automatically
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to update fear track');
		}
	}

	// WebSocket connection is now handled automatically by campaigns.svelte.ts
	// No need to manually start/stop polling
</script>

<div class="flex flex-col gap-6">
	<!-- Fear Tracker -->
	<Fear bind:fearValue={localFear} onUpdate={handleUpdateFear} isGM={true} />

	<!-- Character Previews -->
	{#if characterList.length > 0}
		<div>
			<h2 class="mb-4 text-lg font-semibold">Characters</h2>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each characterList as character}
					<CharacterPreview {character} {campaignId} />
				{/each}
			</div>
		</div>
	{/if}
</div>
