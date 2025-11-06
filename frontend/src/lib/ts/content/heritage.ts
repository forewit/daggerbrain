import type { Card } from "../character/types"

export const ANCESTRY_CARDS = {
    half_clank: {
        card_type: "ancestry",
        image_url: "/images/card/art/ancestries/clank.webp",
        title: "Half-Clank",
        description_html: "Half sentient mechanical being, half human.",
        artist_name: "Mat Wilma",
        choices: [],
        features: [{
            title: "High Stamina",
            description_html: "Gain an additional Stress slot at character creation.",
            modifiers: [{
                behavior: "bonus",
                target: "max_stress",
                type: "flat",
                value: 1,
                conditions: []
            }]
        },
        {
            title: "Efficient",
            description_html:
                "When you take a short rest, you can choose a long rest move instead of a short rest move.",
            modifiers: []
        }],
    },
    drakona: {
        card_type: "ancestry",
        image_url: "/images/card/art/ancestries/drakona.webp",
        title: "Drakona",
        description_html: "Drakona resemble wingless dragons in humanoid form and possess a powerful elemental breath.",
        artist_name: "Mat Wilma",
        choices: [],
        features: [{
            title: "Scales",
            description_html: "Your scales act as natural protection. When you would take Severe damage, you can <b>mark a Stress</b> to mark 1 fewer Hit Points.",
            modifiers: []
        },
        {
            title: "Elemental Breath",
            description_html: "Choose an element for your breath (such as electricity, fire, or ice). You can use this breath against a target or group of targets within Very Close range, treating it as an Instinct weapon that deals <b>d8</b> magic damage using your Proficiency.",
            modifiers: []
        }],
    },
} as const satisfies Record<string, Card<"ancestry">>

export const ANCESTRIES = {
    description_html: "Ancestries represent your character's lineage which affects their physical appearance and access to certain special abilities.",
    cards: ANCESTRY_CARDS,
} as const

export const COMMUNITY_CARDS = {
    warborne: {
        card_type: "community",
        artist_name: "",
        image_url: "/images/wip.avif",
        title: "Warborne",
        description_html:
            "Being part of a warborne community means you come from a place that is, or was, ravaged by war.",
        choices: [],
        features: [
            {
                title: "Brave Face",
                description_html:
                    "Once per session, when an attack would cause you to <b>mark a stress</b>, you can <b>spend a hope</b> instead.",
                modifiers: []
            },
        ],
    }
} as const satisfies Record<string, Card<"community">>

export const COMMUNITIES = {
    description_html: "Communities represent a key aspect of the culture class or environment of origin that has had the most influence over your character's upbringing.",
    cards: COMMUNITY_CARDS,
} as const