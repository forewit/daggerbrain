import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and, or, inArray } from 'drizzle-orm';
import { z } from 'zod';
import {
	characters_table,
	characters_table_update_schema
} from '../server/db/characters.schema';
import { campaign_members_table } from '../server/db/campaigns.schema';
import { get_db, get_auth, get_kv } from './utils';
import type { CampaignCharacterSummary } from '../types/campaign-types';
import type { ConditionIds } from '../types/rule-types';
import type { Character } from '../types/character-types';
import type { DerivedCharacter } from '../types/derived-character-types';
import { DerivedCharacterSchema } from '../types/derived-character-types';

export const get_all_characters = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Get user's own characters
	const ownCharacters = await db
		.select()
		.from(characters_table)
		.where(eq(characters_table.clerk_user_id, userId));

	// Get campaign memberships to find campaign characters
	const campaignMemberships = await db
		.select()
		.from(campaign_members_table)
		.where(eq(campaign_members_table.user_id, userId));

	const campaignIds = campaignMemberships.map((m) => m.campaign_id);

	// Get characters from campaigns user is a member of
	let campaignCharacters: typeof ownCharacters = [];
	if (campaignIds.length > 0) {
		campaignCharacters = await db
			.select()
			.from(characters_table)
			.where(inArray(characters_table.campaign_id, campaignIds));
	}

	// Combine and deduplicate (in case user owns a character in a campaign)
	const allCharacters = [...ownCharacters];
	const ownCharacterIds = new Set(ownCharacters.map((c) => c.id));
	for (const char of campaignCharacters) {
		if (!ownCharacterIds.has(char.id)) {
			allCharacters.push(char);
		}
	}

	console.log('fetched characters from D1');
	return allCharacters;
});

export const delete_character = command(z.string(), async (characterId) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);
	const kv = get_kv(event);

	// Verify the character exists and belongs to the user
	const [character] = await db
		.select()
		.from(characters_table)
		.where(and(eq(characters_table.id, characterId), eq(characters_table.clerk_user_id, userId)))
		.limit(1);

	if (!character) {
		throw error(404, 'Character not found');
	}

	// Clean up KV entries
	if (character.visibility === 'public') {
		await kv.delete(`character:${characterId}:public`);
	}

	// Also clean up campaign KV entry if it exists
	if (character.campaign_id) {
		await kv.delete(`character:${characterId}:campaign`);
		await updateCampaignCharacterSummary(kv, db, character.campaign_id, characterId, true);
	}

	// Delete the character
	await db
		.delete(characters_table)
		.where(and(eq(characters_table.id, characterId), eq(characters_table.clerk_user_id, userId)));

	// Refresh the characters list
	get_all_characters().refresh();
	console.log('deleted character from D1');
});

export const create_character = command(
	z
		.object({
			campaign_id: z.string().optional()
		})
		.optional(),
	async (options?: { campaign_id?: string }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		if (!userId) throw error(401, 'Unauthorized');
		const db = get_db(event);

		// Check if user has reached the character limit
		const existingCharacters = await db
			.select()
			.from(characters_table)
			.where(eq(characters_table.clerk_user_id, userId));

		if (existingCharacters.length >= 3) {
			throw error(403, 'Character limit reached. You can only have 3 characters.');
		}

		// If campaign_id is provided, verify user is a member
		if (options?.campaign_id) {
			const [membership] = await db
				.select()
				.from(campaign_members_table)
				.where(
					and(
						eq(campaign_members_table.campaign_id, options.campaign_id),
						eq(campaign_members_table.user_id, userId)
					)
				)
				.limit(1);

			if (!membership) {
				throw error(403, 'You must be a member of the campaign to create a character in it.');
			}

			// GMs cannot create characters in campaigns
			if (membership.role === 'gm') {
				throw error(403, 'GMs cannot create characters in campaigns');
			}
		}

		const characterId = crypto.randomUUID();

		await db.insert(characters_table).values({
			id: characterId,
			clerk_user_id: userId,
			campaign_id: options?.campaign_id || null
		});

		// Refresh the characters list
		get_all_characters().refresh();

		console.log('created character in D1');
		return characterId;
	}
);

