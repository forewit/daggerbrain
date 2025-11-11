import type { Armor } from "../../character/types";


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
} as const satisfies Record<string, Armor>;
