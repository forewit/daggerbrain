import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and, inArray } from 'drizzle-orm';
import { z } from 'zod';
import {
	campaigns_table,
	campaign_members_table,
	campaign_state_table,
	campaign_homebrew_vault_table
} from '../server/db/campaigns.schema';
import { characters_table } from '../server/db/characters.schema';
import { get_db, get_auth, get_kv } from './utils';
import { get_all_characters } from './characters.remote';
import { getCampaignAccessInternal } from '../server/permissions';
import {
	rebuildCampaignCharacterCache,
	upsertCharacterSummary,
	removeCharacterFromSummary,
	KV_TTL_24H
} from './cache.service';
import type { CampaignState, CampaignCharacterSummary, CampaignWithDetails } from '../types/campaign-types';
import type { Character } from '../types/character-types';
import type { DerivedCharacter } from '../types/derived-character-types';
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

// ============================================================================
// Queries
// ============================================================================

export const get_campaign = query(z.string(), async (campaignId) => {
	const event = getRequestEvent();
	get_auth(event); // Validate authentication
	const db = get_db(event);

	const [campaign] = await db
		.select()
		.from(campaigns_table)
		.where(eq(campaigns_table.id, campaignId))
		.limit(1);

	if (!campaign) {
		throw error(404, 'Campaign not found');
	}

	console.log('fetched campaign from D1');
	return campaign;
});

export const get_campaign_members = query(z.string(), async (campaignId) => {
	const event = getRequestEvent();
	get_auth(event); // Validate authentication
	const db = get_db(event);

	const members = await db
		.select()
		.from(campaign_members_table)
		.where(eq(campaign_members_table.campaign_id, campaignId));

	console.log('fetched campaign members from D1');
	return members;
});

export const get_user_campaigns = query(async (): Promise<CampaignWithDetails[]> => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Get campaigns where user is a member using inArray for efficient batch query
	const memberships = await db
		.select()
		.from(campaign_members_table)
		.where(eq(campaign_members_table.user_id, userId));

	const campaignIds = memberships.map((m) => m.campaign_id);

	if (campaignIds.length === 0) {
		return [];
	}

	// Fetch all campaigns in a single query using inArray
	const campaigns = await db
		.select()
		.from(campaigns_table)
		.where(inArray(campaigns_table.id, campaignIds));

	// Create a map of campaign_id to user's role
	const userRoleMap = new Map<string, 'gm' | 'player'>();
	for (const membership of memberships) {
		userRoleMap.set(membership.campaign_id, membership.role as 'gm' | 'player');
	}

	// Get all members for all campaigns to count players
	const allMembers = await db
		.select()
		.from(campaign_members_table)
		.where(inArray(campaign_members_table.campaign_id, campaignIds));

	// Count players per campaign (excluding GM)
	const playerCountMap = new Map<string, number>();
	for (const member of allMembers) {
		if (member.role === 'player') {
			const currentCount = playerCountMap.get(member.campaign_id) || 0;
			playerCountMap.set(member.campaign_id, currentCount + 1);
		}
	}

	// Get all characters for all campaigns
	const allCharacters = await db
		.select({
			campaign_id: characters_table.campaign_id,
			image_url: characters_table.image_url
		})
		.from(characters_table)
		.where(inArray(characters_table.campaign_id, campaignIds));

	// Group character images by campaign_id
	const characterImagesMap = new Map<string, string[]>();
	for (const char of allCharacters) {
		if (char.campaign_id && char.image_url) {
			const existing = characterImagesMap.get(char.campaign_id) || [];
			existing.push(char.image_url);
			characterImagesMap.set(char.campaign_id, existing);
		}
	}

	// Build enriched campaigns
	const enrichedCampaigns: CampaignWithDetails[] = campaigns.map((campaign) => {
		const userRole = userRoleMap.get(campaign.id) || 'player';
		const playerCount = playerCountMap.get(campaign.id) || 0;
		const characterImages = characterImagesMap.get(campaign.id) || [];
		
		// Limit character images to first 6 to avoid cluttering
		const limitedImages = characterImages.slice(0, 6);

		return {
			...campaign,
			user_role: userRole,
			player_count: playerCount,
			character_images: limitedImages
		};
	});

	console.log('fetched user campaigns from D1');
	return enrichedCampaigns;
});

