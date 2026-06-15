import { verifyWebhook } from '@clerk/backend/webhooks';
import type {
	BillingSubscriptionItemWebhookEvent,
	BillingSubscriptionWebhookEvent,
	WebhookEvent
} from '@clerk/backend/webhooks';
import { httpRouter } from 'convex/server';
import { internal } from './_generated/api';
import { httpAction } from './_generated/server';

const http = httpRouter();

const RELEVANT_BILLING_EVENT_TYPES = new Set([
	'subscription.created',
	'subscription.updated',
	'subscription.active',
	'subscription.pastDue',
	'subscriptionItem.created',
	'subscriptionItem.updated',
	'subscriptionItem.active',
	'subscriptionItem.canceled',
	'subscriptionItem.upcoming',
	'subscriptionItem.ended',
	'subscriptionItem.abandoned',
	'subscriptionItem.incomplete',
	'subscriptionItem.pastDue'
]);

function isRelevantBillingEvent(
	event: WebhookEvent
): event is BillingSubscriptionWebhookEvent | BillingSubscriptionItemWebhookEvent {
	return RELEVANT_BILLING_EVENT_TYPES.has(event.type);
}

function getClerkWebhookSigningSecret() {
	const signingSecret = process.env['CLERK_WEBHOOK_SIGNING_SECRET'];
	if (!signingSecret) {
		throw new Error('Missing CLERK_WEBHOOK_SIGNING_SECRET');
	}

	return signingSecret;
}

function getClerkUserId(
	event: BillingSubscriptionWebhookEvent | BillingSubscriptionItemWebhookEvent
): string | null {
	return event.data.payer?.user_id ?? null;
}

export const clerkWebhook = httpAction(async (ctx, request) => {
	let signingSecret: string;

	try {
		signingSecret = getClerkWebhookSigningSecret();
	} catch (error) {
		console.error('Clerk webhook signing secret is not configured', error);
		return new Response('Webhook configuration error', { status: 500 });
	}

	let event: WebhookEvent;

	try {
		event = await verifyWebhook(request, {
			signingSecret
		});
	} catch (error) {
		console.error('Clerk webhook verification failed', error);
		return new Response('Invalid webhook signature', { status: 400 });
	}

	if (!isRelevantBillingEvent(event)) {
		return new Response('Ignored', { status: 200 });
	}

	const clerkUserId = getClerkUserId(event);
	if (!clerkUserId) {
		console.warn('Ignoring Clerk billing webhook without user payer', {
			type: event.type,
			objectId: event.data.id
		});
		return new Response('Ignored', { status: 200 });
	}

	await ctx.runAction(internal.internal.entitlements.refreshUserEntitlements, {
		clerkUserId
	});

	return new Response('OK', { status: 200 });
});

http.route({
	path: '/clerk/webhooks',
	method: 'POST',
	handler: clerkWebhook
});

export default http;
