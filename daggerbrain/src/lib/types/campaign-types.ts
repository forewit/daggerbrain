// ============================================================================
// Campaign Types
// ============================================================================

import type {
	campaigns_table,
	campaign_members_table,
	campaign_state_table
} from '$lib/server/db/campaigns.schema';

export type Campaign = typeof campaigns_table.$inferSelect;
export type CampaignMember = typeof campaign_members_table.$inferSelect;
export type CampaignState = typeof campaign_state_table.$inferSelect;

export type CampaignCharacterSummary = {
	id: string;
	name: string;
	image_url: string;
	level: number;
	marked_hp: number;
	max_hp: number;
	marked_stress: number;
	max_stress: number;
	marked_hope: number;
	max_hope: number;
	active_conditions: string[];
	owner_user_id: string;
	owner_name?: string; // Optional display name
};

// Type for character updates - only the live-updated fields
export type CampaignCharacterLiveUpdate = Pick<
	CampaignCharacterSummary,
	'marked_hp' | 'marked_stress' | 'marked_hope' | 'active_conditions'
>;

// WebSocket message types for live campaign updates
export type CampaignLiveWebSocketMessage =
	| {
			type: 'connected';
			state: CampaignState | null;
			characters: Record<string, CampaignCharacterLiveUpdate>;
	  }
	| {
			type: 'state_update';
			state: CampaignState;
	  }
	| {
			type: 'characters_update';
			characters: Record<string, CampaignCharacterLiveUpdate>;
	  }
	| {
			type: 'character_update';
			characterId: string;
			character: CampaignCharacterLiveUpdate;
	  }
	| {
			type: 'error';
			message: string;
	  };

// WebSocket client-to-server message types
export type CampaignLiveClientMessage =
	| {
			type: 'update_state';
			updates: Partial<Pick<CampaignState, 'fear_track' | 'notes' | 'updated_at'>>;
	  }
	| {
			type: 'update_character';
			characterId: string;
			updates: Partial<CampaignCharacterLiveUpdate>;
	  };

