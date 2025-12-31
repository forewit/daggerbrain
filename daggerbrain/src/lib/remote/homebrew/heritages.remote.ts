import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { get_db, get_auth } from '../utils';
import {
	AncestryCardSchema,
	CommunityCardSchema,
	TransformationCardSchema
} from '$lib/compendium/compendium-schemas';
import type { AncestryCard, CommunityCard, TransformationCard } from '$lib/types/compendium-types';
import {
	homebrew_ancestry_cards,
	homebrew_community_cards,
	homebrew_transformation_cards
} from '$lib/server/db/homebrew.schema';
import { verifyOwnership, getTotalHomebrewCount, HOMEBREW_LIMIT } from './utils';

// ============================================================================
// Ancestry Cards
// ============================================================================

export const get_homebrew_ancestry_cards = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const entries = await db
		.select()
		.from(homebrew_ancestry_cards)
		.where(eq(homebrew_ancestry_cards.clerk_user_id, userId));

	const result: Record<string, AncestryCard> = {};
	for (const entry of entries) {
		const validated = AncestryCardSchema.parse(entry.data);
		result[entry.id] = validated;
	}
	console.log('fetched homebrew ancestry cards from D1');
	return result;
});

export const create_homebrew_ancestry_card = command(AncestryCardSchema, async (data) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Check if user has reached the global homebrew limit
	const totalCount = await getTotalHomebrewCount(db, userId);
	if (totalCount >= HOMEBREW_LIMIT) {
		throw error(403, `Homebrew limit reached. You can only have ${HOMEBREW_LIMIT} custom items.`);
	}

	const validatedData = AncestryCardSchema.parse({ ...data, source_id: 'Homebrew' as const });
	const id = crypto.randomUUID();
	validatedData.compendium_id = id;
	const now = Date.now();

	await db.insert(homebrew_ancestry_cards).values({
		id,
		clerk_user_id: userId,
		data: validatedData,
		created_at: now,
		updated_at: now
	});

	// refresh the ancestry cards query
	get_homebrew_ancestry_cards().refresh();

	console.log('created homebrew ancestry card in D1');
	return id;
});

export const update_homebrew_ancestry_card = command(
	z.object({ id: z.string(), data: AncestryCardSchema }),
	async ({ id, data }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		if (!(await verifyOwnership(db, homebrew_ancestry_cards, id, userId))) {
			throw error(403, 'Not authorized to update this ancestry card');
		}

		const validatedData = AncestryCardSchema.parse({ ...data, source_id: 'Homebrew' as const });
		validatedData.compendium_id = id;
		const now = Date.now();

		await db
			.update(homebrew_ancestry_cards)
			.set({ data: validatedData, updated_at: now })
			.where(
				and(eq(homebrew_ancestry_cards.id, id), eq(homebrew_ancestry_cards.clerk_user_id, userId))
			);

		console.log('updated homebrew ancestry card in D1');
	}
);

export const delete_homebrew_ancestry_card = command(z.string(), async (id) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	if (!(await verifyOwnership(db, homebrew_ancestry_cards, id, userId))) {
		throw error(403, 'Not authorized to delete this ancestry card');
	}

	await db
		.delete(homebrew_ancestry_cards)
		.where(
			and(eq(homebrew_ancestry_cards.id, id), eq(homebrew_ancestry_cards.clerk_user_id, userId))
		);

	// refresh the ancestry cards query
	get_homebrew_ancestry_cards().refresh();
	console.log('deleted homebrew ancestry card from D1');
});

// ============================================================================
// Community Cards
// ============================================================================

export const get_homebrew_community_cards = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const entries = await db
		.select()
		.from(homebrew_community_cards)
		.where(eq(homebrew_community_cards.clerk_user_id, userId));

	const result: Record<string, CommunityCard> = {};
	for (const entry of entries) {
		const validated = CommunityCardSchema.parse(entry.data);
		result[entry.id] = validated;
	}
	console.log('fetched homebrew community cards from D1');
	return result;
});

export const create_homebrew_community_card = command(CommunityCardSchema, async (data) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Check if user has reached the global homebrew limit
	const totalCount = await getTotalHomebrewCount(db, userId);
	if (totalCount >= HOMEBREW_LIMIT) {
		throw error(403, `Homebrew limit reached. You can only have ${HOMEBREW_LIMIT} custom items.`);
	}

	const validatedData = CommunityCardSchema.parse({ ...data, source_id: 'Homebrew' as const });
	const id = crypto.randomUUID();
	validatedData.compendium_id = id;
	const now = Date.now();

	await db.insert(homebrew_community_cards).values({
		id,
		clerk_user_id: userId,
		data: validatedData,
		created_at: now,
		updated_at: now
	});

	// refresh the community cards query
	get_homebrew_community_cards().refresh();

	console.log('created homebrew community card in D1');
	return id;
});

