import type { AdventuringGear, DamageTypes, DomainIds, Ranges } from '$lib/types/compendium-types';
import { z } from 'zod';
import {
	characters_table_schema,
	ChosenBeastformSchema,
	CompanionSchema
} from '../server/db/characters.schema';
import type { LevelUpChoice } from './rule-types';

// ============================================================================
// Core Character Type
// ============================================================================

export type Character = z.infer<typeof characters_table_schema>;

export type CharacterSettings = {
	void_enabled: boolean;
	use_gold_coins: boolean;
	homebrew_enabled: boolean;
	campaign_homebrew_enabled: boolean;
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

export type DerivedDescriptors = {
	ancestry_name: string;
	primary_class_name: string;
	primary_subclass_name: string;
	secondary_class_name: string;
	secondary_subclass_name: string;
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
