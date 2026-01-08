<!-- src/lib/components/app/campaigns/campaign-notes.svelte -->
<script lang="ts">
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';

	let { campaignId }: { campaignId: string } = $props();

	const campaignContext = getCampaignContext();
	const campaignState = $derived(campaignContext.campaignState);

	// Local state for notes (for change tracking)
	let localNotes = $state('');

	// Update local state when campaignState changes
	$effect(() => {
		if (campaignState) {
			localNotes = campaignState.notes ?? '';
		}
	});

	// Sync notes to campaign state when local notes change (with debounce handled by context)
	function handleNotesChange() {
		if (!campaignContext.campaignState) return;

		// Direct state mutation - auto-save is handled by the context's debounced effect
		campaignContext.campaignState = {
			...campaignContext.campaignState,
			notes: localNotes || null
		};
	}
</script>

<div class="rounded border bg-card p-4">
	<h2 class="mb-4 text-lg font-semibold">Notes</h2>
	<Textarea
		bind:value={localNotes}
		oninput={handleNotesChange}
		class="min-h-[200px]"
		placeholder="Add campaign notes..."
	/>
</div>
