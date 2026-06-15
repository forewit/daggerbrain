<!-- src/lib/components/app/sheet/campaign-info.svelte -->
<script lang="ts">
	import Fear from './fear.svelte';
	import Countdown from './countdown.svelte';
	import { cn } from '$lib/utils';
	import { getCampaignContext } from '$lib/state/campaign.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getLocalstorageContext } from '$lib/state/localstorage.svelte';
	import { fade, slide } from 'svelte/transition';
	import Box from '@lucide/svelte/icons/box';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Button from '$lib/components/ui/button/button.svelte';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import DiceLog from '$lib/components/dice/dice-log-sheet.svelte';

	let { class: className = '' }: { class?: string } = $props();

	const campaignCtx = getCampaignContext();
	const characterCtx = getCharacterContext();
	const localstorageCtx = getLocalstorageContext();
	const campaign = $derived(campaignCtx.campaign);

	// Get values from campaign context
	const fearValue = $derived(campaign?.fear_track ?? 0);
	const fearVisibleToPlayers = $derived(campaign?.fear_visible_to_players ?? false);
	const countdowns = $derived(campaign?.countdowns ?? []);
	const visibleCountdowns = $derived(countdowns.filter((c) => c.visibleToPlayers));

	const fallbackCampaignInfoOpen = true;

	let isExpanded = $state(
		characterCtx.id
			? (localstorageCtx.app_preferences.character_campaign_preferences[characterCtx.id]
					?.campaignInfoOpen ?? fallbackCampaignInfoOpen)
			: fallbackCampaignInfoOpen
	);
	let showHistory = $state(false);

	$effect(() => {
		if (!characterCtx.id) return;

		localstorageCtx.app_preferences.character_campaign_preferences[characterCtx.id] = {
			campaignInfoOpen: isExpanded
		};
	});
</script>

<DiceLog
	bind:open={showHistory}
	campaignId={campaignCtx.id}
	campaignDisplayName={campaignCtx.userMembership?.display_name}
/>

<div class={cn('relative', className)}>
	<!-- link to campaign -->
	<div class="border-b border-primary/20 bg-primary/10">
		<div class="mx-auto flex max-w-6xl items-center justify-end truncate pt-0.5 pr-1 sm:px-4">
			{#if campaign}
				<div class="flex grow truncate" transition:fade>
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
				class="mr- size-7"
				size="sm"
				variant="ghost"
				title="Dice Log"
				onclick={() => (showHistory = !showHistory)}><Box class="size-4" /></Button
			>

			<Button
				href={`/campaigns/${campaignCtx.id}`}
				variant="link"
				size="sm"
				class="h-7 font-normal"
			>
				campaign
				<ExternalLink class="size-3.5" />
			</Button>
		</div>
	</div>

	{#if isExpanded && campaign}
		<div
			class="flex flex-wrap items-center justify-center gap-4 border-b border-primary/20 bg-background px-4 pt-6 pb-6"
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
				<p class="text-xs text-muted-foreground italic">
					Your GM has not shared anything with you yet
				</p>
			{/if}
		</div>
	{/if}
</div>
