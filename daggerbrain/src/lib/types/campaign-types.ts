// ============================================================================
// Campaign Types
// ============================================================================

import type {
	campaigns_table,
	campaign_members_table,
	campaign_state_table
} from '$lib/server/db/campaigns.schema';
import type { DerivedDescriptors } from './character-types';

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
	derived_descriptors: DerivedDescriptors;
	evasion: number;
	max_armor: number;
	marked_armor: number;
	damage_thresholds: { major: number; severe: number };
};

// Type for character updates - only the live-updated fields
export type CampaignCharacterLiveUpdate = Pick<
	CampaignCharacterSummary,
	'marked_hp' | 'marked_stress' | 'marked_hope' | 'marked_armor' | 'active_conditions'
>;

// WebSocket message types for live campaign updates
export type CampaignLiveWebSocketMessage =
	| {
			type: 'connected';
			version: number;
			state: CampaignState | null;
			characters: Record<string, CampaignCharacterLiveUpdate>;
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
	  }
	| {
			type: 'state_sync';
			version: number;
			state: CampaignState | null;
			characters: Record<string, CampaignCharacterLiveUpdate>;
	  }
	| {
			type: 'already_synced';
			version: number;
	  }
	| {
			type: 'error';
			message: string;
	  };

// WebSocket client-to-server message types
export type CampaignLiveClientMessage =
	| {
			type: 'rejoin';
			lastKnownVersion?: number;
	  }
	| {
			type: 'update_state';
			updates: Partial<Pick<CampaignState, 'fear_track' | 'notes' | 'updated_at'>>;
	  }
	| {
			type: 'update_character';
			characterId: string;
			updates: Partial<CampaignCharacterLiveUpdate>;
	  };

