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

