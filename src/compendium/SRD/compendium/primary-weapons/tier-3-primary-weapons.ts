import type { PrimaryWeapon } from '../../../../convex/schemas/compendium';

export const TIER_3_PRIMARY_WEAPONS = {
	advanced_broadsword: {
		source_key: 'SRD',
		title: 'Advanced Broadsword',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
		burden: 1,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 1,
		damage_bonus: 6,
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
	advanced_longsword: {
		source_key: 'SRD',
		title: 'Advanced Longsword',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Advanced Battleaxe',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Advanced Greatsword',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
	advanced_mace: {
		source_key: 'SRD',
		title: 'Advanced Mace',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Advanced Warhammer',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Advanced Dagger',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Advanced Quarterstaff',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Advanced Cutlass',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Advanced Rapier',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
					'When you make an attack, you can mark a Stress to target another creature within range.',
				character_modifiers: []
			}
		]
	},
	advanced_halberd: {
		source_key: 'SRD',
		title: 'Advanced Halberd',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Advanced Spear',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Advanced Shortbow',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Advanced Crossbow',
		description_html: '',
		level_requirement: 5,
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
	advanced_longbow: {
		source_key: 'SRD',
		title: 'Advanced Longbow',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Flickerfly Blade',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
				description_html: 'Gain a bonus to your damage rolls equal to your Agility.',
				character_modifiers: []
			}
		]
	},
	bravesword: {
		source_key: 'SRD',
		title: 'Bravesword',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
				description_html: '−1 to Evasion; +3 to Severe damage threshold',
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
		source_key: 'SRD',
		title: 'Hammer of Wrath',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
					'Before you make an attack roll, you can mark a Stress to use a d20 as your damage die.',
				character_modifiers: []
			}
		]
	},
	labrys_axe: {
		source_key: 'SRD',
		title: 'Labrys Axe',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
	meridian_cutlass: {
		source_key: 'SRD',
		title: 'Meridian Cutlass',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
					'When there are no other creatures within Close range of the target, gain advantage on your attack roll against them.',
				character_modifiers: []
			}
		]
	},
	retractable_saber: {
		source_key: 'SRD',
		title: 'Retractable Saber',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
				description_html: 'The blade can be hidden in the hilt to avoid detection.',
				character_modifiers: []
			}
		]
	},
	double_flail: {
		source_key: 'SRD',
		title: 'Double Flail',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
					'On a successful attack, roll an additional damage die and discard the lowest result.',
				character_modifiers: []
			}
		]
	},
	talon_blades: {
		source_key: 'SRD',
		title: 'Talon Blades',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
					'When you roll the maximum value on a damage die, roll an additional damage die.',
				character_modifiers: []
			}
		]
	},
	black_powder_revolver: {
		source_key: 'SRD',
		title: 'Black Powder Revolver',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
					'After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.',
				character_modifiers: []
			}
		]
	},
	spiked_bow: {
		source_key: 'SRD',
		title: 'Spiked Bow',
		description_html: '',
		level_requirement: 5,
		type: 'Physical',
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
					'This weapon can also be used with these statistics—Agility, Melee, d10+5.',
				character_modifiers: []
			}
		]
	},
	// magic weapons
	advanced_arcane_gauntlets: {
		source_key: 'SRD',
		title: 'Advanced Arcane Gauntlets',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
		burden: 2,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: []
	},
	advanced_hallowed_axe: {
		source_key: 'SRD',
		title: 'Advanced Hallowed Axe',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
		burden: 1,
		available_traits: ['strength'],
		range: 'Melee',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: []
	},
	advanced_glowing_rings: {
		source_key: 'SRD',
		title: 'Advanced Glowing Rings',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
		burden: 2,
		available_traits: ['agility'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 8,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: []
	},
	advanced_hand_runes: {
		source_key: 'SRD',
		title: 'Advanced Hand Runes',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
		burden: 1,
		available_traits: ['instinct'],
		range: 'Very Close',
		attack_roll_bonus: 0,
		damage_bonus: 6,
		damage_dice: '1d10',
		available_damage_types: ['mag'],
		features: []
	},
	advanced_returning_blade: {
		source_key: 'SRD',
		title: 'Advanced Returning Blade',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
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
					'When this weapon is thrown within its range, it appears in your hand immediately after the attack.',
				character_modifiers: []
			}
		]
	},
	advanced_shortstaff: {
		source_key: 'SRD',
		title: 'Advanced Shortstaff',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
		burden: 1,
		available_traits: ['instinct'],
		range: 'Close',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d8',
		available_damage_types: ['mag'],
		features: []
	},
	advanced_dualstaff: {
		source_key: 'SRD',
		title: 'Advanced Dualstaff',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
		burden: 2,
		available_traits: ['instinct'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 9,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: []
	},
	advanced_scepter: {
		source_key: 'SRD',
		title: 'Advanced Scepter',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
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
					'This weapon can also be used with these statistics—Presence, Melee, d8+4.',
				character_modifiers: []
			}
		]
	},
	advanced_wand: {
		source_key: 'SRD',
		title: 'Advanced Wand',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
		burden: 1,
		available_traits: ['knowledge'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 7,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: []
	},
	advanced_greatstaff: {
		source_key: 'SRD',
		title: 'Advanced Greatstaff',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
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
					'On a successful attack, roll an additional damage die and discard the lowest result.',
				character_modifiers: []
			}
		]
	},
	axe_of_fortunis: {
		source_key: 'SRD',
		title: 'Axe of Fortunis',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
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
				description_html: 'On a failed attack, you can mark a Stress to reroll your attack.',
				character_modifiers: []
			}
		]
	},
	blessed_anlace: {
		source_key: 'SRD',
		title: 'Blessed Anlace',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
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
				description_html: 'During downtime, automatically clear a Hit Point.',
				character_modifiers: []
			}
		]
	},
	ghostblade: {
		source_key: 'SRD',
		title: 'Ghostblade',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
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
				description_html: 'On a successful attack, you can deal physical or magic damage.',
				character_modifiers: []
			}
		]
	},
	runes_of_ruination: {
		source_key: 'SRD',
		title: 'Runes of Ruination',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
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
				description_html: 'Each time you make a successful attack, you must mark a Stress.',
				character_modifiers: []
			}
		]
	},
	widogast_pendant: {
		source_key: 'SRD',
		title: 'Widogast Pendant',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
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
				description_html: 'You choose the target of your attack after making your attack roll.',
				character_modifiers: []
			}
		]
	},
	gilded_bow: {
		source_key: 'SRD',
		title: 'Gilded Bow',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
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
				description_html: 'When you roll a 1 on a damage die, it deals 6 damage instead.',
				character_modifiers: []
			}
		]
	},
	firestaff: {
		source_key: 'SRD',
		title: 'Firestaff',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
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
				description_html: 'When you roll a 6 on a damage die, the target must mark a Stress.',
				character_modifiers: []
			}
		]
	},
	mage_orb: {
		source_key: 'SRD',
		title: 'Mage Orb',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
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
					'On a successful attack, roll an additional damage die and discard the lowest result.',
				character_modifiers: []
			}
		]
	},
	ilmari_rifle: {
		source_key: 'SRD',
		title: 'Ilmari’s Rifle',
		description_html: '',
		level_requirement: 5,
		type: 'Magical',
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
					'After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.',
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, PrimaryWeapon>;
