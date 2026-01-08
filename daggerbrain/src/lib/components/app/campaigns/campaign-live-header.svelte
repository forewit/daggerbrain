<!-- src/lib/components/app/campaigns/campaign-live-header.svelte -->
<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Hourglass from '@lucide/svelte/icons/hourglass';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';

	let {
		campaignId,
		isGM,
		onCountdownClick
	}: {
		campaignId: string;
		isGM: boolean;
		onCountdownClick: () => void;
	} = $props();

	const campaignContext = getCampaignContext();
	const campaign = $derived(campaignContext.campaign);
</script>

<div class="sticky top-[calc(var(--navbar-height,3.5rem)-1px)] z-20 w-full bg-background sm:top-0">
	<div class="w-full bg-primary/50">
		<div
			class="relative mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-2 px-4"
		>
			<div class="flex items-center gap-2">
				<Button href={`/campaigns/${campaignId}`} variant="link">
					<ChevronLeft />
					{campaign?.name}
				</Button>
			</div>
			{#if isGM}
				<div class="flex shrink-0 items-center gap-2">
					<Button variant="outline" size="sm" onclick={onCountdownClick} class="h-7">
						<Hourglass class="size-3.5" />
						<p class="hidden sm:block">Countdowns</p>
					</Button>
				</div>
			{/if}
		</div>
	</div>
</div>
