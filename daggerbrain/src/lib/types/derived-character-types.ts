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

/**
 * Fully derived character state - includes base character plus all computed derived values.
 *
 * @deprecated This type is only used internally by the character sheet for client-side state.
 * For campaign/DO contexts, use CampaignCharacterSummary instead, which uses the lightweight
 * DerivedCharacterSummary stored in D1.
 *
 * The campaign live view no longer requires full DerivedCharacter objects - it uses
 * CampaignCharacterSummary which contains only the fields needed for character previews.
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
