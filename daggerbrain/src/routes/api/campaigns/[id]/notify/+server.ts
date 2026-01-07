import { error } from '@sveltejs/kit';
import { getCampaignAccess } from '$lib/remote/permissions.remote';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ params, platform, request }: RequestEvent) {
	const campaignId = params.id;
	if (!campaignId) {
		throw error(400, 'Campaign ID required');
	}

	// Verify campaign membership - handles auth internally
	const access = await getCampaignAccess(campaignId);
	if (!access.membership) {
		throw error(403, 'Not a member of this campaign');
	}

	// Get DO instance
	if (!platform?.env?.CAMPAIGN_LIVE) {
		console.error('CAMPAIGN_LIVE Durable Object binding not available.');
		throw error(503, 'Durable Object service unavailable.');
	}

	const id = platform.env.CAMPAIGN_LIVE.idFromName(campaignId);
	const stub = platform.env.CAMPAIGN_LIVE.get(id);

	// Forward the request to the Durable Object
	try {
		const body = await request.json();
		const response = await stub.fetch(request.url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		return response;
	} catch (err) {
		console.error('Failed to notify DO:', err);
		throw error(500, 'Failed to notify Durable Object');
	}
}
