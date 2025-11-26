import type { DomainCard } from '$lib/types/compendium-types';

export const SPLENDOR_DOMAIN_CARDS = {
	bolt_beacon: {
		id: 'bolt_beacon',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Anthony Jones',
		image_url: '/api/images/card/art/domains/splendor/bolt-beacon.webp',
		category: 'spell',
		title: 'Bolt Beacon',
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
				description_html: `<p>Make a <b>Spellcast Roll</b> against a target within Far range. On a success, <b>spend a Hope</b> to send a bolt of shimmering light toward them, dealing <b>d8+2</b> magic damage using your Proficiency. The target becomes temporarily <em>Vulnerable</em> and glows brightly until this condition is cleared.</p>`,
				character_modifiers: []
			}
		]
	},

	mending_touch: {
		id: 'mending_touch',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Suzanne Helmigh',
		image_url: '/api/images/card/art/domains/splendor/mending-touch.webp',
		category: 'spell',
		title: 'Mending Touch',
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
				description_html: `<p>You lay your hands upon a creature and channel healing magic to close their wounds. When you can take a few minutes to focus on the target you're helping, you can <b>spend 2 Hope</b> to clear a Hit Point or a Stress on them.</p>
                     <p>Once per long rest, when you spend this healing time learning something new about them or revealing something about yourself, you can clear <b>2 Hit Points or 2 Stress</b> on them instead.</p>`,
				character_modifiers: []
			}
		]
	},

	reassurance: {
		id: 'reassurance',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Sam Key',
		image_url: '/api/images/card/art/domains/splendor/reassurance.webp',
		category: 'ability',
		title: 'Reassurance',
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
				description_html: `<p>Once per rest, after an ally attempts an action roll but before the consequences take place, you can offer assistance or words of support. When you do, your ally can reroll their dice.</p>`,
				character_modifiers: []
			}
		]
	},

	final_words: {
		id: 'final_words',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Bear Frymire',
		image_url: '/api/images/card/art/domains/splendor/final-words.webp',
		category: 'spell',
		title: 'Final Words',
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
				description_html: `<p>You can infuse a corpse with a moment of life to speak with it. Make a <b>Spellcast Roll (13)</b>.</p>
                     <ul class="list-disc list-inside ml-2">
                        <li>On a success with Hope, the corpse answers up to three questions.</li>
                        <li>On a success with Fear, the corpse answers one question.</li>
                     </ul>
                     <p>The corpse answers truthfully, but it can't impart information it didn't know in life. On a failure, or once the corpse has finished answering your questions, the body turns to dust.</p>`,
				character_modifiers: []
			}
		]
	},

	healing_hands: {
		id: 'healing_hands',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Samantha Kung',
		image_url: '/api/images/card/art/domains/splendor/healing-hands.webp',
		category: 'spell',
		title: 'Healing Hands',
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
				description_html: `<p>Make a <b>Spellcast Roll (13)</b> and target a creature other than yourself within Melee range.</p>
                     <ul class="list-disc list-inside ml-2">
                        <li>On a success, <b>mark a Stress</b> to clear 2 Hit Points or 2 Stress on the target.</li>
                        <li>On a failure, <b>mark a Stress</b> to clear a Hit Point or a Stress on the target.</li>
                     </ul>
                     <p>You can't heal the same target again until your next long rest.</p>`,
				character_modifiers: []
			}
		]
	},

	second_wind: {
		id: 'second_wind',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Mauro Alocci',
		image_url: '/api/images/card/art/domains/splendor/second-wind.webp',
		category: 'ability',
		title: 'Second Wind',
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
				description_html: `<p>Once per rest, when you succeed on an attack against an adversary, you can clear <b>3 Stress or a Hit Point</b>.</p>
                     <p>On a success with Hope, you also clear <b>3 Stress or a Hit Point</b> on an ally within Close range of you.</p>`,
				character_modifiers: []
			}
		]
	},

	voice_of_reason: {
		id: 'voice_of_reason',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Stanislav Sherbakov',
		image_url: '/api/images/card/art/domains/splendor/voice-of-reason.webp',
		category: 'ability',
		title: 'Voice of Reason',
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
				description_html: `<p>You speak with an unmatched power and authority. You have <b>advantage</b> on action rolls to de-escalate violent situations or convince someone to follow your lead.</p>
                     <p>Additionally, you're emboldened in moments of duress. When all of your Stress slots are marked, you gain a <b>+1 bonus to your Proficiency</b> for damage rolls.</p>`,
				character_modifiers: []
			}
		]
	},
	divination: {
		id: 'divination',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Diana Bakieva',
		image_url: '/api/images/card/art/domains/splendor/divination.webp',
		category: 'spell',
		title: 'Divination',
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
				description_html: `<p>Once per long rest, <b>spend 3 Hope</b> to reach out to the forces beyond and ask one "yes or no" question about an event, person, place, or situation in the near future. For a moment, the present falls away and you see the answer before you.</p>`,
				character_modifiers: []
			}
		]
	},

	life_ward: {
		id: 'life_ward',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Simon Pape',
		image_url: '/api/images/card/art/domains/splendor/life-ward.webp',
		category: 'spell',
		title: 'Life Ward',
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
				description_html: `<p><b>Spend 3 Hope</b> and choose an ally within Close range. They are marked with a glowing sigil of protection. When this ally would make a death move, they clear a Hit Point instead.</p>
                     <p>This effect ends when it saves the target from a death move, you cast Life Ward on another target, or you take a long rest.</p>`,
				character_modifiers: []
			}
		]
	},

	shape_material: {
		id: 'shape_material',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Ilya Royz',
		image_url: '/api/images/card/art/domains/splendor/shape-material.webp',
		category: 'spell',
		title: 'Shape Material',
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
				description_html: `<p><b>Spend a Hope</b> to shape a section of natural material you're touching (such as stone, ice, or wood) to suit your purpose. The area of the material can be no larger than you.</p>
                     <p>For example, you can form a rudimentary tool or create a door. You can only affect the material within Close range of where you're touching it.</p>`,
				character_modifiers: []
			}
		]
	},

	smite: {
		id: 'smite',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Geoffrey Ernault',
		image_url: '/api/images/card/art/domains/splendor/smite.webp',
		category: 'spell',
		title: 'Smite',
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
				description_html: `<p>Once per rest, <b>spend 3 Hope</b> to charge your powerful smite. When you next successfully attack with a weapon, <b>double the result</b> of your damage roll. This attack deals magic damage regardless of the weapon's damage type.</p>`,
				character_modifiers: []
			}
		]
	},

	restoration: {
		id: 'restoration',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Mat Wilma',
		image_url: '/api/images/card/art/domains/splendor/restoration.webp',
		category: 'spell',
		title: 'Restoration',
		level_requirement: 6,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: true,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `<p>After a long rest, place a number of tokens equal to your Spellcast trait on this card.</p>
                     <p>Touch a creature and spend any number of tokens to clear <b>2 Hit Points or 2 Stress</b> for each token spent.</p>
                     <p>You can also spend a token from this card when touching a creature to clear the <em>Vulnerable</em> condition or heal a physical or magical ailment (the GM might require additional tokens depending on the strength of the ailment).</p>
                     <p>When you take a long rest, clear all unspent tokens.</p>`,
				character_modifiers: []
			}
		]
	},

	zone_of_protection: {
		id: 'zone_of_protection',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Anthony Jones',
		image_url: '/api/images/card/art/domains/splendor/zone-of-protection.webp',
		category: 'spell',
		title: 'Zone of Protection',
		level_requirement: 6,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: true,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `<p>Make a <b>Spellcast Roll (16)</b>. Once per long rest on a success, choose a point within Far range and create a visible zone of protection there for all allies within Very Close range of that point.</p>
                     <p>When you do, place a <b>d6</b> on this card with the 1 value facing up. When an ally in this zone takes damage, they reduce it by the die's value. You then increase the die's value by one. When the die's value would exceed 6, this effect ends.</p>`,
				character_modifiers: []
			}
		]
	},
	healing_strike: {
		id: 'healing_strike',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Juan S. Almenicon',
		image_url: '/api/images/card/art/domains/splendor/healing-strike.webp',
		category: 'spell',
		title: 'Healing Strike',
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
				description_html: `<p>When you deal damage to an adversary, you can <b>spend 2 Hope</b> to clear a Hit Point on an ally within Close range.</p>`,
				character_modifiers: []
			}
		]
	},

	splendor_touched: {
		id: 'splendor_touched',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Daarken',
		image_url: '/api/images/card/art/domains/splendor/splendor-touched.webp',
		category: 'ability',
		title: 'Splendor-Touched',
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
				description_html: `<p>When 4 or more of the domain cards in your loadout are from the Splendor domain, gain the following benefits:</p>
                     <ul class="list-disc list-inside ml-2">
                        <li>+3 bonus to your Severe damage threshold</li>
                        <li>Once per long rest, when incoming damage would require you to mark a number of Hit Points, you can choose to mark that much Stress or spend that much Hope instead.</li>
                     </ul>`,
				character_modifiers: [
					{
						behaviour: 'bonus',
						target: 'severe_damage_threshold',
						type: 'flat',
						value: 3,
						character_conditions: [
							{
								type: 'min_loadout_cards_from_domain',
								domain_id: 'splendor',
								min_cards: 4
							}
						]
					}
				]
			}
		]
	},

	shield_aura: {
		id: 'shield_aura',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Danil Luzin',
		image_url: '/api/images/card/art/domains/splendor/shield-aura.webp',
		category: 'spell',
		title: 'Shield Aura',
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
				description_html: `<p><b>Mark a Stress</b> to cast a protective aura on a target within Very Close range. When the target marks an Armor Slot, they reduce the severity of the attack by an additional threshold. If this spell causes a creature who would be damaged to instead mark no Hit Points, the effect ends.</p>
                     <p>You can only hold Shield Aura on one creature at a time.</p>`,
				character_modifiers: []
			}
		]
	},

	stunning_sunlight: {
		id: 'stunning_sunlight',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Anthony Jones',
		image_url: '/api/images/card/art/domains/splendor/stunning-sunlight.webp',
		category: 'spell',
		title: 'Stunning Sunlight',
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
				description_html: `<p>Make a <b>Spellcast Roll</b> to unleash powerful rays of burning sunlight against all adversaries in front of you within Far range. On a success, <b>spend any number of Hope</b> and force that many targets you succeeded against to make a <b>Reaction Roll (14)</b>.</p>
                     <ul class="list-disc list-inside ml-2">
                        <li>Targets who succeed take <b>3d20+3</b> magic damage.</li>
                        <li>Targets who fail take <b>4d20+5</b> magic damage and are temporarily <em>Stunned</em>.</li>
                     </ul>
                     <p>While Stunned, they can't use reactions and can't take any other actions until they clear this condition.</p>`,
				character_modifiers: []
			}
		]
	},

	overwhelming_aura: {
		id: 'overwhelming_aura',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Eliot Baum',
		image_url: '/api/images/card/art/domains/splendor/overwhelming-aura.webp',
		category: 'spell',
		title: 'Overwhelming Aura',
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
				description_html: `<p>Make a <b>Spellcast Roll (15)</b> to magically empower your aura. On a success, <b>spend 2 Hope</b> to make your Presence equal to your Spellcast trait until your next long rest.</p>
                     <p>While this spell is active, an adversary must <b>mark a Stress</b> when they target you with an attack.</p>`,
				character_modifiers: []
			}
		]
	},

	salvation_beam: {
		id: 'salvation_beam',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Daarken',
		image_url: '/api/images/card/art/domains/splendor/salvation-beam.webp',
		category: 'spell',
		title: 'Salvation Beam',
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
				description_html: `<p>Make a <b>Spellcast Roll (16)</b>. On a success, <b>mark any number of Stress</b> to target a line of allies within Far range.</p>
                     <p>You can clear Hit Points on the targets equal to the number of Stress marked, divided among them however you'd like.</p>`,
				character_modifiers: []
			}
		]
	},

	invigoration: {
		id: 'invigoration',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Jenny Tan',
		image_url: '/api/images/card/art/domains/splendor/invigoration.webp',
		category: 'spell',
		title: 'Invigoration',
		level_requirement: 10,
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
				description_html: `<p>When you or an ally within Close range has used a feature that has an exhaustion limit (such as once per rest or once per session), you can <b>spend any number of Hope</b> and roll that many <b>d6s</b>. If any roll a 6, the feature can be used again.</p>`,
				character_modifiers: []
			}
		]
	},

	resurrection: {
		id: 'resurrection',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'splendor',
		artist_name: 'Dominik Mayer',
		image_url: '/api/images/card/art/domains/splendor/resurrection.webp',
		category: 'spell',
		title: 'Resurrection',
		level_requirement: 10,
		recall_cost: 2,
		applies_in_vault: true,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `<p>Make a <b>Spellcast Roll (20)</b>. On a success, restore one creature who has been dead no longer than 100 years to full strength. Then roll a <b>d6</b>. On a result of 5 or lower, place this card in your vault permanently.</p>
                     <p>On a failure, you can't cast Resurrection again for a week.</p>`,
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, DomainCard>;
