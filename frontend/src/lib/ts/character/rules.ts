import type { AllTierOptionIds, LevelUpChoice, LevelUpOption, Tier1OptionIds, Tier2OptionIds, Tier3OptionIds, Tier4OptionIds } from "./types"

export const TRAIT_OPTIONS = [2, 1, 1, 0, 0, -1] as const

export const TRAITS = {
    agility: {
        name: "Agility",
        examples: ["Sprint", "Leap", "Maneuver"]
    },
    strength: {
        name: "Strength",
        examples: ["Lift", "Smash", "Grapple"]
    },
    finesse: {
        name: "Finesse",
        examples: ["Control", "Hide", "Tinker"]
    },
    instinct: {
        name: "Instinct",
        examples: ["Perceive", "Sense", "Navigate"]
    },
    presence: {
        name: "Presence",
        examples: ["Charm", "Perform", "Deceive"]
    },
    knowledge: {
        name: "Knowledge",
        examples: ["Recall", "Analyze", "Comprehend"]
    }
} as const


export const BASE_STATS = {
    traits: {
        agility: 0,
        strength: 0,
        finesse: 0,
        instinct: 0,
        presence: 0,
        knowledge: 0,
    },
    proficiency: 1,
    experience_modifier: 2,
    max_experiences: 2,
    max_domain_card_loadout: 5,
    max_hope: 6,
    max_armor: 0,
    max_hp: 0,
    max_stress: 6,
    max_burden: 2,
    evasion: 0,
    attack_roll_bonus: 0,
    spellcast_roll_bonus: 0,
    damage_thresholds: {
        major: 0,
        severe: 0,
    },
    spellcast_trait: null,
    primary_class_mastery_level: 0,
    secondary_class_mastery_level: 0,
} as const

export const TIER_1_BASE_OPTIONS = {
    tier_1_domain_cards: {
        title_html: "<p>Choose 2 level 1 domain cards from the domains available to you.</p>",
        short_title: "Starting Domain Cards",
        max: 1,
        costs_two_choices: false,
        modifiers: []
    }
} as const satisfies Record<Tier1OptionIds, LevelUpOption>

export const TIER_2_BASE_OPTIONS = {
    tier_2_traits: {
        title_html: "<p>Gain a +1 bonus to two unmarked character traits and mark them.</p>",
        short_title: "+1 to 2 Traits",
        max: 3,
        costs_two_choices: false,
        modifiers: []
    },
    tier_2_max_hp: {
        title_html: "<p>Permanently gain 1 Hit Point slot.</p>",
        short_title: "+1 HP Slot",
        max: 2,
        costs_two_choices: false,
        modifiers: [{
            behavior: "bonus",
            target: "max_hp",
            type: "flat",
            value: 1,
            conditions: []
        }]
    },
    tier_2_max_stress: {
        title_html: "<p>Permanently gain 1 Stress slot.</p>",
        short_title: "+1 Stress Slot",
        max: 2,
        costs_two_choices: false,
        modifiers: [{
            behavior: "bonus",
            target: "max_stress",
            type: "flat",
            value: 1,
            conditions: []
        }]
    },
    tier_2_experience_bonus: {
        title_html: "<p>Permanently gain a +1 bonus to two Experiences.</p>",
        short_title: "+1 to 2 Experiences",
        max: 1,
        costs_two_choices: false,
        modifiers: []
    },
    tier_2_domain_card: {
        title_html: "<p>Choose an additional domain card of your level or lower from a domain you have access to (up to level 4).</p>",
        short_title: "+1 Domain Card",
        max: 1,
        costs_two_choices: false,
        modifiers: []
    },
    tier_2_evasion: {
        title_html: "<p>Permanently gain a +1 bonus to your Evasion.</p>",
        short_title: "+1 Evasion",
        max: 1,
        costs_two_choices: false,
        modifiers: [{
            behavior: "bonus",
            target: "evasion",
            type: "flat",
            value: 1,
            conditions: []
        }]
    }
} as const satisfies Record<Tier2OptionIds, LevelUpOption>