export const get_campaign_state = query(z.string(), async (campaignId): Promise<CampaignState> => {
	const event = getRequestEvent();
	get_auth(event); // Validate authentication
	const kv = get_kv(event);
	const db = get_db(event);

	// Try KV first (write-through cache) - it's updated immediately after writes
	// This helps work around D1 eventual consistency by using KV as a fast, consistent cache
	const kvState = await kv.get(`campaign:${campaignId}:state`, 'json') as CampaignState | null;
	
	// If KV has valid state, use it (no need to read D1)
	if (kvState && kvState.updated_at) {
		console.log('fetched campaign state from KV');
		return kvState;
	}

	// KV is missing or invalid - read from D1
	const [dbState] = await db
		.select()
		.from(campaign_state_table)
		.where(eq(campaign_state_table.campaign_id, campaignId))
		.limit(1);

	// If no state exists in D1, create default
	if (!dbState) {
		const now = Date.now();
		await db.insert(campaign_state_table).values({
			campaign_id: campaignId,
			fear_track: 0,
			notes: null,
			updated_at: now
		});

		const defaultState: CampaignState = {
			campaign_id: campaignId,
			fear_track: 0,
			notes: null,
			updated_at: now
		};

		// Store in KV
		await kv.put(`campaign:${campaignId}:state`, JSON.stringify(defaultState), {
			expirationTtl: KV_TTL_24H
		});

		return defaultState;
	}

	const d1State: CampaignState = {
		campaign_id: dbState.campaign_id,
		fear_track: dbState.fear_track,
		notes: dbState.notes,
		updated_at: dbState.updated_at
	};

	// Update KV with D1 state
	await kv.put(`campaign:${campaignId}:state`, JSON.stringify(d1State), {
		expirationTtl: KV_TTL_24H
	});

	console.log('fetched campaign state from D1');
	return d1State;
});

// Helper function to validate and rebuild campaign character summaries
// Now uses the shared cache service
async function validateAndRebuildCampaignCharacters(
	kv: ReturnType<typeof get_kv>,
	db: ReturnType<typeof get_db>,
	campaignId: string
): Promise<Record<string, CampaignCharacterSummary>> {
	return rebuildCampaignCharacterCache(kv, db, campaignId);
}

export const get_campaign_characters = query(
	z.string(),
	async (campaignId): Promise<Record<string, CampaignCharacterSummary>> => {
		const event = getRequestEvent();
		get_auth(event); // Validate authentication
		const kv = get_kv(event);
		const db = get_db(event);

		// Try to get from KV first - trust the cache, SvelteKit query invalidation handles updates
		const kvCharacters = await kv.get(`campaign:${campaignId}:characters`, 'json');
		if (kvCharacters) {
			console.log('fetched campaign characters from KV');
			return kvCharacters as Record<string, CampaignCharacterSummary>;
		}

		// Cache miss - rebuild from D1
		const summaries = await validateAndRebuildCampaignCharacters(kv, db, campaignId);

		console.log('fetched campaign characters from D1');
		return summaries;
	}
);

// ============================================================================
// Commands
// ============================================================================

