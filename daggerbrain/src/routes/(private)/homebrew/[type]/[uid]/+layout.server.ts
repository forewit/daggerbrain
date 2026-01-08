import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getHomebrewAccess } from '$lib/remote/permissions.remote';
import type { HomebrewTableType } from '$lib/types/permissions-types';

// Map URL types to database table types
// Some URL types map to multiple DB types (e.g., 'weapon' -> primary_weapons OR secondary_weapons)
const urlToDbTypes: Record<string, HomebrewTableType[]> = {
	weapon: ['primary_weapons', 'secondary_weapons'],
	armor: ['armor'],
	beastform: ['beastforms'],
	loot: ['loot'],
	consumable: ['consumables'],
	class: ['classes'],
	subclass: ['subclasses'],
	'domain-cards': ['domain_cards'],
	'ancestry-cards': ['ancestry_cards'],
	'community-cards': ['community_cards'],
	'transformation-cards': ['transformation_cards']
};

export const load: LayoutServerLoad = async ({ params }) => {
	const { type, uid } = params;

	if (!type || !uid) {
		throw error(400, 'Type and UID are required');
	}

	const dbTypes = urlToDbTypes[type];
	if (!dbTypes) {
		throw error(404, `Invalid homebrew type: ${type}`);
	}

	// Try each possible DB type until we find the item
	let lastError: unknown = null;
	for (const dbType of dbTypes) {
		try {
			const access = await getHomebrewAccess({ homebrewType: dbType, homebrewId: uid });

			// If user doesn't have view permission, return 403
			if (!access.canView) {
				throw error(403, 'You do not have permission to view this item');
			}

			return {
				type,
				uid,
				canEdit: access.canEdit,
				isOwner: access.isOwner
			};
		} catch (err) {
			lastError = err;
			// If it's a 404, try the next type
			// Otherwise, rethrow the error
			if (err && typeof err === 'object' && 'status' in err && err.status !== 404) {
				throw err;
			}
		}
	}

	console.log('test');
	// If we tried all types and none worked, throw 404
	throw error(404, 'Homebrew item not found');
};
