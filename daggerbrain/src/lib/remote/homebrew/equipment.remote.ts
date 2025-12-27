import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { get_db, get_auth } from '../utils';
import { WeaponSchema, ArmorSchema, LootSchema, ConsumableSchema } from '$lib/compendium/compendium-schemas';
import type { Weapon, Armor, Loot, Consumable } from '$lib/types/compendium-types';
import {
	homebrew_primary_weapons,
	homebrew_secondary_weapons,
	homebrew_armor,
	homebrew_loot,
	homebrew_consumables
} from '$lib/server/db/homebrew.schema';
import { verifyOwnership, getTotalHomebrewCount, HOMEBREW_LIMIT } from './utils';

// ============================================================================
// Primary Weapons
// ============================================================================

export const get_homebrew_primary_weapons = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const entries = await db
		.select()
		.from(homebrew_primary_weapons)
		.where(eq(homebrew_primary_weapons.clerk_user_id, userId));

	const result: Record<string, Weapon> = {};
	for (const entry of entries) {
		const validated = WeaponSchema.parse(entry.data);
		result[entry.id] = validated;
	}
	console.log('fetched homebrew primary weapons from D1');
	return result;
});

export const create_homebrew_primary_weapon = command(WeaponSchema, async (data) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Check if user has reached the global homebrew limit
	const totalCount = await getTotalHomebrewCount(db, userId);
	if (totalCount >= HOMEBREW_LIMIT) {
		throw error(403, `Homebrew limit reached. You can only have ${HOMEBREW_LIMIT} custom items.`);
	}

	const validatedData = WeaponSchema.parse({ ...data, source_id: 'Homebrew' as const });
	const id = crypto.randomUUID();
	const now = Date.now();

	await db.insert(homebrew_primary_weapons).values({
		id,
		clerk_user_id: userId,
		data: validatedData,
		created_at: now,
		updated_at: now
	});

	// refresh the primary weapons query
	get_homebrew_primary_weapons().refresh();

	console.log('created homebrew primary weapon in D1');
	return id;
});

export const update_homebrew_primary_weapon = command(
	z.object({ id: z.string(), data: WeaponSchema }),
	async ({ id, data }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		if (!(await verifyOwnership(db, homebrew_primary_weapons, id, userId))) {
			throw error(403, 'Not authorized to update this weapon');
		}

		const validatedData = WeaponSchema.parse({ ...data, source_id: 'Homebrew' as const });
		const now = Date.now();

		await db
			.update(homebrew_primary_weapons)
			.set({ data: validatedData, updated_at: now })
			.where(
				and(
					eq(homebrew_primary_weapons.id, id),
					eq(homebrew_primary_weapons.clerk_user_id, userId)
				)
			);

		console.log('updated homebrew primary weapon in D1');
	}
);

export const delete_homebrew_primary_weapon = command(z.string(), async (id) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	if (!(await verifyOwnership(db, homebrew_primary_weapons, id, userId))) {
		throw error(403, 'Not authorized to delete this weapon');
	}

	await db
		.delete(homebrew_primary_weapons)
		.where(
			and(
				eq(homebrew_primary_weapons.id, id),
				eq(homebrew_primary_weapons.clerk_user_id, userId)
			)
		);

	// refresh the primary weapons query
	get_homebrew_primary_weapons().refresh();
	console.log('deleted homebrew primary weapon from D1');
});

// ============================================================================
// Secondary Weapons
// ============================================================================

export const get_homebrew_secondary_weapons = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const entries = await db
		.select()
		.from(homebrew_secondary_weapons)
		.where(eq(homebrew_secondary_weapons.clerk_user_id, userId));

	const result: Record<string, Weapon> = {};
	for (const entry of entries) {
		const validated = WeaponSchema.parse(entry.data);
		result[entry.id] = validated;
	}
	console.log('fetched homebrew secondary weapons from D1');
	return result;
});

export const create_homebrew_secondary_weapon = command(WeaponSchema, async (data) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Check if user has reached the global homebrew limit
	const totalCount = await getTotalHomebrewCount(db, userId);
	if (totalCount >= HOMEBREW_LIMIT) {
		throw error(403, `Homebrew limit reached. You can only have ${HOMEBREW_LIMIT} custom items.`);
	}

	const validatedData = WeaponSchema.parse({ ...data, source_id: 'Homebrew' as const });
	const id = crypto.randomUUID();
	const now = Date.now();

	await db.insert(homebrew_secondary_weapons).values({
		id,
		clerk_user_id: userId,
		data: validatedData,
		created_at: now,
		updated_at: now
	});

	// refresh the secondary weapons query
	get_homebrew_secondary_weapons().refresh();

	console.log('created homebrew secondary weapon in D1');
	return id;
});

