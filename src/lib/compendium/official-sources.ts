import { SRD_COMPENDIUM, SRD_SOURCE_METADATA } from '../../compendium/SRD';
// import {
// 	THE_VOID_1_5_COMPENDIUM,
// 	THE_VOID_1_5_SOURCE_METADATA
// } from '../../compendium/the-void-1-5';
import type { CompendiumContent } from '@convex/schemas/compendium';
import type { SourceMetadata } from '@convex/schemas/sources';
import type { SourceKey } from '@convex/schemas/rules';
import { merge_compendium_content } from '$lib/utils';

const OFFICIAL_SOURCE_METADATA = {
	SRD: SRD_SOURCE_METADATA
	// 'The Void 1.5': THE_VOID_1_5_SOURCE_METADATA
} satisfies Partial<Record<SourceKey, SourceMetadata>>;

const OFFICIAL_COMPENDIUMS = {
	SRD: SRD_COMPENDIUM
	// 'The Void 1.5': THE_VOID_1_5_COMPENDIUM
} satisfies Partial<Record<SourceKey, CompendiumContent>>;

export function getOfficialSourceMetadata(sourceKey: SourceKey): SourceMetadata | null {
	return OFFICIAL_SOURCE_METADATA[sourceKey as keyof typeof OFFICIAL_SOURCE_METADATA] ?? null;
}

export function getOfficialSourcesFromKeys(sourceKeys: SourceKey[]): SourceMetadata[] {
	return sourceKeys.flatMap((sourceKey) => {
		const source = OFFICIAL_SOURCE_METADATA[sourceKey as keyof typeof OFFICIAL_SOURCE_METADATA];
		return source ? [source] : [];
	});
}

export function getOfficialCompendiumFromSourceKeys(sourceKeys: SourceKey[]): CompendiumContent {
	return merge_compendium_content(
		...sourceKeys.flatMap((sourceKey) => {
			const compendium = OFFICIAL_COMPENDIUMS[sourceKey as keyof typeof OFFICIAL_COMPENDIUMS];
			return compendium ? [compendium] : [];
		})
	);
}
