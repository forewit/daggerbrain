import type { CompendiumContent } from '@convex/schemas/compendium';
import { getContext, setContext } from 'svelte';
import { useQuery } from 'convex-svelte';
import { api } from '@convex/_generated/api';
import { getUserContext } from './user.svelte';
import type { SourceKey } from '@convex/schemas/rules';
import {
	getOfficialCompendiumFromSourceKeys,
	getOfficialSourcesFromKeys
} from '$lib/compendium/official-sources';

function createSources() {
	const userContext = getUserContext();

	const sourcesQuery = useQuery(api.functions.sources.list, () => (userContext.user ? {} : 'skip'));
	const sourceKeys: SourceKey[] = $derived((sourcesQuery.data ?? []).map((s) => s.source_key));
	const sources = $derived(getOfficialSourcesFromKeys(sourceKeys));
	const isReady = $derived(!userContext.user || sourcesQuery.data !== undefined);
	const isLoading = $derived(
		userContext.isLoading ||
			(!!userContext.user && sourcesQuery.data === undefined && !sourcesQuery.error)
	);
	const error = $derived(sourcesQuery.error);

	const compendium: CompendiumContent = $derived(getCompendiumFromSourceKeys(...sourceKeys));

	function getCompendiumFromSourceKeys(...source_keys: SourceKey[]): CompendiumContent {
		return getOfficialCompendiumFromSourceKeys(source_keys);
	}

	return {
		get isLoading() {
			return isLoading;
		},
		get error() {
			return error;
		},
		get compendium() {
			return compendium;
		},
		get sources() {
			return sources;
		},

		getCompendiumFromSourceKeys
	};
}

const SOURCES_KEY = Symbol('Sources');

export const setSourcesContext = () => {
	const newSources = createSources();
	return setContext(SOURCES_KEY, newSources);
};

export const getSourcesContext = (): ReturnType<typeof setSourcesContext> => {
	return getContext(SOURCES_KEY);
};
