import type { DomainCard } from '$lib/types/compendium-types';

export const GRACE_DOMAIN_CARDS = {
	// todo: verify everything below
	deft_deceiver: {
		compendium_id: 'deft_deceiver',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Deft Deceiver',
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
				description_html: `<p><b>Spend a Hope</b> to gain advantage on a roll to deceive or trick someone into believing a lie you tell them.</p>`,
				character_modifiers: []
			}
		]
	},
	enrapture: {
		compendium_id: 'enrapture',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Enrapture',
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
				description_html: `Make a **Spellcast Roll** against a target within Close range. On a success, they become temporarily *Enraptured*. While Enraptured, a target's attention is fixed on you, narrowing their field of view and drowning out any sound but your voice.

Once per rest on a success, you can **mark a Stress** to force the Enraptured target to mark a Stress as well.`,
				character_modifiers: []
			}
		]
	},
	inspirational_words: {
		compendium_id: 'inspirational_words',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Inspirational Words',
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
				description_html: `Your speech is imbued with power. After a long rest, place a number of tokens on this card equal to your Presence. When you speak with an ally, you can spend a token from this card to give them one benefit from the following options:

- Your ally clears a Stress.
- Your ally clears a Hit Point.
- Your ally gains a Hope.

When you take a long rest, clear all unspent tokens.`,
				character_modifiers: []
			}
		]
	},
	tell_no_lies: {
		compendium_id: 'tell_no_lies',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Tell No Lies',
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
				description_html: `Make a **Spellcast Roll** against a target within Very Close range. On a success, they can't lie to you while they remain within Close range, but they are not compelled to speak. If you ask them a question and they refuse to answer, they must **mark a Stress** and the effect ends. The target is typically unaware this spell has been cast on them until it causes them to utter the truth.`,
				character_modifiers: []
			}
		]
	},
	troublemaker: {
		compendium_id: 'troublemaker',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Troublemaker',
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
				description_html: `When you taunt or provoke a target within Far range, make a **Presence Roll** against them. Once per rest on a success, roll a number of **d4s** equal to your Proficiency. The target must mark Stress equal to the highest result rolled.`,
				character_modifiers: []
			}
		]
	},
	hypnotic_shimmer: {
		compendium_id: 'hypnotic_shimmer',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Hypnotic Shimmer',
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
				description_html: `Make a **Spellcast Roll** against all adversaries in front of you within Close range. Once per rest on a success, create an illusion of flashing colors and lights that temporarily *Stuns* targets you succeed against and forces them to **mark a Stress**.

While Stunned, they can't use reactions and can't take any other actions until they clear this condition.`,
				character_modifiers: []
			}
		]
	},
	invisibility: {
		compendium_id: 'invisibility',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Invisibility',
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
				description_html: `Make a **Spellcast Roll (10)**. On a success, **mark a Stress** and choose yourself or an ally within Melee range to become *Invisible*. An *Invisible* creature can't be seen except through magical means and attack rolls against them are made with disadvantage. Place a number of tokens on this card equal to your Spellcast trait. When the *Invisible* creature takes an action, spend a token from this card. After the action that spends the last token is resolved, the effect ends.

You can only hold Invisibility on one creature at a time.`,
				character_modifiers: []
			}
		]
	},
	soothing_speech: {
		compendium_id: 'soothing_speech',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Soothing Speech',
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
				description_html: `During a short rest, when you take the time to comfort another character while using the *Tend to Wounds* downtime move on them, clear an additional Hit Point on that character. When you do, you also clear 2 Hit Points.`,
				character_modifiers: []
			}
		]
	},
	through_your_eyes: {
		compendium_id: 'through_your_eyes',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Through Your Eyes',
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
				description_html: `Choose a target within Very Far range. You can see through their eyes and hear through their ears. You can transition between using your own senses or the target's freely until you cast another spell or until your next rest.`,
				character_modifiers: []
			}
		]
	},
	thought_delver: {
		compendium_id: 'thought_delver',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Thought Delver',
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
				description_html: `You can peek into the minds of others. **Spend a Hope** to read the vague surface thoughts of a target within Far range. Make a **Spellcast Roll** against the target to delve for deeper, more hidden thoughts.

On a roll with Fear, the target might, at the GM's discretion, become aware that you're reading their thoughts.`,
				character_modifiers: []
			}
		]
	},
	words_of_discord: {
		compendium_id: 'words_of_discord',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Words of Discord',
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
				description_html: `Whisper words of discord to an adversary within Melee range and make a **Spellcast Roll (13)**. On a success, the target must **mark a Stress** and make an attack against another adversary instead of against you or your allies.

Once this attack is over, the target realizes what happened. The next time you cast Words of Discord on them, gain a −5 penalty to the Spellcast Roll.`,
				character_modifiers: []
			}
		]
	},
	share_the_burden: {
		compendium_id: 'share_the_burden',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Share the Burden',
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
				description_html: `Once per rest, take on the Stress from a willing creature within Melee range. The target describes what intimate knowledge or emotions telepathically leak from their mind in this moment between you. Transfer any number of their marked Stress to you, then gain a Hope for each Stress transferred.`,
				character_modifiers: []
			}
		]
	},
	never_upstaged: {
		compendium_id: 'never_upstaged',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Never Upstaged',
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
				description_html: `When you mark 1 or more Hit Points from an attack, you can **mark a Stress** to place a number of tokens equal to the number of Hit Points you marked on this card. On your next successful attack, gain a +5 bonus to your damage roll for each token on this card, then clear all tokens.`,
				character_modifiers: []
			}
		]
	},
	endless_charisma: {
		compendium_id: 'endless_charisma',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Endless Charisma',
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
				description_html: `After you make an action roll to persuade, lie, or garner favor, you can **spend a Hope** to reroll the Hope or Fear Die.`,
				character_modifiers: []
			}
		]
	},
	grace_touched: {
		compendium_id: 'grace_touched',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Grace-Touched',
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
				description_html: `When 4 or more of the domain cards in your loadout are from the Grace domain, gain the following benefits:

- You can mark an Armor Slot instead of marking a Stress.
- When you would force a target to mark a number of Hit Points, you can choose instead to force them to mark that number of Stress.`,
				character_modifiers: []
			}
		]
	},
	astral_projection: {
		compendium_id: 'astral_projection',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Astral Projection',
		level_requirement: 8,
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
				description_html: `Once per long rest, **mark a Stress** to create a projected copy of yourself that can appear anywhere you've been before.

You can see and hear through the projection as though it were you and affect the world as though you were there. A creature investigating the projection can tell it's of magical origin. This effect lasts until your next rest or your projection takes any damage.`,
				character_modifiers: []
			}
		]
	},
	mass_enrapture: {
		compendium_id: 'mass_enrapture',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Mass Enrapture',
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
				description_html: `Make a **Spellcast Roll** against all targets within Far range. Targets you succeed against become temporarily *Enraptured*. While Enraptured, a target's attention is fixed on you, narrowing their field of view and drowning out any sound but your voice.

**Mark a Stress** to force all Enraptured targets to mark a Stress, ending this spell.`,
				character_modifiers: []
			}
		]
	},
	copycat: {
		compendium_id: 'copycat',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Copycat',
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
				description_html: `Once per long rest, this card can mimic the features of another domain card of level 8 or lower in another player's loadout. **Spend Hope** equal to half the card's level to gain access to the feature. It lasts until your next rest or they place the card in their vault.`,
				character_modifiers: []
			}
		]
	},
	master_of_the_craft: {
		compendium_id: 'master_of_the_craft',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Master of the Craft',
		level_requirement: 9,
		recall_cost: 0,
		applies_in_vault: true,
		forced_in_loadout: false,
		forced_in_vault: true,
		choices: [
			{
				choice_id: 'choose_one_option',
				type: 'arbitrary',
				max: 1,
				conditional_choice: null,
				options: [
					{
						selection_id: 'plus_2_to_two_experiences',
						title: '+2 bonus to two Experiences',
						short_title: '+2 to 2 Experiences'
					},
					{
						selection_id: 'plus_3_to_one_experience',
						title: '+3 bonus to one Experience',
						short_title: '+3 to 1 Experience'
					}
				]
			},
			{
				choice_id: 'choose_two_experiences',
				type: 'experience',
				max: 2,
				conditional_choice: {
					choice_id: 'choose_one_option',
					selection_id: 'plus_2_to_two_experiences'
				}
			},
			{
				choice_id: 'choose_one_experience',
				type: 'experience',
				max: 1,
				conditional_choice: {
					choice_id: 'choose_one_option',
					selection_id: 'plus_3_to_one_experience'
				}
			}
		],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Gain a permanent +2 bonus to two of your Experiences or a permanent +3 bonus to one of your Experiences. Then place this card in your vault permanently.`,
				character_modifiers: [
					{
						behaviour: 'bonus',
						character_conditions: [
							{
								type: 'domain_card_choice',
								domain_card_id: 'master_of_the_craft',
								choice_id: 'choose_one_option',
								selection_id: 'plus_2_to_two_experiences'
							}
						],
						type: 'flat',
						value: 2,
						target: 'experience_from_domain_card_choice_selection',
						domain_card_id: 'master_of_the_craft',
						choice_id: 'choose_two_experiences'
					},
					{
						behaviour: 'bonus',
						character_conditions: [
							{
								type: 'domain_card_choice',
								domain_card_id: 'master_of_the_craft',
								choice_id: 'choose_one_option',
								selection_id: 'plus_3_to_one_experience'
							}
						],
						type: 'flat',
						value: 3,
						target: 'experience_from_domain_card_choice_selection',
						domain_card_id: 'master_of_the_craft',
						choice_id: 'choose_one_experience'
					}
				]
			}
		]
	},
	encore: {
		compendium_id: 'encore',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Encore',
		level_requirement: 10,
		recall_cost: 1,
		applies_in_vault: true,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `When an ally within Close range deals damage to an adversary, you can make a **Spellcast Roll** against that same target. On a success, you deal the same damage to the target that your ally dealt.

If your Spellcast Roll succeeds with Fear, place this card in your vault.`,
				character_modifiers: []
			}
		]
	},
	notorious: {
		compendium_id: 'notorious',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'grace',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Notorious',
		level_requirement: 10,
		recall_cost: 0,
		applies_in_vault: false,
		choices: [],
		tokens: false,
		forced_in_loadout: true,
		forced_in_vault: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `People know who you are and what you've done, and they treat you differently because of it. When you leverage your notoriety to get what you want, you can **mark a Stress** before you roll to gain a +10 bonus to the result.

Your food and drinks are always free wherever you go, and everything else you buy is reduced in price by one bag of gold (to a minimum of one handful).

This card doesn't count against your loadout's domain card maximum of 5 and can't be placed in your vault.`,
				character_modifiers: [
					{
						behaviour: 'bonus',
						type: 'flat',
						value: 1,
						target: 'max_loadout',
						character_conditions: []
					}
				]
			}
		]
	}
} as const satisfies Record<string, DomainCard>;
