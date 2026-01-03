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
import type { CampaignState, CampaignCharacterSummary } from '../types/campaign-types';
import type { Character } from '../types/character-types';
import type { DerivedCharacter } from '../types/derived-character-types';

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

// Helper function to check if a user is a GM of a campaign
async function checkIsGM(campaignId: string, userId: string, db: ReturnType<typeof get_db>): Promise<boolean> {
	const members = await db
		.select()
		.from(campaign_members_table)
		.where(
			and(
				eq(campaign_members_table.campaign_id, campaignId),
				eq(campaign_members_table.user_id, userId)
			)
		);
	
	const member = members.find((m) => m.user_id === userId && m.campaign_id === campaignId);
	return member?.role === 'gm';
}

export const get_user_campaigns = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Get campaigns where user is a member
	const memberships = await db
		.select()
		.from(campaign_members_table)
		.where(eq(campaign_members_table.user_id, userId));

	const campaignIds = memberships.map((m) => m.campaign_id);

	if (campaignIds.length === 0) {
		return [];
	}

	// Get campaign details
	const campaigns = await db
		.select()
		.from(campaigns_table)
		.where(eq(campaigns_table.id, campaignIds[0])); // TODO: Use inArray when drizzle supports it

	// For now, fetch one by one (inefficient but works)
	const allCampaigns = [];
	for (const id of campaignIds) {
		const [campaign] = await db
			.select()
			.from(campaigns_table)
			.where(eq(campaigns_table.id, id))
			.limit(1);
		if (campaign) {
			allCampaigns.push(campaign);
		}
	}

	console.log('fetched user campaigns from D1');
	return allCampaigns;
});

export const get_campaign_state = query(z.string(), async (campaignId): Promise<CampaignState> => {
	const event = getRequestEvent();
	get_auth(event); // Validate authentication
	const kv = get_kv(event);
	const db = get_db(event);

	// Try KV first (write-through cache) - it's updated immediately after writes
	// This helps work around D1 eventual consistency by using KV as a fast, consistent cache
	const kvState = await kv.get(`campaign:${campaignId}:state`, 'json') as CampaignState | null;
	
	// Also read from D1 in parallel to compare
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
			expirationTtl: undefined
		});

		return defaultState;
	}

	const d1State: CampaignState = {
		campaign_id: dbState.campaign_id,
		fear_track: dbState.fear_track,
		notes: dbState.notes,
		updated_at: dbState.updated_at
	};

	// Use KV if it exists and is newer or equal to D1 (KV is updated immediately after writes)
	// Otherwise use D1 and update KV
	if (kvState && kvState.updated_at && kvState.updated_at >= d1State.updated_at) {
		console.log('fetched campaign state from KV (newer than D1)');
		return kvState;
	}

	// D1 is newer or KV is missing - use D1 and update KV
	await kv.put(`campaign:${campaignId}:state`, JSON.stringify(d1State), {
		expirationTtl: undefined
	});

	console.log('fetched campaign state from D1');
	return d1State;
});

// Helper function to validate and rebuild campaign character summaries
async function validateAndRebuildCampaignCharacters(
	kv: ReturnType<typeof get_kv>,
	db: ReturnType<typeof get_db>,
	campaignId: string
): Promise<Record<string, CampaignCharacterSummary>> {
	// Get all characters in campaign from D1
	const characters = await db
		.select()
		.from(characters_table)
		.where(eq(characters_table.campaign_id, campaignId));

	// Convert to summaries
	const summaries: Record<string, CampaignCharacterSummary> = {};
	for (const char of characters) {
		// Try to get derived character from KV (public or campaign)
		let max_hp = 0;
		let max_stress = 6;
		let max_hope = 6;

		// Try public KV first, then campaign KV
		let derivedChar = (await kv.get(`character:${char.id}:public`, 'json')) as
			| DerivedCharacter
			| null;
		if (!derivedChar) {
			derivedChar = (await kv.get(`character:${char.id}:campaign`, 'json')) as
				| DerivedCharacter
				| null;
		}

		if (derivedChar) {
			max_hp = derivedChar.derived_max_hp;
			max_stress = derivedChar.derived_max_stress;
			max_hope = derivedChar.derived_max_hope;
		}

		summaries[char.id] = {
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
			owner_user_id: char.clerk_user_id
		};
	}

	// Store in KV for future reads
	await kv.put(`campaign:${campaignId}:characters`, JSON.stringify(summaries), {
		expirationTtl: undefined
	});

	return summaries;
}

