import type { Card } from "../character/types"

export const TRANSFORMATION_CARDS = {
    werewolf: {
        id: "werewolf",
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
                modifiers: []
            },
            {
                title: "Frenzy",
                description_html:
                    "When you mark your last Stress while in Wolf Form, you go into a Frenzy. Roll a number of <b>d20s</b> equal to your tier and automatically deal that much physical damage to all creatures within Very Close Range. Then drop out of Wolf Form.",
                modifiers: []
            },
        ],
    }
} as const satisfies Record<string, Card<"transformation">>


export const TRANSFORMATIONS = {
    description_html: "Transformations represent changes or augmentations to characters in Daggerheart. These are optional aspects of a character's identity that may be given out by the GM during a campaign for narrative purposes. GMs may also present transformations as an option at character creation, at their discretion.",
    cards: TRANSFORMATION_CARDS,
} as const