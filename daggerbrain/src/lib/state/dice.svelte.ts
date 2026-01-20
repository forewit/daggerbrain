import type { DiceType, Roll, RollInput } from '@shared/types/user.types';
import { getContext, setContext } from 'svelte';
import DiceBox from '@3d-dice/dice-box';

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

function diceContext() {
	let history = $state<Roll[]>([]);
	let lastRoll = $state<Roll | null>(null);
	let isRolling = $state(false);
	let diceOnScreen = $state(false);

	// Internal state
	let Box: DiceBox | null = null;
	let diceBox: HTMLDivElement | null = null;
	let currentRollOrder: Array<{ type: string; themeColor: string; sides: number }> = [];
	let rollingRollId: string | null = null;
	let rollingRollData: { name: string; modifier: number } | null = null;

	// --- Helper functions ---
	function resetRollingState() {
		isRolling = false;
		currentRollOrder = [];
		rollingRollId = null;
		rollingRollData = null;
	}

	function resetPosition() {
		if (!diceBox) return;
		diceBox.style.top = `calc(var(--navbar-height) + ${window.scrollY}px)`;
	}

	// --- Roll pipeline functions ---
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

	function finalizeRoll(rollGroups: any[], rollName: string, rollModifier: number) {
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
				const rollIndex = history.findIndex((r) => r.id === rollingRollId);
				if (rollIndex !== -1) {
					history[rollIndex] = finalRoll;
					history = [...history]; // Trigger reactivity
				}
				rollingRollId = null;
			} else {
				history = [...history, finalRoll];
			}

			// Cap history at 20
			if (history.length > 20) {
				history = history.slice(0, 20);
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

	async function handleRoll(dice: Roll['dice'], rollName: string, rollModifier: number) {
		if (!Box) {
			console.error('DiceBox is not initialized');
			return;
		}

		if (dice.length === 0) return;

		cancelActiveRoll();

		const rollId = crypto.randomUUID();
		const rollingRoll: Roll = {
			id: rollId,
			name: rollName,
			dice: dice.map((d) => ({ ...d })),
			modifier: rollModifier,
			status: 'rolling'
		};
		history = [...history, rollingRoll];
		rollingRollId = rollId;
		rollingRollData = { name: rollName, modifier: rollModifier };

		try {
			isRolling = true;
			resetPosition();
			Box.clear();

			const { rollObjects, rollOrder } = prepareRollObjects(dice);
			currentRollOrder = rollOrder;

			if (rollObjects.length === 0) {
				console.error('No valid dice to roll');
				resetRollingState();
				return;
			}

			lastRoll = rollingRoll;
			await Box.roll(rollObjects);
		} catch (error) {
			console.error('Error rolling dice:', error);
			resetRollingState();
			resetPosition();
		}
	}

	function cancelActiveRoll() {
		diceOnScreen = false;

		if (lastRoll) {
			lastRoll.status = 'complete';
			lastRoll = { ...lastRoll }; // Trigger reactivity
		}

		if (Box) {
			Box.clear();
		}

		if (rollingRollId !== null) {
			const rollIndex = history.findIndex((r) => r.id === rollingRollId);
			if (rollIndex !== -1 && history[rollIndex].status === 'rolling') {
				history = history.filter((r) => r.id !== rollingRollId);
			}
		}

		resetRollingState();
	}

	// --- Roll calculations ---
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

		// Get all hope dice results
		const hopeDice = roll.dice.filter((d) => d.type === 'hope' && d.result !== undefined);
		const hopeValues = hopeDice.map((d) => d.result || 0);
		const totalHope = hopeValues.reduce((sum, v) => sum + v, 0);

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

	// --- Public API ---
	const init = () => {
		// Remove any existing dice box
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

		resetPosition();

		Box = new DiceBox('#dice-box', {
			assetPath: '/dice-box/',
			scale: 5,
			gravity: 5,
			mass: 2,
			angularDamping: 0.5,
			linearDamping: 0.5,
			theme: 'default',
			settleTimeout: 3000,
			onRollComplete: (results) => {
				const name = rollingRollData?.name ?? 'Roll';
				const modifier = rollingRollData?.modifier ?? 0;
				finalizeRoll(results, name, modifier);
			},
			onBeforeRoll
		});

		Box.init();
	};

	const destroy = () => {

	};

	const roll = (input: RollInput) => {
		// Validate input
		if (!input.dice || input.dice.length === 0) {
			console.warn('Cannot roll: dice array is empty');
			return;
		}

		// Cancel any active roll
		cancelActiveRoll();

		// Execute the roll
		const rollName = input.name ?? 'Roll';
		const rollModifier = input.modifier ?? 0;
		const diceToRoll = input.dice.map((d) => ({ type: d.type }));
		handleRoll(diceToRoll, rollName, rollModifier);
	};

	return {
		get history() {
			return history;
		},
		set history(value: Roll[]) {
			history = value;
		},
		get lastRoll() {
			return lastRoll;
		},
		get isRolling() {
			return isRolling;
		},
		get diceOnScreen() {
			return diceOnScreen;
		},
		init,
		destroy,
		roll,
		cancelActiveRoll,
		calculateTotal,
		getRollStatusText
	};
}

const DICE_CONTEXT_KEY = Symbol('DiceContext');

export const setDiceContext = () => {
	const newDiceContext = diceContext();
	return setContext(DICE_CONTEXT_KEY, newDiceContext);
};

export const getDiceContext = (): ReturnType<typeof setDiceContext> => {
	return getContext(DICE_CONTEXT_KEY) as ReturnType<typeof setDiceContext>;
};
