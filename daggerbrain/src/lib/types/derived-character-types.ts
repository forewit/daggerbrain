import type { Character, Companion } from './character-types';
import type {
	AncestryCard,
	Armor,
	Beastform,
	CharacterClass,
	CommunityCard,
	DamageThresholds,
	DomainCard,
	Subclass,
	Traits,
	TransformationCard,
	Weapon
} from './compendium-types';
import { z } from 'zod';

/**
 * Fully derived character state - includes base character plus all computed derived values.
 * The derived values are computed client-side and serialized for storage in KV.
 * Used for campaign character summaries and other contexts where fully computed character data is needed.
 */
export type DerivedCharacter = Character & {
	// Derived compendium references
	derived_ancestry_card: AncestryCard | null;
	derived_community_card: CommunityCard | null;
	derived_transformation_card: TransformationCard | null;
	derived_primary_class: CharacterClass | null;
	derived_primary_subclass: Subclass | null;
	derived_secondary_class: CharacterClass | null;
	derived_secondary_subclass: Subclass | null;

	// Derived equipment
	derived_armor: (Armor & { id: string }) | null;
	derived_primary_weapon: (Weapon & { id: string }) | null;
	derived_secondary_weapon: (Weapon & { id: string }) | null;
	derived_unarmed_attack: (Weapon & { id: string }) | null;
	derived_beastform: Beastform | null;
	derived_companion: Companion | null;

	// Derived stats
	derived_traits: Traits;
	derived_proficiency: number;
	derived_experience_modifiers: number[];
	derived_max_experiences: number;
	derived_max_loadout: number;
	derived_max_hope: number;
	derived_max_armor: number;
	derived_max_hp: number;
	derived_max_stress: number;
	derived_max_burden: number;
	derived_max_short_rest_actions: number;
	derived_max_long_rest_actions: number;
	derived_max_consumables: number;
	derived_consumable_count: number;
	derived_evasion: number;
	derived_damage_thresholds: DamageThresholds;
	derived_primary_class_mastery_level: number;
	derived_secondary_class_mastery_level: number;
	derived_spellcast_roll_bonus: number;

	// Derived collections
	derived_domain_card_vault: DomainCard[];
	derived_domain_card_loadout: DomainCard[];
};

/**
 * Zod schema for validating DerivedCharacter.
 * This validates that all required derived fields are present.
 */
export const DerivedCharacterSchema = z
	.object({
		// Validate key derived stats exist (we don't validate the full nested structure)
		derived_max_hp: z.number(),
		derived_max_stress: z.number(),
		derived_max_hope: z.number(),
		derived_traits: z.record(z.string(), z.number()),
		derived_proficiency: z.number(),
		derived_experience_modifiers: z.array(z.number()),
		derived_max_experiences: z.number(),
		derived_max_loadout: z.number(),
		derived_max_armor: z.number(),
		derived_max_burden: z.number(),
		derived_max_short_rest_actions: z.number(),
		derived_max_long_rest_actions: z.number(),
		derived_max_consumables: z.number(),
		derived_consumable_count: z.number(),
		derived_evasion: z.number(),
		derived_damage_thresholds: z.object({
			major: z.number(),
			severe: z.number()
		}),
		derived_primary_class_mastery_level: z.number(),
		derived_secondary_class_mastery_level: z.number(),
		derived_spellcast_roll_bonus: z.number(),
		derived_domain_card_vault: z.array(z.any()),
		derived_domain_card_loadout: z.array(z.any())
	})
	.passthrough(); // Allow other fields from Character type
