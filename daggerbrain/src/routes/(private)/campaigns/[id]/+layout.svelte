<script lang="ts">
	import { setCampaignContext } from '$lib/state/campaigns.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	setCampaignContext(page.params.id);
</script>

{@render children?.()}