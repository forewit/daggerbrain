<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import CampaignLiveCharacters from '$lib/components/campaigns/live/campaign-live-characters.svelte';
	import CampaignLiveFear from '$lib/components/campaigns/live/campaign-live-fear.svelte';
	import CampaignLiveNotes from '$lib/components/campaigns/live/campaign-live-notes.svelte';
	import CountdownSheet from '$lib/components/campaigns/live/countdown-sheet.svelte';
	import DiceLogSheet from '$lib/components/dice/dice-log-sheet.svelte';
	import DiceRecents from '$lib/components/dice/dice-recents.svelte';
	import DiceRoller from '$lib/components/dice/dice-roller.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { getCampaignContext } from '$lib/state/campaign.svelte';
	import { getEncounterContext } from '$lib/state/encounters.svelte';
	import { getLocalstorageContext } from '$lib/state/localstorage.svelte';
	import { cn } from '$lib/utils';
	import Box from '@lucide/svelte/icons/box';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Hourglass from '@lucide/svelte/icons/hourglass';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { fade, slide } from 'svelte/transition';

	const mobilePages = ['Characters', 'Notes'] as const;
	const mobilePageQueryKeys = ['characters', 'notes'] as const;

	const campaignCtx = getCampaignContext();
	const encounterCtx = getEncounterContext();
	const localstorageCtx = getLocalstorageContext();
	const isMobile = new IsMobile();

	let showDiceLog = $state(false);
	let countdownSheetOpen = $state(false);
	let activePage = $state(1);

	let leftEnabled = $state(
		campaignCtx.id
			? (localstorageCtx.app_preferences.campaign_gm_dashboard[campaignCtx.id]?.leftEnabled ??
					false)
			: false
	);
	let rightEnabled = $state(
		campaignCtx.id
			? (localstorageCtx.app_preferences.campaign_gm_dashboard[campaignCtx.id]?.rightEnabled ??
					false)
			: false
	);
	let topEnabled = $state(
		campaignCtx.id
			? (localstorageCtx.app_preferences.campaign_gm_dashboard[campaignCtx.id]?.topEnabled ?? true)
			: true
	);
	let bottomEnabled = $state(
		campaignCtx.id
			? (localstorageCtx.app_preferences.campaign_gm_dashboard[campaignCtx.id]?.bottomEnabled ??
					true)
			: true
	);
	let showPreviews = $state(
		campaignCtx.id
			? (localstorageCtx.app_preferences.campaign_gm_dashboard[campaignCtx.id]?.showPreviews ??
					false)
			: false
	);

	$effect(() => {
		if (!campaignCtx.id) return;

		localstorageCtx.app_preferences.campaign_gm_dashboard[campaignCtx.id] = {
			leftEnabled,
			rightEnabled,
			topEnabled,
			bottomEnabled,
			showPreviews
		};
	});

	$effect(() => {
		if (!campaignCtx.id) return;

		localstorageCtx.app_preferences.campaign_player_dashboard[campaignCtx.id] = {
			leftEnabled,
			rightEnabled,
			topEnabled,
			bottomEnabled,
			showPreviews
		};
	});

	$effect(() => {
		encounterCtx.id = undefined;
	});

	function getMobilePageFromUrl() {
		const tab = page.url.searchParams.get('tab')?.toLowerCase();
		const index = mobilePageQueryKeys.indexOf(tab as (typeof mobilePageQueryKeys)[number]);
		return index === -1 ? 1 : index;
	}

	function syncMobileTabToUrl() {
		if (!isMobile.current || typeof window === 'undefined') return;

		const tab = mobilePageQueryKeys[activePage] ?? 'notes';
		const url = new URL(window.location.href);

		if (url.searchParams.get('tab') === tab) return;

		url.searchParams.set('tab', tab);
		window.history.replaceState(window.history.state, '', url);
	}

	function setActivePage(index: number) {
		activePage = index;
		syncMobileTabToUrl();
	}

	$effect(() => {
		syncMobileTabToUrl();
	});

	onMount(() => {
		activePage = getMobilePageFromUrl();

		if (typeof window === 'undefined') return;

		const handlePopstate = () => {
			const tab = window.location.search
				? new URLSearchParams(window.location.search).get('tab')
				: null;
			const index = mobilePageQueryKeys.indexOf(
				(tab?.toLowerCase() ?? '') as (typeof mobilePageQueryKeys)[number]
			);
			activePage = index === -1 ? 1 : index;
		};

		window.addEventListener('popstate', handlePopstate);
		return () => window.removeEventListener('popstate', handlePopstate);
	});
</script>

<CountdownSheet bind:open={countdownSheetOpen} isGM={false} />
<DiceLogSheet
	bind:open={showDiceLog}
	campaignId={campaignCtx.id}
	campaignDisplayName={campaignCtx.userMembership?.display_name}
/>
<DiceRecents bind:showDiceLog class={cn(isMobile.current && 'bottom-18')} />
<DiceRoller variant="default" class={cn(isMobile.current && 'bottom-18')} />

