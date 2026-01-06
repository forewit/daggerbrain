import { eq } from 'drizzle-orm';
import type { KVNamespace } from '@cloudflare/workers-types';
import type { get_db } from './utils';
import { characters_table } from '../server/db/characters.schema';
import type { CampaignCharacterSummary } from '../types/campaign-types';
import type { DerivedCharacter } from '../types/derived-character-types';

/**
 * TTL constant for KV cache entries (24 hours in seconds).
 * Provides a safety net for self-healing if cache updates fail.
 */
export const KV_TTL_24H = 60 * 60 * 24;

type DB = ReturnType<typeof get_db>;

/**
 * Upserts a single character summary into the campaign's character cache.
 * Used for incremental updates when a character changes.
 */
export async function upsertCharacterSummary(
	kv: KVNamespace,
	db: DB,
	campaignId: string,
	characterId: string
): Promise<void> {
	// Get the character from database
	const [char] = await db
		.select()
		.from(characters_table)
		.where(eq(characters_table.id, characterId))
		.limit(1);

	if (!char || char.campaign_id !== campaignId) {
		// Character not in this campaign, remove from summary
		await removeCharacterFromSummary(kv, campaignId, characterId);
		return;
	}

	// Get existing summary and update only this character (more efficient than full rebuild)
	const existing = (await kv.get(`campaign:${campaignId}:characters`, 'json')) as
		| Record<string, CampaignCharacterSummary>
		| null;

	const summaries = existing || {};

	// Get derived character from KV (campaign)
	const derivedChar = (await kv.get(`character:${characterId}:campaign`, 'json')) as
		| DerivedCharacter
		| null;
	const max_hp = derivedChar?.derived_max_hp ?? 0;
	const max_stress = derivedChar?.derived_max_stress ?? 6;
	const max_hope = derivedChar?.derived_max_hope ?? 6;
	const evasion = derivedChar?.derived_evasion ?? 0;
	const max_armor = derivedChar?.derived_max_armor ?? 0;
	const damage_thresholds = derivedChar?.derived_damage_thresholds ?? { major: 0, severe: 0 };

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
		derived_descriptors: char.derived_descriptors,
		evasion,
		max_armor,
		marked_armor: char.marked_armor,
		damage_thresholds,
		claimable: char.claimable === 1
	};

	// Update KV with TTL safety net
	await kv.put(`campaign:${campaignId}:characters`, JSON.stringify(summaries), {
		expirationTtl: KV_TTL_24H
	});
}

/**
 * Removes a character from the campaign's character cache.
 * Used when a character is deleted or removed from a campaign.
 */
export async function removeCharacterFromSummary(
	kv: KVNamespace,
	campaignId: string,
	characterId: string
): Promise<void> {
	const existing = (await kv.get(`campaign:${campaignId}:characters`, 'json')) as
		| Record<string, CampaignCharacterSummary>
		| null;
	if (existing) {
		delete existing[characterId];
		await kv.put(`campaign:${campaignId}:characters`, JSON.stringify(existing), {
			expirationTtl: KV_TTL_24H
		});
	}
}

/**
 * Rebuilds the entire campaign character cache from the database.
 * Used for validation, initial load, or when a full rebuild is needed.
 */
export async function rebuildCampaignCharacterCache(
	kv: KVNamespace,
	db: DB,
	campaignId: string
): Promise<Record<string, CampaignCharacterSummary>> {
	// Get all characters in campaign from D1
	const characters = await db
		.select()
		.from(characters_table)
		.where(eq(characters_table.campaign_id, campaignId));

	// Convert to summaries - use parallel KV lookups for better performance
	const summaries: Record<string, CampaignCharacterSummary> = {};

	// Build list of KV keys to fetch in parallel
	const kvKeys = characters.map((char) => `character:${char.id}:campaign`);

	// Fetch all KV entries in parallel
	const kvResults = await Promise.all(kvKeys.map((key) => kv.get(key, 'json')));

	// Create a map of character ID to derived character data
	const derivedCharMap = new Map<string, DerivedCharacter>();
	for (let i = 0; i < characters.length; i++) {
		const char = characters[i];
		const derivedChar = kvResults[i] as DerivedCharacter | null;
		if (derivedChar) {
			derivedCharMap.set(char.id, derivedChar);
		}
	}

	// Build summaries
	for (const char of characters) {
		const derivedChar = derivedCharMap.get(char.id);
		const max_hp = derivedChar?.derived_max_hp ?? 0;
		const max_stress = derivedChar?.derived_max_stress ?? 6;
		const max_hope = derivedChar?.derived_max_hope ?? 6;
		const evasion = derivedChar?.derived_evasion ?? 0;
		const max_armor = derivedChar?.derived_max_armor ?? 0;
		const damage_thresholds = derivedChar?.derived_damage_thresholds ?? { major: 0, severe: 0 };

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
			owner_user_id: char.clerk_user_id,
			derived_descriptors: char.derived_descriptors,
			evasion,
			max_armor,
			marked_armor: char.marked_armor,
			damage_thresholds,
			claimable: char.claimable === 1
		};
	}

	// Store in KV for future reads with TTL safety net
	await kv.put(`campaign:${campaignId}:characters`, JSON.stringify(summaries), {
		expirationTtl: KV_TTL_24H
	});

	return summaries;
}

