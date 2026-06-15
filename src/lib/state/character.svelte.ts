import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import type { Character } from '@convex/schemas/characters';
import type { CompendiumContent } from '@convex/schemas/compendium';
import type { SourceKey } from '@convex/schemas/rules';
import type { SourceMetadata } from '@convex/schemas/sources';
import { useConvexClient, useQuery } from 'convex-svelte';
import { getContext, setContext } from 'svelte';
import { merge_compendium_content } from '$lib/utils';
import { derive_character_state, type DerivedCharacterData } from './derive_character';
import { createVaultCompendiumSubscription, hasAnyVaultItems } from './compendium-vault.svelte';
import {
	getOfficialCompendiumFromSourceKeys,
	getOfficialSourcesFromKeys
} from '$lib/compendium/official-sources';

const SYNC_DEBOUNCE_MS = 200;

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

function createCharacter() {
	let id: Id<'characters'> | undefined = $state();
	let character: Character | undefined = $state();
	let bootstrapCharacterId: string | undefined = $state();
	let bootstrapCompleted = $state(false);
	let lastReadyCharacterCompendium: CompendiumContent | null = $state(null);
	let lastReadyCharacterCompendiumId: string | undefined = $state();

	const convexClient = useConvexClient();
	const characterQuery = useQuery(api.functions.characters.get, () => (id ? { id } : 'skip'));
	const compendiumScopeQuery = useQuery(api.functions.characters.getCompendiumScopeForView, () =>
		id ? { id } : 'skip'
	);
	const activeCharacterId = $derived.by(() => id as string | undefined);
	const serverCharacter = $derived(characterQuery.data?.character ?? null);

	const activeCharacter = $derived(character ?? serverCharacter);
	const homebrewEnabled = $derived(activeCharacter?.settings.homebrew_enabled ?? false);
	const characterCampaignId = $derived(
		serverCharacter?.campaign_id ?? activeCharacter?.campaign_id ?? null
	);
	const compendiumScope = $derived(compendiumScopeQuery.data ?? null);
	const scopeQueryPending = $derived(
		!!id && compendiumScopeQuery.data === undefined && !compendiumScopeQuery.error
	);
	const sourceKeys: SourceKey[] = $derived.by(() => compendiumScope?.source_keys ?? []);
	const sources: SourceMetadata[] = $derived.by(() => getOfficialSourcesFromKeys(sourceKeys));
	const sourceKeySet = $derived.by(() => new Set(sources.map((source) => source.source_key)));
	const enabledOfficialSourceKeys: SourceKey[] = $derived.by(() => {
		const sourceKeys: SourceKey[] = [];

		if (sourceKeySet.has('SRD')) {
			sourceKeys.push('SRD');
		}
		if (activeCharacter?.settings.void_enabled && sourceKeySet.has('The Void 1.5')) {
			sourceKeys.push('The Void 1.5');
		}

		return sourceKeys;
	});
	const ownerHomebrewVaultState = createVaultCompendiumSubscription({
		convexClient,
		getVault: () => (homebrewEnabled ? (compendiumScope?.homebrew_vault ?? null) : null),
		getPrereqLoading: () => scopeQueryPending
	});
	const campaignVaultState = createVaultCompendiumSubscription({
		convexClient,
		getVault: () => (characterCampaignId ? (compendiumScope?.campaign_vault ?? null) : null),
		getPrereqLoading: () => scopeQueryPending,
		sourceKeyOverride: 'Campaign'
	});

	const available_source_keys: SourceKey[] = $derived.by(() => {
		const sourceKeys = [...enabledOfficialSourceKeys];

		if (homebrewEnabled && hasAnyVaultItems(compendiumScope?.homebrew_vault)) {
			sourceKeys.push('Homebrew');
		}
		if (characterCampaignId) {
			sourceKeys.push('Campaign');
		}

		return sourceKeys;
	});

	const compendiumReady = $derived.by(() => {
		if (!serverCharacter) return false;
		if (scopeQueryPending) return false;
		if (!compendiumScope) return false;
		if (homebrewEnabled && ownerHomebrewVaultState.isLoading) return false;
		if (characterCampaignId && campaignVaultState.isLoading) return false;
		return true;
	});
	const scopeUnavailableError = $derived.by(() => {
		if (!serverCharacter) return null;
		if (scopeQueryPending) return null;
		if (compendiumScopeQuery.error) return null;
		if (compendiumScope) return null;

		return new Error('Character compendium scope unavailable');
	});
	const hasBootstrappedCurrentCharacter = $derived.by(
		() => bootstrapCompleted && bootstrapCharacterId === activeCharacterId
	);
	const blockingCompendiumError = $derived.by(() => {
		if (hasBootstrappedCurrentCharacter) return null;

		return (
			compendiumScopeQuery.error ??
			scopeUnavailableError ??
			ownerHomebrewVaultState.error ??
			campaignVaultState.error
		);
	});
	const error = $derived.by(() => characterQuery.error ?? blockingCompendiumError);
	const isLoading = $derived.by(() => {
		if (characterQuery.isLoading) return true;
		if (!activeCharacterId) return false;
		if (hasBootstrappedCurrentCharacter) return false;
		if (characterQuery.error || blockingCompendiumError) return false;

		return scopeQueryPending || (!!serverCharacter && !compendiumReady);
	});

	const official_source_compendium = $derived.by((): CompendiumContent => {
		return getOfficialCompendiumFromSourceKeys(enabledOfficialSourceKeys);
	});

	const full_character_compendium = $derived.by((): CompendiumContent | null => {
		if (!compendiumReady) return null;

		const compendiums: CompendiumContent[] = [official_source_compendium];

		if (available_source_keys.includes('Homebrew')) {
			compendiums.push(ownerHomebrewVaultState.compendium);
		}
		if (available_source_keys.includes('Campaign')) {
			compendiums.push(campaignVaultState.compendium);
		}

		return merge_compendium_content(...compendiums);
	});
	const cached_character_compendium = $derived.by((): CompendiumContent | null => {
		if (lastReadyCharacterCompendiumId !== activeCharacterId) return null;

		return lastReadyCharacterCompendium;
	});
	const ready_character_compendium = $derived.by(
		(): CompendiumContent | null => full_character_compendium ?? cached_character_compendium
	);
	const character_compendium = $derived(ready_character_compendium ?? merge_compendium_content());

	// Derived character data — recomputes reactively whenever character or compendium changes
	const character_derivation = $derived.by(() => {
		if (!character) return undefined;
		if (!ready_character_compendium) return undefined;
		return derive_character_state(character, ready_character_compendium);
	});
	const derived_character_data = $derived.by((): DerivedCharacterData | undefined => {
		return character_derivation?.derived;
	});
	const normalized_server_character = $derived.by(() => {
		if (!serverCharacter) return null;
		if (!ready_character_compendium) return serverCharacter;
		return derive_character_state(serverCharacter, ready_character_compendium).character;
	});
	const sync_character = $derived.by(() => character_derivation?.character ?? character ?? null);
	const local_snapshot = $derived.by(() =>
		sync_character ? stableSnapshot(sync_character) : undefined
	);
	const server_snapshot = $derived.by(() =>
		normalized_server_character ? stableSnapshot(normalized_server_character) : undefined
	);

	$effect(() => {
		if (bootstrapCharacterId === activeCharacterId) return;

		bootstrapCharacterId = activeCharacterId;
		bootstrapCompleted = false;
		lastReadyCharacterCompendium = null;
		lastReadyCharacterCompendiumId = undefined;
	});

	$effect(() => {
		if (!activeCharacterId || !full_character_compendium) return;

		lastReadyCharacterCompendium = full_character_compendium;
		lastReadyCharacterCompendiumId = activeCharacterId;
		bootstrapCompleted = true;
	});

	$effect(() => {
		if (!character || !character_derivation) return;
		const normalizedSnapshot = stableSnapshot(character_derivation.character);
		const localSnapshot = stableSnapshot(character);
		if (normalizedSnapshot !== localSnapshot) {
			character = character_derivation.character;
		}
	});

	//! manage server/local character state with debounced syncing and loop prevention
	let appliedServerSnapshot: string | undefined;
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	function clearPendingSync() {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = undefined;
		}
	}

	//! Server → Local: when the server character changes, update local character
	$effect(() => {
		if (!normalized_server_character || !server_snapshot) {
			clearPendingSync();
			character = undefined;
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
			character = normalized_server_character;
		}
	});

	//! Local → Server: when localCharacter changes, debounce and push to server
	$effect(() => {
		if (!sync_character || !local_snapshot || !id) {
			clearPendingSync();
			return;
		}

		clearPendingSync();

		if (local_snapshot === server_snapshot) return;

		const capturedId = id;
		const capturedCharacter: Character = JSON.parse(JSON.stringify(sync_character));
		debounceTimer = setTimeout(() => {
			debounceTimer = undefined;
			convexClient.mutation(api.functions.characters.update, {
				id: capturedId,
				character: capturedCharacter
			});
		}, SYNC_DEBOUNCE_MS);

		return () => {
			clearPendingSync();
		};
	});

	// -----------------------------------------------------------------------
	// Inventory helpers — mutate character locally; sync is handled by debounce
	// -----------------------------------------------------------------------

	function addToInventory(
		options:
			| { type: 'primary_weapon'; id: string }
			| { type: 'secondary_weapon'; id: string }
			| { type: 'armor'; id: string }
			| { type: 'loot'; id: string }
			| { type: 'consumable'; id: string }
			| { type: 'adventuring_gear'; title: string }
	) {
		if (!character) return;
		const newUid = crypto.randomUUID();

		if (options.type === 'primary_weapon') {
			character.inventory.primary_weapons.push({
				inventory_id: newUid,
				base_primary_weapon_id: options.id,
				choices: {}
			});
		} else if (options.type === 'secondary_weapon') {
			character.inventory.secondary_weapons.push({
				inventory_id: newUid,
				base_secondary_weapon_id: options.id,
				choices: {}
			});
		} else if (options.type === 'armor') {
			character.inventory.armor.push({
				inventory_id: newUid,
				base_armor_id: options.id,
				choices: {}
			});
		} else if (options.type === 'loot') {
			character.inventory.loot.push({
				inventory_id: newUid,
				base_loot_id: options.id,
				choices: {}
			});
		} else if (options.type === 'consumable') {
			character.inventory.consumables.push({
				inventory_id: newUid,
				base_consumable_id: options.id,
				choices: {}
			});
		} else if (options.type === 'adventuring_gear') {
			character.inventory.adventuring_gear.push(options.title);
		}
	}

	function removeFromInventory(
		type:
			| 'primary_weapon'
			| 'secondary_weapon'
			| 'armor'
			| 'loot'
			| 'consumable'
			| 'adventuring_gear',
		inventory_id: string
	) {
		if (!character) return;

		if (type === 'primary_weapon') {
			const item = character.inventory.primary_weapons.find((w) => w.inventory_id === inventory_id);
			if (item && item.inventory_id === character.active_primary_weapon_inventory_id) {
				character.active_primary_weapon_inventory_id = undefined;
			}
			character.inventory.primary_weapons = character.inventory.primary_weapons.filter(
				(w) => w.inventory_id !== inventory_id
			);
		} else if (type === 'secondary_weapon') {
			const item = character.inventory.secondary_weapons.find(
				(w) => w.inventory_id === inventory_id
			);
			if (item && item.inventory_id === character.active_secondary_weapon_inventory_id) {
				character.active_secondary_weapon_inventory_id = undefined;
			}
			character.inventory.secondary_weapons = character.inventory.secondary_weapons.filter(
				(w) => w.inventory_id !== inventory_id
			);
		} else if (type === 'armor') {
			const item = character.inventory.armor.find((a) => a.inventory_id === inventory_id);
			if (item && item.inventory_id === character.active_armor_inventory_id) {
				character.active_armor_inventory_id = undefined;
			}
			character.inventory.armor = character.inventory.armor.filter(
				(a) => a.inventory_id !== inventory_id
			);
		} else if (type === 'loot') {
			character.inventory.loot = character.inventory.loot.filter(
				(l) => l.inventory_id !== inventory_id
			);
		} else if (type === 'consumable') {
			character.inventory.consumables = character.inventory.consumables.filter(
				(c) => c.inventory_id !== inventory_id
			);
		} else if (type === 'adventuring_gear') {
			const idx = character.inventory.adventuring_gear.indexOf(inventory_id);
			if (idx !== -1) character.inventory.adventuring_gear.splice(idx, 1);
		}
	}

	function nextEquippedWeaponBurden(
		type: 'primary_weapon' | 'secondary_weapon',
		inventory_id: string
	): number {
		if (!character || !derived_character_data) return 0;
		if (derived_character_data.hasCompatTrainingClassFeature) return 0;

		const nextPrimaryId =
			type === 'primary_weapon' ? inventory_id : character.active_primary_weapon_inventory_id;
		const nextSecondaryId =
			type === 'secondary_weapon' ? inventory_id : character.active_secondary_weapon_inventory_id;

		const primaryBurden =
			derived_character_data.inventory_primary_weapons.find(
				(item) => item.inventory_id === nextPrimaryId
			)?.burden ?? 0;
		const secondaryBurden =
			derived_character_data.inventory_secondary_weapons.find(
				(item) => item.inventory_id === nextSecondaryId
			)?.burden ?? 0;

		return primaryBurden + secondaryBurden;
	}

	function equipItem(type: 'armor' | 'primary_weapon' | 'secondary_weapon', inventory_id: string) {
		if (!character) return;

		if (type === 'primary_weapon') {
			if (!character.inventory.primary_weapons.some((w) => w.inventory_id === inventory_id)) return;

			if (
				derived_character_data &&
				nextEquippedWeaponBurden(type, inventory_id) > derived_character_data.max_burden
			) {
				character.active_secondary_weapon_inventory_id = undefined;
			}
			character.active_primary_weapon_inventory_id = inventory_id;
		} else if (type === 'secondary_weapon') {
			if (!character.inventory.secondary_weapons.some((w) => w.inventory_id === inventory_id))
				return;

			if (
				derived_character_data &&
				nextEquippedWeaponBurden(type, inventory_id) > derived_character_data.max_burden
			) {
				character.active_primary_weapon_inventory_id = undefined;
			}
			character.active_secondary_weapon_inventory_id = inventory_id;
		} else if (type === 'armor') {
			if (character.inventory.armor.some((w) => w.inventory_id === inventory_id))
				character.active_armor_inventory_id = inventory_id;
		}
	}

	function unequipItem(type: 'armor' | 'primary_weapon' | 'secondary_weapon') {
		if (!character) return;
		if (type === 'primary_weapon') character.active_primary_weapon_inventory_id = undefined;
		else if (type === 'secondary_weapon')
			character.active_secondary_weapon_inventory_id = undefined;
		else if (type === 'armor') character.active_armor_inventory_id = undefined;
	}

	function addScar() {
		if (!character) return;

		const totalHopeSlots = (derived_character_data?.max_hope ?? 0) + character.scars;
		const nextScars =
			totalHopeSlots > 0 ? Math.min(totalHopeSlots, character.scars + 1) : character.scars + 1;
		if (nextScars === character.scars) return;

		character.scars = nextScars;
		const nextMaxHope = Math.max(0, totalHopeSlots - nextScars);
		character.marked_hope = Math.min(character.marked_hope, nextMaxHope);
		if (totalHopeSlots > 0 && nextScars >= totalHopeSlots) {
			character.death_state = {
				is_dead: true,
				death_move: 'avoid_death'
			};
		}
	}

	function removeScar() {
		if (!character) return;
		if (character.scars <= 0) return;

		character.scars -= 1;
	}

	return {
		get id() {
			return id;
		},
		set id(value) {
			id = value;
		},
		get character() {
			return character;
		},
		set character(value) {
			character = value;
		},
		get isLoading() {
			return isLoading;
		},
		get error() {
			return error;
		},
		get canEdit() {
			return characterQuery.data?.canEdit ?? false;
		},
		get isOwner() {
			return characterQuery.data?.isOwner ?? false;
		},
		get derived_character_data() {
			return derived_character_data;
		},
		get character_compendium() {
			return character_compendium;
		},
		get available_source_keys() {
			return available_source_keys;
		},
		get sources() {
			return sources;
		},

		// helper functions
		getSourceByKey(sourceKey: SourceKey) {
			return sources.find((source) => source.source_key === sourceKey);
		},
		addToInventory,
		removeFromInventory,
		equipItem,
		unequipItem,
		addScar,
		removeScar
	};
}

const CHARACTER_KEY = Symbol('Character');

export const setCharacterContext = () => {
	const newCharacter = createCharacter();
	return setContext(CHARACTER_KEY, newCharacter);
};

export const getCharacterContext = (): ReturnType<typeof setCharacterContext> => {
	return getContext(CHARACTER_KEY) as ReturnType<typeof setCharacterContext>;
};
