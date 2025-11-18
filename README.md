# Daggerbrain

## When on zscaler

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 bun i

NODE_TLS_REJECT_UNAUTHORIZED=0 bun dev:wrangler
```

## Database tooling

1. Use `wrangler d1 list` (or `wrangler d1 create`) to retrieve your database id, then update `wrangler.toml` with the real value for the `DB` binding.
2. Run `bun run db:push` (or `db:generate`) to keep the D1 schema in sync.
3. Generate reference seed data via `bun run seed:generate`, which writes to `drizzle/seeds/reference-data.json`.
4. Use `wrangler d1 execute` (or a custom script) to import the generated JSON into your D1 instance.

## Character persistence

- Remote functions in `src/lib/ts/characters.remote.ts` now read/write characters directly from D1 using the Drizzle repositories in `src/lib/server/db/repositories/`.
- `/characters` and the character editor hydrate via `+layout.server.ts`, which fetches the signed-in user’s records from D1. No browser cookies are used anymore, so there’s no size limit or local fallback.
- Because persistence is tied to Clerk, make sure you are signed in before invoking the “New Character” or “Delete” actions.

## Authentication (Clerk)

We use the community `svelte-clerk` SDK to wire Clerk into SvelteKit ([Quickstart](https://svelte-clerk.netlify.app/kit/quickstart.html)).

1. Add your keys to `.env`:
   ```
   PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   CLERK_SECRET_KEY=sk_test_xxxxx
   ```
2. The server handler (`hooks.server.ts`) composes `withClerkHandler` with our existing app middleware.
3. The root layout wraps children with `<ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}>` and receives initial state from `buildClerkProps`.
4. Use the bundled pages (`/sign-in`) or add custom forms via SvelteKit remote `form` functions for progressive enhancement.