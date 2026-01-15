import { z } from 'zod';
import { RangesSchema, DomainIdsSchema, TraitIdsSchema, DamageTypesSchema } from './compendium.schemas';

export const ChosenBeastformSchema = z.object({
	apply_beastform_bonuses: z.boolean(),
	compendium_id: z.string(),
	choices: z.record(z.string(), z.array(z.string())),
	custom_title: z.string().nullable(),
	custom_level_requirement: z.number().nullable()
});

export const CompanionSchema = z.object({
	name: z.string(),
	image_url: z.string(),
	attack: z
		.object({
			name: z.string(),
			range: RangesSchema,
			damage_dice: z.string(),
			damage_bonus: z.number(),
			damage_type: DamageTypesSchema
		})
		.nullable(),
	max_stress: z.number(),
	marked_stress: z.number(),
	max_hope: z.number(),
	marked_hope: z.number(),
	evasion: z.number(),
	level_up_choices: z.array(z.string()),
	experiences: z.array(z.string()),
	experience_modifiers: z.array(z.number()),
	choices: z.record(z.string(), z.array(z.string()))
});
