import type { Source, SourceIds } from '$lib/types/compendium-types';

export const SOURCES = {
	'Void 1.5': {
		source_id: 'Void 1.5',
		name: 'Void 1.5',
		short_title: 'Void 1.5'
	},
	SRD: {
		source_id: 'SRD',
		name: 'SRD',
		short_title: 'SRD'
	},
	Homebrew: {
		source_id: 'Homebrew',
		name: 'Homebrew',
		short_title: 'Homebrew'
	},
	Campaign: {
		source_id: 'Campaign',
		name: 'Campaign',
		short_title: 'Campaign'
	}
} as const satisfies Record<SourceIds, Source>;
