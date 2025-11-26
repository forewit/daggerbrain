### How to Use This Guide
- Start here whenever you’re unsure about SvelteKit behavior or best practices.
- Locate the topic area below, skim the quick summary, then jump to the linked doc for details.
- When in doubt, prefer the most specific doc (e.g. remote functions vs. general loading data).

| Topic | Primary Doc | What You’ll Find |
| --- | --- | --- |
| File-based routing, layouts, API endpoints | `robots/svelte/sveltekit-routing.md` | Route naming, `+page`/`+layout` mechanics, server endpoints |
| Loading data in pages/layouts | `robots/svelte/sveltekit-loading-data.md` | `load` functions, SSR vs CSR, streaming, invalidation |
| Remote functions (`*.remote.*`) | `robots/svelte/sveltekit-remote-functions.md` | `query`, `form`, `command`, `prerender`, validation patterns |
| State management philosophy | `robots/svelte/sveltekit-state-management.md` | Avoiding shared server state, context usage, reactivity tips |

---

### Routing & Project Structure
- **Read:** `robots/svelte/sveltekit-routing.md`
- **Covers:** Filesystem router rules, `+page`/`+layout`/`+server` files, error boundaries, API routes.
- **Best practices to remember:**
  - Mirror URLs with folders under `src/routes`; use `[param]` and `[...rest]` segments for dynamic paths.
  - Keep layouts focused on shared chrome; always include `@render children()`.
  - Prefer colocating route-specific helpers/components inside the route folder; move shared utilities to `$lib`.
  - Use `+server.js` for non-HTML responses and mindful error/redirect helpers.
- **Use this doc when…**
  - You’re adding a new route, adjusting layouts, or need to confirm how errors bubble.

### Loading Data Safely
- **Read:** `robots/svelte/sveltekit-loading-data.md`
- **Covers:** Universal vs. server `load`, `parent()` chaining, dependency tracking, streaming, cookies/headers.
- **Best practices to remember:**
  - Default to server `load` when private env vars or DB access are involved; otherwise consider universal `load`.
  - Keep `load` functions pure and return serializable data; avoid side-effects or global mutations.
  - Use `await parent()` sparingly to avoid waterfalls; leverage dependency tracking and `invalidate` helpers.
  - Document when data is streamed with promises and ensure fallbacks handle rejection states.
- **Use this doc when…**
  - You need to know how/when data re-fetches, how to set headers, or how to wire SSR/CSR behavior.

### Remote Functions (`query`, `form`, `command`, `prerender`)
- **Read:** `robots/svelte/sveltekit-remote-functions.md`
- **Covers:** Enabling experimental remote functions, validation, caching/refreshing, single-flight mutations, `enhance`, optimistic updates.
- **Best practices to remember:**
  - Opt in via `svelte.config.js` before authoring `.remote.[jt]s` files; keep them outside `src/lib/server`.
  - Always validate inputs (Zod/Valibot) unless you intentionally pass `'unchecked'`.
  - Use `form` for progressive enhancement and server writes; favor `query` for reads; reserve `command` for imperative writes without forms; choose `prerender` for static data.
  - Coordinate cache refreshes with `.refresh()`, `.set()`, `updates()`, or `.withOverride()` instead of blanket invalidations.
  - Leverage `.fields` helpers for accessible forms, client-side preflight validation, and handling sensitive inputs (`_field` naming).
- **Use this doc when…**
  - You’re wiring remote data access, building forms, or need single-flight/optimistic update patterns.

### State Management Philosophy
- **Read:** `robots/svelte/sveltekit-state-management.md`
- **Covers:** Avoiding shared server state, using context, preserving component state across navigation, URL/snapshot storage guidelines.
- **Best practices to remember:**
  - Never store per-request data in module-level variables on the server; persist to DBs and hydrate via `load`.
  - Keep `load` functions side-effect free; pass data through props or context instead of global stores.
  - Use Svelte 5 universal reactivity (`$derived`, `$state`) to recompute values when `data` changes.
  - Choose the right persistence level: context for tree-wide state, URL params for shareable filters, snapshots for ephemeral UI state.
- **Use this doc when…**
  - You’re deciding where state should live, working on context providers, or debugging stale UI after navigation.

---

### Workflow Tips for New Engineers
1. **Plan the route first:** Confirm folder/file layout in `sveltekit-routing` before touching code.
2. **Design the data flow:** Use `sveltekit-loading-data` to choose the right `load` strategy and understand rerender triggers.
3. **Pick the right remote primitive:** Decide between `query`, `form`, `command`, or `prerender` with help from `sveltekit-remote-functions`.
4. **Validate state decisions:** Cross-check `sveltekit-state-management` to ensure state stays scoped correctly.
5. **Document references:** When opening a PR, mention which guideline(s) you followed if the change touches routing, data loading, remote functions, or state.

Keep this structure doc bookmarked; it’s the fastest way to route any SvelteKit question to the right in-repo reference. Happy building!

