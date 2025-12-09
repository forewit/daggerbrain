import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { users_table } from '../server/db/users.schema';
import { characters_table } from '../server/db/characters.schema';
import { get_db, get_auth } from './utils';

const dismissed_popups_schema = z.array(z.string());

export const get_user_slots = query(async () => {
	console.log('get_user_slots');

	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const [user] = await db
		.select()
		.from(users_table)
		.where(eq(users_table.clerk_id, userId))
		.limit(1);

	if (!user) {
		// Return empty slots if user doesn't exist in users_table yet
		return {
			character_slot_1: null,
			character_slot_2: null,
			character_slot_3: null,
			dismissed_popups: []
		};
	}

	// Validate dismissed_popups with Zod (Drizzle already parsed it from JSON)
	let dismissed_popups: string[] = [];
	if (user.dismissed_popups) {
		try {
			dismissed_popups = dismissed_popups_schema.parse(user.dismissed_popups);
		} catch {
			dismissed_popups = [];
		}
	}

	return {
		character_slot_1: user.character_slot_1,
		character_slot_2: user.character_slot_2,
		character_slot_3: user.character_slot_3,
		dismissed_popups
	};
});

const update_character_slots_schema = z.array(z.string()).max(3);

export const update_character_slots = command(
	update_character_slots_schema,
	async (characterIds) => {
		console.log('update_character_slots');

		const event = getRequestEvent();
		const { userId } = get_auth(event);
		if (!userId) throw error(401, 'Unauthorized');
		const db = get_db(event);

		// Validate that all character IDs belong to the user
		if (characterIds.length > 0) {
			const characters = await db
				.select()
				.from(characters_table)
				.where(
					and(
						eq(characters_table.clerk_user_id, userId),
						inArray(characters_table.id, characterIds)
					)
				);

			if (characters.length !== characterIds.length) {
				throw error(400, 'One or more character IDs do not belong to the user');
			}
		}

		// Get or create user record
		const [existingUser] = await db
			.select()
			.from(users_table)
			.where(eq(users_table.clerk_id, userId))
			.limit(1);

		if (existingUser) {
			// Update existing user
			await db
				.update(users_table)
				.set({
					character_slot_1: characterIds[0] || null,
					character_slot_2: characterIds[1] || null,
					character_slot_3: characterIds[2] || null
				})
				.where(eq(users_table.clerk_id, userId));
		} else {
			// Create new user record
			await db.insert(users_table).values({
				clerk_id: userId,
				character_slot_1: characterIds[0] || null,
				character_slot_2: characterIds[1] || null,
				character_slot_3: characterIds[2] || null
			});
		}

		// Refresh the user slots query
		get_user_slots().refresh();

		return { success: true };
	}
);

export const dismiss_popup = command(z.string(), async (popupId) => {
	console.log('dismiss_popup', popupId);

	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Get or create user record
	const [existingUser] = await db
		.select()
		.from(users_table)
		.where(eq(users_table.clerk_id, userId))
		.limit(1);

	// Parse existing dismissed_popups or start with empty array (Drizzle already parsed it from JSON)
	let dismissed_popups: string[] = [];
	if (existingUser?.dismissed_popups) {
		try {
			dismissed_popups = dismissed_popups_schema.parse(existingUser.dismissed_popups);
		} catch {
			dismissed_popups = [];
		}
	}

	// Add popup ID if not already present
	if (!dismissed_popups.includes(popupId)) {
		dismissed_popups.push(popupId);
	}

	if (existingUser) {
		// Update existing user (Drizzle will stringify the array to JSON)
		await db
			.update(users_table)
			.set({
				dismissed_popups
			})
			.where(eq(users_table.clerk_id, userId));
	} else {
		// Create new user record (Drizzle will stringify the array to JSON)
		await db.insert(users_table).values({
			clerk_id: userId,
			character_slot_1: null,
			character_slot_2: null,
			character_slot_3: null,
			dismissed_popups
		});
	}

	// Refresh the user slots query
	get_user_slots().refresh();

	return { success: true };
});
