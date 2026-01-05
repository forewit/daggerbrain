<!-- src/routes/(private)/campaigns/[id]/live/+page.svelte -->
<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Footer from '$lib/components/app/footer.svelte';
	import { page } from '$app/state';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import CampaignLivePlayer from '$lib/components/app/campaigns/campaign-live-player.svelte';
	import CampaignLiveGm from '$lib/components/app/campaigns/campaign-live-gm.svelte';
	import { cn } from '$lib/utils';

	let { data }: { data: import('../$types').PageData } = $props();

	const campaignId = $derived(page.params.id);
	const campaign = getCampaignContext();
	const loading = $derived(campaign.loading);
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	{#if loading}
		<div class="absolute inset-0 flex items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	{:else if !campaign.campaign}
		<div class="flex flex-col items-center justify-center gap-4 px-4 py-12">
			<p class="text-sm text-muted-foreground italic">Campaign not found</p>
			<Button href="/campaigns">Campaigns</Button>
		</div>
	{:else}
		<!-- Header -->
		<div
			class="sticky top-[calc(var(--navbar-height,3.5rem)-1px)] z-20 w-full bg-background sm:top-0"
		>
			<div class="w-full bg-primary/50">
				<div
					class="relative mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-2 px-4"
				>
					<div class="flex items-center gap-2">
						<Button href={`/campaigns/${campaignId}`} variant="link">
							<ChevronLeft />
							{campaign.campaign?.name}
						</Button>
					</div>
				</div>
			</div>
		</div>
		<div
			class={cn(
				'relative z-10 flex h-full w-full flex-col items-center justify-start ',
				'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
			)}
		>
			<div class="flex w-full max-w-6xl flex-col gap-6 px-4 py-4">
				{#if data.role === 'gm' && campaignId}
					<CampaignLiveGm {campaignId} />
				{:else if campaignId}
					<CampaignLivePlayer {campaignId} />
				{/if}
			</div>
		</div>
	{/if}
</div>

<Footer />
