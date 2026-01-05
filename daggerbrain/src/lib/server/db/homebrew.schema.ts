import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import type {
	CharacterClass,
	Subclass,
	Domain,
	DomainCard,
	Weapon,
	Armor,
	Loot,
	Consumable,
	AncestryCard,
	CommunityCard,
	TransformationCard,
	Beastform
} from '../../types/compendium-types';

// ============================================================================
// Classes
// ============================================================================

export const homebrew_classes = sqliteTable(
	'homebrew_classes',
	{
		id: text('id').primaryKey().notNull(),
		clerk_user_id: text('clerk_user_id').notNull(),
		data: text('data', { mode: 'json' }).notNull().$type<CharacterClass>(),
		campaign_id: text('campaign_id'),
		created_at: integer('created_at').notNull(),
		updated_at: integer('updated_at').notNull()
	},
	(table) => [
		index('homebrew_classes_clerk_user_id_idx').on(table.clerk_user_id),
		index('homebrew_classes_campaign_id_idx').on(table.campaign_id)
	]
);

export const homebrew_classes_schema = createSelectSchema(homebrew_classes);
export const homebrew_classes_insert_schema = createInsertSchema(homebrew_classes);
export const homebrew_classes_update_schema = createUpdateSchema(homebrew_classes);

// ============================================================================
// Subclasses
// ============================================================================

export const homebrew_subclasses = sqliteTable(
	'homebrew_subclasses',
	{
		id: text('id').primaryKey().notNull(),
		clerk_user_id: text('clerk_user_id').notNull(),
		data: text('data', { mode: 'json' }).notNull().$type<Subclass>(),
		campaign_id: text('campaign_id'),
		created_at: integer('created_at').notNull(),
		updated_at: integer('updated_at').notNull()
	},
	(table) => [
		index('homebrew_subclasses_clerk_user_id_idx').on(table.clerk_user_id),
		index('homebrew_subclasses_campaign_id_idx').on(table.campaign_id)
	]
);

export const homebrew_subclasses_schema = createSelectSchema(homebrew_subclasses);
export const homebrew_subclasses_insert_schema = createInsertSchema(homebrew_subclasses);
export const homebrew_subclasses_update_schema = createUpdateSchema(homebrew_subclasses);

// ============================================================================
// Domains
// ============================================================================

export const homebrew_domains = sqliteTable(
	'homebrew_domains',
	{
		id: text('id').primaryKey().notNull(),
		clerk_user_id: text('clerk_user_id').notNull(),
		data: text('data', { mode: 'json' }).notNull().$type<Domain>(),
		campaign_id: text('campaign_id'),
		created_at: integer('created_at').notNull(),
		updated_at: integer('updated_at').notNull()
	},
	(table) => [
		index('homebrew_domains_clerk_user_id_idx').on(table.clerk_user_id),
		index('homebrew_domains_campaign_id_idx').on(table.campaign_id)
	]
);

export const homebrew_domains_schema = createSelectSchema(homebrew_domains);
export const homebrew_domains_insert_schema = createInsertSchema(homebrew_domains);
export const homebrew_domains_update_schema = createUpdateSchema(homebrew_domains);

// ============================================================================
// Domain Cards
// ============================================================================

export const homebrew_domain_cards = sqliteTable(
	'homebrew_domain_cards',
	{
		id: text('id').primaryKey().notNull(),
		clerk_user_id: text('clerk_user_id').notNull(),
		data: text('data', { mode: 'json' }).notNull().$type<DomainCard>(),
		campaign_id: text('campaign_id'),
		created_at: integer('created_at').notNull(),
		updated_at: integer('updated_at').notNull()
	},
	(table) => [
		index('homebrew_domain_cards_clerk_user_id_idx').on(table.clerk_user_id),
		index('homebrew_domain_cards_campaign_id_idx').on(table.campaign_id)
	]
);

export const homebrew_domain_cards_schema = createSelectSchema(homebrew_domain_cards);
export const homebrew_domain_cards_insert_schema = createInsertSchema(homebrew_domain_cards);
export const homebrew_domain_cards_update_schema = createUpdateSchema(homebrew_domain_cards);

// ============================================================================
// Primary Weapons
// ============================================================================

