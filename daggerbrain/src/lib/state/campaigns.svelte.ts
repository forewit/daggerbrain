import {
	get_campaign,
	get_campaign_members,
	get_campaign_state,
	get_campaign_characters,
	update_campaign,
	delete_campaign,
	assign_character_to_campaign,
	leave_campaign,
	claim_character
} from '$lib/remote/campaigns.remote';
import {
	get_campaign_homebrew_vault,
	add_homebrew_to_vault,
	remove_homebrew_from_vault
} from '$lib/remote/campaign-homebrew.remote';
import {
	getClaimCharacterAccess,
	hasCharacterInCampaign as hasCharacterInCampaignCheck
} from '$lib/remote/permissions.remote';
import { error } from '@sveltejs/kit';
import { getContext, setContext } from 'svelte';
import { goto } from '$app/navigation';
import { createCampaignLiveConnection } from './campaign-live.svelte';
import type { Campaign, CampaignState, CampaignCharacterSummary, CampaignMember, CampaignCharacterLiveUpdate } from '$lib/types/campaign-types';
import type { DerivedCharacter } from '$lib/types/derived-character-types';
import type { HomebrewType } from '$lib/types/homebrew-types';

// Helper function to merge live character updates with existing character data
// Helper to convert DerivedCharacter to CampaignCharacterSummary
function derivedCharacterToSummary(derived: DerivedCharacter): CampaignCharacterSummary {
	return {
		id: derived.id,
		name: derived.name,
		image_url: derived.image_url,
		level: derived.level,
		marked_hp: derived.marked_hp,
		max_hp: derived.derived_max_hp,
		marked_stress: derived.marked_stress,
		max_stress: derived.derived_max_stress,
		marked_hope: derived.marked_hope,
		max_hope: derived.derived_max_hope,
		active_conditions: derived.active_conditions,
		owner_user_id: derived.clerk_user_id,
		derived_descriptors: derived.derived_descriptors,
		evasion: derived.derived_evasion,
		max_armor: derived.derived_max_armor,
		marked_armor: derived.marked_armor,
		damage_thresholds: derived.derived_damage_thresholds,
		claimable: derived.claimable === 1
	};
}

// Deep merge helper for nested objects
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
	const output = { ...target };
	
	for (const key in source) {
		if (source[key] === undefined) continue;
		
		if (
			source[key] !== null &&
			typeof source[key] === 'object' &&
			!Array.isArray(source[key]) &&
			target[key] !== null &&
			typeof target[key] === 'object' &&
			!Array.isArray(target[key])
		) {
			// Recursively merge nested objects
			output[key] = deepMerge(target[key], source[key] as Partial<T[Extract<keyof T, string>]>);
		} else {
			// Replace primitive values, arrays, or null
			output[key] = source[key] as T[Extract<keyof T, string>];
		}
	}
	
	return output;
}

function mergeCharacterLiveUpdate(
	existing: CampaignCharacterSummary | undefined,
	liveUpdate: CampaignCharacterLiveUpdate | DerivedCharacter
): CampaignCharacterSummary | null {
	// Check if liveUpdate is a full DerivedCharacter
	if ('id' in liveUpdate && 'clerk_user_id' in liveUpdate && 'derived_max_hp' in liveUpdate) {
		// Full character object - convert to summary
		return derivedCharacterToSummary(liveUpdate as DerivedCharacter);
	}
	
	// Partial update - need existing character to merge into
	if (!existing) {
		return null; // Can't apply partial update without existing character
	}
	
	// Deep merge the partial update
	const merged = deepMerge(existing, liveUpdate as Partial<CampaignCharacterSummary>);
	
	// Update derived fields if they're in the update
	if ('derived_max_hp' in liveUpdate) merged.max_hp = (liveUpdate as any).derived_max_hp;
	if ('derived_max_stress' in liveUpdate) merged.max_stress = (liveUpdate as any).derived_max_stress;
	if ('derived_max_hope' in liveUpdate) merged.max_hope = (liveUpdate as any).derived_max_hope;
	if ('derived_evasion' in liveUpdate) merged.evasion = (liveUpdate as any).derived_evasion;
	if ('derived_max_armor' in liveUpdate) merged.max_armor = (liveUpdate as any).derived_max_armor;
	if ('derived_damage_thresholds' in liveUpdate) merged.damage_thresholds = (liveUpdate as any).derived_damage_thresholds;
	if ('derived_descriptors' in liveUpdate) merged.derived_descriptors = (liveUpdate as any).derived_descriptors;
	
	return merged;
}

