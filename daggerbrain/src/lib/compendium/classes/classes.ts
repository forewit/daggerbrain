import type { Class } from '$lib/types/compendium-types';

export const CLASSES = {
	assassin: {
		id: 'assassin',
		source_id: 'Void 1.5',
		starting_evasion: 12,
		starting_max_hp: 5,
		suggested_traits: {
			agility: 2,
			strength: -1,
			finesse: 1,
			instinct: 0,
			presence: 0,
			knowledge: 1
		},
		name: 'Assassin',
		image_url: '/images/wip.avif',
		description_html:
			'<p>As an assassin, you utilize unmatched stealth and precision to ambush the unwary.</p>',
		hope_feature: {
			title: 'Grim Resolve',
			description_html: '<p><b>Spend 3 Hope</b> to clear 2 Stress.</p>',
			character_modifiers: [],
			weapon_modifiers: []
		},
		primary_domain_id: 'blade',
		secondary_domain_id: 'midnight',
		class_features: [
			{
				title: 'Marked for Death',
				description_html: `<p>On a successful weapon attack, you can <b>mark a Stress</b> to make the target 
              <i>Marked for Death</i>. Attacks you make against a target that's <i>Marked for 
              Death</i> gain a bonus to damage equal to <b>+1d4</b> per tier.</p>
          
              <p>You can only have one adversary <i>Marked for Death</i> at a time, and can't transfer or 
              remove the condition except by defeating the target. The GM can spend a number of Fear equal 
              to your Proficiency to remove the <i>Marked for Death</i> condition. Otherwise, it ends
              automatically when you take a rest.</p>`,
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Get In & Get Out',
				description_html: `<p><b>Spend a Hope</b> to ask the GM for either a quick or inconspicuous way 
              into or out of a building or structure you can see. The next roll you make that capitalizes 
              on this information has advantage.</p>`,
				character_modifiers: [],
				weapon_modifiers: []
			}
		],
		subclass_ids: ['assassin_executioners_guild'],
		// suggestions
		suggested_primary_weapon_id: 'broadsword',
		suggested_secondary_weapon_id: 'shortsword',
		suggested_armor_id: 'leather_armor',
		starting_inventory: {
			gold_coins: 10,
			free_gear: [{ title: 'Torch' }, { title: '50 feet of rope' }, { title: 'Basic Supplies' }],
			loot_or_consumable_options: ['minor_health_potion', 'minor_stamina_potion'],
			class_gear_options: [
				{ title: 'List of names with several marked off' },
				{ title: 'Mortar and pestle inscribed with a mysterious insignia' }
			],
			spellbook_prompt: null
		},
		background_questions: [
			'What organization trained you in the art of killing, and how did you gain membership into it?',
			'Throughout your entire career, one target has eluded you. Who are they, and how have they managed to slip through your fingers?',
			"You always do what you must to take down your target, but there's one line that you will never cross. What is it?"
		],
		connections: [
			'What about me frightens you?',
			'You once asked me to do something that keeps you up at night. What was it?',
			'What secret about myself did I tell you, and how did it change your view of me?'
		]
	},

	brawler: {
		id: 'brawler',
		source_id: 'Void 1.5',
		starting_evasion: 10,
		starting_max_hp: 6,
		suggested_traits: {
			agility: 1,
			strength: 1,
			finesse: 0,
			instinct: 2,
			presence: 0,
			knowledge: -1
		},
		name: 'Brawler',
		image_url: '/images/wip.avif',
		description_html:
			'<p>As a brawler, you can use your fists just as well as any weapon to fight off the threats that get in your way.</p>',
		hope_feature: {
			title: 'Staggering Strike',
			description_html:
				'<p><b>Spend 3 Hope</b> when you succeed on an attack to temporarily Stagger your target and force them to mark a Stress. While Staggered, they have disadvantage on attack rolls.</p>',
			character_modifiers: [],
			weapon_modifiers: []
		},
		primary_domain_id: 'blade',
		secondary_domain_id: 'grace',
		class_features: [
			{
				title: 'I am the Weapon',
				description_html: `<p>While you don't have any equipped weapons</p>
                    <ul class="list-disc list-inside ml-2">
                        <li>You gain a +1 bonus to Evasion</li>
                        <li>Your unarmed strikes are considered a Melee weapon, use the trait of your choice, and deal <b>d8+d6</b> phy damage using your Proficiency.</li>
                     </ul>`,
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [
							{
								type: 'primary_weapon_equipped',
								weapon_id: null
							},
							{
								type: 'secondary_weapon_equipped',
								weapon_id: null
							}
						],
						type: 'flat',
						value: 1,
						target: 'evasion'
					}
				],
				weapon_modifiers: [
					{
						behaviour: 'base',
						character_conditions: [
							{
								type: 'primary_weapon_equipped',
								weapon_id: null
							},
							{
								type: 'secondary_weapon_equipped',
								weapon_id: null
							}
						],
						target_weapon: 'unarmed',
						target_stat: 'range',
						range: 'Melee'
					},
					{
						behaviour: 'base',
						character_conditions: [
							{
								type: 'primary_weapon_equipped',
								weapon_id: null
							},
							{
								type: 'secondary_weapon_equipped',
								weapon_id: null
							}
						],
						target_weapon: 'unarmed',
						target_stat: 'damage_dice',
						dice: '1d8+1d6'
					},
					{
						behaviour: 'base',
						character_conditions: [
							{
								type: 'primary_weapon_equipped',
								weapon_id: null
							},
							{
								type: 'secondary_weapon_equipped',
								weapon_id: null
							}
						],
						target_weapon: 'unarmed',
						target_stat: 'damage_type',
						damage_type: 'phy'
					}
				]
			},
			{
				title: 'Combo Strikes',
				description_html: `<p>After making a damage roll with a Melee weapon but before dealing
                    that damage to the target, <b>mark a Stress</b> to start a combo strike.
                    When you do, roll your Combo Die and note its value. Then, roll your
                    Combo Die again. If the value of the second roll is equal to or greater
                    than your fi rst roll, continue rolling until the latest Combo Die's roll is
                    less than the roll that preceeded it. Total all rolled values and add that
                    amount to your weapon's damage. These values cannot be adjusted
                    by features that aff ect damage dice.</p>

                    <p>Your Combo Die starts as a <b>d4</b>. When you level up, once per tier you
                    may use one of your advancement options to increase your Combo
                    Die instead.</p>`,
				// todo: find a way to update dice on changing tier
				// todo: add a "change weapon type" modifier type
				character_modifiers: [],
				weapon_modifiers: []
			}
		],
		subclass_ids: ['brawler_juggernaut'],
		suggested_primary_weapon_id: null,
		suggested_secondary_weapon_id: null,
		suggested_armor_id: null,
		starting_inventory: {
			gold_coins: 0,
			free_gear: [],
			loot_or_consumable_options: [],
			class_gear_options: [],
			spellbook_prompt: null
		},
		background_questions: [],
		connections: []
	},

	bard: {
		id: 'bard',
		source_id: 'SRD',
		starting_evasion: 10,
		starting_max_hp: 5,
		suggested_traits: {
			agility: 0,
			strength: -1,
			finesse: 1,
			instinct: 0,
			presence: 2,
			knowledge: 1
		},
		name: 'Bard',
		image_url: '/images/wip.avif',
		description_html:
			'<p>As a bard, you know how to get people to talk, bring attention to yourself, and use words or music to influence the world around you.</p>',
		hope_feature: {
			title: 'Make a Scene',
			description_html:
				'<p><b>Spend 3 Hope</b> to temporarily <i>Distract</i> a target within Close range, giving them a -2 penalty to their Difficulty.</p>',
			character_modifiers: [],
			weapon_modifiers: []
		},
		primary_domain_id: 'grace',
		secondary_domain_id: 'codex',
		class_features: [
			{
				title: 'Rally',
				description_html: `<p>Once per session, describe how you rally the party and give yourself and each of your allies a Rally Die. At level 1, your Rally Die is a <b>d6</b>. A PC can spend their Rally Die to roll it, adding the result to their action roll, reaction roll, damage roll, or to clear a number of Stress equal to the result. At the end of each session, clear all unspent Rally Dice. At level 5, your Rally Die increases to a <b>d8</b>.</p>`,
				character_modifiers: [],
				weapon_modifiers: []
			}
		],
		subclass_ids: ['bard_troubadour', 'bard_wordsmith'],
		suggested_primary_weapon_id: 'rapier',
		suggested_secondary_weapon_id: 'small_dagger',
		suggested_armor_id: 'gambeson_armor',
		starting_inventory: {
			gold_coins: 10,
			free_gear: [{ title: 'Torch' }, { title: '50 feet of rope' }, { title: 'Basic Supplies' }],
			loot_or_consumable_options: ['minor_health_potion', 'minor_stamina_potion'],
			class_gear_options: [{ title: 'A romance novel' }, { title: 'A letter never opened' }],
			spellbook_prompt: 'Songbook, journal, etc.'
		},
		background_questions: [
			'Who from your community taught you to have such confidence in yourself?',
			'You were in love once. Who did you adore, and how did they hurt you?',
			"You've always looked up to another bard. Who are they, and why do you idolize them?"
		],
		connections: [
			'What made you realize we were going to be such good friends?',
			'What do I do that annoys you?',
			'Why do you grab my hand at night?'
		]
	},

	druid: {
		id: 'druid',
		source_id: 'SRD',
		starting_evasion: 10,
		starting_max_hp: 6,
		suggested_traits: {
			agility: 1,
			strength: 0,
			finesse: 1,
			instinct: 2,
			presence: -1,
			knowledge: 0
		},
		name: 'Druid',
		image_url: '/images/wip.avif',
		description_html:
			'<p>As a druid, you are a force of nature, preserving the balance of life and death by channeling the wilds themselves through you.</p>',
		hope_feature: {
			title: 'Evolution',
			description_html:
				'<p><b>Spend 3 Hope</b> to transform into a Beastform without marking a Stress. When you do, choose one trait to raise by +1 until you drop out of that Beastform.</p>',
			character_modifiers: [],
			weapon_modifiers: []
		},
		primary_domain_id: 'sage',
		secondary_domain_id: 'arcana',
		class_features: [
			{
				title: 'Beastform',
				description_html: `<p><b>Mark a Stress</b> to magically transform into a creature of your tier or lower from the Beastform list. You can drop out of this form at any time. While transformed, you can't use weapons or cast spells from domain cards, but you can still use other features or abilities you have access to. Spells you cast before you transform stay active and last for their normal duration, and you can talk and communicate as normal. Additionally, you gain the Beastform's features, add their Evasion bonus to your Evasion, and use the trait specified in their statistics for your attack. While you're in a Beastform, your armor becomes part of your body and you mark Armor Slots as usual; when you drop out of a Beastform, those marked Armor Slots remain marked. If you mark your last Hit Point, you automatically drop out of this form.</p>`,
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Wildtouch',
				description_html:
					'<p>You can perform harmless, subtle effects that involve nature—such as causing a flower to rapidly grow, summoning a slight gust of wind, or starting a campfire—at will.</p>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		],
		subclass_ids: ['druid_warden_of_renewal', 'druid_warden_of_the_elements'],
		suggested_primary_weapon_id: 'shortstaff',
		suggested_secondary_weapon_id: 'round_shield',
		suggested_armor_id: 'leather_armor',
		starting_inventory: {
			gold_coins: 10,
			free_gear: [{ title: 'Torch' }, { title: '50 feet of rope' }, { title: 'Basic Supplies' }],
			loot_or_consumable_options: ['minor_health_potion', 'minor_stamina_potion'],
			class_gear_options: [
				{ title: 'A small bag of rocks and bones' },
				{ title: 'A strange pendant found in the dirt' }
			],
			spellbook_prompt: null
		},
		background_questions: [
			'Why was the community you grew up in so reliant on nature and its creatures?',
			'Who was the first wild animal you bonded with? Why did your bond end?',
			'Who has been trying to hunt you down? What do they want from you?'
		],
		connections: [
			'What did you confide in me that makes me leap into danger for you every time?',
			'What animal do I say you remind me of?',
			'What affectionate nickname have you given me?'
		]
	},

	guardian: {
		id: 'guardian',
		source_id: 'SRD',
		starting_evasion: 9,
		starting_max_hp: 7,
		suggested_traits: {
			agility: 1,
			strength: 2,
			finesse: -1,
			instinct: 0,
			presence: 1,
			knowledge: 0
		},
		name: 'Guardian',
		image_url: '/images/wip.avif',
		description_html:
			'<p>As a guardian, you run into danger to protect your party, keeping watch over those who might not survive without you there.</p>',
		hope_feature: {
			title: 'Frontline Tank',
			description_html: '<p><b>Spend 3 Hope</b> to clear 2 Armor Slots.</p>',
			character_modifiers: [],
			weapon_modifiers: []
		},
		primary_domain_id: 'valor',
		secondary_domain_id: 'blade',
		class_features: [
			{
				title: 'Unstoppable',
				description_html: `<p>Once per long rest, you can become <i>Unstoppable</i>. You gain an Unstoppable Die. At level 1, your Unstoppable Die is a <b>d4</b>. Place it on your character sheet in the space provided, starting with the 1 value facing up. After you make a damage roll that deals 1 or more Hit Points to a target, increase the Unstoppable Die value by one. When the die's value would exceed its maximum value or when the scene ends, remove the die and drop out of <i>Unstoppable</i>. At level 5, your Unstoppable Die increases to a <b>d6</b>.</p>
				<p>While <i>Unstoppable</i>, you gain the following benefits:</p>
				<ul class="list-disc list-inside ml-2">
					<li>You reduce the severity of physical damage by one threshold (Severe to Major, Major to Minor, Minor to None).</li>
					<li>You add the current value of the Unstoppable Die to your damage roll.</li>
					<li>You can't be Restrained or Vulnerable.</li>
				</ul>`,
				character_modifiers: [],
				weapon_modifiers: []
			}
		],
		subclass_ids: ['guardian_stalwart', 'guardian_vengeance'],
		suggested_primary_weapon_id: 'battleaxe',
		suggested_secondary_weapon_id: null,
		suggested_armor_id: 'chainmail_armor',
		starting_inventory: {
			gold_coins: 10,
			free_gear: [{ title: 'Torch' }, { title: '50 feet of rope' }, { title: 'Basic Supplies' }],
			loot_or_consumable_options: ['minor_health_potion', 'minor_stamina_potion'],
			class_gear_options: [
				{ title: 'A totem from your mentor' },
				{ title: 'A secret key' }
			],
			spellbook_prompt: null
		},
		background_questions: [
			'Who from your community did you fail to protect, and why do you still think of them?',
			"You've been tasked with protecting something important and delivering it somewhere dangerous. What is it, and where does it need to go?",
			'You consider an aspect of yourself to be a weakness. What is it, and how has it affected you?'
		],
		connections: [
			'How did I save your life the first time we met?',
			'What small gift did you give me that you notice I always carry with me?',
			'What lie have you told me about yourself that I absolutely believe?'
		]
	},

	ranger: {
		id: 'ranger',
		source_id: 'SRD',
		starting_evasion: 12,
		starting_max_hp: 6,
		suggested_traits: {
			agility: 2,
			strength: 0,
			finesse: 1,
			instinct: 1,
			presence: -1,
			knowledge: 0
		},
		name: 'Ranger',
		image_url: '/images/wip.avif',
		description_html:
			'<p>As a ranger, your keen eyes and graceful haste make you indispensable when tracking down enemies and navigating the wilds.</p>',
		hope_feature: {
			title: 'Hold Them Off',
			description_html:
				'<p><b>Spend 3 Hope</b> when you succeed on an attack with a weapon to use that same roll against two additional adversaries within range of the attack.</p>',
			character_modifiers: [],
			weapon_modifiers: []
		},
		primary_domain_id: 'bone',
		secondary_domain_id: 'sage',
		class_features: [
			{
				title: "Ranger's Focus",
				description_html: `<p><b>Spend a Hope</b> and make an attack against a target. On a success, deal your attack's normal damage and temporarily make the attack's target your <i>Focus</i>. Until this feature ends or you make a different creature your <i>Focus</i>, you gain the following benefits against your <i>Focus</i>:</p>
				<ul class="list-disc list-inside ml-2">
					<li>You know precisely what direction they are in.</li>
					<li>When you deal damage to them, they must mark a Stress.</li>
					<li>When you fail an attack against them, you can end your Ranger's Focus feature to reroll your Duality Dice.</li>
				</ul>`,
				character_modifiers: [],
				weapon_modifiers: []
			}
		],
		subclass_ids: ['ranger_wayfinder', 'ranger_beastbound'],
		suggested_primary_weapon_id: 'shortbow',
		suggested_secondary_weapon_id: null,
		suggested_armor_id: 'leather_armor',
		starting_inventory: {
			gold_coins: 10,
			free_gear: [{ title: 'Torch' }, { title: '50 feet of rope' }, { title: 'Basic Supplies' }],
			loot_or_consumable_options: ['minor_health_potion', 'minor_stamina_potion'],
			class_gear_options: [
				{ title: 'A trophy from your first kill' },
				{ title: 'A seemingly broken compass' }
			],
			spellbook_prompt: null
		},
		background_questions: [
			"A terrible creature hurt your community, and you've vowed to hunt them down. What are they, and what unique trail or sign do they leave behind?",
			'Your first kill almost killed you, too. What was it, and what part of you was never the same after that event?',
			"You've traveled many dangerous lands, but what is the one place you refuse to go?"
		],
		connections: [
			'What friendly competition do we have?',
			"Why do you act differently when we're alone than when others are around?",
			'What threat have you asked me to watch for, and why are you worried about it?'
		]
	},

	rogue: {
		id: 'rogue',
		source_id: 'SRD',
		starting_evasion: 12,
		starting_max_hp: 6,
		suggested_traits: {
			agility: 1,
			strength: -1,
			finesse: 2,
			instinct: 0,
			presence: 1,
			knowledge: 0
		},
		name: 'Rogue',
		image_url: '/images/wip.avif',
		description_html:
			'<p>As a rogue, you have experience fighting with your blade as well as your wit, preferring to move quickly and fight quietly.</p>',
		hope_feature: {
			title: "Rogue's Dodge",
			description_html:
				'<p><b>Spend 3 Hope</b> to gain a <b>+2</b> bonus to your Evasion until the next time an attack succeeds against you. Otherwise, this bonus lasts until your next rest.</p>',
			character_modifiers: [],
			weapon_modifiers: []
		},
		primary_domain_id: 'midnight',
		secondary_domain_id: 'grace',
		class_features: [
			{
				title: 'Cloaked',
				description_html: `<p>Any time you would be <i>Hidden</i>, you are instead <i>Cloaked</i>. In addition to the benefits of the <i>Hidden</i> condition, while <i>Cloaked</i> you remain unseen if you are stationary when an adversary moves to where they would normally see you. After you make an attack or end a move within line of sight of an adversary, you are no longer <i>Cloaked</i>.</p>`,
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Sneak Attack',
				description_html: `<p>When you succeed on an attack while <i>Cloaked</i> or while an ally is within Melee range of your target, add a number of <b>d6s</b> equal to your tier to your damage roll.</p>
				<ul class="list-disc list-inside ml-2">
					<li>Level 1 → Tier 1</li>
					<li>Levels 2–4 → Tier 2</li>
					<li>Levels 5–7 → Tier 3</li>
					<li>Levels 8–10 → Tier 4</li>
				</ul>`,
				character_modifiers: [],
				weapon_modifiers: []
			}
		],
		subclass_ids: ['rogue_syndicate', 'rogue_nightwalker'],
		suggested_primary_weapon_id: 'dagger',
		suggested_secondary_weapon_id: 'small_dagger',
		suggested_armor_id: 'gambeson_armor',
		starting_inventory: {
			gold_coins: 10,
			free_gear: [{ title: 'Torch' }, { title: '50 feet of rope' }, { title: 'Basic Supplies' }],
			loot_or_consumable_options: ['minor_health_potion', 'minor_stamina_potion'],
			class_gear_options: [
				{ title: 'A set of forgery tools' },
				{ title: 'A grappling hook' }
			],
			spellbook_prompt: null
		},
		background_questions: [
			'What did you get caught doing that got you exiled from your home community?',
			"You used to have a different life, but you've tried to leave it behind. Who from your past is still chasing you?",
			'Who from your past were you most sad to say goodbye to?'
		],
		connections: [
			'What did I recently convince you to do that got us both in trouble?',
			'What have I discovered about your past that I hold secret from the others?',
			'Who do you know from my past, and how have they influenced your feelings about me?'
		]
	}
} as const satisfies Record<string, Class>;
