import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform }) => {
	const r2 = platform?.env?.R2;
	if (!r2) {
		return new Response('R2 not configured', { status: 500 });
	}

	const path = params.path;
	if (!path) {
		return new Response('Not found', { status: 404 });
	}

	try {
		const object = await r2.get(path);
		if (!object) {
			return new Response('Not found', { status: 404 });
		}

		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set('etag', object.httpEtag);

		return new Response(object.body, {
			headers
		});
	} catch (error) {
		console.error('Error serving image:', error);
		return new Response('Internal server error', { status: 500 });
	}
};

