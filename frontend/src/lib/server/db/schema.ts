import { sql } from 'drizzle-orm';
import {
	integer,
	primaryKey,
	sqliteTable,
	text
} from 'drizzle-orm/sqlite-core';

const unixTimestamp = () => integer({ mode: 'number' }).notNull().default(sql`(unixepoch())`);

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	email: text('email'),
	displayName: text('display_name'),
	imageUrl: text('image_url'),
	createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`)
});

export const characters = sqliteTable('characters', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	imageUrl: text('image_url').notNull(),
	level: integer('level', { mode: 'number' }).notNull().default(1),
	settingsJson: text('settings_json').notNull(),
	derivedDescriptorsJson: text('derived_descriptors_json').notNull(),
	ephemeralStatsJson: text('ephemeral_stats_json').notNull(),
	createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`)
});

export const characterTraits = sqliteTable('character_traits', {
	characterId: text('character_id')
		.primaryKey()
		.references(() => characters.id, { onDelete: 'cascade' }),
	agility: integer('agility', { mode: 'number' }),
	strength: integer('strength', { mode: 'number' }),
	finesse: integer('finesse', { mode: 'number' }),
	instinct: integer('instinct', { mode: 'number' }),
	presence: integer('presence', { mode: 'number' }),
	knowledge: integer('knowledge', { mode: 'number' })
});

export const characterHeritage = sqliteTable('character_heritage', {
	characterId: text('character_id')
		.primaryKey()
		.references(() => characters.id, { onDelete: 'cascade' }),
	ancestryCardId: text('ancestry_card_id'),
	communityCardId: text('community_card_id'),
	transformationCardId: text('transformation_card_id'),
	experiencesJson: text('experiences_json').notNull()
});

export const characterClasses = sqliteTable('character_classes', {
	characterId: text('character_id')
		.primaryKey()
		.references(() => characters.id, { onDelete: 'cascade' }),
	primaryClassId: text('primary_class_id'),
	primarySubclassId: text('primary_subclass_id'),
	secondaryClassId: text('secondary_class_id'),
	secondarySubclassId: text('secondary_subclass_id'),
	secondaryClassDomainChoice: text('secondary_class_domain_choice')
});

export const characterChoices = sqliteTable('character_choices', {
	characterId: text('character_id')
		.primaryKey()
		.references(() => characters.id, { onDelete: 'cascade' }),
	backgroundQuestionsJson: text('background_questions_json').notNull(),
	connectionsJson: text('connections_json').notNull(),
	classChoicesJson: text('class_choices_json').notNull()
});

export const characterInventory = sqliteTable('character_inventory', {
	characterId: text('character_id')
		.primaryKey()
		.references(() => characters.id, { onDelete: 'cascade' }),
	armorId: text('armor_id'),
	primaryWeaponId: text('primary_weapon_id'),
	secondaryWeaponId: text('secondary_weapon_id'),
	inventoryJson: text('inventory_json').notNull(),
	additionalDomainCardIdsJson: text('additional_domain_card_ids_json').notNull(),
	additionalCharacterModsJson: text('additional_character_mods_json').notNull(),
	additionalWeaponModsJson: text('additional_weapon_mods_json').notNull()
});

export const characterDomainTracking = sqliteTable('character_domain_tracking', {
	characterId: text('character_id')
		.primaryKey()
		.references(() => characters.id, { onDelete: 'cascade' }),
	domainCardChoicesJson: text('domain_card_choices_json').notNull(),
	domainCardTokensJson: text('domain_card_tokens_json').notNull(),
	loadoutDomainCardIdsJson: text('loadout_domain_card_ids_json').notNull()
});

export const characterLevelProgress = sqliteTable('character_level_progress', {
	characterId: text('character_id')
		.primaryKey()
		.references(() => characters.id, { onDelete: 'cascade' }),
	level: integer('level', { mode: 'number' }).notNull().default(1),
	domainCardIdsJson: text('domain_card_ids_json').notNull(),
	levelUpChoicesJson: text('level_up_choices_json').notNull()
});

export const characterAuditLog = sqliteTable('character_audit_log', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	characterId: text('character_id')
		.notNull()
		.references(() => characters.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	action: text('action').notNull(),
	payloadHash: text('payload_hash'),
	payloadJson: text('payload_json'),
	createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`)
});

export const classes = sqliteTable('classes', {
	id: text('id').primaryKey(),
	sourceId: text('source_id').notNull(),
	name: text('name').notNull(),
	imageUrl: text('image_url').notNull(),
	descriptionHtml: text('description_html').notNull(),
	startingEvasion: integer('starting_evasion', { mode: 'number' }).notNull(),
	startingMaxHp: integer('starting_max_hp', { mode: 'number' }).notNull(),
	hopeFeatureJson: text('hope_feature_json').notNull(),
	primaryDomainId: text('primary_domain_id').notNull(),
	secondaryDomainId: text('secondary_domain_id').notNull(),
	classFeaturesJson: text('class_features_json').notNull(),
	subclassesJson: text('subclasses_json').notNull(),
	suggestedTraitsJson: text('suggested_traits_json').notNull(),
	suggestedPrimaryWeaponId: text('suggested_primary_weapon_id'),
	suggestedSecondaryWeaponId: text('suggested_secondary_weapon_id'),
	suggestedArmorId: text('suggested_armor_id'),
	startingInventoryJson: text('starting_inventory_json').notNull(),
	backgroundQuestionsJson: text('background_questions_json').notNull(),
	connectionsJson: text('connections_json').notNull(),
	createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`)
});

