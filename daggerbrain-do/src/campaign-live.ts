import { DurableObject } from "cloudflare:workers";
import type {
  CampaignState,
  CampaignCharacterSummary,
  CampaignCharacterLiveUpdate,
  CampaignLiveWebSocketMessage,
} from "@shared/types/campaign.types";
import {
  HttpNotificationBodySchema,
  WebSocketClientMessageSchema,
} from "@shared/schemas/campaign-live.schemas";

interface WebSocketAttachment {
  connectedAt: number;
  userId: string;
  userRole: "gm" | "player";
}

// Storage keys for persistent state
const STORAGE_KEYS = {
  CAMPAIGN_STATE: "campaignState",
  CHARACTERS: "characters",
  CHARACTER_CLAIMABLE: "characterClaimable",
  VERSION: "version",
} as const;

/**
 * CampaignLiveDO is a broadcast-only Durable Object for real-time campaign synchronization.
 *
 * D1 is the source of truth - clients always save to D1 first, then send updates here for broadcast.
 * This DO maintains state in both memory and persistent storage to:
 * - Track version numbers for detecting stale clients on reconnect
 * - Cache state for broadcasting to other connected clients
 * - Resume state after eviction/re-instantiation
 *
 * State is persisted to DO storage so it can be rehydrated when the DO is re-instantiated.
 * Clients/server are responsible for maintaining the actual D1 state.
 */
