import { eq, inArray } from 'drizzle-orm';
import type { AppDatabase } from '$lib/server/db';
import {
	ancestryCards,
	armor,
	classes,
	classSubclasses,
	communityCards,
	consumables,
	domainCards,
	domains,
	loot,
	transformationCards,
	weapons
} from '../schema';

// ============================================================================
// Domains
// ============================================================================

export async function getAllDomains(db: AppDatabase) {
	return await db.query.domains.findMany();
}

export async function getDomain(db: AppDatabase, domainId: string) {
	return await db.query.domains.findFirst({
		where: eq(domains.id, domainId)
	});
}

export async function getDomainCards(db: AppDatabase, domainId: string) {
	return await db.query.domainCards.findMany({
		where: eq(domainCards.domainId, domainId)
	});
}

export async function getDomainCard(db: AppDatabase, cardId: string) {
	return await db.query.domainCards.findFirst({
		where: eq(domainCards.id, cardId)
	});
}

export async function getAllDomainCards(db: AppDatabase) {
	return await db.query.domainCards.findMany();
}

// ============================================================================
// Classes
// ============================================================================

export async function getAllClasses(db: AppDatabase) {
	return await db.query.classes.findMany();
}

export async function getClass(db: AppDatabase, classId: string) {
	return await db.query.classes.findFirst({
		where: eq(classes.id, classId)
	});
}

export async function getClassSubclasses(db: AppDatabase, classId: string) {
	return await db.query.classSubclasses.findMany({
		where: eq(classSubclasses.classId, classId)
	});
}

export async function getClassSubclass(db: AppDatabase, subclassId: string) {
	return await db.query.classSubclasses.findFirst({
		where: eq(classSubclasses.id, subclassId)
	});
}

// ============================================================================
// Heritage Cards (Ancestry, Community, Transformation)
// ============================================================================

export async function getAllAncestryCards(db: AppDatabase) {
	return await db.query.ancestryCards.findMany();
}

export async function getAncestryCard(db: AppDatabase, cardId: string) {
	return await db.query.ancestryCards.findFirst({
		where: eq(ancestryCards.id, cardId)
	});
}

export async function getAllCommunityCards(db: AppDatabase) {
	return await db.query.communityCards.findMany();
}

export async function getCommunityCard(db: AppDatabase, cardId: string) {
	return await db.query.communityCards.findFirst({
		where: eq(communityCards.id, cardId)
	});
}

export async function getAllTransformationCards(db: AppDatabase) {
	return await db.query.transformationCards.findMany();
}

export async function getTransformationCard(db: AppDatabase, cardId: string) {
	return await db.query.transformationCards.findFirst({
		where: eq(transformationCards.id, cardId)
	});
}

// ============================================================================
// Equipment
// ============================================================================

export async function getAllWeapons(db: AppDatabase) {
	return await db.query.weapons.findMany();
}

export async function getWeapon(db: AppDatabase, weaponId: string) {
	return await db.query.weapons.findFirst({
		where: eq(weapons.id, weaponId)
	});
}

export async function getWeaponsByCategory(db: AppDatabase, category: string) {
	return await db.query.weapons.findMany({
		where: eq(weapons.category, category)
	});
}

export async function getAllArmor(db: AppDatabase) {
	return await db.query.armor.findMany();
}

export async function getArmor(db: AppDatabase, armorId: string) {
	return await db.query.armor.findFirst({
		where: eq(armor.id, armorId)
	});
}

export async function getAllLoot(db: AppDatabase) {
	return await db.query.loot.findMany();
}

export async function getLoot(db: AppDatabase, lootId: string) {
	return await db.query.loot.findFirst({
		where: eq(loot.id, lootId)
	});
}

export async function getAllConsumables(db: AppDatabase) {
	return await db.query.consumables.findMany();
}

export async function getConsumable(db: AppDatabase, consumableId: string) {
	return await db.query.consumables.findFirst({
		where: eq(consumables.id, consumableId)
	});
}

// ============================================================================
// Bulk queries
// ============================================================================

export async function getWeaponsByIds(db: AppDatabase, weaponIds: string[]) {
	if (weaponIds.length === 0) return [];
	return await db.query.weapons.findMany({
		where: inArray(weapons.id, weaponIds)
	});
}

export async function getArmorByIds(db: AppDatabase, armorIds: string[]) {
	if (armorIds.length === 0) return [];
	return await db.query.armor.findMany({
		where: inArray(armor.id, armorIds)
	});
}

export async function getDomainCardsByIds(db: AppDatabase, cardIds: string[]) {
	if (cardIds.length === 0) return [];
	return await db.query.domainCards.findMany({
		where: inArray(domainCards.id, cardIds)
	});
}

