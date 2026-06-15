import type { Adversary } from '../../../../convex/schemas/compendium';

export const TIER_4_ADVERSARIES = {
	arch_necromancer: {
		source_key: 'SRD',
		title: 'Arch-Necromancer',
		tier: 4,
		type: 'Leader',
		image_url: '',
		artist_name: '',
		description: 'A decaying mage adorned in dark, tattered robes.',
		motives_tactics: 'Corrupt, decay, flee to fight another day, resurrect',
		difficulty: 21,
		thresholds: { major: 33, severe: 66 },
		max_hp: 9,
		max_stress: 8,
		attack_modifier: 6,
		standard_attack: {
			name: 'Necrotic Blast',
			range: 'Far',
			damage_dice: '4d12',
			damage_bonus: 8,
			damage_type: 'mag'
		},
		experiences: ['Forbidden Knowledge', 'Wisdom of Centuries'],
		experience_modifiers: [3, 3],
		features: [
			{
				type: 'Action',
				name: 'Dance of Death',
				max_uses: null,
				description_html:
					'**Mark a Stress** to spotlight **1d4** allies. Attacks they make while spotlighted in this way deal half damage, or full damage if you **Spend a Fear**.'
			},
			{
				type: 'Action',
				name: 'Beam of Decay',
				max_uses: null,
				description_html:
					'**Mark 2 Stress** to cause all targets within Far range to make a Strength Reaction Roll. Targets who fail take **2d20+12** magic damage and you gain a Fear. Targets who succeed take half damage. A target who marks 2 or more HP must also mark 2 Stress and becomes *Vulnerable* until they roll with Hope.'
			},
			{
				type: 'Action',
				name: 'Open the Gates of Death',
				max_uses: null,
				description_html:
					'**Spend a Fear** to summon a Zombie Legion, which appears at Close range and immediately takes the spotlight.'
			},
			{
				type: 'Reaction',
				name: 'Not Today, My Dears',
				max_uses: null,
				description_html:
					'When the Necromancer has marked 7 or more of their HP, you can **Spend a Fear** to have them teleport away to a safe location to recover. A PC who succeeds on an Instinct Roll can trace the teleportation magic to their destination.'
			},
			{
				type: 'Reaction',
				name: 'Your Life Is Mine',
				max_uses: null,
				description_html:
					'Countdown (Loop 2d6). When the Necromancer has marked 6 or more of their HP, activate the countdown. When it triggers, deal **2d10+6** direct magic damage to a target within Close range. The Necromancer then clears a number of Stress or HP equal to the number of HP marked by the target from this attack.'
			}
		]
	},
	fallen_shock_troop: {
		source_key: 'SRD',
		title: 'Fallen Shock Troop',
		tier: 4,
		type: 'Minion',
		image_url: '',
		artist_name: '',
		description: "A cursed soul bound to the Fallen's will.",
		motives_tactics: 'Crush, dominate, earn relief, punish',
		difficulty: 18,
		thresholds: { major: 0, severe: 0 },
		max_hp: 1,
		max_stress: 1,
		attack_modifier: 2,
		standard_attack: {
			name: 'Cursed Axe',
			range: 'Very Close',
			damage_dice: '12',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Minion',
				max_uses: 12,
				description_html:
					'The Shock Troop is defeated when they take any damage. For every 12 damage a PC deals to the Shock Troop, defeat an additional Minion within range the attack would succeed against.'
			},
			{
				type: 'Passive',
				name: 'Aura of Doom',
				max_uses: null,
				description_html: 'When a PC marks HP from an attack by the Shock Troop, they lose a Hope.'
			},
			{
				type: 'Action',
				name: 'Group Attack',
				max_uses: null,
				description_html:
					'**Spend a Fear** to choose a target and spotlight all Fallen Shock Troops within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal **12** physical damage each. Combine this damage.'
			}
		]
	},
	fallen_sorcerer: {
		source_key: 'SRD',
		title: 'Fallen Sorcerer',
		tier: 4,
		type: 'Support',
		image_url: '',
		artist_name: '',
		description: 'A powerful mage bound by the bargains they made in life.',
		motives_tactics: 'Acquire, dishearten, dominate, torment',
		difficulty: 19,
		thresholds: { major: 26, severe: 42 },
		max_hp: 6,
		max_stress: 5,
		attack_modifier: 4,
		standard_attack: {
			name: 'Corrupted Staff',
			range: 'Far',
			damage_dice: '4d6',
			damage_bonus: 10,
			damage_type: 'mag'
		},
		experiences: ['Ancient Knowledge'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Action',
				name: 'Conflagration',
				max_uses: null,
				description_html:
					'**Spend a Fear** to unleash an all-consuming firestorm and make an attack against all targets within Close range. Targets the Sorcerer succeeds against take **2d10+6** direct magic damage.'
			},
			{
				type: 'Action',
				name: 'Nightmare Tableau',
				max_uses: null,
				description_html:
					'**Mark a Stress** to trap a target within Far range in a powerful illusion of their worst fears. While trapped, the target is *Restrained* and *Vulnerable* until they break free, ending both conditions, with a successful Instinct Roll.'
			},
			{
				type: 'Reaction',
				name: 'Slippery',
				max_uses: null,
				description_html:
					'When the Sorcerer takes damage from an attack, they can teleport up to Far range.'
			},
			{
				type: 'Reaction',
				name: 'Shackles of Guilt',
				max_uses: null,
				description_html:
					'Countdown (Loop 2d6). When the Sorcerer is in the spotlight for the first time, activate the countdown. When it triggers, all targets within Far range become *Vulnerable* and must mark a Stress as they relive their greatest regrets. A target can break free from their regret with a successful Presence or Strength Roll. When a PC fails to break free, they lose a Hope.'
			}
		]
	},
	fallen_warlord_realm_breaker: {
		source_key: 'SRD',
		title: 'Fallen Warlord: Realm-Breaker',
		tier: 4,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description:
			"A Fallen God, wreathed in rage and resentment, bearing millennia of experience in breaking heroes' spirits.",
		motives_tactics: 'Corrupt, dominate, punish, break the weak',
		difficulty: 20,
		thresholds: { major: 36, severe: 66 },
		max_hp: 8,
		max_stress: 5,
		attack_modifier: 7,
		standard_attack: {
			name: 'Barbed Whip',
			range: 'Close',
			damage_dice: '4d8',
			damage_bonus: 7,
			damage_type: 'phy'
		},
		experiences: ['Conquest', 'History', 'Intimidation'],
		experience_modifiers: [3, 2, 3],
		features: [
			{
				type: 'Passive',
				name: 'Relentless',
				max_uses: 2,
				description_html:
					'The Realm-Breaker can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.'
			},
			{
				type: 'Passive',
				name: 'Firespite Plate Armor',
				max_uses: null,
				description_html: 'When the Realm-Breaker takes damage, reduce it by **2d10**.'
			},
			{
				type: 'Action',
				name: 'Tormenting Lash',
				max_uses: null,
				description_html:
					'**Mark a Stress** to make a standard attack against all targets within Very Close range. When a target uses armor to reduce damage from this attack, they must mark 2 Armor Slots.'
			},
			{
				type: 'Reaction',
				name: 'All-Consuming Rage',
				max_uses: null,
				description_html:
					'Countdown (Decreasing 8). When the Realm-Breaker is in the spotlight for the first time, activate the countdown. When it triggers, create a torrent of incarnate rage that rends flesh from bone. All targets within Far range must make a Presence Reaction Roll. Targets who fail take **2d6+10** direct magic damage. Targets who succeed take half damage. For each HP marked from this damage, summon a Fallen Shock Troop within Very Close range of the target who marked that HP. If the countdown ever decreases its maximum value to 0, the Realm-Breaker marks their remaining HP and all targets within Far range must mark all remaining HP and make a death move.'
			},
			{
				type: 'Reaction',
				name: 'Doombringer',
				max_uses: null,
				description_html:
					'When a target marks HP from an attack by the Realm-Breaker, all PCs within Far range of the target must lose a Hope.'
			},
			{
				type: 'Reaction',
				name: 'I Have Never Known Defeat (Phase Change)',
				max_uses: null,
				description_html:
					'When the Realm-Breaker marks their last HP, replace them with the Undefeated Champion and immediately spotlight them.'
			}
		]
	},
	fallen_warlord_undefeated_champion: {
		source_key: 'SRD',
		title: 'Fallen Warlord: Undefeated Champion',
		tier: 4,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description: 'That which only the most feared have a chance to fear.',
		motives_tactics: 'Dispatch merciless death, punish the defiant, secure victory at any cost',
		difficulty: 18,
		thresholds: { major: 35, severe: 58 },
		max_hp: 11,
		max_stress: 5,
		attack_modifier: 8,
		standard_attack: {
			name: 'Heart-Shattering Sword',
			range: 'Very Close',
			damage_dice: '4d12',
			damage_bonus: 13,
			damage_type: 'phy'
		},
		experiences: ['Conquest', 'History', 'Intimidation'],
		experience_modifiers: [3, 2, 3],
		features: [
			{
				type: 'Passive',
				name: 'Relentless',
				max_uses: 3,
				description_html:
					'The Undefeated Champion can be spotlighted up to three times per GM turn. Spend Fear as usual to spotlight them.'
			},
			{
				type: 'Passive',
				name: 'Faltering Armor',
				max_uses: null,
				description_html: 'When the Undefeated Champion takes damage, reduce it by **1d10**.'
			},
			{
				type: 'Action',
				name: 'Shattering Strike',
				max_uses: null,
				description_html:
					'**Mark a Stress** to make a standard attack against all targets within Very Close range. PCs the Champion succeeds against lose a number of Hope equal to the HP they marked from this attack.'
			},
			{
				type: 'Action',
				name: 'Endless Legions',
				max_uses: null,
				description_html:
					'**Spend a Fear** to summon a number of Fallen Shock Troops equal to twice the number of PCs. The Shock Troops appear at Far range.'
			},
			{
				type: 'Reaction',
				name: 'Circle of Defilement',
				max_uses: null,
				description_html:
					'Countdown (1d8). When the Undefeated Champion is in the spotlight for the first time, activate the countdown. When it triggers, activate a magical circle covering an area within Far range of the Champion. A target within that area is *Vulnerable* until they leave the circle. The circle can be removed by dealing Severe damage to the Undefeated Champion.'
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html:
					'When the Undefeated Champion makes a successful attack against a PC, you gain a Fear.'
			},
			{
				type: 'Reaction',
				name: 'Doombringer',
				max_uses: null,
				description_html:
					'When a target marks HP from an attack by the Undefeated Champion, all PCs within Far range of the target lose a Hope.'
			}
		]
	},
	hallowed_archer: {
		source_key: 'SRD',
		title: 'Hallowed Archer',
		tier: 4,
		type: 'Ranged',
		image_url: '',
		artist_name: '',
		description: 'Spirit soldiers with sanctified bows.',
		motives_tactics: 'Focus fire, obey, reposition, volley',
		difficulty: 19,
		thresholds: { major: 25, severe: 45 },
		max_hp: 3,
		max_stress: 2,
		attack_modifier: 4,
		standard_attack: {
			name: 'Sanctified Longbow',
			range: 'Far',
			damage_dice: '4d8',
			damage_bonus: 8,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Punish the Guilty',
				max_uses: null,
				description_html:
					'The Archer deals double damage to targets marked *Guilty* by a High Seraph.'
			},
			{
				type: 'Action',
				name: 'Divine Volley',
				max_uses: null,
				description_html: '**Mark a Stress** to make a standard attack against up to three targets.'
			}
		]
	},
	hallowed_soldier: {
		source_key: 'SRD',
		title: 'Hallowed Soldier',
		tier: 4,
		type: 'Minion',
		image_url: '',
		artist_name: '',
		description: 'Souls of the faithful, lifted up with divine weaponry.',
		motives_tactics: 'Obey, outmaneuver, punish, swarm',
		difficulty: 18,
		thresholds: { major: 0, severe: 0 },
		max_hp: 1,
		max_stress: 2,
		attack_modifier: 2,
		standard_attack: {
			name: 'Sword and Shield',
			range: 'Melee',
			damage_dice: '10',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Minion',
				max_uses: 13,
				description_html:
					'The Soldier is defeated when they take any damage. For every 13 damage a PC deals to the Soldier, defeat an additional Minion within range the attack would succeed against.'
			},
			{
				type: 'Passive',
				name: 'Divine Flight',
				max_uses: null,
				description_html:
					'While the Soldier is flying, **Spend a Fear** to move up to Far range instead of Close range before taking an action.'
			},
			{
				type: 'Action',
				name: 'Group Attack',
				max_uses: null,
				description_html:
					'**Spend a Fear** to choose a target and spotlight all Hallowed Soldiers within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal **10** physical damage each. Combine this damage.'
			}
		]
	},
	high_seraph: {
		source_key: 'SRD',
		title: 'High Seraph',
		tier: 4,
		type: 'Leader',
		image_url: '',
		artist_name: '',
		description:
			"A divine champion, head of a hallowed host of warriors who enforce their god's will.",
		motives_tactics: 'Enforce dogma, fly, pronounce judgment, smite',
		difficulty: 20,
		thresholds: { major: 37, severe: 70 },
		max_hp: 7,
		max_stress: 5,
		attack_modifier: 8,
		standard_attack: {
			name: 'Holy Sword',
			range: 'Very Close',
			damage_dice: '4d10',
			damage_bonus: 10,
			damage_type: 'phy'
		},
		experiences: ['Divine Knowledge'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Relentless',
				max_uses: 3,
				description_html:
					'The Seraph can be spotlighted up to three times per GM turn. Spend Fear as usual to spotlight them.'
			},
			{
				type: 'Passive',
				name: 'Divine Flight',
				max_uses: null,
				description_html:
					'While the Seraph is flying, **Spend a Fear** to move up to Far range instead of Close range before taking an action.'
			},
			{
				type: 'Action',
				name: 'Judgment',
				max_uses: null,
				description_html:
					"**Spend a Fear** to make a target *Guilty* in the eyes of the Seraph's god until the Seraph is defeated. While *Guilty*, the target doesn't gain Hope on a result with Hope. When the Seraph succeeds on a standard attack against a *Guilty* target, they deal Severe damage instead of their standard damage. The Seraph can only mark one target at a time."
			},
			{
				type: 'Action',
				name: 'God Rays',
				max_uses: null,
				description_html:
					'**Mark a Stress** to reflect a sliver of divinity as a searing beam of light that hits up to twenty targets within Very Far range. Targets must make a Presence Reaction Roll, with disadvantage if they are marked *Guilty*. Targets who fail take **4d6+12** magic damage. Targets who succeed take half damage.'
			},
			{
				type: 'Action',
				name: 'We Are One',
				max_uses: null,
				description_html:
					'Once per scene, **Spend a Fear** to spotlight all other adversaries within Far range. Attacks they make while spotlighted in this way deal half damage.'
			}
		]
	},
	kraken: {
		source_key: 'SRD',
		title: 'Kraken',
		tier: 4,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description:
			'A legendary beast of the sea, bigger than the largest galleon, with sucker-laden tentacles and a terrifying maw.',
		motives_tactics: 'Consume, crush, drown, grapple',
		difficulty: 20,
		thresholds: { major: 35, severe: 70 },
		max_hp: 11,
		max_stress: 8,
		attack_modifier: 7,
		standard_attack: {
			name: 'Tentacles',
			range: 'Close',
			damage_dice: '4d12',
			damage_bonus: 10,
			damage_type: 'phy'
		},
		experiences: ['Swimming'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Relentless',
				max_uses: 3,
				description_html:
					'The Kraken can be spotlighted up to three times per GM turn. Spend Fear as usual to spotlight them.'
			},
			{
				type: 'Passive',
				name: 'Many Tentacles',
				max_uses: null,
				description_html:
					'While the Kraken has 7 or fewer marked HP, they can make their standard attack against two targets within range.'
			},
			{
				type: 'Action',
				name: 'Grapple and Drown',
				max_uses: null,
				description_html:
					'Make an attack roll against a target within Close range. On a success, **mark a Stress** to grab them with a tentacle and drag them beneath the water. The target is *Restrained* and *Vulnerable* until they break free with a successful Strength Roll or the Kraken takes Major or greater damage. While *Restrained* and *Vulnerable* in this way, a target must **mark a Stress** when they make an action roll.'
			},
			{
				type: 'Action',
				name: 'Boiling Blast',
				max_uses: null,
				description_html:
					'**Spend a Fear** to spew a line of boiling water at any number of targets in a line up to Far range. All targets must succeed on an Agility Reaction Roll or take **4d6+9** physical damage. If a target marks an Armor Slot to reduce the damage, they must also mark a Stress.'
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html: 'When the Kraken makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	oracle_of_doom: {
		source_key: 'SRD',
		title: 'Oracle of Doom',
		tier: 4,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description: 'A towering immortal and incarnation of fate, cursed to only see bad outcomes.',
		motives_tactics: 'Change environment, condemn, dishearten, toss aside',
		difficulty: 20,
		thresholds: { major: 38, severe: 68 },
		max_hp: 11,
		max_stress: 10,
		attack_modifier: 8,
		standard_attack: {
			name: 'Psychic Attack',
			range: 'Far',
			damage_dice: '4d8',
			damage_bonus: 9,
			damage_type: 'mag'
		},
		experiences: ['Boundless Knowledge'],
		experience_modifiers: [4],
		features: [
			{
				type: 'Passive',
				name: 'Terrifying',
				max_uses: null,
				description_html:
					'When the Oracle makes a successful attack, all PCs within Far range lose a Hope and you gain a Fear.'
			},
			{
				type: 'Passive',
				name: 'Walls Closing In',
				max_uses: null,
				description_html:
					'When a creature rolls a failure while within Very Far range of the Oracle, they must mark a Stress.'
			},
			{
				type: 'Action',
				name: 'Pronounce Fate',
				max_uses: null,
				description_html:
					'**Spend a Fear** to present a target within Far range with a vision of their personal nightmare. The target must make a Knowledge Reaction Roll. On a failure, they lose all Hope and take **2d20+4** direct magic damage. On a success, they take half damage and lose a Hope.'
			},
			{
				type: 'Action',
				name: 'Summon Tormentors',
				max_uses: null,
				description_html:
					"Once per day, **Spend 2 Fear** to summon **2d4** Tier 2 or below Minions relevant to one of the PC's personal nightmares. They appear at Close range relative to that PC."
			},
			{
				type: 'Reaction',
				name: 'Ominous Knowledge',
				max_uses: null,
				description_html:
					'When the Oracle sees a mortal creature, they instantly know one of their personal nightmares.'
			},
			{
				type: 'Reaction',
				name: 'Vengeful Fate',
				max_uses: null,
				description_html:
					'When the Oracle marks HP from an attack within Very Close range, you can **mark a Stress** to knock the attacker back to Far range and deal **2d10+4** physical damage.'
			}
		]
	},
	outer_realms_abomination: {
		source_key: 'SRD',
		title: 'Outer Realms Abomination',
		tier: 4,
		type: 'Bruiser',
		image_url: '',
		artist_name: '',
		description: 'A chaotic mockery of life, constantly in flux.',
		motives_tactics: 'Demolish, devour, undermine',
		difficulty: 19,
		thresholds: { major: 35, severe: 71 },
		max_hp: 7,
		max_stress: 5,
		attack_modifier: 5,
		standard_attack: {
			name: 'Massive Pseudopod',
			range: 'Very Close',
			damage_dice: '4d6',
			damage_bonus: 13,
			damage_type: 'mag'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Chaotic Form',
				max_uses: null,
				description_html:
					'When the Abomination attacks, roll **2d4** and use the result as their attack modifier.'
			},
			{
				type: 'Passive',
				name: 'Disorienting Presence',
				max_uses: null,
				description_html:
					'When a target takes damage from the Abomination, they must make an Instinct Reaction Roll. On a failure, they gain disadvantage on their next action roll and you gain a Fear.'
			},
			{
				type: 'Action',
				name: 'Reality Quake',
				max_uses: null,
				description_html:
					'**Spend a Fear** to rattle the edges of reality within Far range of the Abomination. All targets within that area must succeed on a Knowledge Reaction Roll or become *Unstuck* from reality until the end of the scene. When an *Unstuck* target spends Hope or marks Armor Slots, HP, or Stress, they must double the amount spent or marked.'
			},
			{
				type: 'Reaction',
				name: 'Unreal Form',
				max_uses: null,
				description_html:
					'When the Abomination takes damage, reduce it by **1d20**. If the Abomination marks 1 or fewer Hit Points from a successful attack against them, you gain a Fear.'
			}
		]
	},
	outer_realms_corrupter: {
		source_key: 'SRD',
		title: 'Outer Realms Corrupter',
		tier: 4,
		type: 'Support',
		image_url: '',
		artist_name: '',
		description: 'A shifting, formless mass seemingly made of chromatic light.',
		motives_tactics: 'Confuse, distract, overwhelm',
		difficulty: 19,
		thresholds: { major: 27, severe: 47 },
		max_hp: 4,
		max_stress: 3,
		attack_modifier: 7,
		standard_attack: {
			name: 'Corroding Pseudopod',
			range: 'Very Close',
			damage_dice: '4d8',
			damage_bonus: 5,
			damage_type: 'mag'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Will-Shattering Touch',
				max_uses: null,
				description_html: 'When a PC takes damage from the Corrupter, they lose a Hope.'
			},
			{
				type: 'Action',
				name: 'Disgorge Reality Flotsam',
				max_uses: null,
				description_html:
					'**Mark a Stress** to spew partially digested portions of consumed realities at all targets within Close range. Targets must succeed on a Knowledge Reaction Roll or **Mark 2 Stress**.'
			}
		]
	},
	outer_realms_thrall: {
		source_key: 'SRD',
		title: 'Outer Realms Thrall',
		tier: 4,
		type: 'Minion',
		image_url: '',
		artist_name: '',
		description: 'A vaguely humanoid form stripped of memory and identity.',
		motives_tactics: 'Destroy, disgust, disorient, intimidate',
		difficulty: 17,
		thresholds: { major: 0, severe: 0 },
		max_hp: 1,
		max_stress: 1,
		attack_modifier: 3,
		standard_attack: {
			name: 'Claws and Teeth',
			range: 'Very Close',
			damage_dice: '11',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Minion',
				max_uses: 13,
				description_html:
					'The Thrall is defeated when they take any damage. For every 13 damage a PC deals to the Thrall, defeat an additional Minion within range the attack would succeed against.'
			},
			{
				type: 'Action',
				name: 'Group Attack',
				max_uses: null,
				description_html:
					'**Spend a Fear** to choose a target and spotlight all Outer Realm Thralls within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal **11** physical damage each. Combine this damage.'
			}
		]
	},
	volcanic_dragon_obsidian_predator: {
		source_key: 'SRD',
		title: 'Volcanic Dragon: Obsidian Predator',
		tier: 4,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description: 'A massive winged creature with obsidian scales and impossibly sharp claws.',
		motives_tactics: 'Defend lair, dive-bomb, fly, hunt, intimidate',
		difficulty: 19,
		thresholds: { major: 33, severe: 65 },
		max_hp: 6,
		max_stress: 5,
		attack_modifier: 8,
		standard_attack: {
			name: 'Obsidian Claws',
			range: 'Close',
			damage_dice: '4d10',
			damage_bonus: 4,
			damage_type: 'phy'
		},
		experiences: ['Hunt from Above'],
		experience_modifiers: [5],
		features: [
			{
				type: 'Passive',
				name: 'Relentless',
				max_uses: 2,
				description_html:
					'The Obsidian Predator can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.'
			},
			{
				type: 'Passive',
				name: 'Flying',
				max_uses: null,
				description_html:
					'While flying, the Obsidian Predator gains a +3 bonus to their Difficulty.'
			},
			{
				type: 'Passive',
				name: 'Obsidian Scales',
				max_uses: null,
				description_html: 'The Obsidian Predator is resistant to physical damage.'
			},
			{
				type: 'Action',
				name: 'Avalanche Tail',
				max_uses: null,
				description_html:
					'**Mark a Stress** to make an attack against all targets within Close range. Targets the Obsidian Predator succeeds against take **4d6+4** physical damage and are knocked back to Far range and *Vulnerable* until their next roll with Hope.'
			},
			{
				type: 'Action',
				name: 'Dive-Bomb',
				max_uses: null,
				description_html:
					'If the Obsidian Predator is flying, **Mark a Stress** to choose a point within Far range. Move to that point and make an attack against all targets within Very Close range. Targets the Obsidian Predator succeeds against take **2d10+6** physical damage and must **Mark a Stress** and lose a Hope.'
			},
			{
				type: 'Reaction',
				name: 'Erupting Rage (Phase Change)',
				max_uses: null,
				description_html:
					'When the Obsidian Predator marks their last HP, replace them with the Molten Scourge and immediately spotlight them.'
			}
		]
	},
	volcanic_dragon_molten_scourge: {
		source_key: 'SRD',
		title: 'Volcanic Dragon: Molten Scourge',
		tier: 4,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description: 'Enraged by their wounds, the dragon bursts into molten lava.',
		motives_tactics: 'Douse with lava, incinerate, repel invaders, reposition',
		difficulty: 20,
		thresholds: { major: 30, severe: 58 },
		max_hp: 7,
		max_stress: 5,
		attack_modifier: 9,
		standard_attack: {
			name: 'Lava-Coated Claws',
			range: 'Close',
			damage_dice: '4d12',
			damage_bonus: 4,
			damage_type: 'phy'
		},
		experiences: ['Hunt from Above'],
		experience_modifiers: [5],
		features: [
			{
				type: 'Passive',
				name: 'Relentless',
				max_uses: 3,
				description_html:
					'The Molten Scourge can be spotlighted up to three times per GM turn. Spend Fear as usual to spotlight them.'
			},
			{
				type: 'Passive',
				name: 'Cracked Scales',
				max_uses: null,
				description_html:
					'When the Molten Scourge takes damage, roll a number of d6s equal to HP marked. For each result of 4 or higher, you gain a Fear.'
			},
			{
				type: 'Action',
				name: 'Shattering Might',
				max_uses: null,
				description_html:
					'**Mark a Stress** to make an attack against a target within Very Close range. On a success, the target takes **4d8+1** physical damage, loses a Hope, and is knocked back to Close range. The Molten Scourge clears a Stress.'
			},
			{
				type: 'Action',
				name: 'Eruption',
				max_uses: null,
				description_html:
					"**Spend a Fear** to erupt lava from beneath the Molten Scourge's scales, filling the area within Very Close range with molten lava. All targets in that area must succeed on an Agility Reaction Roll or take **4d6+6** physical damage and be knocked back to Close range. This area remains lava. When a creature other than the Molten Scourge enters that area or acts while inside of it, they must mark 6 HP."
			},
			{
				type: 'Reaction',
				name: 'Volcanic Breath',
				max_uses: null,
				description_html:
					'When the Molten Scourge takes Major damage, roll a **d10**. On a result of 8 or higher, the Molten Scourge breathes a flow of lava in front of them within Far range. All targets in that area must make an Agility Reaction Roll. Targets who fail take **2d10+4** physical damage, **Mark 1d4 Stress**, and are *Vulnerable* until they clear a Stress. Targets who succeed take half damage and must **Mark a Stress**.'
			},
			{
				type: 'Reaction',
				name: 'Lava Splash',
				max_uses: null,
				description_html:
					'When the Molten Scourge takes Severe damage from an attack within Very Close range, molten blood gushes from the wound and deals **2d10+4** direct physical damage to the attacker.'
			},
			{
				type: 'Reaction',
				name: 'Ashen Vengeance (Phase Change)',
				max_uses: null,
				description_html:
					'When the Molten Scourge marks their last HP, replace them with the Ashen Tyrant and immediately spotlight them.'
			}
		]
	},
	volcanic_dragon_ashen_tyrant: {
		source_key: 'SRD',
		title: 'Volcanic Dragon: Ashen Tyrant',
		tier: 4,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description:
			"No enemy has ever had the insolence to wound the dragon so. As the lava settles, it's ground to ash like the dragon's past foes.",
		motives_tactics: 'Choke, fly, intimidate, kill or be killed',
		difficulty: 18,
		thresholds: { major: 29, severe: 55 },
		max_hp: 8,
		max_stress: 5,
		attack_modifier: 10,
		standard_attack: {
			name: 'Claws and Teeth',
			range: 'Close',
			damage_dice: '4d12',
			damage_bonus: 15,
			damage_type: 'phy'
		},
		experiences: ['Hunt from Above'],
		experience_modifiers: [5],
		features: [
			{
				type: 'Passive',
				name: 'Relentless',
				max_uses: 4,
				description_html:
					'The Ashen Tyrant can be spotlighted up to four times per GM turn. Spend Fear as usual to spotlight them.'
			},
			{
				type: 'Passive',
				name: 'Cornered',
				max_uses: null,
				description_html:
					'**Mark a Stress** instead of **Spend a Fear** to spotlight the Ashen Tyrant.'
			},
			{
				type: 'Passive',
				name: 'Injured Wings',
				max_uses: null,
				description_html: 'While flying, the Ashen Tyrant gains a +1 bonus to their Difficulty.'
			},
			{
				type: 'Passive',
				name: 'Ashes to Ashes',
				max_uses: null,
				description_html:
					"When a PC rolls a failure while within Close range of the Ashen Tyrant, they lose a Hope and you gain a Fear. If the PC can't lose a Hope, they must mark an HP."
			},
			{
				type: 'Action',
				name: 'Desperate Rampage',
				max_uses: null,
				description_html:
					'**Mark a Stress** to make an attack against all targets within Close range. Targets the Ashen Tyrant succeeds against take **2d20+2** physical damage, are knocked back to Close range of where they were, and must **Mark a Stress**.'
			},
			{
				type: 'Action',
				name: 'Ashen Cloud',
				max_uses: null,
				description_html:
					'**Spend a Fear** to smash the ground and kick up ash within Far range. While within the ash cloud, a target has disadvantage on action rolls. The ash cloud clears the next time an adversary is spotlighted.'
			},
			{
				type: 'Action',
				name: 'Apocalyptic Thrashing',
				max_uses: null,
				description_html:
					'Countdown (**1d12**). **Spend a Fear** to activate. It ticks down when a PC rolls with Fear. When it triggers, the Ashen Tyrant thrashes about, causing environmental damage (such as an earthquake, avalanche, or collapsing walls). All targets within Far range must make a Strength Reaction Roll. Targets who fail take **2d10+10** physical damage and are *Restrained* by the rubble until they break free with a successful Strength Roll. Targets who succeed take half damage. If the Ashen Tyrant is defeated while this countdown is active, trigger the countdown immediately as the destruction caused by their death throes.'
			}
		]
	},
	perfected_zombie: {
		source_key: 'SRD',
		title: 'Perfected Zombie',
		tier: 4,
		type: 'Bruiser',
		image_url: '',
		artist_name: '',
		description: 'A towering, muscular zombie with magically infused strength and skill.',
		motives_tactics: 'Consume, hound, maim, terrify',
		difficulty: 20,
		thresholds: { major: 40, severe: 70 },
		max_hp: 9,
		max_stress: 4,
		attack_modifier: 4,
		standard_attack: {
			name: 'Greataxe',
			range: 'Very Close',
			damage_dice: '4d12',
			damage_bonus: 15,
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
					'When the Zombie makes a successful attack, all PCs within Far range lose a Hope and you gain a Fear.'
			},
			{
				type: 'Passive',
				name: 'Fearsome Presence',
				max_uses: null,
				description_html: "PCs can't spend Hope to use features against the Zombie."
			},
			{
				type: 'Action',
				name: 'Perfect Strike',
				max_uses: null,
				description_html:
					'**Mark a Stress** to make a standard attack against all targets within Very Close range. Targets the Zombie succeeds against are *Vulnerable* until their next rest.'
			},
			{
				type: 'Reaction',
				name: 'Skilled Opportunist',
				max_uses: null,
				description_html:
					"When another adversary deals damage to a target within Very Close range of the Zombie, you can **Spend a Fear** to add the Zombie's standard attack damage to the damage roll."
			}
		]
	},
	zombie_legion: {
		source_key: 'SRD',
		title: 'Zombie Legion',
		tier: 4,
		type: 'Horde',
		image_url: '',
		artist_name: '',
		description: 'A large pack of undead, still powerful despite their rotting flesh.',
		motives_tactics: 'Consume brain, shred flesh, surround',
		difficulty: 17,
		thresholds: { major: 25, severe: 45 },
		max_hp: 8,
		max_stress: 5,
		attack_modifier: 2,
		standard_attack: {
			name: 'Undead Hands',
			range: 'Close',
			damage_dice: '4d6',
			damage_bonus: 10,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Horde (2d6+5)',
				max_uses: null,
				description_html:
					'When the Legion has marked half or more of their HP, their standard attack deals **2d6+5** physical damage instead.'
			},
			{
				type: 'Passive',
				name: 'Unyielding',
				max_uses: null,
				description_html: 'The Legion has resistance to physical damage.'
			},
			{
				type: 'Passive',
				name: 'Relentless',
				max_uses: 2,
				description_html:
					'The Legion can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.'
			},
			{
				type: 'Reaction',
				name: 'Overwhelm',
				max_uses: null,
				description_html:
					'When the Legion takes Minor damage from an attack within Melee range, you can **Mark a Stress** to make a standard attack with advantage against the attacker.'
			}
		]
	}
} as const satisfies Record<string, Adversary>;
