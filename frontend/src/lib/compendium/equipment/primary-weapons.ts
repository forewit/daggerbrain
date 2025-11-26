import type { Weapon } from '$lib/types/compendium-types';

// todo: verify all below
export const TIER_1_PRIMARY_WEAPONS = {
	broadsword: {
		id: 'broadsword',
		source_id: 'SRD',
		title: 'Broadsword',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
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
						target_stat: 'attack_roll',
						character_conditions: [],
						value: 1
					}
				],
				title: 'Reliable',
				description_html: '<p>+1 to attack rolls</p>',
				character_modifiers: []
			}
		]
	},
	longsword: {
		id: 'longsword',

		source_id: 'SRD',
		title: 'Longsword',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: []
	},
	battleaxe: {
		id: 'battleaxe',

		source_id: 'SRD',
		title: 'Battleaxe',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: []
	},
	greatsword: {
		id: 'greatsword',

		source_id: 'SRD',
		title: 'Greatsword',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Massive',
				description_html:
					'<p>-1 to Evasion. On a successful attack, roll an additional damage die and discard the lowest result.</p>',
				character_modifiers: [
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
	mace: {
		id: 'mace',

		source_id: 'SRD',
		title: 'Mace',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 1,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: []
	},
	warhammer: {
		id: 'warhammer',

		source_id: 'SRD',
		title: 'Warhammer',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d12',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Heavy',
				description_html: '<p>-1 to Evasion</p>',
				character_modifiers: [
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
	dagger: {
		id: 'dagger',

		source_id: 'SRD',
		title: 'Dagger',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 1,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: []
	},
	quarterstaff: {
		id: 'quarterstaff',

		source_id: 'SRD',
		title: 'Quarterstaff',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 2,
		available_traits: ['instinct'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: []
	},
	cutlass: {
		id: 'cutlass',

		source_id: 'SRD',
		title: 'Cutlass',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 1,
		available_traits: ['presence'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 1,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: []
	},
	rapier: {
		id: 'rapier',

		source_id: 'SRD',
		title: 'Rapier',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 0,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Quick',
				description_html:
					'<p>When you make an attack, you can mark a Stress to target another creature within range.</p>',
				character_modifiers: []
			}
		]
	},
	halberd: {
		id: 'halberd',

		source_id: 'SRD',
		title: 'Halberd',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 2,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: []
	},
	spear: {
		id: 'spear',

		source_id: 'SRD',
		title: 'Spear',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 2,
		available_traits: ['finesse'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 2,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: []
	},
	shortbow: {
		id: 'shortbow',

		source_id: 'SRD',
		title: 'Shortbow',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: []
	},
	crossbow: {
		id: 'crossbow',

		source_id: 'SRD',
		title: 'Crossbow',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 2,
		available_traits: ['finesse'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 1,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: []
	},
	longbow: {
		id: 'longbow',

		source_id: 'SRD',
		title: 'Longbow',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Very Far',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Cumbersome',
				description_html: '<p>-1 to Finesse</p>',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: -1,
						target: 'trait',
						trait: 'finesse'
					}
				]
			}
		]
	},
	// MAGIC WEAPONS
	arcane_gauntlets: {
		id: 'arcane_gauntlets',
		source_id: 'SRD',
		title: 'Arcane Gauntlets',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: []
	},
	hallowed_axe: {
		id: 'hallowed_axe',
		source_id: 'SRD',
		title: 'Hallowed Axe',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 1,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: []
	},
	glowing_rings: {
		id: 'glowing_rings',
		source_id: 'SRD',
		title: 'Glowing Rings',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 2,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: []
	},
	hand_runes: {
		id: 'hand_runes',
		source_id: 'SRD',
		title: 'Hand Runes',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 1,
		available_traits: ['instinct'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 0,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: []
	},
	returning_blade: {
		id: 'returning_blade',
		source_id: 'SRD',
		title: 'Returning Blade',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 0,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Returning',
				description_html:
					'<p>When this weapon is thrown within its range, it appears in your hand immediately after the attack.</p>',
				character_modifiers: []
			}
		]
	},
	shortstaff: {
		id: 'shortstaff',
		source_id: 'SRD',
		title: 'Shortstaff',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 2,
		available_traits: ['instinct'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 1,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: []
	},
	dualstaff: {
		id: 'dualstaff',
		source_id: 'SRD',
		title: 'Dualstaff',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 2,
		available_traits: ['instinct'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: []
	},
	scepter: {
		id: 'scepter',
		source_id: 'SRD',
		title: 'Scepter',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 2,
		available_traits: ['presence'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Versatile',
				description_html:
					'<p>This weapon can also be used with these statistics—Presence, Melee, d8.</p>',
				character_modifiers: []
			}
		]
	},
	wand: {
		id: 'wand',
		source_id: 'SRD',
		title: 'Wand',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 2,
		available_traits: ['knowledge'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 1,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: []
	},
	greatstaff: {
		id: 'greatstaff',
		source_id: 'SRD',
		title: 'Greatstaff',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		burden: 2,
		available_traits: ['knowledge'],
		range: 'Very Far',
		attack_roll_bonus: 0,
		damage_bonus: 0,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Powerful',
				description_html:
					'<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>',
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, Weapon>;

export const TIER_2_PRIMARY_WEAPONS = {
	improved_broadsword: {
		id: 'improved_broadsword',
		source_id: 'SRD',
		title: 'Improved Broadsword',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [
					{
						behaviour: 'bonus',
						target_weapon: 'primary',
						target_stat: 'attack_roll',
						character_conditions: [],
						value: 1
					}
				],
				title: 'Reliable',
				description_html: '<p>+1 to attack rolls</p>',
				character_modifiers: []
			}
		]
	},
	improved_longsword: {
		id: 'improved_longsword',
		source_id: 'SRD',
		title: 'Improved Longsword',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: []
	},
	improved_battleaxe: {
		id: 'improved_battleaxe',
		source_id: 'SRD',
		title: 'Improved Battleaxe',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: []
	},
	improved_greatsword: {
		id: 'improved_greatsword',
		source_id: 'SRD',
		title: 'Improved Greatsword',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Massive',
				description_html:
					'<p>-1 to Evasion. On a successful attack, roll an additional damage die and discard the lowest result.</p>',
				character_modifiers: [
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
	improved_mace: {
		id: 'improved_mace',
		source_id: 'SRD',
		title: 'Improved Mace',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: []
	},
	improved_warhammer: {
		id: 'improved_warhammer',
		source_id: 'SRD',
		title: 'Improved Warhammer',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d12',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Heavy',
				description_html: '<p>-1 to Evasion</p>',
				character_modifiers: [
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
	improved_dagger: {
		id: 'improved_dagger',
		source_id: 'SRD',
		title: 'Improved Dagger',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: []
	},
	improved_quarterstaff: {
		id: 'improved_quarterstaff',
		source_id: 'SRD',
		title: 'Improved Quarterstaff',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['instinct'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: []
	},
	improved_cutlass: {
		id: 'improved_cutlass',
		source_id: 'SRD',
		title: 'Improved Cutlass',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['presence'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: []
	},
	improved_rapier: {
		id: 'improved_rapier',
		source_id: 'SRD',
		title: 'Improved Rapier',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['presence'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Quick',
				description_html:
					'<p>When you make an attack, you can mark a Stress to target another creature within range.</p>',
				character_modifiers: []
			}
		]
	},
	improved_halberd: {
		id: 'improved_halberd',
		source_id: 'SRD',
		title: 'Improved Halberd',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 5,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Cumbersome',
				description_html: '<p>-1 to Finesse</p>',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: -1,
						target: 'trait',
						trait: 'finesse'
					}
				]
			}
		]
	},
	improved_spear: {
		id: 'improved_spear',
		source_id: 'SRD',
		title: 'Improved Spear',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['finesse'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: []
	},
	improved_shortbow: {
		id: 'improved_shortbow',
		source_id: 'SRD',
		title: 'Improved Shortbow',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: []
	},
	improved_crossbow: {
		id: 'improved_crossbow',
		source_id: 'SRD',
		title: 'Improved Crossbow',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: []
	},
	improved_longbow: {
		id: 'improved_longbow',
		source_id: 'SRD',
		title: 'Improved Longbow',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Very Far',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Cumbersome',
				description_html: '<p>-1 to Finesse</p>',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: -1,
						target: 'trait',
						trait: 'finesse'
					}
				]
			}
		]
	},
	gilded_falchion: {
		id: 'gilded_falchion',
		source_id: 'SRD',
		title: 'Gilded Falchion',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Powerful',
				description_html:
					'<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>',
				character_modifiers: []
			}
		]
	},
	knuckle_blades: {
		id: 'knuckle_blades',
		source_id: 'SRD',
		title: 'Knuckle Blades',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Brutal',
				description_html:
					'<p>When you roll the maximum value on a damage die, roll an additional damage die.</p>',
				character_modifiers: []
			}
		]
	},
	urok_broadsword: {
		id: 'urok_broadsword',
		source_id: 'SRD',
		title: 'Urok Broadsword',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Deadly',
				description_html:
					'<p>When you deal Severe damage, the target must mark an additional HP.</p>',
				character_modifiers: []
			}
		]
	},
	bladed_whip: {
		id: 'bladed_whip',
		source_id: 'SRD',
		title: 'Bladed Whip',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['agility'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Quick',
				description_html:
					'<p>When you make an attack, you can mark a Stress to target another creature within range.</p>',
				character_modifiers: []
			}
		]
	},
	steelforged_halberd: {
		id: 'steelforged_halberd',
		source_id: 'SRD',
		title: 'Steelforged Halberd',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Scary',
				description_html: '<p>On a successful attack, the target must mark a Stress.</p>',
				character_modifiers: []
			}
		]
	},
	war_scythe: {
		id: 'war_scythe',
		source_id: 'SRD',
		title: 'War Scythe',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['finesse'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 5,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [
					{
						behaviour: 'bonus',
						target_weapon: 'primary',
						target_stat: 'attack_roll',
						character_conditions: [],
						value: 1
					}
				],
				title: 'Reliable',
				description_html: '<p>+1 to attack rolls</p>',
				character_modifiers: []
			}
		]
	},
	blunderbuss: {
		id: 'blunderbuss',
		source_id: 'SRD',
		title: 'Blunderbuss',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['finesse'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Reloading',
				description_html:
					'<p>After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.</p>',
				character_modifiers: []
			}
		]
	},
	greatbow: {
		id: 'greatbow',
		source_id: 'SRD',
		title: 'Greatbow',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Powerful',
				description_html:
					'<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>',
				character_modifiers: []
			}
		]
	},
	finehair_bow: {
		id: 'finehair_bow',
		source_id: 'SRD',
		title: 'Finehair Bow',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Very Far',
		attack_roll_bonus: 0,
		damage_bonus: 5,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [
					{
						behaviour: 'bonus',
						target_weapon: 'primary',
						target_stat: 'attack_roll',
						character_conditions: [],
						value: 1
					}
				],
				title: 'Reliable',
				description_html: '<p>+1 to attack rolls</p>',
				character_modifiers: []
			}
		]
	},

	// MAGIC WEAPONS
	improved_arcane_gauntlets: {
		id: 'improved_arcane_gauntlets',
		source_id: 'SRD',
		title: 'Improved Arcane Gauntlets',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: []
	},
	improved_hallowed_axe: {
		id: 'improved_hallowed_axe',
		source_id: 'SRD',
		title: 'Improved Hallowed Axe',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: []
	},
	improved_glowing_rings: {
		id: 'improved_glowing_rings',
		source_id: 'SRD',
		title: 'Improved Glowing Rings',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 5,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: []
	},
	improved_hand_runes: {
		id: 'improved_hand_runes',
		source_id: 'SRD',
		title: 'Improved Hand Runes',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['instinct'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: []
	},
	improved_returning_blade: {
		id: 'improved_returning_blade',
		source_id: 'SRD',
		title: 'Improved Returning Blade',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Returning',
				description_html:
					'<p>When this weapon is thrown within its range, it appears in your hand immediately after the attack.</p>',
				character_modifiers: []
			}
		]
	},
	improved_shortstaff: {
		id: 'improved_shortstaff',
		source_id: 'SRD',
		title: 'Improved Shortstaff',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['instinct'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: []
	},
	improved_dualstaff: {
		id: 'improved_dualstaff',
		source_id: 'SRD',
		title: 'Improved Dualstaff',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['instinct'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: []
	},
	improved_scepter: {
		id: 'improved_scepter',
		source_id: 'SRD',
		title: 'Improved Scepter',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['presence'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Versatile',
				description_html:
					'<p>This weapon can also be used with these statistics—Presence, Melee, d8+3.</p>',
				character_modifiers: []
			}
		]
	},
	improved_wand: {
		id: 'improved_wand',
		source_id: 'SRD',
		title: 'Improved Wand',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['knowledge'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: []
	},
	improved_greatstaff: {
		id: 'improved_greatstaff',
		source_id: 'SRD',
		title: 'Improved Greatstaff',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['knowledge'],
		range: 'Very Far',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Powerful',
				description_html:
					'<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>',
				character_modifiers: []
			}
		]
	},
	ego_blade: {
		id: 'ego_blade',
		source_id: 'SRD',
		title: 'Ego Blade',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d12',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Pompous',
				description_html: '<p>You must have a Presence of 0 or lower to use this weapon.</p>',
				character_modifiers: []
			}
		]
	},
	casting_sword: {
		id: 'casting_sword',
		source_id: 'SRD',
		title: 'Casting Sword',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Versatile',
				description_html:
					'<p>This weapon can also be used with these statistics—Knowledge, Far, d6+3.</p>',
				character_modifiers: []
			}
		]
	},
	devouring_dagger: {
		id: 'devouring_dagger',
		source_id: 'SRD',
		title: 'Devouring Dagger',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Scary',
				description_html: '<p>On a successful attack, the target must mark a Stress.</p>',
				character_modifiers: []
			}
		]
	},
	hammer_of_exota: {
		id: 'hammer_of_exota',
		source_id: 'SRD',
		title: 'Hammer of Exota',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['instinct'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Eruptive',
				description_html:
					'<p>On a successful attack against a target within Melee range, all other adversaries within Very Close range must succeed on a reaction roll (14) or take half damage.</p>',
				character_modifiers: []
			}
		]
	},
	yutari_bloodbow: {
		id: 'yutari_bloodbow',
		source_id: 'SRD',
		title: 'Yutari Bloodbow',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['finesse'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Brutal',
				description_html:
					'<p>When you roll the maximum value on a damage die, roll an additional damage die.</p>',
				character_modifiers: []
			}
		]
	},
	elder_bow: {
		id: 'elder_bow',
		source_id: 'SRD',
		title: 'Elder Bow',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['instinct'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Powerful',
				description_html:
					'<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>',
				character_modifiers: []
			}
		]
	},
	scepter_of_elias: {
		id: 'scepter_of_elias',
		source_id: 'SRD',
		title: 'Scepter of Elias',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['presence'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 3,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Invigorating',
				description_html:
					'<p>On a successful attack, roll a d4. On a result of 4, clear a Stress.</p>',
				character_modifiers: []
			}
		]
	},
	wand_of_enthrallment: {
		id: 'wand_of_enthrallment',
		source_id: 'SRD',
		title: 'Wand of Enthrallment',
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 1,
		available_traits: ['presence'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Persuasive',
				description_html:
					'<p>Before you make a Presence Roll, you can mark a Stress to gain a +2 bonus to the result.</p>',
				character_modifiers: []
			}
		]
	},
	keepers_staff: {
		id: 'keepers_staff',
		source_id: 'SRD',
		title: "Keeper's Staff",
		description_html: '',
		level_requirement: 2,
		category: 'Primary',
		burden: 2,
		available_traits: ['knowledge'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [
					{
						behaviour: 'bonus',
						target_weapon: 'primary',
						target_stat: 'attack_roll',
						character_conditions: [],
						value: 1
					}
				],
				title: 'Reliable',
				description_html: '<p>+1 to attack rolls</p>',
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, Weapon>;

export const TIER_3_PRIMARY_WEAPONS = {
	advanced_broadsword: {
		id: 'advanced_broadsword',
		source_id: 'SRD',
		title: 'Advanced Broadsword',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
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
						target_stat: 'attack_roll',
						character_conditions: [],
						value: 1
					}
				],
				title: 'Reliable',
				description_html: '<p>+1 to attack rolls</p>',
				character_modifiers: []
			}
		]
	},
	advanced_longsword: {
		id: 'advanced_longsword',
		source_id: 'SRD',
		title: 'Advanced Longsword',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: []
	},
	advanced_battleaxe: {
		id: 'advanced_battleaxe',
		source_id: 'SRD',
		title: 'Advanced Battleaxe',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: []
	},
	advanced_greatsword: {
		id: 'advanced_greatsword',
		source_id: 'SRD',
		title: 'Advanced Greatsword',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Massive',
				description_html:
					'<p>−1 to Evasion; on a successful attack, roll an additional damage die and discard the lowest result.</p>',
				character_modifiers: [
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
	advanced_mace: {
		id: 'advanced_mace',
		source_id: 'SRD',
		title: 'Advanced Mace',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: []
	},
	advanced_warhammer: {
		id: 'advanced_warhammer',
		source_id: 'SRD',
		title: 'Advanced Warhammer',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d12',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Heavy',
				description_html: '<p>−1 to Evasion</p>',
				character_modifiers: [
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
	advanced_dagger: {
		id: 'advanced_dagger',
		source_id: 'SRD',
		title: 'Advanced Dagger',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: []
	},
	advanced_quarterstaff: {
		id: 'advanced_quarterstaff',
		source_id: 'SRD',
		title: 'Advanced Quarterstaff',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['instinct'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: []
	},
	advanced_cutlass: {
		id: 'advanced_cutlass',
		source_id: 'SRD',
		title: 'Advanced Cutlass',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['presence'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: []
	},
	advanced_rapier: {
		id: 'advanced_rapier',
		source_id: 'SRD',
		title: 'Advanced Rapier',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['presence'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Quick',
				description_html:
					'<p>When you make an attack, you can mark a Stress to target another creature within range.</p>',
				character_modifiers: []
			}
		]
	},
	advanced_halberd: {
		id: 'advanced_halberd',
		source_id: 'SRD',
		title: 'Advanced Halberd',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 8,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Cumbersome',
				description_html: '<p>−1 to Finesse</p>',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: -1,
						target: 'trait',
						trait: 'finesse'
					}
				]
			}
		]
	},
	advanced_spear: {
		id: 'advanced_spear',
		source_id: 'SRD',
		title: 'Advanced Spear',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['finesse'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: []
	},
	advanced_shortbow: {
		id: 'advanced_shortbow',
		source_id: 'SRD',
		title: 'Advanced Shortbow',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: []
	},
	advanced_crossbow: {
		id: 'advanced_crossbow',
		source_id: 'SRD',
		title: 'Advanced Crossbow',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: []
	},
	advanced_longbow: {
		id: 'advanced_longbow',
		source_id: 'SRD',
		title: 'Advanced Longbow',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Very Far',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Cumbersome',
				description_html: '<p>−1 to Finesse</p>',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: -1,
						target: 'trait',
						trait: 'finesse'
					}
				]
			}
		]
	},
	flickerfly_blade: {
		id: 'flickerfly_blade',
		source_id: 'SRD',
		title: 'Flickerfly Blade',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 5,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Sharpwing',
				description_html: '<p>Gain a bonus to your damage rolls equal to your Agility.</p>',
				character_modifiers: []
			}
		]
	},
	bravesword: {
		id: 'bravesword',
		source_id: 'SRD',
		title: 'Bravesword',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d12',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Brave',
				description_html: '<p>−1 to Evasion; +3 to Severe damage threshold</p>',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: -1,
						target: 'evasion'
					},
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: 3,
						target: 'severe_damage_threshold'
					}
				]
			}
		]
	},
	hammer_of_wrath: {
		id: 'hammer_of_wrath',
		source_id: 'SRD',
		title: 'Hammer of Wrath',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Devastating',
				description_html:
					'<p>Before you make an attack roll, you can mark a Stress to use a d20 as your damage die.</p>',
				character_modifiers: []
			}
		]
	},
	labrys_axe: {
		id: 'labrys_axe',
		source_id: 'SRD',
		title: 'Labrys Axe',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Protective',
				description_html: '<p>+1 to Armor Score</p>',
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
	meridian_cutlass: {
		id: 'meridian_cutlass',
		source_id: 'SRD',
		title: 'Meridian Cutlass',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['presence'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 5,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Dueling',
				description_html:
					'<p>When there are no other creatures within Close range of the target, gain advantage on your attack roll against them.</p>',
				character_modifiers: []
			}
		]
	},
	retractable_saber: {
		id: 'retractable_saber',
		source_id: 'SRD',
		title: 'Retractable Saber',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['presence'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Retractable',
				description_html: '<p>The blade can be hidden in the hilt to avoid detection.</p>',
				character_modifiers: []
			}
		]
	},
	double_flail: {
		id: 'double_flail',
		source_id: 'SRD',
		title: 'Double Flail',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 8,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Powerful',
				description_html:
					'<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>',
				character_modifiers: []
			}
		]
	},
	talon_blades: {
		id: 'talon_blades',
		source_id: 'SRD',
		title: 'Talon Blades',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['finesse'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Brutal',
				description_html:
					'<p>When you roll the maximum value on a damage die, roll an additional damage die.</p>',
				character_modifiers: []
			}
		]
	},
	black_powder_revolver: {
		id: 'black_powder_revolver',
		source_id: 'SRD',
		title: 'Black Powder Revolver',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 8,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Reloading',
				description_html:
					'<p>After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.</p>',
				character_modifiers: []
			}
		]
	},
	spiked_bow: {
		id: 'spiked_bow',
		source_id: 'SRD',
		title: 'Spiked Bow',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Very Far',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Versatile',
				description_html:
					'<p>This weapon can also be used with these statistics—Agility, Melee, d10+5.</p>',
				character_modifiers: []
			}
		]
	},
	// magic weapons
	arcane_gauntlets: {
		id: 'arcane_gauntlets',
		source_id: 'SRD',
		title: 'Arcane Gauntlets',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: []
	},
	hallowed_axe: {
		id: 'hallowed_axe',
		source_id: 'SRD',
		title: 'Hallowed Axe',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: []
	},
	glowing_rings: {
		id: 'glowing_rings',
		source_id: 'SRD',
		title: 'Glowing Rings',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 8,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: []
	},
	hand_runes: {
		id: 'hand_runes',
		source_id: 'SRD',
		title: 'Hand Runes',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['instinct'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: []
	},
	returning_blade: {
		id: 'returning_blade',
		source_id: 'SRD',
		title: 'Returning Blade',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Returning',
				description_html:
					'<p>When this weapon is thrown within its range, it appears in your hand immediately after the attack.</p>',
				character_modifiers: []
			}
		]
	},
	shortstaff: {
		id: 'shortstaff',
		source_id: 'SRD',
		title: 'Shortstaff',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['instinct'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: []
	},
	dualstaff: {
		id: 'dualstaff',
		source_id: 'SRD',
		title: 'Dualstaff',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['instinct'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: []
	},
	scepter: {
		id: 'scepter',
		source_id: 'SRD',
		title: 'Scepter',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['presence'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Versatile',
				description_html:
					'<p>This weapon can also be used with these statistics—Presence, Melee, 1d8+4.</p>',
				character_modifiers: []
			}
		]
	},
	wand: {
		id: 'wand',
		source_id: 'SRD',
		title: 'Wand',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['knowledge'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: []
	},
	greatstaff: {
		id: 'greatstaff',
		source_id: 'SRD',
		title: 'Greatstaff',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['knowledge'],
		range: 'Very Far',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Powerful',
				description_html:
					'<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>',
				character_modifiers: []
			}
		]
	},
	axe_of_fortunis: {
		id: 'axe_of_fortunis',
		source_id: 'SRD',
		title: 'Axe of Fortunis',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 8,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Lucky',
				description_html: '<p>On a failed attack, you can mark a Stress to reroll your attack.</p>',
				character_modifiers: []
			}
		]
	},
	blessed_anlace: {
		id: 'blessed_anlace',
		source_id: 'SRD',
		title: 'Blessed Anlace',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['instinct'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Healing',
				description_html: '<p>During downtime, automatically clear a Hit Point.</p>',
				character_modifiers: []
			}
		]
	},
	ghostblade: {
		id: 'ghostblade',
		source_id: 'SRD',
		title: 'Ghostblade',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['presence'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d10',
		available_damage_types: ['mag', 'phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Otherworldly',
				description_html: '<p>On a successful attack, you can deal physical or magic damage.</p>',
				character_modifiers: []
			}
		]
	},
	runes_of_ruination: {
		id: 'runes_of_ruination',
		source_id: 'SRD',
		title: 'Runes of Ruination',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['knowledge'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 4,
		damage_dice: '1d20',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Painful',
				description_html: '<p>Each time you make a successful attack, you must mark a Stress.</p>',
				character_modifiers: []
			}
		]
	},
	widogast_pendant: {
		id: 'widogast_pendant',
		source_id: 'SRD',
		title: 'Widogast Pendant',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['knowledge'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 5,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Timebending',
				description_html:
					'<p>You choose the target of your attack after making your attack roll.</p>',
				character_modifiers: []
			}
		]
	},
	gilded_bow: {
		id: 'gilded_bow',
		source_id: 'SRD',
		title: 'Gilded Bow',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['finesse'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Self-Correcting',
				description_html: '<p>When you roll a 1 on a damage die, it deals 6 damage instead.</p>',
				character_modifiers: []
			}
		]
	},
	firestaff: {
		id: 'firestaff',
		source_id: 'SRD',
		title: 'Firestaff',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 2,
		available_traits: ['instinct'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Burning',
				description_html:
					'<p>When you roll a 6 on a damage die, the target must mark a Stress.</p>',
				character_modifiers: []
			}
		]
	},
	mage_orb: {
		id: 'mage_orb',
		source_id: 'SRD',
		title: 'Mage Orb',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['knowledge'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Powerful',
				description_html:
					'<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>',
				character_modifiers: []
			}
		]
	},
	ilmari_rifle: {
		id: 'ilmari_rifle',
		source_id: 'SRD',
		title: 'Ilmari’s Rifle',
		description_html: '',
		level_requirement: 5,
		category: 'Primary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Very Far',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Reloading',
				description_html:
					'<p>After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.</p>',
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, Weapon>;

export const TIER_4_PRIMARY_WEAPONS = {
	legendary_broadsword: {
		id: 'legendary_broadsword',
		source_id: 'SRD',
		title: 'Legendary Broadsword',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 1,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [
					{
						behaviour: 'bonus',
						target_weapon: 'primary',
						target_stat: 'attack_roll',
						character_conditions: [],
						value: 1
					}
				],
				title: 'Reliable',
				description_html: '<p>+1 to attack rolls</p>',
				character_modifiers: []
			}
		]
	},
	legendary_longsword: {
		id: 'legendary_longsword',
		source_id: 'SRD',
		title: 'Legendary Longsword',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 12,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: []
	},
	legendary_battleaxe: {
		id: 'legendary_battleaxe',
		source_id: 'SRD',
		title: 'Legendary Battleaxe',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 12,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: []
	},
	legendary_greatsword: {
		id: 'legendary_greatsword',
		source_id: 'SRD',
		title: 'Legendary Greatsword',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 12,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Massive',
				description_html:
					'<p>−1 to Evasion; on a successful attack, roll an additional damage die and discard the lowest result.</p>',
				character_modifiers: [
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
	legendary_mace: {
		id: 'legendary_mace',
		source_id: 'SRD',
		title: 'Legendary Mace',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 10,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: []
	},
	legendary_warhammer: {
		id: 'legendary_warhammer',
		source_id: 'SRD',
		title: 'Legendary Warhammer',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 12,
		damage_dice: '1d12',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Heavy',
				description_html: '<p>−1 to Evasion</p>',
				character_modifiers: [
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
	legendary_dagger: {
		id: 'legendary_dagger',
		source_id: 'SRD',
		title: 'Legendary Dagger',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 10,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: []
	},
	legendary_quarterstaff: {
		id: 'legendary_quarterstaff',
		source_id: 'SRD',
		title: 'Legendary Quarterstaff',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['instinct'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 12,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: []
	},
	legendary_cutlass: {
		id: 'legendary_cutlass',
		source_id: 'SRD',
		title: 'Legendary Cutlass',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 1,
		available_traits: ['presence'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 10,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: []
	},
	legendary_rapier: {
		id: 'legendary_rapier',
		source_id: 'SRD',
		title: 'Legendary Rapier',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 1,
		available_traits: ['presence'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Quick',
				description_html:
					'<p>When you make an attack, you can mark a Stress to target another creature within range.</p>',
				character_modifiers: []
			}
		]
	},
	legendary_halberd: {
		id: 'legendary_halberd',
		source_id: 'SRD',
		title: 'Legendary Halberd',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 11,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Cumbersome',
				description_html: '<p>−1 to Finesse</p>',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: -1,
						target: 'trait',
						trait: 'finesse'
					}
				]
			}
		]
	},
	legendary_spear: {
		id: 'legendary_spear',
		source_id: 'SRD',
		title: 'Legendary Spear',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['finesse'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 12,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: []
	},
	legendary_shortbow: {
		id: 'legendary_shortbow',
		source_id: 'SRD',
		title: 'Legendary Shortbow',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 12,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: []
	},
	legendary_crossbow: {
		id: 'legendary_crossbow',
		source_id: 'SRD',
		title: 'Legendary Crossbow',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 10,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: []
	},
	legendary_longbow: {
		id: 'legendary_longbow',
		source_id: 'SRD',
		title: 'Legendary Longbow',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Very Far',
		attack_roll_bonus: 0,
		damage_bonus: 12,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Cumbersome',
				description_html: '<p>−1 to Finesse</p>',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: -1,
						target: 'trait',
						trait: 'finesse'
					}
				]
			}
		]
	},
	blade_of_the_valiant: {
		id: 'blade_of_the_valiant',
		source_id: 'SRD',
		title: 'Blade of the Valiant',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 10,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Valiant',
				description_html:
					'<p>When you have 3 or more HP marked, gain a +2 bonus to your attack rolls.</p>',
				character_modifiers: []
			}
		]
	},
	soul_cleaver: {
		id: 'soul_cleaver',
		source_id: 'SRD',
		title: 'Soul Cleaver',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 12,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Soul Eater',
				description_html:
					'<p>When you deal damage to a target, you can mark a Stress to clear a Hit Point.</p>',
				character_modifiers: []
			}
		]
	},
	void_touched_blade: {
		id: 'void_touched_blade',
		source_id: 'SRD',
		title: 'Void-Touched Blade',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 10,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Void-Touched',
				description_html:
					'<p>On a successful attack, you can mark a Stress to teleport to any unoccupied space within Close range.</p>',
				character_modifiers: []
			}
		]
	},
	dragon_scale_whip: {
		id: 'dragon_scale_whip',
		source_id: 'SRD',
		title: 'Dragon-Scale Whip',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 1,
		available_traits: ['presence'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 10,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: "Dragon's Fury",
				description_html:
					'<p>When you roll the maximum value on a damage die, you can make an additional attack against the same target.</p>',
				character_modifiers: []
			}
		]
	},
	meteor_hammer: {
		id: 'meteor_hammer',
		source_id: 'SRD',
		title: 'Meteor Hammer',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 11,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Crushing',
				description_html:
					'<p>On a successful attack, the target must succeed on a reaction roll (16) or be knocked prone.</p>',
				character_modifiers: []
			}
		]
	},
	sunken_anchor: {
		id: 'sunken_anchor',
		source_id: 'SRD',
		title: 'Sunken Anchor',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 12,
		damage_dice: '1d12',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Heavy',
				description_html: '<p>−1 to Evasion</p>',
				character_modifiers: [
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
	whirlwind_glaive: {
		id: 'whirlwind_glaive',
		source_id: 'SRD',
		title: 'Whirlwind Glaive',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['finesse'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 11,
		damage_dice: '1d10',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Whirlwind',
				description_html:
					'<p>When you make an attack, you can mark a Stress to target all creatures within Melee range.</p>',
				character_modifiers: []
			}
		]
	},
	repeating_crossbow: {
		id: 'repeating_crossbow',
		source_id: 'SRD',
		title: 'Repeating Crossbow',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['finesse'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 10,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Rapid Fire',
				description_html:
					'<p>When you make an attack, you can mark a Stress to make an additional attack against the same target.</p>',
				character_modifiers: []
			}
		]
	},
	oathbow: {
		id: 'oathbow',
		source_id: 'SRD',
		title: 'Oathbow',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Very Far',
		attack_roll_bonus: 0,
		damage_bonus: 11,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Oathbound',
				description_html:
					'<p>At the start of a scene, you can choose one target. Your attacks against that target deal an additional +2 damage.</p>',
				character_modifiers: []
			}
		]
	},
	// magic
	legendary_arcane_gauntlets: {
		id: 'legendary_arcane_gauntlets',
		source_id: 'SRD',
		title: 'Legendary Arcane Gauntlets',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 12,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: []
	},
	legendary_hallowed_axe: {
		id: 'legendary_hallowed_axe',
		source_id: 'SRD',
		title: 'Legendary Hallowed Axe',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 10,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: []
	},
	legendary_glowing_rings: {
		id: 'legendary_glowing_rings',
		source_id: 'SRD',
		title: 'Legendary Glowing Rings',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 11,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: []
	},
	legendary_hand_runes: {
		id: 'legendary_hand_runes',
		source_id: 'SRD',
		title: 'Legendary Hand Runes',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 1,
		available_traits: ['instinct'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: []
	},
	legendary_returning_blade: {
		id: 'legendary_returning_blade',
		source_id: 'SRD',
		title: 'Legendary Returning Blade',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Returning',
				description_html:
					'<p>When this weapon is thrown within its range, it appears in your hand immediately after the attack.</p>',
				character_modifiers: []
			}
		]
	},
	legendary_shortstaff: {
		id: 'legendary_shortstaff',
		source_id: 'SRD',
		title: 'Legendary Shortstaff',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 1,
		available_traits: ['instinct'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 10,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: []
	},
	legendary_dualstaff: {
		id: 'legendary_dualstaff',
		source_id: 'SRD',
		title: 'Legendary Dualstaff',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['instinct'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 12,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: []
	},
	legendary_scepter: {
		id: 'legendary_scepter',
		source_id: 'SRD',
		title: 'Legendary Scepter',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['presence'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Versatile',
				description_html:
					'<p>This weapon can also be used with these statistics—Presence, Melee, 1d8+6.</p>',
				character_modifiers: []
			}
		]
	},
	legendary_wand: {
		id: 'legendary_wand',
		source_id: 'SRD',
		title: 'Legendary Wand',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 1,
		available_traits: ['knowledge'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 10,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: []
	},
	legendary_greatstaff: {
		id: 'legendary_greatstaff',
		source_id: 'SRD',
		title: 'Legendary Greatstaff',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['knowledge'],
		range: 'Very Far',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Powerful',
				description_html:
					'<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>',
				character_modifiers: []
			}
		]
	},
	blade_of_the_ancients: {
		id: 'blade_of_the_ancients',
		source_id: 'SRD',
		title: 'Blade of the Ancients',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 1,
		available_traits: ['knowledge'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 10,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: "Ancient's Wisdom",
				description_html:
					'<p>When you make an attack, you can mark a Stress to gain advantage on the roll.</p>',
				character_modifiers: []
			}
		]
	},
	staff_of_the_magi: {
		id: 'staff_of_the_magi',
		source_id: 'SRD',
		title: 'Staff of the Magi',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['knowledge'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 11,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: "Magi's Power",
				description_html:
					'<p>When you roll the maximum value on a damage die, you can choose to deal that damage to another target within range.</p>',
				character_modifiers: []
			}
		]
	},
	sunfire_tome: {
		id: 'sunfire_tome',
		source_id: 'SRD',
		title: 'Sunfire Tome',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 1,
		available_traits: ['instinct'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 10,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Sunfire',
				description_html:
					'<p>On a successful attack, the target must succeed on a reaction roll (16) or be blinded for one round.</p>',
				character_modifiers: []
			}
		]
	},
	frostwind_bow: {
		id: 'frostwind_bow',
		source_id: 'SRD',
		title: 'Frostwind Bow',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['agility'],
		range: 'Very Far',
		attack_roll_bonus: 0,
		damage_bonus: 11,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Frostwind',
				description_html:
					"<p>On a successful attack, the target's movement speed is halved for one round.</p>",
				character_modifiers: []
			}
		]
	},
	stormcaller_javelin: {
		id: 'stormcaller_javelin',
		source_id: 'SRD',
		title: 'Stormcaller Javelin',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 1,
		available_traits: ['strength'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 12,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Stormcaller',
				description_html:
					'<p>When you throw this weapon, you can mark a Stress to have it return to your hand immediately after the attack.</p>',
				character_modifiers: []
			}
		]
	},
	earthshaker_maul: {
		id: 'earthshaker_maul',
		source_id: 'SRD',
		title: 'Earthshaker Maul',
		description_html: '',
		level_requirement: 8,
		category: 'Primary',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 14,
		damage_dice: '1d12',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Earthshaker',
				description_html:
					'<p>On a successful attack, you can mark a Stress to force all creatures within Close range to succeed on a reaction roll (16) or be knocked prone.</p>',
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, Weapon>;
