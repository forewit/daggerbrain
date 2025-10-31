import type { Card } from "../types";

export const BONE_DOMAIN_CARDS = {
    untouchable: {
        card_type: "domain",
        domain_name: "bone",
        artist_name: "Henry Peters",
        image_url: "/images/card/art/domains/bone/untouchable.webp",
        type: "ability",
        title: "Untouchable",
        description_html: "",
        level_requirement: 1,
        recall_cost: 1,
        features: [
            {
                title: "",
                description_html: "Gain a bonus to your Evasion equal to half your Agility.",
                modifier_ids: ["bone_untouchable"]
            }
        ],

    }
} as const satisfies Record<string, Card<"domain">>

export const VALOR_DOMAIN_CARDS = {
    bare_bones: {
        card_type: "domain",
        domain_name: "valor",
        artist_name: "Simon Pape",
        image_url: "/images/card/art/domains/valor/bare-bones.webp",
        type: "ability",
        title: "Bare Bones",
        description_html: "",
        level_requirement: 1,
        recall_cost: 0,
        features: [
            {
                title: "",
                description_html: `<p>When you choose not to equip armor, you have a base Armor Score of 3 + your Strength and use the following as your base damage thresholds:</p>
                                    <ul class="list-disc list-inside ml-2">
                                        <li><b><em>Tier 1:</em></b> 9/19</li>
                                        <li><b><em>Tier 2:</em></b> 11/24</li>
                                        <li><b><em>Tier 3:</em></b> 13/31</li>
                                        <li><b><em>Tier 4:</em></b> 15/38</li>
                                    </ul>`,
                modifier_ids: [
                    "valor_bare_bones_tier_1_armor",
                    "valor_bare_bones_tier_1_armor_bonus",
                    "valor_bare_bones_tier_1_major",
                    "valor_bare_bones_tier_1_severe",
                    "valor_bare_bones_tier_2_armor",
                    "valor_bare_bones_tier_2_armor_bonus",
                    "valor_bare_bones_tier_2_major",
                    "valor_bare_bones_tier_2_severe",
                    "valor_bare_bones_tier_3_armor",
                    "valor_bare_bones_tier_3_armor_bonus",
                    "valor_bare_bones_tier_3_major",
                    "valor_bare_bones_tier_3_severe",
                    "valor_bare_bones_tier_4_armor",
                    "valor_bare_bones_tier_4_armor_bonus",
                    "valor_bare_bones_tier_4_major",
                    "valor_bare_bones_tier_4_severe"
                ]
            }
        ],

    }
} as const satisfies Record<string, Card<"domain">>

export const BLADE_DOMAIN_CARDS = {
    whirlwind: {
        card_type: "domain",
        domain_name: "blade",
        artist_name: "Mike Pape",
        image_url: "/images/card/art/domains/blade/whirlwind.webp",
        type: "ability",
        title: "Whrilwind",
        description_html: "",
        level_requirement: 1,
        recall_cost: 0,
        features: [
            {
                title: "",
                description_html: "<p>When you make a successful attack agains a target within Very Close range, you can <b>spend a Hope</b> to use the attack against all other targets within Very Close range.</p>",
                modifier_ids: []
            }
        ],
    },
    not_good_enough: {
        card_type: "domain",
        domain_name: "blade",
        artist_name: "Juan S. Almencion",
        image_url: "/images/card/art/domains/blade/not-good-enough.webp",
        type: "ability",
        title: "Not Good Enough",
        description_html: "",
        level_requirement: 1,
        recall_cost: 1,
        features: [
            {
                title: "",
                description_html: "<p>When you roll your damage dice, you can reroll any 1s or 2s.</p>",
                modifier_ids: []
            }
        ],
    },
    a_soldiers_bond: {
        card_type: "domain",
        domain_name: "blade",
        artist_name: "Mila Pesic",
        image_url: "/images/card/art/domains/blade/a-soldiers-bond.webp",
        type: "ability",
        title: "A Soldier's Bond",
        description_html: "",
        level_requirement: 2,
        recall_cost: 1,
        features: [
            {
                title: "",
                description_html: "Once per long rest, when you compliment someone or ask them about something they're good at, you can both gain 3 Hope.",
                modifier_ids: []
            }
        ],
    }
} as const satisfies Record<string, Card<"domain">>

