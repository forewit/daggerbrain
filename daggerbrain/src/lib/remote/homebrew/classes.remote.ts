import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { get_db, get_auth, get_kv } from '../utils';
import { ClassSchema, SubclassSchema } from '$lib/compendium/compendium-schemas';
import type { CharacterClass, Subclass } from '$lib/types/compendium-types';
import { homebrew_classes, homebrew_subclasses } from '$lib/server/db/homebrew.schema';
import { campaign_homebrew_vault_table } from '../../server/db/campaigns.schema';
import {
	verifyOwnership,
	getTotalHomebrewCount,
	HOMEBREW_LIMIT,
	assertHomebrewTypeEnabled
} from './utils';
import { getHomebrewAccessInternal } from '../../server/permissions';

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
	assertHomebrewTypeEnabled('class');
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
	validatedData.compendium_id = id;
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
		assertHomebrewTypeEnabled('class');
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		// Get homebrew item with permissions
		const access = await getHomebrewAccessInternal(db, userId, 'classes', id);

		if (!access.canEdit) {
			throw error(403, 'Not authorized to update this class');
		}

		const validatedData = ClassSchema.parse({ ...data, source_id: 'Homebrew' as const });
		validatedData.compendium_id = id;
		const now = Date.now();

		await db
			.update(homebrew_classes)
			.set({ data: validatedData, updated_at: now })
			.where(eq(homebrew_classes.id, id));

		console.log('updated homebrew class in D1');
	}
);

export const delete_homebrew_class = command(z.string(), async (id) => {
	assertHomebrewTypeEnabled('class');
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Get homebrew item with permissions
	const access = await getHomebrewAccessInternal(db, userId, 'classes', id);

	if (!access.isOwner) {
		throw error(403, 'Not authorized to delete this class');
	}

	// Atomic batch delete - both operations succeed or both fail
	await db.batch([
		// Delete from homebrew table
		db.delete(homebrew_classes).where(eq(homebrew_classes.id, id)),

		// Delete from all campaign vaults
		db
			.delete(campaign_homebrew_vault_table)
			.where(
				and(
					eq(campaign_homebrew_vault_table.homebrew_type, 'class'),
					eq(campaign_homebrew_vault_table.homebrew_id, id)
				)
			)
	]);

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
	assertHomebrewTypeEnabled('subclass');
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
	validatedData.compendium_id = id;
	// Set compendium_ids for nested cards (generate UUIDs if empty or missing)
	if (
		validatedData.foundation_card &&
		(!validatedData.foundation_card.compendium_id ||
			validatedData.foundation_card.compendium_id === '')
	) {
		validatedData.foundation_card.compendium_id = crypto.randomUUID();
	}
	if (
		validatedData.specialization_card &&
		(!validatedData.specialization_card.compendium_id ||
			validatedData.specialization_card.compendium_id === '')
	) {
		validatedData.specialization_card.compendium_id = crypto.randomUUID();
	}
	if (
		validatedData.mastery_card &&
		(!validatedData.mastery_card.compendium_id || validatedData.mastery_card.compendium_id === '')
	) {
		validatedData.mastery_card.compendium_id = crypto.randomUUID();
	}
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
		assertHomebrewTypeEnabled('subclass');
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		// Get homebrew item with permissions
		const access = await getHomebrewAccessInternal(db, userId, 'subclasses', id);

		if (!access.canEdit) {
			throw error(403, 'Not authorized to update this subclass');
		}

		const validatedData = SubclassSchema.parse({ ...data, source_id: 'Homebrew' as const });
		validatedData.compendium_id = id;
		// Ensure nested cards have compendium_ids set (preserve existing or generate new if empty)
		if (
			validatedData.foundation_card &&
			(!validatedData.foundation_card.compendium_id ||
				validatedData.foundation_card.compendium_id === '')
		) {
			validatedData.foundation_card.compendium_id = crypto.randomUUID();
		}
		if (
			validatedData.specialization_card &&
			(!validatedData.specialization_card.compendium_id ||
				validatedData.specialization_card.compendium_id === '')
		) {
			validatedData.specialization_card.compendium_id = crypto.randomUUID();
		}
		if (
			validatedData.mastery_card &&
			(!validatedData.mastery_card.compendium_id || validatedData.mastery_card.compendium_id === '')
		) {
			validatedData.mastery_card.compendium_id = crypto.randomUUID();
		}
		const now = Date.now();

		await db
			.update(homebrew_subclasses)
			.set({ data: validatedData, updated_at: now })
			.where(eq(homebrew_subclasses.id, id));

		console.log('updated homebrew subclass in D1');
	}
);

export const delete_homebrew_subclass = command(z.string(), async (id) => {
	assertHomebrewTypeEnabled('subclass');
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Get homebrew item with permissions
	const access = await getHomebrewAccessInternal(db, userId, 'subclasses', id);

	if (!access.isOwner) {
		throw error(403, 'Not authorized to delete this subclass');
	}

	// Atomic batch delete - both operations succeed or both fail
	await db.batch([
		// Delete from homebrew table
		db.delete(homebrew_subclasses).where(eq(homebrew_subclasses.id, id)),

		// Delete from all campaign vaults
		db
			.delete(campaign_homebrew_vault_table)
			.where(
				and(
					eq(campaign_homebrew_vault_table.homebrew_type, 'subclass'),
					eq(campaign_homebrew_vault_table.homebrew_id, id)
				)
			)
	]);

	// refresh the subclasses query
	get_homebrew_subclasses().refresh();
	console.log('deleted homebrew subclass from D1');
});
