import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and, or } from 'drizzle-orm';
import { z } from 'zod';
import {
	characters_table,
	characters_table_update_schema
} from '../server/db/characters.schema';
import { get_db, get_auth, get_kv } from './utils';
import { get_user_campaigns } from './campaigns.remote';
import { getCharacterAccess } from './permissions.remote';
import { getCharacterAccessInternal, getCampaignAccessInternal } from '../server/permissions';
import {
	upsertCharacterSummary,
	removeCharacterFromSummary,
	rebuildCampaignCharacterCache,
	KV_TTL_24H
} from './cache.service';
import type { CampaignCharacterSummary } from '../types/campaign-types';
import type { ConditionIds } from '../types/rule-types';
import type { Character } from '../types/character-types';
import type { DerivedCharacter } from '../types/derived-character-types';
import { DerivedCharacterSchema } from '../types/derived-character-types';
import type { RequestEvent } from '@sveltejs/kit';

// Helper function to notify Durable Object about character changes
// Calls the DO directly instead of going through HTTP to avoid auth issues
async function notifyDurableObject(
	event: RequestEvent,
	campaignId: string,
	type: 'character_added' | 'character_updated' | 'character_removed' | 'character_deleted',
	data: { characterId: string; character?: DerivedCharacter; updates?: Partial<DerivedCharacter> }
): Promise<void> {
	if (!campaignId || !event.platform?.env?.CAMPAIGN_LIVE) {
		console.log('Skipping DO notification: no campaignId or CAMPAIGN_LIVE not available');
		return; // No campaign or DO not available, skip notification
	}

	try {
		// Get DO instance directly instead of going through HTTP
		const doNamespace = event.platform.env.CAMPAIGN_LIVE;
		const id = doNamespace.idFromName(campaignId);
		const stub = doNamespace.get(id);
		
		// Send POST request directly to the DO
		const response = await stub.fetch('https://do-internal/notify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				type,
				...data
			})
		});
		
		if (!response.ok) {
			const errorText = await response.text();
			console.error(`DO notification failed with status ${response.status}: ${errorText}`);
		} else {
			console.log(`DO notification sent successfully: ${type} for character ${data.characterId}`);
		}
	} catch (err) {
		// Log error but don't fail the operation
		console.error(`Failed to notify DO for ${type}:`, err);
	}
}

export const get_all_characters = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Get user's own characters only
	// This ensures GMs don't see characters they created but were claimed by players
	const ownCharacters = await db
		.select()
		.from(characters_table)
		.where(eq(characters_table.clerk_user_id, userId));

	console.log('fetched characters from D1');
	return ownCharacters;
});

/**
 * Get a character by ID if the user has permission to view it
 * Uses getCharacterAccess from permissions service
 */
export const get_character_by_id = query(z.string(), async (characterId): Promise<Character> => {
	const access = await getCharacterAccess(characterId);
	
	if (!access.canView) {
		throw error(403, 'You do not have permission to view this character');
	}

	return access.character;
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

	// Track if character was in a campaign (for refreshing queries)
	const wasInCampaign = !!character.campaign_id;
	
	// Clean up campaign KV entry if it exists
	if (character.campaign_id) {
		await kv.delete(`character:${characterId}:campaign`);
		await removeCharacterFromSummary(kv, character.campaign_id, characterId);
		
		// Notify DO that character was deleted
		await notifyDurableObject(event, character.campaign_id, 'character_deleted', {
			characterId
		});
	}

	// Delete the character
	await db
		.delete(characters_table)
		.where(and(eq(characters_table.id, characterId), eq(characters_table.clerk_user_id, userId)));

	// Refresh the characters list
	get_all_characters().refresh();
	
	// Refresh campaign list if character was in a campaign (to update character_images)
	if (wasInCampaign) {
		get_user_campaigns().refresh();
	}
	
	console.log('deleted character from D1');
});

