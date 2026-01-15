import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { get_campaign_by_invite_code } from '$lib/remote/campaigns/campaigns.remote';

export const load: PageServerLoad = async ({ params }) => {
	const inviteCode = params.uid;
	if (!inviteCode) {
		throw error(400, 'Invite code is required');
	}

	// Get campaign join preview data - this throws 404 if campaign doesn't exist
	// All data fetching is handled by the remote function
	return await get_campaign_by_invite_code(inviteCode);
};
