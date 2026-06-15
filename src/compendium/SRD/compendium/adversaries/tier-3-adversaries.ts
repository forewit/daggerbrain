import type { Adversary } from '../../../../convex/schemas/compendium';

export const TIER_3_ADVERSARIES = {
	adult_flickerfly: {
		source_key: 'SRD',
		title: 'Adult Flickerfly',
		tier: 3,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description:
			'A winged insect the size of a large house with iridescent scales and wings that move too fast to track.',
		motives_tactics: 'Collect shiny things, hunt, nest, swoop',
		difficulty: 17,
		thresholds: { major: 20, severe: 35 },
		max_hp: 12,
		max_stress: 6,
		attack_modifier: 3,
		standard_attack: {
			name: 'Wing Slash',
			range: 'Very Close',
			damage_dice: '3d20',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Relentless',
				max_uses: 4,
				description_html:
					'The Flickerfly can be spotlighted up to four times per GM turn. Spend Fear as usual to spotlight them.'
			},
			{
				type: 'Passive',
				name: 'Never Misses',
				max_uses: null,
				description_html:
					"When the Flickerfly makes an attack, the target's Evasion is halved against the attack."
			},
			{
				type: 'Passive',
				name: 'Deadly Flight',
				max_uses: null,
				description_html:
					'While flying, the Flickerfly can move up to Far range instead of Close range before taking an action.'
			},
			{
				type: 'Action',
				name: 'Whirlwind',
				max_uses: null,
				description_html:
					'**Spend a Fear** to whirl, making an attack against all targets within Very Close range. Targets the Flickerfly succeeds against take **3d8** direct physical damage.'
			},
			{
				type: 'Action',
				name: 'Mind Dance',
				max_uses: null,
				description_html:
					"**Mark a Stress** to create a magically dazzling display that grapples the minds of nearby foes. All targets within Close range must make an Instinct Reaction Roll. For each target who failed, you gain a Fear and the Flickerfly learns one of the target's fears."
			},
			{
				type: 'Reaction',
				name: 'Hallucinatory Breath',
				max_uses: null,
				description_html:
					'Countdown (Loop 1d6). When the Flickerfly takes damage for the first time, activate the countdown. When it triggers, the Flickerfly breathes hallucinatory gas on all targets in front of them up to Far range. Targets must make an Instinct Reaction Roll or be tormented by fearful hallucinations. Targets whose fears are known to the Flickerfly have disadvantage on this roll. Targets who fail lose 2 Hope and take **3d8+3** direct magic damage.'
			},
			{
				type: 'Reaction',
				name: 'Uncanny Reflexes',
				max_uses: null,
				description_html:
					'When the Flickerfly takes damage from an attack within Close range, you can **Mark a Stress** to take half damage.'
			}
		]
	},
	demon_of_avarice: {
		source_key: 'SRD',
		title: 'Demon of Avarice',
		tier: 3,
		type: 'Support',
		image_url: '',
		artist_name: '',
		description: 'A regal cloaked monstrosity with circular horns adorned with treasure.',
		motives_tactics: 'Consume, fuel greed, sow dissent',
		difficulty: 17,
		thresholds: { major: 15, severe: 29 },
		max_hp: 6,
		max_stress: 5,
		attack_modifier: 2,
		standard_attack: {
			name: 'Hungry Maw',
			range: 'Melee',
			damage_dice: '3d6',
			damage_bonus: 5,
			damage_type: 'mag'
		},
		experiences: ['Manipulation'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Money Talks',
				max_uses: null,
				description_html:
					"Attacks against the Demon are made with disadvantage unless the attacker spends a handful of gold. This Demon starts with a number of handfuls equal to the number of PCs. When a target marks HP from the Demon's standard attack, they can spend a handful of gold instead of marking HP (1 handful per HP). Add a handful of gold to the Demon for each handful of gold spent by PCs on this feature."
			},
			{
				type: 'Passive',
				name: 'Numbers Must Go Up',
				max_uses: null,
				description_html:
					"Add a bonus to the Demon's attack rolls equal to the number of handfuls of gold they have."
			},
			{
				type: 'Action',
				name: 'Money Is Time',
				max_uses: null,
				description_html:
					'Spend 3 handfuls of gold (or **Spend a Fear**) to spotlight **1d4+1** allies.'
			}
		]
	},
	demon_of_despair: {
		source_key: 'SRD',
		title: 'Demon of Despair',
		tier: 3,
		type: 'Skulk',
		image_url: '',
		artist_name: '',
		description: 'A cloaked demon-creature with long limbs, seeping shadows.',
		motives_tactics: 'Make fear contagious, stick to the shadows, undermine resolve',
		difficulty: 17,
		thresholds: { major: 18, severe: 35 },
		max_hp: 6,
		max_stress: 5,
		attack_modifier: 3,
		standard_attack: {
			name: 'Miasma Bolt',
			range: 'Far',
			damage_dice: '3d6',
			damage_bonus: 1,
			damage_type: 'mag'
		},
		experiences: ['Manipulation'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Depths of Despair',
				max_uses: null,
				description_html: 'The Demon deals double damage to PCs with 0 Hope.'
			},
			{
				type: 'Action',
				name: 'Your Struggle Is Pointless',
				max_uses: null,
				description_html:
					'**Spend a Fear** to weigh down the spirits of all PCs within Far range. All targets affected replace their Hope Die with a d8 until they roll a success with Hope or their next rest.'
			},
			{
				type: 'Reaction',
				name: 'Your Friends Will Fail You',
				max_uses: null,
				description_html:
					'When a PC fails with Fear, you can **Mark a Stress** to cause all other PCs within Close range to lose a Hope.'
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html: 'When the Demon makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	demon_of_hubris: {
		source_key: 'SRD',
		title: 'Demon of Hubris',
		tier: 3,
		type: 'Leader',
		image_url: '',
		artist_name: '',
		description:
			'A perfectly beautiful and infinitely cruel demon with a gleaming spear and elegant robes.',
		motives_tactics: 'Condescend, declare premature victory, prove superiority',
		difficulty: 18,
		thresholds: { major: 18, severe: 36 },
		max_hp: 7,
		max_stress: 5,
		attack_modifier: 4,
		standard_attack: {
			name: 'Perfect Spear',
			range: 'Very Close',
			damage_dice: '3d10',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: ['Manipulation'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Terrifying',
				max_uses: null,
				description_html:
					'When the Demon makes a successful attack, all PCs within Far range must lose a Hope and you gain a Fear.'
			},
			{
				type: 'Passive',
				name: 'Double or Nothing',
				max_uses: null,
				description_html:
					'When a PC within Far range fails a roll, they can choose to reroll their Fear Die and take the new result. If they still fail, they mark 2 Stress and the Demon clears a Stress.'
			},
			{
				type: 'Action',
				name: 'Unparalleled Skill',
				max_uses: null,
				description_html:
					"**Mark a Stress** to deal the Demon's standard attack damage to a target within Close range."
			},
			{
				type: 'Action',
				name: 'The Root of Villainy',
				max_uses: null,
				description_html: '**Spend a Fear** to spotlight two other Demons within Far range.'
			},
			{
				type: 'Reaction',
				name: 'You Pale in Comparison',
				max_uses: null,
				description_html:
					'When a PC fails a roll within Close range of the Demon, they must mark a Stress.'
			}
		]
	},
	demon_of_jealousy: {
		source_key: 'SRD',
		title: 'Demon of Jealousy',
		tier: 3,
		type: 'Ranged',
		image_url: '',
		artist_name: '',
		description: 'A fickle creature of spindly limbs and insatiable desires.',
		motives_tactics: "Join in on others' success, take what belongs to others, hold grudges",
		difficulty: 17,
		thresholds: { major: 17, severe: 30 },
		max_hp: 6,
		max_stress: 6,
		attack_modifier: 4,
		standard_attack: {
			name: 'Psychic Assault',
			range: 'Far',
			damage_dice: '3d8',
			damage_bonus: 3,
			damage_type: 'mag'
		},
		experiences: ['Manipulation'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Unprotected Mind',
				max_uses: null,
				description_html: "The Demon's standard attack deals direct damage."
			},
			{
				type: 'Reaction',
				name: 'My Turn',
				max_uses: null,
				description_html:
					'When the Demon marks HP from an attack, spend a number of Fear equal to the HP marked by the Demon to cause the attacker to mark the same number of HP.'
			},
			{
				type: 'Reaction',
				name: 'Rivalry',
				max_uses: null,
				description_html:
					'When a creature within Close range takes damage from a different adversary, you can **Mark a Stress** to add a d4 to the damage roll.'
			},
			{
				type: 'Reaction',
				name: "What's Yours Is Mine",
				max_uses: null,
				description_html:
					"When a PC takes Severe damage within Very Close range of the Demon, you can **Spend a Fear** to cause the target to make a Finesse Reaction Roll. On a failure, the Demon seizes one item or consumable of their choice from the target's inventory."
			}
		]
	},
	demon_of_wrath: {
		source_key: 'SRD',
		title: 'Demon of Wrath',
		tier: 3,
		type: 'Bruiser',
		image_url: '',
		artist_name: '',
		description: 'A hulking demon with boulder-sized fists, driven by endless rage.',
		motives_tactics: 'Fuel anger, impress rivals, wreak havoc',
		difficulty: 17,
		thresholds: { major: 22, severe: 40 },
		max_hp: 7,
		max_stress: 5,
		attack_modifier: 3,
		standard_attack: {
			name: 'Fists',
			range: 'Very Close',
			damage_dice: '3d8',
			damage_bonus: 1,
			damage_type: 'mag'
		},
		experiences: ['Intimidation'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Anger Unrelenting',
				max_uses: null,
				description_html: "The Demon's attacks deal direct damage."
			},
			{
				type: 'Action',
				name: 'Battle Lust',
				max_uses: null,
				description_html:
					'**Spend a Fear** to boil the blood of all PCs within Far range. They use a d20 as their Fear Die until the end of the scene.'
			},
			{
				type: 'Reaction',
				name: 'Retaliation',
				max_uses: null,
				description_html:
					'When the Demon takes damage from an attack within Close range, you can **Mark a Stress** to make a standard attack against the attacker.'
			},
			{
				type: 'Reaction',
				name: 'Blood and Souls',
				max_uses: null,
				description_html:
					'Countdown (Loop 6). Activate the first time an attack is made within sight of the Demon. It ticks down when a PC takes a violent action. When it triggers, summon **1d4** Minor Demons, who appear at Close range.'
			}
		]
	},
	dire_bat: {
		source_key: 'SRD',
		title: 'Dire Bat',
		tier: 3,
		type: 'Skulk',
		image_url: '',
		artist_name: '',
		description: 'A wide-winged pet endlessly loyal to their vampire owner.',
		motives_tactics: 'Dive-bomb, hide, protect leader',
		difficulty: 14,
		thresholds: { major: 16, severe: 30 },
		max_hp: 5,
		max_stress: 3,
		attack_modifier: 2,
		standard_attack: {
			name: 'Claws and Teeth',
			range: 'Melee',
			damage_dice: '2d6',
			damage_bonus: 7,
			damage_type: 'phy'
		},
		experiences: ['Bloodthirsty'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Flying',
				max_uses: null,
				description_html: 'While flying, the Bat gains a +3 bonus to their Difficulty.'
			},
			{
				type: 'Action',
				name: 'Screech',
				max_uses: null,
				description_html:
					'**Mark a Stress** to send a high-pitch screech out toward all targets in front of the Bat within Far range. Those targets must mark **1d4** Stress.'
			},
			{
				type: 'Reaction',
				name: 'Guardian',
				max_uses: null,
				description_html:
					'When an allied Vampire marks HP, you can **Mark a Stress** to fly into Melee range of the attacker and make an attack with advantage against them. On a success, deal **2d6+2** physical damage.'
			}
		]
	},
	dryad: {
		source_key: 'SRD',
		title: 'Dryad',
		tier: 3,
		type: 'Leader',
		image_url: '',
		artist_name: '',
		description: 'A nature spirit in the form of a humanoid tree.',
		motives_tactics: 'Command, cultivate, drive out, preserve the forest',
		difficulty: 16,
		thresholds: { major: 24, severe: 38 },
		max_hp: 8,
		max_stress: 5,
		attack_modifier: 4,
		standard_attack: {
			name: 'Deadfall Shortbow',
			range: 'Far',
			damage_dice: '3d10',
			damage_bonus: 1,
			damage_type: 'phy'
		},
		experiences: ['Forest Knowledge'],
		experience_modifiers: [4],
		features: [
			{
				type: 'Action',
				name: 'Bramble Patch',
				max_uses: null,
				description_html:
					'**Mark a Stress** to target a point within Far range. Create a patch of thorns that covers an area within Close range of that point. All targets within that area take **2d6+2** physical damage when they act. A target must succeed on a Finesse Roll or deal more than 20 damage to the Dryad with an attack to leave the area.'
			},
			{
				type: 'Action',
				name: 'Grow Saplings',
				max_uses: null,
				description_html:
					'**Spend a Fear** to grow three Treant Sapling Minions, who appear at Close range and immediately take the spotlight.'
			},
			{
				type: 'Reaction',
				name: 'We Are All One',
				max_uses: null,
				description_html:
					"When an ally dies within Close range, you can **Spend a Fear** to clear 2 HP and 2 Stress as the fallen ally's life force is returned to the forest."
			}
		]
	},
	elemental_spark: {
		source_key: 'SRD',
		title: 'Elemental Spark',
		tier: 3,
		type: 'Minion',
		image_url: '',
		artist_name: '',
		description: 'A blazing mote of elemental fire.',
		motives_tactics: 'Blast, consume, gain mass',
		difficulty: 15,
		thresholds: { major: 0, severe: 0 },
		max_hp: 1,
		max_stress: 1,
		attack_modifier: 0,
		standard_attack: {
			name: 'Bursts of Fire',
			range: 'Close',
			damage_dice: '5',
			damage_bonus: 0,
			damage_type: 'mag'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Minion',
				max_uses: 9,
				description_html:
					'The Elemental is defeated when they take any damage. For every 9 damage a PC deals to the Elemental, defeat an additional Minion within range the attack would succeed against.'
			},
			{
				type: 'Action',
				name: 'Group Attack',
				max_uses: null,
				description_html:
					'**Spend a Fear** to choose a target and spotlight all Elemental Sparks within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal **5** physical damage each. Combine this damage.'
			}
		]
	},
	greater_earth_elemental: {
		source_key: 'SRD',
		title: 'Greater Earth Elemental',
		tier: 3,
		type: 'Bruiser',
		image_url: '',
		artist_name: '',
		description: 'A living landslide of boulders and dust, as large as a house.',
		motives_tactics: 'Avalanche, knock over, pummel',
		difficulty: 17,
		thresholds: { major: 22, severe: 40 },
		max_hp: 10,
		max_stress: 4,
		attack_modifier: 7,
		standard_attack: {
			name: 'Boulder Fist',
			range: 'Very Close',
			damage_dice: '3d10',
			damage_bonus: 1,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Slow',
				max_uses: null,
				description_html:
					"When you spotlight the Elemental and they don't have a token on their stat block, they can't act yet. Place a token on their stat block and describe what they're preparing to do. When you spotlight the Elemental and they have a token on their stat block, clear the token and they can act."
			},
			{
				type: 'Passive',
				name: 'Crushing Blows',
				max_uses: null,
				description_html:
					"When the Elemental makes a successful attack, the target must mark an Armor Slot without receiving its benefits (they can still use armor to reduce the damage). If they can't mark an Armor Slot, they must mark an additional HP."
			},
			{
				type: 'Passive',
				name: 'Immovable Object',
				max_uses: null,
				description_html:
					'An attack that would move the Elemental moves them two fewer ranges (for example, Far becomes Very Close). When the Elemental takes physical damage, reduce it by 7.'
			},
			{
				type: 'Action',
				name: 'Rockslide',
				max_uses: null,
				description_html:
					'**Mark a Stress** to create a rockslide that buries the land in front of Elemental within Close range with rockfall. All targets in this area must make an Agility Reaction Roll (19). Targets who fail take **2d12+5** physical damage and become *Vulnerable* until their next roll with Hope. Targets who succeed take half damage.'
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html:
					'When the Elemental makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	greater_water_elemental: {
		source_key: 'SRD',
		title: 'Greater Water Elemental',
		tier: 3,
		type: 'Support',
		image_url: '',
		artist_name: '',
		description: 'A huge living wave that crashes down upon enemies.',
		motives_tactics: 'Deluge, disperse, drown',
		difficulty: 17,
		thresholds: { major: 17, severe: 34 },
		max_hp: 5,
		max_stress: 5,
		attack_modifier: 3,
		standard_attack: {
			name: 'Crashing Wave',
			range: 'Very Close',
			damage_dice: '3d4',
			damage_bonus: 1,
			damage_type: 'mag'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Action',
				name: 'Water Jet',
				max_uses: null,
				description_html:
					"**Mark a Stress** to attack a target within Very Close range. On a success, deal **2d4+7** physical damage and the target's next action has disadvantage. On a failure, the target must mark a Stress."
			},
			{
				type: 'Action',
				name: 'Drowning Embrace',
				max_uses: null,
				description_html:
					'**Spend a Fear** to make an attack against all targets within Very Close range. Targets the Elemental succeeds against become *Restrained* and *Vulnerable* as they begin drowning. A target can break free, ending both conditions, with a successful Strength or Instinct Roll.'
			},
			{
				type: 'Reaction',
				name: 'High Tide',
				max_uses: null,
				description_html:
					'When the Elemental makes a successful standard attack, you can **Mark a Stress** to knock the target back to Close range.'
			}
		]
	},
	huge_green_ooze: {
		source_key: 'SRD',
		title: 'Huge Green Ooze',
		tier: 3,
		type: 'Skulk',
		image_url: '',
		artist_name: '',
		description: 'A translucent green mound of acid taller than most humans.',
		motives_tactics: 'Camouflage, creep up, envelop, multiply',
		difficulty: 15,
		thresholds: { major: 15, severe: 30 },
		max_hp: 7,
		max_stress: 4,
		attack_modifier: 3,
		standard_attack: {
			name: 'Ooze Appendage',
			range: 'Melee',
			damage_dice: '3d8',
			damage_bonus: 1,
			damage_type: 'mag'
		},
		experiences: ['Blend In'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Slow',
				max_uses: null,
				description_html:
					"When you spotlight the Ooze and they don't have a token on their stat block, they can't act yet. Place a token on their stat block and describe what they're preparing to do. When you spotlight the Ooze and they have a token on their stat block, clear the token and they can act."
			},
			{
				type: 'Passive',
				name: 'Acidic Form',
				max_uses: null,
				description_html:
					"When the Ooze makes a successful attack, the target must mark an Armor Slot without receiving its benefits (they can still use armor to reduce the damage). If they can't mark an Armor Slot, they must mark an additional HP."
			},
			{
				type: 'Action',
				name: 'Envelop',
				max_uses: null,
				description_html:
					'Make an attack against a target within Melee range. On a success, the Ooze Envelops them and the target must mark 2 Stress. While *Enveloped*, the target must mark an additional Stress every time they make an action roll. When the Ooze takes Severe damage, all *Enveloped* targets are freed and the condition is cleared.'
			},
			{
				type: 'Reaction',
				name: 'Split',
				max_uses: null,
				description_html:
					'When the Ooze has 4 or more HP marked, you can **Spend a Fear** to split them into two Green Oozes (with no marked HP or Stress). Immediately spotlight both of them.'
			}
		]
	},
	hydra: {
		source_key: 'SRD',
		title: 'Hydra',
		tier: 3,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description:
			'A quadrupedal scaled beast with multiple long-necked heads, each filled with menacing fangs.',
		motives_tactics: 'Devour, regenerate, terrify',
		difficulty: 18,
		thresholds: { major: 19, severe: 35 },
		max_hp: 10,
		max_stress: 5,
		attack_modifier: 3,
		standard_attack: {
			name: 'Bite',
			range: 'Close',
			damage_dice: '2d12',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Many-Headed Menace',
				max_uses: null,
				description_html:
					'The Hydra begins with three heads and can have up to five. When the Hydra takes Major or greater damage, they lose a head.'
			},
			{
				type: 'Passive',
				name: 'Relentless (X)',
				max_uses: null,
				description_html:
					"The Hydra can be spotlighted X times per GM turn, where X is the Hydra's number of heads. Spend Fear as usual to spotlight them."
			},
			{
				type: 'Action',
				name: 'Regeneration',
				max_uses: null,
				description_html:
					'If the Hydra has any marked HP, **Spend a Fear** to clear a HP and grow two heads.'
			},
			{
				type: 'Action',
				name: 'Terrifying Chorus',
				max_uses: null,
				description_html: 'All PCs within Far range lose 2 Hope.'
			},
			{
				type: 'Reaction',
				name: 'Magical Weakness',
				max_uses: null,
				description_html:
					"When the Hydra takes magic damage, they become *Dazed* until the next roll with Fear. While *Dazed*, they can't use their Regeneration action but are immune to magic damage."
			}
		]
	},
	monarch: {
		source_key: 'SRD',
		title: 'Monarch',
		tier: 3,
		type: 'Social',
		image_url: '',
		artist_name: '',
		description:
			'The sovereign ruler of a nation, wreathed in the privilege of tradition and wielding unmatched power in their domain.',
		motives_tactics: 'Control vassals, destroy rivals, forge a legacy',
		difficulty: 16,
		thresholds: { major: 16, severe: 32 },
		max_hp: 6,
		max_stress: 5,
		attack_modifier: 0,
		standard_attack: {
			name: 'Warhammer',
			range: 'Melee',
			damage_dice: '3d6',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: ['History', 'Nobility'],
		experience_modifiers: [3, 3],
		features: [
			{
				type: 'Action',
				name: 'Execute Them!',
				max_uses: null,
				description_html:
					'**Spend a Fear** per PC in the party to have the group condemned for crimes real or imagined. A PC who succeeds on a Presence Roll can demand trial by combat or another special form of trial.'
			},
			{
				type: 'Action',
				name: 'Crownsguard',
				max_uses: null,
				description_html:
					"Once per scene, **Mark a Stress** to summon six Tier 3 Minions, who appear at Close range to enforce the Monarch's will."
			},
			{
				type: 'Reaction',
				name: 'Casus Belli',
				max_uses: null,
				description_html:
					"Long-Term Countdown (8). **Spend a Fear** to activate after the Monarch's desire for war is first revealed. When it triggers, the Monarch has a reason to rally the nation to war and the support to act on that reason. You gain **1d4** Fear."
			}
		]
	},
	stag_knight: {
		source_key: 'SRD',
		title: 'Stag Knight',
		tier: 3,
		type: 'Standard',
		image_url: '',
		artist_name: '',
		description: 'A knight with huge, majestic antlers wearing armor made of dangerous thorns.',
		motives_tactics: 'Isolate, maneuver, protect the forest, weed the unwelcome',
		difficulty: 17,
		thresholds: { major: 19, severe: 36 },
		max_hp: 7,
		max_stress: 5,
		attack_modifier: 3,
		standard_attack: {
			name: 'Bramble Sword',
			range: 'Melee',
			damage_dice: '3d8',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: ['Forest Knowledge'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'From Above',
				max_uses: null,
				description_html:
					'When the Knight succeeds on a standard attack from above a target, they deal **3d12+3** physical damage instead of their standard damage.'
			},
			{
				type: 'Action',
				name: 'Blade of the Forest',
				max_uses: null,
				description_html:
					"**Spend a Fear** to make an attack against all targets within Very Close range. Targets the Knight succeeds against take physical damage equal to **3d4** + the target's Major threshold."
			},
			{
				type: 'Reaction',
				name: 'Thorny Armor',
				max_uses: null,
				description_html:
					'When the Knight takes damage from an attack within Melee range, you can **Mark a Stress** to deal **1d10+5** physical damage to the attacker.'
			}
		]
	},
	oak_treant: {
		source_key: 'SRD',
		title: 'Oak Treant',
		tier: 3,
		type: 'Bruiser',
		image_url: '',
		artist_name: '',
		description: 'A sturdy animate old-growth tree.',
		motives_tactics: 'Hide in plain sight, preserve the forest, root down, swing branches',
		difficulty: 17,
		thresholds: { major: 22, severe: 40 },
		max_hp: 7,
		max_stress: 4,
		attack_modifier: 2,
		standard_attack: {
			name: 'Branch',
			range: 'Very Close',
			damage_dice: '3d8',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: ['Forest Knowledge'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Just a Tree',
				max_uses: null,
				description_html:
					'Before they make their first attack in a fight or after they become *Hidden*, the Treant is indistinguishable from other trees until they next act or a PC succeeds on an Instinct Roll to identify them.'
			},
			{
				type: 'Action',
				name: 'Seed Barrage',
				max_uses: null,
				description_html:
					'**Mark a Stress** and make an attack against up to three targets within Close range, pummeling them with giant acorns. Targets the Treant succeeds against take **2d10+5** physical damage.'
			},
			{
				type: 'Action',
				name: 'Take Root',
				max_uses: null,
				description_html:
					'**Mark a Stress** to Root the Treant in place. The Treant is *Restrained* while *Rooted*, and can end this effect instead of moving while they are spotlighted. While *Rooted*, the Treant has resistance to physical damage.'
			}
		]
	},
	treant_sapling: {
		source_key: 'SRD',
		title: 'Treant Sapling',
		tier: 3,
		type: 'Minion',
		image_url: '',
		artist_name: '',
		description: 'A small, sentient tree sapling.',
		motives_tactics: 'Blend in, preserve the forest, pummel, surround',
		difficulty: 14,
		thresholds: { major: 0, severe: 0 },
		max_hp: 1,
		max_stress: 1,
		attack_modifier: 0,
		standard_attack: {
			name: 'Branches',
			range: 'Melee',
			damage_dice: '8',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Minion',
				max_uses: 6,
				description_html:
					'The Sapling is defeated when they take any damage. For every 6 damage a PC deals to the Sapling, defeat an additional Minion within range the attack would succeed against.'
			},
			{
				type: 'Action',
				name: 'Group Attack',
				max_uses: null,
				description_html:
					'**Spend a Fear** to choose a target and spotlight all Treant Saplings within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal **8** physical damage each. Combine this damage.'
			}
		]
	},
	head_vampire: {
		source_key: 'SRD',
		title: 'Head Vampire',
		tier: 3,
		type: 'Leader',
		image_url: '',
		artist_name: '',
		description: 'A captivating undead dressed in aristocratic finery.',
		motives_tactics: 'Create thralls, charm, command, fly, intimidate',
		difficulty: 17,
		thresholds: { major: 22, severe: 42 },
		max_hp: 6,
		max_stress: 6,
		attack_modifier: 5,
		standard_attack: {
			name: 'Rapier',
			range: 'Melee',
			damage_dice: '2d20',
			damage_bonus: 4,
			damage_type: 'phy'
		},
		experiences: ['Aristocrat'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Terrifying',
				max_uses: null,
				description_html:
					'When the Vampire makes a successful attack, all PCs within Far range lose a Hope and you gain a Fear.'
			},
			{
				type: 'Passive',
				name: 'Look into My Eyes',
				max_uses: null,
				description_html:
					'A creature who moves into Melee range of the Vampire must make an Instinct Reaction Roll. On a failure, you gain **1d4** Fear.'
			},
			{
				type: 'Action',
				name: 'Feed on Followers',
				max_uses: null,
				description_html:
					'When the Vampire is within Melee range of an ally, they can cause the ally to mark a HP. The Vampire then clears a HP.'
			},
			{
				type: 'Action',
				name: 'The Hunt Is On',
				max_uses: null,
				description_html:
					'**Spend 2 Fear** to summon **1d4** Vampires, who appear at Far range and immediately take the spotlight.'
			},
			{
				type: 'Reaction',
				name: 'Lifesuck',
				max_uses: null,
				description_html:
					'When the Vampire is spotlighted, roll a d8. On a result of 6 or higher, all targets within Very Close range must mark a HP.'
			}
		]
	},
	vampire: {
		source_key: 'SRD',
		title: 'Vampire',
		tier: 3,
		type: 'Standard',
		image_url: '',
		artist_name: '',
		description: "An intelligent undead with blood-stained lips and a predator's smile.",
		motives_tactics: 'Bite, charm, deceive, feed, intimidate',
		difficulty: 16,
		thresholds: { major: 18, severe: 35 },
		max_hp: 5,
		max_stress: 4,
		attack_modifier: 3,
		standard_attack: {
			name: 'Rapier',
			range: 'Melee',
			damage_dice: '3d8',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: ['Nocturnal Hunter'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Action',
				name: 'Draining Bite',
				max_uses: null,
				description_html:
					'Make an attack against a target within Melee range. On a success, deal **5d4** physical damage. A target who marks HP from this attack loses a Hope and must mark a Stress. The Vampire then clears a HP.'
			},
			{
				type: 'Reaction',
				name: 'Mistform',
				max_uses: null,
				description_html:
					'When the Vampire takes physical damage, you can **Spend a Fear** to take half damage.'
			}
		]
	},
	vault_guardian_gaoler: {
		source_key: 'SRD',
		title: 'Vault Guardian Gaoler',
		tier: 3,
		type: 'Support',
		image_url: '',
		artist_name: '',
		description:
			'A boxy, dust-covered construct with thick metallic swinging doors on their torso.',
		motives_tactics: 'Carry away, entrap, protect, pummel',
		difficulty: 16,
		thresholds: { major: 19, severe: 33 },
		max_hp: 5,
		max_stress: 3,
		attack_modifier: 2,
		standard_attack: {
			name: 'Body Bash',
			range: 'Very Close',
			damage_dice: '3d6',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Blocking Shield',
				max_uses: null,
				description_html:
					'Creatures within Melee range of the Gaoler have disadvantage on attack rolls against them. Creatures trapped inside the Gaoler are immune to this feature.'
			},
			{
				type: 'Action',
				name: 'Lock Up',
				max_uses: null,
				description_html:
					'**Mark a Stress** to make an attack against a target within Very Close range. On a success, the target is *Restrained* within the Gaoler until freed with a successful Strength Roll (18). While *Restrained*, the target can only attack the Gaoler.'
			}
		]
	},
	vault_guardian_sentinel: {
		source_key: 'SRD',
		title: 'Vault Guardian Sentinel',
		tier: 3,
		type: 'Bruiser',
		image_url: '',
		artist_name: '',
		description: 'A dust-covered golden construct with boxy limbs and a huge mace for a hand.',
		motives_tactics: 'Destroy at any cost, expunge, protect',
		difficulty: 17,
		thresholds: { major: 21, severe: 40 },
		max_hp: 6,
		max_stress: 3,
		attack_modifier: 3,
		standard_attack: {
			name: 'Charged Mace',
			range: 'Very Close',
			damage_dice: '2d12',
			damage_bonus: 1,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Kinetic Slam',
				max_uses: null,
				description_html:
					"Targets who take damage from the Sentinel's standard attack are knocked back to Very Close range."
			},
			{
				type: 'Action',
				name: 'Box In',
				max_uses: null,
				description_html:
					"**Mark a Stress** to choose a target within Very Close range to focus on. That target has disadvantage on attack rolls when they're within Very Close range of the Sentinel. The Sentinel can only focus on one target at a time."
			},
			{
				type: 'Action',
				name: 'Mana Bolt',
				max_uses: null,
				description_html:
					"**Spend a Fear** to lob explosive magic at a point within Far range. All targets within Very Close range of that point must make an Agility Reaction Roll. Targets who fail take **2d8+20** magic damage and are knocked back to Close range. Targets who succeed take half damage and aren't knocked back."
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html:
					'When the Sentinel makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	vault_guardian_turret: {
		source_key: 'SRD',
		title: 'Vault Guardian Turret',
		tier: 3,
		type: 'Ranged',
		image_url: '',
		artist_name: '',
		description:
			'A massive living turret with reinforced armor and twelve piston-driven mechanical legs.',
		motives_tactics: 'Concentrate fire, lock down, mark, protect',
		difficulty: 16,
		thresholds: { major: 20, severe: 32 },
		max_hp: 5,
		max_stress: 4,
		attack_modifier: 3,
		standard_attack: {
			name: 'Magitech Cannon',
			range: 'Far',
			damage_dice: '3d10',
			damage_bonus: 3,
			damage_type: 'mag'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Slow Firing',
				max_uses: null,
				description_html:
					"When you spotlight the Turret and they don't have a token on their stat block, they can't make a standard attack. Place a token on their stat block and describe what they're preparing to do. When you spotlight the Turret and they have a token on their stat block, clear the token and they can attack."
			},
			{
				type: 'Action',
				name: 'Mark Target',
				max_uses: null,
				description_html:
					'**Spend a Fear** to Mark a target within Far range until the Turret is destroyed or the *Marked* target becomes *Hidden*. While the target is *Marked*, their Evasion is halved.'
			},
			{
				type: 'Reaction',
				name: 'Concentrate Fire',
				max_uses: null,
				description_html:
					"When another adversary deals damage to a target within Far range of the Turret, you can **Mark a Stress** to add the Turret's standard attack damage to the damage roll."
			},
			{
				type: 'Reaction',
				name: 'Detonation',
				max_uses: null,
				description_html:
					'When the Turret is destroyed, they explode. All targets within Close range must make an Agility Reaction Roll. Targets who fail take **3d20** physical damage. Targets who succeed take half damage.'
			}
		]
	},
	young_ice_dragon: {
		source_key: 'SRD',
		title: 'Young Ice Dragon',
		tier: 3,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description: 'A glacier-blue dragon with four powerful limbs and frost-tinged wings.',
		motives_tactics: 'Avalanche, defend lair, fly, freeze, defend what is mine, maul',
		difficulty: 18,
		thresholds: { major: 21, severe: 41 },
		max_hp: 10,
		max_stress: 6,
		attack_modifier: 7,
		standard_attack: {
			name: 'Bite and Claws',
			range: 'Close',
			damage_dice: '4d10',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: ['Protect What Is Mine'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Relentless',
				max_uses: 3,
				description_html:
					'The Dragon can be spotlighted up to three times per GM turn. Spend Fear as usual to spotlight them.'
			},
			{
				type: 'Passive',
				name: 'Rend and Crush',
				max_uses: null,
				description_html:
					"If a target damaged by the Dragon doesn't mark an Armor Slot to reduce the damage, they must mark a Stress."
			},
			{
				type: 'Passive',
				name: 'No Hope',
				max_uses: null,
				description_html:
					'When a PC rolls with Fear while within Far range of the Dragon, they lose a Hope.'
			},
			{
				type: 'Action',
				name: 'Blizzard Breath',
				max_uses: null,
				description_html:
					'**Spend 2 Fear** to release an icy whorl in front of the Dragon within Close range. All targets in this area must make an Agility Reaction Roll. Targets who fail take **4d6+5** magic damage and are *Restrained* by ice until they break free with a successful Strength Roll. Targets who succeed must mark 2 Stress or take half damage.'
			},
			{
				type: 'Action',
				name: 'Avalanche',
				max_uses: null,
				description_html:
					'**Spend a Fear** to have the Dragon unleash a huge downfall of snow and ice, covering all other creatures within Far range. All targets within this area must succeed on an Instinct Reaction Roll or be buried in snow and rocks, becoming *Vulnerable* until they dig themselves out from the debris. For each PC that fails the reaction roll, you gain a Fear.'
			},
			{
				type: 'Reaction',
				name: 'Frozen Scales',
				max_uses: null,
				description_html:
					'When a creature makes a successful attack against the Dragon from within Very Close range, they must mark a Stress and become *Chilled* until their next rest or they clear a Stress. While they are *Chilled*, they have disadvantage on attack rolls.'
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html: 'When the Dragon makes a successful attack against a PC, you gain a Fear.'
			}
		]
	}
} as const satisfies Record<string, Adversary>;
