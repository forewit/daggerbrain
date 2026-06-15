import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import type { Id } from '../_generated/dataModel';
import { zodToConvex } from 'convex-helpers/server/zod4';
import { CampaignSchema } from '../schemas/campaigns';
import type { Campaign, CampaignSummary } from '../schemas/campaigns';
import { getCampaignAccess } from '../permissions';
import type { CampaignAccess } from '../permissions';
import { DiceHistorySchema, type DiceHistory } from '../schemas/dice';
import { UNLIMITED_CHARACTERS_FEATURE_SLUG, CHARACTER_LIMIT } from '../constants/entitlements';
import { createEmptyCompendiumContentIds } from '../lib/characterCompendium';

function generateInviteCode(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const array = new Uint8Array(12);
	crypto.getRandomValues(array);
	return Array.from(array, (b) => chars[b % chars.length]).join('');
}

export const get = query({
	args: { id: v.id('campaigns') },
	handler: async (ctx, args): Promise<CampaignAccess | null> => {
		return await getCampaignAccess(ctx, args.id);
	}
});

export const resolveInvite = query({
	args: { invite_code: v.string() },
	returns: v.union(
		v.object({
			campaign_id: v.id('campaigns'),
			campaign_name: v.string(),
			is_member: v.boolean()
		}),
		v.null()
	),
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const campaignDoc = await ctx.db
			.query('campaigns')
			.withIndex('by_invite_code', (q) => q.eq('invite_code', args.invite_code))
			.unique();

		if (!campaignDoc) {
			return null;
		}

		return {
			campaign_id: campaignDoc._id,
			campaign_name: campaignDoc.campaign.name,
			is_member: !!campaignDoc.members.find((member) => member.clerk_id === identity.subject)
		};
	}
});

export const list = query({
	args: {},
	handler: async (ctx): Promise<Record<Id<'campaigns'>, CampaignSummary>> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const userDoc = await ctx.db
			.query('users')
			.withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
			.unique();

		if (!userDoc) {
			return {};
		}

		const campaigns: Record<Id<'campaigns'>, CampaignSummary> = {};

		await Promise.all(
			userDoc.campaign_ids.map(async (campaignId) => {
				const typedCampaignId = campaignId as Id<'campaigns'>;
				const campaignDoc = await ctx.db.get(typedCampaignId);
				if (!campaignDoc) return;

				const member = campaignDoc.members.find(
					(campaignMember) => campaignMember.clerk_id === identity.subject
				);
				if (!member) return;

				const activeCharacterImageUrls = await Promise.all(
					campaignDoc.characters
						.filter((character) => character.status === 'active')
						.map(async (character) => {
							const characterDoc = await ctx.db.get(character.character_id);
							return characterDoc?.character.image_url ?? null;
						})
				).then((list) => list.filter((url) => url !== null));

				campaigns[typedCampaignId] = {
					role: member.role,
					name: campaignDoc.campaign.name,
					player_count: campaignDoc.members.filter(
						(campaignMember) => campaignMember.role === 'Player'
					).length,
					active_character_image_urls: activeCharacterImageUrls,
					creation_time: campaignDoc._creationTime
				};
			})
		);

		return campaigns;
	}
});

export const add = mutation({
	args: { name: v.string(), display_name: v.string() },
	handler: async (ctx, args): Promise<Id<'campaigns'>> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const userDoc = await ctx.db
			.query('users')
			.withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
			.unique();

		if (!userDoc) {
			throw new Error('User not found');
		}

		const campaignName = args.name.trim();
		if (!campaignName) {
			throw new Error('Campaign name is required');
		}

		const campaignId = await ctx.db.insert('campaigns', {
			invite_code: generateInviteCode(),
			campaign: {
				name: campaignName,
				fear_track: 0,
				countdowns: [],
				homebrew_vault: createEmptyCompendiumContentIds()
			},
			members: [
				{
					clerk_id: identity.subject,
					display_name: args.display_name,
					role: 'GM'
				}
			],
			characters: []
		});

		await ctx.db.insert('dice_history', {
			campaign_id: campaignId,
			history: { rolls: [] }
		});

		await ctx.db.patch(userDoc._id, {
			campaign_ids: userDoc.campaign_ids.includes(campaignId)
				? userDoc.campaign_ids
				: [...userDoc.campaign_ids, campaignId]
		});

		return campaignId;
	}
});

