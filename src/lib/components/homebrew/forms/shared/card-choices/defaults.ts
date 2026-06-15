import type { CardOption } from '@convex/schemas/rules';

export function emptyCardSelection(
	selectionId: string = crypto.randomUUID()
): Extract<
	Extract<CardOption, { type: 'arbitrary' }>['options'][number],
	{ selection_id: string }
> {
	return {
		selection_id: selectionId,
		title: '',
		short_title: ''
	};
}

export function emptyArbitraryCardOption(
	choiceId: string = crypto.randomUUID(),
	selectionId: string = crypto.randomUUID()
): Extract<CardOption, { type: 'arbitrary' }> {
	return {
		type: 'arbitrary',
		choice_id: choiceId,
		max: 1,
		conditional_choice: null,
		options: [emptyCardSelection(selectionId)]
	};
}
