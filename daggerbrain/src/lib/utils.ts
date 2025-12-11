import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Ranges } from '$lib/types/compendium-types';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function capitalize(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Applies proficiency multiplier to dice in a dice string.
 * Multiplies the number of dice (XdY) by proficiency, but keeps static bonuses unchanged.
 * Handles both "1d6" and "d6" formats (treating "d6" as "1d6").
 *
 * @param diceString - The dice string (e.g., "1d6+2", "2d4+1d6+4", "d6")
 * @param proficiency - The proficiency multiplier (e.g., 1, 2, 3)
 * @returns The modified dice string with dice counts multiplied by proficiency
 *
 * @example
 * applyProficiencyToDice("1d6", 2) // "2d6"
 * applyProficiencyToDice("d6", 4) // "4d6"
 * applyProficiencyToDice("2d4+1d6+4", 2) // "4d4+2d6+4"
 * applyProficiencyToDice("1d6+2", 3) // "3d6+2"
 */
export function applyProficiencyToDice(diceString: string, proficiency: number): string {
	if (proficiency === 1) {
		return diceString;
	}

	// Match dice patterns like "1d6", "2d4", "d6", etc.
	// This regex matches: optional number (defaults to 1 if missing), 'd', followed by a number
	return diceString.replace(/(\d*)d(\d+)/g, (match, numDice, dieSize) => {
		const numDiceValue = numDice === '' ? 1 : parseInt(numDice, 10);
		const newNumDice = numDiceValue * proficiency;
		return `${newNumDice}d${dieSize}`;
	});
}

/**
 * Increases each die size by 1 in a damage dice string.
 * Handles complex strings like "2d8+4" or "d6+d20".
 *
 * @param damage_dice - The damage dice string (e.g., "d4", "2d8+4", "d6+d20")
 * @returns The modified dice string with each die size increased by 1
 *
 * @example
 * increaseDie("d4") // "d6"
 * increaseDie("2d8+4") // "2d10+4"
 * increaseDie("d6+d20") // "d8+d20"
 * increaseDie("d12") // "d12" (stays the same)
 */
export function increaseDie(damage_dice: string): string {
	// Handle complex strings like "2d8+4", "d6+d20", etc.
	return damage_dice.replace(/\bd(\d+)\b/g, (match, num) => {
		const dieNum = parseInt(num, 10);
		if (dieNum === 4) return 'd6';
		if (dieNum === 6) return 'd8';
		if (dieNum === 8) return 'd10';
		if (dieNum === 10) return 'd12';
		// d12 and d20 stay the same
		return match;
	});
}

/**
 * Increases a range value by one step.
 * 'Melee' -> 'Very Close' -> 'Close' -> 'Far' -> 'Very Far'
 * 'Very Far' remains 'Very Far' (maximum range).
 *
 * @param range - The current range value
 * @returns The next range value in the progression
 *
 * @example
 * increase_range('Melee') // 'Very Close'
 * increase_range('Very Close') // 'Close'
 * increase_range('Close') // 'Far'
 * increase_range('Far') // 'Very Far'
 * increase_range('Very Far') // 'Very Far'
 */
export function increase_range(range: Ranges): Ranges {
	switch (range) {
		case 'Melee':
			return 'Very Close';
		case 'Very Close':
			return 'Close';
		case 'Close':
			return 'Far';
		case 'Far':
			return 'Very Far';
		case 'Very Far':
			return 'Very Far';
		default:
			return range;
	}
}
