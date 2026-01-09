import { query, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { get_kv, get_auth } from '../utils';
import {
	DomainIdsSchema,
	DomainCardSchema,
	DomainSchema
} from '$lib/compendium/compendium-schemas';
import type { Domain, DomainCard, DomainIds } from '$lib/types/compendium-types';

export const get_all_domains = query(async () => {
	const event = getRequestEvent();
	get_auth(event); // Validates authentication
	const kv = get_kv(event);

	const domainsData = (await kv.get('domains', 'json')) as Record<string, Domain> | null;

	if (!domainsData) {
		throw error(404, 'Domains not found');
	}

	// Validate with zod
	const validatedDomains = Object.entries(domainsData).reduce(
		(acc, [key, domain]) => {
			acc[key] = DomainSchema.parse(domain);
			return acc;
		},
		{} as Record<string, Domain>
	);

	console.log('fetched domains from KV');
	return validatedDomains;
});

export const get_domain = query(z.string(), async (domainId) => {
	const domains = await get_all_domains();
	const domain = domains[domainId];
	if (!domain) {
		throw error(404, 'Domain not found');
	}
	console.log('fetched domain from KV');
	return domain;
});

export const get_domain_cards = query(DomainIdsSchema, async (domainId) => {
	const event = getRequestEvent();
	get_auth(event); // Validates authentication
	const kv = get_kv(event);

	const kvKey = `${domainId}-cards`;
	const cardsData = (await kv.get(kvKey, 'json')) as Record<string, DomainCard> | null;

	if (!cardsData) {
		throw error(404, `Domain cards not found`);
	}

	// Validate with zod
	const validatedCards = Object.entries(cardsData).reduce(
		(acc, [key, card]) => {
			acc[key] = DomainCardSchema.parse(card);
			return acc;
		},
		{} as Record<string, DomainCard>
	);

	console.log(`fetched ${domainId} domain cards from KV`);
	return validatedCards;
});

export const get_domain_card = query(
	z.object({ domainId: DomainIdsSchema, cardId: z.string() }),
	async ({ domainId, cardId }) => {
		const cards = await get_domain_cards(domainId);
		if (!cards || !cards[cardId]) {
			throw error(404, 'Domain card not found');
		}
		console.log('fetched domain card from KV');
		return cards[cardId];
	}
);
