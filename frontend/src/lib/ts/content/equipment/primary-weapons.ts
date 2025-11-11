import type { Weapon } from "../../character/types";


export const TIER_1_PRIMARY_WEAPONS = {
    broadsword: {
        id: "broadsword",
        title: "Broadsword",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 1,
        trait: "agility",
        range: "Melee",
        damage: "d8",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    },
    longsword: {
        id: "longsword",
        title: "Longsword",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Melee",
        damage: "d10+3",
        damage_type: "phy",
        features: []
    },
    battleaxe: {
        id: "battleaxe",
        title: "Battleaxe",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "d10+3",
        damage_type: "phy",
        features: []
    },
    greatsword: {
        id: "greatsword",
        title: "Greatsword",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "d10+3",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Massive",
            description_html: "<p>-1 to Evasion. On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    mace: {
        id: "mace",
        title: "Mace",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "d8+1",
        damage_type: "phy",
        features: []
    },
    warhammer: {
        id: "warhammer",
        title: "Warhammer",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "d12+3",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Heavy",
            description_html: "<p>-1 to Evasion</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    dagger: {
        id: "dagger",
        title: "Dagger",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Melee",
        damage: "d8+1",
        damage_type: "phy",
        features: []
    },
    quarterstaff: {
        id: "quarterstaff",
        title: "Quarterstaff",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "instinct",
        range: "Melee",
        damage: "d10+3",
        damage_type: "phy",
        features: []
    },
    cutlass: {
        id: "cutlass",
        title: "Cutlass",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 1,
        trait: "presence",
        range: "Melee",
        damage: "d8+1",
        damage_type: "phy",
        features: []
    },
    rapier: {
        id: "rapier",
        title: "Rapier",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Melee",
        damage: "d8",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Quick",
            description_html: "<p>When you make an attack, you can mark a Stress to target another creature within range.</p>",
            character_modifiers: []
        }]
    },
    halberd: {
        id: "halberd",
        title: "Halberd",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Very Close",
        damage: "d10+2",
        damage_type: "phy",
        features: []
    },
    spear: {
        id: "spear",
        title: "Spear",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "finesse",
        range: "Very Close",
        damage: "d10+2",
        damage_type: "phy",
        features: []
    },
    shortbow: {
        id: "shortbow",
        title: "Shortbow",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Far",
        damage: "d6+3",
        damage_type: "phy",
        features: []
    },
    crossbow: {
        id: "crossbow",
        title: "Crossbow",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "finesse",
        range: "Far",
        damage: "d6+1",
        damage_type: "phy",
        features: []
    },
    longbow: {
        id: "longbow",
        title: "Longbow",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Very Far",
        damage: "d8+3",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Cumbersome",
            description_html: "<p>-1 to Finesse</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: -1,
                target: "trait",
                trait: "finesse"
            }]
        }]
    },
    // MAGIC WEAPONS
    arcane_gauntlets: {
        id: "arcane_gauntlets",
        title: "Arcane Gauntlets",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "d10+3",
        damage_type: "mag",
        features: []
    },
    hallowed_axe: {
        id: "hallowed_axe",
        title: "Hallowed Axe",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "d8+1",
        damage_type: "mag",
        features: []
    },
    glowing_rings: {
        id: "glowing_rings",
        title: "Glowing Rings",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Very Close",
        damage: "d10+2",
        damage_type: "mag",
        features: []
    },
    hand_runes: {
        id: "hand_runes",
        title: "Hand Runes",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 1,
        trait: "instinct",
        range: "Very Close",
        damage: "d10",
        damage_type: "mag",
        features: []
    },
    returning_blade: {
        id: "returning_blade",
        title: "Returning Blade",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Close",
        damage: "d8",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Returning",
            description_html: "<p>When this weapon is thrown within its range, it appears in your hand immediately after the attack.</p>",
            character_modifiers: []
        }]
    },
    shortstaff: {
        id: "shortstaff",
        title: "Shortstaff",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "instinct",
        range: "Close",
        damage: "d8+1",
        damage_type: "mag",
        features: []
    },
    dualstaff: {
        id: "dualstaff",
        title: "Dualstaff",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "instinct",
        range: "Far",
        damage: "d6+3",
        damage_type: "mag",
        features: []
    },
    scepter: {
        id: "scepter",
        title: "Scepter",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "presence",
        range: "Far",
        damage: "d6+3",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Versatile",
            description_html: "<p>This weapon can also be used with these statistics—Presence, Melee, d8.</p>",
            character_modifiers: []
        }]
    },
    wand: {
        id: "wand",
        title: "Wand",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "knowledge",
        range: "Far",
        damage: "d6+1",
        damage_type: "mag",
        features: []
    },
    greatstaff: {
        id: "greatstaff",
        title: "Greatstaff",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "knowledge",
        range: "Very Far",
        damage: "d6",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            character_modifiers: []
        }]
    }
} as const satisfies Record<string, Weapon>;

