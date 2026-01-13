import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and, count } from 'drizzle-orm';
import { z } from 'zod';
import { characters_table, characters_table_update_schema } from '../server/db/characters.schema';
import { get_db, get_auth, CHARACTER_LIMIT } from './utils';
import { get_user_campaigns, get_campaign_characters } from './campaigns/campaigns.remote';
import { getCharacterAccessInternal, getCampaignAccessInternal } from '../server/permissions';
// Note: KV caching has been removed for cost optimization - D1 reads are 500x cheaper than KV reads
import type { Character } from '../types/character-types';
import type { CampaignCharacterSummary } from '../types/campaign-types';
import type { RequestEvent } from '@sveltejs/kit';

// Helper function to notify Durable Object about character changes
// Calls the DO directly instead of going through HTTP to avoid auth issues
// Now uses CampaignCharacterSummary instead of full DerivedCharacter for lightweight updates
async function notifyDurableObject(
	event: RequestEvent,
	campaignId: string,
	type: 'character_added' | 'character_updated' | 'character_removed' | 'character_deleted',
	data: {
		characterId: string;
		summary?: CampaignCharacterSummary;
		updates?: Partial<CampaignCharacterSummary>;
	}
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
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				type,
				...data
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			// Log at error level for monitoring - DO failures indicate real-time sync issues
			console.error(
				`[DO Notification Error] ${type} for character ${data.characterId}: Status ${response.status}, ${errorText}`
			);
			// TODO: Consider adding metrics/monitoring here for DO notification failures
		} else {
			console.log(`DO notification sent successfully: ${type} for character ${data.characterId}`);
		}
	} catch (err) {
		// Log error but don't fail the operation (D1 is source of truth, DO is for real-time sync)
		// Log at error level for monitoring - consistent DO failures may indicate infrastructure issues
		console.error(
			`[DO Notification Error] Failed to notify DO for ${type} (character ${data.characterId}):`,
			err instanceof Error ? err.message : String(err)
		);
		// TODO: Consider adding metrics/monitoring here for DO notification failures
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
 * Returns the character along with canEdit permission flag
 */
export const get_character_by_id = query(
	z.string(),
	async (characterId): Promise<{ character: Character; canEdit: boolean }> => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);
		const access = await getCharacterAccessInternal(db, userId, characterId);

		if (!access.canView) {
			throw error(403, 'You do not have permission to view this character');
		}

		return {
			character: access.character,
			canEdit: access.canEdit
		};
	}
);

