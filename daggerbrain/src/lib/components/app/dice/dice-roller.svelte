<script lang="ts">
	import type { DiceType, Roll, RollInput } from '@shared/types/user.types';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';
	import { scale } from 'svelte/transition';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Dialog from '$lib/components/ui/dialog';
	import X from '@lucide/svelte/icons/x';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import History from '@lucide/svelte/icons/history';
	import D4 from './svg-components/d4.svelte';
	import D6 from './svg-components/d6.svelte';
	import D8 from './svg-components/d8.svelte';
	import D10 from './svg-components/d10.svelte';
	import D12 from './svg-components/d12.svelte';
	import D20 from './svg-components/d20.svelte';
	import Hope from './svg-components/hope.svelte';
	import Fear from './svg-components/fear.svelte';
	import Advantage from './svg-components/advantage.svelte';
	import Disadvantage from './svg-components/disadvantage.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { getDiceContext } from '$lib/state/dice.svelte';

	let { class: className = '' }: { class?: string } = $props();

	const diceCtx = getDiceContext();

	const STANDARD_DICE_PICKER_CONFIG = [
		{ type: 'd4' as DiceType, buttonClass: '' },
		{ type: 'd6' as DiceType, buttonClass: '' },
		{ type: 'd8' as DiceType, buttonClass: '' },
		{ type: 'd10' as DiceType, buttonClass: '' },
		{ type: 'd12' as DiceType, buttonClass: '' },
		{ type: 'd20' as DiceType, buttonClass: 'mt-0.5 mb-1' }
	] as const;

	const DICE_COMPONENTS: Record<DiceType, any> = {
		d4: D4,
		d6: D6,
		d8: D8,
		d10: D10,
		d12: D12,
		d20: D20,
		hope: Hope,
		fear: Fear,
		advantage: Advantage,
		disadvantage: Disadvantage
	};

	// --- UI State ---
	let showPicker = $state(false);
	let showCurrentRoll = $state(false);
	let showHistory = $state(false);
	let showClearHistoryDialog = $state(false);
	let showLastRoll = $state(false);
	let wasCurrentRollOpenBeforePickerClosed = $state(false);
	let wasLastRollOpenBeforePickerClosed = $state(false);
	let wasLastRollExplicitlyClosed = $state(false);

	// Roll data (UI-specific - the roll being built in the picker)
	let currentRoll = $state<Roll>({
		id: crypto.randomUUID(),
		name: 'Roll',
		dice: [],
		modifier: 0,
		status: 'complete'
	});

	// Get state from context
	let previousRolls = $derived(diceCtx.history);
	let lastRoll = $derived(diceCtx.lastRoll);
	let diceOnScreen = $derived(diceCtx.diceOnScreen);

	// --- Reset / clear ---
	function resetCurrentRoll() {
		currentRoll = {
			id: crypto.randomUUID(),
			name: 'Roll',
			dice: [],
			modifier: 0,
			status: 'complete'
		};
	}
	function clearHistory() {
		diceCtx.history = [];
	}
	function confirmClearHistory() {
		clearHistory();
		showClearHistoryDialog = false;
		showHistory = false;
	}

	// --- Roll execution ---
	async function handleRoll() {
		if (currentRoll.dice.length === 0) return;

		diceCtx.cancelActiveRoll();
		showCurrentRoll = false;

		const diceToRoll = currentRoll.dice.map((d) => ({ type: d.type }));
		const rollName = currentRoll.name;
		const rollModifier = currentRoll.modifier;

		resetCurrentRoll();

		diceCtx.roll({
			name: rollName,
			dice: diceToRoll,
			modifier: rollModifier
		});

		// The effect will handle opening showLastRoll when the new roll appears
	}

	// --- History and cancel ---
	function rollAgainFromHistory(id?: string) {
		if (!id) return;
		const roll = previousRolls.find((r) => r.id === id);
		if (!roll) return;

		// Cancel any in-progress roll
		diceCtx.cancelActiveRoll();

		// Copy the roll to the active roll (dice types only, no results) and show it
		currentRoll = {
			id: crypto.randomUUID(),
			name: roll.name,
			dice: roll.dice.map((d) => ({ type: d.type })),
			modifier: roll.modifier,
			status: 'complete'
		};
		showCurrentRoll = true;
		showPicker = true;
		showHistory = false; // close Game Log sheet so the active roll form is visible
	}

	function rollAgainFromLastRoll() {
		if (!lastRoll) return;

		// Cancel any in-progress roll
		diceCtx.cancelActiveRoll();

		// Roll again using the state's roll function
		diceCtx.roll({
			name: lastRoll.name,
			dice: lastRoll.dice.map((d) => ({ type: d.type })),
			modifier: lastRoll.modifier
		});

		// The effect will handle opening showLastRoll when the new roll appears
	}

	// --- Exported roll function ---
	export function roll(input: RollInput) {
		// Use the state's roll function
		diceCtx.roll(input);

		// Show currentRoll section, keep picker hidden
		showCurrentRoll = true;
		showPicker = false;
	}

	$effect(() => {
		// Show the form when dice are added, hide when all dice are removed
		if (currentRoll.dice.length > 0) {
			showCurrentRoll = true;
		} else {
			showCurrentRoll = false;
		}
	});

	// Track previous roll ID to detect new rolls
	let previousRollId = $state<string | null>(null);

	$effect(() => {
		// Watch for new rolls and auto-open last roll section
		if (lastRoll) {
			// Check if this is a new roll (different ID or transition from null)
			if (lastRoll.id !== previousRollId) {
				// Reset the current roll being built
				resetCurrentRoll();
				// If current roll section is showing, switch to last roll section
				if (showCurrentRoll) {
					showCurrentRoll = false;
					wasCurrentRollOpenBeforePickerClosed = false; // Clear memory since we're switching away
				}
				showLastRoll = true;
				wasLastRollExplicitlyClosed = false;
				previousRollId = lastRoll.id;
			}
		} else {
			// Reset tracking when lastRoll becomes null
			previousRollId = null;
		}
	});
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button
	class={cn(
		'pointer-events-none fixed inset-0 z-40 cursor-default',
		diceOnScreen && 'pointer-events-auto'
	)}
	onclick={() => diceCtx.cancelActiveRoll()}
