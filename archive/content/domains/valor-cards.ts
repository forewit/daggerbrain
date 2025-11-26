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
                weapon_modifiers: [],
                title: "",
                description_html: `<p>When you choose not to equip armor, you have a base Armor Score of 3 + your Strength and use the following as your base damage thresholds:</p>
                                    <ul class="list-disc list-inside ml-2">
                                        <li><b><em>Tier 1:</em></b> 9/19</li>
                                        <li><b><em>Tier 2:</em></b> 11/24</li>
                                        <li><b><em>Tier 3:</em></b> 13/31</li>
                                        <li><b><em>Tier 4:</em></b> 15/38</li>
                                    </ul>`,
                character_modifiers: [
                    {
                        behaviour: "base",
                        target: "max_armor",
                        type: "derived_from_trait",
                        trait: "strength",
                        multiplier: 1,
                        character_conditions: [{
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
                        behaviour: "bonus",
                        target: "max_armor",
                        type: "flat",
                        value: 3,
                        character_conditions: [{
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
                        behaviour: "base",
                        target: "major_damage_threshold",
                        type: "flat",
                        value: 9,
                        character_conditions: [{
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
                        behaviour: "base",
                        target: "severe_damage_threshold",
                        type: "flat",
                        value: 19,
                        character_conditions: [{
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
                        behaviour: "base",
                        target: "max_armor",
                        type: "derived_from_trait",
                        trait: "strength",
                        multiplier: 1,
                        character_conditions: [{
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
                        behaviour: "bonus",
                        target: "max_armor",
                        type: "flat",
                        value: 3,
                        character_conditions: [{
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
                        behaviour: "base",
                        target: "major_damage_threshold",
                        type: "flat",
                        value: 11,
                        character_conditions: [{
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
                        behaviour: "base",
                        target: "severe_damage_threshold",
                        type: "flat",
                        value: 24,
                        character_conditions: [{
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
                        behaviour: "base",
                        target: "max_armor",
                        type: "derived_from_trait",
                        trait: "strength",
                        multiplier: 1,
                        character_conditions: [{
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
                        behaviour: "bonus",
                        target: "max_armor",
                        type: "flat",
                        value: 3,
                        character_conditions: [{
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
                        behaviour: "base",
                        target: "major_damage_threshold",
                        type: "flat",
                        value: 13,
                        character_conditions: [{
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
                        behaviour: "base",
                        target: "severe_damage_threshold",
                        type: "flat",
                        value: 31,
                        character_conditions: [{
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
                        behaviour: "base",
                        target: "max_armor",
                        type: "derived_from_trait",
                        trait: "strength",
                        multiplier: 1,
                        character_conditions: [{
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
                        behaviour: "bonus",
                        target: "max_armor",
                        type: "flat",
                        value: 3,
                        character_conditions: [{
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
                        behaviour: "base",
                        target: "major_damage_threshold",
                        type: "flat",
                        value: 15,
                        character_conditions: [{
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
                        behaviour: "base",
                        target: "severe_damage_threshold",
                        type: "flat",
                        value: 38,
                        character_conditions: [{
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

    },
    forceful_push: {
        id: "forceful_push",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Mat Wilma",
        image_url: "/images/card/art/domains/valor/forceful-push.webp",
        type: "ability",
        title: "Forceful Push",
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
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>Make an attack with your primary weapon against a target within Melee range. On a success, you deal damage and knock them back to Close range.</p>
                     <p>On a success with Hope, add a <b>d6</b> to your damage roll. Additionally, you can <b>spend a Hope</b> to make them temporarily <em>Vulnerable</em>.</p>`,
                character_modifiers: []
            }
        ],
    },

    i_am_your_shield: {
        id: "i_am_your_shield",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Juan S. Almenicon",
        image_url: "/images/card/art/domains/valor/i-am-your-shield.webp",
        type: "ability",
        title: "I Am Your Shield",
        description_html: "",
        level_requirement: 1,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>When an ally within Very Close range would take damage, you can <b>mark a Stress</b> to stand in the way and make yourself the target of the attack instead.</p>
                     <p>When you take damage from this attack, you can mark any number of Armor Slots.</p>`,
                character_modifiers: []
            }
        ],
    },

    body_basher: {
        id: "body_basher",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Ilya Royz",
        image_url: "/images/card/art/domains/valor/body-basher.webp",
        type: "ability",
        title: "Body Basher",
        description_html: "",
        level_requirement: 2,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>You use the full force of your body in a fight. On a successful attack using a weapon with a Melee range, gain a bonus to your damage roll equal to your <b>Strength</b>.</p>`,
                character_modifiers: []
            }
        ],
    },

    bold_presence: {
        id: "bold_presence",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Bear Frymire",
        image_url: "/images/card/art/domains/valor/bold-presence.webp",
        type: "ability",
        title: "Bold Presence",
        description_html: "",
        level_requirement: 2,
        recall_cost: 0,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>When you make a <b>Presence Roll</b>, you can <b>spend a Hope</b> to add your <b>Strength</b> to the roll.</p>
                     <p>Additionally, once per rest when you would gain a condition, you can describe how your bold presence aids you in the situation and avoid gaining the condition.</p>`,
                character_modifiers: []
            }
        ],
    },
    critical_inspiration: {
        id: "critical_inspiration",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Suzanne Helmigh",
        image_url: "/images/card/art/domains/valor/critical-inspiration.webp",
        type: "ability",
        title: "Critical Inspiration",
        description_html: "",
        level_requirement: 3,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>Once per rest, when you <b>critically succeed</b> on an attack, all allies within Very Close range can <b>clear a Stress</b> or <b>gain a Hope</b>.</p>`,
                character_modifiers: []
            }
        ],
    },

    lean_on_me: {
        id: "lean_on_me",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Jenny Tan",
        image_url: "/images/card/art/domains/valor/lean-on-me.webp",
        type: "ability",
        title: "Lean On Me",
        description_html: "",
        level_requirement: 3,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>Once per long rest, when you console or inspire an ally who failed an action roll, you can both <b>clear 2 Stress</b>.</p>`,
                character_modifiers: []
            }
        ],
    },

    goad_them_on: {
        id: "goad_them_on",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Anthony Jones",
        image_url: "/images/card/art/domains/valor/goad-them-on.webp",
        type: "ability",
        title: "Goad Them On",
        description_html: "",
        level_requirement: 4,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>Describe how you taunt a target within Close range, then make a <b>Presence Roll</b> against them. On a success:</p>
                     <ul class="list-disc list-inside ml-2">
                        <li>The target must <b>mark a Stress</b>.</li>
                        <li>The next time the GM spotlights them, they must target you with an attack, which they make with <b>disadvantage</b>.</li>
                     </ul>`,
                character_modifiers: []
            }
        ],
    },

    support_tank: {
        id: "support_tank",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "James Green",
        image_url: "/images/card/art/domains/valor/support-tank.webp",
        type: "ability",
        title: "Support Tank",
        description_html: "",
        level_requirement: 4,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>When an ally within Close range fails a roll, you can <b>spend 2 Hope</b> to allow them to reroll either their Hope or Fear Die.</p>`,
                character_modifiers: []
            }
        ],
    },

    armorer: {
        id: "armorer",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Unknown",
        image_url: "/images/card/art/domains/valor/armorer.webp",
        type: "ability",
        title: "Armorer",
        description_html: "",
        level_requirement: 5,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>While you're wearing armor, gain a +1 bonus to your Armor Score.</p>
                     <p>During a rest, when you choose to repair your armor as a downtime move, your allies also <b>clear an Armor Slot</b>.</p>`,
                character_modifiers: [{
                    behaviour: "bonus",
                    type: "flat",
                    value: 1,
                    target: "max_armor",
                    character_conditions: [{
                        type: "armor_equipped",
                        value: true
                    }]
                }]
            }
        ],
    },

    rousing_strike: {
        id: "rousing_strike",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Ilya Royz",
        image_url: "/images/card/art/domains/valor/rousing-strike.webp",
        type: "ability",
        title: "Rousing Strike",
        description_html: "",
        level_requirement: 5,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>Once per rest, when you <b>critically succeed</b> on an attack, you and all allies who can see or hear you can <b>clear a Hit Point</b> or <b>1d4 Stress</b>.</p>`,
                character_modifiers: []
            }
        ],
    },
    inevitable: {
        id: "inevitable",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Ivan Koltovich",
        image_url: "/images/card/art/domains/valor/inevitable.webp",
        type: "ability",
        title: "Inevitable",
        description_html: "",
        level_requirement: 6,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>When you <b>fail an action roll</b>, your next action roll has <b>advantage</b>.</p>`,
                character_modifiers: []
            }
        ],
    },

    rise_up: {
        id: "rise_up",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Ana Amaral",
        image_url: "/images/card/art/domains/valor/rise-up.webp",
        type: "ability",
        title: "Rise Up",
        description_html: "",
        level_requirement: 6,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>Gain a bonus to your Severe threshold equal to your Proficiency.</p>
                     <p>When you mark 1 or more Hit Points from an attack, clear a Stress.</p>`,
                character_modifiers: [{
                    behaviour: "bonus",
                    character_conditions: [],
                    type: "derived_from_proficiency",
                    multiplier: 1,
                    target: "severe_damage_threshold"
                }]
            }
        ],
    },
    shrug_it_off: {
        id: "shrug_it_off",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Rafater",
        image_url: "/images/card/art/domains/valor/shrug-it-off.webp",
        type: "ability",
        title: "Shrug It Off",
        description_html: "",
        level_requirement: 7,
        recall_cost: 1,
        applies_in_vault: true,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>When you would take damage, you can <b>mark a Stress</b> to reduce the severity of the damage by one threshold.
                     When you do, roll a <b>d6</b>. On a result of 3 or lower, place this card in your vault.</p>`,
                character_modifiers: []
            }
        ],
    },

    valor_touched: {
        id: "valor_touched",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Daarken",
        image_url: "/images/card/art/domains/valor/valor-touched.webp",
        type: "ability",
        title: "Valor-Touched",
        description_html: "",
        level_requirement: 7,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>When 4 or more of the domain cards in your loadout are from the Valor domain, gain the following benefits:</p>
                     <ul class="list-disc list-inside ml-2">
                        <li>+1 bonus to your Armor Score</li>
                        <li>When you mark 1 or more Hit Points without marking an Armor Slot, clear an Armor Slot.</li>
                     </ul>`,
                character_modifiers: [{
                    behaviour: "bonus",
                    character_conditions: [{
                        type: "min_loadout_cards_from_domain",
                        domain_id: "valor",
                        min_cards: 4
                    }],
                    type: "flat",
                    value: 1,
                    target: "max_armor"
                }]
            }
        ],
    },
    full_surge: {
        id: "full_surge",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Mike Azevedo",
        image_url: "/images/card/art/domains/valor/full-surge.webp",
        type: "ability",
        title: "Full Surge",
        description_html: "",
        level_requirement: 8,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>Once per long rest, <b>mark 3 Stress</b> to push your body to its limits. Gain a <b>+2 bonus</b> to all of your character traits until your next rest.</p>`,
                character_modifiers: []
            }
        ],
    },

    ground_pound: {
        id: "ground_pound",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Rafater",
        image_url: "/images/card/art/domains/valor/ground-pound.webp",
        type: "ability",
        title: "Ground Pound",
        description_html: "",
        level_requirement: 8,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p><b>Spend 2 Hope</b> to strike the ground where you stand and make a <b>Strength Roll</b> against all targets within Very Close range.</p>
                     <p>Targets you succeed against are thrown back to Far range and must make a <b>Reaction Roll (17)</b>.</p>
                     <ul class="list-disc list-inside ml-2">
                        <li>Targets who fail take <b>4d10+8</b> damage.</li>
                        <li>Targets who succeed take half damage.</li>
                     </ul>`,
                character_modifiers: []
            }
        ],
    },

    hold_the_line: {
        id: "hold_the_line",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Laura Galli",
        image_url: "/images/card/art/domains/valor/hold-the-line.webp",
        type: "ability",
        title: "Hold the Line",
        description_html: "",
        level_requirement: 9,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>Describe the defensive stance you take and <b>spend a Hope</b>. If an adversary moves within Very Close range, they're pulled into Melee range and <em>Restrained</em>.</p>
                     <p>This condition lasts until you move or fail a roll with Fear, or the GM spends 2 Fear on their turn to clear it.</p>`,
                character_modifiers: []
            }
        ],
    },

    lead_by_example: {
        id: "lead_by_example",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Jenny Tan",
        image_url: "/images/card/art/domains/valor/lead-by-example.webp",
        type: "ability",
        title: "Lead by Example",
        description_html: "",
        level_requirement: 9,
        recall_cost: 3,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>When you deal damage to an adversary, you can <b>mark a Stress</b> and describe how you encourage your allies.</p>
                     <p>The next PC to make an attack against that adversary can <b>clear a Stress</b> or <b>gain a Hope</b>.</p>`,
                character_modifiers: []
            }
        ],
    },

    unbreakable: {
        id: "unbreakable",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Luísa Costa",
        image_url: "/images/card/art/domains/valor/unbreakable.webp",
        type: "ability",
        title: "Unbreakable",
        description_html: "",
        level_requirement: 10,
        recall_cost: 4,
        applies_in_vault: true,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>When you <b>mark your last Hit Point</b>, instead of making a death move, you can roll a <b>d6</b> and <b>clear a number of Hit Points equal to the result</b>. Then place this card in your vault.</p>`,
                character_modifiers: []
            }
        ],
    },

    unyielding_armor: {
        id: "unyielding_armor",
        card_type: "domain",
        domain_id: "valor",
        artist_name: "Samantha Kung",
        image_url: "/images/card/art/domains/valor/unyielding-armor.webp",
        type: "ability",
        title: "Unyielding Armor",
        description_html: "",
        level_requirement: 10,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        forced_in_vault: false,
        choices: [],
        tokens: false,
        features: [
            {
                weapon_modifiers: [],
                title: "",
                description_html:
                    `<p>When you would mark an Armor Slot, roll a number of <b>d6s</b> equal to your Proficiency. If any roll a 6, reduce the severity by one threshold without marking an Armor Slot.</p>`,
                character_modifiers: []
            }
        ],
    }
} as const satisfies Record<string, Card<"domain">>