export const update_character = command(
	z
		.object({
			...characters_table_update_schema.shape,
			derived_character: DerivedCharacterSchema.optional() // Derived character from client
		})
		.passthrough(), // Allow extra fields but strip them
	async (data) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		if (!userId) throw error(401, 'Unauthorized');
		const db = get_db(event);

		// Extract derived_character before updating DB (we don't store it in DB)
		const { derived_character, ...character } = data;

		if (!character.id) {
			throw error(400, 'Character id missing');
		}

		// Get existing character to check permissions
		const [existingCharacter] = await db
			.select()
			.from(characters_table)
			.where(eq(characters_table.id, character.id))
			.limit(1);

		if (!existingCharacter) {
			throw error(404, 'Character not found');
		}

		// Check permissions - owner or GM of campaign can edit
		const isOwner = existingCharacter.clerk_user_id === userId;
		let isGM = false;
		
		if (!isOwner && existingCharacter.campaign_id) {
			const members = await db
				.select()
				.from(campaign_members_table)
				.where(eq(campaign_members_table.campaign_id, existingCharacter.campaign_id));
			
			const member = members.find((m) => m.user_id === userId && m.campaign_id === existingCharacter.campaign_id);
			isGM = member?.role === 'gm';
		}
		
		if (!isOwner && !isGM) {
			throw error(403, 'You do not have permission to edit this character');
		}

		// Get previous visibility to check if it changed
		const previousVisibility = existingCharacter.visibility;
		const newVisibility = character.visibility ?? previousVisibility;

		// Update character (without derived_character field)
		await db
			.update(characters_table)
			.set(character)
			.where(eq(characters_table.id, character.id));

		// Handle KV materialization for public characters and campaign characters
		const kv = get_kv(event);
		const campaignId = character.campaign_id ?? existingCharacter.campaign_id;
		
		if (newVisibility === 'public') {
			// Require derived_character from client for public characters
			if (!derived_character) {
				throw error(400, 'derived_character is required when setting visibility to public');
			}
			await kv.put(`character:${character.id}:public`, JSON.stringify(derived_character), {
				expirationTtl: undefined // No expiration
			});
		} else if (previousVisibility === 'public' && newVisibility !== 'public') {
			// Remove from KV if visibility changed from public to private
			await kv.delete(`character:${character.id}:public`);
		}

		// Store derived_character in KV for campaign characters (even if private)
		// This is needed for campaign summaries
		if (campaignId && derived_character) {
			await kv.put(`character:${character.id}:campaign`, JSON.stringify(derived_character), {
				expirationTtl: undefined // No expiration
			});
		}

		// Update campaign character summary if character is in a campaign
		if (campaignId) {
			await updateCampaignCharacterSummary(kv, db, campaignId, character.id);
			
			// Note: Live character updates should go through WebSocket to the Durable Object
			// This HTTP endpoint is for non-live updates or initial character setup
		}

		console.log('updated character in D1');
		return character.id;
	}
);

// Helper function to update campaign character summary
async function updateCampaignCharacterSummary(
	kv: ReturnType<typeof get_kv>,
	db: ReturnType<typeof get_db>,
	campaignId: string,
	characterId: string,
	isDeletion: boolean = false
) {
	if (isDeletion) {
		// Character was removed from campaign, rebuild summary without it
		const characters = await db
			.select()
			.from(characters_table)
			.where(eq(characters_table.campaign_id, campaignId));

		const summaries: Record<string, CampaignCharacterSummary> = {};
		for (const c of characters) {
			// Note: Characters are already validated by the query filter (campaign_id)
			// Try to get derived character from KV (public or campaign)
			let max_hp = 0;
			let max_stress = 6;
			let max_hope = 6;

			// Try public KV first, then campaign KV
			let derivedChar = (await kv.get(`character:${c.id}:public`, 'json')) as
				| DerivedCharacter
				| null;
			if (!derivedChar) {
				derivedChar = (await kv.get(`character:${c.id}:campaign`, 'json')) as
					| DerivedCharacter
					| null;
			}

			if (derivedChar) {
				max_hp = derivedChar.derived_max_hp;
				max_stress = derivedChar.derived_max_stress;
				max_hope = derivedChar.derived_max_hope;
			}

			summaries[c.id] = {
				id: c.id,
				name: c.name,
				image_url: c.image_url,
				level: c.level,
				marked_hp: c.marked_hp,
				max_hp,
				marked_stress: c.marked_stress,
				max_stress,
				marked_hope: c.marked_hope,
				max_hope,
				active_conditions: c.active_conditions,
				owner_user_id: c.clerk_user_id,
				derived_descriptors: c.derived_descriptors
			};
		}

		// Update KV
		await kv.put(`campaign:${campaignId}:characters`, JSON.stringify(summaries), {
			expirationTtl: undefined
		});
		return;
	}

	// Get the character
	const [char] = await db
		.select()
		.from(characters_table)
		.where(eq(characters_table.id, characterId))
		.limit(1);

	if (!char || char.campaign_id !== campaignId) {
		// Character not in this campaign, remove from summary
		const existing = (await kv.get(`campaign:${campaignId}:characters`, 'json')) as
			| Record<string, CampaignCharacterSummary>
			| null;
		if (existing) {
			delete existing[characterId];
			await kv.put(`campaign:${campaignId}:characters`, JSON.stringify(existing), {
				expirationTtl: undefined
			});
		}
		return;
	}

	// Get existing summary and update only this character (more efficient than full rebuild)
	const existing = (await kv.get(`campaign:${campaignId}:characters`, 'json')) as
		| Record<string, CampaignCharacterSummary>
		| null;
	
	const summaries = existing || {};
	
	// Get derived character from KV (try campaign first, then public)
	const [derivedCharCampaign, derivedCharPublic] = await Promise.all([
		kv.get(`character:${characterId}:campaign`, 'json'),
		kv.get(`character:${characterId}:public`, 'json')
	]);
	
	const derivedChar = (derivedCharCampaign || derivedCharPublic) as DerivedCharacter | null;
	const max_hp = derivedChar?.derived_max_hp ?? 0;
	const max_stress = derivedChar?.derived_max_stress ?? 6;
	const max_hope = derivedChar?.derived_max_hope ?? 6;

	// Update only this character in the summary
	summaries[characterId] = {
		id: char.id,
		name: char.name,
		image_url: char.image_url,
		level: char.level,
		marked_hp: char.marked_hp,
		max_hp,
		marked_stress: char.marked_stress,
		max_stress,
		marked_hope: char.marked_hope,
		max_hope,
		active_conditions: char.active_conditions,
		owner_user_id: char.clerk_user_id,
		derived_descriptors: char.derived_descriptors
	};

	// Update KV
	await kv.put(`campaign:${campaignId}:characters`, JSON.stringify(summaries), {
		expirationTtl: undefined
	});
}

