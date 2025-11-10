import type { Card } from "$lib/ts/character/types";

export const GRACE_DOMAIN_CARDS = {
    // todo: verify everything below
    deft_deceiver: {
        id: "deft_deceiver",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Simon Pape",
        image_url: "/images/card/art/domains/grace/deft-deceiver.webp",
        type: "ability",
        title: "Deft Deceiver",
        description_html: "",
        level_requirement: 1,
        recall_cost: 0,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p><b>Spend a Hope</b> to gain advantage on a roll to deceive or trick someone into believing a lie you tell them.</p>`,
                modifiers: []
            }
        ],
    },
    enrapture: {
        id: "enrapture",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Letícia Freitas",
        image_url: "/images/card/art/domains/grace/enrapture.webp",
        type: "spell",
        title: "Enrapture",
        description_html: "",
        level_requirement: 1,
        recall_cost: 0,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>Make a <b>Spellcast Roll</b> against a target within Close range. On a success, they become temporarily <em>Enraptured</em>. While Enraptured, a target's attention is fixed on you, narrowing their field of view and drowning out any sound but your voice.</p>
                     <p>Once per rest on a success, you can <b>mark a Stress</b> to force the Enraptured target to mark a Stress as well.</p>`,
                modifiers: []
            }
        ],
    },
    inspirational_words: {
        id: "inspirational_words",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Mat Wilma",
        image_url: "/images/card/art/domains/grace/inspirational-words.webp",
        type: "ability",
        title: "Inspirational Words",
        description_html: "",
        level_requirement: 1,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: true,
        features: [
            {
                title: "",
                description_html:
                    `<p>Your speech is imbued with power. After a long rest, place a number of tokens on this card equal to your Presence. When you speak with an ally, you can spend a token from this card to give them one benefit from the following options:</p>
                     <ul class="list-disc list-inside ml-2">
                        <li>Your ally clears a Stress.</li>
                        <li>Your ally clears a Hit Point.</li>
                        <li>Your ally gains a Hope.</li>
                     </ul>
                     <p>When you take a long rest, clear all unspent tokens.</p>`,
                modifiers: []
            }
        ],
    },
    tell_no_lies: {
        id: "tell_no_lies",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Arturo G. González",
        image_url: "/images/card/art/domains/grace/tell-no-lies.webp",
        type: "spell",
        title: "Tell No Lies",
        description_html: "",
        level_requirement: 2,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>Make a <b>Spellcast Roll</b> against a target within Very Close range. On a success, they can't lie to you while they remain within Close range, but they are not compelled to speak. If you ask them a question and they refuse to answer, they must <b>mark a Stress</b> and the effect ends. The target is typically unaware this spell has been cast on them until it causes them to utter the truth.</p>`,
                modifiers: []
            }
        ],
    },
    troublemaker: {
        id: "troublemaker",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Anthony Jones",
        image_url: "/images/card/art/domains/grace/troublemaker.webp",
        type: "ability",
        title: "Troublemaker",
        description_html: "",
        level_requirement: 2,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>When you taunt or provoke a target within Far range, make a <b>Presence Roll</b> against them. Once per rest on a success, roll a number of <b>d4s</b> equal to your Proficiency. The target must mark Stress equal to the highest result rolled.</p>`,
                modifiers: []
            }
        ],
    },
    hypnotic_shimmer: {
        id: "hypnotic_shimmer",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Edgar Cardona",
        image_url: "/images/card/art/domains/grace/hypnotic-shimmer.webp",
        type: "spell",
        title: "Hypnotic Shimmer",
        description_html: "",
        level_requirement: 3,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>Make a <b>Spellcast Roll</b> against all adversaries in front of you within Close range. Once per rest on a success, create an illusion of flashing colors and lights that temporarily <em>Stuns</em> targets you succeed against and forces them to <b>mark a Stress</b>.</p>
                     <p>While Stunned, they can't use reactions and can't take any other actions until they clear this condition.</p>`,
                modifiers: []
            }
        ],
    },
    soothing_speech: {
        id: "soothing_speech",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Anthony Jones",
        image_url: "/images/card/art/domains/grace/soothing-speech.webp",
        type: "ability",
        title: "Soothing Speech",
        description_html: "",
        level_requirement: 4,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>During a short rest, when you take the time to comfort another character while using the <em>Tend to Wounds</em> downtime move on them, clear an additional Hit Point on that character. When you do, you also clear 2 Hit Points.</p>`,
                modifiers: []
            }
        ],
    },
    through_your_eyes: {
        id: "through_your_eyes",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Edgar Cardona",
        image_url: "/images/card/art/domains/grace/through-your-eyes.webp",
        type: "spell",
        title: "Through Your Eyes",
        description_html: "",
        level_requirement: 4,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>Choose a target within Very Far range. You can see through their eyes and hear through their ears. You can transition between using your own senses or the target’s freely until you cast another spell or until your next rest.</p>`,
                modifiers: []
            }
        ],
    },
    thought_delver: {
        id: "thought_delver",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Cybercatbug",
        image_url: "/images/card/art/domains/grace/thought-delver.webp",
        type: "spell",
        title: "Thought Delver",
        description_html: "",
        level_requirement: 5,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>You can peek into the minds of others. <b>Spend a Hope</b> to read the vague surface thoughts of a target within Far range. Make a <b>Spellcast Roll</b> against the target to delve for deeper, more hidden thoughts.</p>
                     <p>On a roll with Fear, the target might, at the GM’s discretion, become aware that you’re reading their thoughts.</p>`,
                modifiers: []
            }
        ],
    },
    words_of_discord: {
        id: "words_of_discord",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Anthony Jones",
        image_url: "/images/card/art/domains/grace/words-of-discord.webp",
        type: "spell",
        title: "Words of Discord",
        description_html: "",
        level_requirement: 5,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>Whisper words of discord to an adversary within Melee range and make a <b>Spellcast Roll (13)</b>. On a success, the target must <b>mark a Stress</b> and make an attack against another adversary instead of against you or your allies.</p>
                     <p>Once this attack is over, the target realizes what happened. The next time you cast Words of Discord on them, gain a −5 penalty to the Spellcast Roll.</p>`,
                modifiers: []
            }
        ],
    },
    share_the_burden: {
        id: "share_the_burden",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Eliot Baum",
        image_url: "/images/card/art/domains/grace/share-the-burden.webp",
        type: "spell",
        title: "Share the Burden",
        description_html: "",
        level_requirement: 6,
        recall_cost: 0,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>Once per rest, take on the Stress from a willing creature within Melee range. The target describes what intimate knowledge or emotions telepathically leak from their mind in this moment between you. Transfer any number of their marked Stress to you, then gain a Hope for each Stress transferred.</p>`,
                modifiers: []
            }
        ],
    },
    never_upstaged: {
        id: "never_upstaged",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Andrea T Montalto",
        image_url: "/images/card/art/domains/grace/never-upstaged.webp",
        type: "ability",
        title: "Never Upstaged",
        description_html: "",
        level_requirement: 6,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: true,
        features: [
            {
                title: "",
                description_html:
                    `<p>When you mark 1 or more Hit Points from an attack, you can <b>mark a Stress</b> to place a number of tokens equal to the number of Hit Points you marked on this card. On your next successful attack, gain a +5 bonus to your damage roll for each token on this card, then clear all tokens.</p>`,
                modifiers: []
            }
        ],
    },
    endless_charisma: {
        id: "endless_charisma",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Samantha B. Lucas",
        image_url: "/images/card/art/domains/grace/endless-charisma.webp",
        type: "ability",
        title: "Endless Charisma",
        description_html: "",
        level_requirement: 7,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>After you make an action roll to persuade, lie, or garner favor, you can <b>spend a Hope</b> to reroll the Hope or Fear Die.</p>`,
                modifiers: []
            }
        ],
    },
    grace_touched: {
        id: "grace_touched",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Juan S. Almenicon",
        image_url: "/images/card/art/domains/grace/grace-touched.webp",
        type: "ability",
        title: "Grace-Touched",
        description_html: "",
        level_requirement: 7,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>When 4 or more of the domain cards in your loadout are from the Grace domain, gain the following benefits:</p>
                     <ul class="list-disc list-inside ml-2">
                        <li>You can mark an Armor Slot instead of marking a Stress.</li>
                        <li>When you would force a target to mark a number of Hit Points, you can choose instead to force them to mark that number of Stress.</li>
                     </ul>`,
                modifiers: []
            }
        ],
    },
    astral_projection: {
        id: "astral_projection",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Dominik Mayer",
        image_url: "/images/card/art/domains/grace/astral-projection.webp",
        type: "spell",
        title: "Astral Projection",
        description_html: "",
        level_requirement: 8,
        recall_cost: 0,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>Once per long rest, <b>mark a Stress</b> to create a projected copy of yourself that can appear anywhere you've been before.</p>
                     <p>You can see and hear through the projection as though it were you and affect the world as though you were there. A creature investigating the projection can tell it's of magical origin. This effect lasts until your next rest or your projection takes any damage.</p>`,
                modifiers: []
            }
        ],
    },
    mass_enrapture: {
        id: "mass_enrapture",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Daarken",
        image_url: "/images/card/art/domains/grace/mass-enrapture.webp",
        type: "spell",
        title: "Mass Enrapture",
        description_html: "",
        level_requirement: 8,
        recall_cost: 3,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>Make a <b>Spellcast Roll</b> against all targets within Far range. Targets you succeed against become temporarily <em>Enraptured</em>. While Enraptured, a target’s attention is fixed on you, narrowing their field of view and drowning out any sound but your voice.</p>
                     <p><b>Mark a Stress</b> to force all Enraptured targets to mark a Stress, ending this spell.</p>`,
                modifiers: []
            }
        ],
    },
    copycat: {
        id: "copycat",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Cybercatbug",
        image_url: "/images/card/art/domains/grace/copycat.webp",
        type: "spell",
        title: "Copycat",
        description_html: "",
        level_requirement: 9,
        recall_cost: 3,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>Once per long rest, this card can mimic the features of another domain card of level 8 or lower in another player's loadout. <b>Spend Hope</b> equal to half the card's level to gain access to the feature. It lasts until your next rest or they place the card in their vault.</p>`,
                modifiers: []
            }
        ],
    },
    master_of_the_craft: {
        id: "master_of_the_craft",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Anthony Jones",
        image_url: "/images/card/art/domains/grace/master-of-the-craft.webp",
        type: "ability",
        title: "Master of the Craft",
        description_html: "",
        level_requirement: 9,
        recall_cost: 0,
        applies_in_vault: true,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [
            {
                id: "plus_2_to_two_experiences",
                name: "+2 to two experiences",
                type: "experience",
                max: 2
            },
            {
                id: "plus_3_to_one_experience",
                name: "+3 to one experience",
                type: "experience",
                max: 1
            }
        ],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>Gain a permanent +2 bonus to two of your Experiences or a permanent +3 bonus to one of your Experiences. Then place this card in your vault permanently.</p>`,
                modifiers: [
                    {
                        behavior: "bonus",
                        conditions: [
                            {
                                type: "domain_card_choice",
                                domain_card_id: "master_of_the_craft",
                                choice_id: "plus_2_to_two_experiences",
                            }
                        ],
                        type: "flat",
                        value: 2,
                        target: "experiences_from_domain_card_selection",
                        domain_card_id: "master_of_the_craft"
                    },
                    {
                        behavior: "bonus",
                        conditions: [
                            {
                                type: "domain_card_choice",
                                domain_card_id: "master_of_the_craft",
                                choice_id: "plus_3_to_one_experience",
                            }
                        ],
                        type: "flat",
                        value: 3,
                        target: "experiences_from_domain_card_selection",
                        domain_card_id: "master_of_the_craft"
                    }
                ]
            }
        ],
    },
    encore: {
        id: "encore",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Mat Wilma",
        image_url: "/images/card/art/domains/grace/encore.webp",
        type: "spell",
        title: "Encore",
        description_html: "",
        level_requirement: 10,
        recall_cost: 1,
        applies_in_vault: true,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>When an ally within Close range deals damage to an adversary, you can make a <b>Spellcast Roll</b> against that same target. On a success, you deal the same damage to the target that your ally dealt.</p>
                     <p>If your Spellcast Roll succeeds with Fear, place this card in your vault.</p>`,
                modifiers: []
            }
        ],
    },
    // todo: add a way to force this in your loadout
    notorious: {
        id: "notorious",
        card_type: "domain",
        domain_id: "grace",
        artist_name: "Arturo G. González",
        image_url: "/images/card/art/domains/grace/notorious.webp",
        type: "ability",
        title: "Notorious",
        description_html: "",
        level_requirement: 10,
        recall_cost: 0,
        applies_in_vault: false,
        choices: [],
        tokens: false,
        forced_in_loadout: true,
        forced_in_vault: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>People know who you are and what you've done, and they treat you differently because of it. When you leverage your notoriety to get what you want, you can <b>mark a Stress</b> before you roll to gain a +10 bonus to the result.</p>
                     <p>Your food and drinks are always free wherever you go, and everything else you buy is reduced in price by one bag of gold (to a minimum of one handful).</p>
                     <p>This card doesn't count against your loadout's domain card maximum of 5 and can't be placed in your vault.</p>`,
                modifiers: [
                    {
                        behavior: "bonus",
                        type: "flat",
                        value: 1,
                        target: "max_domain_card_loadout",
                        conditions: []
                    }
                ]
            }
        ],
    }

} as const satisfies Record<string, Card<"domain">>
