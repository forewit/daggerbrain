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

	// Get or create user record
	const [existingUser] = await db
		.select()
		.from(users_table)
		.where(eq(users_table.clerk_id, userId))
		.limit(1);

	// Use existing dismissed_popups or start with empty array
	const dismissed_popups = [...(existingUser?.dismissed_popups ?? [])];

	// Add popup ID if not already present
	if (!dismissed_popups.includes(popupId)) {
		dismissed_popups.push(popupId);
	}

	if (existingUser) {
		await db
			.update(users_table)
			.set({ dismissed_popups })
			.where(eq(users_table.clerk_id, userId));
	} else {
		await db.insert(users_table).values({
			clerk_id: userId,
			dismissed_popups
		});
	}

	get_user().refresh();
	console.log('dismissed popup in D1');
	return { success: true };
});

export const update_user = command(users_table_update_schema, async (updates) => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	// Get or create user record
	const [existingUser] = await db
		.select()
		.from(users_table)
		.where(eq(users_table.clerk_id, userId))
		.limit(1);

	if (existingUser) {
		await db
			.update(users_table)
			.set(updates)
			.where(eq(users_table.clerk_id, userId));
	} else {
		await db.insert(users_table).values({
			clerk_id: userId,
			...updates
		});
	}

	get_user().refresh();
	console.log('updated user in D1');
	return { success: true };
});