export const homebrew_primary_weapons = sqliteTable(
	'homebrew_primary_weapons',
	{
		id: text('id').primaryKey().notNull(),
		clerk_user_id: text('clerk_user_id').notNull(),
		data: text('data', { mode: 'json' }).notNull().$type<Weapon>(),
		campaign_id: text('campaign_id'),
		created_at: integer('created_at').notNull(),
		updated_at: integer('updated_at').notNull()
	},
	(table) => [
		index('homebrew_primary_weapons_clerk_user_id_idx').on(table.clerk_user_id),
		index('homebrew_primary_weapons_campaign_id_idx').on(table.campaign_id)
	]
);

export const homebrew_primary_weapons_schema = createSelectSchema(homebrew_primary_weapons);
export const homebrew_primary_weapons_insert_schema = createInsertSchema(homebrew_primary_weapons);
export const homebrew_primary_weapons_update_schema = createUpdateSchema(homebrew_primary_weapons);

// ============================================================================
// Secondary Weapons
// ============================================================================

export const homebrew_secondary_weapons = sqliteTable(
	'homebrew_secondary_weapons',
	{
		id: text('id').primaryKey().notNull(),
		clerk_user_id: text('clerk_user_id').notNull(),
		data: text('data', { mode: 'json' }).notNull().$type<Weapon>(),
		campaign_id: text('campaign_id'),
		created_at: integer('created_at').notNull(),
		updated_at: integer('updated_at').notNull()
	},
	(table) => [
		index('homebrew_secondary_weapons_clerk_user_id_idx').on(table.clerk_user_id),
		index('homebrew_secondary_weapons_campaign_id_idx').on(table.campaign_id)
	]
);

export const homebrew_secondary_weapons_schema = createSelectSchema(homebrew_secondary_weapons);
export const homebrew_secondary_weapons_insert_schema = createInsertSchema(
	homebrew_secondary_weapons
);
export const homebrew_secondary_weapons_update_schema = createUpdateSchema(
	homebrew_secondary_weapons
);

// ============================================================================
// Armor
// ============================================================================

export const homebrew_armor = sqliteTable(
	'homebrew_armor',
	{
		id: text('id').primaryKey().notNull(),
		clerk_user_id: text('clerk_user_id').notNull(),
		data: text('data', { mode: 'json' }).notNull().$type<Armor>(),
		campaign_id: text('campaign_id'),
		created_at: integer('created_at').notNull(),
		updated_at: integer('updated_at').notNull()
	},
	(table) => [
		index('homebrew_armor_clerk_user_id_idx').on(table.clerk_user_id),
		index('homebrew_armor_campaign_id_idx').on(table.campaign_id)
	]
);

export const homebrew_armor_schema = createSelectSchema(homebrew_armor);
export const homebrew_armor_insert_schema = createInsertSchema(homebrew_armor);
export const homebrew_armor_update_schema = createUpdateSchema(homebrew_armor);

// ============================================================================
// Loot
// ============================================================================

export const homebrew_loot = sqliteTable(
	'homebrew_loot',
	{
		id: text('id').primaryKey().notNull(),
		clerk_user_id: text('clerk_user_id').notNull(),
		data: text('data', { mode: 'json' }).notNull().$type<Loot>(),
		campaign_id: text('campaign_id'),
		created_at: integer('created_at').notNull(),
		updated_at: integer('updated_at').notNull()
	},
	(table) => [
		index('homebrew_loot_clerk_user_id_idx').on(table.clerk_user_id),
		index('homebrew_loot_campaign_id_idx').on(table.campaign_id)
	]
);

export const homebrew_loot_schema = createSelectSchema(homebrew_loot);
export const homebrew_loot_insert_schema = createInsertSchema(homebrew_loot);
export const homebrew_loot_update_schema = createUpdateSchema(homebrew_loot);

// ============================================================================
// Consumables
// ============================================================================

export const homebrew_consumables = sqliteTable(
	'homebrew_consumables',
	{
		id: text('id').primaryKey().notNull(),
		clerk_user_id: text('clerk_user_id').notNull(),
		data: text('data', { mode: 'json' }).notNull().$type<Consumable>(),
		campaign_id: text('campaign_id'),
		created_at: integer('created_at').notNull(),
		updated_at: integer('updated_at').notNull()
	},
	(table) => [
		index('homebrew_consumables_clerk_user_id_idx').on(table.clerk_user_id),
		index('homebrew_consumables_campaign_id_idx').on(table.campaign_id)
	]
);

