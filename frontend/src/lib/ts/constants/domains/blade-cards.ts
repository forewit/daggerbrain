import type { Card } from "$lib/ts/character/types";

export const BLADE_DOMAIN_CARDS = {
    whirlwind: {
        card_type: "domain",
        domain_id: "blade",
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
        domain_id: "blade",
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
        domain_id: "blade",
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
