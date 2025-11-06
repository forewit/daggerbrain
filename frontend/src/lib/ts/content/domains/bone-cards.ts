import type { Card } from "$lib/ts/character/types";

export const BONE_DOMAIN_CARDS = {
    untouchable: {
        id: "untouchable",
        card_type: "domain",
        domain_id: "bone",
        artist_name: "Henry Peters",
        image_url: "/images/card/art/domains/bone/untouchable.webp",
        type: "ability",
        title: "Untouchable",
        description_html: "",
        level_requirement: 1,
        recall_cost: 1,
        applies_in_vault: false,
        choices: [],
        features: [
            {
                title: "",
                description_html: "Gain a bonus to your Evasion equal to half your Agility.",
                modifiers: [{
                    behavior: "bonus",
                    target: "evasion",
                    type: "derived_from_trait",
                    trait: "agility",
                    multiplier: 0.5,
					conditions: [{
						type: "level",
						min_level: 1,
						max_level: 10
					}]
                }]
            }
        ],
    }
} as const satisfies Record<string, Card<"domain">>