export const update_homebrew_community_card = command(
	z.object({ id: z.string(), data: CommunityCardSchema }),
	async ({ id, data }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		if (!(await verifyOwnership(db, homebrew_community_cards, id, userId))) {
			throw error(403, 'Not authorized to update this community card');
		}

		const validatedData = CommunityCardSchema.parse({ ...data, source_id: 'Homebrew' as const });
		validatedData.compendium_id = id;
		const now = Date.now();

		await db
			.update(homebrew_community_cards)
			.set({ data: validatedData, updated_at: now })
			.where(
				and(eq(homebrew_community_cards.id, id), eq(homebrew_community_cards.clerk_user_id, userId))
			);

		console.log('updated homebrew community card in D1');
	}
);

export const delete_homebrew_community_card = command(z.string(), async (id) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	if (!(await verifyOwnership(db, homebrew_community_cards, id, userId))) {
		throw error(403, 'Not authorized to delete this community card');
	}

	await db
		.delete(homebrew_community_cards)
		.where(
			and(eq(homebrew_community_cards.id, id), eq(homebrew_community_cards.clerk_user_id, userId))
		);

	// refresh the community cards query
	get_homebrew_community_cards().refresh();
	console.log('deleted homebrew community card from D1');
});

// ============================================================================
// Transformation Cards
// ============================================================================

export const get_homebrew_transformation_cards = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const entries = await db
		.select()
		.from(homebrew_transformation_cards)
		.where(eq(homebrew_transformation_cards.clerk_user_id, userId));

	const result: Record<string, TransformationCard> = {};
	for (const entry of entries) {
		const validated = TransformationCardSchema.parse(entry.data);
		result[entry.id] = validated;
	}
	console.log('fetched homebrew transformation cards from D1');
	return result;
});

export const create_homebrew_transformation_card = command(
	TransformationCardSchema,
	async (data) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		// Check if user has reached the global homebrew limit
		const totalCount = await getTotalHomebrewCount(db, userId);
		if (totalCount >= HOMEBREW_LIMIT) {
			throw error(403, `Homebrew limit reached. You can only have ${HOMEBREW_LIMIT} custom items.`);
		}

		const validatedData = TransformationCardSchema.parse({
			...data,
			source_id: 'Homebrew' as const
		});
		const id = crypto.randomUUID();
		validatedData.compendium_id = id;
		const now = Date.now();

		await db.insert(homebrew_transformation_cards).values({
			id,
			clerk_user_id: userId,
			data: validatedData,
			created_at: now,
			updated_at: now
		});

		// refresh the transformation cards query
		get_homebrew_transformation_cards().refresh();

		console.log('created homebrew transformation card in D1');
		return id;
	}
);

export const update_homebrew_transformation_card = command(
	z.object({ id: z.string(), data: TransformationCardSchema }),
	async ({ id, data }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		if (!(await verifyOwnership(db, homebrew_transformation_cards, id, userId))) {
			throw error(403, 'Not authorized to update this transformation card');
		}

		const validatedData = TransformationCardSchema.parse({
			...data,
			source_id: 'Homebrew' as const
		});
		validatedData.compendium_id = id;
		const now = Date.now();

		await db
			.update(homebrew_transformation_cards)
			.set({ data: validatedData, updated_at: now })
			.where(
				and(
					eq(homebrew_transformation_cards.id, id),
					eq(homebrew_transformation_cards.clerk_user_id, userId)
				)
			);

		console.log('updated homebrew transformation card in D1');
	}
);

export const delete_homebrew_transformation_card = command(z.string(), async (id) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	if (!(await verifyOwnership(db, homebrew_transformation_cards, id, userId))) {
		throw error(403, 'Not authorized to delete this transformation card');
	}

	await db
		.delete(homebrew_transformation_cards)
		.where(
			and(
				eq(homebrew_transformation_cards.id, id),
				eq(homebrew_transformation_cards.clerk_user_id, userId)
			)
		);

	// refresh the transformation cards query
	get_homebrew_transformation_cards().refresh();
	console.log('deleted homebrew transformation card from D1');
});
