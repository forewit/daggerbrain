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
import { z } from 'zod';
import { get_db, get_auth } from './utils';
import {
	getCampaignAccessInternal,
	getCharacterAccessInternal,
	type HomebrewType
} from '../server/permissions';
import type {
	CampaignAccess,
	CharacterAccess
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

	return getCampaignAccessInternal(db, userId, campaignId);
});


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

		return getCharacterAccessInternal(db, userId, characterId);
	}
);
