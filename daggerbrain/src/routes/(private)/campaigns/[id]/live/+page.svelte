<!-- src/routes/(private)/campaigns/[id]/live/+page.svelte -->
<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Footer from '$lib/components/app/footer.svelte';
	import { page } from '$app/state';
	import { setCampaignContext } from '$lib/state/campaigns.svelte';
	import CampaignLivePlayer from '$lib/components/app/campaigns/campaign-live-player.svelte';
	import CampaignLiveGm from '$lib/components/app/campaigns/campaign-live-gm.svelte';
	import { cn } from '$lib/utils';

	let { data }: { data: import('../$types').PageData } = $props();

	const campaignId = $derived(page.params.id);

	// Set up campaign context (reactive to campaignId changes)
	const campaignContext = setCampaignContext(() => campaignId);

	// Derived state from context
	const campaign = $derived(campaignContext.campaign);
	const campaignState = $derived(campaignContext.campaignState);
	const loading = $derived(campaignContext.loading);
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	{#if loading}
		<div class="absolute inset-0 flex items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	{:else if !campaign}
		<div class="flex flex-col items-center justify-center gap-4 px-4 py-12">
			<p class="text-sm text-muted-foreground italic">Campaign not found</p>
			<Button href="/campaigns">Back to Campaigns</Button>
		</div>
	{:else}
		<div
			class={cn(
				'relative z-10 flex h-full w-full flex-col items-center justify-start ',
				'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
			)}
		>
			<!-- Header -->
			<div
				class="sticky top-[calc(var(--navbar-height,3.5rem)-1px)] z-20 w-full bg-background sm:top-0"
			>
				<div class="w-full bg-primary/50">
					<div class="relative mx-auto flex w-full max-w-6xl items-center gap-2 py-2 pr-4">
						<Button href={`/campaigns/${campaignId}`} variant="link">
							<ChevronLeft />
							Back to {campaign.name}
						</Button>
					</div>
				</div>
			</div>

			<div class="flex w-full max-w-6xl flex-col space-y-6 px-4 py-4">
				{#if data.role === 'gm' && campaignId}
					<CampaignLiveGm
						{campaign}
						campaignId={campaignId}
						{campaignState}
					/>
				{:else if campaignId}
					<CampaignLivePlayer {campaign} campaignId={campaignId} {campaignState} />
				{/if}
			</div>
		</div>
	{/if}
</div>

<Footer />

