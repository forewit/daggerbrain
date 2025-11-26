import { buildClerkProps } from 'svelte-clerk/server';
import type { LayoutServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { listCharacters } from '$lib/server/db/repositories/characters';
import { ensureUser } from '$lib/server/db/repositories/users';
import * as contentRepo from '$lib/server/db/repositories/content';
import type { Character } from '$lib/ts/character/types';

export const load: LayoutServerLoad = async (event) => {
	const auth = event.locals.auth?.();
	const userId = auth?.userId;
	let initialCharacters: Character[] = [];
	
	const db = getDb(event);
	
	// Load all content from database
	const [
		domainRecords,
		domainCardRecords,
		classRecords,
		subclassRecords,
		ancestryCardRecords,
		communityCardRecords,
		transformationCardRecords,
		weaponRecords,
		armorRecords,
		lootRecords,
		consumableRecords
	] = await Promise.all([
		contentRepo.getAllDomains(db),
		contentRepo.getAllDomainCards(db),
		contentRepo.getAllClasses(db),
		contentRepo.getAllClasses(db).then(async (classes) => {
			// Get all subclasses for all classes
			const allSubclasses = await Promise.all(
				classes.map((c) => contentRepo.getClassSubclasses(db, c.id))
			);
			return allSubclasses.flat();
		}),
		contentRepo.getAllAncestryCards(db),
		contentRepo.getAllCommunityCards(db),
		contentRepo.getAllTransformationCards(db),
		contentRepo.getAllWeapons(db),
		contentRepo.getAllArmor(db),
		contentRepo.getAllLoot(db),
		contentRepo.getAllConsumables(db)
	]);

	// Build domains with their cards - map camelCase to snake_case to match our types
	const domainsMap: Record<string, any> = {};
	for (const domain of domainRecords) {
		const cards = domainCardRecords
			.filter((c) => c.domainId === domain.id)
			.map((card) => ({
				id: card.id,
				card_type: 'domain' as const,
				domain_id: card.domainId,
				image_url: card.imageUrl,
				title: card.title,
				description_html: card.descriptionHtml,
				artist_name: card.artistName || '',
				features: JSON.parse(card.featuresJson),
				level_requirement: card.levelRequirement,
				recall_cost: card.recallCost,
				type: card.cardType as 'ability' | 'spell' | 'grimoire',
				choices: JSON.parse(card.choicesJson),
				tokens: Boolean(card.tokens),
				applies_in_vault: Boolean(card.appliesInVault),
				forced_in_loadout: Boolean(card.forcedInLoadout),
				forced_in_vault: Boolean(card.forcedInVault)
			}));
		domainsMap[domain.id] = {
			name: domain.name,
			description_html: domain.descriptionHtml,
			color: domain.color,
			foreground_color: domain.foregroundColor,
			cards: Object.fromEntries(cards.map((c) => [c.id, c]))
		};
	}

	// Build classes with their subclasses - map camelCase to snake_case
	const classesMap: Record<string, any> = {};
	for (const classRecord of classRecords) {
		// Subclasses are stored in the class's subclassesJson, but we also have separate subclass records
		const subclassRecordsForClass = subclassRecords.filter((s) => s.classId === classRecord.id);
		
		classesMap[classRecord.id] = {
			source_id: classRecord.sourceId,
			name: classRecord.name,
			image_url: classRecord.imageUrl,
			description_html: classRecord.descriptionHtml,
			starting_evasion: classRecord.startingEvasion,
			starting_max_hp: classRecord.startingMaxHp,
			hope_feature: JSON.parse(classRecord.hopeFeatureJson),
			primary_domain_id: classRecord.primaryDomainId,
			secondary_domain_id: classRecord.secondaryDomainId,
			class_features: JSON.parse(classRecord.classFeaturesJson),
			subclasses: JSON.parse(classRecord.subclassesJson), // This already has the right structure
			suggested_traits: JSON.parse(classRecord.suggestedTraitsJson),
			suggested_primary_weapon_id: classRecord.suggestedPrimaryWeaponId,
			suggested_secondary_weapon_id: classRecord.suggestedSecondaryWeaponId,
			suggested_armor_id: classRecord.suggestedArmorId,
			starting_inventory: JSON.parse(classRecord.startingInventoryJson),
			background_questions: JSON.parse(classRecord.backgroundQuestionsJson),
			connections: JSON.parse(classRecord.connectionsJson)
		};
	}

	// Map heritage cards from camelCase to snake_case
	const ancestryCardsMap = Object.fromEntries(
		ancestryCardRecords.map((c) => [
			c.id,
			{
				id: c.id,
				card_type: 'ancestry' as const,
				image_url: c.imageUrl,
				title: c.title,
				description_html: c.descriptionHtml,
				artist_name: c.artistName || '',
				features: JSON.parse(c.featuresJson)
			}
		])
	);
	const communityCardsMap = Object.fromEntries(
		communityCardRecords.map((c) => [
			c.id,
			{
				id: c.id,
				card_type: 'community' as const,
				image_url: c.imageUrl,
				title: c.title,
				description_html: c.descriptionHtml,
				artist_name: c.artistName || '',
				features: JSON.parse(c.featuresJson)
			}
		])
	);
	const transformationCardsMap = Object.fromEntries(
		transformationCardRecords.map((c) => [
			c.id,
			{
				id: c.id,
				card_type: 'transformation' as const,
				image_url: c.imageUrl,
				title: c.title,
				description_html: c.descriptionHtml,
				artist_name: c.artistName || '',
				features: JSON.parse(c.featuresJson)
			}
		])
	);

	// Map equipment from camelCase to snake_case
	const weaponsMap = Object.fromEntries(
		weaponRecords.map((w) => [
			w.id,
			{
				id: w.id,
				title: w.title,
				description_html: w.descriptionHtml,
				level_requirement: w.levelRequirement,
				category: w.category,
				available_traits: JSON.parse(w.availableTraitsJson),
				range: w.range,
				features: JSON.parse(w.featuresJson),
				attack_roll_bonus: w.attackRollBonus,
				damage_bonus: w.damageBonus,
				damage_dice: w.damageDice,
				available_damage_types: JSON.parse(w.availableDamageTypesJson),
				burden: w.burden
			}
		])
	);
	const armorMap = Object.fromEntries(
		armorRecords.map((a) => [
			a.id,
			{
				id: a.id,
				level_requirement: a.levelRequirement,
				title: a.title,
				description_html: a.descriptionHtml,
				max_armor: a.maxArmor,
				damage_thresholds: JSON.parse(a.damageThresholdsJson),
				features: JSON.parse(a.featuresJson)
			}
		])
	);
	const lootMap = Object.fromEntries(
		lootRecords.map((l) => [
			l.id,
			{
				id: l.id,
				rarity_roll: l.rarityRoll,
				title: l.title,
				description_html: l.descriptionHtml,
				character_modifiers: JSON.parse(l.characterModifiersJson),
				weapon_modifiers: JSON.parse(l.weaponModifiersJson)
			}
		])
	);
	const consumablesMap = Object.fromEntries(
		consumableRecords.map((c) => [
			c.id,
			{
				id: c.id,
				rarity_roll: c.rarityRoll,
				title: c.title,
				description_html: c.descriptionHtml
			}
		])
	);

	if (userId) {
		try {
			// Ensure user exists in database
			await ensureUser(db, userId);
			initialCharacters = await listCharacters(db, userId);
		} catch (error) {
			console.error('Failed to load characters:', error);
		}
	}

	return {
		initialCharacters,
		content: {
			domains: domainsMap,
			classes: classesMap,
			ancestryCards: ancestryCardsMap,
			communityCards: communityCardsMap,
			transformationCards: transformationCardsMap,
			weapons: weaponsMap,
			armor: armorMap,
			loot: lootMap,
			consumables: consumablesMap
		},
		...buildClerkProps(auth)
	};
};

