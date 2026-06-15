import type { PrimaryWeapon } from '../../../../convex/schemas/compendium';
import { TIER_1_PRIMARY_WEAPONS } from './tier-1-primary-weapons';
import { TIER_2_PRIMARY_WEAPONS } from './tier-2-primary-weapons';
import { TIER_3_PRIMARY_WEAPONS } from './tier-3-primary-weapons';
import { TIER_4_PRIMARY_WEAPONS } from './tier-4-primary-weapons';

export const PRIMARY_WEAPONS = {
	...TIER_1_PRIMARY_WEAPONS,
	...TIER_2_PRIMARY_WEAPONS,
	...TIER_3_PRIMARY_WEAPONS,
	...TIER_4_PRIMARY_WEAPONS
} as const satisfies Record<string, PrimaryWeapon>;
