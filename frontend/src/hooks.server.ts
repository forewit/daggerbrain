import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createDb } from '$lib/server/db';
import { withClerkHandler } from 'svelte-clerk/server';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';

const appHandle: Handle = async ({ event, resolve }) => {
	const d1 = event.platform?.env?.DB;
	if (d1 && !event.locals.db) {
		event.locals.db = createDb(d1);
	}
	return resolve(event);
};

const clerkHandle = withClerkHandler({
	secretKey: CLERK_SECRET_KEY,
	publishableKey: PUBLIC_CLERK_PUBLISHABLE_KEY,
	signInUrl: '/sign-in'
});

export const handle = sequence(clerkHandle, appHandle);

