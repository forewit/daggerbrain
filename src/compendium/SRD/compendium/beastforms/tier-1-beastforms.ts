import type { Beastform } from '../../../../convex/schemas/compendium';

export const TIER_1_BEASTFORMS = {
	agile_scout: {
		source_key: 'SRD',
		level_requirement: 1,
		title: 'Agile Scout',
		category: 'Fox, Mouse, Weasel, etc.',
		character_trait: {
			trait: 'agility',
			bonus: 1
		},
		evasion_bonus: 2,
		attack: {
			range: 'Melee',
			trait: 'agility',
			damage_dice: 'd4',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		advantages: ['deceive', 'locate', 'sneak'],
		features: [
			{
				title: 'Agile',
				description_html:
					'Your movement is silent, and you can **spend a Hope** to move up to Far range without rolling.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Fragile',
				description_html: 'When you take Major or greater damage, you drop out of Beastform.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	household_friend: {
		source_key: 'SRD',
		level_requirement: 1,
		title: 'Household Friend',
		category: 'Cat, Dog, Rabbit, etc.',
		character_trait: {
			trait: 'instinct',
			bonus: 1
		},
		evasion_bonus: 2,
		attack: {
			range: 'Melee',
			trait: 'instinct',
			damage_dice: 'd6',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		advantages: ['climb', 'locate', 'protect'],
		features: [
			{
				title: 'Companion',
				description_html: 'When you Help an Ally, you can roll a **d8** as your advantage die.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Fragile',
				description_html: 'When you take Major or greater damage, you drop out of Beastform.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	nimble_grazer: {
		source_key: 'SRD',
		level_requirement: 1,
		title: 'Nimble Grazer',
		category: 'Deer, Gazelle, Goat, etc.',
		character_trait: {
			trait: 'agility',
			bonus: 1
		},
		evasion_bonus: 3,
		attack: {
			range: 'Melee',
			trait: 'agility',
			damage_dice: 'd6',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		advantages: ['leap', 'sneak', 'sprint'],
		features: [
			{
				title: 'Elusive Prey',
				description_html:
					'When an attack roll against you would succeed, you can **mark a Stress** and roll a **d4**. Add the result to your Evasion against this attack.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Fragile',
				description_html: 'When you take Major or greater damage, you drop out of Beastform.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	pack_predator: {
		source_key: 'SRD',
		level_requirement: 1,
		title: 'Pack Predator',
		category: 'Coyote, Hyena, Wolf, etc.',
		character_trait: {
			trait: 'strength',
			bonus: 2
		},
		evasion_bonus: 1,
		attack: {
			range: 'Melee',
			trait: 'strength',
			damage_dice: 'd8',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		advantages: ['attack', 'sprint', 'track'],
		features: [
			{
				title: 'Hobbling Strike',
				description_html:
					'When you succeed on an attack against a target within Melee range, you can **mark a Stress** to make the target temporarily *Vulnerable*.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Pack Hunting',
				description_html:
					'When you succeed on an attack against the same target as an ally who acts immediately before you, add a **d8** to your damage roll.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	aquatic_scout: {
		source_key: 'SRD',
		level_requirement: 1,
		title: 'Aquatic Scout',
		category: 'Eel, Fish, Octopus, etc.',
		character_trait: {
			trait: 'agility',
			bonus: 1
		},
		evasion_bonus: 2,
		attack: {
			range: 'Melee',
			trait: 'agility',
			damage_dice: 'd4',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		advantages: ['navigate', 'sneak', 'swim'],
		features: [
			{
				title: 'Aquatic',
				description_html: 'You can breathe and move naturally underwater.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Fragile',
				description_html: 'When you take Major or greater damage, you drop out of Beastform.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	stalking_arachnid: {
		source_key: 'SRD',
		level_requirement: 1,
		title: 'Stalking Arachnid',
		category: 'Tarantula, Wolf Spider, etc.',
		character_trait: {
			trait: 'finesse',
			bonus: 1
		},
		evasion_bonus: 2,
		attack: {
			range: 'Melee',
			trait: 'finesse',
			damage_dice: 'd6',
			damage_bonus: 1,
			damage_type: 'phy'
		},
		advantages: ['attack', 'climb', 'sneak'],
		features: [
			{
				title: 'Venomous Bite',
				description_html:
					'When you succeed on an attack against a target within Melee range, the target becomes temporarily *Poisoned*. A *Poisoned* creature takes **1d10** direct physical damage each time they act.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Webslinger',
				description_html:
					'You can create a strong web material useful for both adventuring and battle. The web is resilient enough to support one creature. You can temporarily *Restrain* a target within Close range by succeeding on a Finesse Roll against them.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	}
} as const satisfies Record<string, Beastform>;