export const update_homebrew_secondary_weapon = command(
	z.object({ id: z.string(), data: WeaponSchema }),
	async ({ id, data }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		if (!(await verifyOwnership(db, homebrew_secondary_weapons, id, userId))) {
			throw error(403, 'Not authorized to update this weapon');
		}

		const validatedData = WeaponSchema.parse({ ...data, source_id: 'Homebrew' as const });
		const now = Date.now();

		await db
			.update(homebrew_secondary_weapons)
			.set({ data: validatedData, updated_at: now })
			.where(
				and(
					eq(homebrew_secondary_weapons.id, id),
					eq(homebrew_secondary_weapons.clerk_user_id, userId)
				)
			);

		console.log('updated homebrew secondary weapon in D1');
	}
);

export const delete_homebrew_secondary_weapon = command(z.string(), async (id) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	if (!(await verifyOwnership(db, homebrew_secondary_weapons, id, userId))) {
		throw error(403, 'Not authorized to delete this weapon');
	}

	await db
		.delete(homebrew_secondary_weapons)
		.where(
			and(
				eq(homebrew_secondary_weapons.id, id),
				eq(homebrew_secondary_weapons.clerk_user_id, userId)
			)
		);

	// refresh the secondary weapons query
	get_homebrew_secondary_weapons().refresh();
	console.log('deleted homebrew secondary weapon from D1');
});

// ============================================================================
// Armor
// ============================================================================

export const get_homebrew_armor = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const entries = await db
		.select()
		.from(homebrew_armor)
		.where(eq(homebrew_armor.clerk_user_id, userId));

	const result: Record<string, Armor> = {};
	for (const entry of entries) {
		const validated = ArmorSchema.parse(entry.data);
		result[entry.id] = validated;
	}
	console.log('fetched homebrew armor from D1');
	return result;
});

export const create_homebrew_armor = command(ArmorSchema, async (data) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Check if user has reached the global homebrew limit
	const totalCount = await getTotalHomebrewCount(db, userId);
	if (totalCount >= HOMEBREW_LIMIT) {
		throw error(403, `Homebrew limit reached. You can only have ${HOMEBREW_LIMIT} custom items.`);
	}

	const validatedData = ArmorSchema.parse({ ...data, source_id: 'Homebrew' as const });
	const id = crypto.randomUUID();
	const now = Date.now();

	await db.insert(homebrew_armor).values({
		id,
		clerk_user_id: userId,
		data: validatedData,
		created_at: now,
		updated_at: now
	});

	// refresh the armor query
	get_homebrew_armor().refresh();

	console.log('created homebrew armor in D1');
	return id;
});

export const update_homebrew_armor = command(
	z.object({ id: z.string(), data: ArmorSchema }),
	async ({ id, data }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		if (!(await verifyOwnership(db, homebrew_armor, id, userId))) {
			throw error(403, 'Not authorized to update this armor');
		}

		const validatedData = ArmorSchema.parse({ ...data, source_id: 'Homebrew' as const });
		const now = Date.now();

		await db
			.update(homebrew_armor)
			.set({ data: validatedData, updated_at: now })
			.where(and(eq(homebrew_armor.id, id), eq(homebrew_armor.clerk_user_id, userId)));

		console.log('updated homebrew armor in D1');
	}
);

export const delete_homebrew_armor = command(z.string(), async (id) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	if (!(await verifyOwnership(db, homebrew_armor, id, userId))) {
		throw error(403, 'Not authorized to delete this armor');
	}

	await db
		.delete(homebrew_armor)
		.where(and(eq(homebrew_armor.id, id), eq(homebrew_armor.clerk_user_id, userId)));

	// refresh the armor query
	get_homebrew_armor().refresh();
	console.log('deleted homebrew armor from D1');
});

// ============================================================================
// Loot
// ============================================================================

export const get_homebrew_loot = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const entries = await db
		.select()
		.from(homebrew_loot)
		.where(eq(homebrew_loot.clerk_user_id, userId));

	const result: Record<string, Loot> = {};
	for (const entry of entries) {
		const validated = LootSchema.parse(entry.data);
		result[entry.id] = validated;
	}
	console.log('fetched homebrew loot from D1');
	return result;
});