export const get_campaign_characters = query(
	z.string(),
	async (campaignId): Promise<Record<string, CampaignCharacterSummary>> => {
		const event = getRequestEvent();
		get_auth(event); // Validate authentication
		const kv = get_kv(event);
		const db = get_db(event);

		// Try to get from KV first (for polling)
		const kvCharacters = await kv.get(`campaign:${campaignId}:characters`, 'json');
		if (kvCharacters) {
			// Validate that all characters in cache still exist in D1 and belong to this campaign
			const cachedCharacterIds = Object.keys(kvCharacters as Record<string, CampaignCharacterSummary>);
			
			if (cachedCharacterIds.length > 0) {
				// Check if all cached characters still exist and belong to this campaign
				const existingCharacters = await db
					.select({ id: characters_table.id })
					.from(characters_table)
					.where(
						and(
							eq(characters_table.campaign_id, campaignId),
							inArray(characters_table.id, cachedCharacterIds)
						)
					);

				const existingCharacterIds = new Set(existingCharacters.map((c) => c.id));
				const allValid = cachedCharacterIds.every((id) => existingCharacterIds.has(id));

				if (allValid && existingCharacters.length === cachedCharacterIds.length) {
					// All cached characters are valid
					console.log('fetched campaign characters from KV (validated)');
					return kvCharacters as Record<string, CampaignCharacterSummary>;
				}
			}
			
			// Cache is invalid or empty, rebuild from D1
			console.log('KV cache invalid, rebuilding from D1');
		}

		// Fallback to D1 or rebuild if cache was invalid
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
			expirationTtl: undefined
		});

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

	console.log('joined campaign in D1');
	return { success: true };
});

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
		const members = await get_campaign_members(campaign_id);
		const member = members.find((m) => m.user_id === userId && m.campaign_id === campaign_id);
		if (member?.role !== 'gm') {
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

		// Update KV - delete first to invalidate cache, then write new value
		// This ensures next read will check D1 if KV hasn't propagated yet
		const kv = get_kv(event);
		// Delete KV entry to force next read to use D1 (handles eventual consistency)
		await kv.delete(`campaign:${campaign_id}:state`);
		// Then write the new value
		await kv.put(`campaign:${campaign_id}:state`, JSON.stringify(state), {
			expirationTtl: undefined
		});

		// Refresh the query cache to invalidate it for all clients
		// This causes all clients to refetch on their next query call
		// Then set the new value so the current request gets it immediately
		await get_campaign_state(campaign_id).refresh();
		await get_campaign_state(campaign_id).set(state);

		// Notify Durable Object of the update
		await notify_campaign_do(campaign_id, {
			fear_track: state.fear_track,
			notes: state.notes,
			updated_at: state.updated_at
		});

		console.log('updated campaign state in D1 and KV');
		return state;
	}
);

// Helper function to notify Durable Object of state updates
async function notify_campaign_do(campaignId: string, updates: Partial<CampaignState>) {
	const event = getRequestEvent();
	if (!event.platform?.env?.CAMPAIGN_LIVE) {
		console.warn('CAMPAIGN_LIVE not available, skipping DO notification');
		return;
	}
	
	try {
		const id = event.platform.env.CAMPAIGN_LIVE.idFromName(campaignId);
		const stub = event.platform.env.CAMPAIGN_LIVE.get(id);
		
		await stub.fetch('http://do/update', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updates)
		});
	} catch (error) {
		// Log but don't throw - D1 is source of truth
		console.error('Failed to notify DO:', error);
	}
}

export const assign_character_to_campaign = command(
	z.object({
		character_id: z.string(),
		campaign_id: z.string().nullable()
	}),
	async ({ character_id, campaign_id }) => {
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
				const isGM = await checkIsGM(character.campaign_id, userId, db);
				if (!isGM) {
					throw error(403, 'Only the character owner or campaign GM can remove characters from campaigns');
				}
			} else if (!isOwner) {
				throw error(403, 'Only the character owner can remove characters from campaigns');
			}
		} else {
			// Assigning character to campaign
			// Only character owner can assign their character to a campaign
			if (!isOwner) {
				throw error(403, 'Only the character owner can assign characters to campaigns');
			}

			// Verify user is a member of the campaign
			const members = await get_campaign_members(campaign_id);
			const isMember = members.some((m) => m.user_id === userId && m.campaign_id === campaign_id);
			if (!isMember) {
				throw error(403, 'You must be a member of the campaign to assign characters');
			}

			// GMs cannot assign characters to campaigns
			const isGM = await checkIsGM(campaign_id, userId, db);
			if (isGM) {
				throw error(403, 'GMs cannot assign characters to campaigns');
			}

			// Check if character is already in a different campaign
			if (character.campaign_id && character.campaign_id !== campaign_id) {
				throw error(400, 'Character is already assigned to another campaign');
			}
		}

		const kv = get_kv(event);
		const oldCampaignId = character.campaign_id;

		// Update character
		await db
			.update(characters_table)
			.set({ campaign_id })
			.where(eq(characters_table.id, character_id));

		// Helper to update campaign summary (avoid circular import)
		async function updateCampaignSummary(campaignId: string, characterId: string) {
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

			// Get all characters in campaign to rebuild summary
			const characters = await db
				.select()
				.from(characters_table)
				.where(eq(characters_table.campaign_id, campaignId));

			const summaries: Record<string, CampaignCharacterSummary> = {};
			for (const c of characters) {
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
					owner_user_id: c.clerk_user_id
				};
			}

			await kv.put(`campaign:${campaignId}:characters`, JSON.stringify(summaries), {
				expirationTtl: undefined
			});
		}

		// If character was in another campaign, update old campaign summary
		if (oldCampaignId && oldCampaignId !== campaign_id) {
			await updateCampaignSummary(oldCampaignId, character_id);
		}

		// If assigned to campaign, update new campaign summary
		if (campaign_id) {
			await updateCampaignSummary(campaign_id, character_id);
		}

		// Refresh the queries for affected campaigns
		if (oldCampaignId && oldCampaignId !== campaign_id) {
			get_campaign_characters(oldCampaignId).refresh();
		}
		if (campaign_id) {
			get_campaign_characters(campaign_id).refresh();
		}

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

