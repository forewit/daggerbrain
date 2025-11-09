import type { SOURCES } from "./constants"

export type Character = {
    settings: {
        void_enabled: boolean
    }
    uid: string,
    name: string,
    image: string,

    selected_traits: Traits

    // heritage
    ancestry_card_id: string | null
    community_card_id: string | null
    experiences: string[],

    // classes
    primary_class_id: string | null
    primary_subclass_id: string | null
    secondary_class_id: string | null
    secondary_subclass_id: string | null
    secondary_class_domain_id_choice: DomainIds | null

    // descriptors (used to so that data isn't fetched too often)
    derived_descriptors: {
        ancestry_name: string
        primary_class_name: string
        primary_subclass_name: string
        secondary_class_name: string
        secondary_subclass_name: string
    }

    // equipment
    active_armor_id: string | null;
    active_weapon_ids: string[];

    // the void / other
    transformation_card_id: string | null,
    additional_domain_card_ids: string[],
    additional_modifiers: Modifier[]

    // set by the player
    ephemeral_stats: {
        marked_hp: number,
        marked_stress: number,
        marked_hope: number,
        marked_armor: number,
        domain_card_loadout: number[], // domain card vault indices
    }


    // choices made by the player in regards to their domain cards
    // key is the domain card id
    domain_card_experience_selections: Record<string, number[]>
    domain_card_choices: Record<string, string>,
    domain_card_tokens: Record<string, number>,

    // level-up choices. levels 2-10
    level: number,
    level_up_domain_card_ids: {
        1: { A: string | null, B: string | null },
        2: { A: string | null },
        3: { A: string | null },
        4: { A: string | null },
        5: { A: string | null },
        6: { A: string | null },
        7: { A: string | null },
        8: { A: string | null },
        9: { A: string | null },
        10: { A: string | null },
    }
    level_up_choices: {
        2: { A: LevelUpChoice, B: LevelUpChoice },
        3: { A: LevelUpChoice, B: LevelUpChoice },
        4: { A: LevelUpChoice, B: LevelUpChoice },
        5: { A: LevelUpChoice, B: LevelUpChoice },
        6: { A: LevelUpChoice, B: LevelUpChoice },
        7: { A: LevelUpChoice, B: LevelUpChoice },
        8: { A: LevelUpChoice, B: LevelUpChoice },
        9: { A: LevelUpChoice, B: LevelUpChoice },
        10: { A: LevelUpChoice, B: LevelUpChoice },
    }
}

export type Traits = {
    agility: number | null,
    strength: number | null,
    finesse: number | null,
    instinct: number | null,
    presence: number | null,
    knowledge: number | null
}

export type Class = {
    source_id: keyof typeof SOURCES
    name: string
    image_url: string
    description_html: string
    starting_evasion: number
    starting_max_hp: number
    suggested_traits: Traits
    hope_feature: Feature
    primary_domain_id: DomainIds
    secondary_domain_id: DomainIds
    class_features: Feature[]
    subclasses: Record<string, Subclass>
}

export type Subclass = {
    name: string
    description_html: string
    foundation_card: Card<"subclass_foundation">
    specialization_card: Card<"subclass_specialization">
    mastery_card: Card<"subclass_mastery">
}

export type Condition = {
    type: "armor_equipped"
    value: boolean
} | {
    type: "level"
    min_level: number,
    max_level: number
} | {
    type: "domain_card_choice"
    domain_card_id: string
    choice_id: string
} | {
    type: "min_loadout_cards_from_domain"
    domain_id: DomainIds
    min_cards: number
}

