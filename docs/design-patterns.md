# Design Patterns

## File Structure

- **Components**: `src/lib/components/` - UI components only (no remote function calls)
- **State**: `src/lib/state/*.svelte.ts` - State management with Svelte runes, calls remote functions
- **Remote**: `src/lib/remote/` - Server function calls using `query()` and `command()`
- **Server**: `src/lib/server/` - Server-only code (database, permissions helpers)

## Remote Functions Pattern

**UI should never call remote functions directly. Only state management should call remote functions.**

### Flow
1. **UI Components** → Import and use state contexts (e.g., `getUserContext()`, `getCharacterContext()`)
2. **State Files** → Import and call remote functions (e.g., `get_all_characters()`, `update_character()`)
3. **Remote Functions** → Use SvelteKit's `query()` (read) or `command()` (write) from `$app/server`
4. **Server Code** → Database operations, permission checks

### Example
```typescript
// ❌ BAD - Component calling remote directly
// component.svelte
import { get_all_characters } from '$lib/remote/characters.remote';

// ✅ GOOD - Component uses state
// component.svelte
import { getUserContext } from '$lib/state/user.svelte';
const user = getUserContext();
const characters = user.all_characters;

// state/user.svelte.ts
import { get_all_characters } from '$lib/remote/characters.remote';
let all_characters = $state<Character[]>([]);
$effect(() => {
  get_all_characters().then(chars => all_characters = chars);
});
```

## State Management Files

### `user.svelte.ts`
- **Purpose**: Global user state, owned characters, owned campaigns
- **State**: `all_characters`, `all_campaigns`, `user`, `loading`
- **Features**: Auto-save user preferences with debouncing (300ms)
- **Context Key**: `Symbol('UserContext')`
- **Remote Calls**: `get_all_characters()`, `get_user()`, `get_user_campaigns()`, `create_character()`, `delete_character()`, `update_user()`, `create_campaign()`, `delete_campaign()`

### `character.svelte.ts`
- **Purpose**: Single character state with derived calculations
- **State**: `character`, `loadingCharacter`, `characterLoadSource` ('owned' | 'permission')
- **Features**: 
  - Fast path: checks `user.all_characters` first
  - Fallback: loads via `get_character_by_id()` with permission check
  - Derived character calculations (stats, modifiers, etc.)
- **Context Key**: `Symbol('CharacterContext')`
- **Remote Calls**: `get_character_by_id()`, `update_character()`, `getCharacterAccess()`

### `campaigns.svelte.ts`
- **Purpose**: Campaign state, members, characters, real-time sync
- **State**: `campaign`, `members`, `campaignState`, `characters`, `vaultItems`, WebSocket connection
- **Features**:
  - WebSocket connection to Durable Object for live updates
  - Reconnection with exponential backoff
  - Version tracking for stale client detection
  - Deep merge of partial character updates
- **Context Key**: `Symbol('CampaignContext')`
- **Remote Calls**: `get_campaign()`, `get_campaign_members()`, `get_campaign_state()`, `get_campaign_characters()`, `update_campaign()`, `update_campaign_state()`, `get_campaign_homebrew_vault()`, etc.

### `homebrew.svelte.ts`
- **Purpose**: User-created homebrew items (all 13 types)
- **State**: Separate records for each homebrew type (classes, weapons, armor, etc.)
- **Features**: CRUD operations for all homebrew types
- **Context Key**: `Symbol('HomebrewContext')`
- **Remote Calls**: `get_homebrew_*()`, `create_homebrew_*()`, `update_homebrew_*()`, `delete_homebrew_*()` for each type

### `compendium.svelte.ts`
- **Purpose**: Base compendium data + homebrew + campaign homebrew, source filtering
- **State**: All compendium items, `source_whitelist` (SvelteSet), campaign homebrew
- **Features**:
  - Merges base compendium + user homebrew + campaign homebrew
  - Source filtering via `source_whitelist` (default: ['SRD'])
  - Campaign homebrew loaded reactively from character context
- **Context Key**: `Symbol('Compendium')`
- **Remote Calls**: `get_all_*()` for compendium items, `get_campaign_homebrew_items()`

## State Context Pattern

All state files use Svelte's context API:

```typescript
const CONTEXT_KEY = Symbol('ContextName');

export const setContextName = () => {
  const state = createState();
  return setContext(CONTEXT_KEY, state);
};

export const getContextName = () => {
  return getContext(CONTEXT_KEY);
};
```

Contexts are set in route `+layout.svelte` files and accessed in components.

## Remote Function Types

- **`query()`**: Read-only operations, can be called from client
  - Returns data, no side effects
  - Example: `get_all_characters()`, `get_campaign()`
- **`command()`**: Write operations, can be called from client
  - Modifies data, returns result
  - Example: `update_character()`, `create_campaign()`
  - Both use `getRequestEvent()`, `get_auth()`, `get_db()` from `$lib/remote/utils`

## Durable Object Notification Pattern

When remote commands modify campaign-related data:

1. Write to D1 first
2. Call `notifyDurableObject()` helper function
3. DO updates in-memory cache and broadcasts to WebSocket clients
4. Clients receive updates and merge into local state

This ensures D1 is source of truth, DO is just for real-time sync.
