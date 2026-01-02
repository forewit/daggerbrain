import { query, getRequestEvent } from '$app/server';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { get_db, get_kv, get_auth } from './utils';
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
import type { HomebrewType } from '../types/homebrew-types';
import {
	WeaponSchema,
	ArmorSchema,
	LootSchema,
	ConsumableSchema,
	BeastformSchema,
	ClassSchema,
	SubclassSchema,
	DomainSchema,
	DomainCardSchema,
	AncestryCardSchema,
	CommunityCardSchema,
	TransformationCardSchema
} from '$lib/compendium/compendium-schemas';

type PublicHomebrewItem =
	| { type: 'weapon'; data: z.infer<typeof WeaponSchema>; is_primary: boolean }
	| { type: 'armor'; data: z.infer<typeof ArmorSchema> }
	| { type: 'loot'; data: z.infer<typeof LootSchema> }
	| { type: 'consumable'; data: z.infer<typeof ConsumableSchema> }
	| { type: 'beastform'; data: z.infer<typeof BeastformSchema> }
	| { type: 'class'; data: z.infer<typeof ClassSchema> }
	| { type: 'subclass'; data: z.infer<typeof SubclassSchema> }
	| { type: 'ancestry-cards'; data: z.infer<typeof AncestryCardSchema> }
	| { type: 'community-cards'; data: z.infer<typeof CommunityCardSchema> }
	| { type: 'transformation-cards'; data: z.infer<typeof TransformationCardSchema> }
	| { type: 'domain-cards'; data: z.infer<typeof DomainCardSchema>; domain_id: string };