export const update = mutation({
	args: {
		id: v.id('campaigns'),
		campaign: zodToConvex(CampaignSchema)
	},
	handler: async (ctx, args) => {
		const access = await getCampaignAccess(ctx, args.id);
		if (!access || !access.isOwner) {
			throw new Error('Not authorized');
		}

		const { id, campaign } = args;
		await ctx.db.patch(id, { campaign });
	}
});

export const changeDisplayName = mutation({
	args: {
		campaign_id: v.id('campaigns'),
		display_name: v.string()
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const campaignDoc = await ctx.db.get(args.campaign_id);
		if (!campaignDoc) {
			throw new Error('Campaign not found');
		}

		const memberIndex = campaignDoc.members.findIndex(
			(member) => member.clerk_id === identity.subject
		);
		if (memberIndex === -1) {
			throw new Error('Not a member of this campaign');
		}

		const currentMember = campaignDoc.members[memberIndex];
		if (currentMember.display_name === args.display_name) {
			return;
		}

		const members = campaignDoc.members.map((member, index) =>
			index === memberIndex ? { ...member, display_name: args.display_name } : member
		);

		await ctx.db.patch(args.campaign_id, { members });
	}
});

export const remove = mutation({
	args: { id: v.id('campaigns') },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const access = await getCampaignAccess(ctx, args.id);
		if (!access || !access.isOwner) {
			throw new Error('Not authorized');
		}

		const campaignDoc = await ctx.db.get(args.id);
		if (!campaignDoc) {
			throw new Error('Campaign not found');
		}

		await Promise.all(
			campaignDoc.members.map(async (member) => {
				const memberUserDoc = await ctx.db
					.query('users')
					.withIndex('by_clerk_id', (q) => q.eq('clerk_id', member.clerk_id))
					.unique();

				if (memberUserDoc) {
					await ctx.db.patch(memberUserDoc._id, {
						campaign_ids: memberUserDoc.campaign_ids.filter((cid) => cid !== args.id)
					});
				}
			})
		);

		await Promise.all(
			campaignDoc.characters.map(async (campaignCharacter) => {
				const characterDoc = await ctx.db.get(campaignCharacter.character_id);
				if (characterDoc) {
					await ctx.db.patch(campaignCharacter.character_id, {
						campaign_id: undefined,
						//! === COMPATABILITY ===
						/*
						 * Related git commit: 9653f7785d9d04738183743bb00d2ffeb31b4607
						 * DATE: 2026-05-06T08:49:54-04:00
						 * REASON: Older deployed code may still read campaign_id from the nested character payload.
						 * REPLACE WITH:
						 * Remove this character patch field.
						 */
						character: { ...characterDoc.character, campaign_id: undefined }
						//! === END ===
					});
				}
			})
		);

		const diceHistoryDoc = await ctx.db
			.query('dice_history')
			.withIndex('by_campaign_id', (q) => q.eq('campaign_id', args.id))
			.unique();
		if (diceHistoryDoc) {
			await ctx.db.delete(diceHistoryDoc._id);
		}

		const streamOverlays = await ctx.db
			.query('stream_overlays')
			.withIndex('by_campaign_id', (q) => q.eq('campaign_id', args.id))
			.take(100);
		await Promise.all(streamOverlays.map((overlay) => ctx.db.delete(overlay._id)));

		await ctx.db.delete(args.id);
	}
});

