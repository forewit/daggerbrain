import { ANCESTRY_CARDS, BLADE_DOMAIN_CARDS, BONE_DOMAIN_CARDS, COMMUNITY_CARDS, SUBCLASS_CARDS, TRANSFORMATION_CARDS, VALOR_DOMAIN_CARDS } from "./cards";
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
        cards: BONE_DOMAIN_CARDS,
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
        starting_evasion: 12,
        suggested_traits: {
            agility: 2,
            strength: -1,
            finesse: 1,
            instinct: 0,
            presence: 0,
            knowledge: 1,
        },

        name: "Assassin",
        hope_feature: {
            title: "Grim Resolve",
            description_html: "<b>Spend 3 Hope</b> to clear 2 Stress.",
        },
        primary_domain: "blade",
        secondary_domain: "midnight",
        class_features: [
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
                description_html: "",
                foundation_card: SUBCLASS_CARDS.executioners_guild_foundation,
                specialization_card: SUBCLASS_CARDS.executioners_guild_specialization,
                mastery_card: SUBCLASS_CARDS.executioners_guild_mastery,
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

export const JUST_JAMES: Character = {

    settings: {
        void_enabled: true,
    },
    uid: "forewit-justjames",
    name: "Just-James",
    image: "/images/portrait-placeholder.png",
    base_stats: {
        traits: {
            agility: 2,
            strength: 1,
            finesse: 1,
            instinct: 0,
            presence: 0,
            knowledge: -1,
        },
        proficiency: 1,
        max_experiences: 2,
        max_domain_card_loadout: 5,
        max_hope: 6,
        max_armor: 0,
        max_hp: 0,
        max_stress: 0,
        evasion: 0,
        damage_thresholds: {
            major: 0,
            severe: 0,
        },
        primary_class_mastery_level: 0,
        secondary_class_mastery_level: 0,
    },

    // heritage
    ancestry_card: ANCESTRY_CARDS.half_clank,
    community_card: COMMUNITY_CARDS.warborne,
    experiences: [{
        title: "Cool Under Pressure",
        modifier: 2,
    }],

    // classes
    primary_class: CLASSES.assassin,
    primary_subclass: CLASSES.assassin.subclasses.executioners_guild,
    secondary_class: null,
    secondary_subclass: null,

    // the void / other
    transformation_card: TRANSFORMATION_CARDS.werewolf,
    additional_cards: [
        DOMAINS.valor.cards.bare_bones,
        DOMAINS.bone.cards.untouchable
    ],
    additional_features: [],

    // set by the player
    ephemeral_stats: {
        marked_hp: 0,
        marked_stress: 0,
        marked_hope: 0,
        marked_armor: 0,
        domain_card_loadout: [0, 1, 2],
    },

    // level-up choices
    level: 2,
    level_1_choices: [],
    level_2_choices: [],
    level_3_choices: [],
    level_4_choices: [],
    level_5_choices: [],
    level_6_choices: [],
    level_7_choices: [],
    level_8_choices: [],
    level_9_choices: [],
    level_10_choices: [],

    // will be overwritten and calculated
    derived_features: [],
    derieved_stats: {
        // from base stats
        traits: {
            agility: 3,
            strength: 2,
            finesse: 1,
            instinct: 0,
            presence: -1,
            knowledge: 1,
        },
        proficiency: 2,
        max_experiences: 3,
        max_domain_card_loadout: 5,
        max_hope: 6,
        max_armor: 5,
        max_hp: 5,
        max_stress: 7,
        evasion: 15,
        damage_thresholds: {
            major: 10,
            severe: 20,
        },
        primary_class_mastery_level: 1,
        secondary_class_mastery_level: 0,

        // other
        domain_card_vault: [
            DOMAINS.blade.cards.whirlwind,
            DOMAINS.blade.cards.not_good_enough,
            DOMAINS.blade.cards.a_soldiers_bond,
        ],
        spellcast_trait: "agility",
    },
}

const NEW_CHARACTER: Character = {
    settings: {
        void_enabled: false,
    },
    uid: "new-character",
    name: "New Character",
    image: "/images/portrait-placeholder.png",
    base_stats: {
        traits: {
            agility: 0,
            strength: 0,
            finesse: 0,
            instinct: 0,
            presence: 0,
            knowledge: 0,
        },
        proficiency: 1,
        max_experiences: 2,
        max_domain_card_loadout: 5,
        max_hope: 6,
        max_armor: 0,
        max_hp: 0,
        max_stress: 0,
        evasion: 0,
        damage_thresholds: {
            major: 0,
            severe: 0,
        },
        primary_class_mastery_level: 0,
        secondary_class_mastery_level: 0,
    },

    // heritage
    ancestry_card: null,
    community_card: null,
    experiences: [],    

    // classes
    primary_class: null,
    primary_subclass: null,
    secondary_class: null,
    secondary_subclass: null,

    // the void / other
    transformation_card: null,
    additional_cards: [],
    additional_features: [],

    // set by the player
    ephemeral_stats: {
        marked_hp: 0,
        marked_stress: 0,
        marked_hope: 0,
        marked_armor: 0,
        domain_card_loadout: [],
    },

    // level-up choices
    level: 1,
    level_1_choices: [],
    level_2_choices: [],
    level_3_choices: [],
    level_4_choices: [],
    level_5_choices: [],
    level_6_choices: [],
    level_7_choices: [],
    level_8_choices: [],
    level_9_choices: [],
    level_10_choices: [],


    // will be overwritten and calculated
    derived_features: [],
    derieved_stats: {
        // from base stats
        traits: {
            agility: 0,
            strength: 0,
            finesse: 0,
            instinct: 0,
            presence: 0,
            knowledge: 0,
        },
        proficiency: 1,
        max_experiences: 2,
        max_domain_card_loadout: 5,
        max_hope: 6,
        max_armor: 0,
        max_hp: 0,
        max_stress: 0,
        evasion: 0,
        damage_thresholds: {
            major: 0,
            severe: 0,
        },
        primary_class_mastery_level: 0,
        secondary_class_mastery_level: 0,

        // other stats
        domain_card_vault: [],
        spellcast_trait: null,
    },
}