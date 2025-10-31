import { ANCESTRY_CARDS, BLADE_DOMAIN_CARDS, BONE_DOMAIN_CARDS, COMMUNITY_CARDS, SUBCLASS_CARDS, TRANSFORMATION_CARDS, VALOR_DOMAIN_CARDS } from "./cards";
import { BLANK_LEVEL_UP_CHOICE, BLANK_LEVEL_UP_OPTION, TIER_1_BASE_OPTIONS } from "./rules";
import type { Domain, Class, Subclass, Card, Character } from "../types";
import { TIER_1_ARMOR, TIER_1_WEAPONS } from "./equipment";


export const DOMAINS = {
    arcana: {
        name: "Arcana",
        description_html: "",
        color: "#4e345b",
        foreground_color: "#ffffff",
        cards: {}
    },
    blade: {
        name: "Blade",
        foreground_color: "#ffffff",
        description_html: `<p>Blade is the domain of <b>weapon mastery</b>. Whether by steel,
            bow, or perhaps a more specialized arm, those who follow this
            path have the skill to cut short the lives of others. Wielders of
            Blade dedicate themselves to achieving inexorable power over
            death. The Blade domain can be accessed by the <b>Guardian</b>
            and <b>Warrior</b> classes.</p>`,
        color: "#af231c",
        cards: BLADE_DOMAIN_CARDS
    },
    bone: {
        name: "Bone",
        color: "#a4a9a8",
        foreground_color: "#000000",
        description_html: `<p>Bone is the domain of <b>tactics and the body</b>. Practitioners
            of this domain have an uncanny control over their own
            physical abilities and an eye for predicting the behaviors of
            others in combat. Adherents to Bone gain an unparalleled
            understanding of bodies and their movements. The Bone
            domain can be accessed by the <b>Ranger</b> & <b>Warrior</b> classes.</p>`,
        cards: BONE_DOMAIN_CARDS,
    },
    codex: {
        name: "Codex",
        description_html: "",
        color: "#24395d",
        foreground_color: "#ffffff",
        cards: {}
    },
    grace: {
        name: "Grace",
        description_html: "",
        color: "#8d3965",
        foreground_color: "#ffffff",
        cards: {}
    },
    midnight: {
        name: "Midnight",
        description_html: `<p>Midnight is the domain of <b>shadows and secrecy</b>. Whether
            by clever tricks, deft magic, or the cloak of night, those who
            channel these forces practice the art of obscurity and can
            uncover sequestered treasures. Midnight offers practitioners
            the power to control and create enigmas. The Midnight
            domain can be accessed by the <b>Rogue</b> and <b>Sorcerer</b> classes.</p>`,
        color: "#1e201f",
        foreground_color: "#ffffff",
        cards: {}
    },
    sage: {
        name: "Sage",
        description_html: "",
        color: "#244e30",
        foreground_color: "#ffffff",
        cards: {}
    },
    splendor: {
        name: "Splendor",
        description_html: "",
        color: "#b8a342",
        foreground_color: "#000000",
        cards: {}
    },
    valor: {
        name: "Valor",
        description_html: `<p>Valor is the domain of <b>protection</b>. Whether through attack or
            defense, those who choose this discipline channel formidable
            strength to protect their allies in battle. Valor offers great
            power to those who raise their shields in defense of others.
            The Valor domain can be accessed by the <b>Guardian</b> and
            <b>Seraph</b> classes.</p>`,
        color: "#e2680e",
        foreground_color: "#ffffff",
        cards: VALOR_DOMAIN_CARDS
    }
} as const satisfies Record<string, Domain>

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
        source: "The Void 1.5",
        starting_evasion: 12,
        starting_max_hp: 5,
        suggested_traits: {
            agility: 2,
            strength: -1,
            finesse: 1,
            instinct: 0,
            presence: 0,
            knowledge: 1,
        },

        name: "Assassin",
        image_url: "/images/wip.avif",
        description_html: "As an assassin, you utilize unmatched stealth and precision to ambush the unwary.",
        hope_feature: {
            title: "Grim Resolve",
            description_html: "<p><b>Spend 3 Hope</b> to clear 2 Stress.</p>",
            modifier_ids: []
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
                modifier_ids: []
            },
            {
                title: "Get In & Get Out",
                description_html: `<p><b>Spend a Hope</b> to ask the GM for either a quick or inconspicuous way 
              into or out of a building or structure you can see. The next roll you make that capitalizes 
              on this information has advantage.</p>`,
                modifier_ids: []
            },
        ],
        subclasses: {
            executioners_guild: {
                name: "Executioners Guild",
                description_html: "<p>Skilled in the art of assassination, the Executioners Guild is known for their precision and efficiency.</p>",
                foundation_card: SUBCLASS_CARDS.executioners_guild_foundation,
                specialization_card: SUBCLASS_CARDS.executioners_guild_specialization,
                mastery_card: SUBCLASS_CARDS.executioners_guild_mastery,
            }
        },
    }
} as const satisfies Record<string, Class>

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
        experience_modifier: 2,
        max_experiences: 2,
        max_domain_card_loadout: 5,
        max_hope: 6,
        max_armor: 0,
        max_hp: 0,
        max_stress: 6,
        evasion: 0,
        primary_class_mastery_level: 0,
        secondary_class_mastery_level: 0,
    },

    // heritage
    ancestry_card: ANCESTRY_CARDS.half_clank,
    community_card: COMMUNITY_CARDS.warborne,
    experiences: ["Cool under pressure", "Astronomer in the making", "Paranoid"],

    // classes
    primary_class: CLASSES.assassin,
    primary_subclass: CLASSES.assassin.subclasses.executioners_guild,
    secondary_class: null,
    secondary_subclass: null,

    // equipment
    active_armor: null,
    active_weapons: [],

    // the void / other
    transformation_card: TRANSFORMATION_CARDS.werewolf,
    additional_cards: [
        DOMAINS.valor.cards.bare_bones,
        DOMAINS.bone.cards.untouchable
    ],
    additional_modifier_ids: [],

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
    level_up_domain_cards: {
        1: { A: DOMAINS.blade.cards.whirlwind, B: DOMAINS.blade.cards.not_good_enough },
        2: { A: DOMAINS.blade.cards.a_soldiers_bond },
        3: { A: null },
        4: { A: null },
        5: { A: null },
        6: { A: null },
        7: { A: null },
        8: { A: null },
        9: { A: null },
        10: { A: null },
    },
    level_up_choices: {
        2: {
            A: {
                option_id: "tier_2_traits",
                marked_traits: { A: "agility", B: "strength" },
                selected_experiences: { A: null, B: null },
                selected_domain_card: null,
            }, B: {
                option_id: "tier_2_evasion",
                marked_traits: { A: null, B: null },
                selected_experiences: { A: null, B: null },
                selected_domain_card: null,
            }
        },
        3: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
        4: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
        5: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
        6: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
        7: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
        8: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
        9: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
        10: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
    },

    // will be overwritten and calculated
    derived_domain_card_vault: [
        DOMAINS.blade.cards.whirlwind,
        DOMAINS.blade.cards.not_good_enough,
        DOMAINS.blade.cards.a_soldiers_bond,
    ],
    derived_stats: {
        // from base stats
        traits: {
            agility: 3,
            strength: 2,
            finesse: 1,
            instinct: 0,
            presence: 0,
            knowledge: -1,
        },
        proficiency: 2,
        experience_modifiers: [2, 2, 2],
        max_experiences: 3,
        max_domain_card_loadout: 5,
        max_hope: 6,
        max_armor: 5,
        max_hp: 5,
        max_stress: 7,
        evasion: 15,
        damage_thresholds: {
            major: 12,
            severe: 25,
        },
        primary_class_mastery_level: 1,
        secondary_class_mastery_level: 0,
        spellcast_trait: "agility",
    },
}

