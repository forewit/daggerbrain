import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import type {
	BackgroundQuestionAnswer,
	ConnectionAnswer,
	CharacterSettings,
	DerivedDescriptors,
	CharacterInventory,
	LevelUpDomainCardIds,
	LevelUpChoices,
	DomainCardId,
	CharacterDescriptions
} from '../../types/character-types';
import type {
	CharacterModifier,
	DomainIds,
	Traits,
	WeaponModifier
} from '../../types/compendium-types';
import { CHARACTER_DEFAULTS } from '../../types/constants';
import { DomainIdsSchema } from '../../compendium/compendium-schemas';
import type { ConditionIds } from '$lib/types/rule-types';

export const characters_table = sqliteTable('characters_table', {
	// core
	id: text('id').primaryKey().default(crypto.randomUUID()),
	clerk_user_id: text('clerk_user_id').notNull(),
	name: text('name').notNull().default(CHARACTER_DEFAULTS.name),
	image_url: text('image_url').notNull().default(CHARACTER_DEFAULTS.image_url),
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
	community_card_id: text('community_card_id'),
	experiences: text('experiences', { mode: 'json' })
		.notNull()
		.default(CHARACTER_DEFAULTS.experiences)
		.$type<string[]>(),

	// classes
	primary_class_id: text('primary_class_id'),
	primary_subclass_id: text('primary_subclass_id'),
	secondary_class_id: text('secondary_class_id'),
	secondary_subclass_id: text('secondary_subclass_id'),
	secondary_class_domain_id_choice: text('secondary_class_domain_id_choice').$type<DomainIds>(),

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
		.$type<CharacterInventory>(),

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
	additional_character_modifiers: text('additional_character_modifiers', { mode: 'json' })
		.notNull()
		.default(CHARACTER_DEFAULTS.additional_character_modifiers)
		.$type<CharacterModifier[]>(),
	additional_weapon_modifiers: text('additional_weapon_modifiers', { mode: 'json' })
		.notNull()
		.default(CHARACTER_DEFAULTS.additional_weapon_modifiers)
		.$type<WeaponModifier[]>(),

	// ephemeral stats set by the player
	unarmed_attack_choices: text('unarmed_attack_choices', { mode: 'json' })
		.notNull()
		.default(CHARACTER_DEFAULTS.unarmed_attack_choices)
		.$type<Record<string, string[]>>(),
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
});

export const characters_table_schema = createSelectSchema(characters_table, {
	secondary_class_domain_id_choice: DomainIdsSchema.nullable()
});
export const characters_table_insert_schema = createInsertSchema(characters_table, {
	secondary_class_domain_id_choice: DomainIdsSchema.nullable()
});
export const characters_table_update_schema = createUpdateSchema(characters_table, {
	secondary_class_domain_id_choice: DomainIdsSchema.nullable()
});
