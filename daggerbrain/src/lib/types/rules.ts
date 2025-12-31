import type {
	AllTierOptionIds,
	CompanionLevelUpOptionIds,
	Condition,
	ConditionIds,
	LevelUpOption,
	Tier1OptionIds,
	Tier2OptionIds,
	Tier3OptionIds,
	Tier4OptionIds,
	Trait
} from '$lib/types/rule-types';
import type { AncestryCard, Armor, TraitIds, Weapon } from '$lib/types/compendium-types';
import type { Companion } from './character-types';

export const CONDITIONS: Record<ConditionIds, Condition> = {
	hidden: {
		id: 'hidden',
		title: 'Hidden',
		description_html:
			"While you're out of sight from all enemies and they don't otherwise know your location, you gain the Hidden condition. Any rolls against a Hidden creature have disadvantage. After an adversary moves to where they would see you, you move into their line of sight, or you make an attack, you are no longer Hidden."
	},
	restrained: {
		id: 'restrained',
		title: 'Restrained',
		description_html:
			"Restrained characters can't move, but you can still take actions from their current position."
	},
	vulnerable: {
		id: 'vulnerable',
		title: 'Vulnerable',
		description_html: 'When a creature is Vulnerable, all rolls targeting them have advantage.'
	}
} as const;

export const TRAIT_OPTIONS = [2, 1, 1, 0, 0, -1] as const;

export const TRAITS: Record<TraitIds, Trait> = {
	agility: {
		id: 'agility',
		name: 'Agility',
		short_name: 'agi',
		examples: ['Sprint', 'Leap', 'Maneuver']
	},
	strength: {
		id: 'strength',
		name: 'Strength',
		short_name: 'str',
		examples: ['Lift', 'Smash', 'Grapple']
	},
	finesse: {
		id: 'finesse',
		name: 'Finesse',
		short_name: 'fin',
		examples: ['Control', 'Hide', 'Tinker']
	},
	instinct: {
		id: 'instinct',
		name: 'Instinct',
		short_name: 'inst',
		examples: ['Perceive', 'Sense', 'Navigate']
	},
	presence: {
		id: 'presence',
		name: 'Presence',
		short_name: 'pres',
		examples: ['Charm', 'Perform', 'Deceive']
	},
	knowledge: {
		id: 'knowledge',
		name: 'Knowledge',
		short_name: 'know',
		examples: ['Recall', 'Analyze', 'Comprehend']
	}
} as const;

export const BASE_MIXED_ANCESTRY_CARD: AncestryCard = {
	compendium_id: 'mixed-ancestry',
	source_id: 'SRD',
	card_type: 'ancestry',
	image_url: '/images/art/placeholder-art.webp',
	title: 'Mixed Ancestry',
	artist_name: '',
	description_html:
		"Anyone's appearance and abilities can be shaped by blood, magic, proximity, or a variety of other factors.",
	features: [],
	choices: []
};

export const BASE_UNARMED_ATTACK: Weapon & { id: string } = {
	id: 'unarmed_attack',
	compendium_id: 'unarmed_attack',
	source_id: 'SRD',
	title: 'Unarmed Attack',
	type: 'Physical',
	description_html: '',
	category: 'Unarmed',
	level_requirement: 1,
	available_traits: ['strength'],
	range: 'Melee',
	features: [],
	attack_roll_bonus: 0,
	damage_dice: '1d4',
	damage_bonus: 0,
	available_damage_types: ['phy'],
	burden: 0
};

export const BASE_ARMOR: Armor & { id: string } = {
	id: 'unarmored',
	compendium_id: 'unarmored',
	source_id: 'SRD',
	title: 'Unarmored',
	description_html: '',
	level_requirement: 1,
	max_armor: 0,
	damage_thresholds: {
		major: 0,
		severe: 0
	},
	features: []
};

export const BASE_STATS = {
	unarmored: BASE_ARMOR,
	traits: {
		agility: 0,
		strength: 0,
		finesse: 0,
		instinct: 0,
		presence: 0,
		knowledge: 0
	},
	proficiency: 1,
	experience_modifier: 2,
	max_experiences: 2,
	max_loadout: 5,
	max_hope: 6,
	max_armor: 0,
	max_hp: 0,
	max_stress: 6,
	max_burden: 2,
	max_short_rest_actions: 2,
	max_long_rest_actions: 2,
	max_consumables: 5,
	evasion: 0,
	spellcast_roll_bonus: 0,
	damage_thresholds: {
		major: 0,
		severe: 0
	},
	spellcast_trait: null,
	primary_class_mastery_level: 0,
	secondary_class_mastery_level: 0,
	unarmed_attack: BASE_UNARMED_ATTACK
} as const;

