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
        max_experiences: 2
        max_domain_card_loadout: 5
        max_hope: 6
        max_armor: 0
        max_hp: 0
        max_stress: 0
        evasion: 0
        damage_thresholds: {
            major: 0,
            severe: 0,
        }
        primary_class_mastery_level: 0
        secondary_class_mastery_level: 0
    }

    // heritage
    ancestry_card: Card<"ancestry"> | null
    community_card: Card<"community"> | null
    experiences: Experience[],

    // classes
    primary_class: Class | null
    primary_subclass: Subclass | null
    secondary_class: Class | null
    secondary_subclass: Subclass | null

    // the void / other
    transformation_card: Card<"transformation"> | null,
    additional_cards: Card<any>[],
    additional_features: Feature[]

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
    level_up_choices: LevelUpOption[][],
    tier_2_marked_traits: (keyof Traits)[],
    tier_3_marked_traits: (keyof Traits)[],
    tier_4_marked_traits: (keyof Traits)[],

    // will be overwritten and calculated
    derived_features: Feature[]
    derieved_stats: {
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

        // other 
        domain_card_vault: Card<"domain">[],
        spellcast_trait: keyof Traits | null
    }
}

export type Traits = {
    agility: number,
    strength: number,
    finesse: number,
    instinct: number,
    presence: number,
    knowledge: number
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

export type Experience = {
    title: string
    modifier: number
}

export type Feature = {
    title: string
    description_html: string
    add_class_domain_card_to_vault?: Card<"domain">[]
    add_any_domain_card_to_vault?: Card<"domain">[]
    modifiers?: Modifier[]
    overrides?: Modifier[]
}

export type Modifier = ({
    min_level: number; // -1 = no limit
    max_level: number; // -1 = no limit
    target: "trait" | "evasion" | "max_hp" | "max_stress" | "max_experiences" | "major_damage_threshold" | "severe_damage_threshold" | "primary_class_mastery_level" | "secondary_class_mastery_level" | "max_domain_card_loadout" | "max_hope"
} | {
    target: "experience"
    experience_name: string
}) & ({
    type: "derived_from_trait"
    trait: keyof Traits
    multiplier: number // always rounded up
} | {
    type: "flat"
    value: number
})

export type Card<T extends "domain" | "ancestry" | "community" | "transformation" | "subclass_foundation" | "subclass_specialization" | "subclass_mastery"> = {
    image_url: string
    full_card_image_url: string
    title: string
    description_html: string
    artist_name: string
    features: Feature[]
} & (
        T extends "domain" ? {
            level_requirement: number,
            recall_cost: number,
            type: "ability" | "spell"
        } : T extends "subclass_foundation" ? {
            spellcast_trait: keyof Traits | null
        } : unknown
    )

export type Domain = {
    name: string
    color: string
    cards: Record<string, Card<"domain">>
}

export type LevelUpOption = {
    id: string
    title: string
    short_title: string
    max: number
    marked_traits: (keyof Traits | "")[]
    experience_indexes: number[]
    domain_cards_added: Card<"domain">[]
    features: Feature[]
}

export type Source = "Core" | "The Void 1.0" | "The Void 1.5"