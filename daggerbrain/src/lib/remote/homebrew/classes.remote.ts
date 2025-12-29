import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { get_db, get_auth } from '../utils';
import { ClassSchema, SubclassSchema } from '$lib/compendium/compendium-schemas';
import type { CharacterClass, Subclass } from '$lib/types/compendium-types';
import { homebrew_classes, homebrew_subclasses } from '$lib/server/db/homebrew.schema';
import { verifyOwnership, getTotalHomebrewCount, HOMEBREW_LIMIT } from './utils';

// ============================================================================
// Classes
// ============================================================================

export const get_homebrew_classes = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const entries = await db
		.select()
		.from(homebrew_classes)
		.where(eq(homebrew_classes.clerk_user_id, userId));

	const result: Record<string, CharacterClass> = {};
	for (const entry of entries) {
		const validated = ClassSchema.parse(entry.data);
		result[entry.id] = validated;
	}
	console.log('fetched homebrew classes from D1');
	return result;
});

export const create_homebrew_class = command(ClassSchema, async (data) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Check if user has reached the global homebrew limit
	const totalCount = await getTotalHomebrewCount(db, userId);
	if (totalCount >= HOMEBREW_LIMIT) {
		throw error(403, `Homebrew limit reached. You can only have ${HOMEBREW_LIMIT} custom items.`);
	}

	// Ensure source_id is Homebrew and validate
	const validatedData = ClassSchema.parse({ ...data, source_id: 'Homebrew' as const });
	const id = crypto.randomUUID();
	const now = Date.now();

	await db.insert(homebrew_classes).values({
		id,
		clerk_user_id: userId,
		data: validatedData,
		created_at: now,
		updated_at: now
	});

	// refresh the classes query
	get_homebrew_classes().refresh();

	console.log('created homebrew class in D1');
	return id;
});

export const update_homebrew_class = command(
	z.object({ id: z.string(), data: ClassSchema }),
	async ({ id, data }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		if (!(await verifyOwnership(db, homebrew_classes, id, userId))) {
			throw error(403, 'Not authorized to update this class');
		}

		const validatedData = ClassSchema.parse({ ...data, source_id: 'Homebrew' as const });
		const now = Date.now();

		await db
			.update(homebrew_classes)
			.set({ data: validatedData, updated_at: now })
			.where(and(eq(homebrew_classes.id, id), eq(homebrew_classes.clerk_user_id, userId)));

		console.log('updated homebrew class in D1');
	}
);

export const delete_homebrew_class = command(z.string(), async (id) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	if (!(await verifyOwnership(db, homebrew_classes, id, userId))) {
		throw error(403, 'Not authorized to delete this class');
	}

	await db
		.delete(homebrew_classes)
		.where(and(eq(homebrew_classes.id, id), eq(homebrew_classes.clerk_user_id, userId)));

	// refresh the classes query
	get_homebrew_classes().refresh();
	console.log('deleted homebrew class from D1');
});

// ============================================================================
// Subclasses
// ============================================================================

export const get_homebrew_subclasses = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const entries = await db
		.select()
		.from(homebrew_subclasses)
		.where(eq(homebrew_subclasses.clerk_user_id, userId));

	const result: Record<string, Subclass> = {};
	for (const entry of entries) {
		const validated = SubclassSchema.parse(entry.data);
		result[entry.id] = validated;
	}
	console.log('fetched homebrew subclasses from D1');
	return result;
});

export const create_homebrew_subclass = command(SubclassSchema, async (data) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Check if user has reached the global homebrew limit
	const totalCount = await getTotalHomebrewCount(db, userId);
	if (totalCount >= HOMEBREW_LIMIT) {
		throw error(403, `Homebrew limit reached. You can only have ${HOMEBREW_LIMIT} custom items.`);
	}

	const validatedData = SubclassSchema.parse({ ...data, source_id: 'Homebrew' as const });
	const id = crypto.randomUUID();
	const now = Date.now();

	await db.insert(homebrew_subclasses).values({
		id,
		clerk_user_id: userId,
		data: validatedData,
		created_at: now,
		updated_at: now
	});

	// refresh the subclasses query
	get_homebrew_subclasses().refresh();

	console.log('created homebrew subclass in D1');
	return id;
});

export const update_homebrew_subclass = command(
	z.object({ id: z.string(), data: SubclassSchema }),
	async ({ id, data }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		if (!(await verifyOwnership(db, homebrew_subclasses, id, userId))) {
			throw error(403, 'Not authorized to update this subclass');
		}

		const validatedData = SubclassSchema.parse({ ...data, source_id: 'Homebrew' as const });
		const now = Date.now();

		await db
			.update(homebrew_subclasses)
			.set({ data: validatedData, updated_at: now })
			.where(and(eq(homebrew_subclasses.id, id), eq(homebrew_subclasses.clerk_user_id, userId)));

		console.log('updated homebrew subclass in D1');
	}
);

export const delete_homebrew_subclass = command(z.string(), async (id) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	if (!(await verifyOwnership(db, homebrew_subclasses, id, userId))) {
		throw error(403, 'Not authorized to delete this subclass');
	}

	await db
		.delete(homebrew_subclasses)
		.where(and(eq(homebrew_subclasses.id, id), eq(homebrew_subclasses.clerk_user_id, userId)));

	// refresh the subclasses query
	get_homebrew_subclasses().refresh();
	console.log('deleted homebrew subclass from D1');
});