export const COMPANION_LEVEL_UP_OPTION_MAXES = {
	intelligent: 3,
	'light-in-the-dark': 1,
	'creature-comfort': 1,
	armored: 1,
	vicious: 3,
	resilient: 3,
	bonded: 1,
	aware: 3
} as const satisfies Record<CompanionLevelUpOptionIds, number>;

export const COMPANION_BASE_EXPERIENCE_MODIFIER = 2;
export const BASE_COMPANION: Companion = {
	name: 'Companion',
	image_url: '/images/companion-placeholder.png',
	attack: {
		name: '',
		range: 'Melee',
		damage_dice: 'd6',
		damage_bonus: 0,
		damage_type: 'phy'
	},
	max_stress: 3,
	marked_stress: 0,
	max_hope: 0,
	marked_hope: 0,
	evasion: 10,
	level_up_choices: [],
	experiences: ['', ''],
	experience_modifiers: [COMPANION_BASE_EXPERIENCE_MODIFIER, COMPANION_BASE_EXPERIENCE_MODIFIER],
	choices: {}
} as const;

export const TIER_1_BASE_OPTIONS = {
	tier_1_domain_cards: {
		title_html: 'Choose 2 level 1 domain cards from the domains available to you.',
		short_title: 'Starting Domain Cards',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	}
} as const satisfies Record<Tier1OptionIds, LevelUpOption>;

