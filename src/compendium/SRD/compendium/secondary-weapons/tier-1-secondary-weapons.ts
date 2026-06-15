import type { SecondaryWeapon } from '../../../../convex/schemas/compendium';

// todo: verify all below

export const TIER_1_SECONDARY_WEAPONS = {
	shortsword: {
		source_key: 'SRD',
		title: 'Shortsword',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
		burden: 1,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 0,
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
						value: 2
					}
				],
				title: 'Paired',
				description_html: '+2 to primary weapon damage to targets within Melee range',
				character_modifiers: []
			}
		]
	},
	round_shield: {
		source_key: 'SRD',
		title: 'Round Shield',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 0,
		damage_dice: '1d4',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Protective',
				description_html: '+1 to Armor Score',
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
	tower_shield: {
		source_key: 'SRD',
		title: 'Tower Shield',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 0,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Barrier',
				description_html: '+2 to Armor Score; −1 to Evasion',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: 2,
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
	small_dagger: {
		source_key: 'SRD',
		title: 'Small Dagger',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 0,
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
						value: 2
					}
				],
				title: 'Paired',
				description_html: '+2 to primary weapon damage to targets within Melee range',
				character_modifiers: []
			}
		]
	},
	whip: {
		source_key: 'SRD',
		title: 'Whip',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
		burden: 1,
		available_traits: ['presence'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 0,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Startling',
				description_html:
					'Mark a Stress to crack the whip and force all adversaries within Melee range back to Close range.',
				character_modifiers: [] // narrative effect, no numeric modifier
			}
		]
	},
	grappler: {
		source_key: 'SRD',
		title: 'Grappler',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 0,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Hooked',
				description_html: 'On a successful attack, you can pull the target into Melee range.',
				character_modifiers: [] // positional effect, no numeric modifier
			}
		]
	},
	hand_crossbow: {
		source_key: 'SRD',
		title: 'Hand Crossbow',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 1,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: []
	}
} as const satisfies Record<string, SecondaryWeapon>;
