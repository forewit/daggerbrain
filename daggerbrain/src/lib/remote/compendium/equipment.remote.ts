import { query, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { get_kv, get_auth } from '../utils';
import {
	WeaponSchema,
	ArmorSchema,
	ConsumableSchema,
	LootSchema
} from '@shared/schemas/compendium.schemas';
import type { Weapon, Armor, Consumable, Loot } from '@shared/types/compendium.types';

// Primary Weapons
export const get_all_primary_weapons = query(async () => {
	const event = getRequestEvent();
	get_auth(event); // Validates authentication
	const kv = get_kv(event);

	const weaponsData = (await kv.get('primary-weapons', 'json')) as Record<string, Weapon> | null;

	if (!weaponsData) {
		throw error(404, 'Primary weapons not found');
	}

	// Validate with zod
	const validatedWeapons = Object.entries(weaponsData).reduce(
		(acc, [key, weapon]) => {
			acc[key] = WeaponSchema.parse(weapon);
			return acc;
		},
		{} as Record<string, Weapon>
	);

	console.log('fetched primary weapons from KV');
	return validatedWeapons;
});

export const get_primary_weapon = query(z.string(), async (weaponId) => {
	const weapons = await get_all_primary_weapons();
	const weapon = weapons[weaponId];
	if (!weapon) {
		throw error(404, 'Primary weapon not found');
	}
	console.log('fetched primary weapon from KV');
	return weapon;
});

// Secondary Weapons
export const get_all_secondary_weapons = query(async () => {
	const event = getRequestEvent();
	get_auth(event); // Validates authentication
	const kv = get_kv(event);

	const weaponsData = (await kv.get('secondary-weapons', 'json')) as Record<string, Weapon> | null;

	if (!weaponsData) {
		throw error(404, 'Secondary weapons not found');
	}

	// Validate with zod
	const validatedWeapons = Object.entries(weaponsData).reduce(
		(acc, [key, weapon]) => {
			acc[key] = WeaponSchema.parse(weapon);
			return acc;
		},
		{} as Record<string, Weapon>
	);

	console.log('fetched secondary weapons from KV');
	return validatedWeapons;
});

export const get_secondary_weapon = query(z.string(), async (weaponId) => {
	const weapons = await get_all_secondary_weapons();
	const weapon = weapons[weaponId];
	if (!weapon) {
		throw error(404, 'Secondary weapon not found');
	}
	console.log('fetched secondary weapon from KV');
	return weapon;
});

// Armor
export const get_all_armor = query(async () => {
	const event = getRequestEvent();
	get_auth(event); // Validates authentication
	const kv = get_kv(event);

	const armorData = (await kv.get('armor', 'json')) as Record<string, Armor> | null;

	if (!armorData) {
		throw error(404, 'Armor not found');
	}

	// Validate with zod
	const validatedArmor = Object.entries(armorData).reduce(
		(acc, [key, armor]) => {
			acc[key] = ArmorSchema.parse(armor);
			return acc;
		},
		{} as Record<string, Armor>
	);

	console.log('fetched armor from KV');
	return validatedArmor;
});

export const get_armor = query(z.string(), async (armorId) => {
	const armor = await get_all_armor();
	const armorItem = armor[armorId];
	if (!armorItem) {
		throw error(404, 'Armor not found');
	}
	console.log('fetched armor from KV');
	return armorItem;
});

// Consumables
export const get_all_consumables = query(async () => {
	const event = getRequestEvent();
	get_auth(event); // Validates authentication
	const kv = get_kv(event);

	const consumablesData = (await kv.get('consumables', 'json')) as Record<
		string,
		Consumable
	> | null;

	if (!consumablesData) {
		throw error(404, 'Consumables not found');
	}

	// Validate with zod
	const validatedConsumables = Object.entries(consumablesData).reduce(
		(acc, [key, consumable]) => {
			acc[key] = ConsumableSchema.parse(consumable);
			return acc;
		},
		{} as Record<string, Consumable>
	);

	console.log('fetched consumables from KV');
	return validatedConsumables;
});

export const get_consumable = query(z.string(), async (consumableId) => {
	const consumables = await get_all_consumables();
	const consumable = consumables[consumableId];
	if (!consumable) {
		throw error(404, 'Consumable not found');
	}
	console.log('fetched consumable from KV');
	return consumable;
});

// Loot
export const get_all_loot = query(async () => {
	const event = getRequestEvent();
	get_auth(event); // Validates authentication
	const kv = get_kv(event);

	const lootData = (await kv.get('loot', 'json')) as Record<string, Loot> | null;

	if (!lootData) {
		throw error(404, 'Loot not found');
	}

	// Validate with zod
	const validatedLoot = Object.entries(lootData).reduce(
		(acc, [key, loot]) => {
			acc[key] = LootSchema.parse(loot);
			return acc;
		},
		{} as Record<string, Loot>
	);

	console.log('fetched loot from KV');
	return validatedLoot;
});

export const get_loot = query(z.string(), async (lootId) => {
	const loot = await get_all_loot();
	const lootItem = loot[lootId];
	if (!lootItem) {
		throw error(404, 'Loot not found');
	}
	console.log('fetched loot from KV');
	return lootItem;
});
