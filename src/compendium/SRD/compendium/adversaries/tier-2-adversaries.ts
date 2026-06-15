import type { Adversary } from '../../../../convex/schemas/compendium';

export const TIER_2_ADVERSARIES = {
	archer_squadron: {
		source_key: 'SRD',
		title: 'Archer Squadron',
		tier: 2,
		type: 'Horde',
		image_url: '',
		artist_name: '',
		description: 'A group of trained archers bearing massive bows.',
		motives_tactics: 'Stick together, survive, volley fire',
		difficulty: 13,
		thresholds: { major: 8, severe: 16 },
		max_hp: 4,
		max_stress: 3,
		attack_modifier: 0,
		standard_attack: {
			name: 'Longbow',
			range: 'Far',
			damage_dice: '2d6',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Horde',
				max_uses: null,
				description_html:
					'When the Squadron has marked half or more of their HP, their standard attack deals **1d6+3** physical damage instead.'
			},
			{
				type: 'Action',
				name: 'Focused Volley',
				max_uses: null,
				description_html:
					'**Spend a Fear** to target a point within Far range. Make an attack with advantage against all targets within Close range of that point. Targets the Squadron succeeds against take **1d10+4** physical damage.'
			},
			{
				type: 'Action',
				name: 'Suppressing Fire',
				max_uses: null,
				description_html:
					'**Mark a Stress** to target a point within Far range. Until the next roll with Fear, a creature who moves within Close range of that point must make an Agility Reaction Roll. On a failure, they take **2d6+3** physical damage. On a success, they take half damage.'
			}
		]
	},
	apprentice_assassin: {
		source_key: 'SRD',
		title: 'Apprentice Assassin',
		tier: 2,
		type: 'Minion',
		image_url: '',
		artist_name: '',
		description: 'A young trainee eager to prove themselves.',
		motives_tactics: 'Act reckless, kill, prove their worth, show off',
		difficulty: 13,
		thresholds: { major: 0, severe: 0 },
		max_hp: 1,
		max_stress: 1,
		attack_modifier: -1,
		standard_attack: {
			name: 'Thrown Dagger',
			range: 'Very Close',
			damage_dice: '4',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: ['Intrusion'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Minion',
				max_uses: 6,
				description_html:
					'The Assassin is defeated when they take any damage. For every 6 damage a PC deals to the Assassin, defeat an additional Minion within range the attack would succeed against.'
			},
			{
				type: 'Action',
				name: 'Group Attack',
				max_uses: null,
				description_html:
					'**Spend a Fear** to choose a target and spotlight all Apprentice Assassins within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal **4** physical damage each. Combine this damage.'
			}
		]
	},
	assassin_poisoner: {
		source_key: 'SRD',
		title: 'Assassin Poisoner',
		tier: 2,
		type: 'Skulk',
		image_url: '',
		artist_name: '',
		description: 'A cunning scoundrel skilled in both poisons and ambushing.',
		motives_tactics: 'Anticipate, get paid, kill, taint food and water',
		difficulty: 14,
		thresholds: { major: 8, severe: 16 },
		max_hp: 4,
		max_stress: 4,
		attack_modifier: 3,
		standard_attack: {
			name: 'Poisoned Throwing Dagger',
			range: 'Close',
			damage_dice: '2d8',
			damage_bonus: 1,
			damage_type: 'phy'
		},
		experiences: ['Intrusion'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Grindletooth Venom',
				max_uses: null,
				description_html:
					"Targets who mark HP from the Assassin's attacks are *Vulnerable* until they clear a HP."
			},
			{
				type: 'Passive',
				name: 'Out of Nowhere',
				max_uses: null,
				description_html: 'The Assassin has advantage on attacks if they are Hidden.'
			},
			{
				type: 'Action',
				name: 'Fumigation',
				max_uses: null,
				description_html:
					'Drop a smoke bomb that fills the air within Close range with smoke, *Dizzying* all targets in this area. *Dizzied* targets have disadvantage on their next action roll, then clear the condition.'
			}
		]
	},
	master_assassin: {
		source_key: 'SRD',
		title: 'Master Assassin',
		tier: 2,
		type: 'Leader',
		image_url: '',
		artist_name: '',
		description: 'A seasoned killer with a threatening voice and a deadly blade.',
		motives_tactics: 'Ambush, get out alive, kill, prepare for all scenarios',
		difficulty: 15,
		thresholds: { major: 12, severe: 25 },
		max_hp: 7,
		max_stress: 5,
		attack_modifier: 5,
		standard_attack: {
			name: 'Serrated Dagger',
			range: 'Close',
			damage_dice: '2d10',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: ['Command', 'Intrusion'],
		experience_modifiers: [3, 3],
		features: [
			{
				type: 'Passive',
				name: "Won't See It Coming",
				max_uses: null,
				description_html: "The Assassin deals direct damage while they're Hidden."
			},
			{
				type: 'Action',
				name: 'Strike as One',
				max_uses: null,
				description_html:
					"**Mark a Stress** to spotlight a number of other Assassins equal to the Assassin's unmarked Stress."
			},
			{
				type: 'Reaction',
				name: 'The Subtle Blade',
				max_uses: null,
				description_html:
					'When the Assassin successfully makes a standard attack against a *Vulnerable* target, you can **Spend a Fear** to deal Severe damage instead of their standard damage.'
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html:
					'When the Assassin makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	battle_box: {
		source_key: 'SRD',
		title: 'Battle Box',
		tier: 2,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description: 'A cube-shaped construct with a different rune on each of their six sides.',
		motives_tactics: 'Change tactics, trample foes, wait in disguise',
		difficulty: 15,
		thresholds: { major: 10, severe: 20 },
		max_hp: 8,
		max_stress: 6,
		attack_modifier: 2,
		standard_attack: {
			name: 'Slam',
			range: 'Melee',
			damage_dice: '2d6',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: ['Camouflage'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Relentless',
				max_uses: 2,
				description_html:
					'The Box can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.'
			},
			{
				type: 'Action',
				name: 'Randomized Tactics',
				max_uses: null,
				description_html: `**Mark a Stress** and roll a d6. The Box uses the corresponding move:
1. **Mana Beam.** The Box fires a searing beam. Make an attack against a target within Far range. On a success, deal **2d10+2** magic damage.
2. **Fire Jets.** The Box shoots into the air, spinning and releasing jets of flame. Make an attack against all targets within Close range. Targets the Box succeeds against take **2d8** physical damage.
3. **Trample.** The Box rockets around erratically. Make an attack against all PCs within Close range. Targets the Box succeeds against take **1d6+5** physical damage and are *Vulnerable* until their next roll with Hope.
4. **Shocking Gas.** The Box sprays out a silver gas sparking with lightning. All targets within Close range must succeed on a Finesse Reaction Roll or mark 3 Stress.
5. **Stunning Clap.** The Box leaps and their sides clap, creating a small sonic boom. All targets within Very Close range must succeed on a Strength Reaction Roll or become *Vulnerable* until the cube is defeated.
6. **Psionic Whine.** The Box releases a cluster of mechanical bees whose buzz rattles mortal minds. All targets within Close range must succeed on a Presence Reaction Roll or take **2d4+9** direct magic damage.`
			},
			{
				type: 'Reaction',
				name: 'Overcharge',
				max_uses: null,
				description_html:
					"Before rolling damage for the Box's attack, you can **Mark a Stress** to add a d6 to the damage roll. Additionally, you gain a Fear."
			},
			{
				type: 'Reaction',
				name: 'Death Quake',
				max_uses: null,
				description_html:
					'When the Box marks their last HP, the magic powering them ruptures in an explosion of force. All targets within Close range must succeed on an Instinct Reaction Roll or take **2d8+1** magic damage.'
			}
		]
	},
	chaos_skull: {
		source_key: 'SRD',
		title: 'Chaos Skull',
		tier: 2,
		type: 'Ranged',
		image_url: '',
		artist_name: '',
		description: 'A floating humanoid skull animated by scintillating magic.',
		motives_tactics: 'Cackle, consume magic, serve creator',
		difficulty: 15,
		thresholds: { major: 8, severe: 16 },
		max_hp: 5,
		max_stress: 4,
		attack_modifier: 2,
		standard_attack: {
			name: 'Energy Blast',
			range: 'Close',
			damage_dice: '2d8',
			damage_bonus: 3,
			damage_type: 'mag'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Levitation',
				max_uses: null,
				description_html: "The Skull levitates several feet off the ground and can't be Restrained."
			},
			{
				type: 'Passive',
				name: 'Wards',
				max_uses: null,
				description_html: 'The Skull is resistant to magic damage.'
			},
			{
				type: 'Action',
				name: 'Magic Burst',
				max_uses: null,
				description_html:
					'**Mark a Stress** to make an attack against all targets within Close range. Targets the Skull succeeds against take **2d6+4** magic damage.'
			},
			{
				type: 'Action',
				name: 'Siphon Magic',
				max_uses: null,
				description_html:
					'**Spend a Fear** to make an attack against a PC with a Spellcast trait within Very Close range. On a success, the target marks **1d4** Stress and the Skull clears that many Stress. Additionally, on a success, the Skull can immediately be spotlighted again.'
			}
		]
	},
	conscript: {
		source_key: 'SRD',
		title: 'Conscript',
		tier: 2,
		type: 'Minion',
		image_url: '',
		artist_name: '',
		description: 'A poorly trained civilian pressed into war.',
		motives_tactics: 'Follow orders, gang up, survive',
		difficulty: 12,
		thresholds: { major: 0, severe: 0 },
		max_hp: 1,
		max_stress: 1,
		attack_modifier: 0,
		standard_attack: {
			name: 'Spears',
			range: 'Very Close',
			damage_dice: '6',
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
					'The Conscript is defeated when they take any damage. For every 6 damage a PC deals to the Conscript, defeat an additional Minion within range the attack would succeed against.'
			},
			{
				type: 'Action',
				name: 'Group Attack',
				max_uses: null,
				description_html:
					'**Spend a Fear** to choose a target and spotlight all Conscripts within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal **6** physical damage each. Combine this damage.'
			}
		]
	},
	courtesan: {
		source_key: 'SRD',
		title: 'Courtesan',
		tier: 2,
		type: 'Social',
		image_url: '',
		artist_name: '',
		description: 'An accomplished manipulator and master of the social arts.',
		motives_tactics: 'Entice, maneuver, secure patrons',
		difficulty: 13,
		thresholds: { major: 7, severe: 13 },
		max_hp: 3,
		max_stress: 4,
		attack_modifier: -3,
		standard_attack: {
			name: 'Dagger',
			range: 'Melee',
			damage_dice: '1d4',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: ['Manipulation', 'Socialite'],
		experience_modifiers: [3, 3],
		features: [
			{
				type: 'Reaction',
				name: 'Searing Glance',
				max_uses: null,
				description_html:
					"When a PC within Close range makes a Presence Roll, you can **Mark a Stress** to cast a gaze toward the aftermath. On the target's failure, they must mark 2 Stress and are *Vulnerable* until the scene ends or they succeed on a social action against the Courtesan. On the target's success, they must mark a Stress."
			}
		]
	},
	cult_adept: {
		source_key: 'SRD',
		title: 'Cult Adept',
		tier: 2,
		type: 'Support',
		image_url: '',
		artist_name: '',
		description: 'An experienced mage wielding shadow and fear.',
		motives_tactics: 'Curry favor, hinder foes, uncover knowledge',
		difficulty: 14,
		thresholds: { major: 9, severe: 18 },
		max_hp: 4,
		max_stress: 6,
		attack_modifier: 2,
		standard_attack: {
			name: 'Rune-Covered Rod',
			range: 'Far',
			damage_dice: '2d4',
			damage_bonus: 3,
			damage_type: 'mag'
		},
		experiences: ['Fallen Lore', 'Rituals'],
		experience_modifiers: [2, 2],
		features: [
			{
				type: 'Action',
				name: 'Enervating Blast',
				max_uses: null,
				description_html:
					'**Spend a Fear** to make a standard attack against a target within range. On a success, the target must mark a Stress.'
			},
			{
				type: 'Action',
				name: 'Shroud of the Fallen',
				max_uses: null,
				description_html:
					'**Mark a Stress** to wrap an ally within Close range in a shroud of Protection until the Adept marks their last HP. While Protected, the target has resistance to all damage.'
			},
			{
				type: 'Action',
				name: 'Shadow Shackles',
				max_uses: null,
				description_html:
					'**Spend a Fear** and choose a point within Far range. All targets within Close range of that point are *Restrained* in smoky chains until they break free with a successful Strength or Instinct Roll. A target *Restrained* by this feature must spend a Hope to make an action roll.'
			},
			{
				type: 'Reaction',
				name: 'Fear Is Fuel',
				max_uses: null,
				description_html: 'Twice per scene, when a PC rolls a failure with Fear, clear a Stress.'
			}
		]
	},
	cult_fang: {
		source_key: 'SRD',
		title: 'Cult Fang',
		tier: 2,
		type: 'Skulk',
		image_url: '',
		artist_name: '',
		description: 'A professional killer-turned-cultist.',
		motives_tactics: 'Capture sacrifices, isolate prey, rise in the ranks',
		difficulty: 15,
		thresholds: { major: 9, severe: 17 },
		max_hp: 4,
		max_stress: 4,
		attack_modifier: 2,
		standard_attack: {
			name: 'Long Knife',
			range: 'Melee',
			damage_dice: '2d8',
			damage_bonus: 4,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: "Shadow's Embrace",
				max_uses: null,
				description_html:
					'The Fang can climb and walk on vertical surfaces. **Mark a Stress** to move from one shadow to another within Far range.'
			},
			{
				type: 'Action',
				name: 'Pick Off the Straggler',
				max_uses: null,
				description_html:
					'**Mark a Stress** to cause a target within Melee range to make an Instinct Reaction Roll. On a failure, the target must mark 2 Stress and is teleported with the Fang to a shadow within Far range, making them temporarily *Vulnerable*. On a success, the target must mark a Stress.'
			}
		]
	},
	cult_initiate: {
		source_key: 'SRD',
		title: 'Cult Initiate',
		tier: 2,
		type: 'Minion',
		image_url: '',
		artist_name: '',
		description: 'A low-ranking cultist in simple robes, eager to gain power.',
		motives_tactics: 'Follow orders, gain power, seek forbidden knowledge',
		difficulty: 13,
		thresholds: { major: 0, severe: 0 },
		max_hp: 1,
		max_stress: 1,
		attack_modifier: 0,
		standard_attack: {
			name: 'Ritual Dagger',
			range: 'Melee',
			damage_dice: '5',
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
					'The Initiate is defeated when they take any damage. For every 6 damage a PC deals to the Initiate, defeat an additional Minion within range the attack would succeed against.'
			},
			{
				type: 'Action',
				name: 'Group Attack',
				max_uses: null,
				description_html:
					'**Spend a Fear** to choose a target and spotlight all Cult Initiates within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal **5** physical damage each. Combine this damage.'
			}
		]
	},
	demonic_hound_pack: {
		source_key: 'SRD',
		title: 'Demonic Hound Pack',
		tier: 2,
		type: 'Horde',
		image_url: '',
		artist_name: '',
		description: 'Unnatural hounds lit from within by hellfire.',
		motives_tactics: 'Cause fear, consume flesh, please masters',
		difficulty: 15,
		thresholds: { major: 11, severe: 23 },
		max_hp: 6,
		max_stress: 3,
		attack_modifier: 0,
		standard_attack: {
			name: 'Claws and Fangs',
			range: 'Melee',
			damage_dice: '2d8',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: ['Scent Tracking'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Horde (2d4+1)',
				max_uses: null,
				description_html:
					'When the Pack has marked half or more of their HP, their standard attack deals **2d4+1** physical damage instead.'
			},
			{
				type: 'Action',
				name: 'Dreadhowl',
				max_uses: null,
				description_html:
					'**Mark a Stress** to make all targets within Very Close range lose a Hope. If a target is not able to lose a Hope, they must instead mark 2 Stress.'
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html: 'When the Pack makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	electric_eels: {
		source_key: 'SRD',
		title: 'Electric Eels',
		tier: 2,
		type: 'Horde',
		image_url: '',
		artist_name: '',
		description: 'A swarm of eels that encircle and electrocute.',
		motives_tactics: 'Avoid larger predators, shock prey, tear apart',
		difficulty: 14,
		thresholds: { major: 10, severe: 20 },
		max_hp: 5,
		max_stress: 3,
		attack_modifier: 0,
		standard_attack: {
			name: 'Shocking Bite',
			range: 'Melee',
			damage_dice: '2d6',
			damage_bonus: 4,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Horde (2d4+1)',
				max_uses: null,
				description_html:
					'When the Eels have marked half or more of their HP, their standard attack deals **2d4+1** physical damage instead.'
			},
			{
				type: 'Action',
				name: 'Paralyzing Shock',
				max_uses: null,
				description_html:
					'**Mark a Stress** to make a standard attack against all targets within Very Close range. You gain a Fear for each target that marks HP.'
			}
		]
	},
	elite_soldier: {
		source_key: 'SRD',
		title: 'Elite Soldier',
		tier: 2,
		type: 'Standard',
		image_url: '',
		artist_name: '',
		description: 'An armored squire or experienced commoner looking to advance.',
		motives_tactics: 'Gain glory, keep order, make alliances',
		difficulty: 15,
		thresholds: { major: 9, severe: 18 },
		max_hp: 4,
		max_stress: 3,
		attack_modifier: 1,
		standard_attack: {
			name: 'Spear',
			range: 'Very Close',
			damage_dice: '2d8',
			damage_bonus: 4,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Action',
				name: 'Reinforce',
				max_uses: null,
				description_html:
					'**Mark a Stress** to move into Melee range of an ally and make a standard attack against a target within Very Close range. On a success, deal **2d10+2** physical damage and the ally can clear a Stress.'
			},
			{
				type: 'Reaction',
				name: "Vassal's Loyalty",
				max_uses: null,
				description_html:
					'When the Soldier is within Very Close range of a knight or other noble who would take damage, you can **Mark a Stress** to move into Melee range of them and take the damage instead.'
			}
		]
	},
	failed_experiment: {
		source_key: 'SRD',
		title: 'Failed Experiment',
		tier: 2,
		type: 'Standard',
		image_url: '',
		artist_name: '',
		description: 'A magical necromantic experiment gone wrong, leaving them warped and ungainly.',
		motives_tactics: 'Devour, hunt, track',
		difficulty: 13,
		thresholds: { major: 12, severe: 23 },
		max_hp: 3,
		max_stress: 3,
		attack_modifier: 1,
		standard_attack: {
			name: 'Bite and Claw',
			range: 'Melee',
			damage_dice: '2d6',
			damage_bonus: 5,
			damage_type: 'phy'
		},
		experiences: ['Copycat'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Warped Fortitude',
				max_uses: null,
				description_html: 'The Experiment is resistant to physical damage.'
			},
			{
				type: 'Passive',
				name: 'Overwhelm',
				max_uses: null,
				description_html:
					'When a target the Experiment attacks has other adversaries within Very Close range, the Experiment deals double damage.'
			},
			{
				type: 'Action',
				name: 'Lurching Lunge',
				max_uses: null,
				description_html:
					'**Mark a Stress** to spotlight the Experiment as an additional GM move instead of spending Fear.'
			}
		]
	},
	giant_beastmaster: {
		source_key: 'SRD',
		title: 'Giant Beastmaster',
		tier: 2,
		type: 'Leader',
		image_url: '',
		artist_name: '',
		description: 'A leather-clad warrior bearing a whip and massive bow.',
		motives_tactics: 'Command, make a living, maneuver, pin down, protect companion animals',
		difficulty: 16,
		thresholds: { major: 12, severe: 24 },
		max_hp: 6,
		max_stress: 5,
		attack_modifier: 2,
		standard_attack: {
			name: 'Longbow',
			range: 'Far',
			damage_dice: '2d8',
			damage_bonus: 4,
			damage_type: 'phy'
		},
		experiences: ['Animal Handling'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Two as One',
				max_uses: null,
				description_html:
					'When the Beastmaster is spotlighted, you can also spotlight a Tier 1 animal adversary currently under their control.'
			},
			{
				type: 'Action',
				name: 'Pinning Strike',
				max_uses: null,
				description_html:
					'Make a standard attack against a target. On a success, you can **Mark a Stress** to pin them to a nearby surface. The pinned target is *Restrained* until they break free with a successful Finesse or Strength Roll.'
			},
			{
				type: 'Action',
				name: 'Deadly Companion',
				max_uses: null,
				description_html:
					"Twice per scene, summon a Bear, Dire Wolf, or similar Tier 1 animal adversary under the Beastmaster's control. The adversary appears at Close range and is immediately spotlighted."
			}
		]
	},
	giant_brawler: {
		source_key: 'SRD',
		title: 'Giant Brawler',
		tier: 2,
		type: 'Bruiser',
		image_url: '',
		artist_name: '',
		description: 'An especially muscular giant wielding a warhammer larger than a human.',
		motives_tactics: 'Make a living, overwhelm, slam, topple',
		difficulty: 15,
		thresholds: { major: 14, severe: 28 },
		max_hp: 7,
		max_stress: 4,
		attack_modifier: 2,
		standard_attack: {
			name: 'Warhammer',
			range: 'Very Close',
			damage_dice: '2d12',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: ['Intrusion'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Action',
				name: 'Battering Ram',
				max_uses: null,
				description_html:
					'**Mark a Stress** to have the Brawler charge at an inanimate object within Close range they could feasibly smash (such as a wall, cart, or market stand) and destroy it. All targets within Very Close range of the object must succeed on an Agility Reaction Roll or take **2d4+3** physical damage from the shrapnel.'
			},
			{
				type: 'Reaction',
				name: 'Bloody Reprisal',
				max_uses: null,
				description_html:
					'When the Brawler marks 2 or more HP from an attack within Very Close range, you can make a standard attack against the attacker. On a success, the Brawler deals **2d6+15** physical damage instead of their standard damage.'
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html:
					'When the Brawler makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	giant_recruit: {
		source_key: 'SRD',
		title: 'Giant Recruit',
		tier: 2,
		type: 'Minion',
		image_url: '',
		artist_name: '',
		description: 'A giant fighter wearing borrowed armor.',
		motives_tactics: 'Batter, make a living, overwhelm, terrify',
		difficulty: 13,
		thresholds: { major: 0, severe: 0 },
		max_hp: 1,
		max_stress: 2,
		attack_modifier: 1,
		standard_attack: {
			name: 'Warhammer',
			range: 'Very Close',
			damage_dice: '5',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Minion',
				max_uses: 7,
				description_html:
					'The Recruit is defeated when they take any damage. For every 7 damage a PC deals to the Recruit, defeat an additional Minion within range the attack would succeed against.'
			},
			{
				type: 'Action',
				name: 'Group Attack',
				max_uses: null,
				description_html:
					'**Spend a Fear** to choose a target and spotlight all Giant Recruits within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal **5** physical damage each. Combine this damage.'
			}
		]
	},
	giant_eagle: {
		source_key: 'SRD',
		title: 'Giant Eagle',
		tier: 2,
		type: 'Skulk',
		image_url: '',
		artist_name: '',
		description: 'A giant bird of prey with blood-stained talons.',
		motives_tactics: 'Hunt prey, stay mobile, strike decisively',
		difficulty: 14,
		thresholds: { major: 8, severe: 19 },
		max_hp: 4,
		max_stress: 4,
		attack_modifier: 1,
		standard_attack: {
			name: 'Claws and Beak',
			range: 'Very Close',
			damage_dice: '2d6',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Flight',
				max_uses: null,
				description_html: 'While flying, the Eagle gains a +3 bonus to their Difficulty.'
			},
			{
				type: 'Action',
				name: 'Deadly Dive',
				max_uses: null,
				description_html:
					'**Mark a Stress** to attack a target within Far range. On a success, deal **2d10+2** physical damage and knock the target over, making them *Vulnerable* until they next act.'
			},
			{
				type: 'Action',
				name: 'Take Off',
				max_uses: null,
				description_html:
					"Make an attack against a target within Very Close range. On a success, deal **2d4+3** physical damage and the target must succeed on an Agility Reaction Roll or become temporarily *Restrained* within the Eagle's massive talons. If the target is *Restrained*, the Eagle immediately lifts into the air to Very Far range above the battlefield while holding them."
			},
			{
				type: 'Action',
				name: 'Deadly Drop',
				max_uses: null,
				description_html:
					"While flying, the Eagle can drop a *Restrained* target they are holding. When dropped, the target is no longer *Restrained* but starts falling. If their fall isn't prevented during the PCs' next action, the target takes **2d20** physical damage when they land."
			}
		]
	},
	gorgon: {
		source_key: 'SRD',
		title: 'Gorgon',
		tier: 2,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description:
			'A snake-headed, scaled humanoid with a gilded bow, enraged that their peace has been disturbed.',
		motives_tactics: 'Corner, hit-and-run, petrify, seek vengeance',
		difficulty: 15,
		thresholds: { major: 13, severe: 25 },
		max_hp: 9,
		max_stress: 3,
		attack_modifier: 4,
		standard_attack: {
			name: 'Sunsear Shortbow',
			range: 'Far',
			damage_dice: '2d20',
			damage_bonus: 3,
			damage_type: 'mag'
		},
		experiences: ['Stealth'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Relentless',
				max_uses: 2,
				description_html:
					'The Gorgon can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.'
			},
			{
				type: 'Passive',
				name: 'Sunsear Arrows',
				max_uses: null,
				description_html:
					"When the Gorgon makes a successful standard attack, the target *Glows* until the end of the scene and can't become *Hidden*. Attack rolls made against a *Glowing* target have advantage."
			},
			{
				type: 'Action',
				name: 'Crown of Serpents',
				max_uses: null,
				description_html:
					"Make an attack roll against a target within Melee range using the Gorgon's protective snakes. On a success, **Mark a Stress** to deal **2d10+4** physical damage and the target must mark a Stress."
			},
			{
				type: 'Reaction',
				name: 'Petrifying Gaze',
				max_uses: null,
				description_html:
					'When the Gorgon takes damage from an attack within Close range, you can **Spend a Fear** to force the attacker to make an Instinct Reaction Roll. On a failure, they begin to turn to stone, marking a HP and starting a Petrification Countdown (4). This countdown ticks down when the Gorgon is attacked. When it triggers, the target must make a death move. If the Gorgon is defeated, all petrification countdowns end.'
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html: 'When the Gorgon makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	juvenile_flickerfly: {
		source_key: 'SRD',
		title: 'Juvenile Flickerfly',
		tier: 2,
		type: 'Solo',
		image_url: '',
		artist_name: '',
		description:
			'A horse-sized insect with iridescent scales and crystalline wings moving faster than the eye can see.',
		motives_tactics: 'Collect shiny things, hunt, swoop',
		difficulty: 14,
		thresholds: { major: 13, severe: 26 },
		max_hp: 10,
		max_stress: 5,
		attack_modifier: 3,
		standard_attack: {
			name: 'Wing Slash',
			range: 'Very Close',
			damage_dice: '2d10',
			damage_bonus: 4,
			damage_type: 'phy'
		},
		experiences: [],
		experience_modifiers: [],
		features: [
			{
				type: 'Passive',
				name: 'Relentless',
				max_uses: 3,
				description_html:
					'The Flickerfly can be spotlighted up to three times per GM turn. Spend Fear as usual to spotlight them.'
			},
			{
				type: 'Passive',
				name: 'Peerless Accuracy',
				max_uses: null,
				description_html:
					"Before the Flickerfly makes an attack, roll a d6. On a result of 4 or higher, the target's Evasion is halved against this attack."
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
					'Countdown (Loop 1d6). When the Flickerfly takes damage for the first time, activate the countdown. When it triggers, the Flickerfly breathes hallucinatory gas on all targets in front of them up to Far range. Targets must succeed on an Instinct Reaction Roll or be tormented by fearful hallucinations. Targets whose fears are known to the Flickerfly have disadvantage on this roll. Targets who fail must mark a Stress and lose a Hope.'
			}
		]
	},
	knight_of_the_realm: {
		source_key: 'SRD',
		title: 'Knight of the Realm',
		tier: 2,
		type: 'Leader',
		image_url: '',
		artist_name: '',
		description: 'A decorated soldier with heavy armor and a powerful steed.',
		motives_tactics: 'Run down, seek glory, show dominance',
		difficulty: 15,
		thresholds: { major: 13, severe: 26 },
		max_hp: 6,
		max_stress: 4,
		attack_modifier: 4,
		standard_attack: {
			name: 'Longsword',
			range: 'Melee',
			damage_dice: '2d10',
			damage_bonus: 4,
			damage_type: 'phy'
		},
		experiences: ['Ancient Knowledge', 'High Society', 'Tactics'],
		experience_modifiers: [3, 2, 2],
		features: [
			{
				type: 'Passive',
				name: 'Chevalier',
				max_uses: null,
				description_html:
					"While the Knight is on a mount, they gain a +2 bonus to their Difficulty. When they take Severe damage, they're knocked from their mount and lose this benefit until they're next spotlighted."
			},
			{
				type: 'Passive',
				name: 'Heavily Armored',
				max_uses: null,
				description_html: 'When the Knight takes physical damage, reduce it by 3.'
			},
			{
				type: 'Action',
				name: 'Cavalry Charge',
				max_uses: null,
				description_html:
					'If the Knight is mounted, move up to Far range and make a standard attack against a target. On a success, deal **2d8+4** physical damage and the target must mark a Stress.'
			},
			{
				type: 'Action',
				name: 'For the Realm!',
				max_uses: null,
				description_html:
					'**Mark a Stress** to spotlight **1d4+1** allies. Attacks they make while spotlighted in this way deal half damage.'
			}
		]
	},
	masked_thief: {
		source_key: 'SRD',
		title: 'Masked Thief',
		tier: 2,
		type: 'Skulk',
		image_url: '',
		artist_name: '',
		description: 'A cunning thief with acrobatic skill and a flair for the dramatic.',
		motives_tactics: 'Evade, hide, pilfer, profit',
		difficulty: 14,
		thresholds: { major: 8, severe: 17 },
		max_hp: 4,
		max_stress: 5,
		attack_modifier: 3,
		standard_attack: {
			name: 'Backsword',
			range: 'Melee',
			damage_dice: '2d8',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: ['Acrobatics'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Action',
				name: 'Quick Hands',
				max_uses: null,
				description_html:
					"Make an attack against a target within Melee range. On a success, deal **1d8+2** physical damage and the Thief steals one item or consumable from the target's inventory."
			},
			{
				type: 'Action',
				name: 'Escape Plan',
				max_uses: null,
				description_html:
					'**Mark a Stress** to reveal a snare trap set anywhere on the battlefield by the Thief. All targets within Very Close range of the trap must succeed on an Agility Reaction Roll (13) or be pulled off their feet and suspended upside down. A target is *Restrained* and *Vulnerable* until they break free, ending both conditions, with a successful Finesse or Strength Roll (13).'
			}
		]
	},
	merchant_baron: {
		source_key: 'SRD',
		title: 'Merchant Baron',
		tier: 2,
		type: 'Social',
		image_url: '',
		artist_name: '',
		description: 'An accomplished merchant with a large operation under their command.',
		motives_tactics: 'Abuse power, gather resources, mobilize minions',
		difficulty: 15,
		thresholds: { major: 9, severe: 19 },
		max_hp: 5,
		max_stress: 3,
		attack_modifier: -2,
		standard_attack: {
			name: 'Rapier',
			range: 'Melee',
			damage_dice: '1d6',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: ['Nobility', 'Trade'],
		experience_modifiers: [2, 2],
		features: [
			{
				type: 'Action',
				name: 'Everyone Has a Price',
				max_uses: null,
				description_html:
					'**Spend a Fear** to offer a target a dangerous bargain for something they want or need. If used on a PC, they must make a Presence Reaction Roll (17). On a failure, they must mark 2 Stress or take the deal.'
			},
			{
				type: 'Action',
				name: 'The Best Muscle Money Can Buy',
				max_uses: null,
				description_html:
					"Once per scene, **Mark a Stress** to summon **1d4+1** Tier 1 adversaries, who appear at Far range, to enforce the Baron's will."
			}
		]
	},
	minotaur_wrecker: {
		source_key: 'SRD',
		title: 'Minotaur Wrecker',
		tier: 2,
		type: 'Bruiser',
		image_url: '',
		artist_name: '',
		description: 'A massive bull-headed firbolg with a quick temper.',
		motives_tactics: 'Consume, gore, navigate, overpower, pursue',
		difficulty: 16,
		thresholds: { major: 14, severe: 27 },
		max_hp: 7,
		max_stress: 5,
		attack_modifier: 2,
		standard_attack: {
			name: 'Battleaxe',
			range: 'Very Close',
			damage_dice: '2d8',
			damage_bonus: 5,
			damage_type: 'phy'
		},
		experiences: ['Navigation'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Ramp Up',
				max_uses: null,
				description_html:
					'You must **Spend a Fear** to spotlight the Minotaur. While spotlighted, they can make their standard attack against all targets within range.'
			},
			{
				type: 'Action',
				name: 'Charging Bull',
				max_uses: null,
				description_html:
					"**Mark a Stress** to charge through a group within Close range and make an attack against all targets in the Minotaur's path. Targets the Minotaur succeeds against take **2d6+8** physical damage and are knocked back to Very Far range. If a target is knocked into a solid object or another creature, they take an extra **1d6** damage (combine the damage)."
			},
			{
				type: 'Action',
				name: 'Gore',
				max_uses: null,
				description_html:
					'Make an attack against a target within Very Close range, moving the Minotaur into Melee range of them. On a success, deal **2d8** direct physical damage.'
			}
		]
	},
	mortal_hunter: {
		source_key: 'SRD',
		title: 'Mortal Hunter',
		tier: 2,
		type: 'Leader',
		image_url: '',
		artist_name: '',
		description:
			'An undead figure wearing a heavy leather coat, with searching eyes and a casually cruel demeanor.',
		motives_tactics: 'Devour, hunt, track',
		difficulty: 16,
		thresholds: { major: 15, severe: 27 },
		max_hp: 6,
		max_stress: 4,
		attack_modifier: 5,
		standard_attack: {
			name: 'Tear at Flesh',
			range: 'Very Close',
			damage_dice: '2d12',
			damage_bonus: 1,
			damage_type: 'phy'
		},
		experiences: ['Bloodhound'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Terrifying',
				max_uses: null,
				description_html:
					'When the Hunter makes a successful attack, all PCs within Far range lose a Hope and you gain a Fear.'
			},
			{
				type: 'Action',
				name: 'Deathlock',
				max_uses: null,
				description_html:
					'**Spend a Fear** to curse a target within Very Close range with a necrotic *Deathlock* until the end of the scene. Attacks made by the Hunter against a *Deathlocked* target deal direct damage. The Hunter can only maintain one Deathlock at a time.'
			},
			{
				type: 'Action',
				name: 'Inevitable Death',
				max_uses: null,
				description_html:
					'**Mark a Stress** to spotlight **1d4** allies. Attacks they make while spotlighted in this way deal half damage.'
			},
			{
				type: 'Reaction',
				name: 'Rampage',
				max_uses: null,
				description_html:
					'Countdown (Loop 1d6). When the Hunter is in the spotlight for the first time, activate the countdown. When it triggers, move the Hunter in a straight line to a point within Far range and make an attack against all targets in their path. Targets the Hunter succeeds against take **2d8+2** physical damage.'
			}
		]
	},
	royal_advisor: {
		source_key: 'SRD',
		title: 'Royal Advisor',
		tier: 2,
		type: 'Social',
		image_url: '',
		artist_name: '',
		description: 'A high-ranking courtier with the ear of the local nobility.',
		motives_tactics: 'Curry favor, manufacture evidence, scheme',
		difficulty: 14,
		thresholds: { major: 8, severe: 15 },
		max_hp: 3,
		max_stress: 3,
		attack_modifier: -3,
		standard_attack: {
			name: 'Wand',
			range: 'Far',
			damage_dice: '1d4',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: ['Administration', 'Courtier'],
		experience_modifiers: [3, 3],
		features: [
			{
				type: 'Passive',
				name: 'Devastating Retort',
				max_uses: null,
				description_html:
					'A PC who rolls less than 17 on an action roll targeting the Advisor must mark a Stress.'
			},
			{
				type: 'Action',
				name: 'Bend Ears',
				max_uses: null,
				description_html:
					"**Mark a Stress** to influence an NPC within Melee range with whispered words. That target's opinion on one matter shifts toward the Advisor's preference unless it is in direct opposition to the target's motives."
			},
			{
				type: 'Action',
				name: 'Scapegoat',
				max_uses: null,
				description_html:
					'**Spend a Fear** to convince a crowd or notable individual that one person or group is responsible for some problem facing the target. The target becomes hostile to the scapegoat until convinced of their innocence with a successful Presence Roll (17).'
			}
		]
	},
	secret_keeper: {
		source_key: 'SRD',
		title: 'Secret-Keeper',
		tier: 2,
		type: 'Leader',
		image_url: '',
		artist_name: '',
		description: 'A clandestine leader with a direct channel to the Fallen Gods.',
		motives_tactics: 'Amass great power, plot, take command',
		difficulty: 16,
		thresholds: { major: 13, severe: 26 },
		max_hp: 7,
		max_stress: 4,
		attack_modifier: 3,
		standard_attack: {
			name: 'Sigil-laden Staff',
			range: 'Far',
			damage_dice: '2d12',
			damage_bonus: 0,
			damage_type: 'mag'
		},
		experiences: ['Coercion', 'Fallen Lore'],
		experience_modifiers: [2, 2],
		features: [
			{
				type: 'Action',
				name: 'Seize Your Moment',
				max_uses: null,
				description_html:
					'**Spend 2 Fear** to spotlight **1d4** allies. Attacks they make while spotlighted in this way deal half damage.'
			},
			{
				type: 'Reaction',
				name: "Our Master's Will",
				max_uses: null,
				description_html:
					'When you spotlight an ally within Far range, **Mark a Stress** to gain a Fear.'
			},
			{
				type: 'Reaction',
				name: 'Summoning Ritual',
				max_uses: null,
				description_html:
					'Countdown (6). When the Secret-Keeper is in the spotlight for the first time, activate the countdown. When they mark HP, tick down this countdown by the number of HP marked. When it triggers, summon a Minor Demon who appears at Close range.'
			},
			{
				type: 'Reaction',
				name: 'Fallen Hounds',
				max_uses: null,
				description_html:
					'Once per scene, when the Secret-Keeper marks 2 or more HP, you can **Mark a Stress** to summon a Demonic Hound Pack, which appears at Close range and is immediately spotlighted.'
			}
		]
	},
	shark: {
		source_key: 'SRD',
		title: 'Shark',
		tier: 2,
		type: 'Bruiser',
		image_url: '',
		artist_name: '',
		description: 'A large aquatic predator, always on the move.',
		motives_tactics: 'Find the blood, isolate prey, target the weak',
		difficulty: 14,
		thresholds: { major: 14, severe: 28 },
		max_hp: 7,
		max_stress: 3,
		attack_modifier: 2,
		standard_attack: {
			name: 'Toothy Maw',
			range: 'Very Close',
			damage_dice: '2d12',
			damage_bonus: 1,
			damage_type: 'phy'
		},
		experiences: ['Sense of Smell'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Terrifying',
				max_uses: null,
				description_html:
					'When the Shark makes a successful attack, all PCs within Far range lose a Hope and you gain a Fear.'
			},
			{
				type: 'Passive',
				name: 'Rending Bite',
				max_uses: null,
				description_html:
					"When the Shark makes a successful attack, the target must mark an Armor Slot without receiving its benefits (they can still use armor to reduce the damage). If they can't mark an Armor Slot, they must mark an additional HP."
			},
			{
				type: 'Reaction',
				name: 'Blood in the Water',
				max_uses: null,
				description_html:
					"When a creature within Close range of the Shark marks HP from another creature's attack, you can **Mark a Stress** to immediately spotlight the Shark, moving them into Melee range of the target and making a standard attack."
			}
		]
	},
	siren: {
		source_key: 'SRD',
		title: 'Siren',
		tier: 2,
		type: 'Skulk',
		image_url: '',
		artist_name: '',
		description: 'A half-fish person with shimmering scales and an irresistible voice.',
		motives_tactics: 'Consume, lure prey, subdue with song',
		difficulty: 14,
		thresholds: { major: 9, severe: 18 },
		max_hp: 5,
		max_stress: 3,
		attack_modifier: 2,
		standard_attack: {
			name: 'Distended Jaw Bite',
			range: 'Melee',
			damage_dice: '2d6',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: ['Song Repertoire'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Captive Audience',
				max_uses: null,
				description_html:
					'If the Siren makes a standard attack against a target *Entranced* by their song, the attack deals **2d10+1** damage instead of their standard damage.'
			},
			{
				type: 'Action',
				name: 'Enchanting Song',
				max_uses: null,
				description_html:
					"**Spend a Fear** to sing a song that affects all targets within Close range. Targets must succeed on an Instinct Reaction Roll or become *Entranced* until they mark 2 Stress. Other Sirens within Close range of the target can **Mark a Stress** to each add a +1 bonus to the Difficulty of the reaction roll. While *Entranced*, a target can't act and is *Vulnerable*."
			}
		]
	},
	spectral_archer: {
		source_key: 'SRD',
		title: 'Spectral Archer',
		tier: 2,
		type: 'Ranged',
		image_url: '',
		artist_name: '',
		description:
			'A ghostly fighter with an ethereal bow, unable to move on while their charge is vulnerable.',
		motives_tactics: 'Move through solid objects, stay out of the fray, rehash old battles',
		difficulty: 13,
		thresholds: { major: 6, severe: 14 },
		max_hp: 3,
		max_stress: 3,
		attack_modifier: 3,
		standard_attack: {
			name: 'Longbow',
			range: 'Far',
			damage_dice: '2d10',
			damage_bonus: 2,
			damage_type: 'phy'
		},
		experiences: ['Ancient Knowledge'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Ghost',
				max_uses: null,
				description_html:
					'The Archer has resistance to physical damage. **Mark a Stress** to move up to Close range through solid objects.'
			},
			{
				type: 'Action',
				name: 'Pick Your Target',
				max_uses: null,
				description_html:
					'**Spend a Fear** to make an attack within Far range against a PC who is within Very Close range of at least two other PCs. On a success, the target takes **2d8+12** physical damage.'
			}
		]
	},
	spectral_captain: {
		source_key: 'SRD',
		title: 'Spectral Captain',
		tier: 2,
		type: 'Leader',
		image_url: '',
		artist_name: '',
		description: 'A ghostly commander leading their troops beyond death.',
		motives_tactics: 'Move through solid objects, rally troops, rehash old battles',
		difficulty: 16,
		thresholds: { major: 13, severe: 26 },
		max_hp: 6,
		max_stress: 4,
		attack_modifier: 3,
		standard_attack: {
			name: 'Longbow',
			range: 'Far',
			damage_dice: '2d10',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: ['Ancient Knowledge'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Ghost',
				max_uses: null,
				description_html:
					'The Captain has resistance to physical damage. **Mark a Stress** to move up to Close range through solid objects.'
			},
			{
				type: 'Action',
				name: 'Unending Battle',
				max_uses: null,
				description_html:
					'**Spend 2 Fear** to return up to **1d4+1** defeated Spectral allies to the battle at the points where they first appeared (with no marked HP or Stress).'
			},
			{
				type: 'Reaction',
				name: 'Hold Fast',
				max_uses: null,
				description_html:
					"When the Captain's Spectral allies are forced to make a reaction roll, you can **Mark a Stress** to give those allies a +2 bonus to the roll."
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
	spectral_guardian: {
		source_key: 'SRD',
		title: 'Spectral Guardian',
		tier: 2,
		type: 'Standard',
		image_url: '',
		artist_name: '',
		description: 'A ghostly fighter with spears and swords, anchored by duty.',
		motives_tactics: 'Move through solid objects, protect treasure, rehash old battles',
		difficulty: 15,
		thresholds: { major: 7, severe: 15 },
		max_hp: 4,
		max_stress: 3,
		attack_modifier: 1,
		standard_attack: {
			name: 'Spear',
			range: 'Very Close',
			damage_dice: '2d8',
			damage_bonus: 1,
			damage_type: 'phy'
		},
		experiences: ['Ancient Knowledge'],
		experience_modifiers: [2],
		features: [
			{
				type: 'Passive',
				name: 'Ghost',
				max_uses: null,
				description_html:
					'The Guardian has resistance to physical damage. **Mark a Stress** to move up to Close range through solid objects.'
			},
			{
				type: 'Action',
				name: 'Grave Blade',
				max_uses: null,
				description_html:
					'**Spend a Fear** to make an attack against a target within Very Close range. On a success, deal **2d10+6** physical damage and the target must mark a Stress.'
			}
		]
	},
	spy: {
		source_key: 'SRD',
		title: 'Spy',
		tier: 2,
		type: 'Social',
		image_url: '',
		artist_name: '',
		description:
			'A skilled espionage agent with a knack for being in the right place to overhear secrets.',
		motives_tactics: 'Cut and run, disguise appearance, eavesdrop',
		difficulty: 15,
		thresholds: { major: 8, severe: 17 },
		max_hp: 4,
		max_stress: 3,
		attack_modifier: -2,
		standard_attack: {
			name: 'Dagger',
			range: 'Melee',
			damage_dice: '2d6',
			damage_bonus: 3,
			damage_type: 'phy'
		},
		experiences: ['Espionage'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Action',
				name: 'Gathering Secrets',
				max_uses: null,
				description_html:
					'**Spend a Fear** to describe how the Spy knows a secret about a PC in the scene.'
			},
			{
				type: 'Reaction',
				name: 'Fly on the Wall',
				max_uses: null,
				description_html:
					'When a PC or group is discussing something sensitive, you can **Mark a Stress** to reveal that the Spy is present in the scene, observing them. If the Spy escapes the scene to report their findings, you gain **1d4** Fear.'
			}
		]
	},
	stonewraith: {
		source_key: 'SRD',
		title: 'Stonewraith',
		tier: 2,
		type: 'Skulk',
		image_url: '',
		artist_name: '',
		description: 'A prowling hunter, like a slinking mountain lion, with a slate-gray stone body.',
		motives_tactics: 'Defend territory, isolate prey, stalk',
		difficulty: 13,
		thresholds: { major: 11, severe: 22 },
		max_hp: 6,
		max_stress: 3,
		attack_modifier: 3,
		standard_attack: {
			name: 'Bite and Claws',
			range: 'Melee',
			damage_dice: '2d8',
			damage_bonus: 6,
			damage_type: 'phy'
		},
		experiences: ['Stonesense'],
		experience_modifiers: [3],
		features: [
			{
				type: 'Passive',
				name: 'Stonestrider',
				max_uses: null,
				description_html:
					'The Stonewraith can move through stone and earth as easily as air. While within stone or earth, they are *Hidden* and immune to all damage.'
			},
			{
				type: 'Action',
				name: 'Rocky Ambush',
				max_uses: null,
				description_html:
					'While *Hidden*, **Mark a Stress** to leap into Melee range with a target within Very Close range. The target must succeed on an Agility or Instinct Reaction Roll (15) or take **2d8** physical damage and become temporarily *Restrained*.'
			},
			{
				type: 'Action',
				name: 'Avalanche Roar',
				max_uses: null,
				description_html:
					'**Spend a Fear** to roar while within a cave and cause a cave-in. All targets within Close range must succeed on an Agility Reaction Roll (14) or take **2d10** physical damage. The rubble can be cleared with a Progress Countdown (8).'
			},
			{
				type: 'Reaction',
				name: 'Momentum',
				max_uses: null,
				description_html:
					'When the Stonewraith makes a successful attack against a PC, you gain a Fear.'
			}
		]
	},
	war_wizard: {
		source_key: 'SRD',
		title: 'War Wizard',
		tier: 2,
		type: 'Ranged',
		image_url: '',
		artist_name: '',
		description: 'A battle-hardened mage trained in destructive magic.',
		motives_tactics: 'Develop new spells, seek power, shatter formations',
		difficulty: 16,
		thresholds: { major: 11, severe: 23 },
		max_hp: 5,
		max_stress: 6,
		attack_modifier: 4,
		standard_attack: {
			name: 'Staff',
			range: 'Far',
			damage_dice: '2d10',
			damage_bonus: 4,
			damage_type: 'mag'
		},
		experiences: ['Magical Knowledge', 'Strategize'],
		experience_modifiers: [2, 2],
		features: [
			{
				type: 'Passive',
				name: 'Battle Teleport',
				max_uses: null,
				description_html:
					'Before or after making a standard attack, you can **Mark a Stress** to teleport to a location within Far range.'
			},
			{
				type: 'Action',
				name: 'Refresh Warding Sphere',
				max_uses: null,
				description_html: '**Mark a Stress** to refresh the Wizard\'s "Warding Sphere" reaction.'
			},
			{
				type: 'Action',
				name: 'Eruption',
				max_uses: null,
				description_html:
					"**Spend a Fear** and choose a point within Far range. A Very Close area around that point erupts into impassable terrain. All targets within that area must make an Agility Reaction Roll (14). Targets who fail take **2d10** physical damage and are thrown out of the area. Targets who succeed take half damage and aren't moved."
			},
			{
				type: 'Action',
				name: 'Arcane Artillery',
				max_uses: null,
				description_html:
					'**Spend a Fear** to unleash a precise hail of magical blasts. All targets in the scene must make an Agility Reaction Roll. Targets who fail take **2d12** magic damage. Targets who succeed take half damage.'
			},
			{
				type: 'Reaction',
				name: 'Warding Sphere',
				max_uses: null,
				description_html:
					'When the Wizard takes damage from an attack within Close range, deal **2d6** magic damage to the attacker. This reaction can\'t be used again until the Wizard refreshes it with their "Refresh Warding Sphere" action.'
			}
		]
	}
} as const satisfies Record<string, Adversary>;
