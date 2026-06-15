import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import type {
	CharacterAccess,
	HomebrewAccess,
	HomebrewItem,
	HomebrewTable
} from '@convex/permissions';
import type { Campaign, CampaignCharacter, CampaignMember } from '@convex/schemas/campaigns';
import type { Character } from '@convex/schemas/characters';
import type { CompendiumContent, CompendiumContentIds } from '@convex/schemas/compendium';
import type { Roll } from '@convex/schemas/dice';
import { useConvexClient, useQuery } from 'convex-svelte';
import { getContext, onDestroy, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import { getUserContext } from './user.svelte';

const SYNC_DEBOUNCE_MS = 200;
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

type CampaignVaultKey = (typeof VAULT_KEYS)[number];
type CampaignVaultItemId<TKey extends CampaignVaultKey> = CompendiumContentIds[TKey][number];

export type CampaignRosterEntry = {
	characterId: Id<'characters'>;
	character: Character;
	canEdit: boolean;
	isOwner: boolean;
	claimable: boolean;
	status: CampaignCharacter['status'];
	claimedByClerkId?: string;
	playerDisplayName?: string;
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

function itemsFor<T extends HomebrewTable>(
	ids: Id<T>[],
	results: SvelteMap<string, HomebrewAccess<HomebrewTable> | null>,
	sourceKeyOverride?: HomebrewItem<T>['source_key']
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

function createCampaign() {
	const convexClient = useConvexClient();
	const userCtx = getUserContext();

	let id: Id<'campaigns'> | undefined = $state();
	let campaign: Campaign | undefined = $state();

	const vaultSubscriptions = new Map<string, () => void>();
	const vaultResults = new SvelteMap<string, HomebrewAccess<HomebrewTable> | null>();
	const vaultErrors = new SvelteMap<string, Error>();

	const rosterSubscriptions = new Map<string, () => void>();
	const rosterResults = new SvelteMap<string, CharacterAccess | null>();
	const rosterErrors = new SvelteMap<string, Error>();

	let bootstrapCampaignId: string | undefined = $state();
	let bootstrapRosterIds: string[] = $state([]);
	let bootstrapVaultIds: string[] = $state([]);
	let bootstrapTargetsCaptured = $state(false);
	let bootstrapCompleted = $state(false);

	onDestroy(() => {
		for (const unsub of vaultSubscriptions.values()) unsub();
		for (const unsub of rosterSubscriptions.values()) unsub();
		vaultSubscriptions.clear();
		vaultResults.clear();
		vaultErrors.clear();
		rosterSubscriptions.clear();
		rosterResults.clear();
		rosterErrors.clear();
	});

	const campaignQuery = useQuery(api.functions.campaigns.get, () => (id ? { id } : 'skip'));
	const diceHistoryQuery = useQuery(api.functions.campaigns.getDiceHistory, () =>
		id ? { campaign_id: id } : 'skip'
	);

	const campaignAccess = $derived(campaignQuery.data ?? null);
	const requestedCampaignId = $derived.by(() => id as string | undefined);
	const resolvedCampaignId = $derived.by(() => campaignAccess?.campaign_id as string | undefined);
	const hasResolvedCurrentCampaign = $derived.by(
		() =>
			!!requestedCampaignId && !!resolvedCampaignId && resolvedCampaignId === requestedCampaignId
	);
	const serverCampaign = $derived(
		hasResolvedCurrentCampaign ? (campaignAccess?.campaign ?? null) : null
	);
	const members = $derived<CampaignMember[]>(
		hasResolvedCurrentCampaign ? (campaignAccess?.members ?? []) : []
	);
	const campaignCharacters = $derived<CampaignCharacter[]>(
		hasResolvedCurrentCampaign ? (campaignAccess?.characters ?? []) : []
	);
	const inviteCode = $derived(
		hasResolvedCurrentCampaign ? (campaignAccess?.invite_code ?? null) : null
	);
	const isGm = $derived(hasResolvedCurrentCampaign ? (campaignAccess?.isOwner ?? false) : false);
	const diceHistory = $derived(
		hasResolvedCurrentCampaign && !diceHistoryQuery.isLoading
			? (diceHistoryQuery.data ?? null)
			: null
	);
	$effect(() => {
		const currentCampaignId = requestedCampaignId;
		if (bootstrapCampaignId === currentCampaignId) return;

		clearPendingSync();
		campaign = undefined;
		appliedServerSnapshot = undefined;
		bootstrapCampaignId = currentCampaignId;
		bootstrapRosterIds = [];
		bootstrapVaultIds = [];
		bootstrapTargetsCaptured = false;
		bootstrapCompleted = false;
	});

	const activeVault = $derived.by(
		(): CompendiumContentIds | null =>
			campaign?.homebrew_vault ?? serverCampaign?.homebrew_vault ?? null
	);

	$effect(() => {
		const vault = activeVault;
		if (!vault) {
			for (const unsub of vaultSubscriptions.values()) unsub();
			vaultSubscriptions.clear();
			vaultResults.clear();
			vaultErrors.clear();
			return;
		}

		const allVaultIds = new Set<string>(getAllVaultIds(vault));

		for (const [itemId, unsub] of vaultSubscriptions) {
			if (!allVaultIds.has(itemId)) {
				unsub();
				vaultSubscriptions.delete(itemId);
				vaultResults.delete(itemId);
				vaultErrors.delete(itemId);
			}
		}

		for (const key of VAULT_KEYS) {
			for (const itemId of vault[key]) {
				const itemKey = itemId as string;
				if (vaultSubscriptions.has(itemKey)) continue;

				const unsub = convexClient.onUpdate(
					api.functions.homebrew.get,
					{ id: itemId as Id<HomebrewTable> },
					(data) => {
						vaultErrors.delete(itemKey);
						vaultResults.set(itemKey, data);
					},
					(error) => {
						vaultErrors.set(itemKey, error);
					}
				);

				vaultSubscriptions.set(itemKey, unsub);
			}
		}
	});

	$effect(() => {
		if (!id) {
			for (const unsub of rosterSubscriptions.values()) unsub();
			rosterSubscriptions.clear();
			rosterResults.clear();
			rosterErrors.clear();
			return;
		}

		const allCharacterIds = new Set<string>(
			campaignCharacters.map((campaignCharacter) => campaignCharacter.character_id as string)
		);

		for (const [characterId, unsub] of rosterSubscriptions) {
			if (!allCharacterIds.has(characterId)) {
				unsub();
				rosterSubscriptions.delete(characterId);
				rosterResults.delete(characterId);
				rosterErrors.delete(characterId);
			}
		}

		for (const campaignCharacter of campaignCharacters) {
			const characterId = campaignCharacter.character_id as string;
			if (rosterSubscriptions.has(characterId)) continue;

			const unsub = convexClient.onUpdate(
				api.functions.characters.get,
				{ id: campaignCharacter.character_id },
				(data) => {
					rosterErrors.delete(characterId);
					rosterResults.set(characterId, data);
				},
				(error) => {
					rosterErrors.set(characterId, error);
				}
			);

			rosterSubscriptions.set(characterId, unsub);
		}
	});

	const userMembership = $derived.by(() => {
		const clerkId = userCtx.user?.clerk_id;
		if (!clerkId) return null;
		return members.find((member) => member.clerk_id === clerkId) ?? null;
	});

	const compendium = $derived.by((): CompendiumContent | null => {
		const vault = activeVault;
		if (!vault) return null;

		return {
			primary_weapons: itemsFor(vault.primary_weapons, vaultResults, 'Campaign'),
			secondary_weapons: itemsFor(vault.secondary_weapons, vaultResults, 'Campaign'),
			armor: itemsFor(vault.armor, vaultResults, 'Campaign'),
			loot: itemsFor(vault.loot, vaultResults, 'Campaign'),
			consumables: itemsFor(vault.consumables, vaultResults, 'Campaign'),
			beastforms: itemsFor(vault.beastforms, vaultResults, 'Campaign'),
			classes: itemsFor(vault.classes, vaultResults, 'Campaign'),
			subclasses: itemsFor(vault.subclasses, vaultResults, 'Campaign'),
			domains: itemsFor(vault.domains, vaultResults, 'Campaign'),
			domain_cards: itemsFor(vault.domain_cards, vaultResults, 'Campaign'),
			ancestry_cards: itemsFor(vault.ancestry_cards, vaultResults, 'Campaign'),
			community_cards: itemsFor(vault.community_cards, vaultResults, 'Campaign'),
			transformation_cards: itemsFor(vault.transformation_cards, vaultResults, 'Campaign'),
			adversaries: itemsFor(vault.adversaries, vaultResults, 'Campaign'),
			environments: itemsFor(vault.environments, vaultResults, 'Campaign')
		};
	});

	const roster = $derived.by((): CampaignRosterEntry[] => {
		return campaignCharacters.flatMap((campaignCharacter) => {
			const access = rosterResults.get(campaignCharacter.character_id as string);
			if (!access) return [];
			const playerDisplayName = campaignCharacter.claimed_by_clerk_id
				? (
						members.find((member) => member.clerk_id === campaignCharacter.claimed_by_clerk_id)
							?.display_name ?? ''
					).trim() || undefined
				: undefined;

			return [
				{
					characterId: campaignCharacter.character_id,
					character: access.character,
					canEdit: access.canEdit,
					isOwner: access.isOwner,
					claimable: campaignCharacter.status === 'unclaimed',
					status: campaignCharacter.status,
					claimedByClerkId: campaignCharacter.claimed_by_clerk_id,
					playerDisplayName
				}
			];
		});
	});

	const local_snapshot = $derived.by(() => (campaign ? stableSnapshot(campaign) : undefined));
	const server_snapshot = $derived.by(() =>
		serverCampaign ? stableSnapshot(serverCampaign) : undefined
	);

	$effect(() => {
		const currentCampaignId = requestedCampaignId;
		if (!currentCampaignId || bootstrapCompleted || bootstrapTargetsCaptured) return;
		if (campaignQuery.isLoading || diceHistoryQuery.isLoading) return;

		bootstrapRosterIds = hasResolvedCurrentCampaign
			? (campaignAccess?.characters ?? []).map(
					(campaignCharacter) => campaignCharacter.character_id as string
				)
			: [];
		bootstrapVaultIds =
			hasResolvedCurrentCampaign && campaignAccess?.campaign
				? getAllVaultIds(campaignAccess.campaign.homebrew_vault)
				: [];
		bootstrapTargetsCaptured = true;
	});

	const hasBootstrappedCurrentCampaign = $derived.by(
		() => bootstrapCompleted && bootstrapCampaignId === requestedCampaignId
	);

	const bootstrapVaultReady = $derived.by(() =>
		bootstrapVaultIds.every((itemId) => vaultResults.has(itemId))
	);

	const bootstrapRosterReady = $derived.by(() =>
		bootstrapRosterIds.every((characterId) => rosterResults.has(characterId))
	);

	const bootstrapReady = $derived.by(() => {
		if (!id) return true;
		if (!bootstrapTargetsCaptured) return false;
		return (
			!campaignQuery.isLoading &&
			!diceHistoryQuery.isLoading &&
			bootstrapVaultReady &&
			bootstrapRosterReady
		);
	});

	$effect(() => {
		if (!id || bootstrapCompleted || !bootstrapReady) return;
		bootstrapCompleted = true;
	});

	const error = $derived(
		campaignQuery.error ??
			diceHistoryQuery.error ??
			userCtx.error ??
			firstErrorFromMap(vaultErrors) ??
			firstErrorFromMap(rosterErrors)
	);
	const isLoading = $derived(
		userCtx.isLoading ||
			(!!id && !hasBootstrappedCurrentCampaign && (!error || !bootstrapTargetsCaptured))
	);
	const activeCampaign = $derived.by((): Campaign | undefined => {
		if (!requestedCampaignId || !hasResolvedCurrentCampaign || !hasBootstrappedCurrentCampaign) {
			return undefined;
		}

		return campaign ?? serverCampaign ?? undefined;
	});
	const activeMembers = $derived.by((): CampaignMember[] => (activeCampaign ? members : []));
	const activeInviteCode = $derived(activeCampaign ? inviteCode : null);
	const activeIsGm = $derived(activeCampaign ? isGm : false);
	const activeRoster = $derived.by((): CampaignRosterEntry[] => (activeCampaign ? roster : []));
	const activeDiceHistory = $derived(activeCampaign ? diceHistory : null);

	let appliedServerSnapshot: string | undefined;
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	function clearPendingSync() {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = undefined;
		}
	}

	$effect(() => {
		if (!serverCampaign || !server_snapshot) {
			clearPendingSync();
			campaign = undefined;
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
			campaign = serverCampaign;
		}
	});

	$effect(() => {
		if (!campaign || !local_snapshot || !id) {
			clearPendingSync();
			return;
		}

		clearPendingSync();

		if (local_snapshot === server_snapshot) return;

		const capturedId = id;
		const capturedCampaign: Campaign = JSON.parse(JSON.stringify(campaign));

		debounceTimer = setTimeout(() => {
			debounceTimer = undefined;
			convexClient.mutation(api.functions.campaigns.update, {
				id: capturedId,
				campaign: capturedCampaign
			});
		}, SYNC_DEBOUNCE_MS);

		return () => {
			clearPendingSync();
		};
	});

	function addToVault<TKey extends CampaignVaultKey>(
		type: TKey,
		itemId: CampaignVaultItemId<TKey>
	) {
		if (!campaign) return;
		const currentItems = campaign.homebrew_vault[type] as CompendiumContentIds[TKey];
		if (!(currentItems as readonly string[]).includes(itemId as string)) {
			campaign.homebrew_vault[type] = [...currentItems, itemId] as CompendiumContentIds[TKey];
		}
	}

	function removeFromVault(itemId: string) {
		if (!campaign) return;
		const vault = campaign.homebrew_vault;

		campaign.homebrew_vault = Object.fromEntries(
			VAULT_KEYS.map((key) => [key, vault[key].filter((id) => id !== itemId)])
		) as Campaign['homebrew_vault'];
	}

	async function addRollToHistory(roll: Roll) {
		if (!id) return;

		const nextHistory = [
			...(diceHistory?.rolls ?? []).filter((entry) => entry.id !== roll.id),
			roll
		]
			.sort((left, right) => left.timestamp - right.timestamp)
			.slice(-50);

		await convexClient.mutation(api.functions.campaigns.updateDiceHistory, {
			campaign_id: id,
			history: { rolls: nextHistory }
		});
	}

	return {
		get id() {
			return id;
		},
		set id(value) {
			if (id === value) return;
			id = value;
		},
		get isLoading() {
			return isLoading;
		},
		get error() {
			return error;
		},
		get isGm() {
			return activeIsGm;
		},
		get campaign() {
			return activeCampaign;
		},
		set campaign(value) {
			campaign = value;
		},
		get compendium() {
			return compendium;
		},
		get inviteCode() {
			return activeInviteCode;
		},
		get members() {
			return activeMembers;
		},
		get userMembership() {
			return userMembership;
		},
		get roster(): CampaignRosterEntry[] {
			return activeRoster;
		},
		get active_characters(): CampaignRosterEntry[] {
			return activeRoster.filter((entry) => !entry.claimable);
		},
		get inactive_characters(): CampaignRosterEntry[] {
			return activeRoster.filter((entry) => entry.claimable);
		},
		get diceHistory() {
			return activeDiceHistory;
		},
		addToVault,
		removeFromVault,
		addRollToHistory
	};
}

const CAMPAIGN_KEY = Symbol('Campaign');

export const setCampaignContext = () => {
	const newCampaign = createCampaign();
	return setContext(CAMPAIGN_KEY, newCampaign);
};

export const getCampaignContext = (): ReturnType<typeof setCampaignContext> => {
	return getContext(CAMPAIGN_KEY);
};
