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
	SourceIds,
	Subclass,
	TransformationCard,
	Weapon
} from '$lib/types/compendium-types';
import { getContext, setContext } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';
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
import { getHomebrewContext } from './homebrew.svelte';
import { getCharacterContext } from './character.svelte';
import { get_campaign_homebrew_items } from '$lib/remote/campaign-homebrew.remote';

function createCompendium() {
	let all_ancestry_cards: Record<string, AncestryCard> = $state({});
	let all_community_cards: Record<string, CommunityCard> = $state({});
	let all_transformation_cards: Record<string, TransformationCard> = $state({});
	let all_beastforms: Record<string, Beastform> = $state({});
	let all_classes: Record<string, CharacterClass> = $state({});
	let all_subclasses: Record<string, Subclass> = $state({});
	let all_domains: Record<string, Domain> = $state({});
	let all_domain_cards: Record<DomainIds, Record<string, DomainCard>> = $state({
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
	let all_primary_weapons: Record<string, Weapon> = $state({});
	let all_secondary_weapons: Record<string, Weapon> = $state({});
	let all_armor: Record<string, Armor> = $state({});
	let all_loot: Record<string, Loot> = $state({});
	let all_consumables: Record<string, Consumable> = $state({});
	let all_sources: Record<string, Source> = $state({});

	const homebrew = getHomebrewContext();

	function compendiumEquivilanceCheck(A: Record<string, any>, B: Record<string, any>) {
		// check if all keys are the same
		if (Object.keys(A).length !== Object.keys(B).length) {
			return false;
		}
		for (const key in A) {
			if (A[key] !== B[key]) {
				return false;
			}
		}
		return true;
	}

	$effect(() => {
		const new_all_classes: Record<string, CharacterClass> = { ...homebrew.classes, ...all_classes };
		if (!compendiumEquivilanceCheck(new_all_classes, all_classes)) {
			all_classes = new_all_classes;
		}
	});

	$effect(() => {
		const new_all_subclasses: Record<string, Subclass> = {
			...homebrew.subclasses,
			...all_subclasses
		};
		if (!compendiumEquivilanceCheck(new_all_subclasses, all_subclasses)) {
			all_subclasses = new_all_subclasses;
		}
	});

	$effect(() => {
		const new_all_domains: Record<string, Domain> = { ...homebrew.domains, ...all_domains };
		if (!compendiumEquivilanceCheck(new_all_domains, all_domains)) {
			all_domains = new_all_domains;
		}
	});

	$effect(() => {
		const new_all_domain_cards: Record<DomainIds, Record<string, DomainCard>> = {
			...homebrew.domain_cards,
			...all_domain_cards
		};
		if (!compendiumEquivilanceCheck(new_all_domain_cards, all_domain_cards)) {
			all_domain_cards = new_all_domain_cards;
		}
	});

	$effect(() => {
		const new_all_primary_weapons: Record<string, Weapon> = {
			...homebrew.primary_weapons,
			...all_primary_weapons
		};
		if (!compendiumEquivilanceCheck(new_all_primary_weapons, all_primary_weapons)) {
			all_primary_weapons = new_all_primary_weapons;
		}
	});

	$effect(() => {
		const new_all_secondary_weapons: Record<string, Weapon> = {
			...homebrew.secondary_weapons,
			...all_secondary_weapons
		};
		if (!compendiumEquivilanceCheck(new_all_secondary_weapons, all_secondary_weapons)) {
			all_secondary_weapons = new_all_secondary_weapons;
		}
	});

	$effect(() => {
		const new_all_armor: Record<string, Armor> = { ...homebrew.armor, ...all_armor };
		if (!compendiumEquivilanceCheck(new_all_armor, all_armor)) {
			all_armor = new_all_armor;
		}
	});

	$effect(() => {
		const new_all_loot: Record<string, Loot> = { ...homebrew.loot, ...all_loot };
		if (!compendiumEquivilanceCheck(new_all_loot, all_loot)) {
			all_loot = new_all_loot;
		}
	});

	$effect(() => {
		const new_all_consumables: Record<string, Consumable> = {
			...homebrew.consumables,
			...all_consumables
		};
		if (!compendiumEquivilanceCheck(new_all_consumables, all_consumables)) {
			all_consumables = new_all_consumables;
		}
	});

	$effect(() => {
		const new_ancestry_cards: Record<string, AncestryCard> = {
			...homebrew.ancestry_cards,
			...all_ancestry_cards
		};
		if (!compendiumEquivilanceCheck(new_ancestry_cards, all_ancestry_cards)) {
			all_ancestry_cards = new_ancestry_cards;
		}
	});

	$effect(() => {
		const new_community_cards: Record<string, CommunityCard> = {
			...homebrew.community_cards,
			...all_community_cards
		};
		if (!compendiumEquivilanceCheck(new_community_cards, all_community_cards)) {
			all_community_cards = new_community_cards;
		}
	});

	$effect(() => {
		const new_transformation_cards: Record<string, TransformationCard> = {
			...homebrew.transformation_cards,
			...all_transformation_cards
		};
		if (!compendiumEquivilanceCheck(new_transformation_cards, all_transformation_cards)) {
			all_transformation_cards = new_transformation_cards;
		}
	});

	$effect(() => {
		const new_beastforms: Record<string, Beastform> = { ...homebrew.beastforms, ...all_beastforms };
		if (!compendiumEquivilanceCheck(new_beastforms, all_beastforms)) {
			all_beastforms = new_beastforms;
		}
	});

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
		all_ancestry_cards = r;
	});
	fetchWithRetry(get_all_community_cards, (r) => {
		all_community_cards = r;
	});
	fetchWithRetry(get_all_transformation_cards, (r) => {
		all_transformation_cards = r;
	});
	fetchWithRetry(get_all_beastforms, (r) => {
		all_beastforms = r;
	});
	fetchWithRetry(get_all_classes, (r) => {
		all_classes = r;
	});
	fetchWithRetry(get_all_subclasses, (r) => {
		all_subclasses = r;
	});
	fetchWithRetry(get_all_domains, (r) => {
		all_domains = r;
	});
	fetchWithRetry(get_all_primary_weapons, (r) => {
		all_primary_weapons = r;
	});
	fetchWithRetry(get_all_secondary_weapons, (r) => {
		all_secondary_weapons = r;
	});
	fetchWithRetry(get_all_armor, (r) => {
		all_armor = r;
	});
	fetchWithRetry(get_all_loot, (r) => {
		all_loot = r;
	});
	fetchWithRetry(get_all_consumables, (r) => {
		all_consumables = r;
	});
	fetchWithRetry(get_all_sources, (r) => {
		all_sources = r;
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
				all_domain_cards[domainId] = r;
			}
		);
	}

	let source_whitelist = $state(new SvelteSet<SourceIds>(['SRD']));

	let ancestry_cards: Record<string, AncestryCard> = $derived(
		Object.fromEntries(
			Object.entries(all_ancestry_cards).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let community_cards: Record<string, CommunityCard> = $derived(
		Object.fromEntries(
			Object.entries(all_community_cards).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let transformation_cards: Record<string, TransformationCard> = $derived(
		Object.fromEntries(
			Object.entries(all_transformation_cards).filter(([, card]) =>
				source_whitelist.has(card.source_id)
			)
		)
	);
	let beastforms: Record<string, Beastform> = $derived(
		Object.fromEntries(
			Object.entries(all_beastforms).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let classes: Record<string, CharacterClass> = $derived(
		Object.fromEntries(
			Object.entries(all_classes).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let subclasses: Record<string, Subclass> = $derived(
		Object.fromEntries(
			Object.entries(all_subclasses).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let domains: Record<string, Domain> = $derived(
		Object.fromEntries(
			Object.entries(all_domains).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let domain_cards: Record<DomainIds, Record<string, DomainCard>> = $derived({
		arcana: Object.fromEntries(
			Object.entries(all_domain_cards.arcana).filter(([, card]) =>
				source_whitelist.has(card.source_id)
			)
		),
		blade: Object.fromEntries(
			Object.entries(all_domain_cards.blade).filter(([, card]) =>
				source_whitelist.has(card.source_id)
			)
		),
		bone: Object.fromEntries(
			Object.entries(all_domain_cards.bone).filter(([, card]) =>
				source_whitelist.has(card.source_id)
			)
		),
		codex: Object.fromEntries(
			Object.entries(all_domain_cards.codex).filter(([, card]) =>
				source_whitelist.has(card.source_id)
			)
		),
		grace: Object.fromEntries(
			Object.entries(all_domain_cards.grace).filter(([, card]) =>
				source_whitelist.has(card.source_id)
			)
		),
		midnight: Object.fromEntries(
			Object.entries(all_domain_cards.midnight).filter(([, card]) =>
				source_whitelist.has(card.source_id)
			)
		),
		sage: Object.fromEntries(
			Object.entries(all_domain_cards.sage).filter(([, card]) =>
				source_whitelist.has(card.source_id)
			)
		),
		splendor: Object.fromEntries(
			Object.entries(all_domain_cards.splendor).filter(([, card]) =>
				source_whitelist.has(card.source_id)
			)
		),
		valor: Object.fromEntries(
			Object.entries(all_domain_cards.valor).filter(([, card]) =>
				source_whitelist.has(card.source_id)
			)
		)
	});
	let primary_weapons: Record<string, Weapon> = $derived(
		Object.fromEntries(
			Object.entries(all_primary_weapons).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let secondary_weapons: Record<string, Weapon> = $derived(
		Object.fromEntries(
			Object.entries(all_secondary_weapons).filter(([, card]) =>
				source_whitelist.has(card.source_id)
			)
		)
	);
	let armor: Record<string, Armor> = $derived(
		Object.fromEntries(
			Object.entries(all_armor).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let loot: Record<string, Loot> = $derived(
		Object.fromEntries(
			Object.entries(all_loot).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);
	let consumables: Record<string, Consumable> = $derived(
		Object.fromEntries(
			Object.entries(all_consumables).filter(([, card]) => source_whitelist.has(card.source_id))
		)
	);

	// Campaign homebrew state (loaded reactively from character context)
	let campaign_homebrew = $state<{
		primary_weapons: Record<string, Weapon>;
		secondary_weapons: Record<string, Weapon>;
		armor: Record<string, Armor>;
		loot: Record<string, Loot>;
		consumables: Record<string, Consumable>;
		beastforms: Record<string, Beastform>;
		classes: Record<string, CharacterClass>;
		subclasses: Record<string, Subclass>;
		domain_cards: Record<DomainIds, Record<string, DomainCard>>;
		ancestry_cards: Record<string, AncestryCard>;
		community_cards: Record<string, CommunityCard>;
		transformation_cards: Record<string, TransformationCard>;
	} | null>(null);

	// Load campaign homebrew reactively from character context
	$effect(() => {
		try {
			const characterContext = getCharacterContext();
			const character = characterContext?.character;

			if (!character?.campaign_id || !character.settings.campaign_homebrew_enabled) {
				campaign_homebrew = null;
				return;
			}

			// Load campaign homebrew
			get_campaign_homebrew_items(character.campaign_id)
				.then((items) => {
					// Convert to the format expected by compendium
					campaign_homebrew = {
						primary_weapons: items.primary_weapons || {},
						secondary_weapons: items.secondary_weapons || {},
						armor: items.armor || {},
						loot: items.loot || {},
						consumables: items.consumables || {},
						beastforms: items.beastforms || {},
						classes: items.classes || {},
						subclasses: items.subclasses || {},
						domain_cards: (items.domain_cards || {}) as Record<
							DomainIds,
							Record<string, DomainCard>
						>,
						ancestry_cards: items.ancestry_cards || {},
						community_cards: items.community_cards || {},
						transformation_cards: items.transformation_cards || {}
					};
				})
				.catch((err) => {
					console.error('Failed to load campaign homebrew:', err);
					campaign_homebrew = null;
				});
		} catch {
			// No character context available
			campaign_homebrew = null;
		}
	});

	// Merge campaign homebrew into all_* collections
	$effect(() => {
		if (!campaign_homebrew) return;

		// Merge campaign homebrew (takes precedence over base compendium)
		all_classes = { ...all_classes, ...campaign_homebrew.classes };
		all_subclasses = { ...all_subclasses, ...campaign_homebrew.subclasses };
		all_primary_weapons = { ...all_primary_weapons, ...campaign_homebrew.primary_weapons };
		all_secondary_weapons = { ...all_secondary_weapons, ...campaign_homebrew.secondary_weapons };
		all_armor = { ...all_armor, ...campaign_homebrew.armor };
		all_loot = { ...all_loot, ...campaign_homebrew.loot };
		all_consumables = { ...all_consumables, ...campaign_homebrew.consumables };
		all_beastforms = { ...all_beastforms, ...campaign_homebrew.beastforms };
		all_ancestry_cards = { ...all_ancestry_cards, ...campaign_homebrew.ancestry_cards };
		all_community_cards = { ...all_community_cards, ...campaign_homebrew.community_cards };
		all_transformation_cards = {
			...all_transformation_cards,
			...campaign_homebrew.transformation_cards
		};

		// Merge domain cards by domain
		for (const domainId of Object.keys(campaign_homebrew.domain_cards) as DomainIds[]) {
			if (campaign_homebrew.domain_cards[domainId]) {
				all_domain_cards[domainId] = {
					...all_domain_cards[domainId],
					...campaign_homebrew.domain_cards[domainId]
				};
			}
		}
	});

	const destroy = () => {};

	return {
		get source_whitelist() {
			return source_whitelist;
		},
		set source_whitelist(value) {
			source_whitelist = value;
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
		get sources() {
			return all_sources;
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
