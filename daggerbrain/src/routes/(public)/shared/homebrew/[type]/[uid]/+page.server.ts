import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { get_homebrew_public } from '$lib/remote/homebrew-public.remote';
import { get_auth } from '$lib/remote/utils';
import { getRequestEvent } from '$app/server';

export const load: PageServerLoad = async ({ params }) => {
	const { type, uid } = params;

	try {
		// Try to get homebrew item (from KV or D1)
		const homebrewItem = await get_homebrew_public({ type, uid });

		// Check if user is authenticated and owns this item
		// If so, redirect to private route
		try {
			const event = getRequestEvent();
			if (event) {
				const { userId } = get_auth(event);
				// Ownership check is handled in get_homebrew_public
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
			homebrewItem,
			type,
			uid
		};
	} catch (e) {
		if (e && typeof e === 'object' && 'status' in e && e.status === 302) {
			// Re-throw redirect
			throw e;
		}
		throw error(404, 'Homebrew item not found or not public');
	}
};

