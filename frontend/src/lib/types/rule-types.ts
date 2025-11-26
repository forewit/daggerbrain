import type { CharacterModifier, TraitNames } from '$lib/types/compendium-types';
import type { DomainCardId } from './character-types';

export type Tier1OptionIds = 'tier_1_domain_cards';
export type Tier2OptionIds =
	| 'tier_2_domain_card'
	| 'tier_2_traits'
	| 'tier_2_experience_bonus'
	| 'tier_2_max_hp'
	| 'tier_2_max_stress'
	| 'tier_2_evasion';
export type Tier3OptionIds =
	| 'tier_3_domain_card'
	| 'tier_3_traits'
	| 'tier_3_experience_bonus'
	| 'tier_3_max_hp'
	| 'tier_3_max_stress'
	| 'tier_3_evasion'
	| 'tier_3_proficiency'
	| 'tier_3_subclass_upgrade'
	| 'tier_3_multiclass';
export type Tier4OptionIds =
	| 'tier_4_domain_card'
	| 'tier_4_traits'
	| 'tier_4_experience_bonus'
	| 'tier_4_max_hp'
	| 'tier_4_max_stress'
	| 'tier_4_evasion'
	| 'tier_4_proficiency'
	| 'tier_4_subclass_upgrade'
	| 'tier_4_multiclass';
export type AllTierOptionIds = Tier1OptionIds | Tier2OptionIds | Tier3OptionIds | Tier4OptionIds;

export type LevelUpChoice = {
	option_id: AllTierOptionIds | null;
	marked_traits: { A: TraitNames | null; B: TraitNames | null };
	selected_experiences: number[];
	selected_domain_card_id: DomainCardId | null;
	selected_subclass_upgrade: 'primary' | 'secondary' | null;
};

export type LevelUpOption = {
	title_html: string | null;
	short_title: string | null;
	max: number;
	costs_two_choices: boolean;
	character_modifiers: CharacterModifier[];
};