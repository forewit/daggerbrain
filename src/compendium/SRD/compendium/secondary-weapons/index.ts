import type { SecondaryWeapon } from '../../../../convex/schemas/compendium';
import { TIER_1_SECONDARY_WEAPONS } from './tier-1-secondary-weapons';
import { TIER_2_SECONDARY_WEAPONS } from './tier-2-secondary-weapons';
import { TIER_3_SECONDARY_WEAPONS } from './tier-3-secondary-weapons';
import { TIER_4_SECONDARY_WEAPONS } from './tier-4-secondary-weapons';

export const SECONDARY_WEAPONS = {
	...TIER_1_SECONDARY_WEAPONS,
	...TIER_2_SECONDARY_WEAPONS,
	...TIER_3_SECONDARY_WEAPONS,
	...TIER_4_SECONDARY_WEAPONS
} as const satisfies Record<string, SecondaryWeapon>;
