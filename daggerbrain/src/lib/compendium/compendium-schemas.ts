import { z } from 'zod';
// ============================================================================
// Helper Types
// ============================================================================

export const TraitIdsSchema = z.enum([
	'agility',
	'strength',
	'finesse',
	'instinct',
	'presence',
	'knowledge'
]);

export const TraitsSchema = z.object({
	agility: z.number().nullable(),
	strength: z.number().nullable(),
	finesse: z.number().nullable(),
	instinct: z.number().nullable(),
	presence: z.number().nullable(),
	knowledge: z.number().nullable()
});

export const DomainIdsSchema = z.enum([
	'arcana',
	'blade',
	'bone',
	'codex',
	'grace',
	'midnight',
	'sage',
	'splendor',
	'valor'
]);

export const CardTypesSchema = z.enum([
	'domain',
	'ancestry',
	'community',
	'transformation',
	'subclass_foundation',
	'subclass_specialization',
	'subclass_mastery'
]);

export const SourceIdsSchema = z.enum(['Void 1.5', 'SRD', 'Homebrew']);

export const SourcesSchema = z.object({
	id: z.string(),
	name: z.string(),
	short_title: z.string()
});

export const AdventuringGearSchema = z.object({
	title: z.string()
});

export const CharacterConditionSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('armor_equipped'),
		value: z.boolean()
	}),
	z.object({
		type: z.literal('level'),
		min_level: z.number(),
		max_level: z.number()
	}),
	z.object({
		type: z.literal('domain_card_choice'),
		domain_card_id: z.string(),
		choice_id: z.string(),
		selection_id: z.string()
	}),
	z.object({
		type: z.literal('loot_choice'),
		loot_id: z.string(),
		choice_id: z.string(),
		selection_id: z.string()
	}),
	z.object({
		type: z.literal('min_loadout_cards_from_domain'),
		domain_id: DomainIdsSchema,
		min_cards: z.number()
	}),
	z.object({
		type: z.enum(['primary_weapon_equipped', 'secondary_weapon_equipped']),
		weapon_id: z.string().nullable()
	})
]);

export const CharacterModifierSchema = z
	.object({
		behaviour: z.enum(['bonus', 'base', 'override']),
		character_conditions: z.array(CharacterConditionSchema)
	})
	.and(
		z.discriminatedUnion('type', [
			z.object({
				type: z.literal('derived_from_trait'),
				trait: TraitIdsSchema,
				multiplier: z.number()
			}),
			z.object({
				type: z.literal('flat'),
				value: z.number()
			}),
			z.object({
				type: z.literal('derived_from_proficiency'),
				multiplier: z.number()
			}),
			z.object({
				type: z.literal('derived_from_level'),
				multiplier: z.number()
			})
		])
	)
	.and(
		z.discriminatedUnion('target', [
			z.object({
				target: z.enum([
					'evasion',
					'max_hp',
					'max_stress',
					'max_experiences',
					'major_damage_threshold',
					'severe_damage_threshold',
					'primary_class_mastery_level',
					'secondary_class_mastery_level',
					'max_domain_card_loadout',
					'max_hope',
					'proficiency',
					'max_armor',
					'max_burden',
					'spellcast_roll_bonus'
				])
			}),
			z.object({
				target: z.literal('trait'),
				trait: TraitIdsSchema
			}),
			z.object({
				target: z.literal('experience_from_selection'),
				domain_card_id: z.string(),
				choice_id: z.string()
			})
		])
	);