export const create_campaign = command(
	z.object({
		name: z.string().min(1),
		description: z.string().optional()
	}),
	async ({ name, description }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		const campaignId = crypto.randomUUID();
		const now = Date.now();

		// Create campaign
		await db.insert(campaigns_table).values({
			id: campaignId,
			gm_user_id: userId,
			name,
			description: description || null,
			created_at: now,
			updated_at: now
		});

		// Add GM as member
		await db.insert(campaign_members_table).values({
			campaign_id: campaignId,
			user_id: userId,
			role: 'gm',
			joined_at: now
		});

		// Create initial campaign state
		await db.insert(campaign_state_table).values({
			campaign_id: campaignId,
			fear_track: 0,
			notes: null,
			updated_at: now
		});

		// Store state in KV
		const kv = get_kv(event);
		const initialState: CampaignState = {
			campaign_id: campaignId,
			fear_track: 0,
			notes: null,
			updated_at: now
		};
		await kv.put(`campaign:${campaignId}:state`, JSON.stringify(initialState), {
			expirationTtl: KV_TTL_24H
		});

		// Refresh the query
		get_user_campaigns().refresh();

		console.log('created campaign in D1');
		return campaignId;
	}
);

export const join_campaign = command(z.string(), async (campaignId) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Check if campaign exists
	const [campaign] = await db
		.select()
		.from(campaigns_table)
		.where(eq(campaigns_table.id, campaignId))
		.limit(1);

	if (!campaign) {
		throw error(404, 'Campaign not found');
	}

	// Check if user is already a member
	const [existingMembership] = await db
		.select()
		.from(campaign_members_table)
		.where(
			and(
				eq(campaign_members_table.campaign_id, campaignId),
				eq(campaign_members_table.user_id, userId)
			)
		)
		.limit(1);

	if (existingMembership) {
		throw error(400, 'You are already a member of this campaign');
	}

	// Add user as player
	try {
		await db.insert(campaign_members_table).values({
			campaign_id: campaignId,
			user_id: userId,
			role: 'player',
			joined_at: Date.now()
		});
	} catch (err) {
		// Handle race condition: if user clicks join link multiple times quickly,
		// the check might pass but the insert fails due to primary key constraint
		const errorMessage = err instanceof Error ? err.message : String(err);
		if (
			errorMessage.includes('UNIQUE constraint') ||
			errorMessage.includes('PRIMARY KEY constraint') ||
			errorMessage.includes('Failed query')
		) {
			// User is already a member (race condition)
			throw error(400, 'You are already a member of this campaign');
		}
		// Re-throw other errors
		throw err;
	}

	// Refresh the query
	get_user_campaigns().refresh();

	console.log('joined campaign in D1');
	return { success: true };
});

export const claim_character = command(
	z.object({
		character_id: z.string(),
		campaign_id: z.string()
	}),
	async ({ character_id, campaign_id }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		// Get character
		const [character] = await db
			.select()
			.from(characters_table)
			.where(eq(characters_table.id, character_id))
			.limit(1);

		if (!character) {
			throw error(404, 'Character not found');
		}

		// Verify character is claimable
		if (character.claimable !== 1) {
			throw error(403, 'This character is not claimable');
		}

		// Verify character is in the specified campaign
		if (character.campaign_id !== campaign_id) {
			throw error(400, 'Character is not in this campaign');
		}

		// Verify user is a member of the campaign and get their role
		const access = await getCampaignAccessInternal(db, userId, campaign_id);
		if (!access.membership) {
			throw error(403, 'You must be a member of the campaign to claim characters');
		}

		// Verify user is a player (not GM)
		if (access.role === 'gm') {
			throw error(403, 'GMs cannot claim characters');
		}

		// Check if player already has a character in this campaign
		const existingCampaignCharacters = await db
			.select()
			.from(characters_table)
			.where(
				and(
					eq(characters_table.campaign_id, campaign_id),
					eq(characters_table.clerk_user_id, userId),
					eq(characters_table.claimable, 0)
				)
			)
			.limit(1);

		if (existingCampaignCharacters.length > 0) {
			throw error(403, 'You can only claim one character per campaign');
		}

		// Check if user has reached the character limit
		const existingCharacters = await db
			.select()
			.from(characters_table)
			.where(eq(characters_table.clerk_user_id, userId));

		if (existingCharacters.length >= 3) {
			throw error(403, 'Character limit reached. You can only have 3 characters.');
		}

		const kv = get_kv(event);

		// Update character ownership and set claimable to false
		await db
			.update(characters_table)
			.set({
				clerk_user_id: userId,
				claimable: 0
			})
			.where(eq(characters_table.id, character_id));

		// Update campaign summary using cache service
		await upsertCharacterSummary(kv, db, campaign_id, character_id);

		// Notify DO about character being updated (ownership changed)
		// Fetch full DerivedCharacter from KV
		const derivedChar = (await kv.get(`character:${character_id}:campaign`, 'json')) as
			| DerivedCharacter
			| null;
		
		if (derivedChar) {
			await notifyDurableObject(event, campaign_id, 'character_updated', {
				characterId: character_id,
				character: derivedChar
			});
		}

		// Refresh the queries
		get_campaign_characters(campaign_id).refresh();
		get_all_characters().refresh();

		console.log('claimed character in D1');
		return { success: true };
	}
);

