import { query, command, getRequestEvent } from '$app/server';
import { eq, sql } from 'drizzle-orm';
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

	// Atomic upsert using SQL JSON functions to conditionally add popup
	// This eliminates the read-modify-write race condition
	// Only adds popupId if it's not already in the array
	await db
		.insert(users_table)
		.values({
			clerk_id: userId,
			dismissed_popups: sql`json_array(${popupId})`
		})
		.onConflictDoUpdate({
			target: users_table.clerk_id,
			set: {
				dismissed_popups: sql`
					CASE 
						WHEN dismissed_popups IS NULL THEN json_array(${popupId})
						WHEN json_array_length(dismissed_popups) = 0 THEN json_array(${popupId})
						WHEN EXISTS (
							SELECT 1 FROM json_each(dismissed_popups) 
							WHERE value = ${popupId}
						) THEN dismissed_popups
						ELSE dismissed_popups || json_array(${popupId})
					END
				`
			}
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
