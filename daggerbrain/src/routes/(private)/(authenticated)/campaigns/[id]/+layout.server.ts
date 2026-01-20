import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getCampaignAccessInternal } from '$lib/server/permissions';
import { get_db, get_auth } from '$lib/remote/utils';

export const load: LayoutServerLoad = async ({ params, platform, locals }) => {
	const campaignId = params.id;
	if (!campaignId) {
		throw error(400, 'Campaign ID is required');
	}

	// Get campaign access - validates authentication and returns membership + permissions
	const event = { platform, locals } as Parameters<typeof get_db>[0];
	const db = get_db(event);
	const { userId } = get_auth(event);
	const access = await getCampaignAccessInternal(db, userId, campaignId);

	// If user is not a member, they shouldn't access this page
	if (!access.membership) {
		throw error(403, 'You are not a member of this campaign');
	}

	return {
		role: access.role!,
		userMembership: access.membership
	};
};
