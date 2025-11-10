import type { Card } from "$lib/ts/character/types";

export const VALOR_DOMAIN_CARDS = {
    bare_bones: {
        id: "bare_bones",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Simon Pape",
        image_url: "/images/card/art/domains/valor/bare-bones.webp",
        type: "ability",
        title: "Bare Bones",
        description_html: "",
        level_requirement: 1,
        recall_cost: 0,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
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
                modifiers: [
                    {
                        behavior: "base",
                        target: "max_armor",
                        type: "derived_from_trait",
                        trait: "strength",
                        multiplier: 1,
                        conditions: [{
                            type: "level",
                            min_level: 1,
                            max_level: 1
                        }, {
                            type: "armor_equipped",
                            value: false
                        }, {
                            type: "level",
                            min_level: 1,
                            max_level: 10
                        }]
                    },
                    {
                        behavior: "bonus",
                        target: "max_armor",
                        type: "flat",
                        value: 3,
                        conditions: [{
                            type: "level",
                            min_level: 1,
                            max_level: 1
                        }, {
                            type: "armor_equipped",
                            value: false
                        }, {
                            type: "level",
                            min_level: 1,
                            max_level: 10
                        }]
                    },
                    {
                        behavior: "base",
                        target: "major_damage_threshold",
                        type: "flat",
                        value: 9,
                        conditions: [{
                            type: "level",
                            min_level: 1,
                            max_level: 1
                        }, {
                            type: "armor_equipped",
                            value: false
                        }, {
                            type: "level",
                            min_level: 1,
                            max_level: 10
                        }]
                    },
                    {
                        behavior: "base",
                        target: "severe_damage_threshold",
                        type: "flat",
                        value: 19,
                        conditions: [{
                            type: "level",
                            min_level: 1,
                            max_level: 1
                        }, {
                            type: "armor_equipped",
                            value: false
                        }, {
                            type: "level",
                            min_level: 1,
                            max_level: 10
                        }]
                    },
                    {
                        behavior: "base",
                        target: "max_armor",
                        type: "derived_from_trait",
                        trait: "strength",
                        multiplier: 1,
                        conditions: [{
                            type: "level",
                            min_level: 2,
                            max_level: 4
                        }, {
                            type: "armor_equipped",
                            value: false
                        }, {
                            type: "level",
                            min_level: 1,
                            max_level: 10
                        }]
                    },
                    {
                        behavior: "bonus",
                        target: "max_armor",
                        type: "flat",
                        value: 3,
                        conditions: [{
                            type: "level",
                            min_level: 2,
                            max_level: 4
                        }, {
                            type: "armor_equipped",
                            value: false
                        }, {
                            type: "level",
                            min_level: 1,
                            max_level: 10
                        }]
                    },
                    {
                        behavior: "base",
                        target: "major_damage_threshold",
                        type: "flat",
                        value: 11,
                        conditions: [{
                            type: "level",
                            min_level: 2,
                            max_level: 4
                        }, {
                            type: "armor_equipped",
                            value: false
                        }, {
                            type: "level",
                            min_level: 1,
                            max_level: 10
                        }]
                    },
                    {
                        behavior: "base",
                        target: "severe_damage_threshold",
                        type: "flat",
                        value: 24,
                        conditions: [{
                            type: "level",
                            min_level: 2,
                            max_level: 4
                        }, {
                            type: "armor_equipped",
                            value: false
                        }, {
                            type: "level",
                            min_level: 1,
                            max_level: 10
                        }]
                    },
                    {
                        behavior: "base",
                        target: "max_armor",
                        type: "derived_from_trait",
                        trait: "strength",
                        multiplier: 1,
                        conditions: [{
                            type: "level",
                            min_level: 5,
                            max_level: 7
                        }, {
                            type: "armor_equipped",
                            value: false
                        }, {
                            type: "level",
                            min_level: 1,
                            max_level: 10
                        }]
                    },
                    {
                        behavior: "bonus",
                        target: "max_armor",
                        type: "flat",
                        value: 3,
                        conditions: [{
                            type: "level",
                            min_level: 5,
                            max_level: 7
                        }, {
                            type: "armor_equipped",
                            value: false
                        }, {
                            type: "level",
                            min_level: 1,
                            max_level: 10
                        }]
                    },
                    {
                        behavior: "base",
                        target: "major_damage_threshold",
                        type: "flat",
                        value: 13,
                        conditions: [{
                            type: "level",
                            min_level: 5,
                            max_level: 7
                        }, {
                            type: "armor_equipped",
                            value: false
                        }, {
                            type: "level",
                            min_level: 1,
                            max_level: 10
                        }]
                    },
                    {
                        behavior: "base",
                        target: "severe_damage_threshold",
                        type: "flat",
                        value: 31,
                        conditions: [{
                            type: "level",
                            min_level: 5,
                            max_level: 7
                        }, {
                            type: "armor_equipped",
                            value: false
                        }, {
                            type: "level",
                            min_level: 1,
                            max_level: 10
                        }]
                    },
                    {
                        behavior: "base",
                        target: "max_armor",
                        type: "derived_from_trait",
                        trait: "strength",
                        multiplier: 1,
                        conditions: [{
                            type: "level",
                            min_level: 8,
                            max_level: 10
                        }, {
                            type: "armor_equipped",
                            value: false
                        }, {
                            type: "level",
                            min_level: 1,
                            max_level: 10
                        }]
                    },
                    {
                        behavior: "bonus",
                        target: "max_armor",
                        type: "flat",
                        value: 3,
                        conditions: [{
                            type: "level",
                            min_level: 8,
                            max_level: 10
                        }, {
                            type: "armor_equipped",
                            value: false
                        }, {
                            type: "level",
                            min_level: 1,
                            max_level: 10
                        }]
                    },
                    {
                        behavior: "base",
                        target: "major_damage_threshold",
                        type: "flat",
                        value: 15,
                        conditions: [{
                            type: "level",
                            min_level: 8,
                            max_level: 10
                        }, {
                            type: "armor_equipped",
                            value: false
                        }, {
                            type: "level",
                            min_level: 1,
                            max_level: 10
                        }]
                    },
                    {
                        behavior: "base",
                        target: "severe_damage_threshold",
                        type: "flat",
                        value: 38,
                        conditions: [{
                            type: "level",
                            min_level: 8,
                            max_level: 10
                        }, {
                            type: "armor_equipped",
                            value: false
                        }, {
                            type: "level",
                            min_level: 1,
                            max_level: 10
                        }]
                    }
                ]
            }
        ],

    }
} as const satisfies Record<string, Card<"domain">>
