import type { DomainCard } from '$lib/types/compendium-types';

export const MIDNIGHT_DOMAIN_CARDS = {
	pick_and_pull: {
		compendium_id: 'pick_and_pull',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Pick and Pull',
		level_requirement: 1,
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
				description_html:
					'You have advantage on action rolls to pick nonmagical locks, disarm nonmagical traps, or steal items from a target (either through stealth or by force).',
				character_modifiers: []
			}
		]
	},
	rain_of_blades: {
		compendium_id: 'rain_of_blades',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Rain of Blades',
		level_requirement: 1,
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
				description_html:
					'**Spend a Hope** to make a **Spellcast Roll** and conjure throwing blades that strike out at all targets within Very Close range. Targets you succeed against take **d8+2** magic damage using your Proficiency.\n\nIf a target you hit is *Vulnerable*, they take an extra **1d8** damage.',
				character_modifiers: []
			}
		]
	},
	uncanny_disguise: {
		compendium_id: 'uncanny_disguise',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Uncanny Disguise',
		level_requirement: 1,
		recall_cost: 0,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: true,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html:
					'When you have a few minutes to prepare, you can **mark a Stress** to don the facade of any humanoid you can picture clearly in your mind. While disguised, you have advantage on Presence Rolls to avoid scrutiny.\n\nPlace a number of tokens equal to your Spellcast trait on this card. When you take an action while disguised, spend a token from this card. After the action that spends the last token is resolved, the disguise drops.',
				character_modifiers: []
			}
		]
	},
	midnight_spirit: {
		compendium_id: 'midnight_spirit',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Midnight Spirit',
		level_requirement: 2,
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
				description_html:
					'**Spend a Hope** to summon a humanoid-sized spirit that can move or carry things for you until your next rest.\n\nYou can also send it to attack an adversary. When you do, make a **Spellcast Roll** against a target within Very Far range. On a success, the spirit moves into Melee range with that target. Roll a number of **d6s** equal to your Spellcast trait and deal that much magic damage to the target. The spirit then dissipates. You can only have one spirit at a time.',
				character_modifiers: []
			}
		]
	},
	shadowbind: {
		compendium_id: 'shadowbind',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Shadowbind',
		level_requirement: 2,
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
				description_html:
					'Make a **Spellcast Roll** against all adversaries within Very Close range. Targets you succeed against are temporarily *Restrained* as their shadow binds them in place.',
				character_modifiers: []
			}
		]
	},
	chokehold: {
		compendium_id: 'chokehold',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Chokehold',
		level_requirement: 3,
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
				description_html:
					"When you position yourself behind a creature who's about your size, you can **mark a Stress** to pull them into a chokehold, making them temporarily *Vulnerable*.\n\nWhen a creature attacks a target who is *Vulnerable* in this way, they deal an extra **2d6** damage.",
				character_modifiers: []
			}
		]
	},
	veil_of_night: {
		compendium_id: 'veil_of_night',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Veil of Night',
		level_requirement: 3,
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
				description_html:
					"Make a **Spellcast Roll (13)**. On a success, you can create a temporary curtain of darkness between two points within Far range. Only you can see through this darkness. You're considered *Hidden* to adversaries on the other side of the veil, and you have advantage on attacks you make through the darkness. The veil remains until you cast another spell.",
				character_modifiers: []
			}
		]
	},
	glyph_of_nightfall: {
		compendium_id: 'glyph_of_nightfall',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Glyph of Nightfall',
		level_requirement: 4,
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
				description_html:
					"Make a **Spellcast Roll** against a target within Very Close range. On a success, **spend a Hope** to conjure a dark glyph upon their body that exposes their weak points, temporarily reducing the target's Difficulty by a value equal to your Knowledge (minimum 1).",
				character_modifiers: []
			}
		]
	},
	stealth_expertise: {
		compendium_id: 'stealth_expertise',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Stealth Expertise',
		level_requirement: 4,
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
				description_html:
					'When you roll with Fear while attempting to move unnoticed through a dangerous area, you can **mark a Stress** to roll with Hope instead.\n\nIf an ally within Close range is also attempting to move unnoticed and rolls with Fear, you can **mark a Stress** to change their result to a roll with Hope.',
				character_modifiers: []
			}
		]
	},
	hush: {
		compendium_id: 'hush',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Hush',
		level_requirement: 5,
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
				description_html:
					"Make a **Spellcast Roll** against a target within Close range. On a success, **spend a Hope** to conjure suppressive magic around the target that encompasses everything within Very Close range of them and follows them as they move.\n\nThe target and anything within the area is *Silenced* until the GM spends a Fear on their turn to clear this condition, you cast Hush again, or you take Major damage. While *Silenced*, they can't make noise and can't cast spells.",
				character_modifiers: []
			}
		]
	},
	phantom_retreat: {
		compendium_id: 'phantom_retreat',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Phantom Retreat',
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
				description_html:
					"**Spend a Hope** to activate Phantom Retreat where you're currently standing. **Spend another Hope** at any time before your next rest to disappear from where you are and reappear where you were standing when you activated Phantom Retreat. This spell ends after you reappear.",
				character_modifiers: []
			}
		]
	},
	dark_whispers: {
		compendium_id: 'dark_whispers',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Dark Whispers',
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
				description_html: `You can speak into the mind of any person with whom you've made physical contact. Once you've opened a channel with them, they can speak back into your mind. Additionally, you can **mark a Stress** to make a **Spellcast Roll** against them. On a success, you can ask the GM one of the following questions and receive an answer:

- Where are they?
- What are they doing?
- What are they afraid of?
- What do they cherish most in the world?`,
				character_modifiers: []
			}
		]
	},
	mass_disguise: {
		compendium_id: 'mass_disguise',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Mass Disguise',
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
				description_html:
					"When you have a few minutes of silence to focus, you can **mark a Stress** to change the appearance of all willing creatures within Close range. Their new forms must share a general body structure and size, and can be somebody or something you've seen before or entirely fabricated. A disguised creature has advantage on Presence Rolls to avoid scrutiny.\n\nActivate a Countdown (8). It ticks down as a consequence the GM chooses. When it triggers, the disguise drops.",
				character_modifiers: []
			}
		]
	},
	midnight_touched: {
		compendium_id: 'midnight_touched',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Midnight-Touched',
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
				description_html: `When 4 or more of the domain cards in your loadout are from the Midnight domain, gain the following benefits:

- Once per rest, when you have 0 Hope and the GM would gain a Fear, you can gain a Hope instead.
- When you make a successful attack, you can **mark a Stress** to add the result of your Fear Die to your damage roll.`,
				character_modifiers: []
			}
		]
	},
	vanishing_dodge: {
		compendium_id: 'vanishing_dodge',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Vanishing Dodge',
		level_requirement: 7,
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
				description_html:
					'When an attack made against you that would deal physical damage fails, you can **spend a Hope** to envelop yourself in shadow, becoming *Hidden* and teleporting to a point within Close range of the attacker. You remain *Hidden* until the next time you make an action roll.',
				character_modifiers: []
			}
		]
	},
	shadowhunter: {
		compendium_id: 'shadowhunter',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Shadowhunter',
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
				description_html:
					"Your prowess is enhanced under the cover of shadow. While you're shrouded in low light or darkness, you gain a **+1** bonus to your Evasion and make attack rolls with advantage.",
				character_modifiers: []
			}
		]
	},
	spellcharge: {
		compendium_id: 'spellcharge',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Spellcharge',
		level_requirement: 8,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: true,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html:
					'When you take magic damage, place tokens equal to the number of Hit Points you marked on this card. You can store a number of tokens equal to your Spellcast trait.\n\nWhen you make a successful attack against a target, you can spend any number of tokens to add a **d6** for each token spent to your damage roll.',
				character_modifiers: []
			}
		]
	},
	night_terror: {
		compendium_id: 'night_terror',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Night Terror',
		level_requirement: 9,
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
				description_html:
					"Once per long rest, choose any targets within Very Close range to perceive you as a nightmarish horror. The targets must succeed on a Reaction Roll (16) or become temporarily *Horrified*. While *Horrified*, they're *Vulnerable*.\n\nSteal a number of Fear from the GM equal to the number of targets that are *Horrified* (up to the number of Fear in the GM's pool). Roll a number of **d6s** equal to the number of stolen Fear and deal the total damage to each *Horrified* target. Discard the stolen Fear.",
				character_modifiers: []
			}
		]
	},
	twilight_toll: {
		compendium_id: 'twilight_toll',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Twilight Toll',
		level_requirement: 9,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: true,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html:
					"Choose a target within Far range. When you succeed on an action roll against them that doesn't result in making a damage roll, place a token on this card. When you deal damage to this target, spend any number of tokens to add a **d12** for each token spent to your damage roll. You can only hold Twilight Toll on one creature at a time.\n\nWhen you choose a new target or take a rest, clear all unspent tokens.",
				character_modifiers: []
			}
		]
	},
	eclipse: {
		compendium_id: 'eclipse',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Eclipse',
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
				description_html:
					'Make a **Spellcast Roll (16)**. Once per long rest on a success, plunge the entire area within Far range into complete darkness only you and your allies can see through. Attack rolls have disadvantage when targeting you or an ally within this shadow.\n\nAdditionally, when you or an ally succeeds with Hope against an adversary within this shadow, the target must **mark a Stress**.\n\nThis spell lasts until the GM spends a Fear on their turn to clear this effect or you take Severe damage.',
				character_modifiers: []
			}
		]
	},
	specter_of_the_dark: {
		compendium_id: 'specter_of_the_dark',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'midnight',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Specter of the Dark',
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
				description_html:
					"**Mark a Stress** to become *Spectral* until you make an action roll targeting another creature. While *Spectral*, you're immune to physical damage and can float and pass through solid objects. Other creatures can still see you while you're in this form.",
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, DomainCard>;
