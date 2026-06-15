<script lang="ts">
	import Countdown from '$lib/components/character-sheet/campaign/countdown.svelte';
	import Fear from '$lib/components/character-sheet/campaign/fear.svelte';
	import { getCampaignContext } from '$lib/state/campaign.svelte';
	import { cn } from '$lib/utils';

	let {
		class: className = '',
		isGM,
		onOpenCountdownSheet = () => {}
	}: {
		class?: string;
		isGM: boolean;
		onOpenCountdownSheet?: () => void;
	} = $props();

	const campaignCtx = getCampaignContext();
	const campaign = $derived(campaignCtx.campaign);

	const fearVisible = $derived(isGM || !!campaign?.fear_visible_to_players);
	const visibleCountdowns = $derived.by(() => {
		if (!campaign) return [];
		return campaign.countdowns
			.map((countdown, index) => ({ countdown, index }))
			.filter(({ countdown }) => isGM || countdown.visibleToPlayers);
	});
</script>

{#if campaign}
	<div class={cn('relative overflow-hidden p-3.5', className)}>
		<div class="flex flex-wrap justify-center gap-4">
			{#if fearVisible}
				<Fear class="mx-auto" bind:fearValue={campaign.fear_track} {isGM} />
			{/if}

			{#if visibleCountdowns.length > 0}
				<div class="mx-auto flex flex-wrap items-end justify-center gap-4">
					{#each visibleCountdowns as { countdown, index }}
						{#if isGM}
							<Countdown
								bind:countdown={campaign.countdowns[index]}
								{isGM}
								onClickCountdown={onOpenCountdownSheet}
							/>
						{:else}
							<Countdown {countdown} {isGM} />
						{/if}
					{/each}
				</div>
			{/if}

			{#if !fearVisible && visibleCountdowns.length === 0}
				<p class="mx-auto py-6 text-center text-xs text-muted-foreground italic">
					Your GM has not shared any live campaign info yet.
				</p>
			{/if}
		</div>
	</div>
{/if}