function campaignContext(campaignId: string | undefined) {
	// State
	let campaign = $state<Campaign | null>(null);
	let members = $state<CampaignMember[]>([]);
	let campaignState = $state<CampaignState | null>(null);
	let characters = $state<Record<string, CampaignCharacterSummary>>({});
	let vaultItems = $state<Array<{ id: string; homebrew_type: HomebrewType; homebrew_id: string }>>([]);
	let loading = $state(true);
	let wsConnection = $state<ReturnType<typeof createCampaignLiveConnection> | null>(null);

	// Auto-save state tracking
	let initialLoadComplete = $state(false);
	let lastSavedCampaign = $state<string | null>(null);
	let inFlightSave: Promise<void> | null = null;
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	// Load all campaign data
	async function load() {
		const id = campaignId;
		if (!id) return;

		loading = true;
		try {
			const [camp, mems, state, chars, vault] = await Promise.all([
				get_campaign(id),
				get_campaign_members(id),
				get_campaign_state(id),
				get_campaign_characters(id),
				get_campaign_homebrew_vault(id)
			]);
			campaign = camp;
			members = mems;
			campaignState = state;
			characters = chars;
			vaultItems = vault;
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to load campaign');
		} finally {
			loading = false;
		}
	}


	// Update campaign state
	async function updateState(updates: { fear_track?: number; notes?: string | null }): Promise<void> {
		const id = campaignId;
		if (!id) {
			throw new Error('Campaign ID is required');
		}

		if (!wsConnection || !wsConnection.connected) {
			throw new Error('WebSocket not connected. Cannot update campaign state.');
		}

		// Send update via WebSocket - DO will validate, update, and broadcast
		wsConnection.send({
			type: 'update_state',
			updates: {
				...updates,
				updated_at: Date.now()
			}
		});

		// Local state will be updated via WebSocket message handler
		// No need to update immediately - wait for DO's broadcast
	}

	// Delete campaign
	async function deleteCampaign(): Promise<void> {
		const id = campaignId;
		if (!id) return;

		try {
			await delete_campaign(id);
			await goto('/campaigns');
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to delete campaign');
		}
	}

	// Assign character to campaign (or remove from campaign if campaignId is null)
	async function assignCharacter(characterId: string, targetCampaignId: string | null): Promise<void> {
		if (!characterId) return;

		try {
			await assign_character_to_campaign({
				character_id: characterId,
				campaign_id: targetCampaignId
			});
			// Query refresh is handled by the remote command
			// Reload to get fresh data
			await load();
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to assign character');
		}
	}

	// Claim a claimable character
	async function claimCharacter(characterId: string): Promise<void> {
		const id = campaignId;
		if (!id || !characterId) return;

		try {
			await claim_character({
				character_id: characterId,
				campaign_id: id
			});
			// Query refresh is handled by the remote command
			// Reload to get fresh data
			await load();
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to claim character');
		}
	}

	// Leave campaign
	async function leaveCampaign(): Promise<void> {
		const id = campaignId;
		if (!id) return;

		try {
			await leave_campaign(id);
			await goto('/campaigns');
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to leave campaign');
		}
	}

	// Add homebrew item to vault
	async function addToVault(homebrewType: HomebrewType, homebrewId: string): Promise<void> {
		const id = campaignId;
		if (!id || !homebrewType || !homebrewId) return;

		try {
			await add_homebrew_to_vault({
				campaign_id: id,
				homebrew_type: homebrewType,
				homebrew_id: homebrewId
			});
			// Query refresh is handled by the remote command
			// Reload to get fresh data
			await load();
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to add item to vault');
		}
	}

	// Remove homebrew item from vault
	async function removeFromVault(vaultId: string): Promise<void> {
		const id = campaignId;
		if (!id || !vaultId) return;

		try {
			await remove_homebrew_from_vault({
				campaign_id: id,
				vault_id: vaultId
			});
			// Query refresh is handled by the remote command
			// Reload to get fresh data
			await load();
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to remove item from vault');
		}
	}

	// Check if user can claim a character
	async function canClaimCharacter(characterId: string): Promise<boolean> {
		const id = campaignId;
		if (!id || !characterId) return false;

		try {
			const access = await getClaimCharacterAccess({
				characterId,
				campaignId: id
			});
			return access.canClaim;
		} catch (err) {
			return false;
		}
	}

	// Check if user already has a character in this campaign
	async function hasCharacterInCampaign(): Promise<boolean> {
		const id = campaignId;
		if (!id) return false;

		try {
			return await hasCharacterInCampaignCheck(id);
		} catch (err) {
			return false;
		}
	}

	// Auto-load when campaign ID changes
	$effect(() => {
		const id = campaignId;
		if (id) {
			load().then(() => {
				// After initial load, connect WebSocket
				if (typeof window !== 'undefined') {
					// Only create new connection if we don't have one or it's disconnected
					// Check if existing connection is still valid (connected or connecting)
					if (wsConnection && (wsConnection.connected || wsConnection.status === 'connecting' || wsConnection.status === 'reconnecting')) {
						// Connection already exists and is active, skip creating a new one
						// Message handler should already be set up from previous creation
						return;
					}
					
					// Disconnect existing connection if any (shouldn't happen due to check above, but safety)
					if (wsConnection) {
						wsConnection.disconnect();
					}
					
					// Create new WebSocket connection
					wsConnection = createCampaignLiveConnection(id);
					
					// Set up message handler
					wsConnection.onMessage((message) => {
						switch (message.type) {
							case 'connected':
							case 'state_sync':
								// Initial state sync or rejoin sync - now receives full DerivedCharacter objects
								if (message.state) {
									campaignState = message.state;
								}
								// Convert full DerivedCharacter objects to summaries
								if (message.characters) {
									const merged: Record<string, CampaignCharacterSummary> = { ...characters };
									for (const [id, derivedChar] of Object.entries(message.characters)) {
										const summary = mergeCharacterLiveUpdate(characters[id], derivedChar as DerivedCharacter);
										if (summary) {
											merged[id] = summary;
										}
									}
									characters = merged;
								}
								break;
							case 'already_synced':
								// Client is already in sync, no action needed
								break;
							case 'state_update':
								if (message.state) {
									campaignState = message.state;
								}
								break;
							case 'characters_update':
								// Merge live character updates with existing character data
								if (message.characters) {
									const merged: Record<string, CampaignCharacterSummary> = { ...characters };
									for (const [id, liveUpdate] of Object.entries(message.characters)) {
										const mergedChar = mergeCharacterLiveUpdate(characters[id], liveUpdate);
										if (mergedChar) {
											merged[id] = mergedChar;
										}
									}
									characters = merged;
								}
								break;
							case 'character_update':
								// Merge live character update with existing character data
								if (message.characterId && message.character) {
									const mergedChar = mergeCharacterLiveUpdate(
										characters[message.characterId],
										message.character
									);
									if (mergedChar) {
										characters = {
											...characters,
											[message.characterId]: mergedChar
										};
									}
								}
								break;
							case 'character_added':
								// Add new character to state
								if (message.character) {
									const summary = derivedCharacterToSummary(message.character);
									characters = {
										...characters,
										[message.character.id]: summary
									};
								}
								break;
							case 'character_removed':
								// Remove character from state
								if (message.characterId) {
									const { [message.characterId]: removed, ...rest } = characters;
									characters = rest;
								}
								break;
							case 'character_full_update':
								// Replace entire character object
								if (message.characterId && message.character) {
									const summary = derivedCharacterToSummary(message.character);
									characters = {
										...characters,
										[message.characterId]: summary
									};
								}
								break;
							case 'character_diff_update':
								// Merge diff into existing character
								if (message.characterId && message.updates) {
									const mergedChar = mergeCharacterLiveUpdate(
										characters[message.characterId],
										message.updates
									);
									if (mergedChar) {
										characters = {
											...characters,
											[message.characterId]: mergedChar
										};
									}
								}
								break;
							case 'error':
								console.error('WebSocket error:', message.message);
								break;
						}
					});
					
					// Connect
					wsConnection.connect();
				}
			});
		} else {
			// Disconnect WebSocket if no campaign ID
			if (wsConnection) {
				wsConnection.disconnect();
				wsConnection = null;
			}
		}
		
		// Cleanup on unmount
		return () => {
			if (wsConnection) {
				wsConnection.disconnect();
				wsConnection = null;
			}
		};
	});

	// Track when campaign is first loaded
	$effect(() => {
		if (campaign && !initialLoadComplete) {
			initialLoadComplete = true;
			lastSavedCampaign = JSON.stringify({ name: campaign.name, description: campaign.description });
		}
	});

	// Debounced auto-save effect for campaign name and description
	$effect(() => {
		if (!campaign || !initialLoadComplete) return;

		const currentJson = JSON.stringify({ name: campaign.name, description: campaign.description });
		// Only save if the campaign actually changed from the last saved state
		if (currentJson === lastSavedCampaign) return;

		// Clear any existing debounce timer
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}

		// Debounce: wait 300ms before triggering save
		debounceTimer = setTimeout(() => {
			debounceTimer = null;
			if (!campaign) return; // Guard against null campaign

			// Don't start a new save if one is already in flight
			if (inFlightSave) {
				return;
			}

			const id = campaignId;
			if (!id) return;

			const savePromise = update_campaign({
				campaign_id: id,
				name: campaign.name,
				description: campaign.description
			})
				.then(() => {
					if (!campaign) return; // Guard against null campaign
					// Only update lastSavedCampaign after successful save
					lastSavedCampaign = JSON.stringify({ name: campaign.name, description: campaign.description });
				})
				.catch((err) => {
					if (!campaign) return; // Guard against null campaign
					console.error('Failed to auto-save campaign:', err);
					// Leave lastSavedCampaign unchanged so the next debounced change will retry
				})
				.finally(() => {
					// Clear the in-flight save promise when done
					if (inFlightSave === savePromise) {
						inFlightSave = null;
					}
				});

			inFlightSave = savePromise;
		}, 300);

		return () => {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
				debounceTimer = null;
			}
		};
	});

	return {
		get campaign() {
			return campaign;
		},
		get members() {
			return members;
		},
		get campaignState() {
			return campaignState;
		},
		get characters() {
			return characters;
		},
		get vaultItems() {
			return vaultItems;
		},
		get loading() {
			return loading;
		},
		load,
		updateState,
		deleteCampaign,
		assignCharacter,
		claimCharacter,
		leaveCampaign,
		addToVault,
		removeFromVault,
		canClaimCharacter,
		hasCharacterInCampaign
	};
}

const CAMPAIGN_CONTEXT_KEY = Symbol('CampaignContext');

export const setCampaignContext = (campaignId: string | undefined) => {
	const newCampaignContext = campaignContext(campaignId);
	return setContext(CAMPAIGN_CONTEXT_KEY, newCampaignContext);
};

export const getCampaignContext = (): ReturnType<typeof setCampaignContext> => {
	return getContext(CAMPAIGN_CONTEXT_KEY);
};

