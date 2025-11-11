import type { Armor } from "$lib/ts/character/types";
import { TIER_1_ARMOR, TIER_2_ARMOR, TIER_3_ARMOR, TIER_4_ARMOR } from "./armor";
import { TIER_1_PRIMARY_WEAPONS, TIER_2_PRIMARY_WEAPONS, TIER_3_PRIMARY_WEAPONS, TIER_4_PRIMARY_WEAPONS } from "./primary-weapons";
import { TIER_1_SECONDARY_WEAPONS, TIER_2_SECONDARY_WEAPONS, TIER_3_SECONDARY_WEAPONS, TIER_4_SECONDARY_WEAPONS } from "./secondary-weapons";


export const PRIMARY_WEAPONS = {
    ...TIER_1_PRIMARY_WEAPONS,
    ...TIER_2_PRIMARY_WEAPONS,
    ...TIER_3_PRIMARY_WEAPONS,
    ...TIER_4_PRIMARY_WEAPONS,
};

export const SECONDARY_WEAPONS = {
    ...TIER_1_SECONDARY_WEAPONS,
    ...TIER_2_SECONDARY_WEAPONS,
    ...TIER_3_SECONDARY_WEAPONS,
    ...TIER_4_SECONDARY_WEAPONS
};

export const ARMOR = {
    ...TIER_1_ARMOR,
    ...TIER_2_ARMOR,
    ...TIER_3_ARMOR,
    ...TIER_4_ARMOR
} as const satisfies Record<string, Armor>;

