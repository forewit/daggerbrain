import type { SecondaryWeapon } from '../../../../convex/schemas/compendium';

export const TIER_2_SECONDARY_WEAPONS = {
	improved_shortsword: {
		source_key: 'SRD',
		title: 'Improved Shortsword',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
		burden: 1,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 2,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [
					{
						behaviour: 'bonus',
						target_weapon: 'primary',
						target_stat: 'damage_bonus',
						character_conditions: [],
						weapon_conditions: [],
						type: 'flat',
						value: 3
					}
				],
				title: 'Paired',
				description_html: '+3 to primary weapon damage to targets within Melee range',
				character_modifiers: []
			}
		]
	},
	improved_round_shield: {
		source_key: 'SRD',
		title: 'Improved Round Shield',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 2,
		damage_dice: '1d4',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Protective',
				description_html: '+2 to Armor Score',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: 2,
						target: 'max_armor'
					}
				]
			}
		]
	},
	improved_tower_shield: {
		source_key: 'SRD',
		title: 'Improved Tower Shield',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 2,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Barrier',
				description_html: '+3 to Armor Score; −1 to Evasion',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: 3,
						target: 'max_armor'
					},
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: -1,
						target: 'evasion'
					}
				]
			}
		]
	},
	improved_small_dagger: {
		source_key: 'SRD',
		title: 'Improved Small Dagger',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 2,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [
					{
						behaviour: 'bonus',
						target_weapon: 'primary',
						target_stat: 'damage_bonus',
						character_conditions: [],
						weapon_conditions: [],
						type: 'flat',
						value: 3
					}
				],
				title: 'Paired',
				description_html: '+3 to primary weapon damage to targets within Melee range',
				character_modifiers: []
			}
		]
	},
	improved_whip: {
		source_key: 'SRD',
		title: 'Improved Whip',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
		burden: 1,
		available_traits: ['presence'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 2,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Startling',
				description_html:
					'Mark a Stress to crack the whip and force all adversaries within Melee range back to Close range.',
				character_modifiers: []
			}
		]
	},
	improved_grappler: {
		source_key: 'SRD',
		title: 'Improved Grappler',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 2,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Hooked',
				description_html: 'On a successful attack, you can pull the target into Melee range.',
				character_modifiers: []
			}
		]
	},
	improved_hand_crossbow: {
		source_key: 'SRD',
		title: 'Improved Hand Crossbow',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: []
	},
	spiked_shield: {
		source_key: 'SRD',
		title: 'Spiked Shield',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 2,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [
					{
						behaviour: 'bonus',
						target_weapon: 'primary',
						target_stat: 'damage_bonus',
						character_conditions: [],
						weapon_conditions: [],
						type: 'flat',
						value: 1
					}
				],
				title: 'Double Duty',
				description_html: '+1 to Armor Score; +1 to primary weapon damage within Melee range',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: 1,
						target: 'max_armor'
					}
				]
			}
		]
	},
	parrying_dagger: {
		source_key: 'SRD',
		title: 'Parrying Dagger',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 2,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Parry',
				description_html:
					"When you are attacked, roll this weapon's damage dice. If any of the attacker's damage dice rolled the same value as your dice, the matching results are discarded from the attacker's damage dice before the damage you take is totaled.",
				character_modifiers: []
			}
		]
	},
	returning_axe: {
		source_key: 'SRD',
		title: 'Returning Axe',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
		burden: 1,
		available_traits: ['agility'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Returning',
				description_html:
					'When this weapon is thrown within its range, it appears in your hand immediately after the attack.',
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, SecondaryWeapon>;
