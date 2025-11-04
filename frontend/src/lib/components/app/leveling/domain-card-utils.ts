import type { Character, Card } from "$lib/ts/types";
import { DOMAINS } from "$lib/ts/constants/constants";

/**
 * Calculate previously chosen domain cards up to the given level.
 * @param character - The character object
 * @param level - The current level (up to which to check)
 * @param option_ids_to_check - Array of tier option IDs to check (e.g., ["tier_2_domain_card", "tier_3_domain_card"])
 * @returns Array of previously chosen domain cards
 */
export function get_previously_chosen_domain_cards(
  character: Character | null,
  level: number,
  option_ids_to_check: string[]
): Card<"domain">[] {
  if (!character) return [];
  const domain_cards = Object.values(character.level_up_domain_cards[1]).filter(
    (card) => card !== null
  ) as Card<"domain">[];

  for (let i = 2; i <= level; i++) {
    const level_up_domain_cards =
      character.level_up_domain_cards[i as keyof typeof character.level_up_domain_cards];
    if (level_up_domain_cards.A !== null) domain_cards.push(level_up_domain_cards.A);

    const choices = character.level_up_choices[i as keyof typeof character.level_up_choices];
    if (option_ids_to_check.includes(choices.A.option_id || "")) {
      if (choices.A.selected_domain_card !== null)
        domain_cards.push(choices.A.selected_domain_card);
    }
    if (option_ids_to_check.includes(choices.B.option_id || "")) {
      if (choices.B.selected_domain_card !== null)
        domain_cards.push(choices.B.selected_domain_card);
    }
  }
  return domain_cards;
}

/**
 * Calculate available domain cards based on character's domains.
 * @param character - The character object
 * @param level - The current level
 * @param max_level - Maximum level requirement for cards (e.g., 4 for tier-2, 7 for tier-3/4)
 * @param include_secondary_class_domain - Whether to include secondary_class_domain if it exists
 * @returns Array of available domain cards
 */
export function get_available_domain_cards(
  character: Character | null,
  level: number,
  max_level: number,
  include_secondary_class_domain: boolean = false
): Card<"domain">[] {
  if (!character?.primary_class) return [];
  const primary_domain = character.primary_class.primary_domain;
  const secondary_domain = character.primary_class.secondary_domain;
  let domain_cards = Object.values(DOMAINS[primary_domain as keyof typeof DOMAINS].cards).concat(
    Object.values(DOMAINS[secondary_domain as keyof typeof DOMAINS].cards)
  );

  if (
    include_secondary_class_domain &&
    character.secondary_class_domain !== null &&
    character.secondary_class_domain !== primary_domain &&
    character.secondary_class_domain !== secondary_domain
  ) {
    domain_cards = domain_cards.concat(
      Object.values(DOMAINS[character.secondary_class_domain as keyof typeof DOMAINS].cards)
    );
  }

  return domain_cards.filter((card) => card.level_requirement <= Math.min(level, max_level));
}

