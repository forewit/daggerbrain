import type { DomainCard } from '$lib/types/compendium-types';

export const MIDNIGHT_DOMAIN_CARDS = {
	pick_and_pull: {
		id: 'pick_and_pull',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Benjamin Ee',
		image_url: '/api/images/card/art/domains/midnight/pick-and-pull.webp',
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
					'<p>You have advantage on action rolls to pick nonmagical locks, disarm nonmagical traps, or steal items from a target (either through stealth or by force).</p>',
				character_modifiers: []
			}
		]
	},
	rain_of_blades: {
		id: 'rain_of_blades',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Linda Lithén',
		image_url: '/api/images/card/art/domains/midnight/rain-of-blades.webp',
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
					'<p><b>Spend a Hope</b> to make a <b>Spellcast Roll</b> and conjure throwing blades that strike out at all targets within Very Close range. Targets you succeed against take <b>d8+2</b> magic damage using your Proficiency.</p><p>If a target you hit is <em>Vulnerable</em>, they take an extra <b>1d8</b> damage.</p>',
				character_modifiers: []
			}
		]
	},
	uncanny_disguise: {
		id: 'uncanny_disguise',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Linda Lithén',
		image_url: '/api/images/card/art/domains/midnight/uncanny-disguise.webp',
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
					'<p>When you have a few minutes to prepare, you can <b>mark a Stress</b> to don the facade of any humanoid you can picture clearly in your mind. While disguised, you have advantage on Presence Rolls to avoid scrutiny.</p><p>Place a number of tokens equal to your Spellcast trait on this card. When you take an action while disguised, spend a token from this card. After the action that spends the last token is resolved, the disguise drops.</p>',
				character_modifiers: []
			}
		]
	},
	midnight_spirit: {
		id: 'midnight_spirit',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Reiko Murakami',
		image_url: '/api/images/card/art/domains/midnight/midnight-spirit.webp',
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
					'<p><b>Spend a Hope</b> to summon a humanoid-sized spirit that can move or carry things for you until your next rest.</p><p>You can also send it to attack an adversary. When you do, make a <b>Spellcast Roll</b> against a target within Very Far range. On a success, the spirit moves into Melee range with that target. Roll a number of <b>d6s</b> equal to your Spellcast trait and deal that much magic damage to the target. The spirit then dissipates. You can only have one spirit at a time.</p>',
				character_modifiers: []
			}
		]
	},
	shadowbind: {
		id: 'shadowbind',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Adam Barker',
		image_url: '/api/images/card/art/domains/midnight/shadowbind.webp',
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
					'<p>Make a <b>Spellcast Roll</b> against all adversaries within Very Close range. Targets you succeed against are temporarily <em>Restrained</em> as their shadow binds them in place.</p>',
				character_modifiers: []
			}
		]
	},
	chokehold: {
		id: 'chokehold',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Anthony Jones',
		image_url: '/api/images/card/art/domains/midnight/chokehold.webp',
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
					"<p>When you position yourself behind a creature who's about your size, you can <b>mark a Stress</b> to pull them into a chokehold, making them temporarily <em>Vulnerable</em>.</p><p>When a creature attacks a target who is <em>Vulnerable</em> in this way, they deal an extra <b>2d6</b> damage.</p>",
				character_modifiers: []
			}
		]
	},
	veil_of_night: {
		id: 'veil_of_night',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Joshua Rodriguez',
		image_url: '/api/images/card/art/domains/midnight/veil-of-night.webp',
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
					"<p>Make a <b>Spellcast Roll (13)</b>. On a success, you can create a temporary curtain of darkness between two points within Far range. Only you can see through this darkness. You're considered <em>Hidden</em> to adversaries on the other side of the veil, and you have advantage on attacks you make through the darkness. The veil remains until you cast another spell.</p>",
				character_modifiers: []
			}
		]
	},
	glyph_of_nightfall: {
		id: 'glyph_of_nightfall',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Anthony Jones',
		image_url: '/api/images/card/art/domains/midnight/glyph-of-nightfall.webp',
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
					"<p>Make a <b>Spellcast Roll</b> against a target within Very Close range. On a success, <b>spend a Hope</b> to conjure a dark glyph upon their body that exposes their weak points, temporarily reducing the target's Difficulty by a value equal to your Knowledge (minimum 1).</p>",
				character_modifiers: []
			}
		]
	},
	stealth_expertise: {
		id: 'stealth_expertise',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Carlos C Díaz',
		image_url: '/api/images/card/art/domains/midnight/stealth-expertise.webp',
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
					'<p>When you roll with Fear while attempting to move unnoticed through a dangerous area, you can <b>mark a Stress</b> to roll with Hope instead.</p><p>If an ally within Close range is also attempting to move unnoticed and rolls with Fear, you can <b>mark a Stress</b> to change their result to a roll with Hope.</p>',
				character_modifiers: []
			}
		]
	},
	hush: {
		id: 'hush',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Laura Galli',
		image_url: '/api/images/card/art/domains/midnight/hush.webp',
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
					"<p>Make a <b>Spellcast Roll</b> against a target within Close range. On a success, <b>spend a Hope</b> to conjure suppressive magic around the target that encompasses everything within Very Close range of them and follows them as they move.</p><p>The target and anything within the area is <em>Silenced</em> until the GM spends a Fear on their turn to clear this condition, you cast Hush again, or you take Major damage. While <em>Silenced</em>, they can't make noise and can't cast spells.</p>",
				character_modifiers: []
			}
		]
	},
	phantom_retreat: {
		id: 'phantom_retreat',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'José Muñoz',
		image_url: '/api/images/card/art/domains/midnight/phantom-retreat.webp',
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
					"<p><b>Spend a Hope</b> to activate Phantom Retreat where you're currently standing. <b>Spend another Hope</b> at any time before your next rest to disappear from where you are and reappear where you were standing when you activated Phantom Retreat. This spell ends after you reappear.</p>",
				character_modifiers: []
			}
		]
	},
	dark_whispers: {
		id: 'dark_whispers',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Jenny Tan',
		image_url: '/api/images/card/art/domains/midnight/dark-whispers.webp',
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
				description_html: `<p>You can speak into the mind of any person with whom you've made physical contact. Once you've opened a channel with them, they can speak back into your mind. Additionally, you can <b>mark a Stress</b> to make a <b>Spellcast Roll</b> against them. On a success, you can ask the GM one of the following questions and receive an answer:</p>
                                    <ul class="list-disc list-inside ml-2">
                                        <li>Where are they?</li>
                                        <li>What are they doing?</li>
                                        <li>What are they afraid of?</li>
                                        <li>What do they cherish most in the world?</li>
                                    </ul>`,
				character_modifiers: []
			}
		]
	},
	mass_disguise: {
		id: 'mass_disguise',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Anthony Jones',
		image_url: '/api/images/card/art/domains/midnight/mass-disguise.webp',
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
					"<p>When you have a few minutes of silence to focus, you can <b>mark a Stress</b> to change the appearance of all willing creatures within Close range. Their new forms must share a general body structure and size, and can be somebody or something you've seen before or entirely fabricated. A disguised creature has advantage on Presence Rolls to avoid scrutiny.</p><p>Activate a Countdown (8). It ticks down as a consequence the GM chooses. When it triggers, the disguise drops.</p>",
				character_modifiers: []
			}
		]
	},
	midnight_touched: {
		id: 'midnight_touched',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Joshua Rodriguez',
		image_url: '/api/images/card/art/domains/midnight/midnight-touched.webp',
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
				description_html: `<p>When 4 or more of the domain cards in your loadout are from the Midnight domain, gain the following benefits:</p>
                                    <ul class="list-disc list-inside ml-2">
                                        <li>Once per rest, when you have 0 Hope and the GM would gain a Fear, you can gain a Hope instead.</li>
                                        <li>When you make a successful attack, you can <b>mark a Stress</b> to add the result of your Fear Die to your damage roll.</li>
                                    </ul>`,
				character_modifiers: []
			}
		]
	},
	vanishing_dodge: {
		id: 'vanishing_dodge',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Arturo G. González',
		image_url: '/api/images/card/art/domains/midnight/vanishing-dodge.webp',
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
					'<p>When an attack made against you that would deal physical damage fails, you can <b>spend a Hope</b> to envelop yourself in shadow, becoming <em>Hidden</em> and teleporting to a point within Close range of the attacker. You remain <em>Hidden</em> until the next time you make an action roll.</p>',
				character_modifiers: []
			}
		]
	},
	shadowhunter: {
		id: 'shadowhunter',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Samantha Kung',
		image_url: '/api/images/card/art/domains/midnight/shadowhunter.webp',
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
					"<p>Your prowess is enhanced under the cover of shadow. While you're shrouded in low light or darkness, you gain a <b>+1</b> bonus to your Evasion and make attack rolls with advantage.</p>",
				character_modifiers: []
			}
		]
	},
	spellcharge: {
		id: 'spellcharge',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Geoffrey Ernault',
		image_url: '/api/images/card/art/domains/midnight/spellcharge.webp',
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
					'<p>When you take magic damage, place tokens equal to the number of Hit Points you marked on this card. You can store a number of tokens equal to your Spellcast trait.</p><p>When you make a successful attack against a target, you can spend any number of tokens to add a <b>d6</b> for each token spent to your damage roll.</p>',
				character_modifiers: []
			}
		]
	},
	night_terror: {
		id: 'night_terror',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Anthony Jones',
		image_url: '/api/images/card/art/domains/midnight/night-terror.webp',
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
					"<p>Once per long rest, choose any targets within Very Close range to perceive you as a nightmarish horror. The targets must succeed on a Reaction Roll (16) or become temporarily <em>Horrified</em>. While <em>Horrified</em>, they're <em>Vulnerable</em>.</p><p>Steal a number of Fear from the GM equal to the number of targets that are <em>Horrified</em> (up to the number of Fear in the GM's pool). Roll a number of <b>d6s</b> equal to the number of stolen Fear and deal the total damage to each <em>Horrified</em> target. Discard the stolen Fear.</p>",
				character_modifiers: []
			}
		]
	},
	twilight_toll: {
		id: 'twilight_toll',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Rafater',
		image_url: '/api/images/card/art/domains/midnight/twilight-toll.webp',
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
					"<p>Choose a target within Far range. When you succeed on an action roll against them that doesn't result in making a damage roll, place a token on this card. When you deal damage to this target, spend any number of tokens to add a <b>d12</b> for each token spent to your damage roll. You can only hold Twilight Toll on one creature at a time.</p><p>When you choose a new target or take a rest, clear all unspent tokens.</p>",
				character_modifiers: []
			}
		]
	},
	eclipse: {
		id: 'eclipse',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Arturo G. González',
		image_url: '/api/images/card/art/domains/midnight/eclipse.webp',
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
					'<p>Make a <b>Spellcast Roll (16)</b>. Once per long rest on a success, plunge the entire area within Far range into complete darkness only you and your allies can see through. Attack rolls have disadvantage when targeting you or an ally within this shadow.</p><p>Additionally, when you or an ally succeeds with Hope against an adversary within this shadow, the target must <b>mark a Stress</b>.</p><p>This spell lasts until the GM spends a Fear on their turn to clear this effect or you take Severe damage.</p>',
				character_modifiers: []
			}
		]
	},
	specter_of_the_dark: {
		id: 'specter_of_the_dark',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'midnight',
		artist_name: 'Alex Konstad',
		image_url: '/api/images/card/art/domains/midnight/specter-of-the-dark.webp',
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
					"<p><b>Mark a Stress</b> to become <em>Spectral</em> until you make an action roll targeting another creature. While <em>Spectral</em>, you're immune to physical damage and can float and pass through solid objects. Other creatures can still see you while you're in this form.</p>",
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, DomainCard>;
