import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { characters_table, characters_table_update_schema } from '../server/db/characters.schema';
import { get_db, get_auth } from './utils';

export const get_all_characters = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const characters = await db
		.select()
		.from(characters_table)
		.where(eq(characters_table.clerk_user_id, userId))
		.limit(3);

	return characters;
});

export const delete_character = command(z.string(), async (characterId) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Verify the character exists and belongs to the user
	const [character] = await db
		.select()
		.from(characters_table)
		.where(and(eq(characters_table.id, characterId), eq(characters_table.clerk_user_id, userId)))
		.limit(1);

	if (!character) {
		throw error(404, 'Character not found');
	}

	// Delete the character
	await db
		.delete(characters_table)
		.where(and(eq(characters_table.id, characterId), eq(characters_table.clerk_user_id, userId)));

	// Refresh the characters list
	get_all_characters().refresh();
});

export const create_character = command(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	if (!userId) throw error(401, 'Unauthorized');
	const db = get_db(event);

	// Check if user has reached the character limit
	const existingCharacters = await db
		.select()
		.from(characters_table)
		.where(eq(characters_table.clerk_user_id, userId));

	if (existingCharacters.length >= 3) {
		throw error(403, 'Character limit reached. You can only have 3 characters.');
	}

	const characterId = crypto.randomUUID();

	await db.insert(characters_table).values({
		id: characterId,
		clerk_user_id: userId
	});

	// Refresh the characters list
	get_all_characters().refresh();

	return characterId;
});

export const update_character = command(characters_table_update_schema, async (character) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	if (!userId) throw error(401, 'Unauthorized');
	const db = get_db(event);

	if (!character.id) {
		throw error(400, 'Character id missing');
	}

	await db
		.update(characters_table)
		.set(character)
		.where(and(eq(characters_table.id, character.id), eq(characters_table.clerk_user_id, userId)));

	return character.id;
});