export const create_homebrew_loot = command(LootSchema, async (data) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Check if user has reached the global homebrew limit
	const totalCount = await getTotalHomebrewCount(db, userId);
	if (totalCount >= HOMEBREW_LIMIT) {
		throw error(403, `Homebrew limit reached. You can only have ${HOMEBREW_LIMIT} custom items.`);
	}

	const validatedData = LootSchema.parse({ ...data, source_id: 'Homebrew' as const });
	const id = crypto.randomUUID();
	const now = Date.now();

	await db.insert(homebrew_loot).values({
		id,
		clerk_user_id: userId,
		data: validatedData,
		created_at: now,
		updated_at: now
	});

	// refresh the loot query
	get_homebrew_loot().refresh();

	console.log('created homebrew loot in D1');
	return id;
});

export const update_homebrew_loot = command(
	z.object({ id: z.string(), data: LootSchema }),
	async ({ id, data }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		if (!(await verifyOwnership(db, homebrew_loot, id, userId))) {
			throw error(403, 'Not authorized to update this loot');
		}

		const validatedData = LootSchema.parse({ ...data, source_id: 'Homebrew' as const });
		const now = Date.now();

		await db
			.update(homebrew_loot)
			.set({ data: validatedData, updated_at: now })
			.where(and(eq(homebrew_loot.id, id), eq(homebrew_loot.clerk_user_id, userId)));

		console.log('updated homebrew loot');
	}
);

export const delete_homebrew_loot = command(z.string(), async (id) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	if (!(await verifyOwnership(db, homebrew_loot, id, userId))) {
		throw error(403, 'Not authorized to delete this loot');
	}

	await db
		.delete(homebrew_loot)
		.where(and(eq(homebrew_loot.id, id), eq(homebrew_loot.clerk_user_id, userId)));

	// refresh the loot query
	get_homebrew_loot().refresh();
	console.log('deleted homebrew loot');
});

// ============================================================================
// Consumables
// ============================================================================

export const get_homebrew_consumables = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const entries = await db
		.select()
		.from(homebrew_consumables)
		.where(eq(homebrew_consumables.clerk_user_id, userId));

	const result: Record<string, Consumable> = {};
	for (const entry of entries) {
		const validated = ConsumableSchema.parse(entry.data);
		result[entry.id] = validated;
	}
	console.log('fetched homebrew consumables');
	return result;
});

export const create_homebrew_consumable = command(ConsumableSchema, async (data) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Check if user has reached the global homebrew limit
	const totalCount = await getTotalHomebrewCount(db, userId);
	if (totalCount >= HOMEBREW_LIMIT) {
		throw error(403, `Homebrew limit reached. You can only have ${HOMEBREW_LIMIT} custom items.`);
	}

	const validatedData = ConsumableSchema.parse({ ...data, source_id: 'Homebrew' as const });
	const id = crypto.randomUUID();
	const now = Date.now();

	await db.insert(homebrew_consumables).values({
		id,
		clerk_user_id: userId,
		data: validatedData,
		created_at: now,
		updated_at: now
	});

	// refresh the consumables query
	get_homebrew_consumables().refresh();

	console.log('created homebrew consumable');
	return id;
});

export const update_homebrew_consumable = command(
	z.object({ id: z.string(), data: ConsumableSchema }),
	async ({ id, data }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		if (!(await verifyOwnership(db, homebrew_consumables, id, userId))) {
			throw error(403, 'Not authorized to update this consumable');
		}

		const validatedData = ConsumableSchema.parse({ ...data, source_id: 'Homebrew' as const });
		const now = Date.now();

		await db
			.update(homebrew_consumables)
			.set({ data: validatedData, updated_at: now })
			.where(
				and(eq(homebrew_consumables.id, id), eq(homebrew_consumables.clerk_user_id, userId))
			);

		console.log('updated homebrew consumable');
	}
);

export const delete_homebrew_consumable = command(z.string(), async (id) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	if (!(await verifyOwnership(db, homebrew_consumables, id, userId))) {
		throw error(403, 'Not authorized to delete this consumable');
	}

	await db
		.delete(homebrew_consumables)
		.where(
			and(eq(homebrew_consumables.id, id), eq(homebrew_consumables.clerk_user_id, userId))
		);

	// refresh the consumables query
	get_homebrew_consumables().refresh();
	console.log('deleted homebrew consumable');
});
