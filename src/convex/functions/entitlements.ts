import { v } from 'convex/values';
import { query } from '../_generated/server';

export const getFeatures = query({
	args: {},
	returns: v.array(v.string()),
	handler: async (ctx): Promise<string[]> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const entitlementsDoc = await ctx.db
			.query('user_entitlements')
			.withIndex('by_clerk_user_id', (q) => q.eq('clerk_user_id', identity.subject))
			.unique();

		return entitlementsDoc?.feature_slugs ?? [];
	}
});
