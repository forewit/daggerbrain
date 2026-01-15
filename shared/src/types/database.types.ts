import type { Countdown } from './campaign.types';

/**
 * Database Types
 * 
 * Manual type definitions matching the drizzle-orm schema structure.
 * These types are used by both daggerbrain (which has drizzle) and daggerbrain-do (which doesn't).
 */

export type Campaign = {
	id: string;
	gm_user_id: string;
	name: string;
	description: string | null;
	created_at: number;
	updated_at: number;
};

export type CampaignMember = {
	campaign_id: string;
	user_id: string;
	role: 'gm' | 'player';
	display_name: string | null;
	joined_at: number;
};

export type CampaignState = {
	campaign_id: string;
	fear_track: number;
	fear_visible_to_players: boolean;
	notes: string | null;
	countdowns: Countdown[];
	invite_code: string;
	updated_at: number;
};

export type CampaignCharacter = {
	campaign_id: string;
	character_id: string;
	claimable: number; // 0 or 1 (boolean stored as integer in SQLite)
	added_at: number;
};

export type CampaignHomebrewVault = {
	id: string;
	campaign_id: string;
	homebrew_type: string;
	homebrew_id: string;
	added_at: number;
};
