import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
 * 
 * @param diceString - The dice string (e.g., "1d6+2", "2d4+1d6+4")
 * @param proficiency - The proficiency multiplier (e.g., 1, 2, 3)
 * @returns The modified dice string with dice counts multiplied by proficiency
 * 
 * @example
 * applyProficiencyToDice("1d6", 2) // "2d6"
 * applyProficiencyToDice("2d4+1d6+4", 2) // "4d4+2d6+4"
 * applyProficiencyToDice("1d6+2", 3) // "3d6+2"
 */
export function applyProficiencyToDice(diceString: string, proficiency: number): string {
	if (proficiency === 1) {
		return diceString;
	}

	// Match dice patterns like "1d6", "2d4", etc.
	// This regex matches: optional number, 'd', followed by a number
	return diceString.replace(/(\d+)d(\d+)/g, (match, numDice, dieSize) => {
		const newNumDice = parseInt(numDice, 10) * proficiency;
		return `${newNumDice}d${dieSize}`;
	});
}