export type Modifier = ({
    behavior: "bonus" | "base" | "override"
    conditions: Condition[];
} & ({
    type: "derived_from_trait"
    trait: keyof Traits
    multiplier: number
} | {
    type: "flat"
    value: number
}) & ({
    target: "evasion" | "max_hp" | "max_stress" | "max_experiences" | "major_damage_threshold" | "severe_damage_threshold" | "primary_class_mastery_level" | "secondary_class_mastery_level" | "max_domain_card_loadout" | "max_hope" | "proficiency" | "max_armor" | "max_burden" | "attack_roll_bonus" | "spellcast_roll_bonus";
} | {
    target: "trait"
    trait: keyof Traits
} | {
    target: "experiences_from_domain_card_selection"
    domain_card_id: string
}))

export type Feature = {
    title: string,
    description_html: string,
    modifiers: Modifier[]
}

export type CardType = "domain" | "ancestry" | "community" | "transformation" | "subclass_foundation" | "subclass_specialization" | "subclass_mastery";


export type DomainCardChoice = {
    id: string,
    name: string,
} & ({
    type: "arbitrary"
} | {
    type: "experience"
    max: number
})

export type Card<T extends CardType> = {
    id: string
    card_type: T
    image_url: string
    title: string
    description_html: string
    artist_name: string
    features: Feature[]
} & (
        T extends "domain" ? {
            domain_id: DomainIds
            level_requirement: number,
            recall_cost: number,
            type: "ability" | "spell" | "grimoire"
            choices: DomainCardChoice[]
            tokens: boolean
            applies_in_vault: boolean
            forced_in_loadout: boolean
        } : T extends "subclass_foundation" ? {
            spellcast_trait: keyof Traits | null
            class_id: string
        } : T extends "subclass_specialization" ? {
            class_id: string
        } : T extends "subclass_mastery" ? {
            class_id: string
        } : {}
    )

export type DomainIds = "arcana" | "blade" | "bone" | "codex" | "grace" | "midnight" | "sage" | "splendor" | "valor";

export type Domain = {
    name: string
    description_html: string
    color: string
    foreground_color: string
    cards: Record<string, Card<"domain">>
}

export type Tier1OptionIds = "tier_1_domain_cards";
export type Tier2OptionIds = "tier_2_domain_card" | "tier_2_traits" | "tier_2_experience_bonus" | "tier_2_max_hp" | "tier_2_max_stress" | "tier_2_evasion";
export type Tier3OptionIds = "tier_3_domain_card" | "tier_3_traits" | "tier_3_experience_bonus" | "tier_3_max_hp" | "tier_3_max_stress" | "tier_3_evasion" | "tier_3_proficiency" | "tier_3_subclass_upgrade" | "tier_3_multiclass";
export type Tier4OptionIds = "tier_4_domain_card" | "tier_4_traits" | "tier_4_experience_bonus" | "tier_4_max_hp" | "tier_4_max_stress" | "tier_4_evasion" | "tier_4_proficiency" | "tier_4_subclass_upgrade" | "tier_4_multiclass";
export type AllTierOptionIds = Tier1OptionIds | Tier2OptionIds | Tier3OptionIds | Tier4OptionIds;

export type LevelUpChoice = {
    option_id: AllTierOptionIds | null
    marked_traits: { A: keyof Traits | null, B: keyof Traits | null }
    selected_experiences: number[]
    selected_domain_card_id: string | null,
    selected_subclass_upgrade: "primary" | "secondary" | null,
}
export type LevelUpOption = {
    title_html: string | null
    short_title: string | null
    max: number
    costs_two_choices: boolean
    modifiers: Modifier[]
}

export type DamageThresholds = {
    major: number,
    severe: number
}
export type Armor = {
    level_requirement: number,
    title: string,
    description_html: string,
    max_armor: number,
    damage_thresholds: DamageThresholds
    features: Feature[],
}

export type Range = "Melee" | "Very Close" | "Close" | "Far" | "Very Far";

export type Weapon = {
    title: string,
    description_html: string,
    level_requirement: number,
    category: "Primary" | "Secondary";
    trait: keyof Traits;
    range: Range;
    features: Feature[];
    damage: string;
    damage_type: "phy" | "mag";
    burden: 1 | 2 // represents number of hands required to wield
}