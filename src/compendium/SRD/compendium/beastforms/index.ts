import type { Beastform } from '../../../../convex/schemas/compendium';
import { TIER_4_BEASTFORMS } from './tier-4-beastforms';
import { TIER_3_BEASTFORMS } from './tier-3-beastforms';
import { TIER_2_BEASTFORMS } from './tier-2-beastforms';
import { TIER_1_BEASTFORMS } from './tier-1-beastforms';

export const BEASTFORMS = {
	...TIER_1_BEASTFORMS,
	...TIER_2_BEASTFORMS,
	...TIER_3_BEASTFORMS,
	...TIER_4_BEASTFORMS
} as const satisfies Record<string, Beastform>;
