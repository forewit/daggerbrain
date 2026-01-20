<!-- src/lib/components/app/sheet/campaign-info.svelte -->
<script lang="ts">
	import Fear from './fear.svelte';
	import Countdown from './countdown.svelte';
	import { cn } from '$lib/utils';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import { fade, slide } from 'svelte/transition';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Button from '$lib/components/ui/button/button.svelte';
	import ExternalLink from '@lucide/svelte/icons/external-link';

	let { class: className = '' }: { class?: string } = $props();

	const campaignCtx = getCampaignContext();

	// Get values from campaign context
	const fearValue = $derived(campaignCtx?.campaignState?.fear_track ?? 0);
	const fearVisibleToPlayers = $derived(
		campaignCtx?.campaignState?.fear_visible_to_players ?? false
	);

	const countdowns = $derived(campaignCtx?.campaignState?.countdowns ?? []);
	const visibleCountdowns = $derived(countdowns.filter((c) => c.visibleToPlayers));

	// Only show the component if there's something visible
	let isExpanded = $state(false);
</script>

<div class={cn('relative', className)}>
	<!-- link to campaign -->
	<div class="border-b border-primary/20 bg-primary/10">
		<div class="mx-auto flex max-w-2xl items-center justify-end truncate pt-0.5">
			{#if !campaignCtx.loading}
				<div class="flex grow truncate" transition:fade={{ duration: 300 }}>
					<Button
						class="text- grow justify-start truncate font-normal hover:bg-transparent"
						variant="ghost"
						size="sm"
						onclick={() => (isExpanded = !isExpanded)}
					>
						<ChevronRight class={cn('size-3.5 transition-transform', isExpanded && 'rotate-90')} />
						{campaignCtx.campaign?.name || 'Unnamed campaign'}
					</Button>
				</div>
			{/if}
			<Button
				href={`/campaigns/${campaignCtx.campaign?.id}`}
				variant="link"
				size="sm"
				class="text- font-normal"
			>
				campaign
				<ExternalLink class="size-3.5" />
			</Button>
		</div>
	</div>

	{#if isExpanded && !campaignCtx?.loading}
		<div
			class="flex flex-wrap items-center justify-center gap-4 border-b border-primary/20 bg-primary/5 px-4 pt-5 pb-6"
			transition:slide={{ duration: 300 }}
		>
			<!-- Fear Tracker (read-only for players) - only show if visible to players -->
			{#if fearVisibleToPlayers}
				<Fear class="sm:flex-row sm:gap-3" {fearValue} isGM={false} />
			{/if}

			<!-- Visible Countdowns (read-only) -->
			{#if visibleCountdowns.length > 0}
				<div class="flex flex-wrap items-end justify-center gap-4">
					{#each visibleCountdowns as countdown (countdown.id)}
						<Countdown {countdown} isGM={false} />
					{/each}
				</div>
			{/if}

			<!-- nothing to show -->
			{#if !fearVisibleToPlayers && visibleCountdowns.length === 0}
				<div class="flex flex-wrap items-end justify-center gap-4">
					<p class="text-xs text-muted-foreground italic">
						Your GM has not shared anything with you yet
					</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
