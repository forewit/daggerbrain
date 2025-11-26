import type { DomainCard } from '$lib/types/compendium-types';

export const ARCANA_DOMAIN_CARDS = {
	rune_ward: {
		id: 'rune_ward',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Laura Marie Neal',
		image_url: '/images/card/art/domains/arcana/rune-ward.webp',
		category: 'spell',
		title: 'Rune Ward',
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
					"<p>You have a deeply personal trinket that can be infused with protective magic and held as a ward by you or an ally. Describe what it is and why it's important to you.</p><p>The ward's holder can spend a Hope to reduce incoming damage by <b>1d8</b>.</p><p>If the Ward Die result is 8, the ward's power ends after it reduces damage this turn. It can be recharged for free on your next rest.</p>",
				character_modifiers: []
			}
		]
	},
	unleash_chaos: {
		id: 'unleash_chaos',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Ernanda Souza',
		image_url: '/images/card/art/domains/arcana/unleash-chaos.webp',
		category: 'spell',
		title: 'Unleash Chaos',
		level_requirement: 1,
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
					'<p>At the beginning of a session, place a number of tokens equal to your Spellcast trait on this card.</p><p>Make a <b>Spellcast Roll</b> against a target within Far range and spend any number of tokens to channel raw energy from within yourself to unleash against them.</p><p>On a success, roll a number of <b>d10s</b> equal to the tokens you spent and deal that much magic damage to the target. <b>Mark Stress</b> to replenish this card with tokens (up to your Spellcast trait). At the end of each session, clear all unspent tokens.</p>',
				character_modifiers: []
			}
		]
	},
	wall_walk: {
		id: 'wall_walk',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Julia Metzger',
		image_url: '/images/card/art/domains/arcana/wall-walk.webp',
		category: 'spell',
		title: 'Wall Walk',
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
					'<p>Spend a <b>Hope</b> to allow a creature you can touch to climb on walls and ceilings as easily as walking on the ground. This lasts until the end of the scene or you cast Wall Walk again.</p>',
				character_modifiers: []
			}
		]
	},
	cinder_grasp: {
		id: 'cinder_grasp',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Jenny Tan',
		image_url: '/images/card/art/domains/arcana/cinder-grasp.webp',
		category: 'spell',
		title: 'Cinder Grasp',
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
					'<p>Make a <b>Spellcast Roll</b> against a target within Melee range. On a success, the target instantly bursts into flames, takes <b>1d20+3</b> magic damage, and is temporarily lit <em>On Fire</em>. When a creature acts while <em>On Fire</em>, they must take an extra <b>2d6</b> magic damage if they are still <em>On Fire</em> at the end of their action.</p>',
				character_modifiers: []
			}
		]
	},
	floating_eye: {
		id: 'floating_eye',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Anthony Jones',
		image_url: '/images/card/art/domains/arcana/floating-eye.webp',
		category: 'spell',
		title: 'Floating Eye',
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
					"<p>Spend a <b>Hope</b> to create a single, small floating orb that you can move anywhere within Very Far range. While this spell is active, you can see through the orb as though you're looking out from its position. You can transition between using your own senses and seeing through the orb freely. If the orb takes damage or moves out of range, the spell ends.</p>",
				character_modifiers: []
			}
		]
	},
	counterspell: {
		id: 'counterspell',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Dominik Mayer',
		image_url: '/images/card/art/domains/arcana/counterspell.webp',
		category: 'spell',
		title: 'Counterspell',
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
				description_html:
					'<p>You can interrupt a magical effect taking place by making a reaction roll using your Spellcast trait. On a success, the effect stops and any consequences are avoided, and this card is placed in your vault.</p>',
				character_modifiers: []
			}
		]
	},
	flight: {
		id: 'flight',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Samantha Kung',
		image_url: '/images/card/art/domains/arcana/flight.webp',
		category: 'spell',
		title: 'Flight',
		level_requirement: 3,
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
					'<p>Make a <b>Spellcast Roll (15)</b>. On a success, place a number of tokens equal to your Agility on this card (minimum 1). When you make an action roll while flying, spend a token from this card. After the action that spends the last token is resolved, you descend to the ground directly below you.</p>',
				character_modifiers: []
			}
		]
	},
	blink_out: {
		id: 'blink_out',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Dominik Mayer',
		image_url: '/images/card/art/domains/arcana/blink-out.webp',
		category: 'spell',
		title: 'Blink Out',
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
					'<p>Make a <b>Spellcast Roll (12)</b>. On a success, <b>spend a Hope</b> to teleport to another point you can see within Far range. If any willing creatures are within Very Close range, <b>spend an additional Hope</b> for each creature to bring them with you.</p>',
				character_modifiers: []
			}
		]
	},
	preservation_blast: {
		id: 'preservation_blast',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Daarken',
		image_url: '/images/card/art/domains/arcana/preservation-blast.webp',
		category: 'spell',
		title: 'Preservation Blast',
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
				description_html:
					'<p>Make a <b>Spellcast Roll</b> against all targets within Melee range. Targets you succeed against are forced back to Far range and take <b>d8+3</b> magic damage using your Spellcast trait.</p>',
				character_modifiers: []
			}
		]
	},
	chain_lightning: {
		id: 'chain_lightning',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Bear Frymire',
		image_url: '/images/card/art/domains/arcana/chain-lightning.webp',
		category: 'spell',
		title: 'Chain Lightning',
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
					'<p><b>Mark 2 Stress</b> to make a <b>Spellcast Roll</b>, unleashing lightning on all targets within Close range. Targets you succeed against must make a reaction roll with a Difficulty equal to the result of your Spellcast Roll. Targets who fail take <b>2d8+4</b> magic damage.</p><p>Additional adversaries not already targeted by Chain Lightning and within Close range of previous targets who took damage must also make the reaction roll. Targets who fail take <b>2d8+4</b> magic damage. This chain continues until there are no more adversaries within range.</p>',
				character_modifiers: []
			}
		]
	},
	premonition: {
		id: 'premonition',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Ivan Koltovich',
		image_url: '/images/card/art/domains/arcana/premonition.webp',
		category: 'spell',
		title: 'Premonition',
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
					'<p>You can channel arcane energy to have visions of the future. Once per long rest, immediately after the GM conveys the consequences of a roll you made, you can rescind the move and consequences like they never happened and make another move instead.</p>',
				character_modifiers: []
			}
		]
	},
	rift_walker: {
		id: 'rift_walker',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Samantha B. Lucas',
		image_url: '/images/card/art/domains/arcana/rift-walker.webp',
		category: 'spell',
		title: 'Rift Walker',
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
				description_html:
					'<p>Make a <b>Spellcast Roll (15)</b>. On a success, you place an arcane marking on the ground where you currently stand. The next time you successfully cast Rift Walker, a rift in space opens up, providing safe passage back to the exact spot where the marking was placed. This rift stays open until you choose to close it or you cast another spell. You can drop the spell at any time to cast Rift Walker again and place the marking somewhere new.</p>',
				character_modifiers: []
			}
		]
	},
	telekinesis: {
		id: 'telekinesis',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Simon Pape',
		image_url: '/images/card/art/domains/arcana/telekinesis.webp',
		category: 'spell',
		title: 'Telekinesis',
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
					"<p>Make a <b>Spellcast Roll</b> against a target within Far range. On a success, you can use your mind to move them anywhere within Far range of their original position. You can throw the lifted target as an attack by making an additional Spellcast Roll against the second target you're trying to attack. On a success, deal <b>d12+4</b> physical damage to the second target using your Proficiency. This spell then ends.</p>",
				character_modifiers: []
			}
		]
	},
	arcana_touched: {
		id: 'arcana_touched',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Cybercatbug',
		image_url: '/images/card/art/domains/arcana/arcana-touched.webp',
		category: 'ability',
		title: 'Arcana-Touched',
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
				description_html: `<p>When 4 or more of the domain cards in your loadout are from the Arcana domain, gain the following benefits:</p>
                                    <ul class="list-disc list-inside ml-2">
                                        <li>+1 bonus to your Spellcast Rolls</li>
                                        <li>Once per rest, you can switch the results of your Hope and Fear Dice</li>
                                    </ul>`,
				character_modifiers: [
					{
						behaviour: 'bonus',
						target: 'spellcast_roll_bonus',
						type: 'flat',
						value: 1,
						character_conditions: [
							{
								type: 'min_loadout_cards_from_domain',
								domain_id: 'arcana',
								min_cards: 4
							}
						]
					}
				]
			}
		]
	},
	cloaking_blast: {
		id: 'cloaking_blast',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Henry Peters',
		image_url: '/images/card/art/domains/arcana/cloaking-blast.webp',
		category: 'spell',
		title: 'Cloaking Blast',
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
				description_html:
					"<p>When you make a successful <b>Spellcast Roll</b> to cast a different spell, you can <b>spend a Hope</b> to become <em>Cloaked</em>. While <em>Cloaked</em>, you remain unseen if you are stationary when an adversary moves to where they would normally see you. When you move into or within an adversary's line of sight or make an attack, you are no longer <em>Cloaked</em>.</p>",
				character_modifiers: []
			}
		]
	},
	arcane_reflection: {
		id: 'arcane_reflection',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Carlos Cardona',
		image_url: '/images/card/art/domains/arcana/arcane-reflection.webp',
		category: 'spell',
		title: 'Arcane Reflection',
		level_requirement: 8,
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
					'<p>When you would take magic damage, you can <b>spend any number of Hope</b> to roll that many <b>d6s</b>. If any roll a 6, the attack is reflected back to the caster, dealing the damage to them instead.</p>',
				character_modifiers: []
			}
		]
	},
	confusing_aura: {
		id: 'confusing_aura',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Simon Pape',
		image_url: '/images/card/art/domains/arcana/confusing-aura.webp',
		category: 'spell',
		title: 'Confusing Aura',
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
					'<p>Make a <b>Spellcast Roll (14)</b>. Once per long rest on a success, you create a layer of illusion over your body that makes it hard to tell exactly where you are. <b>Mark any number of Stress</b> to make that many additional layers.</p><p>When an adversary makes an attack against you, roll a number of <b>d6s</b> equal to the number of layers currently active. If any roll a 5 or higher, one layer of the aura is destroyed and the attack fails. If all the results are 4 or lower, you take the damage and this spell ends.</p>',
				character_modifiers: []
			}
		]
	},
	earthquake: {
		id: 'earthquake',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Eliot Baum',
		image_url: '/images/card/art/domains/arcana/earthquake.webp',
		category: 'spell',
		title: 'Earthquake',
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
					"<p>Make a <b>Spellcast Roll (16)</b>. Once per rest on a success, all targets within Very Far range who aren't flying must make a Reaction Roll (18). Targets who fail take <b>3d10+8</b> physical damage and are temporarily <em>Vulnerable</em>. Targets who succeed take half damage.</p><p>Additionally, when you succeed on the Spellcast Roll, all terrain within Very Far range becomes difficult to move through and structures within this range might sustain damage or crumble.</p>",
				character_modifiers: []
			}
		]
	},
	sensory_projection: {
		id: 'sensory_projection',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Anthony Jones',
		image_url: '/images/card/art/domains/arcana/sensory-projection.webp',
		category: 'spell',
		title: 'Sensory Projection',
		level_requirement: 9,
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
					'<p>Once per rest, make a <b>Spellcast Roll (15)</b>. On a success, drop into a vision that lets you clearly see and hear any place you have been before as though you are standing there in this moment. You can move freely in this vision and are not constrained by the physics or impediments of a physical body.</p><p>This spell cannot be detected by mundane or magical means. You drop out of this vision upon taking damage or casting another spell.</p>',
				character_modifiers: []
			}
		]
	},
	adjust_reality: {
		id: 'adjust_reality',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Geoffrey Ernault',
		image_url: '/images/card/art/domains/arcana/adjust-reality.webp',
		category: 'spell',
		title: 'Adjust Reality',
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
					'<p>After you or a willing ally make any roll, you can <b>spend 5 Hope</b> to change the numerical result of that roll to a result of your choice instead. The result must be plausible within the range of the dice.</p>',
				character_modifiers: []
			}
		]
	},
	falling_sky: {
		id: 'falling_sky',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'arcana',
		artist_name: 'Katya Cyan',
		image_url: '/images/card/art/domains/arcana/falling-sky.webp',
		category: 'spell',
		title: 'Falling Sky',
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
					'<p>Make a <b>Spellcast Roll</b> against all adversaries within Far range. <b>Mark any number of Stress</b> to make shards of arcana rain down from above. Targets you succeed against take <b>1d20+2</b> magic damage for each Stress marked.</p>',
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, DomainCard>;
