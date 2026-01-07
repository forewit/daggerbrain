import { error } from '@sveltejs/kit';
import { getCampaignAccess } from '$lib/remote/permissions.remote';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform, request }) => {
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
	const access = await getCampaignAccess(campaignId);
	if (!access.membership) {
		throw error(403, 'Not a member of this campaign');
	}

	// Get DO instance via DurableObjectNamespace
	if (!platform?.env?.CAMPAIGN_LIVE) {
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

	const id = platform.env.CAMPAIGN_LIVE.idFromName(campaignId);
	const stub = platform.env.CAMPAIGN_LIVE.get(id);

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
