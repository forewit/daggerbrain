import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getCharacterAccessInternal } from '$lib/server/permissions';
import { get_db, get_auth } from '$lib/remote/utils';

export const load: LayoutServerLoad = async ({ params, platform, locals }) => {
	const characterId = params.uid;
	if (!characterId) {
		throw error(400, 'Character ID is required');
	}

	// Get character access - validates character exists and returns permissions
	// This throws 404 if character doesn't exist
	const event = { platform, locals } as Parameters<typeof get_db>[0];
	const db = get_db(event);
	const { userId } = get_auth(event);
	const access = await getCharacterAccessInternal(db, userId, characterId);

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