<div class="absolute inset-0 flex flex-col">
	{#if campaignCtx.isLoading || !campaignCtx.campaign || !campaignCtx.id}
		<div class="absolute inset-0 flex items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	{:else if isMobile.current}
		<div class="flex h-14 shrink-0 items-center gap-2 border-y bg-background px-4 shadow-lg">
			<div class="mr-auto flex items-center gap-2 truncate">
				<Button
					href={`/campaigns/${campaignCtx.id}`}
					variant="ghost"
					size="icon"
					class="shrink-0 hover:bg-card"
				>
					<ChevronLeft class="shrink-0" />
				</Button>

				<div
					class={cn(
						buttonVariants({ variant: 'ghost' }),
						'pointer-events-none -ml-2 truncate px-2'
					)}
				>
					<span class="truncate">{campaignCtx.campaign?.name || 'Unnamed Campaign'}</span>
				</div>
			</div>

			<Button
				onclick={() => (topEnabled = !topEnabled)}
				size="icon"
				variant="ghost"
				class="shrink-0"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<rect width="18" height="18" x="3" y="3" rx="2" />
					{#if topEnabled}
						<rect width="18" height="7" x="3" y="3" rx="2" stroke="none" fill="currentColor" />
					{/if}
					<path d="M3 9h18" />
				</svg>
			</Button>

			<Button size="sm" variant="outline" onclick={() => (showDiceLog = !showDiceLog)}>
				<Box />
				<span class="hidden sm:inline">Dice Log</span>
			</Button>

			<Button size="sm" variant="outline" onclick={() => (countdownSheetOpen = true)}>
				<Hourglass />
				<span class="hidden sm:inline">Countdowns</span>
			</Button>
		</div>

		{#if topEnabled}
			<div transition:slide class="border-b border-muted">
				<CampaignLiveFear isGM={false} />
			</div>
		{/if}

		<div class="relative grow">
			<div class="absolute inset-0">
				{#if activePage === 0}
					<ScrollArea class="h-full bg-primary/50">
						<CampaignLiveCharacters isGM={false} bind:showPreviews class="pb-24" />
					</ScrollArea>
				{:else}
					<ScrollArea class="h-full bg-primary/50">
						<CampaignLiveNotes isGM={false} class="pb-24" />
					</ScrollArea>
				{/if}
			</div>
		</div>

		<div
			class="z-10 grid h-14 shrink-0 auto-cols-fr grid-flow-col border-t border-accent/10 bg-card"
		>
			{#each mobilePages as tab, index}
				<button
					class={cn(
						'flex items-center justify-center border-t-2 pb-2 text-sm font-medium transition-colors',
						activePage === index
							? 'border-accent text-accent'
							: 'border-transparent text-muted-foreground hover:text-foreground'
					)}
					onclick={() => setActivePage(index)}
				>
					{tab}
				</button>
			{/each}
		</div>
	{:else}
		<div class="flex h-11 items-center gap-2 border-y bg-background px-4 shadow-lg">
			<div class="flex items-center gap-2 truncate">
				<Button
					href={`/campaigns/${campaignCtx.id}`}
					variant="ghost"
					size="icon"
					class="shrink-0 hover:bg-card"
				>
					<ChevronLeft class="shrink-0" />
				</Button>

				<div
					class={cn(
						buttonVariants({ variant: 'ghost' }),
						'pointer-events-none -ml-2 truncate px-2'
					)}
				>
					<span class="truncate">{campaignCtx.campaign?.name || 'Unnamed Campaign'}</span>
				</div>
			</div>

			<div class="flex">
				<Button onclick={() => (leftEnabled = !leftEnabled)} size="icon" variant="ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect width="18" height="18" x="3" y="3" rx="2" />
						{#if leftEnabled}
							<rect width="7" height="18" x="3" y="3" rx="2" stroke="none" fill="currentColor" />
						{/if}
						<path d="M9 3v18" />
					</svg>
				</Button>

				<Button onclick={() => (topEnabled = !topEnabled)} size="icon" variant="ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect width="18" height="18" x="3" y="3" rx="2" />
						{#if topEnabled}
							<rect width="18" height="7" x="3" y="3" rx="2" stroke="none" fill="currentColor" />
						{/if}
						<path d="M3 9h18" />
					</svg>
				</Button>

				<Button onclick={() => (rightEnabled = !rightEnabled)} size="icon" variant="ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect width="18" height="18" x="3" y="3" rx="2" />
						{#if rightEnabled}
							<rect width="7" height="18" x="14" y="3" rx="2" stroke="none" fill="currentColor" />
						{/if}
						<path d="M15 3v18" />
					</svg>
				</Button>
			</div>

			<div class="grow"></div>

			<Button size="sm" variant="outline" onclick={() => (showDiceLog = !showDiceLog)}>
				<Box />
				Dice Log
			</Button>

			<Button size="sm" variant="outline" onclick={() => (countdownSheetOpen = true)}>
				<Hourglass />
				Countdowns
			</Button>
		</div>

		<div class="grid h-[calc(100%-(var(--spacing)*11))] grid-cols-[auto_1fr_auto]">
			<ScrollArea
				class={cn(
					leftEnabled && 'border-r',
					'flex grow overflow-y-auto border-primary bg-primary/50 shadow-xl'
				)}
			>
				{#if leftEnabled}
					<div transition:slide={{ axis: 'x' }} class="z-10 grid w-[432px] min-w-[432px]">
						<CampaignLiveCharacters isGM={false} bind:showPreviews class="min-w-[432px] px-4" />
					</div>
				{/if}
			</ScrollArea>

			<div class="flex flex-col overflow-hidden">
				{#if topEnabled}
					<div
						transition:slide
						class="grid min-w-0 place-items-center overflow-hidden border-b border-muted shadow-xl"
					>
						<CampaignLiveFear isGM={false} />
					</div>
				{/if}

				{#if bottomEnabled}
					<div transition:fade class="flex min-h-0 min-w-[390px] grow"></div>
				{/if}
			</div>

			<ScrollArea
				class={cn(
					rightEnabled && 'border-l',
					'flex grow overflow-y-auto border-primary bg-primary/50 shadow-xl'
				)}
			>
				{#if rightEnabled}
					<div transition:slide={{ axis: 'x' }} class="grid w-[432px] min-w-[432px] grow">
						<CampaignLiveNotes isGM={false} class="min-w-[432px]" />
					</div>
				{/if}
			</ScrollArea>
		</div>
	{/if}
</div>
