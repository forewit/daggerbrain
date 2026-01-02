import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { is_campaign_gm } from '$lib/remote/permissions.remote';
import { get_campaign_members } from '$lib/remote/campaigns.remote';
import { get_auth } from '$lib/remote/utils';
import { getRequestEvent } from '$app/server';
import type { CampaignMember } from '$lib/types/campaign-types';

export const load: LayoutServerLoad = async ({ params }) => {
	const event = getRequestEvent();
	if (!event) {
		throw error(500, 'Request event not available');
	}

	const { userId } = get_auth(event);
	if (!userId) {
		throw error(401, 'Unauthorized');
	}

	const campaignId = params.id;
	if (!campaignId) {
		throw error(400, 'Campaign ID is required');
	}

	// Get campaign members to verify user is a member and get their role
	const members = await get_campaign_members(campaignId);
	const userMembership = members.find((m) => m.user_id === userId) || null;

	// If user is not a member, they shouldn't access this page
	if (!userMembership) {
		throw error(403, 'You are not a member of this campaign');
	}

	// Check if user is GM
	const isGM = await is_campaign_gm({ campaignId });

	return {
		role: (isGM ? 'gm' : 'player') as 'gm' | 'player',
		userMembership: userMembership as CampaignMember
	};
};