export const TIER_2_PRIMARY_WEAPONS = {
    improved_broadsword: {
        id: "improved_broadsword",
        title: "Improved Broadsword",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "agility",
        range: "Melee",
        damage: "d8+3",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    },
    improved_longsword: {
        id: "improved_longsword",
        title: "Improved Longsword",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Melee",
        damage: "d10+6",
        damage_type: "phy",
        features: []
    },
    improved_battleaxe: {
        id: "improved_battleaxe",
        title: "Improved Battleaxe",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "d10+6",
        damage_type: "phy",
        features: []
    },
    improved_greatsword: {
        id: "improved_greatsword",
        title: "Improved Greatsword",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "d10+6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Massive",
            description_html: "<p>-1 to Evasion. On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    improved_mace: {
        id: "improved_mace",
        title: "Improved Mace",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "d8+4",
        damage_type: "phy",
        features: []
    },
    improved_warhammer: {
        id: "improved_warhammer",
        title: "Improved Warhammer",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "d12+6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Heavy",
            description_html: "<p>-1 to Evasion</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    improved_dagger: {
        id: "improved_dagger",
        title: "Improved Dagger",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Melee",
        damage: "d8+4",
        damage_type: "phy",
        features: []
    },
    improved_quarterstaff: {
        id: "improved_quarterstaff",
        title: "Improved Quarterstaff",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "instinct",
        range: "Melee",
        damage: "d10+6",
        damage_type: "phy",
        features: []
    },
    improved_cutlass: {
        id: "improved_cutlass",
        title: "Improved Cutlass",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "presence",
        range: "Melee",
        damage: "d8+4",
        damage_type: "phy",
        features: []
    },
    improved_rapier: {
        id: "improved_rapier",
        title: "Improved Rapier",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "presence",
        range: "Melee",
        damage: "d8+3",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Quick",
            description_html: "<p>When you make an attack, you can mark a Stress to target another creature within range.</p>",
            character_modifiers: []
        }]
    },
    improved_halberd: {
        id: "improved_halberd",
        title: "Improved Halberd",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Very Close",
        damage: "d10+5",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Cumbersome",
            description_html: "<p>-1 to Finesse</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: -1,
                target: "trait",
                trait: "finesse"
            }]
        }]
    },
    improved_spear: {
        id: "improved_spear",
        title: "Improved Spear",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "finesse",
        range: "Very Close",
        damage: "d8+6",
        damage_type: "phy",
        features: []
    },
    improved_shortbow: {
        id: "improved_shortbow",
        title: "Improved Shortbow",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Far",
        damage: "d6+6",
        damage_type: "phy",
        features: []
    },
    improved_crossbow: {
        id: "improved_crossbow",
        title: "Improved Crossbow",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Far",
        damage: "d6+4",
        damage_type: "phy",
        features: []
    },
    improved_longbow: {
        id: "improved_longbow",
        title: "Improved Longbow",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Very Far",
        damage: "d8+6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Cumbersome",
            description_html: "<p>-1 to Finesse</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: -1,
                target: "trait",
                trait: "finesse"
            }]
        }]
    },
    gilded_falchion: {
        id: "gilded_falchion",
        title: "Gilded Falchion",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "d10+4",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            character_modifiers: []
        }]
    },
    knuckle_blades: {
        id: "knuckle_blades",
        title: "Knuckle Blades",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "d10+6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Brutal",
            description_html: "<p>When you roll the maximum value on a damage die, roll an additional damage die.</p>",
            character_modifiers: []
        }]
    },
    urok_broadsword: {
        id: "urok_broadsword",
        title: "Urok Broadsword",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Melee",
        damage: "d8+3",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Deadly",
            description_html: "<p>When you deal Severe damage, the target must mark an additional HP.</p>",
            character_modifiers: []
        }]
    },
    bladed_whip: {
        id: "bladed_whip",
        title: "Bladed Whip",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "agility",
        range: "Very Close",
        damage: "d8+3",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Quick",
            description_html: "<p>When you make an attack, you can mark a Stress to target another creature within range.</p>",
            character_modifiers: []
        }]
    },
    steelforged_halberd: {
        id: "steelforged_halberd",
        title: "Steelforged Halberd",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Very Close",
        damage: "d8+4",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Scary",
            description_html: "<p>On a successful attack, the target must mark a Stress.</p>",
            character_modifiers: []
        }]
    },
    war_scythe: {
        id: "war_scythe",
        title: "War Scythe",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "finesse",
        range: "Very Close",
        damage: "d8+5",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    },
    blunderbuss: {
        id: "blunderbuss",
        title: "Blunderbuss",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "finesse",
        range: "Close",
        damage: "d8+6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Reloading",
            description_html: "<p>After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.</p>",
            character_modifiers: []
        }]
    },
    greatbow: {
        id: "greatbow",
        title: "Greatbow",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Far",
        damage: "d6+6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            character_modifiers: []
        }]
    },
    finehair_bow: {
        id: "finehair_bow",
        title: "Finehair Bow",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Very Far",
        damage: "d6+5",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    },

    // MAGIC WEAPONS
    improved_arcane_gauntlets: {
        id: "improved_arcane_gauntlets",
        title: "Improved Arcane Gauntlets",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "d10+6",
        damage_type: "mag",
        features: []
    },
    improved_hallowed_axe: {
        id: "improved_hallowed_axe",
        title: "Improved Hallowed Axe",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "d8+4",
        damage_type: "mag",
        features: []
    },
    improved_glowing_rings: {
        id: "improved_glowing_rings",
        title: "Improved Glowing Rings",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Very Close",
        damage: "d10+5",
        damage_type: "mag",
        features: []
    },
    improved_hand_runes: {
        id: "improved_hand_runes",
        title: "Improved Hand Runes",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "instinct",
        range: "Very Close",
        damage: "d10+3",
        damage_type: "mag",
        features: []
    },
    improved_returning_blade: {
        id: "improved_returning_blade",
        title: "Improved Returning Blade",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Close",
        damage: "d8+3",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Returning",
            description_html: "<p>When this weapon is thrown within its range, it appears in your hand immediately after the attack.</p>",
            character_modifiers: []
        }]
    },
    improved_shortstaff: {
        id: "improved_shortstaff",
        title: "Improved Shortstaff",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "instinct",
        range: "Close",
        damage: "d8+4",
        damage_type: "mag",
        features: []
    },
    improved_dualstaff: {
        id: "improved_dualstaff",
        title: "Improved Dualstaff",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "instinct",
        range: "Far",
        damage: "d6+6",
        damage_type: "mag",
        features: []
    },
    improved_scepter: {
        id: "improved_scepter",
        title: "Improved Scepter",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "presence",
        range: "Far",
        damage: "d6+3",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Versatile",
            description_html: "<p>This weapon can also be used with these statistics—Presence, Melee, d8+3.</p>",
            character_modifiers: []
        }]
    },
    improved_wand: {
        id: "improved_wand",
        title: "Improved Wand",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "knowledge",
        range: "Far",
        damage: "d6+4",
        damage_type: "mag",
        features: []
    },
    improved_greatstaff: {
        id: "improved_greatstaff",
        title: "Improved Greatstaff",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "knowledge",
        range: "Very Far",
        damage: "d6+3",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            character_modifiers: []
        }]
    },
    ego_blade: {
        id: "ego_blade",
        title: "Ego Blade",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "agility",
        range: "Melee",
        damage: "d12+4",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Pompous",
            description_html: "<p>You must have a Presence of 0 or lower to use this weapon.</p>",
            character_modifiers: []
        }]
    },
    casting_sword: {
        id: "casting_sword",
        title: "Casting Sword",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "d10+4",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Versatile",
            description_html: "<p>This weapon can also be used with these statistics—Knowledge, Far, d6+3.</p>",
            character_modifiers: []
        }]
    },
    devouring_dagger: {
        id: "devouring_dagger",
        title: "Devouring Dagger",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Melee",
        damage: "d8+4",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Scary",
            description_html: "<p>On a successful attack, the target must mark a Stress.</p>",
            character_modifiers: []
        }]
    },
    hammer_of_exota: {
        id: "hammer_of_exota",
        title: "Hammer of Exota",
        description_html: "",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "instinct",
        range: "Melee",
        damage: "d8+6",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Eruptive",
            description_html: "<p>On a successful attack against a target within Melee range, all other adversaries within Very Close range must succeed on a reaction roll (14) or take half damage.</p>",
            character_modifiers: []
        }]
    },
    yutari_bloodbow: {
        id: "yutari_bloodbow",
        title: "Yutari Bloodbow",
        description_html: "<p>When you roll the maximum value on a damage die, roll an additional damage die.</p>",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "finesse",
        range: "Far",
        damage: "d6+4",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Brutal",
            description_html: "<p>When you roll the maximum value on a damage die, roll an additional damage die.</p>",
            character_modifiers: []
        }]
    },
    elder_bow: {
        id: "elder_bow",
        title: "Elder Bow",
        description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "instinct",
        range: "Far",
        damage: "d6+4",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            character_modifiers: []
        }]
    },
    scepter_of_elias: {
        id: "scepter_of_elias",
        title: "Scepter of Elias",
        description_html: "<p>On a successful attack, roll a d4. On a result of 4, clear a Stress.</p>",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "presence",
        range: "Far",
        damage: "d6+3",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Invigorating",
            description_html: "<p>On a successful attack, roll a d4. On a result of 4, clear a Stress.</p>",
            character_modifiers: []
        }]
    },
    wand_of_enthrallment: {
        id: "wand_of_enthrallment",
        title: "Wand of Enthrallment",
        description_html: "<p>Before you make a Presence Roll, you can mark a Stress to gain a +2 bonus to the result.</p>",
        level_requirement: 2,
        category: "Primary",
        burden: 1,
        trait: "presence",
        range: "Far",
        damage: "d6+4",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Persuasive",
            description_html: "<p>Before you make a Presence Roll, you can mark a Stress to gain a +2 bonus to the result.</p>",
            character_modifiers: []
        }]
    },
    keepers_staff: {
        id: "keepers_staff",
        title: "Keeper's Staff",
        description_html: "<p>+1 to attack rolls</p>",
        level_requirement: 2,
        category: "Primary",
        burden: 2,
        trait: "knowledge",
        range: "Far",
        damage: "d6+4",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    }
} as const satisfies Record<string, Weapon>;