export const TIER_3_BASE_OPTIONS = {
    tier_3_traits: {
        title_html: "<p>Gain a +1 bonus to two unmarked character traits and mark them.</p>",
        short_title: "+1 to 2 Traits",
        max: 3,
        costs_two_choices: false,
        modifiers: []
    },
    tier_3_max_hp: {
        title_html: "<p>Permanently gain 1 Hit Point slot.</p>",
        short_title: "+1 HP Slot",
        max: 2,
        costs_two_choices: false,
        modifiers: [{
            behavior: "bonus",
            target: "max_hp",
            type: "flat",
            value: 1,
            conditions: []
        }]
    },
    tier_3_max_stress: {
        title_html: "<p>Permanently gain 1 Stress slot.</p>",
        short_title: "+1 Stress Slot",
        max: 2,
        costs_two_choices: false,
        modifiers: [{
            behavior: "bonus",
            target: "max_stress",
            type: "flat",
            value: 1,
            conditions: []
        }]
    },
    tier_3_experience_bonus: {
        title_html: "<p>Permanently gain a +1 bonus to two Experiences.</p>",
        short_title: "+1 to 2 Experiences",
        max: 1,
        costs_two_choices: false,
        modifiers: []
    },
    tier_3_domain_card: {
        title_html: "<p>Choose an additional domain card of your level or lower from a domain you have access to (up to level 7).</p>",
        short_title: "+1 Domain Card",
        max: 1,
        costs_two_choices: false,
        modifiers: []
    },
    tier_3_evasion: {
        title_html: "<p>Permanently gain a +1 bonus to your Evasion.</p>",
        short_title: "+1 Evasion",
        max: 1,
        costs_two_choices: false,
        modifiers: [{
            behavior: "bonus",
            target: "evasion",
            type: "flat",
            value: 1,
            conditions: []
        }]
    },
    tier_3_subclass_upgrade: {
        title_html: "<p>Take an upgraded subclass card. Disables the <b>Multiclass</b> option for this tier</p>",
        short_title: "Upgrade Subclass",
        max: 1,
        costs_two_choices: false,
        modifiers: []
    },
    tier_3_proficiency: {
        title_html: "<p>Increase your Proficiency by +1.</p>",
        short_title: "+1 Proficiency",
        max: 1,
        costs_two_choices: true,
        modifiers: [{
            behavior: "bonus",
            target: "proficiency",
            type: "flat",
            value: 1,
            conditions: []
        }]
    },
    tier_3_multiclass: {
        title_html: "<p>Multiclass: Choose an additional class for your character (disables <b>Take an upgraded subclass card</b> for this tier and the <b>Tier 4 Multiclass</b> option).</p>",
        short_title: "Multiclass",
        max: 1,
        costs_two_choices: true,
        modifiers: []
    }
} as const satisfies Record<Tier3OptionIds, LevelUpOption>

export const TIER_4_BASE_OPTIONS = {
    tier_4_traits: {
        title_html: "<p>Gain a +1 bonus to two unmarked character traits and mark them.</p>",
        short_title: "+1 to 2 Traits",
        max: 3,
        costs_two_choices: false,
        modifiers: []
    },
    tier_4_max_hp: {
        title_html: "<p>Permanently gain 1 Hit Point slot.</p>",
        short_title: "+1 HP Slot",
        max: 2,
        costs_two_choices: false,
        modifiers: [{
            behavior: "bonus",
            target: "max_hp",
            type: "flat",
            value: 1,
            conditions: []
        }]
    },
    tier_4_max_stress: {
        title_html: "<p>Permanently gain 1 Stress slot.</p>",
        short_title: "+1 Stress Slot",
        max: 2,
        costs_two_choices: false,
        modifiers: [{
            behavior: "bonus",
            target: "max_stress",
            type: "flat",
            value: 1,
            conditions: []
        }]
    },
    tier_4_experience_bonus: {
        title_html: "<p>Permanently gain a +1 bonus to two Experiences.</p>",
        short_title: "+1 to 2 Experiences",
        max: 1,
        costs_two_choices: false,
        modifiers: []
    },
    tier_4_domain_card: {
        title_html: "<p>Choose an additional domain card of your level or lower from a domain you have access to.</p>",
        short_title: "+1 Domain Card",
        max: 1,
        costs_two_choices: false,
        modifiers: []
    },
    tier_4_evasion: {
        title_html: "<p>Permanently gain a +1 bonus to your Evasion.</p>",
        short_title: "+1 Evasion",
        max: 1,
        costs_two_choices: false,
        modifiers: [{
            behavior: "bonus",
            target: "evasion",
            type: "flat",
            value: 1,
            conditions: []
        }]
    },
    tier_4_subclass_upgrade: {
        title_html: "<p>Take an upgraded subclass card. Disables the <b>Multiclass</b> option for this tier</p>",
        short_title: "Upgrade Subclass",
        max: 1,
        costs_two_choices: false,
        modifiers: []
    },
    tier_4_proficiency: {
        title_html: "<p>Increase your Proficiency by +1.</p>",
        short_title: "+1 Proficiency",
        max: 1,
        costs_two_choices: true,
        modifiers: [{
            behavior: "bonus",
            target: "proficiency",
            type: "flat",
            value: 1,
            conditions: []
        }]
    },
    tier_4_multiclass: {
        title_html: "<p>Multiclass: Choose an additional class for your character (disables <b>Take an upgraded subclass card</b> for this tier and the <b>Tier 3 Multiclass</b> option).</p>",
        short_title: "Multiclass",
        max: 1,
        costs_two_choices: true,
        modifiers: []
    }
} as const satisfies Record<Tier4OptionIds, LevelUpOption>

export const ALL_LEVEL_UP_OPTIONS = {
    ...TIER_1_BASE_OPTIONS,
    ...TIER_2_BASE_OPTIONS,
    ...TIER_3_BASE_OPTIONS,
    ...TIER_4_BASE_OPTIONS
} as const satisfies Record<AllTierOptionIds, LevelUpOption>
