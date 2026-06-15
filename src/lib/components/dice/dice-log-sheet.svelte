<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { getDiceContext } from '$lib/state/dice.svelte';
	import { cn, formatTimeAgo } from '$lib/utils';
	import { tick } from 'svelte';
	import { untrack } from 'svelte';
	import RollSummary from './roll-summary.svelte';

	let {
		open = $bindable(false),
		campaignId,
		campaignDisplayName
	}: {
		open?: boolean;
		campaignId?: string;
		campaignDisplayName?: string;
	} = $props();

	const diceCtx = getDiceContext();
	const DICE_Z_INDEX = '60';

	const currentDisplayName = $derived(campaignDisplayName?.trim() || '');
	const inCampaign = $derived(!!campaignId || currentDisplayName !== '');

	let historyDiv: HTMLDivElement | null = $state(null);
	let historyContent: HTMLDivElement | null = $state(null);
	let historyBottom: HTMLDivElement | null = $state(null);
	let hasDiceLayerOverride = $state(false);
	let preservedScrollTop: number | null = $state(null);
	let shouldStickToBottom = $state(false);

	// this prevents timestamps from re-rendering when a reroll is happening
	let timeSnapshot = $derived.by(() => {
		open;
		return untrack(() => {
			return diceCtx.history.map((entry) => {
				return { time: formatTimeAgo(entry.timestamp), id: entry.id };
			});
		});
	});

	$effect(() => {
		if (diceCtx.diceOnScreen) return;
		if (!hasDiceLayerOverride) return;

		diceCtx.setLayerZIndexOverride(null);
		hasDiceLayerOverride = false;
	});

	$effect(() => {
		if (open) return;
		if (!hasDiceLayerOverride) return;

		diceCtx.setLayerZIndexOverride(null);
		hasDiceLayerOverride = false;
		if (diceCtx.isRolling) {
			diceCtx.cancelActiveRoll();
			return;
		}
		diceCtx.fadeDisplayedDiceNow();
	});

	$effect(() => {
		if (!open) {
			shouldStickToBottom = false;
			return;
		}

		if (preservedScrollTop === null) return;

		const scrollTop = preservedScrollTop;
		preservedScrollTop = null;
		void tick().then(() => {
			if (!historyDiv) return;
			historyDiv.scrollTop = scrollTop;
		});
	});

	$effect(() => {
		if (!open || !historyDiv || !historyContent) return;

		shouldStickToBottom = true;

		const resizeObserver = new ResizeObserver(() => {
			if (!shouldStickToBottom) return;
			scrollHistoryToBottom();
		});

		resizeObserver.observe(historyContent);
		void tick().then(() => {
			scrollHistoryToBottom();
		});

		return () => {
			resizeObserver.disconnect();
		};
	});

	function prepareDiceLayer() {
		if (hasDiceLayerOverride) return;
		diceCtx.setLayerZIndexOverride(DICE_Z_INDEX);
		hasDiceLayerOverride = true;
	}

	function scrollHistoryToBottom() {
		if (!historyDiv) return;
		historyDiv.scrollTop = historyDiv.scrollHeight;
		historyBottom?.scrollIntoView({ block: 'end' });
	}

	function preserveHistoryScroll() {
		preservedScrollTop = historyDiv?.scrollTop ?? null;
	}

	function handleHistoryScroll() {
		if (!historyDiv) return;
		const distanceFromBottom =
			historyDiv.scrollHeight - historyDiv.clientHeight - historyDiv.scrollTop;
		shouldStickToBottom = distanceFromBottom <= 24;
	}

	function prepareForReroll() {
		preserveHistoryScroll();
		shouldStickToBottom = false;
		prepareDiceLayer();
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="gap-2">
		<Sheet.Header class="pb-2">
			<Sheet.Title>Dice Log</Sheet.Title>
			<Sheet.Description>
				{inCampaign ? 'Recent rolls from your campaign.' : 'Your recent dice rolls.'}
			</Sheet.Description>
		</Sheet.Header>

		<div
			bind:this={historyDiv}
			onscroll={handleHistoryScroll}
			class="grid grow items-end overflow-y-auto"
		>
			<div bind:this={historyContent} class="flex flex-col px-4">
				{#each diceCtx.history as roll, i (roll.id)}
					{@const isOwnedRoll =
						!inCampaign ||
						((roll.rollerName?.trim() || '') === currentDisplayName && currentDisplayName !== '')}
					<div>
						<RollSummary
							{roll}
							class="w-full max-w-full min-w-0 rounded-xl py-2 sm:w-full"
							allowDieReroll={isOwnedRoll}
							beforeDieReroll={prepareForReroll}
						/>

						<div class="mt-0.5 mr-3 flex justify-end gap-2">
							<p class="pb-2 text-xs font-bold text-muted-foreground italic">
								{inCampaign ? (roll.rollerName || 'You') + ':' : ''}&ensp;{timeSnapshot[i] &&
								timeSnapshot[i].id === roll.id
									? timeSnapshot[i].time
									: formatTimeAgo(roll.timestamp)}.
							</p>

							<Button
								variant="link"
								class="h-min px-0 pt-0 text-xs font-bold text-muted-foreground italic"
								disabled={!isOwnedRoll || roll.status !== 'complete'}
								hidden={!isOwnedRoll}
								onclick={() => {
									prepareForReroll();
									void diceCtx.rerollDie(
										roll,
										roll.dice
											.map((dice, dieIndex) => (dice.result !== undefined ? dieIndex : null))
											.filter((dieIndex) => dieIndex !== null)
									);
								}}>Reroll</Button
							>
						</div>
					</div>
				{/each}
				<div bind:this={historyBottom} aria-hidden="true" class="h-px w-full shrink-0"></div>
			</div>
		</div>

		<Sheet.Footer class="pt-2">
			<Sheet.Close class={cn(buttonVariants({ variant: 'outline' }), 'w-min')}>Close</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
