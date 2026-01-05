import { query, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { characters_table } from '../server/db/characters.schema';
import { campaign_members_table } from '../server/db/campaigns.schema';
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

/**
 * Check if a user can view a character
 */
export const can_view_character = query(z.string(), async (characterId): Promise<boolean> => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Get the character
	const [character] = await db
		.select()
		.from(characters_table)
		.where(eq(characters_table.id, characterId))
		.limit(1);

	if (!character) {
		throw error(404, 'Character not found');
	}

	// Owner can always view
	if (character.clerk_user_id === userId) {
		return true;
	}

	// Campaign members can view characters in their campaign
	if (character.campaign_id) {
		const [campaignMembership] = await db
			.select()
			.from(campaign_members_table)
			.where(
				and(
					eq(campaign_members_table.campaign_id, character.campaign_id),
					eq(campaign_members_table.user_id, userId)
				)
			)
			.limit(1);

		if (campaignMembership) {
			return campaignMembership.campaign_id === character.campaign_id;
		}
	}

	return false;
});

/**
 * Check if a user can edit a character
 */
export const can_edit_character = query(z.string(), async (characterId): Promise<boolean> => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Get the character
	const [character] = await db
		.select()
		.from(characters_table)
		.where(eq(characters_table.id, characterId))
		.limit(1);

	if (!character) {
		throw error(404, 'Character not found');
	}

	// Owner can always edit
	if (character.clerk_user_id === userId) {
		return true;
	}

	// GMs can edit characters in their campaigns
	if (character.campaign_id) {
		const members = await db
			.select()
			.from(campaign_members_table)
			.where(eq(campaign_members_table.campaign_id, character.campaign_id));

		const member = members.find((m) => m.user_id === userId && m.campaign_id === character.campaign_id);
		if (member?.role === 'gm') {
			return true;
		}
	}

	return false;
});

/**
 * Check if a user can view homebrew content
 * @param homebrewType - The type of homebrew (e.g., 'classes', 'domains', 'primary_weapons', etc.)
 * @param homebrewId - The ID of the homebrew item
 */
export const can_view_homebrew = query(
	z.object({
		homebrewType: z.enum([
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
		]),
		homebrewId: z.string()
	}),
	async ({ homebrewType, homebrewId }): Promise<boolean> => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		// Fetch homebrew based on type
		let homebrew: { clerk_user_id: string; campaign_id: string | null } | null = null;

		switch (homebrewType) {
			case 'classes': {
				const [result] = await db
					.select()
					.from(homebrew_classes)
					.where(eq(homebrew_classes.id, homebrewId))
					.limit(1);
				if (result) homebrew = result;
				break;
			}
			case 'subclasses': {
				const [result] = await db
					.select()
					.from(homebrew_subclasses)
					.where(eq(homebrew_subclasses.id, homebrewId))
					.limit(1);
				if (result) homebrew = result;
				break;
			}
			case 'domains': {
				const [result] = await db
					.select()
					.from(homebrew_domains)
					.where(eq(homebrew_domains.id, homebrewId))
					.limit(1);
				if (result) homebrew = result;
				break;
			}
			case 'domain_cards': {
				const [result] = await db
					.select()
					.from(homebrew_domain_cards)
					.where(eq(homebrew_domain_cards.id, homebrewId))
					.limit(1);
				if (result) homebrew = result;
				break;
			}
			case 'primary_weapons': {
				const [result] = await db
					.select()
					.from(homebrew_primary_weapons)
					.where(eq(homebrew_primary_weapons.id, homebrewId))
					.limit(1);
				if (result) homebrew = result;
				break;
			}
			case 'secondary_weapons': {
				const [result] = await db
					.select()
					.from(homebrew_secondary_weapons)
					.where(eq(homebrew_secondary_weapons.id, homebrewId))
					.limit(1);
				if (result) homebrew = result;
				break;
			}
			case 'armor': {
				const [result] = await db
					.select()
					.from(homebrew_armor)
					.where(eq(homebrew_armor.id, homebrewId))
					.limit(1);
				if (result) homebrew = result;
				break;
			}
			case 'loot': {
				const [result] = await db
					.select()
					.from(homebrew_loot)
					.where(eq(homebrew_loot.id, homebrewId))
					.limit(1);
				if (result) homebrew = result;
				break;
			}
			case 'consumables': {
				const [result] = await db
					.select()
					.from(homebrew_consumables)
					.where(eq(homebrew_consumables.id, homebrewId))
					.limit(1);
				if (result) homebrew = result;
				break;
			}
			case 'ancestry_cards': {
				const [result] = await db
					.select()
					.from(homebrew_ancestry_cards)
					.where(eq(homebrew_ancestry_cards.id, homebrewId))
					.limit(1);
				if (result) homebrew = result;
				break;
			}
			case 'community_cards': {
				const [result] = await db
					.select()
					.from(homebrew_community_cards)
					.where(eq(homebrew_community_cards.id, homebrewId))
					.limit(1);
				if (result) homebrew = result;
				break;
			}
			case 'transformation_cards': {
				const [result] = await db
					.select()
					.from(homebrew_transformation_cards)
					.where(eq(homebrew_transformation_cards.id, homebrewId))
					.limit(1);
				if (result) homebrew = result;
				break;
			}
			case 'beastforms': {
				const [result] = await db
					.select()
					.from(homebrew_beastforms)
					.where(eq(homebrew_beastforms.id, homebrewId))
					.limit(1);
				if (result) homebrew = result;
				break;
			}
		}

		if (!homebrew) {
			throw error(404, 'Homebrew not found');
		}

		// Owner can always view
		if (homebrew.clerk_user_id === userId) {
			return true;
		}

		// Campaign members can view homebrew in their campaign vault
		if (homebrew.campaign_id) {
			const [campaignMembership] = await db
				.select()
				.from(campaign_members_table)
				.where(
					and(
						eq(campaign_members_table.campaign_id, homebrew.campaign_id),
						eq(campaign_members_table.user_id, userId)
					)
				)
				.limit(1);

			if (campaignMembership) {
				return campaignMembership.campaign_id === homebrew.campaign_id;
			}
		}

		return false;
	}
);

