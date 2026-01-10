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

interface WebSocketAttachment {
  connectedAt: number;
  userId: string;
  userRole: 'gm' | 'player';
}

/**
 * CampaignLiveDO is a broadcast-only Durable Object for real-time campaign synchronization.
 * 
 * D1 is the source of truth - clients always save to D1 first, then send updates here for broadcast.
 * This DO maintains in-memory state only for the current session to:
 * - Track version numbers for detecting stale clients on reconnect
 * - Cache state for broadcasting to other connected clients
 * 
 * No data is persisted to DO storage or flushed to D1 - that's the client's responsibility.
 */
export class CampaignLiveDO extends DurableObject<Env> {
  // In-memory cache for the current session (not persisted)
  private campaignState: CampaignState | null = null;
  private characters: Record<string, CampaignCharacterSummary> = {};
  private characterClaimable: Record<string, boolean> = {};
  // Version counter for detecting stale clients on reconnect
  private version = 0;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
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
      const body = await request.json() as HttpNotificationBody;
      
      switch (body.type) {
        case 'character_added':
          // Character added - update in-memory cache and broadcast
          if (body.characterId) {
            this.characterClaimable[body.characterId] = body.claimable ?? false;
            if (body.summary) {
              this.characters[body.characterId] = body.summary;
            }
            this.version++;
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
          this.removeCharacter(body.characterId);
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

  private handleWebSocketUpgrade(request: Request): Response {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    
    if (!server) {
      return new Response('Failed to create WebSocket pair', { status: 500 });
    }
    
    const userId = request.headers.get('X-User-Id') || '';
    const userRole = (request.headers.get('X-User-Role') || 'player') as 'gm' | 'player';
    
    const attachment: WebSocketAttachment = {
      connectedAt: Date.now(),
      userId,
      userRole
    };
    server.serializeAttachment(attachment);
    
    this.ctx.acceptWebSocket(server);
    
    // Send connected acknowledgment with current version
    // Client already has D1 data - this just confirms connection and provides version for future syncs
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

  override webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): void {
    try {
      const text = typeof message === 'string' ? message : new TextDecoder().decode(message);
      const data = JSON.parse(text);
      
      switch (data.type) {
        case 'rejoin':
          this.handleRejoin(ws, data.lastKnownVersion);
          break;
        case 'update_state':
          this.updateState(data.updates);
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
          
          this.updateCharacter(data.characterId, data.updates);
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

  override webSocketClose(_ws: WebSocket, _code: number, _reason: string, _wasClean: boolean): void {
    // No cleanup needed - D1 is the source of truth, clients already saved there
  }

  override webSocketError(_ws: WebSocket, error: unknown): void {
    console.error('WebSocket error in DO:', error);
  }

  private handleRejoin(ws: WebSocket, lastKnownVersion: number | undefined): void {
    if (lastKnownVersion === undefined || lastKnownVersion < this.version) {
      // Tell client to refresh from D1 (source of truth) instead of sending potentially stale DO cache
      ws.send(JSON.stringify({
        type: 'refresh_required',
        version: this.version
      }));
    } else {
      ws.send(JSON.stringify({
        type: 'already_synced',
        version: this.version
      }));
    }
  }

  private updateState(updates: Partial<CampaignState>): void {
    // Check for stale updates using timestamp
    if (updates.updated_at !== undefined && this.campaignState?.updated_at) {
      if (updates.updated_at <= this.campaignState.updated_at) {
        return; // Ignore stale update
      }
    }
    
    // Update in-memory cache
    if (this.campaignState) {
      this.campaignState = {
        ...this.campaignState,
        ...updates,
        updated_at: updates.updated_at ?? Date.now()
      };
    } else {
      // Initialize campaign state from first update
      this.campaignState = {
        campaign_id: '',
        fear_track: 0,
        fear_visible_to_players: false,
        notes: null,
        countdowns: [],
        invite_code: '',
        updated_at: Date.now(),
        ...updates
      };
    }
    
    this.version++;
    
    // Broadcast to all connected clients
    this.broadcast({
      type: 'state_update',
      version: this.version,
      state: this.campaignState
    });
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

  private removeCharacter(characterId: string): void {
    // Remove from in-memory cache
    delete this.characters[characterId];
    delete this.characterClaimable[characterId];
    
    this.version++;
    
    // Broadcast to all connected clients
    this.broadcast({
      type: 'character_removed',
      version: this.version,
      characterId
    });
  }

  private updateCharacter(characterId: string, updates: Partial<CampaignCharacterLiveUpdate>): void {
    // Update in-memory cache if character exists
    const existingChar = this.characters[characterId];
    if (existingChar) {
      this.characters[characterId] = this.deepMerge(existingChar, updates) as CampaignCharacterSummary;
    }
    
    this.version++;
    
    // Broadcast to all connected clients
    this.broadcast({
      type: 'character_diff_update',
      version: this.version,
      characterId,
      updates: updates as CampaignCharacterLiveUpdate,
      claimable: this.characterClaimable[characterId]
    });
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
