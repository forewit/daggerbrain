import type { Weapon } from "../../character/types";


export const TIER_1_WEAPONS = {
    broadsword: {
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
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    },
    longsword: {
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
            title: "Massive",
            description_html: "<p>-1 to Evasion. On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    mace: {
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
            title: "Heavy",
            description_html: "<p>-1 to Evasion</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    dagger: {
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
            title: "Quick",
            description_html: "<p>When you make an attack, you can mark a Stress to target another creature within range.</p>",
            modifiers: []
        }]
    },
    halberd: {
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
            title: "Cumbersome",
            description_html: "<p>-1 to Finesse</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "trait",
                trait: "finesse"
            }]
        }]
    },
    // MAGIC WEAPONS
    arcane_gauntlets: {
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
            title: "Returning",
            description_html: "<p>When this weapon is thrown within its range, it appears in your hand immediately after the attack.</p>",
            modifiers: []
        }]
    },
    shortstaff: {
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
            title: "Versatile",
            description_html: "<p>This weapon can also be used with these statistics—Presence, Melee, d8.</p>",
            modifiers: []
        }]
    },
    wand: {
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
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            modifiers: []
        }]
    }
} as const satisfies Record<string, Weapon>;

export const TIER_2_WEAPONS = {
    improved_broadsword: {
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
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    },
    improved_longsword: {
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
            title: "Massive",
            description_html: "<p>-1 to Evasion. On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    improved_mace: {
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
            title: "Heavy",
            description_html: "<p>-1 to Evasion</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    improved_dagger: {
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
            title: "Quick",
            description_html: "<p>When you make an attack, you can mark a Stress to target another creature within range.</p>",
            modifiers: []
        }]
    },
    improved_halberd: {
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
            title: "Cumbersome",
            description_html: "<p>-1 to Finesse</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "trait",
                trait: "finesse"
            }]
        }]
    },
    improved_spear: {
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
            title: "Cumbersome",
            description_html: "<p>-1 to Finesse</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "trait",
                trait: "finesse"
            }]
        }]
    },
    gilded_falchion: {
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
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            modifiers: []
        }]
    },
    knuckle_blades: {
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
            title: "Brutal",
            description_html: "<p>When you roll the maximum value on a damage die, roll an additional damage die.</p>",
            modifiers: []
        }]
    },
    urok_broadsword: {
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
            title: "Deadly",
            description_html: "<p>When you deal Severe damage, the target must mark an additional HP.</p>",
            modifiers: []
        }]
    },
    bladed_whip: {
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
            title: "Quick",
            description_html: "<p>When you make an attack, you can mark a Stress to target another creature within range.</p>",
            modifiers: []
        }]
    },
    steelforged_halberd: {
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
            title: "Scary",
            description_html: "<p>On a successful attack, the target must mark a Stress.</p>",
            modifiers: []
        }]
    },
    war_scythe: {
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
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    },
    blunderbuss: {
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
            title: "Reloading",
            description_html: "<p>After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.</p>",
            modifiers: []
        }]
    },
    greatbow: {
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
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            modifiers: []
        }]
    },
    finehair_bow: {
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
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    },

    // MAGIC WEAPONS
    improved_arcane_gauntlets: {
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
            title: "Returning",
            description_html: "<p>When this weapon is thrown within its range, it appears in your hand immediately after the attack.</p>",
            modifiers: []
        }]
    },
    improved_shortstaff: {
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
            title: "Versatile",
            description_html: "<p>This weapon can also be used with these statistics—Presence, Melee, d8+3.</p>",
            modifiers: []
        }]
    },
    improved_wand: {
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
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            modifiers: []
        }]
    },
    ego_blade: {
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
            title: "Pompous",
            description_html: "<p>You must have a Presence of 0 or lower to use this weapon.</p>",
            modifiers: []
        }]
    },
    casting_sword: {
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
            title: "Versatile",
            description_html: "<p>This weapon can also be used with these statistics—Knowledge, Far, d6+3.</p>",
            modifiers: []
        }]
    },
    devouring_dagger: {
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
            title: "Scary",
            description_html: "<p>On a successful attack, the target must mark a Stress.</p>",
            modifiers: []
        }]
    },
    hammer_of_exota: {
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
            title: "Eruptive",
            description_html: "<p>On a successful attack against a target within Melee range, all other adversaries within Very Close range must succeed on a reaction roll (14) or take half damage.</p>",
            modifiers: []
        }]
    },
    yutari_bloodbow: {
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
            title: "Brutal",
            description_html: "<p>When you roll the maximum value on a damage die, roll an additional damage die.</p>",
            modifiers: []
        }]
    },
    elder_bow: {
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
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            modifiers: []
        }]
    },
    scepter_of_elias: {
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
            title: "Invigorating",
            description_html: "<p>On a successful attack, roll a d4. On a result of 4, clear a Stress.</p>",
            modifiers: []
        }]
    },
    wand_of_enthrallment: {
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
            title: "Persuasive",
            description_html: "<p>Before you make a Presence Roll, you can mark a Stress to gain a +2 bonus to the result.</p>",
            modifiers: []
        }]
    },
    keepers_staff: {
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
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    }
} as const satisfies Record<string, Weapon>;


