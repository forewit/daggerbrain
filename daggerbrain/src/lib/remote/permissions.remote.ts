/**
 * Centralized Permission Remote Functions
 *
 * Remote query functions for permission checking. These run on the server
 * and can safely access server-only modules.
 *
 * For internal helpers used within commands, see $lib/server/permissions.ts
 * For types, see $lib/types/permissions-types.ts
 */

import { query, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { characters_table } from '../server/db/characters.schema';
import {
	campaigns_table,
	campaign_members_table,
	campaign_characters_table
} from '../server/db/campaigns.schema';
import {
	homebrew_classes,
	homebrew_subclasses,
	homebrew_domains,
	homebrew_domain_cards,
	homebrew_primary_weapons,
	homebrew_secondary_weapons,
	homebrew_armor,
	homebrew_loot,
	homebrew_consumables,
	homebrew_ancestry_cards,
	homebrew_community_cards,
	homebrew_transformation_cards,
	homebrew_beastforms
} from '../server/db/homebrew.schema';
import { get_db, get_auth } from './utils';
import type { CampaignMember } from '../types/campaign-types';
import type {
	CampaignAccess,
	CharacterAccess,
	HomebrewAccess,
	ClaimCharacterAccess,
	
} from '../types/permissions-types';

// Homebrew type enum for validation (internal use only, not exported)
const HomebrewTypeSchema = z.enum([
	'classes',
	'subclasses',
	'domains',
	'domain_cards',
	'primary_weapons',
	'secondary_weapons',
	'armor',
	'loot',
	'consumables',
	'ancestry_cards',
	'community_cards',
	'transformation_cards',
	'beastforms'
]);

// Map of homebrew types to their database tables
const homebrewTables = {
	classes: homebrew_classes,
	subclasses: homebrew_subclasses,
	domains: homebrew_domains,
	domain_cards: homebrew_domain_cards,
	primary_weapons: homebrew_primary_weapons,
	secondary_weapons: homebrew_secondary_weapons,
	armor: homebrew_armor,
	loot: homebrew_loot,
	consumables: homebrew_consumables,
	ancestry_cards: homebrew_ancestry_cards,
	community_cards: homebrew_community_cards,
	transformation_cards: homebrew_transformation_cards,
	beastforms: homebrew_beastforms
} as const;

// ============================================================================
// Campaign Access
// ============================================================================

/**
 * Get campaign with access permissions for the current user.
 * Returns the campaign, membership info, and permission flags.
 */
export const getCampaignAccess = query(z.string(), async (campaignId): Promise<CampaignAccess> => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Fetch campaign
	const [campaign] = await db
		.select()
		.from(campaigns_table)
		.where(eq(campaigns_table.id, campaignId))
		.limit(1);

	if (!campaign) {
		throw error(404, 'Campaign not found');
	}

	// Fetch user's membership in this campaign
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
});

// /**
//  * Get all members of a campaign (for cases where we need the full member list).
//  * This is separate from getCampaignAccess since fetching all members is more expensive.
//  */
// export const getCampaignMembers = query(
// 	z.string(),
// 	async (campaignId): Promise<CampaignMember[]> => {
// 		const event = getRequestEvent();
// 		get_auth(event); // Validate authentication
// 		const db = get_db(event);

// 		const members = await db
// 			.select()
// 			.from(campaign_members_table)
// 			.where(eq(campaign_members_table.campaign_id, campaignId));

// 		return members;
// 	}
// );

// ============================================================================
// Character Access
// ============================================================================

/**
 * Get character with access permissions for the current user.
 * Returns the character, ownership info, and permission flags.
 */
export const getCharacterAccess = query(
	z.string(),
	async (characterId): Promise<CharacterAccess> => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

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

		// If owner, they have full access
		if (isOwner) {
			return {
				character,
				canView: true,
				canEdit: true,
				isOwner: true,
				campaignRole: null
			};
		}

		// Check campaign membership if character is in a campaign
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
					canView: true, // All campaign members can view
					canEdit: campaignRole === 'gm', // Only GM can edit non-owned characters
					isOwner: false,
					campaignRole
				};
			}
		}

		// No access
		return {
			character,
			canView: false,
			canEdit: false,
			isOwner: false,
			campaignRole: null
		};
	}
);

// ============================================================================
// Character Claim Access
// ============================================================================

