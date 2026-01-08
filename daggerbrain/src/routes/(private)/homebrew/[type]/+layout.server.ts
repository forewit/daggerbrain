import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { isEnabledHomebrewType, type HomebrewType } from '$lib/types/homebrew-types';

// All valid homebrew types for URL routing validation
const ALL_HOMEBREW_TYPES: HomebrewType[] = [
	'weapon',
	'armor',
	'beastform',
	'loot',
	'consumable',
	'class',
	'subclass',
	'domain-cards',
	'ancestry-cards',
	'community-cards',
	'transformation-cards'
];

export const load: LayoutServerLoad = async ({ params }) => {
	const type = params.type;

	// First check if it's a valid homebrew type at all
	if (!type || !ALL_HOMEBREW_TYPES.includes(type as HomebrewType)) {
		throw error(404, `Invalid homebrew type: ${type}`);
	}

	// Then check if this type is currently enabled
	if (!isEnabledHomebrewType(type as HomebrewType)) {
		throw error(404, `This homebrew type (${type}) is not yet available.`);
	}

	return {
		type: type as HomebrewType
	};
};