export const TIER_3_WEAPONS = {
    advanced_broadsword: {
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
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    },
    advanced_longsword: {
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
            title: "Massive",
            description_html: "<p>−1 to Evasion; on a successful attack, roll an additional damage die and discard the lowest result.</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    advanced_mace: {
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
            title: "Heavy",
            description_html: "<p>−1 to Evasion</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    advanced_dagger: {
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
            title: "Quick",
            description_html: "<p>When you make an attack, you can mark a Stress to target another creature within range.</p>",
            modifiers: []
        }]
    },
    advanced_halberd: {
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
            title: "Cumbersome",
            description_html: "<p>−1 to Finesse</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "trait",
                trait: "finesse"
            }]
        }]
    },
    advanced_spear: {
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
            title: "Cumbersome",
            description_html: "<p>−1 to Finesse</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "trait",
                trait: "finesse"
            }]
        }]
    },
    flickerfly_blade: {
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
            title: "Sharpwing",
            description_html: "<p>Gain a bonus to your damage rolls equal to your Agility.</p>",
            modifiers: []
        }]
    },
    bravesword: {
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
            title: "Brave",
            description_html: "<p>−1 to Evasion; +3 to Severe damage threshold</p>",
            modifiers: [
                {
                    behavior: "bonus",
                    conditions: [],
                    type: "flat",
                    value: -1,
                    target: "evasion"
                },
                {
                    behavior: "bonus",
                    conditions: [],
                    type: "flat",
                    value: 3,
                    target: "severe_damage_threshold"
                }
            ]
        }]
    },
    hammer_of_wrath: {
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
            title: "Devastating",
            description_html: "<p>Before you make an attack roll, you can mark a Stress to use a d20 as your damage die.</p>",
            modifiers: []
        }]
    },
    labrys_axe: {
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
            title: "Protective",
            description_html: "<p>+1 to Armor Score</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 1,
                target: "max_armor"
            }]
        }]
    },
    meridian_cutlass: {
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
            title: "Dueling",
            description_html: "<p>When there are no other creatures within Close range of the target, gain advantage on your attack roll against them.</p>",
            modifiers: []
        }]
    },
    retractable_saber: {
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
            title: "Retractable",
            description_html: "<p>The blade can be hidden in the hilt to avoid detection.</p>",
            modifiers: []
        }]
    },
    double_flail: {
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
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            modifiers: []
        }]
    },
    talon_blades: {
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
            title: "Brutal",
            description_html: "<p>When you roll the maximum value on a damage die, roll an additional damage die.</p>",
            modifiers: []
        }]
    },
    black_powder_revolver: {
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
            title: "Reloading",
            description_html: "<p>After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.</p>",
            modifiers: []
        }]
    },
    spiked_bow: {
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
            title: "Versatile",
            description_html: "<p>This weapon can also be used with these statistics—Agility, Melee, d10+5.</p>",
            modifiers: []
        }]
    },
    // magic weapons
    arcane_gauntlets: {
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
            title: "Returning",
            description_html: "<p>When this weapon is thrown within its range, it appears in your hand immediately after the attack.</p>",
            modifiers: []
        }]
    },
    shortstaff: {
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
            title: "Versatile",
            description_html: "<p>This weapon can also be used with these statistics—Presence, Melee, 1d8+4.</p>",
            modifiers: []
        }]
    },
    wand: {
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
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            modifiers: []
        }]
    },
    axe_of_fortunis: {
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
            title: "Lucky",
            description_html: "<p>On a failed attack, you can mark a Stress to reroll your attack.</p>",
            modifiers: []
        }]
    },
    blessed_anlace: {
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
            title: "Healing",
            description_html: "<p>During downtime, automatically clear a Hit Point.</p>",
            modifiers: []
        }]
    },
    ghostblade: {
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
            title: "Otherworldly",
            description_html: "<p>On a successful attack, you can deal physical or magic damage.</p>",
            modifiers: []
        }]
    },
    runes_of_ruination: {
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
            title: "Painful",
            description_html: "<p>Each time you make a successful attack, you must mark a Stress.</p>",
            modifiers: []
        }]
    },
    widogast_pendant: {
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
            title: "Timebending",
            description_html: "<p>You choose the target of your attack after making your attack roll.</p>",
            modifiers: []
        }]
    },
    gilded_bow: {
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
            title: "Self-Correcting",
            description_html: "<p>When you roll a 1 on a damage die, it deals 6 damage instead.</p>",
            modifiers: []
        }]
    },
    firestaff: {
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
            title: "Burning",
            description_html: "<p>When you roll a 6 on a damage die, the target must mark a Stress.</p>",
            modifiers: []
        }]
    },
    mage_orb: {
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
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            modifiers: []
        }]
    },
    ilmari_rifle: {
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
            title: "Reloading",
            description_html: "<p>After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.</p>",
            modifiers: []
        }]
    }
} as const satisfies Record<string, Weapon>;

