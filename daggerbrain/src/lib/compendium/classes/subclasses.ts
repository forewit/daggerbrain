import type { Subclass } from '$lib/types/compendium-types';

export const SUBCLASSES = {
	assassin_executioners_guild: {
		compendium_id: 'assassin_executioners_guild',
		source_id: 'Void 1.5',
		class_id: 'assassin',
		name: 'Executioners Guild',
		description_html:
			'<p>Skilled in the art of assassination, the Executioners Guild is known for their precision and efficiency.</p>',
		foundation_card: {
			compendium_id: 'executioners_guild_foundation',
			card_type: 'subclass_foundation',
			artist_name: '',
			image_url: '/images/wip.avif',
			title: 'Executioners Guild',
			description_html: 'Foundation',
			spellcast_trait: 'agility',
			class_id: 'assassin',
			features: [
				{
					title: 'First Strike',
					description_html:
						'<p>The first time in a scene you succeed on an attack roll, double the damage of the attack.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Ambush',
					description_html:
						'<p>Your "Marked for Death" feature uses <b>d6s</b> instead of <b>d4s</b>.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'executioners_guild_specialization',
			card_type: 'subclass_specialization',
			artist_name: '',
			image_url: '/images/wip.avif',
			title: 'Executioners Guild',
			description_html: 'Specialization',
			class_id: 'assassin',
			features: [
				{
					title: 'Death Strike',
					description_html:
						'<p>When you deal Severe damage to a creature, you can <b>mark a stress</b> to make them mark an additional Hit Point.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: "Scorpion's Poise",
					description_html:
						'<p>You gain a <b>+2</b> bonus to your Evasion against any attacks made by a creature <i>Marked for Death</i>.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'executioners_guild_mastery',
			card_type: 'subclass_mastery',
			artist_name: '',
			image_url: '/images/wip.avif',
			title: 'Executioners Guild',
			description_html: 'Mastery',
			class_id: 'assassin',
			features: [
				{
					title: 'True Strike',
					description_html:
						'<p>Once per long rest, when you fail an attack roll, you can <b>spend a hope</b> to make it a success instead.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Backstab',
					description_html:
						'<p>Your "Marked for Death" feature uses <b>d8s</b> instead of <b>d6s</b>.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},
	brawler_juggernaut: {
		compendium_id: 'brawler_juggernaut',
		source_id: 'Void 1.5',
		class_id: 'brawler',
		name: 'Juggernaut',
		description_html: '<p></p>',
		foundation_card: {
			compendium_id: 'juggernaut_foundation',
			card_type: 'subclass_foundation',
			artist_name: '',
			image_url: '/images/wip.avif',
			title: 'Juggernaut',
			description_html: 'Foundation',
			class_id: 'brawler',
			spellcast_trait: null,
			features: [
				{
					title: 'Powerhouse',
					description_html: `<p>Increase the <b>d8</b> damage dice for your unarmed attack to <b>d10s</b>. Additionally, you can mark a Stress to target two creatures within Melee range with a single attack roll.</p>`,
					character_modifiers: [],
					weapon_modifiers: [
						{
							behaviour: 'base',
							target_weapon: 'unarmed',
							character_conditions: [],
							target_stat: 'damage_dice',
							dice: '1d10'
						}
					]
				},
				{
					title: 'Overwhelm',
					description_html: `<p>On a successful attack, you can spend a Hope to force the target to mark a Stress or to throw them within Close range.</p>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'juggernaut_specialization',
			card_type: 'subclass_specialization',
			artist_name: '',
			image_url: '/images/wip.avif',
			title: 'Juggernaut',
			description_html: 'Specialization',
			class_id: 'brawler',
			features: [
				{
					title: 'Rugged',
					description_html: `<p>Gain a permanent +3 bonus to your Severe damage threshold. Additionally, your "Powerhouse" feature can target up to three creatures instead of two.</p>`,
					character_modifiers: [
						{
							behaviour: 'bonus',
							type: 'flat',
							value: 3,
							target: 'severe_damage_threshold',
							character_conditions: []
						}
					],
					weapon_modifiers: []
				},
				{
					title: 'Eye for an Eye',
					description_html: `<p>When you mark more than one Hit Point from an attack in Melee range, the attacker must make a Reaction Roll (13). On a failure, once per rest, they immediately mark the same number of Hit Points in return.</p>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'juggernaut_mastery',
			card_type: 'subclass_mastery',
			artist_name: '',
			image_url: '/images/wip.avif',
			title: 'Juggernaut',
			description_html: 'Mastery',
			class_id: 'brawler',
			features: [
				{
					title: 'Pummeljoy',
					description_html: `<p>When you critically succeed on a weapon attack in Melee range, you gain an additional Hope, clear an additional Stress, and gain a +1 bonus to your Proficiency for the attack.</p>`,
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Not Done Yet',
					description_html: `<p>When you mark more than one HP from an attack, you can gain a Hope or clear a Stress.</p>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	bard_troubadour: {
		compendium_id: 'bard_troubadour',
		source_id: 'SRD',
		class_id: 'bard',
		name: 'Troubadour',
		description_html:
			'<p>Play the Troubadour if you want to play music to bolster your allies.</p>',
		foundation_card: {
			compendium_id: 'troubadour_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Bear Frymire',
			image_url: '/api/images/card/art/subclasses/troubadour.webp',
			title: 'Troubadour',
			description_html: 'Foundation',
			spellcast_trait: 'presence',
			class_id: 'bard',
			features: [
				{
					title: 'Gifted Performer',
					description_html: `<p>Describe how you perform for others. You can play each song once per long rest:</p>
					<ul class="list-disc list-inside ml-2">
						<li><b>Relaxing Song:</b> You and all allies within Close range clear a Hit Point.</li>
						<li><b>Epic Song:</b> Make a target within Close range temporarily <i>Vulnerable</i>.</li>
						<li><b>Heartbreaking Song:</b> You and all allies within Close range gain a Hope.</li>
					</ul>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'troubadour_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Bear Frymire',
			image_url: '/api/images/card/art/subclasses/troubadour.webp',
			title: 'Troubadour',
			description_html: 'Specialization',
			class_id: 'bard',
			features: [
				{
					title: 'Maestro',
					description_html:
						'<p>Your rallying songs steel the courage of those who listen. When you give a Rally Die to an ally, they can immediately gain a Hope or clear a Stress.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'troubadour_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Bear Frymire',
			image_url: '/api/images/card/art/subclasses/troubadour.webp',
			title: 'Troubadour',
			description_html: 'Mastery',
			class_id: 'bard',
			features: [
				{
					title: 'Virtuoso',
					description_html:
						'<p>You are among the greatest of your craft and your skill is boundless. You can perform each of your "Gifted Performer" feature\'s songs twice instead of once per long rest.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	bard_wordsmith: {
		compendium_id: 'bard_wordsmith',
		source_id: 'SRD',
		class_id: 'bard',
		name: 'Wordsmith',
		description_html:
			'<p>Play the Wordsmith if you want to use clever wordplay and captivate crowds.</p>',
		foundation_card: {
			compendium_id: 'wordsmith_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Nikki Dawes',
			image_url: '/api/images/card/art/subclasses/wordsmith.webp',
			title: 'Wordsmith',
			description_html: 'Foundation',
			spellcast_trait: 'presence',
			class_id: 'bard',
			features: [
				{
					title: 'Rousing Speech',
					description_html:
						'<p>Once per long rest, you can give a heartfelt, inspiring speech. All allies within Far range clear 2 Stress.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Heart of a Poet',
					description_html:
						'<p>After you make an action roll to impress, persuade, or offend someone, you can <b>spend a Hope</b> to add a <b>d4</b> to the roll.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'wordsmith_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Nikki Dawes',
			image_url: '/api/images/card/art/subclasses/wordsmith.webp',
			title: 'Wordsmith',
			description_html: 'Specialization',
			class_id: 'bard',
			features: [
				{
					title: 'Eloquent',
					description_html: `<p>Your moving words can boost morale. Once per session, when you encourage an ally, you can do one of the following:</p>
					<ul class="list-disc list-inside ml-2">
						<li>Allow them to find a mundane object or tool they need.</li>
						<li>Help an Ally without spending Hope.</li>
						<li>Give them an additional downtime move during their next rest.</li>
					</ul>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'wordsmith_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Nikki Dawes',
			image_url: '/api/images/card/art/subclasses/wordsmith.webp',
			title: 'Wordsmith',
			description_html: 'Mastery',
			class_id: 'bard',
			features: [
				{
					title: 'Epic Poetry',
					description_html:
						'<p>Your Rally Die increases to a <b>d10</b>. Additionally, when you Help an Ally, you can narrate the moment as if you were writing the tale of their heroism in a memoir. When you do, roll a <b>d10</b> as your advantage die.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	druid_warden_of_renewal: {
		compendium_id: 'druid_warden_of_renewal',
		source_id: 'SRD',
		class_id: 'druid',
		name: 'Warden of Renewal',
		description_html:
			'<p>Play the Warden of Renewal if you want to focus on healing and protection.</p>',
		foundation_card: {
			compendium_id: 'warden_of_renewal_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Ilya Royz',
			image_url: '/api/images/card/art/subclasses/warden-of-renewal.webp',
			title: 'Warden of Renewal',
			description_html: 'Foundation',
			spellcast_trait: 'instinct',
			class_id: 'druid',
			features: [
				{
					title: 'Clarity of Nature',
					description_html:
						'<p>Once per long rest, you can create a space of natural serenity within Close range. When you spend a few minutes resting within the space, clear Stress equal to your Instinct, distributed as you choose between you and your allies.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Regeneration',
					description_html:
						'<p>Touch a creature and <b>spend 3 Hope</b>. That creature clears <b>1d4</b> Hit Points.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'warden_of_renewal_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Ilya Royz',
			image_url: '/api/images/card/art/subclasses/warden-of-renewal.webp',
			title: 'Warden of Renewal',
			description_html: 'Specialization',
			class_id: 'druid',
			features: [
				{
					title: 'Regenerative Reach',
					description_html:
						'<p>You can target creatures within Very Close range with your "Regeneration" feature.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: "Warden's Protection",
					description_html:
						'<p>Once per long rest, <b>spend 2 Hope</b> to clear 2 Hit Points on <b>1d4 allies</b> within Close range.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'warden_of_renewal_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Ilya Royz',
			image_url: '/api/images/card/art/subclasses/warden-of-renewal.webp',
			title: 'Warden of Renewal',
			description_html: 'Mastery',
			class_id: 'druid',
			features: [
				{
					title: 'Healing Guardian Spirit',
					description_html:
						"<p>When you're in Beastform and an ally within Close range marks 2 or more Hit Points, you can <b>mark a Stress</b> to reduce the number of Hit Points they mark by 1.</p>",
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	druid_warden_of_the_elements: {
		compendium_id: 'druid_warden_of_the_elements',
		source_id: 'SRD',
		class_id: 'druid',
		name: 'Warden of the Elements',
		description_html:
			'<p>Play the Warden of the Elements if you want to channel elemental power.</p>',
		foundation_card: {
			compendium_id: 'warden_of_the_elements_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Zoe Badini',
			image_url: '/api/images/card/art/subclasses/warden-of-the-elements.webp',
			title: 'Warden of the Elements',
			description_html: 'Foundation',
			spellcast_trait: 'instinct',
			class_id: 'druid',
			features: [
				{
					title: 'Elemental Incarnation',
					description_html: `<p><b>Mark a Stress</b> to <i>Channel</i> one of the following elements until you take Severe damage or until your next rest:</p>
					<ul class="list-disc list-inside ml-2">
						<li><b>Fire:</b> When an adversary within Melee range deals damage to you, they take <b>1d10</b> magic damage.</li>
						<li><b>Earth:</b> Gain a bonus to your damage thresholds equal to your Proficiency.</li>
						<li><b>Water:</b> When you deal damage to an adversary within Melee range, all other adversaries within Very Close range must mark a Stress.</li>
						<li><b>Air:</b> You can hover, gaining advantage on Agility Rolls.</li>
					</ul>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'warden_of_the_elements_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Zoe Badini',
			image_url: '/api/images/card/art/subclasses/warden-of-the-elements.webp',
			title: 'Warden of the Elements',
			description_html: 'Specialization',
			class_id: 'druid',
			features: [
				{
					title: 'Elemental Aura',
					description_html: `<p>Once per rest while <i>Channeling</i>, you can assume an aura matching your element. The aura affects targets within Close range until your <i>Channeling</i> ends.</p>
					<ul class="list-disc list-inside ml-2">
						<li><b>Fire:</b> When an adversary marks 1 or more Hit Points, they must also mark a Stress.</li>
						<li><b>Earth:</b> Your allies gain a <b>+1</b> bonus to Strength.</li>
						<li><b>Water:</b> When an adversary deals damage to you, you can <b>mark a Stress</b> to move them anywhere within Very Close range of where they are.</li>
						<li><b>Air:</b> When you or an ally takes damage from an attack beyond Melee range, reduce the damage by <b>1d8</b>.</li>
					</ul>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'warden_of_the_elements_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Zoe Badini',
			image_url: '/api/images/card/art/subclasses/warden-of-the-elements.webp',
			title: 'Warden of the Elements',
			description_html: 'Mastery',
			class_id: 'druid',
			features: [
				{
					title: 'Elemental Dominion',
					description_html: `<p>You further embody your element. While <i>Channeling</i>, you gain the following benefit:</p>
					<ul class="list-disc list-inside ml-2">
						<li><b>Fire:</b> You gain a <b>+1</b> bonus to your Proficiency for attacks and spells that deal damage.</li>
						<li><b>Earth:</b> When you would mark Hit Points, roll a <b>d6</b> per Hit Point marked. For each result of 6, reduce the number of Hit Points you mark by 1.</li>
						<li><b>Water:</b> When an attack against you succeeds, you can <b>mark a Stress</b> to make the attacker temporarily <i>Vulnerable</i>.</li>
						<li><b>Air:</b> You gain a <b>+1</b> bonus to your Evasion and can fly.</li>
					</ul>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	guardian_stalwart: {
		compendium_id: 'guardian_stalwart',
		source_id: 'SRD',
		class_id: 'guardian',
		name: 'Stalwart',
		description_html: '<p>Play the Stalwart if you want to be an unbreakable defender.</p>',
		foundation_card: {
			compendium_id: 'guardian_stalwart_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Reiko Murakami',
			image_url: '/api/images/card/art/subclasses/stalwart.webp',
			title: 'Stalwart',
			description_html: 'Foundation',
			spellcast_trait: null,
			class_id: 'guardian',
			features: [
				{
					title: 'Unwavering',
					description_html: '<p>Gain a permanent <b>+1</b> bonus to your damage thresholds.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Iron Will',
					description_html:
						'<p>When you take physical damage, you can mark an additional Armor Slot to reduce the severity.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'guardian_stalwart_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Reiko Murakami',
			image_url: '/api/images/card/art/subclasses/stalwart.webp',
			title: 'Stalwart',
			description_html: 'Specialization',
			class_id: 'guardian',
			features: [
				{
					title: 'Unrelenting',
					description_html: '<p>Gain a permanent <b>+2</b> bonus to your damage thresholds.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Partners in Arms',
					description_html:
						'<p>When an ally within Very Close range takes damage, you can mark an Armor Slot to reduce the severity by one threshold.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'guardian_stalwart_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Reiko Murakami',
			image_url: '/api/images/card/art/subclasses/stalwart.webp',
			title: 'Stalwart',
			description_html: 'Mastery',
			class_id: 'guardian',
			features: [
				{
					title: 'Undaunted',
					description_html: '<p>Gain a permanent <b>+3</b> bonus to your damage thresholds.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Loyal Protector',
					description_html:
						'<p>When an ally within Close range has 2 or fewer Hit Points and would take damage, you can <b>mark a Stress</b> to sprint to their side and take the damage instead.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	guardian_vengeance: {
		compendium_id: 'guardian_vengeance',
		source_id: 'SRD',
		class_id: 'guardian',
		name: 'Vengeance',
		description_html: '<p>Play the Vengeance if you want to punish those who harm your allies.</p>',
		foundation_card: {
			compendium_id: 'guardian_vengeance_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Linda Lithén',
			image_url: '/api/images/card/art/subclasses/vengeance.webp',
			title: 'Vengeance',
			description_html: 'Foundation',
			spellcast_trait: null,
			class_id: 'guardian',
			features: [
				{
					title: 'At Ease',
					description_html: '<p>Gain an additional Stress slot.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Revenge',
					description_html:
						'<p>When an adversary within Melee range succeeds on an attack against you, you can <b>mark 2 Stress</b> to force the attacker to mark a Hit Point.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'guardian_vengeance_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Linda Lithén',
			image_url: '/api/images/card/art/subclasses/vengeance.webp',
			title: 'Vengeance',
			description_html: 'Specialization',
			class_id: 'guardian',
			features: [
				{
					title: 'Act of Reprisal',
					description_html:
						'<p>When an adversary damages an ally within Melee range, you gain a <b>+1</b> bonus to your Proficiency for the next successful attack you make against that adversary.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'guardian_vengeance_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Linda Lithén',
			image_url: '/api/images/card/art/subclasses/vengeance.webp',
			title: 'Vengeance',
			description_html: 'Mastery',
			class_id: 'guardian',
			features: [
				{
					title: 'Nemesis',
					description_html:
						'<p><b>Spend 2 Hope</b> to <i>Prioritize</i> an adversary until your next rest. When you make an attack against your <i>Prioritized</i> adversary, you can swap the results of your Hope and Fear Dice. You can only <i>Prioritize</i> one adversary at a time.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	ranger_wayfinder: {
		compendium_id: 'ranger_wayfinder',
		source_id: 'SRD',
		class_id: 'ranger',
		name: 'Wayfinder',
		description_html:
			'<p>Play the Wayfinder if you want to be a relentless tracker and hunter.</p>',
		foundation_card: {
			compendium_id: 'ranger_wayfinder_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Simon Pape',
			image_url: '/api/images/card/art/subclasses/wayfinder.webp',
			title: 'Wayfinder',
			description_html: 'Foundation',
			spellcast_trait: 'agility',
			class_id: 'ranger',
			features: [
				{
					title: 'Ruthless Predator',
					description_html:
						'<p>When you make a damage roll, you can <b>mark a Stress</b> to gain a <b>+1</b> bonus to your Proficiency. Additionally, when you deal Severe damage to an adversary, they must mark a Stress.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Path Forward',
					description_html:
						"<p>When you're traveling to a place you've previously visited or you carry an object that has been at the location before, you can identify the shortest, most direct path to your destination.</p>",
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'ranger_wayfinder_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Simon Pape',
			image_url: '/api/images/card/art/subclasses/wayfinder.webp',
			title: 'Wayfinder',
			description_html: 'Specialization',
			class_id: 'ranger',
			features: [
				{
					title: 'Elusive Predator',
					description_html:
						'<p>When your <i>Focus</i> makes an attack against you, you gain a <b>+2</b> bonus to your Evasion against the attack.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'ranger_wayfinder_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Simon Pape',
			image_url: '/api/images/card/art/subclasses/wayfinder.webp',
			title: 'Wayfinder',
			description_html: 'Mastery',
			class_id: 'ranger',
			features: [
				{
					title: 'Apex Predator',
					description_html:
						"<p>Before you make an attack roll against your <i>Focus</i>, you can <b>spend a Hope</b>. On a successful attack, you remove a Fear from the GM's Fear pool.</p>",
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	ranger_beastbound: {
		compendium_id: 'ranger_beastbound',
		source_id: 'SRD',
		class_id: 'ranger',
		name: 'Beastbound',
		description_html:
			'<p>Play the Beastbound if you want to fight alongside an animal companion.</p>',
		foundation_card: {
			compendium_id: 'ranger_beastbound_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Jenny Tan',
			image_url: '/api/images/card/art/subclasses/beastbound.webp',
			title: 'Beastbound',
			description_html: 'Foundation',
			spellcast_trait: 'agility',
			class_id: 'ranger',
			features: [
				{
					title: 'Companion',
					description_html:
						"<p>You have an animal companion of your choice (at the GM's discretion). They stay by your side unless you tell them otherwise. Take the Ranger Companion sheet. When you level up your character, choose a level-up option for your companion from this sheet as well.</p>",
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'ranger_beastbound_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Jenny Tan',
			image_url: '/api/images/card/art/subclasses/beastbound.webp',
			title: 'Beastbound',
			description_html: 'Specialization',
			class_id: 'ranger',
			features: [
				{
					title: 'Expert Training',
					description_html: '<p>Choose an additional level-up option for your companion.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Battle-Bonded',
					description_html:
						"<p>When an adversary attacks you while they're within your companion's Melee range, you gain a <b>+2</b> bonus to your Evasion against the attack.</p>",
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'ranger_beastbound_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Jenny Tan',
			image_url: '/api/images/card/art/subclasses/beastbound.webp',
			title: 'Beastbound',
			description_html: 'Mastery',
			class_id: 'ranger',
			features: [
				{
					title: 'Advanced Training',
					description_html: '<p>Choose two additional level-up options for your companion.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Loyal Friend',
					description_html:
						"<p>Once per long rest, when the damage from an attack would mark your companion's last Stress or your last Hit Point and you're within Close range of each other, you or your companion can rush to the other's side and take that damage instead.</p>",
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	rogue_syndicate: {
		compendium_id: 'rogue_syndicate',
		source_id: 'SRD',
		class_id: 'rogue',
		name: 'Syndicate',
		description_html: '<p>Play the Syndicate if you want to leverage your network of contacts.</p>',
		foundation_card: {
			compendium_id: 'rogue_syndicate_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Jenny Tan',
			image_url: '/api/images/card/art/subclasses/syndicate.webp',
			title: 'Syndicate',
			description_html: 'Foundation',
			spellcast_trait: 'finesse',
			class_id: 'rogue',
			features: [
				{
					title: 'Well-Connected',
					description_html: `<p>When you arrive in a prominent town or environment, you know somebody who calls this place home. Give them a name, note how you think they could be useful, and choose one fact from the following list:</p>
					<ul class="list-disc list-inside ml-2">
						<li>They owe me a favor, but they'll be hard to find.</li>
						<li>They're going to ask for something in exchange.</li>
						<li>They're always in a great deal of trouble.</li>
						<li>We used to be together. It's a long story.</li>
						<li>We didn't part on great terms.</li>
					</ul>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'rogue_syndicate_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Jenny Tan',
			image_url: '/api/images/card/art/subclasses/syndicate.webp',
			title: 'Syndicate',
			description_html: 'Specialization',
			class_id: 'rogue',
			features: [
				{
					title: 'Contacts Everywhere',
					description_html: `<p>Once per session, you can briefly call on a shady contact. Choose one of the following benefits and describe what brought them here to help you in this moment:</p>
					<ul class="list-disc list-inside ml-2">
						<li>They provide 1 handful of gold, a unique tool, or a mundane object that the situation requires.</li>
						<li>On your next action roll, their help provides a <b>+3</b> bonus to the result of your Hope or Fear Die.</li>
						<li>The next time you deal damage, they snipe from the shadows, adding <b>2d8</b> to your damage roll.</li>
					</ul>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'rogue_syndicate_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Jenny Tan',
			image_url: '/api/images/card/art/subclasses/syndicate.webp',
			title: 'Syndicate',
			description_html: 'Mastery',
			class_id: 'rogue',
			features: [
				{
					title: 'Reliable Backup',
					description_html: `<p>You can use your "Contacts Everywhere" feature three times per session. The following options are added to the list of benefits you can choose from when you use that feature:</p>
					<ul class="list-disc list-inside ml-2">
						<li>When you mark 1 or more Hit Points, they can rush out to shield you, reducing the Hit Points marked by 1.</li>
						<li>When you make a Presence Roll in conversation, they back you up. You can roll a <b>d20</b> as your Hope Die.</li>
					</ul>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	rogue_nightwalker: {
		compendium_id: 'rogue_nightwalker',
		source_id: 'SRD',
		class_id: 'rogue',
		name: 'Nightwalker',
		description_html: '<p>Play the Nightwalker if you want to master shadow and darkness.</p>',
		foundation_card: {
			compendium_id: 'rogue_nightwalker_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Juan S. Almencion',
			image_url: '/api/images/card/art/subclasses/nightwalker.webp',
			title: 'Nightwalker',
			description_html: 'Foundation',
			spellcast_trait: 'finesse',
			class_id: 'rogue',
			features: [
				{
					title: 'Shadow Stepper',
					description_html:
						'<p>You can move from shadow to shadow. When you move into an area of darkness or a shadow cast by another creature or object, you can <b>mark a Stress</b> to disappear from where you are and reappear inside another shadow within Far range. When you reappear, you are <i>Cloaked</i>.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'rogue_nightwalker_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Juan S. Almencion',
			image_url: '/api/images/card/art/subclasses/nightwalker.webp',
			title: 'Nightwalker',
			description_html: 'Specialization',
			class_id: 'rogue',
			features: [
				{
					title: 'Dark Cloud',
					description_html:
						"<p>Make a Spellcast Roll (15). On a success, create a temporary dark cloud that covers any area within Close range. Anyone in this cloud can't see outside of it, and anyone outside of it can't see in. You're considered <i>Cloaked</i> from any adversary for whom the cloud blocks line of sight.</p>",
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Adrenaline',
					description_html:
						"<p>While you're <i>Vulnerable</i>, add your level to your damage rolls.</p>",
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'rogue_nightwalker_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Juan S. Almencion',
			image_url: '/api/images/card/art/subclasses/nightwalker.webp',
			title: 'Nightwalker',
			description_html: 'Mastery',
			class_id: 'rogue',
			features: [
				{
					title: 'Fleeting Shadow',
					description_html:
						'<p>Gain a permanent <b>+1</b> bonus to your Evasion. You can use your "Shadow Stepper" feature to move within Very Far range.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Vanishing Act',
					description_html:
						'<p><b>Mark a Stress</b> to become <i>Cloaked</i> at any time. When <i>Cloaked</i> from this feature, you automatically clear the <i>Restrained</i> condition if you have it. You remain <i>Cloaked</i> in this way until you roll with Fear or until your next rest.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	seraph_divine_wielder: {
		compendium_id: 'seraph_divine_wielder',
		source_id: 'SRD',
		class_id: 'seraph',
		name: 'Divine Wielder',
		description_html:
			'<p>Play the Divine Wielder if you want to channel divine power through your weapon.</p>',
		foundation_card: {
			compendium_id: 'seraph_divine_wielder_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Jenny Tan',
			image_url: '/api/images/card/art/subclasses/divine-wielder.webp',
			title: 'Divine Wielder',
			description_html: 'Foundation',
			spellcast_trait: 'strength',
			class_id: 'seraph',
			features: [
				{
					title: 'Spirit Weapon',
					description_html:
						'<p>When you have an equipped weapon with a range of Melee or Very Close, it can fly from your hand to attack an adversary within Close range and then return to you. You can <b>mark a Stress</b> to target an additional adversary within range with the same attack roll.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Sparing Touch',
					description_html:
						'<p>Once per long rest, touch a creature and clear 2 Hit Points or 2 Stress from them.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'seraph_divine_wielder_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Jenny Tan',
			image_url: '/api/images/card/art/subclasses/divine-wielder.webp',
			title: 'Divine Wielder',
			description_html: 'Specialization',
			class_id: 'seraph',
			features: [
				{
					title: 'Devout',
					description_html:
						'<p>When you roll your Prayer Dice, you can roll an additional die and discard the lowest result. Additionally, you can use your "Sparing Touch" feature twice instead of once per long rest.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'seraph_divine_wielder_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Jenny Tan',
			image_url: '/api/images/card/art/subclasses/divine-wielder.webp',
			title: 'Divine Wielder',
			description_html: 'Mastery',
			class_id: 'seraph',
			features: [
				{
					title: 'Sacred Resonance',
					description_html:
						'<p>When you roll damage for your "Spirit Weapon" feature, if any of the die results match, double the value of each matching die. For example, if you roll two 5s, they count as two 10s.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	seraph_winged_sentinel: {
		compendium_id: 'seraph_winged_sentinel',
		source_id: 'SRD',
		class_id: 'seraph',
		name: 'Winged Sentinel',
		description_html:
			'<p>Play the Winged Sentinel if you want to take flight and protect from above.</p>',
		foundation_card: {
			compendium_id: 'seraph_winged_sentinel_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Stephanie Cost',
			image_url: '/api/images/card/art/subclasses/winged-sentinel.webp',
			title: 'Winged Sentinel',
			description_html: 'Foundation',
			spellcast_trait: 'strength',
			class_id: 'seraph',
			features: [
				{
					title: 'Wings of Light',
					description_html: `<p>You can fly. While flying, you can do the following:</p>
					<ul class="list-disc list-inside ml-2">
						<li><b>Mark a Stress</b> to pick up and carry another willing creature approximately your size or smaller.</li>
						<li><b>Spend a Hope</b> to deal an extra <b>1d8</b> damage on a successful attack.</li>
					</ul>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'seraph_winged_sentinel_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Stephanie Cost',
			image_url: '/api/images/card/art/subclasses/winged-sentinel.webp',
			title: 'Winged Sentinel',
			description_html: 'Specialization',
			class_id: 'seraph',
			features: [
				{
					title: 'Ethereal Visage',
					description_html:
						"<p>Your supernatural visage strikes awe and fear. While flying, you have advantage on Presence Rolls. When you succeed with Hope on a Presence Roll, you can remove a Fear from the GM's Fear pool instead of gaining Hope.</p>",
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'seraph_winged_sentinel_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Stephanie Cost',
			image_url: '/api/images/card/art/subclasses/winged-sentinel.webp',
			title: 'Winged Sentinel',
			description_html: 'Mastery',
			class_id: 'seraph',
			features: [
				{
					title: 'Ascendant',
					description_html:
						'<p>Gain a permanent <b>+4</b> bonus to your Severe damage threshold.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Power of the Gods',
					description_html:
						'<p>While flying, you deal an extra <b>1d12</b> damage instead of <b>1d8</b> with your "Wings of Light" feature.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	sorcerer_elemental_origin: {
		compendium_id: 'sorcerer_elemental_origin',
		source_id: 'SRD',
		class_id: 'sorcerer',
		name: 'Elemental Origin',
		description_html: '<p>Play the Elemental Origin if you want to command the elements.</p>',
		foundation_card: {
			compendium_id: 'sorcerer_elemental_origin_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Bear Frymire',
			image_url: '/api/images/card/art/subclasses/elemental-origin.webp',
			title: 'Elemental Origin',
			description_html: 'Foundation',
			spellcast_trait: 'instinct',
			class_id: 'sorcerer',
			features: [
				{
					title: 'Elementalist',
					description_html: `<p>Choose one of the following elements at character creation:</p>
					<p><b>Air · Earth · Fire · Lightning · Water</b></p>
					<p>You can shape this element into harmless effects. Additionally, <b>spend a Hope</b> and describe how your control over this element helps an action roll you're about to make, then either gain a <b>+2</b> bonus to the roll or a <b>+3</b> bonus to the roll's damage.</p>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'sorcerer_elemental_origin_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Bear Frymire',
			image_url: '/api/images/card/art/subclasses/elemental-origin.webp',
			title: 'Elemental Origin',
			description_html: 'Specialization',
			class_id: 'sorcerer',
			features: [
				{
					title: 'Natural Evasion',
					description_html:
						'<p>You can call forth your element to protect you from harm. When an attack roll against you succeeds, you can <b>mark a Stress</b> and describe how you use your element to defend you. When you do, roll a <b>d6</b> and add its result to your Evasion against the attack.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'sorcerer_elemental_origin_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Bear Frymire',
			image_url: '/api/images/card/art/subclasses/elemental-origin.webp',
			title: 'Elemental Origin',
			description_html: 'Mastery',
			class_id: 'sorcerer',
			features: [
				{
					title: 'Transcendence',
					description_html: `<p>Once per long rest, you can transform into a physical manifestation of your element. When you do, describe your transformation and choose two of the following benefits to gain until your next rest:</p>
					<ul class="list-disc list-inside ml-2">
						<li><b>+4</b> bonus to your Severe threshold</li>
						<li><b>+1</b> bonus to a character trait of your choice</li>
						<li><b>+1</b> bonus to your Proficiency</li>
						<li><b>+2</b> bonus to your Evasion</li>
					</ul>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	sorcerer_primal_origin: {
		compendium_id: 'sorcerer_primal_origin',
		source_id: 'SRD',
		class_id: 'sorcerer',
		name: 'Primal Origin',
		description_html:
			'<p>Play the Primal Origin if you want to manipulate the essence of magic itself.</p>',
		foundation_card: {
			compendium_id: 'sorcerer_primal_origin_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Laura Galli',
			image_url: '/api/images/card/art/subclasses/primal-origin.webp',
			title: 'Primal Origin',
			description_html: 'Foundation',
			spellcast_trait: 'instinct',
			class_id: 'sorcerer',
			features: [
				{
					title: 'Manipulate Magic',
					description_html: `<p>Your primal origin allows you to modify the essence of magic itself. After you cast a spell or make an attack using a weapon that deals magic damage, you can <b>mark a Stress</b> to do one of the following:</p>
					<ul class="list-disc list-inside ml-2">
						<li>Extend the spell or attack's reach by one range</li>
						<li>Gain a <b>+2</b> bonus to the action roll's result</li>
						<li>Double a damage die of your choice</li>
						<li>Hit an additional target within range</li>
					</ul>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'sorcerer_primal_origin_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Laura Galli',
			image_url: '/api/images/card/art/subclasses/primal-origin.webp',
			title: 'Primal Origin',
			description_html: 'Specialization',
			class_id: 'sorcerer',
			features: [
				{
					title: 'Enchanted Aid',
					description_html:
						'<p>You can enhance the magic of others with your essence. When you Help an Ally with a Spellcast Roll, you can roll a <b>d8</b> as your advantage die. Once per long rest, after an ally has made a Spellcast Roll with your help, you can swap the results of their Duality Dice.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'sorcerer_primal_origin_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Laura Galli',
			image_url: '/api/images/card/art/subclasses/primal-origin.webp',
			title: 'Primal Origin',
			description_html: 'Mastery',
			class_id: 'sorcerer',
			features: [
				{
					title: 'Arcane Charge',
					description_html:
						'<p>When you use your "Channel Raw Power" feature, you become <i>Charged</i>. While <i>Charged</i>, you gain a <b>+1</b> bonus to your damage rolls or a <b>+1</b> bonus to the Difficulty of reaction rolls made against you. You remain <i>Charged</i> until you roll with Fear or until your next rest.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	warrior_call_of_the_brave: {
		compendium_id: 'warrior_call_of_the_brave',
		source_id: 'SRD',
		class_id: 'warrior',
		name: 'Call of the Brave',
		description_html:
			'<p>Play Call of the Brave if you want to inspire courage and face danger head-on.</p>',
		foundation_card: {
			compendium_id: 'call_of_the_brave_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Mat Wilma',
			image_url: '/images/wip.avif',
			title: 'Call of the Brave',
			description_html: 'Foundation',
			spellcast_trait: null,
			class_id: 'warrior',
			features: [
				{
					title: 'Courage',
					description_html: '<p>When you fail a roll with Fear, you gain a Hope.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Battle Ritual',
					description_html:
						'<p>Once per long rest, before you attempt something incredibly dangerous or face off against a foe who clearly outmatches you, describe what ritual you perform or preparations you make. When you do, clear 2 Stress and gain 2 Hope.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'call_of_the_brave_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Mat Wilma',
			image_url: '/images/wip.avif',
			title: 'Call of the Brave',
			description_html: 'Specialization',
			class_id: 'warrior',
			features: [
				{
					title: 'Rise to the Challenge',
					description_html:
						'<p>You are vigilant in the face of mounting danger. While you have 2 or fewer Hit Points unmarked, you can roll a <b>d20</b> as your Hope Die.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'call_of_the_brave_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Mat Wilma',
			image_url: '/images/wip.avif',
			title: 'Call of the Brave',
			description_html: 'Mastery',
			class_id: 'warrior',
			features: [
				{
					title: 'Camaraderie',
					description_html:
						'<p>Your unwavering bravery is a rallying point for your allies. You can initiate a Tag Team Roll one additional time per session. Additionally, when an ally initiates a Tag Team Roll with you, they only need to spend 2 Hope to do so.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	warrior_call_of_the_slayer: {
		compendium_id: 'warrior_call_of_the_slayer',
		source_id: 'SRD',
		class_id: 'warrior',
		name: 'Call of the Slayer',
		description_html:
			'<p>Play Call of the Slayer if you want to be a relentless combatant who builds power through battle.</p>',
		foundation_card: {
			compendium_id: 'call_of_the_slayer_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Reiko Murakami',
			image_url: '/images/wip.avif',
			title: 'Call of the Slayer',
			description_html: 'Foundation',
			spellcast_trait: null,
			class_id: 'warrior',
			features: [
				{
					title: 'Slayer',
					description_html: `<p>You gain a pool of dice called Slayer Dice. On a roll with Hope, you can place a <b>d6</b> on this card instead of gaining a Hope, adding the die to the pool. You can store a number of Slayer Dice equal to your Proficiency. When you make an attack roll or damage roll, you can spend any number of these Slayer Dice, rolling them and adding their result to the roll. At the end of each session, clear any unspent Slayer Dice on this card and gain a Hope per die cleared.</p>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'call_of_the_slayer_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Reiko Murakami',
			image_url: '/images/wip.avif',
			title: 'Call of the Slayer',
			description_html: 'Specialization',
			class_id: 'warrior',
			features: [
				{
					title: 'Weapon Specialist',
					description_html: `<p>You can wield multiple weapons with dangerous ease. When you succeed on an attack, you can spend a Hope to add one of the damage dice from your secondary weapon to the damage roll.</p>
					<p>Additionally, once per long rest when you roll your Slayer Dice, reroll any 1s.</p>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'call_of_the_slayer_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Reiko Murakami',
			image_url: '/images/wip.avif',
			title: 'Call of the Slayer',
			description_html: 'Mastery',
			class_id: 'warrior',
			features: [
				{
					title: 'Martial Preparation',
					description_html:
						"<p>You're an inspirational warrior to all who travel with you. Your party gains access to the Martial Preparation downtime move. To use this move during a rest, describe how you instruct and train with your party. You and each ally who chooses this downtime move gain a <b>d6 Slayer Die</b>. A PC with a Slayer Die can spend it to roll the die and add the result to an attack or damage roll of their choice.</p>",
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	wizard_school_of_knowledge: {
		compendium_id: 'wizard_school_of_knowledge',
		source_id: 'SRD',
		class_id: 'wizard',
		name: 'School of Knowledge',
		description_html:
			'<p>Play School of Knowledge if you want to master the arcane through study and preparation.</p>',
		foundation_card: {
			compendium_id: 'school_of_knowledge_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Bear Frymire',
			image_url: '/images/wip.avif',
			title: 'School of Knowledge',
			description_html: 'Foundation',
			spellcast_trait: 'knowledge',
			class_id: 'wizard',
			features: [
				{
					title: 'Prepared',
					description_html:
						'<p>Take an additional domain card of your level or lower from a domain you have access to.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Adept',
					description_html:
						'<p>When you Utilize an Experience, you can mark a Stress instead of spending a Hope. If you do, double your Experience modifier for that roll.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'school_of_knowledge_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Bear Frymire',
			image_url: '/images/wip.avif',
			title: 'School of Knowledge',
			description_html: 'Specialization',
			class_id: 'wizard',
			features: [
				{
					title: 'Accomplished',
					description_html:
						'<p>Take an additional domain card of your level or lower from a domain you have access to.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Perfect Recall',
					description_html:
						'<p>Once per rest, when you recall a domain card in your vault, you can reduce its Recall Cost by 1.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'school_of_knowledge_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Bear Frymire',
			image_url: '/images/wip.avif',
			title: 'School of Knowledge',
			description_html: 'Mastery',
			class_id: 'wizard',
			features: [
				{
					title: 'Brilliant',
					description_html:
						'<p>Take an additional domain card of your level or lower from a domain you have access to.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Honed Expertise',
					description_html:
						'<p>When you use an Experience, roll a <b>d6</b>. On a result of 5 or higher, you can use it without spending Hope.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},

	wizard_school_of_war: {
		compendium_id: 'wizard_school_of_war',
		source_id: 'SRD',
		class_id: 'wizard',
		name: 'School of War',
		description_html:
			'<p>Play School of War if you want to be a battle-focused wizard who thrives in combat.</p>',
		foundation_card: {
			compendium_id: 'school_of_war_foundation',
			card_type: 'subclass_foundation',
			artist_name: 'Nikki Dawes',
			image_url: '/images/wip.avif',
			title: 'School of War',
			description_html: 'Foundation',
			spellcast_trait: 'knowledge',
			class_id: 'wizard',
			features: [
				{
					title: 'Battlemage',
					description_html:
						"<p>You've focused your studies on becoming an unconquerable force on the battlefield. Gain an additional Hit Point slot.</p>",
					character_modifiers: [
						{
							behaviour: 'bonus',
							character_conditions: [],
							type: 'flat',
							value: 1,
							target: 'max_hp'
						}
					],
					weapon_modifiers: []
				},
				{
					title: 'Face Your Fear',
					description_html:
						'<p>When you succeed with Fear on an attack roll, you deal an extra <b>1d10</b> magic damage.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			compendium_id: 'school_of_war_specialization',
			card_type: 'subclass_specialization',
			artist_name: 'Nikki Dawes',
			image_url: '/images/wip.avif',
			title: 'School of War',
			description_html: 'Specialization',
			class_id: 'wizard',
			features: [
				{
					title: 'Conjure Shield',
					description_html:
						'<p>You can maintain a protective barrier of magic. While you have at least 2 Hope, you add your Proficiency to your Evasion.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Fueled by Fear',
					description_html:
						'<p>The extra magic damage from your "Face Your Fear" feature increases to <b>2d10</b>.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			compendium_id: 'school_of_war_mastery',
			card_type: 'subclass_mastery',
			artist_name: 'Nikki Dawes',
			image_url: '/images/wip.avif',
			title: 'School of War',
			description_html: 'Mastery',
			class_id: 'wizard',
			features: [
				{
					title: 'Thrive in Chaos',
					description_html:
						'<p>When you succeed on an attack, you can mark a Stress after rolling damage to force the target to mark an additional Hit Point.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Have No Fear',
					description_html:
						'<p>The extra magic damage from your "Face Your Fear" feature increases to <b>3d10</b>.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	}
} as const satisfies Record<string, Subclass>;
