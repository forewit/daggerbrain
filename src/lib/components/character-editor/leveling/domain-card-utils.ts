import type { getCharacterContext } from '$lib/state/character.svelte';
import type { Character } from '@convex/schemas/characters';
import type { DomainCard } from '@convex/schemas/compendium';
import type { DomainCardId } from '@convex/schemas/rules';

type DerivedLoadoutState = {
	domain_card_loadout: { id: string }[];
	max_loadout: number;
};

function sameDomainCardId(
	left: DomainCardId | undefined,
	right: DomainCardId | undefined
): boolean {
	return left?.domain_id === right?.domain_id && left?.card_id === right?.card_id;
}

function toDomainCardId(cardId: string, card: DomainCard | undefined): DomainCardId | undefined {
	if (!card) return undefined;
	return {
		domain_id: card.domain_id,
		card_id: cardId
	};
}

function activeSubclassDomainCardSelections(
	characterCtx: ReturnType<typeof getCharacterContext>,
	level: number
): DomainCardId[] {
	const character = characterCtx.character;
	const compendium = characterCtx.character_compendium;
	const derived_character_data = characterCtx.derived_character_data;
	if (!character || !compendium || !derived_character_data) return [];

	const selected: DomainCardId[] = [];
	for (const [grantedLevel, options] of Object.entries(
		derived_character_data.subclass_level_up_options
	)) {
		if (Number(grantedLevel) > level) continue;
		for (const option of options) {
			if (option.type !== 'domain_card') continue;
			for (const cardId of character.subclass_level_up_choices?.[option.option_id] ?? []) {
				const domainCardId = toDomainCardId(cardId, compendium.domain_cards[cardId]);
				if (domainCardId) selected.push(domainCardId);
			}
		}
	}

	return selected;
}

export function get_previously_chosen_domain_card_ids(
	characterCtx: ReturnType<typeof getCharacterContext>,
	level: number,
	option_ids_to_check: string[]
): DomainCardId[] {
	const character = characterCtx.character;
	if (!character) return [];

	const domain_card_ids = Object.values(character.level_up_domain_card_ids[1]).filter(
		(id): id is DomainCardId => id !== null && id !== undefined
	);

	for (let i = 2; i <= level; i++) {
		const level_up_domain_card_ids =
			character.level_up_domain_card_ids[i as keyof typeof character.level_up_domain_card_ids];
		if (level_up_domain_card_ids.A) domain_card_ids.push(level_up_domain_card_ids.A);

		const choices = character.level_up_choices[i as keyof typeof character.level_up_choices];
		const choiceA = choices.A;
		const choiceB = choices.B;
		if (
			choiceA?.option_id &&
			option_ids_to_check.includes(choiceA.option_id) &&
			choiceA.selected_domain_card_id
		) {
			domain_card_ids.push(choiceA.selected_domain_card_id);
		}
		if (
			choiceB?.option_id &&
			option_ids_to_check.includes(choiceB.option_id) &&
			choiceB.selected_domain_card_id
		) {
			domain_card_ids.push(choiceB.selected_domain_card_id);
		}
	}

	domain_card_ids.push(...activeSubclassDomainCardSelections(characterCtx, level));
	return domain_card_ids;
}

export function get_available_domain_cards(
	characterCtx: ReturnType<typeof getCharacterContext>,
	level: number,
	max_level: number,
	include_secondary_class_domain: boolean = false
): Record<string, DomainCard> {
	const character = characterCtx.character;
	const compendium = characterCtx.character_compendium;
	const primary_class = characterCtx.derived_character_data?.primary_class;
	if (!character || !compendium || !primary_class) return {};

	const primary_domain_id = primary_class.primary_domain_id;
	const secondary_domain_id = primary_class.secondary_domain_id;
	const secondary_class_domain_id = character.secondary_class_domain_id;
	let domain_cards = Object.fromEntries(
		Object.entries(compendium.domain_cards).filter(([, card]) => {
			return card.domain_id === primary_domain_id || card.domain_id === secondary_domain_id;
		})
	);

	if (
		secondary_class_domain_id &&
		include_secondary_class_domain &&
		secondary_class_domain_id !== primary_domain_id &&
		secondary_class_domain_id !== secondary_domain_id
	) {
		const secondaryDomainCards = Object.fromEntries(
			Object.entries(compendium.domain_cards).filter(
				([, card]) => card.domain_id === secondary_class_domain_id
			)
		);
		domain_cards = {
			...domain_cards,
			...secondaryDomainCards
		};
	}

	for (const [id, card] of Object.entries(domain_cards)) {
		if (card.level_requirement > Math.min(level, max_level)) {
			delete domain_cards[id];
		}
	}

	return domain_cards;
}

export function auto_add_level_up_domain_card_to_loadout(
	character: Character,
	derived_loadout_state: DerivedLoadoutState,
	previous_selected_card_id: DomainCardId | undefined,
	next_selected_card_id: DomainCardId | undefined
): void {
	if (!next_selected_card_id) return;

	if (character.loadout_domain_card_ids.some((id) => sameDomainCardId(id, next_selected_card_id))) {
		return;
	}

	const previousIndex = character.loadout_domain_card_ids.findIndex((id) =>
		sameDomainCardId(id, previous_selected_card_id)
	);
	if (previousIndex !== -1) {
		character.loadout_domain_card_ids[previousIndex] = next_selected_card_id;
		return;
	}

	if (derived_loadout_state.domain_card_loadout.length >= derived_loadout_state.max_loadout) {
		return;
	}

	character.loadout_domain_card_ids.push(next_selected_card_id);
}
