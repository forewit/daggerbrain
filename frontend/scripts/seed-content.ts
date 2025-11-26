import { drizzle } from 'drizzle-orm/d1-http';
import { createClient } from '@libsql/client/http';
import { eq, sql } from 'drizzle-orm';
import * as schema from '../src/lib/server/db/schema';
import { DOMAINS } from '../src/lib/ts/content/domains/domains';
import { CLASSES } from '../src/lib/ts/content/classes/classes';
import { ANCESTRY_CARDS, COMMUNITY_CARDS } from '../src/lib/ts/content/heritage';
import { TRANSFORMATION_CARDS } from '../src/lib/ts/content/void';
import { ALL_ARMOR, ALL_CONSUMABLES, ALL_LOOT, ALL_WEAPONS } from '../src/lib/ts/content/equipment/equipment';

const missingVars: string[] = [];
if (!process.env.CLOUDFLARE_ACCOUNT_ID) missingVars.push('CLOUDFLARE_ACCOUNT_ID');
if (!process.env.CLOUDFLARE_D1_DATABASE_ID) missingVars.push('CLOUDFLARE_D1_DATABASE_ID');
if (!process.env.CLOUDFLARE_API_TOKEN) missingVars.push('CLOUDFLARE_API_TOKEN');

if (missingVars.length > 0) {
	throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID!;
const token = process.env.CLOUDFLARE_API_TOKEN!;

// Create D1 HTTP client
const client = createClient({
	url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
	authToken: token
});

const db = drizzle(client, { schema });

async function seed() {
	console.log('Starting content seed...');

	try {
		// ========================================================================
		// Seed Domains
		// ========================================================================
		console.log('Seeding domains...');
		for (const [domainId, domain] of Object.entries(DOMAINS)) {
			await db
				.insert(schema.domains)
				.values({
					id: domainId,
					name: domain.name,
					descriptionHtml: domain.description_html,
					color: domain.color,
					foregroundColor: domain.foreground_color
				})
				.onConflictDoUpdate({
					target: schema.domains.id,
					set: {
						name: domain.name,
						descriptionHtml: domain.description_html,
						color: domain.color,
						foregroundColor: domain.foreground_color,
						updatedAt: sql`(unixepoch())`
					}
				});
		}
		console.log(`✓ Seeded ${Object.keys(DOMAINS).length} domains`);

		// ========================================================================
		// Seed Domain Cards
		// ========================================================================
		console.log('Seeding domain cards...');
		let domainCardCount = 0;
		for (const [domainId, domain] of Object.entries(DOMAINS)) {
			for (const [cardId, card] of Object.entries(domain.cards)) {
				await db
					.insert(schema.domainCards)
					.values({
						id: cardId,
						domainId: card.domain_id,
						cardType: card.type,
						imageUrl: card.image_url,
						title: card.title,
						descriptionHtml: card.description_html,
						artistName: card.artist_name || null,
						featuresJson: JSON.stringify(card.features),
						levelRequirement: card.level_requirement,
						recallCost: card.recall_cost,
						domainCardType: card.type,
						choicesJson: JSON.stringify(card.choices),
						tokens: card.tokens ? 1 : 0,
						appliesInVault: card.applies_in_vault ? 1 : 0,
						forcedInLoadout: card.forced_in_loadout ? 1 : 0,
						forcedInVault: card.forced_in_vault ? 1 : 0
					})
					.onConflictDoUpdate({
						target: schema.domainCards.id,
						set: {
							domainId: card.domain_id,
							cardType: card.type,
							imageUrl: card.image_url,
							title: card.title,
							descriptionHtml: card.description_html,
							artistName: card.artist_name || null,
							featuresJson: JSON.stringify(card.features),
							levelRequirement: card.level_requirement,
							recallCost: card.recall_cost,
							domainCardType: card.type,
							choicesJson: JSON.stringify(card.choices),
							tokens: card.tokens ? 1 : 0,
							appliesInVault: card.applies_in_vault ? 1 : 0,
							forcedInLoadout: card.forced_in_loadout ? 1 : 0,
							forcedInVault: card.forced_in_vault ? 1 : 0,
							updatedAt: sql`(unixepoch())`
						}
					});
				domainCardCount++;
			}
		}
		console.log(`✓ Seeded ${domainCardCount} domain cards`);

		// ========================================================================
		// Seed Classes
		// ========================================================================
		console.log('Seeding classes...');
		for (const [classId, classData] of Object.entries(CLASSES)) {
			await db
				.insert(schema.classes)
				.values({
					id: classId,
					sourceId: classData.source_id,
					name: classData.name,
					imageUrl: classData.image_url,
					descriptionHtml: classData.description_html,
					startingEvasion: classData.starting_evasion,
					startingMaxHp: classData.starting_max_hp,
					hopeFeatureJson: JSON.stringify(classData.hope_feature),
					primaryDomainId: classData.primary_domain_id,
					secondaryDomainId: classData.secondary_domain_id,
					classFeaturesJson: JSON.stringify(classData.class_features),
					subclassesJson: JSON.stringify(classData.subclasses),
					suggestedTraitsJson: JSON.stringify(classData.suggested_traits),
					suggestedPrimaryWeaponId: classData.suggested_primary_weapon_id || null,
					suggestedSecondaryWeaponId: classData.suggested_secondary_weapon_id || null,
					suggestedArmorId: classData.suggested_armor_id || null,
					startingInventoryJson: JSON.stringify(classData.starting_inventory),
					backgroundQuestionsJson: JSON.stringify(classData.background_questions),
					connectionsJson: JSON.stringify(classData.connections)
				})
				.onConflictDoUpdate({
					target: schema.classes.id,
					set: {
						sourceId: classData.source_id,
						name: classData.name,
						imageUrl: classData.image_url,
						descriptionHtml: classData.description_html,
						startingEvasion: classData.starting_evasion,
						startingMaxHp: classData.starting_max_hp,
						hopeFeatureJson: JSON.stringify(classData.hope_feature),
						primaryDomainId: classData.primary_domain_id,
						secondaryDomainId: classData.secondary_domain_id,
						classFeaturesJson: JSON.stringify(classData.class_features),
						subclassesJson: JSON.stringify(classData.subclasses),
						suggestedTraitsJson: JSON.stringify(classData.suggested_traits),
						suggestedPrimaryWeaponId: classData.suggested_primary_weapon_id || null,
						suggestedSecondaryWeaponId: classData.suggested_secondary_weapon_id || null,
						suggestedArmorId: classData.suggested_armor_id || null,
						startingInventoryJson: JSON.stringify(classData.starting_inventory),
						backgroundQuestionsJson: JSON.stringify(classData.background_questions),
						connectionsJson: JSON.stringify(classData.connections),
						updatedAt: sql`(unixepoch())`
					}
				});
		}
		console.log(`✓ Seeded ${Object.keys(CLASSES).length} classes`);

		// ========================================================================
		// Seed Class Subclasses
		// ========================================================================
		console.log('Seeding class subclasses...');
		let subclassCount = 0;
		for (const [classId, classData] of Object.entries(CLASSES)) {
			for (const [subclassKey, subclass] of Object.entries(classData.subclasses)) {
				// Use the subclass key as the ID (e.g., "executioners_guild")
				const subclassId = subclassKey;
				await db
					.insert(schema.classSubclasses)
					.values({
						id: subclassId,
						classId: classId,
						name: subclass.name,
						descriptionHtml: subclass.description_html,
						foundationCardJson: JSON.stringify(subclass.foundation_card),
						specializationCardJson: JSON.stringify(subclass.specialization_card),
						masteryCardJson: JSON.stringify(subclass.mastery_card)
					})
					.onConflictDoUpdate({
						target: schema.classSubclasses.id,
						set: {
							classId: classId,
							name: subclass.name,
							descriptionHtml: subclass.description_html,
							foundationCardJson: JSON.stringify(subclass.foundation_card),
							specializationCardJson: JSON.stringify(subclass.specialization_card),
							masteryCardJson: JSON.stringify(subclass.mastery_card),
							updatedAt: sql`(unixepoch())`
						}
					});
				subclassCount++;
			}
		}
		console.log(`✓ Seeded ${subclassCount} class subclasses`);

		// ========================================================================
		// Seed Heritage Cards
		// ========================================================================
		console.log('Seeding ancestry cards...');
		for (const [cardId, card] of Object.entries(ANCESTRY_CARDS)) {
			await db
				.insert(schema.ancestryCards)
				.values({
					id: cardId,
					imageUrl: card.image_url,
					title: card.title,
					descriptionHtml: card.description_html,
					artistName: card.artist_name || null,
					featuresJson: JSON.stringify(card.features)
				})
				.onConflictDoUpdate({
					target: schema.ancestryCards.id,
					set: {
						imageUrl: card.image_url,
						title: card.title,
						descriptionHtml: card.description_html,
						artistName: card.artist_name || null,
						featuresJson: JSON.stringify(card.features),
						updatedAt: sql`(unixepoch())`
					}
				});
		}
		console.log(`✓ Seeded ${Object.keys(ANCESTRY_CARDS).length} ancestry cards`);

		console.log('Seeding community cards...');
		for (const [cardId, card] of Object.entries(COMMUNITY_CARDS)) {
			await db
				.insert(schema.communityCards)
				.values({
					id: cardId,
					imageUrl: card.image_url,
					title: card.title,
					descriptionHtml: card.description_html,
					artistName: card.artist_name || null,
					featuresJson: JSON.stringify(card.features)
				})
				.onConflictDoUpdate({
					target: schema.communityCards.id,
					set: {
						imageUrl: card.image_url,
						title: card.title,
						descriptionHtml: card.description_html,
						artistName: card.artist_name || null,
						featuresJson: JSON.stringify(card.features),
						updatedAt: sql`(unixepoch())`
					}
				});
		}
		console.log(`✓ Seeded ${Object.keys(COMMUNITY_CARDS).length} community cards`);

		console.log('Seeding transformation cards...');
		for (const [cardId, card] of Object.entries(TRANSFORMATION_CARDS)) {
			await db
				.insert(schema.transformationCards)
				.values({
					id: cardId,
					imageUrl: card.image_url,
					title: card.title,
					descriptionHtml: card.description_html,
					artistName: card.artist_name || null,
					featuresJson: JSON.stringify(card.features)
				})
				.onConflictDoUpdate({
					target: schema.transformationCards.id,
					set: {
						imageUrl: card.image_url,
						title: card.title,
						descriptionHtml: card.description_html,
						artistName: card.artist_name || null,
						featuresJson: JSON.stringify(card.features),
						updatedAt: sql`(unixepoch())`
					}
				});
		}
		console.log(`✓ Seeded ${Object.keys(TRANSFORMATION_CARDS).length} transformation cards`);

		// ========================================================================
		// Seed Equipment
		// ========================================================================
		console.log('Seeding weapons...');
		for (const [weaponId, weapon] of Object.entries(ALL_WEAPONS)) {
			await db
				.insert(schema.weapons)
				.values({
					id: weaponId,
					title: weapon.title,
					descriptionHtml: weapon.description_html,
					levelRequirement: weapon.level_requirement,
					category: weapon.category,
					availableTraitsJson: JSON.stringify(weapon.available_traits),
					range: weapon.range,
					featuresJson: JSON.stringify(weapon.features),
					attackRollBonus: weapon.attack_roll_bonus,
					damageBonus: weapon.damage_bonus,
					damageDice: weapon.damage_dice,
					availableDamageTypesJson: JSON.stringify(weapon.available_damage_types),
					burden: weapon.burden
				})
				.onConflictDoUpdate({
					target: schema.weapons.id,
					set: {
						title: weapon.title,
						descriptionHtml: weapon.description_html,
						levelRequirement: weapon.level_requirement,
						category: weapon.category,
						availableTraitsJson: JSON.stringify(weapon.available_traits),
						range: weapon.range,
						featuresJson: JSON.stringify(weapon.features),
						attackRollBonus: weapon.attack_roll_bonus,
						damageBonus: weapon.damage_bonus,
						damageDice: weapon.damage_dice,
						availableDamageTypesJson: JSON.stringify(weapon.available_damage_types),
						burden: weapon.burden,
						updatedAt: sql`(unixepoch())`
					}
				});
		}
		console.log(`✓ Seeded ${Object.keys(ALL_WEAPONS).length} weapons`);

		console.log('Seeding armor...');
		for (const [armorId, armorData] of Object.entries(ALL_ARMOR)) {
			await db
				.insert(schema.armor)
				.values({
					id: armorId,
					levelRequirement: armorData.level_requirement,
					title: armorData.title,
					descriptionHtml: armorData.description_html,
					maxArmor: armorData.max_armor,
					damageThresholdsJson: JSON.stringify(armorData.damage_thresholds),
					featuresJson: JSON.stringify(armorData.features)
				})
				.onConflictDoUpdate({
					target: schema.armor.id,
					set: {
						levelRequirement: armorData.level_requirement,
						title: armorData.title,
						descriptionHtml: armorData.description_html,
						maxArmor: armorData.max_armor,
						damageThresholdsJson: JSON.stringify(armorData.damage_thresholds),
						featuresJson: JSON.stringify(armorData.features),
						updatedAt: sql`(unixepoch())`
					}
				});
		}
		console.log(`✓ Seeded ${Object.keys(ALL_ARMOR).length} armor`);

		console.log('Seeding loot...');
		for (const [lootId, lootData] of Object.entries(ALL_LOOT)) {
			await db
				.insert(schema.loot)
				.values({
					id: lootId,
					rarityRoll: lootData.rarity_roll,
					title: lootData.title,
					descriptionHtml: lootData.description_html,
					characterModifiersJson: JSON.stringify(lootData.character_modifiers),
					weaponModifiersJson: JSON.stringify(lootData.weapon_modifiers)
				})
				.onConflictDoUpdate({
					target: schema.loot.id,
					set: {
						rarityRoll: lootData.rarity_roll,
						title: lootData.title,
						descriptionHtml: lootData.description_html,
						characterModifiersJson: JSON.stringify(lootData.character_modifiers),
						weaponModifiersJson: JSON.stringify(lootData.weapon_modifiers),
						updatedAt: sql`(unixepoch())`
					}
				});
		}
		console.log(`✓ Seeded ${Object.keys(ALL_LOOT).length} loot`);

		console.log('Seeding consumables...');
		for (const [consumableId, consumableData] of Object.entries(ALL_CONSUMABLES)) {
			await db
				.insert(schema.consumables)
				.values({
					id: consumableId,
					rarityRoll: consumableData.rarity_roll,
					title: consumableData.title,
					descriptionHtml: consumableData.description_html
				})
				.onConflictDoUpdate({
					target: schema.consumables.id,
					set: {
						rarityRoll: consumableData.rarity_roll,
						title: consumableData.title,
						descriptionHtml: consumableData.description_html,
						updatedAt: sql`(unixepoch())`
					}
				});
		}
		console.log(`✓ Seeded ${Object.keys(ALL_CONSUMABLES).length} consumables`);

		console.log('\n✅ Content seeding completed successfully!');
	} catch (error) {
		console.error('❌ Error seeding content:', error);
		throw error;
	}
}

seed();

