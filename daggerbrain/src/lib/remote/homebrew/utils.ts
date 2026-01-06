import { eq, and, count } from 'drizzle-orm';
import type { get_db } from '../utils';
import {
	homebrew_primary_weapons,
	homebrew_secondary_weapons,
	homebrew_armor,
	homebrew_loot,
	homebrew_consumables,
	homebrew_beastforms,
	homebrew_classes,
	homebrew_subclasses,
	homebrew_domain_cards,
	homebrew_ancestry_cards,
	homebrew_community_cards,
	homebrew_transformation_cards
} from '$lib/server/db/homebrew.schema';

export const HOMEBREW_LIMIT = 5;

// Helper function to verify ownership
export async function verifyOwnership(
	db: ReturnType<typeof get_db>,
	table: any,
	id: string,
	userId: string
): Promise<boolean> {
	const [entry] = await db
		.select()
		.from(table)
		.where(and(eq(table.id, id), eq(table.clerk_user_id, userId)))
		.limit(1);
	return !!entry;
}

// Helper function to count total homebrew items across all tables
export async function getTotalHomebrewCount(
	db: ReturnType<typeof get_db>,
	userId: string
): Promise<number> {
	const [
		primaryResult,
		secondaryResult,
		armorResult,
		lootResult,
		consumablesResult,
		beastformsResult,
		classesResult,
		subclassesResult,
		domainCardsResult,
		ancestryCardsResult,
		communityCardsResult,
		transformationCardsResult
	] = await Promise.all([
		db
			.select({ count: count() })
			.from(homebrew_primary_weapons)
			.where(eq(homebrew_primary_weapons.clerk_user_id, userId)),
		db
			.select({ count: count() })
			.from(homebrew_secondary_weapons)
			.where(eq(homebrew_secondary_weapons.clerk_user_id, userId)),
		db
			.select({ count: count() })
			.from(homebrew_armor)
			.where(eq(homebrew_armor.clerk_user_id, userId)),
		db
			.select({ count: count() })
			.from(homebrew_loot)
			.where(eq(homebrew_loot.clerk_user_id, userId)),
		db
			.select({ count: count() })
			.from(homebrew_consumables)
			.where(eq(homebrew_consumables.clerk_user_id, userId)),
		db
			.select({ count: count() })
			.from(homebrew_beastforms)
			.where(eq(homebrew_beastforms.clerk_user_id, userId)),
		db
			.select({ count: count() })
			.from(homebrew_classes)
			.where(eq(homebrew_classes.clerk_user_id, userId)),
		db
			.select({ count: count() })
			.from(homebrew_subclasses)
			.where(eq(homebrew_subclasses.clerk_user_id, userId)),
		db
			.select({ count: count() })
			.from(homebrew_domain_cards)
			.where(eq(homebrew_domain_cards.clerk_user_id, userId)),
		db
			.select({ count: count() })
			.from(homebrew_ancestry_cards)
			.where(eq(homebrew_ancestry_cards.clerk_user_id, userId)),
		db
			.select({ count: count() })
			.from(homebrew_community_cards)
			.where(eq(homebrew_community_cards.clerk_user_id, userId)),
		db
			.select({ count: count() })
			.from(homebrew_transformation_cards)
			.where(eq(homebrew_transformation_cards.clerk_user_id, userId))
	]);

	return (
		Number(primaryResult[0]?.count ?? 0) +
		Number(secondaryResult[0]?.count ?? 0) +
		Number(armorResult[0]?.count ?? 0) +
		Number(lootResult[0]?.count ?? 0) +
		Number(consumablesResult[0]?.count ?? 0) +
		Number(beastformsResult[0]?.count ?? 0) +
		Number(classesResult[0]?.count ?? 0) +
		Number(subclassesResult[0]?.count ?? 0) +
		Number(domainCardsResult[0]?.count ?? 0) +
		Number(ancestryCardsResult[0]?.count ?? 0) +
		Number(communityCardsResult[0]?.count ?? 0) +
		Number(transformationCardsResult[0]?.count ?? 0)
	);
}
