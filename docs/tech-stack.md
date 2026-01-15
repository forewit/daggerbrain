# Tech Stack

## File Structure

```
src/
├── lib/
│   ├── components/     # UI components (Svelte)
│   ├── state/          # State management (Svelte runes)
│   │   ├── user.svelte.ts
│   │   ├── character.svelte.ts
│   │   ├── campaigns.svelte.ts
│   │   ├── homebrew.svelte.ts
│   │   └── compendium.svelte.ts
│   ├── remote/         # Remote functions (server calls)
│   │   ├── characters.remote.ts
│   │   ├── campaigns/
│   │   ├── homebrew/
│   │   ├── compendium/
│   │   ├── permissions.remote.ts
│   │   └── utils.ts
│   ├── server/         # Server-only code
│   │   ├── db/         # Drizzle schemas
│   │   └── permissions.ts
│   └── types/          # TypeScript types
└── routes/             # SvelteKit routes
    ├── (private)/      # Protected routes
    ├── (public)/       # Public routes
    └── api/            # API endpoints
```

## SvelteKit

### Configuration
- **Adapter**: `@sveltejs/adapter-cloudflare` (Cloudflare Workers)
  - SPA fallback enabled
- **Remote Functions**: Experimental feature enabled
  - `experimental.remoteFunctions: true` in `svelte.config.js`
  - Allows `query()` and `command()` from `$app/server`
- **Compiler**: Experimental async support
  - `experimental.async: true`

### Runtime
- **Bun**: Used instead of Node.js (see `.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc`)
- **Package Manager**: Bun (`bun install`, `bun run`)

### Database
- **ORM**: Drizzle ORM
- **Database**: Cloudflare D1 (SQLite)
- **Migrations**: `drizzle/` directory, managed via `drizzle-kit`
- **Schema Location**: `src/lib/server/db/`

### Storage
- **R2 Buckets**:
  - `R2_IMAGES` - Compendium images
  - `R2_USERCONTENT` - User-uploaded images
- **KV Namespace**: `KV` - Caching (note: KV caching removed from characters for cost optimization)

### Real-time
- **Durable Objects**: `CampaignLiveDO` in separate worker (`campaigns-do/`)
  - One DO instance per campaign (named by campaignId)
  - WebSocket connections for live updates
  - In-memory state only (D1 is source of truth)

### Authentication
- **Clerk**: `svelte-clerk` for authentication
- **User ID**: Stored as `clerk_user_id` in database tables

### Development
- **Local Dev**: `wrangler dev --local` (requires DO binding)
- **Build**: `vite build` → `.svelte-kit/cloudflare/`
- **Deploy**: `wrangler deploy` (main) or `wrangler deploy -c wrangler.beta.jsonc` (beta)
