import type {
	BackgroundQuestionAnswer,
	Character,
	CharacterInventory,
	CharacterSettings,
	ConnectionAnswer,
	DerivedDescriptors,
	DomainCardId,
	LevelUpChoices,
	LevelUpDomainCardIds
} from '$lib/types/character-types';
import type { LevelUpChoice } from '$lib/types/rule-types';
import type { CharacterModifier, WeaponModifier, Traits } from './compendium-types';

export const BLANK_LEVEL_UP_CHOICE = {
	option_id: null,
	marked_traits: { A: null, B: null },
	selected_experiences: [],
	selected_domain_card_id: null,
	selected_subclass_upgrade: null
} as const satisfies LevelUpChoice;

export const CHARACTER_DEFAULTS = {
	// core
	name: 'New Character',
	image_url: '/images/portrait-placeholder.png',
	settings: <CharacterSettings>{
		void_enabled: false,
		use_gold_coins: false
	},

	// derived
	derived_descriptors: <DerivedDescriptors>{
		ancestry_name: '',
		primary_class_name: '',
		primary_subclass_name: '',
		secondary_class_name: '',
		secondary_subclass_name: ''
	},

	// heritage
	ancestry_card_id: null,
	community_card_id: null,
	experiences: <string[]>['', ''],

	// classes
	primary_class_id: null,
	primary_subclass_id: null,
	secondary_class_id: null,
	secondary_subclass_id: null,
	secondary_class_domain_id_choice: null,
	background_question_answers: <BackgroundQuestionAnswer[]>[],
	connection_answers: <ConnectionAnswer[]>[],

	// equipment
	active_armor_id: null,
	active_primary_weapon_id: null,
	active_secondary_weapon_id: null,
	inventory: <CharacterInventory>{
		primary_weapons: {},
		secondary_weapons: {},
		armor: {},
		loot: {},
		consumables: {},
		adventuring_gear: [],
		gold_coins: 0
	},

	// the void / other
	transformation_card_id: null,
	additional_domain_card_ids: <string[]>[],
	additional_character_modifiers: <CharacterModifier[]>[],
	additional_weapon_modifiers: <WeaponModifier[]>[],

	// ephemeral stats set by the player
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
	marked_hope: 0,
	marked_armor: 0,
	loadout_domain_card_ids: <DomainCardId[]>[],

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
