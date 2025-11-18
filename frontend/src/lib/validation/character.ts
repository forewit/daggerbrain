import { z } from 'zod';

const domainIds = ['arcana', 'blade', 'bone', 'codex', 'grace', 'midnight', 'sage', 'splendor', 'valor'] as const;

export const DomainIdSchema = z.enum(domainIds);

export const traitKeys = ['agility', 'strength', 'finesse', 'instinct', 'presence', 'knowledge'] as const;
export const TraitKeySchema = z.enum(traitKeys);

export const TraitsSchema = z.object({
	agility: z.number().nullable(),
	strength: z.number().nullable(),
	finesse: z.number().nullable(),
	instinct: z.number().nullable(),
	presence: z.number().nullable(),
	knowledge: z.number().nullable()
});

export const CharacterSettingsSchema = z.object({
	void_enabled: z.boolean(),
	use_gold_coins: z.boolean()
});

export const DerivedDescriptorsSchema = z.object({
	ancestry_name: z.string(),
	primary_class_name: z.string(),
	primary_subclass_name: z.string(),
	secondary_class_name: z.string(),
	secondary_subclass_name: z.string()
});

const BackgroundEntrySchema = z.object({
	question: z.string(),
	answer: z.string()
});

const InventoryChoicesSchema = z.record(z.string(), z.array(z.string()));

const InventoryEntrySchema = z.object({
	quantity: z.number(),
	choices: InventoryChoicesSchema
});

const AdventuringGearSchema = z.object({
	title: z.string()
});

export const InventorySchema = z.object({
	weapons: z.record(z.string(), InventoryEntrySchema),
	armor: z.record(z.string(), InventoryEntrySchema),
	loot: z.record(z.string(), InventoryEntrySchema),
	consumables: z.record(z.string(), InventoryEntrySchema),
	adventuring_gear: z.array(AdventuringGearSchema),
	gold_coins: z.number()
});

export const DomainCardChoicesSchema = z.record(z.string(), z.record(z.string(), z.array(z.string())));

export const DomainCardTokensSchema = z.record(z.string(), z.number());

const traitOptionIds = [
	'tier_1_domain_cards',
	'tier_2_traits',
	'tier_2_max_hp',
	'tier_2_max_stress',
	'tier_2_experience_bonus',
	'tier_2_domain_card',
	'tier_2_evasion',
	'tier_3_traits',
	'tier_3_max_hp',
	'tier_3_max_stress',
	'tier_3_experience_bonus',
	'tier_3_domain_card',
	'tier_3_evasion',
	'tier_3_subclass_upgrade',
	'tier_3_proficiency',
	'tier_3_multiclass',
	'tier_4_traits',
	'tier_4_max_hp',
	'tier_4_max_stress',
	'tier_4_experience_bonus',
	'tier_4_domain_card',
	'tier_4_evasion',
	'tier_4_subclass_upgrade',
	'tier_4_proficiency',
	'tier_4_multiclass'
] as const;

export const LevelUpOptionIdSchema = z.enum(traitOptionIds);

const MarkedTraitsSchema = z.object({
	A: TraitKeySchema.nullable(),
	B: TraitKeySchema.nullable()
});

export const LevelUpChoiceSchema = z.object({
	option_id: LevelUpOptionIdSchema.nullable(),
	marked_traits: MarkedTraitsSchema,
	selected_experiences: z.array(z.number()),
	selected_domain_card_id: z.string().nullable(),
	selected_subclass_upgrade: z.enum(['primary', 'secondary']).nullable()
});

const LevelUpChoicePairSchema = z.object({
	A: LevelUpChoiceSchema,
	B: LevelUpChoiceSchema
});

const DomainCardSlotSchema = z.object({
	A: z.string().nullable()
});

const DomainCardSlotWithB = DomainCardSlotSchema.extend({
	B: z.string().nullable()
});

export const LevelUpDomainCardIdsSchema = z.object({
	1: DomainCardSlotWithB,
	2: DomainCardSlotSchema,
	3: DomainCardSlotSchema,
	4: DomainCardSlotSchema,
	5: DomainCardSlotSchema,
	6: DomainCardSlotSchema,
	7: DomainCardSlotSchema,
	8: DomainCardSlotSchema,
	9: DomainCardSlotSchema,
	10: DomainCardSlotSchema
});

export const LevelUpChoicesSchema = z.object({
	2: LevelUpChoicePairSchema,
	3: LevelUpChoicePairSchema,
	4: LevelUpChoicePairSchema,
	5: LevelUpChoicePairSchema,
	6: LevelUpChoicePairSchema,
	7: LevelUpChoicePairSchema,
	8: LevelUpChoicePairSchema,
	9: LevelUpChoicePairSchema,
	10: LevelUpChoicePairSchema
});

export const EphemeralStatsSchema = z.object({
	marked_hp: z.number(),
	marked_stress: z.number(),
	marked_hope: z.number(),
	marked_armor: z.number(),
	loadout_domain_card_ids: z.array(z.string())
});

export const CharacterSchema = z.object({
	settings: CharacterSettingsSchema,
	uid: z.string(),
	name: z.string(),
	image: z.string(),
	selected_traits: TraitsSchema,
	ancestry_card_id: z.string().nullable(),
	community_card_id: z.string().nullable(),
	experiences: z.array(z.string()),
	primary_class_id: z.string().nullable(),
	primary_subclass_id: z.string().nullable(),
	secondary_class_id: z.string().nullable(),
	secondary_subclass_id: z.string().nullable(),
	secondary_class_domain_id_choice: DomainIdSchema.nullable(),
	background_questions: z.array(BackgroundEntrySchema),
	connections: z.array(BackgroundEntrySchema),
	class_choices: z.record(z.string(), z.array(z.string())),
	derived_descriptors: DerivedDescriptorsSchema,
	armor_id: z.string().nullable(),
	primary_weapon_id: z.string().nullable(),
	secondary_weapon_id: z.string().nullable(),
	inventory: InventorySchema,
	transformation_card_id: z.string().nullable(),
	additional_domain_card_ids: z.array(z.string()),
	additional_character_modifiers: z.array(z.unknown()),
	additional_weapon_modifiers: z.array(z.unknown()),
	ephemeral_stats: EphemeralStatsSchema,
	domain_card_choices: DomainCardChoicesSchema,
	domain_card_tokens: DomainCardTokensSchema,
	level: z.number().int().min(1).max(10),
	level_up_domain_card_ids: LevelUpDomainCardIdsSchema,
	level_up_choices: LevelUpChoicesSchema
});

export const CharacterArraySchema = z.array(CharacterSchema);

export type CharacterInput = z.infer<typeof CharacterSchema>;

