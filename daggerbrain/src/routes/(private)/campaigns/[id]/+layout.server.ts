import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getCampaignAccess } from '$lib/remote/permissions.remote';

export const load: LayoutServerLoad = async ({ params }) => {
	const campaignId = params.id;
	if (!campaignId) {
		throw error(400, 'Campaign ID is required');
	}

	// Get campaign access - validates authentication and returns membership + permissions
	const access = await getCampaignAccess(campaignId);

	// If user is not a member, they shouldn't access this page
	if (!access.membership) {
		throw error(403, 'You are not a member of this campaign');
	}

	return {
		role: access.role!,
		userMembership: access.membership
	};
};