export const create_character = command(
	z
		.object({
			campaign_id: z.string().optional(),
			claimable: z.boolean().optional()
		})
		.optional(),
	async (options?: { campaign_id?: string; claimable?: boolean }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		if (!userId) throw error(401, 'Unauthorized');
		const db = get_db(event);

		const isClaimable = options?.claimable === true;
		let isGM = false;

		// If campaign_id is provided, verify user is a member
		if (options?.campaign_id) {
			const access = await getCampaignAccessInternal(db, userId, options.campaign_id);

			if (!access.membership) {
				throw error(403, 'You must be a member of the campaign to create a character in it.');
			}

			isGM = access.canEdit;

			// If creating a claimable character, user must be GM
			if (isClaimable && !isGM) {
				throw error(403, 'Only GMs can create claimable characters.');
			}

			// Non-GMs cannot create characters in campaigns (unless claimable, which is GM-only)
			if (!isGM && !isClaimable) {
				throw error(403, 'GMs cannot create characters in campaigns');
			}
		}

		// Check character limit - skip for GMs creating claimable characters
		if (!isClaimable) {
			const existingCharacters = await db
				.select()
				.from(characters_table)
				.where(eq(characters_table.clerk_user_id, userId));

			if (existingCharacters.length >= 3) {
				throw error(403, 'Character limit reached. You can only have 3 characters.');
			}
		}

		const characterId = crypto.randomUUID();

	await db.insert(characters_table).values({
		id: characterId,
		clerk_user_id: userId,
		campaign_id: options?.campaign_id || null,
		claimable: isClaimable ? 1 : 0
	});

	// Refresh the characters list
	get_all_characters().refresh();
	
	// Refresh campaign list if character was created in a campaign (to update character_images)
	if (options?.campaign_id) {
		get_user_campaigns().refresh();
	}

	// Note: We don't notify DO on character creation because derived_character is not available yet.
	// The first update_character call with derived_character will notify the DO with the full character.

	console.log('created character in D1');
	return characterId;
	}
);

export const update_character = command(
	characters_table_update_schema
		.extend({
			id: z.string(), // Make id required (override optional from update schema)
			derived_character: DerivedCharacterSchema.optional() // Derived character from client
		})
		.passthrough(), // Allow extra fields but strip them
	async (data) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		if (!userId) throw error(401, 'Unauthorized');
		const db = get_db(event);

		// Extract derived_character and id before updating DB
		// id is in the schema but won't be updated (it's only used for WHERE clause)
		const { derived_character, id, ...character } = data;

		if (!id) {
			throw error(400, 'Character id missing');
		}

		// Get character with permissions
		const access = await getCharacterAccessInternal(db, userId, id);
		const existingCharacter = access.character;
		
		if (!access.canEdit) {
			throw error(403, 'You do not have permission to edit this character');
		}

		// Update character (without derived_character and id fields - id is immutable)
		await db
			.update(characters_table)
			.set(character)
			.where(eq(characters_table.id, id));

		// Handle KV materialization for campaign characters
		const kv = get_kv(event);
		// Always use DB's campaign_id as source of truth (client-provided campaign_id is stripped by schema)
		const campaignId = existingCharacter.campaign_id;

		// Store derived_character in KV for campaign characters
		// This is needed for campaign summaries
		if (campaignId && derived_character) {
			await kv.put(`character:${id}:campaign`, JSON.stringify(derived_character), {
				expirationTtl: KV_TTL_24H
			});
		}

		// Update campaign character summary if character is in a campaign
		if (campaignId) {
			await upsertCharacterSummary(kv, db, campaignId, id);
			
			// Notify DO about character update
			// If derived_character is provided, send full character (first update or major change)
			// Otherwise, send partial update with changed fields
			if (derived_character) {
				await notifyDurableObject(event, campaignId, 'character_updated', {
					characterId: id,
					character: derived_character as DerivedCharacter
				});
			} else {
				// Compute partial update from changed fields
				const updates: Partial<DerivedCharacter> = {};
				if (character.marked_hp !== undefined) updates.marked_hp = character.marked_hp;
				if (character.marked_stress !== undefined) updates.marked_stress = character.marked_stress;
				if (character.marked_hope !== undefined) updates.marked_hope = character.marked_hope;
				if (character.marked_armor !== undefined) updates.marked_armor = character.marked_armor;
				if (character.active_conditions !== undefined) updates.active_conditions = character.active_conditions;
				if (character.name !== undefined) updates.name = character.name;
				if (character.level !== undefined) updates.level = character.level;
				// Add other fields as needed
				
				if (Object.keys(updates).length > 0) {
					await notifyDurableObject(event, campaignId, 'character_updated', {
						characterId: id,
						updates
					});
				}
			}
		}

		console.log('updated character in D1');
		return id;
	}
);

// Helper function to update campaign character summary
// Now uses the shared cache service
async function updateCampaignCharacterSummary(
	kv: ReturnType<typeof get_kv>,
	db: ReturnType<typeof get_db>,
	campaignId: string,
	characterId: string,
	isDeletion: boolean = false
) {
	if (isDeletion) {
		// Character was removed from campaign, rebuild summary without it
		// Use rebuild to ensure consistency
		await rebuildCampaignCharacterCache(kv, db, campaignId);
		return;
	}

	// Use shared upsert function
	await upsertCharacterSummary(kv, db, campaignId, characterId);
}

// Note: get_campaign_characters is defined in campaigns.remote.ts
// Import it directly where needed instead of re-exporting

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

		// Get character with permissions
		const access = await getCharacterAccessInternal(db, userId, character_id);
		const character = access.character;
		
		if (!access.canEdit) {
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
			await upsertCharacterSummary(kv, db, character.campaign_id, character_id);
		}

		console.log('updated character campaign stats in D1 and KV');
		return { success: true };
	}
);
