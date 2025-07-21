import type { Feature } from "./features"

export type Item = {
    active: boolean
    name: string
    feature: Feature
    // todo
}
export type Weapon = Item & {
    // todo
}
export type Armor = Item & {
    // todo
}