export const leave = mutation({
	args: { id: v.id('campaigns') },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const campaignDoc = await ctx.db.get(args.id);
		if (!campaignDoc) {
			throw new Error('Not a member of this campaign');
		}

		const membershipDoc = campaignDoc.members.find(
			(member) => member.clerk_id === identity.subject
		);

		if (!membershipDoc) {
			throw new Error('Not a member of this campaign');
		}

		if (membershipDoc.role === 'GM') {
			throw new Error('GM cannot leave the campaign. Delete it instead.');
		}

		const userCampaignCharacters = await Promise.all(
			campaignDoc.characters.map(async (campaignCharacter) => {
				const characterDoc = await ctx.db.get(campaignCharacter.character_id);
				if (!characterDoc || characterDoc.owner_clerk_id !== identity.subject) {
					return null;
				}

				return { campaignCharacter, characterDoc };
			})
		).then((characters) => characters.filter((character) => character !== null));

		await Promise.all(
			userCampaignCharacters.map(async ({ campaignCharacter, characterDoc }) => {
				await ctx.db.patch(campaignCharacter.character_id, {
					campaign_id: undefined,
					//! === COMPATABILITY ===
					/*
					 * Related git commit: 9653f7785d9d04738183743bb00d2ffeb31b4607
					 * Date: 2026-05-06T08:49:54-04:00
					 * Reason: Older deployed code may still read campaign_id from the nested character payload.
					 * Replace with:
					 * Remove this character patch field.
					 */
					character: { ...characterDoc.character, campaign_id: undefined }
					//! === END ===
				});
			})
		);

		await ctx.db.patch(args.id, {
			members: campaignDoc.members.filter((member) => member.clerk_id !== identity.subject),
			characters: campaignDoc.characters.filter(
				(character) =>
					!userCampaignCharacters.some(
						(userCampaignCharacter) =>
							userCampaignCharacter.campaignCharacter.character_id === character.character_id
					)
			)
		});

		const user = await ctx.db
			.query('users')
			.withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
			.unique();

		if (user) {
			await ctx.db.patch(user._id, {
				campaign_ids: user.campaign_ids.filter((cid) => cid !== args.id)
			});
		}
	}
});

export const join = mutation({
	args: { invite_code: v.string(), display_name: v.string() },
	handler: async (ctx, args): Promise<Id<'campaigns'>> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const campaignDoc = await ctx.db
			.query('campaigns')
			.withIndex('by_invite_code', (q) => q.eq('invite_code', args.invite_code))
			.unique();

		if (!campaignDoc) {
			throw new Error('Campaign not found');
		}

		const membershipDoc = campaignDoc.members.find(
			(member) => member.clerk_id === identity.subject
		);
		if (membershipDoc) {
			return campaignDoc._id;
		}

		await ctx.db.patch(campaignDoc._id, {
			members: [
				...campaignDoc.members,
				{
					clerk_id: identity.subject,
					display_name: args.display_name,
					role: 'Player'
				}
			]
		});

		const user = await ctx.db
			.query('users')
			.withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
			.unique();

		if (!user) {
			throw new Error('User not found');
		}

		await ctx.db.patch(user._id, {
			campaign_ids: user.campaign_ids.includes(campaignDoc._id)
				? user.campaign_ids
				: [...user.campaign_ids, campaignDoc._id]
		});

		return campaignDoc._id;
	}
});

export const rotateInviteCode = mutation({
	args: { campaign_id: v.id('campaigns') },
	handler: async (ctx, args): Promise<string> => {
		const access = await getCampaignAccess(ctx, args.campaign_id);
		if (!access || !access.isOwner) {
			throw new Error('Not authorized');
		}

		const code = generateInviteCode();
		await ctx.db.patch(args.campaign_id, { invite_code: code });

		return code;
	}
});

// ============ Campaign Character Management ==================

export const addCharacter = mutation({
	args: { campaign_id: v.id('campaigns'), character_id: v.id('characters') },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const campaignDoc = await ctx.db.get(args.campaign_id);
		if (!campaignDoc) {
			throw new Error('Not a member of this campaign');
		}

		const membershipDoc = campaignDoc.members.find(
			(member) => member.clerk_id === identity.subject
		);

		if (!membershipDoc) {
			throw new Error('Not a member of this campaign');
		}

		const characterDoc = await ctx.db.get(args.character_id);
		if (!characterDoc) {
			throw new Error('Character not found');
		}
		if (characterDoc.owner_clerk_id !== identity.subject) {
			throw new Error('You can only add characters you own');
		}

		if (
			//! === COMPATABILITY ===
			/*
			 * Related git commit: 9653f7785d9d04738183743bb00d2ffeb31b4607
			 * Date: 2026-05-06T08:49:54-04:00
			 * Reason: Older character rows may only track campaign membership in nested character.campaign_id.
			 * Replace with:
			 * Remove this characterDoc.character.campaign_id condition.
			 */
			characterDoc.character.campaign_id ||
			//! === END ===
			campaignDoc.characters.find((character) => character.character_id === args.character_id)
		) {
			throw new Error('Character is already in a campaign');
		}

		if (
			membershipDoc.role !== 'GM' &&
			campaignDoc.characters.some(
				(character) =>
					character.status === 'active' && character.claimed_by_clerk_id === identity.subject
			)
		) {
			throw new Error('You already have a claimed character in this campaign');
		}

		await ctx.db.patch(args.campaign_id, {
			characters: [
				...campaignDoc.characters,
				membershipDoc.role === 'GM'
					? {
							character_id: args.character_id,
							status: 'unclaimed'
						}
					: {
							character_id: args.character_id,
							status: 'active',
							claimed_by_clerk_id: identity.subject
						}
			]
		});

		await ctx.db.patch(args.character_id, {
			campaign_id: args.campaign_id,
			//! === COMPATABILITY ===
			/*
			 * Related git commit: 9653f7785d9d04738183743bb00d2ffeb31b4607
			 * Date: 2026-05-06T08:49:54-04:00
			 * Reason: Older deployed code may still read campaign_id from the nested character payload.
			 * Replace with:
			 * Remove this character patch field.
			 */
			character: { ...characterDoc.character, campaign_id: args.campaign_id }
			//! === END ===
		});
	}
});

