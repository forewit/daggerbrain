/// <reference types="svelte-clerk/env" />

import type { AppDatabase } from '$lib/server/db';
import type { Character } from '$lib/ts/character/types';
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

declare global {
	namespace App {
		interface Locals {
			db?: AppDatabase;
		}
		interface LayoutData {
			initialCharacters: Character[];
		}
		interface Platform {
			env?: {
				DB: D1Database;
				R2?: R2Bucket;
				[key: string]: unknown;
			};
			context?: {
				waitUntil(promise: Promise<unknown>): void;
			};
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
