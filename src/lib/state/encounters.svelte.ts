import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { ADVERSARY_TYPE_BATTLE_POINTS_MAP } from '@convex/constants/rules';
import type { Adversary, CompendiumContent } from '@convex/schemas/compendium';
import type { Encounter } from '@convex/schemas/encounters';
import type { AdversaryType, SourceKey } from '@convex/schemas/rules';
import { merge_compendium_content } from '$lib/utils';
import { useConvexClient, useQuery } from 'convex-svelte';
import { getContext, setContext } from 'svelte';
import { getHomebrewContext } from './homebrew.svelte';
import { getSourcesContext } from './sources.svelte';
import { getUserContext } from './user.svelte';

const SYNC_DEBOUNCE_MS = 200;

export type DerivedBattlePoints = {
	total_lower_tier_adversaries: number;
	counts: Record<AdversaryType, number>;
	minion_battle_points_spent: number;
	battle_points_budget: number;
	battle_points_spent: number;
	difficulty: 'Easy' | 'Normal' | 'Hard' | 'Deadly';
};

function stableSnapshot(value: unknown): string {
	return JSON.stringify(value, (_, currentValue) => {
		if (!currentValue || typeof currentValue !== 'object' || Array.isArray(currentValue)) {
			return currentValue;
		}

		return Object.fromEntries(
			Object.entries(currentValue as Record<string, unknown>).sort(([left], [right]) =>
				left.localeCompare(right)
			)
		);
	});
}