export const leave_campaign = command(z.string(), async (campaignId) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Check if user is a member
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
		throw error(404, 'You are not a member of this campaign');
	}

	// Don't allow GM to leave (they must delete the campaign or transfer ownership)
	if (membership.role === 'gm') {
		throw error(400, 'GM cannot leave campaign. Delete the campaign or transfer ownership.');
	}

	// Remove user from campaign
	await db
		.delete(campaign_members_table)
		.where(
			and(
				eq(campaign_members_table.campaign_id, campaignId),
				eq(campaign_members_table.user_id, userId)
			)
		);

	// Get character IDs before removing them
	const charactersToRemove = await db
		.select({ id: characters_table.id })
		.from(characters_table)
		.where(
			and(
				eq(characters_table.campaign_id, campaignId),
				eq(characters_table.clerk_user_id, userId)
			)
		);

	// Remove any characters from campaign
	await db
		.update(characters_table)
		.set({ campaign_id: null })
		.where(
			and(
				eq(characters_table.campaign_id, campaignId),
				eq(characters_table.clerk_user_id, userId)
			)
		);

	// Update campaign character summary KV cache to reflect removed characters
	const kv = get_kv(event);
	await validateAndRebuildCampaignCharacters(kv, db, campaignId);

	// Notify DO about removed characters
	for (const char of charactersToRemove) {
		await notifyDurableObject(event, campaignId, 'character_removed', {
			characterId: char.id
		});
	}

	// Refresh the query
	get_user_campaigns().refresh();

	console.log('left campaign in D1');
	return { success: true };
});

export const update_campaign_state = command(
	z.object({
		campaign_id: z.string(),
		fear_track: z.number().optional(),
		notes: z.string().nullable().optional()
	}),
	async ({ campaign_id, fear_track, notes }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		// Verify user is GM
		const access = await getCampaignAccessInternal(db, userId, campaign_id);
		if (!access.canEdit) {
			throw error(403, 'Only the GM can update campaign state');
		}

		const now = Date.now();

		// Get current state to preserve fields not being updated
		const [currentState] = await db
			.select()
			.from(campaign_state_table)
			.where(eq(campaign_state_table.campaign_id, campaign_id))
			.limit(1);

		if (!currentState) {
			throw error(404, 'Campaign state not found');
		}

		// Update D1
		await db
			.update(campaign_state_table)
			.set({
				fear_track: fear_track !== undefined ? fear_track : currentState.fear_track,
				notes: notes !== undefined ? notes : currentState.notes,
				updated_at: now
			})
			.where(eq(campaign_state_table.campaign_id, campaign_id));

		// Verify the update by reading it back from D1 (handles eventual consistency)
		const [updatedState] = await db
			.select()
			.from(campaign_state_table)
			.where(eq(campaign_state_table.campaign_id, campaign_id))
			.limit(1);

		if (!updatedState) {
			throw error(500, 'Failed to verify campaign state update');
		}

		const state: CampaignState = {
			campaign_id: updatedState.campaign_id,
			fear_track: updatedState.fear_track,
			notes: updatedState.notes,
			updated_at: updatedState.updated_at
		};

		// Update KV cache for read-only views (browse, lobby, etc.)
		// Note: During live sessions, DO storage is authoritative, not KV
		const kv = get_kv(event);
		await kv.put(`campaign:${campaign_id}:state`, JSON.stringify(state), {
			expirationTtl: KV_TTL_24H
		});

		// Update the query cache with the new value
		await get_campaign_state(campaign_id).set(state);

		// Note: Live session updates should go through WebSocket to the Durable Object
		// This HTTP endpoint is for non-live updates or initial state setup

		console.log('updated campaign state in D1 and KV');
		return state;
	}
);

