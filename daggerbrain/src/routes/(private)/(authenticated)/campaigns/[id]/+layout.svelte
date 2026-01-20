<script lang="ts">
	import { setCampaignContext } from '$lib/state/campaigns.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	const campaignCtx = setCampaignContext(); // Initialize without ID

	// Set campaign ID from route params
	$effect(() => {
		campaignCtx.campaignId = page.params.id;
	});
</script>

{@render children?.()}
