<script lang="ts">
	import CampaignPrivateNotes from '$lib/components/campaigns/campaign-private-notes.svelte';
	import CampaignPublicNotes from '$lib/components/campaigns/campaign-public-notes.svelte';
	import CampaignVault from '$lib/components/campaigns/campaign-vault.svelte';
	import { cn } from '$lib/utils';

	let {
		class: className = '',
		isGM
	}: {
		class?: string;
		isGM: boolean;
	} = $props();
</script>

<div class={cn('flex flex-col gap-4 px-4 py-5', className)}>
	{#if isGM}
		<CampaignPrivateNotes class="h-min rounded-lg border-0 bg-primary-muted shadow-lg" />
	{/if}

	<CampaignPublicNotes {isGM} class="h-min rounded-lg border-0 bg-primary-muted shadow-lg" />

	{#if isGM}
		<CampaignVault class="rounded-lg border-0 bg-primary-muted shadow-lg" />
	{/if}
</div>
