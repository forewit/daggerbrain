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
import {
	campaigns_table,
	campaign_members_table,
	campaign_characters_table
} from './db/campaigns.schema';
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
} from './db/homebrew.schema';
import type {
	CampaignAccess,
	CharacterAccess,
	HomebrewAccess
} from '@shared/types/permissions.types';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

// Homebrew type enum for validation (internal use only, not exported)
export type HomebrewType =
	| 'classes'
	| 'subclasses'
	| 'domains'
	| 'domain_cards'
	| 'primary_weapons'
	| 'secondary_weapons'
	| 'armor'
	| 'loot'
	| 'consumables'
	| 'ancestry_cards'
	| 'community_cards'
	| 'transformation_cards'
	| 'beastforms';

// Map of homebrew types to their database tables
export const homebrewTables = {
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

/**
 * Internal helper to get campaign access within a command context.
 * Use this when you already have db and userId from the calling command.
 */
export async function getCampaignAccessInternal(
	db: DrizzleD1Database,
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
		membership: membership ? { ...membership, role: membership.role as 'gm' | 'player' } : null,
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
	db: DrizzleD1Database,
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

/**
 * Internal helper to get homebrew item access within a command context.
 * Use this when you already have db and userId from the calling command.
 */
export async function getHomebrewAccessInternal<T>(
	db: DrizzleD1Database,
	userId: string,
	homebrewType: HomebrewType,
	homebrewId: string
): Promise<HomebrewAccess<T>> {
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
			item: item as T,
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
				item: item as T,
				canView: true,
				canEdit: false, // Only owner can edit
				isOwner: false
			};
		}
	}

	// No access
	return {
		item: item as T,
		canView: false,
		canEdit: false,
		isOwner: false
	};
}
