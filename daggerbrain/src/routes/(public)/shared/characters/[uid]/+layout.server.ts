import type { LayoutServerLoad } from './$types';
import { get_character_public } from '$lib/remote/characters.remote';
import { error, redirect } from '@sveltejs/kit';
import { get_auth } from '$lib/remote/utils';
import { getRequestEvent } from '$app/server';
import type { Character } from '$lib/types/character-types';

export const load: LayoutServerLoad = async ({ params }) => {
	const { uid } = params;

	try {
		// Try to get character (from KV or D1)
		const character: Character = await get_character_public(uid);

		// Check if user is authenticated and owns this character
		// If so, redirect to private route
		try {
			const event = getRequestEvent();
			if (event) {
				const { userId } = get_auth(event);
				if (userId && character.clerk_user_id === userId) {
					throw redirect(302, `/characters/${uid}`);
				}
			}
		} catch (e) {
			// If get_auth throws (not authenticated), that's fine - continue with public view
			if (e && typeof e === 'object' && 'status' in e && e.status === 302) {
				// Re-throw redirect
				throw e;
			}
			// Otherwise, user is not authenticated, continue with public view
		}

		return {
			uid,
			character
		};
	} catch (e) {
		if (e && typeof e === 'object' && 'status' in e && e.status === 302) {
			// Re-throw redirect
			throw e;
		}
		throw error(404, 'Character not found or not public');
	}
};

