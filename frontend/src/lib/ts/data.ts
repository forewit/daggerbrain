import type { Character } from './character/types';
import { getCharacters } from './characters.remote';

export async function loadCharacters(): Promise<Character[]> {
	const query = getCharacters();
	await query.refresh();
	return structuredClone(query.current ?? []);
}

export async function saveCharacters(_: Character[]): Promise<void> {
	// no-op: D1 is now the source of truth
}