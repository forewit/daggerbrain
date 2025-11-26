import { json, type RequestEvent } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import * as contentRepo from '$lib/server/db/repositories/content';

export async function GET(event: RequestEvent) {
	const db = getDb(event);
	const url = new URL(event.request.url);
	const type = url.searchParams.get('type');
	const id = url.searchParams.get('id');

	try {
		switch (type) {
			case 'domains':
				if (id) {
					const domain = await contentRepo.getDomain(db, id);
					return json(domain);
				}
				const domains = await contentRepo.getAllDomains(db);
				return json(domains);

			case 'domain-cards':
				if (id) {
					const card = await contentRepo.getDomainCard(db, id);
					return json(card);
				}
				const domainId = url.searchParams.get('domainId');
				if (domainId) {
					const cards = await contentRepo.getDomainCards(db, domainId);
					return json(cards);
				}
				const allCards = await contentRepo.getAllDomainCards(db);
				return json(allCards);

			case 'classes':
				if (id) {
					const classData = await contentRepo.getClass(db, id);
					return json(classData);
				}
				const classes = await contentRepo.getAllClasses(db);
				return json(classes);

			case 'subclasses':
				if (id) {
					const subclass = await contentRepo.getClassSubclass(db, id);
					return json(subclass);
				}
				const classId = url.searchParams.get('classId');
				if (classId) {
					const subclasses = await contentRepo.getClassSubclasses(db, classId);
					return json(subclasses);
				}
				return json({ error: 'Missing classId parameter' }, { status: 400 });

			case 'ancestry-cards':
				if (id) {
					const card = await contentRepo.getAncestryCard(db, id);
					return json(card);
				}
				const ancestryCards = await contentRepo.getAllAncestryCards(db);
				return json(ancestryCards);

			case 'community-cards':
				if (id) {
					const card = await contentRepo.getCommunityCard(db, id);
					return json(card);
				}
				const communityCards = await contentRepo.getAllCommunityCards(db);
				return json(communityCards);

			case 'transformation-cards':
				if (id) {
					const card = await contentRepo.getTransformationCard(db, id);
					return json(card);
				}
				const transformationCards = await contentRepo.getAllTransformationCards(db);
				return json(transformationCards);

			case 'weapons':
				if (id) {
					const weapon = await contentRepo.getWeapon(db, id);
					return json(weapon);
				}
				const category = url.searchParams.get('category');
				if (category) {
					const weapons = await contentRepo.getWeaponsByCategory(db, category);
					return json(weapons);
				}
				const allWeapons = await contentRepo.getAllWeapons(db);
				return json(allWeapons);

			case 'armor':
				if (id) {
					const armor = await contentRepo.getArmor(db, id);
					return json(armor);
				}
				const allArmor = await contentRepo.getAllArmor(db);
				return json(allArmor);

			case 'loot':
				if (id) {
					const loot = await contentRepo.getLoot(db, id);
					return json(loot);
				}
				const allLoot = await contentRepo.getAllLoot(db);
				return json(allLoot);

			case 'consumables':
				if (id) {
					const consumable = await contentRepo.getConsumable(db, id);
					return json(consumable);
				}
				const allConsumables = await contentRepo.getAllConsumables(db);
				return json(allConsumables);

			default:
				return json({ error: 'Invalid type parameter' }, { status: 400 });
		}
	} catch (error) {
		console.error('Error fetching content:', error);
		return json({ error: 'Failed to fetch content' }, { status: 500 });
	}
};

