import { query, command, getRequestEvent } from '$app/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { users_table } from '../server/db/users.schema';
import { get_db, get_auth } from './utils';

const dismissed_popups_schema = z.array(z.string());

export const get_user_preferences = query(async () => {
	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const db = get_db(event);

	const [user] = await db
		.select()
		.from(users_table)
		.where(eq(users_table.clerk_id, userId))
		.limit(1);

	if (!user) {
		return {
			dismissed_popups: []
		};
	}

	// Validate dismissed_popups with Zod (Drizzle already parsed it from JSON)
	let dismissed_popups: string[] = [];
	if (user.dismissed_popups) {
		try {
			dismissed_popups = dismissed_popups_schema.parse(user.dismissed_popups);
		} catch {
			dismissed_popups = [];
		}
	}

	return {
		dismissed_popups
	};
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

	// Parse existing dismissed_popups or start with empty array (Drizzle already parsed it from JSON)
	let dismissed_popups: string[] = [];
	if (existingUser?.dismissed_popups) {
		try {
			dismissed_popups = dismissed_popups_schema.parse(existingUser.dismissed_popups);
		} catch {
			dismissed_popups = [];
		}
	}

	// Add popup ID if not already present
	if (!dismissed_popups.includes(popupId)) {
		dismissed_popups.push(popupId);
	}

	if (existingUser) {
		// Update existing user (Drizzle will stringify the array to JSON)
		await db
			.update(users_table)
			.set({
				dismissed_popups
			})
			.where(eq(users_table.clerk_id, userId));
	} else {
		// Create new user record (Drizzle will stringify the array to JSON)
		await db.insert(users_table).values({
			clerk_id: userId,
			dismissed_popups
		});
	}

	// Refresh the user preferences query
	get_user_preferences().refresh();

	return { success: true };
});