function createEncounter() {
	let id: Id<'encounters'> | undefined = $state();
	let encounter: Encounter | undefined = $state();

	const convexClient = useConvexClient();
	const encounterQuery = useQuery(api.functions.encounters.get, () => (id ? { id } : 'skip'));
	const serverEncounter = $derived(encounterQuery.data?.encounter ?? null);

	const userCtx = getUserContext();
	const sourcesCtx = getSourcesContext();
	const homebrewCtx = getHomebrewContext();

	const available_source_keys: SourceKey[] = $derived.by(() => {
		const keys = sourcesCtx.sources.map((source) => source.source_key);
		if (homebrewCtx.compendium) {
			keys.push('Homebrew');
		}
		return keys;
	});

	const compendiumReady = $derived.by(() => {
		if (userCtx.isLoading) return false;
		if (sourcesCtx.isLoading) return false;
		if (homebrewCtx.isLoading) return false;
		return true;
	});
	const isLoading = $derived(
		userCtx.isLoading ||
			encounterQuery.isLoading ||
			(!!serverEncounter &&
				!compendiumReady &&
				!userCtx.error &&
				!sourcesCtx.error &&
				!homebrewCtx.error)
	);
	const error = $derived(
		encounterQuery.error ?? userCtx.error ?? sourcesCtx.error ?? homebrewCtx.error
	);

	const ready_encounter_compendium = $derived.by((): CompendiumContent | null => {
		if (!compendiumReady) return null;

		const compendiums: CompendiumContent[] = [];
		if (sourcesCtx.compendium) compendiums.push(sourcesCtx.compendium);
		if (homebrewCtx.compendium) compendiums.push(homebrewCtx.compendium);

		return compendiums.length > 0 ? merge_compendium_content(...compendiums) : null;
	});

	const encounter_compendium = $derived(ready_encounter_compendium ?? merge_compendium_content());

	const derived_battle_points = $derived.by((): DerivedBattlePoints | null => {
		if (!encounter || !ready_encounter_compendium) return null;

		const encounter_adversaries: { adversary: Adversary; quantity: number }[] = encounter.items
			.filter((item) => item.type === 'adversary')
			.map((item) => ({
				adversary:
					item.edited_adversary ?? ready_encounter_compendium.adversaries[item.base_adversary_id],
				quantity: item.instances.length
			}))
			.filter((item): item is { adversary: Adversary; quantity: number } => !!item.adversary);

		const counts: Record<AdversaryType, number> = {
			Bruiser: 0,
			Horde: 0,
			Leader: 0,
			Minion: 0,
			Ranged: 0,
			Skulk: 0,
			Social: 0,
			Solo: 0,
			Standard: 0,
			Support: 0
		};

		let total_lower_tier_adversaries = 0;
		for (const adversaryEntry of encounter_adversaries) {
			counts[adversaryEntry.adversary.type] += adversaryEntry.quantity;

			if (adversaryEntry.adversary.tier < encounter.encounter_tier) {
				total_lower_tier_adversaries += adversaryEntry.quantity;
			}
		}

		let battle_points_budget =
			encounter.number_of_players * 3 +
			2 +
			encounter.extra_battle_points +
			total_lower_tier_adversaries;

		if (counts.Bruiser === 0 && counts.Horde === 0 && counts.Leader === 0 && counts.Solo === 0) {
			battle_points_budget += 1;
		}

		if (counts.Solo >= 2) {
			battle_points_budget -= 2;
		}

		if (encounter.bonus_damage) {
			battle_points_budget -= 2;
		}

		const minion_battle_points_spent =
			counts.Minion > 0 ? Math.max(1, Math.ceil(counts.Minion / encounter.number_of_players)) : 0;

		const battle_points_spent =
			minion_battle_points_spent * ADVERSARY_TYPE_BATTLE_POINTS_MAP.Minion +
			counts.Social * ADVERSARY_TYPE_BATTLE_POINTS_MAP.Social +
			counts.Support * ADVERSARY_TYPE_BATTLE_POINTS_MAP.Support +
			counts.Horde * ADVERSARY_TYPE_BATTLE_POINTS_MAP.Horde +
			counts.Ranged * ADVERSARY_TYPE_BATTLE_POINTS_MAP.Ranged +
			counts.Skulk * ADVERSARY_TYPE_BATTLE_POINTS_MAP.Skulk +
			counts.Standard * ADVERSARY_TYPE_BATTLE_POINTS_MAP.Standard +
			counts.Leader * ADVERSARY_TYPE_BATTLE_POINTS_MAP.Leader +
			counts.Bruiser * ADVERSARY_TYPE_BATTLE_POINTS_MAP.Bruiser +
			counts.Solo * ADVERSARY_TYPE_BATTLE_POINTS_MAP.Solo;

		const true_budget = battle_points_budget - encounter.extra_battle_points;
		let difficulty: DerivedBattlePoints['difficulty'] = 'Deadly';

		if (battle_points_spent < true_budget) {
			difficulty = 'Easy';
		} else if (battle_points_spent === true_budget) {
			difficulty = 'Normal';
		} else if (battle_points_spent === true_budget + 1) {
			difficulty = 'Hard';
		}

		return {
			total_lower_tier_adversaries,
			counts,
			minion_battle_points_spent,
			battle_points_budget,
			battle_points_spent,
			difficulty
		};
	});

	const normalized_server_encounter = $derived.by(() => {
		if (!serverEncounter) return null;
		return {
			...serverEncounter,
			condition_list: serverEncounter.condition_list ?? [],
			enable_massive_damage: serverEncounter.enable_massive_damage ?? false
		};
	});

	const local_snapshot = $derived.by(() => (encounter ? stableSnapshot(encounter) : undefined));
	const server_snapshot = $derived.by(() =>
		normalized_server_encounter ? stableSnapshot(normalized_server_encounter) : undefined
	);

	let appliedServerSnapshot: string | undefined;
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	function clearPendingSync() {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = undefined;
		}
	}

	$effect(() => {
		if (!normalized_server_encounter || !server_snapshot) {
			clearPendingSync();
			encounter = undefined;
			appliedServerSnapshot = undefined;
			return;
		}

		const hasUnsavedLocalChanges =
			local_snapshot !== undefined &&
			appliedServerSnapshot !== undefined &&
			local_snapshot !== appliedServerSnapshot &&
			local_snapshot !== server_snapshot;

		if (hasUnsavedLocalChanges) return;

		if (server_snapshot !== appliedServerSnapshot) {
			appliedServerSnapshot = server_snapshot;
		}

		if (local_snapshot !== server_snapshot) {
			encounter = normalized_server_encounter;
		}
	});

	$effect(() => {
		if (!encounter || !local_snapshot || !id) {
			clearPendingSync();
			return;
		}

		clearPendingSync();

		if (local_snapshot === server_snapshot) return;

		const capturedId = id;
		const capturedEncounter: Encounter = JSON.parse(JSON.stringify(encounter));

		debounceTimer = setTimeout(() => {
			debounceTimer = undefined;
			convexClient.mutation(api.functions.encounters.update, {
				id: capturedId,
				encounter: capturedEncounter
			});
		}, SYNC_DEBOUNCE_MS);

		return () => {
			clearPendingSync();
		};
	});

	async function create(newEncounter: Encounter) {
		const createdId = await convexClient.mutation(api.functions.encounters.add, newEncounter);
		id = createdId;
		return createdId;
	}

	async function remove(encounterId = id) {
		if (!encounterId) throw new Error('No encounter selected');

		const capturedId = encounterId;
		clearPendingSync();
		await convexClient.mutation(api.functions.encounters.remove, { id: capturedId });
		if (id === capturedId) {
			encounter = undefined;
			appliedServerSnapshot = undefined;
			id = undefined;
		}
	}

	return {
		get id() {
			return id;
		},
		set id(value) {
			id = value;
		},
		get encounter() {
			return encounter;
		},
		set encounter(value) {
			encounter = value;
		},
		get isLoading() {
			return isLoading;
		},
		get error() {
			return error;
		},
		get isOwner() {
			return encounterQuery.data?.isOwner ?? false;
		},
		get available_source_keys() {
			return available_source_keys;
		},
		get encounter_compendium() {
			return encounter_compendium;
		},
		get derived_battle_points() {
			return derived_battle_points;
		},
		create,
		remove
	};
}

const ENCOUNTER_KEY = Symbol('Encounter');

export const setEncounterContext = () => {
	const newEncounter = createEncounter();
	return setContext(ENCOUNTER_KEY, newEncounter);
};

export const getEncounterContext = (): ReturnType<typeof setEncounterContext> => {
	return getContext(ENCOUNTER_KEY) as ReturnType<typeof setEncounterContext>;
};
