<script lang="ts">
	import { setCharacterContext } from '$lib/state/character.svelte';
	import { setCampaignContext } from '$lib/state/campaigns.svelte';
	import { page } from '$app/state';

	let { children } = $props();
	const uid = page.params.uid!;
	const characterCtx = setCharacterContext(uid);
	const campaignCtx = setCampaignContext(); // Initialize without ID

	// Update campaign ID when character loads
	$effect(() => {
		const char = characterCtx.character;
		campaignCtx.campaignId = char?.campaign_id ?? undefined;
	});
</script>

{@render children?.()}
