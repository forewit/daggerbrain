import { and, eq, sql } from 'drizzle-orm';
import type { AppDatabase } from '$lib/server/db';
import {
	characterChoices,
	characterClasses,
	characterDomainTracking,
	characterHeritage,
	characterInventory,
	characterLevelProgress,
	characterTraits,
	characters
} from '../schema';
import type { Character } from '$lib/ts/character/types';
import { CharacterSchema } from '$lib/validation/character';

export async function listCharacters(db: AppDatabase, userId: string): Promise<Character[]> {
	const rows = await db.query.characters.findMany({
		where: eq(characters.userId, userId)
	});
	return rows.map((row) => CharacterSchema.parse(JSON.parse(row.settingsJson)) as Character);
}

export async function upsertCharacter(db: AppDatabase, userId: string, character: Character) {
	const existing = await db.query.characters.findFirst({
		where: eq(characters.id, character.uid)
	});
	if (existing && existing.userId !== userId) {
		throw new Error('Character does not belong to user');
	}
	const payload = JSON.stringify(character);
	try {
		await db
			.insert(characters)
			.values({
				id: character.uid,
				userId,
				name: character.name,
				imageUrl: character.image,
				level: character.level,
				settingsJson: payload,
				derivedDescriptorsJson: JSON.stringify(character.derived_descriptors),
				ephemeralStatsJson: JSON.stringify(character.ephemeral_stats)
			})
			.onConflictDoUpdate({
				target: characters.id,
				set: {
					name: character.name,
					imageUrl: character.image,
					level: character.level,
					settingsJson: payload,
					derivedDescriptorsJson: JSON.stringify(character.derived_descriptors),
					ephemeralStatsJson: JSON.stringify(character.ephemeral_stats),
					updatedAt: sql`(unixepoch())`
				}
			});
	} catch (error) {
		console.error('Failed to upsert character:', error);
		throw error;
	}
}

export async function deleteCharacter(db: AppDatabase, userId: string, uid: string) {
	await db.delete(characters).where(and(eq(characters.id, uid), eq(characters.userId, userId)));
	await Promise.all([
		db.delete(characterTraits).where(eq(characterTraits.characterId, uid)),
		db.delete(characterHeritage).where(eq(characterHeritage.characterId, uid)),
		db.delete(characterClasses).where(eq(characterClasses.characterId, uid)),
		db.delete(characterChoices).where(eq(characterChoices.characterId, uid)),
		db.delete(characterInventory).where(eq(characterInventory.characterId, uid)),
		db.delete(characterDomainTracking).where(eq(characterDomainTracking.characterId, uid)),
		db.delete(characterLevelProgress).where(eq(characterLevelProgress.characterId, uid))
	]);
}

