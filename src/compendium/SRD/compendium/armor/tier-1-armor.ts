import type { Armor } from '../../../../convex/schemas/compendium';

export const TIER_1_ARMOR = {
	gambeson_armor: {
		source_key: 'SRD',
		title: 'Gambeson Armor',
		description_html: '',
		level_requirement: 1,
		max_armor: 3,
		damage_thresholds: {
			major: 5,
			severe: 11
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
	leather_armor: {
		source_key: 'SRD',
		title: 'Leather Armor',
		description_html: '',
		level_requirement: 1,
		max_armor: 3,
		damage_thresholds: {
			major: 6,
			severe: 13
		},
		features: []
	},
	chainmail_armor: {
		source_key: 'SRD',
		title: 'Chainmail Armor',
		description_html: '',
		level_requirement: 1,
		max_armor: 4,
		damage_thresholds: {
			major: 7,
			severe: 15
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
	full_plate_armor: {
		source_key: 'SRD',
		title: 'Full Plate Armor',
		description_html: '',
		level_requirement: 1,
		max_armor: 4,
		damage_thresholds: {
			major: 8,
			severe: 17
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
	}
} as const satisfies Record<string, Armor>;
