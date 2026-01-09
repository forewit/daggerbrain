import { DurableObject } from "cloudflare:workers";
import type { CampaignState, CampaignCharacterSummary, CampaignCharacterLiveUpdate } from "$lib/types/campaign-types";

interface Env {
  DB: D1Database;
  KV: KVNamespace;
}

// HTTP notification body types - now uses CampaignCharacterSummary
type CharacterAddedNotification = {
  type: 'character_added';
  characterId: string;
  summary?: CampaignCharacterSummary;
  claimable?: boolean;
};

type CharacterUpdatedNotification = {
  type: 'character_updated';
  characterId: string;
  updates?: Partial<CampaignCharacterSummary>;
  claimable?: boolean;
};

type CharacterRemovedNotification = {
  type: 'character_removed' | 'character_deleted';
  characterId: string;
};

type MemberUpdatedNotification = {
  type: 'member_updated';
  userId: string;
  displayName: string | null;
};

type HttpNotificationBody = 
  | CharacterAddedNotification 
  | CharacterUpdatedNotification 
  | CharacterRemovedNotification
  | MemberUpdatedNotification;

// Simplified stored data - characters are now stored as CampaignCharacterSummary
// D1 is the source of truth, DO just caches for real-time updates
interface StoredData {
  state: CampaignState;
  characters: Record<string, CampaignCharacterSummary>;
  characterClaimable: Record<string, boolean>;
  version: number;
}

interface WebSocketAttachment {
  connectedAt: number;
  userId: string;
  userRole: 'gm' | 'player';
}