export const removeCharacter = mutation({
	args: { campaign_id: v.id('campaigns'), character_id: v.id('characters') },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const campaignDoc = await ctx.db.get(args.campaign_id);
		if (!campaignDoc) {
			throw new Error('Not a member of this campaign');
		}

		const membershipDoc = campaignDoc.members.find(
			(member) => member.clerk_id === identity.subject
		);

		if (!membershipDoc) {
			throw new Error('Not a member of this campaign');
		}

		const campaignChar = campaignDoc.characters.find(
			(character) => character.character_id === args.character_id
		);
		if (!campaignChar) {
			throw new Error('Character is not in this campaign');
		}

		const characterDoc = await ctx.db.get(args.character_id);
		if (membershipDoc.role !== 'GM') {
			if (!characterDoc || characterDoc.owner_clerk_id !== identity.subject) {
				throw new Error('You can only remove characters you own');
			}
		}

		if (characterDoc) {
			await ctx.db.patch(args.character_id, {
				campaign_id: undefined,
				//! === COMPATABILITY ===
				/*
				 * Related git commit: 9653f7785d9d04738183743bb00d2ffeb31b4607
				 * Date: 2026-05-06T08:49:54-04:00
				 * Reason: Older deployed code may still read campaign_id from the nested character payload.
				 * Replace with:
				 * Remove this character patch field.
				 */
				character: { ...characterDoc.character, campaign_id: undefined }
				//! === END ===
			});
		}

		await ctx.db.patch(args.campaign_id, {
			characters: campaignDoc.characters.filter(
				(character) => character.character_id !== args.character_id
			)
		});
	}
});

