import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { get_db, get_auth } from '../utils';
import { DomainSchema, DomainCardSchema } from '$lib/compendium/compendium-schemas';
import type { Domain, DomainCard, DomainIds } from '$lib/types/compendium-types';
import { homebrew_domains, homebrew_domain_cards } from '$lib/server/db/homebrew.schema';
import { verifyOwnership, getTotalHomebrewCount, HOMEBREW_LIMIT } from './utils';

// ============================================================================
// Domains
// ============================================================================

export const get_homebrew_domains = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const entries = await db
		.select()
		.from(homebrew_domains)
		.where(eq(homebrew_domains.clerk_user_id, userId));

	const result: Record<string, Domain> = {};
	for (const entry of entries) {
		const validated = DomainSchema.parse(entry.data);
		result[entry.id] = validated;
	}
	console.log('fetched homebrew domains from D1');
	return result;
});

export const create_homebrew_domain = command(DomainSchema, async (data) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Check if user has reached the global homebrew limit
	const totalCount = await getTotalHomebrewCount(db, userId);
	if (totalCount >= HOMEBREW_LIMIT) {
		throw error(403, `Homebrew limit reached. You can only have ${HOMEBREW_LIMIT} custom items.`);
	}

	const validatedData = DomainSchema.parse({ ...data, source_id: 'Homebrew' as const });
	const id = crypto.randomUUID();
	const now = Date.now();

	await db.insert(homebrew_domains).values({
		id,
		clerk_user_id: userId,
		data: validatedData,
		created_at: now,
		updated_at: now
	});

	// refresh the domains query
	get_homebrew_domains().refresh();

	console.log('created homebrew domain in D1');
	return id;
});

export const update_homebrew_domain = command(
	z.object({ id: z.string(), data: DomainSchema }),
	async ({ id, data }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		if (!(await verifyOwnership(db, homebrew_domains, id, userId))) {
			throw error(403, 'Not authorized to update this domain');
		}

		const validatedData = DomainSchema.parse({ ...data, source_id: 'Homebrew' as const });
		const now = Date.now();

		await db
			.update(homebrew_domains)
			.set({ data: validatedData, updated_at: now })
			.where(and(eq(homebrew_domains.id, id), eq(homebrew_domains.clerk_user_id, userId)));

		console.log('updated homebrew domain in D1');
	}
);

export const delete_homebrew_domain = command(z.string(), async (id) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	if (!(await verifyOwnership(db, homebrew_domains, id, userId))) {
		throw error(403, 'Not authorized to delete this domain');
	}

	await db
		.delete(homebrew_domains)
		.where(and(eq(homebrew_domains.id, id), eq(homebrew_domains.clerk_user_id, userId)));

	// refresh the domains query
	get_homebrew_domains().refresh();
	console.log('deleted homebrew domain from D1');
});

// ============================================================================
// Domain Cards
// ============================================================================

export const get_homebrew_domain_cards = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const entries = await db
		.select()
		.from(homebrew_domain_cards)
		.where(eq(homebrew_domain_cards.clerk_user_id, userId));

	const result: Record<DomainIds, Record<string, DomainCard>> = {
		arcana: {},
		blade: {},
		bone: {},
		codex: {},
		grace: {},
		midnight: {},
		sage: {},
		splendor: {},
		valor: {}
	};

	for (const entry of entries) {
		const validated = DomainCardSchema.parse(entry.data);
		const domainId = validated.domain_id;
		result[domainId][entry.id] = validated;
	}
	console.log('fetched homebrew domain cards from D1');
	return result;
});

export const create_homebrew_domain_card = command(DomainCardSchema, async (data) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Check if user has reached the global homebrew limit
	const totalCount = await getTotalHomebrewCount(db, userId);
	if (totalCount >= HOMEBREW_LIMIT) {
		throw error(403, `Homebrew limit reached. You can only have ${HOMEBREW_LIMIT} custom items.`);
	}

	const validatedData = DomainCardSchema.parse({ ...data, source_id: 'Homebrew' as const });
	const id = crypto.randomUUID();
	const now = Date.now();

	await db.insert(homebrew_domain_cards).values({
		id,
		clerk_user_id: userId,
		data: validatedData,
		created_at: now,
		updated_at: now
	});

	// refresh the domain cards query
	get_homebrew_domain_cards().refresh();

	console.log('created homebrew domain card in D1');
	return id;
});

export const update_homebrew_domain_card = command(
	z.object({ id: z.string(), data: DomainCardSchema }),
	async ({ id, data }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		if (!(await verifyOwnership(db, homebrew_domain_cards, id, userId))) {
			throw error(403, 'Not authorized to update this domain card');
		}

		const validatedData = DomainCardSchema.parse({ ...data, source_id: 'Homebrew' as const });
		const now = Date.now();

		await db
			.update(homebrew_domain_cards)
			.set({ data: validatedData, updated_at: now })
			.where(
				and(eq(homebrew_domain_cards.id, id), eq(homebrew_domain_cards.clerk_user_id, userId))
			);

		console.log('updated homebrew domain card in D1');
	}
);

export const delete_homebrew_domain_card = command(z.string(), async (id) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Get the card to know which domain it belongs to
	const [entry] = await db
		.select()
		.from(homebrew_domain_cards)
		.where(and(eq(homebrew_domain_cards.id, id), eq(homebrew_domain_cards.clerk_user_id, userId)))
		.limit(1);

	if (!entry) {
		throw error(403, 'Not authorized to delete this domain card');
	}

	await db
		.delete(homebrew_domain_cards)
		.where(
			and(eq(homebrew_domain_cards.id, id), eq(homebrew_domain_cards.clerk_user_id, userId))
		);

	// refresh the domain cards query
	get_homebrew_domain_cards().refresh();
	console.log('deleted homebrew domain card from D1');
});
