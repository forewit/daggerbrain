import type { Doc, Id } from '../_generated/dataModel';
import { mutation, query } from '../_generated/server';
import { DEFAULT_UNLOCKED_SOURCES } from '../constants/entitlements';
import { createEmptyCompendiumContentIds } from '../lib/characterCompendium';

export const get = query({
	handler: async (ctx): Promise<Doc<'users'> | null> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const userDoc = await ctx.db
			.query('users')
			.withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
			.unique();

		return userDoc;
	}
});

export const create = mutation({
	handler: async (ctx): Promise<Id<'users'>> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const userDoc = await ctx.db
			.query('users')
			.withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
			.unique();

		if (userDoc) {
			return userDoc._id;
		}

		// create user doc
		const id = await ctx.db.insert('users', {
			clerk_id: identity.subject,
			campaign_ids: [],
			character_count: 0,
			homebrew_count: 0,
			homebrew_vault: createEmptyCompendiumContentIds()
		});

		// create user unlocked sources doc
		await ctx.db.insert('user_unlocked_sources', {
			clerk_id: identity.subject,
			unlocked_source_keys: DEFAULT_UNLOCKED_SOURCES
		});

		return id;
	}
});
