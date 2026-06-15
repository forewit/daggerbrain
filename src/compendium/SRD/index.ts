import type { SourceMetadata } from '../../convex/schemas/sources';
import type { CompendiumContent } from '../../convex/schemas/compendium';
import { COMPENDIUM } from './compendium';

export const SRD_SOURCE_METADATA: SourceMetadata = {
	source_key: 'SRD',
	name: 'System Reference Document',
	short_title: 'SRD'
};

export const SRD_COMPENDIUM: CompendiumContent = COMPENDIUM;
