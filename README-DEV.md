# Development Setup

## Running the Application with Durable Objects

This project uses a separate Durable Object worker (`campaigns-do`) that must be running for the WebSocket features to work.

### Option 1: Using Wrangler (Recommended for DO features)

Run the main app with Wrangler, which will automatically discover and connect to the DO worker:

```bash
cd daggerbrain
bun run dev:wrangler
```

This command:
- Builds the SvelteKit app
- Runs both workers through Wrangler using multiple config files
- Automatically connects the DO binding via `script_name`
- Provides access to all Cloudflare bindings (DO, D1, KV, etc.)

**Note:** The DO worker config is automatically included via the `-c` flag, so you don't need to run it separately.

### Option 2: Using Vite Dev Server (Faster, but DO features won't work)

For faster development when you don't need WebSocket/DO features:

```bash
cd daggerbrain
bun run dev
```

**Note:** The DO binding won't be available in this mode, so WebSocket connections will fail. Use this only when working on non-DO features.

## Why Two Modes?

- **`vite dev`**: Fast HMR, but no access to Cloudflare bindings (DO, D1, KV, etc.)
- **`wrangler dev`**: Full Cloudflare environment, but slower due to build step

For features that use Durable Objects (like live campaign updates), you must use `wrangler dev`.

