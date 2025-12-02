import type {
	AllTierOptionIds,
	LevelUpOption,
	Tier1OptionIds,
	Tier2OptionIds,
	Tier3OptionIds,
	Tier4OptionIds
} from '$lib/types/rule-types';
import type { Armor, Weapon } from '$lib/types/compendium-types';

export const TRAIT_OPTIONS = [2, 1, 1, 0, 0, -1] as const;

export const TRAITS = {
	agility: {
		name: 'Agility',
		short_name: 'agi',
		examples: ['Sprint', 'Leap', 'Maneuver']
	},
	strength: {
		name: 'Strength',
		short_name: 'str',
		examples: ['Lift', 'Smash', 'Grapple']
	},
	finesse: {
		name: 'Finesse',
		short_name: 'fin',
		examples: ['Control', 'Hide', 'Tinker']
	},
	instinct: {
		name: 'Instinct',
		short_name: 'inst',
		examples: ['Perceive', 'Sense', 'Navigate']
	},
	presence: {
		name: 'Presence',
		short_name: 'pres',
		examples: ['Charm', 'Perform', 'Deceive']
	},
	knowledge: {
		name: 'Knowledge',
		short_name: 'know',
		examples: ['Recall', 'Analyze', 'Comprehend']
	}
} as const;

export const BASE_UNARMED_ATTACK: Weapon = {
	id: 'unarmed_attack',
	source_id: 'SRD',
	title: 'Unarmed Attack',
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

export const BASE_ARMOR: Armor = {
	id: 'unarmored',
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
	max_domain_card_loadout: 5,
	max_hope: 6,
	max_armor: 0,
	max_hp: 0,
	max_stress: 6,
	max_burden: 2,
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

export const TIER_1_BASE_OPTIONS = {
	tier_1_domain_cards: {
		title_html: '<p>Choose 2 level 1 domain cards from the domains available to you.</p>',
		short_title: 'Starting Domain Cards',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	}
} as const satisfies Record<Tier1OptionIds, LevelUpOption>;

export const TIER_2_BASE_OPTIONS = {
	tier_2_traits: {
		title_html: '<p>Gain a +1 bonus to two unmarked character traits and mark them.</p>',
		short_title: '+1 to 2 Traits',
		max: 3,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_2_max_hp: {
		title_html: '<p>Permanently gain 1 Hit Point slot.</p>',
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
		title_html: '<p>Permanently gain 1 Stress slot.</p>',
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
		title_html: '<p>Permanently gain a +1 bonus to two Experiences.</p>',
		short_title: '+1 to 2 Experiences',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_2_domain_card: {
		title_html:
			'<p>Choose an additional domain card of your level or lower from a domain you have access to (up to level 4).</p>',
		short_title: '+1 Domain Card',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_2_evasion: {
		title_html: '<p>Permanently gain a +1 bonus to your Evasion.</p>',
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
		title_html: '<p>Gain a +1 bonus to two unmarked character traits and mark them.</p>',
		short_title: '+1 to 2 Traits',
		max: 3,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_3_max_hp: {
		title_html: '<p>Permanently gain 1 Hit Point slot.</p>',
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
		title_html: '<p>Permanently gain 1 Stress slot.</p>',
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
		title_html: '<p>Permanently gain a +1 bonus to two Experiences.</p>',
		short_title: '+1 to 2 Experiences',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_3_domain_card: {
		title_html:
			'<p>Choose an additional domain card of your level or lower from a domain you have access to (up to level 7).</p>',
		short_title: '+1 Domain Card',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_3_evasion: {
		title_html: '<p>Permanently gain a +1 bonus to your Evasion.</p>',
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
		title_html:
			'<p>Take an upgraded subclass card. Disables the <b>Multiclass</b> option for this tier</p>',
		short_title: 'Upgrade Subclass',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_3_proficiency: {
		title_html: '<p>Increase your Proficiency by +1.</p>',
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
			'<p>Multiclass: Choose an additional class for your character (disables <b>Take an upgraded subclass card</b> for this tier and the <b>Tier 4 Multiclass</b> option).</p>',
		short_title: 'Multiclass',
		max: 1,
		costs_two_choices: true,
		character_modifiers: []
	}
} as const satisfies Record<Tier3OptionIds, LevelUpOption>;

export const TIER_4_BASE_OPTIONS = {
	tier_4_traits: {
		title_html: '<p>Gain a +1 bonus to two unmarked character traits and mark them.</p>',
		short_title: '+1 to 2 Traits',
		max: 3,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_4_max_hp: {
		title_html: '<p>Permanently gain 1 Hit Point slot.</p>',
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
		title_html: '<p>Permanently gain 1 Stress slot.</p>',
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
		title_html: '<p>Permanently gain a +1 bonus to two Experiences.</p>',
		short_title: '+1 to 2 Experiences',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_4_domain_card: {
		title_html:
			'<p>Choose an additional domain card of your level or lower from a domain you have access to.</p>',
		short_title: '+1 Domain Card',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_4_evasion: {
		title_html: '<p>Permanently gain a +1 bonus to your Evasion.</p>',
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
		title_html:
			'<p>Take an upgraded subclass card. Disables the <b>Multiclass</b> option for this tier</p>',
		short_title: 'Upgrade Subclass',
		max: 1,
		costs_two_choices: false,
		character_modifiers: []
	},
	tier_4_proficiency: {
		title_html: '<p>Increase your Proficiency by +1.</p>',
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
			'<p>Multiclass: Choose an additional class for your character (disables <b>Take an upgraded subclass card</b> for this tier and the <b>Tier 3 Multiclass</b> option).</p>',
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
