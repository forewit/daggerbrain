import type { Weapon } from "$lib/ts/character/types";

export const TIER_1_SECONDARY_WEAPONS = {
    shortsword: {
        id: "shortsword",
        title: "Shortsword",
        description_html: "",
        level_requirement: 1,
        category: "Secondary",
        burden: 1,
        trait: "agility",
        range: "Melee",
        damage: "1d8",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Paired",
            description_html: "<p>+2 to primary weapon damage to targets within Melee range</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 2,
                target: "major_damage_threshold" // representing primary weapon damage boost
            }]
        }]
    },
    round_shield: {
        id: "round_shield",
        title: "Round Shield",
        description_html: "",
        level_requirement: 1,
        category: "Secondary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "1d4",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Protective",
            description_html: "<p>+1 to Armor Score</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 1,
                target: "max_armor"
            }]
        }]
    },
    tower_shield: {
        id: "tower_shield",
        title: "Tower Shield",
        description_html: "",
        level_requirement: 1,
        category: "Secondary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "1d6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Barrier",
            description_html: "<p>+2 to Armor Score; −1 to Evasion</p>",
            character_modifiers: [
                {
                    behavior: "bonus",
                    character_conditions: [],
                    type: "flat",
                    value: 2,
                    target: "max_armor"
                },
                {
                    behavior: "bonus",
                    character_conditions: [],
                    type: "flat",
                    value: -1,
                    target: "evasion"
                }
            ]
        }]
    },
    small_dagger: {
        id: "small_dagger",
        title: "Small Dagger",
        description_html: "",
        level_requirement: 1,
        category: "Secondary",
        burden: 1,
        trait: "finesse",
        range: "Melee",
        damage: "1d8",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Paired",
            description_html: "<p>+2 to primary weapon damage to targets within Melee range</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 2,
                target: "major_damage_threshold"
            }]
        }]
    },
    whip: {
        id: "whip",
        title: "Whip",
        description_html: "",
        level_requirement: 1,
        category: "Secondary",
        burden: 1,
        trait: "presence",
        range: "Very Close",
        damage: "1d6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Startling",
            description_html: "<p>Mark a Stress to crack the whip and force all adversaries within Melee range back to Close range.</p>",
            character_modifiers: [] // narrative effect, no numeric modifier
        }]
    },
    grappler: {
        id: "grappler",
        title: "Grappler",
        description_html: "",
        level_requirement: 1,
        category: "Secondary",
        burden: 1,
        trait: "finesse",
        range: "Close",
        damage: "1d6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Hooked",
            description_html: "<p>On a successful attack, you can pull the target into Melee range.</p>",
            character_modifiers: [] // positional effect, no numeric modifier
        }]
    },
    hand_crossbow: {
        id: "hand_crossbow",
        title: "Hand Crossbow",
        description_html: "",
        level_requirement: 1,
        category: "Secondary",
        burden: 1,
        trait: "finesse",
        range: "Far",
        damage: "1d6+1",
        damage_type: "phy",
        features: []
    }
} as const satisfies Record<string, Weapon>

