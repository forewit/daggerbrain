import { api } from '@convex/_generated/api';
import type { CompendiumContent } from '@convex/schemas/compendium';
import type { HomebrewAccess, HomebrewItem, HomebrewTable } from '@convex/permissions';
import { getContext, onDestroy, setContext } from 'svelte';
import { useConvexClient } from 'convex-svelte';
import { getUserContext } from './user.svelte';
import { SvelteMap } from 'svelte/reactivity';
import type { Id } from '@convex/_generated/dataModel';

/**
 * Builds a typed record of loaded items for a given list of vault IDs,
 * looking each one up in the shared results map.
 */
function itemsFor<T extends HomebrewTable>(
	ids: Id<T>[],
	results: SvelteMap<string, HomebrewAccess<HomebrewTable> | null>
): Record<string, HomebrewItem<T>> {
	const entries: [string, HomebrewItem<T>][] = [];
	for (const id of ids) {
		const data = results.get(id);
		if (data?.item != null) entries.push([id, data.item as HomebrewItem<T>]);
	}
	return Object.fromEntries(entries) as Record<string, HomebrewItem<T>>;
}

function createHomebrew() {
	const convexClient = useConvexClient();
	const userContext = getUserContext();

	// Non-reactive map tracking active Convex subscriptions (id → unsubscribe fn).
	const subscriptions = new Map<string, () => void>();
	// Reactive map storing the latest query result for each item ID.
	const results = new SvelteMap<string, HomebrewAccess<HomebrewTable> | null>();
	const subscriptionErrors = new SvelteMap<string, Error>();

	onDestroy(() => {
		for (const unsub of subscriptions.values()) unsub();
		subscriptions.clear();
		results.clear();
		subscriptionErrors.clear();
	});

	$effect(() => {
		if (!userContext.user) {
			for (const unsub of subscriptions.values()) unsub();
			subscriptions.clear();
			results.clear();
			subscriptionErrors.clear();
			return;
		}

		const vault = userContext.user.homebrew_vault;
		const allVaultIds = new Set<string>([
			...vault.primary_weapons,
			...vault.secondary_weapons,
			...vault.armor,
			...vault.loot,
			...vault.consumables,
			...vault.beastforms,
			...vault.classes,
			...vault.subclasses,
			...vault.domains,
			...vault.domain_cards,
			...vault.ancestry_cards,
			...vault.community_cards,
			...vault.transformation_cards,
			...vault.adversaries,
			...vault.environments
		]);

		// Unsubscribe from IDs no longer in the vault
		for (const [id, unsub] of subscriptions) {
			if (!allVaultIds.has(id)) {
				unsub();
				subscriptions.delete(id);
				results.delete(id);
				subscriptionErrors.delete(id);
			}
		}

		// Subscribe to newly added IDs
		for (const id of allVaultIds) {
			if (subscriptions.has(id)) continue;
			const unsub = convexClient.onUpdate(
				api.functions.homebrew.get,
				{ id: id as Id<HomebrewTable> },
				(data) => {
					subscriptionErrors.delete(id);
					results.set(id, data);
				},
				(error) => {
					subscriptionErrors.set(id, error);
				}
			);
			subscriptions.set(id, unsub);
		}
	});

	const isReady = $derived.by(() => {
		if (userContext.isLoading) return false;
		if (!userContext.user) return true;

		const vault = userContext.user.homebrew_vault;
		const allVaultIds = [
			...vault.primary_weapons,
			...vault.secondary_weapons,
			...vault.armor,
			...vault.loot,
			...vault.consumables,
			...vault.beastforms,
			...vault.classes,
			...vault.subclasses,
			...vault.domains,
			...vault.domain_cards,
			...vault.ancestry_cards,
			...vault.community_cards,
			...vault.transformation_cards,
			...vault.adversaries,
			...vault.environments
		];

		return allVaultIds.every((id) => results.has(id));
	});

	const error = $derived.by(() => {
		for (const currentError of subscriptionErrors.values()) {
			return currentError;
		}
		return null;
	});
	const isLoading = $derived(userContext.isLoading || (!isReady && !error));

	const compendium: CompendiumContent | null = $derived.by(() => {
		if (!userContext.user) return null;
		const vault = userContext.user.homebrew_vault;

		return {
			primary_weapons: itemsFor(vault.primary_weapons, results),
			secondary_weapons: itemsFor(vault.secondary_weapons, results),
			armor: itemsFor(vault.armor, results),
			loot: itemsFor(vault.loot, results),
			consumables: itemsFor(vault.consumables, results),
			beastforms: itemsFor(vault.beastforms, results),
			classes: itemsFor(vault.classes, results),
			subclasses: itemsFor(vault.subclasses, results),
			domains: itemsFor(vault.domains, results),
			domain_cards: itemsFor(vault.domain_cards, results),
			ancestry_cards: itemsFor(vault.ancestry_cards, results),
			community_cards: itemsFor(vault.community_cards, results),
			transformation_cards: itemsFor(vault.transformation_cards, results),
			adversaries: itemsFor(vault.adversaries, results),
			environments: itemsFor(vault.environments, results)
		};
	});

	async function addItem(data: (typeof api.functions.homebrew.add)['_args']['data']) {
		return await convexClient.mutation(api.functions.homebrew.add, { data });
	}

	async function removeItem(id: Id<HomebrewTable>) {
		await convexClient.mutation(api.functions.homebrew.remove, { id });
	}

	async function updateItem(data: (typeof api.functions.homebrew.update)['_args']['data']) {
		await convexClient.mutation(api.functions.homebrew.update, { data });
	}

	return {
		get isLoading() {
			return isLoading;
		},
		get error() {
			return error;
		},
		get compendium() {
			return compendium;
		},
		addItem,
		removeItem,
		updateItem
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