export const WeaponModifierSchema = z
	.object({
		behaviour: z.enum(['bonus', 'base', 'override']),
		character_conditions: z.array(CharacterConditionSchema),
		target_weapon: z.enum(['primary', 'secondary', 'unarmed', 'all'])
	})
	.and(
		z.discriminatedUnion('target_stat', [
			z.object({
				target_stat: z.literal('attack_roll'),
				value: z.number()
			}),
			z.object({
				target_stat: z.literal('damage_bonus'),
				value: z.number()
			}),
			z.object({
				target_stat: z.literal('damage_dice'),
				dice: z.string()
			}),
			z.object({
				target_stat: z.literal('damage_type'),
				damage_type: z.enum(['phy', 'mag'])
			}),
			z.object({
				target_stat: z.literal('range'),
				range: z.enum(['Melee', 'Very Close', 'Close', 'Far', 'Very Far'])
			}),
			z.object({
				target_stat: z.literal('trait'),
				trait: TraitIdsSchema
			})
		])
	);

export const FeatureSchema = z.object({
	title: z.string(),
	description_html: z.string(),
	character_modifiers: z.array(CharacterModifierSchema),
	weapon_modifiers: z.array(WeaponModifierSchema)
});
// ============================================================================
// Classes
// ============================================================================

export const SubclassFoundationCardSchema = z.object({
	id: z.string(),
	image_url: z.string(),
	card_type: CardTypesSchema,
	title: z.string(),
	description_html: z.string(),
	artist_name: z.string(),
	features: z.array(FeatureSchema),
	spellcast_trait: TraitIdsSchema.nullable(),
	class_id: z.string()
});

export const SubclassSpecializationCardSchema = z.object({
	id: z.string(),
	image_url: z.string(),
	card_type: CardTypesSchema,
	title: z.string(),
	description_html: z.string(),
	artist_name: z.string(),
	features: z.array(FeatureSchema),
	class_id: z.string()
});

export const SubclassMasteryCardSchema = z.object({
	id: z.string(),
	image_url: z.string(),
	card_type: CardTypesSchema,
	title: z.string(),
	description_html: z.string(),
	artist_name: z.string(),
	features: z.array(FeatureSchema),
	class_id: z.string()
});

export const SubclassSchema = z.object({
	id: z.string(),
	source_id: SourceIdsSchema,
	class_id: z.string(),
	name: z.string(),
	description_html: z.string(),
	foundation_card: SubclassFoundationCardSchema,
	specialization_card: SubclassSpecializationCardSchema,
	mastery_card: SubclassMasteryCardSchema
});

export const ClassSchema = z.object({
	id: z.string(),
	source_id: SourceIdsSchema,
	name: z.string(),
	image_url: z.string(),
	description_html: z.string(),
	starting_evasion: z.number(),
	starting_max_hp: z.number(),
	hope_feature: FeatureSchema,
	primary_domain_id: DomainIdsSchema,
	secondary_domain_id: DomainIdsSchema,
	class_features: z.array(FeatureSchema),
	subclass_ids: z.array(z.string()),
	suggested_traits: TraitsSchema,
	suggested_primary_weapon_id: z.string().nullable(),
	suggested_secondary_weapon_id: z.string().nullable(),
	suggested_armor_id: z.string().nullable(),
	starting_inventory: z.object({
		gold_coins: z.number(),
		free_gear: z.array(AdventuringGearSchema),
		loot_or_consumable_options: z.array(z.string()),
		class_gear_options: z.array(AdventuringGearSchema),
		spellbook_prompt: z.string().nullable()
	}),
	background_questions: z.array(z.string()),
	connection_questions: z.array(z.string()),
	character_description_suggestions: z.object({
		clothes: z.string(),
		eyes: z.string(),
		body: z.string(),
		skin: z.string(),
		attitude: z.string()
	})
});

// ============================================================================
// Domains
// ============================================================================

export const DomainSchema = z.object({
	id: DomainIdsSchema,
	source_id: SourceIdsSchema,
	name: z.string(),
	description_html: z.string(),
	color: z.string(),
	foreground_color: z.string()
});

