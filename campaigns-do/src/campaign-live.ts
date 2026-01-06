import { DurableObject } from "cloudflare:workers";
import type { CampaignState, CampaignCharacterLiveUpdate } from "$lib/types/campaign-types";
import type { DerivedCharacter } from "$lib/types/derived-character-types";

interface Env {
  DB: D1Database;
  KV: KVNamespace;
}

interface StoredData {
  state: CampaignState;
  characters: Record<string, DerivedCharacter>;
  version: number;
}

interface WebSocketAttachment {
  connectedAt: number;
  userId: string;
  userRole: 'gm' | 'player';
}

export class CampaignLiveDO extends DurableObject<Env> {
  private campaignState: CampaignState | null = null;
  // Store full DerivedCharacter objects
  private characters: Record<string, DerivedCharacter> = {};
  private version = 0;
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private updateCount = 0; // Track updates for batching D1 flushes
  private readonly FLUSH_INTERVAL = 10; // Flush to D1 every 10 updates

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    // Restore state from storage immediately in constructor for hibernation support
    this.restoreState();
  }

  override async fetch(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader === 'websocket') {
      return this.handleWebSocketUpgrade(request);
    }

    // Handle HTTP POST requests for notifications
    if (request.method === 'POST') {
      return this.handleHttpNotification(request);
    }

    return new Response('Method not allowed', { status: 405 });
  }

  private async handleHttpNotification(request: Request): Promise<Response> {
    try {
      // Ensure state is initialized before processing any notifications
      await this.ensureInitialized();
      
      const body = await request.json();
      
      switch (body.type) {
        case 'character_added':
          if (!body.character) {
            return new Response(JSON.stringify({ error: 'character is required for character_added' }), { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          await this.addCharacter(body.character);
          break;
        case 'character_updated':
          if (!body.characterId) {
            return new Response(JSON.stringify({ error: 'characterId is required' }), { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Verify character should be in this campaign
          // The server already verified permissions before sending the notification,
          // so we just do a basic sanity check here
          const characterInState = this.characters[body.characterId];
          if (!characterInState) {
            // Character not in DO state - if we have a full character, add it
            // Otherwise check KV to verify it belongs to this campaign
            if (body.character) {
              // Full character update - add to state if campaign matches
              if (body.character.campaign_id === this.campaignState?.campaign_id) {
                await this.addCharacter(body.character);
                break;
              }
            }
            
            // Check KV as fallback
            if (this.env.KV) {
              const kvChar = await this.env.KV.get<DerivedCharacter>(
                `character:${body.characterId}:campaign`,
                'json'
              );
              if (kvChar && kvChar.campaign_id === this.campaignState?.campaign_id) {
                // Character belongs to this campaign, add it to state first
                this.characters[body.characterId] = kvChar;
              } else {
                return new Response(JSON.stringify({ 
                  error: 'Character not in this campaign' 
                }), { 
                  status: 403,
                  headers: { 'Content-Type': 'application/json' }
                });
              }
            }
          }
          
          // body.character is full character, body.updates is partial diff
          await this.updateCharacterFromNotification(body.characterId, body.character || body.updates);
          break;
        case 'character_removed':
        case 'character_deleted':
          if (!body.characterId) {
            return new Response(JSON.stringify({ error: 'characterId is required' }), { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          await this.removeCharacter(body.characterId);
          break;
        default:
          return new Response(JSON.stringify({ error: 'Unknown notification type' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
      }
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error handling HTTP notification:', error);
      return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  private async handleWebSocketUpgrade(request: Request): Promise<Response> {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    
    if (!server) {
      return new Response('Failed to create WebSocket pair', { status: 500 });
    }
    
    // Ensure state is initialized before accepting WebSocket
    await this.ensureInitialized();
    
    // Extract user context from headers (set by live/+server.ts)
    const userId = request.headers.get('X-User-Id') || '';
    const userRole = (request.headers.get('X-User-Role') || 'player') as 'gm' | 'player';
    
    // Store connection metadata in WebSocket attachment for hibernation
    const attachment: WebSocketAttachment = {
      connectedAt: Date.now(),
      userId,
      userRole
    };
    server.serializeAttachment(attachment);
    
    // Use ctx.acceptWebSocket() for hibernation support
    this.ctx.acceptWebSocket(server);
    
    // Send initial state to client after a brief delay to ensure WebSocket is ready
    // Using a microtask to send after the response is returned
    Promise.resolve().then(() => {
      try {
        server.send(JSON.stringify({
          type: 'connected',
          version: this.version,
          state: this.campaignState,
          characters: this.characters
        }));
      } catch (error) {
        console.error('Failed to send initial WebSocket message:', error);
      }
    });
    
    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  override async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    try {
      const text = typeof message === 'string' ? message : new TextDecoder().decode(message);
      const data = JSON.parse(text);
      
      switch (data.type) {
        case 'rejoin':
          await this.handleRejoin(ws, data.lastKnownVersion);
          break;
        case 'update_state':
          await this.updateState(data.updates);
          break;
        case 'update_character':
          // Get user context from WebSocket attachment
          const attachment = ws.deserializeAttachment() as WebSocketAttachment;
          const character = this.characters[data.characterId];
          
          // Verify user can edit this character (owner or GM)
          if (character && character.clerk_user_id !== attachment.userId && attachment.userRole !== 'gm') {
            ws.send(JSON.stringify({ 
              type: 'error', 
              message: 'Not authorized to edit this character' 
            }));
            return;
          }
          
          await this.updateCharacter(data.characterId, data.updates);
          break;
        default:
          ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
      }
    } catch (error) {
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Invalid message' 
      }));
    }
  }

  override async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean): Promise<void> {
    // If this was the last client, flush to D1 before hibernation
    const remainingConnections = this.ctx.getWebSockets();
    if (remainingConnections.length === 0) {
      await this.flushToD1();
    }
  }

  override async webSocketError(ws: WebSocket, error: unknown): Promise<void> {
    console.error('WebSocket error in DO:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }

  private async restoreState(): Promise<void> {
    // This is called in constructor, so it runs on every initialization (including after hibernation)
    const stored = await this.ctx.storage.get<StoredData>('data');
    
    if (stored) {
      this.campaignState = stored.state;
      this.characters = stored.characters;
      this.version = stored.version ?? 0;
      this.initialized = true;
    } else {
      // Initialize with defaults if no stored data exists
      const campaignId = this.ctx.id.name || '';
      this.campaignState = {
        campaign_id: campaignId,
        fear_track: 0,
        notes: null,
        updated_at: Date.now()
      };
      this.characters = {};
      this.version = 0;
      this.initialized = true;
      
      // Try to initialize characters from KV
      await this.initializeCharacters();
      
      // Persist initial state
      await this.persistState();
    }
  }

  private async initializeCharacters(): Promise<void> {
    if (!this.campaignState) return;
    
    const campaignId = this.campaignState.campaign_id;
    if (!campaignId || !this.env.KV) return;

    try {
      // Get campaign character summaries from KV
      const summaries = await this.env.KV.get<Record<string, any>>(
        `campaign:${campaignId}:characters`,
        'json'
      );

      if (!summaries) return;

      // Load full DerivedCharacter objects from KV for each character
      const characterIds = Object.keys(summaries);
      const characterPromises = characterIds.map(async (characterId) => {
        const derivedChar = await this.env.KV!.get<DerivedCharacter>(
          `character:${characterId}:campaign`,
          'json'
        );
        return { characterId, derivedChar };
      });

      const characterResults = await Promise.all(characterPromises);
      
      for (const { characterId, derivedChar } of characterResults) {
        if (derivedChar) {
          this.characters[characterId] = derivedChar;
        }
      }
    } catch (error) {
      console.error('Failed to initialize characters from KV:', error);
      // Don't throw - continue with empty characters
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    
    // Use a promise to prevent concurrent initialization
    if (!this.initPromise) {
      this.initPromise = this.restoreState();
    }
    
    await this.initPromise;
  }

  private async handleRejoin(ws: WebSocket, lastKnownVersion: number | undefined): Promise<void> {
    await this.ensureInitialized();
    
    if (lastKnownVersion === undefined || lastKnownVersion < this.version) {
      // Client is out of sync, send full state
      ws.send(JSON.stringify({
        type: 'state_sync',
        version: this.version,
        state: this.campaignState,
        characters: this.characters
      }));
    } else if (lastKnownVersion === this.version) {
      // Client is already in sync
      ws.send(JSON.stringify({
        type: 'already_synced',
        version: this.version
      }));
    } else {
      // Client version is ahead (shouldn't happen, but handle gracefully)
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Version mismatch - client is ahead of server'
      }));
    }
  }

  private async updateState(updates: Partial<CampaignState>): Promise<void> {
    await this.ensureInitialized();
    
    if (!this.campaignState) {
      return;
    }
    
    // Check timestamp to prevent overwriting with stale data
    if (updates.updated_at !== undefined && this.campaignState.updated_at) {
      if (updates.updated_at <= this.campaignState.updated_at) {
        return; // Stale update, ignore
      }
    }
    
    // Preserve campaign_id if not in updates
    this.campaignState = {
      ...this.campaignState,
      ...updates,
      updated_at: updates.updated_at ?? Date.now()
    };
    
    // Increment version on state change
    this.version++;
    this.updateCount++;
    
    // Persist to storage (batched - only when state changes)
    await this.persistState();
    
    // Broadcast to all connected WebSockets with version
    this.broadcast({
      type: 'state_update',
      version: this.version,
      state: this.campaignState
    });
    
    // Flush to D1 periodically or if this is a significant update
    if (this.updateCount >= this.FLUSH_INTERVAL) {
      await this.flushToD1();
      this.updateCount = 0;
    }
  }

  // Deep merge helper function
  private deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
    const output = { ...target };
    
    for (const key in source) {
      if (source[key] === undefined) continue;
      
      if (
        source[key] !== null &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        target[key] !== null &&
        typeof target[key] === 'object' &&
        !Array.isArray(target[key])
      ) {
        // Recursively merge nested objects
        output[key] = this.deepMerge(target[key], source[key] as Partial<T[Extract<keyof T, string>]>);
      } else {
        // Replace primitive values, arrays, or null
        output[key] = source[key] as T[Extract<keyof T, string>];
      }
    }
    
    return output;
  }

  private async addCharacter(character: DerivedCharacter): Promise<void> {
    await this.ensureInitialized();
    
    this.characters[character.id] = character;
    
    this.version++;
    this.updateCount++;
    
    await this.persistState();
    
    // Broadcast character added
    this.broadcast({
      type: 'character_added',
      version: this.version,
      character
    });
    
    if (this.updateCount >= this.FLUSH_INTERVAL) {
      await this.flushToD1();
      this.updateCount = 0;
    }
  }

  private async removeCharacter(characterId: string): Promise<void> {
    await this.ensureInitialized();
    
    if (!this.characters[characterId]) {
      return; // Character doesn't exist, nothing to remove
    }
    
    delete this.characters[characterId];
    
    this.version++;
    this.updateCount++;
    
    await this.persistState();
    
    // Broadcast character removed
    this.broadcast({
      type: 'character_removed',
      version: this.version,
      characterId
    });
    
    if (this.updateCount >= this.FLUSH_INTERVAL) {
      await this.flushToD1();
      this.updateCount = 0;
    }
  }

  private async updateCharacterFromNotification(characterId: string, updates: Partial<DerivedCharacter> | DerivedCharacter): Promise<void> {
    await this.ensureInitialized();
    
    // Check if updates is a full character object (has id and other required fields)
    const isFullUpdate = 'id' in updates && updates.id === characterId && 
                         'name' in updates && 'clerk_user_id' in updates;
    
    if (isFullUpdate) {
      // Full character replacement
      this.characters[characterId] = updates as DerivedCharacter;
      
      this.version++;
      this.updateCount++;
      
      await this.persistState();
      
      this.broadcast({
        type: 'character_full_update',
        version: this.version,
        characterId,
        character: this.characters[characterId]
      });
    } else {
      // Partial diff update - deep merge
      if (!this.characters[characterId]) {
        // Character doesn't exist yet - can't apply diff
        console.warn(`Cannot apply diff update to non-existent character: ${characterId}`);
        return;
      }
      
      this.characters[characterId] = this.deepMerge(this.characters[characterId], updates);
      
      this.version++;
      this.updateCount++;
      
      await this.persistState();
      
      this.broadcast({
        type: 'character_diff_update',
        version: this.version,
        characterId,
        updates: updates as CampaignCharacterLiveUpdate
      });
    }
    
    if (this.updateCount >= this.FLUSH_INTERVAL) {
      await this.flushToD1();
      this.updateCount = 0;
    }
  }

  private async updateCharacter(characterId: string, updates: Partial<CampaignCharacterLiveUpdate>): Promise<void> {
    await this.ensureInitialized();
    
    // This is called from WebSocket messages (live updates during session)
    // Apply as diff update
    await this.updateCharacterFromNotification(characterId, updates);
  }

  private async persistState(): Promise<void> {
    if (!this.campaignState) return;
    
    const data: StoredData = {
      state: this.campaignState,
      characters: this.characters,
      version: this.version
    };
    
    await this.ctx.storage.put('data', data);
  }

  private async flushToD1(): Promise<void> {
    if (!this.campaignState) return;
    
    try {
      const campaignId = this.campaignState.campaign_id;
      
      // Update campaign state in D1 using direct SQL
      // Using prepared statement for safety
      const stmt = this.env.DB.prepare(
        'UPDATE campaign_state_table SET fear_track = ?, notes = ?, updated_at = ? WHERE campaign_id = ?'
      );
      
      await stmt.bind(
        this.campaignState.fear_track,
        this.campaignState.notes,
        this.campaignState.updated_at,
        campaignId
      ).run();
      
      // Note: Character updates are stored in DO storage for live sessions
      // They should be persisted to D1 via the main character update flow
      // This flush only handles campaign state (fear_track, notes)
      
      console.log(`Flushed campaign state to D1 for campaign ${campaignId}`);
    } catch (error) {
      console.error('Failed to flush to D1:', error);
      // Don't throw - DO storage is authoritative, D1 flush is best-effort
    }
  }

  private broadcast(message: 
    | { type: 'state_update'; version: number; state: CampaignState }
    | { type: 'character_update'; version: number; characterId: string; character: CampaignCharacterLiveUpdate }
    | { type: 'characters_update'; version: number; characters: Record<string, CampaignCharacterLiveUpdate> }
    | { type: 'character_added'; version: number; character: DerivedCharacter }
    | { type: 'character_removed'; version: number; characterId: string }
    | { type: 'character_full_update'; version: number; characterId: string; character: DerivedCharacter }
    | { type: 'character_diff_update'; version: number; characterId: string; updates: CampaignCharacterLiveUpdate }
  ): void {
    const websockets = this.ctx.getWebSockets();
    for (const ws of websockets) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send message to WebSocket:', error);
      }
    }
  }

}

