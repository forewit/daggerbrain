import { DurableObject } from "cloudflare:workers";
import type { CampaignState, CampaignCharacterLiveUpdate } from "$lib/types/campaign-types";

interface Env {
  // Main worker URL for fetching initial state (optional - falls back to default if not set)
  MAIN_WORKER_URL?: string;
}

export class CampaignLiveDO extends DurableObject<Env> {
  private campaignState: CampaignState | null = null;
  // Store only the live-updated fields for characters
  private characters: Record<string, CampaignCharacterLiveUpdate> = {};
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  override async fetch(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader === 'websocket') {
      return this.handleWebSocketUpgrade(request);
    }

    // Handle HTTP requests
    const url = new URL(request.url);
    
    if (request.method === 'POST' && url.pathname === '/update') {
      return this.handleStateUpdate(request);
    }
    
    if (request.method === 'POST' && url.pathname === '/update-character') {
      return this.handleCharacterUpdate(request);
    }
    
    if (request.method === 'GET' && url.pathname === '/state') {
      return this.handleGetState();
    }

    return new Response('Not found', { status: 404 });
  }

  private async handleWebSocketUpgrade(request: Request): Promise<Response> {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    
    if (!server) {
      return new Response('Failed to create WebSocket pair', { status: 500 });
    }
    
    // Initialize state if needed (do this before accepting WebSocket)
    // Pass request URL so we can construct API endpoint
    await this.ensureInitialized(request.url);
    
    // Use ctx.acceptWebSocket() for hibernation support
    this.ctx.acceptWebSocket(server);
    
    // Send initial state to client after a brief delay to ensure WebSocket is ready
    // Using a microtask to send after the response is returned
    Promise.resolve().then(() => {
      try {
        server.send(JSON.stringify({
          type: 'connected',
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
    // Clean up if needed
  }

  override async webSocketError(ws: WebSocket, error: unknown): Promise<void> {
    console.error('WebSocket error in DO:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }

  private async ensureInitialized(requestUrl?: string): Promise<void> {
    if (this.initialized) return;
    
    // Use a promise to prevent concurrent initialization
    if (!this.initPromise) {
      this.initPromise = (async () => {
        if (this.initialized) return;
        
        // Try to load from storage first
        const stored = await this.ctx.storage.get<{
          state: CampaignState;
          characters: Record<string, CampaignCharacterLiveUpdate>;
        }>('data');
        
        if (stored && stored.state.campaign_id) {
          this.campaignState = stored.state;
          this.characters = stored.characters;
          this.initialized = true;
          return;
        }
        
        // If storage is empty, load initial state from main worker API
        // The campaign ID is the DO's name (set via idFromName)
        const campaignId = this.ctx.id.name;
        if (campaignId && requestUrl) {
          try {
            // Construct API URL from request origin
            const url = new URL(requestUrl);
            const baseUrl = `${url.protocol}//${url.host}`;
            const apiUrl = `${baseUrl}/api/campaigns/${campaignId}/state/initial`;
            
            const response = await fetch(apiUrl);
            if (response.ok) {
              const data = await response.json() as {
                state: CampaignState;
                characters: Record<string, { marked_hp?: number; marked_stress?: number; marked_hope?: number; active_conditions?: string[] }>;
              };
              
              this.campaignState = data.state;
              // Convert full character summaries to live updates (only keep live-updated fields)
              this.characters = {};
              for (const [id, char] of Object.entries(data.characters || {})) {
                this.characters[id] = {
                  marked_hp: char.marked_hp ?? 0,
                  marked_stress: char.marked_stress ?? 0,
                  marked_hope: char.marked_hope ?? 0,
                  active_conditions: char.active_conditions ?? []
                };
              }
              
              // Persist to storage
              await this.ctx.storage.put('data', {
                state: this.campaignState,
                characters: this.characters
              });
              
              this.initialized = true;
              return;
            }
          } catch (error) {
            console.error('Failed to load initial state from API:', error);
            // Fall through to default initialization
          }
        }
        
        // Fallback: initialize with defaults if API fetch fails or campaign ID unavailable
        // The first update will set the correct state
        this.campaignState = {
          campaign_id: campaignId || '',
          fear_track: 0,
          notes: null,
          updated_at: Date.now()
        };
        this.characters = {};
        this.initialized = true;
      })();
    }
    
    await this.initPromise;
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
    
    // Persist to storage
    await this.ctx.storage.put('data', {
      state: this.campaignState,
      characters: this.characters
    });
    
    // Broadcast to all connected WebSockets
    this.broadcast({
      type: 'state_update',
      state: this.campaignState
    });
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
    
    // Persist to storage
    await this.ctx.storage.put('data', {
      state: this.campaignState!,
      characters: this.characters
    });
    
    // Broadcast to all connected WebSockets
    this.broadcast({
      type: 'character_update',
      characterId,
      character: this.characters[characterId]
    });
  }

  private broadcast(message: 
    | { type: 'state_update'; state: CampaignState }
    | { type: 'character_update'; characterId: string; character: CampaignCharacterLiveUpdate }
    | { type: 'characters_update'; characters: Record<string, CampaignCharacterLiveUpdate> }
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

  private async handleStateUpdate(request: Request): Promise<Response> {
    try {
      const updates: Partial<CampaignState> = await request.json();
      await this.updateState(updates);
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  private async handleGetState(): Promise<Response> {
    await this.ensureInitialized();
    return new Response(JSON.stringify({
      state: this.campaignState,
      characters: this.characters
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async handleCharacterUpdate(request: Request): Promise<Response> {
    try {
      const body: { characterId?: string; updates?: Partial<CampaignCharacterLiveUpdate> } = await request.json();
      const { characterId, updates } = body;
      if (!characterId) {
        return new Response(JSON.stringify({ error: 'characterId required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (!updates) {
        return new Response(JSON.stringify({ error: 'updates required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      await this.updateCharacter(characterId, updates);
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}

