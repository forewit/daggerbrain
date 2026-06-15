import type { SecondaryWeapon } from '../../../../convex/schemas/compendium';

export const TIER_3_SECONDARY_WEAPONS = {
	advanced_shortsword: {
		source_key: 'SRD',
		title: 'Advanced Shortsword',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
		burden: 1,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 4,
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
						value: 4
					}
				],
				title: 'Paired',
				description_html: '+4 to primary weapon damage to targets within Melee range',
				character_modifiers: []
			}
		]
	},
	advanced_round_shield: {
		source_key: 'SRD',
		title: 'Advanced Round Shield',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d4',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Protective',
				description_html: '+3 to Armor Score',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: 3,
						target: 'max_armor'
					}
				]
			}
		]
	},
	advanced_tower_shield: {
		source_key: 'SRD',
		title: 'Advanced Tower Shield',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Barrier',
				description_html: '+4 to Armor Score; −1 to Evasion',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: 4,
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
	advanced_small_dagger: {
		source_key: 'SRD',
		title: 'Advanced Small Dagger',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 4,
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
						value: 4
					}
				],
				title: 'Paired',
				description_html: '+4 to primary weapon damage to targets within Melee range',
				character_modifiers: []
			}
		]
	},
	advanced_whip: {
		source_key: 'SRD',
		title: 'Advanced Whip',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
		burden: 1,
		available_traits: ['presence'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 4,
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
	advanced_grappler: {
		source_key: 'SRD',
		title: 'Advanced Grappler',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 4,
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
	advanced_hand_crossbow: {
		source_key: 'SRD',
		title: 'Advanced Hand Crossbow',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 5,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: []
	},
	buckler: {
		source_key: 'SRD',
		title: 'Buckler',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
		burden: 1,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d4',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Deflecting',
				description_html:
					'When you are attacked, you can mark an Armor Slot to gain a bonus to your Evasion equal to your available Armor Score against the attack.',
				character_modifiers: []
			}
		]
	},
	powered_gauntlet: {
		source_key: 'SRD',
		title: 'Powered Gauntlet',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
		burden: 1,
		available_traits: ['knowledge'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Charged',
				description_html:
					'Mark a Stress to gain a +1 bonus to your Proficiency on a primary weapon attack.',
				character_modifiers: []
			}
		]
	},
	hand_sling: {
		source_key: 'SRD',
		title: 'Hand Sling',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Very Far',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Versatile',
				description_html:
					'This weapon can also be used with these statistics—Finesse, Close, 1d8+4.',
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, SecondaryWeapon>;
