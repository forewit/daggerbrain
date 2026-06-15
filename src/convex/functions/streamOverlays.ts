import { v } from 'convex/values';
import { mutation, query, type MutationCtx, type QueryCtx } from '../_generated/server';
import type { Id } from '../_generated/dataModel';
import { getCampaignAccess } from '../permissions';

const DEFAULT_MODULES = {
	fear: true,
	countdowns: true
};

const DEFAULT_LAYOUT = {
	fear: {
		x: 0,
		y: 0,
		scale: 1
	},
	countdowns: {
		x: 0,
		y: 0,
		scale: 1
	}
} as const;

const DEFAULT_SETTINGS = {
	fear: {
		showLabel: true
	},
	countdowns: {
		groupWithFear: true
	}
} as const;

const positionValidator = v.object({
	x: v.number(),
	y: v.number(),
	scale: v.number()
});

function generateOverlayToken(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const array = new Uint8Array(40);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => chars[byte % chars.length]).join('');
}

async function requireGmOverlay(ctx: QueryCtx | MutationCtx, campaignId: Id<'campaigns'>) {
	const access = await getCampaignAccess(ctx, campaignId);
	if (!access || !access.isOwner) {
		throw new Error('Not authorized');
	}

	return await getOverlayForCampaign(ctx, campaignId);
}

async function getOverlayForCampaign(ctx: QueryCtx | MutationCtx, campaignId: Id<'campaigns'>) {
	const overlays = await ctx.db
		.query('stream_overlays')
		.withIndex('by_campaign_id', (q) => q.eq('campaign_id', campaignId))
		.take(1);

	return overlays[0] ?? null;
}

async function getOverlaysForCampaign(ctx: QueryCtx | MutationCtx, campaignId: Id<'campaigns'>) {
	return await ctx.db
		.query('stream_overlays')
		.withIndex('by_campaign_id', (q) => q.eq('campaign_id', campaignId))
		.collect();
}

export const getForCampaign = query({
	args: { campaign_id: v.id('campaigns') },
	handler: async (ctx, args) => {
		const overlay = await requireGmOverlay(ctx, args.campaign_id);
		if (!overlay) return null;

		return {
			enabled: overlay.enabled,
			token: overlay.token,
			modules: overlay.modules,
			settings: overlay.settings,
			layout: overlay.layout
		};
	}
});

export const createOrRotate = mutation({
	args: { campaign_id: v.id('campaigns') },
	handler: async (ctx, args): Promise<{ token: string }> => {
		const existingOverlay = await requireGmOverlay(ctx, args.campaign_id);
		const token = generateOverlayToken();

		if (existingOverlay) {
			const overlays = await getOverlaysForCampaign(ctx, args.campaign_id);
			await Promise.all(
				overlays
					.filter((overlay) => overlay._id !== existingOverlay._id)
					.map((overlay) => ctx.db.delete(overlay._id))
			);
			await ctx.db.patch(existingOverlay._id, {
				token,
				enabled: true,
				modules: existingOverlay.modules,
				settings: existingOverlay.settings,
				layout: existingOverlay.layout
			});
			return { token };
		}

		await ctx.db.insert('stream_overlays', {
			campaign_id: args.campaign_id,
			token,
			enabled: true,
			modules: DEFAULT_MODULES,
			settings: DEFAULT_SETTINGS,
			layout: DEFAULT_LAYOUT
		});

		return { token };
	}
});

export const updateSettings = mutation({
	args: {
		campaign_id: v.id('campaigns'),
		enabled: v.boolean(),
		modules: v.object({
			fear: v.boolean(),
			countdowns: v.boolean()
		}),
		settings: v.object({
			fear: v.object({
				showLabel: v.boolean()
			}),
			countdowns: v.object({
				groupWithFear: v.boolean()
			})
		}),
		layout: v.object({
			fear: positionValidator,
			countdowns: positionValidator
		})
	},
	handler: async (ctx, args) => {
		const overlay = await requireGmOverlay(ctx, args.campaign_id);
		if (!overlay) {
			throw new Error('Stream overlay has not been created');
		}

		await ctx.db.patch(overlay._id, {
			enabled: args.enabled,
			modules: args.modules,
			settings: args.settings,
			layout: args.layout
		});
	}
});

export const getOverlayState = query({
	args: { token: v.string() },
	handler: async (ctx, args) => {
		const overlay = await ctx.db
			.query('stream_overlays')
			.withIndex('by_token', (q) => q.eq('token', args.token))
			.unique();

		if (!overlay?.enabled) return null;

		const campaignDoc = await ctx.db.get(overlay.campaign_id);
		if (!campaignDoc) return null;

		return {
			campaign: {
				name: campaignDoc.campaign.name,
				fear_track: overlay.modules.fear ? campaignDoc.campaign.fear_track : null
			},
			countdowns: overlay.modules.countdowns
				? campaignDoc.campaign.countdowns.filter((countdown) => countdown.visibleToPlayers)
				: [],
			settings: overlay.settings,
			layout: overlay.layout
		};
	}
});
