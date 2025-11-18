import { buildClerkProps } from 'svelte-clerk/server';
import type { LayoutServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { listCharacters } from '$lib/server/db/repositories/characters';
import { ensureUser } from '$lib/server/db/repositories/users';
import type { Character } from '$lib/ts/character/types';

export const load: LayoutServerLoad = async (event) => {
	const auth = event.locals.auth?.();
	const userId = auth?.userId;
	let initialCharacters: Character[] = [];
	if (userId) {
		try {
			const db = getDb(event);
			// Ensure user exists in database
			await ensureUser(db, userId);
			initialCharacters = await listCharacters(db, userId);
		} catch (error) {
			console.error('Failed to load characters:', error);
		}
	}
	return {
		initialCharacters,
		...buildClerkProps(auth)
	};
};

