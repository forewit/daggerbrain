import { query, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { SourcesSchema } from '$lib/compendium/compendium-schemas';
import type { Source } from '$lib/types/compendium-types';
import { get_kv, get_userId } from './utils';

export const get_all_sources = query(async () => {
	const event = getRequestEvent();
	get_userId(event);
	const kv = get_kv(event);

	const sourcesData = (await kv.get('sources', 'json')) as Record<string, Source> | null;

	if (!sourcesData) {
		throw error(404, 'Sources not found');
	}

	// Validate with zod
	const validatedSources = Object.entries(sourcesData).reduce(
		(acc, [key, source]) => {
			acc[key] = SourcesSchema.parse(source);
			return acc;
		},
		{} as Record<string, Source>
	);

	return validatedSources;
});