export const assign_character_to_campaign = command(
	z.object({
		character_id: z.string(),
		campaign_id: z.string().nullable(),
		claimable: z.boolean().optional()
	}),
	async ({ character_id, campaign_id, claimable }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		// Get character (without ownership check yet - we'll check permissions based on action)
		const [character] = await db
			.select()
			.from(characters_table)
			.where(eq(characters_table.id, character_id))
			.limit(1);

		if (!character) {
			throw error(404, 'Character not found');
		}

		const isOwner = character.clerk_user_id === userId;

		// Permission checks based on action
		if (campaign_id === null) {
			// Removing character from campaign
			// Allow if: character owner OR GM of the campaign the character is currently in
			if (!isOwner && character.campaign_id) {
				const access = await getCampaignAccessInternal(db, userId, character.campaign_id);
				if (!access.canEdit) {
					throw error(403, 'Only the character owner or campaign GM can remove characters from campaigns');
				}
			} else if (!isOwner) {
				throw error(403, 'Only the character owner can remove characters from campaigns');
			}
		} else {
			// Assigning character to campaign
			// Only character owner can assign their character to a campaign (unless GM is making it claimable)
			if (!isOwner) {
				throw error(403, 'Only the character owner can assign characters to campaigns');
			}

			// Verify user is a member of the campaign
			const access = await getCampaignAccessInternal(db, userId, campaign_id);
			if (!access.membership) {
				throw error(403, 'You must be a member of the campaign to assign characters');
			}

			// GMs cannot assign characters to campaigns (unless making them claimable)
			if (access.canEdit && claimable !== true) {
				throw error(403, 'GMs cannot assign characters to campaigns');
			}

			// Check if character is already in a different campaign
			if (character.campaign_id && character.campaign_id !== campaign_id) {
				throw error(400, 'Character is already assigned to another campaign');
			}
		}

		const kv = get_kv(event);
		const oldCampaignId = character.campaign_id;

		// Determine if character should be claimable
		// If claimable is explicitly set, use that value
		// Otherwise, preserve existing claimable status if character is already claimable
		// If character is not claimable and we're assigning to a campaign, check if user is GM
		let shouldBeClaimable = false;
		if (claimable !== undefined) {
			shouldBeClaimable = claimable;
		} else if (character.claimable === 1) {
			// Preserve existing claimable status
			shouldBeClaimable = true;
		} else if (campaign_id && !isOwner) {
			// If GM is assigning someone else's character, make it claimable
			// Note: We already fetched access above if campaign_id is not null
			const gmAccess = await getCampaignAccessInternal(db, userId, campaign_id);
			if (gmAccess.canEdit) {
				shouldBeClaimable = true;
			}
		}

		// Update character
		await db
			.update(characters_table)
			.set({ 
				campaign_id,
				claimable: shouldBeClaimable ? 1 : 0
			})
			.where(eq(characters_table.id, character_id));

		// If character was in another campaign, update old campaign summary
		if (oldCampaignId && oldCampaignId !== campaign_id) {
			await upsertCharacterSummary(kv, db, oldCampaignId, character_id);
		}

		// If assigned to campaign, update new campaign summary
		if (campaign_id) {
			await upsertCharacterSummary(kv, db, campaign_id, character_id);
			
			// Notify DO about character being added to campaign
			// Fetch full DerivedCharacter from KV
			const derivedChar = (await kv.get(`character:${character_id}:campaign`, 'json')) as
				| DerivedCharacter
				| null;
			
			if (derivedChar) {
				await notifyDurableObject(event, campaign_id, 'character_added', {
					characterId: character_id,
					character: derivedChar
				});
			}
		}

		// If character was removed from old campaign, notify DO
		if (oldCampaignId && oldCampaignId !== campaign_id) {
			await notifyDurableObject(event, oldCampaignId, 'character_removed', {
				characterId: character_id
			});
		}

		// Refresh the queries for affected campaigns
		if (oldCampaignId && oldCampaignId !== campaign_id) {
			get_campaign_characters(oldCampaignId).refresh();
		}
		if (campaign_id) {
			get_campaign_characters(campaign_id).refresh();
		}

		// Refresh get_all_characters since campaign_id changed, affecting which characters appear in user's list
		get_all_characters().refresh();
		
		// Refresh get_user_campaigns since character_images may have changed
		get_user_campaigns().refresh();

		console.log('assigned character to campaign in D1');
		return { success: true };
	}
);