export const TIER_3_PRIMARY_WEAPONS = {
    advanced_broadsword: {
        id: "advanced_broadsword",
        title: "Advanced Broadsword",
        description_html: "<p>+1 to attack rolls</p>",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "agility",
        range: "Melee",
        damage: "d8+6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    },
    advanced_longsword: {
        id: "advanced_longsword",
        title: "Advanced Longsword",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Melee",
        damage: "d10+9",
        damage_type: "phy",
        features: []
    },
    advanced_battleaxe: {
        id: "advanced_battleaxe",
        title: "Advanced Battleaxe",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "d10+9",
        damage_type: "phy",
        features: []
    },
    advanced_greatsword: {
        id: "advanced_greatsword",
        title: "Advanced Greatsword",
        description_html: "<p>−1 to Evasion; on a successful attack, roll an additional damage die and discard the lowest result.</p>",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "d10+9",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Massive",
            description_html: "<p>−1 to Evasion; on a successful attack, roll an additional damage die and discard the lowest result.</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    advanced_mace: {
        id: "advanced_mace",
        title: "Advanced Mace",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "d8+7",
        damage_type: "phy",
        features: []
    },
    advanced_warhammer: {
        id: "advanced_warhammer",
        title: "Advanced Warhammer",
        description_html: "<p>−1 to Evasion</p>",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "d12+9",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Heavy",
            description_html: "<p>−1 to Evasion</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    advanced_dagger: {
        id: "advanced_dagger",
        title: "Advanced Dagger",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Melee",
        damage: "d8+7",
        damage_type: "phy",
        features: []
    },
    advanced_quarterstaff: {
        id: "advanced_quarterstaff",
        title: "Advanced Quarterstaff",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "instinct",
        range: "Melee",
        damage: "d10+9",
        damage_type: "phy",
        features: []
    },
    advanced_cutlass: {
        id: "advanced_cutlass",
        title: "Advanced Cutlass",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "presence",
        range: "Melee",
        damage: "d8+7",
        damage_type: "phy",
        features: []
    },
    advanced_rapier: {
        id: "advanced_rapier",
        title: "Advanced Rapier",
        description_html: "<p>When you make an attack, you can mark a Stress to target another creature within range.</p>",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "presence",
        range: "Melee",
        damage: "d8+6",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Quick",
            description_html: "<p>When you make an attack, you can mark a Stress to target another creature within range.</p>",
            character_modifiers: []
        }]
    },
    advanced_halberd: {
        id: "advanced_halberd",
        title: "Advanced Halberd",
        description_html: "<p>−1 to Finesse</p>",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Very Close",
        damage: "d10+8",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Cumbersome",
            description_html: "<p>−1 to Finesse</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: -1,
                target: "trait",
                trait: "finesse"
            }]
        }]
    },
    advanced_spear: {
        id: "advanced_spear",
        title: "Advanced Spear",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "finesse",
        range: "Very Close",
        damage: "d8+9",
        damage_type: "phy",
        features: []
    },
    advanced_shortbow: {
        id: "advanced_shortbow",
        title: "Advanced Shortbow",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Far",
        damage: "d6+9",
        damage_type: "phy",
        features: []
    },
    advanced_crossbow: {
        id: "advanced_crossbow",
        title: "Advanced Crossbow",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Far",
        damage: "d6+7",
        damage_type: "phy",
        features: []
    },
    advanced_longbow: {
        id: "advanced_longbow",
        title: "Advanced Longbow",
        description_html: "<p>−1 to Finesse</p>",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Very Far",
        damage: "d8+9",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Cumbersome",
            description_html: "<p>−1 to Finesse</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: -1,
                target: "trait",
                trait: "finesse"
            }]
        }]
    },
    flickerfly_blade: {
        id: "flickerfly_blade",
        title: "Flickerfly Blade",
        description_html: "<p>Gain a bonus to your damage rolls equal to your Agility.</p>",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "agility",
        range: "Melee",
        damage: "d8+5",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Sharpwing",
            description_html: "<p>Gain a bonus to your damage rolls equal to your Agility.</p>",
            character_modifiers: []
        }]
    },
    bravesword: {
        id: "bravesword",
        title: "Bravesword",
        description_html: "<p>−1 to Evasion; +3 to Severe damage threshold</p>",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "d12+7",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Brave",
            description_html: "<p>−1 to Evasion; +3 to Severe damage threshold</p>",
            character_modifiers: [
                {
                    behavior: "bonus",
                    character_conditions: [],
                    type: "flat",
                    value: -1,
                    target: "evasion"
                },
                {
                    behavior: "bonus",
                    character_conditions: [],
                    type: "flat",
                    value: 3,
                    target: "severe_damage_threshold"
                }
            ]
        }]
    },
    hammer_of_wrath: {
        id: "hammer_of_wrath",
        title: "Hammer of Wrath",
        description_html: "<p>Before you make an attack roll, you can mark a Stress to use a d20 as your damage die.</p>",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "d10+7",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Devastating",
            description_html: "<p>Before you make an attack roll, you can mark a Stress to use a d20 as your damage die.</p>",
            character_modifiers: []
        }]
    },
    labrys_axe: {
        id: "labrys_axe",
        title: "Labrys Axe",
        description_html: "<p>+1 to Armor Score</p>",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "d10+7",
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
    meridian_cutlass: {
        id: "meridian_cutlass",
        title: "Meridian Cutlass",
        description_html: "<p>When there are no other creatures within Close range of the target, gain advantage on your attack roll against them.</p>",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "presence",
        range: "Melee",
        damage: "d10+5",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Dueling",
            description_html: "<p>When there are no other creatures within Close range of the target, gain advantage on your attack roll against them.</p>",
            character_modifiers: []
        }]
    },
    retractable_saber: {
        id: "retractable_saber",
        title: "Retractable Saber",
        description_html: "<p>The blade can be hidden in the hilt to avoid detection.</p>",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "presence",
        range: "Melee",
        damage: "d10+7",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Retractable",
            description_html: "<p>The blade can be hidden in the hilt to avoid detection.</p>",
            character_modifiers: []
        }]
    },
    double_flail: {
        id: "double_flail",
        title: "Double Flail",
        description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Very Close",
        damage: "d10+8",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            character_modifiers: []
        }]
    },
    talon_blades: {
        id: "talon_blades",
        title: "Talon Blades",
        description_html: "<p>When you roll the maximum value on a damage die, roll an additional damage die.</p>",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "finesse",
        range: "Close",
        damage: "d10+7",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Brutal",
            description_html: "<p>When you roll the maximum value on a damage die, roll an additional damage die.</p>",
            character_modifiers: []
        }]
    },
    black_powder_revolver: {
        id: "black_powder_revolver",
        title: "Black Powder Revolver",
        description_html: "<p>After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.</p>",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Far",
        damage: "d6+8",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Reloading",
            description_html: "<p>After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.</p>",
            character_modifiers: []
        }]
    },
    spiked_bow: {
        id: "spiked_bow",
        title: "Spiked Bow",
        description_html: "<p>This weapon can also be used with these statistics—Agility, Melee, d10+5.</p>",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Very Far",
        damage: "d6+7",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Versatile",
            description_html: "<p>This weapon can also be used with these statistics—Agility, Melee, d10+5.</p>",
            character_modifiers: []
        }]
    },
    // magic weapons
    arcane_gauntlets: {
        id: "arcane_gauntlets",
        title: "Arcane Gauntlets",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "1d10+9",
        damage_type: "mag",
        features: []
    },
    hallowed_axe: {
        id: "hallowed_axe",
        title: "Hallowed Axe",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "1d8+7",
        damage_type: "mag",
        features: []
    },
    glowing_rings: {
        id: "glowing_rings",
        title: "Glowing Rings",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Very Close",
        damage: "1d10+8",
        damage_type: "mag",
        features: []
    },
    hand_runes: {
        id: "hand_runes",
        title: "Hand Runes",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "instinct",
        range: "Very Close",
        damage: "1d10+6",
        damage_type: "mag",
        features: []
    },
    returning_blade: {
        id: "returning_blade",
        title: "Returning Blade",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Close",
        damage: "1d8+6",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Returning",
            description_html: "<p>When this weapon is thrown within its range, it appears in your hand immediately after the attack.</p>",
            character_modifiers: []
        }]
    },
    shortstaff: {
        id: "shortstaff",
        title: "Shortstaff",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "instinct",
        range: "Close",
        damage: "1d8+7",
        damage_type: "mag",
        features: []
    },
    dualstaff: {
        id: "dualstaff",
        title: "Dualstaff",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "instinct",
        range: "Far",
        damage: "1d6+9",
        damage_type: "mag",
        features: []
    },
    scepter: {
        id: "scepter",
        title: "Scepter",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "presence",
        range: "Far",
        damage: "1d6+6",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Versatile",
            description_html: "<p>This weapon can also be used with these statistics—Presence, Melee, 1d8+4.</p>",
            character_modifiers: []
        }]
    },
    wand: {
        id: "wand",
        title: "Wand",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "knowledge",
        range: "Far",
        damage: "1d6+7",
        damage_type: "mag",
        features: []
    },
    greatstaff: {
        id: "greatstaff",
        title: "Greatstaff",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "knowledge",
        range: "Very Far",
        damage: "1d6+6",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            character_modifiers: []
        }]
    },
    axe_of_fortunis: {
        id: "axe_of_fortunis",
        title: "Axe of Fortunis",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "1d10+8",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Lucky",
            description_html: "<p>On a failed attack, you can mark a Stress to reroll your attack.</p>",
            character_modifiers: []
        }]
    },
    blessed_anlace: {
        id: "blessed_anlace",
        title: "Blessed Anlace",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "instinct",
        range: "Melee",
        damage: "1d10+6",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Healing",
            description_html: "<p>During downtime, automatically clear a Hit Point.</p>",
            character_modifiers: []
        }]
    },
    ghostblade: {
        id: "ghostblade",
        title: "Ghostblade",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "presence",
        range: "Melee",
        damage: "1d10+7",
        // todo: allow for multiple damage types
        damage_type: "mag", // or "phy" depending on attack
        features: [{
            attack_modifiers: [],
            title: "Otherworldly",
            description_html: "<p>On a successful attack, you can deal physical or magic damage.</p>",
            character_modifiers: []
        }]
    },
    runes_of_ruination: {
        id: "runes_of_ruination",
        title: "Runes of Ruination",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "knowledge",
        range: "Very Close",
        damage: "1d20+4",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Painful",
            description_html: "<p>Each time you make a successful attack, you must mark a Stress.</p>",
            character_modifiers: []
        }]
    },
    widogast_pendant: {
        id: "widogast_pendant",
        title: "Widogast Pendant",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "knowledge",
        range: "Close",
        damage: "1d10+5",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Timebending",
            description_html: "<p>You choose the target of your attack after making your attack roll.</p>",
            character_modifiers: []
        }]
    },
    gilded_bow: {
        id: "gilded_bow",
        title: "Gilded Bow",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "finesse",
        range: "Far",
        damage: "1d6+7",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Self-Correcting",
            description_html: "<p>When you roll a 1 on a damage die, it deals 6 damage instead.</p>",
            character_modifiers: []
        }]
    },
    firestaff: {
        id: "firestaff",
        title: "Firestaff",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 2,
        trait: "instinct",
        range: "Far",
        damage: "1d6+7",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Burning",
            description_html: "<p>When you roll a 6 on a damage die, the target must mark a Stress.</p>",
            character_modifiers: []
        }]
    },
    mage_orb: {
        id: "mage_orb",
        title: "Mage Orb",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "knowledge",
        range: "Far",
        damage: "1d6+7",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            character_modifiers: []
        }]
    },
    ilmari_rifle: {
        id: "ilmari_rifle",
        title: "Ilmari’s Rifle",
        description_html: "",
        level_requirement: 5,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Very Far",
        damage: "1d6+6",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Reloading",
            description_html: "<p>After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.</p>",
            character_modifiers: []
        }]
    }
} as const satisfies Record<string, Weapon>;