export const claimCharacter = mutation({
	args: { campaign_id: v.id('campaigns'), character_id: v.id('characters') },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const campaignDoc = await ctx.db.get(args.campaign_id);
		if (!campaignDoc) {
			throw new Error('Not a member of this campaign');
		}

		const membershipDoc = campaignDoc.members.find(
			(member) => member.clerk_id === identity.subject
		);

		if (!membershipDoc) {
			throw new Error('Not a member of this campaign');
		}

		if (membershipDoc.role === 'GM') {
			throw new Error('GMs cannot claim characters');
		}

		if (
			campaignDoc.characters.some(
				(character) =>
					character.status === 'active' && character.claimed_by_clerk_id === identity.subject
			)
		) {
			throw new Error('You already have a claimed character in this campaign');
		}

		const campaignCharDoc = campaignDoc.characters.find(
			(character) => character.character_id === args.character_id
		);
		if (!campaignCharDoc) {
			throw new Error('Character is not in this campaign');
		}
		if (campaignCharDoc.status !== 'unclaimed') {
			throw new Error('Character is already claimed');
		}

		const characterDoc = await ctx.db.get(args.character_id);
		if (!characterDoc) {
			throw new Error('Character not found');
		}

		const isReclaimingOwnedCharacter = characterDoc.owner_clerk_id === identity.subject;

		if (!isReclaimingOwnedCharacter) {
			const claimingUserDoc = await ctx.db
				.query('users')
				.withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
				.unique();

			if (!claimingUserDoc) {
				throw new Error('User not found');
			}
			const characterCount = claimingUserDoc.character_count ?? 0;

			const entitlementsDoc = await ctx.db
				.query('user_entitlements')
				.withIndex('by_clerk_user_id', (q) => q.eq('clerk_user_id', identity.subject))
				.unique();
			const hasUnlimitedCharacters =
				entitlementsDoc?.feature_slugs.includes(UNLIMITED_CHARACTERS_FEATURE_SLUG) ?? false;

			if (!hasUnlimitedCharacters && characterCount >= CHARACTER_LIMIT) {
				throw new Error('Character limit reached');
			}

			const previousOwnerUserDoc = await ctx.db
				.query('users')
				.withIndex('by_clerk_id', (q) => q.eq('clerk_id', characterDoc.owner_clerk_id))
				.unique();

			if (previousOwnerUserDoc) {
				const prevCount = previousOwnerUserDoc.character_count ?? 0;
				await ctx.db.patch(previousOwnerUserDoc._id, {
					character_count: Math.max(0, prevCount - 1)
				});
			}

			await ctx.db.patch(args.character_id, {
				owner_clerk_id: identity.subject
			});
			await ctx.db.patch(claimingUserDoc._id, {
				character_count: characterCount + 1
			});
		}

		await ctx.db.patch(args.campaign_id, {
			characters: campaignDoc.characters.map((character) =>
				character.character_id === args.character_id
					? {
							character_id: args.character_id,
							status: 'active',
							claimed_by_clerk_id: identity.subject
						}
					: character
			)
		});
	}
});

export const unassignCharacter = mutation({
	args: { campaign_id: v.id('campaigns'), character_id: v.id('characters') },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const campaignDoc = await ctx.db.get(args.campaign_id);
		if (!campaignDoc) {
			throw new Error('Not a member of this campaign');
		}

		const membershipDoc = campaignDoc.members.find(
			(member) => member.clerk_id === identity.subject
		);

		if (!membershipDoc) {
			throw new Error('Not a member of this campaign');
		}
		if (membershipDoc.role === 'GM') {
			throw new Error('GMs cannot unassign characters');
		}

		const campaignChar = campaignDoc.characters.find(
			(character) => character.character_id === args.character_id
		);
		if (!campaignChar) {
			throw new Error('Character is not in this campaign');
		}

		if (campaignChar.claimed_by_clerk_id !== identity.subject || campaignChar.status !== 'active') {
			throw new Error('You can only unassign a character you have claimed');
		}

		await ctx.db.patch(args.campaign_id, {
			characters: campaignDoc.characters.map((character) =>
				character.character_id === args.character_id
					? {
							character_id: args.character_id,
							status: 'unclaimed'
						}
					: character
			)
		});
	}
});

// ============ Dice History ==================

export const getDiceHistory = query({
	args: { campaign_id: v.id('campaigns') },
	handler: async (ctx, args): Promise<DiceHistory | null> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Not authorized');
		}

		const campaignDoc = await ctx.db.get(args.campaign_id);
		if (
			!campaignDoc ||
			!campaignDoc.members.find((member) => member.clerk_id === identity.subject)
		) {
			throw new Error('Not authorized');
		}

		const diceHistoryDoc = await ctx.db
			.query('dice_history')
			.withIndex('by_campaign_id', (q) => q.eq('campaign_id', args.campaign_id))
			.unique();

		if (!diceHistoryDoc) {
			return { rolls: [] };
		}

		return diceHistoryDoc.history;
	}
});

export const updateDiceHistory = mutation({
	args: { campaign_id: v.id('campaigns'), history: zodToConvex(DiceHistorySchema) },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Not authorized');
		}

		const campaignDoc = await ctx.db.get(args.campaign_id);
		if (
			!campaignDoc ||
			!campaignDoc.members.find((member) => member.clerk_id === identity.subject)
		) {
			throw new Error('Not authorized');
		}

		const limitedHistory = { rolls: args.history.rolls.slice(-50) };

		const existing = await ctx.db
			.query('dice_history')
			.withIndex('by_campaign_id', (q) => q.eq('campaign_id', args.campaign_id))
			.unique();

		if (!existing) {
			throw new Error('Dice history not found for this campaign');
		}

		await ctx.db.patch(existing._id, { history: limitedHistory });
	}
});
