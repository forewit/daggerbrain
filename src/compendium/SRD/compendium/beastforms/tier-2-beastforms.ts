import type { Beastform } from '../../../../convex/schemas/compendium';

export const TIER_2_BEASTFORMS = {
	armored_sentry: {
		source_key: 'SRD',
		level_requirement: 2,
		title: 'Armored Sentry',
		category: 'Armadillo, Pangolin, Turtle, etc.',
		character_trait: {
			trait: 'strength',
			bonus: 1
		},
		evasion_bonus: 1,
		attack: {
			range: 'Melee',
			trait: 'strength',
			damage_dice: 'd8',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		advantages: ['dig', 'locate', 'protect'],
		features: [
			{
				title: 'Armored Shell',
				description_html:
					"Your hardened exterior gives you resistance to physical damage. Additionally, **mark an Armor Slot** to retract into your shell. While in your shell, physical damage is reduced by a number equal to your Armor Score (after applying resistance), but you can't perform other actions without leaving this form.",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Cannonball',
				description_html:
					"**Mark a Stress** to allow an ally to throw or launch you at an adversary. To do so, the ally makes an attack roll using Agility or Strength (their choice) against a target within Close range. On a success, the adversary takes **d12+2** physical damage using the thrower's Proficiency. You can **spend a Hope** to target an additional adversary within Very Close range of the first. The second target takes half the damage dealt to the first target.",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	powerful_beast: {
		source_key: 'SRD',
		level_requirement: 2,
		title: 'Powerful Beast',
		category: 'Bear, Bull, Moose, etc.',
		character_trait: {
			trait: 'strength',
			bonus: 3
		},
		evasion_bonus: 1,
		attack: {
			range: 'Melee',
			trait: 'strength',
			damage_dice: 'd10',
			damage_bonus: 4,
			damage_type: 'phy'
		},
		advantages: ['navigate', 'protect', 'scare'],
		features: [
			{
				title: 'Rampage',
				description_html:
					'When you roll a 1 on a damage die, you can roll a **d10** and add the result to the damage roll. Additionally, before you make an attack roll, you can **mark a Stress** to gain a +1 bonus to your Proficiency for that attack.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Thick Hide',
				description_html: 'You gain a +2 bonus to your damage thresholds.',
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
	mighty_strider: {
		source_key: 'SRD',
		level_requirement: 2,
		title: 'Mighty Strider',
		category: 'Camel, Horse, Zebra, etc.',
		character_trait: {
			trait: 'agility',
			bonus: 1
		},
		evasion_bonus: 2,
		attack: {
			range: 'Melee',
			trait: 'agility',
			damage_dice: 'd8',
			damage_bonus: 1,
			damage_type: 'phy'
		},
		advantages: ['leap', 'navigate', 'sprint'],
		features: [
			{
				title: 'Carrier',
				description_html: 'You can carry up to two willing allies with you when you move.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Trample',
				description_html:
					'**Mark a Stress** to move up to Close range in a straight line and make an attack against all targets within Melee range of the line. Targets you succeed against take **d8+1** physical damage using your Proficiency and are temporarily *Vulnerable*.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	striking_serpent: {
		source_key: 'SRD',
		level_requirement: 2,
		title: 'Striking Serpent',
		category: 'Cobra, Rattlesnake, Viper, etc.',
		character_trait: {
			trait: 'finesse',
			bonus: 1
		},
		evasion_bonus: 2,
		attack: {
			range: 'Very Close',
			trait: 'finesse',
			damage_dice: 'd8',
			damage_bonus: 4,
			damage_type: 'phy'
		},
		advantages: ['climb', 'deceive', 'sprint'],
		features: [
			{
				title: 'Venomous Strike',
				description_html:
					'Make an attack against any number of targets within Very Close range. On a success, a target is temporarily *Poisoned*. A *Poisoned* creature takes **1d10** direct physical damage each time they act.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Warning Hiss',
				description_html:
					'**Mark a Stress** to force any number of targets within Melee range to move back to Very Close range.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	pouncing_predator: {
		source_key: 'SRD',
		level_requirement: 2,
		title: 'Pouncing Predator',
		category: 'Cheetah, Lion, Panther, etc.',
		character_trait: {
			trait: 'instinct',
			bonus: 1
		},
		evasion_bonus: 3,
		attack: {
			range: 'Melee',
			trait: 'instinct',
			damage_dice: 'd8',
			damage_bonus: 6,
			damage_type: 'phy'
		},
		advantages: ['attack', 'climb', 'sneak'],
		features: [
			{
				title: 'Fleet',
				description_html: '**Spend a Hope** to move up to Far range without rolling.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Takedown',
				description_html:
					'**Mark a Stress** to move into Melee range of a target and make an attack roll against them. On a success, you gain a **+2** bonus to your Proficiency for this attack and the target must **mark a Stress**.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	winged_beast: {
		source_key: 'SRD',
		level_requirement: 2,
		title: 'Winged Beast',
		category: 'Hawk, Owl, Raven, etc.',
		character_trait: {
			trait: 'finesse',
			bonus: 1
		},
		evasion_bonus: 3,
		attack: {
			range: 'Melee',
			trait: 'finesse',
			damage_dice: 'd4',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		advantages: ['deceive', 'locate', 'scare'],
		features: [
			{
				title: "Bird's-Eye View",
				description_html:
					'You can fly at will. Once per rest while you are airborne, you can ask the GM a question about the scene below you without needing to roll. The first time a character makes a roll to act on this information, they gain advantage on the roll.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Hollow Bones',
				description_html: 'You gain a **−2** penalty to your damage thresholds.',
				character_modifiers: [
					{
						behaviour: 'bonus',
						target: 'major_damage_threshold',
						type: 'flat',
						value: -2,
						character_conditions: []
					},
					{
						behaviour: 'bonus',
						target: 'severe_damage_threshold',
						type: 'flat',
						value: -2,
						character_conditions: []
					}
				],
				weapon_modifiers: []
			}
		]
	}
} as const satisfies Record<string, Beastform>;
