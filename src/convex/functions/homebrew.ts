import { mutation, query } from '../_generated/server';
import type { CompendiumContentIds } from '../schemas/compendium';
import { getHomebrewAccess } from '../permissions';
import type { HomebrewAccess, HomebrewTable } from '../permissions';
import { v } from 'convex/values';
import { zodToConvex } from 'convex-helpers/server/zod4';
import {
	AdversarySchema,
	AncestryCardSchema,
	ArmorSchema,
	BeastformSchema,
	CharacterClassSchema,
	CommunityCardSchema,
	ConsumableSchema,
	DomainCardSchema,
	DomainSchema,
	EnvironmentSchema,
	LootSchema,
	SubclassSchema,
	TransformationCardSchema,
	PrimaryWeaponSchema,
	SecondaryWeaponSchema
} from '../schemas/compendium';
import { HOMEBREW_LIMIT, UNLIMITED_HOMEBREW_FEATURE_SLUG } from '../constants/entitlements';
import type { Id } from '../_generated/dataModel';
import { createEmptyCompendiumContentIds } from '../lib/characterCompendium';

function countHomebrewVault(vault: CompendiumContentIds): number {
	return Object.values(vault).reduce((total, ids) => total + ids.length, 0);
}

export const listIds = query({
	args: {},
	handler: async (ctx): Promise<CompendiumContentIds> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const userDoc = await ctx.db
			.query('users')
			.withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
			.unique();

		if (!userDoc) {
			return createEmptyCompendiumContentIds();
		}

		return userDoc.homebrew_vault;
	}
});

export const get = query({
	args: {
		id: v.union(
			v.id('primary_weapons'),
			v.id('secondary_weapons'),
			v.id('armor'),
			v.id('loot'),
			v.id('consumables'),
			v.id('beastforms'),
			v.id('classes'),
			v.id('subclasses'),
			v.id('domains'),
			v.id('domain_cards'),
			v.id('ancestry_cards'),
			v.id('community_cards'),
			v.id('transformation_cards'),
			v.id('adversaries'),
			v.id('environments')
		)
	},
	handler: async (ctx, args): Promise<HomebrewAccess<HomebrewTable> | null> => {
		return await getHomebrewAccess(ctx, args.id);
	}
});

