import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { campaign_homebrew_vault_table } from '../../server/db/campaigns.schema';
import { get_db, get_auth } from '../utils';
import { getCampaignAccessInternal } from '../../server/permissions';
import type { HomebrewType } from '@shared/types/homebrew.types';
import type {
	AncestryCard,
	Armor,
	Beastform,
	CharacterClass,
	CommunityCard,
	CompendiumContent,
	Consumable,
	Domain,
	DomainCard,
	DomainIds,
	Loot,
	Subclass,
	TransformationCard,
	Weapon
} from '@shared/types/compendium.types';
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
} from '../../server/db/homebrew.schema';

// ============================================================================
// Queries
// ============================================================================

export const get_campaign_homebrew_vault = query(
	z.string(),
	async (
		campaignId
	): Promise<Array<{ id: string; homebrew_type: HomebrewType; homebrew_id: string }>> => {
		const event = getRequestEvent();
		const db = get_db(event);
		const { userId } = get_auth(event);

		// Verify user is a member of the campaign
		const access = await getCampaignAccessInternal(db, userId, campaignId);
		if (!access.canView) {
			throw error(403, 'Forbidden: Not a member of this campaign.');
		}

		const vaultItems = await db
			.select()
			.from(campaign_homebrew_vault_table)
			.where(eq(campaign_homebrew_vault_table.campaign_id, campaignId));

		console.log('fetched campaign homebrew vault from D1');
		return vaultItems.map((item) => ({
			id: item.id,
			homebrew_type: item.homebrew_type as HomebrewType,
			homebrew_id: item.homebrew_id
		}));
	}
);

