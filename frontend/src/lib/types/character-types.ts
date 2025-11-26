import type { AdventuringGear, DomainIds } from '$lib/types/compendium-types';
import { z } from 'zod';
import { characters_table_schema } from '../server/db/characters.schema';
import type { LevelUpChoice } from './rule-types';

// ============================================================================
// Core Character Type
// ============================================================================

export type Character = z.infer<typeof characters_table_schema>;

export type CharacterSettings = {
	void_enabled: boolean;
	use_gold_coins: boolean;
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

export type CharacterInventory = {
	primary_weapons: Record<string, { quantity: number; choices: Record<string, string[]> }>;
	secondary_weapons: Record<string, { quantity: number; choices: Record<string, string[]> }>;
	armor: Record<string, { quantity: number; choices: Record<string, string[]> }>;
	loot: Record<string, { quantity: number; choices: Record<string, string[]> }>;
	consumables: Record<string, { quantity: number; choices: Record<string, string[]> }>;
	adventuring_gear: (AdventuringGear & { quantity: number })[];
	gold_coins: number;
};

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
