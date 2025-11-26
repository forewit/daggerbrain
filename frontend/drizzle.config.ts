/// <reference types="node" />
import { defineConfig } from 'drizzle-kit';

const missingVars: string[] = [];
if (!process.env.CLOUDFLARE_ACCOUNT_ID) missingVars.push('CLOUDFLARE_ACCOUNT_ID');
if (!process.env.CLOUDFLARE_D1_DATABASE_ID) missingVars.push('CLOUDFLARE_D1_DATABASE_ID');
if (!process.env.CLOUDFLARE_API_TOKEN) missingVars.push('CLOUDFLARE_API_TOKEN');

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// After validation, these are guaranteed to be strings
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID!;
const token = process.env.CLOUDFLARE_API_TOKEN!;

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/server/db/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId,
    databaseId,
    token
  },
  verbose: true,
  strict: true
});

