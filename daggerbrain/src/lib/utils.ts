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

/**
 * Converts a character level to its corresponding tier.
 * Tier 1: Level 1
 * Tier 2: Levels 2-4
 * Tier 3: Levels 5-7
 * Tier 4: Levels 8-10
 *
 * @param level - The character level
 * @returns The tier (1, 2, 3, or 4)
 *
 * @example
 * level_to_tier(1) // 1
 * level_to_tier(3) // 2
 * level_to_tier(6) // 3
 * level_to_tier(10) // 4
 */
export function level_to_tier(level: number): 1 | 2 | 3 | 4 {
	if (level === 1) return 1;
	if (level >= 2 && level <= 4) return 2;
	if (level >= 5 && level <= 7) return 3;
	return 4;
}

/**
 * Gets the minimum level required for a given tier.
 *
 * @param tier - The tier (1, 2, 3, or 4)
 * @returns The minimum level for that tier
 *
 * @example
 * tier_to_min_level(1) // 1
 * tier_to_min_level(2) // 2
 * tier_to_min_level(3) // 5
 * tier_to_min_level(4) // 8
 */
export function tier_to_min_level(tier: number): number {
	if (tier === 1) return 1;
	if (tier === 2) return 2;
	if (tier === 3) return 5;
	return 8; // tier 4
}
