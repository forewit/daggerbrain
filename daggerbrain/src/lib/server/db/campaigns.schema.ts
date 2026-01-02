import { integer, sqliteTable, text, index, primaryKey } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';

// ============================================================================
// Campaigns
// ============================================================================

export const campaigns_table = sqliteTable(
	'campaigns_table',
	{
		id: text('id').primaryKey().notNull(),
		gm_user_id: text('gm_user_id').notNull(),
		name: text('name').notNull(),
		description: text('description'),
		created_at: integer('created_at').notNull(),
		updated_at: integer('updated_at').notNull()
	},
	(table) => [index('campaigns_table_gm_user_id_idx').on(table.gm_user_id)]
);

export const campaigns_table_schema = createSelectSchema(campaigns_table);
export const campaigns_table_insert_schema = createInsertSchema(campaigns_table);
export const campaigns_table_update_schema = createUpdateSchema(campaigns_table);

// ============================================================================
// Campaign Members
// ============================================================================

export const campaign_members_table = sqliteTable(
	'campaign_members_table',
	{
		campaign_id: text('campaign_id').notNull(),
		user_id: text('user_id').notNull(),
		role: text('role').notNull(), // 'gm' | 'player'
		joined_at: integer('joined_at').notNull()
	},
	(table) => [
		primaryKey({ columns: [table.campaign_id, table.user_id] }),
		index('campaign_members_table_campaign_id_idx').on(table.campaign_id),
		index('campaign_members_table_user_id_idx').on(table.user_id)
	]
);

export const campaign_members_table_schema = createSelectSchema(campaign_members_table);
export const campaign_members_table_insert_schema = createInsertSchema(campaign_members_table);
export const campaign_members_table_update_schema = createUpdateSchema(campaign_members_table);

// ============================================================================
// Campaign State
// ============================================================================

export const campaign_state_table = sqliteTable('campaign_state_table', {
	campaign_id: text('campaign_id').primaryKey().notNull(),
	fear_track: integer('fear_track').notNull().default(0),
	notes: text('notes'),
	updated_at: integer('updated_at').notNull()
});

export const campaign_state_table_schema = createSelectSchema(campaign_state_table);
export const campaign_state_table_insert_schema = createInsertSchema(campaign_state_table);
export const campaign_state_table_update_schema = createUpdateSchema(campaign_state_table);

// ============================================================================
// Campaign Homebrew Vault
// ============================================================================

export const campaign_homebrew_vault_table = sqliteTable(
	'campaign_homebrew_vault_table',
	{
		id: text('id').primaryKey().notNull(),
		campaign_id: text('campaign_id').notNull(),
		homebrew_type: text('homebrew_type').notNull(), // matches HomebrewType
		homebrew_id: text('homebrew_id').notNull(),
		added_at: integer('added_at').notNull()
	},
	(table) => [
		index('campaign_homebrew_vault_table_campaign_id_idx').on(table.campaign_id)
	]
);

export const campaign_homebrew_vault_table_schema = createSelectSchema(campaign_homebrew_vault_table);
export const campaign_homebrew_vault_table_insert_schema = createInsertSchema(
	campaign_homebrew_vault_table
);
export const campaign_homebrew_vault_table_update_schema = createUpdateSchema(
	campaign_homebrew_vault_table
);

