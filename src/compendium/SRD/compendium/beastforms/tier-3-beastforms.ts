import type { Beastform } from '../../../../convex/schemas/compendium';

export const TIER_3_BEASTFORMS = {
	great_predator: {
		source_key: 'SRD',
		level_requirement: 5,
		title: 'Great Predator',
		category: 'Dire Wolf, Velociraptor, Sabertooth Tiger, etc.',
		character_trait: {
			trait: 'strength',
			bonus: 2
		},
		evasion_bonus: 2,
		attack: {
			range: 'Melee',
			trait: 'strength',
			damage_dice: 'd12',
			damage_bonus: 8,
			damage_type: 'phy'
		},
		advantages: ['attack', 'sneak', 'sprint'],
		features: [
			{
				title: 'Carrier',
				description_html: 'You can carry up to two willing allies with you when you move.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Vicious Maul',
				description_html:
					'When you succeed on an attack against a target, you can **spend a Hope** to make them temporarily *Vulnerable* and gain a +1 bonus to your Proficiency for this attack.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	mighty_lizard: {
		source_key: 'SRD',
		level_requirement: 5,
		title: 'Mighty Lizard',
		category: 'Alligator, Crocodile, Gila Monster, etc.',
		character_trait: {
			trait: 'instinct',
			bonus: 2
		},
		evasion_bonus: 1,
		attack: {
			range: 'Melee',
			trait: 'instinct',
			damage_dice: 'd10',
			damage_bonus: 7,
			damage_type: 'phy'
		},
		advantages: ['attack', 'sneak', 'track'],
		features: [
			{
				title: 'Physical Defense',
				description_html: 'You gain a +3 bonus to your damage thresholds.',
				character_modifiers: [
					{
						behaviour: 'bonus',
						target: 'major_damage_threshold',
						type: 'flat',
						value: 3,
						character_conditions: []
					},
					{
						behaviour: 'bonus',
						target: 'severe_damage_threshold',
						type: 'flat',
						value: 3,
						character_conditions: []
					}
				],
				weapon_modifiers: []
			},
			{
				title: 'Snapping Strike',
				description_html:
					'When you succeed on an attack against a target within Melee range, you can **spend a Hope** to clamp that opponent in your jaws, making them temporarily *Restrained* and *Vulnerable*.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	great_winged_beast: {
		source_key: 'SRD',
		level_requirement: 5,
		title: 'Great Winged Beast',
		category: 'Giant Eagle, Falcon, etc.',
		character_trait: {
			trait: 'finesse',
			bonus: 2
		},
		evasion_bonus: 3,
		attack: {
			range: 'Melee',
			trait: 'finesse',
			damage_dice: 'd8',
			damage_bonus: 6,
			damage_type: 'phy'
		},
		advantages: ['deceive', 'distract', 'locate'],
		features: [
			{
				title: "Bird's-Eye View",
				description_html:
					'You can fly at will. Once per rest while you are airborne, you can ask the GM a question about the scene below you without needing to roll. The first time a character makes a roll to act on this information, they gain advantage on the roll.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Carrier',
				description_html: 'You can carry up to two willing allies with you when you move.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	aquatic_predator: {
		source_key: 'SRD',
		level_requirement: 5,
		title: 'Aquatic Predator',
		category: 'Dolphin, Orca, Shark, etc.',
		character_trait: {
			trait: 'agility',
			bonus: 2
		},
		evasion_bonus: 4,
		attack: {
			range: 'Melee',
			trait: 'agility',
			damage_dice: 'd10',
			damage_bonus: 6,
			damage_type: 'phy'
		},
		advantages: ['attack', 'swim', 'track'],
		features: [
			{
				title: 'Aquatic',
				description_html: 'You can breathe and move naturally underwater.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Vicious Maul',
				description_html:
					'When you succeed on an attack against a target, you can **spend a Hope** to make them *Vulnerable* and gain a +1 bonus to your Proficiency for this attack.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	legendary_beast: {
		source_key: 'SRD',
		level_requirement: 5,
		title: 'Legendary Beast',
		category: 'Upgraded Tier 1 Options',
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
					"Pick a Tier 1 Beastform option and become a larger, more powerful version of that creature. While you're in this form, you retain all traits and features from the original form and gain the following bonuses:\n- A +6 bonus to damage rolls\n- A +1 bonus to the trait used by this form\n- A +2 bonus to Evasion",
				character_modifiers: [],
				weapon_modifiers: []
			}
		],
		special_case: 'legendary_beast'
	},
	legendary_hybrid: {
		source_key: 'SRD',
		level_requirement: 5,
		title: 'Legendary Hybrid',
		category: 'Griffon, Sphinx, etc.',
		character_trait: {
			trait: 'strength',
			bonus: 2
		},
		evasion_bonus: 3,
		attack: {
			range: 'Melee',
			trait: 'strength',
			damage_dice: 'd10',
			damage_bonus: 8,
			damage_type: 'phy'
		},
		advantages: [],
		features: [
			{
				title: 'Hybrid Features',
				description_html:
					'To transform into this creature, **mark an additional Stress**. Choose any two Beastform options from Tiers 1–2. Choose a total of four advantages and two features from those options.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		],
		special_case: 'legendary_hybrid'
	}
} as const satisfies Record<string, Beastform>;
