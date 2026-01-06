import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import type {
	BackgroundQuestionAnswer,
	ConnectionAnswer,
	CharacterSettings,
	DerivedDescriptors,
	LevelUpDomainCardIds,
	LevelUpChoices,
	DomainCardId,
	CharacterDescriptions,
	Inventory,
	ChosenBeastform,
	Companion
} from '../../types/character-types';
import type { DomainIds, Traits } from '../../types/compendium-types';
import { CHARACTER_DEFAULTS } from '../../types/constants';
import {
	RangesSchema,
	DomainIdsSchema,
	TraitIdsSchema,
	DamageTypesSchema
} from '../../compendium/compendium-schemas';
import type { ConditionIds } from '$lib/types/rule-types';
import { z } from 'zod';

export const characters_table = sqliteTable(
	'characters_table',
	{
		// core
		id: text('id').primaryKey().default(crypto.randomUUID()),
		clerk_user_id: text('clerk_user_id').notNull(),
		name: text('name').notNull().default(CHARACTER_DEFAULTS.name),
		image_url: text('image_url').notNull().default(CHARACTER_DEFAULTS.image_url),
		campaign_id: text('campaign_id'),
		// Note: claimable status is now stored in campaign_characters_table
		settings: text('settings', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.settings)
			.$type<CharacterSettings>(),

		// derived
		derived_descriptors: text('derived_descriptors', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.derived_descriptors)
			.$type<DerivedDescriptors>(),

		// heritage
		ancestry_card_id: text('ancestry_card_id'),
		custom_top_ancestry: text('custom_top_ancestry'),
		custom_bottom_ancestry: text('custom_bottom_ancestry'),
		community_card_id: text('community_card_id'),
		experiences: text('experiences', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.experiences)
			.$type<string[]>(),

		// classes
		class_choices: text('class_choices', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.class_choices)
			.$type<Record<string, Record<string, string[]>>>(),
		primary_class_id: text('primary_class_id'),
		primary_subclass_id: text('primary_subclass_id'),
		secondary_class_id: text('secondary_class_id'),
		secondary_subclass_id: text('secondary_subclass_id'),
		secondary_class_domain_id_choice: text('secondary_class_domain_id_choice').$type<DomainIds>(),

		// beastforms
		chosen_beastform: text('chosen_beastform', { mode: 'json' })
			.default(CHARACTER_DEFAULTS.chosen_beastform)
			.$type<ChosenBeastform | null>(),
		companion: text('companion', { mode: 'json' })
			.default(CHARACTER_DEFAULTS.companion)
			.$type<Companion | null>(),

		// notes / descriptions
		background_question_answers: text('background_questions', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.background_question_answers)
			.$type<BackgroundQuestionAnswer[]>(),
		connection_answers: text('connections', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.connection_answers)
			.$type<ConnectionAnswer[]>(),
		character_descriptions: text('character_descriptions', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.character_descriptions)
			.$type<CharacterDescriptions>(),
		notes: text('notes').notNull().default(CHARACTER_DEFAULTS.notes),

		// equipment
		active_armor_id: text('active_armor_id'),
		active_primary_weapon_id: text('active_primary_weapon_id'),
		active_secondary_weapon_id: text('active_secondary_weapon_id'),
		inventory: text('inventory', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.inventory)
			.$type<Inventory>(),

		// the void / other
		active_conditions: text('active_conditions', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.active_conditions)
			.$type<ConditionIds[]>(),
		transformation_card_id: text('transformation_card_id'),
		additional_domain_card_ids: text('additional_domain_card_ids', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.additional_domain_card_ids)
			.$type<DomainCardId[]>(),
		additional_ancestry_card_ids: text('additional_ancestry_card_ids', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.additional_ancestry_card_ids)
			.$type<string[]>(),
		additional_community_card_ids: text('additional_community_card_ids', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.additional_community_card_ids)
			.$type<string[]>(),
		additional_transformation_card_ids: text('additional_transformation_card_ids', {
			mode: 'json'
		})
			.notNull()
			.default(CHARACTER_DEFAULTS.additional_transformation_card_ids)
			.$type<string[]>(),

		// ephemeral stats set by the player
		unarmed_attack_choices: text('unarmed_attack_choices', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.unarmed_attack_choices)
			.$type<Record<string, string[]>>(),
		ancestry_card_choices: text('ancestry_card_choices', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.ancestry_card_choices)
			.$type<Record<string, string[]>>(),
		community_card_tokens: integer('community_card_tokens')
			.notNull()
			.default(CHARACTER_DEFAULTS.community_card_tokens),
		domain_card_choices: text('domain_card_choices', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.domain_card_choices)
			.$type<Record<string, Record<string, string[]>>>(),
		domain_card_tokens: text('domain_card_tokens', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.domain_card_tokens)
			.$type<Record<string, number>>(),
		selected_traits: text('selected_traits', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.selected_traits)
			.$type<Traits>(),
		marked_hp: integer('marked_hp').notNull().default(CHARACTER_DEFAULTS.marked_hp),
		marked_stress: integer('marked_stress').notNull().default(CHARACTER_DEFAULTS.marked_stress),
		marked_hope: integer('marked_hope').notNull().default(CHARACTER_DEFAULTS.marked_hope),
		marked_armor: integer('marked_armor').notNull().default(CHARACTER_DEFAULTS.marked_armor),
		loadout_domain_card_ids: text('loadout_domain_card_ids', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.loadout_domain_card_ids)
			.$type<DomainCardId[]>(),
		bonus_max_loadout: integer('bonus_max_loadout')
			.notNull()
			.default(CHARACTER_DEFAULTS.bonus_max_loadout),

		// Level up choices
		level: integer('level').notNull().default(CHARACTER_DEFAULTS.level),
		level_up_domain_card_ids: text('level_up_domain_card_ids', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.level_up_domain_card_ids)
			.$type<LevelUpDomainCardIds>(),
		level_up_choices: text('level_up_choices', { mode: 'json' })
			.notNull()
			.default(CHARACTER_DEFAULTS.level_up_choices)
			.$type<LevelUpChoices>()
	},
	(table) => [
		index('characters_table_clerk_user_id_idx').on(table.clerk_user_id),
		index('characters_table_campaign_id_idx').on(table.campaign_id)
	]
);

