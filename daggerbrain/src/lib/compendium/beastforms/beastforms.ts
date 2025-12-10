import type { Beastform } from "$lib/types/compendium-types";

const TIER_1_BEASTFORMS = {
	agile_scout: {
		compendium_id: "agile_scout",
		source_id: "SRD",
		level_requirement: 1,
		name: "Agile Scout",
		category: "Fox, Mouse, Weasel, etc.",
		character_trait: {
			trait: "agility",
			bonus: 1
		},
		evasion_bonus: 2,
		attack: {
			range: "Melee",
			trait: "agility",
			damage_dice: "d4",
			damage_bonus: 0,
			damage_type: "phy"
		},
		advantages: ["deceive", "locate", "sneak"],
		features: [
			{
				title: "Agile",
				description_html:
					"<p>Your movement is silent, and you can <b>spend a Hope</b> to move up to Far range without rolling.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Fragile",
				description_html:
					"<p>When you take Major or greater damage, you drop out of Beastform.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	household_friend: {
		compendium_id: "household_friend",
		source_id: "SRD",
		level_requirement: 1,
		name: "Household Friend",
		category: "Cat, Dog, Rabbit, etc.",
		character_trait: {
			trait: "instinct",
			bonus: 1
		},
		evasion_bonus: 2,
		attack: {
			range: "Melee",
			trait: "instinct",
			damage_dice: "d6",
			damage_bonus: 0,
			damage_type: "phy"
		},
		advantages: ["climb", "locate", "protect"],
		features: [
			{
				title: "Companion",
				description_html:
					"<p>When you Help an Ally, you can roll a <b>d8</b> as your advantage die.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Fragile",
				description_html:
					"<p>When you take Major or greater damage, you drop out of Beastform.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	nimble_grazer: {
		compendium_id: "nimble_grazer",
		source_id: "SRD",
		level_requirement: 1,
		name: "Nimble Grazer",
		category: "Deer, Gazelle, Goat, etc.",
		character_trait: {
			trait: "agility",
			bonus: 1
		},
		evasion_bonus: 3,
		attack: {
			range: "Melee",
			trait: "agility",
			damage_dice: "d6",
			damage_bonus: 0,
			damage_type: "phy"
		},
		advantages: ["leap", "sneak", "sprint"],
		features: [
			{
				title: "Elusive Prey",
				description_html:
					"<p>When an attack roll against you would succeed, you can <b>mark a Stress</b> and roll a <b>d4</b>. Add the result to your Evasion against this attack.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Fragile",
				description_html:
					"<p>When you take Major or greater damage, you drop out of Beastform.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	pack_predator: {
		compendium_id: "pack_predator",
		source_id: "SRD",
		level_requirement: 1,
		name: "Pack Predator",
		category: "Coyote, Hyena, Wolf, etc.",
		character_trait: {
			trait: "strength",
			bonus: 2
		},
		evasion_bonus: 1,
		attack: {
			range: "Melee",
			trait: "strength",
			damage_dice: "d8",
			damage_bonus: 2,
			damage_type: "phy"
		},
		advantages: ["attack", "sprint", "track"],
		features: [
			{
				title: "Hobbling Strike",
				description_html:
					"<p>When you succeed on an attack against a target within Melee range, you can <b>mark a Stress</b> to make the target temporarily <em>Vulnerable</em>.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Pack Hunting",
				description_html:
					"<p>When you succeed on an attack against the same target as an ally who acts immediately before you, add a <b>d8</b> to your damage roll.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	aquatic_scout: {
		compendium_id: "aquatic_scout",
		source_id: "SRD",
		level_requirement: 1,
		name: "Aquatic Scout",
		category: "Eel, Fish, Octopus, etc.",
		character_trait: {
			trait: "agility",
			bonus: 1
		},
		evasion_bonus: 2,
		attack: {
			range: "Melee",
			trait: "agility",
			damage_dice: "d4",
			damage_bonus: 0,
			damage_type: "phy"
		},
		advantages: ["navigate", "sneak", "swim"],
		features: [
			{
				title: "Aquatic",
				description_html:
					"<p>You can breathe and move naturally underwater.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Fragile",
				description_html:
					"<p>When you take Major or greater damage, you drop out of Beastform.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	stalking_arachnid: {
		compendium_id: "stalking_arachnid",
		source_id: "SRD",
		level_requirement: 1,
		name: "Stalking Arachnid",
		category: "Tarantula, Wolf Spider, etc.",
		character_trait: {
			trait: "finesse",
			bonus: 1
		},
		evasion_bonus: 2,
		attack: {
			range: "Melee",
			trait: "finesse",
			damage_dice: "d6",
			damage_bonus: 1,
		damage_type: "phy"
	},
	advantages: ["attack", "climb", "sneak"],
	features: [
		{
			title: "Venomous Bite",
				description_html:
					"<p>When you succeed on an attack against a target within Melee range, the target becomes temporarily <em>Poisoned</em>. A <em>Poisoned</em> creature takes <b>1d10</b> direct physical damage each time they act.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Webslinger",
				description_html:
					"<p>You can create a strong web material useful for both adventuring and battle. The web is resilient enough to support one creature. You can temporarily <em>Restrain</em> a target within Close range by succeeding on a Finesse Roll against them.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	}
} as const satisfies Record<string, Beastform>;

const TIER_2_BEASTFORMS = {
	armored_sentry: {
		compendium_id: "armored_sentry",
		source_id: "SRD",
		level_requirement: 2,
		name: "Armored Sentry",
		category: "Armadillo, Pangolin, Turtle, etc.",
		character_trait: {
			trait: "strength",
			bonus: 1
		},
		evasion_bonus: 1,
		attack: {
			range: "Melee",
			trait: "strength",
			damage_dice: "d8",
			damage_bonus: 2,
			damage_type: "phy"
		},
		advantages: ["dig", "locate", "protect"],
		features: [
			{
				title: "Armored Shell",
				description_html:
					"<p>Your hardened exterior gives you resistance to physical damage. Additionally, <b>mark an Armor Slot</b> to retract into your shell. While in your shell, physical damage is reduced by a number equal to your Armor Score (after applying resistance), but you can't perform other actions without leaving this form.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Cannonball",
				description_html:
					"<p><b>Mark a Stress</b> to allow an ally to throw or launch you at an adversary. To do so, the ally makes an attack roll using Agility or Strength (their choice) against a target within Close range. On a success, the adversary takes <b>d12+2</b> physical damage using the thrower's Proficiency. You can <b>spend a Hope</b> to target an additional adversary within Very Close range of the first. The second target takes half the damage dealt to the first target.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	powerful_beast: {
		compendium_id: "powerful_beast",
		source_id: "SRD",
		level_requirement: 2,
		name: "Powerful Beast",
		category: "Bear, Bull, Moose, etc.",
		character_trait: {
			trait: "strength",
			bonus: 3
		},
		evasion_bonus: 1,
		attack: {
			range: "Melee",
			trait: "strength",
			damage_dice: "d10",
			damage_bonus: 4,
			damage_type: "phy"
		},
		advantages: ["navigate", "protect", "scare"],
		features: [
			{
				title: "Rampage",
				description_html:
					"<p>When you roll a 1 on a damage die, you can roll a <b>d10</b> and add the result to the damage roll. Additionally, before you make an attack roll, you can <b>mark a Stress</b> to gain a +1 bonus to your Proficiency for that attack.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Thick Hide",
				description_html:
					"<p>You gain a +2 bonus to your damage thresholds.</p>",
				character_modifiers: [
					{
						behaviour: "bonus",
						target: "major_damage_threshold",
						type: "flat",
						value: 2,
						character_conditions: []
					},
					{
						behaviour: "bonus",
						target: "severe_damage_threshold",
						type: "flat",
						value: 2,
						character_conditions: []
					}
				],
				weapon_modifiers: []
			}
		]
	},
	mighty_strider: {
		compendium_id: "mighty_strider",
		source_id: "SRD",
		level_requirement: 2,
		name: "Mighty Strider",
		category: "Camel, Horse, Zebra, etc.",
		character_trait: {
			trait: "agility",
			bonus: 1
		},
		evasion_bonus: 2,
		attack: {
			range: "Melee",
			trait: "agility",
			damage_dice: "d8",
		damage_bonus: 1,
		damage_type: "phy"
	},
	advantages: ["leap", "navigate", "sprint"],
	features: [
		{
			title: "Carrier",
				description_html:
					"<p>You can carry up to two willing allies with you when you move.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Trample",
				description_html:
					"<p><b>Mark a Stress</b> to move up to Close range in a straight line and make an attack against all targets within Melee range of the line. Targets you succeed against take <b>d8+1</b> physical damage using your Proficiency and are temporarily <em>Vulnerable</em>.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	striking_serpent: {
		compendium_id: "striking_serpent",
		source_id: "SRD",
		level_requirement: 2,
		name: "Striking Serpent",
		category: "Cobra, Rattlesnake, Viper, etc.",
		character_trait: {
			trait: "finesse",
			bonus: 1
		},
		evasion_bonus: 2,
		attack: {
			range: "Very Close",
			trait: "finesse",
			damage_dice: "d8",
		damage_bonus: 4,
		damage_type: "phy"
	},
	advantages: ["climb", "deceive", "sprint"],
	features: [
		{
			title: "Venomous Strike",
				description_html:
					"<p>Make an attack against any number of targets within Very Close range. On a success, a target is temporarily <em>Poisoned</em>. A <em>Poisoned</em> creature takes <b>1d10</b> direct physical damage each time they act.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Warning Hiss",
				description_html:
					"<p><b>Mark a Stress</b> to force any number of targets within Melee range to move back to Very Close range.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	pouncing_predator: {
		compendium_id: "pouncing_predator",
		source_id: "SRD",
		level_requirement: 2,
		name: "Pouncing Predator",
		category: "Cheetah, Lion, Panther, etc.",
		character_trait: {
			trait: "instinct",
			bonus: 1
		},
		evasion_bonus: 3,
		attack: {
			range: "Melee",
			trait: "instinct",
			damage_dice: "d8",
		damage_bonus: 6,
		damage_type: "phy"
	},
	advantages: ["attack", "climb", "sneak"],
	features: [
		{
			title: "Fleet",
				description_html:
					"<p><b>Spend a Hope</b> to move up to Far range without rolling.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Takedown",
				description_html:
					"<p><b>Mark a Stress</b> to move into Melee range of a target and make an attack roll against them. On a success, you gain a <b>+2</b> bonus to your Proficiency for this attack and the target must <b>mark a Stress</b>.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	winged_beast: {
		compendium_id: "winged_beast",
		source_id: "SRD",
		level_requirement: 2,
		name: "Winged Beast",
		category: "Hawk, Owl, Raven, etc.",
		character_trait: {
			trait: "finesse",
			bonus: 1
		},
		evasion_bonus: 3,
		attack: {
			range: "Melee",
			trait: "finesse",
			damage_dice: "d4",
			damage_bonus: 2,
			damage_type: "phy"
		},
		advantages: ["deceive", "locate", "scare"],
		features: [
			{
				title: "Bird's-Eye View",
				description_html:
					"<p>You can fly at will. Once per rest while you are airborne, you can ask the GM a question about the scene below you without needing to roll. The first time a character makes a roll to act on this information, they gain advantage on the roll.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Hollow Bones",
				description_html:
					"<p>You gain a <b>−2</b> penalty to your damage thresholds.</p>",
				character_modifiers: [
					{
						behaviour: "bonus",
						target: "major_damage_threshold",
						type: "flat",
						value: -2,
						character_conditions: []
					},
					{
						behaviour: "bonus",
						target: "severe_damage_threshold",
						type: "flat",
						value: -2,
						character_conditions: []
					}
				],
				weapon_modifiers: []
			}
		]
	}
} as const satisfies Record<string, Beastform>;

const TIER_3_BEASTFORMS = {
	great_predator: {
		compendium_id: "great_predator",
		source_id: "SRD",
		level_requirement: 5,
		name: "Great Predator",
		category: "Dire Wolf, Velociraptor, Sabertooth Tiger, etc.",
		character_trait: {
			trait: "strength",
			bonus: 2
		},
		evasion_bonus: 2,
		attack: {
			range: "Melee",
			trait: "strength",
			damage_dice: "d12",
			damage_bonus: 8,
		damage_type: "phy"
	},
	advantages: ["attack", "sneak", "sprint"],
	features: [
		{
			title: "Carrier",
				description_html:
					"<p>You can carry up to two willing allies with you when you move.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Vicious Maul",
				description_html:
					"<p>When you succeed on an attack against a target, you can <b>spend a Hope</b> to make them temporarily <em>Vulnerable</em> and gain a +1 bonus to your Proficiency for this attack.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	mighty_lizard: {
		compendium_id: "mighty_lizard",
		source_id: "SRD",
		level_requirement: 5,
		name: "Mighty Lizard",
		category: "Alligator, Crocodile, Gila Monster, etc.",
		character_trait: {
			trait: "instinct",
			bonus: 2
		},
		evasion_bonus: 1,
		attack: {
			range: "Melee",
			trait: "instinct",
			damage_dice: "d10",
			damage_bonus: 7,
		damage_type: "phy"
	},
	advantages: ["attack", "sneak", "track"],
	features: [
		{
			title: "Physical Defense",
				description_html:
					"<p>You gain a +3 bonus to your damage thresholds.</p>",
				character_modifiers: [
					{
						behaviour: "bonus",
						target: "major_damage_threshold",
						type: "flat",
						value: 3,
						character_conditions: []
					},
					{
						behaviour: "bonus",
						target: "severe_damage_threshold",
						type: "flat",
						value: 3,
						character_conditions: []
					}
				],
				weapon_modifiers: []
			},
			{
				title: "Snapping Strike",
				description_html:
					"<p>When you succeed on an attack against a target within Melee range, you can <b>spend a Hope</b> to clamp that opponent in your jaws, making them temporarily <em>Restrained</em> and <em>Vulnerable</em>.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	great_winged_beast: {
		compendium_id: "great_winged_beast",
		source_id: "SRD",
		level_requirement: 5,
		name: "Great Winged Beast",
		category: "Giant Eagle, Falcon, etc.",
		character_trait: {
			trait: "finesse",
			bonus: 2
		},
		evasion_bonus: 3,
		attack: {
			range: "Melee",
			trait: "finesse",
			damage_dice: "d8",
			damage_bonus: 6,
			damage_type: "phy"
		},
		advantages: ["deceive", "distract", "locate"],
		features: [
			{
				title: "Bird's-Eye View",
				description_html:
					"<p>You can fly at will. Once per rest while you are airborne, you can ask the GM a question about the scene below you without needing to roll. The first time a character makes a roll to act on this information, they gain advantage on the roll.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Carrier",
				description_html:
					"<p>You can carry up to two willing allies with you when you move.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	aquatic_predator: {
		compendium_id: "aquatic_predator",
		source_id: "SRD",
		level_requirement: 5,
		name: "Aquatic Predator",
		category: "Dolphin, Orca, Shark, etc.",
		character_trait: {
			trait: "agility",
			bonus: 2
		},
		evasion_bonus: 4,
		attack: {
			range: "Melee",
			trait: "agility",
			damage_dice: "d10",
			damage_bonus: 6,
		damage_type: "phy"
	},
	advantages: ["attack", "swim", "track"],
	features: [
		{
			title: "Aquatic",
				description_html:
					"<p>You can breathe and move naturally underwater.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Vicious Maul",
				description_html:
					"<p>When you succeed on an attack against a target, you can <b>spend a Hope</b> to make them <em>Vulnerable</em> and gain a +1 bonus to your Proficiency for this attack.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	legendary_beast: {
		compendium_id: "legendary_beast",
		source_id: "SRD",
		level_requirement: 5,
		name: "Legendary Beast",
		category: "Upgraded Tier 1 Options",
		character_trait: {
			trait: "agility",
			bonus: 0
		},
		evasion_bonus: 0,
		attack: {
			range: "Melee",
			trait: "agility",
		damage_dice: "d4",
		damage_bonus: 0,
		damage_type: "phy"
	},
	advantages: [],
	features: [
		{
			title: "Evolved",
			description_html:
				"<p>Pick a Tier 1 Beastform option and become a larger, more powerful version of that creature. While you're in this form, you retain all traits and features from the original form and gain the following bonuses:</p><ul class=\"list-disc list-inside ml-2\"><li>A +6 bonus to damage rolls</li><li>A +1 bonus to the trait used by this form</li><li>A +2 bonus to Evasion</li></ul>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	legendary_hybrid: {
		compendium_id: "legendary_hybrid",
		source_id: "SRD",
		level_requirement: 5,
		name: "Legendary Hybrid",
		category: "Griffon, Sphinx, etc.",
		character_trait: {
			trait: "strength",
			bonus: 2
		},
		evasion_bonus: 3,
		attack: {
			range: "Melee",
			trait: "strength",
		damage_dice: "d10",
		damage_bonus: 8,
		damage_type: "phy"
	},
	advantages: [],
	features: [
		{
			title: "Hybrid Features",
			description_html:
				"<p>To transform into this creature, <b>mark an additional Stress</b>. Choose any two Beastform options from Tiers 1–2. Choose a total of four advantages and two features from those options.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	}
} as const satisfies Record<string, Beastform>;

const TIER_4_BEASTFORMS = {
	massive_behemoth: {
		compendium_id: "massive_behemoth",
		source_id: "SRD",
		level_requirement: 8,
		name: "Massive Behemoth",
		category: "Elephant, Mammoth, Rhinoceros, etc.",
		character_trait: {
			trait: "strength",
			bonus: 3
		},
		evasion_bonus: 1,
		attack: {
			range: "Melee",
			trait: "strength",
		damage_dice: "d12",
		damage_bonus: 12,
		damage_type: "phy"
	},
	advantages: ["locate", "protect", "scare", "sprint"],
	features: [
		{
			title: "Carrier",
				description_html:
					"<p>You can carry up to four willing allies with you when you move.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Demolish",
				description_html:
					"<p><b>Spend a Hope</b> to move up to Far range in a straight line and make an attack against all targets within Melee range of the line. Targets you succeed against take <b>d8+10</b> physical damage using your Proficiency and are temporarily <em>Vulnerable</em>.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Undaunted",
				description_html:
					"<p>You gain a +2 bonus to all your damage thresholds.</p>",
				character_modifiers: [
					{
						behaviour: "bonus",
						target: "major_damage_threshold",
						type: "flat",
						value: 2,
						character_conditions: []
					},
					{
						behaviour: "bonus",
						target: "severe_damage_threshold",
						type: "flat",
						value: 2,
						character_conditions: []
					}
				],
				weapon_modifiers: []
			}
		]
	},
	terrible_lizard: {
		compendium_id: "terrible_lizard",
		source_id: "SRD",
		level_requirement: 8,
		name: "Terrible Lizard",
		category: "Brachiosaurus, Tyrannosaurus, etc.",
		character_trait: {
			trait: "strength",
			bonus: 3
		},
		evasion_bonus: 2,
		attack: {
			range: "Melee",
			trait: "strength",
		damage_dice: "d12",
		damage_bonus: 10,
		damage_type: "phy"
	},
	advantages: ["attack", "deceive", "scare", "track"],
	features: [
		{
			title: "Devastating Strikes",
				description_html:
					"<p>When you deal Severe damage to a target within Melee range, you can <b>mark a Stress</b> to force them to mark an additional Hit Point.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Massive Stride",
				description_html:
					"<p>You can move up to Far range without rolling. You ignore rough terrain (at the GM's discretion) due to your size.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	mythic_aerial_hunter: {
		compendium_id: "mythic_aerial_hunter",
		source_id: "SRD",
		level_requirement: 8,
		name: "Mythic Aerial Hunter",
		category: "Dragon, Pterodactyl, Roc, Wyvern, etc.",
		character_trait: {
			trait: "finesse",
			bonus: 3
		},
		evasion_bonus: 4,
		attack: {
			range: "Melee",
			trait: "finesse",
		damage_dice: "d10",
		damage_bonus: 11,
		damage_type: "phy"
	},
	advantages: ["attack", "deceive", "locate", "navigate"],
	features: [
		{
			title: "Carrier",
				description_html:
					"<p>You can carry up to three willing allies with you when you move.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Deadly Raptor",
				description_html:
					"<p>You can fly at will and move up to Far range as part of your action. When you move in a straight line into Melee range of a target from at least Close range and make an attack against that target in the same action, you can reroll all damage dice that rolled a result lower than your Proficiency.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	epic_aquatic_beast: {
		compendium_id: "epic_aquatic_beast",
		source_id: "SRD",
		level_requirement: 8,
		name: "Epic Aquatic Beast",
		category: "Giant Squid, Whale, etc.",
		character_trait: {
			trait: "agility",
			bonus: 3
		},
		evasion_bonus: 3,
		attack: {
			range: "Melee",
			trait: "agility",
		damage_dice: "d10",
		damage_bonus: 10,
		damage_type: "phy"
	},
	advantages: ["locate", "protect", "scare", "track"],
	features: [
		{
			title: "Ocean Master",
				description_html:
					"<p>You can breathe and move naturally underwater. When you succeed on an attack against a target within Melee range, you can temporarily <em>Restrain</em> them.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: "Unyielding",
				description_html:
					"<p>When you would mark an Armor Slot, roll a <b>d6</b>. On a result of 5 or higher, reduce the severity by one threshold without marking an Armor Slot.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	mythic_beast: {
		compendium_id: "mythic_beast",
		source_id: "SRD",
		level_requirement: 8,
		name: "Mythic Beast",
		category: "Upgraded Tier 1 or Tier 2 Options",
		character_trait: {
			trait: "agility",
			bonus: 0
		},
		evasion_bonus: 0,
		attack: {
			range: "Melee",
			trait: "agility",
		damage_dice: "d4",
		damage_bonus: 0,
		damage_type: "phy"
	},
	advantages: [],
	features: [
		{
			title: "Evolved",
			description_html:
				"<p>Pick a Tier 1 or Tier 2 Beastform option and become a larger, more powerful version of that creature. While you're in this form, you retain all traits and features from the original form and gain the following bonuses:</p><ul class=\"list-disc list-inside ml-2\"><li>A +9 bonus to damage rolls</li><li>A +2 bonus to the trait used by this form</li><li>A +3 bonus to Evasion</li><li>Your damage die increases by one size (d6 becomes d8, d8 becomes d10, etc.)</li></ul>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	mythic_hybrid: {
		compendium_id: "mythic_hybrid",
		source_id: "SRD",
		level_requirement: 8,
		name: "Mythic Hybrid",
		category: "Chimera, Cockatrice, Manticore, etc.",
		character_trait: {
			trait: "strength",
			bonus: 3
		},
		evasion_bonus: 2,
		attack: {
			range: "Melee",
			trait: "strength",
		damage_dice: "d12",
		damage_bonus: 10,
		damage_type: "phy"
	},
	advantages: [],
	features: [
		{
			title: "Hybrid Features",
			description_html:
				"<p>To transform into this creature, <b>mark 2 additional Stress</b>. Choose any three Beastform options from Tiers 1-3. Choose a total of five advantages and three features from those options.</p>",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	}
} as const satisfies Record<string, Beastform>;

export const BEASTFORMS = {
	...TIER_1_BEASTFORMS,
	...TIER_2_BEASTFORMS,
	...TIER_3_BEASTFORMS,
	...TIER_4_BEASTFORMS
} as const satisfies Record<string, Beastform>;