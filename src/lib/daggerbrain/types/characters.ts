import type { Gold, Slot, Traits } from "./core";
import type { HopeFeature } from "./features";
import type { Armor, Weapon } from "./items";

export type Character = {
    level: Level,
    details: CharacterDetails,
    heritage: Heritage,
    class: Class,
    stats: Stats,
    experiences: Experience[],
    hopeFeature: HopeFeature,
    equipment: Equipment,
}

export type CharacterDetails = {
    name: string
}

export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type Stats = {
    traits: Traits,
    evasion: number,
    armor: Slot,
    hp: Slot,
    stress: Slot,
    hope: Slot,
    proficiency: Slot,
    damageThresholds: {
        minorToMajor: number
        majorToSevere: number
    }
}

export type Experience = {
    name: string,
    description: string,
    modifier: number, // modifier derived from something??
}


export type Equipment = {
    gold: Gold
    weapons: Weapon[]
    armor: Armor[]
}


export type Class = {
    subclass: Subclass
}

export type Subclass = {}

export type Heritage = {}