export const get_character_public = query(
	z.string(),
	async (characterId): Promise<typeof characters_table.$inferSelect> => {
		const event = getRequestEvent();
		const kv = get_kv(event);
		const db = get_db(event);

		// Try to get from KV first
		const kvCharacter = await kv.get(`character:${characterId}:public`, 'json');
		if (kvCharacter) {
			console.log('fetched public character from KV');
			return kvCharacter as typeof characters_table.$inferSelect;
		}

		// Fallback to D1 if not in KV
		const [character] = await db
			.select()
			.from(characters_table)
			.where(eq(characters_table.id, characterId))
			.limit(1);

		if (!character) {
			throw error(404, 'Character not found');
		}

		if (character.visibility !== 'public') {
			throw error(404, 'Character is not public');
		}

		console.log('fetched public character from D1');
		return character;
	}
);

// Import the shared function from campaigns.remote instead of duplicating
// This function is now only defined in campaigns.remote.ts
export { get_campaign_characters } from './campaigns.remote';

export const update_character_campaign_stats = command(
	z.object({
		character_id: z.string(),
		marked_hp: z.number().optional(),
		marked_stress: z.number().optional(),
		marked_hope: z.number().optional(),
		active_conditions: z.array(z.enum(['hidden', 'restrained', 'vulnerable'])).optional()
	}),
	async ({ character_id, marked_hp, marked_stress, marked_hope, active_conditions }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);
		const kv = get_kv(event);

		// Get existing character
		const [character] = await db
			.select()
			.from(characters_table)
			.where(eq(characters_table.id, character_id))
			.limit(1);

		if (!character) {
			throw error(404, 'Character not found');
		}

		// Check permissions - owner or GM of campaign can edit
		const isOwner = character.clerk_user_id === userId;
		let isGM = false;
		
		if (!isOwner && character.campaign_id) {
			const members = await db
				.select()
				.from(campaign_members_table)
				.where(eq(campaign_members_table.campaign_id, character.campaign_id));
			
			const member = members.find((m) => m.user_id === userId && m.campaign_id === character.campaign_id);
			isGM = member?.role === 'gm';
		}
		
		if (!isOwner && !isGM) {
			throw error(403, 'You do not have permission to edit this character');
		}

		// Build update object
		const updates: Partial<typeof characters_table.$inferInsert> = {};
		if (marked_hp !== undefined) updates.marked_hp = marked_hp;
		if (marked_stress !== undefined) updates.marked_stress = marked_stress;
		if (marked_hope !== undefined) updates.marked_hope = marked_hope;
		if (active_conditions !== undefined) updates.active_conditions = active_conditions;

		// Update D1 immediately
		await db.update(characters_table).set(updates).where(eq(characters_table.id, character_id));

		// Update campaign summary immediately if in campaign
		if (character.campaign_id) {
			await updateCampaignCharacterSummary(kv, db, character.campaign_id, character_id);
		}

		console.log('updated character campaign stats in D1 and KV');
		return { success: true };
	}
);
