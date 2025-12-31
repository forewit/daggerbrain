import type { Armor } from '$lib/types/compendium-types';

export const TIER_1_ARMOR = {
	gambeson_armor: {
		compendium_id: 'gambeson_armor',
		source_id: 'SRD',
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
		compendium_id: 'leather_armor',
		source_id: 'SRD',
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
		compendium_id: 'chainmail_armor',
		source_id: 'SRD',
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
		compendium_id: 'full_plate_armor',
		source_id: 'SRD',
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

export const TIER_2_ARMOR = {
	improved_gambeson_armor: {
		compendium_id: 'improved_gambeson_armor',
		source_id: 'SRD',
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
		compendium_id: 'improved_leather_armor',
		source_id: 'SRD',
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
		compendium_id: 'improved_chainmail_armor',
		source_id: 'SRD',
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
		compendium_id: 'improved_full_plate_armor',
		source_id: 'SRD',
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
		compendium_id: 'elundrian_chain_armor',
		source_id: 'SRD',
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
		compendium_id: 'harrowbone_armor',
		source_id: 'SRD',
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
		compendium_id: 'irontree_breastplate_armor',
		source_id: 'SRD',
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
		compendium_id: 'runetan_floating_armor',
		source_id: 'SRD',
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
		compendium_id: 'tyris_soft_armor',
		source_id: 'SRD',
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
		compendium_id: 'rosewild_armor',
		source_id: 'SRD',
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

export const TIER_3_ARMOR = {
	advanced_gambeson_armor: {
		compendium_id: 'advanced_gambeson_armor',
		source_id: 'SRD',
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
		compendium_id: 'advanced_leather_armor',
		source_id: 'SRD',
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
		compendium_id: 'advanced_chainmail_armor',
		source_id: 'SRD',
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
		compendium_id: 'advanced_full_plate_armor',
		source_id: 'SRD',
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
		compendium_id: 'bellamoi_fine_armor',
		source_id: 'SRD',
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
		compendium_id: 'dragonscale_armor',
		source_id: 'SRD',
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
		compendium_id: 'spiked_plate_armor',
		source_id: 'SRD',
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
		compendium_id: 'bladefare_armor',
		source_id: 'SRD',
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
		compendium_id: 'monetts_cloak',
		source_id: 'SRD',
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
		compendium_id: 'runes_of_fortification',
		source_id: 'SRD',
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

export const TIER_4_ARMOR = {
	legendary_gambeson_armor: {
		compendium_id: 'legendary_gambeson_armor',
		source_id: 'SRD',
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
		compendium_id: 'legendary_leather_armor',
		source_id: 'SRD',
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
		compendium_id: 'legendary_chainmail_armor',
		source_id: 'SRD',
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
		compendium_id: 'legendary_full_plate_armor',
		source_id: 'SRD',
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
		compendium_id: 'dunamis_silkchain',
		source_id: 'SRD',
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
		compendium_id: 'channeling_armor',
		source_id: 'SRD',
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
		compendium_id: 'emberwoven_armor',
		source_id: 'SRD',
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
		compendium_id: 'full_fortified_armor',
		source_id: 'SRD',
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
		compendium_id: 'veritas_opal_armor',
		source_id: 'SRD',
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
		compendium_id: 'savior_chainmail',
		source_id: 'SRD',
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
