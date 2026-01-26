export type HomebrewTableType =
	| 'classes'
	| 'subclasses'
	| 'domains'
	| 'domain_cards'
	| 'primary_weapons'
	| 'secondary_weapons'
	| 'armor'
	| 'loot'
	| 'consumables'
	| 'ancestry_cards'
	| 'community_cards'
	| 'transformation_cards'
	| 'beastforms';

export type HomebrewType =
	| 'weapon'
	| 'armor'
	| 'beastform'
	| 'loot'
	| 'consumable'
	| 'class'
	| 'subclass'
	| 'domain-cards'
	| 'ancestry-cards'
	| 'community-cards'
	| 'transformation-cards';

/**
 * Runtime constant array of currently enabled homebrew types.
 * This is the single source of truth for which homebrew types are accessible to users.
 * When a new type's UI is ready, add it here to enable it across the entire application.
 */
export const ENABLED_HOMEBREW_TYPES = [
	'weapon',
	'armor',
	'beastform',
	'loot',
	'consumable',
	'domain-cards',
	'ancestry-cards',
	'community-cards',
	'subclass',
	'class'
] as const satisfies readonly HomebrewType[];

/**
 * Type representing only the currently enabled homebrew types.
 * Derived from ENABLED_HOMEBREW_TYPES for type safety.
 */
export type EnabledHomebrewTypes = (typeof ENABLED_HOMEBREW_TYPES)[number];

/**
 * Type guard to check if a homebrew type is currently enabled.
 * @param type - The homebrew type to check
 * @returns true if the type is enabled, false otherwise
 */
export function isEnabledHomebrewType(type: HomebrewType): type is EnabledHomebrewTypes {
	return (ENABLED_HOMEBREW_TYPES as readonly string[]).includes(type);
}
