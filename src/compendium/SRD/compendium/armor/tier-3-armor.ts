import type { Armor } from '../../../../convex/schemas/compendium';

export const TIER_3_ARMOR = {
	advanced_gambeson_armor: {
		source_key: 'SRD',
		title: 'Advanced Gambeson Armor',
		description_html: '',
		level_requirement: 5,
		max_armor: 5,
		damage_thresholds: {
			major: 9,
			severe: 23
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
	advanced_leather_armor: {
		source_key: 'SRD',
		title: 'Advanced Leather Armor',
		description_html: '',
		level_requirement: 5,
		max_armor: 5,
		damage_thresholds: {
			major: 11,
			severe: 27
		},
		features: []
	},
	advanced_chainmail_armor: {
		source_key: 'SRD',
		title: 'Advanced Chainmail Armor',
		description_html: '',
		level_requirement: 5,
		max_armor: 6,
		damage_thresholds: {
			major: 13,
			severe: 31
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
	advanced_full_plate_armor: {
		source_key: 'SRD',
		title: 'Advanced Full Plate Armor',
		description_html: '',
		level_requirement: 5,
		max_armor: 6,
		damage_thresholds: {
			major: 15,
			severe: 35
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
	bellamoi_fine_armor: {
		source_key: 'SRD',
		title: 'Bellamoi Fine Armor',
		description_html: '',
		level_requirement: 5,
		max_armor: 5,
		damage_thresholds: {
			major: 11,
			severe: 27
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Gilded',
				description_html: '+1 to Presence',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: 1,
						target: 'trait',
						trait: 'presence'
					}
				]
			}
		]
	},
	dragonscale_armor: {
		source_key: 'SRD',
		title: 'Dragonscale Armor',
		description_html: '',
		level_requirement: 5,
		max_armor: 5,
		damage_thresholds: {
			major: 11,
			severe: 27
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Impenetrable',
				description_html:
					'Once per short rest, when you would mark your last Hit Point, you can instead mark a Stress.',
				character_modifiers: []
			}
		]
	},
	spiked_plate_armor: {
		source_key: 'SRD',
		title: 'Spiked Plate Armor',
		description_html: '',
		level_requirement: 5,
		max_armor: 5,
		damage_thresholds: {
			major: 10,
			severe: 25
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Sharp',
				description_html:
					'On a successful attack against a target within Melee range, add a d4 to the damage roll.',
				character_modifiers: []
			}
		]
	},
	bladefare_armor: {
		source_key: 'SRD',
		title: 'Bladefare Armor',
		description_html: '',
		level_requirement: 5,
		max_armor: 6,
		damage_thresholds: {
			major: 16,
			severe: 39
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Physical',
				description_html: "You can't mark an Armor Slot to reduce magic damage.",
				character_modifiers: []
			}
		]
	},
	monetts_cloak: {
		source_key: 'SRD',
		title: 'Monett’s Cloak',
		description_html: '',
		level_requirement: 5,
		max_armor: 6,
		damage_thresholds: {
			major: 16,
			severe: 39
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Magic',
				description_html: "You can't mark an Armor Slot to reduce physical damage.",
				character_modifiers: []
			}
		]
	},
	runes_of_fortification: {
		source_key: 'SRD',
		title: 'Runes of Fortification',
		description_html: '',
		level_requirement: 5,
		max_armor: 6,
		damage_thresholds: {
			major: 17,
			severe: 43
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Painful',
				description_html: 'Each time you mark an Armor Slot, you must mark a Stress.',
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, Armor>;
