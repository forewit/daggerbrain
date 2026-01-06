<!-- src/lib/components/app/campaigns/campaign-live-gm.svelte -->
<script lang="ts">
	import Fear from '$lib/components/app/sheet/fear.svelte';
	import CharacterPreview from './character-preview.svelte';
	import Countdown from './countdown.svelte';
	import CountdownSheetContent from './countdown-sheet-content.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { cn } from '$lib/utils';
	import Timer from '@lucide/svelte/icons/timer';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import { error } from '@sveltejs/kit';
	import type { Countdown as CountdownType } from '$lib/types/campaign-types';

	let {
		campaignId
	}: {
		campaignId: string;
	} = $props();

	const campaignContext = getCampaignContext();
	const user = getUserContext();

	// Get data from context
	const campaignState = $derived(campaignContext.campaignState);
	const characters = $derived(campaignContext.characters);
	const characterList = $derived(Object.values(characters));
	const countdowns = $derived(campaignState?.countdowns ?? []);

	// Local state for fear (for change tracking)
	let localFear = $state(0);

	// Sheet state
	let countdownSheetOpen = $state(false);

	// Toggle state for previews
	let showPreviews = $state(true);

	// Update local state when campaignState changes
	$effect(() => {
		if (campaignState) {
			localFear = campaignState.fear_track ?? 0;
		}
	});

	async function handleUpdateFear(newValue: number) {
		if (!campaignId) return;

		localFear = newValue;

		// Auto-save fear changes via WebSocket
		try {
			await campaignContext.updateState({
				fear_track: newValue
			});
			// State will be updated via WebSocket message handler
			// The $effect watching campaignState will sync localFear automatically
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to update fear track');
		}
	}

	// Watch for countdown changes and sync to backend
	$effect(() => {
		if (!campaignState || countdowns.length === 0) return;

		// Debounce: only sync if countdowns actually changed
		const currentCountdowns = campaignState.countdowns ?? [];
		if (currentCountdowns.length !== countdowns.length) return;

		// Check if any countdown current value changed
		const hasChanges = countdowns.some((cd) => {
			const original = currentCountdowns.find((c) => c.id === cd.id);
			return original && original.current !== cd.current;
		});

		if (hasChanges) {
			campaignContext
				.updateState({
					countdowns: countdowns
				})
				.catch((err) => {
					error(500, err instanceof Error ? err.message : 'Failed to update countdown');
				});
		}
	});
</script>

<div class="mb-6 flex w-full flex-col gap-6">
	<!-- Fear Tracker -->
	<Fear bind:fearValue={localFear} onUpdate={handleUpdateFear} isGM={true} />

	<!-- Countdowns -->
	{#if countdowns.length > 0}
		<div>
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold">Countdowns</h2>
				<Button variant="outline" onclick={() => (countdownSheetOpen = true)}>
					<Timer class="size-4" />
					Manage
				</Button>
			</div>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each countdowns as countdown, index (countdown.id)}
					<Countdown
						bind:countdown={countdowns[index]}
						isGM={true}
						onClickCountdown={() => (countdownSheetOpen = true)}
					/>
				{/each}
			</div>
		</div>
	{:else}
		<div>
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold">Countdowns</h2>
				<Button variant="outline" onclick={() => (countdownSheetOpen = true)}>
					<Timer class="size-4" />
					Manage
				</Button>
			</div>
			<p class="text-sm text-muted-foreground">No countdowns yet. Click "Manage" to create one.</p>
		</div>
	{/if}

	<!-- Characters -->
	{#if characterList.length > 0}
		<div
			class="sm:mx-auto flex flex-col items-center border-accent/10 bg-accent/5 px-2 py-8 sm:rounded-3xl sm:border sm:px-4 sm:py-6"
		>
			<div class="mb-8 flex items-center justify-center gap-4 sm:mb-6">
				<p class="text-center font-eveleth text-accent">Characters</p>
				<label
					class={cn(
						buttonVariants({ variant: 'outline', size: 'sm' }),
						'border-accent/10 text-accent hover:text-accent cursor-pointer gap-3 rounded-full px-4',
						 showPreviews &&
						' bg-accent/5  hover:bg-accent/10 '
					)}
				>
					Previews
					<Switch
						class="data-[state=checked]:bg-accent/50 data-[state=unchecked]:bg-accent/15"
						checked={showPreviews}
						onCheckedChange={(checked) => (showPreviews = checked)}
					/>
				</label>
			</div>

			<div
				class="grid grid-cols-[400px] gap-4 lg:grid-cols-[repeat(2,400px)] xl:grid-cols-[repeat(3,400px)]"
			>
				{#if showPreviews}
					<!-- Character Previews Grid -->
					{#each characterList as character}
						<CharacterPreview {character} {campaignId} />
					{/each}
				{:else}
					<!-- Active Characters Grid -->
					{#each characterList as char}
						{@const playerName =
							char.owner_name || (char.owner_user_id === user.user?.clerk_id ? 'you' : 'Anonymous')}
						<div class="mx-auto w-full overflow-hidden rounded shadow">
							<a
								href={`/characters/${char.id}/`}
								class="flex gap-2 border bg-background p-1 hover:bg-background/80"
							>
								<div class="size-19 shrink-0 overflow-hidden rounded-lg border-2">
									<img
										src={char.image_url || '/images/portrait-placeholder.png'}
										alt={char.name.trim() || 'Unnamed Character'}
										class="h-full w-full object-cover"
									/>
								</div>
								<div class="grow truncate">
									<p class="truncate text-lg font-bold">
										{char.name.trim() || 'Unnamed Character'}
									</p>
									<p class="truncate text-xs text-muted-foreground">
										HP: {char.marked_hp} / {char.max_hp}
										&ensp;•&ensp;
										Stress: {char.marked_stress} / {char.max_stress}
										&ensp;•&ensp;
										Hope: {char.marked_hope}
									</p>
									{#if !char.claimable}
										<div
											class="mt-1.5 w-min truncate rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-center text-xs text-accent"
										>
											Player: {playerName}
										</div>
									{/if}
								</div>
							</a>
							<div class="flex bg-muted">
								<Button
									variant="ghost"
									size="sm"
									class="hover:text-text grow rounded-none border"
									href={`/characters/${char.id}/`}
								>
									View
								</Button>
								<Button
									variant="ghost"
									size="sm"
									class="hover:text-text grow rounded-none border border-x-0"
									href={`/characters/${char.id}/edit`}
								>
									Edit
								</Button>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>

<!-- Countdown Management Sheet -->
<Sheet.Root bind:open={countdownSheetOpen}>
	<Sheet.Content>
		<CountdownSheetContent />
	</Sheet.Content>
</Sheet.Root>