export const NEW_CHARACTER: Character = {
    settings: {
        void_enabled: false,
    },
    uid: "new-character",
    name: "New Character",
    image: "/images/portrait-placeholder.png",
    base_stats: {
        traits: {
            agility: null,
            strength: null,
            finesse: null,
            instinct: null,
            presence: null,
            knowledge: null,
        },
        proficiency: 1,
        experience_modifier: 2,
        max_experiences: 2,
        max_domain_card_loadout: 5,
        max_hope: 6,
        max_armor: 0,
        max_hp: 0,
        max_stress: 6,
        evasion: 0,
        primary_class_mastery_level: 0,
        secondary_class_mastery_level: 0,
    },

    // heritage
    ancestry_card: null,
    community_card: null,
    experiences: ["", ""],

    // classes
    primary_class: null,
    primary_subclass: null,
    secondary_class: null,
    secondary_subclass: null,

    // equipment
    active_armor: TIER_1_ARMOR.leather_armor,
    active_weapons: [TIER_1_WEAPONS.longsword],

    // the void / other
    transformation_card: null,
    additional_cards: [],
    additional_modifier_ids: [],

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
    level_up_domain_cards: {
        1: { A: null, B: null },
        2: { A: null },
        3: { A: null },
        4: { A: null },
        5: { A: null },
        6: { A: null },
        7: { A: null },
        8: { A: null },
        9: { A: null },
        10: { A: null },
    },
    level_up_choices: {
        2: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
        3: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
        4: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
        5: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
        6: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
        7: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
        8: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
        9: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
        10: { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE },
    },

    // will be overwritten and calculated
    derived_domain_card_vault: [],
    derived_stats: {
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
        experience_modifiers: [2, 2],
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
        spellcast_trait: null,
    },
}