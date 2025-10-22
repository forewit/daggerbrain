import type { Card } from "./types";

export const BONE_DOMAIN_CARDS = {
    untouchable: {
        domain_name: "bone",
        artist_name: "Henry Peters",
        image_url: "/images/card/art/domains/bone/untouchable.webp",
        type: "ability",
        full_card_image_url: "/images/full_cards/domains/bone/untouchable.png",
        title: "Untouchable",
        description_html: "",
        level_requirement: 1,
        recall_cost: 1,
        features: [
            {
                title: "",
                description_html: "Gain a bonus to your Evasion equal to half your Agility.",
            }
        ],
        effect_ids: []
    }
} as const satisfies Record<string, Card<"domain">>

export const VALOR_DOMAIN_CARDS = {
    bare_bones: {
        domain_name: "valor",
        artist_name: "Simon Pape",
        image_url: "/images/card/art/domains/valor/bare-bones.webp",
        type: "ability",
        full_card_image_url: "/images/full_cards/domains/valor/bare-bones.png",
        title: "Bare Bones",
        description_html: "",
        level_requirement: 1,
        recall_cost: 0,
        features: [
            {
                title: "",
                description_html: `<p>When you choose not to equip armor, you have a base Armor Score of 3 + your Strength and use the following as your base damage thresholds:</p>
                                    <ul>
                                        <li><b><em>Tier 1:</em></b> 9/19</li>
                                        <li><b><em>Tier 2:</em></b> 11/24</li>
                                        <li><b><em>Tier 3:</em></b> 13/31</li>
                                        <li><b><em>Tier 4:</em></b> 15/38</li>
                                    </ul>`,
            }
        ],
        effect_ids: []
    }
} as const satisfies Record<string, Card<"domain">>

export const BLADE_DOMAIN_CARDS = {
    whirlwind: {
        domain_name: "blade",
        artist_name: "",
        image_url: "",
        type: "ability",
        full_card_image_url: "/images/full_cards/domains/blade/whirlwind.png",
        title: "Whrilwind",
        description_html: "",
        level_requirement: 1,
        recall_cost: 0,
        features: [
            {
                title: "",
                description_html: "When you make a successful attack agains a target within Very Close range, you can <b>spend a Hope</b> to use the attack against all other targets within Very Close range.",
            }
        ],
        effect_ids: []
    },
    not_good_enough: {
        domain_name: "blade",
        artist_name: "",
        image_url: "",
        type: "ability",
        full_card_image_url: "/images/full_cards/domains/blade/not-good-enough.png",
        title: "Not Good Enough",
        description_html: "",
        level_requirement: 1,
        recall_cost: 1,
        features: [
            {
                title: "",
                description_html: "When you roll your damage dice, you can reroll any 1s or 2s.",
            }
        ],
        effect_ids: []
    },
    a_soldiers_bond: {
        domain_name: "blade",
        artist_name: "Mila Pesic",
        image_url: "/images/card/art/domains/blade/a-soldiers-bond.webp",
        type: "ability",
        full_card_image_url: "/images/full_cards/domains/blade/a-soldiers-bond.png",
        title: "A Soldier's Bond",
        description_html: "",
        level_requirement: 2,
        recall_cost: 1,
        features: [
            {
                title: "",
                description_html: "Once per long rest, when you compliment someone or ask them about something they're good at, you can both gain 3 Hope.",
            }
        ],
        effect_ids: []
    }
} as const satisfies Record<string, Card<"domain">>

export const TRANSFORMATION_CARDS = {
    werewolf: {
        artist_name: "",
        image_url:
            "/images/wip.avif",
        full_card_image_url:
            "/images/full_cards/transformations/werewolf.png",
        title: "Werewolf",
        description_html: "Werewolves are creatures who transform into supernatural wolves.",
        features: [
            {
                title: "Wolf Form",
                description_html:
                    "When you mark one or more Hit Points, you can also <b>mark a stress</b> to enter your Wolf Form. While in this form, gain a <b>d10</b> Wolf Die that you add to all attack and damage rolls. When you would gain a Hope while in Wolf Form, you mark a Stress instead.",
            },
            {
                title: "Frenzy",
                description_html:
                    "When you mark your last Stress while in Wolf Form, you go into a Frenzy. Roll a number of <b>d20s</b> equal to your tier and automatically deal that much physical damage to all creatures within Very Close Range. Then drop out of Wolf Form.",
            },
        ],
        effect_ids: []
    }
} as const satisfies Record<string, Card<"transformation">>

