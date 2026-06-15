import type { Armor } from '../../../../convex/schemas/compendium';

export const TIER_2_ARMOR = {
	improved_gambeson_armor: {
		source_key: 'SRD',
		title: 'Improved Gambeson Armor',
		description_html: '',
		level_requirement: 2,
		max_armor: 4,
		damage_thresholds: {
			major: 7,
			severe: 16
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Flexible',
				description_html: '+1 to Evasion',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: 1,
						target: 'evasion'
					}
				]
			}
		]
	},
	improved_leather_armor: {
		source_key: 'SRD',
		title: 'Improved Leather Armor',
		description_html: '',
		level_requirement: 2,
		max_armor: 4,
		damage_thresholds: {
			major: 9,
			severe: 20
		},
		features: []
	},
	improved_chainmail_armor: {
		source_key: 'SRD',
		title: 'Improved Chainmail Armor',
		description_html: '',
		level_requirement: 2,
		max_armor: 5,
		damage_thresholds: {
			major: 11,
			severe: 24
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Heavy',
				description_html: '−1 to Evasion',
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
	improved_full_plate_armor: {
		source_key: 'SRD',
		title: 'Improved Full Plate Armor',
		description_html: '',
		level_requirement: 2,
		max_armor: 5,
		damage_thresholds: {
			major: 13,
			severe: 28
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Very Heavy',
				description_html: '−2 to Evasion; −1 to Agility',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: -2,
						target: 'evasion'
					},
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: -1,
						target: 'trait',
						trait: 'agility'
					}
				]
			}
		]
	},
	elundrian_chain_armor: {
		source_key: 'SRD',
		title: 'Elundrian Chain Armor',
		description_html: '',
		level_requirement: 2,
		max_armor: 4,
		damage_thresholds: {
			major: 9,
			severe: 21
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Warded',
				description_html:
					'You reduce incoming magic damage by your Armor Score before applying it to your damage thresholds.',
				character_modifiers: []
			}
		]
	},
	harrowbone_armor: {
		source_key: 'SRD',
		title: 'Harrowbone Armor',
		description_html: '',
		level_requirement: 2,
		max_armor: 4,
		damage_thresholds: {
			major: 9,
			severe: 21
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Resilient',
				description_html:
					'Before you mark your last Armor Slot, roll a d6. On a result of 6, reduce the severity by one threshold without marking an Armor Slot.',
				character_modifiers: []
			}
		]
	},
	irontree_breastplate_armor: {
		source_key: 'SRD',
		title: 'Irontree Breastplate Armor',
		description_html: '',
		level_requirement: 2,
		max_armor: 4,
		damage_thresholds: {
			major: 9,
			severe: 20
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Reinforced',
				description_html:
					'When you mark your last Armor Slot, increase your damage thresholds by +2 until you clear at least 1 Armor Slot.',
				character_modifiers: []
			}
		]
	},
	runetan_floating_armor: {
		source_key: 'SRD',
		title: 'Runetan Floating Armor',
		description_html: '',
		level_requirement: 2,
		max_armor: 4,
		damage_thresholds: {
			major: 9,
			severe: 20
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Shifting',
				description_html:
					'When you are targeted for an attack, you can mark an Armor Slot to give the attack roll against you disadvantage.',
				character_modifiers: []
			}
		]
	},
	tyris_soft_armor: {
		source_key: 'SRD',
		title: 'Tyris Soft Armor',
		description_html: '',
		level_requirement: 2,
		max_armor: 5,
		damage_thresholds: {
			major: 8,
			severe: 18
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Quiet',
				description_html: 'You gain a +2 bonus to rolls you make to move silently.',
				character_modifiers: []
			}
		]
	},
	rosewild_armor: {
		source_key: 'SRD',
		title: 'Rosewild Armor',
		description_html: '',
		level_requirement: 2,
		max_armor: 5,
		damage_thresholds: {
			major: 11,
			severe: 23
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Hopeful',
				description_html: 'When you would spend a Hope, you can mark an Armor Slot instead.',
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, Armor>;
