import type { Domain, Class, Subclass, Card, Character } from "./types";


export const DOMAINS = {
    arcana: {
        name: "Arcana",
        color: "#4e345b",
        cards: {}
    } as Domain,
    blade: {
        name: "Blade",
        color: "#af231c",
        cards: {
            whirlwind: {
                image_url: "",
                full_card_image_url: "/assets/cards/domains/blade/whirlwind.png",
                title: "Whrilwind",
                description_html: "",
                level: 1,
                recall_cost: 0,
                features: [
                    {
                        title: "",
                        description_html: "<p>When you make a successful attack agains a target within Very Close range, you can <b>spend a Hope</b> to use the attack against all other targets within Very Close range.</p>"
                    }
                ]
            },
            not_good_enough: {
                image_url: "",
                full_card_image_url: "/assets/cards/domains/blade/not-good-enough.png",
                title: "Not Good Enough",
                description_html: "",
                level: 1,
                recall_cost: 1,
                features: [
                    {
                        title: "",
                        description_html: "<p>When you roll your damage dice, you can reroll any 1s or 2s.</p>"
                    }
                ]
            }
        }
    } as Domain,
    bone: {
        name: "Bone",
        color: "#a4a9a8",
        cards: {}
    } as Domain,
    codex: {
        name: "Codex",
        color: "#24395d",
        cards: {}
    } as Domain,
    grace: {
        name: "Grace",
        color: "#8d3965",
        cards: {}
    } as Domain,
    midnight: {
        name: "Midnight",
        color: "#1e201f",
        cards: {}
    } as Domain,
    sage: {
        name: "Sage",
        color: "#244e30",
        cards: {}
    } as Domain,
    splendor: {
        name: "Splendor",
        color: "#b8a342",
        cards: {}
    } as Domain,
    valor: {
        name: "Valor",
        color: "#e2680e",
        cards: {}
    } as Domain
} as const

export const TRAITS = {
    agility: {
        name: "Agility",
        examples: ["Sprint", "Leap", "Maneuver"]
    },
    strength: {
        name: "Strength",
        examples: ["Lift", "Smash", "Grapple"]
    },
    finesse: {
        name: "Finesse",
        examples: ["Control", "Hide", "Tinker"]
    },
    instinct: {
        name: "Instinct",
        examples: ["Perceive", "Sense", "Navigate"]
    },
    presence: {
        name: "Presence",
        examples: ["Charm", "Perform", "Deceive"]
    },
    knowledge: {
        name: "Knowledge",
        examples: ["Recall", "Analyze", "Comprehend"]
    }
} as const

export const CLASSES = {
    assassin: {
        name: "Assassin",
        hope_feature: {
            title: "Grim Resolve",
            description_html: "<b>Spend 3 Hope</b> to clear 2 Stress.",
        },
        primary_domain: "blade",
        secondary_domain: "midnight",
        features: [
            {
                title: "Marked for Death",
                description_html: `<p>On a successful weapon attack, you can <b>mark a Stress</b> to make the target 
              <i>Marked for Death</i>. Attacks you make against a target that's <i>Marked for 
              Death</i> gain a bonus to damage equal to <b>+1d4</b> per tier.</p>
          
              <p>You can only have one adversary <i>Marked for Death</i> at a time, and can't transfer or 
              remove the condition except by defeating the target. The GM can spend a number of Fear equal 
              to your Proficiency to remove the <i>Marked for Death</i> condition. Otherwise, it ends
              automatically when you take a rest.</p>`,
            },
            {
                title: "Get In & Get Out",
                description_html: `<p><b>Spend a Hope</b> to ask the GM for either a quick or inconspicuous way 
              into or out of a building or structure you can see. The next roll you make that capitalizes 
              on this information has advantage.</p>`,
            },
        ],
        subclasses: {
            executioners_guild: {
                name: "Executioners Guild",
                foundation_card: {
                    image_url:
                        "",
                    full_card_image_url:
                        "/assets/cards/subclasses/executioners-guild-foundation.png",
                    title: "Executioners Guild",
                    description_html: "Foundation",
                    spellcast_trait: "agility",
                    features: [
                        {
                            title: "First Strike",
                            description_html:
                                "<p>The first time in a scene you succeed on an attack roll, double the damage of the attack.</p>",
                        },
                        {
                            title: "Ambush",
                            description_html: '<p>Your "Marked for Death" feature uses <b>d6s</b> instead of <b>d4s</b>.</p>',
                        },
                    ],
                },
                specialization_card: {
                    image_url:
                        "",
                    full_card_image_url:
                        "",
                    title: "Executioners Guild",
                    description_html: "Specialization",
                    features: [
                        {
                            title: "Death Strike",
                            description_html:
                                "<p>When you deal Severe damage to a creature, you can <b>mark a stress</b> to make them mark an additional Hit Point.</p>",
                        },
                        {
                            title: "Scorpion's Poise",
                            description_html: "<p>You gain a <b>+2</b> bonus to your Evasion against any attacks made by a creature <i>Marked for Death</i>.</p>"
                        }
                    ],
                },
                mastery_card: {
                    image_url:
                        "",
                    full_card_image_url:
                        "",
                    title: "Executioners Guild",
                    description_html: "Mastery",
                    features: [
                        {
                            title: "True Strike",
                            description_html: "<p>Once per long rest, when you fail an attack roll, you can <b>spend a hope</b> to make it a success instead.</p>",
                        },
                        {
                            title: "Backstab",
                            description_html: '<p>Your "Marked for Death" feature uses <b>d8s</b> instead of <b>d6s</b>.</p>'
                        }
                    ],
                },
            }
        }
    } as Class & { subclasses: Record<string, Subclass> }
} as const

