import type { Card } from "$lib/ts/character/types";

export const VALOR_DOMAIN_CARDS = {
    bare_bones: {
        card_type: "domain",
        domain_id: "valor",
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
