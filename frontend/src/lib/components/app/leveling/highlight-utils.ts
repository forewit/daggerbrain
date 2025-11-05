import type { Character } from "$lib/ts/character/types";
import { ALL_LEVEL_UP_OPTIONS, BLANK_LEVEL_UP_OPTION } from "$lib/ts/constants/rules";

/**
 * Calculate if the level-up section should be highlighted (indicating incomplete selections).
 * @param character - The character object
 * @param level - The current level
 * @param option_ids_to_check - Array of tier prefixes to check (e.g., ["tier_2", "tier_3", "tier_4"])
 * @returns true if the section should be highlighted (has incomplete selections)
 */
export function calculate_highlighted(
  character: Character | null,
  level: number,
  option_ids_to_check: string[]
): boolean {
  if (!character) return false;
  const choices = character.level_up_choices[level as keyof typeof character.level_up_choices];
  const chosen_options = {
    A:
      choices.A.option_id === null
        ? BLANK_LEVEL_UP_OPTION
        : ALL_LEVEL_UP_OPTIONS[choices.A.option_id],
    B:
      choices.B.option_id === null
        ? BLANK_LEVEL_UP_OPTION
        : ALL_LEVEL_UP_OPTIONS[choices.B.option_id],
  };

  // Build checks for each tier in tiers_to_check
  const tier_checks: boolean[] = [];

  for (const tier_prefix of option_ids_to_check) {
    const domain_card_option = `${tier_prefix}_domain_card`;
    const traits_option = `${tier_prefix}_traits`;
    const experience_bonus_option = `${tier_prefix}_experience_bonus`;
    const subclass_upgrade_option = `${tier_prefix}_subclass_upgrade`;
    const multiclass_option = `${tier_prefix}_multiclass`;

    // Check domain_card option
    tier_checks.push(
      (choices.A.option_id === domain_card_option && choices.A.selected_domain_card === null) ||
        (choices.B.option_id === domain_card_option && choices.B.selected_domain_card === null)
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
      (choices.A.option_id === experience_bonus_option &&
        (choices.A.selected_experiences.A === null || choices.A.selected_experiences.B === null)) ||
        (choices.B.option_id === experience_bonus_option &&
          (choices.B.selected_experiences.A === null || choices.B.selected_experiences.B === null))
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
          (character.secondary_class === null ||
            character.secondary_class_domain === null ||
            character.secondary_subclass === null)) ||
          (choices.B.option_id === multiclass_option &&
            (character.secondary_class === null ||
              character.secondary_class_domain === null ||
              character.secondary_subclass === null))
      );
    }
  }

  return (
    ((choices.A.option_id === null || choices.B.option_id === null) &&
      !(chosen_options.A.costs_two_choices || chosen_options.B.costs_two_choices)) ||
    character.level_up_domain_cards[level as keyof typeof character.level_up_domain_cards].A ===
      null ||
    tier_checks.some((check) => check)
  );
}

