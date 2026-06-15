import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import type { CompendiumContent, CompendiumContentIds } from '@convex/schemas/compendium';
import type { HomebrewAccess, HomebrewItem, HomebrewTable } from '@convex/permissions';
import type { ConvexClient } from 'convex/browser';
import { onDestroy } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import { merge_compendium_content } from '$lib/utils';

const VAULT_KEYS = [
	'primary_weapons',
	'secondary_weapons',
	'armor',
	'loot',
	'consumables',
	'beastforms',
	'classes',
	'subclasses',
	'domains',
	'domain_cards',
	'ancestry_cards',
	'community_cards',
	'transformation_cards',
	'adversaries',
	'environments'
] as const satisfies (keyof CompendiumContentIds)[];

type VaultSourceOverride = HomebrewItem<HomebrewTable>['source_key'];

function itemsFor<T extends HomebrewTable>(
	ids: Id<T>[],
	results: SvelteMap<string, HomebrewAccess<HomebrewTable> | null>,
	sourceKeyOverride?: VaultSourceOverride
): Record<string, HomebrewItem<T>> {
	const entries: [string, HomebrewItem<T>][] = [];
	for (const id of ids) {
		const data = results.get(id);
		if (data?.item != null) {
			const item = data.item as HomebrewItem<T>;
			entries.push([
				id,
				sourceKeyOverride ? ({ ...item, source_key: sourceKeyOverride } as HomebrewItem<T>) : item
			]);
		}
	}

	return Object.fromEntries(entries) as Record<string, HomebrewItem<T>>;
}

function firstErrorFromMap(errors: SvelteMap<string, Error>): Error | null {
	for (const value of errors.values()) {
		return value;
	}

	return null;
}

function getAllVaultIds(vault: CompendiumContentIds): string[] {
	const ids: string[] = [];
	for (const key of VAULT_KEYS) {
		ids.push(...vault[key]);
	}

	return ids;
}

export function hasAnyVaultItems(vault: CompendiumContentIds | null | undefined): boolean {
	if (!vault) return false;

	return VAULT_KEYS.some((key) => vault[key].length > 0);
}

export function createVaultCompendiumSubscription(options: {
	convexClient: ConvexClient;
	getVault: () => CompendiumContentIds | null;
	getPrereqLoading?: () => boolean;
	sourceKeyOverride?: VaultSourceOverride;
}) {
	const subscriptions = new Map<string, () => void>();
	const results = new SvelteMap<string, HomebrewAccess<HomebrewTable> | null>();
	const subscriptionErrors = new SvelteMap<string, Error>();

	onDestroy(() => {
		for (const unsub of subscriptions.values()) unsub();
		subscriptions.clear();
		results.clear();
		subscriptionErrors.clear();
	});

	$effect(() => {
		const vault = options.getVault();
		if (!vault) {
			for (const unsub of subscriptions.values()) unsub();
			subscriptions.clear();
			results.clear();
			subscriptionErrors.clear();
			return;
		}

		const allVaultIds = new Set<string>(getAllVaultIds(vault));

		for (const [id, unsub] of subscriptions) {
			if (!allVaultIds.has(id)) {
				unsub();
				subscriptions.delete(id);
				results.delete(id);
				subscriptionErrors.delete(id);
			}
		}

		for (const id of allVaultIds) {
			if (subscriptions.has(id)) continue;

			const unsub = options.convexClient.onUpdate(
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
		if (options.getPrereqLoading?.()) return false;

		const vault = options.getVault();
		if (!vault) return true;

		return getAllVaultIds(vault).every((id) => results.has(id));
	});

	const error = $derived.by(() => firstErrorFromMap(subscriptionErrors));
	const isLoading = $derived.by(() => !!options.getPrereqLoading?.() || (!isReady && !error));

	const compendium: CompendiumContent | null = $derived.by(() => {
		const vault = options.getVault();
		if (!vault) return null;

		return {
			primary_weapons: itemsFor(vault.primary_weapons, results, options.sourceKeyOverride),
			secondary_weapons: itemsFor(vault.secondary_weapons, results, options.sourceKeyOverride),
			armor: itemsFor(vault.armor, results, options.sourceKeyOverride),
			loot: itemsFor(vault.loot, results, options.sourceKeyOverride),
			consumables: itemsFor(vault.consumables, results, options.sourceKeyOverride),
			beastforms: itemsFor(vault.beastforms, results, options.sourceKeyOverride),
			classes: itemsFor(vault.classes, results, options.sourceKeyOverride),
			subclasses: itemsFor(vault.subclasses, results, options.sourceKeyOverride),
			domains: itemsFor(vault.domains, results, options.sourceKeyOverride),
			domain_cards: itemsFor(vault.domain_cards, results, options.sourceKeyOverride),
			ancestry_cards: itemsFor(vault.ancestry_cards, results, options.sourceKeyOverride),
			community_cards: itemsFor(vault.community_cards, results, options.sourceKeyOverride),
			transformation_cards: itemsFor(
				vault.transformation_cards,
				results,
				options.sourceKeyOverride
			),
			adversaries: itemsFor(vault.adversaries, results, options.sourceKeyOverride),
			environments: itemsFor(vault.environments, results, options.sourceKeyOverride)
		};
	});

	return {
		get isLoading() {
			return isLoading;
		},
		get error() {
			return error;
		},
		get compendium() {
			return compendium ?? merge_compendium_content();
		}
	};
}