/**
 * Check if a user can edit homebrew content
 * @param homebrewType - The type of homebrew (e.g., 'classes', 'domains', 'primary_weapons', etc.)
 * @param homebrewId - The ID of the homebrew item
 */
export const can_edit_homebrew = query(
	z.object({
		homebrewType: z.enum([
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
		]),
		homebrewId: z.string()
	}),
	async ({ homebrewType, homebrewId }): Promise<boolean> => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		// Fetch homebrew based on type
		let clerkUserId: string | null = null;

		switch (homebrewType) {
			case 'classes': {
				const [result] = await db
					.select({ clerk_user_id: homebrew_classes.clerk_user_id })
					.from(homebrew_classes)
					.where(eq(homebrew_classes.id, homebrewId))
					.limit(1);
				if (result) clerkUserId = result.clerk_user_id;
				break;
			}
			case 'subclasses': {
				const [result] = await db
					.select({ clerk_user_id: homebrew_subclasses.clerk_user_id })
					.from(homebrew_subclasses)
					.where(eq(homebrew_subclasses.id, homebrewId))
					.limit(1);
				if (result) clerkUserId = result.clerk_user_id;
				break;
			}
			case 'domains': {
				const [result] = await db
					.select({ clerk_user_id: homebrew_domains.clerk_user_id })
					.from(homebrew_domains)
					.where(eq(homebrew_domains.id, homebrewId))
					.limit(1);
				if (result) clerkUserId = result.clerk_user_id;
				break;
			}
			case 'domain_cards': {
				const [result] = await db
					.select({ clerk_user_id: homebrew_domain_cards.clerk_user_id })
					.from(homebrew_domain_cards)
					.where(eq(homebrew_domain_cards.id, homebrewId))
					.limit(1);
				if (result) clerkUserId = result.clerk_user_id;
				break;
			}
			case 'primary_weapons': {
				const [result] = await db
					.select({ clerk_user_id: homebrew_primary_weapons.clerk_user_id })
					.from(homebrew_primary_weapons)
					.where(eq(homebrew_primary_weapons.id, homebrewId))
					.limit(1);
				if (result) clerkUserId = result.clerk_user_id;
				break;
			}
			case 'secondary_weapons': {
				const [result] = await db
					.select({ clerk_user_id: homebrew_secondary_weapons.clerk_user_id })
					.from(homebrew_secondary_weapons)
					.where(eq(homebrew_secondary_weapons.id, homebrewId))
					.limit(1);
				if (result) clerkUserId = result.clerk_user_id;
				break;
			}
			case 'armor': {
				const [result] = await db
					.select({ clerk_user_id: homebrew_armor.clerk_user_id })
					.from(homebrew_armor)
					.where(eq(homebrew_armor.id, homebrewId))
					.limit(1);
				if (result) clerkUserId = result.clerk_user_id;
				break;
			}
			case 'loot': {
				const [result] = await db
					.select({ clerk_user_id: homebrew_loot.clerk_user_id })
					.from(homebrew_loot)
					.where(eq(homebrew_loot.id, homebrewId))
					.limit(1);
				if (result) clerkUserId = result.clerk_user_id;
				break;
			}
			case 'consumables': {
				const [result] = await db
					.select({ clerk_user_id: homebrew_consumables.clerk_user_id })
					.from(homebrew_consumables)
					.where(eq(homebrew_consumables.id, homebrewId))
					.limit(1);
				if (result) clerkUserId = result.clerk_user_id;
				break;
			}
			case 'ancestry_cards': {
				const [result] = await db
					.select({ clerk_user_id: homebrew_ancestry_cards.clerk_user_id })
					.from(homebrew_ancestry_cards)
					.where(eq(homebrew_ancestry_cards.id, homebrewId))
					.limit(1);
				if (result) clerkUserId = result.clerk_user_id;
				break;
			}
			case 'community_cards': {
				const [result] = await db
					.select({ clerk_user_id: homebrew_community_cards.clerk_user_id })
					.from(homebrew_community_cards)
					.where(eq(homebrew_community_cards.id, homebrewId))
					.limit(1);
				if (result) clerkUserId = result.clerk_user_id;
				break;
			}
			case 'transformation_cards': {
				const [result] = await db
					.select({ clerk_user_id: homebrew_transformation_cards.clerk_user_id })
					.from(homebrew_transformation_cards)
					.where(eq(homebrew_transformation_cards.id, homebrewId))
					.limit(1);
				if (result) clerkUserId = result.clerk_user_id;
				break;
			}
			case 'beastforms': {
				const [result] = await db
					.select({ clerk_user_id: homebrew_beastforms.clerk_user_id })
					.from(homebrew_beastforms)
					.where(eq(homebrew_beastforms.id, homebrewId))
					.limit(1);
				if (result) clerkUserId = result.clerk_user_id;
				break;
			}
		}

		if (!clerkUserId) {
			throw error(404, 'Homebrew not found');
		}

		// Only owner can edit
		return clerkUserId === userId;
	}
);

