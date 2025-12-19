import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { get_db, get_auth } from '../utils';
import { BeastformSchema } from '$lib/compendium/compendium-schemas';
import type { Beastform } from '$lib/types/compendium-types';
import { homebrew_beastforms } from '$lib/server/db/homebrew.schema';
import { verifyOwnership } from './utils';

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
	return result;
});

export const create_homebrew_beastform = command(BeastformSchema, async (data) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const validatedData = BeastformSchema.parse({ ...data, source_id: 'Homebrew' as const });
	const id = crypto.randomUUID();
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

	return id;
});

export const update_homebrew_beastform = command(
	z.object({ id: z.string(), data: BeastformSchema }),
	async ({ id, data }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		if (!(await verifyOwnership(db, homebrew_beastforms, id, userId))) {
			throw error(403, 'Not authorized to update this beastform');
		}

		const validatedData = BeastformSchema.parse({ ...data, source_id: 'Homebrew' as const });
		const now = Date.now();

		await db
			.update(homebrew_beastforms)
			.set({ data: validatedData, updated_at: now })
			.where(and(eq(homebrew_beastforms.id, id), eq(homebrew_beastforms.clerk_user_id, userId)));
	}
);

export const delete_homebrew_beastform = command(z.string(), async (id) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	if (!(await verifyOwnership(db, homebrew_beastforms, id, userId))) {
		throw error(403, 'Not authorized to delete this beastform');
	}

	await db
		.delete(homebrew_beastforms)
		.where(and(eq(homebrew_beastforms.id, id), eq(homebrew_beastforms.clerk_user_id, userId)));

	// refresh the beastforms query
	get_homebrew_beastforms().refresh();
});
