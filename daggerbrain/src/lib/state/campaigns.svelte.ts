import {
	get_campaign,
	get_campaign_members,
	get_campaign_state,
	get_campaign_characters
} from '$lib/remote/campaigns.remote';
import { get_campaign_homebrew_vault } from '$lib/remote/campaign-homebrew.remote';
import { update_campaign_state } from '$lib/remote/campaigns.remote';
import { error } from '@sveltejs/kit';
import { getContext, setContext } from 'svelte';
import { createCampaignLiveConnection } from './campaign-live.svelte';
import type { Campaign, CampaignState, CampaignCharacterSummary, CampaignMember, CampaignCharacterLiveUpdate } from '$lib/types/campaign-types';
import type { HomebrewType } from '$lib/types/homebrew-types';

// Helper function to merge live character updates with existing character data
function mergeCharacterLiveUpdate(
	existing: CampaignCharacterSummary | undefined,
	liveUpdate: CampaignCharacterLiveUpdate
): CampaignCharacterSummary | null {
	// If character doesn't exist, we can't create a full summary from just live updates
	// Return null to indicate we should ignore this update or fetch the full character
	if (!existing) {
		return null;
	}
	
	// Merge live update fields into existing character
	return {
		...existing,
		...liveUpdate
	};
}

function campaignContext(getCampaignId: () => string | undefined) {
	// State
	let campaign = $state<Campaign | null>(null);
	let members = $state<CampaignMember[]>([]);
	let campaignState = $state<CampaignState | null>(null);
	let characters = $state<Record<string, CampaignCharacterSummary>>({});
	let vaultItems = $state<Array<{ id: string; homebrew_type: HomebrewType; homebrew_id: string }>>([]);
	let loading = $state(true);
	let wsConnection = $state<ReturnType<typeof createCampaignLiveConnection> | null>(null);

	// Load all campaign data
	async function load() {
		const id = getCampaignId();
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
	async function updateState(updates: { fear_track?: number; notes?: string | null }): Promise<CampaignState> {
		const id = getCampaignId();
		if (!id) {
			throw new Error('Campaign ID is required');
		}

		try {
			// Update via HTTP (which will notify DO, and DO will broadcast via WebSocket)
			const updated = await update_campaign_state({
				campaign_id: id,
				...updates
			});

			// Update local state immediately with the verified state from server
			// WebSocket updates from DO will handle syncing across tabs
			campaignState = updated;
			
			return updated;
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to update campaign state');
			throw err;
		}
	}

	// Refresh characters
	async function refreshCharacters() {
		const id = getCampaignId();
		if (!id) return;

		try {
			const chars = await get_campaign_characters(id);
			characters = chars;
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to refresh characters');
		}
	}

	// Refresh vault items
	async function refreshVault() {
		const id = getCampaignId();
		if (!id) return;

		try {
			const vault = await get_campaign_homebrew_vault(id);
			vaultItems = vault;
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to refresh vault');
		}
	}

	// Refresh campaign data
	async function refreshCampaign() {
		const id = getCampaignId();
		if (!id) return;

		try {
			const camp = await get_campaign(id);
			campaign = camp;
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to refresh campaign');
		}
	}

	// Auto-load when campaign ID changes
	$effect(() => {
		const id = getCampaignId();
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
								// Initial state sync
								if (message.state) {
									campaignState = message.state;
								}
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
		refreshCharacters,
		refreshVault,
		refreshCampaign
	};
}

const CAMPAIGN_CONTEXT_KEY = Symbol('CampaignContext');

export const setCampaignContext = (getCampaignId: () => string | undefined) => {
	const newCampaignContext = campaignContext(getCampaignId);
	return setContext(CAMPAIGN_CONTEXT_KEY, newCampaignContext);
};

export const getCampaignContext = (): ReturnType<typeof setCampaignContext> => {
	return getContext(CAMPAIGN_CONTEXT_KEY);
};

