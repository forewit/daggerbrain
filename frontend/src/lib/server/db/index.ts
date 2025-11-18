import type { D1Database } from '@cloudflare/workers-types';
import type { RequestEvent } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export function createDb(database: D1Database) {
	return drizzle(database, { schema });
}

export type AppDatabase = ReturnType<typeof createDb>;

declare module '@sveltejs/kit' {
	interface Locals {
		db?: AppDatabase;
	}
}

export function getDb(event: RequestEvent): AppDatabase {
	const database = event.platform?.env?.DB;
	if (!database) {
		throw new Error(
			'D1 binding "DB" is not configured. Make sure you are running through `wrangler dev` or have the D1 binding configured in your environment.'
		);
	}
	if (!event.locals.db) {
		event.locals.db = createDb(database);
	}
	return event.locals.db;
}

