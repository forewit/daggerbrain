import type {
	BackgroundQuestionAnswer,
	CharacterSettings,
	ConnectionAnswer,
	DerivedCharacterSummary,
	DomainCardId,
	CharacterDescriptions,
	LevelUpChoices,
	LevelUpDomainCardIds,
	Inventory,
	ChosenBeastform,
	Companion
} from '../types/character.types';
import type { ConditionIds, LevelUpChoice } from '../types/rule.types';
import type { Traits } from '../types/compendium.types';

export const UI_HOMEBREW_LIMIT = 20;
export const UI_CHARACTER_LIMIT = 6;

export const BLANK_LEVEL_UP_CHOICE: LevelUpChoice = {
	option_id: null,
	marked_traits: { A: null, B: null },
	selected_experiences: [],
	selected_domain_card_id: null,
	selected_subclass_upgrade: null
};

export const CHARACTER_DEFAULTS = {
	// core
	name: 'New Character',
	image_url: '/images/portrait-placeholder.png',
	settings: <CharacterSettings>{
		void_enabled: false,
		use_gold_coins: false,
		homebrew_enabled: false,
		show_campaign_info: true
	},

	// derived character summary for campaign previews
	derived_character_summary: <DerivedCharacterSummary>{
		ancestry_name: '',
		primary_class_name: '',
		primary_subclass_name: '',
		secondary_class_name: '',
		secondary_subclass_name: '',
		max_hp: 0,
		max_stress: 6,
		max_hope: 6,
		evasion: 0,
		max_armor: 0,
		damage_thresholds: { major: 0, severe: 0 }
	},

	// heritage
	ancestry_card_id: null,
	community_card_id: null,
	experiences: <string[]>['', ''],

	// classes
	class_choices: <Record<string, Record<string, string[]>>>{},
	primary_class_id: null,
	primary_subclass_id: null,
	secondary_class_id: null,
	secondary_subclass_id: null,
	secondary_class_domain_id_choice: null,

	// beastform
	chosen_beastform: <ChosenBeastform | null>null,
	companion: <Companion | null>null,

	// notes / descriptions
	background_question_answers: <BackgroundQuestionAnswer[]>[],
	connection_answers: <ConnectionAnswer[]>[],
	character_descriptions: <CharacterDescriptions>{
		clothes: '',
		eyes: '',
		body: '',
		skin: '',
		attitude: ''
	},
	notes: '',

	// equipment
	unarmed_attack_choices: <Record<string, string[]>>{},
	active_armor_id: null,
	active_primary_weapon_id: null,
	active_secondary_weapon_id: null,
	inventory: <Inventory>{
		primary_weapons: {},
		secondary_weapons: {},
		armor: {},
		loot: {},
		consumables: {},
		adventuring_gear: [],
		gold_coins: 0
	},

	// the void / other
	active_conditions: <ConditionIds[]>[],
	transformation_card_id: null,
	additional_domain_card_ids: <DomainCardId[]>[],
	additional_ancestry_card_ids: <string[]>[],
	additional_community_card_ids: <string[]>[],
	additional_transformation_card_ids: <string[]>[],

	// ephemeral stats set by the player
	ancestry_card_choices: <Record<string, string[]>>{},
	community_card_tokens: 0,
	domain_card_choices: <Record<string, Record<string, string[]>>>{},
	domain_card_tokens: <Record<string, number>>{},
	selected_traits: <Traits>{
		agility: null,
		strength: null,
		finesse: null,
		instinct: null,
		presence: null,
		knowledge: null
	},
	marked_hp: 0,
	marked_stress: 0,
	marked_hope: 2,
	marked_armor: 0,
	loadout_domain_card_ids: <DomainCardId[]>[],
	bonus_max_loadout: 0,

	// Level up choices
	level: 1,
	level_up_domain_card_ids: <LevelUpDomainCardIds>{
		1: { A: null, B: null },
		2: { A: null },
		3: { A: null },
		4: { A: null },
		5: { A: null },
		6: { A: null },
		7: { A: null },
		8: { A: null },
		9: { A: null },
		10: { A: null }
	},
	level_up_choices: <LevelUpChoices>{
		2: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
		3: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
		4: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
		5: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
		6: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
		7: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
		8: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
		9: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
		10: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE }
	}
};
