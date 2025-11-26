import { getContentContext } from '../content/store';
import type { Armor, Card, Class, Consumable, Loot, Weapon } from './types';

function getContent() {
	return getContentContext();
}

export function get_ancestry_card(ancestry_card_id: string | null | undefined): Card<'ancestry'> | null {
	if (!ancestry_card_id) return null;
	const content = getContent();
	return content.ancestryCards[ancestry_card_id] || null;
}

export function get_community_card(community_card_id: string | null | undefined): Card<'community'> | null {
	if (!community_card_id) return null;
	const content = getContent();
	return content.communityCards[community_card_id] || null;
}

export function get_transformation_card(transformation_card_id: string | null | undefined): Card<'transformation'> | null {
	if (!transformation_card_id) return null;
	const content = getContent();
	return content.transformationCards[transformation_card_id] || null;
}

export function get_class(class_id: string | null | undefined): Class | null {
	if (!class_id) return null;
	const content = getContent();
	return content.classes[class_id] || null;
}

export function get_armor(armor_id: string | null | undefined): Armor | null {
	if (!armor_id) return null;
	const content = getContent();
	return content.armor[armor_id] || null;
}

export function get_weapon(weapon_id: string | null | undefined): Weapon | null {
	if (!weapon_id) return null;
	const content = getContent();
	return content.weapons[weapon_id] || null;
}

export function get_domain_card(domain_card_id: string | null | undefined): Card<'domain'> | null {
	if (!domain_card_id) return null;
	const content = getContent();
	// loop through each domain and check if the card is in the cards object
	for (const domain of Object.values(content.domains)) {
		const card = domain.cards[domain_card_id];
		if (card) return card;
	}
	return null;
}

export function get_all_primary_weapons(): Weapon[] {
	const content = getContent();
	return Object.values(content.weapons).filter((w) => w.category === 'Primary');
}

export function get_all_secondary_weapons(): Weapon[] {
	const content = getContent();
	return Object.values(content.weapons).filter((w) => w.category === 'Secondary');
}

export function get_all_weapons(): Weapon[] {
	const content = getContent();
	return Object.values(content.weapons);
}

export function get_all_armor(): Armor[] {
	const content = getContent();
	return Object.values(content.armor);
}

export function get_all_consumables(): Consumable[] {
	const content = getContent();
	return Object.values(content.consumables);
}

export function get_all_loot(): Loot[] {
	const content = getContent();
	return Object.values(content.loot);
}

export function get_consumable(consumable_id: string | null | undefined): Consumable | null {
	if (!consumable_id) return null;
	const content = getContent();
	return content.consumables[consumable_id] || null;
}

export function get_loot(loot_id: string | null | undefined): Loot | null {
	if (!loot_id) return null;
	const content = getContent();
	return content.loot[loot_id] || null;
}