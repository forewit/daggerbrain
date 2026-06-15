import type { PrimaryWeapon } from '../../../../convex/schemas/compendium';

// todo: verify all below

export const TIER_1_PRIMARY_WEAPONS = {
	broadsword: {
		source_key: 'SRD',
		title: 'Broadsword',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
		burden: 1,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 1,
		damage_bonus: 0,
		damage_dice: '1d8',
		available_damage_types: ['phy'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Reliable',
				description_html: '+1 to attack rolls',
				character_modifiers: []
			}
		]
	},
	longsword: {
		source_key: 'SRD',
		title: 'Longsword',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Battleaxe',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Greatsword',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
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
					'-1 to Evasion. On a successful attack, roll an additional damage die and discard the lowest result.',
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
		source_key: 'SRD',
		title: 'Mace',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Warhammer',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
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
				description_html: '-1 to Evasion',
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
		source_key: 'SRD',
		title: 'Dagger',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Quarterstaff',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Cutlass',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Rapier',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
		burden: 1,
		available_traits: ['presence'],
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
					'When you make an attack, you can mark a Stress to target another creature within range.',
				character_modifiers: []
			}
		]
	},
	halberd: {
		source_key: 'SRD',
		title: 'Halberd',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Spear',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Shortbow',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Crossbow',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Longbow',
		description_html: '',
		level_requirement: 1,
		type: 'Physical',
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
				description_html: '-1 to Finesse',
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
		source_key: 'SRD',
		title: 'Arcane Gauntlets',
		description_html: '',
		level_requirement: 1,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Hallowed Axe',
		description_html: '',
		level_requirement: 1,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Glowing Rings',
		description_html: '',
		level_requirement: 1,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Hand Runes',
		description_html: '',
		level_requirement: 1,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Returning Blade',
		description_html: '',
		level_requirement: 1,
		type: 'Magical',
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
					'When this weapon is thrown within its range, it appears in your hand immediately after the attack.',
				character_modifiers: []
			}
		]
	},
	shortstaff: {
		source_key: 'SRD',
		title: 'Shortstaff',
		description_html: '',
		level_requirement: 1,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Dualstaff',
		description_html: '',
		level_requirement: 1,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Scepter',
		description_html: '',
		level_requirement: 1,
		type: 'Magical',
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
				description_html: 'This weapon can also be used with these statistics—Presence, Melee, d8.',
				character_modifiers: []
			}
		]
	},
	wand: {
		source_key: 'SRD',
		title: 'Wand',
		description_html: '',
		level_requirement: 1,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Greatstaff',
		description_html: '',
		level_requirement: 1,
		type: 'Magical',
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
					'On a successful attack, roll an additional damage die and discard the lowest result.',
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, PrimaryWeapon>;