// Get all campaign homebrew items merged by type (for compendium integration)
export const get_campaign_homebrew_items = query(z.string(), async (campaignId) => {
	const event = getRequestEvent();
	const db = get_db(event);
	const { userId } = get_auth(event);

	// Verify user is a member of the campaign
	const access = await getCampaignAccessInternal(db, userId, campaignId);
	if (!access.canView) {
		throw error(403, 'Forbidden: Not a member of this campaign.');
	}

	// Get vault items
	const vaultItems = await db
		.select()
		.from(campaign_homebrew_vault_table)
		.where(eq(campaign_homebrew_vault_table.campaign_id, campaignId));

	// Group by type and fetch items
	const result: CompendiumContent = {
		primary_weapons: {},
		secondary_weapons: {},
		armor: {},
		loot: {},
		consumables: {},
		beastforms: {},
		classes: {},
		subclasses: {},
		domains: {},
		domain_cards: {
			arcana: {},
			blade: {},
			bone: {},
			codex: {},
			grace: {},
			midnight: {},
			sage: {},
			splendor: {},
			valor: {}
		},
		ancestry_cards: {},
		community_cards: {},
		transformation_cards: {}
	};

	// Group vault items by type for batch fetching
	const itemsByType: Record<string, string[]> = {};
	for (const vaultItem of vaultItems) {
		const type = vaultItem.homebrew_type;
		if (!itemsByType[type]) itemsByType[type] = [];
		itemsByType[type].push(vaultItem.homebrew_id);
	}

	// Batch fetch all types in parallel (only query types that have items)
	const [
		primaryWeapons,
		secondaryWeapons,
		armors,
		loots,
		consumables,
		beastforms,
		classes,
		subclasses,
		domainCards,
		ancestryCards,
		communityCards,
		transformationCards
	] = await Promise.all([
		// Primary weapons (weapon type checks both tables)
		itemsByType['weapon']?.length
			? db
					.select()
					.from(homebrew_primary_weapons)
					.where(inArray(homebrew_primary_weapons.id, itemsByType['weapon']))
			: Promise.resolve([]),
		// Secondary weapons (same IDs, different table)
		itemsByType['weapon']?.length
			? db
					.select()
					.from(homebrew_secondary_weapons)
					.where(inArray(homebrew_secondary_weapons.id, itemsByType['weapon']))
			: Promise.resolve([]),
		// Armor
		itemsByType['armor']?.length
			? db.select().from(homebrew_armor).where(inArray(homebrew_armor.id, itemsByType['armor']))
			: Promise.resolve([]),
		// Loot
		itemsByType['loot']?.length
			? db.select().from(homebrew_loot).where(inArray(homebrew_loot.id, itemsByType['loot']))
			: Promise.resolve([]),
		// Consumables
		itemsByType['consumable']?.length
			? db
					.select()
					.from(homebrew_consumables)
					.where(inArray(homebrew_consumables.id, itemsByType['consumable']))
			: Promise.resolve([]),
		// Beastforms
		itemsByType['beastform']?.length
			? db
					.select()
					.from(homebrew_beastforms)
					.where(inArray(homebrew_beastforms.id, itemsByType['beastform']))
			: Promise.resolve([]),
		// Classes
		itemsByType['class']?.length
			? db.select().from(homebrew_classes).where(inArray(homebrew_classes.id, itemsByType['class']))
			: Promise.resolve([]),
		// Subclasses
		itemsByType['subclass']?.length
			? db
					.select()
					.from(homebrew_subclasses)
					.where(inArray(homebrew_subclasses.id, itemsByType['subclass']))
			: Promise.resolve([]),
		// Domain cards
		itemsByType['domain-cards']?.length
			? db
					.select()
					.from(homebrew_domain_cards)
					.where(inArray(homebrew_domain_cards.id, itemsByType['domain-cards']))
			: Promise.resolve([]),
		// Ancestry cards
		itemsByType['ancestry-cards']?.length
			? db
					.select()
					.from(homebrew_ancestry_cards)
					.where(inArray(homebrew_ancestry_cards.id, itemsByType['ancestry-cards']))
			: Promise.resolve([]),
		// Community cards
		itemsByType['community-cards']?.length
			? db
					.select()
					.from(homebrew_community_cards)
					.where(inArray(homebrew_community_cards.id, itemsByType['community-cards']))
			: Promise.resolve([]),
		// Transformation cards
		itemsByType['transformation-cards']?.length
			? db
					.select()
					.from(homebrew_transformation_cards)
					.where(inArray(homebrew_transformation_cards.id, itemsByType['transformation-cards']))
			: Promise.resolve([])
	]);

	// Helper to set source_id on item data
	const withCampaignSource = <T extends { source_id?: string }>(data: T): T => {
		if (data && typeof data === 'object' && 'source_id' in data) {
			data.source_id = 'Campaign';
		}
		return data;
	};

	// Populate result from batched queries
	for (const weapon of primaryWeapons) {
		if (weapon.data) {
			result.primary_weapons[weapon.id] = withCampaignSource(weapon.data);
		}
	}

	for (const weapon of secondaryWeapons) {
		if (weapon.data) {
			result.secondary_weapons[weapon.id] = withCampaignSource(weapon.data);
		}
	}

	for (const armor of armors) {
		if (armor.data) {
			result.armor[armor.id] = withCampaignSource(armor.data);
		}
	}

	for (const loot of loots) {
		if (loot.data) {
			result.loot[loot.id] = withCampaignSource(loot.data);
		}
	}

	for (const consumable of consumables) {
		if (consumable.data) {
			result.consumables[consumable.id] = withCampaignSource(consumable.data);
		}
	}

	for (const beastform of beastforms) {
		if (beastform.data) {
			result.beastforms[beastform.id] = withCampaignSource(beastform.data);
		}
	}

	for (const classItem of classes) {
		if (classItem.data) {
			result.classes[classItem.id] = withCampaignSource(classItem.data);
		}
	}

	for (const subclass of subclasses) {
		if (subclass.data) {
			result.subclasses[subclass.id] = withCampaignSource(subclass.data);
		}
	}

	// Domain cards have special handling (nested by domain_id)
	for (const domainCard of domainCards) {
		if (domainCard.data) {
			const data = withCampaignSource(domainCard.data);
			const domainId = data.domain_id as DomainIds;
			if (domainId && result.domain_cards[domainId]) {
				result.domain_cards[domainId][domainCard.id] = data;
			}
		}
	}

	for (const ancestryCard of ancestryCards) {
		if (ancestryCard.data) {
			result.ancestry_cards[ancestryCard.id] = withCampaignSource(ancestryCard.data);
		}
	}

	for (const communityCard of communityCards) {
		if (communityCard.data) {
			result.community_cards[communityCard.id] = withCampaignSource(communityCard.data);
		}
	}

	for (const transformationCard of transformationCards) {
		if (transformationCard.data) {
			result.transformation_cards[transformationCard.id] = withCampaignSource(
				transformationCard.data
			);
		}
	}

	console.log('fetched campaign homebrew items from D1');
	return result;
});

// ============================================================================
// Commands
// ============================================================================

