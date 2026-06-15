import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Range } from '@convex/schemas/rules';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import type { DiceType } from '@convex/schemas/dice';
import type { CompendiumContent } from '@convex/schemas/compendium';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type WithoutChild<T> = T extends { child?: unknown } ? Omit<T, 'child'> : T;
export type WithoutChildren<T> = T extends { children?: unknown } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function capitalize(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Renders markdown to sanitized HTML
 * @param markdown - The markdown string to render
 * @returns Sanitized HTML string safe for rendering
 */
export function renderMarkdown(markdown: string): string {
	if (!markdown || typeof markdown !== 'string') {
		return '';
	}

	// Convert markdown to HTML (synchronous mode)
	// marked.parse() is synchronous by default, but TypeScript types indicate it could be async
	const html = marked.parse(markdown) as string;

	// Sanitize the HTML to prevent XSS attacks
	const sanitized = DOMPurify.sanitize(html);

	return sanitized;
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
export function increase_range(range: Range): Range {
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

/**
 * Formats a timestamp (milliseconds since epoch) as "Jan 4, 2026"
 *
 * @param timestamp - The timestamp in milliseconds
 * @returns The formatted date string (e.g., "Jan 4, 2026")
 *
 * @example
 * formatDate(1573516800000) // "Nov 12, 2019"
 */
export function formatDate(timestamp: number | Date): string {
	const date = new Date(timestamp);
	const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	const month = monthNames[date.getMonth()];
	const day = date.getDate();
	const year = date.getFullYear();
	return `${month} ${day}, ${year}`;
}

/**
 * Formats a timestamp as a human-readable relative time string.
 * Shows "X sec ago", "X min ago", "X hours ago", "X days ago" for recent times,
 * and a date like "Jan 6, 2026" for anything older than 7 days.
 *
 * @param timestamp - The timestamp in milliseconds
 * @returns A human-readable time string
 *
 * @example
 * formatTimeAgo(Date.now() - 30000) // "30 sec ago"
 * formatTimeAgo(Date.now() - 300000) // "5 min ago"
 * formatTimeAgo(Date.now() - 7200000) // "2 hours ago"
 * formatTimeAgo(Date.now() - 86400000 * 3) // "3 days ago"
 * formatTimeAgo(Date.parse("2026-02-02")) // "Feb 2, 2026"
 */
export function formatTimeAgo(timestamp: number): string {
	const now = Date.now();
	const diffMs = now - timestamp;
	const diffSec = Math.floor(diffMs / 1000);
	const diffMin = Math.floor(diffSec / 60);
	const diffHours = Math.floor(diffMin / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffSec < 60) {
		return `${Math.max(1, diffSec)} sec ago`;
	}
	if (diffMin < 60) {
		return `${diffMin} min ago`;
	}
	if (diffHours < 24) {
		return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
	}
	if (diffDays <= 7) {
		return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
	}

	return formatDate(timestamp);
}

/**
 * Adds 1d4 bonus damage to a dice string.
 * If the string already contains d4 dice, increments the d4 count instead.
 * Static modifiers are preserved at the end.
 *
 * @param diceString - The dice string (e.g., "1d12+2", "2d4+6", "2d8+1d6")
 * @returns The modified dice string with 1d4 added
 *
 * @example
 * addBonusDamageDie("1d12+2") // "1d12+1d4+2"
 * addBonusDamageDie("2d4+6") // "3d4+6"
 * addBonusDamageDie("2d8+1d6") // "2d8+1d6+1d4"
 * addBonusDamageDie("d4") // "2d4"
 */
export function addBonusDamageDie(diceString: string): string {
	if (!diceString || typeof diceString !== 'string') {
		return '1d4';
	}

	// Check if d4 already exists in the string
	const d4Match = diceString.match(/(\d*)d4/);
	if (d4Match) {
		// Increment existing d4 count
		return diceString.replace(/(\d*)d4/, (match, numDice) => {
			const count = numDice === '' ? 1 : parseInt(numDice, 10);
			return `${count + 1}d4`;
		});
	}

	// No d4 present — insert 1d4 before any trailing static modifier
	const trailingModifier = diceString.match(/([+-]\d+)$/);
	if (trailingModifier) {
		const base = diceString.slice(0, trailingModifier.index);
		return `${base}+1d4${trailingModifier[0]}`;
	}

	// No static modifier, just append
	return `${diceString}+1d4`;
}

/**
 * Parses a dice string into an array of dice types and a modifier.
 * Handles formats like "2d6+3", "1d20-2", "d6", "2d4+1d6+4", etc.
 *
 * @param diceString - The dice string to parse (e.g., "2d6+3", "1d20-2", "d6")
 * @returns An object with an array of dice types and a modifier number
 *
 * @example
 * parseDiceString("2d6+3") // { dice: [{ type: 'd6' }, { type: 'd6' }], modifier: 3 }
 * parseDiceString("1d20-2") // { dice: [{ type: 'd20' }], modifier: -2 }
 * parseDiceString("d6") // { dice: [{ type: 'd6' }], modifier: 0 }
 * parseDiceString("2d4+1d6+4") // { dice: [{ type: 'd4' }, { type: 'd4' }, { type: 'd6' }], modifier: 4 }
 */
export function parseDiceString(diceString: string): {
	dice: { type: DiceType }[];
	modifier: number;
} {
	const dice: { type: DiceType }[] = [];
	let modifier = 0;

	if (!diceString || typeof diceString !== 'string') {
		return { dice, modifier };
	}

	// Match all dice patterns like "1d6", "2d4", "d6", etc.
	const diceMatches = diceString.matchAll(/(\d*)d(\d+)/g);
	for (const match of diceMatches) {
		const numDice = match[1] === '' ? 1 : parseInt(match[1], 10);
		const dieSize = parseInt(match[2], 10);
		const dieType = `d${dieSize}` as DiceType;

		// Only add valid dice types (d4, d6, d8, d10, d12, d20)
		// Note: hope, fear, advantage, disadvantage are not parsed from standard dice strings
		if (['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].includes(dieType)) {
			for (let i = 0; i < numDice; i++) {
				dice.push({ type: dieType });
			}
		}
	}

	// Extract modifier (positive or negative number at the end)
	// Match patterns like "+3", "-2", "+10", etc.
	const modifierMatch = diceString.match(/([+-]\d+)$/);
	if (modifierMatch) {
		modifier = parseInt(modifierMatch[1], 10);
	}

	return { dice, modifier };
}

/**
 * Merges multiple compendiums into one
 *
 * @param compendiums one or more compendiumContent variables
 * @returns merged compendiumContent variable
 */
export function merge_compendium_content(...compendiums: CompendiumContent[]): CompendiumContent {
	const result: CompendiumContent = {
		primary_weapons: {},
		secondary_weapons: {},
		armor: {},
		loot: {},
		consumables: {},
		beastforms: {},
		classes: {},
		subclasses: {},
		domain_cards: {},
		ancestry_cards: {},
		community_cards: {},
		transformation_cards: {},
		domains: {},
		adversaries: {},
		environments: {}
	};

	for (const compendium of compendiums) {
		// Shallow merges (later overrides earlier)
		Object.assign(result.primary_weapons, compendium.primary_weapons);
		Object.assign(result.secondary_weapons, compendium.secondary_weapons);
		Object.assign(result.armor, compendium.armor);
		Object.assign(result.loot, compendium.loot);
		Object.assign(result.consumables, compendium.consumables);
		Object.assign(result.beastforms, compendium.beastforms);
		Object.assign(result.classes, compendium.classes);
		Object.assign(result.subclasses, compendium.subclasses);
		Object.assign(result.ancestry_cards, compendium.ancestry_cards);
		Object.assign(result.community_cards, compendium.community_cards);
		Object.assign(result.transformation_cards, compendium.transformation_cards);
		Object.assign(result.domains, compendium.domains);
		Object.assign(result.domain_cards, compendium.domain_cards);
		Object.assign(result.adversaries, compendium.adversaries);
		Object.assign(result.environments, compendium.environments);
	}

	return result;
}