export const add = mutation({
	args: {
		data: v.union(
			v.object({
				type: v.literal('primary_weapons'),
				item: zodToConvex(PrimaryWeaponSchema)
			}),
			v.object({
				type: v.literal('secondary_weapons'),
				item: zodToConvex(SecondaryWeaponSchema)
			}),
			v.object({
				type: v.literal('armor'),
				item: zodToConvex(ArmorSchema)
			}),
			v.object({
				type: v.literal('loot'),
				item: zodToConvex(LootSchema)
			}),
			v.object({
				type: v.literal('consumables'),
				item: zodToConvex(ConsumableSchema)
			}),
			v.object({
				type: v.literal('beastforms'),
				item: zodToConvex(BeastformSchema)
			}),
			v.object({
				type: v.literal('classes'),
				item: zodToConvex(CharacterClassSchema)
			}),
			v.object({
				type: v.literal('subclasses'),
				item: zodToConvex(SubclassSchema)
			}),
			v.object({
				type: v.literal('domains'),
				item: zodToConvex(DomainSchema)
			}),
			v.object({
				type: v.literal('domain_cards'),
				item: zodToConvex(DomainCardSchema)
			}),
			v.object({
				type: v.literal('ancestry_cards'),
				item: zodToConvex(AncestryCardSchema)
			}),
			v.object({
				type: v.literal('community_cards'),
				item: zodToConvex(CommunityCardSchema)
			}),
			v.object({
				type: v.literal('transformation_cards'),
				item: zodToConvex(TransformationCardSchema)
			}),
			v.object({
				type: v.literal('adversaries'),
				item: zodToConvex(AdversarySchema)
			}),
			v.object({
				type: v.literal('environments'),
				item: zodToConvex(EnvironmentSchema)
			})
		)
	},
	handler: async (ctx, args): Promise<Id<HomebrewTable>> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		// enforce homebrew limit
		const userDoc = await ctx.db
			.query('users')
			.withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
			.unique();

		if (!userDoc) {
			throw new Error('User not found');
		}
		const homebrewCount = countHomebrewVault(userDoc.homebrew_vault);
		const entitlementsDoc = await ctx.db
			.query('user_entitlements')
			.withIndex('by_clerk_user_id', (q) => q.eq('clerk_user_id', identity.subject))
			.unique();
		const hasUnlimitedHomebrew =
			entitlementsDoc?.feature_slugs.includes(UNLIMITED_HOMEBREW_FEATURE_SLUG) ?? false;

		if (!hasUnlimitedHomebrew && homebrewCount >= HOMEBREW_LIMIT) {
			throw new Error('Homebrew limit reached');
		}

		const { data } = args;
		const owner_clerk_id = identity.subject;

		let homebrewId;
		switch (data.type) {
			case 'primary_weapons':
				homebrewId = await ctx.db.insert('primary_weapons', {
					owner_clerk_id,
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'secondary_weapons':
				homebrewId = await ctx.db.insert('secondary_weapons', {
					owner_clerk_id,
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'armor':
				homebrewId = await ctx.db.insert('armor', {
					owner_clerk_id,
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'loot':
				homebrewId = await ctx.db.insert('loot', {
					owner_clerk_id,
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'consumables':
				homebrewId = await ctx.db.insert('consumables', {
					owner_clerk_id,
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'beastforms':
				homebrewId = await ctx.db.insert('beastforms', {
					owner_clerk_id,
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'classes':
				homebrewId = await ctx.db.insert('classes', {
					owner_clerk_id,
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'subclasses':
				homebrewId = await ctx.db.insert('subclasses', {
					owner_clerk_id,
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'domains':
				homebrewId = await ctx.db.insert('domains', {
					owner_clerk_id,
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'domain_cards':
				homebrewId = await ctx.db.insert('domain_cards', {
					owner_clerk_id,
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'ancestry_cards':
				homebrewId = await ctx.db.insert('ancestry_cards', {
					owner_clerk_id,
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'community_cards':
				homebrewId = await ctx.db.insert('community_cards', {
					owner_clerk_id,
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'transformation_cards':
				homebrewId = await ctx.db.insert('transformation_cards', {
					owner_clerk_id,
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'adversaries':
				homebrewId = await ctx.db.insert('adversaries', {
					owner_clerk_id,
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'environments':
				homebrewId = await ctx.db.insert('environments', {
					owner_clerk_id,
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
		}

		const currentTypeIds = userDoc.homebrew_vault[data.type] as string[];
		const updatedVault: CompendiumContentIds = {
			...userDoc.homebrew_vault,
			[data.type]: [...currentTypeIds, homebrewId as string]
		} as CompendiumContentIds;

		// increment homebrew count and keep user's homebrew vault in sync
		await ctx.db.patch(userDoc._id, {
			homebrew_count: countHomebrewVault(updatedVault),
			homebrew_vault: updatedVault
		});

		return homebrewId;
	}
});

export const update = mutation({
	args: {
		data: v.union(
			v.object({
				type: v.literal('primary_weapons'),
				id: v.id('primary_weapons'),
				item: zodToConvex(PrimaryWeaponSchema)
			}),
			v.object({
				type: v.literal('secondary_weapons'),
				id: v.id('secondary_weapons'),
				item: zodToConvex(SecondaryWeaponSchema)
			}),
			v.object({
				type: v.literal('armor'),
				id: v.id('armor'),
				item: zodToConvex(ArmorSchema)
			}),
			v.object({
				type: v.literal('loot'),
				id: v.id('loot'),
				item: zodToConvex(LootSchema)
			}),
			v.object({
				type: v.literal('consumables'),
				id: v.id('consumables'),
				item: zodToConvex(ConsumableSchema)
			}),
			v.object({
				type: v.literal('beastforms'),
				id: v.id('beastforms'),
				item: zodToConvex(BeastformSchema)
			}),
			v.object({
				type: v.literal('classes'),
				id: v.id('classes'),
				item: zodToConvex(CharacterClassSchema)
			}),
			v.object({
				type: v.literal('subclasses'),
				id: v.id('subclasses'),
				item: zodToConvex(SubclassSchema)
			}),
			v.object({
				type: v.literal('domains'),
				id: v.id('domains'),
				item: zodToConvex(DomainSchema)
			}),
			v.object({
				type: v.literal('domain_cards'),
				id: v.id('domain_cards'),
				item: zodToConvex(DomainCardSchema)
			}),
			v.object({
				type: v.literal('ancestry_cards'),
				id: v.id('ancestry_cards'),
				item: zodToConvex(AncestryCardSchema)
			}),
			v.object({
				type: v.literal('community_cards'),
				id: v.id('community_cards'),
				item: zodToConvex(CommunityCardSchema)
			}),
			v.object({
				type: v.literal('transformation_cards'),
				id: v.id('transformation_cards'),
				item: zodToConvex(TransformationCardSchema)
			}),
			v.object({
				type: v.literal('adversaries'),
				id: v.id('adversaries'),
				item: zodToConvex(AdversarySchema)
			}),
			v.object({
				type: v.literal('environments'),
				id: v.id('environments'),
				item: zodToConvex(EnvironmentSchema)
			})
		)
	},
	handler: async (ctx, args) => {
		const access = await getHomebrewAccess(ctx, args.data.id);
		if (!access || !access.canEdit) {
			throw new Error('Not authorized');
		}

		const { data } = args;
		switch (data.type) {
			case 'primary_weapons':
				await ctx.db.patch(data.id, {
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'secondary_weapons':
				await ctx.db.patch(data.id, {
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'armor':
				await ctx.db.patch(data.id, { item: { ...data.item, source_key: 'Homebrew' } });
				break;
			case 'loot':
				await ctx.db.patch(data.id, { item: { ...data.item, source_key: 'Homebrew' } });
				break;
			case 'consumables':
				await ctx.db.patch(data.id, {
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'beastforms':
				await ctx.db.patch(data.id, {
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'classes':
				await ctx.db.patch(data.id, { item: { ...data.item, source_key: 'Homebrew' } });
				break;
			case 'subclasses':
				await ctx.db.patch(data.id, {
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'domains':
				await ctx.db.patch(data.id, { item: { ...data.item, source_key: 'Homebrew' } });
				break;
			case 'domain_cards':
				await ctx.db.patch(data.id, {
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'ancestry_cards':
				await ctx.db.patch(data.id, {
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'community_cards':
				await ctx.db.patch(data.id, {
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'transformation_cards':
				await ctx.db.patch(data.id, {
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'adversaries':
				await ctx.db.patch(data.id, {
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
			case 'environments':
				await ctx.db.patch(data.id, {
					item: { ...data.item, source_key: 'Homebrew' }
				});
				break;
		}
	}
});

export const remove = mutation({
	args: {
		id: v.union(
			v.id('primary_weapons'),
			v.id('secondary_weapons'),
			v.id('armor'),
			v.id('loot'),
			v.id('consumables'),
			v.id('beastforms'),
			v.id('classes'),
			v.id('subclasses'),
			v.id('domains'),
			v.id('domain_cards'),
			v.id('ancestry_cards'),
			v.id('community_cards'),
			v.id('transformation_cards'),
			v.id('adversaries'),
			v.id('environments')
		)
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Unauthenticated');
		}

		const access = await getHomebrewAccess(ctx, args.id);
		if (!access || !access.isOwner) {
			throw new Error('Not authorized');
		}

		await ctx.db.delete(args.id);

		// decrement homebrew count for user
		const user = await ctx.db
			.query('users')
			.withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
			.unique();

		if (!user) {
			throw new Error('User not found');
		}

		const updatedVault: CompendiumContentIds = {
			primary_weapons: user.homebrew_vault.primary_weapons.filter((itemId) => itemId !== args.id),
			secondary_weapons: user.homebrew_vault.secondary_weapons.filter(
				(itemId) => itemId !== args.id
			),
			armor: user.homebrew_vault.armor.filter((itemId) => itemId !== args.id),
			loot: user.homebrew_vault.loot.filter((itemId) => itemId !== args.id),
			consumables: user.homebrew_vault.consumables.filter((itemId) => itemId !== args.id),
			beastforms: user.homebrew_vault.beastforms.filter((itemId) => itemId !== args.id),
			classes: user.homebrew_vault.classes.filter((itemId) => itemId !== args.id),
			subclasses: user.homebrew_vault.subclasses.filter((itemId) => itemId !== args.id),
			domains: user.homebrew_vault.domains.filter((itemId) => itemId !== args.id),
			domain_cards: user.homebrew_vault.domain_cards.filter((itemId) => itemId !== args.id),
			ancestry_cards: user.homebrew_vault.ancestry_cards.filter((itemId) => itemId !== args.id),
			community_cards: user.homebrew_vault.community_cards.filter((itemId) => itemId !== args.id),
			transformation_cards: user.homebrew_vault.transformation_cards.filter(
				(itemId) => itemId !== args.id
			),
			adversaries: user.homebrew_vault.adversaries.filter((itemId) => itemId !== args.id),
			environments: user.homebrew_vault.environments.filter((itemId) => itemId !== args.id)
		};

		await ctx.db.patch(user._id, {
			homebrew_count: countHomebrewVault(updatedVault),
			homebrew_vault: updatedVault
		});
	}
});