export const ChosenBeastformSchema = z.object({
	apply_beastform_bonuses: z.boolean(),
	compendium_id: z.string(),
	choices: z.record(z.string(), z.array(z.string())),
	custom_title: z.string().nullable(),
	custom_level_requirement: z.number().nullable()
});

export const CompanionSchema = z.object({
	name: z.string(),
	image_url: z.string(),
	attack: z
		.object({
			name: z.string(),
			range: RangesSchema,
			damage_dice: z.string(),
			damage_bonus: z.number(),
			damage_type: DamageTypesSchema
		})
		.nullable(),
	max_stress: z.number(),
	marked_stress: z.number(),
	max_hope: z.number(),
	marked_hope: z.number(),
	evasion: z.number(),
	level_up_choices: z.array(z.string()),
	experiences: z.array(z.string()),
	experience_modifiers: z.array(z.number()),
	choices: z.record(z.string(), z.array(z.string()))
});

export const characters_table_schema = createSelectSchema(characters_table, {
	secondary_class_domain_id_choice: DomainIdsSchema.nullable(),
	chosen_beastform: ChosenBeastformSchema.nullable(),
	companion: CompanionSchema.nullable()
});
export const characters_table_insert_schema = createInsertSchema(characters_table, {
	secondary_class_domain_id_choice: DomainIdsSchema.nullable(),
	chosen_beastform: ChosenBeastformSchema.nullable(),
	companion: CompanionSchema.nullable()
});
// Base update schema - omits sensitive fields that should only be changed via specific commands
export const characters_table_update_schema = createUpdateSchema(characters_table, {
	secondary_class_domain_id_choice: DomainIdsSchema.nullable(),
	chosen_beastform: ChosenBeastformSchema.nullable(),
	companion: CompanionSchema.nullable()
}).omit({
	campaign_id: true,      // Only via assign_character_to_campaign
	clerk_user_id: true     // Immutable
	// Note: id is not omitted here because it's needed for WHERE clauses, but it won't be updated
	// Note: claimable status is now stored in campaign_characters_table
});
