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
		subclass_ids: ['executioners_guild'],
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
			]
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
		subclass_ids: ['juggernaut'],
		suggested_primary_weapon_id: null,
		suggested_secondary_weapon_id: null,
		suggested_armor_id: null,
		starting_inventory: {
			gold_coins: 0,
			free_gear: [],
			loot_or_consumable_options: [],
			class_gear_options: []
		},
		background_questions: [],
		connections: []
	}
} as const satisfies Record<string, Class>;