export const TIER_2_BASE_OPTIONS = {
	tier_2_traits: {
		title_html: 'Gain a +1 bonus to two unmarked character traits and mark them.',
		short_title: '+1 to 2 Traits',
		max: 3,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_2_max_hp: {
		title_html: 'Permanently gain 1 Hit Point slot.',
		short_title: '+1 HP Slot',
		max: 2,
		costs_two_choices: false,
		character_modifiers: [
			{
				behaviour: 'bonus',
				target: 'max_hp',
				type: 'flat',
				value: 1,
				character_conditions: []
			}
		]
	},
	tier_2_max_stress: {
		title_html: 'Permanently gain 1 Stress slot.',
		short_title: '+1 Stress Slot',
		max: 2,
		costs_two_choices: false,
		character_modifiers: [
			{
				behaviour: 'bonus',
				target: 'max_stress',
				type: 'flat',
				value: 1,
				character_conditions: []
			}
		]
	},
	tier_2_experience_bonus: {
		title_html: 'Permanently gain a +1 bonus to two Experiences.',
		short_title: '+1 to 2 Experiences',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_2_domain_card: {
		title_html:
			'Choose an additional domain card of your level or lower from a domain you have access to (up to level 4).',
		short_title: '+1 Domain Card',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_2_evasion: {
		title_html: 'Permanently gain a +1 bonus to your Evasion.',
		short_title: '+1 Evasion',
		max: 1,
		costs_two_choices: false,
		character_modifiers: [
			{
				behaviour: 'bonus',
				target: 'evasion',
				type: 'flat',
				value: 1,
				character_conditions: []
			}
		]
	}
} as const satisfies Record<Tier2OptionIds, LevelUpOption>;

export const TIER_3_BASE_OPTIONS = {
	tier_3_traits: {
		title_html: 'Gain a +1 bonus to two unmarked character traits and mark them.',
		short_title: '+1 to 2 Traits',
		max: 3,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_3_max_hp: {
		title_html: 'Permanently gain 1 Hit Point slot.',
		short_title: '+1 HP Slot',
		max: 2,
		costs_two_choices: false,
		character_modifiers: [
			{
				behaviour: 'bonus',
				target: 'max_hp',
				type: 'flat',
				value: 1,
				character_conditions: []
			}
		]
	},
	tier_3_max_stress: {
		title_html: 'Permanently gain 1 Stress slot.',
		short_title: '+1 Stress Slot',
		max: 2,
		costs_two_choices: false,
		character_modifiers: [
			{
				behaviour: 'bonus',
				target: 'max_stress',
				type: 'flat',
				value: 1,
				character_conditions: []
			}
		]
	},
	tier_3_experience_bonus: {
		title_html: 'Permanently gain a +1 bonus to two Experiences.',
		short_title: '+1 to 2 Experiences',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_3_domain_card: {
		title_html:
			'Choose an additional domain card of your level or lower from a domain you have access to (up to level 7).',
		short_title: '+1 Domain Card',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_3_evasion: {
		title_html: 'Permanently gain a +1 bonus to your Evasion.',
		short_title: '+1 Evasion',
		max: 1,
		costs_two_choices: false,
		character_modifiers: [
			{
				behaviour: 'bonus',
				target: 'evasion',
				type: 'flat',
				value: 1,
				character_conditions: []
			}
		]
	},
	tier_3_subclass_upgrade: {
		title_html: 'Take an upgraded subclass card. Disables the **Multiclass** option for this tier',
		short_title: 'Upgrade Subclass',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_3_proficiency: {
		title_html: 'Increase your Proficiency by +1.',
		short_title: '+1 Proficiency',
		max: 1,
		costs_two_choices: true,
		character_modifiers: [
			{
				behaviour: 'bonus',
				target: 'proficiency',
				type: 'flat',
				value: 1,
				character_conditions: []
			}
		]
	},
	tier_3_multiclass: {
		title_html:
			'Multiclass: Choose an additional class for your character (disables **Take an upgraded subclass card** for this tier and the **Tier 4 Multiclass** option).',
		short_title: 'Multiclass',
		max: 1,
		costs_two_choices: true,
		character_modifiers: []
	}
} as const satisfies Record<Tier3OptionIds, LevelUpOption>;

export const TIER_4_BASE_OPTIONS = {
	tier_4_traits: {
		title_html: 'Gain a +1 bonus to two unmarked character traits and mark them.',
		short_title: '+1 to 2 Traits',
		max: 3,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_4_max_hp: {
		title_html: 'Permanently gain 1 Hit Point slot.',
		short_title: '+1 HP Slot',
		max: 2,
		costs_two_choices: false,
		character_modifiers: [
			{
				behaviour: 'bonus',
				target: 'max_hp',
				type: 'flat',
				value: 1,
				character_conditions: []
			}
		]
	},
	tier_4_max_stress: {
		title_html: 'Permanently gain 1 Stress slot.',
		short_title: '+1 Stress Slot',
		max: 2,
		costs_two_choices: false,
		character_modifiers: [
			{
				behaviour: 'bonus',
				target: 'max_stress',
				type: 'flat',
				value: 1,
				character_conditions: []
			}
		]
	},
	tier_4_experience_bonus: {
		title_html: 'Permanently gain a +1 bonus to two Experiences.',
		short_title: '+1 to 2 Experiences',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_4_domain_card: {
		title_html:
			'Choose an additional domain card of your level or lower from a domain you have access to.',
		short_title: '+1 Domain Card',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_4_evasion: {
		title_html: 'Permanently gain a +1 bonus to your Evasion.',
		short_title: '+1 Evasion',
		max: 1,
		costs_two_choices: false,
		character_modifiers: [
			{
				behaviour: 'bonus',
				target: 'evasion',
				type: 'flat',
				value: 1,
				character_conditions: []
			}
		]
	},
	tier_4_subclass_upgrade: {
		title_html: 'Take an upgraded subclass card. Disables the **Multiclass** option for this tier',
		short_title: 'Upgrade Subclass',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_4_proficiency: {
		title_html: 'Increase your Proficiency by +1.',
		short_title: '+1 Proficiency',
		max: 1,
		costs_two_choices: true,
		character_modifiers: [
			{
				behaviour: 'bonus',
				target: 'proficiency',
				type: 'flat',
				value: 1,
				character_conditions: []
			}
		]
	},
	tier_4_multiclass: {
		title_html:
			'Multiclass: Choose an additional class for your character (disables **Take an upgraded subclass card** for this tier and the **Tier 3 Multiclass** option).',
		short_title: 'Multiclass',
		max: 1,
		costs_two_choices: true,
		character_modifiers: []
	}
} as const satisfies Record<Tier4OptionIds, LevelUpOption>;

export const ALL_LEVEL_UP_OPTIONS = {
	...TIER_1_BASE_OPTIONS,
	...TIER_2_BASE_OPTIONS,
	...TIER_3_BASE_OPTIONS,
	...TIER_4_BASE_OPTIONS
} as const satisfies Record<AllTierOptionIds, LevelUpOption>;
