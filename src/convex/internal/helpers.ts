import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';
import type { TableNames } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

const TABLES_TO_CLEAR = [
	'sources',
	'characters',
	'encounters',
	'users',
	'user_unlocked_sources',
	'user_entitlements',
	'campaigns',
	'dice_history',
	'stream_overlays',
	'primary_weapons',
	'secondary_weapons',
	'armor',
	'loot',
	'consumables',
	'beastforms',
	'classes',
	'subclasses',
	'domains',
	'domain_cards',
	'ancestry_cards',
	'community_cards',
	'transformation_cards',
	'adversaries',
	'environments'
] as const satisfies readonly TableNames[];

const tableNameValidator = v.union(
	v.literal('sources'),
	v.literal('characters'),
	v.literal('encounters'),
	v.literal('users'),
	v.literal('user_unlocked_sources'),
	v.literal('user_entitlements'),
	v.literal('campaigns'),
	v.literal('dice_history'),
	v.literal('stream_overlays'),
	v.literal('primary_weapons'),
	v.literal('secondary_weapons'),
	v.literal('armor'),
	v.literal('loot'),
	v.literal('consumables'),
	v.literal('beastforms'),
	v.literal('classes'),
	v.literal('subclasses'),
	v.literal('domains'),
	v.literal('domain_cards'),
	v.literal('ancestry_cards'),
	v.literal('community_cards'),
	v.literal('transformation_cards'),
	v.literal('adversaries'),
	v.literal('environments')
);

async function clearTable(ctx: MutationCtx, tableName: TableNames) {
	if (process.env.IS_DEV !== 'true') {
		throw new Error('Not allowed in production');
	}

	const docs = await ctx.db.query(tableName).collect();
	await Promise.all(docs.map((doc) => ctx.db.delete(doc._id)));
	return {
		tableName,
		deletedCount: docs.length
	};
}

export const clearAllData = internalMutation({
	args: {},
	returns: v.array(
		v.object({
			tableName: tableNameValidator,
			deletedCount: v.number()
		})
	),
	handler: async (ctx) => {
		if (process.env.IS_DEV !== 'true') {
			throw new Error('Not allowed in production');
		}

		const results: Array<{ tableName: TableNames; deletedCount: number }> = [];

		for (const tableName of TABLES_TO_CLEAR) {
			results.push(await clearTable(ctx, tableName));
		}

		return results;
	}
});
