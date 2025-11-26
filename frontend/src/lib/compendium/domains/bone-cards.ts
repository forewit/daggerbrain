import type { DomainCard } from '$lib/types/compendium-types';

export const BONE_DOMAIN_CARDS = {
	untouchable: {
		id: 'untouchable',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Henry Peters',
		image_url: '/images/card/art/domains/bone/untouchable.webp',
		category: 'ability',
		title: 'Untouchable',
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
				description_html: 'Gain a bonus to your Evasion equal to half your Agility.',
				character_modifiers: [
					{
						behaviour: 'bonus',
						target: 'evasion',
						type: 'derived_from_trait',
						trait: 'agility',
						multiplier: 0.5,
						character_conditions: [
							{
								type: 'level',
								min_level: 1,
								max_level: 10
							}
						]
					}
				]
			}
		]
	},
	deft_maneuvers: {
		id: 'deft_maneuvers',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Tamara Osborn',
		image_url: '/images/card/art/domains/bone/deft-maneuvers.webp',
		category: 'ability',
		title: 'Deft Maneuvers',
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
					'<p>Once per rest, <b>mark a Stress</b> to sprint anywhere within Far range without making an Agility Roll to get there. If you end this movement within Melee range of an adversary and immediately make an attack against them, gain a +1 bonus to the attack roll.</p>',
				character_modifiers: []
			}
		]
	},
	i_see_it_coming: {
		id: 'i_see_it_coming',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Mat Wilma',
		image_url: '/images/card/art/domains/bone/i-see-it-coming.webp',
		category: 'ability',
		title: 'I See It Coming',
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
					"<p>When you're targeted by an attack made from beyond Melee range, you can <b>mark a Stress</b> to roll a <b>d4</b> and gain a bonus to your Evasion equal to the result against the attack.</p>",
				character_modifiers: []
			}
		]
	},
	ferocity: {
		id: 'ferocity',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Mat Wilma',
		image_url: '/images/card/art/domains/bone/ferocity.webp',
		category: 'ability',
		title: 'Ferocity',
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
				description_html:
					'<p>When you cause an adversary to mark 1 or more Hit Points, you can <b>spend 2 Hope</b> to increase your Evasion by the number of Hit Points they marked. This bonus lasts until after the next attack made against you.</p>',
				character_modifiers: []
			}
		]
	},
	strategic_approach: {
		id: 'strategic_approach',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Julia Metzger',
		image_url: '/images/card/art/domains/bone/strategic-approach.webp',
		category: 'ability',
		title: 'Strategic Approach',
		level_requirement: 2,
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
				description_html: `<p>After a long rest, place a number of tokens equal to your Knowledge on this card (minimum 1). The first time you move within Close range of an adversary and make an attack against them, you can spend one token to choose one of the following options:</p>
                                    <ul class="list-disc list-inside ml-2">
                                        <li>You make the attack with advantage.</li>
                                        <li>You clear a Stress on an ally within Melee range of the adversary.</li>
                                        <li>You add a <b>d8</b> to your damage roll.</li>
                                    </ul>
                                    <p>When you take a long rest, clear all unspent tokens.</p>`,
				character_modifiers: []
			}
		]
	},
	brace: {
		id: 'brace',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Rick Hefner',
		image_url: '/images/card/art/domains/bone/brace.webp',
		category: 'ability',
		title: 'Brace',
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
					'<p>When you mark an Armor Slot to reduce incoming damage, you can <b>mark a Stress</b> to mark an additional Armor Slot.</p>',
				character_modifiers: []
			}
		]
	},
	tactician: {
		id: 'tactician',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Kristina Gehrmann',
		image_url: '/images/card/art/domains/bone/tactician.webp',
		category: 'ability',
		title: 'Tactician',
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
					'<p>When you Help an Ally, they can spend a Hope to add one of your Experiences to their roll alongside your advantage die.</p><p>When making a Tag Team Roll, you can roll a <b>d20</b> as your Hope Die.</p>',
				character_modifiers: []
			}
		]
	},
	boost: {
		id: 'boost',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Bear Frymire',
		image_url: '/images/card/art/domains/bone/boost.webp',
		category: 'ability',
		title: 'Boost',
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
					'<p><b>Mark a Stress</b> to boost off a willing ally within Close range, fling yourself into the air, and perform an aerial attack against a target within Far range. You have advantage on the attack, add a <b>d10</b> to the damage roll, and end your move within Melee range of the target.</p>',
				character_modifiers: []
			}
		]
	},
	redirect: {
		id: 'redirect',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Jenny Tan',
		image_url: '/images/card/art/domains/bone/redirect.webp',
		category: 'ability',
		title: 'Redirect',
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
					'<p>When an attack made against you from beyond Melee range fails, roll a number of <b>d6s</b> equal to your Proficiency. If any roll a 6, you can <b>mark a Stress</b> to redirect the attack to damage an adversary within Very Close range instead.</p>',
				character_modifiers: []
			}
		]
	},
	know_thy_enemy: {
		id: 'know_thy_enemy',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Grant Griffin',
		image_url: '/images/card/art/domains/bone/know-thy-enemy.webp',
		category: 'ability',
		title: 'Know Thy Enemy',
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
				description_html: `<p>When observing a creature, you can make an <b>Instinct Roll</b> against them. On a success, <b>spend a Hope</b> and ask the GM for one set of information about the target from the following options:</p>
                                    <ul class="list-disc list-inside ml-2">
                                        <li>Their unmarked Hit Points and Stress.</li>
                                        <li>Their Difficulty and damage thresholds.</li>
                                        <li>Their tactics and standard attack damage dice.</li>
                                        <li>Their features and Experiences.</li>
                                    </ul>
                                    <p>Additionally on a success, you can <b>mark a Stress</b> to remove a Fear from the GM's Fear Pool.</p>`,
				character_modifiers: []
			}
		]
	},
	signature_move: {
		id: 'signature_move',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Bear Frymire',
		image_url: '/images/card/art/domains/bone/signature-move.webp',
		category: 'ability',
		title: 'Signature Move',
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
					"<p>Name and describe your signature combat move. Once per rest, when you perform this signature move as part of an action you're taking, you can roll a <b>d20</b> as your Hope Die. On a success, clear a Stress.</p>",
				character_modifiers: []
			}
		]
	},
	rapid_riposte: {
		id: 'rapid_riposte',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Rafater',
		image_url: '/images/card/art/domains/bone/rapid-riposte.webp',
		category: 'ability',
		title: 'Rapid Riposte',
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
					'<p>When an attack made against you from within Melee range fails, you can <b>mark a Stress</b> and seize the opportunity to deal the weapon damage of one of your active weapons to the attacker.</p>',
				character_modifiers: []
			}
		]
	},
	recovery: {
		id: 'recovery',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Juan S. Almencion',
		image_url: '/images/card/art/domains/bone/recovery.webp',
		category: 'ability',
		title: 'Recovery',
		level_requirement: 6,
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
					'<p>During a short rest, you can choose a long rest downtime move instead. You can <b>spend a Hope</b> to let an ally do the same.</p>',
				character_modifiers: []
			}
		]
	},
	bone_touched: {
		id: 'bone_touched',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Samantha Kung',
		image_url: '/images/card/art/domains/bone/bone-touched.webp',
		category: 'ability',
		title: 'Bone-Touched',
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
				description_html: `<p>When 4 or more of the domain cards in your loadout are from the Bone domain, gain the following benefits:</p>
                                    <ul class="list-disc list-inside ml-2">
                                        <li>+1 bonus to Agility</li>
                                        <li>Once per rest, you can <b>spend 3 Hope</b> to cause an attack that succeeded against you to fail instead.</li>
                                    </ul>`,
				character_modifiers: [
					{
						behaviour: 'bonus',
						target: 'trait',
						trait: 'agility',
						type: 'flat',
						value: 1,
						character_conditions: [
							{
								type: 'min_loadout_cards_from_domain',
								domain_id: 'bone',
								min_cards: 4
							}
						]
					}
				]
			}
		]
	},
	cruel_precision: {
		id: 'cruel_precision',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Maxime Minard',
		image_url: '/images/card/art/domains/bone/cruel-precision.webp',
		category: 'ability',
		title: 'Cruel Precision',
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
					'<p>When you make a successful attack with a weapon, gain a bonus to your damage roll equal to either your Finesse or Agility.</p>',
				character_modifiers: []
			}
		]
	},
	breaking_blow: {
		id: 'breaking_blow',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Mat Wilma',
		image_url: '/images/card/art/domains/bone/breaking-blow.webp',
		category: 'ability',
		title: 'Breaking Blow',
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
				description_html:
					'<p>When you make a successful attack, you can <b>mark a Stress</b> to make the next successful attack against that same target deal an extra <b>2d12</b> damage.</p>',
				character_modifiers: []
			}
		]
	},
	wrangle: {
		id: 'wrangle',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Samantha Kung',
		image_url: '/images/card/art/domains/bone/wrangle.webp',
		category: 'ability',
		title: 'Wrangle',
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
					'<p>Make an Agility Roll against all targets within Close range. <b>Spend a Hope</b> to move targets you succeed against, and any willing allies within Close range, to another point within Close range.</p>',
				character_modifiers: []
			}
		]
	},
	on_the_brink: {
		id: 'on_the_brink',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Juan S. Almencion',
		image_url: '/images/card/art/domains/bone/on-the-brink.webp',
		category: 'ability',
		title: 'On The Brink',
		level_requirement: 9,
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
					"<p>When you have 2 or fewer Hit Points unmarked, you don't take Minor damage.</p>",
				character_modifiers: []
			}
		]
	},
	splintering_strike: {
		id: 'splintering_strike',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Gaboleps',
		image_url: '/images/card/art/domains/bone/splintering-strike.webp',
		category: 'ability',
		title: 'Splintering Strike',
		level_requirement: 9,
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
				description_html:
					"<p><b>Spend a Hope</b> and make an attack against all adversaries within your weapon's range. Once per long rest, on a success against any targets, roll your weapon's damage and distribute that damage however you wish between the targets you succeeded against. Before you deal damage to each target, roll an additional damage die and add its result to the damage you deal to them.</p>",
				character_modifiers: []
			}
		]
	},
	deathrun: {
		id: 'deathrun',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Letícia Freitas',
		image_url: '/images/card/art/domains/bone/deathrun.webp',
		category: 'ability',
		title: 'Deathrun',
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
					"<p>Spend <b>3 Hope</b> to run a straight path through the battlefield to a point within Far range, making an attack against all adversaries within your weapon's range along that path. Choose the order in which you deal damage to the targets you succeeded against.</p><p>For the first, roll your weapon damage with a <b>+1 bonus</b> to your Proficiency. Then remove a die from your damage roll and deal the remaining damage to the next target. Continue to remove a die for each subsequent target until you have no more damage dice or adversaries. You can't target the same adversary more than once per attack.</p>",
				character_modifiers: []
			}
		]
	},
	swift_step: {
		id: 'swift_step',
		source_id: 'Void 1.5',
card_type: 'domain',
		domain_id: 'bone',
		artist_name: 'Allan Santos',
		image_url: '/images/card/art/domains/bone/swift-step.webp',
		category: 'ability',
		title: 'Swift Step',
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
					"<p>When an attack made against you fails, clear a Stress. If you can't clear a Stress, gain a Hope.</p>",
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, DomainCard>;
