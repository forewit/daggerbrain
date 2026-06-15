import { z } from 'zod';
import { zid } from 'convex-helpers/server/zod4';
import { CountdownSchema, FearSchema } from './rules';
import { CompendiumContentIdsSchema } from './compendium';

export const CampaignMemberRoleSchema = z.enum(['GM', 'Player']);
export type CampaignMemberRole = z.infer<typeof CampaignMemberRoleSchema>;

export const CampaignMemberSchema = z.object({
	clerk_id: z.string(),
	display_name: z.string(),
	role: CampaignMemberRoleSchema
});
export type CampaignMember = z.infer<typeof CampaignMemberSchema>;

export const CampaignCharacterStatusSchema = z.enum(['active', 'unclaimed']);
export type CampaignCharacterStatus = z.infer<typeof CampaignCharacterStatusSchema>;

export const CampaignCharacterSchema = z.object({
	character_id: zid('characters'),
	status: CampaignCharacterStatusSchema,
	claimed_by_clerk_id: z.string().optional()
});
export type CampaignCharacter = z.infer<typeof CampaignCharacterSchema>;

export const CampaignSchema = z.object({
	name: z.string(),
	fear_track: FearSchema,
	countdowns: z.array(CountdownSchema),
	homebrew_vault: CompendiumContentIdsSchema,
	fear_visible_to_players: z.boolean().optional(),
	public_notes: z.string().optional(),
	private_notes: z.string().optional(),
	current_encounter_id: zid('encounters').optional()
});
export type Campaign = z.infer<typeof CampaignSchema>;

export type CampaignSummary = {
	role: CampaignMemberRole;
	name: string;
	player_count: number;
	active_character_image_urls: string[];
	creation_time: number;
};
