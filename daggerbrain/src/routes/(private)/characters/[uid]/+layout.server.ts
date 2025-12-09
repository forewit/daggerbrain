import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { has_unlimited_slots } from '$lib/remote/utils';
import { getRequestEvent } from '$app/server';
import { get_db, get_userId } from '$lib/remote/utils';
import { eq } from 'drizzle-orm';
import { users_table } from '$lib/server/db/users.schema';

export const load: LayoutServerLoad = async ({ params }) => {
	const event = getRequestEvent();
	const userId = get_userId(event);
	const db = get_db(event);
	const characterId = params.uid;

	// Check for unlimited_slots feature flag
	const hasUnlimited = await has_unlimited_slots(event);

	if (hasUnlimited) {
		// User has unlimited slots, allow access
		return {};
	}

	// User doesn't have unlimited slots, check if character is in active slots
	const [user] = await db
		.select()
		.from(users_table)
		.where(eq(users_table.clerk_id, userId))
		.limit(1);

	if (!user) {
		// User doesn't exist in users_table, so they have no active slots
		throw error(403, 'This character is not in your active slots.');
	}

	const activeSlots = [
		user.character_slot_1,
		user.character_slot_2,
		user.character_slot_3
	];

	if (!activeSlots.includes(characterId)) {
		throw error(403, 'This character is not in your active slots.');
	}

	// Character is in active slots, allow access
	return {};
};

