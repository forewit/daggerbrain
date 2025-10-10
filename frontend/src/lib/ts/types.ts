export type Character = {
    uid: string,
    name: string,
    level: number,
    proficiency: number,
    image: string,
    evasion: number,
    damage_thresholds: {
        major: number,
        severe: number
    }
    armor: Slot
    hp: Slot
    stress: Slot
    hope: Slot
    traits: Traits
    heritage: {
        ancestry_card: Card<"ancestry"> | null
        community_card: Card<"community"> | null
    }
    class: Class | null,
    subclass: Subclass | null,
    transformation_card: Card<"transformation"> | null,
    domain_card_loadout: Card<"domain">[],
    domain_card_vault: Card<"domain">[],
}

export type Slot = {
    max: number,
    marked: number
}

export type Domain = {
    name: string
    color: string
    cards: Record<string, Card<"domain">>
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
    name: string
    hope_feature: Feature
    primary_domain: string
    secondary_domain: string
    features: Feature[]
}

export type Subclass = {
    name: string
    foundation_card: Card<"subclass_foundation">
    specialization_card: Card<"subclass_specialization"> | null
    mastery_card: Card<"subclass_mastery"> | null
}


export type Feature = {
    title: string
    description: string
}

export type Card<T extends "domain" | "ancestry" | "community" | "transformation" | "subclass_foundation" | "subclass_specialization" | "subclass_mastery"> = {
    image_url: string
    full_card_image_url: string
    title: string
    description: string
} & (
        T extends "domain" ? {
            level: number,
            recall_cost: number
            features: Feature[]
        } : T extends "ancestry" ? {
            top_feature: Feature
            bottom_feature: Feature
        } : T extends "community" ? {
            features: Feature[]
        } : T extends "transformation" ? {
            features: Feature[]
        } : T extends "subclass_foundation" ? {
            spellcast_trait: keyof Traits | null
            features: Feature[]
        } : T extends "subclass_specialization" ? {
            features: Feature[]
        } : T extends "subclass_mastery" ? {
            features: Feature[]
        } : never
    )