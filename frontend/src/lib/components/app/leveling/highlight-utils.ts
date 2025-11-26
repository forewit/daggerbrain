import type { getCharacterContext } from "$lib/state/character.svelte";

/**
 * Calculate if the level-up section should be highlighted (indicating incomplete selections).
 * @param character - The character object
 * @param level - The current level
 * @param tiers_to_check - Array of tier prefixes to check (e.g., ["tier_2", "tier_3", "tier_4"])
 * @returns true if the section should be highlighted (has incomplete selections)
 */
export function calculate_highlighted(
  context: ReturnType<typeof getCharacterContext>,
  level: number,
  tiers_to_check: ("tier_2" | "tier_3" | "tier_4")[]
): boolean {
  const character = context.character
  if (!character) return false;
  const choices = character.level_up_choices[level as keyof typeof character.level_up_choices];
  const chosen_options = context.level_up_chosen_options[level as keyof typeof context.level_up_chosen_options];

  // Build checks for each tier in tiers_to_check
  const tier_checks: boolean[] = [];

  for (const tier_prefix of tiers_to_check) {
    const domain_card_option = `${tier_prefix}_domain_card`;
    const traits_option = `${tier_prefix}_traits`;
    const experience_bonus_option = `${tier_prefix}_experience_bonus`;
    const subclass_upgrade_option = `${tier_prefix}_subclass_upgrade`;
    const multiclass_option = `${tier_prefix}_multiclass`;

    // Check domain_card option
    tier_checks.push(
      (choices.A.option_id === domain_card_option && choices.A.selected_domain_card_id === null) ||
      (choices.B.option_id === domain_card_option && choices.B.selected_domain_card_id === null)
    );

    // Check traits option
    tier_checks.push(
      (choices.A.option_id === traits_option &&
        (choices.A.marked_traits.A === null || choices.A.marked_traits.B === null)) ||
      (choices.B.option_id === traits_option &&
        (choices.B.marked_traits.A === null || choices.B.marked_traits.B === null))
    );

    // Check experience_bonus option
    tier_checks.push(
      (choices.A.option_id === experience_bonus_option && choices.A.selected_experiences.length < 2) ||
      (choices.B.option_id === experience_bonus_option && choices.B.selected_experiences.length < 2)
    );

    // Check subclass_upgrade option (only for tier_3 and tier_4)
    if (tier_prefix === "tier_3" || tier_prefix === "tier_4") {
      tier_checks.push(
        (choices.A.option_id === subclass_upgrade_option &&
          choices.A.selected_subclass_upgrade === null) ||
        (choices.B.option_id === subclass_upgrade_option &&
          choices.B.selected_subclass_upgrade === null)
      );
    }

    // Check multiclass option (only for tier_3 and tier_4)
    if (tier_prefix === "tier_3" || tier_prefix === "tier_4") {
      tier_checks.push(
        (choices.A.option_id === multiclass_option &&
          (character.secondary_class_id === null ||
            character.secondary_class_domain_id_choice === null ||
            character.secondary_subclass_id === null)) ||
        (choices.B.option_id === multiclass_option &&
          (character.secondary_class_id === null ||
            character.secondary_class_domain_id_choice === null ||
            character.secondary_subclass_id === null))
      );
    }
  }

  return (
    ((choices.A.option_id === null || choices.B.option_id === null) &&
      !(chosen_options.A?.costs_two_choices || chosen_options.B?.costs_two_choices)) ||
    character.level_up_domain_card_ids[level as keyof typeof character.level_up_domain_card_ids].A ===
    null ||
    tier_checks.some((check) => check)
  );
}