export class CampaignLiveDO extends DurableObject<Env> {
  // In-memory state (also persisted to storage)
  private campaignState: CampaignState | null = null;
  private characters: Record<string, CampaignCharacterSummary> = {};
  private characterClaimable: Record<string, boolean> = {};
  // Version counter for detecting stale clients on reconnect
  private version = 0;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    
    // Rehydrate state from storage before handling any requests
    // blockConcurrencyWhile ensures no requests are processed until initialization completes
    ctx.blockConcurrencyWhile(async () => {
      await this.loadState();
    });
  }

  /**
   * Load state from persistent storage.
   * Called during constructor initialization to rehydrate state after eviction.
   */
  private async loadState(): Promise<void> {
    try {
      const [campaignState, characters, characterClaimable, version] = await Promise.all([
        this.ctx.storage.get<CampaignState | null>(STORAGE_KEYS.CAMPAIGN_STATE),
        this.ctx.storage.get<Record<string, CampaignCharacterSummary>>(STORAGE_KEYS.CHARACTERS),
        this.ctx.storage.get<Record<string, boolean>>(STORAGE_KEYS.CHARACTER_CLAIMABLE),
        this.ctx.storage.get<number>(STORAGE_KEYS.VERSION),
      ]);

      this.campaignState = campaignState ?? null;
      this.characters = characters ?? {};
      this.characterClaimable = characterClaimable ?? {};
      this.version = version ?? 0;

      console.log(
        `[CampaignLiveDO] State rehydrated: version=${this.version}, ` +
        `characters=${Object.keys(this.characters).length}, ` +
        `state=${this.campaignState ? "present" : "null"}`
      );
    } catch (error) {
      console.error("[CampaignLiveDO] Error loading state from storage:", error);
      // On error, start with empty state (version 0)
      this.campaignState = null;
      this.characters = {};
      this.characterClaimable = {};
      this.version = 0;
    }
  }

  /**
   * Increment version and save state to storage.
   * Helper method to eliminate duplication of this common pattern.
   */
  private async incrementVersionAndSave(): Promise<void> {
    this.version++;
    try {
      await this.ctx.storage.put({
        [STORAGE_KEYS.CAMPAIGN_STATE]: this.campaignState,
        [STORAGE_KEYS.CHARACTERS]: this.characters,
        [STORAGE_KEYS.CHARACTER_CLAIMABLE]: this.characterClaimable,
        [STORAGE_KEYS.VERSION]: this.version,
      });
    } catch (error) {
      console.error("[CampaignLiveDO] Error saving state to storage:", error);
      // Don't throw - state updates should continue even if persistence fails
      // The DO will still work for the current session, just won't persist across evictions
    }
  }

  /**
   * Create a JSON response with the given data and status code.
   */
  private jsonResponse(data: unknown, status: number): Response {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  /**
   * Create an error response with a message, status code, and optional details.
   */
  private errorResponse(message: string, status: number, details?: unknown): Response {
    return this.jsonResponse(
      {
        error: message,
        ...(details !== undefined && { details }),
      },
      status
    );
  }

  /**
   * Get WebSocket attachment with proper type safety.
   * Throws if attachment is missing or invalid.
   */
  private getWebSocketAttachment(ws: WebSocket): WebSocketAttachment {
    const attachment = ws.deserializeAttachment();
    if (!attachment || typeof attachment !== "object") {
      throw new Error("WebSocket attachment missing or invalid");
    }
    const typedAttachment = attachment as WebSocketAttachment;
    if (!typedAttachment.userId || !typedAttachment.userRole) {
      throw new Error("WebSocket attachment missing required fields");
    }
    return typedAttachment;
  }

  override async fetch(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader === "websocket") {
      return this.handleWebSocketUpgrade(request);
    }

    if (request.method === "POST") {
      return this.handleHttpNotification(request);
    }

    return new Response("Method not allowed", { status: 405 });
  }

  private async handleHttpNotification(request: Request): Promise<Response> {
    try {
      const rawBody = await request.json();
      const parseResult = HttpNotificationBodySchema.safeParse(rawBody);

      if (!parseResult.success) {
        console.error("Invalid HTTP notification body:", parseResult.error.issues);
        return this.errorResponse("Invalid request body", 400, parseResult.error.issues);
      }

      const body = parseResult.data;

      switch (body.type) {
        case "character_added": {
          // If summary is not provided, we can't broadcast properly
          // Character is already in D1 (source of truth), so clients can refresh from there
          if (!body.summary) {
            break;
          }

          // Character added - update in-memory cache and broadcast
          const claimable = body.claimable ?? false;
          this.characterClaimable[body.characterId] = claimable;
          this.characters[body.characterId] = body.summary;
          
          await this.incrementVersionAndSave();
          this.broadcast({
            type: "character_added",
            version: this.version,
            character: body.summary,
            claimable: this.characterClaimable[body.characterId],
          });
          break;
        }

        case "character_updated": {
          // Track if any changes were made
          let hasChanges = false;
          const updates: CampaignCharacterLiveUpdate = {};

          // Update claimable status if provided
          if (body.claimable !== undefined) {
            this.characterClaimable[body.characterId] = body.claimable;
            hasChanges = true;
          }

          // Apply partial updates to cached character
          if (body.updates && Object.keys(body.updates).length > 0) {
            const existingChar = this.characters[body.characterId];
            if (existingChar) {
              this.characters[body.characterId] = this.mergeCharacterUpdate(
                existingChar,
                body.updates
              );
            }
            Object.assign(updates, body.updates);
            hasChanges = true;
          }

          // Only broadcast if there were actual changes
          if (hasChanges) {
            await this.incrementVersionAndSave();
            this.broadcast({
              type: "character_diff_update",
              version: this.version,
              characterId: body.characterId,
              updates,
              claimable: this.characterClaimable[body.characterId],
            });
          }
          break;
        }

        case "character_removed":
        case "character_deleted":
          await this.removeCharacter(body.characterId);
          break;

        case "member_updated":
          await this.updateMember(body.userId, body.displayName);
          
          break;
      }

      return this.jsonResponse({ success: true }, 200);
    } catch (error) {
      console.error("Error handling HTTP notification:", error);
      return this.errorResponse(
        error instanceof Error ? error.message : "Unknown error",
        500
      );
    }
  }

  private handleWebSocketUpgrade(request: Request): Response {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    if (!server) {
      return this.errorResponse("Failed to create WebSocket pair", 500);
    }

    const userId = request.headers.get("X-User-Id");
    if (!userId || userId.trim() === "") {
      return this.errorResponse("Missing required X-User-Id header", 400);
    }

    const userRole = (request.headers.get("X-User-Role") || "player") as "gm" | "player";

    const attachment: WebSocketAttachment = {
      connectedAt: Date.now(),
      userId,
      userRole,
    };
    server.serializeAttachment(attachment);

    this.ctx.acceptWebSocket(server);

    // Send connected acknowledgment with current version
    // Client already has D1 data - this just confirms connection and provides version for future syncs
    Promise.resolve().then(() => {
      try {
        server.send(
          JSON.stringify({
            type: "connected",
            version: this.version,
            state: this.campaignState,
            characters: this.characters,
            characterClaimable: this.characterClaimable,
          })
        );
      } catch (error) {
        console.error("Failed to send initial WebSocket message:", error);
      }
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  private sendWebSocketError(ws: WebSocket, message: string): void {
    try {
      ws.send(JSON.stringify({ type: "error", message }));
    } catch (error) {
      console.error("Failed to send WebSocket error:", error);
    }
  }

  override async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    try {
      const text = typeof message === "string" ? message : new TextDecoder().decode(message);
      const rawData = JSON.parse(text);

      const parseResult = WebSocketClientMessageSchema.safeParse(rawData);

      if (!parseResult.success) {
        console.error("Invalid WebSocket message:", parseResult.error.issues);
        this.sendWebSocketError(
          ws,
          `Invalid message: ${parseResult.error.issues.map((i) => i.message).join(", ")}`
        );
        return;
      }

      const data = parseResult.data;

      switch (data.type) {
        case "rejoin":
          this.handleRejoin(ws, data.lastKnownVersion);
          break;
        case "update_state": {
          const attachment = this.getWebSocketAttachment(ws);
          
          // Only GMs can update campaign state (fear_track, fear_visible_to_players, notes, countdowns)
          if (attachment.userRole !== "gm") {
            this.sendWebSocketError(ws, "Not authorized to update campaign state");
            return;
          }
          
          await this.updateState(data.updates);
          break;
        }
        case "update_character": {
          const attachment = this.getWebSocketAttachment(ws);
          const character = this.characters[data.characterId];

          // Character must exist in cache to verify authorization
          // If not in cache, reject the update (client should refresh from D1 first)
          if (!character) {
            this.sendWebSocketError(
              ws,
              "Character not found in cache. Please refresh and try again."
            );
            return;
          }

          // Verify user can edit this character (owner or GM)
          if (
            character.owner_user_id !== attachment.userId &&
            attachment.userRole !== "gm"
          ) {
            this.sendWebSocketError(ws, "Not authorized to edit this character");
            return;
          }

          await this.updateCharacter(data.characterId, data.updates);
          break;
        }
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
      this.sendWebSocketError(
        ws,
        error instanceof Error ? error.message : "Invalid message"
      );
    }
  }

  private handleRejoin(ws: WebSocket, lastKnownVersion: number | undefined): void {
    if (lastKnownVersion === undefined || lastKnownVersion !== this.version) {
      // Tell client to refresh from D1 (source of truth) instead of sending potentially stale DO cache
      // This handles: undefined version, client behind (lastKnownVersion < this.version), or DO restarted (lastKnownVersion > this.version)
      ws.send(
        JSON.stringify({
          type: "refresh_required",
          version: this.version,
        })
      );
    } else {
      // Versions match exactly - client is in sync
      ws.send(
        JSON.stringify({
          type: "already_synced",
          version: this.version,
        })
      );
    }
  }

  private async updateState(updates: Partial<CampaignState>): Promise<void> {
    // If state is not initialized, initialize it from the first update
    // Since the client has already saved to D1 (source of truth), we can trust this update
    if (!this.campaignState) {
      // Get campaign ID from the DO's ID (created using idFromName)
      const campaignId = this.ctx.id.name || "";
      
      // Initialize state from the update with sensible defaults
      // Note: invite_code will be a placeholder until state is properly synced from D1
      // This is acceptable since D1 is the source of truth and this is just a cache
      this.campaignState = {
        campaign_id: campaignId,
        fear_track: updates.fear_track ?? 0,
        fear_visible_to_players: updates.fear_visible_to_players ?? false,
        notes: updates.notes ?? null,
        countdowns: updates.countdowns ?? [],
        invite_code: "", // Placeholder - will be updated when state syncs from D1
        updated_at: updates.updated_at ?? Date.now(),
      };
      
      console.log(
        `[CampaignLiveDO] Initialized campaign state from first update: campaign_id=${campaignId}`
      );
    } else {
      // Check for stale updates using timestamp
      if (updates.updated_at !== undefined && this.campaignState.updated_at) {
        if (updates.updated_at <= this.campaignState.updated_at) {
          return; // Ignore stale update
        }
      }

      // Update in-memory cache
      this.campaignState = {
        ...this.campaignState,
        ...updates,
        updated_at: updates.updated_at ?? Date.now(),
      };
    }

    await this.incrementVersionAndSave();

    // Broadcast to all connected clients
    this.broadcast({
      type: "state_update",
      version: this.version,
      state: this.campaignState,
    });
  }

  /**
   * Merge partial updates into a full CampaignCharacterSummary.
   * Handles the nested derived_character_summary object specially to allow partial updates.
   */
  private mergeCharacterUpdate(
    target: CampaignCharacterSummary,
    updates: Partial<CampaignCharacterSummary>
  ): CampaignCharacterSummary {
    const result = { ...target, ...updates };

    // If derived_character_summary is being updated, merge it instead of replacing
    if (updates.derived_character_summary !== undefined) {
      result.derived_character_summary = {
        ...target.derived_character_summary,
        ...updates.derived_character_summary,
      };
    }

    return result;
  }

  private async removeCharacter(characterId: string): Promise<void> {
    // Remove from in-memory cache
    delete this.characters[characterId];
    delete this.characterClaimable[characterId];

    await this.incrementVersionAndSave();

    // Broadcast to all connected clients
    this.broadcast({
      type: "character_removed",
      version: this.version,
      characterId,
    });
  }

  private async updateCharacter(
    characterId: string,
    updates: Partial<CampaignCharacterLiveUpdate>
  ): Promise<void> {
    // Update in-memory cache if character exists
    const existingChar = this.characters[characterId];
    if (existingChar) {
      this.characters[characterId] = this.mergeCharacterUpdate(
        existingChar,
        updates
      );
    }

    await this.incrementVersionAndSave();

    // Broadcast to all connected clients
    this.broadcast({
      type: "character_diff_update",
      version: this.version,
      characterId,
      updates,
      claimable: this.characterClaimable[characterId],
    });
  }

  private async updateMember(userId: string, displayName: string | null): Promise<void> {
    await this.incrementVersionAndSave();

    this.broadcast({
      type: "member_updated",
      version: this.version,
      userId,
      displayName,
    });
  }

  private broadcast(message: CampaignLiveWebSocketMessage): void {
    const websockets = this.ctx.getWebSockets();
    for (const ws of websockets) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error("Failed to send message to WebSocket:", error);
      }
    }
  }
}