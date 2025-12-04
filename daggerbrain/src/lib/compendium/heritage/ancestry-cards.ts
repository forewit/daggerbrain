import type { AncestryCard } from '$lib/types/compendium-types';

export const ANCESTRY_CARDS = {
	// todo: verify everything below
	drakona: {
		id: 'drakona',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/drakona.webp',
		title: 'Drakona',
		description_html:
			'<p>Drakona resemble wingless dragons in humanoid form and possess a powerful elemental breath.</p>',
		artist_name: 'Mat Wilma',
		choices: [],
		features: [
			{
				title: 'Scales',
				description_html:
					'<p>Your scales act as natural protection. When you would take Severe damage, you can <b>mark a Stress</b> to mark 1 fewer Hit Points.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Elemental Breath',
				description_html:
					'<p>Choose an element for your breath (such as electricity, fire, or ice). You can use this breath against a target or group of targets within Very Close range, treating it as an Instinct weapon that deals <b>d8</b> magic damage using your Proficiency.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	clank: {
		id: 'clank',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/clank.webp',
		title: 'Clank',
		description_html:
			'<p>Clanks are sentient mechanical beings built from a variety of materials, including metal, wood, and stone.</p>',
		artist_name: 'Mat Wilma',
		choices: [
			{
				choice_id: 'choose_experience',
				type: 'experience',
				max: 1,
				conditional_choice: null
			}
		],
		features: [
			{
				title: 'Purposeful Design',
				description_html:
					'<p>Decide who made you and for what purpose. At character creation, choose one of your Experiences that best aligns with this purpose and gain a permanent +1 bonus to it.</p>',
				character_modifiers: [
					{
						behaviour: 'bonus',
						type: 'flat',
						value: 1,
						target: 'experience_from_ancestry_card_choice_selection',
						choice_id: 'choose_experience',
						character_conditions: []
					}
				],
				weapon_modifiers: []
			},
			{
				title: 'Efficient',
				description_html:
					'<p>When you take a short rest, you can choose a long rest move instead of a short rest move.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	dwarf: {
		id: 'dwarf',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/dwarf.webp',
		title: 'Dwarf',
		description_html:
			'<p>Dwarves are most easily recognized as short humanoids with square frames, dense musculature, and thick hair.</p>',
		artist_name: 'Mat Wilma',
		choices: [],
		features: [
			{
				title: 'Thick Skin',
				description_html:
					'<p>When you take Minor damage, you can <b>mark 2 Stress</b> instead of marking a Hit Point.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Increased Fortitude',
				description_html: '<p><b>Spend 3 Hope</b> to halve incoming physical damage.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	elf: {
		id: 'elf',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/elf.webp',
		title: 'Elf',
		description_html:
			'<p>Elves are typically tall humanoids with pointed ears and acutely attuned senses.</p>',
		artist_name: 'Mat Wilma',
		choices: [],
		features: [
			{
				title: 'Quick Reactions',
				description_html:
					'<p><b>Mark a Stress</b> to gain advantage on a reaction roll.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Celestial Trance',
				description_html:
					'<p>During a rest, you can drop into a trance to choose an additional downtime move.</p>',
				character_modifiers: [
					{
						behaviour: 'bonus',
						target: 'max_short_rest_actions',
						type: 'flat',
						value: 1,
						character_conditions: []
					},
					{
						behaviour: 'bonus',
						target: 'max_long_rest_actions',
						type: 'flat',
						value: 1,
						character_conditions: []
					}
				],
				weapon_modifiers: []
			}
		]
	},
	faerie: {
		id: 'faerie',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/faerie.webp',
		title: 'Faerie',
		description_html: '<p>Faeries are winged humanoid creatures with insectile features.</p>',
		artist_name: 'Anthony Jones',
		choices: [],
		features: [
			{
				title: 'Luckbender',
				description_html:
					'<p>Once per session, after you or a willing ally within Close range makes an action roll, you can <b>spend 3 Hope</b> to reroll the Duality Dice.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Wings',
				description_html:
					'<p>You can fly. While flying, you can <b>mark a Stress</b> after an adversary makes an attack against you to gain a +2 bonus to your Evasion against that attack.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	faun: {
		id: 'faun',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/faun.webp',
		title: 'Faun',
		description_html:
			'<p>Fauns resemble humanoid goats with curving horns, square pupils, and cloven hooves.</p>',
		artist_name: 'Jessketchin',
		choices: [],
		features: [
			{
				title: 'Caprine Leap',
				description_html:
					'<p>You can leap anywhere within Close range as though you were using normal movement, allowing you to vault obstacles, jump across gaps, or scale barriers with ease.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Kick',
				description_html:
					'<p>When you succeed on an attack against a target within Melee range, you can <b>mark a Stress</b> to kick yourself off them, dealing an extra <b>2d6</b> damage and knocking back either yourself or the target to Very Close range.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	firbolg: {
		id: 'firbolg',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/firbolg.webp',
		title: 'Firbolg',
		description_html:
			'<p>Firbolgs are bovine humanoids typically recognized by their broad noses and long, drooping ears.</p>',
		artist_name: 'Anthony Jones',
		choices: [],
		features: [
			{
				title: 'Charge',
				description_html:
					'<p>When you succeed on an Agility Roll to move from Far or Very Far range into Melee range with one or more targets, you can <b>mark a Stress</b> to deal <b>1d12</b> physical damage to all targets within Melee range.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Unshakable',
				description_html:
					'<p>When you would mark a Stress, roll a <b>d6</b>. On a result of 6, don\'t mark it.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	fungril: {
		id: 'fungril',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/fungril.webp',
		title: 'Fungril',
		description_html: '<p>Fungril resemble humanoid mushrooms.</p>',
		artist_name: 'Anthony Jones',
		choices: [],
		features: [
			{
				title: 'Fungril Network',
				description_html:
					'<p>Make an <b>Instinct Roll (12)</b> to use your mycelial array to speak with others of your ancestry. On a success, you can communicate across any distance.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Death Connection',
				description_html:
					'<p>While touching a corpse that died recently, you can <b>mark a Stress</b> to extract one memory from the corpse related to a specific emotion or sensation of your choice.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	galapa: {
		id: 'galapa',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/galapa.webp',
		title: 'Galapa',
		description_html:
			'<p>Galapa resemble anthropomorphic turtles with large, domed shells into which they can retract.</p>',
		artist_name: 'Jessketchin',
		choices: [],
		features: [
			{
				title: 'Shell',
				description_html:
					'<p>Gain a bonus to your damage thresholds equal to your Proficiency.</p>',
				character_modifiers: [
					{
						behaviour: 'bonus',
						target: 'major_damage_threshold',
						type: 'derived_from_proficiency',
						multiplier: 1,
						character_conditions: []
					},
					{
						behaviour: 'bonus',
						target: 'severe_damage_threshold',
						type: 'derived_from_proficiency',
						multiplier: 1,
						character_conditions: []
					}
				],
				weapon_modifiers: []
			},
			{
				title: 'Retract',
				description_html:
					'<p><b>Mark a Stress</b> to retract into your shell. While in your shell, you have resistance to physical damage, you have disadvantage on action rolls, and you can\'t move.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	giant: {
		id: 'giant',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/giant.webp',
		title: 'Giant',
		description_html:
			'<p>Giants are towering humanoids with broad shoulders, long arms, and one to three eyes.</p>',
		artist_name: 'Juan S. Almencion',
		choices: [],
		features: [
			{
				title: 'Endurance',
				description_html: '<p>Gain an additional Hit Point slot at character creation.</p>',
				character_modifiers: [
					{
						behaviour: 'bonus',
						target: 'max_hp',
						type: 'flat',
						value: 1,
						character_conditions: []
					}
				],
				weapon_modifiers: []
			},
			{
				title: 'Reach',
				description_html:
					'<p>Treat any weapon, ability, spell, or other feature that has a Melee range as though it has a Very Close range instead.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	goblin: {
		id: 'goblin',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/goblin.webp',
		title: 'Goblin',
		description_html:
			'<p>Goblins are small humanoids easily recognizable by their large eyes and massive membranous ears.</p>',
		artist_name: 'Anthony Jones',
		choices: [],
		features: [
			{
				title: 'Surefooted',
				description_html: '<p>You ignore disadvantage on Agility Rolls.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Danger Sense',
				description_html:
					'<p>Once per rest, <b>mark a Stress</b> to force an adversary to reroll an attack against you or an ally within Very Close range.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	halfling: {
		id: 'halfling',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/halfling.webp',
		title: 'Halfling',
		description_html:
			'<p>Halflings are small humanoids with large hairy feet and prominent rounded ears.</p>',
		artist_name: 'Anthony Jones',
		choices: [],
		features: [
			{
				title: 'Luckbringer',
				description_html:
					'<p>At the start of each session, everyone in your party gains a Hope.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Internal Compass',
				description_html:
					'<p>When you roll a 1 on your Hope Die, you can reroll it.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	human: {
		id: 'human',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/human.webp',
		title: 'Human',
		description_html:
			'<p>Humans are most easily recognized by their dexterous hands, rounded ears, and bodies built for endurance.</p>',
		artist_name: 'Fernanda Suarez',
		choices: [],
		features: [
			{
				title: 'High Stamina',
				description_html: '<p>Gain an additional Stress slot at character creation.</p>',
				character_modifiers: [
					{
						behaviour: 'bonus',
						target: 'max_stress',
						type: 'flat',
						value: 1,
						character_conditions: []
					}
				],
				weapon_modifiers: []
			},
			{
				title: 'Adaptability',
				description_html:
					'<p>When you fail a roll that utilized one of your Experiences, you can <b>mark a Stress</b> to reroll.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	infernis: {
		id: 'infernis',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/infernis.webp',
		title: 'Infernis',
		description_html:
			'<p>Infernis are humanoids who possess sharp canine teeth, pointed ears, and horns. They are the descendants of demons from the Circles Below.</p>',
		artist_name: 'Mat Wilma',
		choices: [],
		features: [
			{
				title: 'Fearless',
				description_html:
					'<p>When you roll with Fear, you can <b>mark 2 Stress</b> to change it into a roll with Hope instead.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Dread Visage',
				description_html:
					'<p>You have advantage on rolls to intimidate hostile creatures.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	katari: {
		id: 'katari',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/katari.webp',
		title: 'Katari',
		description_html:
			'<p>Katari are feline humanoids with retractable claws, vertically slit pupils, and high, triangular ears.</p>',
		artist_name: 'Hendry Iwanaga',
		choices: [],
		features: [
			{
				title: 'Feline Instincts',
				description_html:
					'<p>When you make an Agility Roll, you can <b>spend 2 Hope</b> to reroll your Hope Die.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Retracting Claws',
				description_html:
					'<p>Make an <b>Agility Roll</b> to scratch a target within Melee range. On a success, they become temporarily Vulnerable.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	orc: {
		id: 'orc',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/orc.webp',
		title: 'Orc',
		description_html:
			'<p>Orcs are humanoids most easily recognized by their square features and boar-like tusks that protrude from their lower jaw.</p>',
		artist_name: 'Simon Pape',
		choices: [],
		features: [
			{
				title: 'Sturdy',
				description_html:
					'<p>When you have 1 Hit Point remaining, attacks against you have disadvantage.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Tusks',
				description_html:
					'<p>When you succeed on an attack against a target within Melee range, you can <b>spend a Hope</b> to gore the target with your tusks, dealing an extra <b>1d6</b> damage.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	ribbet: {
		id: 'ribbet',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/ribbet.webp',
		title: 'Ribbet',
		description_html:
			'<p>Ribbets resemble anthropomorphic frogs with protruding eyes and webbed hands and feet.</p>',
		artist_name: 'Leesha Hannigan',
		choices: [],
		features: [
			{
				title: 'Amphibious',
				description_html:
					'<p>You can breathe and move naturally underwater.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Long Tongue',
				description_html:
					'<p>You can use your long tongue to grab onto things within Close range. <b>Mark a Stress</b> to use your tongue as a Finesse Close weapon that deals <b>d12</b> physical damage using your Proficiency.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	simiah: {
		id: 'simiah',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/api/images/card/art/ancestries/simiah.webp',
		title: 'Simiah',
		description_html:
			'<p>Simiah resemble anthropomorphic monkeys and apes with long limbs and prehensile feet.</p>',
		artist_name: 'Jessketchin',
		choices: [],
		features: [
			{
				title: 'Natural Climber',
				description_html:
					'<p>You have advantage on Agility Rolls that involve balancing and climbing.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Nimble',
				description_html:
					'<p>Gain a permanent +1 bonus to your Evasion at character creation.</p>',
				character_modifiers: [
					{
						behaviour: 'bonus',
						target: 'evasion',
						type: 'flat',
						value: 1,
						character_conditions: []
					}
				],
				weapon_modifiers: []
			}
		]
	}
} as const satisfies Record<string, AncestryCard>;
