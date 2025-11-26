/// <reference types="node" />
import { defineConfig } from 'drizzle-kit';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Local drizzle config for pushing schema directly to local D1 SQLite database.
 *
 * This config finds the miniflare SQLite database file created by wrangler
 * and allows drizzle-kit push to work with it directly.
 */

const D1_STATE_DIR = join(
	process.cwd(),
	'.wrangler',
	'state',
	'v3',
	'd1',
	'miniflare-D1DatabaseObject'
);

/**
 * Find the SQLite database file in the miniflare D1 state directory.
 * Returns the path to the first .sqlite file found.
 */
function findLocalD1Database(): string {
	if (!existsSync(D1_STATE_DIR)) {
		// If directory doesn't exist yet, return a default path
		// drizzle-kit push will create it
		return join(D1_STATE_DIR, 'local.sqlite');
	}

	const files = readdirSync(D1_STATE_DIR);
	const sqliteFile = files.find((f) => f.endsWith('.sqlite'));

	if (!sqliteFile) {
		// No database exists yet, return a default path
		return join(D1_STATE_DIR, 'local.sqlite');
	}

	return join(D1_STATE_DIR, sqliteFile);
}

const dbPath = findLocalD1Database();

export default defineConfig({
	out: './drizzle',
	schema: './src/lib/server/db/schema.ts',
	dialect: 'sqlite',
	dbCredentials: {
		url: `file:${dbPath}`
	},
	verbose: true,
	strict: true
});
