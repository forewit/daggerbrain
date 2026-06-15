import type { Adversary } from '../../../../convex/schemas/compendium';

// todo: verify everything below
export const TIER_1_ADVERSARIES = {
	acid_burrower: {
		source_key: 'SRD',
		title: 'Acid Burrower',
		tier: 1,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description: 'A horse-sized insect with digging claws and acidic blood.',
		motives_tactics: 'Burrow, drag away, feed, reposition',
		difficulty: 14,
		thresholds: { major: 8, severe: 15 },
		max_hp: 8,
		max_stress: 3,
		attack_modifier: 3,
		standard_attack: {
			name: 'Claws',
			range: 'Very Close',
			damage_dice: '1d12',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: ['Tremor Sense'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Relentless',
				max_uses: 3,
				description_html:
					'The Burrower can be spotlighted up to three times per GM turn. Spend Fear as usual to spotlight them.'
			},
			{
				type: 'Action',
				name: 'Earth Eruption',
				max_uses: null,
				description_html:
					'**Mark a Stress** to have the Burrower burst out of the ground. All creatures within Very Close range must succeed on an Agility Reaction Roll or be knocked over, making them *Vulnerable* until they next act.'
			},
			{
				type: 'Action',
				name: 'Spit Acid',
				max_uses: null,
				description_html:
					"Make an attack against all targets in front of the Burrower within Close range. Targets the Burrower succeeds against take **2d6** physical damage and must mark an Armor Slot without receiving its benefits (they can still use armor to reduce the damage). If they can't mark an Armor Slot, they must mark an additional HP and you gain a Fear."
			},
			{
				type: 'Reaction',
				name: 'Acid Bath',
				max_uses: null,
				description_html:
					'When the Burrower takes Severe damage, all creatures within Close range are bathed in their acidic blood, taking **1d10** physical damage. This splash covers the ground within Very Close range with blood, and all creatures other than the Burrower who move through it take **1d6** physical damage.'
			}
		]
	},
	cave_ogre: {
		source_key: 'SRD',
		title: 'Cave Ogre',
		tier: 1,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description: 'A massive humanoid who sees all sapient life as food.',
		motives_tactics: 'Bite off heads, feast, rip limbs, stomp, throw enemies',
		difficulty: 13,
		thresholds: { major: 8, severe: 15 },
		max_hp: 8,
		max_stress: 3,
		attack_modifier: 1,
		standard_attack: {
			name: 'Club',
			range: 'Very Close',
			damage_dice: '1d10',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: ['Throw'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Ramp Up',
				max_uses: null,
				description_html:
					'You must **spend a Fear** to spotlight the Ogre. While spotlighted, they can make their standard attack against all targets within range.'
			},
			{
				type: 'Passive',
				name: 'Bone Breaker',
				max_uses: null,
				description_html: "The Ogre's attacks deal direct damage."
			},
			{
				type: 'Action',
				name: 'Hail of Boulders',
				max_uses: null,
				description_html:
					'**Mark a Stress** to pick up heavy objects and throw them at all targets in front of the Ogre within Far range. Make an attack against these targets. Targets the Ogre succeeds against take **1d10+2** physical damage. If they succeed against more than one target, you gain a Fear.'
			},
			{
				type: 'Reaction',
				name: 'Rampaging Fury',
				max_uses: null,
				description_html:
					'When the Ogre marks 2 or more HP, they can rampage. Move the Ogre to a point within Close range and deal **2d6+3** direct physical damage to all targets in their path.'
			}
		]
	},
	bear: {
		source_key: 'SRD',
		title: 'Bear',
		tier: 1,
		type: 'Bruiser',
		image_url: '',
		artist_name: '',
		description: 'A large bear with thick fur and powerful claws.',
		motives_tactics: 'Climb, defend territory, pummel, track',
		difficulty: 14,
		thresholds: { major: 9, severe: 17 },
		max_hp: 7,
		max_stress: 2,
		attack_modifier: 1,
		standard_attack: {
			name: 'Claws',
			range: 'Melee',
			damage_dice: '1d8',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: ['Ambusher', 'Keen Senses'],
		experience_modifiers: [3, 2],
		features: [
			{
				type: 'Passive',
				name: 'Overwhelming Force',
				max_uses: null,
				description_html:
					"Targets who mark HP from the Bear's standard attack are knocked back to Very Close range."
			},
			{
				type: 'Action',
				name: 'Bite',
				max_uses: null,
				description_html:
					'**Mark a Stress** to make an attack against a target within Melee range. On a success, deal **3d4+10** physical damage and the target is *Restrained* until they break free with a successful Strength Roll.'
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html: 'When the Bear makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	construct: {
		source_key: 'SRD',
		title: 'Construct',
		tier: 1,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description: 'A roughly humanoid being of stone and steel, assembled and animated by magic.',
		motives_tactics: 'Destroy environment, serve creator, smash target, trample groups',
		difficulty: 13,
		thresholds: { major: 7, severe: 15 },
		max_hp: 9,
		max_stress: 4,
		attack_modifier: 4,
		standard_attack: {
			name: 'Fist Slam',
			range: 'Melee',
			damage_dice: '1d20',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Relentless',
				max_uses: 2,
				description_html:
					'The Construct can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.'
			},
			{
				type: 'Passive',
				name: 'Weak Structure',
				max_uses: null,
				description_html:
					'When the Construct marks HP from physical damage, they must mark an additional HP.'
			},
			{
				type: 'Action',
				name: 'Trample',
				max_uses: null,
				description_html:
					"**Mark a Stress** to make an attack against all targets in the Construct's path when they move. Targets the Construct succeeds against take **1d8** physical damage."
			},
			{
				type: 'Reaction',
				name: 'Overload',
				max_uses: null,
				description_html:
					"Before rolling damage for the Construct's attack, you can **mark a Stress** to gain a +10 bonus to the damage roll. The Construct can then take the spotlight again."
			},
			{
				type: 'Reaction',
				name: 'Death Quake',
				max_uses: null,
				description_html:
					'When the Construct marks their last HP, the magic powering them ruptures in an explosion of force. Make an attack with advantage against all targets within Very Close range. Targets the Construct succeeds against take **1d12+2** magic damage.'
			}
		]
	},
	courtier: {
		source_key: 'SRD',
		title: 'Courtier',
		tier: 1,
		type: 'Social',
		image_url: '',
		artist_name: '',
		description: 'An ambitious and ostentatiously dressed socialite.',
		motives_tactics: 'Discredit, gain favor, maneuver, scheme',
		difficulty: 12,
		thresholds: { major: 4, severe: 8 },
		max_hp: 3,
		max_stress: 4,
		attack_modifier: -4,
		standard_attack: {
			name: 'Daggers',
			range: 'Melee',
			damage_dice: '1d4',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: ['Socialite'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Action',
				name: 'Mockery',
				max_uses: null,
				description_html:
					'**Mark a Stress** to say something mocking and force a target within Close range to make a Presence Reaction Roll (14) to see if they can save face. On a failure, the target must mark 2 Stress and is *Vulnerable* until the scene ends.'
			},
			{
				type: 'Action',
				name: 'Scapegoat',
				max_uses: null,
				description_html:
					'**Spend a Fear** and target a PC. The Courtier convinces a crowd or prominent individual that the target is the cause of their current conflict or misfortune.'
			}
		]
	},
	deeproot_defender: {
		source_key: 'SRD',
		title: 'Deeproot Defender',
		tier: 1,
		type: 'Bruiser',
		image_url: '',
		artist_name: '',
		description: 'A burly vegetable-person with grasping vines.',
		motives_tactics: 'Ambush, grab, protect, pummel',
		difficulty: 10,
		thresholds: { major: 8, severe: 14 },
		max_hp: 7,
		max_stress: 3,
		attack_modifier: 2,
		standard_attack: {
			name: 'Vines',
			range: 'Close',
			damage_dice: '1d8',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: ['Huge'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Action',
				name: 'Ground Slam',
				max_uses: null,
				description_html:
					'Slam the ground, knocking all targets within Very Close range back to Far range. Each target knocked back this way must mark a Stress.'
			},
			{
				type: 'Action',
				name: 'Grab and Drag',
				max_uses: null,
				description_html:
					'Make an attack against a target within Close range. On a success, **Spend a Fear** to pull them into Melee range, deal **1d6+2** physical damage, and *Restrain* them until the Defender takes Severe damage.'
			}
		]
	},
	dire_wolf: {
		source_key: 'SRD',
		title: 'Dire Wolf',
		tier: 1,
		type: 'Skulk',
		image_url: '',
		artist_name: '',
		description: 'A large wolf with menacing teeth, seldom encountered alone.',
		motives_tactics: 'Defend territory, harry, protect pack, surround, trail',
		difficulty: 12,
		thresholds: { major: 5, severe: 9 },
		max_hp: 4,
		max_stress: 3,
		attack_modifier: 2,
		standard_attack: {
			name: 'Claws',
			range: 'Melee',
			damage_dice: '1d6',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: ['Keen Senses'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Pack Tactics',
				max_uses: null,
				description_html:
					'If the Wolf makes a successful standard attack and another Dire Wolf is within Melee range of the target, deal **1d6+5** physical damage instead of their standard damage and you gain a Fear.'
			},
			{
				type: 'Action',
				name: 'Hobbling Strike',
				max_uses: null,
				description_html:
					'**Mark a Stress** to make an attack against a target within Melee range. On a success, deal **3d4+10** direct physical damage and make them *Vulnerable* until they clear at least 1 HP.'
			}
		]
	},
	giant_mosquitoes: {
		source_key: 'SRD',
		title: 'Giant Mosquitoes',
		tier: 1,
		type: 'Horde',
		image_url: '',
		artist_name: '',
		description: 'Dozens of fist-sized mosquitoes, flying together for protection.',
		motives_tactics: 'Fly away, harass, steal blood',
		difficulty: 10,
		thresholds: { major: 5, severe: 9 },
		max_hp: 6,
		max_stress: 3,
		attack_modifier: -2,
		standard_attack: {
			name: 'Proboscis',
			range: 'Melee',
			damage_dice: '1d8',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: ['Camouflage'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Horde (1d4+1)',
				max_uses: null,
				description_html:
					'When the Mosquitoes have marked half or more of their HP, their standard attack deals **1d4+1** physical damage instead.'
			},
			{
				type: 'Passive',
				name: 'Flying',
				max_uses: null,
				description_html: 'While flying, the Mosquitoes have a +2 bonus to their Difficulty.'
			},
			{
				type: 'Reaction',
				name: 'Bloodsucker',
				max_uses: null,
				description_html:
					"When the Mosquitoes' attack causes a target to mark HP, you can **Mark a Stress** to force the target to mark an additional HP."
			}
		]
	},
	giant_rat: {
		source_key: 'SRD',
		title: 'Giant Rat',
		tier: 1,
		type: 'Minion',
		image_url: '',
		artist_name: '',
		description: 'A cat-sized rodent skilled at scavenging and survival.',
		motives_tactics: 'Burrow, hunger, scavenge, wear down',
		difficulty: 10,
		thresholds: { major: 0, severe: 0 },
		max_hp: 1,
		max_stress: 1,
		attack_modifier: -4,
		standard_attack: {
			name: 'Claws',
			range: 'Melee',
			damage_dice: '1',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: ['Keen Senses'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Minion',
				max_uses: 3,
				description_html:
					'The Rat is defeated when they take any damage. For every 3 damage a PC deals to the Rat, defeat an additional Minion within range the attack would succeed against.'
			},
			{
				type: 'Action',
				name: 'Group Attack',
				max_uses: null,
				description_html:
					'**Spend a Fear** to choose a target and spotlight all Giant Rats within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal **1** physical damage each. Combine this damage.'
			}
		]
	},
	giant_scorpion: {
		source_key: 'SRD',
		title: 'Giant Scorpion',
		tier: 1,
		type: 'Bruiser',
		image_url: '',
		artist_name: '',
		description: 'A human-sized arachnid with tearing claws and a stinging tail.',
		motives_tactics: 'Ambush, feed, grapple, poison',
		difficulty: 13,
		thresholds: { major: 7, severe: 13 },
		max_hp: 6,
		max_stress: 3,
		attack_modifier: 1,
		standard_attack: {
			name: 'Pincers',
			range: 'Melee',
			damage_dice: '1d12',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: ['Camouflage'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Action',
				name: 'Double Strike',
				max_uses: null,
				description_html:
					'**Mark a Stress** to make a standard attack against two targets within Melee range.'
			},
			{
				type: 'Action',
				name: 'Venomous Stinger',
				max_uses: null,
				description_html:
					'Make an attack against a target within Very Close range. On a success, **Spend a Fear** to deal **1d4+4** physical damage and the target is *Poisoned* until their next rest or they succeed on a Knowledge Roll (16). While *Poisoned*, the target must roll a d6 before they make an action roll. On a result of 4 or lower, they must mark a Stress.'
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html:
					'When the Scorpion makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	glass_snake: {
		source_key: 'SRD',
		title: 'Glass Snake',
		tier: 1,
		type: 'Standard',
		image_url: '',
		artist_name: '',
		description:
			'A clear serpent with a massive head that leaves behind a glass shard trail wherever they go.',
		motives_tactics: 'Climb, feed, keep distance, scare',
		difficulty: 14,
		thresholds: { major: 6, severe: 10 },
		max_hp: 5,
		max_stress: 3,
		attack_modifier: 2,
		standard_attack: {
			name: 'Glass Fangs',
			range: 'Very Close',
			damage_dice: '1d8',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Armor-Shredding Shards',
				max_uses: null,
				description_html:
					"After a successful attack against the Snake within Melee range, the attacker must mark an Armor Slot. If they can't mark an Armor Slot, they must mark an HP."
			},
			{
				type: 'Action',
				name: 'Spinning Serpent',
				max_uses: null,
				description_html:
					'**Mark a Stress** to make an attack against all targets within Very Close range. Targets the Snake succeeds against take **1d6+1** physical damage.'
			},
			{
				type: 'Action',
				name: 'Spitter',
				max_uses: null,
				description_html:
					'**Spend a Fear** to introduce a **d6** Spitter Die. When the Snake is in the spotlight, roll this die. On a result of 5 or higher, all targets in front of the Snake within Far range must succeed on an Agility Reaction Roll or take **1d4** physical damage. The Snake can take the spotlight a second time this GM turn.'
			}
		]
	},
	harrier: {
		source_key: 'SRD',
		title: 'Harrier',
		tier: 1,
		type: 'Standard',
		image_url: '',
		artist_name: '',
		description: 'A nimble fighter armed with javelins.',
		motives_tactics: 'Flank, harry, kite, profit',
		difficulty: 12,
		thresholds: { major: 5, severe: 9 },
		max_hp: 3,
		max_stress: 3,
		attack_modifier: 1,
		standard_attack: {
			name: 'Javelin',
			range: 'Close',
			damage_dice: '1d6',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: ['Camouflage'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Maintain Distance',
				max_uses: null,
				description_html:
					'After making a standard attack, the Harrier can move anywhere within Far range.'
			},
			{
				type: 'Reaction',
				name: 'Fall Back',
				max_uses: null,
				description_html:
					'When a creature moves into Melee range to make an attack, you can **Mark a Stress** before the attack roll to move anywhere within Close range and make an attack against that creature. On a success, deal **1d10+2** physical damage.'
			}
		]
	},
	archer_guard: {
		source_key: 'SRD',
		title: 'Archer Guard',
		tier: 1,
		type: 'Ranged',
		image_url: '',
		artist_name: '',
		description:
			"A tall guard bearing a longbow and quiver with arrows fletched in the settlement's colors.",
		motives_tactics: 'Arrest, close gates, make it through the day, pin down',
		difficulty: 10,
		thresholds: { major: 4, severe: 8 },
		max_hp: 3,
		max_stress: 2,
		attack_modifier: 1,
		standard_attack: {
			name: 'Longbow',
			range: 'Far',
			damage_dice: '1d8',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: ['Local Knowledge'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Action',
				name: 'Hobbling Shot',
				max_uses: null,
				description_html:
					'Make an attack against a target within Far range. On a success, **Mark a Stress** to deal **1d12+3** physical damage. If the target marks HP from this attack, they have disadvantage on Agility Rolls until they clear at least 1 HP.'
			}
		]
	},
	bladed_guard: {
		source_key: 'SRD',
		title: 'Bladed Guard',
		tier: 1,
		type: 'Standard',
		image_url: '',
		artist_name: '',
		description: "An armored guard bearing a sword and shield painted in the settlement's colors.",
		motives_tactics: 'Arrest, close gates, make it through the day, pin down',
		difficulty: 12,
		thresholds: { major: 5, severe: 9 },
		max_hp: 5,
		max_stress: 2,
		attack_modifier: 1,
		standard_attack: {
			name: 'Longsword',
			range: 'Melee',
			damage_dice: '1d6',
			damage_bonus: 1,
			damage_type: 'phy'
		},
		experiences: ['Local Knowledge'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Shield Wall',
				max_uses: null,
				description_html:
					'A creature who tries to move within Very Close range of the Guard must succeed on an Agility Roll. If additional Bladed Guards are standing in a line alongside the first, and each is within Melee range of another guard in the line, the Difficulty increases by the total number of guards in that line.'
			},
			{
				type: 'Action',
				name: 'Detain',
				max_uses: null,
				description_html:
					'Make an attack against a target within Very Close range. On a success, **Mark a Stress** to *Restrain* until they break free with a successful attack, Finesse Roll, or Strength Roll.'
			}
		]
	},
	head_guard: {
		source_key: 'SRD',
		title: 'Head Guard',
		tier: 1,
		type: 'Leader',
		image_url: '',
		artist_name: '',
		description: 'A seasoned guard with a mace, a whistle, and a bellowing voice.',
		motives_tactics: 'Arrest, close gates, pin down, seek glory',
		difficulty: 15,
		thresholds: { major: 7, severe: 13 },
		max_hp: 7,
		max_stress: 3,
		attack_modifier: 4,
		standard_attack: {
			name: 'Mace',
			range: 'Melee',
			damage_dice: '1d10',
			damage_bonus: 4,
			damage_type: 'phy'
		},
		experiences: ['Commander', 'Local Knowledge'],
		experience_modifiers: [2, 2],
		features: [
			{
				type: 'Action',
				name: 'Rally Guards',
				max_uses: null,
				description_html:
					'**Spend 2 Fear** to spotlight the Head Guard and up to **2d4** allies within Far range.'
			},
			{
				type: 'Reaction',
				name: 'On My Signal',
				max_uses: null,
				description_html:
					'Countdown (5). When the Head Guard is in the spotlight for the first time, activate the countdown. It ticks down when a PC makes an attack roll. When it triggers, all Archer Guards within Far range make a standard attack with advantage against the nearest target within their range. If any attacks succeed on the same target, combine their damage.'
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html:
					'When the Head Guard makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	jagged_knife_bandit: {
		source_key: 'SRD',
		title: 'Jagged Knife Bandit',
		tier: 1,
		type: 'Standard',
		image_url: '',
		artist_name: '',
		description: "A cunning criminal in a cloak bearing one of the gang's iconic knives.",
		motives_tactics: 'Escape, profit, steal, throw smoke',
		difficulty: 12,
		thresholds: { major: 8, severe: 14 },
		max_hp: 5,
		max_stress: 3,
		attack_modifier: 1,
		standard_attack: {
			name: 'Daggers',
			range: 'Melee',
			damage_dice: '1d8',
			damage_bonus: 1,
			damage_type: 'phy'
		},
		experiences: ['Thief'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Climber',
				max_uses: null,
				description_html: 'The Bandit climbs just as easily as they run.'
			},
			{
				type: 'Passive',
				name: 'From Above',
				max_uses: null,
				description_html:
					'When the Bandit succeeds on a standard attack from above a target, they deal **1d10+1** physical damage instead of their standard damage.'
			}
		]
	},
	jagged_knife_hexer: {
		source_key: 'SRD',
		title: 'Jagged Knife Hexer',
		tier: 1,
		type: 'Support',
		image_url: '',
		artist_name: '',
		description:
			'A staff-wielding bandit in a cloak adorned with magical paraphernalia, using curses to vex their foes.',
		motives_tactics: 'Command, hex, profit',
		difficulty: 13,
		thresholds: { major: 5, severe: 9 },
		max_hp: 4,
		max_stress: 4,
		attack_modifier: 2,
		standard_attack: {
			name: 'Staff',
			range: 'Far',
			damage_dice: '1d6',
			damage_bonus: 2,
			damage_type: 'mag'
		},
		experiences: ['Magical Knowledge'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Action',
				name: 'Curse',
				max_uses: null,
				description_html:
					'Choose a target within Far range and temporarily *Curse* them. While the target is *Cursed*, you can **Mark a Stress** when that target rolls with Hope to make the roll be with Fear instead.'
			},
			{
				type: 'Action',
				name: 'Chaotic Flux',
				max_uses: null,
				description_html:
					'Make an attack against up to three targets within Very Close range. **Mark a Stress** to deal **2d6+3** magic damage to targets the Hexer succeeded against.'
			}
		]
	},
	jagged_knife_kneebreaker: {
		source_key: 'SRD',
		title: 'Jagged Knife Kneebreaker',
		tier: 1,
		type: 'Bruiser',
		image_url: '',
		artist_name: '',
		description: 'An imposing brawler carrying a large club.',
		motives_tactics: 'Grapple, intimidate, profit, steal',
		difficulty: 12,
		thresholds: { major: 7, severe: 14 },
		max_hp: 7,
		max_stress: 4,
		attack_modifier: -3,
		standard_attack: {
			name: 'Club',
			range: 'Melee',
			damage_dice: '1d4',
			damage_bonus: 6,
			damage_type: 'phy'
		},
		experiences: ['Thief', 'Unveiled Threats'],
		experience_modifiers: [2, 3],
		features: [
			{
				type: 'Passive',
				name: "I've Got 'Em",
				max_uses: null,
				description_html:
					'Creatures *Restrained* by the Kneebreaker take double damage from attacks by other adversaries.'
			},
			{
				type: 'Action',
				name: 'Hold Them Down',
				max_uses: null,
				description_html:
					'Make an attack against a target within Melee range. On a success, the target takes no damage but is *Restrained* and *Vulnerable*. The target can break free, clearing both conditions, with a successful Strength Roll or is freed automatically if the Kneebreaker takes Major or greater damage.'
			}
		]
	},
	jagged_knife_lackey: {
		source_key: 'SRD',
		title: 'Jagged Knife Lackey',
		tier: 1,
		type: 'Minion',
		image_url: '',
		artist_name: '',
		description: 'A thief with simple clothes and small daggers, eager to prove themselves.',
		motives_tactics: 'Escape, profit, throw smoke',
		difficulty: 9,
		thresholds: { major: 0, severe: 0 },
		max_hp: 1,
		max_stress: 1,
		attack_modifier: -2,
		standard_attack: {
			name: 'Daggers',
			range: 'Melee',
			damage_dice: '2',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: ['Thief'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Minion',
				max_uses: 3,
				description_html:
					'The Lackey is defeated when they take any damage. For every 3 damage a PC deals to the Lackey, defeat an additional Minion within range the attack would succeed against.'
			},
			{
				type: 'Action',
				name: 'Group Attack',
				max_uses: null,
				description_html:
					'**Spend a Fear** to choose a target and spotlight all Jagged Knife Lackeys within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal **2** physical damage each. Combine this damage.'
			}
		]
	},
	jagged_knife_lieutenant: {
		source_key: 'SRD',
		title: 'Jagged Knife Lieutenant',
		tier: 1,
		type: 'Leader',
		image_url: '',
		artist_name: '',
		description: 'A seasoned bandit in quality leathers with a strong voice and cunning eyes.',
		motives_tactics: 'Bully, command, profit, reinforce',
		difficulty: 13,
		thresholds: { major: 7, severe: 14 },
		max_hp: 6,
		max_stress: 3,
		attack_modifier: 2,
		standard_attack: {
			name: 'Javelin',
			range: 'Close',
			damage_dice: '1d8',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: ['Local Knowledge'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Action',
				name: 'Tactician',
				max_uses: null,
				description_html:
					'When you spotlight the Lieutenant, **Mark a Stress** to also spotlight two allies within Close range.'
			},
			{
				type: 'Action',
				name: 'More Where That Came From',
				max_uses: null,
				description_html: 'Summon three Jagged Knife Lackeys, who appear at Far range.'
			},
			{
				type: 'Action',
				name: 'Coup de Grace',
				max_uses: null,
				description_html:
					'**Spend a Fear** to make an attack against a *Vulnerable* target within Close range. On a success, deal **2d6+12** physical damage and the target must mark a Stress.'
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html:
					'When the Lieutenant makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	jagged_knife_shadow: {
		source_key: 'SRD',
		title: 'Jagged Knife Shadow',
		tier: 1,
		type: 'Skulk',
		image_url: '',
		artist_name: '',
		description:
			'A nimble scoundrel bearing a wicked knife and utilizing shadow magic to isolate targets.',
		motives_tactics: 'Ambush, conceal, divide, profit',
		difficulty: 12,
		thresholds: { major: 4, severe: 8 },
		max_hp: 3,
		max_stress: 3,
		attack_modifier: 1,
		standard_attack: {
			name: 'Daggers',
			range: 'Melee',
			damage_dice: '1d4',
			damage_bonus: 4,
			damage_type: 'phy'
		},
		experiences: ['Intrusion'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Backstab',
				max_uses: null,
				description_html:
					'When the Shadow succeeds on a standard attack that has advantage, they deal **1d6+6** physical damage instead of their standard damage.'
			},
			{
				type: 'Action',
				name: 'Cloaked',
				max_uses: null,
				description_html:
					"Become *Hidden* until after the Shadow's next attack. Attacks made while *Hidden* from this feature have advantage."
			}
		]
	},
	jagged_knife_sniper: {
		source_key: 'SRD',
		title: 'Jagged Knife Sniper',
		tier: 1,
		type: 'Ranged',
		image_url: '',
		artist_name: '',
		description: 'A lanky bandit striking from cover with a shortbow.',
		motives_tactics: 'Ambush, hide, profit, reposition',
		difficulty: 13,
		thresholds: { major: 4, severe: 7 },
		max_hp: 3,
		max_stress: 2,
		attack_modifier: -1,
		standard_attack: {
			name: 'Shortbow',
			range: 'Far',
			damage_dice: '1d10',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: ['Stealth'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Unseen Strike',
				max_uses: null,
				description_html:
					'If the Sniper is Hidden when they make a successful standard attack against a target, they deal **1d10+4** physical damage instead of their standard damage.'
			}
		]
	},
	merchant: {
		source_key: 'SRD',
		title: 'Merchant',
		tier: 1,
		type: 'Social',
		image_url: '',
		artist_name: '',
		description: 'A finely dressed trader with a keen eye for financial gain.',
		motives_tactics: 'Buy low and sell high, create demand, inflate prices, seek profit',
		difficulty: 12,
		thresholds: { major: 4, severe: 8 },
		max_hp: 3,
		max_stress: 3,
		attack_modifier: -4,
		standard_attack: {
			name: 'Club',
			range: 'Melee',
			damage_dice: '1d4',
			damage_bonus: 1,
			damage_type: 'phy'
		},
		experiences: ['Shrewd Negotiator'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Preferential Treatment',
				max_uses: null,
				description_html:
					'A PC who succeeds on a Presence Roll against the Merchant gains a discount on purchases. A PC who fails on a Presence Roll against the Merchant must pay more and has disadvantage on future Presence Rolls against the Merchant.'
			},
			{
				type: 'Passive',
				name: 'The Runaround',
				max_uses: null,
				description_html:
					'When a PC rolls a 14 or lower on a Presence Roll made against the Merchant, they must mark a Stress.'
			}
		]
	},
	minor_chaos_elemental: {
		source_key: 'SRD',
		title: 'Minor Chaos Elemental',
		tier: 1,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description: 'A coruscating mass of uncontrollable magic.',
		motives_tactics: 'Confound, destabilize, transmogrify',
		difficulty: 14,
		thresholds: { major: 7, severe: 14 },
		max_hp: 7,
		max_stress: 3,
		attack_modifier: 3,
		standard_attack: {
			name: 'Warp Blast',
			range: 'Close',
			damage_dice: '1d12',
			damage_bonus: 6,
			damage_type: 'mag'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Arcane Form',
				max_uses: null,
				description_html: 'The Elemental is resistant to magic damage.'
			},
			{
				type: 'Action',
				name: 'Sickening Flux',
				max_uses: null,
				description_html:
					'Mark a HP to force all targets within Close range to mark a Stress and become *Vulnerable* until their next rest or they clear a HP.'
			},
			{
				type: 'Action',
				name: 'Remake Reality',
				max_uses: null,
				description_html:
					'**Spend a Fear** to transform the area within Very Close range into a different biome. All targets within this area take **2d6+3** direct magic damage.'
			},
			{
				type: 'Reaction',
				name: 'Magical Reflection',
				max_uses: null,
				description_html:
					'When the Elemental takes damage from an attack within Close range, deal an amount of damage to the attacker equal to half the damage they dealt.'
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
	minor_fire_elemental: {
		source_key: 'SRD',
		title: 'Minor Fire Elemental',
		tier: 1,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description: 'A living flame the size of a large bonfire.',
		motives_tactics: 'Encircle enemies, grow in size, intimidate, start fires',
		difficulty: 13,
		thresholds: { major: 7, severe: 15 },
		max_hp: 9,
		max_stress: 3,
		attack_modifier: 3,
		standard_attack: {
			name: 'Elemental Blast',
			range: 'Far',
			damage_dice: '1d10',
			damage_bonus: 4,
			damage_type: 'mag'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Relentless',
				max_uses: 2,
				description_html:
					'The Elemental can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.'
			},
			{
				type: 'Action',
				name: 'Scorched Earth',
				max_uses: null,
				description_html:
					'**Mark a Stress** to choose a point within Far range. The ground within Very Close range of that point immediately bursts into flames. All creatures within this area must make an Agility Reaction Roll. Targets who fail take **2d8** magic damage from the flames. Targets who succeed take half damage.'
			},
			{
				type: 'Action',
				name: 'Explosion',
				max_uses: null,
				description_html:
					'**Spend a Fear** to erupt in a fiery explosion. Make an attack against all targets within Close range. Targets the Elemental succeeds against take **1d8** magic damage and are knocked back to Far range.'
			},
			{
				type: 'Reaction',
				name: 'Consume Kindling',
				max_uses: null,
				description_html:
					'Three times per scene, when the Elemental moves onto objects that are highly flammable, consume them to clear a HP or a Stress.'
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
	minor_demon: {
		source_key: 'SRD',
		title: 'Minor Demon',
		tier: 1,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description:
			'A crimson-hued creature from the Circles Below, consumed by rage against all mortals.',
		motives_tactics: 'Act erratically, corral targets, relish pain, torment',
		difficulty: 14,
		thresholds: { major: 8, severe: 15 },
		max_hp: 8,
		max_stress: 4,
		attack_modifier: 3,
		standard_attack: {
			name: 'Claws',
			range: 'Melee',
			damage_dice: '1d8',
			damage_bonus: 6,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Relentless',
				max_uses: 2,
				description_html:
					'The Demon can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.'
			},
			{
				type: 'Passive',
				name: 'All Must Fall',
				max_uses: null,
				description_html:
					'When a PC rolls a failure with Fear while within Close range of the Demon, they lose a Hope.'
			},
			{
				type: 'Action',
				name: 'Hellfire',
				max_uses: null,
				description_html:
					'**Spend a Fear** to rain down hellfire within Far range. All targets within the area must make an Agility Reaction Roll. Targets who fail take **1d20+3** magic damage. Targets who succeed take half damage.'
			},
			{
				type: 'Reaction',
				name: 'Reaper',
				max_uses: null,
				description_html:
					"Before rolling damage for the Demon's attack, you can **Mark a Stress** to gain a bonus to the damage roll equal to the Demon's current number of marked HP."
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html: 'When the Demon makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	minor_treant: {
		source_key: 'SRD',
		title: 'Minor Treant',
		tier: 1,
		type: 'Minion',
		image_url: '',
		artist_name: '',
		description: 'An ambulatory sapling rising up to defend their forest.',
		motives_tactics: 'Crush, overwhelm, protect',
		difficulty: 10,
		thresholds: { major: 0, severe: 0 },
		max_hp: 1,
		max_stress: 1,
		attack_modifier: -2,
		standard_attack: {
			name: 'Clawed Branch',
			range: 'Melee',
			damage_dice: '4',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Minion',
				max_uses: 5,
				description_html:
					'The Treant is defeated when they take any damage. For every 5 damage a PC deals to the Treant, defeat an additional Minion within range the attack would succeed against.'
			},
			{
				type: 'Action',
				name: 'Group Attack',
				max_uses: null,
				description_html:
					'**Spend a Fear** to choose a target and spotlight all Minor Treants within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal **4** physical damage each. Combine this damage.'
			}
		]
	},
	green_ooze: {
		source_key: 'SRD',
		title: 'Green Ooze',
		tier: 1,
		type: 'Skulk',
		image_url: '',
		artist_name: '',
		description: 'A moving mound of translucent green slime.',
		motives_tactics: 'Camouflage, consume and multiply, creep up, envelop',
		difficulty: 8,
		thresholds: { major: 5, severe: 10 },
		max_hp: 5,
		max_stress: 2,
		attack_modifier: 1,
		standard_attack: {
			name: 'Ooze Appendage',
			range: 'Melee',
			damage_dice: '1d6',
			damage_bonus: 1,
			damage_type: 'mag'
		},
		experiences: ['Camouflage'],
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
					'Make a standard attack against a target within Melee range. On a success, the Ooze envelops them and the target must mark 2 Stress. The target must mark an additional Stress when they make an action roll. If the Ooze takes Severe damage, the target is freed.'
			},
			{
				type: 'Reaction',
				name: 'Split',
				max_uses: null,
				description_html:
					'When the Ooze has 3 or more HP marked, you can **Spend a Fear** to split them into two Tiny Green Oozes (with no marked HP or Stress). Immediately spotlight both of them.'
			}
		]
	},
	tiny_green_ooze: {
		source_key: 'SRD',
		title: 'Tiny Green Ooze',
		tier: 1,
		type: 'Skulk',
		image_url: '',
		artist_name: '',
		description: 'A small moving mound of translucent green slime.',
		motives_tactics: 'Camouflage, creep up',
		difficulty: 14,
		thresholds: { major: 4, severe: 0 },
		max_hp: 2,
		max_stress: 1,
		attack_modifier: -1,
		standard_attack: {
			name: 'Ooze Appendage',
			range: 'Melee',
			damage_dice: '1d4',
			damage_bonus: 1,
			damage_type: 'mag'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Acidic Form',
				max_uses: null,
				description_html:
					"When the Ooze makes a successful attack, the target must mark an Armor Slot without receiving its benefits (they can still use armor to reduce the damage). If they can't mark an Armor Slot, they must mark an additional HP."
			}
		]
	},
	red_ooze: {
		source_key: 'SRD',
		title: 'Red Ooze',
		tier: 1,
		type: 'Skulk',
		image_url: '',
		artist_name: '',
		description: 'A moving mound of translucent flaming red slime.',
		motives_tactics: 'Camouflage, consume and multiply, ignite, start fires',
		difficulty: 10,
		thresholds: { major: 6, severe: 11 },
		max_hp: 5,
		max_stress: 3,
		attack_modifier: 1,
		standard_attack: {
			name: 'Ooze Appendage',
			range: 'Melee',
			damage_dice: '1d8',
			damage_bonus: 3,
			damage_type: 'mag'
		},
		experiences: ['Camouflage'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Creeping Fire',
				max_uses: null,
				description_html:
					'The Ooze can only move within Very Close range as their normal movement. They light any flammable object they touch on fire.'
			},
			{
				type: 'Action',
				name: 'Ignite',
				max_uses: null,
				description_html:
					"Make an attack against a target within Very Close range. On a success, the target takes **1d8** magic damage and is *Ignited* until they're extinguished with a successful Finesse Roll (14). While *Ignited*, the target takes **1d4** magic damage when they make an action roll."
			},
			{
				type: 'Reaction',
				name: 'Split',
				max_uses: null,
				description_html:
					'When the Ooze has 3 or more HP marked, you can **Spend a Fear** to split them into two Tiny Red Oozes (with no marked HP or Stress). Immediately spotlight both of them.'
			}
		]
	},
	tiny_red_ooze: {
		source_key: 'SRD',
		title: 'Tiny Red Ooze',
		tier: 1,
		type: 'Skulk',
		image_url: '',
		artist_name: '',
		description: 'A small moving mound of translucent flaming red slime.',
		motives_tactics: 'Blaze, camouflage',
		difficulty: 11,
		thresholds: { major: 5, severe: 0 },
		max_hp: 2,
		max_stress: 1,
		attack_modifier: -1,
		standard_attack: {
			name: 'Ooze Appendage',
			range: 'Melee',
			damage_dice: '1d4',
			damage_bonus: 2,
			damage_type: 'mag'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Reaction',
				name: 'Burning',
				max_uses: null,
				description_html:
					'When a creature within Melee range deals damage to the Ooze, they take **1d6** direct magic damage.'
			}
		]
	},
	petty_noble: {
		source_key: 'SRD',
		title: 'Petty Noble',
		tier: 1,
		type: 'Social',
		image_url: '',
		artist_name: '',
		description: 'A richly dressed and adorned aristocrat brimming with hubris.',
		motives_tactics: 'Abuse power, gather resources, mobilize minions',
		difficulty: 14,
		thresholds: { major: 6, severe: 10 },
		max_hp: 3,
		max_stress: 5,
		attack_modifier: -3,
		standard_attack: {
			name: 'Rapier',
			range: 'Melee',
			damage_dice: '1d6',
			damage_bonus: 1,
			damage_type: 'phy'
		},
		experiences: ['Aristocrat'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'My Land, My Rules',
				max_uses: null,
				description_html:
					'All social actions made against the Noble on their land have disadvantage.'
			},
			{
				type: 'Action',
				name: 'Guards, Seize Them!',
				max_uses: null,
				description_html:
					"Once per scene, **Mark a Stress** to summon **1d4** Bladed Guards, who appear at Far range to enforce the Noble's will."
			},
			{
				type: 'Action',
				name: 'Exile',
				max_uses: null,
				description_html:
					"**Spend a Fear** and target a PC. The Noble proclaims that the target and their allies are exiled from the noble's territory. While exiled, the target and their allies have disadvantage during social situations within the Noble's domain."
			}
		]
	},
	pirate_captain: {
		source_key: 'SRD',
		title: 'Pirate Captain',
		tier: 1,
		type: 'Leader',
		image_url: '',
		artist_name: '',
		description: 'A charismatic sea dog with an impressive hat, eager to raid and plunder.',
		motives_tactics: "Command, make 'em walk the plank, plunder, raid",
		difficulty: 14,
		thresholds: { major: 7, severe: 14 },
		max_hp: 7,
		max_stress: 5,
		attack_modifier: 4,
		standard_attack: {
			name: 'Cutlass',
			range: 'Melee',
			damage_dice: '1d12',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: ['Commander', 'Sailor'],
		experience_modifiers: [2, 3],
		features: [
			{
				type: 'Passive',
				name: 'Swashbuckler',
				max_uses: null,
				description_html:
					'When the Captain marks 2 or fewer HP from an attack within Melee range, the attacker must mark a Stress.'
			},
			{
				type: 'Action',
				name: 'Reinforcements',
				max_uses: null,
				description_html:
					'Once per scene, **Mark a Stress** to summon a Pirate Raiders Horde, which appears at Far range.'
			},
			{
				type: 'Action',
				name: 'No Quarter',
				max_uses: null,
				description_html:
					'**Spend a Fear** to choose a target who has three or more Pirates within Melee range of them. The Captain leads the Pirates in hurling threats and promises of a watery grave. The target must make a Presence Reaction Roll. On a failure, the target marks **1d4+1** Stress. On a success, they must mark a Stress.'
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html:
					'When the Captain makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	pirate_raiders: {
		source_key: 'SRD',
		title: 'Pirate Raiders',
		tier: 1,
		type: 'Horde',
		image_url: '',
		artist_name: '',
		description: 'Seafaring scoundrels moving in a ravaging pack.',
		motives_tactics: 'Gang up, plunder, raid',
		difficulty: 12,
		thresholds: { major: 5, severe: 11 },
		max_hp: 4,
		max_stress: 3,
		attack_modifier: 1,
		standard_attack: {
			name: 'Cutlass',
			range: 'Melee',
			damage_dice: '1d8',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: ['Sailor'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Horde (1d4+1)',
				max_uses: null,
				description_html:
					'When the Raiders have marked half or more of their HP, their standard attack deals **1d4+1** physical damage instead.'
			},
			{
				type: 'Passive',
				name: 'Swashbuckler',
				max_uses: null,
				description_html:
					'When the Raiders mark 2 or fewer HP from an attack within Melee range, the attacker must mark a Stress.'
			}
		]
	},
	pirate_tough: {
		source_key: 'SRD',
		title: 'Pirate Tough',
		tier: 1,
		type: 'Bruiser',
		image_url: '',
		artist_name: '',
		description: 'A thickly muscled and tattooed pirate with melon-sized fists.',
		motives_tactics: 'Plunder, raid, smash, terrorize',
		difficulty: 13,
		thresholds: { major: 8, severe: 15 },
		max_hp: 5,
		max_stress: 3,
		attack_modifier: 1,
		standard_attack: {
			name: 'Massive Fists',
			range: 'Melee',
			damage_dice: '2d6',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: ['Sailor'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Swashbuckler',
				max_uses: null,
				description_html:
					'When the Tough marks 2 or fewer HP from an attack within Melee range, the attacker must mark a Stress.'
			},
			{
				type: 'Action',
				name: 'Clear the Decks',
				max_uses: null,
				description_html:
					'Make an attack against a target within Very Close range. On a success, **Mark a Stress** to move into Melee range of the target, dealing **3d4** physical damage and knocking the target back to Close range.'
			}
		]
	},
	sellsword: {
		source_key: 'SRD',
		title: 'Sellsword',
		tier: 1,
		type: 'Minion',
		image_url: '',
		artist_name: '',
		description: 'An armed mercenary testing their luck.',
		motives_tactics: 'Charge, lacerate, overwhelm, profit',
		difficulty: 10,
		thresholds: { major: 0, severe: 0 },
		max_hp: 1,
		max_stress: 1,
		attack_modifier: 3,
		standard_attack: {
			name: 'Longsword',
			range: 'Melee',
			damage_dice: '3',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Minion',
				max_uses: 4,
				description_html:
					'The Sellsword is defeated when they take any damage. For every 4 damage a PC deals to the Sellsword, defeat an additional Minion within range the attack would succeed against.'
			},
			{
				type: 'Action',
				name: 'Group Attack',
				max_uses: null,
				description_html:
					'**Spend a Fear** to choose a target and spotlight all Sellswords within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal **3** physical damage each. Combine this damage.'
			}
		]
	},
	skeleton_archer: {
		source_key: 'SRD',
		title: 'Skeleton Archer',
		tier: 1,
		type: 'Ranged',
		image_url: '',
		artist_name: '',
		description: 'A fragile skeleton with a shortbow and arrows.',
		motives_tactics: 'Perforate distracted targets, play dead, steal skin',
		difficulty: 9,
		thresholds: { major: 4, severe: 7 },
		max_hp: 3,
		max_stress: 2,
		attack_modifier: 2,
		standard_attack: {
			name: 'Shortbow',
			range: 'Far',
			damage_dice: '1d8',
			damage_bonus: 1,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Opportunist',
				max_uses: null,
				description_html:
					'When two or more adversaries are within Very Close range of a creature, all damage the Archer deals to that creature is doubled.'
			},
			{
				type: 'Action',
				name: 'Deadly Shot',
				max_uses: null,
				description_html:
					'Make an attack against a *Vulnerable* target within Far range. On a success, **Mark a Stress** to deal **3d4+8** physical damage.'
			}
		]
	},
	skeleton_dredge: {
		source_key: 'SRD',
		title: 'Skeleton Dredge',
		tier: 1,
		type: 'Minion',
		image_url: '',
		artist_name: '',
		description: 'A clattering pile of bones.',
		motives_tactics: 'Fall apart, overwhelm, play dead, steal skin',
		difficulty: 8,
		thresholds: { major: 0, severe: 0 },
		max_hp: 1,
		max_stress: 1,
		attack_modifier: -1,
		standard_attack: {
			name: 'Bone Claws',
			range: 'Melee',
			damage_dice: '1',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Minion',
				max_uses: 4,
				description_html:
					'The Dredge is defeated when they take any damage. For every 4 damage a PC deals to the Dredge, defeat an additional Minion within range the attack would succeed against.'
			},
			{
				type: 'Action',
				name: 'Group Attack',
				max_uses: null,
				description_html:
					'**Spend a Fear** to choose a target and spotlight all Dredges within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal **1** physical damage each. Combine this damage.'
			}
		]
	},
	skeleton_knight: {
		source_key: 'SRD',
		title: 'Skeleton Knight',
		tier: 1,
		type: 'Bruiser',
		image_url: '',
		artist_name: '',
		description: 'A large armored skeleton with a huge blade.',
		motives_tactics: 'Cut down the living, steal skin, wreak havoc',
		difficulty: 13,
		thresholds: { major: 7, severe: 13 },
		max_hp: 5,
		max_stress: 2,
		attack_modifier: 2,
		standard_attack: {
			name: 'Rusty Greatsword',
			range: 'Melee',
			damage_dice: '1d10',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Terrifying',
				max_uses: null,
				description_html:
					'When the Knight makes a successful attack, all PCs within Close range lose a Hope and you gain a Fear.'
			},
			{
				type: 'Action',
				name: 'Cut to the Bone',
				max_uses: null,
				description_html:
					'**Mark a Stress** to make an attack against all targets within Very Close range. Targets the Knight succeeds against take **1d8+2** physical damage and must mark a Stress.'
			},
			{
				type: 'Reaction',
				name: 'Dig Two Graves',
				max_uses: null,
				description_html:
					'When the Knight is defeated, they make an attack against a target within Very Close range (prioritizing the creature who killed them). On a success, the target takes **1d4+8** physical damage and loses **1d4** Hope.'
			}
		]
	},
	skeleton_warrior: {
		source_key: 'SRD',
		title: 'Skeleton Warrior',
		tier: 1,
		type: 'Standard',
		image_url: '',
		artist_name: '',
		description: 'A dirt-covered skeleton armed with a rusted blade.',
		motives_tactics: 'Feign death, gang up, steal skin',
		difficulty: 10,
		thresholds: { major: 4, severe: 8 },
		max_hp: 3,
		max_stress: 2,
		attack_modifier: 0,
		standard_attack: {
			name: 'Sword',
			range: 'Melee',
			damage_dice: '1d6',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Only Bones',
				max_uses: null,
				description_html: 'The Warrior is resistant to physical damage.'
			},
			{
				type: 'Reaction',
				name: "Won't Stay Dead",
				max_uses: null,
				description_html:
					'When the Warrior is defeated, you can spotlight them and roll a d6. On a result of 6, if there are other adversaries on the battlefield, the Warrior re-forms with no marked HP.'
			}
		]
	},
	spellblade: {
		source_key: 'SRD',
		title: 'Spellblade',
		tier: 1,
		type: 'Leader',
		image_url: '',
		artist_name: '',
		description: 'A mercenary combining swordplay and magic to deadly effect.',
		motives_tactics: 'Blast, command, endure',
		difficulty: 14,
		thresholds: { major: 8, severe: 14 },
		max_hp: 6,
		max_stress: 3,
		attack_modifier: 3,
		standard_attack: {
			name: 'Empowered Longsword',
			range: 'Melee',
			damage_dice: '1d8',
			damage_bonus: 4,
			damage_type: 'phy'
		},
		experiences: ['Magical Knowledge'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Arcane Steel',
				max_uses: null,
				description_html:
					"Damage dealt by the Spellblade's standard attack is considered both physical and magic."
			},
			{
				type: 'Action',
				name: 'Suppressing Blast',
				max_uses: null,
				description_html:
					'**Mark a Stress** and target a group within Far range. All targets must succeed on an Agility Reaction Roll or take **1d8+2** magic damage. You gain a Fear for each target who marked HP from this attack.'
			},
			{
				type: 'Action',
				name: 'Move as a Unit',
				max_uses: null,
				description_html: '**Spend 2 Fear** to spotlight up to five allies within Far range.'
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html:
					'When the Spellblade makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	swarm_of_rats: {
		source_key: 'SRD',
		title: 'Swarm of Rats',
		tier: 1,
		type: 'Horde',
		image_url: '',
		artist_name: '',
		description: 'A skittering mass of ordinary rodents moving as one like a ravenous wave.',
		motives_tactics: 'Consume, obscure, swarm',
		difficulty: 10,
		thresholds: { major: 6, severe: 10 },
		max_hp: 6,
		max_stress: 2,
		attack_modifier: -3,
		standard_attack: {
			name: 'Claws',
			range: 'Melee',
			damage_dice: '1d8',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Horde (1d4+1)',
				max_uses: null,
				description_html:
					'When the Swarm has marked half or more of their HP, their standard attack deals **1d4+1** physical damage instead.'
			},
			{
				type: 'Passive',
				name: 'In Your Face',
				max_uses: null,
				description_html:
					'All targets within Melee range have disadvantage on attacks against targets other than the Swarm.'
			}
		]
	},
	sylvan_soldier: {
		source_key: 'SRD',
		title: 'Sylvan Soldier',
		tier: 1,
		type: 'Standard',
		image_url: '',
		artist_name: '',
		description: 'A faerie warrior adorned in armor made of leaves and bark.',
		motives_tactics: 'Ambush, hide, overwhelm, protect, trail',
		difficulty: 11,
		thresholds: { major: 6, severe: 11 },
		max_hp: 4,
		max_stress: 2,
		attack_modifier: 0,
		standard_attack: {
			name: 'Scythe',
			range: 'Melee',
			damage_dice: '1d8',
			damage_bonus: 1,
			damage_type: 'phy'
		},
		experiences: ['Tracker'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Pack Tactics',
				max_uses: null,
				description_html:
					'If the Soldier makes a standard attack and another Sylvan Soldier is within Melee range of the target, deal **1d8+5** physical damage instead of their standard damage.'
			},
			{
				type: 'Action',
				name: 'Forest Control',
				max_uses: null,
				description_html:
					'**Spend a Fear** to pull down a tree within Close range. A creature hit by the tree must succeed on an Agility Reaction Roll (15) or take **1d10** physical damage.'
			},
			{
				type: 'Reaction',
				name: 'Blend In',
				max_uses: null,
				description_html:
					"When the Soldier makes a successful attack, you can **Mark a Stress** to become *Hidden* until the Soldier's next attack or a PC succeeds on an Instinct Roll (14) to find them."
			}
		]
	},
	tangle_bramble_swarm: {
		source_key: 'SRD',
		title: 'Tangle Bramble Swarm',
		tier: 1,
		type: 'Horde',
		image_url: '',
		artist_name: '',
		description:
			'A cluster of animate, blood-drinking tumbleweeds, each the size of a large gourd.',
		motives_tactics: 'Digest, entangle, immobilize',
		difficulty: 12,
		thresholds: { major: 6, severe: 11 },
		max_hp: 6,
		max_stress: 3,
		attack_modifier: 0,
		standard_attack: {
			name: 'Thorns',
			range: 'Melee',
			damage_dice: '1d6',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: ['Camouflage'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Horde (1d4+2)',
				max_uses: null,
				description_html:
					'When the Swarm has marked half or more of their HP, their standard attack deals **1d4+2** physical damage instead.'
			},
			{
				type: 'Action',
				name: 'Crush',
				max_uses: null,
				description_html:
					'**Mark a Stress** to deal **2d6+8** direct physical damage to a target with 3 or more bramble tokens.'
			},
			{
				type: 'Reaction',
				name: 'Encumber',
				max_uses: null,
				description_html:
					'When the Swarm succeeds on an attack, give the target a bramble token. If a target has any bramble tokens, they are *Restrained*. If a target has 3 or more bramble tokens, they are also *Vulnerable*. All bramble tokens can be removed by succeeding on a Finesse Roll (12 + the number of bramble tokens) or dealing Major or greater damage to the Swarm. If bramble tokens are removed from a target using a Finesse Roll, a number of Tangle Bramble Minions spawn within Melee range equal to the number of tokens removed.'
			}
		]
	},
	tangle_bramble: {
		source_key: 'SRD',
		title: 'Tangle Bramble',
		tier: 1,
		type: 'Minion',
		image_url: '',
		artist_name: '',
		description: 'An animate, blood-drinking tumbleweed.',
		motives_tactics: 'Combine, drain, entangle',
		difficulty: 11,
		thresholds: { major: 0, severe: 0 },
		max_hp: 1,
		max_stress: 1,
		attack_modifier: -1,
		standard_attack: {
			name: 'Thorns',
			range: 'Melee',
			damage_dice: '2',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Minion',
				max_uses: 4,
				description_html:
					'The Bramble is defeated when they take any damage. For every 4 damage a PC deals to the Tangle Bramble, defeat an additional Minion within range the attack would succeed against.'
			},
			{
				type: 'Action',
				name: 'Group Attack',
				max_uses: null,
				description_html:
					'**Spend a Fear** to choose a target and spotlight all Tangle Brambles within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal **2** physical damage each. Combine this damage.'
			},
			{
				type: 'Reaction',
				name: 'Drain and Multiply',
				max_uses: null,
				description_html:
					"When an attack from the Bramble causes a target to mark HP and there are three or more Tangle Bramble Minions within Close range, you can combine the Minions into a Tangle Bramble Swarm Horde. The Horde's HP is equal to the number of Minions combined."
			}
		]
	},
	weaponmaster: {
		source_key: 'SRD',
		title: 'Weaponmaster',
		tier: 1,
		type: 'Bruiser',
		image_url: '',
		artist_name: '',
		description: 'A master-at-arms wielding a sword twice their size.',
		motives_tactics: 'Act first, aim for the weakest, intimidate',
		difficulty: 14,
		thresholds: { major: 8, severe: 15 },
		max_hp: 6,
		max_stress: 3,
		attack_modifier: 2,
		standard_attack: {
			name: 'Claymore',
			range: 'Very Close',
			damage_dice: '1d12',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Action',
				name: 'Goading Strike',
				max_uses: null,
				description_html:
					'Make a standard attack against a target. On a success, **Mark a Stress** to *Taunt* the target until their next successful attack. The next time the *Taunted* target attacks, they have disadvantage against targets other than the Weaponmaster.'
			},
			{
				type: 'Action',
				name: 'Adrenaline Burst',
				max_uses: null,
				description_html: 'Once per scene, **Spend a Fear** to clear 2 HP and 2 Stress.'
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html:
					'When the Weaponmaster makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	young_dryad: {
		source_key: 'SRD',
		title: 'Young Dryad',
		tier: 1,
		type: 'Leader',
		image_url: '',
		artist_name: '',
		description: "An imperious tree-person leading their forest's defenses.",
		motives_tactics: 'Command, nurture, prune the unwelcome',
		difficulty: 11,
		thresholds: { major: 6, severe: 11 },
		max_hp: 6,
		max_stress: 2,
		attack_modifier: 0,
		standard_attack: {
			name: 'Scythe',
			range: 'Melee',
			damage_dice: '1d8',
			damage_bonus: 5,
			damage_type: 'phy'
		},
		experiences: ['Leadership'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Action',
				name: 'Voice of the Forest',
				max_uses: null,
				description_html:
					'**Mark a Stress** to spotlight **1d4** allies within range of a target they can attack without moving. On a success, their attacks deal half damage.'
			},
			{
				type: 'Action',
				name: 'Thorny Cage',
				max_uses: null,
				description_html:
					"**Spend a Fear** to form a cage around a target within Very Close range and *Restrain* them until they're freed with a successful Strength Roll. When a creature makes an action roll against the cage, they must mark a Stress."
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html: 'When the Dryad makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	brawny_zombie: {
		source_key: 'SRD',
		title: 'Brawny Zombie',
		tier: 1,
		type: 'Bruiser',
		image_url: '',
		artist_name: '',
		description: 'A large corpse, decay-bloated and angry.',
		motives_tactics: 'Crush, destroy, hail debris, slam',
		difficulty: 10,
		thresholds: { major: 8, severe: 15 },
		max_hp: 7,
		max_stress: 4,
		attack_modifier: 2,
		standard_attack: {
			name: 'Slam',
			range: 'Very Close',
			damage_dice: '1d12',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: ['Collateral Damage', 'Throw'],
		experience_modifiers: [2, 4],
		features: [
			{
				type: 'Passive',
				name: 'Slow',
				max_uses: null,
				description_html:
					"When you spotlight the Zombie and they don't have a token on their stat block, they can't act yet. Place a token on their stat block and describe what they're preparing to do. When you spotlight the Zombie and they have a token on their stat block, clear the token and they can act."
			},
			{
				type: 'Action',
				name: 'Rend Asunder',
				max_uses: null,
				description_html:
					'Make a standard attack with advantage against a target the Zombie has *Restrained*. On a success, the attack deals direct damage.'
			},
			{
				type: 'Reaction',
				name: 'Rip and Tear',
				max_uses: null,
				description_html:
					'When the Zombie makes a successful standard attack, you can **Mark a Stress** to temporarily *Restrain* the target and force them to mark 2 Stress.'
			}
		]
	},
	patchwork_zombie_hulk: {
		source_key: 'SRD',
		title: 'Patchwork Zombie Hulk',
		tier: 1,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description:
			'A towering gestalt of corpses moving as one, with torso-sized limbs and fists as large as a grown halfling.',
		motives_tactics: 'Absorb corpses, flail, hunger, terrify',
		difficulty: 13,
		thresholds: { major: 8, severe: 15 },
		max_hp: 10,
		max_stress: 3,
		attack_modifier: 4,
		standard_attack: {
			name: 'Too Many Arms',
			range: 'Very Close',
			damage_dice: '1d20',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: ['Intimidation', 'Tear Things Apart'],
		experience_modifiers: [2, 2],
		features: [
			{
				type: 'Passive',
				name: 'Destructible',
				max_uses: null,
				description_html:
					'When the Zombie takes Major or greater damage, they mark an additional HP.'
			},
			{
				type: 'Passive',
				name: 'Flailing Limbs',
				max_uses: null,
				description_html:
					'When the Zombie makes a standard attack, they can attack all targets within Very Close range.'
			},
			{
				type: 'Action',
				name: 'Another for the Pile',
				max_uses: null,
				description_html:
					'When the Zombie is within Very Close range of a corpse, they can incorporate it into themselves, clearing a HP and a Stress.'
			},
			{
				type: 'Action',
				name: 'Tormented Screams',
				max_uses: null,
				description_html:
					'**Mark a Stress** to cause all PCs within Far range to make a Presence Reaction Roll (13). Targets who fail lose a Hope and you gain a Fear for each. Targets who succeed must mark a Stress.'
			}
		]
	},
	rotted_zombie: {
		source_key: 'SRD',
		title: 'Rotted Zombie',
		tier: 1,
		type: 'Minion',
		image_url: '',
		artist_name: '',
		description: 'A decaying corpse ambling toward their prey.',
		motives_tactics: 'Eat flesh, hunger, maul, surround',
		difficulty: 8,
		thresholds: { major: 0, severe: 0 },
		max_hp: 1,
		max_stress: 1,
		attack_modifier: -3,
		standard_attack: {
			name: 'Bite',
			range: 'Melee',
			damage_dice: '2',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Minion',
				max_uses: 3,
				description_html:
					'The Zombie is defeated when they take any damage. For every 3 damage a PC deals to the Zombie, defeat an additional Minion within range the attack would succeed against.'
			},
			{
				type: 'Action',
				name: 'Group Attack',
				max_uses: null,
				description_html:
					'**Spend a Fear** to choose a target and spotlight all Rotted Zombies within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal **2** physical damage each. Combine this damage.'
			}
		]
	},
	shambling_zombie: {
		source_key: 'SRD',
		title: 'Shambling Zombie',
		tier: 1,
		type: 'Standard',
		image_url: '',
		artist_name: '',
		description: 'An animated corpse that moves shakily, driven only by hunger.',
		motives_tactics: 'Devour, hungry, mob enemy, shred flesh',
		difficulty: 10,
		thresholds: { major: 4, severe: 6 },
		max_hp: 4,
		max_stress: 1,
		attack_modifier: 0,
		standard_attack: {
			name: 'Bite',
			range: 'Melee',
			damage_dice: '1d6',
			damage_bonus: 1,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Too Many to Handle',
				max_uses: null,
				description_html:
					'When the Zombie is within Melee range of a creature and at least one other Zombie is within Close range, all attacks against that creature have advantage.'
			},
			{
				type: 'Passive',
				name: 'Horrifying',
				max_uses: null,
				description_html: "Targets who mark HP from the Zombie's attacks must also mark a Stress."
			}
		]
	},
	zombie_pack: {
		source_key: 'SRD',
		title: 'Zombie Pack',
		tier: 1,
		type: 'Horde',
		image_url: '',
		artist_name: '',
		description: 'A group of shambling corpses instinctively moving together.',
		motives_tactics: 'Consume flesh, hunger, maul',
		difficulty: 8,
		thresholds: { major: 6, severe: 12 },
		max_hp: 6,
		max_stress: 3,
		attack_modifier: -1,
		standard_attack: {
			name: 'Bite',
			range: 'Melee',
			damage_dice: '1d10',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Horde (1d4+2)',
				max_uses: null,
				description_html:
					'When the Zombies have marked half or more of their HP, their standard attack deals **1d4+2** physical damage instead.'
			},
			{
				type: 'Reaction',
				name: 'Overwhelm',
				max_uses: null,
				description_html:
					'When the Zombies mark HP from an attack within Melee range, you can **Mark a Stress** to make a standard attack against the attacker.'
			}
		]
	}
} as const satisfies Record<string, Adversary>;
