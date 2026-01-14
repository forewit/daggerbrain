import type { AdventuringGear, DamageTypes, DomainIds, Ranges, Traits } from './compendium.types';
import { z } from 'zod';
import {
	ChosenBeastformSchema,
	CompanionSchema
} from '../schemas/character.schemas';
import type { LevelUpChoice, ConditionIds } from './rule.types';

// ============================================================================
// Core Character Type
// ============================================================================

// Note: Character type is inferred from drizzle schema in daggerbrain
// This is a placeholder - the actual Character type will be imported from daggerbrain
// or defined based on the characters_table structure
export type Character = {
	id: string;
	clerk_user_id: string;
	name: string;
	image_url: string;
	campaign_id: string | null;
	settings: CharacterSettings;
	derived_character_summary: DerivedCharacterSummary;
	ancestry_card_id: string | null;
	custom_top_ancestry: string | null;
	custom_bottom_ancestry: string | null;
	community_card_id: string | null;
	experiences: string[];
	class_choices: Record<string, Record<string, string[]>>;
	primary_class_id: string | null;
	primary_subclass_id: string | null;
	secondary_class_id: string | null;
	secondary_subclass_id: string | null;
	secondary_class_domain_id_choice: DomainIds | null;
	chosen_beastform: ChosenBeastform | null;
	companion: Companion | null;
	background_question_answers: BackgroundQuestionAnswer[];
	connection_answers: ConnectionAnswer[];
	character_descriptions: CharacterDescriptions;
	notes: string;
	active_armor_id: string | null;
	active_primary_weapon_id: string | null;
	active_secondary_weapon_id: string | null;
	inventory: Inventory;
	active_conditions: ConditionIds[];
	transformation_card_id: string | null;
	additional_domain_card_ids: DomainCardId[];
	additional_ancestry_card_ids: string[];
	additional_community_card_ids: string[];
	additional_transformation_card_ids: string[];
	unarmed_attack_choices: Record<string, string[]>;
	ancestry_card_choices: Record<string, string[]>;
	community_card_tokens: number;
	domain_card_choices: Record<string, Record<string, string[]>>;
	domain_card_tokens: Record<string, number>;
	selected_traits: Traits;
	marked_hp: number;
	marked_stress: number;
	marked_hope: number;
	marked_armor: number;
	loadout_domain_card_ids: DomainCardId[];
	bonus_max_loadout: number;
	level: number;
	level_up_domain_card_ids: LevelUpDomainCardIds;
	level_up_choices: LevelUpChoices;
};

export type CharacterSettings = {
	void_enabled: boolean;
	use_gold_coins: boolean;
	homebrew_enabled: boolean;
	show_campaign_info: boolean;
};

export type DomainCardId = {
	domainId: DomainIds;
	cardId: string;
};

export type LevelUpDomainCardIds = {
	1: {
		A: DomainCardId | null;
		B: DomainCardId | null;
	};
	2: { A: DomainCardId | null };
	3: { A: DomainCardId | null };
	4: { A: DomainCardId | null };
	5: { A: DomainCardId | null };
	6: { A: DomainCardId | null };
	7: { A: DomainCardId | null };
	8: { A: DomainCardId | null };
	9: { A: DomainCardId | null };
	10: { A: DomainCardId | null };
};
export type LevelUpChoices = Record<
	2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
	{ A: LevelUpChoice; B: LevelUpChoice }
>;

export type ArmorInventoryItem = {
	id: string;
	compendium_id: string;
	choices: Record<string, string[]>;
	custom_title: string | null;
	custom_level_requirement: number | null;
	custom_max_armor: number | null;
	custom_damage_thresholds: {
		major: number | null;
		severe: number | null;
	};
};

export type WeaponInventoryItem = {
	id: string;
	compendium_id: string;
	choices: Record<string, string[]>;
	custom_title: string | null;
	custom_level_requirement: number | null;
	custom_range: Ranges | null;
	custom_available_damage_types: DamageTypes[] | null;
	custom_burden: 0 | 1 | 2 | null;
	custom_damage_bonus: number | null;
	custom_damage_dice: string | null;
	custom_attack_roll_bonus: number | null;
};

export type ConsumableInventoryItem = {
	id: string;
	compendium_id: string;
	choices: Record<string, string[]>;
	custom_title: string | null;
	custom_description: string | null;
};

export type LootInventoryItem = {
	id: string;
	compendium_id: string;
	choices: Record<string, string[]>;
	custom_title: string | null;
	custom_description: string | null;
};

export type Inventory = {
	primary_weapons: Record<string, WeaponInventoryItem>;
	secondary_weapons: Record<string, WeaponInventoryItem>;
	armor: Record<string, ArmorInventoryItem>;
	loot: Record<string, LootInventoryItem>;
	consumables: Record<string, ConsumableInventoryItem>;
	adventuring_gear: AdventuringGear[];
	gold_coins: number;
};

export type ChosenBeastform = z.infer<typeof ChosenBeastformSchema>;
export type Companion = z.infer<typeof CompanionSchema>;

/**
 * Summary of derived character stats for campaign previews.
 * Stored in D1 and used for character cards in campaign view.
 * This is the source of truth for derived stats - computed client-side and persisted.
 */
export type DerivedCharacterSummary = {
	// Name descriptors
	ancestry_name: string;
	community_name: string;
	primary_class_name: string;
	primary_subclass_name: string;
	secondary_class_name: string;
	secondary_subclass_name: string;

	// Derived stats for campaign preview
	max_hp: number;
	max_stress: number;
	max_hope: number;
	evasion: number;
	max_armor: number;
	damage_thresholds: { major: number; severe: number };
};

export type BackgroundQuestionAnswer = {
	question: string;
	answer: string;
};

export type ConnectionAnswer = {
	question: string;
	answer: string;
};

export type CharacterDescriptions = {
	clothes: string;
	eyes: string;
	body: string;
	skin: string;
	attitude: string;
};
