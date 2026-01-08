<!-- src/lib/components/app/sheet/campaign-info.svelte -->
<script lang="ts">
	import Fear from './fear.svelte';
	import Countdown from './countdown.svelte';
	import { cn } from '$lib/utils';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import { slide } from 'svelte/transition';

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
	const hasVisibleContent = $derived(fearVisibleToPlayers || visibleCountdowns.length > 0);
</script>

{#if connected && hasVisibleContent}
	<div
		transition:slide={{ duration: 300 }}
		class={cn(
			'flex flex-wrap items-center justify-center gap-4 border-y border-destructive/20 bg-destructive/5 px-4 py-5',
			className
		)}
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
