<script lang="ts">
	import { cn } from '$lib/utils';
	import X from '@lucide/svelte/icons/x';
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
	import { scale } from 'svelte/transition';

	let { class: className = '' } = $props();

	type Roll = {
		dice: {
			type:
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
			result?: number;
			disabled?: boolean;
		}[];
		modifier: number;
	};

	let previousRolls = $state<Roll[]>([]);

	let currentRoll = $state<Roll>({
		dice: [],
		modifier: 0
	});

	let showCurrentRoll = $state(false);
	let showPicker = $state(false);
	let showResult = $state(true);
	let latestResults = $state<Roll | null>(null);
	let isRolling = $state(false);
	let diceBox = $state<HTMLDivElement | null>(null);


    function resetPosition() {
        if (!diceBox) return;
		diceBox.style.top = `calc(var(--navbar-height) + ${window.scrollY}px)`;
    }

	function resetCurrentRoll() {
		currentRoll = {
			dice: [],
			modifier: 0
		};
	}

	function calculateTotal(roll: Roll): number {
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
		
		return standardSum + advantageSum - disadvantageSum + roll.modifier;
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

	$effect(() => {
		showCurrentRoll = currentRoll.dice.length > 0;
	});

	$effect(() => {
		if (!showPicker) {
			resetCurrentRoll();
		}
	});

	let Box: DiceBox | null = null;
	
	// Store the original dice order to map results back correctly
	let currentRollOrder: Array<{type: string, themeColor: string, sides: number}> = [];


	function finalizeRoll(rollGroups: any[]) {
		try {
			if (!rollGroups || rollGroups.length === 0) {
				console.warn('No roll results received');
				isRolling = false;
				return;
			}

			// Validate we have the expected number of results
			if (currentRollOrder.length === 0) {
				console.error('No roll order tracked - cannot map results');
				isRolling = false;
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
			const finalRoll: Roll = {
				dice: diceResults,
				modifier: currentRoll.modifier
			};

			// Update state
			latestResults = finalRoll;
			previousRolls = [...previousRolls, finalRoll];
			isRolling = false;

			// Keep diceBox pinned (absolute) - don't reset here
			// It will reset to fixed when a new roll is initiated

			// Reset current roll
			resetCurrentRoll();
			showPicker = false;
		} catch (error) {
			console.error('Error finalizing roll:', error);
			isRolling = false;
			currentRollOrder = [];
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

		try {
			isRolling = true;

			// Reset to fixed to cover current viewport, then switch to absolute before rolling
			resetPosition();

			// Clear previous dice
			Box.clear();

			// Group dice by type and themeColor
			const diceGroups = new Map<string, { type: string; sides: number; themeColor: string; count: number }>();
			
			for (const die of currentRoll.dice) {
				let sides: number;
				let themeColor= '#2a2045';

				// Map dice type to sides and themeColor
				switch (die.type) {
					case 'd4':
						sides = 4;
						break;
					case 'd6':
						sides = 6;
						break;
					case 'd8':
						sides = 8;
						break;
					case 'd10':
						sides = 10;
						break;
					case 'd12':
						sides = 12;
						break;
					case 'd20':
						sides = 20;
						break;
					case 'hope':
						sides = 12;
						themeColor = '#fde07d';
						break;
					case 'fear':
						sides = 12;
						themeColor = '#6341b2';
						break;
					case 'advantage':
						sides = 6;
						themeColor = '#009966';
						break;
					case 'disadvantage':
						sides = 6;
						themeColor = '#a50036';
						break;
					default:
						console.warn(`Unknown dice type: ${die.type}`);
						continue; // Skip unknown dice types
				}

				const key = `${sides}-${themeColor}`;
				const existing = diceGroups.get(key);
				if (existing) {
					existing.count++;
				} else {
					diceGroups.set(key, { type: die.type, sides, themeColor, count: 1 });
				}
			}

			// Validate we have at least one valid dice group
			if (diceGroups.size === 0) {
				console.error('No valid dice to roll');
				isRolling = false;
				return;
			}

			// Build roll objects array and track order
			const rollObjects: any[] = [];
			currentRollOrder = [];

			for (const [key, group] of diceGroups.entries()) {
				rollObjects.push({
					qty: group.count,
					sides: group.sides,
					theme: 'default',
					themeColor: group.themeColor
				});

				// Track order for mapping results back
				for (let i = 0; i < group.count; i++) {
					currentRollOrder.push({
						type: group.type,
						themeColor: group.themeColor,
						sides: group.sides
					});
				}
			}

			// Roll all dice together
			await Box.roll(rollObjects);
		} catch (error) {
			console.error('Error rolling dice:', error);
			isRolling = false;
			currentRollOrder = [];
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
    gravity: 2,
    mass: 2,
    friction: 0.9,
    angularDamping: 0.5,
    linearDamping: 0.5,
    theme: 'default',
    settleTimeout: 3000,
    onRollComplete: (results) => {
        finalizeRoll(results);
    }
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

<div class={cn('flex items-end gap-3', className)}>
	<!-- dice picker -->
	<div
		class={cn(
			'flex flex-col items-center gap-2 rounded-2xl bg-card border-2 p-1 shadow-xl',
			showPicker && 'pt-3'
		)}
	>
		{#if showPicker}
			<button
				title="d4"
				class="relative"
				onclick={() => {
					currentRoll.dice.push({ type: 'd4' });
				}}
			>
				<D4 />
				<p
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-eveleth drop-shadow-[0_0_2px_black]"
				>
					4
				</p>
			</button>
			<button
				title="d6"
				class="relative"
				onclick={() => {
					currentRoll.dice.push({ type: 'd6' });
				}}
			>
				<D6 />
				<p
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-eveleth drop-shadow-[0_0_2px_black]"
				>
					6
				</p>
			</button>
			<button
				title="d8"
				class="relative"
				onclick={() => {
					currentRoll.dice.push({ type: 'd8' });
				}}
			>
				<D8 />
				<p
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-eveleth drop-shadow-[0_0_2px_rgba(0,0,0,1)]"
				>
					8
				</p>
			</button>
			<button
				title="d10"
				class="relative"
				onclick={() => {
					currentRoll.dice.push({ type: 'd10' });
				}}
			>
				<D10 />
				<p
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-eveleth drop-shadow-[0_0_2px_black]"
				>
					10
				</p>
			</button>
			<button
				title="d12"
				class="relative"
				onclick={() => {
					currentRoll.dice.push({ type: 'd12' });
				}}
			>
				<D12 />
				<p
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-eveleth drop-shadow-[0_0_2px_black]"
				>
					12
				</p>
			</button>
			<button
				title="d20"
				class="relative mt-0.5 mb-1"
				onclick={() => {
					currentRoll.dice.push({ type: 'd20' });
				}}
			>
				<D20 />
				<p
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-eveleth drop-shadow-[0_0_2px_black]"
				>
					20
				</p>
			</button>
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
				<D12 />
			{/if}
		</button>
	</div>

	<div class="flex flex-col gap-3">
		<!-- results -->
		{#if showResult && latestResults}
			<div class="rounded-2xl bg-card p-3 border-2 shadow-xl">
				<div class="flex items-center justify-between gap-2 mb-2">
					<p class="font-eveleth text-sm">Results</p>
				</div>
				
				<!-- Individual dice results -->
				<div class="flex flex-wrap items-center gap-2 mb-2">
					{#each latestResults.dice as dice}
						<div class="relative">
							{#if dice.type === 'd4'}
								<D4 class="size-9" />
							{:else if dice.type === 'd6'}
								<D6 class="size-9" />
							{:else if dice.type === 'd8'}
								<D8 class="size-9" />
							{:else if dice.type === 'd10'}
								<D10 class="size-9" />
							{:else if dice.type === 'd12'}
								<D12 class="size-9" />
							{:else if dice.type === 'd20'}
								<D20 class="size-9" />
							{:else if dice.type === 'hope'}
								<Hope class="size-9" />
							{:else if dice.type === 'fear'}
								<Fear class="size-9" />
							{:else if dice.type === 'advantage'}
								<Advantage class="size-9" />
							{:else if dice.type === 'disadvantage'}
								<Disadvantage class="size-9" />
							{/if}
							{#if dice.result !== undefined}
								<div class="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-background border-2 border-foreground text-xs font-bold">
									{dice.result}
								</div>
							{/if}
						</div>
					{/each}
				</div>
				
				<!-- Advantage/Disadvantage special display -->
				{#each latestResults.dice as dice}
					{#if (dice.type === 'advantage' || dice.type === 'disadvantage') && dice.result !== undefined}
						<div class="text-xs mb-1">
							<span class="font-bold">
								{dice.type === 'advantage' ? 'Advantage' : 'Disadvantage'}:
							</span>
							<span class="ml-1">
								{dice.type === 'advantage' ? '+' : '-'}{dice.result}
							</span>
						</div>
					{/if}
				{/each}
				
				<!-- Total -->
				<div class="flex items-center justify-between pt-2 border-t">
					<span class="text-sm font-bold">Total:</span>
					<span class="font-eveleth text-lg">
						{calculateTotal(latestResults)}
						{#if latestResults.modifier !== 0}
							<span class="text-xs text-muted-foreground ml-1">
								({calculateBaseTotal(latestResults)}
								{#if latestResults.modifier > 0}
									+{latestResults.modifier}
								{:else}
									{latestResults.modifier}
								{/if})
							</span>
						{/if}
					</span>
				</div>
			</div>
		{/if}

		<!-- active roll -->
		{#if showCurrentRoll}
			<div class="w-71 flex flex-col gap-2 rounded-2xl bg-card p-3 border-2 shadow-xl">
				<div class="flex items-center justify-between gap-2">
					<p class="font-eveleth text-sm">New Roll</p>
                    <Button onclick={resetCurrentRoll} size="sm" variant="ghost" class="h-auto p-0"
						><X class="size-4" /></Button
					>
				</div>

				<!-- chosen dice -->
				<div class="flex flex-wrap items-center gap-2">
					{#each currentRoll.dice as dice, index}
						<button
                        transition:scale={{ duration: 100 }}
							onclick={() => {
								currentRoll.dice.splice(index, 1);
							}}
						>
							{#if dice.type === 'd4'}
								<D4 class="size-9" />
							{:else if dice.type === 'd6'}
								<D6 class="size-9" />
							{:else if dice.type === 'd8'}
								<D8 class="size-9" />
							{:else if dice.type === 'd10'}
								<D10 class="size-9" />
							{:else if dice.type === 'd12'}
								<D12 class="size-9" />
							{:else if dice.type === 'd20'}
								<D20 class="size-9" />
							{:else if dice.type === 'hope'}
								<Hope class="size-9" />
							{:else if dice.type === 'fear'}
								<Fear class="size-9" />
							{:else if dice.type === 'advantage'}
								<Advantage class="size-9" />
							{:else if dice.type === 'disadvantage'}
								<Disadvantage class="size-9" />
							{/if}
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
							Mod: <span class="inline-block w-6 text-center font-eveleth">{currentRoll.modifier}</span>
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
					disabled={isRolling || currentRoll.dice.length === 0}
				>
					{isRolling ? 'Rolling...' : 'Roll'}
				</Button>

			</div>
		{/if}
	</div>
</div>
