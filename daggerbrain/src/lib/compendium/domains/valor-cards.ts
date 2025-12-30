import type { DomainCard } from '$lib/types/compendium-types';

export const VALOR_DOMAIN_CARDS = {
	bare_bones: {
		compendium_id: 'bare_bones',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Bare Bones',
		level_requirement: 1,
		recall_cost: 0,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `When you choose not to equip armor, you have a base Armor Score of 3 + your Strength and use the following as your base damage thresholds:

- ***Tier 1:*** 9/19
- ***Tier 2:*** 11/24
- ***Tier 3:*** 13/31
- ***Tier 4:*** 15/38`,
				character_modifiers: [
					{
						behaviour: 'base',
						target: 'max_armor',
						type: 'derived_from_trait',
						trait: 'strength',
						multiplier: 1,
						character_conditions: [
							{
								type: 'level',
								min_level: 1,
								max_level: 1
							},
							{
								type: 'armor_equipped',
								value: false
							},
							{
								type: 'level',
								min_level: 1,
								max_level: 10
							}
						]
					},
					{
						behaviour: 'bonus',
						target: 'max_armor',
						type: 'flat',
						value: 3,
						character_conditions: [
							{
								type: 'level',
								min_level: 1,
								max_level: 1
							},
							{
								type: 'armor_equipped',
								value: false
							},
							{
								type: 'level',
								min_level: 1,
								max_level: 10
							}
						]
					},
					{
						behaviour: 'base',
						target: 'major_damage_threshold',
						type: 'flat',
						value: 9,
						character_conditions: [
							{
								type: 'level',
								min_level: 1,
								max_level: 1
							},
							{
								type: 'armor_equipped',
								value: false
							},
							{
								type: 'level',
								min_level: 1,
								max_level: 10
							}
						]
					},
					{
						behaviour: 'base',
						target: 'severe_damage_threshold',
						type: 'flat',
						value: 19,
						character_conditions: [
							{
								type: 'level',
								min_level: 1,
								max_level: 1
							},
							{
								type: 'armor_equipped',
								value: false
							},
							{
								type: 'level',
								min_level: 1,
								max_level: 10
							}
						]
					},
					{
						behaviour: 'base',
						target: 'max_armor',
						type: 'derived_from_trait',
						trait: 'strength',
						multiplier: 1,
						character_conditions: [
							{
								type: 'level',
								min_level: 2,
								max_level: 4
							},
							{
								type: 'armor_equipped',
								value: false
							},
							{
								type: 'level',
								min_level: 1,
								max_level: 10
							}
						]
					},
					{
						behaviour: 'bonus',
						target: 'max_armor',
						type: 'flat',
						value: 3,
						character_conditions: [
							{
								type: 'level',
								min_level: 2,
								max_level: 4
							},
							{
								type: 'armor_equipped',
								value: false
							},
							{
								type: 'level',
								min_level: 1,
								max_level: 10
							}
						]
					},
					{
						behaviour: 'base',
						target: 'major_damage_threshold',
						type: 'flat',
						value: 11,
						character_conditions: [
							{
								type: 'level',
								min_level: 2,
								max_level: 4
							},
							{
								type: 'armor_equipped',
								value: false
							},
							{
								type: 'level',
								min_level: 1,
								max_level: 10
							}
						]
					},
					{
						behaviour: 'base',
						target: 'severe_damage_threshold',
						type: 'flat',
						value: 24,
						character_conditions: [
							{
								type: 'level',
								min_level: 2,
								max_level: 4
							},
							{
								type: 'armor_equipped',
								value: false
							},
							{
								type: 'level',
								min_level: 1,
								max_level: 10
							}
						]
					},
					{
						behaviour: 'base',
						target: 'max_armor',
						type: 'derived_from_trait',
						trait: 'strength',
						multiplier: 1,
						character_conditions: [
							{
								type: 'level',
								min_level: 5,
								max_level: 7
							},
							{
								type: 'armor_equipped',
								value: false
							},
							{
								type: 'level',
								min_level: 1,
								max_level: 10
							}
						]
					},
					{
						behaviour: 'bonus',
						target: 'max_armor',
						type: 'flat',
						value: 3,
						character_conditions: [
							{
								type: 'level',
								min_level: 5,
								max_level: 7
							},
							{
								type: 'armor_equipped',
								value: false
							},
							{
								type: 'level',
								min_level: 1,
								max_level: 10
							}
						]
					},
					{
						behaviour: 'base',
						target: 'major_damage_threshold',
						type: 'flat',
						value: 13,
						character_conditions: [
							{
								type: 'level',
								min_level: 5,
								max_level: 7
							},
							{
								type: 'armor_equipped',
								value: false
							},
							{
								type: 'level',
								min_level: 1,
								max_level: 10
							}
						]
					},
					{
						behaviour: 'base',
						target: 'severe_damage_threshold',
						type: 'flat',
						value: 31,
						character_conditions: [
							{
								type: 'level',
								min_level: 5,
								max_level: 7
							},
							{
								type: 'armor_equipped',
								value: false
							},
							{
								type: 'level',
								min_level: 1,
								max_level: 10
							}
						]
					},
					{
						behaviour: 'base',
						target: 'max_armor',
						type: 'derived_from_trait',
						trait: 'strength',
						multiplier: 1,
						character_conditions: [
							{
								type: 'level',
								min_level: 8,
								max_level: 10
							},
							{
								type: 'armor_equipped',
								value: false
							},
							{
								type: 'level',
								min_level: 1,
								max_level: 10
							}
						]
					},
					{
						behaviour: 'bonus',
						target: 'max_armor',
						type: 'flat',
						value: 3,
						character_conditions: [
							{
								type: 'level',
								min_level: 8,
								max_level: 10
							},
							{
								type: 'armor_equipped',
								value: false
							},
							{
								type: 'level',
								min_level: 1,
								max_level: 10
							}
						]
					},
					{
						behaviour: 'base',
						target: 'major_damage_threshold',
						type: 'flat',
						value: 15,
						character_conditions: [
							{
								type: 'level',
								min_level: 8,
								max_level: 10
							},
							{
								type: 'armor_equipped',
								value: false
							},
							{
								type: 'level',
								min_level: 1,
								max_level: 10
							}
						]
					},
					{
						behaviour: 'base',
						target: 'severe_damage_threshold',
						type: 'flat',
						value: 38,
						character_conditions: [
							{
								type: 'level',
								min_level: 8,
								max_level: 10
							},
							{
								type: 'armor_equipped',
								value: false
							},
							{
								type: 'level',
								min_level: 1,
								max_level: 10
							}
						]
					}
				]
			}
		]
	},
	forceful_push: {
		compendium_id: 'forceful_push',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Forceful Push',
		level_requirement: 1,
		recall_cost: 0,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Make an attack with your primary weapon against a target within Melee range. On a success, you deal damage and knock them back to Close range.

On a success with Hope, add a **d6** to your damage roll. Additionally, you can **spend a Hope** to make them temporarily *Vulnerable*.`,
				character_modifiers: []
			}
		]
	},

	i_am_your_shield: {
		compendium_id: 'i_am_your_shield',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'I Am Your Shield',
		level_requirement: 1,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `When an ally within Very Close range would take damage, you can **mark a Stress** to stand in the way and make yourself the target of the attack instead.

When you take damage from this attack, you can mark any number of Armor Slots.`,
				character_modifiers: []
			}
		]
	},

	body_basher: {
		compendium_id: 'body_basher',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Body Basher',
		level_requirement: 2,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `You use the full force of your body in a fight. On a successful attack using a weapon with a Melee range, gain a bonus to your damage roll equal to your **Strength**.`,
				character_modifiers: []
			}
		]
	},

	bold_presence: {
		compendium_id: 'bold_presence',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Bold Presence',
		level_requirement: 2,
		recall_cost: 0,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `When you make a **Presence Roll**, you can **spend a Hope** to add your **Strength** to the roll.

Additionally, once per rest when you would gain a condition, you can describe how your bold presence aids you in the situation and avoid gaining the condition.`,
				character_modifiers: []
			}
		]
	},
	critical_inspiration: {
		compendium_id: 'critical_inspiration',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Critical Inspiration',
		level_requirement: 3,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Once per rest, when you **critically succeed** on an attack, all allies within Very Close range can **clear a Stress** or **gain a Hope**.`,
				character_modifiers: []
			}
		]
	},

	lean_on_me: {
		compendium_id: 'lean_on_me',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Lean On Me',
		level_requirement: 3,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Once per long rest, when you console or inspire an ally who failed an action roll, you can both **clear 2 Stress**.`,
				character_modifiers: []
			}
		]
	},

	goad_them_on: {
		compendium_id: 'goad_them_on',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Goad Them On',
		level_requirement: 4,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Describe how you taunt a target within Close range, then make a **Presence Roll** against them. On a success:

- The target must **mark a Stress**.
- The next time the GM spotlights them, they must target you with an attack, which they make with **disadvantage**.`,
				character_modifiers: []
			}
		]
	},

	support_tank: {
		compendium_id: 'support_tank',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Support Tank',
		level_requirement: 4,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `When an ally within Close range fails a roll, you can **spend 2 Hope** to allow them to reroll either their Hope or Fear Die.`,
				character_modifiers: []
			}
		]
	},

	armorer: {
		compendium_id: 'armorer',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Armorer',
		level_requirement: 5,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `While you're wearing armor, gain a +1 bonus to your Armor Score.

During a rest, when you choose to repair your armor as a downtime move, your allies also **clear an Armor Slot**.`,
				character_modifiers: [
					{
						behaviour: 'bonus',
						type: 'flat',
						value: 1,
						target: 'max_armor',
						character_conditions: [
							{
								type: 'armor_equipped',
								value: true
							}
						]
					}
				]
			}
		]
	},

	rousing_strike: {
		compendium_id: 'rousing_strike',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Rousing Strike',
		level_requirement: 5,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Once per rest, when you **critically succeed** on an attack, you and all allies who can see or hear you can **clear a Hit Point** or **1d4 Stress**.`,
				character_modifiers: []
			}
		]
	},
	inevitable: {
		compendium_id: 'inevitable',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Inevitable',
		level_requirement: 6,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `When you **fail an action roll**, your next action roll has **advantage**.`,
				character_modifiers: []
			}
		]
	},

	rise_up: {
		compendium_id: 'rise_up',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Rise Up',
		level_requirement: 6,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Gain a bonus to your Severe threshold equal to your Proficiency.

When you mark 1 or more Hit Points from an attack, clear a Stress.`,
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [],
						type: 'derived_from_proficiency',
						multiplier: 1,
						target: 'severe_damage_threshold'
					}
				]
			}
		]
	},
	shrug_it_off: {
		compendium_id: 'shrug_it_off',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Shrug It Off',
		level_requirement: 7,
		recall_cost: 1,
		applies_in_vault: true,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `When you would take damage, you can **mark a Stress** to reduce the severity of the damage by one threshold.
When you do, roll a **d6**. On a result of 3 or lower, place this card in your vault.`,
				character_modifiers: []
			}
		]
	},

	valor_touched: {
		compendium_id: 'valor_touched',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Valor-Touched',
		level_requirement: 7,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `When 4 or more of the domain cards in your loadout are from the Valor domain, gain the following benefits:

- +1 bonus to your Armor Score
- When you mark 1 or more Hit Points without marking an Armor Slot, clear an Armor Slot.`,
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [
							{
								type: 'min_loadout_cards_from_domain',
								domain_id: 'valor',
								min_cards: 4
							}
						],
						type: 'flat',
						value: 1,
						target: 'max_armor'
					}
				]
			}
		]
	},
	full_surge: {
		compendium_id: 'full_surge',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Full Surge',
		level_requirement: 8,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Once per long rest, **mark 3 Stress** to push your body to its limits. Gain a **+2 bonus** to all of your character traits until your next rest.`,
				character_modifiers: []
			}
		]
	},

	ground_pound: {
		compendium_id: 'ground_pound',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Ground Pound',
		level_requirement: 8,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `**Spend 2 Hope** to strike the ground where you stand and make a **Strength Roll** against all targets within Very Close range.

Targets you succeed against are thrown back to Far range and must make a **Reaction Roll (17)**.

- Targets who fail take **4d10+8** damage.
- Targets who succeed take half damage.`,
				character_modifiers: []
			}
		]
	},

	hold_the_line: {
		compendium_id: 'hold_the_line',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Hold the Line',
		level_requirement: 9,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Describe the defensive stance you take and **spend a Hope**. If an adversary moves within Very Close range, they're pulled into Melee range and *Restrained*.

This condition lasts until you move or fail a roll with Fear, or the GM spends 2 Fear on their turn to clear it.`,
				character_modifiers: []
			}
		]
	},

	lead_by_example: {
		compendium_id: 'lead_by_example',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Lead by Example',
		level_requirement: 9,
		recall_cost: 3,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `When you deal damage to an adversary, you can **mark a Stress** and describe how you encourage your allies.

The next PC to make an attack against that adversary can **clear a Stress** or **gain a Hope**.`,
				character_modifiers: []
			}
		]
	},

	unbreakable: {
		compendium_id: 'unbreakable',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Unbreakable',
		level_requirement: 10,
		recall_cost: 4,
		applies_in_vault: true,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `When you **mark your last Hit Point**, instead of making a death move, you can roll a **d6** and **clear a number of Hit Points equal to the result**. Then place this card in your vault.`,
				character_modifiers: []
			}
		]
	},

	unyielding_armor: {
		compendium_id: 'unyielding_armor',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'valor',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Unyielding Armor',
		level_requirement: 10,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `When you would mark an Armor Slot, roll a number of **d6s** equal to your Proficiency. If any roll a 6, reduce the severity by one threshold without marking an Armor Slot.`,
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, DomainCard>;
