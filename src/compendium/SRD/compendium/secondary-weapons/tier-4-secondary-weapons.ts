import type { SecondaryWeapon } from '../../../../convex/schemas/compendium';

export const TIER_4_SECONDARY_WEAPONS = {
	legendary_shortsword: {
		source_key: 'SRD',
		title: 'Legendary Shortsword',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
		burden: 1,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 6,
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
						value: 5
					}
				],
				title: 'Paired',
				description_html: '+5 to primary weapon damage to targets within Melee range',
				character_modifiers: []
			}
		]
	},
	legendary_round_shield: {
		source_key: 'SRD',
		title: 'Legendary Round Shield',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d4',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Protective',
				description_html: '+4 to Armor Score',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: 4,
						target: 'max_armor'
					}
				]
			}
		]
	},
	legendary_tower_shield: {
		source_key: 'SRD',
		title: 'Legendary Tower Shield',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Barrier',
				description_html: '+5 to Armor Score; −1 to Evasion',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: 5,
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
	legendary_small_dagger: {
		source_key: 'SRD',
		title: 'Legendary Small Dagger',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 6,
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
						value: 5
					}
				],
				title: 'Paired',
				description_html: '+5 to primary weapon damage to targets within Melee range',
				character_modifiers: []
			}
		]
	},
	legendary_whip: {
		source_key: 'SRD',
		title: 'Legendary Whip',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
		burden: 1,
		available_traits: ['presence'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 6,
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
	legendary_grappler: {
		source_key: 'SRD',
		title: 'Legendary Grappler',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 6,
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
	legendary_hand_crossbow: {
		source_key: 'SRD',
		title: 'Legendary Hand Crossbow',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: []
	},
	braveshield: {
		source_key: 'SRD',
		title: 'Braveshield',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
		burden: 1,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d4',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Sheltering',
				description_html:
					'When you mark an Armor Slot, it reduces damage for you and all allies within Melee range of you who took the same damage.',
				character_modifiers: []
			}
		]
	},
	knuckle_claws: {
		source_key: 'SRD',
		title: 'Knuckle Claws',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 8,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Doubled Up',
				description_html:
					'When you make an attack with your primary weapon, you can deal damage to another target within Melee range.',
				character_modifiers: []
			}
		]
	},
	primer_shard: {
		source_key: 'SRD',
		title: 'Primer Shard',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
		burden: 1,
		available_traits: ['instinct'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 0,
		damage_dice: '1d4',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Locked On',
				description_html:
					'On a successful attack, your next attack against the same target with your primary weapon automatically succeeds.',
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, SecondaryWeapon>;
