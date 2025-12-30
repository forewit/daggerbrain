import type { DomainCard } from '$lib/types/compendium-types';

export const CODEX_DOMAIN_CARDS = {
	book_of_ava: {
		compendium_id: 'book_of_ava',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'grimoire',
		title: 'Book of Ava',
		level_requirement: 1,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `***Power Push:*** Make a **Spellcast Roll** against a target within Melee range. On a success, they're knocked back to Far range and take **d10+2** magic damage using your Proficiency.

***Tava's Armor:*** **Spend a Hope** to give a target you can touch a +1 bonus to their Armor Score until their next rest or you cast Tava's Armor again.

***Ice Spike:*** Make a **Spellcast Roll (12)** to summon a large ice spike within Far range. If you use it as a weapon, make the Spellcast Roll against the target's Difficulty instead. On a success, deal **d6** physical damage using your Proficiency.`,
				character_modifiers: []
			}
		]
	},
	book_of_illiat: {
		compendium_id: 'book_of_illiat',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'grimoire',
		title: 'Book of Illiat',
		level_requirement: 1,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `***Slumber:*** Make a **Spellcast Roll** against a target within Very Close range. On a success, they're *Asleep* until they take damage or the GM spends a Fear on their turn to clear this condition.

***Arcane Barrage:*** Once per rest, **spend any number of Hope** and shoot magical projectiles that strike a target of your choice within Close range. Roll a number of **d6s** equal to the Hope spent and deal that much magic damage to the target.

***Telepathy:*** **Spend a Hope** to open a line of mental communication with one target you can see. This connection lasts until your next rest or you cast Telepathy again.`,
				character_modifiers: []
			}
		]
	},
	book_of_tyfar: {
		compendium_id: 'book_of_tyfar',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'grimoire',
		title: 'Book of Tyfar',
		level_requirement: 1,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `***Wild Flame:*** Make a **Spellcast Roll** against up to three adversaries within Melee range. Targets you succeed against take **2d6** magic damage and must mark a Stress as flames erupt from your hand.

***Magic Hand:*** You conjure a magical hand with the same size and strength as your own within Far range.

***Mysterious Mist:*** Make a **Spellcast Roll (13)** to cast a temporary thick fog that gathers in a stationary area within Very Close range. The fog heavily obscures this area and everything in it.`,
				character_modifiers: []
			}
		]
	},
	book_of_sitil: {
		compendium_id: 'book_of_sitil',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'grimoire',
		title: 'Book of Sitil',
		level_requirement: 2,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `***Adjust Appearance:*** You magically shift your appearance and clothing to avoid recognition.

***Parallela:*** **Spend 2 Hope** to cast this spell on yourself or an ally within Close range. The next time the target makes an attack, they can hit an additional target within range that their attack roll would succeed against. You can only hold this spell on one creature at a time.

***Illusion:*** Make a **Spellcast Roll (14)**. On a success, create a temporary visual illusion no larger than you within Close range that lasts for as long as you look at it. It holds up to scrutiny until an observer is within Melee range.`,
				character_modifiers: []
			}
		]
	},
	book_of_vagras: {
		compendium_id: 'book_of_vagras',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'grimoire',
		title: 'Book of Vagras',
		level_requirement: 2,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `***Runic Lock:*** Make a **Spellcast Roll (15)** on an object you're touching that can close (such as a lock, chest, or box). Once per rest on a success, you can lock the object so it can only be opened by creatures of your choice. Someone with access to magic and an hour of time to study the spell can break it.

***Arcane Door:*** When you have no adversaries within Melee range, make a **Spellcast Roll (13)**. On a success, **spend a Hope** to create a portal from where you are to a point within Far range you can see. It closes once a creature has passed through it.

***Reveal:*** Make a **Spellcast Roll**. If there is anything magically hidden within Close range, the roll would succeed against, it is revealed.`,
				character_modifiers: []
			}
		]
	},
	// todo: verify everything below
	book_of_korvax: {
		compendium_id: 'book_of_korvax',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'grimoire',
		title: 'Book of Korvax',
		level_requirement: 3,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `***Levitation:*** Make a **Spellcast Roll** to temporarily lift a target you can see up into the air and move them within Close range of their original position.

***Recant:*** **Spend a Hope** to force a target within Melee range to make a **Reaction Roll (15)**. On a failure, they forget the last minute of your conversation.

***Rune Circle:*** **Mark a Stress** to create a temporary magical circle on the ground where you stand. All adversaries within Melee range, or who enter Melee range, take **2d12+4** magic damage and are knocked back to Very Close range.`,
				character_modifiers: []
			}
		]
	},
	book_of_norai: {
		compendium_id: 'book_of_norai',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'grimoire',
		title: 'Book of Norai',
		level_requirement: 3,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `***Mystic Tether:*** Make a **Spellcast Roll** against a target within Far range. On a success, they're temporarily *Restrained* and must mark a Stress. If you target a flying creature, this spell grounds and temporarily Restrains them.

***Fireball:*** Make a **Spellcast Roll** against a target within Very Far range. On a success, hurl a sphere of fire toward them that explodes on impact. The target and all creatures within Very Close range of them must make a **Reaction Roll (13)**. Targets who fail take **d20+5** magic damage using your Proficiency. Targets who succeed take half damage.`,
				character_modifiers: []
			}
		]
	},
	book_of_exota: {
		compendium_id: 'book_of_exota',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'grimoire',
		title: 'Book of Exota',
		level_requirement: 4,
		recall_cost: 3,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `***Repudiate:*** You can interrupt a magical effect taking place. Make a **Reaction Roll** using your Spellcast trait. Once per rest on a success, the effect stops and any consequences are avoided.

***Create Construct:*** **Spend a Hope** to choose a group of objects around you and create an animated construct from them that obeys basic commands. Make a **Spellcast Roll** to command them to take action. When necessary, they share your Evasion and traits and their attacks deal **2d10+3** physical damage. You can only maintain one construct at a time, and they fall apart when they take any amount of damage.`,
				character_modifiers: []
			}
		]
	},
	book_of_grynn: {
		compendium_id: 'book_of_grynn',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'grimoire',
		title: 'Book of Grynn',
		level_requirement: 4,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `***Arcane Deflection:*** Once per long rest, **spend a Hope** to negate the damage of an attack targeting you or an ally within Very Close range.

***Time Lock:*** Target an object within Far range. That object stops in time and space exactly where it is until your next rest. If a creature tries to move it, make a **Spellcast Roll** against them to maintain this spell.

***Wall of Flame:*** Make a **Spellcast Roll (15)**. On a success, create a wall of magical flame between two points within Far range. All creatures in its path must choose a side to be on, and anything that subsequently passes through the wall takes **4d10+3** magic damage.`,
				character_modifiers: []
			}
		]
	},
	manifest_wall: {
		compendium_id: 'manifest_wall',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Manifest Wall',
		level_requirement: 5,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Make a **Spellcast Roll (15)**. Once per rest on a success, **spend a Hope** to create a temporary magical wall between two points within Far range. It can be up to 50 feet high and form at any angle. Creatures or objects in its path are shunted to a side of your choice. The wall stays up until your next rest or you cast Manifest Wall again.`,
				character_modifiers: []
			}
		]
	},
	teleport: {
		compendium_id: 'teleport',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Teleport',
		level_requirement: 5,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Once per long rest, you can instantly teleport yourself and any number of willing targets within Close range to a place you've been before. Choose one of the following options, then make a **Spellcast Roll (16)**:

- If you know the place very well, gain a +3 bonus.
- If you've visited the place frequently, gain a +1 bonus.
- If you've visited the place infrequently, gain no modifier.
- If you've only been there once, gain a −2 penalty.

On a success, you appear where you were intending to go. On a failure, you appear off course, with the range of failure determining how far off course.`,
				character_modifiers: []
			}
		]
	},
	banish: {
		compendium_id: 'banish',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Banish',
		level_requirement: 6,
		recall_cost: 0,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Make a **Spellcast Roll** against a target within Close range. On a success, roll a number of **d20s** equal to your Spellcast trait. The target must make a reaction roll with a Difficulty equal to your highest result. On a success, the target must mark a Stress but isn't banished. Once per rest on a failure, they are banished from this realm.

When the PCs roll with Fear, the Difficulty gains a −1 penalty and the target makes another reaction roll. On a success, they return from banishment.`,
				character_modifiers: []
			}
		]
	},
	sigil_of_retribution: {
		compendium_id: 'sigil_of_retribution',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Sigil of Retribution',
		level_requirement: 6,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Mark an adversary within Close range with a sigil of retribution. The GM gains a Fear. When the marked adversary deals damage to you or your allies, place a **d8** on this card. You can hold a number of d8s equal to your level.

When you successfully attack the marked adversary, roll the dice on this card and add the total to your damage roll, then clear the dice. This effect ends when the marked adversary is defeated or you cast Sigil of Retribution again.`,
				character_modifiers: []
			}
		]
	},
	book_of_homet: {
		compendium_id: 'book_of_homet',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'grimoire',
		title: 'Book of Homet',
		level_requirement: 7,
		recall_cost: 0,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `***Pass Through:*** Make a **Spellcast Roll (13)**. Once per rest on a success, you and all creatures touching you can pass through a wall or door within Close range. The effect ends once everyone is on the other side.

***Plane Gate:*** Make a **Spellcast Roll (14)**. Once per long rest on a success, open a gateway to a location in another dimension or plane of existence you've been to before. This gateway lasts until your next rest.`,
				character_modifiers: []
			}
		]
	},
	codex_touched: {
		compendium_id: 'codex_touched',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Codex-Touched',
		level_requirement: 7,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `When 4 or more of the domain cards in your loadout are from the Codex domain, gain the following benefits:

- You can mark a Stress to add your Proficiency to a Spellcast Roll.
- Once per rest, replace this card with any card from your vault without paying its Recall Cost.`,
				character_modifiers: []
			}
		]
	},
	book_of_vyola: {
		compendium_id: 'book_of_vyola',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'grimoire',
		title: 'Book of Vyola',
		level_requirement: 8,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `***Memory Delve:*** Make a **Spellcast Roll** against a target within Far range. On a success, peer into the target's mind and ask the GM a question. The GM describes any memories the target has pertaining to the answer.

***Shared Clarity:*** Once per long rest, **spend a Hope** to choose two willing creatures. When one of them would mark Stress, they can choose between the two of them who marks it. This spell lasts until their next rest.`,
				character_modifiers: []
			}
		]
	},
	safe_haven: {
		compendium_id: 'safe_haven',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Safe Haven',
		level_requirement: 8,
		recall_cost: 3,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `When you have a few minutes of calm to focus, you can **spend 2 Hope** to summon your Safe Haven, a large interdimensional home where you and your allies can take shelter.

When you do, a magical door appears somewhere within Close range. Only creatures of your choice can enter. Once inside, you can make the entrance invisible. You and anyone else inside can always exit. Once you leave, the doorway must be summoned again.

When you take a rest within your own Safe Haven, you can choose an additional downtime move.`,
				character_modifiers: []
			}
		]
	},
	book_of_ronin: {
		compendium_id: 'book_of_ronin',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'grimoire',
		title: 'Book of Ronin',
		level_requirement: 9,
		recall_cost: 4,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `***Transform:*** Make a **Spellcast Roll (15)**. On a success, transform into an inanimate object no larger than twice your normal size. You can remain in this shape until you take damage.

***Eternal Enervation:*** Once per long rest, make a **Spellcast Roll** against a target within Close range. On a success, they become permanently *Vulnerable*. They can't clear this condition by any means.`,
				character_modifiers: []
			}
		]
	},
	disintegration_wave: {
		compendium_id: 'disintegration_wave',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Disintegration Wave',
		level_requirement: 9,
		recall_cost: 4,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Make a **Spellcast Roll (18)**. Once per long rest on a success, the GM tells you which adversaries within Far range have a Difficulty of 18 or lower. **Mark a Stress** for each one you wish to hit with this spell. They are killed and can't come back to life by any means.`,
				character_modifiers: []
			}
		]
	},
	book_of_yarrow: {
		compendium_id: 'book_of_yarrow',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'grimoire',
		title: 'Book of Yarrow',
		level_requirement: 10,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `***Timejammer:*** Make a **Spellcast Roll (18)**. On a success, time temporarily slows to a halt for everyone within Far range except for you. It resumes the next time you make an action roll that targets another creature.

***Magic Immunity:*** **Spend 5 Hope** to become immune to magic damage until your next rest.`,
				character_modifiers: []
			}
		]
	},
	transcendent_union: {
		compendium_id: 'transcendent_union',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'codex',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Transcendent Union',
		level_requirement: 10,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Once per long rest, **spend 5 Hope** to cast this spell on two or more willing creatures. Until your next rest, when a creature connected by this union would mark Stress or Hit Points, the connected creatures can choose who marks it.`,
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, DomainCard>;
