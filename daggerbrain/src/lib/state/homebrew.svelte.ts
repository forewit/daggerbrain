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
	// State for each collection
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
	let loading = $state(true);

	// Last saved state for each collection
	let lastSaved_classes = $state<string | null>(null);
	let lastSaved_subclasses = $state<string | null>(null);
	let lastSaved_domains = $state<string | null>(null);
	let lastSaved_domain_cards = $state<string | null>(null);
	let lastSaved_primary_weapons = $state<string | null>(null);
	let lastSaved_secondary_weapons = $state<string | null>(null);
	let lastSaved_armor = $state<string | null>(null);
	let lastSaved_loot = $state<string | null>(null);
	let lastSaved_consumables = $state<string | null>(null);
	let lastSaved_ancestry_cards = $state<string | null>(null);
	let lastSaved_community_cards = $state<string | null>(null);
	let lastSaved_transformation_cards = $state<string | null>(null);
	let lastSaved_beastforms = $state<string | null>(null);

	// Debounce timers and in-flight tracking
	const debounceTimers: Record<string, ReturnType<typeof setTimeout> | null> = {};
	const inFlight = new Set<string>();

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

	// Fetch all data on initialization
	$effect(() => {
		loading = true;
		Promise.all([
			fetchWithRetry(get_homebrew_classes, (r) => {
				homebrew_classes = r;
				lastSaved_classes = JSON.stringify(r);
			}),
			fetchWithRetry(get_homebrew_subclasses, (r) => {
				homebrew_subclasses = r;
				lastSaved_subclasses = JSON.stringify(r);
			}),
			fetchWithRetry(get_homebrew_domains, (r) => {
				homebrew_domains = r;
				lastSaved_domains = JSON.stringify(r);
			}),
			fetchWithRetry(get_homebrew_domain_cards, (r) => {
				homebrew_domain_cards = r;
				lastSaved_domain_cards = JSON.stringify(r);
			}),
			fetchWithRetry(get_homebrew_primary_weapons, (r) => {
				homebrew_primary_weapons = r;
				lastSaved_primary_weapons = JSON.stringify(r);
			}),
			fetchWithRetry(get_homebrew_secondary_weapons, (r) => {
				homebrew_secondary_weapons = r;
				lastSaved_secondary_weapons = JSON.stringify(r);
			}),
			fetchWithRetry(get_homebrew_armor, (r) => {
				homebrew_armor = r;
				lastSaved_armor = JSON.stringify(r);
			}),
			fetchWithRetry(get_homebrew_loot, (r) => {
				homebrew_loot = r;
				lastSaved_loot = JSON.stringify(r);
			}),
			fetchWithRetry(get_homebrew_consumables, (r) => {
				homebrew_consumables = r;
				lastSaved_consumables = JSON.stringify(r);
			}),
			fetchWithRetry(get_homebrew_ancestry_cards, (r) => {
				homebrew_ancestry_cards = r;
				lastSaved_ancestry_cards = JSON.stringify(r);
			}),
			fetchWithRetry(get_homebrew_community_cards, (r) => {
				homebrew_community_cards = r;
				lastSaved_community_cards = JSON.stringify(r);
			}),
			fetchWithRetry(get_homebrew_transformation_cards, (r) => {
				homebrew_transformation_cards = r;
				lastSaved_transformation_cards = JSON.stringify(r);
			}),
			fetchWithRetry(get_homebrew_beastforms, (r) => {
				homebrew_beastforms = r;
				lastSaved_beastforms = JSON.stringify(r);
			})
		]).finally(() => {
			loading = false;
		});
	});

	// Auto-save effect for classes
	$effect(() => {
		if (lastSaved_classes === null) return;
		const currentJson = JSON.stringify(homebrew_classes);
		if (currentJson === lastSaved_classes) return;

		const saved = JSON.parse(lastSaved_classes) as typeof homebrew_classes;
		for (const [id, item] of Object.entries(homebrew_classes)) {
			const itemJson = JSON.stringify(item);
			const savedItemJson = saved[id] ? JSON.stringify(saved[id]) : null;
			if (savedItemJson === null || itemJson === savedItemJson || inFlight.has(`classes:${id}`)) continue;

			if (debounceTimers[`classes:${id}`]) clearTimeout(debounceTimers[`classes:${id}`]!);
			debounceTimers[`classes:${id}`] = setTimeout(() => {
				delete debounceTimers[`classes:${id}`];
				inFlight.add(`classes:${id}`);
				update_homebrew_class({ id, data: JSON.parse(JSON.stringify(homebrew_classes[id])) })
					.then(() => { lastSaved_classes = JSON.stringify(homebrew_classes); })
					.catch((e) => console.error('Failed to auto-save class:', e))
					.finally(() => inFlight.delete(`classes:${id}`));
			}, 300);
		}
	});

	// Auto-save effect for subclasses
	$effect(() => {
		if (lastSaved_subclasses === null) return;
		const currentJson = JSON.stringify(homebrew_subclasses);
		if (currentJson === lastSaved_subclasses) return;

		const saved = JSON.parse(lastSaved_subclasses) as typeof homebrew_subclasses;
		for (const [id, item] of Object.entries(homebrew_subclasses)) {
			const itemJson = JSON.stringify(item);
			const savedItemJson = saved[id] ? JSON.stringify(saved[id]) : null;
			if (savedItemJson === null || itemJson === savedItemJson || inFlight.has(`subclasses:${id}`)) continue;

			if (debounceTimers[`subclasses:${id}`]) clearTimeout(debounceTimers[`subclasses:${id}`]!);
			debounceTimers[`subclasses:${id}`] = setTimeout(() => {
				delete debounceTimers[`subclasses:${id}`];
				inFlight.add(`subclasses:${id}`);
				update_homebrew_subclass({ id, data: JSON.parse(JSON.stringify(homebrew_subclasses[id])) })
					.then(() => { lastSaved_subclasses = JSON.stringify(homebrew_subclasses); })
					.catch((e) => console.error('Failed to auto-save subclass:', e))
					.finally(() => inFlight.delete(`subclasses:${id}`));
			}, 300);
		}
	});

	// Auto-save effect for domains
	$effect(() => {
		if (lastSaved_domains === null) return;
		const currentJson = JSON.stringify(homebrew_domains);
		if (currentJson === lastSaved_domains) return;

		const saved = JSON.parse(lastSaved_domains) as typeof homebrew_domains;
		for (const [id, item] of Object.entries(homebrew_domains)) {
			const itemJson = JSON.stringify(item);
			const savedItemJson = saved[id] ? JSON.stringify(saved[id]) : null;
			if (savedItemJson === null || itemJson === savedItemJson || inFlight.has(`domains:${id}`)) continue;

			if (debounceTimers[`domains:${id}`]) clearTimeout(debounceTimers[`domains:${id}`]!);
			debounceTimers[`domains:${id}`] = setTimeout(() => {
				delete debounceTimers[`domains:${id}`];
				inFlight.add(`domains:${id}`);
				update_homebrew_domain({ id, data: JSON.parse(JSON.stringify(homebrew_domains[id])) })
					.then(() => { lastSaved_domains = JSON.stringify(homebrew_domains); })
					.catch((e) => console.error('Failed to auto-save domain:', e))
					.finally(() => inFlight.delete(`domains:${id}`));
			}, 300);
		}
	});

	// Auto-save effect for domain_cards (nested structure)
	$effect(() => {
		if (lastSaved_domain_cards === null) return;
		const currentJson = JSON.stringify(homebrew_domain_cards);
		if (currentJson === lastSaved_domain_cards) return;

		const saved = JSON.parse(lastSaved_domain_cards) as typeof homebrew_domain_cards;
		for (const [domainId, cards] of Object.entries(homebrew_domain_cards)) {
			for (const [cardId, card] of Object.entries(cards)) {
				const cardJson = JSON.stringify(card);
				const savedCard = saved[domainId as DomainIds]?.[cardId];
				const savedCardJson = savedCard ? JSON.stringify(savedCard) : null;
				const key = `domain_cards:${domainId}:${cardId}`;
				if (savedCardJson === null || cardJson === savedCardJson || inFlight.has(key)) continue;

				if (debounceTimers[key]) clearTimeout(debounceTimers[key]!);
				debounceTimers[key] = setTimeout(() => {
					delete debounceTimers[key];
					inFlight.add(key);
					update_homebrew_domain_card({ id: cardId, data: JSON.parse(JSON.stringify(homebrew_domain_cards[domainId as DomainIds][cardId])) })
						.then(() => { lastSaved_domain_cards = JSON.stringify(homebrew_domain_cards); })
						.catch((e) => console.error('Failed to auto-save domain card:', e))
						.finally(() => inFlight.delete(key));
				}, 300);
			}
		}
	});

	// Auto-save effect for primary_weapons
	$effect(() => {
		if (lastSaved_primary_weapons === null) return;
		const currentJson = JSON.stringify(homebrew_primary_weapons);
		if (currentJson === lastSaved_primary_weapons) return;

		const saved = JSON.parse(lastSaved_primary_weapons) as typeof homebrew_primary_weapons;
		for (const [id, item] of Object.entries(homebrew_primary_weapons)) {
			const itemJson = JSON.stringify(item);
			const savedItemJson = saved[id] ? JSON.stringify(saved[id]) : null;
			if (savedItemJson === null || itemJson === savedItemJson || inFlight.has(`primary_weapons:${id}`)) continue;

			if (debounceTimers[`primary_weapons:${id}`]) clearTimeout(debounceTimers[`primary_weapons:${id}`]!);
			debounceTimers[`primary_weapons:${id}`] = setTimeout(() => {
				delete debounceTimers[`primary_weapons:${id}`];
				inFlight.add(`primary_weapons:${id}`);
				update_homebrew_primary_weapon({ id, data: JSON.parse(JSON.stringify(homebrew_primary_weapons[id])) })
					.then(() => { lastSaved_primary_weapons = JSON.stringify(homebrew_primary_weapons); })
					.catch((e) => console.error('Failed to auto-save primary weapon:', e))
					.finally(() => inFlight.delete(`primary_weapons:${id}`));
			}, 300);
		}
	});

	// Auto-save effect for secondary_weapons
	$effect(() => {
		if (lastSaved_secondary_weapons === null) return;
		const currentJson = JSON.stringify(homebrew_secondary_weapons);
		if (currentJson === lastSaved_secondary_weapons) return;

		const saved = JSON.parse(lastSaved_secondary_weapons) as typeof homebrew_secondary_weapons;
		for (const [id, item] of Object.entries(homebrew_secondary_weapons)) {
			const itemJson = JSON.stringify(item);
			const savedItemJson = saved[id] ? JSON.stringify(saved[id]) : null;
			if (savedItemJson === null || itemJson === savedItemJson || inFlight.has(`secondary_weapons:${id}`)) continue;

			if (debounceTimers[`secondary_weapons:${id}`]) clearTimeout(debounceTimers[`secondary_weapons:${id}`]!);
			debounceTimers[`secondary_weapons:${id}`] = setTimeout(() => {
				delete debounceTimers[`secondary_weapons:${id}`];
				inFlight.add(`secondary_weapons:${id}`);
				update_homebrew_secondary_weapon({ id, data: JSON.parse(JSON.stringify(homebrew_secondary_weapons[id])) })
					.then(() => { lastSaved_secondary_weapons = JSON.stringify(homebrew_secondary_weapons); })
					.catch((e) => console.error('Failed to auto-save secondary weapon:', e))
					.finally(() => inFlight.delete(`secondary_weapons:${id}`));
			}, 300);
		}
	});

	// Auto-save effect for armor
	$effect(() => {
		if (lastSaved_armor === null) return;
		const currentJson = JSON.stringify(homebrew_armor);
		if (currentJson === lastSaved_armor) return;

		const saved = JSON.parse(lastSaved_armor) as typeof homebrew_armor;
		for (const [id, item] of Object.entries(homebrew_armor)) {
			const itemJson = JSON.stringify(item);
			const savedItemJson = saved[id] ? JSON.stringify(saved[id]) : null;
			if (savedItemJson === null || itemJson === savedItemJson || inFlight.has(`armor:${id}`)) continue;

			if (debounceTimers[`armor:${id}`]) clearTimeout(debounceTimers[`armor:${id}`]!);
			debounceTimers[`armor:${id}`] = setTimeout(() => {
				delete debounceTimers[`armor:${id}`];
				inFlight.add(`armor:${id}`);
				update_homebrew_armor({ id, data: JSON.parse(JSON.stringify(homebrew_armor[id])) })
					.then(() => { lastSaved_armor = JSON.stringify(homebrew_armor); })
					.catch((e) => console.error('Failed to auto-save armor:', e))
					.finally(() => inFlight.delete(`armor:${id}`));
			}, 300);
		}
	});

	// Auto-save effect for loot
	$effect(() => {
		if (lastSaved_loot === null) return;
		const currentJson = JSON.stringify(homebrew_loot);
		if (currentJson === lastSaved_loot) return;

		const saved = JSON.parse(lastSaved_loot) as typeof homebrew_loot;
		for (const [id, item] of Object.entries(homebrew_loot)) {
			const itemJson = JSON.stringify(item);
			const savedItemJson = saved[id] ? JSON.stringify(saved[id]) : null;
			if (savedItemJson === null || itemJson === savedItemJson || inFlight.has(`loot:${id}`)) continue;

			if (debounceTimers[`loot:${id}`]) clearTimeout(debounceTimers[`loot:${id}`]!);
			debounceTimers[`loot:${id}`] = setTimeout(() => {
				delete debounceTimers[`loot:${id}`];
				inFlight.add(`loot:${id}`);
				update_homebrew_loot({ id, data: JSON.parse(JSON.stringify(homebrew_loot[id])) })
					.then(() => { lastSaved_loot = JSON.stringify(homebrew_loot); })
					.catch((e) => console.error('Failed to auto-save loot:', e))
					.finally(() => inFlight.delete(`loot:${id}`));
			}, 300);
		}
	});

	// Auto-save effect for consumables
	$effect(() => {
		if (lastSaved_consumables === null) return;
		const currentJson = JSON.stringify(homebrew_consumables);
		if (currentJson === lastSaved_consumables) return;

		const saved = JSON.parse(lastSaved_consumables) as typeof homebrew_consumables;
		for (const [id, item] of Object.entries(homebrew_consumables)) {
			const itemJson = JSON.stringify(item);
			const savedItemJson = saved[id] ? JSON.stringify(saved[id]) : null;
			if (savedItemJson === null || itemJson === savedItemJson || inFlight.has(`consumables:${id}`)) continue;

			if (debounceTimers[`consumables:${id}`]) clearTimeout(debounceTimers[`consumables:${id}`]!);
			debounceTimers[`consumables:${id}`] = setTimeout(() => {
				delete debounceTimers[`consumables:${id}`];
				inFlight.add(`consumables:${id}`);
				update_homebrew_consumable({ id, data: JSON.parse(JSON.stringify(homebrew_consumables[id])) })
					.then(() => { lastSaved_consumables = JSON.stringify(homebrew_consumables); })
					.catch((e) => console.error('Failed to auto-save consumable:', e))
					.finally(() => inFlight.delete(`consumables:${id}`));
			}, 300);
		}
	});

	// Auto-save effect for ancestry_cards
	$effect(() => {
		if (lastSaved_ancestry_cards === null) return;
		const currentJson = JSON.stringify(homebrew_ancestry_cards);
		if (currentJson === lastSaved_ancestry_cards) return;

		const saved = JSON.parse(lastSaved_ancestry_cards) as typeof homebrew_ancestry_cards;
		for (const [id, item] of Object.entries(homebrew_ancestry_cards)) {
			const itemJson = JSON.stringify(item);
			const savedItemJson = saved[id] ? JSON.stringify(saved[id]) : null;
			if (savedItemJson === null || itemJson === savedItemJson || inFlight.has(`ancestry_cards:${id}`)) continue;

			if (debounceTimers[`ancestry_cards:${id}`]) clearTimeout(debounceTimers[`ancestry_cards:${id}`]!);
			debounceTimers[`ancestry_cards:${id}`] = setTimeout(() => {
				delete debounceTimers[`ancestry_cards:${id}`];
				inFlight.add(`ancestry_cards:${id}`);
				update_homebrew_ancestry_card({ id, data: JSON.parse(JSON.stringify(homebrew_ancestry_cards[id])) })
					.then(() => { lastSaved_ancestry_cards = JSON.stringify(homebrew_ancestry_cards); })
					.catch((e) => console.error('Failed to auto-save ancestry card:', e))
					.finally(() => inFlight.delete(`ancestry_cards:${id}`));
			}, 300);
		}
	});

	// Auto-save effect for community_cards
	$effect(() => {
		if (lastSaved_community_cards === null) return;
		const currentJson = JSON.stringify(homebrew_community_cards);
		if (currentJson === lastSaved_community_cards) return;

		const saved = JSON.parse(lastSaved_community_cards) as typeof homebrew_community_cards;
		for (const [id, item] of Object.entries(homebrew_community_cards)) {
			const itemJson = JSON.stringify(item);
			const savedItemJson = saved[id] ? JSON.stringify(saved[id]) : null;
			if (savedItemJson === null || itemJson === savedItemJson || inFlight.has(`community_cards:${id}`)) continue;

			if (debounceTimers[`community_cards:${id}`]) clearTimeout(debounceTimers[`community_cards:${id}`]!);
			debounceTimers[`community_cards:${id}`] = setTimeout(() => {
				delete debounceTimers[`community_cards:${id}`];
				inFlight.add(`community_cards:${id}`);
				update_homebrew_community_card({ id, data: JSON.parse(JSON.stringify(homebrew_community_cards[id])) })
					.then(() => { lastSaved_community_cards = JSON.stringify(homebrew_community_cards); })
					.catch((e) => console.error('Failed to auto-save community card:', e))
					.finally(() => inFlight.delete(`community_cards:${id}`));
			}, 300);
		}
	});

	// Auto-save effect for transformation_cards
	$effect(() => {
		if (lastSaved_transformation_cards === null) return;
		const currentJson = JSON.stringify(homebrew_transformation_cards);
		if (currentJson === lastSaved_transformation_cards) return;

		const saved = JSON.parse(lastSaved_transformation_cards) as typeof homebrew_transformation_cards;
		for (const [id, item] of Object.entries(homebrew_transformation_cards)) {
			const itemJson = JSON.stringify(item);
			const savedItemJson = saved[id] ? JSON.stringify(saved[id]) : null;
			if (savedItemJson === null || itemJson === savedItemJson || inFlight.has(`transformation_cards:${id}`)) continue;

			if (debounceTimers[`transformation_cards:${id}`]) clearTimeout(debounceTimers[`transformation_cards:${id}`]!);
			debounceTimers[`transformation_cards:${id}`] = setTimeout(() => {
				delete debounceTimers[`transformation_cards:${id}`];
				inFlight.add(`transformation_cards:${id}`);
				update_homebrew_transformation_card({ id, data: JSON.parse(JSON.stringify(homebrew_transformation_cards[id])) })
					.then(() => { lastSaved_transformation_cards = JSON.stringify(homebrew_transformation_cards); })
					.catch((e) => console.error('Failed to auto-save transformation card:', e))
					.finally(() => inFlight.delete(`transformation_cards:${id}`));
			}, 300);
		}
	});

	// Auto-save effect for beastforms
	$effect(() => {
		if (lastSaved_beastforms === null) return;
		const currentJson = JSON.stringify(homebrew_beastforms);
		if (currentJson === lastSaved_beastforms) return;

		const saved = JSON.parse(lastSaved_beastforms) as typeof homebrew_beastforms;
		for (const [id, item] of Object.entries(homebrew_beastforms)) {
			const itemJson = JSON.stringify(item);
			const savedItemJson = saved[id] ? JSON.stringify(saved[id]) : null;
			if (savedItemJson === null || itemJson === savedItemJson || inFlight.has(`beastforms:${id}`)) continue;

			if (debounceTimers[`beastforms:${id}`]) clearTimeout(debounceTimers[`beastforms:${id}`]!);
			debounceTimers[`beastforms:${id}`] = setTimeout(() => {
				delete debounceTimers[`beastforms:${id}`];
				inFlight.add(`beastforms:${id}`);
				update_homebrew_beastform({ id, data: JSON.parse(JSON.stringify(homebrew_beastforms[id])) })
					.then(() => { lastSaved_beastforms = JSON.stringify(homebrew_beastforms); })
					.catch((e) => console.error('Failed to auto-save beastform:', e))
					.finally(() => inFlight.delete(`beastforms:${id}`));
			}, 300);
		}
	});

	// Helper to check if an item is saved
	function isSaved(type: keyof typeof homebrewCollections, id: string): boolean {
		const currentCollection = homebrewCollections[type];
		const lastSavedCollection = lastSavedCollections[type];
		if (!currentCollection || !lastSavedCollection) return true; // Assume saved if not loaded yet

		// Handle nested structure for domain_cards (id format: "domainId:cardId")
		if (type === 'domain_cards') {
			const [domainId, cardId] = id.split(':');
			if (!domainId || !cardId) return true;
			const currentItem = (currentCollection as typeof homebrew_domain_cards)[domainId as DomainIds]?.[cardId];
			const saved = JSON.parse(lastSavedCollection) as typeof homebrew_domain_cards;
			const savedItem = saved[domainId as DomainIds]?.[cardId];
			return JSON.stringify(currentItem) === JSON.stringify(savedItem);
		}

		const currentItem = (currentCollection as Record<string, unknown>)[id];
		const saved = JSON.parse(lastSavedCollection) as Record<string, unknown>;
		const savedItem = saved[id];

		return JSON.stringify(currentItem) === JSON.stringify(savedItem);
	}

	// Helper collections for isSaved
	const homebrewCollections = {
		classes: homebrew_classes,
		subclasses: homebrew_subclasses,
		domains: homebrew_domains,
		domain_cards: homebrew_domain_cards,
		primary_weapons: homebrew_primary_weapons,
		secondary_weapons: homebrew_secondary_weapons,
		armor: homebrew_armor,
		loot: homebrew_loot,
		consumables: homebrew_consumables,
		ancestry_cards: homebrew_ancestry_cards,
		community_cards: homebrew_community_cards,
		transformation_cards: homebrew_transformation_cards,
		beastforms: homebrew_beastforms
	};

	const lastSavedCollections = {
		classes: lastSaved_classes,
		subclasses: lastSaved_subclasses,
		domains: lastSaved_domains,
		domain_cards: lastSaved_domain_cards,
		primary_weapons: lastSaved_primary_weapons,
		secondary_weapons: lastSaved_secondary_weapons,
		armor: lastSaved_armor,
		loot: lastSaved_loot,
		consumables: lastSaved_consumables,
		ancestry_cards: lastSaved_ancestry_cards,
		community_cards: lastSaved_community_cards,
		transformation_cards: lastSaved_transformation_cards,
		beastforms: lastSaved_beastforms
	};

	// Cleanup function
	const destroy = () => {
		for (const timer of Object.values(debounceTimers)) {
			if (timer) clearTimeout(timer);
		}
	};

	return {
		// Direct access to state (mutable)
		get classes() { return homebrew_classes; },
		get subclasses() { return homebrew_subclasses; },
		get domains() { return homebrew_domains; },
		get domain_cards() { return homebrew_domain_cards; },
		get primary_weapons() { return homebrew_primary_weapons; },
		get secondary_weapons() { return homebrew_secondary_weapons; },
		get armor() { return homebrew_armor; },
		get loot() { return homebrew_loot; },
		get consumables() { return homebrew_consumables; },
		get ancestry_cards() { return homebrew_ancestry_cards; },
		get community_cards() { return homebrew_community_cards; },
		get transformation_cards() { return homebrew_transformation_cards; },
		get beastforms() { return homebrew_beastforms; },
		get loading() { return loading; },

		// Save status helper
		isSaved,

		// Create helpers
		async createClass(data: CharacterClass): Promise<string> {
			const id = await create_homebrew_class(data);
			homebrew_classes[id] = data;
			lastSaved_classes = JSON.stringify(homebrew_classes);
			return id;
		},
		async createSubclass(data: Subclass): Promise<string> {
			const id = await create_homebrew_subclass(data);
			homebrew_subclasses[id] = data;
			lastSaved_subclasses = JSON.stringify(homebrew_subclasses);
			return id;
		},
		async createDomain(data: Domain): Promise<string> {
			const id = await create_homebrew_domain(data);
			homebrew_domains[id] = data;
			lastSaved_domains = JSON.stringify(homebrew_domains);
			return id;
		},
		async createDomainCard(data: DomainCard): Promise<string> {
			const id = await create_homebrew_domain_card(data);
			const domainId = data.domain_id as DomainIds;
			if (!homebrew_domain_cards[domainId]) {
				homebrew_domain_cards[domainId] = {};
			}
			homebrew_domain_cards[domainId][id] = data;
			lastSaved_domain_cards = JSON.stringify(homebrew_domain_cards);
			return id;
		},
		async createPrimaryWeapon(data: Weapon): Promise<string> {
			const id = await create_homebrew_primary_weapon(data);
			homebrew_primary_weapons[id] = data;
			lastSaved_primary_weapons = JSON.stringify(homebrew_primary_weapons);
			return id;
		},
		async createSecondaryWeapon(data: Weapon): Promise<string> {
			const id = await create_homebrew_secondary_weapon(data);
			homebrew_secondary_weapons[id] = data;
			lastSaved_secondary_weapons = JSON.stringify(homebrew_secondary_weapons);
			return id;
		},
		async createArmor(data: Armor): Promise<string> {
			const id = await create_homebrew_armor(data);
			homebrew_armor[id] = data;
			lastSaved_armor = JSON.stringify(homebrew_armor);
			return id;
		},
		async createLoot(data: Loot): Promise<string> {
			const id = await create_homebrew_loot(data);
			homebrew_loot[id] = data;
			lastSaved_loot = JSON.stringify(homebrew_loot);
			return id;
		},
		async createConsumable(data: Consumable): Promise<string> {
			const id = await create_homebrew_consumable(data);
			homebrew_consumables[id] = data;
			lastSaved_consumables = JSON.stringify(homebrew_consumables);
			return id;
		},
		async createAncestryCard(data: AncestryCard): Promise<string> {
			const id = await create_homebrew_ancestry_card(data);
			homebrew_ancestry_cards[id] = data;
			lastSaved_ancestry_cards = JSON.stringify(homebrew_ancestry_cards);
			return id;
		},
		async createCommunityCard(data: CommunityCard): Promise<string> {
			const id = await create_homebrew_community_card(data);
			homebrew_community_cards[id] = data;
			lastSaved_community_cards = JSON.stringify(homebrew_community_cards);
			return id;
		},
		async createTransformationCard(data: TransformationCard): Promise<string> {
			const id = await create_homebrew_transformation_card(data);
			homebrew_transformation_cards[id] = data;
			lastSaved_transformation_cards = JSON.stringify(homebrew_transformation_cards);
			return id;
		},
		async createBeastform(data: Beastform): Promise<string> {
			const id = await create_homebrew_beastform(data);
			homebrew_beastforms[id] = data;
			lastSaved_beastforms = JSON.stringify(homebrew_beastforms);
			return id;
		},

		// Delete helpers
		async deleteClass(id: string): Promise<void> {
			await delete_homebrew_class(id);
			delete homebrew_classes[id];
			lastSaved_classes = JSON.stringify(homebrew_classes);
		},
		async deleteSubclass(id: string): Promise<void> {
			await delete_homebrew_subclass(id);
			delete homebrew_subclasses[id];
			lastSaved_subclasses = JSON.stringify(homebrew_subclasses);
		},
		async deleteDomain(id: string): Promise<void> {
			await delete_homebrew_domain(id);
			delete homebrew_domains[id];
			lastSaved_domains = JSON.stringify(homebrew_domains);
		},
		async deleteDomainCard(id: string, domainId: DomainIds): Promise<void> {
			await delete_homebrew_domain_card(id);
			delete homebrew_domain_cards[domainId][id];
			lastSaved_domain_cards = JSON.stringify(homebrew_domain_cards);
		},
		async deletePrimaryWeapon(id: string): Promise<void> {
			await delete_homebrew_primary_weapon(id);
			delete homebrew_primary_weapons[id];
			lastSaved_primary_weapons = JSON.stringify(homebrew_primary_weapons);
		},
		async deleteSecondaryWeapon(id: string): Promise<void> {
			await delete_homebrew_secondary_weapon(id);
			delete homebrew_secondary_weapons[id];
			lastSaved_secondary_weapons = JSON.stringify(homebrew_secondary_weapons);
		},
		async deleteArmor(id: string): Promise<void> {
			await delete_homebrew_armor(id);
			delete homebrew_armor[id];
			lastSaved_armor = JSON.stringify(homebrew_armor);
		},
		async deleteLoot(id: string): Promise<void> {
			await delete_homebrew_loot(id);
			delete homebrew_loot[id];
			lastSaved_loot = JSON.stringify(homebrew_loot);
		},
		async deleteConsumable(id: string): Promise<void> {
			await delete_homebrew_consumable(id);
			delete homebrew_consumables[id];
			lastSaved_consumables = JSON.stringify(homebrew_consumables);
		},
		async deleteAncestryCard(id: string): Promise<void> {
			await delete_homebrew_ancestry_card(id);
			delete homebrew_ancestry_cards[id];
			lastSaved_ancestry_cards = JSON.stringify(homebrew_ancestry_cards);
		},
		async deleteCommunityCard(id: string): Promise<void> {
			await delete_homebrew_community_card(id);
			delete homebrew_community_cards[id];
			lastSaved_community_cards = JSON.stringify(homebrew_community_cards);
		},
		async deleteTransformationCard(id: string): Promise<void> {
			await delete_homebrew_transformation_card(id);
			delete homebrew_transformation_cards[id];
			lastSaved_transformation_cards = JSON.stringify(homebrew_transformation_cards);
		},
		async deleteBeastform(id: string): Promise<void> {
			await delete_homebrew_beastform(id);
			delete homebrew_beastforms[id];
			lastSaved_beastforms = JSON.stringify(homebrew_beastforms);
		},

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