export const update_campaign = command(
	z.object({
		campaign_id: z.string(),
		name: z.string().min(1).optional(),
		description: z.string().nullable().optional()
	}),
	async ({ campaign_id, name, description }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		// Verify user is GM
		const [campaign] = await db
			.select()
			.from(campaigns_table)
			.where(eq(campaigns_table.id, campaign_id))
			.limit(1);

		if (!campaign) {
			throw error(404, 'Campaign not found');
		}

		if (campaign.gm_user_id !== userId) {
			throw error(403, 'Only the GM can update the campaign');
		}

		const now = Date.now();

		// Update campaign
		await db
			.update(campaigns_table)
			.set({
				name: name !== undefined ? name : campaign.name,
				description: description !== undefined ? description : campaign.description,
				updated_at: now
			})
			.where(eq(campaigns_table.id, campaign_id));

		// Refresh the query
		get_user_campaigns().refresh();

		console.log('updated campaign in D1');
		return { success: true };
	}
);

export const delete_campaign = command(z.string(), async (campaignId) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);
	const kv = get_kv(event);

	// Verify user is GM
	const [campaign] = await db
		.select()
		.from(campaigns_table)
		.where(eq(campaigns_table.id, campaignId))
		.limit(1);

	if (!campaign) {
		throw error(404, 'Campaign not found');
	}

	if (campaign.gm_user_id !== userId) {
		throw error(403, 'Only the GM can delete the campaign');
	}

	// Remove all characters from campaign (set campaign_id to null)
	await db
		.update(characters_table)
		.set({ campaign_id: null })
		.where(eq(characters_table.campaign_id, campaignId));

	// Delete campaign members
	await db.delete(campaign_members_table).where(eq(campaign_members_table.campaign_id, campaignId));

	// Delete campaign state
	await db.delete(campaign_state_table).where(eq(campaign_state_table.campaign_id, campaignId));

	// Delete campaign homebrew vault entries
	await db
		.delete(campaign_homebrew_vault_table)
		.where(eq(campaign_homebrew_vault_table.campaign_id, campaignId));

	// Clean up KV entries
	await kv.delete(`campaign:${campaignId}:state`);
	await kv.delete(`campaign:${campaignId}:characters`);

	// Delete campaign
	await db.delete(campaigns_table).where(eq(campaigns_table.id, campaignId));

	// Refresh the query
	get_user_campaigns().refresh();

	console.log('deleted campaign from D1 and KV');
	return { success: true };
});

