import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getCharacterAccess } from '$lib/remote/permissions.remote';

export const load: LayoutServerLoad = async ({ params }) => {
	const characterId = params.uid;
	if (!characterId) {
		throw error(400, 'Character ID is required');
	}

	// Get character access - validates character exists and returns permissions
	// This throws 404 if character doesn't exist
	const access = await getCharacterAccess(characterId);

	// If user doesn't have view permission, return 403
	if (!access.canView) {
		throw error(403, 'You do not have permission to view this character');
	}

	return {
		characterId,
		canEdit: access.canEdit,
		isOwner: access.isOwner,
		campaignRole: access.campaignRole
	};
};
