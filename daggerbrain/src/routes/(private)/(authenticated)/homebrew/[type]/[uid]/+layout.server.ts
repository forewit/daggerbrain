import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { HomebrewType } from '@shared/types/homebrew.types';
import { isEnabledHomebrewType } from '@shared/types/homebrew.types';

export const load: LayoutServerLoad = async ({ params }) => {
	const { type, uid } = params;

	if (!type || !uid) {
		throw error(400, 'Type and UID are required');
	}

	// Check if this type is currently enabled
	if (!isEnabledHomebrewType(type as HomebrewType)) {
		throw error(404, `This homebrew type (${type}) is not yet available.`);
	}

	return {
		type: type as HomebrewType,
		uid
	};
};
