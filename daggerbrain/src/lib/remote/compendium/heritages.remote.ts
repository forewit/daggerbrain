import { query, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { get_kv, get_auth } from '../utils';
import {
	AncestryCardSchema,
	CommunityCardSchema,
	TransformationCardSchema
} from '$lib/compendium/compendium-schemas';
import type { AncestryCard, CommunityCard, TransformationCard } from '$lib/types/compendium-types';

// Ancestry Cards
export const get_all_ancestry_cards = query(async () => {
	const event = getRequestEvent();
	get_auth(event); // Validates authentication
	const kv = get_kv(event);

	const cardsData = (await kv.get('ancestry-cards', 'json')) as Record<string, AncestryCard> | null;

	if (!cardsData) {
		throw error(404, 'Ancestry cards not found');
	}

	// Validate with zod
	const validatedCards = Object.entries(cardsData).reduce(
		(acc, [key, card]) => {
			acc[key] = AncestryCardSchema.parse(card);
			return acc;
		},
		{} as Record<string, AncestryCard>
	);

	console.log('fetched ancestry cards from KV');
	return validatedCards;
});

export const get_ancestry_card = query(z.string(), async (ancestryCardId) => {
	const cards = await get_all_ancestry_cards();
	const card = cards[ancestryCardId];
	if (!card) {
		throw error(404, 'Ancestry card not found');
	}
	console.log('fetched ancestry card from KV');
	return card;
});

// Community Cards
export const get_all_community_cards = query(async () => {
	const event = getRequestEvent();
	get_auth(event); // Validates authentication
	const kv = get_kv(event);

	const cardsData = (await kv.get('community-cards', 'json')) as Record<
		string,
		CommunityCard
	> | null;

	if (!cardsData) {
		throw error(404, 'Community cards not found');
	}

	// Validate with zod
	const validatedCards = Object.entries(cardsData).reduce(
		(acc, [key, card]) => {
			acc[key] = CommunityCardSchema.parse(card);
			return acc;
		},
		{} as Record<string, CommunityCard>
	);

	console.log('fetched community cards from KV');
	return validatedCards;
});

export const get_community_card = query(z.string(), async (communityCardId) => {
	const cards = await get_all_community_cards();
	const card = cards[communityCardId];
	if (!card) {
		throw error(404, 'Community card not found');
	}
	console.log('fetched community card from KV');
	return card;
});

// Transformation Cards
export const get_all_transformation_cards = query(async () => {
	const event = getRequestEvent();
	get_auth(event); // Validates authentication
	const kv = get_kv(event);

	const cardsData = (await kv.get('transformation-cards', 'json')) as Record<
		string,
		TransformationCard
	> | null;

	if (!cardsData) {
		throw error(404, 'Transformation cards not found');
	}

	// Validate with zod
	const validatedCards = Object.entries(cardsData).reduce(
		(acc, [key, card]) => {
			acc[key] = TransformationCardSchema.parse(card);
			return acc;
		},
		{} as Record<string, TransformationCard>
	);

	console.log('fetched transformation cards from KV');
	return validatedCards;
});

export const get_transformation_card = query(z.string(), async (transformationCardId) => {
	const cards = await get_all_transformation_cards();
	const card = cards[transformationCardId];
	if (!card) {
		throw error(404, 'Transformation card not found');
	}
	console.log('fetched transformation card from KV');
	return card;
});
