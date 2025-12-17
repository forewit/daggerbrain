import { getCharacterContext } from '$lib/state/character.svelte';
import { getCompendiumContext } from '$lib/state/compendium.svelte';
import type { DomainCardId } from '$lib/types/character-types';
import type { DomainCard, DomainIds } from '$lib/types/compendium-types';

/**
 * Calculate previously chosen domain cards up to the given level.
 * @param character - The character object
 * @param level - The current level (up to which to check)
 * @param option_ids_to_check - Array of tier option IDs to check (e.g., ["tier_2_domain_card", "tier_3_domain_card"])
 * @returns Array of previously chosen domain cards
 */
export function get_previously_chosen_domain_card_ids(
	context: ReturnType<typeof getCharacterContext>,
	level: number,
	option_ids_to_check: string[]
): DomainCardId[] {
	if (!context.character) return [];
	const domain_card_ids = Object.values(context.character.level_up_domain_card_ids[1]).filter(
		(id) => id !== null
	);

	for (let i = 2; i <= level; i++) {
		const level_up_domain_card_ids =
			context.character.level_up_domain_card_ids[
				i as keyof typeof context.character.level_up_domain_card_ids
			];
		if (level_up_domain_card_ids.A !== null) domain_card_ids.push(level_up_domain_card_ids.A);

		const choices =
			context.character.level_up_choices[i as keyof typeof context.character.level_up_choices];
		if (option_ids_to_check.includes(choices.A.option_id || '')) {
			if (choices.A.selected_domain_card_id !== null)
				domain_card_ids.push(choices.A.selected_domain_card_id);
		}
		if (option_ids_to_check.includes(choices.B.option_id || '')) {
			if (choices.B.selected_domain_card_id !== null)
				domain_card_ids.push(choices.B.selected_domain_card_id);
		}
	}
	return domain_card_ids;
}

/**
 * Calculate available domain cards based on character's domains.
 * @param primary_class - The primary class object
 * @param secondary_class_domain_id_choice - The secondary class domain ID choice
 * @param level - The current level
 * @param max_level - Maximum level requirement for cards (e.g., 4 for tier-2, 7 for tier-3/4)
 * @param include_secondary_class_domain - Whether to include secondary_class_domain if it exists
 * @returns Array of available domain cards
 */
export function get_available_domain_cards(
	context: ReturnType<typeof getCharacterContext>,
	level: number,
	max_level: number,
	include_secondary_class_domain: boolean = false
): Record<string, DomainCard> {
	if (!context.primary_class || !context.character) return {};
	const primary_domain_id = context.primary_class.primary_domain_id;
	const secondary_domain_id = context.primary_class.secondary_domain_id;
	const secondary_class_domain_id_choice = context.character.secondary_class_domain_id_choice;

	const compendium = getCompendiumContext();
	let domain_cards: Record<string, DomainCard> = {
		...(compendium.domain_cards[primary_domain_id] || {}),
		...(compendium.domain_cards[secondary_domain_id] || {})
	};

	if (
		secondary_class_domain_id_choice &&
		include_secondary_class_domain &&
		secondary_class_domain_id_choice !== primary_domain_id &&
		secondary_class_domain_id_choice !== secondary_domain_id
	) {
		const secondaryDomainCards =
			compendium.domain_cards[secondary_class_domain_id_choice as DomainIds] || {};
		domain_cards = {
			...domain_cards,
			...secondaryDomainCards
		};
	}

	// remove any cards that are not valid for the current level
	for (const [id, card] of Object.entries(domain_cards)) {
		if (card.level_requirement > Math.min(level, max_level)) {
			delete domain_cards[id];
		}
	}

	return domain_cards;
}
