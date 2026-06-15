import type { Armor } from '../../../../convex/schemas/compendium';

export const TIER_4_ARMOR = {
	legendary_gambeson_armor: {
		source_key: 'SRD',
		title: 'Legendary Gambeson Armor',
		description_html: '',
		level_requirement: 8,
		max_armor: 6,
		damage_thresholds: {
			major: 11,
			severe: 32
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
	legendary_leather_armor: {
		source_key: 'SRD',
		title: 'Legendary Leather Armor',
		description_html: '',
		level_requirement: 8,
		max_armor: 6,
		damage_thresholds: {
			major: 13,
			severe: 36
		},
		features: []
	},
	legendary_chainmail_armor: {
		source_key: 'SRD',
		title: 'Legendary Chainmail Armor',
		description_html: '',
		level_requirement: 8,
		max_armor: 7,
		damage_thresholds: {
			major: 15,
			severe: 40
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
	legendary_full_plate_armor: {
		source_key: 'SRD',
		title: 'Legendary Full Plate Armor',
		description_html: '',
		level_requirement: 8,
		max_armor: 7,
		damage_thresholds: {
			major: 17,
			severe: 44
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
	dunamis_silkchain: {
		source_key: 'SRD',
		title: 'Dunamis Silkchain',
		description_html: '',
		level_requirement: 8,
		max_armor: 7,
		damage_thresholds: {
			major: 13,
			severe: 36
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Timeslowing',
				description_html:
					'Mark an Armor Slot to roll a d4 and add its result as a bonus to your Evasion against an incoming attack.',
				character_modifiers: []
			}
		]
	},
	channeling_armor: {
		source_key: 'SRD',
		title: 'Channeling Armor',
		description_html: '',
		level_requirement: 8,
		max_armor: 5,
		damage_thresholds: {
			major: 13,
			severe: 36
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Channeling',
				description_html: '+1 to Spellcast Rolls',
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: 1,
						target: 'spellcast_roll_bonus'
					}
				]
			}
		]
	},
	emberwoven_armor: {
		source_key: 'SRD',
		title: 'Emberwoven Armor',
		description_html: '',
		level_requirement: 8,
		max_armor: 6,
		damage_thresholds: {
			major: 13,
			severe: 36
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Burning',
				description_html: 'When an adversary attacks you within Melee range, they mark a Stress.',
				character_modifiers: []
			}
		]
	},
	full_fortified_armor: {
		source_key: 'SRD',
		title: 'Full Fortified Armor',
		description_html: '',
		level_requirement: 8,
		max_armor: 4,
		damage_thresholds: {
			major: 15,
			severe: 40
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Fortified',
				description_html:
					'When you mark an Armor Slot, you reduce the severity of an attack by two thresholds instead of one.',
				character_modifiers: []
			}
		]
	},
	veritas_opal_armor: {
		source_key: 'SRD',
		title: 'Veritas Opal Armor',
		description_html: '',
		level_requirement: 8,
		max_armor: 6,
		damage_thresholds: {
			major: 13,
			severe: 36
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Truthseeking',
				description_html: 'This armor glows when another creature within Close range tells a lie.',
				character_modifiers: []
			}
		]
	},
	savior_chainmail: {
		source_key: 'SRD',
		title: 'Savior Chainmail',
		description_html: '',
		level_requirement: 8,
		max_armor: 8,
		damage_thresholds: {
			major: 18,
			severe: 48
		},
		features: [
			{
				weapon_modifiers: [],
				title: 'Difficult',
				description_html: '−1 to all character traits and Evasion',
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
						value: -1,
						target: 'trait',
						trait: 'strength'
					},
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: -1,
						target: 'trait',
						trait: 'agility'
					},
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: -1,
						target: 'trait',
						trait: 'finesse'
					},
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: -1,
						target: 'trait',
						trait: 'presence'
					},
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: -1,
						target: 'trait',
						trait: 'knowledge'
					},
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'flat',
						value: -1,
						target: 'trait',
						trait: 'instinct'
					}
				]
			}
		]
	}
} as const satisfies Record<string, Armor>;
