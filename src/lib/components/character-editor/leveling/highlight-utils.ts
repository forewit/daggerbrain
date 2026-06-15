import type { getCharacterContext } from '$lib/state/character.svelte';

/**
 * Calculate if the level-up section should be highlighted (indicating incomplete selections).
 * @param character - The character object
 * @param level - The current level
 * @param tiers_to_check - Array of tier prefixes to check (e.g., ["tier_2", "tier_3", "tier_4"])
 * @returns true if the section should be highlighted (has incomplete selections)
 */
export function calculate_highlighted(
	characterCtx: ReturnType<typeof getCharacterContext>,
	level: number,
	tiers_to_check: ('tier_2' | 'tier_3' | 'tier_4')[]
): boolean {
	const character = characterCtx.character;
	const derived_character_data = characterCtx.derived_character_data;
	if (!character || !derived_character_data) return false;

	const choices = character.level_up_choices[level as keyof typeof character.level_up_choices];
	const choiceA = choices.A;
	const choiceB = choices.B;
	const chosen_options =
		derived_character_data.level_up_chosen_options[
			level as keyof typeof derived_character_data.level_up_chosen_options
		];
	const level_up_domain_card =
		character.level_up_domain_card_ids[level as keyof typeof character.level_up_domain_card_ids]?.A;
	const incompleteSubclassLevelUpOption = (
		derived_character_data.subclass_level_up_options[level] ?? []
	).some((option) => {
		const selectedCount = character.subclass_level_up_choices?.[option.option_id]?.length ?? 0;
		return selectedCount < option.max;
	});

	const tier_checks: boolean[] = [];

	for (const tier_prefix of tiers_to_check) {
		const domain_card_option = `${tier_prefix}_domain_card`;
		const traits_option = `${tier_prefix}_traits`;
		const experience_bonus_option = `${tier_prefix}_experience_bonus`;
		const subclass_upgrade_option = `${tier_prefix}_subclass_upgrade`;
		const multiclass_option = `${tier_prefix}_multiclass`;

		tier_checks.push(
			(choiceA?.option_id === domain_card_option && !choiceA.selected_domain_card_id) ||
				(choiceB?.option_id === domain_card_option && !choiceB.selected_domain_card_id)
		);

		tier_checks.push(
			(choiceA?.option_id === traits_option &&
				(!choiceA.marked_traits?.A || !choiceA.marked_traits?.B)) ||
				(choiceB?.option_id === traits_option &&
					(!choiceB.marked_traits?.A || !choiceB.marked_traits?.B))
		);

		tier_checks.push(
			(choiceA?.option_id === experience_bonus_option &&
				(choiceA.selected_experiences?.length ?? 0) < 2) ||
				(choiceB?.option_id === experience_bonus_option &&
					(choiceB.selected_experiences?.length ?? 0) < 2)
		);

		if (tier_prefix === 'tier_3' || tier_prefix === 'tier_4') {
			tier_checks.push(
				(choiceA?.option_id === subclass_upgrade_option && !choiceA.selected_subclass_upgrade) ||
					(choiceB?.option_id === subclass_upgrade_option && !choiceB.selected_subclass_upgrade)
			);
		}

		if (tier_prefix === 'tier_3' || tier_prefix === 'tier_4') {
			tier_checks.push(
				(choiceA?.option_id === multiclass_option &&
					(!character.secondary_class_id ||
						!character.secondary_class_domain_id ||
						!character.secondary_subclass_id)) ||
					(choiceB?.option_id === multiclass_option &&
						(!character.secondary_class_id ||
							!character.secondary_class_domain_id ||
							!character.secondary_subclass_id))
			);
		}
	}

	return (
		((!choiceA?.option_id || !choiceB?.option_id) &&
			!(chosen_options.A?.costs_two_choices || chosen_options.B?.costs_two_choices)) ||
		!level_up_domain_card ||
		incompleteSubclassLevelUpOption ||
		tier_checks.some((check) => check)
	);
}
