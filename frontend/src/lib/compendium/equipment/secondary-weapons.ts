import type { Weapon } from '$lib/types/compendium-types';

// todo: verify all below
export const TIER_1_SECONDARY_WEAPONS = {
	shortsword: {
		id: 'shortsword',
		source_id: 'SRD',
		title: 'Shortsword',
		description_html: '',
		level_requirement: 1,
		category: 'Secondary',
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
						value: 2
					}
				],
				title: 'Paired',
				description_html: '<p>+2 to primary weapon damage to targets within Melee range</p>',
				character_modifiers: []
			}
		]
	},
	round_shield: {
		id: 'round_shield',
		source_id: 'SRD',
		title: 'Round Shield',
		description_html: '',
		level_requirement: 1,
		category: 'Secondary',
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
	tower_shield: {
		id: 'tower_shield',
		source_id: 'SRD',
		title: 'Tower Shield',
		description_html: '',
		level_requirement: 1,
		category: 'Secondary',
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
				description_html: '<p>+2 to Armor Score; −1 to Evasion</p>',
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
		id: 'small_dagger',
		source_id: 'SRD',
		title: 'Small Dagger',
		description_html: '',
		level_requirement: 1,
		category: 'Secondary',
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
						value: 2
					}
				],
				title: 'Paired',
				description_html: '<p>+2 to primary weapon damage to targets within Melee range</p>',
				character_modifiers: []
			}
		]
	},
	whip: {
		id: 'whip',
		source_id: 'SRD',
		title: 'Whip',
		description_html: '',
		level_requirement: 1,
		category: 'Secondary',
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
					'<p>Mark a Stress to crack the whip and force all adversaries within Melee range back to Close range.</p>',
				character_modifiers: [] // narrative effect, no numeric modifier
			}
		]
	},
	grappler: {
		id: 'grappler',
		source_id: 'SRD',
		title: 'Grappler',
		description_html: '',
		level_requirement: 1,
		category: 'Secondary',
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
				description_html:
					'<p>On a successful attack, you can pull the target into Melee range.</p>',
				character_modifiers: [] // positional effect, no numeric modifier
			}
		]
	},
	hand_crossbow: {
		id: 'hand_crossbow',
		source_id: 'SRD',
		title: 'Hand Crossbow',
		description_html: '',
		level_requirement: 1,
		category: 'Secondary',
		burden: 1,
		available_traits: ['finesse'],
		range: 'Far',
		attack_roll_bonus: 0,
		damage_bonus: 1,
		damage_dice: '1d6',
		available_damage_types: ['phy'],
		features: []
	}
} as const satisfies Record<string, Weapon>;