/**
 * Check if a user is a GM of a campaign
 */
export const is_campaign_gm = query(
	z.object({
		campaignId: z.string(),
		userId: z.string().optional() // Optional, will use authenticated user if not provided
	}),
	async ({ campaignId, userId: providedUserId }): Promise<boolean> => {
		const event = getRequestEvent();
		const { userId: authUserId } = get_auth(event);
		const userId = providedUserId || authUserId;
		const db = get_db(event);

		if (!userId) return false;

		const members = await db
			.select()
			.from(campaign_members_table)
			.where(eq(campaign_members_table.campaign_id, campaignId));

		const member = members.find((m) => m.user_id === userId && m.campaign_id === campaignId);
		return member?.role === 'gm';
	}
);

/**
 * Check if a user is a member of a campaign
 */
export const is_campaign_member = query(
	z.object({
		campaignId: z.string(),
		userId: z.string().optional() // Optional, will use authenticated user if not provided
	}),
	async ({ campaignId, userId: providedUserId }): Promise<boolean> => {
		const event = getRequestEvent();
		const { userId: authUserId } = get_auth(event);
		const userId = providedUserId || authUserId;
		const db = get_db(event);

		if (!userId) return false;

		const members = await db
			.select()
			.from(campaign_members_table)
			.where(eq(campaign_members_table.campaign_id, campaignId));

		return members.some((m) => m.user_id === userId && m.campaign_id === campaignId);
	}
);

/**
 * Check if a user already has a character in a campaign
 */
export const has_character_in_campaign = query(
	z.object({
		campaignId: z.string(),
		userId: z.string().optional() // Optional, will use authenticated user if not provided
	}),
	async ({ campaignId, userId: providedUserId }): Promise<boolean> => {
		const event = getRequestEvent();
		const { userId: authUserId } = get_auth(event);
		const userId = providedUserId || authUserId;
		const db = get_db(event);

		if (!userId) return false;

		const existingCharacters = await db
			.select()
			.from(characters_table)
			.where(
				and(
					eq(characters_table.campaign_id, campaignId),
					eq(characters_table.clerk_user_id, userId),
					eq(characters_table.claimable, 0)
				)
			)
			.limit(1);

		return existingCharacters.length > 0;
	}
);

/**
 * Check if a user can claim a character
 */
export const can_claim_character = query(
	z.object({
		characterId: z.string(),
		campaignId: z.string()
	}),
	async ({ characterId, campaignId }): Promise<boolean> => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		// Get the character
		const [character] = await db
			.select()
			.from(characters_table)
			.where(eq(characters_table.id, characterId))
			.limit(1);

		if (!character) {
			return false;
		}

		// Character must be claimable
		if (character.claimable !== 1) {
			return false;
		}

		// Character must be in the specified campaign
		if (character.campaign_id !== campaignId) {
			return false;
		}

		// Verify user is a member of the campaign
		const members = await db
			.select()
			.from(campaign_members_table)
			.where(eq(campaign_members_table.campaign_id, campaignId));

		const member = members.find((m) => m.user_id === userId && m.campaign_id === campaignId);
		if (!member) {
			return false;
		}

		// User must be a player (not GM)
		if (member.role === 'gm') {
			return false;
		}

		// Player must not already have a character in this campaign
		const existingCharacters = await db
			.select()
			.from(characters_table)
			.where(
				and(
					eq(characters_table.campaign_id, campaignId),
					eq(characters_table.clerk_user_id, userId),
					eq(characters_table.claimable, 0)
				)
			)
			.limit(1);

		if (existingCharacters.length > 0) {
			return false;
		}

		return true;
	}
);

