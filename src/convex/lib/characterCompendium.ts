import type { Doc, Id } from '../_generated/dataModel';
import type { QueryCtx } from '../_generated/server';
import type { CharacterCompendiumScope } from '../schemas/characters';
import type { CompendiumContentIds } from '../schemas/compendium';
import type { SourceKey } from '../schemas/rules';
import type { CharacterAccessDetails } from '../permissions';

export function createEmptyCompendiumContentIds(): CompendiumContentIds {
	return {
		primary_weapons: [],
		secondary_weapons: [],
		armor: [],
		loot: [],
		consumables: [],
		beastforms: [],
		classes: [],
		subclasses: [],
		domains: [],
		domain_cards: [],
		ancestry_cards: [],
		community_cards: [],
		transformation_cards: [],
		adversaries: [],
		environments: []
	};
}

async function getOwnerSourceKeys(ctx: QueryCtx, ownerClerkId: string): Promise<SourceKey[]> {
	const userUnlockedSourcesDoc = await ctx.db
		.query('user_unlocked_sources')
		.withIndex('by_clerk_id', (q) => q.eq('clerk_id', ownerClerkId))
		.unique();

	return userUnlockedSourcesDoc?.unlocked_source_keys ?? [];
}

async function getOwnerHomebrewVault(
	ctx: QueryCtx,
	ownerClerkId: string
): Promise<CompendiumContentIds> {
	const userDoc = await ctx.db
		.query('users')
		.withIndex('by_clerk_id', (q) => q.eq('clerk_id', ownerClerkId))
		.unique();

	return userDoc?.homebrew_vault ?? createEmptyCompendiumContentIds();
}

async function getCampaignVault(
	ctx: QueryCtx,
	campaignId: Id<'campaigns'> | null,
	campaignDoc?: Doc<'campaigns'> | null
): Promise<CompendiumContentIds> {
	if (!campaignId) {
		return createEmptyCompendiumContentIds();
	}

	const doc = campaignDoc ?? (await ctx.db.get(campaignId));
	return doc?.campaign.homebrew_vault ?? createEmptyCompendiumContentIds();
}

type CharacterScopeAccess = CharacterAccessDetails & {
	campaignDoc?: Doc<'campaigns'> | null;
};

async function getCharacterScopeAccess(
	ctx: QueryCtx,
	characterId: Id<'characters'>
): Promise<CharacterScopeAccess | null> {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) return null;

	const characterDoc = await ctx.db.get(characterId);
	if (!characterDoc) return null;

	//! === COMPATABILITY ===
	/*
	 * Related git commit: 9653f7785d9d04738183743bb00d2ffeb31b4607
	 * DATE: 2026-05-06T08:49:54-04:00
	 * REASON: Older character rows may only have campaign_id nested inside the character payload.
	 * REPLACE WITH:
	 * const campaignId = characterDoc.campaign_id;
	 */
	const campaignId = characterDoc.campaign_id ?? characterDoc.character.campaign_id;
	//! === END ===

	if (characterDoc.owner_clerk_id === identity.subject) {
		return {
			character: { ...characterDoc.character, campaign_id: campaignId },
			canEdit: true,
			isOwner: true,
			owner_clerk_id: characterDoc.owner_clerk_id
		};
	}

	if (!campaignId) return null;

	const campaignDoc = await ctx.db.get(campaignId);
	if (!campaignDoc) return null;

	const member = campaignDoc.members.find(
		(campaignMember) => campaignMember.clerk_id === identity.subject
	);
	if (!member) return null;

	return {
		character: { ...characterDoc.character, campaign_id: campaignId },
		canEdit: member.role === 'GM',
		isOwner: false,
		owner_clerk_id: characterDoc.owner_clerk_id,
		campaignDoc
	};
}

export async function getCharacterCompendiumScopeFromAccess(
	ctx: QueryCtx,
	access: CharacterScopeAccess
): Promise<CharacterCompendiumScope> {
	const campaignId = access.character.campaign_id ?? null;
	const [sourceKeys, homebrewVault, campaignVault] = await Promise.all([
		getOwnerSourceKeys(ctx, access.owner_clerk_id),
		getOwnerHomebrewVault(ctx, access.owner_clerk_id),
		getCampaignVault(ctx, campaignId, access.campaignDoc)
	]);

	return {
		source_keys: sourceKeys,
		homebrew_vault: homebrewVault,
		campaign_id: campaignId,
		campaign_vault: campaignVault
	};
}

export async function getCharacterCompendiumScopeForView(
	ctx: QueryCtx,
	characterId: Id<'characters'>
): Promise<CharacterCompendiumScope | null> {
	const access = await getCharacterScopeAccess(ctx, characterId);
	if (!access) return null;

	return await getCharacterCompendiumScopeFromAccess(ctx, access);
}