export const TRANSFORMATION_CARDS = {
    werewolf: {
        image_url:
            "",
        full_card_image_url:
            "/assets/cards/transformations/werewolf.png",
        title: "Werewolf",
        description_html: "<p>Werewolves are creatures who transform into supernatural wolves.</p>",
        features: [
            {
                title: "Wolf Form",
                description_html:
                    "<p>When you mark one or more Hit Points, you can also <b>mark a stress</b> to enter your Wolf Form. While in this form, gain a <b>d10</b> Wolf Die that you add to all attack and damage rolls. When you would gain a Hope while in Wolf Form, you mark a Stress instead.</p>",
            },
            {
                title: "Frenzy",
                description_html:
                    "<p>When you mark your last Stress while in Wolf Form, you go into a Frenzy. Roll a number of <b>d20s</b> equal to your tier and automatically deal that much physical damage to all creatures within Very Close Range. Then drop out of Wolf Form.</p>",
            },
        ],
    } as Card<"transformation">
} as const

export const ANCESTRY_CARDS = {
    half_clank: {
        image_url:
            "",
        full_card_image_url:
            "/assets/cards/ancestries/half-clank.png",
        title: "Half-Clank",
        description_html: "<p>Half sentient mechanical being, half human.</p>",
        top_feature: {
            title: "High Stamina",
            description_html: "<p>Gain an additional Stress slot at character creation.</p>",
        },
        bottom_feature: {
            title: "Efficient",
            description_html:
                "<p>When you take a short rest, you can choose a long rest move instead of a short rest move.</p>",
        },
    } as Card<"ancestry">
} as const

export const COMMUNITY_CARDS = {
    warborne: {
        image_url:
            "",
        full_card_image_url:
            "/assets/cards/communities/warborne.png",
        title: "Warborne",
        description_html:
            "<p>Being part of a warborne community means you come from a place that is, or was, ravaged by war.</p>",
        features: [
            {
                title: "Brave Face",
                description_html:
                    "<p>Once per session, when an attack would cause you to <b>mark a stress</b>, you can <b>spend a hope</b> instead.</p>",
            },
        ],
    } as Card<"community">,

} as const

export const MAX_HOPE = 6
export const MAX_DOMAIN_CARD_LOADOUT = 5

export const JUST_JAMES: Character = {
    uid: "forewit-justjames",
    name: "Just-James",
    image:
        "https://pub-cdae2c597d234591b04eed47a98f233c.r2.dev/v1/card-header-images/domains/blade/whirlwind.webp",
    level: 1,
    proficiency: 1,
    evasion: 12,
    damage_thresholds: {
        major: 9,
        severe: 19,
    },
    armor: {
        max: 4,
        marked: 0,
    },
    hp: {
        max: 6,
        marked: 0,
    },
    stress: {
        max: 7,
        marked: 0,
    },
    hope: {
        max: MAX_HOPE,
        marked: 0,
    },
    traits: {
        agility: 2,
        strength: -1,
        finesse: 1,
        instinct: 0,
        presence: 0,
        knowledge: 1,
    },
    heritage: {
        ancestry_card: ANCESTRY_CARDS.half_clank,
        community_card: COMMUNITY_CARDS.warborne,
    },
    transformation_card: TRANSFORMATION_CARDS.werewolf,
    class: CLASSES.assassin,
    subclass: CLASSES.assassin.subclasses.executioners_guild,
    domain_card_loadout: [DOMAINS.blade.cards.whirlwind, DOMAINS.blade.cards.not_good_enough],
    domain_card_vault: [],
    settings: {
        void_enabled: true,
    },
    experiences: [{
        title: "Cool Under Pressure",
        description: "As pressure mounts, your focus tightens and you perform at your best.",
        modifier: 2,
    }, {
        title: "",
        description: "",
        modifier: 2,
    }],
}

const NEW_CHARACTER: Character = {
    uid: "new-character",
    name: "New Character",
    image:
        "https://pub-cdae2c597d234591b04eed47a98f233c.r2.dev/v1/card-header-images/domains/blade/whirlwind.webp",
    level: 1,
    proficiency: 1,
    evasion: 10,
    damage_thresholds: {
        major: 6,
        severe: 13,
    },
    armor: {
        max: 3,
        marked: 0,
    },
    hp: {
        max: 6,
        marked: 0,
    },
    stress: {
        max: 7,
        marked: 0,
    },
    hope: {
        max: MAX_HOPE,
        marked: 0,
    },
    traits: {
        agility: 0,
        strength: 0,
        finesse: 0,
        instinct: 0,
        presence: 0,
        knowledge: 0,
    },
    heritage: {
        ancestry_card: null,
        community_card: null,
    },
    transformation_card: null,
    class: null,
    subclass: null,
    domain_card_loadout: [],
    domain_card_vault: [],
    settings: {
        void_enabled: false,
    },
    experiences: [{
        title: "",
        description: "",
        modifier: 2,
    }, {
        title: "",
        description: "",
        modifier: 2,
    }],
}