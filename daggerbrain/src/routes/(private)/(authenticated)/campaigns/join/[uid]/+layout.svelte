<script lang="ts">
	import { setCampaignContext } from '$lib/state/campaigns.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	const campaignCtx = setCampaignContext();

	// Set campaign ID from route params
	$effect(() => {
		campaignCtx.campaignId = page.params.uid;
	});
</script>

{@render children?.()}