export const homebrew_consumables_schema = createSelectSchema(homebrew_consumables);
export const homebrew_consumables_insert_schema = createInsertSchema(homebrew_consumables);
export const homebrew_consumables_update_schema = createUpdateSchema(homebrew_consumables);

// ============================================================================
// Ancestry Cards
// ============================================================================

export const homebrew_ancestry_cards = sqliteTable(
	'homebrew_ancestry_cards',
	{
		id: text('id').primaryKey().notNull(),
		clerk_user_id: text('clerk_user_id').notNull(),
		data: text('data', { mode: 'json' }).notNull().$type<AncestryCard>(),
		campaign_id: text('campaign_id'),
		created_at: integer('created_at').notNull(),
		updated_at: integer('updated_at').notNull()
	},
	(table) => [
		index('homebrew_ancestry_cards_clerk_user_id_idx').on(table.clerk_user_id),
		index('homebrew_ancestry_cards_campaign_id_idx').on(table.campaign_id)
	]
);

export const homebrew_ancestry_cards_schema = createSelectSchema(homebrew_ancestry_cards);
export const homebrew_ancestry_cards_insert_schema = createInsertSchema(homebrew_ancestry_cards);
export const homebrew_ancestry_cards_update_schema = createUpdateSchema(homebrew_ancestry_cards);

// ============================================================================
// Community Cards
// ============================================================================

export const homebrew_community_cards = sqliteTable(
	'homebrew_community_cards',
	{
		id: text('id').primaryKey().notNull(),
		clerk_user_id: text('clerk_user_id').notNull(),
		data: text('data', { mode: 'json' }).notNull().$type<CommunityCard>(),
		campaign_id: text('campaign_id'),
		created_at: integer('created_at').notNull(),
		updated_at: integer('updated_at').notNull()
	},
	(table) => [
		index('homebrew_community_cards_clerk_user_id_idx').on(table.clerk_user_id),
		index('homebrew_community_cards_campaign_id_idx').on(table.campaign_id)
	]
);

export const homebrew_community_cards_schema = createSelectSchema(homebrew_community_cards);
export const homebrew_community_cards_insert_schema = createInsertSchema(homebrew_community_cards);
export const homebrew_community_cards_update_schema = createUpdateSchema(homebrew_community_cards);

// ============================================================================
// Transformation Cards
// ============================================================================

export const homebrew_transformation_cards = sqliteTable(
	'homebrew_transformation_cards',
	{
		id: text('id').primaryKey().notNull(),
		clerk_user_id: text('clerk_user_id').notNull(),
		data: text('data', { mode: 'json' }).notNull().$type<TransformationCard>(),
		campaign_id: text('campaign_id'),
		created_at: integer('created_at').notNull(),
		updated_at: integer('updated_at').notNull()
	},
	(table) => [
		index('homebrew_transformation_cards_clerk_user_id_idx').on(table.clerk_user_id),
		index('homebrew_transformation_cards_campaign_id_idx').on(table.campaign_id)
	]
);

export const homebrew_transformation_cards_schema = createSelectSchema(
	homebrew_transformation_cards
);
export const homebrew_transformation_cards_insert_schema = createInsertSchema(
	homebrew_transformation_cards
);
export const homebrew_transformation_cards_update_schema = createUpdateSchema(
	homebrew_transformation_cards
);

// ============================================================================
// Beastforms
// ============================================================================

export const homebrew_beastforms = sqliteTable(
	'homebrew_beastforms',
	{
		id: text('id').primaryKey().notNull(),
		clerk_user_id: text('clerk_user_id').notNull(),
		data: text('data', { mode: 'json' }).notNull().$type<Beastform>(),
		campaign_id: text('campaign_id'),
		created_at: integer('created_at').notNull(),
		updated_at: integer('updated_at').notNull()
	},
	(table) => [
		index('homebrew_beastforms_clerk_user_id_idx').on(table.clerk_user_id),
		index('homebrew_beastforms_campaign_id_idx').on(table.campaign_id)
	]
);

export const homebrew_beastforms_schema = createSelectSchema(homebrew_beastforms);
export const homebrew_beastforms_insert_schema = createInsertSchema(homebrew_beastforms);
export const homebrew_beastforms_update_schema = createUpdateSchema(homebrew_beastforms);
