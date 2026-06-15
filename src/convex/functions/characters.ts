import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { zodToConvex } from 'convex-helpers/server/zod4';
import { CharacterCompendiumScopeSchema, CharacterSchema } from '../schemas/characters';
import type { Character } from '../schemas/characters';
import { getCampaignAccess, getCharacterAccess } from '../permissions';
import type { CharacterAccess } from '../permissions';
import type { Id } from '../_generated/dataModel';
import { UNLIMITED_CHARACTERS_FEATURE_SLUG, CHARACTER_LIMIT } from '../constants/entitlements';
import { getCharacterCompendiumScopeForView } from '../lib/characterCompendium';

export const list = query({
	handler: async (
		ctx
	): Promise<{ id: Id<'characters'>; character: Character; campaign_name?: string }[]> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const characterDocs = await ctx.db
			.query('characters')
			.withIndex('by_owner_clerk_id', (q) => q.eq('owner_clerk_id', identity.subject))
			.collect();

		return await Promise.all(
			characterDocs.map(async (doc) => {
				//! === COMPATABILITY ===
				/*
				 * Related git commit: 9653f7785d9d04738183743bb00d2ffeb31b4607
				 * DATE: 2026-05-06T08:49:54-04:00
				 * REASON: Older character rows may only have campaign_id nested inside the character payload.
				 * REPLACE WITH:
				 * const campaignId = doc.campaign_id;
				 * const character = { ...doc.character, campaign_id: campaignId };
				 */
				const campaignId = doc.campaign_id ?? doc.character.campaign_id;
				const character = { ...doc.character, campaign_id: campaignId };
				//! === END ===
				const campaignAccess = campaignId ? await getCampaignAccess(ctx, campaignId) : null;

				return {
					id: doc._id,
					character,
					campaign_name: campaignAccess?.campaign.name
				};
			})
		);
	}
});

export const get = query({
	args: { id: v.id('characters') },
	handler: async (ctx, args): Promise<CharacterAccess | null> => {
		const access = await getCharacterAccess(ctx, args.id);
		if (!access) {
			return null;
		}

		return {
			...access,
			character: access.character
		};
	}
});

export const getCompendiumScopeForView = query({
	args: { id: v.id('characters') },
	returns: v.union(v.null(), zodToConvex(CharacterCompendiumScopeSchema)),
	handler: async (ctx, args) => {
		return await getCharacterCompendiumScopeForView(ctx, args.id);
	}
});

export const add = mutation({
	args: zodToConvex(CharacterSchema),
	handler: async (ctx, args): Promise<Id<'characters'>> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const user = await ctx.db
			.query('users')
			.withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
			.unique();

		if (!user) {
			throw new Error('User not found');
		}
		const characterCount = user.character_count ?? 0;

		const entitlementsDoc = await ctx.db
			.query('user_entitlements')
			.withIndex('by_clerk_user_id', (q) => q.eq('clerk_user_id', identity.subject))
			.unique();
		const hasUnlimitedCharacters =
			entitlementsDoc?.feature_slugs.includes(UNLIMITED_CHARACTERS_FEATURE_SLUG) ?? false;

		if (!hasUnlimitedCharacters && characterCount >= CHARACTER_LIMIT) {
			throw new Error('Character limit reached');
		}

		const characterId = await ctx.db.insert('characters', {
			character: {
				...args,
				//! === COMPATABILITY ===
				/*
				 * Related git commit: 9653f7785d9d04738183743bb00d2ffeb31b4607
				 * Date: 2026-05-06T08:49:54-04:00
				 * Reason: Older deployed code may still read campaign_id from the nested character payload.
				 * Replace with:
				 * Remove this campaign_id property from the nested character payload.
				 */
				campaign_id: undefined
				//! === END ===
			},
			campaign_id: undefined,
			owner_clerk_id: identity.subject
		});

		// increment character count for user
		await ctx.db.patch(user._id, { character_count: characterCount + 1 });

		return characterId;
	}
});

export const update = mutation({
	args: {
		id: v.id('characters'),
		character: zodToConvex(CharacterSchema)
	},
	handler: async (ctx, args) => {
		const access = await getCharacterAccess(ctx, args.id);
		if (!access || !access.canEdit) {
			throw new Error('Not authorized');
		}

		const { id, character } = args;
		const nextCharacter: Character = {
			...character,
			//! === COMPATABILITY ===
			/*
			 * Related git commit: 9653f7785d9d04738183743bb00d2ffeb31b4607
			 * Date: 2026-05-06T08:49:54-04:00
			 * Reason: Older deployed code may still read campaign_id from the nested character payload.
			 * Replace with:
			 * Remove this campaign_id property from nextCharacter.
			 */
			campaign_id: access.character.campaign_id
			//! === END ===
		};

		if (JSON.stringify(access.character) === JSON.stringify(nextCharacter)) {
			return;
		}
		await ctx.db.patch(id, { character: nextCharacter });
	}
});

export const remove = mutation({
	args: { id: v.id('characters') },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const access = await getCharacterAccess(ctx, args.id);
		if (!access || !access.isOwner) {
			throw new Error('Not authorized');
		}

		if (access.character.campaign_id) {
			const campaignDoc = await ctx.db.get(access.character.campaign_id);
			if (campaignDoc) {
				await ctx.db.patch(access.character.campaign_id, {
					characters: campaignDoc.characters.filter(
						(character) => character.character_id !== args.id
					)
				});
			}
		}

		await ctx.db.delete(args.id);

		// decrement character count for user
		const user = await ctx.db
			.query('users')
			.withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
			.unique();

		if (!user) {
			throw new Error('User not found');
		}
		const characterCount = user.character_count ?? 0;
		await ctx.db.patch(user._id, { character_count: Math.max(0, characterCount - 1) });
	}
});
