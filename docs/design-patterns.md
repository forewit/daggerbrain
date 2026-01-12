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

## Race Condition Prevention Patterns

When multiple concurrent requests modify the same data, race conditions can occur. D1 supports batch operations for atomicity, but we need to design our operations carefully to prevent race conditions.

### Core Principles

1. **Use Batches for Multi-Table Operations**: Wrap all related operations in `db.batch([...])` to ensure atomicity
2. **Embed Conditions in WHERE Clauses**: Include condition checks directly in WHERE clauses using SQL subqueries
3. **Use Upsert Patterns for Idempotency**: Use `onConflictDoNothing()` or `onConflictDoUpdate()` instead of check-then-insert
4. **Use Conditional Updates as Locks**: Include state checks in WHERE clauses to act as optimistic locks
5. **Verify Results with `meta.changes`**: Check `result.meta.changes` to verify operations affected rows

### Pattern 1: Conditional Update with Limit Check

Embed limit checks directly in WHERE clauses to make them atomic:

```typescript
// ✅ Good: Limit check in WHERE clause
const [result] = await db.batch([
  db
    .update(characters_table)
    .set({ clerk_user_id: userId })
    .where(
      and(
        eq(characters_table.id, character_id),
        sql`(SELECT COUNT(*) FROM ${characters_table} WHERE ${characters_table.clerk_user_id} = ${userId}) < ${CHARACTER_LIMIT}`
      )
    )
]);

if (result.meta.changes === 0) {
  throw error(403, 'Character limit reached');
}
```

**Why**: The update only succeeds if the limit condition is met, eliminating the check-then-act race condition.

### Pattern 2: Atomic Multi-Table Operation

Wrap multiple related operations in a batch to ensure atomicity:

```typescript
// ✅ Good: All related operations in one batch
await db.batch([
  db.insert(characters_table).values({...}),
  db.insert(campaign_characters_table).values({...})
]);
```

**Why**: All operations succeed or all fail together, preventing partial updates.

### Pattern 3: Upsert with Conflict Handling

Use `onConflictDoNothing()` or `onConflictDoUpdate()` to eliminate check-then-insert race conditions:

```typescript
// ✅ Good: Idempotent insert
const result = await db
  .insert(table)
  .values({...})
  .onConflictDoNothing({ target: table.id });

if (result.meta.changes === 0) {
  throw error(400, 'Already exists');
}
```

**Why**: Eliminates the race condition where two requests both check "doesn't exist" then both try to insert.

### Pattern 4: Conditional Update as Lock

Include state checks in WHERE clauses to act as optimistic locks:

```typescript
// ✅ Good: Only succeeds if in expected state
const [result] = await db.batch([
  db
    .update(table)
    .set({ claimable: 0 })
    .where(
      and(
        eq(table.id, id),
        eq(table.claimable, 1) // Acts as lock - only one concurrent request can succeed
      )
    )
]);

if (result.meta.changes === 0) {
  throw error(400, 'Already claimed');
}
```

**Why**: Only one concurrent request can succeed when the state matches, preventing double-claiming.

### Pattern 5: Atomic Array Updates

Use SQL JSON functions to update arrays atomically instead of read-modify-write:

```typescript
// ✅ Good: Atomic array update using SQL
await db
  .insert(users_table)
  .values({
    clerk_id: userId,
    dismissed_popups: sql`json_array(${popupId})`
  })
  .onConflictDoUpdate({
    target: users_table.clerk_id,
    set: {
      dismissed_popups: sql`
        CASE 
          WHEN dismissed_popups IS NULL THEN json_array(${popupId})
          WHEN json_array_length(dismissed_popups) = 0 THEN json_array(${popupId})
          WHEN EXISTS (
            SELECT 1 FROM json_each(dismissed_popups) 
            WHERE value = ${popupId}
          ) THEN dismissed_popups
          ELSE dismissed_popups || json_array(${popupId})
        END
      `
    }
  });
```

**Why**: Eliminates read-modify-write race conditions where two requests both read, modify, and write.

### Anti-Patterns to Avoid

#### ❌ Check-Then-Act

```typescript
// ❌ BAD: Race condition possible
const existing = await db.select().from(table).where(...);
if (existing.length === 0) {
  await db.insert(table).values({...}); // Another request might insert here
}
```

**Fix**: Use `onConflictDoNothing()` pattern instead.

#### ❌ Sequential Operations

```typescript
// ❌ BAD: Not atomic - partial failure possible
await db.insert(table1).values({...});
await db.insert(table2).values({...});
await db.update(table3).set({...});
```

**Fix**: Wrap in `db.batch([...])` for atomicity.

#### ❌ Read-Modify-Write

```typescript
// ❌ BAD: Race condition on concurrent updates
const [record] = await db.select().from(table).where(...);
const updated = { ...record, field: newValue };
await db.update(table).set(updated).where(...);
```

**Fix**: Use SQL expressions in `set()` to compute values atomically, or use conditional WHERE clauses.

### Utility Functions

See `src/lib/server/atomic-operations.ts` for reusable helper functions:
- `verifyChanges()` - Verify operation affected expected rows
- `verifyBatchResults()` - Verify multiple batch results

### Testing Race Conditions

When testing, simulate concurrent requests:
1. Use tools to send multiple simultaneous requests
2. Verify atomicity: batches either fully succeed or fully fail
3. Test edge cases: limit boundaries, concurrent claims, etc.
4. Verify conditional WHERE clauses prevent invalid operations
