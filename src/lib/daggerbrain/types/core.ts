export enum DICE {
    d4 = 4,
    d6 = 6,
    d8 = 8,
    d10 = 10,
    d12 = 12,
    d20 = 20,
    d100 = 100,
    percent = 100,
    hope = 12,
    fear = 12,
}
 
export enum DAMAGE {
    minor = 1,
    major = 2,
    severe = 3,
}



export type Slot = {
    max: number,
    limit: number,
    current: number
}

export type Trait = {
    modifier: number,
}

export type Traits = {
    agility: Trait,
    strength: Trait,
    Finesse: Trait,
    instinct: Trait,
    pressence: Trait,
    knowledge: Trait
}

export type Gold = {
    handfuls: number,
    bags: number,
    chests: number
}