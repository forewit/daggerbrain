/**
 * Server-only Permission Helpers
 * 
 * Internal helpers for permission checking within command contexts.
 * These are NOT remote functions - they're for use within other remote commands
 * where you already have db and userId from the calling context.
 */

import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { characters_table } from './db/characters.schema';
import { campaigns_table, campaign_members_table } from './db/campaigns.schema';
import type { CampaignAccess, CharacterAccess } from '../types/permissions-types';

type DbClient = {
	select: () => any;
};

/**
 * Internal helper to get campaign access within a command context.
 * Use this when you already have db and userId from the calling command.
 */
export async function getCampaignAccessInternal(
	db: DbClient,
	userId: string,
	campaignId: string
): Promise<CampaignAccess> {
	// Fetch campaign
	const [campaign] = await db
		.select()
		.from(campaigns_table)
		.where(eq(campaigns_table.id, campaignId))
		.limit(1);

	if (!campaign) {
		throw error(404, 'Campaign not found');
	}

	// Fetch user's membership
	const [membership] = await db
		.select()
		.from(campaign_members_table)
		.where(
			and(
				eq(campaign_members_table.campaign_id, campaignId),
				eq(campaign_members_table.user_id, userId)
			)
		)
		.limit(1);

	const role = (membership?.role as 'gm' | 'player') ?? null;

	return {
		campaign,
		membership: membership ?? null,
		role,
		canView: !!membership,
		canEdit: role === 'gm'
	};
}

/**
 * Internal helper to get character access within a command context.
 * Use this when you already have db and userId from the calling command.
 */
export async function getCharacterAccessInternal(
	db: DbClient,
	userId: string,
	characterId: string
): Promise<CharacterAccess> {
	// Fetch character
	const [character] = await db
		.select()
		.from(characters_table)
		.where(eq(characters_table.id, characterId))
		.limit(1);

	if (!character) {
		throw error(404, 'Character not found');
	}

	const isOwner = character.clerk_user_id === userId;

	if (isOwner) {
		return {
			character,
			canView: true,
			canEdit: true,
			isOwner: true,
			campaignRole: null
		};
	}

	// Check campaign membership
	if (character.campaign_id) {
		const [membership] = await db
			.select()
			.from(campaign_members_table)
			.where(
				and(
					eq(campaign_members_table.campaign_id, character.campaign_id),
					eq(campaign_members_table.user_id, userId)
				)
			)
			.limit(1);

		if (membership) {
			const campaignRole = membership.role as 'gm' | 'player';
			return {
				character,
				canView: true,
				canEdit: campaignRole === 'gm',
				isOwner: false,
				campaignRole
			};
		}
	}

	return {
		character,
		canView: false,
		canEdit: false,
		isOwner: false,
		campaignRole: null
	};
}

