import type { PrimaryWeapon } from '../../../../convex/schemas/compendium';

export const TIER_4_PRIMARY_WEAPONS = {
	legendary_broadsword: {
		source_key: 'SRD',
		title: 'Legendary Broadsword',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
		burden: 1,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 1,
		damage_bonus: 9,
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
	legendary_longsword: {
		source_key: 'SRD',
		title: 'Legendary Longsword',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Legendary Battleaxe',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Legendary Greatsword',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
					'−1 to Evasion; on a successful attack, roll an additional damage die and discard the lowest result.',
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
		source_key: 'SRD',
		title: 'Legendary Mace',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Legendary Warhammer',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Legendary Dagger',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Legendary Quarterstaff',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Legendary Cutlass',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Legendary Rapier',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
					'When you make an attack, you can mark a Stress to target another creature within range.',
				character_modifiers: []
			}
		]
	},
	legendary_halberd: {
		source_key: 'SRD',
		title: 'Legendary Halberd',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Legendary Spear',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Legendary Shortbow',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Legendary Crossbow',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Legendary Longbow',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Blade of the Valiant',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
					'When you have 3 or more HP marked, gain a +2 bonus to your attack rolls.',
				character_modifiers: []
			}
		]
	},
	soul_cleaver: {
		source_key: 'SRD',
		title: 'Soul Cleaver',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
					'When you deal damage to a target, you can mark a Stress to clear a Hit Point.',
				character_modifiers: []
			}
		]
	},
	void_touched_blade: {
		source_key: 'SRD',
		title: 'Void-Touched Blade',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
					'On a successful attack, you can mark a Stress to teleport to any unoccupied space within Close range.',
				character_modifiers: []
			}
		]
	},
	dragon_scale_whip: {
		source_key: 'SRD',
		title: 'Dragon-Scale Whip',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
					'When you roll the maximum value on a damage die, you can make an additional attack against the same target.',
				character_modifiers: []
			}
		]
	},
	meteor_hammer: {
		source_key: 'SRD',
		title: 'Meteor Hammer',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
					'On a successful attack, the target must succeed on a reaction roll (16) or be knocked prone.',
				character_modifiers: []
			}
		]
	},
	sunken_anchor: {
		source_key: 'SRD',
		title: 'Sunken Anchor',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Whirlwind Glaive',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
					'When you make an attack, you can mark a Stress to target all creatures within Melee range.',
				character_modifiers: []
			}
		]
	},
	repeating_crossbow: {
		source_key: 'SRD',
		title: 'Repeating Crossbow',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
					'When you make an attack, you can mark a Stress to make an additional attack against the same target.',
				character_modifiers: []
			}
		]
	},
	oathbow: {
		source_key: 'SRD',
		title: 'Oathbow',
		description_html: '',
		level_requirement: 8,
		type: 'Physical',
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
					'At the start of a scene, you can choose one target. Your attacks against that target deal an additional +2 damage.',
				character_modifiers: []
			}
		]
	},
	// magic
	legendary_arcane_gauntlets: {
		source_key: 'SRD',
		title: 'Legendary Arcane Gauntlets',
		description_html: '',
		level_requirement: 8,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Legendary Hallowed Axe',
		description_html: '',
		level_requirement: 8,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Legendary Glowing Rings',
		description_html: '',
		level_requirement: 8,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Legendary Hand Runes',
		description_html: '',
		level_requirement: 8,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Legendary Returning Blade',
		description_html: '',
		level_requirement: 8,
		type: 'Magical',
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
					'When this weapon is thrown within its range, it appears in your hand immediately after the attack.',
				character_modifiers: []
			}
		]
	},
	legendary_shortstaff: {
		source_key: 'SRD',
		title: 'Legendary Shortstaff',
		description_html: '',
		level_requirement: 8,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Legendary Dualstaff',
		description_html: '',
		level_requirement: 8,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Legendary Scepter',
		description_html: '',
		level_requirement: 8,
		type: 'Magical',
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
					'This weapon can also be used with these statistics—Presence, Melee, 1d8+6.',
				character_modifiers: []
			}
		]
	},
	legendary_wand: {
		source_key: 'SRD',
		title: 'Legendary Wand',
		description_html: '',
		level_requirement: 8,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Legendary Greatstaff',
		description_html: '',
		level_requirement: 8,
		type: 'Magical',
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
					'On a successful attack, roll an additional damage die and discard the lowest result.',
				character_modifiers: []
			}
		]
	},
	blade_of_the_ancients: {
		source_key: 'SRD',
		title: 'Blade of the Ancients',
		description_html: '',
		level_requirement: 8,
		type: 'Magical',
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
					'When you make an attack, you can mark a Stress to gain advantage on the roll.',
				character_modifiers: []
			}
		]
	},
	staff_of_the_magi: {
		source_key: 'SRD',
		title: 'Staff of the Magi',
		description_html: '',
		level_requirement: 8,
		type: 'Magical',
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
					'When you roll the maximum value on a damage die, you can choose to deal that damage to another target within range.',
				character_modifiers: []
			}
		]
	},
	sunfire_tome: {
		source_key: 'SRD',
		title: 'Sunfire Tome',
		description_html: '',
		level_requirement: 8,
		type: 'Magical',
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
					'On a successful attack, the target must succeed on a reaction roll (16) or be blinded for one round.',
				character_modifiers: []
			}
		]
	},
	frostwind_bow: {
		source_key: 'SRD',
		title: 'Frostwind Bow',
		description_html: '',
		level_requirement: 8,
		type: 'Magical',
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
					"On a successful attack, the target's movement speed is halved for one round.",
				character_modifiers: []
			}
		]
	},
	stormcaller_javelin: {
		source_key: 'SRD',
		title: 'Stormcaller Javelin',
		description_html: '',
		level_requirement: 8,
		type: 'Magical',
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
					'When you throw this weapon, you can mark a Stress to have it return to your hand immediately after the attack.',
				character_modifiers: []
			}
		]
	},
	earthshaker_maul: {
		source_key: 'SRD',
		title: 'Earthshaker Maul',
		description_html: '',
		level_requirement: 8,
		type: 'Magical',
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
					'On a successful attack, you can mark a Stress to force all creatures within Close range to succeed on a reaction roll (16) or be knocked prone.',
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, PrimaryWeapon>;