/**
 * Check if the current user can claim a character.
 * Returns detailed info about why claiming is or isn't possible.
 */
export const getClaimCharacterAccess = query(
	z.object({
		characterId: z.string(),
		campaignId: z.string()
	}),
	async ({ characterId, campaignId }): Promise<ClaimCharacterAccess> => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		// Fetch character
		const [character] = await db
			.select()
			.from(characters_table)
			.where(eq(characters_table.id, characterId))
			.limit(1);

		if (!character) {
			throw error(404, 'Character not found');
		}

		// Character must be in the specified campaign
		if (character.campaign_id !== campaignId) {
			return { character, canClaim: false, reason: 'Character is not in this campaign' };
		}

		// Get claimable status from campaign_characters table
		const [campaignChar] = await db
			.select({ claimable: campaign_characters_table.claimable })
			.from(campaign_characters_table)
			.where(
				and(
					eq(campaign_characters_table.campaign_id, campaignId),
					eq(campaign_characters_table.character_id, characterId)
				)
			)
			.limit(1);

		// Character must be claimable
		if (!campaignChar || campaignChar.claimable !== 1) {
			return { character, canClaim: false, reason: 'Character is not claimable' };
		}

		// Check user's campaign membership
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

		if (!membership) {
			return { character, canClaim: false, reason: 'You must be a member of the campaign' };
		}

		// User must be a player (not GM)
		if (membership.role === 'gm') {
			return { character, canClaim: false, reason: 'GMs cannot claim characters' };
		}

		// Player must not already have a non-claimable character in this campaign
		const existingCharacters = await db
			.select({ character_id: campaign_characters_table.character_id })
			.from(campaign_characters_table)
			.innerJoin(characters_table, eq(characters_table.id, campaign_characters_table.character_id))
			.where(
				and(
					eq(campaign_characters_table.campaign_id, campaignId),
					eq(characters_table.clerk_user_id, userId),
					eq(campaign_characters_table.claimable, 0)
				)
			)
			.limit(1);

		if (existingCharacters.length > 0) {
			return {
				character,
				canClaim: false,
				reason: 'You already have a character in this campaign'
			};
		}

		return { character, canClaim: true, reason: null };
	}
);

/**
 * Check if the current user has a (non-claimable) character in a campaign.
 */
export const hasCharacterInCampaign = query(z.string(), async (campaignId): Promise<boolean> => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Join characters with campaign_characters to check claimable status
	const existingCharacters = await db
		.select({ character_id: campaign_characters_table.character_id })
		.from(campaign_characters_table)
		.innerJoin(characters_table, eq(characters_table.id, campaign_characters_table.character_id))
		.where(
			and(
				eq(campaign_characters_table.campaign_id, campaignId),
				eq(characters_table.clerk_user_id, userId),
				eq(campaign_characters_table.claimable, 0)
			)
		)
		.limit(1);

	return existingCharacters.length > 0;
});

// ============================================================================
// Homebrew Access
// ============================================================================

/**
 * Get homebrew item with access permissions for the current user.
 * Uses a generic approach to handle all homebrew types with a single implementation.
 */
export const getHomebrewAccess = query(
	z.object({
		homebrewType: HomebrewTypeSchema,
		homebrewId: z.string()
	}),
	async ({ homebrewType, homebrewId }): Promise<HomebrewAccess<unknown>> => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		const table = homebrewTables[homebrewType];

		// Fetch the homebrew item
		const [item] = await db.select().from(table).where(eq(table.id, homebrewId)).limit(1);

		if (!item) {
			throw error(404, 'Homebrew item not found');
		}

		const isOwner = item.clerk_user_id === userId;

		// Owner always has full access
		if (isOwner) {
			return {
				item,
				canView: true,
				canEdit: true,
				isOwner: true
			};
		}

		// Check if homebrew is in a campaign the user belongs to
		if (item.campaign_id) {
			const [membership] = await db
				.select()
				.from(campaign_members_table)
				.where(
					and(
						eq(campaign_members_table.campaign_id, item.campaign_id),
						eq(campaign_members_table.user_id, userId)
					)
				)
				.limit(1);

			if (membership) {
				return {
					item,
					canView: true,
					canEdit: false, // Only owner can edit
					isOwner: false
				};
			}
		}

		// No access
		return {
			item,
			canView: false,
			canEdit: false,
			isOwner: false
		};
	}
);
