import { error } from '@sveltejs/kit';
import { getCampaignAccessInternal } from '$lib/server/permissions';
import { get_db, get_auth, get_do } from '$lib/remote/utils';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform, request, locals }) => {
	const upgradeHeader = request.headers.get('Upgrade');
	if (upgradeHeader !== 'websocket') {
		return new Response('Expected WebSocket upgrade', { status: 426 });
	}

	// Verify campaign membership
	const campaignId = params.id;
	if (!campaignId) {
		throw error(400, 'Campaign ID required');
	}

	// Get campaign access - handles auth and membership check
	const event = { platform, locals } as Parameters<typeof get_db>[0];
	const db = get_db(event);
	const { userId } = get_auth(event);
	const access = await getCampaignAccessInternal(db, userId, campaignId);
	if (!access.membership) {
		throw error(403, 'Not a member of this campaign');
	}

	// Get DO instance via DurableObjectNamespace
	const stub = get_do(event, campaignId);
	if (!stub) {
		// In development with vite dev, DO binding may not be available
		// Return a helpful error message
		console.error(
			'CAMPAIGN_LIVE Durable Object binding not available. Make sure to run with wrangler dev or deploy both workers.'
		);
		throw error(
			503,
			'Durable Object service unavailable. Please use wrangler dev for local development.'
		);
	}

	// Forward the WebSocket upgrade request to the Durable Object
	// For WebSocket upgrades, body is null, so we can safely reconstruct the request
	// stub.fetch accepts RequestInfo (string | Request | URL)
	// Note: The response type from stub.fetch is Cloudflare's Response, which is compatible
	// with the standard Response at runtime, but TypeScript sees them as different types
	// due to missing getSetCookie in Cloudflare's Headers type. This is a known type
	// incompatibility that doesn't affect runtime behavior.
	try {
		// Pass user context to DO via headers for permission checks
		const headers = new Headers(request.headers);
		headers.set('X-User-Id', access.membership.user_id);
		headers.set('X-User-Role', access.role!);

		const response = await stub.fetch(request.url, {
			method: request.method,
			headers: headers,
			// WebSocket upgrade requests don't have a body, so we can omit it
			cf: request.cf
		});
		// Type assertion needed due to Cloudflare Workers type incompatibility
		// Runtime behavior is correct - both Response types are compatible
		return response as unknown as Response;
	} catch (err) {
		throw err;
	}
};
