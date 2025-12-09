import { error, type RequestEvent } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/d1';

export const get_db = (event: RequestEvent) => {
	if (!event.platform?.env?.DB) {
		throw new Error('Database not available');
	}

	return drizzle(event.platform.env.DB);
};

export const get_auth = (event: RequestEvent) => {
	const auth = event.locals.auth();
	const { userId } = auth;
	if (!userId) {
		throw error(401, 'Unauthorized');
	}
	return auth;
};


export const get_kv = (event: RequestEvent) => {
	if (!event.platform?.env?.KV) {
		throw new Error('KV not available');
	}

	return event.platform.env.KV;
};

export const get_r2_images = (event: RequestEvent) => {
	if (!event.platform?.env?.R2_IMAGES) {
		throw new Error('R2_IMAGES not available');
	}

	return event.platform.env.R2_IMAGES;
};

export const get_r2_usercontent = (event: RequestEvent) => {
	if (!event.platform?.env?.R2_USERCONTENT) {
		throw new Error('R2_USERCONTENT not available');
	}

	return event.platform.env.R2_USERCONTENT;
};
