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
	Source,
	SourceIds,
	Subclass,
	TransformationCard,
	Weapon
} from '@shared/types/compendium.types';
import { getContext, setContext } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';
import {
	get_all_ancestry_cards,
	get_all_community_cards,
	get_all_transformation_cards
} from '$lib/remote/compendium/heritages.remote';
import { get_all_classes, get_all_subclasses } from '$lib/remote/compendium/classes.remote';
import { get_all_beastforms } from '$lib/remote/compendium/beastforms.remote';
import { get_all_domains, get_domain_cards } from '$lib/remote/compendium/domains.remote';
import {
	get_all_armor,
	get_all_consumables,
	get_all_loot,
	get_all_primary_weapons,
	get_all_secondary_weapons
} from '$lib/remote/compendium/equipment.remote';
import { get_all_sources } from '$lib/remote/compendium/sources.remote';
import { getHomebrewContext } from './homebrew.svelte';
import { getCharacterContext } from './character.svelte';
import { get_campaign_homebrew_items } from '$lib/remote/campaigns/campaign-homebrew.remote';

function createCompendium() {
	// Campaign homebrew state (loaded reactively from character context)
	let campaign_homebrew = $state<CompendiumContent>({
		primary_weapons: {},
		secondary_weapons: {},
		armor: {},
		loot: {},
		consumables: {},
		beastforms: {},
		classes: {},
		subclasses: {},
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
		transformation_cards: {},
		domains: {}
	});

	function load_campaign_homebrew(campaignId: string) {
		get_campaign_homebrew_items(campaignId)
			.then((items) => {
				campaign_homebrew = items;
			})
			.catch((err) => {
				console.error('Failed to load campaign homebrew:', err);
				campaign_homebrew = {
					primary_weapons: {},
					secondary_weapons: {},
					armor: {},
					loot: {},
					consumables: {},
					beastforms: {},
					classes: {},
					subclasses: {},
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
					transformation_cards: {},
					domains: {}
				};
			});
	}

	const homebrewContext = getHomebrewContext();

	// Helper to fetch with retry on failure
	let accessible_sources = $state<Record<string, Source>>({});

	let accessible_content = $state<CompendiumContent>({
		primary_weapons: {},
		secondary_weapons: {},
		armor: {},
		loot: {},
		consumables: {},
		beastforms: {},
		classes: {},
		subclasses: {},
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
		transformation_cards: {},
		domains: {}
	});

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
	fetchWithRetry(get_all_sources, (r) => {
		accessible_sources = r;
	});
	fetchWithRetry(get_all_ancestry_cards, (r) => {
		accessible_content.ancestry_cards = r;
	});
	fetchWithRetry(get_all_community_cards, (r) => {
		accessible_content.community_cards = r;
	});
	fetchWithRetry(get_all_transformation_cards, (r) => {
		accessible_content.transformation_cards = r;
	});
	fetchWithRetry(get_all_beastforms, (r) => {
		accessible_content.beastforms = r;
	});
	fetchWithRetry(get_all_classes, (r) => {
		accessible_content.classes = r;
	});
	fetchWithRetry(get_all_subclasses, (r) => {
		accessible_content.subclasses = r;
	});
	fetchWithRetry(get_all_domains, (r) => {
		accessible_content.domains = r;
	});
	fetchWithRetry(get_all_primary_weapons, (r) => {
		accessible_content.primary_weapons = r;
	});
	fetchWithRetry(get_all_secondary_weapons, (r) => {
		accessible_content.secondary_weapons = r;
	});
	fetchWithRetry(get_all_armor, (r) => {
		accessible_content.armor = r;
	});
	fetchWithRetry(get_all_loot, (r) => {
		accessible_content.loot = r;
	});
	fetchWithRetry(get_all_consumables, (r) => {
		accessible_content.consumables = r;
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
				accessible_content.domain_cards[domainId] = r;
			}
		);
	}

	let source_whitelist = $state(new SvelteSet<SourceIds>(['SRD']));

	// Derived accessible content
	let sources: Record<string, Source> = $derived(
		Object.fromEntries(
			Object.entries({
				...accessible_sources
			}).filter(([, source]) => source_whitelist.has(source.source_id))
		)
	);
	let ancestry_cards: Record<string, AncestryCard> = $derived(
		Object.fromEntries(
			Object.entries({
				...homebrewContext.ancestry_cards,
				...campaign_homebrew.ancestry_cards,
				...accessible_content.ancestry_cards
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let community_cards: Record<string, CommunityCard> = $derived(
		Object.fromEntries(
			Object.entries({
				...homebrewContext.community_cards,
				...campaign_homebrew.community_cards,
				...accessible_content.community_cards
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let transformation_cards: Record<string, TransformationCard> = $derived(
		Object.fromEntries(
			Object.entries({
				...homebrewContext.transformation_cards,
				...campaign_homebrew.transformation_cards,
				...accessible_content.transformation_cards
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let beastforms: Record<string, Beastform> = $derived(
		Object.fromEntries(
			Object.entries({
				...homebrewContext.beastforms,
				...campaign_homebrew.beastforms,
				...accessible_content.beastforms
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let classes: Record<string, CharacterClass> = $derived(
		Object.fromEntries(
			Object.entries({
				...homebrewContext.classes,
				...campaign_homebrew.classes,
				...accessible_content.classes
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let subclasses: Record<string, Subclass> = $derived(
		Object.fromEntries(
			Object.entries({
				...homebrewContext.subclasses,
				...campaign_homebrew.subclasses,
				...accessible_content.subclasses
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let domains: Record<string, Domain> = $derived(
		Object.fromEntries(
			Object.entries({
				...homebrewContext.domains,
				...campaign_homebrew.domains,
				...accessible_content.domains
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let domain_cards: Record<DomainIds, Record<string, DomainCard>> = $derived({
		arcana: Object.fromEntries(
			Object.entries({
				...homebrewContext.domain_cards.arcana,
				...campaign_homebrew.domain_cards.arcana,
				...accessible_content.domain_cards.arcana
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		),
		blade: Object.fromEntries(
			Object.entries({
				...homebrewContext.domain_cards.blade,
				...campaign_homebrew.domain_cards.blade,
				...accessible_content.domain_cards.blade
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		),
		bone: Object.fromEntries(
			Object.entries({
				...homebrewContext.domain_cards.bone,
				...campaign_homebrew.domain_cards.bone,
				...accessible_content.domain_cards.bone
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		),
		codex: Object.fromEntries(
			Object.entries({
				...homebrewContext.domain_cards.codex,
				...campaign_homebrew.domain_cards.codex,
				...accessible_content.domain_cards.codex
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		),
		grace: Object.fromEntries(
			Object.entries({
				...homebrewContext.domain_cards.grace,
				...campaign_homebrew.domain_cards.grace,
				...accessible_content.domain_cards.grace
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		),
		midnight: Object.fromEntries(
			Object.entries({
				...homebrewContext.domain_cards.midnight,
				...campaign_homebrew.domain_cards.midnight,
				...accessible_content.domain_cards.midnight
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		),
		sage: Object.fromEntries(
			Object.entries({
				...homebrewContext.domain_cards.sage,
				...campaign_homebrew.domain_cards.sage,
				...accessible_content.domain_cards.sage
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		),
		splendor: Object.fromEntries(
			Object.entries({
				...homebrewContext.domain_cards.splendor,
				...campaign_homebrew.domain_cards.splendor,
				...accessible_content.domain_cards.splendor
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		),
		valor: Object.fromEntries(
			Object.entries({
				...homebrewContext.domain_cards.valor,
				...campaign_homebrew.domain_cards.valor,
				...accessible_content.domain_cards.valor
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	});
	let primary_weapons: Record<string, Weapon> = $derived(
		Object.fromEntries(
			Object.entries({
				...homebrewContext.primary_weapons,
				...campaign_homebrew.primary_weapons,
				...accessible_content.primary_weapons
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let secondary_weapons: Record<string, Weapon> = $derived(
		Object.fromEntries(
			Object.entries({
				...homebrewContext.secondary_weapons,
				...campaign_homebrew.secondary_weapons,
				...accessible_content.secondary_weapons
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let armor: Record<string, Armor> = $derived(
		Object.fromEntries(
			Object.entries({
				...homebrewContext.armor,
				...campaign_homebrew.armor,
				...accessible_content.armor
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let loot: Record<string, Loot> = $derived(
		Object.fromEntries(
			Object.entries({
				...homebrewContext.loot,
				...campaign_homebrew.loot,
				...accessible_content.loot
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let consumables: Record<string, Consumable> = $derived(
		Object.fromEntries(
			Object.entries({
				...homebrewContext.consumables,
				...campaign_homebrew.consumables,
				...accessible_content.consumables
			}).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);

	const destroy = () => {};

	return {
		get source_whitelist() {
			return source_whitelist;
		},
		set source_whitelist(value) {
			source_whitelist = value;
		},
		get sources() {
			return sources;
		},
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

		// helper functions
		destroy,
		load_campaign_homebrew
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
