import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { HomebrewType } from '$lib/types/homebrew-types';

// Valid homebrew types for URL routing
const validTypes: HomebrewType[] = [
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

	if (!type || !validTypes.includes(type as HomebrewType)) {
		throw error(404, `Invalid homebrew type: ${type}`);
	}

	return {
		type: type as HomebrewType
	};
};
