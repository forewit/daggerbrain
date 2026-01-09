import { query, command, getRequestEvent } from '$app/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import {
	users_table,
	users_table_schema,
	users_table_update_schema
} from '../server/db/users.schema';
import { get_db, get_auth } from './utils';

export const get_user = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const [user] = await db
		.select()
		.from(users_table)
		.where(eq(users_table.clerk_id, userId))
		.limit(1);

	if (!user) {
		// Return default user shape
		console.log('fetched user from D1');
		return users_table_schema.parse({
			clerk_id: userId,
			dismissed_popups: []
		});
	}

	// Validate with schema
	console.log('fetched user from D1');
	return users_table_schema.parse(user);
});

export const dismiss_popup = command(z.string(), async (popupId) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Get existing dismissed_popups or use empty array
	const [existingUser] = await db
		.select({ dismissed_popups: users_table.dismissed_popups })
		.from(users_table)
		.where(eq(users_table.clerk_id, userId))
		.limit(1);

	const currentPopups = existingUser?.dismissed_popups ?? [];
	const updatedPopups = currentPopups.includes(popupId)
		? currentPopups
		: [...currentPopups, popupId];

	// Atomic upsert
	await db
		.insert(users_table)
		.values({
			clerk_id: userId,
			dismissed_popups: updatedPopups
		})
		.onConflictDoUpdate({
			target: users_table.clerk_id,
			set: { dismissed_popups: updatedPopups }
		});

	get_user().refresh();
	console.log('dismissed popup in D1');
	return { success: true };
});

export const update_user = command(users_table_update_schema, async (updates) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Atomic upsert
	await db
		.insert(users_table)
		.values({
			clerk_id: userId,
			...updates
		})
		.onConflictDoUpdate({
			target: users_table.clerk_id,
			set: updates
		});

	get_user().refresh();
	console.log('updated user in D1');
	return { success: true };
});