export const classSubclasses = sqliteTable('class_subclasses', {
	id: text('id').primaryKey(),
	classId: text('class_id')
		.notNull()
		.references(() => classes.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	descriptionHtml: text('description_html').notNull(),
	foundationCardJson: text('foundation_card_json').notNull(),
	specializationCardJson: text('specialization_card_json').notNull(),
	masteryCardJson: text('mastery_card_json').notNull(),
	createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`)
});

export const domains = sqliteTable('domains', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	descriptionHtml: text('description_html').notNull(),
	color: text('color').notNull(),
	foregroundColor: text('foreground_color').notNull(),
	createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`)
});

export const domainCards = sqliteTable('domain_cards', {
	id: text('id').primaryKey(),
	domainId: text('domain_id')
		.notNull()
		.references(() => domains.id, { onDelete: 'cascade' }),
	cardType: text('card_type').notNull(),
	imageUrl: text('image_url').notNull(),
	title: text('title').notNull(),
	descriptionHtml: text('description_html').notNull(),
	artistName: text('artist_name'),
	featuresJson: text('features_json').notNull(),
	levelRequirement: integer('level_requirement', { mode: 'number' }).notNull(),
	recallCost: integer('recall_cost', { mode: 'number' }).notNull(),
	domainCardType: text('domain_card_type').notNull(),
	choicesJson: text('choices_json').notNull(),
	tokens: integer('tokens', { mode: 'number' }).notNull().default(0),
	appliesInVault: integer('applies_in_vault', { mode: 'boolean' }).notNull().default(false),
	forcedInLoadout: integer('forced_in_loadout', { mode: 'boolean' }).notNull().default(false),
	forcedInVault: integer('forced_in_vault', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`)
});

export const ancestryCards = sqliteTable('ancestry_cards', {
	id: text('id').primaryKey(),
	imageUrl: text('image_url').notNull(),
	title: text('title').notNull(),
	descriptionHtml: text('description_html').notNull(),
	artistName: text('artist_name'),
	featuresJson: text('features_json').notNull(),
	createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`)
});

export const communityCards = sqliteTable('community_cards', {
	id: text('id').primaryKey(),
	imageUrl: text('image_url').notNull(),
	title: text('title').notNull(),
	descriptionHtml: text('description_html').notNull(),
	artistName: text('artist_name'),
	featuresJson: text('features_json').notNull(),
	createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`)
});

export const transformationCards = sqliteTable('transformation_cards', {
	id: text('id').primaryKey(),
	imageUrl: text('image_url').notNull(),
	title: text('title').notNull(),
	descriptionHtml: text('description_html').notNull(),
	artistName: text('artist_name'),
	featuresJson: text('features_json').notNull(),
	createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`)
});

export const weapons = sqliteTable('weapons', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	descriptionHtml: text('description_html').notNull(),
	levelRequirement: integer('level_requirement', { mode: 'number' }).notNull(),
	category: text('category').notNull(),
	availableTraitsJson: text('available_traits_json').notNull(),
	range: text('range').notNull(),
	featuresJson: text('features_json').notNull(),
	attackRollBonus: integer('attack_roll_bonus', { mode: 'number' }).notNull(),
	damageBonus: integer('damage_bonus', { mode: 'number' }).notNull(),
	damageDice: text('damage_dice').notNull(),
	availableDamageTypesJson: text('available_damage_types_json').notNull(),
	burden: integer('burden', { mode: 'number' }).notNull(),
	createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`)
});

export const armor = sqliteTable('armor', {
	id: text('id').primaryKey(),
	levelRequirement: integer('level_requirement', { mode: 'number' }).notNull(),
	title: text('title').notNull(),
	descriptionHtml: text('description_html').notNull(),
	maxArmor: integer('max_armor', { mode: 'number' }).notNull(),
	damageThresholdsJson: text('damage_thresholds_json').notNull(),
	featuresJson: text('features_json').notNull(),
	createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`)
});

export const loot = sqliteTable('loot', {
	id: text('id').primaryKey(),
	rarityRoll: integer('rarity_roll', { mode: 'number' }).notNull(),
	title: text('title').notNull(),
	descriptionHtml: text('description_html').notNull(),
	characterModifiersJson: text('character_modifiers_json').notNull(),
	weaponModifiersJson: text('weapon_modifiers_json').notNull(),
	createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`)
});

export const consumables = sqliteTable('consumables', {
	id: text('id').primaryKey(),
	rarityRoll: integer('rarity_roll', { mode: 'number' }).notNull(),
	title: text('title').notNull(),
	descriptionHtml: text('description_html').notNull(),
	createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`)
});

