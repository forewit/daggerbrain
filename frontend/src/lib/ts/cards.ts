import type { Card } from "./types";

export const VALOR_DOMAIN_CARDS = {
    bare_bones: {
        artist_name: "Simon Pape",
        image_url: "/images/card/art/domains/valor/bare-bones.webp",
        type: "ability",
        full_card_image_url: "/images/full_cards/domains/valor/bare-bones.png",
        title: "Bare Bones",
        description_html: "",
        level: 1,
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
                                    </ul>`
            }
        ]
    } as Card<"domain">
}

export const BLADE_DOMAIN_CARDS = {
    whirlwind: {
        artist_name: "",
        image_url: "",
        type: "ability",
        full_card_image_url: "/images/full_cards/domains/blade/whirlwind.png",
        title: "Whrilwind",
        description_html: "",
        level: 1,
        recall_cost: 0,
        features: [
            {
                title: "",
                description_html: "When you make a successful attack agains a target within Very Close range, you can <b>spend a Hope</b> to use the attack against all other targets within Very Close range."
            }
        ]
    } as Card<"domain">,
    not_good_enough: {
        artist_name: "",
        image_url: "",
        type: "ability",
        full_card_image_url: "/images/full_cards/domains/blade/not-good-enough.png",
        title: "Not Good Enough",
        description_html: "",
        level: 1,
        recall_cost: 1,
        features: [
            {
                title: "",
                description_html: "When you roll your damage dice, you can reroll any 1s or 2s."
            }
        ]
    } as Card<"domain">
} as const

export const TRANSFORMATION_CARDS = {
    werewolf: {
        image_url:
            "/images/card/art/wip.avif",
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
    } as Card<"transformation">
} as const

export const ANCESTRY_CARDS = {
    half_clank: {
        image_url:
            "/images/card/art/ancestries/clank.webp",
        full_card_image_url:
            "/images/full_cards/ancestries/half-clank.png",
        title: "Half-Clank",
        description_html: "Half sentient mechanical being, half human.",
        artist_name: "Mat Wilma",
        top_feature: {
            title: "High Stamina",
            description_html: "Gain an additional Stress slot at character creation.",
        },
        bottom_feature: {
            title: "Efficient",
            description_html:
                "When you take a short rest, you can choose a long rest move instead of a short rest move.",
        },
    } as Card<"ancestry">,
    drakona: {
        image_url:
            "/images/card/art/ancestries/drakona.webp",
        full_card_image_url:
            "/images/full_cards/ancestries/drakona.png",
        title: "Drakona",
        description_html: "Drakona resemble wingless dragons in humanoid form and possess a powerful elemental breath.",
        artist_name: "Mat Wilma",
        top_feature: {
            title: "Scales",
            description_html: "Your scales act as natural protection. When you would take Severe damage, you can <b>mark a Stress</b> to mark 1 fewer Hit Points.",
        },
        bottom_feature: {
            title: "Elemental Breath",
            description_html: "Choose an element for your breath (such as electricity, fire, or ice). You can use this breath against a target or group of targets within Very Close range, treating it as an Instinct weapon that deals <b>d8</b> magic damage using your Proficiency.",
        }
    } as Card<"ancestry">,
} as const

export const COMMUNITY_CARDS = {
    warborne: {
        image_url:
            "/images/card/art/wip.avif",
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
    } as Card<"community">,

} as const