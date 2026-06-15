import type { Environment } from '../../../../convex/schemas/compendium';

export const ENVIRONMENTS = {
	abandoned_grove: {
		source_key: 'SRD',
		title: 'Abandoned Grove',
		description: 'A former druidic grove lying fallow and fully reclaimed by nature.',
		tier: 1,
		image_url: '',
		artist_name: '',
		type: 'Exploration',
		impulses: 'Draw in the curious, echo the past',
		relative_strength: false,
		difficulty: 11,
		potential_adversaries:
			'Beasts (Bear, Dire Wolf, Glass Snake), Grove Guardians (Minor Treant, Sylvan Soldier, Young Dryad)',
		potential_adversaries_ids: [
			'bear',
			'dire_wolf',
			'glass_snake',
			'minor_treant',
			'sylvan_soldier',
			'young_dryad'
		],
		features: [
			{
				type: 'Passive',
				name: 'Overgrown Battlefield',
				description_html: `There has been a battle here. A PC can make an Instinct Roll to identify evidence of that fight. On a success with Hope, learn all three pieces of information below. On a success with Fear, learn two. On a failure, a PC can **Mark a Stress** to learn one and gain advantage on the next action roll to investigate this environment. A PC with an appropriate background or Experience can learn an additional detail and ask a follow-up question about the scene and get a truthful (if not always complete) answer.

- Traces of a battle (broken weapons and branches, gouges in the ground) litter the ground.
- A moss-covered tree trunk is actually the corpse of a treant.
- Still-standing trees are twisted in strange ways, as if by powerful magic.`,
				questions: 'Why did these groups come to blows? Why is the grove unused now?'
			},
			{
				type: 'Action',
				name: 'Barbed Vines',
				description_html:
					"Pick a point within the grove. All targets within Very Close range of that point must succeed on an Agility Reaction Roll or take **1d8+3** physical damage and become *Restrained* by barbed vines. *Restrained* lasts until they're freed with a successful Finesse or Strength roll or by dealing at least 6 damage to the vines.",
				questions:
					'How many vines are there? Where do they grab you? Do they pull you down or lift you off the ground?'
			},
			{
				type: 'Action',
				name: 'You Are Not Welcome Here',
				description_html:
					'A Young Dryad, two Sylvan Soldiers, and a number of Minor Treants equal to the number of PCs appear to confront the party for their intrusion.',
				questions:
					'What are the grove guardians concealing? What threat to the forest could the PCs confront to appease the Dryad?'
			},
			{
				type: 'Action',
				name: 'Defiler',
				description_html:
					'**Spend a Fear** to summon a Minor Chaos Elemental drawn to the echoes of violence and discord. They appear within Far range of a chosen PC and immediately take the spotlight.',
				questions:
					'What color does the grass turn as the elemental appears? How does the chaos warp insects and small wildlife within the grove?'
			}
		]
	},
	ambushed: {
		source_key: 'SRD',
		title: 'Ambushed',
		description: 'An ambush is set to catch an unsuspecting party off-guard.',
		tier: 1,
		image_url: '',
		artist_name: '',
		type: 'Event',
		impulses: 'Overwhelm, scatter, surround',
		relative_strength: true,
		difficulty: 1,
		potential_adversaries: 'Any',
		potential_adversaries_ids: [],
		features: [
			{
				type: 'Passive',
				name: 'Relative Strength',
				description_html:
					'The Difficulty of this environment equals that of the adversary with the highest Difficulty.',
				questions: "Who cues the ambush? What makes it clear they're in charge?"
			},
			{
				type: 'Action',
				name: 'Surprise!',
				description_html:
					'The ambushers reveal themselves to the party, you gain 2 Fear, and the spotlight immediately shifts to one of the ambushing adversaries.',
				questions:
					'What do the ambushers want from the party? How do their tactics in the ambush reflect that?'
			}
		]
	},
	ambushers: {
		source_key: 'SRD',
		title: 'Ambushers',
		description: 'An ambush is set by the PCs to catch unsuspecting adversaries off-guard.',
		tier: 1,
		image_url: '',
		artist_name: '',
		type: 'Event',
		impulses: 'Escape, group up, protect the most vulnerable',
		relative_strength: true,
		difficulty: 1,
		potential_adversaries: 'Any',
		potential_adversaries_ids: [],
		features: [
			{
				type: 'Passive',
				name: 'Relative Strength',
				description_html:
					'The Difficulty of this environment equals that of the adversary with the highest Difficulty.',
				questions: 'Which adversary is the least prepared? Which one is the most?'
			},
			{
				type: 'Reaction',
				name: 'Where Did They Come From?',
				description_html:
					'When a PC starts the ambush on unsuspecting adversaries, you lose 2 Fear and the first attack roll a PC makes has advantage.',
				questions:
					'What are the adversaries in the middle of doing when the ambush starts? How does this impact their approach to the fight?'
			}
		]
	},
	bustling_marketplace: {
		source_key: 'SRD',
		title: 'Bustling Marketplace',
		description:
			'The economic heart of the settlement, with local artisans, traveling merchants, and patrons across social classes.',
		tier: 1,
		image_url: '',
		artist_name: '',
		type: 'Social',
		impulses: 'Buy low, and sell high, tempt and tantalize with wares from near and far',
		relative_strength: false,
		difficulty: 10,
		potential_adversaries: 'Guards (Bladed Guard, Head Guard), Masked Thief, Merchant',
		potential_adversaries_ids: ['bladed_guard', 'head_guard', 'masked_thief', 'merchant'],
		features: [
			{
				type: 'Passive',
				name: 'Tip the Scales',
				description_html:
					'PCs can gain advantage on a Presence Roll by offering a handful of gold as part of the interaction.',
				questions:
					'Will any coin be accepted, or only local currency? How overt are the PCs in offering this bribe?'
			},
			{
				type: 'Action',
				name: 'Unexpected Find',
				description_html:
					'Reveal to the PCs that one of the merchants has something they want or need, such as food from their home, a rare book, magical components, a dubious treasure map, or a magical key.',
				questions: 'What cost beyond gold will the merchant ask for in exchange for this rarity?'
			},
			{
				type: 'Action',
				name: 'Sticky Fingers',
				description_html:
					"A thief tries to steal something from a PC. The PC must succeed on an Instinct Roll to notice the thief or lose an item of the GM's choice as the thief escapes to a Close distance. To retrieve the stolen item, the PCs must complete a Progress Countdown (6) to chase down the thief before the thief completes a Consequence Countdown (4) and escapes to their hideout.",
				questions:
					"What drove this person to pickpocketing? Where is the thief's hideout and how has it avoided notice?"
			},
			{
				type: 'Reaction',
				name: 'Crowd Closes In',
				description_html:
					'When one of the PCs splits from the group, the crowds shift and cut them off from the party.',
				questions:
					"Where does the crowd's movement carry them? How do they feel about being alone but surrounded?"
			}
		]
	},
	cliffside_ascent: {
		source_key: 'SRD',
		title: 'Cliffside Ascent',
		description: 'A steep, rocky cliff side tall enough to make traversal dangerous.',
		tier: 1,
		image_url: '',
		artist_name: '',
		type: 'Traversal',
		impulses:
			'Cast the unready down to a rocky doom, draw people in with promise of what lies at the top',
		relative_strength: false,
		difficulty: 12,
		potential_adversaries: 'Construct, Deeproot Defender, Giant Scorpion, Glass Snake',
		potential_adversaries_ids: ['construct', 'deeproot_defender', 'giant_scorpion', 'glass_snake'],
		features: [
			{
				type: 'Passive',
				name: 'The Climb',
				description_html: `Climbing up the cliff side uses a Progress Countdown (12). It ticks down according to the following criteria when the PCs make an action roll to climb:

- **Critical Success**: Tick down 3
- **Success with Hope**: Tick down 2
- **Success with Fear**: Tick down 1
- **Failure with Hope**: No advancement
- **Failure with Fear**: Tick up 1

When the countdown triggers, the party has made it to the top of the cliff.`,
				questions:
					'What strange formations are the stones arranged in? What ominous warnings did previous adventurers leave?'
			},
			{
				type: 'Passive',
				name: 'Pitons Left Behind',
				description_html:
					'Previous climbers left behind large metal rods that climbers can use to aid their ascent. If a PC using the pitons fails an action roll to climb, they can **Mark a Stress** instead of ticking the countdown up.',
				questions:
					'What do the shape and material of these pitons tell you about the previous climbers? How far apart are they from one another?'
			},
			{
				type: 'Action',
				name: 'Fall',
				description_html:
					"**Spend a Fear** to have a PC's handhold fail, plummeting them toward the ground. If they aren't saved on the next action, they hit the ground and tick up the countdown by 2. The PC takes **1d12** physical damage if the countdown is between 8 and 12, **2d12** between 4 and 7, and **3d12** at 3 or lower.",
				questions:
					'How can you tell many others have fallen here before? What lives in these walls that might try to scare adventurers into falling for an easy meal?'
			}
		]
	},
	local_tavern: {
		source_key: 'SRD',
		title: 'Local Tavern',
		description: 'A lively tavern that serves as the social hub for its town.',
		tier: 1,
		image_url: '',
		artist_name: '',
		type: 'Social',
		impulses: 'Provide opportunities for adventurers, nurture community',
		relative_strength: false,
		difficulty: 10,
		potential_adversaries:
			'Guards (Bladed Guard, Head Guard), Mercenaries (Harrier, Sellsword, Spellblade, Weaponmaster), Merchant',
		potential_adversaries_ids: [
			'bladed_guard',
			'head_guard',
			'harrier',
			'sellsword',
			'spellblade',
			'weaponmaster',
			'merchant'
		],
		features: [
			{
				type: 'Passive',
				name: "What's the Talk of the Town?",
				description_html: `A PC can ask the bartender, staff, or patrons about local events, rumors, and potential work with a Presence Roll. On a success, they can pick two of the below details to learn—or three if they critically succeed. On a failure, they can pick one and **Mark a Stress** as the local carries on about something irrelevant.

- A fascinating rumor with a connection to a PC's background
- A promising job for the party involving a nearby threat or situation
- Local folklore that relates to something they've seen
- Town gossip that hints at a community problem`,
				questions:
					'Who has what kind of information? What gossip do the locals start spreading about the PCs?'
			},
			{
				type: 'Passive',
				name: 'Sing For Your Supper',
				description_html:
					'A PC can perform one time for the guests by making a Presence Roll. On a success, they earn **1d4** handfuls of gold (**2d4** if they critically succeed). On a failure, they **Mark a Stress**.',
				questions:
					"What piece do you perform? What does that piece mean to you? When's the last time you performed it for a crowd?"
			},
			{
				type: 'Action',
				name: 'Mysterious Stranger',
				description_html: 'Reveal a stranger concealing their identity, lurking in a shaded booth.',
				questions:
					"What do they want? What's their impression of the PCs? What mannerisms or accessories do they have?"
			},
			{
				type: 'Action',
				name: 'Someone Comes to Town',
				description_html:
					"Introduce a significant NPC who wants to hire the party for something or who relates to a PC's background.",
				questions: 'Did they know the PCs were here? What do they want in this town?'
			},
			{
				type: 'Action',
				name: 'Bar Fight!',
				description_html:
					'**Spend a Fear** to have a bar fight erupt in the tavern. When a PC tries to move through the tavern while the fight persists, they must succeed on an Agility or Presence Roll or take **1d6+2** physical damage from a wild swing or thrown object. A PC can try to activate this feature by succeeding on an action roll that would provoke tavern patrons.',
				questions: 'Who started the fight? What will it take to stop it?'
			}
		]
	},
	outpost_town: {
		source_key: 'SRD',
		title: 'Outpost Town',
		description:
			'A small town on the outskirts of a nation or region, close to a dungeon, tombs, or other adventuring destinations.',
		tier: 1,
		image_url: '',
		artist_name: '',
		type: 'Social',
		impulses: 'Drive the desperate to certain doom, profit off of ragged hope',
		relative_strength: false,
		difficulty: 12,
		potential_adversaries:
			'Jagged Knife Bandits (Hexer, Kneebreaker, Lackey, Lieutenant, Shadow, Sniper), Masked Thief, Merchant',
		potential_adversaries_ids: [
			'jagged_knife_hexer',
			'jagged_knife_kneebreaker',
			'jagged_knife_lackey',
			'jagged_knife_lieutenant',
			'jagged_knife_shadow',
			'jagged_knife_sniper',
			'masked_thief',
			'merchant'
		],
		features: [
			{
				type: 'Passive',
				name: 'Rumors Abound',
				description_html: `Gossip is the fastest-traveling currency in the realm. A PC can inquire about major events by making a Presence Roll. What they learn depends on the outcome of their roll, based on the following criteria:

- **Critical Success**: Learn about two major events. The PC can ask one follow-up question about one of the rumors and get a truthful (if not always complete) answer.
- **Success with Hope**: Learn about two events, at least one of which is relevant to the character's background.
- **Success with Fear**: Learn an alarming rumor related to the character's background.
- **Any Failure**: The locals respond poorly to their inquiries. The PC must **Mark a Stress** to learn one relevant rumor.`,
				questions:
					'What news do the PCs have that they could pass along to curious travelers? What do the locals think about these events?'
			},
			{
				type: 'Passive',
				name: 'Society of the Broken Compass',
				description_html:
					'An adventuring society maintains a chapterhouse here, where heroes trade boasts and rumors, drink to their imagined successes, and scheme to undermine their rivals.',
				questions: 'What boasts do the adventurers here make, and which do you think are true?'
			},
			{
				type: 'Passive',
				name: 'Rival Party',
				description_html:
					'Another adventuring party is here, seeking the same treasure or leads as the PCs.',
				questions:
					'Which PC has a connection to one of the rival party members? Do they approach the PC first or do they wait for the PC to move?'
			},
			{
				type: 'Action',
				name: "It'd Be a Shame If Something Happened to Your Store",
				description_html:
					'The PCs witness as agents of a local crime boss shake down a general goods store.',
				questions: 'What trouble does it cause if the PCs intervene?'
			},
			{
				type: 'Reaction',
				name: 'Wrong Place, Wrong Time',
				description_html:
					'At night, or when the party is alone in a back alley, you can **Spend a Fear** to introduce a group of thieves who try to rob them. The thieves appear at Close range of a chosen PC and include a Jagged Knife Kneebreaker, as many Lackeys as there are PCs, and a Lieutenant. For a larger party, add a Hexer or Sniper.',
				questions: 'What details show the party that these people are desperate former adventurers?'
			}
		]
	},
	raging_river: {
		source_key: 'SRD',
		title: 'Raging River',
		description:
			'A swift-moving river without a bridge crossing, deep enough to sweep away most people.',
		tier: 1,
		image_url: '',
		artist_name: '',
		type: 'Traversal',
		impulses: 'Bar crossing, carry away the unready, divide the land',
		relative_strength: false,
		difficulty: 10,
		potential_adversaries:
			'Beasts (Bear, Glass Snake), Jagged Knife Bandits (Hexer, Kneebreaker, Lackey, Lieutenant, Shadow, Sniper)',
		potential_adversaries_ids: [
			'bear',
			'glass_snake',
			'jagged_knife_hexer',
			'jagged_knife_kneebreaker',
			'jagged_knife_lackey',
			'jagged_knife_lieutenant',
			'jagged_knife_shadow',
			'jagged_knife_sniper'
		],
		features: [
			{
				type: 'Passive',
				name: 'Dangerous Crossing',
				description_html:
					'Crossing the river requires the party to complete a Progress Countdown (4). A PC who rolls a **Failure with Fear** is immediately targeted by the "Undertow" action without requiring a Fear to be spent on the feature.',
				questions:
					'Have any of the PCs forded rivers like this before? Are any of them afraid of drowning?'
			},
			{
				type: 'Action',
				name: 'Undertow',
				description_html:
					'**Spend a Fear** to catch a PC in the undertow. They must make an Agility Reaction Roll. On a failure, they take **1d6+1** physical damage and are moved a Close distance down the river, becoming *Vulnerable* until they get out of the river. On a success, they must **Mark a Stress**.',
				questions:
					'What trinkets and baubles lie along the bottom of the riverbed? Do predators swim these rivers?'
			},
			{
				type: 'Action',
				name: 'Patient Hunter',
				description_html:
					'**Spend a Fear** to summon a Glass Snake within Close range of a chosen PC. The Snake appears in or near the river and immediately takes the spotlight to use their "Spinning Serpent" action.',
				questions:
					'What treasures does the beast have in their burrow? What travelers have already fallen victim to this predator?'
			}
		]
	},
	cult_ritual: {
		source_key: 'SRD',
		title: 'Cult Ritual',
		description:
			'A Fallen cult assembles around a sigil of the defeated gods and a bonfire that burns a sickly shade of green.',
		tier: 2,
		image_url: '',
		artist_name: '',
		type: 'Event',
		impulses: 'Profane the land, unite the Mortal Realm with the Circles Below',
		relative_strength: false,
		difficulty: 14,
		potential_adversaries:
			'Cult of the Fallen (Cult Adept, Cult Fang, Cult Initiate, Secret-Keeper)',
		potential_adversaries_ids: ['cult_adept', 'cult_fang', 'cult_initiate', 'secret_keeper'],
		features: [
			{
				type: 'Passive',
				name: 'Desecrated Ground',
				description_html:
					"Cultists dedicated this place to the Fallen Gods, and their foul influence seeps into it. Reduce the PCs' Hope Die to a **d10** while in this environment. The desecration can be removed with a Progress Countdown (6).",
				questions:
					'How do the PCs first notice that something is wrong about this place? What fears resurface while hope is kept at bay?'
			},
			{
				type: 'Action',
				name: 'Blasphemous Might',
				description_html: `A portion of the ritual's power is diverted into a cult member to fight off interlopers. Choose one adversary to become Imbued with terrible magic until the scene ends or they're defeated. An Imbued adversary immediately takes the spotlight and gains one of the following benefits, or all three if you **Spend a Fear**:

- They gain advantage on all attacks.
- They deal an extra **1d10** damage on a successful attack.
- They gain the following feature: Relentless (2) - Passive. This adversary can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.`,
				questions:
					'How does the enemy change in appearance? What fears do their blows bring to the surface?'
			},
			{
				type: 'Reaction',
				name: 'The Summoning',
				description_html:
					"Countdown (6). When the PCs enter the scene or the cult begins the ritual to summon a demon, activate the countdown. Designate one adversary to lead the ritual. The countdown ticks down when a PC rolls with Fear. When it triggers, summon a Minor Demon within Very Close range of the ritual's leader. If the leader is defeated, the countdown ends with no effect as the ritual fails.",
				questions:
					'What will the cult do with this leashed demon if they succeed? What will they try to summon next?'
			},
			{
				type: 'Reaction',
				name: 'Complete the Ritual',
				description_html:
					"If the ritual's leader is targeted by an attack or spell, an ally within Very Close range of them can **Mark a Stress** to be targeted by that attack or spell instead.",
				questions:
					'What does it feel like to see such devotion turned to the pursuit of fear and domination?'
			}
		]
	},
	hallowed_temple: {
		source_key: 'SRD',
		title: 'Hallowed Temple',
		description:
			'A bustling but well-kept temple that provides healing and hosts regular services, overseen by a priest or seraph.',
		tier: 2,
		image_url: '',
		artist_name: '',
		type: 'Social',
		impulses:
			'Connect the Mortal Realm with the Hallows Above, display the power of the divine, provide aid and succor to the faithful',
		relative_strength: false,
		difficulty: 13,
		potential_adversaries: 'Guards (Archer Guard, Bladed Guard, Head Guard)',
		potential_adversaries_ids: ['archer_guard', 'bladed_guard', 'head_guard'],
		features: [
			{
				type: 'Passive',
				name: 'A Place of Healing',
				description_html:
					'A PC who takes a rest in the Hallowed Temple automatically clears all HP.',
				questions: 'What does the incense smell like? What kinds of songs do the acolytes sing?'
			},
			{
				type: 'Passive',
				name: 'Divine Guidance',
				description_html: `A PC who prays to a deity while in the Hallowed Temple can make an Instinct Roll to receive answers. If the god they beseech isn't welcome in this temple, the roll is made with disadvantage.

- **Critical Success**: The PC gains clear information. Additionally, they gain **1d4** Hope, which can be distributed between the party if they share the vision and guidance they received.
- **Success with Hope**: The PC receives clear information.
- **Success with Fear**: The PC receives brief flashes of insight and an emotional impression conveying an answer.
- **Any Failure**: The PC receives only vague flashes. They can **Mark a Stress** to receive one clear image without context.`,
				questions:
					'What does it feel like as you are touched by this vision? What feeling lingers after the images have passed?'
			},
			{
				type: 'Reaction',
				name: 'Relentless Hope',
				description_html:
					'Once per scene, each PC can **Mark a Stress** to turn a result with Fear into a result with Hope.',
				questions: 'What emotions or memories do you connect with when fear presses in?'
			},
			{
				type: 'Reaction',
				name: 'Divine Censure',
				description_html:
					'When the PCs have trespassed, blasphemed, or offended the clergy, you can **Spend a Fear** to summon a High Seraph and **1d4** Bladed Guards within Close range of the senior priest to reinforce their will.',
				questions:
					'What symbols or icons do they bear that signal they are anointed agents of the divinity? Who leads the group and what led them to this calling?'
			}
		]
	},
	haunted_city: {
		source_key: 'SRD',
		title: 'Haunted City',
		description: 'An abandoned city populated by the restless spirits of eras past.',
		tier: 2,
		image_url: '',
		artist_name: '',
		type: 'Exploration',
		impulses: 'Misdirect and disorient, replay apocalypses both public and personal',
		relative_strength: false,
		difficulty: 14,
		potential_adversaries:
			'Ghosts (Spectral Archer, Spectral Captain, Spectral Guardian), ghostly versions of other adversaries (see "Ghostly Form")',
		potential_adversaries_ids: ['spectral_archer', 'spectral_captain', 'spectral_guardian'],
		features: [
			{
				type: 'Passive',
				name: 'Buried Knowledge',
				description_html: `The city has countless mysteries to unfold. A PC who seeks knowledge about the fallen city can make an Instinct or Knowledge Roll to learn about this place and discover (potentially haunted) loot.

- **Critical Success**: Gain valuable information and a related useful item.
- **Success with Hope**: Gain valuable information.
- **Success with Fear**: Uncover vague or incomplete information.
- **Any Failure**: **Mark a Stress** to find a lead after an exhaustive search.`,
				questions:
					'What greater secrets does the city contain? Why have so many ghosts lingered here? What doomed adventurers have met a bad fate here already?'
			},
			{
				type: 'Passive',
				name: 'Ghostly Form',
				description_html:
					'Adversaries who appear here are of a ghostly form. They have resistance to physical damage and can **Mark a Stress** to move up to Close range through solid objects.',
				questions:
					'What injuries to their physical form speak to their cause of death? What unfulfilled purpose holds them in the Mortal Plane?'
			},
			{
				type: 'Action',
				name: 'Dead Ends',
				description_html:
					'The ghosts of an earlier era manifest scenes from their bygone era, such as a street festival, a revolution, or a heist. These hauntings change the layout of the city around the PCs, blocking the way behind them, forcing a detour, or presenting them with a challenge, such as mistaking them for rival thieves during the heist.',
				questions: 'What do the ghosts want from you? What do you need from them?'
			},
			{
				type: 'Action',
				name: 'Apocalypse Then',
				description_html:
					'**Spend a Fear** to manifest the echo of a past disaster that ravaged the city. Activate a Progress Countdown (5) as the disaster replays around the PCs. To complete the countdown and escape the catastrophe, the PCs must overcome threats such as rampaging fires, stampeding civilians, collapsing buildings, or crumbling streets, while recalling history and finding clues to escape the inevitable.',
				questions:
					'Is this the disaster that led the city to be abandoned? What is known about this disaster, and how could that help the PCs escape?'
			}
		]
	},
	mountain_pass: {
		source_key: 'SRD',
		title: 'Mountain Pass',
		description:
			'Stony peaks that pierce the clouds, with a twisting path winding its way up and over through many switchbacks.',
		tier: 2,
		image_url: '',
		artist_name: '',
		type: 'Traversal',
		impulses:
			'Exact a chilling toll in supplies and stamina, reveal magical tampering, slow down travel',
		relative_strength: false,
		difficulty: 15,
		potential_adversaries:
			'Beasts (Bear, Giant Eagle, Glass Snake), Chaos Skull, Minotaur Wrecker, Mortal Hunter',
		potential_adversaries_ids: [
			'bear',
			'giant_eagle',
			'glass_snake',
			'chaos_skull',
			'minotaur_wrecker',
			'mortal_hunter'
		],
		features: [
			{
				type: 'Passive',
				name: 'Engraved Sigils',
				description_html:
					'Large markings and engravings have been made in the mountainside. A PC with a relevant background or Experience identifies them as weather magic increasing the power of the icy winds. A PC who succeeds on a Knowledge Roll can recall information about the sigils, potential information about their creators, and the knowledge of how to dispel them. If a PC critically succeeds, they recognize that the sigils are of a style created by ridgeborne enchanters and they gain advantage on a roll to dispel the sigils.',
				questions:
					'Who laid this enchantment? Are they nearby? Why did they want the weather to be more daunting?'
			},
			{
				type: 'Action',
				name: 'Avalanche',
				description_html:
					'**Spend a Fear** to carve the mountain with an icy torrent, causing an avalanche. All PCs in its path must succeed on an Agility or Strength Reaction Roll or be bowled over and carried down the mountain. A PC using rope, pitons, or other climbing gear gains advantage on this roll. Targets who fail are knocked down the mountain to Far range, take **2d20** physical damage, and must **Mark a Stress**. Targets who succeed must **Mark a Stress**.',
				questions:
					'How do the PCs try to weather the avalanche? What approach do the characters take to find one another when their companions go hurtling down the mountainside?'
			},
			{
				type: 'Reaction',
				name: 'Raptor Nest',
				description_html:
					"When the PCs enter the raptors' hunting grounds, two Giant Eagles appear at Very Far range of a chosen PC, identifying the PCs as likely prey.",
				questions:
					'How long has it been since the eagles last found prey? Do they have eggs in their nest, or unfledged young?'
			},
			{
				type: 'Reaction',
				name: 'Icy Winds',
				description_html:
					'Countdown (Loop 4). When the PCs enter the mountain pass, activate the countdown. When it triggers, all characters traveling through the pass must succeed on a Strength Reaction Roll or **Mark a Stress**. A PC wearing clothes appropriate for extreme cold gains advantage on these rolls.',
				questions:
					"What parts of the PC's bodies go numb first? How do they try to keep warm as they press forward?"
			}
		]
	},
	burning_heart_of_the_woods: {
		source_key: 'SRD',
		title: 'Burning Heart of the Woods',
		description:
			'Thick indigo ash fills the air around a towering moss-covered tree that burns eternally with flames a sickly shade of blue.',
		tier: 3,
		image_url: '',
		artist_name: '',
		type: 'Exploration',
		impulses: 'Beat out an uncanny rhythm for all to follow, corrupt the woods',
		relative_strength: false,
		difficulty: 16,
		potential_adversaries:
			'Beasts (Bear, Glass Snake), Elementals (Elemental Spark), Verdant Defenders (Dryad, Oak Treant, Stag Knight)',
		potential_adversaries_ids: [
			'bear',
			'glass_snake',
			'elemental_spark',
			'dryad',
			'oak_treant',
			'stag_knight'
		],
		features: [
			{
				type: 'Passive',
				name: 'Chaos Magic Locus',
				description_html:
					'When a PC makes a Spellcast Roll, they must roll two Fear Dice and take the higher result.',
				questions:
					'What does it feel like to work magic in this chaos-touched place? What do you fear will happen if you lose control of the spell?'
			},
			{
				type: 'Passive',
				name: 'The Indigo Flame',
				description_html: `PCs who approach the central tree can make a Knowledge Roll to try to identify the magic that consumed this environment.

- On a success: They learn three of the below details. On a success with Fear, they learn two.
- On a failure: They can **Mark a Stress** to learn one and gain advantage on the next action roll to investigate this environment.
- Details: This is a result of Fallen magic. The corruption is spread through the ashen moss. It can be cleansed only by a ritual of nature magic with a Progress Countdown (8).`,
				questions:
					'What Fallen cult corrupted these woods? What have they already done with the cursed wood and sap from this tree?'
			},
			{
				type: 'Action',
				name: 'Grasping Vines',
				description_html:
					'Animate vines bristling with thorns whip out from the underbrush to ensnare the PCs. A target must succeed on an Agility Reaction Roll or become *Restrained* and *Vulnerable* until they break free, clearing both conditions, with a successful Finesse or Strength Roll or by dealing 10 damage to the vines. When the target makes a roll to escape, they take **1d8+4** physical damage and lose a Hope.',
				questions: 'What painful memories do the vines bring to the surface as they pierce flesh?'
			},
			{
				type: 'Action',
				name: 'Charcoal Constructs',
				description_html:
					'Warped animals wreathed in indigo flame trample through a point of your choice. All targets within Close range of that point must make an Agility Reaction Roll. Targets who fail take **3d12+3** physical damage. Targets who succeed take half damage instead.',
				questions:
					'Are these real animals consumed by the flame or merely constructs of the corrupting magic?'
			},
			{
				type: 'Reaction',
				name: 'Choking Ash',
				description_html:
					'Countdown (Loop 4). When the PCs enter the Burning Heart of the Woods, activate the countdown. When it triggers, all characters must make a Strength or Instinct Reaction Roll. Targets who fail take **4d6+5** direct physical damage. Targets who succeed take half damage. Protective masks or clothes give advantage on the reaction roll.',
				questions:
					'What hallucinations does the ash induce? What incongruous taste does it possess?'
			}
		]
	},
	castle_siege: {
		source_key: 'SRD',
		title: 'Castle Siege',
		description:
			'An active siege with an attacking force fighting to gain entry to a fortified castle.',
		tier: 3,
		image_url: '',
		artist_name: '',
		type: 'Event',
		impulses: 'Bleed out the will to fight, breach the walls, build tension',
		relative_strength: false,
		difficulty: 17,
		potential_adversaries:
			'Mercenaries (Harrier, Sellsword, Spellblade, Weaponmaster), Noble Forces (Archer Squadron, Conscript, Elite Soldier, Knight of the Realm)',
		potential_adversaries_ids: [
			'harrier',
			'sellsword',
			'spellblade',
			'weaponmaster',
			'archer_squadron',
			'conscript',
			'elite_soldier',
			'knight_of_the_realm'
		],
		features: [
			{
				type: 'Passive',
				name: 'Secret Entrance',
				description_html:
					'A PC can find or recall a secret way into the castle with a successful Instinct or Knowledge Roll.',
				questions:
					'How do they get in without revealing the pathway to the attackers? Are any of the defenders monitoring this path?'
			},
			{
				type: 'Action',
				name: 'Siege Weapons (Environment Change)',
				description_html:
					"Consequence Countdown (6). The attacking force deploys siege weapons to try to raze the defenders' fortifications. Activate the countdown when the siege begins (for a protracted siege, make this a long-term countdown instead). When it triggers, the defenders' fortifications have been breached and the attackers flood inside. You gain 2 Fear, then shift to the Pitched Battle environment and spotlight it.",
				questions:
					'What siege weapons are being deployed? Are they magical, mundane, or a mixture of both? What defenses must the characters overcome to storm the castle?'
			},
			{
				type: 'Action',
				name: 'Reinforcements!',
				description_html:
					'Summon a Knight of the Realm, a number of Tier 3 Minions equal to the number of PCs, and two adversaries of your choice within Far range of a chosen PC as reinforcements. The Knight of the Realm immediately takes the spotlight.',
				questions: 'Who are they targeting first? What formation do they take?'
			},
			{
				type: 'Reaction',
				name: 'Collateral Damage',
				description_html: `When an adversary is defeated, you can **Spend a Fear** to have a stray attack from a siege weapon hit a point on the battlefield. All targets within Very Close range of that point must make an Agility Reaction Roll.

- Targets who fail take **3d8+3** physical or magic damage and must **Mark a Stress**.
- Targets who succeed must **Mark a Stress**.`,
				questions:
					"What debris is scattered by the attack? What is broken by the strike that can't be easily mended?"
			}
		]
	},
	pitched_battle: {
		source_key: 'SRD',
		title: 'Pitched Battle',
		description: 'A massive combat between two large groups of armed combatants.',
		tier: 3,
		image_url: '',
		artist_name: '',
		type: 'Event',
		impulses: 'Seize people, land, and wealth, spill blood for greed and glory',
		relative_strength: false,
		difficulty: 17,
		potential_adversaries:
			'Mercenaries (Sellsword, Harrier, Spellblade, Weaponmaster), Noble Forces (Archer Squadron, Conscript, Elite Soldier, Knight of the Realm)',
		potential_adversaries_ids: [
			'sellsword',
			'harrier',
			'spellblade',
			'weaponmaster',
			'archer_squadron',
			'conscript',
			'elite_soldier',
			'knight_of_the_realm'
		],
		features: [
			{
				type: 'Passive',
				name: 'Adrift on a Sea of Steel',
				description_html:
					'Traversing a battlefield during an active combat is extremely dangerous. A PC must succeed on an Agility Roll to move at all, and can only go up to Close range on a success. If an adversary is within Melee range of them, they must **Mark a Stress** to make an Agility Roll to move.',
				questions:
					'Do the combatants mistake you for the enemy or consider you interlopers? Can you tell the difference between friend and foe in the fray?'
			},
			{
				type: 'Action',
				name: 'Raze and Pillage',
				description_html:
					'The attacking force raises the stakes by lighting a fire, stealing a valuable asset, kidnapping an important person, or killing the populace.',
				questions: 'What is valuable here? Who is most vulnerable?'
			},
			{
				type: 'Action',
				name: 'War Magic',
				description_html:
					'**Spend a Fear** as a mage from one side uses large-scale destructive magic. Pick a point on the battlefield within Very Far range of the mage. All targets within Close range of that point must make an Agility Reaction Roll. Targets who fail take **3d12+8** magic damage and must **Mark a Stress**.',
				questions:
					'What form does the attack take—fireball, raining acid, a storm of blades? What tactical objective is this attack meant to accomplish, and what comes next?'
			},
			{
				type: 'Action',
				name: 'Reinforcements!',
				description_html:
					'Summon a Knight of the Realm, a number of Tier 3 Minions equal to the number of PCs, and two adversaries of your choice within Far range of a chosen PC as reinforcements. The Knight of the Realm immediately takes the spotlight.',
				questions: 'Who are they targeting first? What formation do they take?'
			}
		]
	},
	chaos_realm: {
		source_key: 'SRD',
		title: 'Chaos Realm',
		description: 'An otherworldly space where the laws of reality are unstable and dangerous.',
		tier: 4,
		image_url: '',
		artist_name: '',
		type: 'Traversal',
		impulses: 'Annihilate certainty, consume power, defy logic',
		relative_strength: false,
		difficulty: 20,
		potential_adversaries: 'Outer Realms Monstrosities (Abomination, Corruptor, Thrall)',
		potential_adversaries_ids: [
			'outer_realms_abomination',
			'outer_realms_corrupter',
			'outer_realms_thrall'
		],
		features: [
			{
				type: 'Passive',
				name: 'Impossible Architecture',
				description_html:
					"Up is down, down is right, right is starward. Gravity and directionality themselves are in flux, and any attempt to move through this realm is an odyssey unto itself, requiring a Progress Countdown (8). On a failure, a PC must **Mark a Stress** in addition to the roll's other consequences.",
				questions:
					'What does it feel like to move in a space so alien to the Mortal Realm? What landmark or point do you fixate on to maintain your balance? What bizarre landmarks do you traverse on your journey?'
			},
			{
				type: 'Action',
				name: 'Everything You Are This Place Will Take from You',
				description_html:
					'Countdown (Loop 1d4). Activate the countdown. When it triggers, all PCs must succeed on a Presence Reaction Roll or their highest trait is temporarily reduced by **1d4** unless they **Mark a number of Stress** equal to its value. Any lost trait points are regained if the PC critically succeeds or escapes the Chaos Realm.',
				questions:
					'How does this place try to steal from you that which makes you legendary? What does it feel like to have this power taken from you?'
			},
			{
				type: 'Action',
				name: 'Unmaking',
				description_html:
					'**Spend a Fear** to force a PC to make a Strength Reaction Roll. On a failure, they take **4d10** direct magic damage. On a success, they must **Mark a Stress**.',
				questions:
					'What glimpse of other worlds do you catch while this place tries to unmake you? What core facet of your personality does the unmaking try to erase?'
			},
			{
				type: 'Action',
				name: 'Outer Realms Predators',
				description_html:
					"**Spend a Fear** to summon an Outer Realms Abomination, an Outer Realms Corruptor, and **2d6** Outer Realms Thralls, who appear at Close range of a chosen PC in defiance of logic and causality. Immediately spotlight one of these adversaries, and you can **Spend an additional Fear** to automatically succeed on that adversary's standard attack.",
				questions:
					'What half-consumed remnants of the shattered world do these monstrosities cast aside in pursuit of living flesh? What jagged reflections of former personhood do you catch between moments of unquestioning malice?'
			},
			{
				type: 'Reaction',
				name: 'Disorienting Reality',
				description_html:
					'On a result with Fear, you can ask the PC to describe which of their fears the Chaos Realm evokes as a vision of reality unmakes and reconstitutes itself to the PC. The PC loses a Hope. If it is their last Hope, you gain a Fear.',
				questions:
					"What moment do they see? If it's a memory, how is it warped by this place? How hard will it be to hold on to the real memory?"
			}
		]
	},
	divine_usurpation: {
		source_key: 'SRD',
		title: 'Divine Usurpation',
		description:
			'A massive ritual designed to breach the gates of the Hallows Above and unseat the New Gods themselves.',
		tier: 4,
		image_url: '',
		artist_name: '',
		type: 'Event',
		impulses: 'Collect power, overawe, silence dissent',
		relative_strength: false,
		difficulty: 20,
		potential_adversaries:
			'Arch-Necromancer, Fallen Shock Troops, Mortal Hunter, Oracle of Doom, Perfected Zombie',
		potential_adversaries_ids: [
			'arch_necromancer',
			'fallen_shock_troop',
			'mortal_hunter',
			'oracle_of_doom',
			'perfected_zombie'
		],
		features: [
			{
				type: 'Passive',
				name: 'Final Preparations',
				description_html:
					'When the environment first takes the spotlight, designate one adversary as the Usurper seeking to overthrow the gods. Activate a Long-Term Countdown (8) as the Usurper assembles what they need to conduct the ritual. When it triggers, spotlight this environment to use the "Beginning of the End" feature. While this environment remains in play, you can hold up to 15 Fear.',
				questions:
					'What does the Usurper still require: The heart of a High Seraph? The lodestone of an ancient waygate? The loyalty of two archenemies? The heartbroken tears of a pure soul?'
			},
			{
				type: 'Passive',
				name: 'Divine Blessing',
				description_html:
					'When a PC critically succeeds, they can spend 2 Hope to refresh an ability normally limited by uses (such as once per rest, once per session).',
				questions:
					'What god favors you as you fight against this usurpation? How does your renewed power reflect their influence?'
			},
			{
				type: 'Action',
				name: 'Defilers Abound',
				description_html:
					'**Spend 2 Fear** to summon **1d4+2** Fallen Shock Troops that appear within Close range of the Usurper to assist their divine siege. Immediately spotlight the Shock Troops to use a "Group Attack" action.',
				questions:
					"Which High Fallen do these troops serve? Which god's flesh do they wish to feast upon?"
			},
			{
				type: 'Action',
				name: 'Godslayer',
				description_html:
					'If the Divine Siege Countdown (see "Beginning of the End") has triggered, you can **Spend 3 Fear** to describe the Usurper slaying one of the gods of the Hallows Above, feasting upon their power and growing stronger. The Usurper clears 2 HP. Increase their Difficulty, damage, attack modifier, or give them a new feature from the slain god.',
				questions:
					"Which god meets their end? What are their last words? How does the Usurper's new stolen power manifest?"
			},
			{
				type: 'Reaction',
				name: 'Beginning of the End',
				description_html:
					'When the "Final Preparations" long-term countdown triggers, the Usurper begins hammering on the gates of the Hallows themselves. Activate a Divine Siege Countdown (10). Spotlight the Usurper to describe the Usurper\'s assault and tick down this countdown by 1. If the Usurper takes Major or greater damage, tick up the countdown by 1. When it triggers, the Usurper shatters the barrier between the Mortal Realm and the Hallows Above to slay the gods and take their place. You gain a Fear for each unmarked HP the Usurper has. You can immediately use the "Godslayer" feature without spending Fear to make an additional GM move.',
				questions:
					'How does the Mortal Realm writhe as the natural order is violated? What mortals witness this blasphemy from afar?'
			},
			{
				type: 'Reaction',
				name: 'Ritual Nexus',
				description_html:
					'On any failure with Fear against the Usurper, the PC must **Mark 1d4 Stress** from the backlash of magical power.',
				questions:
					'What visions of failures past torment you as your efforts fall short? How are these memories twisted by the Usurper?'
			}
		]
	},
	imperial_court: {
		source_key: 'SRD',
		title: 'Imperial Court',
		description:
			'The majestic domain of a powerful empire, lavishly appointed with stolen treasures.',
		tier: 4,
		image_url: '',
		artist_name: '',
		type: 'Social',
		impulses:
			'Justify and perpetuate imperial rule, seduce rivals with promises of power and comfort',
		relative_strength: false,
		difficulty: 20,
		potential_adversaries: 'Bladed Guard, Courtesan, Knight of the Realm, Monarch, Spy',
		potential_adversaries_ids: [
			'bladed_guard',
			'courtesan',
			'knight_of_the_realm',
			'monarch',
			'spy'
		],
		features: [
			{
				type: 'Passive',
				name: 'All Roads Lead Here',
				description_html:
					"While in the Imperial Court, a PC has disadvantage on Presence Rolls made to take actions that don't fit the imperial way of life or support the empire's dominance.",
				questions:
					'How does the way language is used make even discussing alternative ways of living difficult? What obvious benefits for loyalty create friction when you try to discuss alternatives?'
			},
			{
				type: 'Passive',
				name: 'Rival Vassals',
				description_html:
					"The PCs can find imperial subjects, vassals, and supplicants in the court, each vying for favor, seeking proximity to power, exchanging favors for loyalty, and elevating their status above others'. Some might be desperate to undermine their rivals, while others might even be open to discussions that verge on sedition.",
				questions:
					'How do they benefit from vassalage, and what has it cost them? What exploitation drives them to consider opposing the unstoppable?'
			},
			{
				type: 'Action',
				name: 'The Gravity of Empire',
				description_html:
					"**Spend a Fear** to present a PC with a golden opportunity or offer to satisfy a major goal in exchange for obeying or supporting the empire. The target must make a Presence Reaction Roll. On a failure, they must **Mark all their Stress** or accept the offer. If they have already marked all their Stress, they must accept the offer or exile themselves from the empire. On a success, they must **Mark 1d4 Stress** as they're taxed by temptation.",
				questions:
					"What do the PCs want so desperately they might consider throwing in with this ruthless power? How did imperial agents learn the PC's greatest desires?"
			},
			{
				type: 'Action',
				name: 'Imperial Decree',
				description_html:
					"**Spend a Fear** to tick down a long-term countdown related to the empire's agenda by **1d4**. If this triggers the countdown, a proclamation related to the agenda is announced at court as the plan is executed.",
				questions:
					'What display of power or transfer of wealth was needed to expedite this plan? Whose lives were disrupted or upended to make this happen?'
			},
			{
				type: 'Reaction',
				name: 'Eyes Everywhere',
				description_html:
					'On a result with Fear, you can **Spend a Fear** to have someone loyal to the empire overhear seditious talk within the court. A PC must succeed on an Instinct Reaction Roll to notice that the group has been overheard so they can try to intercept the witness before the PCs are exposed.',
				questions:
					"How has the empire compromised this witness? Why is their first impulse to protect the empire, even if it doesn't treat them well?"
			}
		]
	},
	necromancers_ossuary: {
		source_key: 'SRD',
		title: "Necromancer's Ossuary",
		description:
			'A dusty crypt with a library, twisting corridors, and abundant sarcophagi, spattered with the blood of ill-fated invaders.',
		tier: 4,
		image_url: '',
		artist_name: '',
		type: 'Exploration',
		impulses:
			'Confound intruders, delve into secrets best left buried, manifest unlife, unleash a tide of undead',
		relative_strength: false,
		difficulty: 19,
		potential_adversaries: "Arch-Necromancer's Host (Perfected Zombie, Zombie Legion)",
		potential_adversaries_ids: ['perfected_zombie', 'zombie_legion'],
		features: [
			{
				type: 'Passive',
				name: 'No Place for the Living',
				description_html:
					'A feature or action that clears HP requires spending a Hope to use. If it already costs Hope, a PC must spend an additional Hope.',
				questions: 'What does it feel like to try to heal in a place so antithetical to life?'
			},
			{
				type: 'Passive',
				name: 'Centuries of Knowledge',
				description_html:
					"A PC can investigate the library and laboratory and make a Knowledge Roll to learn information related to arcana, local history, and the Necromancer's plans.",
				questions:
					'What are the names of the tomes? What project is the necromancer working on and what does it communicate about their plans?'
			},
			{
				type: 'Action',
				name: 'Skeletal Burst',
				description_html:
					'All targets within Close range of a point you choose in this environment must succeed on an Agility Reaction Roll or take **4d8+8** physical damage from skeletal shrapnel as part of the ossuary detonates around them.',
				questions:
					'What ancient skeletal architecture is destroyed? What bones stick in your armor?'
			},
			{
				type: 'Action',
				name: 'Aura of Death',
				description_html:
					'Once per scene, roll a **d4**. Each undead within Far range of the Necromancer can clear HP and Stress equal to the result rolled. The undead can choose how that number is divided between HP and Stress.',
				questions:
					'How does their renewed vigor manifest? Do they look more lifelike or, paradoxically, are they more decayed but vigorous?'
			},
			{
				type: 'Action',
				name: 'They Just Keep Coming!',
				description_html:
					'**Spend a Fear** to summon **1d6** Rotted Zombies, two Perfected Zombies, or a Zombie Legion, who appear at Close range of a chosen PC.',
				questions:
					"Who were these people before they became the necromancer's pawns? What vestiges of those lives remain for the heroes to see?"
			}
		]
	}
} as const satisfies Record<string, Environment>;