export const ANCESTRY_CARDS = {
    half_clank: {
        image_url:
            "/images/card/art/ancestries/clank.webp",
        full_card_image_url:
            "/images/full_cards/ancestries/half-clank.png",
        title: "Half-Clank",
        description_html: "Half sentient mechanical being, half human.",
        artist_name: "Mat Wilma",
        features: [{
            title: "High Stamina",
            description_html: "Gain an additional Stress slot at character creation.",
        },
        {
            title: "Efficient",
            description_html:
                "When you take a short rest, you can choose a long rest move instead of a short rest move.",
        }],
        effect_ids: []
    },
    drakona: {
        image_url:
            "/images/card/art/ancestries/drakona.webp",
        full_card_image_url:
            "/images/full_cards/ancestries/drakona.png",
        title: "Drakona",
        description_html: "Drakona resemble wingless dragons in humanoid form and possess a powerful elemental breath.",
        artist_name: "Mat Wilma",
        features: [{
            title: "Scales",
            description_html: "Your scales act as natural protection. When you would take Severe damage, you can <b>mark a Stress</b> to mark 1 fewer Hit Points.",
        },
        {
            title: "Elemental Breath",
            description_html: "Choose an element for your breath (such as electricity, fire, or ice). You can use this breath against a target or group of targets within Very Close range, treating it as an Instinct weapon that deals <b>d8</b> magic damage using your Proficiency.",
        }],
        effect_ids: []
    },
} as const satisfies Record<string, Card<"ancestry">>

export const COMMUNITY_CARDS = {
    warborne: {
        artist_name: "",
        image_url:
            "/images/wip.avif",
        full_card_image_url:
            "/images/full_cards/communities/warborne.png",
        title: "Warborne",
        description_html:
            "Being part of a warborne community means you come from a place that is, or was, ravaged by war.",
        features: [
            {
                title: "Brave Face",
                description_html:
                    "Once per session, when an attack would cause you to <b>mark a stress</b>, you can <b>spend a hope</b> instead.",
            },
        ],
        effect_ids: []
    }
} as const satisfies Record<string, Card<"community">>

export const SUBCLASS_CARDS = {
    executioners_guild_foundation: <Card<"subclass_foundation">>{
        artist_name: "",
        image_url: "/images/wip.avif",
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
    executioners_guild_specialization: <Card<"subclass_specialization">>{
        artist_name: "",
        image_url: "/images/wip.avif",
        full_card_image_url:
            "/images/full_cards/subclasses/assassin/executioners-guild-specialization.png",
        title: "Executioners Guild",
        description_html: "Specialization",
        features: [
            {
                title: "Death Strike",
                description_html: "When you deal Severe damage to a creature, you can <b>mark a stress</b> to make them mark an additional Hit Point.",
            },
            {
                title: "Scorpion's Poise",
                description_html: "You gain a <b>+2</b> bonus to your Evasion against any attacks made by a creature <i>Marked for Death</i>."
            }
        ],
    },
    executioners_guild_mastery: <Card<"subclass_mastery">>{
        artist_name: "",
        image_url: "/images/wip.avif",
        full_card_image_url: "",
        title: "Executioners Guild",
        description_html: "Mastery",
        features: [
            {
                title: "True Strike",
                description_html: "Once per long rest, when you fail an attack roll, you can <b>spend a hope</b> to make it a success instead.",
            },
            {
                title: "Backstab",
                description_html: 'Your "Marked for Death" feature uses <b>d8s</b> instead of <b>d6s</b>.'
            }
        ],
    },
} as const satisfies Record<string, Card<"subclass_foundation" | "subclass_specialization" | "subclass_mastery">>
