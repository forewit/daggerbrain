# Daggerbrain



### Environment Setup

1. Create a `.dev.vars` file in the root directory for local development:
   ```bash
   # Cloudflare Configuration
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   CLOUDFLARE_D1_DATABASE_ID=your_database_id
   CLOUDFLARE_API_TOKEN=your_api_token
   CLOUDFLARE_KV_NAMESPACE_ID=your_kv_namespace_id  # Optional, defaults to wrangler.jsonc value

   # Clerk Authentication
   PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

2. Get your Cloudflare credentials:
   - **Account ID**: Found in your Cloudflare dashboard URL or account settings
   - **D1 Database ID**: Found in your D1 database settings (or use the one in `wrangler.jsonc`)
   - **API Token**: Create one at [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) with permissions for:
     - Account: Cloudflare D1:Edit
     - Account: Cloudflare Workers:Edit
     - Account: Cloudflare KV Storage:Edit
     - Account: Cloudflare R2:Edit
   - **KV Namespace ID**: Found in your KV namespace settings (or use the one in `wrangler.jsonc`)

3. Get your Clerk credentials:
   - Sign up at [Clerk](https://clerk.com/) and create an application
   - Copy your publishable key and secret key from the Clerk dashboard

### Database Setup

1. Run database migrations:
   ```bash
   bun run db:push
   ```

   Or generate migrations first:
   ```bash
   bun run db:generate
   bun run db:migrate
   ```

2. (Optional) Open Drizzle Studio to view your database:
   ```bash
   bun run db:studio
   ```

### Seeding KV Storage (Optional)

If you want to seed the Cloudflare KV with compendium data:

```bash
bun run kv:seed
```

This will interactively prompt you to select which data to seed.

### Running Locally

1. Start the development server:
   ```bash
   bun run dev
   ```

   The app will be available at `http://localhost:5173` (or the port shown in the terminal).

2. For preview with Cloudflare Workers (requires Wrangler):
   ```bash
   bun run preview
   ```

   This builds the app and runs it with Wrangler, which provides access to Cloudflare bindings (D1, KV, R2) locally.






## Page Styling
```svelte
<div
	class={cn(
		'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]',
		'mx-auto max-w-6xl px-4 py-2'
	)}
></div>
```
## On Zscaler use:
NODE_TLS_REJECT_UNAUTHORIZED=0 bun