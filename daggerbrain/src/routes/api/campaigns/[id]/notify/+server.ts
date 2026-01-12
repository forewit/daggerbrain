import { error } from '@sveltejs/kit';
import { getCampaignAccessInternal } from '$lib/server/permissions';
import { get_db, get_auth } from '$lib/remote/utils';
import type { RequestEvent } from '@sveltejs/kit';
import { z } from 'zod';

// Define schema for valid notification types
const NotifyBodySchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('character_added'),
		characterId: z.string(),
		character: z.any().optional(),
		claimable: z.boolean().optional()
	}),
	z.object({
		type: z.literal('character_updated'),
		characterId: z.string(),
		character: z.any().optional(),
		updates: z.record(z.string(), z.any()).optional(),
		claimable: z.boolean().optional()
	}),
	z.object({
		type: z.literal('character_removed'),
		characterId: z.string()
	}),
	z.object({
		type: z.literal('character_deleted'),
		characterId: z.string()
	}),
	z.object({
		type: z.literal('member_updated'),
		userId: z.string(),
		displayName: z.string().nullable()
	})
]);

export async function POST({ params, platform, request, locals }: RequestEvent) {
	const campaignId = params.id;
	if (!campaignId) {
		throw error(400, 'Campaign ID required');
	}

	// Verify campaign membership - handles auth internally
	const event = { platform, locals } as Parameters<typeof get_db>[0];
	const db = get_db(event);
	const { userId } = get_auth(event);
	const access = await getCampaignAccessInternal(db, userId, campaignId);
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

	try {
		const rawBody = await request.json();

		// Validate request body
		const parseResult = NotifyBodySchema.safeParse(rawBody);
		if (!parseResult.success) {
			console.error('Invalid notify body:', parseResult.error.issues);
			throw error(400, 'Invalid request body');
		}

		const body = parseResult.data;

		const response = await stub.fetch(request.url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		return response;
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err; // Re-throw SvelteKit errors
		}
		console.error('Failed to notify DO:', err);
		throw error(500, 'Failed to notify Durable Object');
	}
}
