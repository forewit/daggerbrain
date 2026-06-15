import * as Sentry from '@sentry/sveltekit';
import { building } from '$app/environment';
import { env } from '$env/dynamic/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { withClerkHandler } from 'svelte-clerk/server';
import { dev } from '$app/environment';

const maintenanceModeHandle: Handle = async ({ event, resolve }) => {
	if (building) {
		return resolve(event);
	}

	if (env.MAINTENANCE_MODE === 'true' && !event.url.pathname.startsWith('/maintenance')) {
		const userId = event.locals.auth().userId;

		const adminIds = env.ADMIN_CLERK_ID.split(',');

		if (!userId || !adminIds.includes(userId)) {
			throw redirect(302, '/maintenance');
		}
	}
	return resolve(event);
};

const sentryCloudflareHandle = Sentry.initCloudflareSentryHandle({
	dsn: '<your-sentry-dsn>',
	tracesSampleRate: 1.0,
	enableLogs: true,
	environment: dev ? 'development' : 'production'
});

export const handle = sequence(
	sentryCloudflareHandle,
	Sentry.sentryHandle(),
	withClerkHandler(),
	maintenanceModeHandle
);
export const handleError = Sentry.handleErrorWithSentry();
