// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
/// <reference types="svelte-clerk/env" />

import type { KVNamespace, D1Database, R2Bucket } from '@cloudflare/workers-types';

declare global {
	namespace App {
		interface Platform {
			env: {
				R2: R2Bucket;
				DB: D1Database;
				KV: KVNamespace;
			};
			cf: CfProperties;
			ctx: ExecutionContext;
		}
	}
}

export {};
