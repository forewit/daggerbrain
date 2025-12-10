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
	Source,
	Subclass,
	TransformationCard,
	Weapon
} from '$lib/types/compendium-types';
import { getContext, setContext } from 'svelte';
import {
	get_all_ancestry_cards,
	get_all_community_cards,
	get_all_transformation_cards
} from '$lib/remote/heritages.remote';
import { get_all_classes, get_all_subclasses } from '$lib/remote/classes.remote';
import { get_all_beastforms } from '$lib/remote/beastforms.remote';
import { get_all_domains, get_domain_cards } from '$lib/remote/domains.remote';
import {
	get_all_armor,
	get_all_consumables,
	get_all_loot,
	get_all_primary_weapons,
	get_all_secondary_weapons
} from '$lib/remote/equipment.remote';
import { get_all_sources } from '$lib/remote/sources.remote';

function createCompendium() {
	let ancestry_cards: Record<string, AncestryCard> = $state({});
	let community_cards: Record<string, CommunityCard> = $state({});
	let transformation_cards: Record<string, TransformationCard> = $state({});
	let beastforms: Record<string, Beastform> = $state({});
	let classes: Record<string, CharacterClass> = $state({});
	let subclasses: Record<string, Subclass> = $state({});
	let domains: Record<string, Domain> = $state({});
	let domain_cards: Record<DomainIds, Record<string, DomainCard>> = $state({
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
	let primary_weapons: Record<string, Weapon> = $state({});
	let secondary_weapons: Record<string, Weapon> = $state({});
	let armor: Record<string, Armor> = $state({});
	let loot: Record<string, Loot> = $state({});
	let consumables: Record<string, Consumable> = $state({});
	let sources: Record<string, Source> = $state({});

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
	fetchWithRetry(get_all_ancestry_cards, (r) => {
		ancestry_cards = r;
	});
	fetchWithRetry(get_all_community_cards, (r) => {
		community_cards = r;
	});
	fetchWithRetry(get_all_transformation_cards, (r) => {
		transformation_cards = r;
	});
	fetchWithRetry(get_all_beastforms, (r) => {
		beastforms = r;
	});
	fetchWithRetry(get_all_classes, (r) => {
		classes = r;
	});
	fetchWithRetry(get_all_subclasses, (r) => {
		subclasses = r;
	});
	fetchWithRetry(get_all_domains, (r) => {
		domains = r;
	});
	fetchWithRetry(get_all_primary_weapons, (r) => {
		primary_weapons = r;
	});
	fetchWithRetry(get_all_secondary_weapons, (r) => {
		secondary_weapons = r;
	});
	fetchWithRetry(get_all_armor, (r) => {
		armor = r;
	});
	fetchWithRetry(get_all_loot, (r) => {
		loot = r;
	});
	fetchWithRetry(get_all_consumables, (r) => {
		consumables = r;
	});
	fetchWithRetry(get_all_sources, (r) => {
		sources = r;
	});

	// Fetch all domain cards
	const domainIds: DomainIds[] = [
		'arcana',
		'blade',
		'bone',
		'codex',
		'grace',
		'midnight',
		'sage',
		'splendor',
		'valor'
	];
	for (const domainId of domainIds) {
		fetchWithRetry(
			() => get_domain_cards(domainId),
			(r) => {
				domain_cards[domainId] = r;
			}
		);
	}
	const destroy = () => {};

	return {
		get ancestry_cards() {
			return ancestry_cards;
		},
		get community_cards() {
			return community_cards;
		},
		get transformation_cards() {
			return transformation_cards;
		},
		get beastforms() {
			return beastforms;
		},
		get classes() {
			return classes;
		},
		get subclasses() {
			return subclasses;
		},
		get domains() {
			return domains;
		},
		get domain_cards() {
			return domain_cards;
		},
		get primary_weapons() {
			return primary_weapons;
		},
		get secondary_weapons() {
			return secondary_weapons;
		},
		get armor() {
			return armor;
		},
		get loot() {
			return loot;
		},
		get consumables() {
			return consumables;
		},
		get sources() {
			return sources;
		},

		// helper functions
		destroy
	};
}

const COMPENDIUM_KEY = Symbol('Compendium');

export const setCompendiumContext = () => {
	const newCompendium = createCompendium();
	return setContext(COMPENDIUM_KEY, newCompendium);
};

export const getCompendiumContext = (): ReturnType<typeof setCompendiumContext> => {
	return getContext(COMPENDIUM_KEY);
};
