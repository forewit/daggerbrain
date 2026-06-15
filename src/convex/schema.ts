import { defineSchema, defineTable } from 'convex/server';
import { zodToConvex } from 'convex-helpers/server/zod4';
import { CharacterSchema } from './schemas/characters';
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
	PrimaryWeaponSchema,
	SecondaryWeaponSchema,
	SubclassSchema,
	TransformationCardSchema
} from './schemas/compendium';
import { EncounterSchema } from './schemas/encounters';
import { CampaignCharacterSchema, CampaignMemberSchema, CampaignSchema } from './schemas/campaigns';
import { SourceMetadataSchema } from './schemas/sources';
import { UserSchema } from './schemas/users';
import { DiceHistorySchema } from './schemas/dice';
import { v } from 'convex/values';
import { SourceKeySchema } from './schemas/rules';
import { CompendiumContentSchema } from './schemas/compendium';

export default defineSchema({
	//! === COMPATABILITY ===
	/*
	 * COMMIT: 010ab4a39a0ba591f01f442c07f95d8baed0af35
	 * DATE: 2026-05-06T08:50:26-04:00
	 * REASON: Official source data moved from the Convex sources table to local app build modules.
	 * REPLACE WITH:
	 * Remove the sources table and its SourceMetadataSchema/CompendiumContentSchema imports once deployments no longer need legacy source rows.
	 */
	sources: defineTable({
		...zodToConvex(SourceMetadataSchema).fields,
		compendium: zodToConvex(CompendiumContentSchema)
	}).index('by_source_key', ['source_key']),
	//! === END ===

	characters: defineTable({
		owner_clerk_id: v.string(),
		campaign_id: v.optional(v.id('campaigns')),
		character: zodToConvex(CharacterSchema)
	}).index('by_owner_clerk_id', ['owner_clerk_id']),

	encounters: defineTable({
		owner_clerk_id: v.string(),
		encounter: zodToConvex(EncounterSchema)
	}).index('by_owner_clerk_id', ['owner_clerk_id']),

	// ============ user tables ==================
	users: defineTable({
		clerk_id: v.string(),
		...zodToConvex(UserSchema).fields
	}).index('by_clerk_id', ['clerk_id']),

	user_unlocked_sources: defineTable({
		clerk_id: v.string(),
		unlocked_source_keys: v.array(zodToConvex(SourceKeySchema))
	}).index('by_clerk_id', ['clerk_id']),

	user_entitlements: defineTable({
		clerk_user_id: v.string(),
		feature_slugs: v.array(v.string()),
		synced_at: v.number()
	}).index('by_clerk_user_id', ['clerk_user_id']),

	// ============ campaign tables ==================
	campaigns: defineTable({
		invite_code: v.string(),
		campaign: zodToConvex(CampaignSchema),
		members: v.array(zodToConvex(CampaignMemberSchema)),
		characters: v.array(zodToConvex(CampaignCharacterSchema))
	}).index('by_invite_code', ['invite_code']),

	dice_history: defineTable({
		campaign_id: v.id('campaigns'),
		history: zodToConvex(DiceHistorySchema)
	}).index('by_campaign_id', ['campaign_id']),

	stream_overlays: defineTable({
		campaign_id: v.id('campaigns'),
		token: v.string(),
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
			fear: v.object({
				x: v.number(),
				y: v.number(),
				scale: v.number()
			}),
			countdowns: v.object({
				x: v.number(),
				y: v.number(),
				scale: v.number()
			})
		})
	})
		.index('by_campaign_id', ['campaign_id'])
		.index('by_token', ['token']),

	// ============ compendium tables ==================
	primary_weapons: defineTable({
		owner_clerk_id: v.string(),
		item: zodToConvex(PrimaryWeaponSchema)
	}).index('by_owner_clerk_id', ['owner_clerk_id']),
	secondary_weapons: defineTable({
		owner_clerk_id: v.string(),
		item: zodToConvex(SecondaryWeaponSchema)
	}).index('by_owner_clerk_id', ['owner_clerk_id']),
	armor: defineTable({
		owner_clerk_id: v.string(),
		item: zodToConvex(ArmorSchema)
	}).index('by_owner_clerk_id', ['owner_clerk_id']),
	loot: defineTable({
		owner_clerk_id: v.string(),
		item: zodToConvex(LootSchema)
	}).index('by_owner_clerk_id', ['owner_clerk_id']),
	consumables: defineTable({
		owner_clerk_id: v.string(),
		item: zodToConvex(ConsumableSchema)
	}).index('by_owner_clerk_id', ['owner_clerk_id']),
	beastforms: defineTable({
		owner_clerk_id: v.string(),
		item: zodToConvex(BeastformSchema)
	}).index('by_owner_clerk_id', ['owner_clerk_id']),
	classes: defineTable({
		owner_clerk_id: v.string(),
		item: zodToConvex(CharacterClassSchema)
	}).index('by_owner_clerk_id', ['owner_clerk_id']),
	subclasses: defineTable({
		owner_clerk_id: v.string(),
		item: zodToConvex(SubclassSchema)
	}).index('by_owner_clerk_id', ['owner_clerk_id']),
	domains: defineTable({
		owner_clerk_id: v.string(),
		item: zodToConvex(DomainSchema)
	}).index('by_owner_clerk_id', ['owner_clerk_id']),
	domain_cards: defineTable({
		owner_clerk_id: v.string(),
		item: zodToConvex(DomainCardSchema)
	}).index('by_owner_clerk_id', ['owner_clerk_id']),
	ancestry_cards: defineTable({
		owner_clerk_id: v.string(),
		item: zodToConvex(AncestryCardSchema)
	}).index('by_owner_clerk_id', ['owner_clerk_id']),
	community_cards: defineTable({
		owner_clerk_id: v.string(),
		item: zodToConvex(CommunityCardSchema)
	}).index('by_owner_clerk_id', ['owner_clerk_id']),
	transformation_cards: defineTable({
		owner_clerk_id: v.string(),
		item: zodToConvex(TransformationCardSchema)
	}).index('by_owner_clerk_id', ['owner_clerk_id']),
	adversaries: defineTable({
		owner_clerk_id: v.string(),
		item: zodToConvex(AdversarySchema)
	}).index('by_owner_clerk_id', ['owner_clerk_id']),
	environments: defineTable({
		owner_clerk_id: v.string(),
		item: zodToConvex(EnvironmentSchema)
	}).index('by_owner_clerk_id', ['owner_clerk_id'])
});
