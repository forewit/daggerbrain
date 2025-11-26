import { command, getRequestEvent, query } from '$app/server';
import { z } from 'zod';
import type { Character } from './character/types';
import { JUST_JAMES, NEW_CHARACTER } from './character/constants';
import { CharacterSchema } from '$lib/validation/character';
import { getDb } from '$lib/server/db';
import { listCharacters, upsertCharacter, deleteCharacter as deleteCharacterDb } from '$lib/server/db/repositories/characters';
import { ensureUser } from '$lib/server/db/repositories/users';

function getAuthContext() {
	const event = getRequestEvent();
	if (!event) {
		throw new Error('No request event');
	}
	const auth = event.locals.auth?.();
	if (!auth?.userId) {
		throw new Error('Unauthorized');
	}
	return { event, auth };
}

export const getCharacters = query(async () => {
	const { event, auth } = getAuthContext();
	const db = getDb(event);
	return listCharacters(db, auth.userId);
});

const createPayloadSchema = z.object({
	fromUid: z.string().optional().nullable()
});

export const createCharacter = command(createPayloadSchema, async ({ fromUid }) => {
	const { event, auth } = getAuthContext();
	const db = getDb(event);
	// Ensure user exists in database before creating character
	await ensureUser(db, auth.userId);
	const existing = await listCharacters(db, auth.userId);
	let base = existing.find((c) => c.uid === fromUid);
	const uid = crypto.randomUUID();
	const next = base ? { ...structuredClone(base), uid } : { ...structuredClone(NEW_CHARACTER), uid };
	await upsertCharacter(db, auth.userId, CharacterSchema.parse(next) as Character);
	const updated = await listCharacters(db, auth.userId);
	getCharacters().set(updated);
	return { uid };
});

export const createJustJames = command(async () => {
	const { event, auth } = getAuthContext();
	const db = getDb(event);
	// Ensure user exists in database before creating character
	await ensureUser(db, auth.userId);
	const uid = crypto.randomUUID();
	await upsertCharacter(
		db,
		auth.userId,
		CharacterSchema.parse({ ...structuredClone(JUST_JAMES), uid }) as Character
	);
	const updated = await listCharacters(db, auth.userId);
	getCharacters().set(updated);
	return { uid };
});

const deleteCharacterSchema = z.object({
	uid: z.string()
});

export const updateCharacter = command(CharacterSchema, async (character) => {
	const { event, auth } = getAuthContext();
	const db = getDb(event);
	// Ensure user exists in database before updating character
	await ensureUser(db, auth.userId);
	const validated = CharacterSchema.parse(character) as Character;
	await upsertCharacter(db, auth.userId, validated);
	const updated = await listCharacters(db, auth.userId);
	getCharacters().set(updated);
});

export const deleteCharacter = command(deleteCharacterSchema, async ({ uid }) => {
	const { event, auth } = getAuthContext();
	const db = getDb(event);
	// Ensure user exists in database before deleting character
	await ensureUser(db, auth.userId);
	await deleteCharacterDb(db, auth.userId, uid);
	const updated = await listCharacters(db, auth.userId);
	getCharacters().set(updated);
});

