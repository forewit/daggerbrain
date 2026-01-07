// ============================================================================
// Campaign Types
// ============================================================================

import type {
	campaigns_table,
	campaign_members_table,
	campaign_state_table
} from '$lib/server/db/campaigns.schema';
import type { DerivedDescriptors } from './character-types';
import type { DerivedCharacter } from './derived-character-types';

export type Campaign = typeof campaigns_table.$inferSelect;
export type CampaignMember = typeof campaign_members_table.$inferSelect;
export type CampaignState = typeof campaign_state_table.$inferSelect;

export type Countdown = {
	id: string; // Unique identifier for each countdown
	name: string;
	min: number;
	max?: number; // Optional - if not set, countdown can go as high as needed
	current: number;
	visibleToPlayers: boolean;
};

export type CampaignWithDetails = Campaign & {
	user_role: 'gm' | 'player';
	player_count: number;
	character_images: string[];
};

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
	claimable: boolean;
};

// Type for character updates - partial diff of DerivedCharacter (all fields optional)
// Represents only the changed fields when updating a character
export type CampaignCharacterLiveUpdate = Partial<DerivedCharacter>;

// WebSocket message types for live campaign updates
export type CampaignLiveWebSocketMessage =
	| {
			type: 'connected';
			version: number;
			state: CampaignState | null;
			characters: Record<string, DerivedCharacter>;
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
			characters: Record<string, DerivedCharacter>;
			characterClaimable?: Record<string, boolean>;
	  }
	| {
			type: 'already_synced';
			version: number;
	  }
	| {
			type: 'character_added';
			version: number;
			character: DerivedCharacter;
			claimable?: boolean;
	  }
	| {
			type: 'character_removed';
			version: number;
			characterId: string;
	  }
	| {
			type: 'character_full_update';
			version: number;
			characterId: string;
			character: DerivedCharacter;
			claimable?: boolean;
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
	  };

// WebSocket client-to-server message types
export type CampaignLiveClientMessage =
	| {
			type: 'rejoin';
			lastKnownVersion?: number;
	  }
	| {
			type: 'update_state';
			updates: Partial<Pick<CampaignState, 'fear_track' | 'notes' | 'countdowns' | 'updated_at'>>;
	  }
	| {
			type: 'update_character';
			characterId: string;
			userId: string;
			updates: Partial<CampaignCharacterLiveUpdate>;
	  };
