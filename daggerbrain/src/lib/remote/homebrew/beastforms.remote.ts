import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { get_db, get_auth, get_kv } from '../utils';
import { campaign_homebrew_vault_table } from '../../server/db/campaigns.schema';
import { BeastformSchema } from '$lib/compendium/compendium-schemas';
import type { Beastform } from '$lib/types/compendium-types';
import { homebrew_beastforms } from '$lib/server/db/homebrew.schema';
import {
	verifyOwnership,
	getTotalHomebrewCount,
	HOMEBREW_LIMIT,
	assertHomebrewTypeEnabled
} from './utils';

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

		// Verify ownership
		const [existing] = await db
			.select()
			.from(homebrew_beastforms)
			.where(eq(homebrew_beastforms.id, id))
			.limit(1);

		if (!existing || existing.clerk_user_id !== userId) {
			throw error(403, 'Not authorized to update this beastform');
		}

		const validatedData = BeastformSchema.parse({ ...data, source_id: 'Homebrew' as const });
		validatedData.compendium_id = id;
		const now = Date.now();

		await db
			.update(homebrew_beastforms)
			.set({ data: validatedData, updated_at: now })
			.where(and(eq(homebrew_beastforms.id, id), eq(homebrew_beastforms.clerk_user_id, userId)));

		console.log('updated homebrew beastform in D1');
	}
);

export const delete_homebrew_beastform = command(z.string(), async (id) => {
	assertHomebrewTypeEnabled('beastform');
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Verify ownership
	const [existing] = await db
		.select()
		.from(homebrew_beastforms)
		.where(eq(homebrew_beastforms.id, id))
		.limit(1);

	if (!existing || existing.clerk_user_id !== userId) {
		throw error(403, 'Not authorized to delete this beastform');
	}

	await db
		.delete(homebrew_beastforms)
		.where(and(eq(homebrew_beastforms.id, id), eq(homebrew_beastforms.clerk_user_id, userId)));

	// Remove from all campaign vaults
	await db
		.delete(campaign_homebrew_vault_table)
		.where(
			and(
				eq(campaign_homebrew_vault_table.homebrew_type, 'beastform'),
				eq(campaign_homebrew_vault_table.homebrew_id, id)
			)
		);

	// refresh the beastforms query
	get_homebrew_beastforms().refresh();
	console.log('deleted homebrew beastform from D1');
});
