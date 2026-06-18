import { v } from 'convex/values';
import { internalMutation, internalAction } from '../_generated/server';
import { createClerkClient } from '@clerk/backend';
import type { BillingSubscription } from '@clerk/backend';
import { internal } from '../_generated/api';

const EFFECTIVE_ITEM_STATUSES = new Set(['active', 'past_due']);

function getClerkClient() {
	const secretKey = process.env.CLERK_SECRET_KEY;
	if (!secretKey) {
		throw new Error('Missing CLERK_SECRET_KEY');
	}

	return createClerkClient({ secretKey });
}

function normalizeFeatureSlugs(subscription: BillingSubscription): string[] {
	const featureSlugs = new Set<string>();

	for (const item of subscription.subscriptionItems) {
		if (!EFFECTIVE_ITEM_STATUSES.has(item.status)) {
			continue;
		}

		if (!item.plan || item.plan.isDefault) {
			continue;
		}

		for (const feature of item.plan.features) {
			featureSlugs.add(feature.slug);
		}
	}

	return [...featureSlugs].sort();
}

export const refreshUserEntitlements = internalAction({
	args: {
		clerkUserId: v.string()
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const clerkClient = getClerkClient();
		const subscription = await clerkClient.billing.getUserBillingSubscription(args.clerkUserId);
		const featureSlugs = normalizeFeatureSlugs(subscription);

		await ctx.runMutation(internal.internal.entitlements.upsertUserEntitlements, {
			clerkUserId: args.clerkUserId,
			featureSlugs,
			syncedAt: Date.now()
		});

		return null;
	}
});

export const upsertUserEntitlements = internalMutation({
	args: {
		clerkUserId: v.string(),
		featureSlugs: v.array(v.string()),
		syncedAt: v.number()
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const existingEntitlements = await ctx.db
			.query('user_entitlements')
			.withIndex('by_clerk_user_id', (q) => q.eq('clerk_user_id', args.clerkUserId))
			.unique();

		if (existingEntitlements) {
			await ctx.db.patch(existingEntitlements._id, {
				feature_slugs: args.featureSlugs,
				synced_at: args.syncedAt
			});
			return null;
		}

		await ctx.db.insert('user_entitlements', {
			clerk_user_id: args.clerkUserId,
			feature_slugs: args.featureSlugs,
			synced_at: args.syncedAt
		});

		return null;
	}
});