export const TIER_4_WEAPONS = {

    legendary_broadsword: {
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
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    },
    legendary_longsword: {
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
            title: "Massive",
            description_html: "<p>−1 to Evasion; on a successful attack, roll an additional damage die and discard the lowest result.</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    legendary_mace: {
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
            title: "Heavy",
            description_html: "<p>−1 to Evasion</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    legendary_dagger: {
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
            title: "Quick",
            description_html: "<p>When you make an attack, you can mark a Stress to target another creature within range.</p>",
            modifiers: []
        }]
    },
    legendary_halberd: {
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
            title: "Cumbersome",
            description_html: "<p>−1 to Finesse</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "trait",
                trait: "finesse"
            }]
        }]
    },
    legendary_spear: {
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
            title: "Cumbersome",
            description_html: "<p>−1 to Finesse</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "trait",
                trait: "finesse"
            }]
        }]
    },
    dual_ended_sword: {
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
            title: "Quick",
            description_html: "<p>When you make an attack, you can mark a Stress to target another creature within range.</p>",
            modifiers: []
        }]
    },
    impact_gauntlet: {
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
            title: "Concussive",
            description_html: "<p>On a successful attack, you can spend a Hope to knock the target back to Far range.</p>",
            modifiers: []
        }]
    },
    sledge_axe: {
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
            title: "Destructive",
            description_html: "<p>−1 to Agility; on a successful attack, all adversaries within Very Close range must mark a Stress.</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "trait",
                trait: "agility"
            }]
        }]
    },
    curved_dagger: {
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
            title: "Serrated",
            description_html: "<p>When you roll a 1 on a damage die, it deals 8 damage instead.</p>",
            modifiers: []
        }]
    },
    extended_polearm: {
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
            title: "Long",
            description_html: "<p>This weapon’s attack targets all adversaries in a line within range.</p>",
            modifiers: []
        }]
    },
    swinging_ropeblade: {
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
            title: "Grappling",
            description_html: "<p>On a successful attack, you can spend a Hope to Restrain the target or pull them into Melee range with you.</p>",
            modifiers: []
        }]
    },
    ricochet_axes: {
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
            title: "Bouncing",
            description_html: "<p>Mark 1 or more Stress to hit that many targets in range of the attack.</p>",
            modifiers: []
        }]
    },
    aantari_bow: {
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
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    },
    hand_cannon: {
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
            title: "Reloading",
            description_html: "<p>After you make an attack, roll a d6. On a 1, you must mark a Stress to reload this weapon before you can fire it again.</p>",
            modifiers: []
        }]
    },
    legendary_arcane_gauntlets: {
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
            title: "Returning",
            description_html: "<p>When this weapon is thrown within its range, it appears in your hand immediately after the attack.</p>",
            modifiers: []
        }]
    },
    legendary_shortstaff: {
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
            title: "Versatile",
            description_html: "<p>This weapon can also be used with these statistics—Presence, Melee, 1d8+6.</p>",
            modifiers: []
        }]
    },
    legendary_wand: {
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
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            modifiers: []
        }]
    },
    sword_of_light_flame: {
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
            title: "Hot",
            description_html: "<p>This weapon cuts through solid material.</p>",
            modifiers: []
        }]
    },
    siphoning_gauntlets: {
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
            title: "Lifestealing",
            description_html: "<p>On a successful attack, roll a d6. On a result of 6, clear a Hit Point or clear a Stress.</p>",
            modifiers: []
        }]
    },
    midas_scythe: {
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
            title: "Greedy",
            description_html: "<p>Spend a handful of gold to gain a +1 bonus to your Proficiency on a damage roll.</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 1,
                target: "proficiency"
            }]
        }]
    },
    floating_bladeshards: {
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
            title: "Powerful",
            description_html: "<p>On a successful attack, roll an additional damage die and discard the lowest result.</p>",
            modifiers: []
        }]
    },
    bloodstaff: {
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
            title: "Painful",
            description_html: "<p>Each time you make a successful attack, you must mark a Stress.</p>",
            modifiers: []
        }]
    },
    thistlebow: {
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
            title: "Reliable",
            description_html: "<p>+1 to attack rolls</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 1,
                target: "attack_roll_bonus"
            }]
        }]
    },
    wand_of_essek: {
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
            title: "Timebending",
            description_html: "<p>You can choose the target of your attack after making your attack roll.</p>",
            modifiers: []
        }]
    },
    magus_revolver: {
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
            title: "Reloading",
            description_html: "<p>After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.</p>",
            modifiers: []
        }]
    },
    fusion_gloves: {
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
            title: "Bonded",
            description_html: "<p>Gain a bonus to your damage rolls equal to your level</p>",
            modifiers: []
        }]
    }
} as const satisfies Record<string, Weapon>;

export const WEAPONS = { ...TIER_1_WEAPONS, ...TIER_2_WEAPONS, ...TIER_3_WEAPONS, ...TIER_4_WEAPONS }
