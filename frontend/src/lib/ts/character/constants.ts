import type { Domain, Class, Subclass, Card, Character, DomainIds, LevelUpChoice } from "./types";

// todo: include source titles and descriptions
export const SOURCES = {
    core: {
        short_title: "Core",
    },
    void_1_5: {
        short_title: "Void 1.5",
    }
}

export const BLANK_LEVEL_UP_CHOICE = {
    option_id: null,
    marked_traits: { A: null, B: null },
    selected_experiences: { A: null, B: null },
    selected_domain_card_id: null,
    selected_subclass_upgrade: null,
} as const satisfies LevelUpChoice

export const JUST_JAMES: Character = {

    settings: {
        void_enabled: true,
    },
    uid: "forewit-justjames",
    name: "Just-James",
    image: "/images/portrait-placeholder.png",

    selected_traits: {
        agility: 2,
        strength: 1,
        finesse: 1,
        instinct: 0,
        presence: 0,
        knowledge: -1,
    },

    derived_descriptors: {
        ancestry_name: "Half-Clank",
        primary_class_name: "Assassin",
        primary_subclass_name: "Executioners Guild",
        secondary_class_name: "",
        secondary_subclass_name: "",
    },

    // heritage
    ancestry_card_id: "half_clank",
    community_card_id: "warborne",
    experiences: ["Cool under pressure", "Astronomer in the making", "Paranoid"],

    // classes
    primary_class_id: "assassin",
    primary_subclass_id: "executioners_guild",
    secondary_class_id: null,
    secondary_subclass_id: null,
    secondary_class_domain_id_choice: null,

    

    // equipment
    active_armor_id: null,
    active_weapon_ids: [],

    // the void / other
    transformation_card_id: "werewolf",
    additional_domain_card_ids: [
        "bare_bones",
        "untouchable"
    ],
    additional_modifiers: [],

    // set by the player
    ephemeral_stats: {
        marked_hp: 0,
        marked_stress: 0,
        marked_hope: 0,
        marked_armor: 0,
        domain_card_loadout: [0, 1, 2],
    },

    // choices made by the player in regards to their domain cards
    domain_card_choices: {},

    // level-up choices
    level: 5,
    level_up_domain_card_ids: {
        1: { A: "whirlwind", B: "not_good_enough" },
        2: { A: "a_soldiers_bond" },
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
                selected_domain_card_id: null,
                selected_subclass_upgrade: null,
            }, B: {
                option_id: "tier_2_evasion",
                marked_traits: { A: null, B: null },
                selected_experiences: { A: null, B: null },
                selected_domain_card_id: null,
                selected_subclass_upgrade: null,
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
}

export const NEW_CHARACTER: Character = {
    settings: {
        void_enabled: false,
    },
    uid: "new-character",
    name: "New Character",
    image: "/images/portrait-placeholder.png",

    selected_traits: {
        agility: null,
        strength: null,
        finesse: null,
        instinct: null,
        presence: null,
        knowledge: null,
    },

    derived_descriptors: {
        ancestry_name: "",
        primary_class_name: "",
        primary_subclass_name: "",
        secondary_class_name: "",
        secondary_subclass_name: "",
    },

    // heritage
    ancestry_card_id: null,
    community_card_id: null,
    experiences: ["", ""],

    // classes
    primary_class_id: null,
    primary_subclass_id: null,
    secondary_class_id: null,
    secondary_subclass_id: null,
    secondary_class_domain_id_choice: null,

    // choices made by the player in regards to their cards
    domain_card_choices: {},

    // equipment
    active_armor_id: null,
    active_weapon_ids: [],

    // the void / other
    transformation_card_id: null,
    additional_domain_card_ids: [],
    additional_modifiers: [],

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
    level_up_domain_card_ids: {
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

}