import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { get_db, get_auth, get_kv } from '../utils';
import { campaign_homebrew_vault_table } from '../../server/db/campaigns.schema';
import { BeastformSchema } from '@shared/schemas/compendium.schemas';
import type { Beastform } from '@shared/types/compendium.types';
import { homebrew_beastforms } from '$lib/server/db/homebrew.schema';
import {
	verifyOwnership,
	getTotalHomebrewCount,
	HOMEBREW_LIMIT,
	assertHomebrewTypeEnabled
} from './utils';
import { getHomebrewAccessInternal } from '../../server/permissions';

// ============================================================================
// Beastforms
// ============================================================================

export const get_homebrew_beastforms = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const entries = await db
		.select()
		.from(homebrew_beastforms)
		.where(eq(homebrew_beastforms.clerk_user_id, userId));

	const result: Record<string, Beastform> = {};
	for (const entry of entries) {
		const validated = BeastformSchema.parse(entry.data);
		result[entry.id] = validated;
	}
	console.log('fetched homebrew beastforms from D1');
	return result;
});

export const create_homebrew_beastform = command(BeastformSchema, async (data) => {
	assertHomebrewTypeEnabled('beastform');
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Check if user has reached the global homebrew limit
	const totalCount = await getTotalHomebrewCount(db, userId);
	if (totalCount >= HOMEBREW_LIMIT) {
		throw error(403, `Homebrew limit reached. You can only have ${HOMEBREW_LIMIT} custom items.`);
	}

	const validatedData = BeastformSchema.parse({ ...data, source_id: 'Homebrew' as const });
	const id = crypto.randomUUID();
	validatedData.compendium_id = id;
	const now = Date.now();

	await db.insert(homebrew_beastforms).values({
		id,
		clerk_user_id: userId,
		data: validatedData,
		created_at: now,
		updated_at: now
	});

	// refresh the beastforms query
	get_homebrew_beastforms().refresh();

	console.log('created homebrew beastform in D1');
	return id;
});

export const update_homebrew_beastform = command(
	z.object({ id: z.string(), data: BeastformSchema }),
	async ({ id, data }) => {
		assertHomebrewTypeEnabled('beastform');
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		// Get homebrew item with permissions
		const access = await getHomebrewAccessInternal(db, userId, 'beastforms', id);

		if (!access.canEdit) {
			throw error(403, 'Not authorized to update this beastform');
		}

		const validatedData = BeastformSchema.parse({ ...data, source_id: 'Homebrew' as const });
		validatedData.compendium_id = id;
		const now = Date.now();

		await db
			.update(homebrew_beastforms)
			.set({ data: validatedData, updated_at: now })
			.where(eq(homebrew_beastforms.id, id));

		console.log('updated homebrew beastform in D1');
	}
);

export const delete_homebrew_beastform = command(z.string(), async (id) => {
	assertHomebrewTypeEnabled('beastform');
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Get homebrew item with permissions
	const access = await getHomebrewAccessInternal(db, userId, 'beastforms', id);

	if (!access.isOwner) {
		throw error(403, 'Not authorized to delete this beastform');
	}

	// Atomic batch delete - both operations succeed or both fail
	await db.batch([
		// Delete from homebrew table
		db.delete(homebrew_beastforms).where(eq(homebrew_beastforms.id, id)),

		// Delete from all campaign vaults
		db
			.delete(campaign_homebrew_vault_table)
			.where(
				and(
					eq(campaign_homebrew_vault_table.homebrew_type, 'beastform'),
					eq(campaign_homebrew_vault_table.homebrew_id, id)
				)
			)
	]);

	// refresh the beastforms query
	get_homebrew_beastforms().refresh();
	console.log('deleted homebrew beastform from D1');
});
