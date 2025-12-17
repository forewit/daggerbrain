import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { characters_table, characters_table_update_schema } from '../server/db/characters.schema';
import { users_table } from '../server/db/users.schema';
import { get_db, get_auth } from './utils';
import { get_user_slots } from './users.remote';

export const get_all_characters = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const characters = await db
		.select()
		.from(characters_table)
		.where(eq(characters_table.clerk_user_id, userId));

	return characters;
});

export const delete_character = command(z.string(), async (characterId) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// First, verify the character exists and belongs to the user
	const [character] = await db
		.select()
		.from(characters_table)
		.where(and(eq(characters_table.id, characterId), eq(characters_table.clerk_user_id, userId)))
		.limit(1);

	if (!character) {
		throw error(404, 'Character not found');
	}

	// Remove character from active slots if it's in one
	const [user] = await db
		.select()
		.from(users_table)
		.where(eq(users_table.clerk_id, userId))
		.limit(1);

	if (user) {
		const updatedSlots = {
			character_slot_1: user.character_slot_1 === characterId ? null : user.character_slot_1,
			character_slot_2: user.character_slot_2 === characterId ? null : user.character_slot_2,
			character_slot_3: user.character_slot_3 === characterId ? null : user.character_slot_3
		};

		await db.update(users_table).set(updatedSlots).where(eq(users_table.clerk_id, userId));
	}

	// Delete the character
	await db
		.delete(characters_table)
		.where(and(eq(characters_table.id, characterId), eq(characters_table.clerk_user_id, userId)));

	// refresh the characters list and user slots
	get_all_characters().refresh();
	get_user_slots().refresh();
});

export const create_character = command(async () => {
	const event = getRequestEvent();
	const auth = get_auth(event);
	const { userId } = auth;
	if (!userId) throw error(401, 'Unauthorized');
	const db = get_db(event);

	// Check for unlimited_slots feature flag
	const hasUnlimited = await auth.has({ feature: 'unlimited_slots' });

	if (!hasUnlimited) {
		// Check if user already has 3 active slots
		const [user] = await db
			.select()
			.from(users_table)
			.where(eq(users_table.clerk_id, userId))
			.limit(1);

		if (user) {
			const activeSlots = [
				user.character_slot_1,
				user.character_slot_2,
				user.character_slot_3
			].filter((slot) => slot !== null);

			if (activeSlots.length >= 3) {
				throw error(
					403,
					'Character limit reached. You can only have 3 active characters. Please deactivate a character to create a new one.'
				);
			}
		}
	}

	const characterId = crypto.randomUUID();

	await db.insert(characters_table).values({
		id: characterId,
		clerk_user_id: userId
	});

	// If user doesn't have unlimited slots, automatically add to an available slot
	if (!hasUnlimited) {
		const [user] = await db
			.select()
			.from(users_table)
			.where(eq(users_table.clerk_id, userId))
			.limit(1);

		if (user) {
			// Find first available slot
			let slotToUpdate: 'character_slot_1' | 'character_slot_2' | 'character_slot_3' | null = null;
			if (!user.character_slot_1) {
				slotToUpdate = 'character_slot_1';
			} else if (!user.character_slot_2) {
				slotToUpdate = 'character_slot_2';
			} else if (!user.character_slot_3) {
				slotToUpdate = 'character_slot_3';
			}

			if (slotToUpdate) {
				await db
					.update(users_table)
					.set({ [slotToUpdate]: characterId })
					.where(eq(users_table.clerk_id, userId));
			}
		} else {
			// User doesn't exist in users_table, create with first slot
			await db.insert(users_table).values({
				clerk_id: userId,
				character_slot_1: characterId,
				character_slot_2: null,
				character_slot_3: null
			});
		}
	}

	// refresh the characters list and user slots
	get_all_characters().refresh();
	get_user_slots().refresh();

	return characterId;
});

export const update_character = command(characters_table_update_schema, async (character) => {
	const event = getRequestEvent();
	const auth = get_auth(event);
	const { userId } = auth;
	if (!userId) throw error(401, 'Unauthorized');
	const db = get_db(event);

	if (!character.id) {
		throw error(400, 'Character id missing');
	}

	// Check for unlimited_slots feature flag
	const hasUnlimited = await auth.has({ feature: 'unlimited_slots' });

	if (!hasUnlimited) {
		// Verify the character ID is in one of their active slots
		const [user] = await db
			.select()
			.from(users_table)
			.where(eq(users_table.clerk_id, userId))
			.limit(1);

		if (user) {
			const activeSlots = [user.character_slot_1, user.character_slot_2, user.character_slot_3];

			if (!activeSlots.includes(character.id)) {
				throw error(
					403,
					'This character is not in your active slots. Please activate it to make changes.'
				);
			}
		} else {
			// User doesn't exist in users_table, so they have no active slots
			throw error(
				403,
				'This character is not in your active slots. Please activate it to make changes.'
			);
		}
	}

	await db
		.update(characters_table)
		.set(character)
		.where(and(eq(characters_table.id, character.id), eq(characters_table.clerk_user_id, userId)));

	//get_all_characters().refresh();

	return character.id;
});
