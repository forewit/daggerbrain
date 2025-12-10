import { query, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { get_kv, get_auth } from './utils';
import { BeastformSchema } from '$lib/compendium/compendium-schemas';
import type { Beastform } from '$lib/types/compendium-types';

// Beastforms
export const get_all_beastforms = query(async () => {
	const event = getRequestEvent();
	get_auth(event); // Validates authentication
	const kv = get_kv(event);

	const beastformsData = (await kv.get('beastforms', 'json')) as Record<string, Beastform> | null;

	if (!beastformsData) {
		throw error(404, 'Beastforms not found');
	}

	// Validate with zod
	const validatedBeastforms = Object.entries(beastformsData).reduce(
		(acc, [key, beastform]) => {
			acc[key] = BeastformSchema.parse(beastform);
			return acc;
		},
		{} as Record<string, Beastform>
	);

	return validatedBeastforms;
});

export const get_beastform = query(z.string(), async (beastformId) => {
	const beastforms = await get_all_beastforms();
	const beastform = beastforms[beastformId];
	if (!beastform) {
		throw error(404, 'Beastform not found');
	}
	return beastform;
});
