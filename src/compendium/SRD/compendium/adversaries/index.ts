import type { Adversary } from '../../../../convex/schemas/compendium';
import { TIER_1_ADVERSARIES } from './tier-1-adversaries';
import { TIER_2_ADVERSARIES } from './tier-2-adversaries';
import { TIER_3_ADVERSARIES } from './tier-3-adversaries';
import { TIER_4_ADVERSARIES } from './tier-4-adversaries';

export const ADVERSARIES = {
	...TIER_1_ADVERSARIES,
	...TIER_2_ADVERSARIES,
	...TIER_3_ADVERSARIES,
	...TIER_4_ADVERSARIES
} as const satisfies Record<string, Adversary>;
