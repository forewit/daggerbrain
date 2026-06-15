import { v } from 'convex/values';
import { internalMutation, internalAction } from '../_generated/server';

export const refreshUserEntitlements = internalAction({
	args: {
		clerkUserId: v.string()
	},
	returns: v.null(),
	handler: async () => {
		// Billing is disabled, so existing Convex entitlement rows are now the source of truth.
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
