import type { Modifier } from "../types";

export const MODIFIERS = {
    max_hp_plus_1: {
        min_level: null,
        max_level: null,
        behavior: "bonus",
        target: "max_hp",
        type: "flat",
        value: 1
    },
    max_stress_plus_1: {
        min_level: null,
        max_level: null,
        behavior: "bonus",
        target: "max_stress",
        type: "flat",
        value: 1
    },
    evasion_plus_1: {
        min_level: null,
        max_level: null,
        behavior: "bonus",
        target: "evasion",
        type: "flat",
        value: 1
    },
    proficiency_plus_1: {
        min_level: null,
        max_level: null,
        behavior: "bonus",
        target: "proficiency",
        type: "flat",
        value: 1
    },
    bone_untouchable: {
        min_level: null,
        max_level: null,
        behavior: "bonus",
        target: "evasion",
        type: "derived_from_trait",
        trait: "agility",
        multiplier: 0.5,
    },
    valor_bare_bones_tier_1_armor: {
        min_level: 1,
        max_level: 1,
        behavior: "base",
        target: "max_armor",
        type: "derived_from_trait",
        trait: "strength",
        multiplier: 1
    },
    valor_bare_bones_tier_1_armor_bonus: {
        min_level: 1,
        max_level: 1,
        behavior: "bonus",
        target: "max_armor",
        type: "flat",
        value: 3,
    },
    valor_bare_bones_tier_1_major: {
        min_level: 1,
        max_level: 1,
        behavior: "base",
        target: "major_damage_threshold",
        type: "flat",
        value: 9
    },
    valor_bare_bones_tier_1_severe: {
        min_level: 1,
        max_level: 1,
        behavior: "base",
        target: "severe_damage_threshold",
        type: "flat",
        value: 19
    },
    valor_bare_bones_tier_2_armor: {
        min_level: 2,
        max_level: 4,
        behavior: "base",
        target: "max_armor",
        type: "derived_from_trait",
        trait: "strength",
        multiplier: 1
    },
    valor_bare_bones_tier_2_armor_bonus: {
        min_level: 2,
        max_level: 4,
        behavior: "bonus",
        target: "max_armor",
        type: "flat",
        value: 3,
    },
    valor_bare_bones_tier_2_major: {
        min_level: 2,
        max_level: 4,
        behavior: "base",
        target: "major_damage_threshold",
        type: "flat",
        value: 11
    },
    valor_bare_bones_tier_2_severe: {
        min_level: 2,
        max_level: 4,
        behavior: "base",
        target: "severe_damage_threshold",
        type: "flat",
        value: 24
    },
    valor_bare_bones_tier_3_armor: {
        min_level: 5,
        max_level: 7,
        behavior: "base",
        target: "max_armor",
        type: "derived_from_trait",
        trait: "strength",
        multiplier: 1
    },
    valor_bare_bones_tier_3_armor_bonus: {
        min_level: 5,
        max_level: 7,
        behavior: "bonus",
        target: "max_armor",
        type: "flat",
        value: 3,
    },
    valor_bare_bones_tier_3_major: {
        min_level: 5,
        max_level: 7,
        behavior: "base",
        target: "major_damage_threshold",
        type: "flat",
        value: 13
    },
    valor_bare_bones_tier_3_severe: {
        min_level: 5,
        max_level: 7,
        behavior: "base",
        target: "severe_damage_threshold",
        type: "flat",
        value: 31
    },
    valor_bare_bones_tier_4_armor: {
        min_level: 8,
        max_level: 10,
        behavior: "base",
        target: "max_armor",
        type: "derived_from_trait",
        trait: "strength",
        multiplier: 1
    },
    valor_bare_bones_tier_4_armor_bonus: {
        min_level: 8,
        max_level: 10,
        behavior: "bonus",
        target: "max_armor",
        type: "flat",
        value: 3,
    },
    valor_bare_bones_tier_4_major: {
        min_level: 8,
        max_level: 10,
        behavior: "base",
        target: "major_damage_threshold",
        type: "flat",
        value: 15
    },
    valor_bare_bones_tier_4_severe: {
        min_level: 8,
        max_level: 10,
        behavior: "base",
        target: "severe_damage_threshold",
        type: "flat",
        value: 38
    },
} as const satisfies Record<string, Modifier>