import { eq, sql } from 'drizzle-orm';
import type { AppDatabase } from '$lib/server/db';
import { users } from '../schema';

export async function ensureUser(
	db: AppDatabase,
	userId: string,
	email?: string | null,
	displayName?: string | null,
	imageUrl?: string | null
) {
	const existing = await db.query.users.findFirst({
		where: eq(users.id, userId)
	});

	if (existing) {
		// Update if any fields have changed
		if (email !== existing.email || displayName !== existing.displayName || imageUrl !== existing.imageUrl) {
			await db
				.update(users)
				.set({
					email: email ?? existing.email,
					displayName: displayName ?? existing.displayName,
					imageUrl: imageUrl ?? existing.imageUrl,
					updatedAt: sql`(unixepoch())`
				})
				.where(eq(users.id, userId));
		}
		return existing;
	}

	// Create new user
	await db.insert(users).values({
		id: userId,
		email: email ?? null,
		displayName: displayName ?? null,
		imageUrl: imageUrl ?? null
	});

	return {
		id: userId,
		email: email ?? null,
		displayName: displayName ?? null,
		imageUrl: imageUrl ?? null,
		createdAt: Date.now(),
		updatedAt: Date.now()
	};
}