></button>

<div
	class={cn(
		'pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom)+16px)] left-[calc(env(safe-area-inset-left)+16px)] z-45 flex items-end gap-3',
		className
	)}
>
	<!-- dice picker -->
	<div
		class={cn(
			'pointer-events-auto flex max-h-[calc(100vh-env(safe-area-inset-bottom)-env(safe-area-inset-top)-32px)] min-h-0 grow flex-col gap-2  rounded-2xl border-2 border-primary-muted bg-card p-1 shadow-xl',
			showPicker && 'pt-3'
		)}
	>
		{#if showPicker}
			<div class="flex min-h-0 flex-col items-center gap-2 overflow-x-hidden overflow-y-auto">
				<Button
					class="mb-0.5"
					size="icon"
					variant="link"
					onclick={() => (showHistory = !showHistory)}><History class="size-5" /></Button
				>
				{#each STANDARD_DICE_PICKER_CONFIG as config}
					{@const DiceComponent = DICE_COMPONENTS[config.type]}
					<button
						title={config.type}
						class="relative {config.buttonClass}"
						onclick={() => {
							currentRoll.dice.push({ type: config.type });
						}}
					>
						<DiceComponent showLabel={true} />
					</button>
				{/each}
				<button
					title="Duality"
					class="relative h-12 min-h-12 w-12 min-w-12"
					onclick={() => {
						if (!currentRoll.dice.some((die) => die.type === 'hope')) {
							currentRoll.dice.push({ type: 'hope' });
						}
						if (!currentRoll.dice.some((die) => die.type === 'fear')) {
							currentRoll.dice.push({ type: 'fear' });
						}
					}}
				>
					<Fear class="absolute top-0 left-0 size-3/4" />
					<Hope class="absolute right-0 bottom-1/16 size-3/4" />
				</button>
			</div>
		{/if}

		<button
			class="flex size-12 shrink-0 items-center justify-center"
			onclick={() => {
				if (showPicker) {
					// Closing picker: remember if current roll or last roll was open, then close both sections
					if (showCurrentRoll) {
						wasCurrentRollOpenBeforePickerClosed = true;
					}
					if (showLastRoll) {
						wasLastRollOpenBeforePickerClosed = true;
					}
					// Don't reset currentRoll - preserve it so it can be restored when picker reopens
					showPicker = false;
					showCurrentRoll = false;
					showLastRoll = false;
				} else {
					// Opening picker: restore sections based on what was open before
					showPicker = true;
					// If last roll is currently showing (e.g., a roll came in while picker was closed),
					// keep it showing and don't restore current roll
					if (showLastRoll) {
						// Keep last roll showing, don't restore current roll
					} else if (wasCurrentRollOpenBeforePickerClosed) {
						// Restore current roll if it was open before
						showCurrentRoll = true;
					} else if (wasLastRollOpenBeforePickerClosed && !wasLastRollExplicitlyClosed) {
						// Restore last roll if it was open before and not explicitly closed
						showLastRoll = true;
					}
				}
			}}
		>
			{#if showPicker}
				<X class="size-6" />
			{:else}
				<D12 backgroundClasses="fill-transparent" foregroundClasses="fill-accent" />
			{/if}
		</button>
	</div>

	<!-- current roll / last roll section (visible independently of picker) -->
	{#if showCurrentRoll || showLastRoll}
		<div class="flex flex-col gap-3">
			<!-- current roll -->
			{#if showCurrentRoll}
				<div
					class="pointer-events-auto flex w-71 flex-col gap-2 rounded-2xl border-2 border-primary-muted bg-card p-3 shadow-xl"
				>
					<div class="flex items-center justify-between gap-2">
						<p class="font-eveleth text-sm">New Roll</p>
						<Button
							onclick={() => {
								resetCurrentRoll();
								showCurrentRoll = false;
								wasCurrentRollOpenBeforePickerClosed = false; // Clear memory since explicitly closed
								// If last roll is showing, also close it explicitly
								if (showLastRoll) {
									wasLastRollExplicitlyClosed = true;
									showLastRoll = false;
									wasLastRollOpenBeforePickerClosed = false;
								}
							}}
							size="sm"
							variant="ghost"
							class="-m-1 h-auto p-1"><X class="size-4" /></Button
						>
					</div>

					<!-- chosen dice -->
					<div class="flex flex-wrap items-center gap-2">
						{#each currentRoll.dice as dice, index}
							{@const DiceComponent = DICE_COMPONENTS[dice.type]}
							<button
								transition:scale={{ duration: 100 }}
								onclick={() => {
									currentRoll.dice.splice(index, 1);
								}}
							>
								<DiceComponent class="size-9" />
							</button>
						{/each}
						{#if currentRoll.modifier !== 0}
							<div class="flex size-9 items-center justify-center gap-1">
								{#if currentRoll.modifier > 0}
									<span class="font-eveleth text-xl">+</span>
								{:else}
									<span class="font-eveleth text-xl">-</span>
								{/if}
								<span class="font-eveleth text-xl">{Math.abs(currentRoll.modifier)}</span>
							</div>
						{/if}
					</div>

					<!-- advantage / disadvantage and modifier -->
					<div class="mt-1 flex items-center gap-2">
						<button
							class="h-7 w-14 rounded bg-emerald-800 text-center text-sm font-bold hover:bg-emerald-800/70"
							onclick={() => {
								currentRoll.dice.push({ type: 'advantage' });
							}}
						>
							+ Adv
						</button>
						<button
							class="h-7 w-14 rounded bg-rose-800 text-center text-sm font-bold hover:bg-rose-800/70"
							onclick={() => {
								currentRoll.dice.push({ type: 'disadvantage' });
							}}
						>
							- Dis
						</button>

						<div class="mx-auto flex items-center gap-2">
							<Button
								size="sm"
								variant="secondary"
								class="size-6 p-0"
								onclick={() => {
									currentRoll.modifier = currentRoll.modifier - 1;
								}}
							>
								<Minus class="size-4" />
							</Button>
							<p class="text-sm font-bold">Modifier</p>
							<Button
								size="sm"
								variant="secondary"
								class="size-6 p-0"
								onclick={() => {
									currentRoll.modifier = currentRoll.modifier + 1;
								}}
							>
								<Plus class="size-4" />
							</Button>
						</div>
					</div>

					<!-- Roll button -->
					<Button
						size="sm"
						class="mt-1 h-7 font-bold"
						onclick={handleRoll}
						disabled={currentRoll.dice.length === 0}
					>
						Roll
					</Button>
				</div>
			{:else if showLastRoll && lastRoll}
				<!-- Last roll -->
				{@const isRollingState = lastRoll.status === 'rolling'}
				{@const statusText = diceCtx.getRollStatusText(lastRoll)}
				<div
					class={cn(
						'pointer-events-auto flex w-71 flex-col gap-2 rounded-2xl border-2 border-primary-muted bg-card p-3 shadow-xl',
						statusText === 'Critical Success' && 'bg-gradient-to-r from-card to-emerald-950',
						statusText === 'with Fear' && 'bg-gradient-to-r from-card to-primary-muted',
						statusText === 'with Hope' && 'bg-gradient-to-r from-card to-accent-muted'
					)}
				>
					<div class="flex items-center justify-between gap-2">
						<p class="font-eveleth text-sm">{lastRoll.name}</p>
						<Button
							onclick={() => {
								wasLastRollExplicitlyClosed = true;
								showLastRoll = false;
								wasLastRollOpenBeforePickerClosed = false;
							}}
							size="sm"
							variant="ghost"
							class="-m-1 h-auto p-1"
						>
							<X class="size-4" />
						</Button>
					</div>

					<!-- Individual dice results -->
					<div class="flex flex-wrap items-center gap-2">
						{#each lastRoll.dice as dice}
							{@const DiceComponent = DICE_COMPONENTS[dice.type]}
							<div class="relative {isRollingState ? 'opacity-50' : ''}">
								<DiceComponent class="size-9" />
								{#if !isRollingState && dice.result !== undefined}
									<div
										class="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-background px-1.5 pt-0.5 pb-[1px] text-xs font-bold"
									>
										{dice.type === 'disadvantage' ? '-' : ''}{dice.result}
									</div>
								{/if}
							</div>
						{/each}
						{#if lastRoll.modifier !== 0}
							<div
								class="flex size-9 items-center justify-center gap-1 {isRollingState
									? 'opacity-50'
									: ''}"
							>
								{#if lastRoll.modifier > 0}
									<span class="font-eveleth text-xl">+</span>
								{:else}
									<span class="font-eveleth text-xl">-</span>
								{/if}
								<span class="font-eveleth text-xl">{Math.abs(lastRoll.modifier)}</span>
							</div>
						{/if}
					</div>

					<!-- Total -->
					<div class="flex h-8 items-center justify-between">
						<span class="text-sm font-bold">Total:</span>
						{#if isRollingState}
							<Loader2 class="size-5 animate-spin" />
						{:else if diceCtx.calculateTotal(lastRoll) === 0}
							<span class="text-sm font-bold">Cancelled</span>
						{:else}
							<div class="flex items-center gap-2">
								<span class="font-eveleth text-xl">
									{diceCtx.calculateTotal(lastRoll)}
								</span>
								<span class="text-sm font-bold">{statusText}</span>
							</div>
						{/if}
					</div>

					<!-- Roll Again button -->
					<Button
						size="sm"
						class="mt-1 h-7 bg-primary/80 font-bold hover:bg-primary/60"
						onclick={rollAgainFromLastRoll}
						disabled={isRollingState}
					>
						{isRollingState ? 'Rolling...' : 'Roll Again'}
					</Button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<Sheet.Root bind:open={showHistory}>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>Roll History</Sheet.Title>
			<Sheet.Description>See the last 20 rolls you made.</Sheet.Description>
		</Sheet.Header>

		<div class="flex flex-col-reverse gap-4 overflow-y-auto px-4">
			{#each previousRolls as roll, index (roll.id)}
				{@const isRollingState = roll.status === 'rolling'}
				{@const statusText = diceCtx.getRollStatusText(roll)}
				<div
					class={cn(
						'pointer-events-auto flex flex-col gap-2 rounded-md border-2 border-primary-muted bg-card px-3 py-2 shadow-xl',
						statusText === 'Critical Success' && 'bg-gradient-to-r from-card to-emerald-950',
						statusText === 'with Fear' && 'bg-gradient-to-r from-card to-primary-muted',
						statusText === 'with Hope' && 'bg-gradient-to-r from-card to-accent-muted'
					)}
				>
					<div class="flex items-center justify-between gap-2">
						<p class="font-eveleth text-sm">{roll.name}</p>
						<!-- Roll Again button -->
						<Button
							size="sm"
							variant="ghost"
							class="-m-1 h-auto p-1"
							onclick={() => rollAgainFromHistory(roll.id)}
							hidden={isRollingState}
						>
							<RotateCcw class="size-4" />
						</Button>
					</div>
					<!-- Individual dice results -->
					<div class="flex flex-wrap items-center gap-2">
						{#each roll.dice as dice}
							{@const DiceComponent = DICE_COMPONENTS[dice.type]}
							<div class="relative {isRollingState ? 'opacity-50' : ''}">
								<DiceComponent class="size-9" />
								{#if !isRollingState && dice.result !== undefined}
									<div
										class="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-background px-1.5 pt-0.5 pb-[1px] text-xs font-bold"
									>
										{dice.type === 'disadvantage' ? '-' : ''}{dice.result}
									</div>
								{/if}
							</div>
						{/each}
						{#if roll.modifier !== 0}
							<div
								class="flex size-9 items-center justify-center gap-1 {isRollingState
									? 'opacity-50'
									: ''}"
							>
								{#if roll.modifier > 0}
									<span class="font-eveleth text-xl">+</span>
								{:else}
									<span class="font-eveleth text-xl">-</span>
								{/if}
								<span class="font-eveleth text-xl">{Math.abs(roll.modifier)}</span>
							</div>
						{/if}
					</div>

					<!-- Total -->
					<div class="flex h-6 items-end justify-between">
						<span class="text-sm font-bold">Total:</span>
						{#if isRollingState}
							<Loader2 class="mb-0.5 size-5 animate-spin" />
						{:else if diceCtx.calculateTotal(roll) === 0}
							<span class="text-sm font-bold">Cancelled</span>
						{:else}
							<div class="flex items-center gap-2">
								<span class="font-eveleth text-xl">
									{diceCtx.calculateTotal(roll)}
								</span>
								{#if statusText}
									<span class="text-sm font-bold">{statusText}</span>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<Sheet.Footer>
			<Button
				hidden={previousRolls.length === 0}
				size="sm"
				variant="link"
				class="ml-auto w-min text-destructive"
				onclick={() => (showClearHistoryDialog = true)}>Clear history</Button
			>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>

<!-- Clear Roll History Confirmation Dialog -->
<Dialog.Root bind:open={showClearHistoryDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Clear Roll History</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to clear the roll history? This action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="flex gap-3 pt-4">
			<Dialog.Close class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
				>Cancel</Dialog.Close
			>
			<Dialog.Close class={buttonVariants({ variant: 'destructive' })} onclick={confirmClearHistory}
				>Clear history</Dialog.Close
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<style>
	/* svelte-ignore a11y-no-onchange */
	:global(#dice-box canvas) {
		width: 100% !important;
		height: 100% !important;
		display: block;
	}
</style>
