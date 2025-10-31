import type { MODIFIERS } from "./constants/modifiers"
import type { ALL_LEVEL_UP_OPTIONS } from "./constants/rules"


export type Character = {
    settings: {
        void_enabled: boolean
    }
    uid: string,
    name: string,
    image: string,
    base_stats: {
        traits: Traits
        proficiency: 1
        experience_modifier: 2
        max_experiences: 2
        max_domain_card_loadout: 5
        max_hope: 6
        max_armor: 0
        max_hp: 0
        max_stress: 6
        evasion: 0
        primary_class_mastery_level: 0
        secondary_class_mastery_level: 0
    }

    // heritage
    ancestry_card: Card<"ancestry"> | null
    community_card: Card<"community"> | null
    experiences: string[],

    // classes
    primary_class: Class | null
    primary_subclass: Subclass | null
    secondary_class: Class | null
    secondary_subclass: Subclass | null

    // equipment
    active_armor: Armor | null;
    active_weapons: Weapon[];

    // the void / other
    transformation_card: Card<"transformation"> | null,
    additional_cards: Card<any>[],
    additional_modifier_ids: (keyof typeof MODIFIERS)[]

    // set by the player
    ephemeral_stats: {
        marked_hp: number,
        marked_stress: number,
        marked_hope: number,
        marked_armor: number,
        domain_card_loadout: number[], // domain card vault indices
    }

    // level-up choices. levels 2-10
    level: number,
    level_up_domain_cards: {
        1: { A: Card<"domain"> | null, B: Card<"domain"> | null },
        2: { A: Card<"domain"> | null },
        3: { A: Card<"domain"> | null },
        4: { A: Card<"domain"> | null },
        5: { A: Card<"domain"> | null },
        6: { A: Card<"domain"> | null },
        7: { A: Card<"domain"> | null },
        8: { A: Card<"domain"> | null },
        9: { A: Card<"domain"> | null },
        10: { A: Card<"domain"> | null },
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

    // will be overwritten and calculated
    derived_domain_card_vault: Card<"domain">[],
    derived_stats: {
        // from base stats
        traits: Traits
        proficiency: number
        max_experiences: number
        max_domain_card_loadout: number,
        max_hope: number,
        max_armor: number,
        max_hp: number,
        max_stress: number,
        evasion: number
        damage_thresholds: {
            major: number,
            severe: number
        }
        primary_class_mastery_level: number // 0 = none, 1 = foundation, 2 = specialization, 3 = mastery
        secondary_class_mastery_level: number // 0 = none, 1 = foundation, 2 = specialization, 3 = mastery
        experience_modifiers: number[] // index matches the experiences array, value is the modifier
        spellcast_trait: keyof Traits | null
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
    source: Source
    name: string
    image_url: string
    description_html: string
    starting_evasion: number
    starting_max_hp: number
    suggested_traits: Traits
    hope_feature: Feature
    primary_domain: string
    secondary_domain: string
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

export type Modifier = ({
    behavior: "bonus" | "base" | "override"
    min_level: number | null;
    max_level: number | null;
    target: "evasion" | "max_hp" | "max_stress" | "max_experiences" | "major_damage_threshold" | "severe_damage_threshold" | "primary_class_mastery_level" | "secondary_class_mastery_level" | "max_domain_card_loadout" | "max_hope" | "proficiency" | "max_armor"
} | {
    target: "trait"
    trait: keyof Traits
}) & ({
    type: "derived_from_trait"
    trait: keyof Traits
    multiplier: number
} | {
    type: "flat"
    value: number
})

export type Feature = {
    title: string,
    description_html: string,
    modifier_ids: (keyof typeof MODIFIERS)[]
}

export type CardType = "domain" | "ancestry" | "community" | "transformation" | "subclass_foundation" | "subclass_specialization" | "subclass_mastery";
export type Card<T extends CardType> = {
    card_type: T
    image_url: string
    title: string
    description_html: string
    artist_name: string
    features: Feature[]
} & (
        T extends "domain" ? {
            domain_name: string
            level_requirement: number,
            recall_cost: number,
            type: "ability" | "spell"
        } : T extends "subclass_foundation" ? {
            spellcast_trait: keyof Traits | null
            class_name: string
        } : T extends "subclass_specialization" ? {
            class_name: string
        } : T extends "subclass_mastery" ? {
            class_name: string
        } : {}
    )

export type Domain = {
    name: string
    description_html: string
    color: string
    foreground_color: string
    cards: Record<string, Card<"domain">>
}

export type LevelUpChoice = {
    option_id: keyof typeof ALL_LEVEL_UP_OPTIONS | null
    marked_traits: { A: keyof Traits | null, B: keyof Traits | null }
    selected_experiences: { A: number | null, B: number | null }
    selected_domain_card: Card<"domain"> | null,
}
export type LevelUpOption = {
    title: string | null
    short_title: string | null
    max: number
    modifier_ids: (keyof typeof MODIFIERS)[]
}

export type Source = "Core" | "The Void 1.0" | "The Void 1.5"

export type Armor = {
    level_requirement: number,
    title: string,
    description_html: string,
    max_armor: number,
    damage_thresholds: {
        major: number,
        severe: number
    }
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