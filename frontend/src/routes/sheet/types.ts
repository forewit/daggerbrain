export type character = {
    name: string,
    level: number,
    proficiency: number,

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
    ancestry: Ancestry,
    community: Community,
    transformation: Transformation,
    class: Class,
    subclass: Subclass,
}

export type Slot = {
    max: number,
    marked: number
}

export type Domain = {
    name: string
    cards: DomainCard[]
}

export type DomainCard = {
    name: string
    level: number
    recall_cost: number
    features: Feature[]
}

export type Traits = {
    agility: number,
    strength: number,
    finesse: number,
    instinct: number,
    presence: number,
    knowledge: number
}

export type Ancestry = {
    top_feature: Feature
    bottom_feature: Feature
}

export type Community = {
    description: string
    features: Feature[]
}

export type Transformation = {
    features: Feature[]
}

export type Class = {
    name: string
    primary_domain: string
    secondary_domain: string
    features: Feature[]
}

export type Subclass = {
    name: string
    spellcast_trait: keyof Traits | null
    foundation_features: Feature[]
    specialization_features: Feature[]
    mastery_features: Feature[]
}


export type Feature = {
    title: string
    description: string
}