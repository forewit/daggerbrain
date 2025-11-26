import type {
	AncestryCard,
	Armor,
	Class,
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
import { get_all_domains, get_domain_cards } from '$lib/remote/domains.remote';
import {
	get_all_armor,
	get_all_consumables,
	get_all_loot,
	get_all_primary_weapons,
	get_all_secondary_weapons
} from '$lib/remote/equipment.remote';
import { get_all_sources } from '$lib/remote/sources.remote';

// let ancestry_cards = $derived(await get_all_ancestry_cards());
// let community_cards = $derived(await get_all_community_cards());
// let transformation_cards = $derived(await get_all_transformation_cards());
// let classes = $derived(await get_all_classes());
// let subclasses = $derived(await get_all_subclasses());
// let domains = $derived(await get_all_domains());

// let domain_cards = $derived({
// 	arcana: await get_domain_cards('arcana'),
// 	blade: await get_domain_cards('blade'),
// 	bone: await get_domain_cards('bone'),
// 	codex: await get_domain_cards('codex'),
// 	grace: await get_domain_cards('grace'),
// 	midnight: await get_domain_cards('midnight'),
// 	sage: await get_domain_cards('sage'),
// 	splendor: await get_domain_cards('splendor'),
// 	valor: await get_domain_cards('valor')
// } as Record<DomainIds, Record<string, DomainCard>>);

// let primary_weapons = $derived(await get_all_primary_weapons());
// let secondary_weapons = $derived(await get_all_secondary_weapons());
// let armor = $derived(await get_all_armor());
// let loot = $derived(await get_all_loot());
// let consumables = $derived(await get_all_consumables());
// let sources = $derived(await get_all_sources());

function createCompendium() {
	let ancestry_cards: Record<string, AncestryCard> = $state({});
	let community_cards: Record<string, CommunityCard> = $state({});
	let transformation_cards: Record<string, TransformationCard> = $state({});
	let classes: Record<string, Class> = $state({});
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

	$effect(() => {
		if (Object.keys(ancestry_cards).length === 0) {
			get_all_ancestry_cards().then((result) => {
				ancestry_cards = result;
			});
		}

		if (Object.keys(community_cards).length === 0) {
			get_all_community_cards().then((result) => {
				community_cards = result;
			});
		}

		if (Object.keys(transformation_cards).length === 0) {
			get_all_transformation_cards().then((result) => {
				transformation_cards = result;
			});
		}
		
		if (Object.keys(classes).length === 0) {
			get_all_classes().then((result) => {
				classes = result;
			});
		}
		
		if (Object.keys(subclasses).length === 0) {
			get_all_subclasses().then((result) => {
				subclasses = result;
			});
		}
		
		if (Object.keys(domains).length === 0) {
			get_all_domains().then((result) => {
				domains = result;
			});
		}
		
		for (const [domainId, domain] of Object.entries(domain_cards)) {
			if (Object.keys(domain).length === 0) {
				get_domain_cards(domainId as DomainIds).then((result) => {
					domain_cards[domainId as DomainIds] = result;
				});
			}
		}

		if (Object.keys(primary_weapons).length === 0) {
			get_all_primary_weapons().then((result) => {
				primary_weapons = result;
			});
		}
		
		if (Object.keys(secondary_weapons).length === 0) {
			get_all_secondary_weapons().then((result) => {
				secondary_weapons = result;
			});
		}
		
		if (Object.keys(armor).length === 0) {
			get_all_armor().then((result) => {
				armor = result;
			});
		}
		
		if (Object.keys(loot).length === 0) {
			get_all_loot().then((result) => {
				loot = result;
			});
		}
		
		if (Object.keys(consumables).length === 0) {
			get_all_consumables().then((result) => {
				consumables = result;
			});
		}
		
		if (Object.keys(sources).length === 0) {
			get_all_sources().then((result) => {
				sources = result;
			});
		}
	});
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