export const DomainCardChoiceSchema = z
	.object({
		choice_id: z.string(),
		conditional_choice: z
			.object({
				choice_id: z.string(),
				selection_id: z.string()
			})
			.nullable()
	})
	.and(
		z.discriminatedUnion('type', [
			z.object({
				type: z.literal('arbitrary'),
				max: z.number(),
				options: z.array(
					z.object({
						selection_id: z.string(),
						title: z.string(),
						short_title: z.string()
					})
				)
			}),
			z.object({
				type: z.literal('experience'),
				max: z.number()
			})
		])
	);

export const DomainCardSchema = z.object({
	id: z.string(),
	source_id: SourceIdsSchema,
	domain_id: DomainIdsSchema,
	card_type: CardTypesSchema,
	image_url: z.string(),
	title: z.string(),
	artist_name: z.string(),
	features: z.array(FeatureSchema),
	level_requirement: z.number(),
	recall_cost: z.number(),
	category: z.enum(['ability', 'spell', 'grimoire']),
	choices: z.array(DomainCardChoiceSchema),
	tokens: z.boolean(),
	applies_in_vault: z.boolean(),
	forced_in_loadout: z.boolean(),
	forced_in_vault: z.boolean()
});

// ============================================================================
// Heritages (Ancestries, Communities, Transformations)
// ============================================================================

export const AncestryCardSchema = z.object({
	id: z.string(),
	source_id: SourceIdsSchema,
	card_type: CardTypesSchema,
	image_url: z.string(),
	title: z.string(),
	description_html: z.string(),
	artist_name: z.string(),
	features: z.array(FeatureSchema)
});

export const CommunityCardSchema = z.object({
	id: z.string(),
	source_id: SourceIdsSchema,
	card_type: CardTypesSchema,
	image_url: z.string(),
	title: z.string(),
	description_html: z.string(),
	artist_name: z.string(),
	features: z.array(FeatureSchema)
});

export const TransformationCardSchema = z.object({
	id: z.string(),
	source_id: SourceIdsSchema,
	card_type: CardTypesSchema,
	image_url: z.string(),
	title: z.string(),
	description_html: z.string(),
	artist_name: z.string(),
	features: z.array(FeatureSchema)
});

// ============================================================================
// Equipment (Weapons, Armor, Loot, Consumables, Adventuring Gear)
// ============================================================================

export const RangesSchema = z.enum(['Melee', 'Very Close', 'Close', 'Far', 'Very Far']);

export const WeaponCategoriesSchema = z.enum(['Primary', 'Secondary', 'Unarmed']);

export const DamageTypesSchema = z.enum(['phy', 'mag']);

export const WeaponSchema = z.object({
	id: z.string(),
	source_id: SourceIdsSchema,
	title: z.string(),
	description_html: z.string(),
	level_requirement: z.number(),
	category: WeaponCategoriesSchema,
	available_traits: z.array(TraitIdsSchema),
	range: RangesSchema,
	features: z.array(FeatureSchema),
	attack_roll_bonus: z.number(),
	damage_bonus: z.number(),
	damage_dice: z.string(),
	available_damage_types: z.array(DamageTypesSchema),
	burden: z.union([z.literal(0), z.literal(1), z.literal(2)])
});

export const ArmorSchema = z.object({
	id: z.string(),
	source_id: SourceIdsSchema,
	level_requirement: z.number(),
	title: z.string(),
	description_html: z.string(),
	max_armor: z.number(),
	damage_thresholds: z.object({
		major: z.number(),
		severe: z.number()
	}),
	features: z.array(FeatureSchema)
});

export const LootSchema = z.object({
	id: z.string(),
	source_id: SourceIdsSchema,
	rarity_roll: z.number(),
	title: z.string(),
	description_html: z.string(),
	character_modifiers: z.array(CharacterModifierSchema),
	weapon_modifiers: z.array(WeaponModifierSchema)
});

export const ConsumableSchema = z.object({
	id: z.string(),
	source_id: SourceIdsSchema,
	rarity_roll: z.number(),
	title: z.string(),
	description_html: z.string()
});