export const get_homebrew_public = query(
	z.object({
		type: z.string(),
		uid: z.string()
	}),
	async ({ type, uid }): Promise<PublicHomebrewItem> => {
		const event = getRequestEvent();
		const kv = get_kv(event);
		const db = get_db(event);

		// Try to get from KV first
		const kvKey = `homebrew:${type}:${uid}:public`;
		const kvItem = await kv.get(kvKey, 'json');
		if (kvItem) {
			console.log(`fetched public homebrew ${type} from KV`);
			// Check if user owns it and redirect if so
			try {
				const { userId } = get_auth(event);
				if (userId && (kvItem as any).clerk_user_id === userId) {
					throw redirect(302, `/homebrew/${type}/${uid}`);
				}
			} catch (e) {
				if (e && typeof e === 'object' && 'status' in e && e.status === 302) {
					throw e;
				}
				// Not authenticated or not owner, continue with public view
			}
			return kvItem as PublicHomebrewItem;
		}

		// Fallback to D1
		let item: any = null;
		let homebrewType: HomebrewType | null = null;
		let isPrimary = false;
		let domainId: string | null = null;

		switch (type) {
			case 'weapon': {
				const [primary] = await db
					.select()
					.from(homebrew_primary_weapons)
					.where(eq(homebrew_primary_weapons.id, uid))
					.limit(1);
				if (primary) {
					if (primary.visibility !== 'public') {
						throw error(404, 'Homebrew item is not public');
					}
					item = WeaponSchema.parse(primary.data);
					homebrewType = 'weapon';
					isPrimary = true;
				} else {
					const [secondary] = await db
						.select()
						.from(homebrew_secondary_weapons)
						.where(eq(homebrew_secondary_weapons.id, uid))
						.limit(1);
					if (secondary) {
						if (secondary.visibility !== 'public') {
							throw error(404, 'Homebrew item is not public');
						}
						item = WeaponSchema.parse(secondary.data);
						homebrewType = 'weapon';
						isPrimary = false;
					}
				}
				break;
			}
			case 'armor': {
				const [armor] = await db
					.select()
					.from(homebrew_armor)
					.where(eq(homebrew_armor.id, uid))
					.limit(1);
				if (armor) {
					if (armor.visibility !== 'public') {
						throw error(404, 'Homebrew item is not public');
					}
					item = ArmorSchema.parse(armor.data);
					homebrewType = 'armor';
				}
				break;
			}
			case 'loot': {
				const [loot] = await db
					.select()
					.from(homebrew_loot)
					.where(eq(homebrew_loot.id, uid))
					.limit(1);
				if (loot) {
					if (loot.visibility !== 'public') {
						throw error(404, 'Homebrew item is not public');
					}
					item = LootSchema.parse(loot.data);
					homebrewType = 'loot';
				}
				break;
			}
			case 'consumable': {
				const [consumable] = await db
					.select()
					.from(homebrew_consumables)
					.where(eq(homebrew_consumables.id, uid))
					.limit(1);
				if (consumable) {
					if (consumable.visibility !== 'public') {
						throw error(404, 'Homebrew item is not public');
					}
					item = ConsumableSchema.parse(consumable.data);
					homebrewType = 'consumable';
				}
				break;
			}
			case 'beastform': {
				const [beastform] = await db
					.select()
					.from(homebrew_beastforms)
					.where(eq(homebrew_beastforms.id, uid))
					.limit(1);
				if (beastform) {
					if (beastform.visibility !== 'public') {
						throw error(404, 'Homebrew item is not public');
					}
					item = BeastformSchema.parse(beastform.data);
					homebrewType = 'beastform';
				}
				break;
			}
			case 'class': {
				const [characterClass] = await db
					.select()
					.from(homebrew_classes)
					.where(eq(homebrew_classes.id, uid))
					.limit(1);
				if (characterClass) {
					if (characterClass.visibility !== 'public') {
						throw error(404, 'Homebrew item is not public');
					}
					item = ClassSchema.parse(characterClass.data);
					homebrewType = 'class';
				}
				break;
			}
			case 'subclass': {
				const [subclass] = await db
					.select()
					.from(homebrew_subclasses)
					.where(eq(homebrew_subclasses.id, uid))
					.limit(1);
				if (subclass) {
					if (subclass.visibility !== 'public') {
						throw error(404, 'Homebrew item is not public');
					}
					item = SubclassSchema.parse(subclass.data);
					homebrewType = 'subclass';
				}
				break;
			}
			case 'ancestry-cards': {
				const [ancestryCard] = await db
					.select()
					.from(homebrew_ancestry_cards)
					.where(eq(homebrew_ancestry_cards.id, uid))
					.limit(1);
				if (ancestryCard) {
					if (ancestryCard.visibility !== 'public') {
						throw error(404, 'Homebrew item is not public');
					}
					item = AncestryCardSchema.parse(ancestryCard.data);
					homebrewType = 'ancestry-cards';
				}
				break;
			}
			case 'community-cards': {
				const [communityCard] = await db
					.select()
					.from(homebrew_community_cards)
					.where(eq(homebrew_community_cards.id, uid))
					.limit(1);
				if (communityCard) {
					if (communityCard.visibility !== 'public') {
						throw error(404, 'Homebrew item is not public');
					}
					item = CommunityCardSchema.parse(communityCard.data);
					homebrewType = 'community-cards';
				}
				break;
			}
			case 'transformation-cards': {
				const [transformationCard] = await db
					.select()
					.from(homebrew_transformation_cards)
					.where(eq(homebrew_transformation_cards.id, uid))
					.limit(1);
				if (transformationCard) {
					if (transformationCard.visibility !== 'public') {
						throw error(404, 'Homebrew item is not public');
					}
					item = TransformationCardSchema.parse(transformationCard.data);
					homebrewType = 'transformation-cards';
				}
				break;
			}
			case 'domain-cards': {
				const [domainCard] = await db
					.select()
					.from(homebrew_domain_cards)
					.where(eq(homebrew_domain_cards.id, uid))
					.limit(1);
				if (domainCard) {
					if (domainCard.visibility !== 'public') {
						throw error(404, 'Homebrew item is not public');
					}
					const parsed = DomainCardSchema.parse(domainCard.data);
					item = parsed;
					homebrewType = 'domain-cards';
					// Extract domain_id from the parsed card data
					domainId = parsed.domain_id;
				}
				break;
			}
		}

		if (!item || !homebrewType) {
			throw error(404, 'Homebrew item not found');
		}

		// Check if user owns it and redirect if so
		try {
			const { userId } = get_auth(event);
			// Get the owner from the database entry
			let ownerId: string | null = null;
			switch (type) {
				case 'weapon':
					if (isPrimary) {
						const [p] = await db
							.select()
							.from(homebrew_primary_weapons)
							.where(eq(homebrew_primary_weapons.id, uid))
							.limit(1);
						ownerId = p?.clerk_user_id || null;
					} else {
						const [s] = await db
							.select()
							.from(homebrew_secondary_weapons)
							.where(eq(homebrew_secondary_weapons.id, uid))
							.limit(1);
						ownerId = s?.clerk_user_id || null;
					}
					break;
				case 'armor': {
					const [a] = await db
						.select()
						.from(homebrew_armor)
						.where(eq(homebrew_armor.id, uid))
						.limit(1);
					ownerId = a?.clerk_user_id || null;
					break;
				}
				case 'loot': {
					const [l] = await db
						.select()
						.from(homebrew_loot)
						.where(eq(homebrew_loot.id, uid))
						.limit(1);
					ownerId = l?.clerk_user_id || null;
					break;
				}
				case 'consumable': {
					const [c] = await db
						.select()
						.from(homebrew_consumables)
						.where(eq(homebrew_consumables.id, uid))
						.limit(1);
					ownerId = c?.clerk_user_id || null;
					break;
				}
				case 'beastform': {
					const [b] = await db
						.select()
						.from(homebrew_beastforms)
						.where(eq(homebrew_beastforms.id, uid))
						.limit(1);
					ownerId = b?.clerk_user_id || null;
					break;
				}
				case 'class': {
					const [cl] = await db
						.select()
						.from(homebrew_classes)
						.where(eq(homebrew_classes.id, uid))
						.limit(1);
					ownerId = cl?.clerk_user_id || null;
					break;
				}
				case 'subclass': {
					const [sc] = await db
						.select()
						.from(homebrew_subclasses)
						.where(eq(homebrew_subclasses.id, uid))
						.limit(1);
					ownerId = sc?.clerk_user_id || null;
					break;
				}
				case 'ancestry-cards': {
					const [ac] = await db
						.select()
						.from(homebrew_ancestry_cards)
						.where(eq(homebrew_ancestry_cards.id, uid))
						.limit(1);
					ownerId = ac?.clerk_user_id || null;
					break;
				}
				case 'community-cards': {
					const [cc] = await db
						.select()
						.from(homebrew_community_cards)
						.where(eq(homebrew_community_cards.id, uid))
						.limit(1);
					ownerId = cc?.clerk_user_id || null;
					break;
				}
				case 'transformation-cards': {
					const [tc] = await db
						.select()
						.from(homebrew_transformation_cards)
						.where(eq(homebrew_transformation_cards.id, uid))
						.limit(1);
					ownerId = tc?.clerk_user_id || null;
					break;
				}
				case 'domain-cards': {
					const [dc] = await db
						.select()
						.from(homebrew_domain_cards)
						.where(eq(homebrew_domain_cards.id, uid))
						.limit(1);
					ownerId = dc?.clerk_user_id || null;
					break;
				}
			}
			if (userId && ownerId === userId) {
				throw redirect(302, `/homebrew/${type}/${uid}`);
			}
		} catch (e) {
			if (e && typeof e === 'object' && 'status' in e && e.status === 302) {
				throw e;
			}
			// Not authenticated or not owner, continue with public view
		}

		// Build result
		if (type === 'weapon') {
			return { type: 'weapon', data: item, is_primary: isPrimary } as PublicHomebrewItem;
		} else if (type === 'domain-cards') {
			return { type: 'domain-cards', data: item, domain_id: domainId! } as PublicHomebrewItem;
		} else {
			return { type: homebrewType as any, data: item } as PublicHomebrewItem;
		}
	}
);

