import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { get_campaign_by_invite_code, get_campaign_members } from '$lib/remote/campaigns/campaigns.remote';
import { getRequestEvent } from '$app/server';
import { get_db, get_auth } from '$lib/remote/utils';
import { eq, and } from 'drizzle-orm';
import { campaign_members_table, campaign_characters_table } from '$lib/server/db/campaigns.schema';
import { characters_table } from '$lib/server/db/characters.schema';

export const load: PageServerLoad = async ({ params }) => {
	const inviteCode = params.uid;
	if (!inviteCode) {
		throw error(400, 'Invite code is required');
	}

	// Get campaign by invite code - this throws 404 if campaign doesn't exist
	const campaign = await get_campaign_by_invite_code(inviteCode);
	const campaignId = campaign.id;

	// Get campaign members to find GM and check if user is a member
	const members = await get_campaign_members(campaignId);

	// Get current user ID
	const event = getRequestEvent();
	const { userId } = get_auth(event);

	// Find GM member
	const gmMember = members.find((m) => m.role === 'gm');
	const gmDisplayName = gmMember?.display_name || null;

	// Check if current user is a member
	const userMembership = members.find((m) => m.user_id === userId);
	const isMember = !!userMembership;
	const userRole = userMembership?.role || null;

	// Count players (excluding GM)
	const playerCount = members.filter((m) => m.role === 'player').length;

	// Get character images for the preview
	const db = get_db(event);
	const allCharacters = await db
		.select({
			image_url: characters_table.image_url
		})
		.from(characters_table)
		.innerJoin(
			campaign_characters_table,
			eq(characters_table.id, campaign_characters_table.character_id)
		)
		.where(
			and(eq(characters_table.campaign_id, campaignId), eq(campaign_characters_table.claimable, 0))
		);

	// Extract character images (limit to 6)
	const characterImages = allCharacters
		.map((char) => char.image_url)
		.filter((url): url is string => !!url)
		.slice(0, 6);

	return {
		campaign,
		gmDisplayName,
		isMember,
		userRole,
		playerCount,
		characterImages
	};
};
