<!-- src/lib/components/app/sheet/campaign-info.svelte -->
<script lang="ts">
	import Fear from './fear.svelte';
	import Countdown from './countdown.svelte';
	import { cn } from '$lib/utils';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import { fade, slide } from 'svelte/transition';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	let { class: className = '' }: { class?: string } = $props();

	const campaignCtx = getCampaignContext();

	// Get values from campaign context
	const fearValue = $derived(campaignCtx?.campaignState?.fear_track ?? 0);
	const fearVisibleToPlayers = $derived(
		campaignCtx?.campaignState?.fear_visible_to_players ?? false
	);
	const countdowns = $derived(campaignCtx?.campaignState?.countdowns ?? []);
	const visibleCountdowns = $derived(countdowns.filter((c) => c.visibleToPlayers));
	const connected = $derived(!campaignCtx?.loading);

	// Only show the component if there's something visible
	let isExpanded = $state(false);
</script>

<div class={cn('relative', className)}>
	{#if connected}
		<!-- link to campaign -->
		<button
			transition:fade={{ duration: 300 }}
			class="absolute bottom-0 left-1/2 z-90 flex max-w-full -translate-x-1/2 translate-y-1/2 items-center gap-0.5 truncate rounded-full bg-background px-1 text-xs font-medium text-primary"
			onclick={() => (isExpanded = !isExpanded)}
		>
			<ChevronRight
				class={cn('size-3.5 transition-transform duration-300', isExpanded && '-rotate-90')}
			/>

			Campaign: {campaignCtx.campaign?.name || 'Unnamed campaign'}
		</button>

		{#if isExpanded}
			<div
				class="flex flex-wrap items-center justify-center gap-4 border-y border-primary/20 bg-primary/5 px-4 pt-5 pb-6"
				transition:slide={{ duration: 300 }}
			>
				<!-- Fear Tracker (read-only for players) - only show if visible to players -->
				{#if fearVisibleToPlayers}
					<Fear class="sm:flex-row sm:gap-3" {fearValue} isGM={false} />
				{/if}

				<!-- Visible Countdowns (read-only) -->
				{#if visibleCountdowns.length > 0}
					<div class="flex flex-wrap items-center justify-center gap-4">
						{#each visibleCountdowns as countdown (countdown.id)}
							<Countdown {countdown} isGM={false} />
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</div>
