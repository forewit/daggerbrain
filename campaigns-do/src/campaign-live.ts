import { DurableObject } from "cloudflare:workers";
import type { CampaignState, CampaignCharacterLiveUpdate } from "$lib/types/campaign-types";

interface Env {
  DB: D1Database;
}

interface StoredData {
  state: CampaignState;
  characters: Record<string, CampaignCharacterLiveUpdate>;
  version: number;
}

interface WebSocketAttachment {
  connectedAt: number;
}

export class CampaignLiveDO extends DurableObject<Env> {
  private campaignState: CampaignState | null = null;
  // Store only the live-updated fields for characters
  private characters: Record<string, CampaignCharacterLiveUpdate> = {};
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

    // Only WebSocket upgrades are supported
    return new Response('Expected WebSocket upgrade', { status: 426 });
  }

  private async handleWebSocketUpgrade(request: Request): Promise<Response> {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    
    if (!server) {
      return new Response('Failed to create WebSocket pair', { status: 500 });
    }
    
    // Ensure state is initialized before accepting WebSocket
    await this.ensureInitialized();
    
    // Store connection metadata in WebSocket attachment for hibernation
    const attachment: WebSocketAttachment = {
      connectedAt: Date.now()
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
      
      // Persist initial state
      await this.persistState();
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

  private async updateCharacter(characterId: string, updates: Partial<CampaignCharacterLiveUpdate>): Promise<void> {
    await this.ensureInitialized();
    
    // Merge updates with existing character data (or create new if doesn't exist)
    if (!this.characters[characterId]) {
      // Character doesn't exist yet - create with updates
      // Only store the live-updated fields
      this.characters[characterId] = {
        marked_hp: updates.marked_hp ?? 0,
        marked_stress: updates.marked_stress ?? 0,
        marked_hope: updates.marked_hope ?? 0,
        active_conditions: updates.active_conditions ?? []
      };
    } else {
      this.characters[characterId] = {
        ...this.characters[characterId],
        ...updates
      };
    }
    
    // Increment version on character update
    this.version++;
    this.updateCount++;
    
    // Persist to storage (batched - only when characters change)
    await this.persistState();
    
    // Broadcast to all connected WebSockets
    this.broadcast({
      type: 'character_update',
      version: this.version,
      characterId,
      character: this.characters[characterId]
    });
    
    // Flush to D1 periodically
    if (this.updateCount >= this.FLUSH_INTERVAL) {
      await this.flushToD1();
      this.updateCount = 0;
    }
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

