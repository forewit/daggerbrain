import type { CharacterCondition } from '@convex/schemas/rules';

export function emptyCardChoiceCondition(
	cardId = ''
): Extract<CharacterCondition, { type: 'card_choice' }> {
	return {
		type: 'card_choice',
		card_id: cardId,
		choice_id: '',
		selection_id: ''
	};
}

export function defaultLevelCondition(): Extract<CharacterCondition, { type: 'level' }> {
	return {
		type: 'level',
		min_level: 1,
		max_level: 10
	};
}

export function defaultLoadoutDomainCondition(): Extract<
	CharacterCondition,
	{ type: 'min_loadout_cards_from_domain' }
> {
	return {
		type: 'min_loadout_cards_from_domain',
		domain_id: 'arcana',
		min_cards: 1
	};
}