export const TIER_4_PRIMARY_WEAPONS = {

    legendary_broadsword: {
        id: "legendary_broadsword",
        title: "Legendary Broadsword",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 1,
        trait: "agility",
        range: "Melee",
        damage: "1d8+9",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    },
    legendary_longsword: {
        id: "legendary_longsword",
        title: "Legendary Longsword",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Melee",
        damage: "1d10+12",
        damage_type: "phy",
        features: []
    },
    legendary_battleaxe: {
        id: "legendary_battleaxe",
        title: "Legendary Battleaxe",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "1d10+12",
        damage_type: "phy",
        features: []
    },
    legendary_greatsword: {
        id: "legendary_greatsword",
        title: "Legendary Greatsword",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "1d10+12",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Massive",
            description_html: "<p>−1 to Evasion; on a successful attack, roll an additional damage die and discard the lowest result.</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    legendary_mace: {
        id: "legendary_mace",
        title: "Legendary Mace",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "1d8+10",
        damage_type: "phy",
        features: []
    },
    legendary_warhammer: {
        id: "legendary_warhammer",
        title: "Legendary Warhammer",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "1d12+12",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Heavy",
            description_html: "<p>−1 to Evasion</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    legendary_dagger: {
        id: "legendary_dagger",
        title: "Legendary Dagger",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Melee",
        damage: "1d8+10",
        damage_type: "phy",
        features: []
    },
    legendary_quarterstaff: {
        id: "legendary_quarterstaff",
        title: "Legendary Quarterstaff",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "instinct",
        range: "Melee",
        damage: "1d10+12",
        damage_type: "phy",
        features: []
    },
    legendary_cutlass: {
        id: "legendary_cutlass",
        title: "Legendary Cutlass",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 1,
        trait: "presence",
        range: "Melee",
        damage: "1d8+10",
        damage_type: "phy",
        features: []
    },
    legendary_rapier: {
        id: "legendary_rapier",
        title: "Legendary Rapier",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 1,
        trait: "presence",
        range: "Melee",
        damage: "1d8+9",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Quick",
            description_html: "<p>When you make an attack, you can mark a Stress to target another creature within range.</p>",
            character_modifiers: []
        }]
    },
    legendary_halberd: {
        id: "legendary_halberd",
        title: "Legendary Halberd",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Very Close",
        damage: "1d10+11",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Cumbersome",
            description_html: "<p>−1 to Finesse</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: -1,
                target: "trait",
                trait: "finesse"
            }]
        }]
    },
    legendary_spear: {
        id: "legendary_spear",
        title: "Legendary Spear",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "finesse",
        range: "Very Close",
        damage: "1d8+12",
        damage_type: "phy",
        features: []
    },
    legendary_shortbow: {
        id: "legendary_shortbow",
        title: "Legendary Shortbow",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Far",
        damage: "1d6+12",
        damage_type: "phy",
        features: []
    },
    legendary_crossbow: {
        id: "legendary_crossbow",
        title: "Legendary Crossbow",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Far",
        damage: "1d6+10",
        damage_type: "phy",
        features: []
    },
    legendary_longbow: {
        id: "legendary_longbow",
        title: "Legendary Longbow",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Very Far",
        damage: "1d8+12",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Cumbersome",
            description_html: "<p>−1 to Finesse</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: -1,
                target: "trait",
                trait: "finesse"
            }]
        }]
    },
    dual_ended_sword: {
        id: "dual_ended_sword",
        title: "Dual-Ended Sword",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Melee",
        damage: "1d10+9",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Quick",
            description_html: "<p>When you make an attack, you can mark a Stress to target another creature within range.</p>",
            character_modifiers: []
        }]
    },
    impact_gauntlet: {
        id: "impact_gauntlet",
        title: "Impact Gauntlet",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "1d10+11",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Concussive",
            description_html: "<p>On a successful attack, you can spend a Hope to knock the target back to Far range.</p>",
            character_modifiers: []
        }]
    },
    sledge_axe: {
        id: "sledge_axe",
        title: "Sledge Axe",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "1d12+13",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Destructive",
            description_html: "<p>−1 to Agility; on a successful attack, all adversaries within Very Close range must mark a Stress.</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: -1,
                target: "trait",
                trait: "agility"
            }]
        }]
    },
    curved_dagger: {
        id: "curved_dagger",
        title: "Curved Dagger",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Melee",
        damage: "1d8+9",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Serrated",
            description_html: "<p>When you roll a 1 on a damage die, it deals 8 damage instead.</p>",
            character_modifiers: []
        }]
    },
    extended_polearm: {
        id: "extended_polearm",
        title: "Extended Polearm",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "finesse",
        range: "Very Close",
        damage: "1d8+10",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Long",
            description_html: "<p>This weapon’s attack targets all adversaries in a line within range.</p>",
            character_modifiers: []
        }]
    },
    swinging_ropeblade: {
        id: "swinging_ropeblade",
        title: "Swinging Ropeblade",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "presence",
        range: "Close",
        damage: "1d8+9",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Grappling",
            description_html: "<p>On a successful attack, you can spend a Hope to Restrain the target or pull them into Melee range with you.</p>",
            character_modifiers: []
        }]
    },
    ricochet_axes: {
        id: "ricochet_axes",
        title: "Ricochet Axes",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Far",
        damage: "1d6+11",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Bouncing",
            description_html: "<p>Mark 1 or more Stress to hit that many targets in range of the attack.</p>",
            character_modifiers: []
        }]
    },
    aantari_bow: {
        id: "aantari_bow",
        title: "Aantari Bow",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "finesse",
        range: "Far",
        damage: "1d6+11",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    },
    hand_cannon: {
        id: "hand_cannon",
        title: "Hand Cannon",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Very Far",
        damage: "1d6+12",
        damage_type: "phy",
        features: [{
            attack_modifiers: [],
            title: "Reloading",
            description_html: "<p>After you make an attack, roll a d6. On a 1, you must mark a Stress to reload this weapon before you can fire it again.</p>",
            character_modifiers: []
        }]
    },
    legendary_arcane_gauntlets: {
        id: "legendary_arcane_gauntlets",
        title: "Legendary Arcane Gauntlets",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "1d10+12",
        damage_type: "mag",
        features: []
    },
    legendary_hallowed_axe: {
        id: "legendary_hallowed_axe",
        title: "Legendary Hallowed Axe",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 1,
        trait: "strength",
        range: "Melee",
        damage: "1d8+10",
        damage_type: "mag",
        features: []
    },
    legendary_glowing_rings: {
        id: "legendary_glowing_rings",
        title: "Legendary Glowing Rings",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Very Close",
        damage: "1d10+11",
        damage_type: "mag",
        features: []
    },
    legendary_hand_runes: {
        id: "legendary_hand_runes",
        title: "Legendary Hand Runes",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 1,
        trait: "instinct",
        range: "Very Close",
        damage: "1d10+9",
        damage_type: "mag",
        features: []
    },
    legendary_returning_blade: {
        id: "legendary_returning_blade",
        title: "Legendary Returning Blade",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Close",
        damage: "1d8+9",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Returning",
            description_html: "<p>When this weapon is thrown within its range, it appears in your hand immediately after the attack.</p>",
            character_modifiers: []
        }]
    },
    legendary_shortstaff: {
        id: "legendary_shortstaff",
        title: "Legendary Shortstaff",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 1,
        trait: "instinct",
        range: "Close",
        damage: "1d8+10",
        damage_type: "mag",
        features: []
    },
    legendary_dualstaff: {
        id: "legendary_dualstaff",
        title: "Legendary Dualstaff",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "instinct",
        range: "Far",
        damage: "1d8+12",
        damage_type: "mag",
        features: []
    },
    legendary_scepter: {
        id: "legendary_scepter",
        title: "Legendary Scepter",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "presence",
        range: "Far",
        damage: "1d6+9",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Versatile",
            description_html: "<p>This weapon can also be used with these statistics—Presence, Melee, 1d8+6.</p>",
            character_modifiers: []
        }]
    },
    legendary_wand: {
        id: "legendary_wand",
        title: "Legendary Wand",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 1,
        trait: "knowledge",
        range: "Far",
        damage: "1d6+10",
        damage_type: "mag",
        features: []
    },
    legendary_greatstaff: {
        id: "legendary_greatstaff",
        title: "Legendary Greatstaff",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "knowledge",
        range: "Very Far",
        damage: "1d6+9",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            character_modifiers: []
        }]
    },
    sword_of_light_flame: {
        id: "sword_of_light_flame",
        title: "Sword of Light & Flame",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "strength",
        range: "Melee",
        damage: "1d10+11",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Hot",
            description_html: "<p>This weapon cuts through solid material.</p>",
            character_modifiers: []
        }]
    },
    siphoning_gauntlets: {
        id: "siphoning_gauntlets",
        title: "Siphoning Gauntlets",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "presence",
        range: "Melee",
        damage: "1d10+9",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Lifestealing",
            description_html: "<p>On a successful attack, roll a d6. On a result of 6, clear a Hit Point or clear a Stress.</p>",
            character_modifiers: []
        }]
    },
    midas_scythe: {
        id: "midas_scythe",
        title: "Midas Scythe",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "knowledge",
        range: "Melee",
        damage: "1d10+9",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Greedy",
            description_html: "<p>Spend a handful of gold to gain a +1 bonus to your Proficiency on a damage roll.</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 1,
                target: "proficiency"
            }]
        }]
    },
    floating_bladeshards: {
        id: "floating_bladeshards",
        title: "Floating Bladeshards",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 1,
        trait: "instinct",
        range: "Close",
        damage: "1d8+9",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            character_modifiers: []
        }]
    },
    bloodstaff: {
        id: "bloodstaff",
        title: "Bloodstaff",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "instinct",
        range: "Far",
        damage: "1d20+7",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Painful",
            description_html: "<p>Each time you make a successful attack, you must mark a Stress.</p>",
            character_modifiers: []
        }]
    },
    thistlebow: {
        id: "thistlebow",
        title: "Thistlebow",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "instinct",
        range: "Far",
        damage: "1d6+13",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            character_modifiers: [{
                behavior: "bonus",
                character_conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    },
    wand_of_essek: {
        id: "wand_of_essek",
        title: "Wand of Essek",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 1,
        trait: "knowledge",
        range: "Far",
        damage: "1d8+13",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Timebending",
            description_html: "<p>You can choose the target of your attack after making your attack roll.</p>",
            character_modifiers: []
        }]
    },
    magus_revolver: {
        id: "magus_revolver",
        title: "Magus Revolver",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 1,
        trait: "finesse",
        range: "Very Far",
        damage: "1d6+13",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Reloading",
            description_html: "<p>After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.</p>",
            character_modifiers: []
        }]
    },
    fusion_gloves: {
        id: "fusion_gloves",
        title: "Fusion Gloves",
        description_html: "",
        level_requirement: 8,
        category: "Primary",
        burden: 2,
        trait: "knowledge",
        range: "Very Far",
        damage: "1d6+9",
        damage_type: "mag",
        features: [{
            attack_modifiers: [],
            title: "Bonded",
            description_html: "<p>Gain a bonus to your damage rolls equal to your level</p>",
            character_modifiers: []
        }]
    }
} as const satisfies Record<string, Weapon>;