export const TIER_2_SECONDARY_WEAPONS = {
	improved_shortsword: {
		id: 'improved_shortsword',
		source_id: 'SRD',
		title: 'Improved Shortsword',
		description_html: '',
		level_requirement: 2,
		category: 'Secondary',
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
						value: 3
					}
				],
				title: 'Paired',
				description_html: '<p>+3 to primary weapon damage to targets within Melee range</p>',
				character_modifiers: []
			}
		]
	},
	improved_round_shield: {
		id: 'improved_round_shield',
		source_id: 'SRD',
		title: 'Improved Round Shield',
		description_html: '',
		level_requirement: 2,
		category: 'Secondary',
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
				description_html: '<p>+2 to Armor Score</p>',
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
		id: 'improved_tower_shield',
		source_id: 'SRD',
		title: 'Improved Tower Shield',
		description_html: '',
		level_requirement: 2,
		category: 'Secondary',
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
				description_html: '<p>+3 to Armor Score; −1 to Evasion</p>',
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
		id: 'improved_small_dagger',
		source_id: 'SRD',
		title: 'Improved Small Dagger',
		description_html: '',
		level_requirement: 2,
		category: 'Secondary',
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
						value: 3
					}
				],
				title: 'Paired',
				description_html: '<p>+3 to primary weapon damage to targets within Melee range</p>',
				character_modifiers: []
			}
		]
	},
	improved_whip: {
		id: 'improved_whip',
		source_id: 'SRD',
		title: 'Improved Whip',
		description_html: '',
		level_requirement: 2,
		category: 'Secondary',
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
					'<p>Mark a Stress to crack the whip and force all adversaries within Melee range back to Close range.</p>',
				character_modifiers: []
			}
		]
	},
	improved_grappler: {
		id: 'improved_grappler',
		source_id: 'SRD',
		title: 'Improved Grappler',
		description_html: '',
		level_requirement: 2,
		category: 'Secondary',
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
				description_html:
					'<p>On a successful attack, you can pull the target into Melee range.</p>',
				character_modifiers: []
			}
		]
	},
	improved_hand_crossbow: {
		id: 'improved_hand_crossbow',
		source_id: 'SRD',
		title: 'Improved Hand Crossbow',
		description_html: '',
		level_requirement: 2,
		category: 'Secondary',
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
		id: 'spiked_shield',
		source_id: 'SRD',
		title: 'Spiked Shield',
		description_html: '',
		level_requirement: 2,
		category: 'Secondary',
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
						value: 1
					}
				],
				title: 'Double Duty',
				description_html:
					'<p>+1 to Armor Score; +1 to primary weapon damage within Melee range</p>',
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
		id: 'parrying_dagger',
		source_id: 'SRD',
		title: 'Parrying Dagger',
		description_html: '',
		level_requirement: 2,
		category: 'Secondary',
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
					"<p>When you are attacked, roll this weapon's damage dice. If any of the attacker's damage dice rolled the same value as your dice, the matching results are discarded from the attacker's damage dice before the damage you take is totaled.</p>",
				character_modifiers: []
			}
		]
	},
	returning_axe: {
		id: 'returning_axe',
		source_id: 'SRD',
		title: 'Returning Axe',
		description_html: '',
		level_requirement: 2,
		category: 'Secondary',
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
					'<p>When this weapon is thrown within its range, it appears in your hand immediately after the attack.</p>',
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, Weapon>;

export const TIER_3_SECONDARY_WEAPONS = {
	advanced_shortsword: {
		id: 'advanced_shortsword',
		source_id: 'SRD',
		title: 'Advanced Shortsword',
		description_html: '',
		level_requirement: 5,
		category: 'Secondary',
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
						value: 4
					}
				],
				title: 'Paired',
				description_html: '<p>+4 to primary weapon damage to targets within Melee range</p>',
				character_modifiers: []
			}
		]
	},
	advanced_round_shield: {
		id: 'advanced_round_shield',
		source_id: 'SRD',
		title: 'Advanced Round Shield',
		description_html: '',
		level_requirement: 5,
		category: 'Secondary',
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
				description_html: '<p>+3 to Armor Score</p>',
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
		id: 'advanced_tower_shield',
		source_id: 'SRD',
		title: 'Advanced Tower Shield',
		description_html: '',
		level_requirement: 5,
		category: 'Secondary',
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
				description_html: '<p>+4 to Armor Score; −1 to Evasion</p>',
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
		id: 'advanced_small_dagger',
		source_id: 'SRD',
		title: 'Advanced Small Dagger',
		description_html: '',
		level_requirement: 5,
		category: 'Secondary',
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
						value: 4
					}
				],
				title: 'Paired',
				description_html: '<p>+4 to primary weapon damage to targets within Melee range</p>',
				character_modifiers: []
			}
		]
	},
	advanced_whip: {
		id: 'advanced_whip',
		source_id: 'SRD',
		title: 'Advanced Whip',
		description_html: '',
		level_requirement: 5,
		category: 'Secondary',
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
					'<p>Mark a Stress to crack the whip and force all adversaries within Melee range back to Close range.</p>',
				character_modifiers: []
			}
		]
	},
	advanced_grappler: {
		id: 'advanced_grappler',
		source_id: 'SRD',
		title: 'Advanced Grappler',
		description_html: '',
		level_requirement: 5,
		category: 'Secondary',
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
				description_html:
					'<p>On a successful attack, you can pull the target into Melee range.</p>',
				character_modifiers: []
			}
		]
	},
	advanced_hand_crossbow: {
		id: 'advanced_hand_ crossbow',
		source_id: 'SRD',
		title: 'Advanced Hand Crossbow',
		description_html: '',
		level_requirement: 5,
		category: 'Secondary',
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
		id: 'buckler',
		source_id: 'SRD',
		title: 'Buckler',
		description_html: '',
		level_requirement: 5,
		category: 'Secondary',
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
					'<p>When you are attacked, you can mark an Armor Slot to gain a bonus to your Evasion equal to your available Armor Score against the attack.</p>',
				character_modifiers: []
			}
		]
	},
	powered_gauntlet: {
		id: 'powered_gauntlet',
		source_id: 'SRD',
		title: 'Powered Gauntlet',
		description_html: '',
		level_requirement: 5,
		category: 'Secondary',
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
					'<p>Mark a Stress to gain a +1 bonus to your Proficiency on a primary weapon attack.</p>',
				character_modifiers: []
			}
		]
	},
	hand_sling: {
		id: 'hand_sling',
		source_id: 'SRD',
		title: 'Hand Sling',
		description_html: '',
		level_requirement: 5,
		category: 'Secondary',
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
					'<p>This weapon can also be used with these statistics—Finesse, Close, 1d8+4.</p>',
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, Weapon>;

export const TIER_4_SECONDARY_WEAPONS = {
	legendary_shortsword: {
		id: 'legendary_shortsword',
		source_id: 'SRD',
		title: 'Legendary Shortsword',
		description_html: '',
		level_requirement: 8,
		category: 'Secondary',
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
						value: 5
					}
				],
				title: 'Paired',
				description_html: '<p>+5 to primary weapon damage to targets within Melee range</p>',
				character_modifiers: []
			}
		]
	},
	legendary_round_shield: {
		id: 'legendary_round_shield',
		source_id: 'SRD',
		title: 'Legendary Round Shield',
		description_html: '',
		level_requirement: 8,
		category: 'Secondary',
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
				description_html: '<p>+4 to Armor Score</p>',
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
		id: 'legendary_tower_shield',
		source_id: 'SRD',
		title: 'Legendary Tower Shield',
		description_html: '',
		level_requirement: 8,
		category: 'Secondary',
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
				description_html: '<p>+5 to Armor Score; −1 to Evasion</p>',
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
		id: 'legendary_small_dagger',
		source_id: 'SRD',
		title: 'Legendary Small Dagger',
		description_html: '',
		level_requirement: 8,
		category: 'Secondary',
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
						value: 5
					}
				],
				title: 'Paired',
				description_html: '<p>+5 to primary weapon damage to targets within Melee range</p>',
				character_modifiers: []
			}
		]
	},
	legendary_whip: {
		id: 'legendary_whip',
		source_id: 'SRD',
		title: 'Legendary Whip',
		description_html: '',
		level_requirement: 8,
		category: 'Secondary',
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
					'<p>Mark a Stress to crack the whip and force all adversaries within Melee range back to Close range.</p>',
				character_modifiers: []
			}
		]
	},
	legendary_grappler: {
		id: 'legendary_grappler',
		source_id: 'SRD',
		title: 'Legendary Grappler',
		description_html: '',
		level_requirement: 8,
		category: 'Secondary',
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
				description_html:
					'<p>On a successful attack, you can pull the target into Melee range.</p>',
				character_modifiers: []
			}
		]
	},
	legendary_hand_crossbow: {
		id: 'legendary_hand_crossbow',
		source_id: 'SRD',
		title: 'Legendary Hand Crossbow',
		description_html: '',
		level_requirement: 8,
		category: 'Secondary',
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
		id: 'braveshield',
		source_id: 'SRD',
		title: 'Braveshield',
		description_html: '',
		level_requirement: 8,
		category: 'Secondary',
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
					'<p>When you mark an Armor Slot, it reduces damage for you and all allies within Melee range of you who took the same damage.</p>',
				character_modifiers: []
			}
		]
	},
	knuckle_claws: {
		id: 'knuckle_claws',
		source_id: 'SRD',
		title: 'Knuckle Claws',
		description_html: '',
		level_requirement: 8,
		category: 'Secondary',
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
					'<p>When you make an attack with your primary weapon, you can deal damage to another target within Melee range.</p>',
				character_modifiers: []
			}
		]
	},
	primer_shard: {
		id: 'primer_shard',
		source_id: 'SRD',
		title: 'Primer Shard',
		description_html: '',
		level_requirement: 8,
		category: 'Secondary',
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
					'<p>On a successful attack, your next attack against the same target with your primary weapon automatically succeeds.</p>',
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, Weapon>;
