import type { RequestHandler } from './$types';
import type { Headers as CloudflareHeaders } from '@cloudflare/workers-types';

export const GET: RequestHandler = async ({ params, platform, locals }) => {
	// 1. Authentication check
	const auth = locals.auth?.();
	if (!auth?.userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	const r2 = platform?.env?.R2;
	if (!r2) {
		return new Response('R2 not configured', { status: 500 });
	}

	const path = params.path;
	if (!path) {
		return new Response('Not found', { status: 404 });
	}

	// 2. Path validation - prevent path traversal and ensure correct structure
	// Images should be stored as: characters/{userId}/{characterId}-{timestamp}.{ext}
	if (!path.startsWith('characters/')) {
		return new Response('Not found', { status: 404 });
	}

	// Prevent path traversal attacks (../, ..\, etc.)
	if (path.includes('..') || path.includes('\\')) {
		return new Response('Invalid path', { status: 400 });
	}

	// Extract userId from path to verify ownership
	// Path format: characters/{userId}/{rest}
	const pathParts = path.split('/');
	if (pathParts.length < 3 || pathParts[0] !== 'characters') {
		return new Response('Not found', { status: 404 });
	}

	const pathUserId = pathParts[1];
	if (pathUserId !== auth.userId) {
		return new Response('Forbidden', { status: 403 });
	}

	try {
		const object = await r2.get(path);
		if (!object) {
			return new Response('Not found', { status: 404 });
		}

		// 3. Verify ownership via custom metadata (additional security layer)
		const customMetadata = object.customMetadata;
		if (customMetadata?.userId && customMetadata.userId !== auth.userId) {
			return new Response('Forbidden', { status: 403 });
		}

		// 4. Content type validation - ensure we're serving images
		const contentType = object.httpMetadata?.contentType || '';
		if (!contentType.startsWith('image/')) {
			return new Response('Invalid content type', { status: 400 });
		}

		// Use writeHttpMetadata to properly set headers from R2 object metadata
		// Type assertion needed because Cloudflare Workers Headers and standard Headers
		// are compatible at runtime but TypeScript sees them as different types
		const headers = new Headers();
		object.writeHttpMetadata(headers as unknown as CloudflareHeaders);
		headers.set('etag', object.httpEtag);

		// Type assertion needed for body - Cloudflare ReadableStream is compatible
		// with standard ReadableStream at runtime
		return new Response(object.body as BodyInit, {
			headers
		});
	} catch (error) {
		console.error('Error serving image:', error);
		return new Response('Internal server error', { status: 500 });
	}
};