export const delete_character = command(z.string(), async (characterId) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Get character with permissions
	const access = await getCharacterAccessInternal(db, userId, characterId);

	// Only character owner can delete
	if (!access.isOwner) {
		throw error(403, 'You can only delete your own characters');
	}

	const character = access.character;

	// Track if character was in a campaign (for refreshing queries)
	const campaignId = character.campaign_id;

	// Delete the character
	await db.delete(characters_table).where(eq(characters_table.id, characterId));

	// Notify DO that character was deleted
	if (campaignId) {
		await notifyDurableObject(event, campaignId, 'character_deleted', {
			characterId
		});
	}

	// Refresh the characters list (always needed when deleting)
	get_all_characters().refresh();

	// Only refresh campaign-related queries if character was actually in a campaign
	// get_user_campaigns needs refresh because character_images may have changed
	if (campaignId) {
		get_user_campaigns().refresh();
		get_campaign_characters(campaignId).refresh();
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

		let isClaimable = options?.claimable === true;
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

			// Players can only create non-claimable characters (claimed by them)
			// Force non-claimable for players to ensure characters are created as claimed
			if (!isGM) {
				isClaimable = false;
			}
		}

		// Check character limit - ALL characters owned by user count toward the limit
		// Claimable status is tracked in campaign_characters_table, not in character limit
		// Optimized: Use COUNT query instead of selecting all characters
		const [result] = await db
			.select({ count: count() })
			.from(characters_table)
			.where(eq(characters_table.clerk_user_id, userId));

		const characterCount = Number(result?.count ?? 0);
		if (characterCount >= CHARACTER_LIMIT) {
			throw error(403, `Character limit reached. You can only have ${CHARACTER_LIMIT} characters.`);
		}

		const characterId = crypto.randomUUID();
		const now = Date.now();

		// Use batch for atomic character + campaign_characters insert
		// This ensures both operations succeed or both fail
		if (options?.campaign_id) {
			const { campaign_characters_table } = await import('../server/db/campaigns.schema');
			await db.batch([
				db.insert(characters_table).values({
					id: characterId,
					clerk_user_id: userId,
					campaign_id: options.campaign_id
				}),
				db.insert(campaign_characters_table).values({
					campaign_id: options.campaign_id,
					character_id: characterId,
					claimable: isClaimable ? 1 : 0,
					added_at: now
				})
			]);

			// Refresh the campaign characters query
			get_campaign_characters(options.campaign_id).refresh();
		} else {
			// No campaign - just insert character
			await db.insert(characters_table).values({
				id: characterId,
				clerk_user_id: userId,
				campaign_id: null
			});
		}

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
			id: z.string() // Make id required (override optional from update schema)
		})
		.loose(), // Allow extra fields but strip them
	async (data) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		if (!userId) throw error(401, 'Unauthorized');
		const db = get_db(event);

		// Extract id before updating DB
		// id is in the schema but won't be updated (it's only used for WHERE clause)
		// Exclude sensitive fields that should only be modified through dedicated endpoints:
		// - campaign_id: modified via assign_character_to_campaign
		// - clerk_user_id: immutable, determines ownership
		// Note: claimable is now stored in campaign_characters_table, not characters_table
		const { id, campaign_id: _campaignId, clerk_user_id: _clerkUserId, ...character } = data;

		if (!id) {
			throw error(400, 'Character id missing');
		}

		// Get character with permissions
		const access = await getCharacterAccessInternal(db, userId, id);
		const existingCharacter = access.character;

		if (!access.canEdit) {
			throw error(403, 'You do not have permission to edit this character');
		}

		// Update character in D1 (derived_character_summary is part of the character object now)
		await db.update(characters_table).set(character).where(eq(characters_table.id, id));

		// Get campaign_id from DB (source of truth)
		const campaignId = existingCharacter.campaign_id;

		// If character is in a campaign, notify DO about the update with partial CampaignCharacterSummary
		if (campaignId) {
			// Build partial update for DO notification based on actually changed fields
			// Only include fields that have actually changed values
			const updates: Partial<CampaignCharacterSummary> = {};

			if (
				character.marked_hp !== undefined &&
				character.marked_hp !== existingCharacter.marked_hp
			) {
				updates.marked_hp = character.marked_hp;
			}
			if (
				character.marked_stress !== undefined &&
				character.marked_stress !== existingCharacter.marked_stress
			) {
				updates.marked_stress = character.marked_stress;
			}
			if (
				character.marked_hope !== undefined &&
				character.marked_hope !== existingCharacter.marked_hope
			) {
				updates.marked_hope = character.marked_hope;
			}
			if (
				character.marked_armor !== undefined &&
				character.marked_armor !== existingCharacter.marked_armor
			) {
				updates.marked_armor = character.marked_armor;
			}
			if (character.active_conditions !== undefined) {
				const existingConditions = existingCharacter.active_conditions || [];
				const newConditions = character.active_conditions || [];
				if (JSON.stringify(existingConditions) !== JSON.stringify(newConditions)) {
					updates.active_conditions = character.active_conditions;
				}
			}
			if (character.name !== undefined && character.name !== existingCharacter.name) {
				updates.name = character.name;
			}
			if (character.level !== undefined && character.level !== existingCharacter.level) {
				updates.level = character.level;
			}
			if (
				character.image_url !== undefined &&
				character.image_url !== existingCharacter.image_url
			) {
				updates.image_url = character.image_url;
			}
			// Include derived_character_summary if it was actually updated
			if (character.derived_character_summary !== undefined) {
				const existingSummary = existingCharacter.derived_character_summary;
				const newSummary = character.derived_character_summary;
				if (JSON.stringify(existingSummary) !== JSON.stringify(newSummary)) {
					updates.derived_character_summary = character.derived_character_summary;
				}
			}

			// Only notify if there are actual changes
			if (Object.keys(updates).length > 0) {
				await notifyDurableObject(event, campaignId, 'character_updated', {
					characterId: id,
					updates
				});
			}

			// Refresh the campaign characters query
			get_campaign_characters(campaignId).refresh();
		}

		console.log('updated character in D1');
		return id;
	}
);

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

		// Refresh campaign characters query if in campaign
		if (character.campaign_id) {
			get_campaign_characters(character.campaign_id).refresh();
		}

		console.log('updated character campaign stats in D1');
		return { success: true };
	}
);
