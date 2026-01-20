<script lang="ts">
	import { cn } from '$lib/utils';
	import { onMount, tick } from 'svelte';
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
	import DiceBox from '@3d-dice/dice-box';

	let { class: className = '' } = $props();

	type DiceType =
		| 'd4'
		| 'd6'
		| 'd8'
		| 'd10'
		| 'd12'
		| 'd20'
		| 'hope'
		| 'fear'
		| 'advantage'
		| 'disadvantage';

	const DICE_CONFIG: Record<DiceType, { sides: number; themeColor: string }> = {
		d4: { sides: 4, themeColor: '#2a2045' },
		d6: { sides: 6, themeColor: '#2a2045' },
		d8: { sides: 8, themeColor: '#2a2045' },
		d10: { sides: 10, themeColor: '#2a2045' },
		d12: { sides: 12, themeColor: '#2a2045' },
		d20: { sides: 20, themeColor: '#2a2045' },
		hope: { sides: 12, themeColor: '#fde07d' },
		fear: { sides: 12, themeColor: '#6341b2' },
		advantage: { sides: 6, themeColor: '#009966' },
		disadvantage: { sides: 6, themeColor: '#a50036' }
	};

	const STANDARD_DICE_PICKER_CONFIG = [
		{ type: 'd4' as DiceType, buttonClass: '' },
		{ type: 'd6' as DiceType, buttonClass: '' },
		{ type: 'd8' as DiceType, buttonClass: '' },
		{ type: 'd10' as DiceType, buttonClass: '' },
		{ type: 'd12' as DiceType, buttonClass: '' },
		{ type: 'd20' as DiceType, buttonClass: 'mt-0.5 mb-1' }
	] as const;

	type Roll = {
		id: string;
		name: string;
		dice: {
			type: DiceType;
			result?: number;
			disabled?: boolean;
		}[];
		modifier: number;
		status: 'rolling' | 'complete';
	};

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

	// --- State ---
	// UI
	let showPicker = $state(false);
	let showCurrentRoll = $state(false);
	let showHistory = $state(false);
	let showClearHistoryDialog = $state(false);
	let closedLastRoll = $state(false);
	// Roll data
	let currentRoll = $state<Roll>({
		id: crypto.randomUUID(),
		name: 'Roll',
		dice: [],
		modifier: 0,
		status: 'complete'
	});
	let previousRolls = $state<Roll[]>([]);
	let lastRoll = $state<Roll | null>(null);
	let rollingRollId = $state<string | null>(null);
	// 3D / rolling
	let diceBox = $state<HTMLDivElement | null>(null);
	let isRolling = $state(false);
	let diceOnScreen = $state(false);
	// Game log scroll container
	let gameLogScrollContainer = $state<HTMLDivElement | null>(null);
	// Non-reactive refs (roll pipeline and DiceBox)
	let Box: DiceBox | null = null;
	let currentRollOrder: Array<{ type: string; themeColor: string; sides: number }> = [];
	let rollingRollData: { name: string; modifier: number } | null = null;

	// --- Reset / clear ---
	function resetRollingState() {
		isRolling = false;
		currentRollOrder = [];
		rollingRollId = null;
		rollingRollData = null;
	}
	function resetCurrentRoll() {
		currentRoll = {
			id: crypto.randomUUID(),
			name: 'Roll',
			dice: [],
			modifier: 0,
			status: 'complete'
		};
	}
	function resetPosition() {
		if (!diceBox) return;
		diceBox.style.top = `calc(var(--navbar-height) + ${window.scrollY}px)`;
	}
	function clearHistory() {
		previousRolls = [];
	}
	function confirmClearHistory() {
		clearHistory();
		showClearHistoryDialog = false;
		showHistory = false;
	}

	// --- Roll pipeline ---
	function groupDiceByTypeAndColor(
		dice: Roll['dice']
	): Map<string, { type: string; sides: number; themeColor: string; count: number }> {
		const diceGroups = new Map<
			string,
			{ type: string; sides: number; themeColor: string; count: number }
		>();

		for (const die of dice) {
			const config = DICE_CONFIG[die.type];
			if (!config) {
				console.warn(`Unknown dice type: ${die.type}`);
				continue;
			}

			const key = `${config.sides}-${config.themeColor}`;
			const existing = diceGroups.get(key);
			if (existing) {
				existing.count++;
			} else {
				diceGroups.set(key, {
					type: die.type,
					sides: config.sides,
					themeColor: config.themeColor,
					count: 1
				});
			}
		}

		return diceGroups;
	}

	function prepareRollObjects(dice: Roll['dice']): {
		rollObjects: any[];
		rollOrder: Array<{ type: string; themeColor: string; sides: number }>;
	} {
		const diceGroups = groupDiceByTypeAndColor(dice);
		const rollObjects: any[] = [];
		const rollOrder: Array<{ type: string; themeColor: string; sides: number }> = [];

		for (const [key, group] of diceGroups.entries()) {
			rollObjects.push({
				qty: group.count,
				sides: group.sides,
				theme: 'default',
				themeColor: group.themeColor
			});

			// Track order for mapping results back
			for (let i = 0; i < group.count; i++) {
				rollOrder.push({
					type: group.type,
					themeColor: group.themeColor,
					sides: group.sides
				});
			}
		}

		return { rollObjects, rollOrder };
	}
	function onBeforeRoll() {
		diceOnScreen = true;
	}
	function finalizeRoll(rollGroups: any[]) {
		try {
			if (!rollGroups || rollGroups.length === 0) {
				console.warn('No roll results received');
				resetRollingState();
				return;
			}

			if (currentRollOrder.length === 0) {
				console.error('No roll order tracked - cannot map results');
				resetRollingState();
				return;
			}

			const diceResults: Roll['dice'] = [];
			let orderIndex = 0;

			for (const group of rollGroups) {
				if (!group.rolls || !Array.isArray(group.rolls)) {
					console.warn('Invalid roll group structure:', group);
					continue;
				}

				for (const dieResult of group.rolls) {
					const originalDiceInfo = currentRollOrder[orderIndex];
					if (originalDiceInfo) {
						diceResults.push({
							type: originalDiceInfo.type as Roll['dice'][0]['type'],
							result: dieResult.value
						});
					} else {
						console.warn(`No original dice info for order index ${orderIndex}`);
					}
					orderIndex++;
				}
			}

			if (diceResults.length !== currentRollOrder.length) {
				console.warn(
					`Result count mismatch: expected ${currentRollOrder.length}, got ${diceResults.length}`
				);
			}

			const rollName = rollingRollData?.name ?? currentRoll.name;
			const rollModifier = rollingRollData?.modifier ?? currentRoll.modifier;
			const isReroll = rollingRollId !== null;
			const rollId: string = isReroll ? rollingRollId! : crypto.randomUUID();

			const finalRoll: Roll = {
				id: rollId,
				name: rollName,
				dice: diceResults,
				modifier: rollModifier,
				status: 'complete'
			};

			if (isReroll) {
				const rollIndex = previousRolls.findIndex((r) => r.id === rollingRollId);
				if (rollIndex !== -1) {
					previousRolls[rollIndex] = finalRoll;
				}
				rollingRollId = null;
			} else {
				previousRolls = [...previousRolls, finalRoll];
			}

			lastRoll = finalRoll;
			isRolling = false;
			rollingRollData = null;
		} catch (error) {
			console.error('Error finalizing roll:', error);
			resetRollingState();
			resetPosition();
		}
	}
	async function handleRoll() {
		if (!Box) {
			console.error('DiceBox is not initialized');
			return;
		}

		if (currentRoll.dice.length === 0) return;

		cancelActiveRoll();
		showCurrentRoll = false;

		const diceToRoll = currentRoll.dice.map((d) => ({ ...d }));
		const rollName = currentRoll.name;
		const rollModifier = currentRoll.modifier;

		const rollId = crypto.randomUUID();
		const rollingRoll: Roll = {
			id: rollId,
			name: rollName,
			dice: diceToRoll.map((d) => ({ ...d })),
			modifier: rollModifier,
			status: 'rolling'
		};
		previousRolls = [...previousRolls, rollingRoll];
		rollingRollId = rollId;
		rollingRollData = { name: rollName, modifier: rollModifier };

		resetCurrentRoll();

		try {
			isRolling = true;
			resetPosition();
			Box.clear();

			const { rollObjects, rollOrder } = prepareRollObjects(diceToRoll);
			currentRollOrder = rollOrder;

			if (rollObjects.length === 0) {
				console.error('No valid dice to roll');
				resetRollingState();
				return;
			}

			lastRoll = rollingRoll;
			closedLastRoll = false;
			await Box.roll(rollObjects);
		} catch (error) {
			console.error('Error rolling dice:', error);
			resetRollingState();
			resetPosition();
		}
	}

	// --- History and cancel ---
	function rollAgainFromHistory(id?: string) {
		if (!id) return;
		const roll = previousRolls.find((r) => r.id === id);
		if (!roll) return;

		// Cancel any in-progress roll
		cancelActiveRoll();

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
		cancelActiveRoll();

		// Copy the roll to the active roll (dice types only, no results) and show it
		currentRoll = {
			id: crypto.randomUUID(),
			name: lastRoll.name,
			dice: lastRoll.dice.map((d) => ({ type: d.type })),
			modifier: lastRoll.modifier,
			status: 'complete'
		};

		handleRoll();
	}

	function cancelActiveRoll() {
		diceOnScreen = false;

		if (lastRoll) {
			lastRoll.status = 'complete';
		}

		if (Box) {
			Box.clear();
		}

		if (rollingRollId !== null) {
			const rollIndex = previousRolls.findIndex((r) => r.id === rollingRollId);
			if (rollIndex !== -1 && previousRolls[rollIndex].status === 'rolling') {
				previousRolls.splice(rollIndex, 1);
			}
		}

		resetRollingState();
	}

	// --- Calculations ---
	function calculateTotal(roll: Roll): number {
		// Sum standard dice, hope, and fear
		const standardSum = roll.dice
			.filter((d) => d.result !== undefined && d.type !== 'advantage' && d.type !== 'disadvantage')
			.reduce((sum, d) => sum + (d.result || 0), 0);

		// Add advantage results
		const advantageSum = roll.dice
			.filter((d) => d.type === 'advantage' && d.result !== undefined)
			.reduce((sum, d) => sum + (d.result || 0), 0);

		// Subtract disadvantage results
		const disadvantageSum = roll.dice
			.filter((d) => d.type === 'disadvantage' && d.result !== undefined)
			.reduce((sum, d) => sum + (d.result || 0), 0);

		return standardSum + advantageSum - disadvantageSum + roll.modifier;
	}

	function getRollStatusText(roll: Roll): string {
		// Get all fear dice results
		const fearDice = roll.dice.filter((d) => d.type === 'fear' && d.result !== undefined);
		const fearValues = fearDice.map((d) => d.result || 0);
		const totalFear = fearValues.reduce((sum, v) => sum + v, 0);
		const maxFear = fearValues.length > 0 ? Math.max(...fearValues) : 0;

		// Get all hope dice results
		const hopeDice = roll.dice.filter((d) => d.type === 'hope' && d.result !== undefined);
		const hopeValues = hopeDice.map((d) => d.result || 0);
		const totalHope = hopeValues.reduce((sum, v) => sum + v, 0);
		const maxHope = hopeValues.length > 0 ? Math.max(...hopeValues) : 0;

		// Check if both exist and any fear value equals any hope value (Critical Success)
		if (fearDice.length > 0 && hopeDice.length > 0) {
			// Check if any fear value matches any hope value
			const hasMatchingValue = fearValues.some((fv) => hopeValues.includes(fv));

			if (hasMatchingValue) {
				return 'Critical Success';
			}
		}

		// If fear exists and total fear > total hope (or no hope dice)
		if (fearDice.length > 0 && totalFear > totalHope) {
			return 'with Fear';
		}

		// If hope exists and total hope > total fear (or no fear dice)
		if (hopeDice.length > 0 && totalHope > totalFear) {
			return 'with Hope';
		}

		// Default: no status text
		return '';
	}

	$effect(() => {
		// Show the form when dice are added, hide when all dice are removed
		if (currentRoll.dice.length > 0) {
			showCurrentRoll = true;
		} else {
			showCurrentRoll = false;
		}
	});

	$effect(() => {
		if (!showPicker) {
			resetCurrentRoll();
			showCurrentRoll = false;
		}
	});

	$effect(()=>{
		// cap previousRolls at 20
		if (previousRolls.length > 20) {
			previousRolls = previousRolls.slice(0, 20);
		}
	})

	$effect(() => {
		// Scroll to bottom when game log sheet opens
		if (showHistory && gameLogScrollContainer) {
			tick().then(() => {
				if (gameLogScrollContainer) {
					gameLogScrollContainer.scrollTop = gameLogScrollContainer.scrollHeight;
				}
			});
		}
	});

	onMount(() => {
		// remove any existing dice box
		const existingDiceBox = document.getElementById('dice-box');
		if (existingDiceBox) {
			existingDiceBox.remove();
		}

		diceBox = document.body.appendChild(document.createElement('div'));
		diceBox.id = 'dice-box';
		diceBox.style.zIndex = '40';
		diceBox.style.pointerEvents = 'none';
		diceBox.style.position = 'absolute';
		diceBox.style.width = 'calc(100% - var(--scrollbar-width))';
		diceBox.style.height = 'calc(100% - var(--navbar-height))';
		// diceBox.style.border = '2px solid red';
		
		resetPosition();

		Box = new DiceBox('#dice-box', {
			assetPath: '/dice-box/',
			scale: 5,
			gravity: 5,
			mass: 2,
			//friction: 0.8,
			 angularDamping: 0.5,
			 linearDamping: 0.5,
			theme: 'default',
			settleTimeout: 3000,
			onRollComplete: (results) => {
				finalizeRoll(results);
			},
			onBeforeRoll
		});

		Box.init();

		return () => {
			const existingDiceBox = document.getElementById('dice-box');
		if (existingDiceBox) {
			existingDiceBox.remove();
		}
		}
	});
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button
	class={cn(
		'pointer-events-none fixed inset-0 z-40 cursor-default',
		diceOnScreen && 'pointer-events-auto'
	)}
	onclick={cancelActiveRoll}
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
					size="icon"
					variant="link"
					class=""
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
			title="Roll Dice"
			class="flex size-12 shrink-0 items-center justify-center"
			onclick={() => {
				showPicker = !showPicker;
				if (showPicker) {
					lastRoll = null;
					closedLastRoll = true;
				}
			}}
		>
			{#if showPicker}
				<X class="size-6" />
			{:else}
				<D12 backgroundClasses="fill-primary-muted" foregroundClasses="fill-primary" />
			{/if}
		</button>
	</div>

	{#if showPicker}
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
								lastRoll = null;
								closedLastRoll = true;
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
			{:else if lastRoll && !closedLastRoll}
				<!-- Last roll -->
				{@const isRolling = lastRoll.status === 'rolling'}
				{@const statusText = getRollStatusText(lastRoll)}
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
								lastRoll = null;
								closedLastRoll = true;
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
							<div class="relative {isRolling ? 'opacity-50' : ''}">
								<DiceComponent class="size-9" />
								{#if !isRolling && dice.result !== undefined}
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
								class="flex size-9 items-center justify-center gap-1 {isRolling
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
						{#if isRolling}
							<Loader2 class="size-5 animate-spin" />
						{:else if calculateTotal(lastRoll) === 0}
							<span class="text-sm font-bold">Cancelled</span>
						{:else}
							<div class="flex items-center gap-2">
								<span class="font-eveleth text-xl">
									{calculateTotal(lastRoll)}
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
						disabled={isRolling}
					>
						{isRolling ? 'Rolling...' : 'Roll Again'}
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

		<div class="px-4 flex flex-col gap-4 overflow-y-auto" bind:this={gameLogScrollContainer}>
			{#each previousRolls as roll, index (roll.id)}
				{@const isRolling = roll.status === 'rolling'}
				{@const statusText = getRollStatusText(roll)}
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
							hidden={isRolling}
						>
							<RotateCcw class="size-4" />
						</Button>
					</div>
					<!-- Individual dice results -->
					<div class="flex flex-wrap items-center gap-2">
						{#each roll.dice as dice}
							{@const DiceComponent = DICE_COMPONENTS[dice.type]}
							<div class="relative {isRolling ? 'opacity-50' : ''}">
								<DiceComponent class="size-9" />
								{#if !isRolling && dice.result !== undefined}
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
								class="flex size-9 items-center justify-center gap-1 {isRolling
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
						{#if isRolling}
							<Loader2 class="size-5 animate-spin mb-0.5" />
						{:else if calculateTotal(roll) === 0}
							<span class="text-sm font-bold">Cancelled</span>
						{:else}
							<div class="flex items-center gap-2">
								<span class="font-eveleth text-xl">
									{calculateTotal(roll)}
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
				class="text-destructive w-min ml-auto"
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