export const TIER_2_SECONDARY_WEAPONS = {
    improved_shortsword: {
        id: "improved_shortsword",
        title: "Improved Shortsword",
        description_html: "",
        level_requirement: 2,
        category: "Secondary",
        burden: 1,
        trait: "agility",
        range: "Melee",
        damage: "1d8+2",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Paired",
            description_html: "<p>+3 to primary weapon damage to targets within Melee range</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 3,
                target: "major_damage_threshold"
            }]
        }]
    },
    improved_round_shield: {
        id: "improved_round_shield",
        title: "Improved Round Shield",
        description_html: "",
        level_requirement: 2,
        category: "Secondary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "1d4+2",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Protective",
            description_html: "<p>+2 to Armor Score</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 2,
                target: "max_armor"
            }]
        }]
    },
    improved_tower_shield: {
        id: "improved_tower_shield",
        title: "Improved Tower Shield",
        description_html: "",
        level_requirement: 2,
        category: "Secondary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "1d6+2",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Barrier",
            description_html: "<p>+3 to Armor Score; −1 to Evasion</p>",
            character_modifiers: [
                {
                    behavior: "bonus",
                    character_conditions: [],
                    type: "flat",
                    value: 3,
                    target: "max_armor"
                },
                {
                    behavior: "bonus",
                    character_conditions: [],
                    type: "flat",
                    value: -1,
                    target: "evasion"
                }
            ]
        }]
    },
    improved_small_dagger: {
        id: "improved_small_dagger",
        title: "Improved Small Dagger",
        description_html: "",
        level_requirement: 2,
        category: "Secondary",
        burden: 1,
        trait: "finesse",
        range: "Melee",
        damage: "1d8+2",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Paired",
            description_html: "<p>+3 to primary weapon damage to targets within Melee range</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 3,
                target: "major_damage_threshold"
            }]
        }]
    },
    improved_whip: {
        id: "improved_whip",
        title: "Improved Whip",
        description_html: "",
        level_requirement: 2,
        category: "Secondary",
        burden: 1,
        trait: "presence",
        range: "Very Close",
        damage: "1d6+2",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Startling",
            description_html: "<p>Mark a Stress to crack the whip and force all adversaries within Melee range back to Close range.</p>",
            character_modifiers: []
        }]
    },
    improved_grappler: {
        id: "improved_grappler",
        title: "Improved Grappler",
        description_html: "",
        level_requirement: 2,
        category: "Secondary",
        burden: 1,
        trait: "finesse",
        range: "Close",
        damage: "1d6+2",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Hooked",
            description_html: "<p>On a successful attack, you can pull the target into Melee range.</p>",
            character_modifiers: []
        }]
    },
    improved_hand_crossbow: {
        id: "improved_hand_crossbow",
        title: "Improved Hand Crossbow",
        description_html: "",
        level_requirement: 2,
        category: "Secondary",
        burden: 1,
        trait: "finesse",
        range: "Far",
        damage: "1d6+3",
        damage_type: "phy",
        features: []
    },
    spiked_shield: {
        id: "spiked_shield",
        title: "Spiked Shield",
        description_html: "",
        level_requirement: 2,
        category: "Secondary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "1d6+2",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Double Duty",
            description_html: "<p>+1 to Armor Score; +1 to primary weapon damage within Melee range</p>",
            character_modifiers: [
                {
                    behavior: "bonus",
                    character_conditions: [],
                    type: "flat",
                    value: 1,
                    target: "max_armor"
                },
                {
                    behavior: "bonus",
                    character_conditions: [],
                    type: "flat",
                    value: 1,
                    target: "major_damage_threshold"
                }
            ]
        }]
    },
    parrying_dagger: {
        id: "parrying_dagger",
        title: "Parrying Dagger",
        description_html: "",
        level_requirement: 2,
        category: "Secondary",
        burden: 1,
        trait: "finesse",
        range: "Melee",
        damage: "1d6+2",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Parry",
            description_html: "<p>When you are attacked, roll this weapon's damage dice. If any of the attacker's damage dice rolled the same value as your dice, the matching results are discarded from the attacker's damage dice before the damage you take is totaled.</p>",
            character_modifiers: []
        }]
    },
    returning_axe: {
        id: "returning_axe",
        title: "Returning Axe",
        description_html: "",
        level_requirement: 2,
        category: "Secondary",
        burden: 1,
        trait: "agility",
        range: "Close",
        damage: "1d6+4",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Returning",
            description_html: "<p>When this weapon is thrown within its range, it appears in your hand immediately after the attack.</p>",
            character_modifiers: []
        }]
    }


} as const satisfies Record<string, Weapon>

