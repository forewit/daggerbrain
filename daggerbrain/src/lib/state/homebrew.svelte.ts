import type {
	AncestryCard,
	Armor,
	Beastform,
	CharacterClass,
	CommunityCard,
	Consumable,
	Domain,
	DomainCard,
	DomainIds,
	Loot,
	Subclass,
	TransformationCard,
	Weapon
} from '$lib/types/compendium-types';
import { getContext, setContext } from 'svelte';
import {
	get_homebrew_classes,
	create_homebrew_class,
	update_homebrew_class,
	delete_homebrew_class,
	get_homebrew_subclasses,
	create_homebrew_subclass,
	update_homebrew_subclass,
	delete_homebrew_subclass
} from '$lib/remote/homebrew/classes.remote';
import {
	get_homebrew_domains,
	create_homebrew_domain,
	update_homebrew_domain,
	delete_homebrew_domain,
	get_homebrew_domain_cards,
	create_homebrew_domain_card,
	update_homebrew_domain_card,
	delete_homebrew_domain_card
} from '$lib/remote/homebrew/domains.remote';
import {
	get_homebrew_primary_weapons,
	create_homebrew_primary_weapon,
	update_homebrew_primary_weapon,
	delete_homebrew_primary_weapon,
	get_homebrew_secondary_weapons,
	create_homebrew_secondary_weapon,
	update_homebrew_secondary_weapon,
	delete_homebrew_secondary_weapon,
	get_homebrew_armor,
	create_homebrew_armor,
	update_homebrew_armor,
	delete_homebrew_armor,
	get_homebrew_loot,
	create_homebrew_loot,
	update_homebrew_loot,
	delete_homebrew_loot,
	get_homebrew_consumables,
	create_homebrew_consumable,
	update_homebrew_consumable,
	delete_homebrew_consumable
} from '$lib/remote/homebrew/equipment.remote';
import {
	get_homebrew_ancestry_cards,
	create_homebrew_ancestry_card,
	update_homebrew_ancestry_card,
	delete_homebrew_ancestry_card,
	get_homebrew_community_cards,
	create_homebrew_community_card,
	update_homebrew_community_card,
	delete_homebrew_community_card,
	get_homebrew_transformation_cards,
	create_homebrew_transformation_card,
	update_homebrew_transformation_card,
	delete_homebrew_transformation_card
} from '$lib/remote/homebrew/heritages.remote';
import {
	get_homebrew_beastforms,
	create_homebrew_beastform,
	update_homebrew_beastform,
	delete_homebrew_beastform
} from '$lib/remote/homebrew/beastforms.remote';

