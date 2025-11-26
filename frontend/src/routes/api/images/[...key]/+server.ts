import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform }) => {
	const { key } = params;

	if (!key) {
		throw error(400, 'Image key is required');
	}

	// key is an array when using catch-all, join it back to the original path
	const imageKey = Array.isArray(key) ? key.join('/') : key;

	if (!platform?.env?.R2) {
		throw error(500, 'Internal server error');
	}

	const r2 = platform.env.R2;
	const object = await r2.get(imageKey);

	if (!object) {
		throw error(404, 'Image not found');
	}

	// Get the image data as ArrayBuffer
	const arrayBuffer = await object.arrayBuffer();

	const headers = new Headers();

	// Set content type from R2 metadata or default to image
	const contentType = object.httpMetadata?.contentType || 'image/jpeg';
	headers.set('Content-Type', contentType);

	// Cache for 1 year
	headers.set('Cache-Control', 'public, max-age=31536000, immutable');

	// Return the image as a Response
	return new Response(arrayBuffer, { headers });
};