export const TIER_3_SECONDARY_WEAPONS = {
    advanced_shortsword: {
        id: "advanced_shortsword",
        title: "Advanced Shortsword",
        description_html: "",
        level_requirement: 5,
        category: "Secondary",
        burden: 1,
        trait: "agility",
        range: "Melee",
        damage: "1d8+4",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Paired",
            description_html: "<p>+4 to primary weapon damage to targets within Melee range</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 4,
                target: "major_damage_threshold"
            }]
        }]
    },
    advanced_round_shield: {
        id: "advanced_round_shield",
        title: "Advanced Round Shield",
        description_html: "",
        level_requirement: 5,
        category: "Secondary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "1d4+4",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Protective",
            description_html: "<p>+3 to Armor Score</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 3,
                target: "max_armor"
            }]
        }]
    },
    advanced_tower_shield: {
        id: "advanced_tower_shield",
        title: "Advanced Tower Shield",
        description_html: "",
        level_requirement: 5,
        category: "Secondary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "1d6+4",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Barrier",
            description_html: "<p>+4 to Armor Score; −1 to Evasion</p>",
            character_modifiers: [
                {
                    behavior: "bonus",
                    character_conditions: [],
                    type: "flat",
                    value: 4,
                    target: "max_armor"
                },
                {
                    behavior: "bonus",
                    character_conditions: [],
                    type: "flat",
                    value: -1,
                    target: "evasion"
                }
            ]
        }]
    },
    advanced_small_dagger: {
        id: "advanced_small_dagger",
        title: "Advanced Small Dagger",
        description_html: "",
        level_requirement: 5,
        category: "Secondary",
        burden: 1,
        trait: "finesse",
        range: "Melee",
        damage: "1d8+4",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Paired",
            description_html: "<p>+4 to primary weapon damage to targets within Melee range</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 4,
                target: "major_damage_threshold"
            }]
        }]
    },
    advanced_whip: {
        id: "advanced_whip",
        title: "Advanced Whip",
        description_html: "",
        level_requirement: 5,
        category: "Secondary",
        burden: 1,
        trait: "presence",
        range: "Very Close",
        damage: "1d6+4",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Startling",
            description_html: "<p>Mark a Stress to crack the whip and force all adversaries within Melee range back to Close range.</p>",
            character_modifiers: []
        }]
    },
    advanced_grappler: {
        id: "advanced_grappler",
        title: "Advanced Grappler",
        description_html: "",
        level_requirement: 5,
        category: "Secondary",
        burden: 1,
        trait: "finesse",
        range: "Close",
        damage: "1d6+4",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Hooked",
            description_html: "<p>On a successful attack, you can pull the target into Melee range.</p>",
            character_modifiers: []
        }]
    },
    advanced_hand_crossbow: {
        id: "advanced_hand_crossbow",
        title: "Advanced Hand Crossbow",
        description_html: "",
        level_requirement: 5,
        category: "Secondary",
        burden: 1,
        trait: "finesse",
        range: "Far",
        damage: "1d6+5",
        damage_type: "phy",
        features: []
    },
    buckler: {
        id: "buckler",
        title: "Buckler",
        description_html: "",
        level_requirement: 5,
        category: "Secondary",
        burden: 1,
        trait: "agility",
        range: "Melee",
        damage: "1d4+4",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Deflecting",
            description_html: "<p>When you are attacked, you can mark an Armor Slot to gain a bonus to your Evasion equal to your available Armor Score against the attack.</p>",
            character_modifiers: []
        }]
    },
    powered_gauntlet: {
        id: "powered_gauntlet",
        title: "Powered Gauntlet",
        description_html: "",
        level_requirement: 5,
        category: "Secondary",
        burden: 1,
        trait: "knowledge",
        range: "Close",
        damage: "1d6+4",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Charged",
            description_html: "<p>Mark a Stress to gain a +1 bonus to your Proficiency on a primary weapon attack.</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 1,
                target: "proficiency"
            }]
        }]
    },
    hand_sling: {
        id: "hand_sling",
        title: "Hand Sling",
        description_html: "",
        level_requirement: 5,
        category: "Secondary",
        burden: 1,
        trait: "finesse",
        range: "Very Far",
        damage: "1d6+4",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Versatile",
            description_html: "<p>This weapon can also be used with these statistics—Finesse, Close, 1d8+4.</p>",
            character_modifiers: []
        }]
    }
} as const satisfies Record<string, Weapon>

