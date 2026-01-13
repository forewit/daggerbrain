// ============================================================================
// Campaign Types
// ============================================================================

import type {
	campaigns_table,
	campaign_members_table,
	campaign_state_table
} from '$lib/server/db/campaigns.schema';
import type { DerivedCharacterSummary } from './character-types';

export type Campaign = typeof campaigns_table.$inferSelect;
export type CampaignMember = typeof campaign_members_table.$inferSelect;
export type CampaignState = typeof campaign_state_table.$inferSelect;

export type Countdown = {
	id: string; // Unique identifier for each countdown
	name: string;
	min: number;
	current: number;
	visibleToPlayers: boolean;
};

export type CampaignWithDetails = Campaign & {
	user_role: 'gm' | 'player';
	player_count: number;
	character_images: string[];
};

export type CampaignJoinPreview = {
	campaignId: string;
	campaignName: string;
	campaignCreatedAt: number;
	gmDisplayName: string | null;
	isMember: boolean;
	characterImages: string[];
	playerCount: number;
	userRole: 'gm' | 'player' | null;
};

/**
 * Summary of a character for campaign view.
 * Combines base character fields with derived stats from DerivedCharacterSummary.
 * This is the primary type used for displaying characters in campaign context.
 */
export type CampaignCharacterSummary = {
	// Base character fields
	id: string;
	name: string;
	image_url: string;
	level: number;
	marked_hp: number;
	marked_stress: number;
	marked_hope: number;
	marked_armor: number;
	active_conditions: string[];

	// Ownership fields (from joins)
	owner_user_id: string;
	owner_name?: string; // Optional display name from campaign_members

	// Derived stats summary (stored in D1, computed client-side)
	derived_character_summary: DerivedCharacterSummary;

	// Campaign-specific field (from campaign_characters table)
	claimable: boolean;
};

// Type for character updates - partial diff of CampaignCharacterSummary
// Represents only the changed fields when updating a character via WebSocket
export type CampaignCharacterLiveUpdate = Partial<CampaignCharacterSummary>;

// WebSocket message types for live campaign updates
export type CampaignLiveWebSocketMessage =
	| {
			type: 'connected';
			version: number;
			state: CampaignState | null;
			characters: Record<string, CampaignCharacterSummary>;
			characterClaimable?: Record<string, boolean>;
	  }
	| {
			type: 'state_update';
			version: number;
			state: CampaignState;
	  }
	| {
			type: 'characters_update';
			version: number;
			characters: Record<string, CampaignCharacterLiveUpdate>;
	  }
	| {
			type: 'character_update';
			version: number;
			characterId: string;
			character: CampaignCharacterLiveUpdate;
			claimable?: boolean;
	  }
	| {
			type: 'state_sync';
			version: number;
			state: CampaignState | null;
			characters: Record<string, CampaignCharacterSummary>;
			characterClaimable?: Record<string, boolean>;
	  }
	| {
			type: 'already_synced';
			version: number;
	  }
	| {
			type: 'character_added';
			version: number;
			character: CampaignCharacterSummary;
			claimable?: boolean;
	  }
	| {
			type: 'character_removed';
			version: number;
			characterId: string;
	  }
	| {
			type: 'character_diff_update';
			version: number;
			characterId: string;
			updates: CampaignCharacterLiveUpdate;
			claimable?: boolean;
	  }
	| {
			type: 'member_updated';
			version: number;
			userId: string;
			displayName: string | null;
	  }
	| {
			type: 'error';
			message: string;
	  }
	| {
			type: 'refresh_required';
			version: number;
	  };

// WebSocket client-to-server message types
export type CampaignLiveClientMessage =
	| {
			type: 'rejoin';
			lastKnownVersion?: number;
	  }
	| {
			type: 'update_state';
			updates: Partial<
				Pick<
					CampaignState,
					'fear_track' | 'fear_visible_to_players' | 'notes' | 'countdowns' | 'updated_at'
				>
			>;
	  }
	| {
			type: 'update_character';
			characterId: string;
			userId: string;
			updates: Partial<CampaignCharacterLiveUpdate>;
	  };