export const TRANSFORMATION_CARDS = {
    werewolf: {
        card_type: "transformation",
        artist_name: "",
        image_url: "/images/wip.avif",
        title: "Werewolf",
        description_html: "Werewolves are creatures who transform into supernatural wolves.",
        features: [
            {
                title: "Wolf Form",
                description_html:
                    "When you mark one or more Hit Points, you can also <b>mark a stress</b> to enter your Wolf Form. While in this form, gain a <b>d10</b> Wolf Die that you add to all attack and damage rolls. When you would gain a Hope while in Wolf Form, you mark a Stress instead.",
                modifier_ids: []
            },
            {
                title: "Frenzy",
                description_html:
                    "When you mark your last Stress while in Wolf Form, you go into a Frenzy. Roll a number of <b>d20s</b> equal to your tier and automatically deal that much physical damage to all creatures within Very Close Range. Then drop out of Wolf Form.",
                modifier_ids: []
            },
        ],
    }
} as const satisfies Record<string, Card<"transformation">>

export const ANCESTRY_CARDS = {
    half_clank: {
        card_type: "ancestry",
        image_url: "/images/card/art/ancestries/clank.webp",
        title: "Half-Clank",
        description_html: "Half sentient mechanical being, half human.",
        artist_name: "Mat Wilma",
        features: [{
            title: "High Stamina",
            description_html: "Gain an additional Stress slot at character creation.",
            modifier_ids: ["max_stress_plus_1"]
        },
        {
            title: "Efficient",
            description_html:
                "When you take a short rest, you can choose a long rest move instead of a short rest move.",
            modifier_ids: []
        }],
    },
    drakona: {
        card_type: "ancestry",
        image_url: "/images/card/art/ancestries/drakona.webp",
        title: "Drakona",
        description_html: "Drakona resemble wingless dragons in humanoid form and possess a powerful elemental breath.",
        artist_name: "Mat Wilma",
        features: [{
            title: "Scales",
            description_html: "Your scales act as natural protection. When you would take Severe damage, you can <b>mark a Stress</b> to mark 1 fewer Hit Points.",
            modifier_ids: []
        },
        {
            title: "Elemental Breath",
            description_html: "Choose an element for your breath (such as electricity, fire, or ice). You can use this breath against a target or group of targets within Very Close range, treating it as an Instinct weapon that deals <b>d8</b> magic damage using your Proficiency.",
            modifier_ids: []
        }],
    },
} as const satisfies Record<string, Card<"ancestry">>

export const COMMUNITY_CARDS = {
    warborne: {
        card_type: "community",
        artist_name: "",
        image_url: "/images/wip.avif",
        title: "Warborne",
        description_html:
            "Being part of a warborne community means you come from a place that is, or was, ravaged by war.",
        features: [
            {
                title: "Brave Face",
                description_html:
                    "Once per session, when an attack would cause you to <b>mark a stress</b>, you can <b>spend a hope</b> instead.",
                modifier_ids: []
            },
        ],
    }
} as const satisfies Record<string, Card<"community">>

export const SUBCLASS_CARDS = {
    executioners_guild_foundation: {
        card_type: "subclass_foundation",
        artist_name: "",
        image_url: "/images/wip.avif",
        title: "Executioners Guild",
        description_html: "Foundation",
        spellcast_trait: "agility",
        class_name: "assassin",
        features: [
            {
                title: "First Strike",
                description_html: "The first time in a scene you succeed on an attack roll, double the damage of the attack.",
                modifier_ids: []
            },
            {
                title: "Ambush",
                description_html: 'Your "Marked for Death" feature uses <b>d6s</b> instead of <b>d4s</b>.',
                modifier_ids: []
            },
        ],
    } satisfies Card<"subclass_foundation">,
    executioners_guild_specialization: {
        card_type: "subclass_specialization",
        artist_name: "",
        image_url: "/images/wip.avif",
        title: "Executioners Guild",
        description_html: "Specialization",
        class_name: "assassin",
        features: [
            {
                title: "Death Strike",
                description_html: "When you deal Severe damage to a creature, you can <b>mark a stress</b> to make them mark an additional Hit Point.",
                modifier_ids: []
            },
            {
                title: "Scorpion's Poise",
                description_html: "You gain a <b>+2</b> bonus to your Evasion against any attacks made by a creature <i>Marked for Death</i>.",
                modifier_ids: []
            }
        ],
    } satisfies Card<"subclass_specialization">,
    executioners_guild_mastery: {
        card_type: "subclass_mastery",
        artist_name: "",
        image_url: "/images/wip.avif",
        title: "Executioners Guild",
        description_html: "Mastery",
        class_name: "assassin",
        features: [
            {
                title: "True Strike",
                description_html: "Once per long rest, when you fail an attack roll, you can <b>spend a hope</b> to make it a success instead.",
                modifier_ids: []
            },
            {
                title: "Backstab",
                description_html: 'Your "Marked for Death" feature uses <b>d8s</b> instead of <b>d6s</b>.',
                modifier_ids: []
            }
        ],
    } satisfies Card<"subclass_mastery">,
} as const satisfies Record<string, Card<"subclass_foundation" | "subclass_specialization" | "subclass_mastery">>
