import type { QueryCtx, MutationCtx } from './_generated/server';
import type { Id } from './_generated/dataModel';
import type { Campaign, CampaignCharacter, CampaignMember } from './schemas/campaigns';
import type { Character } from './schemas/characters';
import type { Encounter } from './schemas/encounters';
import type {
	Adversary,
	AncestryCard,
	Armor,
	Beastform,
	CharacterClass,
	CommunityCard,
	Consumable,
	Domain,
	DomainCard,
	Environment,
	Loot,
	Subclass,
	TransformationCard,
	PrimaryWeapon,
	SecondaryWeapon
} from './schemas/compendium';

export type CampaignAccess = {
	campaign_id: Id<'campaigns'>;
	invite_code: string;
	campaign: Campaign;
	members: CampaignMember[];
	characters: CampaignCharacter[];
	isOwner: boolean;
};

export type CharacterAccess = {
	character: Character;
	canEdit: boolean;
	isOwner: boolean;
};

export type CharacterAccessDetails = CharacterAccess & {
	owner_clerk_id: string;
};

export type HomebrewTable =
	| 'primary_weapons'
	| 'secondary_weapons'
	| 'armor'
	| 'loot'
	| 'consumables'
	| 'beastforms'
	| 'classes'
	| 'subclasses'
	| 'domains'
	| 'domain_cards'
	| 'ancestry_cards'
	| 'community_cards'
	| 'transformation_cards'
	| 'adversaries'
	| 'environments';

export type HomebrewItem<T extends HomebrewTable> = T extends 'primary_weapons'
	? PrimaryWeapon
	: T extends 'secondary_weapons'
		? SecondaryWeapon
		: T extends 'armor'
			? Armor
			: T extends 'loot'
				? Loot
				: T extends 'consumables'
					? Consumable
					: T extends 'beastforms'
						? Beastform
						: T extends 'classes'
							? CharacterClass
							: T extends 'subclasses'
								? Subclass
								: T extends 'domains'
									? Domain
									: T extends 'domain_cards'
										? DomainCard
										: T extends 'ancestry_cards'
											? AncestryCard
											: T extends 'community_cards'
												? CommunityCard
												: T extends 'transformation_cards'
													? TransformationCard
													: T extends 'adversaries'
														? Adversary
														: T extends 'environments'
															? Environment
															: never;

export type HomebrewAccess<T extends HomebrewTable> = {
	item: HomebrewItem<T>;
	canEdit: boolean;
	isOwner: boolean;
};

export type EncounterAccess = {
	encounter: Encounter;
	isOwner: boolean;
};

type Ctx = QueryCtx | MutationCtx;

export async function getCampaignAccess(
	ctx: Ctx,
	campaignId: Id<'campaigns'>
): Promise<CampaignAccess | null> {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) return null;

	const campaignDoc = await ctx.db.get(campaignId);
	if (!campaignDoc) return null;

	const member = campaignDoc.members.find(
		(campaignMember) => campaignMember.clerk_id === identity.subject
	);
	if (!member) return null;

	// user is a member of the campaign
	return {
		campaign_id: campaignDoc._id,
		invite_code: campaignDoc.invite_code,
		campaign: campaignDoc.campaign,
		members: campaignDoc.members,
		characters: campaignDoc.characters,
		isOwner: member.role === 'GM'
	};
}

export async function getCharacterAccessDetails(
	ctx: Ctx,
	characterId: Id<'characters'>
): Promise<CharacterAccessDetails | null> {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) return null;

	const characterDoc = await ctx.db.get(characterId);
	if (!characterDoc) return null;

	// user owns the character
	if (characterDoc.owner_clerk_id === identity.subject) {
		//! === COMPATABILITY ===
		/*
		 * COMMIT: 9653f7785d9d04738183743bb00d2ffeb31b4607
		 * DATE: 2026-05-06T08:49:54-04:00
		 * REASON: Older character rows may only have campaign_id nested inside the character payload.
		 * REPLACE WITH:
		 * const campaign_id = characterDoc.campaign_id;
		 */
		const campaign_id = characterDoc.campaign_id ?? characterDoc.character.campaign_id;
		//! === END ===
		return {
			character: { ...characterDoc.character, campaign_id },
			canEdit: true,
			isOwner: true,
			owner_clerk_id: characterDoc.owner_clerk_id
		};
	}

	//! === COMPATABILITY ===
	/*
	 * Related git commit: 9653f7785d9d04738183743bb00d2ffeb31b4607
	 * Date: 2026-05-06T08:49:54-04:00
	 * Reason: Older character rows may only have campaign_id nested inside the character payload.
	 * Replace with:
	 * const campaign_id = characterDoc.campaign_id;
	 */
	const campaign_id = characterDoc.campaign_id ?? characterDoc.character.campaign_id;
	//! === END ===
	if (!campaign_id) return null;

	const campaignDoc = await ctx.db.get(campaign_id);
	if (!campaignDoc) return null;

	const member = campaignDoc.members.find(
		(campaignMember) => campaignMember.clerk_id === identity.subject
	);
	if (!member) return null;

	// user is a member of a campaign with this character
	return {
		character: { ...characterDoc.character, campaign_id },
		canEdit: member.role === 'GM',
		isOwner: false,
		owner_clerk_id: characterDoc.owner_clerk_id
	};
}

export async function getCharacterAccess(
	ctx: Ctx,
	characterId: Id<'characters'>
): Promise<CharacterAccess | null> {
	const access = await getCharacterAccessDetails(ctx, characterId);
	if (!access) return null;

	return {
		character: access.character,
		canEdit: access.canEdit,
		isOwner: access.isOwner
	};
}

export async function getEncounterAccess(
	ctx: Ctx,
	encounterId: Id<'encounters'>
): Promise<EncounterAccess | null> {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) return null;

	const encounterDoc = await ctx.db.get(encounterId);
	if (!encounterDoc) return null;

	if (encounterDoc.owner_clerk_id !== identity.subject) return null;

	return {
		encounter: encounterDoc.encounter,
		isOwner: true
	};
}

export async function getHomebrewAccess<T extends HomebrewTable>(
	ctx: Ctx,
	itemId: Id<T>
): Promise<HomebrewAccess<T> | null> {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) return null;

	const itemDoc = await ctx.db.get(itemId);
	if (!itemDoc) return null;

	const ownerClerkId = itemDoc.owner_clerk_id;

	// Owner has full edit access
	if (ownerClerkId === identity.subject) {
		return {
			item: itemDoc.item as HomebrewItem<T>,
			canEdit: true,
			isOwner: true
		};
	}

	// Other campaign members have view-only access
	const owner_campaign_ids = await ctx.db
		.query('users')
		.withIndex('by_clerk_id', (q) => q.eq('clerk_id', ownerClerkId))
		.unique()
		.then((userDoc) => userDoc?.campaign_ids || []);

	const user_campaign_ids = await ctx.db
		.query('users')
		.withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
		.unique()
		.then((userDoc) => userDoc?.campaign_ids || []);

	if (owner_campaign_ids.some((id) => user_campaign_ids.includes(id))) {
		return {
			item: itemDoc.item as HomebrewItem<T>,
			canEdit: false,
			isOwner: false
		};
	}

	return null;
}
