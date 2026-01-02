import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import {
	campaign_homebrew_vault_table,
	campaign_members_table,
	campaigns_table
} from '../server/db/campaigns.schema';
import { get_db, get_auth } from './utils';
import type { HomebrewType } from '../types/homebrew-types';
import type { DomainIds } from '../types/compendium-types';
import {
	homebrew_primary_weapons,
	homebrew_secondary_weapons,
	homebrew_armor,
	homebrew_loot,
	homebrew_consumables,
	homebrew_beastforms,
	homebrew_classes,
	homebrew_subclasses,
	homebrew_domains,
	homebrew_domain_cards,
	homebrew_ancestry_cards,
	homebrew_community_cards,
	homebrew_transformation_cards
} from '../server/db/homebrew.schema';

// ============================================================================
// Queries
// ============================================================================

export const get_campaign_homebrew_vault = query(
	z.string(),
	async (campaignId): Promise<Array<{ id: string; homebrew_type: HomebrewType; homebrew_id: string }>> => {
		const event = getRequestEvent();
		get_auth(event); // Validate authentication
		const db = get_db(event);

		// Verify user is a member of the campaign
		const { userId } = get_auth(event);
		const [membership] = await db
			.select()
			.from(campaign_members_table)
			.where(
				and(
					eq(campaign_members_table.campaign_id, campaignId),
					eq(campaign_members_table.user_id, userId)
				)
			)
			.limit(1);

		if (!membership) {
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
export const get_campaign_homebrew_items = query(
	z.string(),
	async (campaignId) => {
		const event = getRequestEvent();
		get_auth(event); // Validate authentication
		const db = get_db(event);

		// Verify user is a member of the campaign
		const { userId } = get_auth(event);
		const [membership] = await db
			.select()
			.from(campaign_members_table)
			.where(
				and(
					eq(campaign_members_table.campaign_id, campaignId),
					eq(campaign_members_table.user_id, userId)
				)
			)
			.limit(1);

		if (!membership) {
			throw error(403, 'Forbidden: Not a member of this campaign.');
		}

		// Get vault items
		const vaultItems = await db
			.select()
			.from(campaign_homebrew_vault_table)
			.where(eq(campaign_homebrew_vault_table.campaign_id, campaignId));

		// Group by type and fetch items
		const result: {
			primary_weapons: Record<string, any>;
			secondary_weapons: Record<string, any>;
			armor: Record<string, any>;
			loot: Record<string, any>;
			consumables: Record<string, any>;
			beastforms: Record<string, any>;
			classes: Record<string, any>;
			subclasses: Record<string, any>;
			domains: Record<string, any>;
			domain_cards: Record<DomainIds, Record<string, any>>;
			ancestry_cards: Record<string, any>;
			community_cards: Record<string, any>;
			transformation_cards: Record<string, any>;
		} = {
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

		// Fetch items by type
		for (const vaultItem of vaultItems) {
			let item: any = null;

			switch (vaultItem.homebrew_type) {
				case 'weapon': {
					// Check if primary or secondary
					const [primary] = await db
						.select()
						.from(homebrew_primary_weapons)
						.where(eq(homebrew_primary_weapons.id, vaultItem.homebrew_id))
						.limit(1);
					if (primary) {
						item = primary.data;
						result.primary_weapons[vaultItem.homebrew_id] = item;
					} else {
						const [secondary] = await db
							.select()
							.from(homebrew_secondary_weapons)
							.where(eq(homebrew_secondary_weapons.id, vaultItem.homebrew_id))
							.limit(1);
						if (secondary) {
							item = secondary.data;
							result.secondary_weapons[vaultItem.homebrew_id] = item;
						}
					}
					break;
				}
				case 'armor': {
					const [armor] = await db
						.select()
						.from(homebrew_armor)
						.where(eq(homebrew_armor.id, vaultItem.homebrew_id))
						.limit(1);
					if (armor) {
						item = armor.data;
						result.armor[vaultItem.homebrew_id] = item;
					}
					break;
				}
				case 'loot': {
					const [loot] = await db
						.select()
						.from(homebrew_loot)
						.where(eq(homebrew_loot.id, vaultItem.homebrew_id))
						.limit(1);
					if (loot) {
						item = loot.data;
						result.loot[vaultItem.homebrew_id] = item;
					}
					break;
				}
				case 'consumable': {
					const [consumable] = await db
						.select()
						.from(homebrew_consumables)
						.where(eq(homebrew_consumables.id, vaultItem.homebrew_id))
						.limit(1);
					if (consumable) {
						item = consumable.data;
						result.consumables[vaultItem.homebrew_id] = item;
					}
					break;
				}
				case 'beastform': {
					const [beastform] = await db
						.select()
						.from(homebrew_beastforms)
						.where(eq(homebrew_beastforms.id, vaultItem.homebrew_id))
						.limit(1);
					if (beastform) {
						item = beastform.data;
						result.beastforms[vaultItem.homebrew_id] = item;
					}
					break;
				}
				case 'class': {
					const [classItem] = await db
						.select()
						.from(homebrew_classes)
						.where(eq(homebrew_classes.id, vaultItem.homebrew_id))
						.limit(1);
					if (classItem) {
						item = classItem.data;
						result.classes[vaultItem.homebrew_id] = item;
					}
					break;
				}
				case 'subclass': {
					const [subclass] = await db
						.select()
						.from(homebrew_subclasses)
						.where(eq(homebrew_subclasses.id, vaultItem.homebrew_id))
						.limit(1);
					if (subclass) {
						item = subclass.data;
						result.subclasses[vaultItem.homebrew_id] = item;
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
						.where(eq(homebrew_domain_cards.id, vaultItem.homebrew_id))
						.limit(1);
					if (domainCard) {
						item = domainCard.data;
						const domainId = item.domain_id as DomainIds;
						if (domainId && result.domain_cards[domainId]) {
							result.domain_cards[domainId][vaultItem.homebrew_id] = item;
						}
					}
					break;
				}
				case 'ancestry-cards': {
					const [ancestryCard] = await db
						.select()
						.from(homebrew_ancestry_cards)
						.where(eq(homebrew_ancestry_cards.id, vaultItem.homebrew_id))
						.limit(1);
					if (ancestryCard) {
						item = ancestryCard.data;
						result.ancestry_cards[vaultItem.homebrew_id] = item;
					}
					break;
				}
				case 'community-cards': {
					const [communityCard] = await db
						.select()
						.from(homebrew_community_cards)
						.where(eq(homebrew_community_cards.id, vaultItem.homebrew_id))
						.limit(1);
					if (communityCard) {
						item = communityCard.data;
						result.community_cards[vaultItem.homebrew_id] = item;
					}
					break;
				}
				case 'transformation-cards': {
					const [transformationCard] = await db
						.select()
						.from(homebrew_transformation_cards)
						.where(eq(homebrew_transformation_cards.id, vaultItem.homebrew_id))
						.limit(1);
					if (transformationCard) {
						item = transformationCard.data;
						result.transformation_cards[vaultItem.homebrew_id] = item;
					}
					break;
				}
			}

			// Update source_id to 'Campaign' if item exists
			if (item && typeof item === 'object' && 'source_id' in item) {
				item.source_id = 'Campaign';
			}
		}

		console.log('fetched campaign homebrew items from D1');
		return result;
	}
);

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
		const members = await db
			.select()
			.from(campaign_members_table)
			.where(eq(campaign_members_table.campaign_id, campaign_id));

		const member = members.find((m) => m.user_id === userId && m.campaign_id === campaign_id);
		if (member?.role !== 'gm') {
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

		// Check if already in vault
		const [existing] = await db
			.select()
			.from(campaign_homebrew_vault_table)
			.where(
				and(
					eq(campaign_homebrew_vault_table.campaign_id, campaign_id),
					eq(campaign_homebrew_vault_table.homebrew_id, homebrew_id)
				)
			)
			.limit(1);

		if (existing) {
			throw error(400, 'Item is already in the vault');
		}

		// Add to vault
		const vaultId = crypto.randomUUID();
		await db.insert(campaign_homebrew_vault_table).values({
			id: vaultId,
			campaign_id,
			homebrew_type: homebrewType,
			homebrew_id,
			added_at: Date.now()
		});

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
		const members = await db
			.select()
			.from(campaign_members_table)
			.where(eq(campaign_members_table.campaign_id, campaign_id));

		const member = members.find((m) => m.user_id === userId && m.campaign_id === campaign_id);
		if (member?.role !== 'gm') {
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

