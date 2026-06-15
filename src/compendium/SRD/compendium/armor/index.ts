import type { Armor } from '../../../../convex/schemas/compendium';
import { TIER_1_ARMOR } from './tier-1-armor';
import { TIER_2_ARMOR } from './tier-2-armor';
import { TIER_3_ARMOR } from './tier-3-armor';
import { TIER_4_ARMOR } from './tier-4-armor';

export const ARMOR = {
	...TIER_1_ARMOR,
	...TIER_2_ARMOR,
	...TIER_3_ARMOR,
	...TIER_4_ARMOR
} as const satisfies Record<string, Armor>;
