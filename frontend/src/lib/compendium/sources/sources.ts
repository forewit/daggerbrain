import type { Source, SourceIds } from '$lib/types/compendium-types';

export const SOURCES = {
	'Void 1.5': {
		id: 'Void 1.5',
		name: 'Void 1.5',
		short_title: 'Void 1.5'
	},
	SRD: {
		id: 'SRD',
		name: 'SRD',
		short_title: 'SRD'
	},
	Homebrew: {
		id: 'Homebrew',
		name: 'Homebrew',
		short_title: 'Homebrew'
	}
} as const satisfies Record<SourceIds, Source>;
