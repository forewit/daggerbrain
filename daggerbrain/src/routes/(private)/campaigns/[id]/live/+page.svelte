<!-- src/routes/(private)/campaigns/[id]/live/+page.svelte -->
<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Footer from '$lib/components/app/footer.svelte';
	import { page } from '$app/state';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import CampaignLiveHeader from '$lib/components/app/campaigns/campaign-live-header.svelte';
	import CampaignLiveCharacters from '$lib/components/app/campaigns/campaign-live-characters.svelte';
	import Fear from '$lib/components/app/sheet/fear.svelte';
	import Countdown from '$lib/components/app/sheet/countdown.svelte';
	import CountdownSheet from '$lib/components/app/campaigns/countdown-sheet.svelte';
	import { cn } from '$lib/utils';

	let { data } = $props();

	const campaignContext = getCampaignContext();
	const isGM = $derived(data.role === 'gm');

	// Countdown sheet state
	let countdownSheetOpen = $state(false);
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	{#if campaignContext.loading || !campaignContext.campaign || !campaignContext.campaignState || !campaignContext.campaignId}
		<div class="absolute inset-0 flex items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	{:else}
		<CampaignLiveHeader
			campaignId={campaignContext.campaignId}
			{isGM}
			onCountdownClick={() => (countdownSheetOpen = true)}
		/>
		<div
			class={cn(
				'relative z-10 flex h-full w-full flex-col items-center justify-start ',
				'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
			)}
		>
			<div class="mb-6 flex w-full flex-col">
				<!-- Fear Tracker -->
				<Fear
					class="mx-auto mt-6"
					bind:fearValue={campaignContext.campaignState.fear_track}
					{isGM}
				/>

				<!-- Countdowns -->
				{#if campaignContext.campaignState.countdowns.length > 0}
					<div class={cn('mt-6 flex flex-wrap justify-center gap-4', isGM && 'mt-4')}>
						{#each campaignContext.campaignState.countdowns as countdown, index (countdown.id)}
							<Countdown
								bind:countdown={campaignContext.campaignState.countdowns[index]}
								{isGM}
								onClickCountdown={() => (countdownSheetOpen = true)}
							/>
						{/each}
					</div>
				{/if}
				<!-- Characters (GM only) -->
				<CampaignLiveCharacters {isGM} />
			</div>
		</div>
	{/if}
</div>

<Footer />

<!-- Countdown Management Sheet -->
{#if isGM}
	<CountdownSheet bind:open={countdownSheetOpen} />
{/if}
