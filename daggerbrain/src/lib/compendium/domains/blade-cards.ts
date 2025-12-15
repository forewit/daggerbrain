import type { DomainCard } from '$lib/types/compendium-types';

export const BLADE_DOMAIN_CARDS = {
	get_back_up: {
		compendium_id: 'get_back_up',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Get Back Up',
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
					'<p>When you take Severe damage, you can <b>mark a Stress</b> to reduce the severity by one threshold.</p>',
				character_modifiers: []
			}
		]
	},
	whirlwind: {
		compendium_id: 'whirlwind',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Whrilwind',
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
					'<p>When you make a successful attack agains a target within Very Close range, you can <b>spend a Hope</b> to use the attack against all other targets within Very Close range.</p>',
				character_modifiers: []
			}
		]
	},
	not_good_enough: {
		compendium_id: 'not_good_enough',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Not Good Enough',
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
				description_html: '<p>When you roll your damage dice, you can reroll any 1s or 2s.</p>',
				character_modifiers: []
			}
		]
	},
	reckless: {
		compendium_id: 'reckless',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Reckless',
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
				description_html: '<p><b>Mark a Stress</b> to gain advantage on an attack.</p>',
				character_modifiers: []
			}
		]
	},
	a_soldiers_bond: {
		compendium_id: 'a_soldiers_bond',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: "A Soldier's Bond",
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
					"Once per long rest, when you compliment someone or ask them about something they're good at, you can both gain 3 Hope.",
				character_modifiers: []
			}
		]
	},
	scramble: {
		compendium_id: 'scramble',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Scramble',
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
					'<p>Once per rest, when a creature within Melee range would deal damage to you, you can avoid the attack and safely move out of Melee range of the enemy.</p>',
				character_modifiers: []
			}
		]
	},
	versatile_fighter: {
		compendium_id: 'versatile_fighter',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Versatile Fighter',
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
					'<p>You can use a different character trait for an equipped weapon, rather than the trait the weapon calls for. When you deal damage, you can <b>mark a Stress</b> to use the maximum result of one of your damage dice instead of rolling it.</p>',
				character_modifiers: []
			}
		]
	},
	deadly_focus: {
		compendium_id: 'deadly_focus',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Deadly Focus',
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
					'<p>Once per rest, you can apply all your focus toward a target of your choice. Until you attack another creature, you defeat the target, or the battle ends, gain a +1 bonus to your Proficiency.</p>',
				character_modifiers: []
			}
		]
	},
	fortified_armor: {
		compendium_id: 'fortified_armor',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Fortified Armor',
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
					'<p>While you are wearing armor, gain a +2 bonus to your damage thresholds.</p>',
				character_modifiers: [
					{
						behaviour: 'bonus',
						target: 'major_damage_threshold',
						type: 'flat',
						value: 2,
						character_conditions: [
							{
								type: 'armor_equipped',
								value: true
							},
							{
								type: 'level',
								min_level: 4,
								max_level: 10
							}
						]
					},
					{
						behaviour: 'bonus',
						target: 'severe_damage_threshold',
						type: 'flat',
						value: 2,
						character_conditions: [
							{
								type: 'armor_equipped',
								value: true
							},
							{
								type: 'level',
								min_level: 4,
								max_level: 10
							}
						]
					}
				]
			}
		]
	},
	champions_edge: {
		compendium_id: 'champions_edge',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: "Champion's Edge",
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
				description_html: `<p>When you critically succeed on an attack, you can <b>spend up to 3 Hope</b> and choose one of the following options for each Hope spent:</p>
                                    <ul class="list-disc list-inside ml-2">
                                        <li>You clear a Hit Point.</li>
                                        <li>You clear an Armor Slot.</li>
                                        <li>The target must mark an additional Hit Point.</li>
                                    </ul>
                                    <p>You can't choose the same option more than once.</p>`,
				character_modifiers: []
			}
		]
	},
	vitality: {
		compendium_id: 'vitality',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Vitality',
		level_requirement: 5,
		recall_cost: 0,
		applies_in_vault: true,
		forced_in_loadout: false,
		forced_in_vault: true,
		choices: [
			{
				choice_id: 'choose_two',
				type: 'arbitrary',
				max: 2,
				conditional_choice: null,
				options: [
					{
						selection_id: 'stress_slot',
						title: '+1 Stress slot',
						short_title: '+1 Stress'
					},
					{
						selection_id: 'hp_slot',
						title: '+1 Hit Point slot',
						short_title: '+1 HP'
					},
					{
						selection_id: 'damage_thresholds',
						title: '+2 bonus to your damage thresholds',
						short_title: '+2 to thresholds'
					}
				]
			}
		],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `<p>When you choose this card, permanently gain two of the following benefits:</p>
                                    <ul class="list-disc list-inside ml-2">
                                        <li>One Stress slot</li>
                                        <li>One Hit Point slot</li>
                                        <li>+2 bonus to your damage thresholds</li>
                                    </ul>
                                    <p>Then place this card in your vault permanently.</p>`,
				character_modifiers: [
					{
						behaviour: 'bonus',
						target: 'max_stress',
						type: 'flat',
						value: 1,
						character_conditions: [
							{
								type: 'domain_card_choice',
								domain_card_id: 'vitality',
								choice_id: 'choose_two',
								selection_id: 'stress_slot'
							}
						]
					},
					{
						behaviour: 'bonus',
						target: 'max_hp',
						type: 'flat',
						value: 1,
						character_conditions: [
							{
								type: 'domain_card_choice',
								domain_card_id: 'vitality',
								choice_id: 'choose_two',
								selection_id: 'hp_slot'
							}
						]
					},
					{
						behaviour: 'bonus',
						target: 'major_damage_threshold',
						type: 'flat',
						value: 2,
						character_conditions: [
							{
								type: 'domain_card_choice',
								domain_card_id: 'vitality',
								choice_id: 'choose_two',
								selection_id: 'damage_thresholds'
							}
						]
					},
					{
						behaviour: 'bonus',
						target: 'severe_damage_threshold',
						type: 'flat',
						value: 2,
						character_conditions: [
							{
								type: 'domain_card_choice',
								domain_card_id: 'vitality',
								choice_id: 'choose_two',
								selection_id: 'damage_thresholds'
							}
						]
					}
				]
			}
		]
	},
	battle_hardened: {
		compendium_id: 'battle_hardened',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Battle-Hardened',
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
					'<p>Once per long rest when you would make a Death Move, you can <b>spend a Hope</b> to clear a Hit Point instead.</p>',
				character_modifiers: []
			}
		]
	},
	rage_up: {
		compendium_id: 'rage_up',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Rage Up',
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
					'<p>Before you make an attack, you can <b>mark a Stress</b> to gain a bonus to your damage roll equal to twice your Strength.</p><p>You can Rage Up twice per attack.</p>',
				character_modifiers: []
			}
		]
	},
	blade_touched: {
		compendium_id: 'blade_touched',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Blade-Touched',
		level_requirement: 7,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,

		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [
					{
						behaviour: 'bonus',
						target_weapon: 'all',
						target_stat: 'attack_roll',
						value: 2,
						character_conditions: [
							{
								type: 'min_loadout_cards_from_domain',
								domain_id: 'blade',
								min_cards: 4
							}
						]
					}
				],
				title: '',
				description_html: `<p>When 4 or more of the domain cards in your loadout are from the Blade domain, gain the following benefits:</p>
                                    <ul class="list-disc list-inside ml-2">
                                        <li>+2 bonus to your attack rolls</li>
                                        <li>+4 bonus to your Severe damage threshold</li>
                                    </ul>`,
				character_modifiers: [
					{
						behaviour: 'bonus',
						target: 'severe_damage_threshold',
						type: 'flat',
						value: 4,
						character_conditions: [
							{
								type: 'min_loadout_cards_from_domain',
								domain_id: 'blade',
								min_cards: 4
							}
						]
					}
				]
			}
		]
	},
	glancing_blow: {
		compendium_id: 'glancing_blow',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Glancing Blow',
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
					'<p>When you fail an attack, you can <b>mark a Stress</b> to deal weapon damage using half your Proficiency.</p>',
				character_modifiers: []
			}
		]
	},
	battle_cry: {
		compendium_id: 'battle_cry',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Battle Cry',
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
					"<p>Once per long rest, while you're charging into danger, you can muster a rousing call that inspires your allies. All allies who can hear you each clear a Stress and gain a Hope. Additionally, your allies gain advantage on attack rolls until you or an ally rolls a failure with Fear.</p>",
				character_modifiers: []
			}
		]
	},
	frenzy: {
		compendium_id: 'frenzy',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Frenzy',
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
					"<p>Once per long rest, you can go into a <em>Frenzy</em> until there are no more adversaries within sight.</p><p>While <em>Frenzied</em>, you can't use Armor Slots, and you gain a +10 bonus to your damage rolls and a +8 bonus to your Severe damage threshold.</p>",
				character_modifiers: []
			}
		]
	},
	gore_and_glory: {
		compendium_id: 'gore_and_glory',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Gore and Glory',
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
					'<p>When you critically succeed on a weapon attack, gain an additional Hope or clear an additional Stress. Additionally, when you deal enough damage to defeat an enemy, gain a Hope or clear a Stress.</p>',
				character_modifiers: []
			}
		]
	},
	reapers_strike: {
		compendium_id: 'reapers_strike',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: "Reaper's Strike",
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
					'<p>Once per long rest, <b>spend a Hope</b> to make an attack roll. The GM tells you which targets within range it would succeed against. Choose one of these targets and force them to mark 5 Hit Points.</p>',
				character_modifiers: []
			}
		]
	},
	battle_monster: {
		compendium_id: 'battle_monster',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Battle Monster',
		level_requirement: 10,
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
					'<p>When you make a successful attack against an adversary, you can <b>mark 4 Stress</b> to force the target to mark a number of Hit Points equal to the number of Hit Points you currently have marked instead of rolling for damage.</p>',
				character_modifiers: []
			}
		]
	},
	onslaught: {
		compendium_id: 'onslaught',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'blade',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Onslaught',
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
				description_html:
					"<p>When you successfully make an attack with your weapon, you never deal damage beneath a target's Major damage threshold (the target always marks a minimum of 2 Hit Points).</p><p>Additionally, when a creature within your weapon's range deals damage to an ally with an attack that doesn't include you, you can <b>mark a Stress</b> to force them to make a Reaction Roll (15). On a failure, the target must mark a Hit Point.</p>",
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, DomainCard>;
