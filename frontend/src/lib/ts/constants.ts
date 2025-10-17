import { ANCESTRY_CARDS, BLADE_DOMAIN_CARDS, COMMUNITY_CARDS, TRANSFORMATION_CARDS, VALOR_DOMAIN_CARDS } from "./cards";
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
        cards: BLADE_DOMAIN_CARDS
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
        cards: VALOR_DOMAIN_CARDS
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
                description_html: `<b>Spend a Hope</b> to ask the GM for either a quick or inconspicuous way 
              into or out of a building or structure you can see. The next roll you make that capitalizes 
              on this information has advantage.`,
            },
        ],
        subclasses: {
            executioners_guild: {
                name: "Executioners Guild",
                foundation_card: {
                    artist_name: "",
                    image_url:
                        "",
                    full_card_image_url:
                        "/images/full_cards/subclasses/assassin/executioners-guild-foundation.png",
                    title: "Executioners Guild",
                    description_html: "Foundation",
                    spellcast_trait: "agility",
                    features: [
                        {
                            title: "First Strike",
                            description_html: "The first time in a scene you succeed on an attack roll, double the damage of the attack.",
                        },
                        {
                            title: "Ambush",
                            description_html: 'Your "Marked for Death" feature uses <b>d6s</b> instead of <b>d4s</b>.',
                        },
                    ],
                },
                specialization_card: {
                    artist_name: "",
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
                    artist_name: "",
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

export const ANCESTRIES = {
    description_html: "Ancestries represent your character's lineage which affects their physical appearance and access to certain special abilities.",
    cards: ANCESTRY_CARDS,
} as const

export const COMMUNITIES = {
    description_html: "Communities represent a key aspect of the culture class or environment of origin that has had the most influence over your character's upbringing.",
    cards: COMMUNITY_CARDS,
} as const

export const TRANSFORMATIONS = {
    description_html: "Transformations represent changes or augmentations to characters in Daggerheart. These are optional aspects of a character's identity that may be given out by the GM during a campaign for narrative purposes. GMs may also present transformations as an option at character creation, at their discretion.",
    cards: TRANSFORMATION_CARDS,
} as const

export const MAX_HOPE = 6
export const MAX_DOMAIN_CARD_LOADOUT = 5

export const JUST_JAMES: Character = {
    uid: "forewit-justjames",
    name: "Just-James",
    image:
        "/images/portrait-placeholder.png",
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
    primary_class: {
        class: CLASSES.assassin,
        subclass: CLASSES.assassin.subclasses.executioners_guild,
        mastery_level: 1,
    },
    domain_card_loadout: [
        DOMAINS.blade.cards.whirlwind,
        DOMAINS.blade.cards.not_good_enough,
    ],
    domain_card_vault: [],
    custom_cards: [
        DOMAINS.valor.cards.bare_bones
    ],
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
    image: "/images/portrait-placeholder.png",
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
    primary_class: {
        class: null,
        subclass: null,
        mastery_level: 0,
    },
    domain_card_loadout: [],
    domain_card_vault: [],
    custom_cards: [],
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