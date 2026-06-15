import type { Beastform } from '../../../../convex/schemas/compendium';

export const TIER_4_BEASTFORMS = {
	massive_behemoth: {
		source_key: 'SRD',
		level_requirement: 8,
		title: 'Massive Behemoth',
		category: 'Elephant, Mammoth, Rhinoceros, etc.',
		character_trait: {
			trait: 'strength',
			bonus: 3
		},
		evasion_bonus: 1,
		attack: {
			range: 'Melee',
			trait: 'strength',
			damage_dice: 'd12',
			damage_bonus: 12,
			damage_type: 'phy'
		},
		advantages: ['locate', 'protect', 'scare', 'sprint'],
		features: [
			{
				title: 'Carrier',
				description_html: 'You can carry up to four willing allies with you when you move.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Demolish',
				description_html:
					'**Spend a Hope** to move up to Far range in a straight line and make an attack against all targets within Melee range of the line. Targets you succeed against take **d8+10** physical damage using your Proficiency and are temporarily *Vulnerable*.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Undaunted',
				description_html: 'You gain a +2 bonus to all your damage thresholds.',
				character_modifiers: [
					{
						behaviour: 'bonus',
						target: 'major_damage_threshold',
						type: 'flat',
						value: 2,
						character_conditions: []
					},
					{
						behaviour: 'bonus',
						target: 'severe_damage_threshold',
						type: 'flat',
						value: 2,
						character_conditions: []
					}
				],
				weapon_modifiers: []
			}
		]
	},
	terrible_lizard: {
		source_key: 'SRD',
		level_requirement: 8,
		title: 'Terrible Lizard',
		category: 'Brachiosaurus, Tyrannosaurus, etc.',
		character_trait: {
			trait: 'strength',
			bonus: 3
		},
		evasion_bonus: 2,
		attack: {
			range: 'Melee',
			trait: 'strength',
			damage_dice: 'd12',
			damage_bonus: 10,
			damage_type: 'phy'
		},
		advantages: ['attack', 'deceive', 'scare', 'track'],
		features: [
			{
				title: 'Devastating Strikes',
				description_html:
					'When you deal Severe damage to a target within Melee range, you can **mark a Stress** to force them to mark an additional Hit Point.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Massive Stride',
				description_html:
					"You can move up to Far range without rolling. You ignore rough terrain (at the GM's discretion) due to your size.",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	mythic_aerial_hunter: {
		source_key: 'SRD',
		level_requirement: 8,
		title: 'Mythic Aerial Hunter',
		category: 'Dragon, Pterodactyl, Roc, Wyvern, etc.',
		character_trait: {
			trait: 'finesse',
			bonus: 3
		},
		evasion_bonus: 4,
		attack: {
			range: 'Melee',
			trait: 'finesse',
			damage_dice: 'd10',
			damage_bonus: 11,
			damage_type: 'phy'
		},
		advantages: ['attack', 'deceive', 'locate', 'navigate'],
		features: [
			{
				title: 'Carrier',
				description_html: 'You can carry up to three willing allies with you when you move.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Deadly Raptor',
				description_html:
					'You can fly at will and move up to Far range as part of your action. When you move in a straight line into Melee range of a target from at least Close range and make an attack against that target in the same action, you can reroll all damage dice that rolled a result lower than your Proficiency.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	epic_aquatic_beast: {
		source_key: 'SRD',
		level_requirement: 8,
		title: 'Epic Aquatic Beast',
		category: 'Giant Squid, Whale, etc.',
		character_trait: {
			trait: 'agility',
			bonus: 3
		},
		evasion_bonus: 3,
		attack: {
			range: 'Melee',
			trait: 'agility',
			damage_dice: 'd10',
			damage_bonus: 10,
			damage_type: 'phy'
		},
		advantages: ['locate', 'protect', 'scare', 'track'],
		features: [
			{
				title: 'Ocean Master',
				description_html:
					'You can breathe and move naturally underwater. When you succeed on an attack against a target within Melee range, you can temporarily *Restrain* them.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Unyielding',
				description_html:
					'When you would mark an Armor Slot, roll a **d6**. On a result of 5 or higher, reduce the severity by one threshold without marking an Armor Slot.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	mythic_beast: {
		source_key: 'SRD',
		level_requirement: 8,
		title: 'Mythic Beast',
		category: 'Upgraded Tier 1 or Tier 2 Options',
		character_trait: {
			trait: 'agility',
			bonus: 0
		},
		evasion_bonus: 0,
		attack: {
			range: 'Melee',
			trait: 'agility',
			damage_dice: 'd4',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		advantages: [],
		features: [
			{
				title: 'Evolved',
				description_html:
					"Pick a Tier 1 or Tier 2 Beastform option and become a larger, more powerful version of that creature. While you're in this form, you retain all traits and features from the original form and gain the following bonuses:\n- A +9 bonus to damage rolls\n- A +2 bonus to the trait used by this form\n- A +3 bonus to Evasion\n- Your damage die increases by one size (d6 becomes d8, d8 becomes d10, etc.)",
				character_modifiers: [],
				weapon_modifiers: []
			}
		],
		special_case: 'mythic_beast'
	},
	mythic_hybrid: {
		source_key: 'SRD',
		level_requirement: 8,
		title: 'Mythic Hybrid',
		category: 'Chimera, Cockatrice, Manticore, etc.',
		character_trait: {
			trait: 'strength',
			bonus: 3
		},
		evasion_bonus: 2,
		attack: {
			range: 'Melee',
			trait: 'strength',
			damage_dice: 'd12',
			damage_bonus: 10,
			damage_type: 'phy'
		},
		advantages: [],
		features: [
			{
				title: 'Hybrid Features',
				description_html:
					'To transform into this creature, **mark 2 additional Stress**. Choose any three Beastform options from Tiers 1-3. Choose a total of five advantages and three features from those options.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		],
		special_case: 'mythic_hybrid'
	}
} as const satisfies Record<string, Beastform>;
