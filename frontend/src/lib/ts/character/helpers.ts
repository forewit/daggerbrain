import { ANCESTRY_CARDS, COMMUNITY_CARDS, TRANSFORMATION_CARDS } from "../constants/cards";
import { CLASSES, DOMAINS } from "../constants/constants";
import { ARMOR, WEAPONS } from "../constants/equipment";
import type { Armor, Card, Class, Weapon } from "./types";


export function get_ancestry_card(ancestry_card_id: string | null | undefined): Card<"ancestry"> | null {
    if (!ancestry_card_id) return null;
    return ANCESTRY_CARDS[ancestry_card_id as keyof typeof ANCESTRY_CARDS] || null;
}

export function get_community_card(community_card_id: string | null | undefined): Card<"community"> | null {
    if (!community_card_id) return null;
    return COMMUNITY_CARDS[community_card_id as keyof typeof COMMUNITY_CARDS] || null;
}
export function get_transformation_card(transformation_card_id: string | null | undefined): Card<"transformation"> | null {
    if (!transformation_card_id) return null;
    return TRANSFORMATION_CARDS[transformation_card_id as keyof typeof TRANSFORMATION_CARDS] || null;
}

export function get_class(class_id: string | null | undefined): Class | null {
    if (!class_id) return null;
    return CLASSES[class_id as keyof typeof CLASSES] || null;
}

export function get_armor(armor_id: string | null | undefined): Armor | null {
    if (!armor_id) return null;
    return ARMOR[armor_id as keyof typeof ARMOR] || null;
}

export function get_weapon(weapon_id: string | null | undefined): Weapon | null {
    if (!weapon_id) return null;
    return WEAPONS[weapon_id as keyof typeof WEAPONS] || null;
}

export function get_domain_card(domain_card_id: string | null | undefined): Card<"domain"> | null {
    if (!domain_card_id) return null;
    // loop through each domain and check if the card is in the cards object
    for (const domain of Object.values(DOMAINS)) {
        const card = domain.cards[domain_card_id as keyof typeof domain.cards];
        if (card) return card;
    }
    return null;
}