export const add_homebrew_to_vault = command(
	z.object({
		campaign_id: z.string(),
		homebrew_type: z.string(),
		homebrew_id: z.string()
	}),
	async ({ campaign_id, homebrew_type, homebrew_id }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		// Verify user is GM
		const access = await getCampaignAccessInternal(db, userId, campaign_id);
		if (!access.canEdit) {
			throw error(403, 'Only the GM can add items to the vault');
		}

		// Verify homebrew item exists and is owned by GM
		// Check all possible tables
		const homebrewType = homebrew_type as HomebrewType;
		let itemExists = false;
		let itemOwner = '';

		switch (homebrewType) {
			case 'weapon': {
				const [primary] = await db
					.select()
					.from(homebrew_primary_weapons)
					.where(eq(homebrew_primary_weapons.id, homebrew_id))
					.limit(1);
				if (primary) {
					itemExists = true;
					itemOwner = primary.clerk_user_id;
				} else {
					const [secondary] = await db
						.select()
						.from(homebrew_secondary_weapons)
						.where(eq(homebrew_secondary_weapons.id, homebrew_id))
						.limit(1);
					if (secondary) {
						itemExists = true;
						itemOwner = secondary.clerk_user_id;
					}
				}
				break;
			}
			case 'armor': {
				const [armor] = await db
					.select()
					.from(homebrew_armor)
					.where(eq(homebrew_armor.id, homebrew_id))
					.limit(1);
				if (armor) {
					itemExists = true;
					itemOwner = armor.clerk_user_id;
				}
				break;
			}
			case 'loot': {
				const [loot] = await db
					.select()
					.from(homebrew_loot)
					.where(eq(homebrew_loot.id, homebrew_id))
					.limit(1);
				if (loot) {
					itemExists = true;
					itemOwner = loot.clerk_user_id;
				}
				break;
			}
			case 'consumable': {
				const [consumable] = await db
					.select()
					.from(homebrew_consumables)
					.where(eq(homebrew_consumables.id, homebrew_id))
					.limit(1);
				if (consumable) {
					itemExists = true;
					itemOwner = consumable.clerk_user_id;
				}
				break;
			}
			case 'beastform': {
				const [beastform] = await db
					.select()
					.from(homebrew_beastforms)
					.where(eq(homebrew_beastforms.id, homebrew_id))
					.limit(1);
				if (beastform) {
					itemExists = true;
					itemOwner = beastform.clerk_user_id;
				}
				break;
			}
			case 'class': {
				const [classItem] = await db
					.select()
					.from(homebrew_classes)
					.where(eq(homebrew_classes.id, homebrew_id))
					.limit(1);
				if (classItem) {
					itemExists = true;
					itemOwner = classItem.clerk_user_id;
				}
				break;
			}
			case 'subclass': {
				const [subclass] = await db
					.select()
					.from(homebrew_subclasses)
					.where(eq(homebrew_subclasses.id, homebrew_id))
					.limit(1);
				if (subclass) {
					itemExists = true;
					itemOwner = subclass.clerk_user_id;
				}
				break;
			}
			// Note: 'domain' is not a valid HomebrewType, domains are not added to vault
			// case 'domain': {
			// 	break;
			// }
			case 'domain-cards': {
				const [domainCard] = await db
					.select()
					.from(homebrew_domain_cards)
					.where(eq(homebrew_domain_cards.id, homebrew_id))
					.limit(1);
				if (domainCard) {
					itemExists = true;
					itemOwner = domainCard.clerk_user_id;
				}
				break;
			}
			case 'ancestry-cards': {
				const [ancestryCard] = await db
					.select()
					.from(homebrew_ancestry_cards)
					.where(eq(homebrew_ancestry_cards.id, homebrew_id))
					.limit(1);
				if (ancestryCard) {
					itemExists = true;
					itemOwner = ancestryCard.clerk_user_id;
				}
				break;
			}
			case 'community-cards': {
				const [communityCard] = await db
					.select()
					.from(homebrew_community_cards)
					.where(eq(homebrew_community_cards.id, homebrew_id))
					.limit(1);
				if (communityCard) {
					itemExists = true;
					itemOwner = communityCard.clerk_user_id;
				}
				break;
			}
			case 'transformation-cards': {
				const [transformationCard] = await db
					.select()
					.from(homebrew_transformation_cards)
					.where(eq(homebrew_transformation_cards.id, homebrew_id))
					.limit(1);
				if (transformationCard) {
					itemExists = true;
					itemOwner = transformationCard.clerk_user_id;
				}
				break;
			}
		}

		if (!itemExists) {
			throw error(404, 'Homebrew item not found');
		}

		if (itemOwner !== userId) {
			throw error(403, 'You can only add your own homebrew items to the vault');
		}

		// Add to vault - atomic upsert pattern to handle race conditions
		const vaultId = crypto.randomUUID();
		const insertResult = await db
			.insert(campaign_homebrew_vault_table)
			.values({
				id: vaultId,
				campaign_id,
				homebrew_type: homebrewType,
				homebrew_id,
				added_at: Date.now()
			})
			.onConflictDoNothing({
				target: [
					campaign_homebrew_vault_table.campaign_id,
					campaign_homebrew_vault_table.homebrew_id
				]
			});

		// Check if insert succeeded (0 changes means duplicate)
		if (insertResult.meta.changes === 0) {
			throw error(400, 'Item is already in the vault');
		}

		// Refresh the query
		get_campaign_homebrew_vault(campaign_id).refresh();

		console.log('added homebrew to campaign vault in D1');
		return { success: true, id: vaultId };
	}
);

export const remove_homebrew_from_vault = command(
	z.object({
		campaign_id: z.string(),
		vault_id: z.string()
	}),
	async ({ campaign_id, vault_id }) => {
		const event = getRequestEvent();
		const { userId } = get_auth(event);
		const db = get_db(event);

		// Verify user is GM
		const access = await getCampaignAccessInternal(db, userId, campaign_id);
		if (!access.canEdit) {
			throw error(403, 'Only the GM can remove items from the vault');
		}

		// Remove from vault
		await db
			.delete(campaign_homebrew_vault_table)
			.where(
				and(
					eq(campaign_homebrew_vault_table.id, vault_id),
					eq(campaign_homebrew_vault_table.campaign_id, campaign_id)
				)
			);

		// Refresh the query
		get_campaign_homebrew_vault(campaign_id).refresh();

		console.log('removed homebrew from campaign vault in D1');
		return { success: true };
	}
);
