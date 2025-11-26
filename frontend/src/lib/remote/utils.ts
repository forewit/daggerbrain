import { error, type RequestEvent } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/d1';

export const get_db = (event: RequestEvent) => {
	if (!event.platform?.env?.DB) {
		throw new Error('Database not available');
	}

	return drizzle(event.platform.env.DB);
};

export const get_userId = (event: RequestEvent) => {
	const { userId } = event.locals.auth();

	if (!userId) {
		throw error(401, 'Unauthorized');
	}

	return userId;
};

export const get_kv = (event: RequestEvent) => {
	if (!event.platform?.env?.KV) {
		throw new Error('KV not available');
	}

	return event.platform.env.KV;
};

export const get_r2 = (event: RequestEvent) => {
	if (!event.platform?.env?.R2) {
		throw new Error('R2 not available');
	}

	return event.platform.env.R2;
};
