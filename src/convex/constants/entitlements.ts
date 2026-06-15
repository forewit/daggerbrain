import { SRD_SOURCE_METADATA } from '../../compendium/SRD';
//import { THE_VOID_1_5_SOURCE_METADATA } from '../../compendium/the-void-1-5';
import type { SourceKey } from '../schemas/rules';
import type { SourceMetadata } from '../schemas/sources';

export const ADVENTURER_PLAN_SLUG = 'adventurer';
export const FREE_PLAN_SLUG = 'free_user';

export const UNLIMITED_CHARACTERS_FEATURE_SLUG = 'unlimited_characters';
export const UNLIMITED_HOMEBREW_FEATURE_SLUG = 'unlimited_homebrew';

export const CHARACTER_LIMIT = 6;
export const HOMEBREW_LIMIT = 20;

export const OFFICIAL_SOURCE_METADATA: Partial<Record<SourceKey, SourceMetadata>> = {
	SRD: SRD_SOURCE_METADATA
	//'The Void 1.5': THE_VOID_1_5_SOURCE_METADATA
};

export const DEFAULT_UNLOCKED_SOURCES: SourceKey[] = ['SRD' /*, 'The Void 1.5'*/];
