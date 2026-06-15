import type { PrimaryWeapon } from '../../../../convex/schemas/compendium';

export const TIER_2_PRIMARY_WEAPONS = {
	improved_broadsword: {
		source_key: 'SRD',
		title: 'Improved Broadsword',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
		burden: 1,
		available_traits: ['agility'],
		range: 'Melee',
		attack_roll_bonus: 1,
		damage_bonus: 3,
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
	improved_longsword: {
		source_key: 'SRD',
		title: 'Improved Longsword',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Improved Battleaxe',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Improved Greatsword',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
	improved_mace: {
		source_key: 'SRD',
		title: 'Improved Mace',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Improved Warhammer',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
	improved_dagger: {
		source_key: 'SRD',
		title: 'Improved Dagger',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Improved Quarterstaff',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Improved Cutlass',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Improved Rapier',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
					'When you make an attack, you can mark a Stress to target another creature within range.',
				character_modifiers: []
			}
		]
	},
	improved_halberd: {
		source_key: 'SRD',
		title: 'Improved Halberd',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
	improved_spear: {
		source_key: 'SRD',
		title: 'Improved Spear',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Improved Shortbow',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Improved Crossbow',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Improved Longbow',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
	gilded_falchion: {
		source_key: 'SRD',
		title: 'Gilded Falchion',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
					'On a successful attack, roll an additional damage die and discard the lowest result.',
				character_modifiers: []
			}
		]
	},
	knuckle_blades: {
		source_key: 'SRD',
		title: 'Knuckle Blades',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
					'When you roll the maximum value on a damage die, roll an additional damage die.',
				character_modifiers: []
			}
		]
	},
	urok_broadsword: {
		source_key: 'SRD',
		title: 'Urok Broadsword',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
		source_key: 'SRD',
		title: 'Bladed Whip',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
					'When you make an attack, you can mark a Stress to target another creature within range.',
				character_modifiers: []
			}
		]
	},
	steelforged_halberd: {
		source_key: 'SRD',
		title: 'Steelforged Halberd',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
				description_html: 'On a successful attack, the target must mark a Stress.',
				character_modifiers: []
			}
		]
	},
	war_scythe: {
		source_key: 'SRD',
		title: 'War Scythe',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
		burden: 2,
		available_traits: ['finesse'],
		range: 'Very Close',
		attack_roll_bonus: 1,
		damage_bonus: 5,
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
	blunderbuss: {
		source_key: 'SRD',
		title: 'Blunderbuss',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
					'After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.',
				character_modifiers: []
			}
		]
	},
	greatbow: {
		source_key: 'SRD',
		title: 'Greatbow',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
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
					'On a successful attack, roll an additional damage die and discard the lowest result.',
				character_modifiers: []
			}
		]
	},
	finehair_bow: {
		source_key: 'SRD',
		title: 'Finehair Bow',
		description_html: '',
		level_requirement: 2,
		type: 'Physical',
		burden: 2,
		available_traits: ['agility'],
		range: 'Very Far',
		attack_roll_bonus: 1,
		damage_bonus: 5,
		damage_dice: '1d6',
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

	// MAGIC WEAPONS
	improved_arcane_gauntlets: {
		source_key: 'SRD',
		title: 'Improved Arcane Gauntlets',
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Improved Hallowed Axe',
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Improved Glowing Rings',
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Improved Hand Runes',
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Improved Returning Blade',
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
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
					'When this weapon is thrown within its range, it appears in your hand immediately after the attack.',
				character_modifiers: []
			}
		]
	},
	improved_shortstaff: {
		source_key: 'SRD',
		title: 'Improved Shortstaff',
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Improved Dualstaff',
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Improved Scepter',
		description_html: '',
		level_requirement: 2,
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
				description_html:
					'This weapon can also be used with these statistics—Presence, Melee, d8+3.',
				character_modifiers: []
			}
		]
	},
	improved_wand: {
		source_key: 'SRD',
		title: 'Improved Wand',
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Improved Greatstaff',
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
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
					'On a successful attack, roll an additional damage die and discard the lowest result.',
				character_modifiers: []
			}
		]
	},
	ego_blade: {
		source_key: 'SRD',
		title: 'Ego Blade',
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
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
				description_html: 'You must have a Presence of 0 or lower to use this weapon.',
				character_modifiers: []
			}
		]
	},
	casting_sword: {
		source_key: 'SRD',
		title: 'Casting Sword',
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
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
					'This weapon can also be used with these statistics—Knowledge, Far, d6+3.',
				character_modifiers: []
			}
		]
	},
	devouring_dagger: {
		source_key: 'SRD',
		title: 'Devouring Dagger',
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
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
				description_html: 'On a successful attack, the target must mark a Stress.',
				character_modifiers: []
			}
		]
	},
	hammer_of_exota: {
		source_key: 'SRD',
		title: 'Hammer of Exota',
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
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
					'On a successful attack against a target within Melee range, all other adversaries within Very Close range must succeed on a reaction roll (14) or take half damage.',
				character_modifiers: []
			}
		]
	},
	yutari_bloodbow: {
		source_key: 'SRD',
		title: 'Yutari Bloodbow',
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
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
					'When you roll the maximum value on a damage die, roll an additional damage die.',
				character_modifiers: []
			}
		]
	},
	elder_bow: {
		source_key: 'SRD',
		title: 'Elder Bow',
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
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
					'On a successful attack, roll an additional damage die and discard the lowest result.',
				character_modifiers: []
			}
		]
	},
	scepter_of_elias: {
		source_key: 'SRD',
		title: 'Scepter of Elias',
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
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
		source_key: 'SRD',
		title: 'Wand of Enthrallment',
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
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
					'Before you make a Presence Roll, you can mark a Stress to gain a +2 bonus to the result.',
				character_modifiers: []
			}
		]
	},
	keepers_staff: {
		source_key: 'SRD',
		title: "Keeper's Staff",
		description_html: '',
		level_requirement: 2,
		type: 'Magical',
		burden: 2,
		available_traits: ['knowledge'],
		range: 'Far',
		attack_roll_bonus: 1,
		damage_bonus: 4,
		damage_dice: '1d6',
		available_damage_types: ['mag'],
		features: [
			{
				weapon_modifiers: [],
				title: 'Reliable',
				description_html: '+1 to attack rolls',
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, PrimaryWeapon>;
