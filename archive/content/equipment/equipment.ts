import type { Armor, Consumable, Loot, Weapon } from "$lib/ts/character/types";
import { TIER_1_ARMOR, TIER_2_ARMOR, TIER_3_ARMOR, TIER_4_ARMOR } from "./armor";
import { CONSUMABLES } from "./consumables";
import { LOOT } from "./loot";
import { TIER_1_PRIMARY_WEAPONS, TIER_2_PRIMARY_WEAPONS, TIER_3_PRIMARY_WEAPONS, TIER_4_PRIMARY_WEAPONS } from "./primary-weapons";
import { TIER_1_SECONDARY_WEAPONS, TIER_2_SECONDARY_WEAPONS, TIER_3_SECONDARY_WEAPONS, TIER_4_SECONDARY_WEAPONS } from "./secondary-weapons";

export const PRIMARY_WEAPONS = {
    ...TIER_1_PRIMARY_WEAPONS,
    ...TIER_2_PRIMARY_WEAPONS,
    ...TIER_3_PRIMARY_WEAPONS,
    ...TIER_4_PRIMARY_WEAPONS,
} as const satisfies Record<string, Weapon>;

export const SECONDARY_WEAPONS = {
    ...TIER_1_SECONDARY_WEAPONS,
    ...TIER_2_SECONDARY_WEAPONS,
    ...TIER_3_SECONDARY_WEAPONS,
    ...TIER_4_SECONDARY_WEAPONS
} as const satisfies Record<string, Weapon>;

export const ALL_WEAPONS = {
    ...PRIMARY_WEAPONS,
    ...SECONDARY_WEAPONS,
} as const satisfies Record<string, Weapon>;

export const ALL_ARMOR = {
    ...TIER_1_ARMOR,
    ...TIER_2_ARMOR,
    ...TIER_3_ARMOR,
    ...TIER_4_ARMOR
} as const satisfies Record<string, Armor>;

export const ALL_CONSUMABLES = {
    ...CONSUMABLES,
} as const satisfies Record<string, Consumable>;

export const ALL_LOOT = {
    ...LOOT,
} as const satisfies Record<string, Loot>;