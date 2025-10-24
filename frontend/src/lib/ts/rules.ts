import type { LevelUpOption } from "./types"

export const EXPERIENCES = {
    description_html: `<p>An Experience is a word or phrase used to encapsulate a specific set of skills personality traits or aptitudes your character has acquired over the course of their life When your PC makes a move they can spend a Hope to add a relevant Experience's modifier to an action or reaction roll.</p>
    <p>You get two Experiences at character creation each with a +2 modifier.</p>`
} as const

export const BLANK_LEVEL_UP_OPTION = {
    id: null,
    title: null,
    short_title: null,
    max: 0,
    marked_traits: {A: null, B: null},
    selected_experiences: {A: null, B: null},
    domain_cards_added: {A: null, B: null},
    effect_ids: [],
} as const satisfies LevelUpOption


export const TIER_1_BASE_OPTIONS = [
    {
        id: "tier_1_domain_cards",
        title: "Choose 2 level 1 domain cards from the domains available to you.",
        short_title: "Starting Domain Cards",
        max: 1,
        effect_ids: []
    }
] as const satisfies Omit<LevelUpOption, "marked_traits" | "selected_experiences" | "domain_cards_added">[]

export const TIER_2_BASE_OPTIONS = [
    {
        id: "tier_2_traits",
        title: "Gain a +1 bonus to two unmarked character traits and mark them.",
        short_title: "+1 to 2 Traits",
        max: 3,
        effect_ids: []
    },
    {
        id: "tier_2_max_hp",
        title: "Permanently gain 1 Hit Point slot.",
        short_title: "+1 HP Slot",
        max: 2,
        effect_ids: []
    },
    {
        id: "tier_2_max_stress",
        title: "Permanently gain 1 Stress slot.",
        short_title: "+1 Stress Slot",
        max: 2,
        effect_ids: []
    },
    {
        id: "tier_2_experience_bonus",
        title: "Permanently gain a +1 bonus to two Experiences.",
        short_title: "+1 to 2 Experiences",
        max: 1,
        effect_ids: []
    },
    {
        id: "tier_2_domain_card",
        title: "Choose an additional domain card of your level or lower from a domain you have access to (up to level 4).",
        short_title: "+1 Domain Card",
        max: 1,
        effect_ids: []
    },
    {
        id: "tier_2_evasion",
        title:"Permanently gain a +1 bonus to your Evasion.",
        short_title: "+1 Evasion",
        max: 1,
        effect_ids: []
    }
] as const satisfies Omit<LevelUpOption, "marked_traits" | "selected_experiences" | "domain_cards_added">[]

export const ALL_LEVEL_UP_OPTIONS = [...TIER_1_BASE_OPTIONS, ...TIER_2_BASE_OPTIONS] 
