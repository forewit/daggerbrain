import { z } from 'zod';
import { AdversarySchema, EnvironmentSchema } from './compendium';
import { TierSchema } from './rules';
import { ConditionSchema } from './characters';

export const AdversaryInstanceSchema = z.object({
	name: z.string(),
	conditions: z.array(ConditionSchema),
	marked_stress: z.number().int().min(0),
	marked_hp: z.number().int().min(0)
});
export type AdversaryInstance = z.infer<typeof AdversaryInstanceSchema>;

export const EncounterSchema = z.object({
	name: z.string(),
	description_html: z.string(),
	condition_list: z.array(z.string().trim()).optional(),
	enable_massive_damage: z.boolean().optional(),
	items: z.array(
		z.discriminatedUnion('type', [
			z.object({
				type: z.literal('adversary'),
				base_adversary_id: z.string(),
				edited_adversary: AdversarySchema.optional(),
				instances: z.array(AdversaryInstanceSchema)
			}),
			z.object({
				type: z.literal('environment'),
				base_environment_id: z.string(),
				edited_environment: EnvironmentSchema.optional()
			})
		])
	),
	number_of_players: z.number().int().min(1),
	encounter_tier: TierSchema,
	bonus_damage: z.boolean().optional(),
	extra_battle_points: z.number().int()
});
export type Encounter = z.infer<typeof EncounterSchema>;
