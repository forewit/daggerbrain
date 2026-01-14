import { z } from "zod";

// ============================================================================
// Countdown Schema
// ============================================================================

export const CountdownSchema = z.object({
  id: z.string(),
  name: z.string(),
  min: z.number(),
  current: z.number(),
  visibleToPlayers: z.boolean(),
});

// ============================================================================
// Derived Character Summary Schema
// ============================================================================

export const DerivedCharacterSummarySchema = z.object({
  // Name descriptors
  ancestry_name: z.string(),
  primary_class_name: z.string(),
  primary_subclass_name: z.string(),
  secondary_class_name: z.string(),
  secondary_subclass_name: z.string(),

  // Derived stats for campaign preview
  max_hp: z.number(),
  max_stress: z.number(),
  max_hope: z.number(),
  evasion: z.number(),
  max_armor: z.number(),
  damage_thresholds: z.object({
    major: z.number(),
    severe: z.number(),
  }),
});

// ============================================================================
// Campaign Character Summary Schema
// ============================================================================

export const CampaignCharacterSummarySchema = z.object({
  // Base character fields
  id: z.string(),
  name: z.string(),
  image_url: z.string(),
  level: z.number(),
  marked_hp: z.number(),
  marked_stress: z.number(),
  marked_hope: z.number(),
  marked_armor: z.number(),
  active_conditions: z.array(z.string()),

  // Ownership fields (from joins)
  owner_user_id: z.string(),
  owner_name: z.string().optional(),

  // Derived stats summary
  derived_character_summary: DerivedCharacterSummarySchema,

  // Campaign-specific field
  claimable: z.boolean(),
});

// ============================================================================
// Campaign Character Live Update Schema (partial)
// ============================================================================

export const CampaignCharacterLiveUpdateSchema =
  CampaignCharacterSummarySchema.partial();

// ============================================================================
// Campaign State Update Schema (partial, only updatable fields)
// ============================================================================

export const CampaignStateUpdateSchema = z.object({
  fear_track: z.number().optional(),
  fear_visible_to_players: z.boolean().optional(),
  notes: z.string().nullable().optional(),
  countdowns: z.array(CountdownSchema).optional(),
  updated_at: z.number().optional(),
});

// ============================================================================
// WebSocket Client Message Schema
// ============================================================================

export const WebSocketClientMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("rejoin"),
    lastKnownVersion: z.number().optional(),
  }),
  z.object({
    type: z.literal("update_state"),
    updates: CampaignStateUpdateSchema,
  }),
  z.object({
    type: z.literal("update_character"),
    characterId: z.string(),
    updates: CampaignCharacterLiveUpdateSchema,
  }),
]);

// ============================================================================
// HTTP Notification Body Schema
// ============================================================================

export const HttpNotificationBodySchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("character_added"),
    characterId: z.string(),
    summary: CampaignCharacterSummarySchema.optional(),
    claimable: z.boolean().optional(),
  }),
  z.object({
    type: z.literal("character_updated"),
    characterId: z.string(),
    updates: CampaignCharacterLiveUpdateSchema.optional(),
    claimable: z.boolean().optional(),
  }),
  z.object({
    type: z.literal("character_removed"),
    characterId: z.string(),
  }),
  z.object({
    type: z.literal("character_deleted"),
    characterId: z.string(),
  }),
  z.object({
    type: z.literal("member_updated"),
    userId: z.string(),
    displayName: z.string().nullable(),
  }),
]);
