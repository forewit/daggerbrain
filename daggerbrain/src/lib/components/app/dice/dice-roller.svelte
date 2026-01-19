<script lang="ts">
	import { cn } from '$lib/utils';
	import X from '@lucide/svelte/icons/x';
	import Loader2 from '@lucide/svelte/icons/loader-2';
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
	import Button from '$lib/components/ui/button/button.svelte';
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
    import DiceBox from '@3d-dice/dice-box';
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import Switch from '$lib/components/ui/switch/switch.svelte';

	let { class: className = '' } = $props();

	type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'hope' | 'fear' | 'advantage' | 'disadvantage';

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

	let previousRolls = $state<Roll[]>([]);

	let currentRoll = $state<Roll>({
		id: crypto.randomUUID(),
        name: 'Roll',
		dice: [],
		modifier: 0,
		status: 'complete'
	});

	let showCurrentRoll = $state(false);
	let showPicker = $state(false);
	let showResult = $state(true);
	let latestResults = $state<Roll | null>(null);
	let isRolling = $state(false);
	let diceBox = $state<HTMLDivElement | null>(null);
	let rollingRollId = $state<string | null>(null);

	// Store the original dice order to map results back correctly
	let currentRollOrder: Array<{type: string, themeColor: string, sides: number}> = [];
	// Store the roll being rolled (for rerolls, this preserves name/modifier)
	let rollingRollData: { name: string; modifier: number } | null = null;

	function resetRollingState() {
		isRolling = false;
		currentRollOrder = [];
		rollingRollId = null;
		rollingRollData = null;
	}

	function groupDiceByTypeAndColor(dice: Roll['dice']): Map<string, { type: string; sides: number; themeColor: string; count: number }> {
		const diceGroups = new Map<string, { type: string; sides: number; themeColor: string; count: number }>();
		
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
				diceGroups.set(key, { type: die.type, sides: config.sides, themeColor: config.themeColor, count: 1 });
			}
		}

		return diceGroups;
	}

	function prepareRollObjects(dice: Roll['dice']): { rollObjects: any[]; rollOrder: Array<{type: string, themeColor: string, sides: number}> } {
		const diceGroups = groupDiceByTypeAndColor(dice);
		const rollObjects: any[] = [];
		const rollOrder: Array<{type: string, themeColor: string, sides: number}> = [];

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

    function resetPosition() {
        if (!diceBox) return;
		diceBox.style.top = `calc(var(--navbar-height) + ${window.scrollY}px)`;
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

	function closeActiveRoll() {
		resetCurrentRoll();
		showCurrentRoll = false;
	}

    let diceOnScreen = $state(false);
    function onBeforeRoll() {
        diceOnScreen = true;
    }

	function cancelCurrentRoll() {
        diceOnScreen = false;
		if (Box) {
			Box.clear();
		}
		
		// If there's a rolling roll in history, mark it as complete (cancelled)
		if (rollingRollId !== null) {
			const rollIndex = previousRolls.findIndex(r => r.id === rollingRollId);
			if (rollIndex !== -1 && previousRolls[rollIndex].status === 'rolling') {
				// Keep the roll but mark it as complete with no results
				previousRolls[rollIndex] = {
					...previousRolls[rollIndex],
					status: 'complete'
				};
			}
		}
		
		resetRollingState();
	}

	function removeRollFromHistory(id: string) {
		previousRolls = previousRolls.filter(roll => roll.id !== id);
		if (rollingRollId === id) {
			rollingRollId = null;
		}
	}

	async function rerollHistoryItem(id: string) {
		const rollIndex = previousRolls.findIndex(r => r.id === id);
		const roll = previousRolls[rollIndex];
		if (!roll || rollIndex === -1 || !Box) {
			return;
		}

		// Cancel any in-progress roll
		cancelCurrentRoll();

		// Set status to rolling and clear old results
		previousRolls[rollIndex] = { 
			...roll, 
			status: 'rolling',
			dice: roll.dice.map(d => ({ type: d.type }))
		};
		rollingRollId = id;
		rollingRollData = { name: roll.name, modifier: roll.modifier };

		try {
			isRolling = true;

			// Reset to fixed to cover current viewport, then switch to absolute before rolling
			resetPosition();

			// Clear previous dice
			Box.clear();

			// Prepare roll objects and track order
			const { rollObjects, rollOrder } = prepareRollObjects(roll.dice);
			currentRollOrder = rollOrder;

			// Validate we have at least one valid dice group
			if (rollObjects.length === 0) {
				console.error('No valid dice to roll');
				resetRollingState();
				return;
			}

			// Roll all dice together
			await Box.roll(rollObjects);
		} catch (error) {
			console.error('Error rerolling dice:', error);
			resetRollingState();
			// Reset status on error
			const errorRollIndex = previousRolls.findIndex(r => r.id === id);
			if (errorRollIndex !== -1) {
				previousRolls[errorRollIndex] = { ...roll, status: 'complete' };
			}
			resetPosition();
		}
	}

	function calculateBaseTotal(roll: Roll): number {
		// Sum standard dice, hope, and fear
		const standardSum = roll.dice
			.filter(d => d.result !== undefined && d.type !== 'advantage' && d.type !== 'disadvantage')
			.reduce((sum, d) => sum + (d.result || 0), 0);
		
		// Add advantage results
		const advantageSum = roll.dice
			.filter(d => d.type === 'advantage' && d.result !== undefined)
			.reduce((sum, d) => sum + (d.result || 0), 0);
		
		// Subtract disadvantage results
		const disadvantageSum = roll.dice
			.filter(d => d.type === 'disadvantage' && d.result !== undefined)
			.reduce((sum, d) => sum + (d.result || 0), 0);
		
		return standardSum + advantageSum - disadvantageSum;
	}

	function calculateTotal(roll: Roll): number {
		return calculateBaseTotal(roll) + roll.modifier;
	}

	function getRollStatusText(roll: Roll): string {
		// Get all fear dice results
		const fearDice = roll.dice.filter(d => d.type === 'fear' && d.result !== undefined);
		const fearValues = fearDice.map(d => d.result || 0);
		const totalFear = fearValues.reduce((sum, v) => sum + v, 0);
		const maxFear = fearValues.length > 0 ? Math.max(...fearValues) : 0;
		
		// Get all hope dice results
		const hopeDice = roll.dice.filter(d => d.type === 'hope' && d.result !== undefined);
		const hopeValues = hopeDice.map(d => d.result || 0);
		const totalHope = hopeValues.reduce((sum, v) => sum + v, 0);
		const maxHope = hopeValues.length > 0 ? Math.max(...hopeValues) : 0;
		
		// Check if both exist and any fear value equals any hope value (Critical Success)
		if (fearDice.length > 0 && hopeDice.length > 0) {
			// Check if any fear value matches any hope value
			const hasMatchingValue = fearValues.some(fv => hopeValues.includes(fv));
			
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

	let Box: DiceBox | null = null;

	function finalizeRoll(rollGroups: any[]) {
		try {
			if (!rollGroups || rollGroups.length === 0) {
				console.warn('No roll results received');
				resetRollingState();
				return;
			}

			// Validate we have the expected number of results
			if (currentRollOrder.length === 0) {
				console.error('No roll order tracked - cannot map results');
				resetRollingState();
				return;
			}

			// Map roll groups back to dice results
			const diceResults: Roll['dice'] = [];
			let orderIndex = 0;

			// Process each roll group and map to original dice types
			for (const group of rollGroups) {
				if (!group.rolls || !Array.isArray(group.rolls)) {
					console.warn('Invalid roll group structure:', group);
					continue;
				}

				// Process each die in the group
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

			// Validate we got results for all dice
			if (diceResults.length !== currentRollOrder.length) {
				console.warn(`Result count mismatch: expected ${currentRollOrder.length}, got ${diceResults.length}`);
			}

			// Create the final roll result
			// Use rollingRollData if available (for rerolls), otherwise use currentRoll
			const rollName = rollingRollData?.name ?? currentRoll.name;
			const rollModifier = rollingRollData?.modifier ?? currentRoll.modifier;
			const isReroll = rollingRollId !== null;
			const rollId: string = isReroll && rollingRollId !== null ? rollingRollId : crypto.randomUUID();
			
			const finalRoll: Roll = {
				id: rollId,
                name: rollName,
				dice: diceResults,
				modifier: rollModifier,
				status: 'complete'
			};

			// Update state
			latestResults = finalRoll;
			
			// Update the rolling roll if we're rerolling, otherwise add new roll
			if (isReroll) {
				const rollIndex = previousRolls.findIndex(r => r.id === rollingRollId);
				if (rollIndex !== -1) {
					previousRolls[rollIndex] = finalRoll;
				}
				rollingRollId = null;
			} else {
				previousRolls = [...previousRolls, finalRoll];
			}
			
			isRolling = false;

			// Keep diceBox pinned (absolute) - don't reset here
			// It will reset to fixed when a new roll is initiated

			// Don't reset current roll - let it persist so user can easily roll again
			rollingRollData = null;
		} catch (error) {
			console.error('Error finalizing roll:', error);
			resetRollingState();
			resetPosition(); // Reset to fixed on error
		}
	}

	async function handleRoll() {
		// Validate Box is initialized
		if (!Box) {
			console.error('DiceBox is not initialized');
			return;
		}

		// Validate dice are selected
		if (currentRoll.dice.length === 0) {
			return;
		}

		// Cancel any in-progress roll
		cancelCurrentRoll();

		// Close the active roll section
		showCurrentRoll = false;

		// Save dice data before resetting (we need it for the roll)
		const diceToRoll = currentRoll.dice.map(d => ({ ...d }));
		const rollName = currentRoll.name;
		const rollModifier = currentRoll.modifier;

		// Immediately add roll to history with 'rolling' status
		const rollId = crypto.randomUUID();
		const rollingRoll: Roll = {
			id: rollId,
			name: rollName,
			dice: diceToRoll.map(d => ({ ...d })),
			modifier: rollModifier,
			status: 'rolling'
		};
		previousRolls = [...previousRolls, rollingRoll];
		rollingRollId = rollId;
		rollingRollData = { name: rollName, modifier: rollModifier };

		// Clear the active roll so user can start fresh for next roll
		resetCurrentRoll();

		try {
			isRolling = true;

			// Reset to fixed to cover current viewport, then switch to absolute before rolling
			resetPosition();

			// Clear previous dice
			Box.clear();

			// Prepare roll objects and track order
			const { rollObjects, rollOrder } = prepareRollObjects(diceToRoll);
			currentRollOrder = rollOrder;

			// Validate we have at least one valid dice group
			if (rollObjects.length === 0) {
				console.error('No valid dice to roll');
				resetRollingState();
				return;
			}

			// Roll all dice together
			await Box.roll(rollObjects);
		} catch (error) {
			console.error('Error rolling dice:', error);
			resetRollingState();
			resetPosition(); // Reset to fixed on error
		}
	}





	onMount(() => {
		diceBox = document.body.appendChild(document.createElement('div'));
		diceBox.id = 'dice-box';
		diceBox.style.zIndex = '40';
		diceBox.style.pointerEvents = 'none';
        diceBox.style.position = 'absolute';
        diceBox.style.width = '100%';
        diceBox.style.height = 'calc(100% - var(--navbar-height))';
		resetPosition();

Box = new DiceBox('#dice-box', {
    assetPath: '/dice-box/',
    scale: 5,
    gravity: 5,
    mass: 2,
    friction: 0.9,
    angularDamping: 0.5,
    linearDamping: 0.5,
    theme: 'default',
    settleTimeout: 3000,
    onRollComplete: (results) => {
        finalizeRoll(results);
    },
    onBeforeRoll
});

Box.init()
});
</script>

<style>
	/* svelte-ignore a11y-no-onchange */
	:global(#dice-box canvas) {
		width: 100% !important;
		height: 100% !important;
		display: block;
        z-index: 45;
	}

</style>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button class={cn("fixed inset-0 z-45 cursor-default pointer-events-none", diceOnScreen && 'pointer-events-auto')} onclick={cancelCurrentRoll}></button>

<div class={cn('flex items-end gap-3 fixed bottom-[calc(env(safe-area-inset-bottom)+16px)] left-[calc(env(safe-area-inset-left)+16px)] z-45', className)}>
	<!-- dice picker -->
	<div
		class={cn(
			'flex flex-col items-center gap-2 rounded-2xl bg-card border-2 border-primary-muted p-1 shadow-xl',
			showPicker && 'pt-3'
		)}
	>
		{#if showPicker}
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
				class="relative size-12"
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
		{/if}

		<button
			title="Roll Dice"
			class="flex size-12 items-center justify-center"
			onclick={() => (showPicker = !showPicker)}
		>
			{#if showPicker}
				<X class="size-6" />
			{:else}
				<D12 backgroundClasses="fill-primary-muted" foregroundClasses="fill-primary"/>
			{/if}
		</button>
	</div>

	<div class="flex flex-col gap-3">
		<!-- results history -->
		{#if showPicker}


			{#each previousRolls as roll, index (roll.id)}
				{@const isRolling = roll.status === 'rolling'}
				{@const statusText = getRollStatusText(roll)}
                <div class={cn(
					"w-71 flex flex-col gap-2 rounded-2xl p-3 border-2 border-primary-muted shadow-xl bg-card",
					statusText === 'Critical Success' && 'bg-gradient-to-r from-card to-emerald-950',
					statusText === 'with Fear' && 'bg-gradient-to-r from-card to-primary-muted',
					statusText === 'with Hope' && 'bg-gradient-to-r from-card to-accent-muted',
				)}>

					<div class="flex items-center justify-between gap-2">
						<p class="font-eveleth text-sm">{roll.name}</p>
						<Button 
							onclick={() => removeRollFromHistory(roll.id)} 
							size="sm" 
							variant="ghost" 
							class="h-auto p-1 -m-1"
						>
							<X class="size-4" />
						</Button>
					</div>
					
					<!-- Individual dice results -->
					<div class="flex flex-wrap items-center gap-2">
						{#each roll.dice as dice}
							{@const DiceComponent = DICE_COMPONENTS[dice.type]}
							<div class="relative {isRolling ? 'opacity-50' : ''}">
								<DiceComponent class="size-9" />
								{#if !isRolling && dice.result !== undefined}
									<div class="px-1.5 pt-0.5 pb-[1px] absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-background text-xs font-bold">
										{dice.type === "disadvantage" ? '-' : ''}{dice.result}
									</div>
								{/if}
							</div>
						{/each}
						{#if roll.modifier !== 0}
							<div class="size-9 flex items-center justify-center gap-1 {isRolling ? 'opacity-50' : ''}">
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
					<div class="h-8 flex items-center justify-between">
						<span class="text-sm font-bold">Total:</span>
						{#if isRolling}
							<Loader2 class="size-5 animate-spin" />

                            {:else if calculateTotal(roll) === 0}
                            <span class="text-sm font-bold">Cancelled</span>
						{:else}
                            <div class="flex items-center gap-2">
                            <span class="font-eveleth text-xl">
								{calculateTotal(roll)}
							</span>
                            <span class="text-sm font-bold">{statusText}</span>
                            </div>
						{/if}
					</div>

					<!-- Reroll button -->
					<Button
						size="sm"
						class="h-7 mt-1 font-bold bg-primary/80 hover:bg-primary/60"
						onclick={() => rerollHistoryItem(roll.id)}
                        disabled={isRolling}
					>
						{isRolling ? 'Rolling...' : 'Reroll'}
					</Button>
				</div>
			{/each}

            
		{/if}

		<!-- active roll -->
		{#if showCurrentRoll}
			<div class="w-71 flex flex-col gap-2 rounded-2xl bg-card p-3 border-2 border-primary-muted shadow-xl">
				<div class="flex items-center justify-between gap-2">
					<p class="font-eveleth text-sm">New Roll</p>
                    <Button onclick={closeActiveRoll} size="sm" variant="ghost" class="h-auto p-1 -m-1"
						><X class="size-4" /></Button
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

					<div class="flex items-center gap-2 ml-auto">
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
						<p class="text-sm font-bold">
							Mod: <span class="inline-block w-6 text-center font-eveleth">
                                
                                {currentRoll.modifier > 0 ? '+' : ''}{currentRoll.modifier}</span>
						</p>
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
					class="h-7 mt-1 font-bold"
					onclick={handleRoll}
					disabled={currentRoll.dice.length === 0}
				>
					Roll
				</Button>

			</div>
		{/if}
	</div>
</div>