export const TIER_4_SECONDARY_WEAPONS = {
    legendary_shortsword: {
        id: "legendary_shortsword",
        title: "Legendary Shortsword",
        description_html: "",
        level_requirement: 8,
        category: "Secondary",
        burden: 1,
        trait: "agility",
        range: "Melee",
        damage: "1d8+6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Paired",
            description_html: "<p>+5 to primary weapon damage to targets within Melee range</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 5,
                target: "major_damage_threshold"
            }]
        }]
    },
    legendary_round_shield: {
        id: "legendary_round_shield",
        title: "Legendary Round Shield",
        description_html: "",
        level_requirement: 8,
        category: "Secondary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "1d4+6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Protective",
            description_html: "<p>+4 to Armor Score</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 4,
                target: "max_armor"
            }]
        }]
    },
    legendary_tower_shield: {
        id: "legendary_tower_shield",
        title: "Legendary Tower Shield",
        description_html: "",
        level_requirement: 8,
        category: "Secondary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "1d6+6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Barrier",
            description_html: "<p>+5 to Armor Score; −1 to Evasion</p>",
            character_modifiers: [
                {
                    behavior: "bonus",
                    character_conditions: [],
                    type: "flat",
                    value: 5,
                    target: "max_armor"
                },
                {
                    behavior: "bonus",
                    character_conditions: [],
                    type: "flat",
                    value: -1,
                    target: "evasion"
                }
            ]
        }]
    },
    legendary_small_dagger: {
        id: "legendary_small_dagger",
        title: "Legendary Small Dagger",
        description_html: "",
        level_requirement: 8,
        category: "Secondary",
        burden: 1,
        trait: "finesse",
        range: "Melee",
        damage: "1d8+6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Paired",
            description_html: "<p>+5 to primary weapon damage to targets within Melee range</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 5,
                target: "major_damage_threshold"
            }]
        }]
    },
    legendary_whip: {
        id: "legendary_whip",
        title: "Legendary Whip",
        description_html: "",
        level_requirement: 8,
        category: "Secondary",
        burden: 1,
        trait: "presence",
        range: "Very Close",
        damage: "1d6+6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Startling",
            description_html: "<p>Mark a Stress to crack the whip and force all adversaries within Melee range back to Close range.</p>",
            character_modifiers: []
        }]
    },
    legendary_grappler: {
        id: "legendary_grappler",
        title: "Legendary Grappler",
        description_html: "",
        level_requirement: 8,
        category: "Secondary",
        burden: 1,
        trait: "finesse",
        range: "Close",
        damage: "1d6+6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Hooked",
            description_html: "<p>On a successful attack, you can pull the target into Melee range.</p>",
            character_modifiers: []
        }]
    },
    legendary_hand_crossbow: {
        id: "legendary_hand_crossbow",
        title: "Legendary Hand Crossbow",
        description_html: "",
        level_requirement: 8,
        category: "Secondary",
        burden: 1,
        trait: "finesse",
        range: "Far",
        damage: "1d6+7",
        damage_type: "phy",
        features: []
    },
    braveshield: {
        id: "braveshield",
        title: "Braveshield",
        description_html: "",
        level_requirement: 8,
        category: "Secondary",
        burden: 1,
        trait: "agility",
        range: "Melee",
        damage: "1d4+6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Sheltering",
            description_html: "<p>When you mark an Armor Slot, it reduces damage for you and all allies within Melee range of you who took the same damage.</p>",
            character_modifiers: []
        }]
    },
    knuckle_claws: {
        id: "knuckle_claws",
        title: "Knuckle Claws",
        description_html: "",
        level_requirement: 8,
        category: "Secondary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "1d6+8",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Doubled Up",
            description_html: "<p>When you make an attack with your primary weapon, you can deal damage to another target within Melee range.</p>",
            character_modifiers: []
        }]
    },
    primer_shard: {
        id: "primer_shard",
        title: "Primer Shard",
        description_html: "",
        level_requirement: 8,
        category: "Secondary",
        burden: 1,
        trait: "instinct",
        range: "Very Close",
        damage: "1d4",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Locked On",
            description_html: "<p>On a successful attack, your next attack against the same target with your primary weapon automatically succeeds.</p>",
            character_modifiers: []
        }]
    }
} as const satisfies Record<string, Weapon>