function createHomebrew() {
	let homebrew_classes: Record<string, CharacterClass> = $state({});
	let homebrew_subclasses: Record<string, Subclass> = $state({});
	let homebrew_domains: Record<string, Domain> = $state({});
	let homebrew_domain_cards: Record<DomainIds, Record<string, DomainCard>> = $state({
		arcana: {},
		blade: {},
		bone: {},
		codex: {},
		grace: {},
		midnight: {},
		sage: {},
		splendor: {},
		valor: {}
	});
	let homebrew_primary_weapons: Record<string, Weapon> = $state({});
	let homebrew_secondary_weapons: Record<string, Weapon> = $state({});
	let homebrew_armor: Record<string, Armor> = $state({});
	let homebrew_loot: Record<string, Loot> = $state({});
	let homebrew_consumables: Record<string, Consumable> = $state({});
	let homebrew_ancestry_cards: Record<string, AncestryCard> = $state({});
	let homebrew_community_cards: Record<string, CommunityCard> = $state({});
	let homebrew_transformation_cards: Record<string, TransformationCard> = $state({});
	let homebrew_beastforms: Record<string, Beastform> = $state({});

	// Helper to fetch with retry on failure
	async function fetchWithRetry<T>(
		fetcher: () => Promise<T>,
		onSuccess: (result: T) => void,
		retries = 3,
		delay = 1000
	): Promise<void> {
		for (let attempt = 1; attempt <= retries; attempt++) {
			try {
				const result = await fetcher();
				onSuccess(result);
				return;
			} catch (error) {
				console.error(`Fetch attempt ${attempt}/${retries} failed:`, error);
				if (attempt < retries) {
					await new Promise((resolve) => setTimeout(resolve, delay * attempt));
				}
			}
		}
		console.error('All fetch retries exhausted');
	}

	// Fetch all data once on initialization
	fetchWithRetry(get_homebrew_classes, (r) => {
		homebrew_classes = r;
	});
	fetchWithRetry(get_homebrew_subclasses, (r) => {
		homebrew_subclasses = r;
	});
	fetchWithRetry(get_homebrew_domains, (r) => {
		homebrew_domains = r;
	});
	fetchWithRetry(get_homebrew_domain_cards, (r) => {
		homebrew_domain_cards = r 
	});
	fetchWithRetry(get_homebrew_primary_weapons, (r) => {
		homebrew_primary_weapons = r;
	});
	fetchWithRetry(get_homebrew_secondary_weapons, (r) => {
		homebrew_secondary_weapons = r;
	});
	fetchWithRetry(get_homebrew_armor, (r) => {
		homebrew_armor = r;
	});
	fetchWithRetry(get_homebrew_loot, (r) => {
		homebrew_loot = r;
	});
	fetchWithRetry(get_homebrew_consumables, (r) => {
		homebrew_consumables = r;
	});
	fetchWithRetry(get_homebrew_ancestry_cards, (r) => {
		homebrew_ancestry_cards = r;
	});
	fetchWithRetry(get_homebrew_community_cards, (r) => {
		homebrew_community_cards = r;
	});
	fetchWithRetry(get_homebrew_transformation_cards, (r) => {
		homebrew_transformation_cards = r;
	});
	fetchWithRetry(get_homebrew_beastforms, (r) => {
		homebrew_beastforms = r;
	});

	// Helper to refresh a specific homebrew item type
	async function refreshType<T>(
		fetcher: () => Promise<T>,
		setter: (value: T) => void
	) {
		try {
			const result = await fetcher();
			setter(result);
		} catch (error) {
			console.error('Failed to refresh type:', error);
		}
	}

	const destroy = () => {};

	return {
		// Getters
		get classes() {
			return homebrew_classes;
		},
		get subclasses() {
			return homebrew_subclasses;
		},
		get domains() {
			return homebrew_domains;
		},
		get domain_cards() {
			return homebrew_domain_cards;
		},
		get primary_weapons() {
			return homebrew_primary_weapons;
		},
		get secondary_weapons() {
			return homebrew_secondary_weapons;
		},
		get armor() {
			return homebrew_armor;
		},
		get loot() {
			return homebrew_loot;
		},
		get consumables() {
			return homebrew_consumables;
		},
		get ancestry_cards() {
			return homebrew_ancestry_cards;
		},
		get community_cards() {
			return homebrew_community_cards;
		},
		get transformation_cards() {
			return homebrew_transformation_cards;
		},
		get beastforms() {
			return homebrew_beastforms;
		},

		// Mutation helpers - Classes
		async createClass(data: CharacterClass): Promise<string> {
			const id = await create_homebrew_class(data);
			await refreshType(get_homebrew_classes, (r) => {
				homebrew_classes = r;
			});
			return id;
		},
		async updateClass(id: string, data: CharacterClass): Promise<void> {
			await update_homebrew_class({ id, data });
			await refreshType(get_homebrew_classes, (r) => {
				homebrew_classes = r;
			});
		},
		async deleteClass(id: string): Promise<void> {
			await delete_homebrew_class(id);
			await refreshType(get_homebrew_classes, (r) => {
				homebrew_classes = r;
			});
		},

		// Mutation helpers - Subclasses
		async createSubclass(data: Subclass): Promise<string> {
			const id = await create_homebrew_subclass(data);
			await refreshType(get_homebrew_subclasses, (r) => {
				homebrew_subclasses = r;
			});
			return id;
		},
		async updateSubclass(id: string, data: Subclass): Promise<void> {
			await update_homebrew_subclass({ id, data });
			await refreshType(get_homebrew_subclasses, (r) => {
				homebrew_subclasses = r;
			});
		},
		async deleteSubclass(id: string): Promise<void> {
			await delete_homebrew_subclass(id);
			await refreshType(get_homebrew_subclasses, (r) => {
				homebrew_subclasses = r;
			});
		},

		// Mutation helpers - Domains
		async createDomain(data: Domain): Promise<string> {
			const id = await create_homebrew_domain(data);
			await refreshType(get_homebrew_domains, (r) => {
				homebrew_domains = r;
			});
			return id;
		},
		async updateDomain(id: string, data: Domain): Promise<void> {
			await update_homebrew_domain({ id, data });
			await refreshType(get_homebrew_domains, (r) => {
				homebrew_domains = r;
			});
		},
		async deleteDomain(id: string): Promise<void> {
			await delete_homebrew_domain(id);
			await refreshType(get_homebrew_domains, (r) => {
				homebrew_domains = r;
			});
		},

		// Mutation helpers - Domain Cards
		async createDomainCard(data: DomainCard): Promise<string> {
			const id = await create_homebrew_domain_card(data);
			await refreshType(get_homebrew_domain_cards, (r) => {
				homebrew_domain_cards = r;
			});
			return id;
		},
		async updateDomainCard(id: string, data: DomainCard): Promise<void> {
			await update_homebrew_domain_card({ id, data });
			await refreshType(get_homebrew_domain_cards, (r) => {
				homebrew_domain_cards = r;
			});
		},
		async deleteDomainCard(id: string): Promise<void> {
			await delete_homebrew_domain_card(id);
			await refreshType(get_homebrew_domain_cards, (r) => {
				homebrew_domain_cards = r;
			});
		},

		// Mutation helpers - Primary Weapons
		async createPrimaryWeapon(data: Weapon): Promise<string> {
			const id = await create_homebrew_primary_weapon(data);
			await refreshType(get_homebrew_primary_weapons, (r) => {
				homebrew_primary_weapons = r;
			});
			return id;
		},
		async updatePrimaryWeapon(id: string, data: Weapon): Promise<void> {
			await update_homebrew_primary_weapon({ id, data });
			await refreshType(get_homebrew_primary_weapons, (r) => {
				homebrew_primary_weapons = r;
			});
		},
		async deletePrimaryWeapon(id: string): Promise<void> {
			await delete_homebrew_primary_weapon(id);
			await refreshType(get_homebrew_primary_weapons, (r) => {
				homebrew_primary_weapons = r;
			});
		},

		// Mutation helpers - Secondary Weapons
		async createSecondaryWeapon(data: Weapon): Promise<string> {
			const id = await create_homebrew_secondary_weapon(data);
			await refreshType(get_homebrew_secondary_weapons, (r) => {
				homebrew_secondary_weapons = r;
			});
			return id;
		},
		async updateSecondaryWeapon(id: string, data: Weapon): Promise<void> {
			await update_homebrew_secondary_weapon({ id, data });
			await refreshType(get_homebrew_secondary_weapons, (r) => {
				homebrew_secondary_weapons = r;
			});
		},
		async deleteSecondaryWeapon(id: string): Promise<void> {
			await delete_homebrew_secondary_weapon(id);
			await refreshType(get_homebrew_secondary_weapons, (r) => {
				homebrew_secondary_weapons = r;
			});
		},

		// Mutation helpers - Armor
		async createArmor(data: Armor): Promise<string> {
			const id = await create_homebrew_armor(data);
			await refreshType(get_homebrew_armor, (r) => {
				homebrew_armor = r;
			});
			return id;
		},
		async updateArmor(id: string, data: Armor): Promise<void> {
			await update_homebrew_armor({ id, data });
			await refreshType(get_homebrew_armor, (r) => {
				homebrew_armor = r;
			});
		},
		async deleteArmor(id: string): Promise<void> {
			await delete_homebrew_armor(id);
			await refreshType(get_homebrew_armor, (r) => {
				homebrew_armor = r;
			});
		},

		// Mutation helpers - Loot
		async createLoot(data: Loot): Promise<string> {
			const id = await create_homebrew_loot(data);
			await refreshType(get_homebrew_loot, (r) => {
				homebrew_loot = r;
			});
			return id;
		},
		async updateLoot(id: string, data: Loot): Promise<void> {
			await update_homebrew_loot({ id, data });
			await refreshType(get_homebrew_loot, (r) => {
				homebrew_loot = r;
			});
		},
		async deleteLoot(id: string): Promise<void> {
			await delete_homebrew_loot(id);
			await refreshType(get_homebrew_loot, (r) => {
				homebrew_loot = r;
			});
		},

		// Mutation helpers - Consumables
		async createConsumable(data: Consumable): Promise<string> {
			const id = await create_homebrew_consumable(data);
			await refreshType(get_homebrew_consumables, (r) => {
				homebrew_consumables = r;
			});
			return id;
		},
		async updateConsumable(id: string, data: Consumable): Promise<void> {
			await update_homebrew_consumable({ id, data });
			await refreshType(get_homebrew_consumables, (r) => {
				homebrew_consumables = r;
			});
		},
		async deleteConsumable(id: string): Promise<void> {
			await delete_homebrew_consumable(id);
			await refreshType(get_homebrew_consumables, (r) => {
				homebrew_consumables = r;
			});
		},

		// Mutation helpers - Ancestry Cards
		async createAncestryCard(data: AncestryCard): Promise<string> {
			const id = await create_homebrew_ancestry_card(data);
			await refreshType(get_homebrew_ancestry_cards, (r) => {
				homebrew_ancestry_cards = r;
			});
			return id;
		},
		async updateAncestryCard(id: string, data: AncestryCard): Promise<void> {
			await update_homebrew_ancestry_card({ id, data });
			await refreshType(get_homebrew_ancestry_cards, (r) => {
				homebrew_ancestry_cards = r;
			});
		},
		async deleteAncestryCard(id: string): Promise<void> {
			await delete_homebrew_ancestry_card(id);
			await refreshType(get_homebrew_ancestry_cards, (r) => {
				homebrew_ancestry_cards = r;
			});
		},

		// Mutation helpers - Community Cards
		async createCommunityCard(data: CommunityCard): Promise<string> {
			const id = await create_homebrew_community_card(data);
			await refreshType(get_homebrew_community_cards, (r) => {
				homebrew_community_cards = r;
			});
			return id;
		},
		async updateCommunityCard(id: string, data: CommunityCard): Promise<void> {
			await update_homebrew_community_card({ id, data });
			await refreshType(get_homebrew_community_cards, (r) => {
				homebrew_community_cards = r;
			});
		},
		async deleteCommunityCard(id: string): Promise<void> {
			await delete_homebrew_community_card(id);
			await refreshType(get_homebrew_community_cards, (r) => {
				homebrew_community_cards = r;
			});
		},

		// Mutation helpers - Transformation Cards
		async createTransformationCard(data: TransformationCard): Promise<string> {
			const id = await create_homebrew_transformation_card(data);
			await refreshType(get_homebrew_transformation_cards, (r) => {
				homebrew_transformation_cards = r;
			});
			return id;
		},
		async updateTransformationCard(id: string, data: TransformationCard): Promise<void> {
			await update_homebrew_transformation_card({ id, data });
			await refreshType(get_homebrew_transformation_cards, (r) => {
				homebrew_transformation_cards = r;
			});
		},
		async deleteTransformationCard(id: string): Promise<void> {
			await delete_homebrew_transformation_card(id);
			await refreshType(get_homebrew_transformation_cards, (r) => {
				homebrew_transformation_cards = r;
			});
		},

		// Mutation helpers - Beastforms
		async createBeastform(data: Beastform): Promise<string> {
			const id = await create_homebrew_beastform(data);
			await refreshType(get_homebrew_beastforms, (r) => {
				homebrew_beastforms = r;
			});
			return id;
		},
		async updateBeastform(id: string, data: Beastform): Promise<void> {
			await update_homebrew_beastform({ id, data });
			await refreshType(get_homebrew_beastforms, (r) => {
				homebrew_beastforms = r;
			});
		},
		async deleteBeastform(id: string): Promise<void> {
			await delete_homebrew_beastform(id);
			await refreshType(get_homebrew_beastforms, (r) => {
				homebrew_beastforms = r;
			});
		},

		// Helper functions
		destroy
	};
}

const HOMEBREW_KEY = Symbol('Homebrew');

export const setHomebrewContext = () => {
	const newHomebrew = createHomebrew();
	return setContext(HOMEBREW_KEY, newHomebrew);
};

export const getHomebrewContext = (): ReturnType<typeof setHomebrewContext> => {
	return getContext(HOMEBREW_KEY);
};
