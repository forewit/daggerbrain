import type { Armor, Weapon } from "../character/types";

export const ARMOR = {
    leather_armor: {
        title: "Leather Armor",
        description_html: "",
        level_requirement: 1,
        max_armor: 3,
        damage_thresholds: {
            major: 6,
            severe: 13
        },
        features: []
    }
} as const satisfies Record<string, Armor>


export const WEAPONS = {
    longsword: {
        title: "Longsword",
        description_html: "",
        level_requirement: 1,
        category: "Primary",
        burden: 2,
        trait: "agility",
        range: "Melee",
        damage: "1d10+3",
        damage_type: "phy",
        features: []
    }
} as const satisfies Record<string, Weapon>