import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { zodToConvex } from 'convex-helpers/server/zod4';
import { EncounterSchema } from '../schemas/encounters';
import type { Encounter } from '../schemas/encounters';
import { getEncounterAccess } from '../permissions';
import type { EncounterAccess } from '../permissions';
import type { Id } from '../_generated/dataModel';

export const list = query({
	handler: async (ctx): Promise<{ id: Id<'encounters'>; encounter: Encounter }[]> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const encounterDocs = await ctx.db
			.query('encounters')
			.withIndex('by_owner_clerk_id', (q) => q.eq('owner_clerk_id', identity.subject))
			.collect();

		return encounterDocs.map((doc) => ({ id: doc._id, encounter: doc.encounter }));
	}
});

export const get = query({
	args: { id: v.id('encounters') },
	handler: async (ctx, args): Promise<EncounterAccess | null> => {
		return await getEncounterAccess(ctx, args.id);
	}
});

export const add = mutation({
	args: zodToConvex(EncounterSchema),
	handler: async (ctx, args): Promise<Id<'encounters'>> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		return await ctx.db.insert('encounters', {
			encounter: { ...args },
			owner_clerk_id: identity.subject
		});
	}
});

export const update = mutation({
	args: {
		id: v.id('encounters'),
		encounter: zodToConvex(EncounterSchema)
	},
	handler: async (ctx, args) => {
		const access = await getEncounterAccess(ctx, args.id);
		if (!access || !access.isOwner) {
			throw new Error('Not authorized');
		}

		const { id, encounter } = args;
		if (JSON.stringify(access.encounter) === JSON.stringify(encounter)) {
			return;
		}
		await ctx.db.patch(id, { encounter });
	}
});

export const remove = mutation({
	args: { id: v.id('encounters') },
	handler: async (ctx, args) => {
		const access = await getEncounterAccess(ctx, args.id);
		if (!access || !access.isOwner) {
			throw new Error('Not authorized');
		}

		await ctx.db.delete(args.id);
	}
});