export class CampaignLiveDO extends DurableObject<Env> {
  private campaignState: CampaignState | null = null;
  // Store CampaignCharacterSummary objects (lightweight, not full DerivedCharacter)
  private characters: Record<string, CampaignCharacterSummary> = {};
  // Store claimable status separately (from campaign_characters table)
  private characterClaimable: Record<string, boolean> = {};
  private version = 0;
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private updateCount = 0;
  private readonly FLUSH_INTERVAL = 10;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.restoreState();
  }

  override async fetch(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader === 'websocket') {
      return this.handleWebSocketUpgrade(request);
    }

    if (request.method === 'POST') {
      return this.handleHttpNotification(request);
    }

    return new Response('Method not allowed', { status: 405 });
  }

  private async handleHttpNotification(request: Request): Promise<Response> {
    try {
      await this.ensureInitialized();
      
      const body = await request.json() as HttpNotificationBody;
      
      switch (body.type) {
        case 'character_added':
          // Character added - just update claimable status and broadcast
          // Full character data comes from D1 via get_campaign_characters
          if (body.characterId) {
            this.characterClaimable[body.characterId] = body.claimable ?? false;
            if (body.summary) {
              this.characters[body.characterId] = body.summary;
            }
            this.version++;
            await this.persistState();
            this.broadcast({
              type: 'character_added',
              version: this.version,
              character: body.summary ?? { id: body.characterId } as CampaignCharacterSummary,
              claimable: body.claimable
            });
          }
          break;

        case 'character_updated':
          if (!body.characterId) {
            return new Response(JSON.stringify({ error: 'characterId is required' }), { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Update claimable status if provided
          if (body.claimable !== undefined) {
            this.characterClaimable[body.characterId] = body.claimable;
          }
          
          // Apply partial updates to cached character
          if (body.updates && Object.keys(body.updates).length > 0) {
            const existingChar = this.characters[body.characterId];
            if (existingChar) {
              this.characters[body.characterId] = this.deepMerge(existingChar, body.updates) as CampaignCharacterSummary;
            }
            
            this.version++;
            this.updateCount++;
            await this.persistState();
            
            // Broadcast partial update
            this.broadcast({
              type: 'character_diff_update',
              version: this.version,
              characterId: body.characterId,
              updates: body.updates as CampaignCharacterLiveUpdate,
              claimable: this.characterClaimable[body.characterId]
            });
          } else if (body.claimable !== undefined) {
            // Just claimable status changed
            this.version++;
            await this.persistState();
            this.broadcast({
              type: 'character_diff_update',
              version: this.version,
              characterId: body.characterId,
              updates: {},
              claimable: body.claimable
            });
          }
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

        case 'member_updated':
          this.broadcastMemberUpdate(body.userId, body.displayName);
          break;

        default:
          return new Response(JSON.stringify({ error: 'Unknown notification type' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
      }
      
      if (this.updateCount >= this.FLUSH_INTERVAL) {
        await this.flushToD1();
        this.updateCount = 0;
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
    
    await this.ensureInitialized();
    
    const userId = request.headers.get('X-User-Id') || '';
    const userRole = (request.headers.get('X-User-Role') || 'player') as 'gm' | 'player';
    
    const attachment: WebSocketAttachment = {
      connectedAt: Date.now(),
      userId,
      userRole
    };
    server.serializeAttachment(attachment);
    
    this.ctx.acceptWebSocket(server);
    
    // Send initial state - now using CampaignCharacterSummary
    Promise.resolve().then(() => {
      try {
        server.send(JSON.stringify({
          type: 'connected',
          version: this.version,
          state: this.campaignState,
          characters: this.characters,
          characterClaimable: this.characterClaimable
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
          const attachment = ws.deserializeAttachment() as WebSocketAttachment;
          const character = this.characters[data.characterId];
          
          // Verify user can edit this character (owner or GM)
          if (character && character.owner_user_id !== attachment.userId && attachment.userRole !== 'gm') {
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
    const remainingConnections = this.ctx.getWebSockets();
    if (remainingConnections.length === 0) {
      await this.flushToD1();
    }
  }

  override async webSocketError(ws: WebSocket, error: unknown): Promise<void> {
    console.error('WebSocket error in DO:', error);
  }

  private async restoreState(): Promise<void> {
    const stored = await this.ctx.storage.get<StoredData>('data');
    
    if (stored) {
      this.campaignState = stored.state;
      if (!this.campaignState.countdowns) {
        this.campaignState.countdowns = [];
      }
      if (this.campaignState.fear_visible_to_players === undefined) {
        this.campaignState.fear_visible_to_players = false;
      }
      if (!this.campaignState.invite_code) {
        const campaignId = this.campaignState.campaign_id;
        if (campaignId && this.env.DB) {
          try {
            const result = await this.env.DB.prepare(
              'SELECT invite_code FROM campaign_state_table WHERE campaign_id = ?'
            ).bind(campaignId).first<{ invite_code: string }>();
            if (result?.invite_code) {
              this.campaignState.invite_code = result.invite_code;
              await this.persistState();
            }
          } catch (error) {
            console.error('Failed to load invite_code from D1:', error);
          }
        }
      }
      this.characters = stored.characters ?? {};
      this.characterClaimable = stored.characterClaimable ?? {};
      this.version = stored.version ?? 0;
      this.initialized = true;
      
      if (!this.campaignState.campaign_id) {
        const campaignIdFromName = this.ctx.id.name || '';
        if (campaignIdFromName) {
          this.campaignState.campaign_id = campaignIdFromName;
          await this.persistState();
        }
      }
    } else {
      const campaignId = this.ctx.id.name || '';
      let inviteCode = '';
      if (campaignId && this.env.DB) {
        try {
          const result = await this.env.DB.prepare(
            'SELECT invite_code FROM campaign_state_table WHERE campaign_id = ?'
          ).bind(campaignId).first<{ invite_code: string }>();
          if (result?.invite_code) {
            inviteCode = result.invite_code;
          }
        } catch (error) {
          console.error('Failed to load invite_code from D1:', error);
        }
      }
      this.campaignState = {
        campaign_id: campaignId,
        fear_track: 0,
        fear_visible_to_players: false,
        notes: null,
        countdowns: [],
        invite_code: inviteCode,
        updated_at: Date.now()
      };
      this.characters = {};
      this.characterClaimable = {};
      this.version = 0;
      this.initialized = true;
      
      // Note: Characters are loaded from D1 via get_campaign_characters on client
      // DO no longer initializes characters - it just stores updates during live sessions
      
      await this.persistState();
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    
    if (!this.initPromise) {
      this.initPromise = this.restoreState();
    }
    
    await this.initPromise;
  }

  private async handleRejoin(ws: WebSocket, lastKnownVersion: number | undefined): Promise<void> {
    await this.ensureInitialized();
    
    if (lastKnownVersion === undefined || lastKnownVersion < this.version) {
      ws.send(JSON.stringify({
        type: 'state_sync',
        version: this.version,
        state: this.campaignState,
        characters: this.characters,
        characterClaimable: this.characterClaimable
      }));
    } else if (lastKnownVersion === this.version) {
      ws.send(JSON.stringify({
        type: 'already_synced',
        version: this.version
      }));
    } else {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Version mismatch - client is ahead of server'
      }));
    }
  }

  private async updateState(updates: Partial<CampaignState>): Promise<void> {
    await this.ensureInitialized();
    
    if (!this.campaignState) return;
    
    if (updates.updated_at !== undefined && this.campaignState.updated_at) {
      if (updates.updated_at <= this.campaignState.updated_at) {
        return;
      }
    }
    
    this.campaignState = {
      ...this.campaignState,
      ...updates,
      updated_at: updates.updated_at ?? Date.now()
    };
    
    this.version++;
    this.updateCount++;
    
    await this.persistState();
    
    this.broadcast({
      type: 'state_update',
      version: this.version,
      state: this.campaignState
    });
    
    if (this.updateCount >= this.FLUSH_INTERVAL) {
      await this.flushToD1();
      this.updateCount = 0;
    }
  }

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
        output[key] = this.deepMerge(target[key], source[key] as Partial<T[Extract<keyof T, string>]>);
      } else {
        output[key] = source[key] as T[Extract<keyof T, string>];
      }
    }
    
    return output;
  }

  private async removeCharacter(characterId: string): Promise<void> {
    await this.ensureInitialized();
    
    if (!this.characters[characterId]) return;
    
    delete this.characters[characterId];
    delete this.characterClaimable[characterId];
    
    this.version++;
    this.updateCount++;
    
    await this.persistState();
    
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

  private async updateCharacter(characterId: string, updates: Partial<CampaignCharacterLiveUpdate>): Promise<void> {
    await this.ensureInitialized();
    
    const existingChar = this.characters[characterId];
    if (existingChar) {
      // Deep merge preserves the full object structure, just updating changed fields
      this.characters[characterId] = this.deepMerge(existingChar, updates) as CampaignCharacterSummary;
    }
    
    this.version++;
    this.updateCount++;
    
    await this.persistState();
    
    this.broadcast({
      type: 'character_diff_update',
      version: this.version,
      characterId,
      updates: updates as CampaignCharacterLiveUpdate,
      claimable: this.characterClaimable[characterId]
    });
    
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
      characterClaimable: this.characterClaimable,
      version: this.version
    };
    
    await this.ctx.storage.put('data', data);
  }

  private async flushToD1(): Promise<void> {
    if (!this.campaignState) return;
    
    try {
      const campaignId = this.campaignState.campaign_id;
      
      const stmt = this.env.DB.prepare(
        'UPDATE campaign_state_table SET fear_track = ?, fear_visible_to_players = ?, notes = ?, countdowns = ?, updated_at = ? WHERE campaign_id = ?'
      );
      
      await stmt.bind(
        this.campaignState.fear_track,
        this.campaignState.fear_visible_to_players ? 1 : 0,
        this.campaignState.notes,
        JSON.stringify(this.campaignState.countdowns ?? []),
        this.campaignState.updated_at,
        campaignId
      ).run();
      
      console.log(`Flushed campaign state to D1 for campaign ${campaignId}`);
    } catch (error) {
      console.error('Failed to flush to D1:', error);
    }
  }

  private broadcastMemberUpdate(userId: string, displayName: string | null): void {
    this.version++;
    
    this.broadcast({
      type: 'member_updated',
      version: this.version,
      userId,
      displayName
    });
  }

  private broadcast(message: 
    | { type: 'state_update'; version: number; state: CampaignState }
    | { type: 'character_update'; version: number; characterId: string; character: CampaignCharacterLiveUpdate; claimable?: boolean }
    | { type: 'characters_update'; version: number; characters: Record<string, CampaignCharacterLiveUpdate> }
    | { type: 'character_added'; version: number; character: CampaignCharacterSummary; claimable?: boolean }
    | { type: 'character_removed'; version: number; characterId: string }
    | { type: 'character_diff_update'; version: number; characterId: string; updates: CampaignCharacterLiveUpdate; claimable?: boolean }
    | { type: 'member_updated'; version: number; userId: string; displayName: string | null }
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
