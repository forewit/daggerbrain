import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';

export const users_table = sqliteTable('users_table', {
	clerk_id: text('clerk_id').primaryKey().notNull(),
	dismissed_popups: text('dismissed_popups', { mode: 'json' })
		.notNull()
		.default('[]')
		.$type<string[]>() // JSON array of dismissed popup IDs
});

export const users_table_schema = createSelectSchema(users_table);
export const users_table_insert_schema = createInsertSchema(users_table);
export const users_table_update_schema = createUpdateSchema(users_table);
