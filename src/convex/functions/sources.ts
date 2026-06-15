import { query } from '../_generated/server';
import type { SourceMetadata } from '../schemas/sources';
import { OFFICIAL_SOURCE_METADATA } from '../constants/entitlements';

export const list = query({
	handler: async (ctx): Promise<SourceMetadata[]> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const userUnlockedSourcesDoc = await ctx.db
			.query('user_unlocked_sources')
			.withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
			.unique();

		if (!userUnlockedSourcesDoc) {
			throw new Error('User unlocked sources missing');
		}

		const source_keys = userUnlockedSourcesDoc.unlocked_source_keys;

		if (source_keys.length === 0) {
			return [];
		}

		return source_keys.flatMap((sourceKey) => {
			const source = OFFICIAL_SOURCE_METADATA[sourceKey as keyof typeof OFFICIAL_SOURCE_METADATA];
			return source ? [source] : [];
		});
	}
});
