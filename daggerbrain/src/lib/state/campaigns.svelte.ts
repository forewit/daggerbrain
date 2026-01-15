import {
	get_campaign,
	get_campaign_members,
	get_campaign_state,
	get_campaign_characters,
	update_campaign,
	update_campaign_state,
	update_campaign_member,
	delete_campaign,
	assign_character_to_campaign,
	leave_campaign,
	claim_character,
	unassign_character,
	join_campaign,
	get_user_campaigns,
	reset_invite_code
} from '$lib/remote/campaigns/campaigns.remote';
import {
	get_campaign_homebrew_vault,
	add_homebrew_to_vault,
	remove_homebrew_from_vault
} from '$lib/remote/campaigns/campaign-homebrew.remote';
import { error } from '@sveltejs/kit';
import { getContext, setContext } from 'svelte';
import { goto } from '$app/navigation';
import type {
	Campaign,
	CampaignState,
	CampaignCharacterSummary,
	CampaignMember,
	CampaignCharacterLiveUpdate,
	Countdown,
	CampaignLiveWebSocketMessage,
	CampaignLiveClientMessage
} from '@shared/types/campaign.types';
import type { HomebrewType } from '@shared/types/homebrew.types';
import { UI_CHARACTER_LIMIT } from '@shared/constants/constants';
import { getUserContext } from './user.svelte';

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

// Simplified merge for partial character updates CampaignCharacterSummary
function mergeCharacterLiveUpdate(
	existing: CampaignCharacterSummary | undefined,
	liveUpdate: CampaignCharacterLiveUpdate
): CampaignCharacterSummary | null {
	// Partial update - need existing character to merge into
	if (!existing) {
		return null; // Can't apply partial update without existing character
	}

	// Deep merge the partial update
	return deepMerge(existing, liveUpdate as Partial<CampaignCharacterSummary>);
}

// Private WebSocket connection factory - not exported
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

function createCampaignLiveConnection(campaignId: string) {
	let ws = $state<WebSocket | null>(null);
	let status = $state<ConnectionStatus>('disconnected');
	let reconnectAttempts = $state(0);
	let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
	let isConnecting = $state(false);
	let messageHandler: ((message: CampaignLiveWebSocketMessage) => void) | null = null;
	let lastKnownVersion = $state<number | undefined>(undefined);
	let shouldReconnect = $state(true); // Flag to prevent reconnection after explicit disconnect
	const maxReconnectAttempts = 2; // Maximum number of reconnect attempts (initial + 2 retries = 3 total)

	function connect() {
		// Prevent multiple simultaneous connection attempts
		if (ws?.readyState === WebSocket.OPEN) {
			return;
		}
		if (isConnecting) {
			return;
		}

		// Don't connect if we've been explicitly disconnected
		if (!shouldReconnect) {
			return;
		}

		isConnecting = true;
		status = 'connecting';
		shouldReconnect = true; // Allow reconnection when connecting

		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const url = `${protocol}//${window.location.host}/api/campaigns/${campaignId}/live`;

		try {
			const websocket = new WebSocket(url);

			websocket.onopen = () => {
				isConnecting = false;
				status = 'connected';
				reconnectAttempts = 0;
				ws = websocket;

				console.warn(`[CampaignLive] Connected to WebSocket for campaign`);

				// Send rejoin message if we have a last known version
				if (lastKnownVersion !== undefined) {
					ws.send(
						JSON.stringify({
							type: 'rejoin',
							lastKnownVersion
						})
					);
				}

				// Attach message handler if it was set before connection
				if (messageHandler) {
					// Store in local variable for type narrowing (messageHandler could be reassigned)
					const handler = messageHandler;
					ws.onmessage = (event) => {
						try {
							const parsed = JSON.parse(event.data);
							// Type assertion is necessary here as JSON.parse returns 'any'
							// Runtime validation happens via the message handler's type checking
							const message = parsed as CampaignLiveWebSocketMessage;

							// Update last known version from versioned messages
							if ('version' in message && typeof message.version === 'number') {
								lastKnownVersion = message.version;
							}

							handler(message);
						} catch (error) {
							console.error('Failed to parse WebSocket message:', error);
						}
					};
				}
			};

			websocket.onclose = () => {
				isConnecting = false;
				status = 'disconnected';
				ws = null;
				// Only reconnect if we haven't been explicitly disconnected
				if (shouldReconnect) {
					scheduleReconnect();
				}
			};

			websocket.onerror = () => {
				isConnecting = false;
				status = 'disconnected';
				// Only reconnect if we haven't been explicitly disconnected
				if (shouldReconnect) {
					scheduleReconnect();
				}
			};

			ws = websocket;
		} catch (error) {
			isConnecting = false;
			console.error('Failed to create WebSocket:', error);
			status = 'disconnected';
			// Only reconnect if we haven't been explicitly disconnected
			if (shouldReconnect) {
				scheduleReconnect();
			}
		}
	}

	function scheduleReconnect() {
		if (reconnectTimeout) return;
		if (!shouldReconnect) return; // Don't reconnect if explicitly disconnected
		
		// Stop reconnecting after max attempts
		if (reconnectAttempts >= maxReconnectAttempts) {
			console.warn(`[CampaignLive] Max reconnect attempts (${maxReconnectAttempts}) reached. Stopping reconnection.`);
			shouldReconnect = false;
			status = 'disconnected';
			return;
		}

		// Fixed delays: 5 seconds for first retry, 10 seconds for second retry
		const delays = [5000, 10000];
		const delay = delays[reconnectAttempts] || 10000;
		
		reconnectAttempts++;
		status = 'reconnecting';

		console.warn(`[CampaignLive] Scheduling reconnect attempt ${reconnectAttempts} in ${delay/1000}s`);

		reconnectTimeout = setTimeout(() => {
			reconnectTimeout = null;
			if (shouldReconnect) {
				connect();
			}
		}, delay);
	}

	function disconnect() {
		shouldReconnect = false; // Prevent reconnection
		if (reconnectTimeout) {
			clearTimeout(reconnectTimeout);
			reconnectTimeout = null;
		}
		isConnecting = false;
		ws?.close();
		ws = null;
		status = 'disconnected';
		reconnectAttempts = 0;
		// Keep lastKnownVersion on disconnect for rejoin
	}

	function send(message: CampaignLiveClientMessage) {
		if (ws?.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify(message));
		} else {
			console.warn('WebSocket not connected, message not sent:', message);
		}
	}

	function onMessage(handler: (message: CampaignLiveWebSocketMessage) => void) {
		// Store the handler so we can attach it when WebSocket connects
		messageHandler = handler;

		// If WebSocket is already connected, attach handler immediately
		if (ws && ws.readyState === WebSocket.OPEN) {
			ws.onmessage = (event) => {
				try {
					const parsed = JSON.parse(event.data);
					// Type assertion is necessary here as JSON.parse returns 'any'
					// Runtime validation happens via the message handler's type checking
					const message = parsed as CampaignLiveWebSocketMessage;

					// Update last known version from versioned messages
					if ('version' in message && typeof message.version === 'number') {
						lastKnownVersion = message.version;
					}

					handler(message);
				} catch (error) {
					console.error('Failed to parse WebSocket message:', error);
				}
			};
		}
	}

	return {
		get status() {
			return status;
		},
		get connected() {
			return status === 'connected';
		},
		connect,
		disconnect,
		send,
		onMessage
	};
}

function campaignContext() {
	const userContext = getUserContext();

	// State - campaign ID is now internal and settable
	let campaignId = $state<string | undefined>(undefined);
	let campaign = $state<Campaign | null>(null);
	let members = $state<CampaignMember[]>([]);
	let campaignState = $state<CampaignState | null>(null);
	let characters = $state<Record<string, CampaignCharacterSummary>>({});
	let vaultItems = $state<Array<{ id: string; homebrew_type: HomebrewType; homebrew_id: string }>>(
		[]
	);
	let loading = $state(true);
	let wsConnection = $state<ReturnType<typeof createCampaignLiveConnection> | null>(null);
	let initialSyncComplete = $state(false);
	let syncTimeout: ReturnType<typeof setTimeout> | null = null;
	let currentCampaignIdForSync = $state<string | undefined>(undefined);

	// Auto-save state tracking for campaign (name/description)
	let initialLoadComplete = $state(false);
	let lastSavedCampaign = $state<string | null>(null);
	let inFlightSave: Promise<void> | null = null;
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	// Auto-save state tracking for campaignState (fear_track, countdowns, notes, etc.)
	let lastSavedCampaignState = $state<string | null>(null);
	let campaignStateDebounceTimer: ReturnType<typeof setTimeout> | null = null;
	let campaignStateInFlightSave: Promise<void> | null = null;

	// Auto-save state tracking for user membership (display_name)
	let userMembership = $state<CampaignMember | null>(null);
	let lastSavedUserMembership = $state<string | null>(null);
	let userMembershipDebounceTimer: ReturnType<typeof setTimeout> | null = null;
	let userMembershipInFlightSave: Promise<void> | null = null;

	// Load all campaign data
	async function load() {
		const id = campaignId;
		if (!id) return;

		// Only show loading spinner during initial load, not during refreshes
		// If initialSyncComplete is false, we're still in initial load phase
		const isInitialLoad = !initialSyncComplete;
		if (isInitialLoad) {
			loading = true;
		}
		try {
			const [fetchedCamp, mems, state, chars, vault] = await Promise.all([
				get_campaign(id),
				get_campaign_members(id),
				get_campaign_state(id),
				get_campaign_characters(id),
				get_campaign_homebrew_vault(id)
			]);
			// Don't overwrite if there's an in-flight save - wait for it to complete
			if (inFlightSave) {
				await inFlightSave;
			}
			if (campaignStateInFlightSave) {
				await campaignStateInFlightSave;
			}

			// Prevent overwriting with stale server data after a recent save
			// If our local state matches what we last saved, but server data is different,
			// the server cache is stale - keep our local state
			let camp = fetchedCamp;
			if (campaign && lastSavedCampaign) {
				const currentJson = JSON.stringify({
					name: campaign.name,
					description: campaign.description
				});
				const fetchedJson = JSON.stringify({
					name: fetchedCamp.name,
					description: fetchedCamp.description
				});
				// If local state matches what we saved, but server data is different, server is stale
				if (currentJson === lastSavedCampaign && fetchedJson !== lastSavedCampaign) {
					// Use fetched data for other fields, but keep campaign name/description from local state
					camp = { ...fetchedCamp, name: campaign.name, description: campaign.description };
				}
			}

			campaign = camp;
			members = mems.map((m) => ({ ...m, role: m.role as 'gm' | 'player' }));
			campaignState = state;
			characters = chars;
			vaultItems = vault;
			// Initialize lastSavedCampaignState to track changes from this point
			lastSavedCampaignState = JSON.stringify(state);
			// Initialize userMembership from members array
			const currentUserId = userContext.user?.clerk_id;
			if (currentUserId) {
				const currentUserMember = mems.find((m) => m.user_id === currentUserId);
				if (currentUserMember) {
					userMembership = {
						...currentUserMember,
						role: currentUserMember.role as 'gm' | 'player'
					};
					lastSavedUserMembership = JSON.stringify({
						display_name: currentUserMember.display_name
					});
				}
			}
			// Mark initial sync complete immediately after D1 data is assigned
			// This ensures the loading getter returns false right away
			initialSyncComplete = true;
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to load campaign');
		} finally {
			if (isInitialLoad) {
				loading = false;
			}
		}
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

	// Reset invite code (GM only - permission check is in the remote function)
	async function resetInviteCode(): Promise<void> {
		const id = campaignId;
		if (!id) return;

		await reset_invite_code({ campaign_id: id });
		// Query refresh is handled by the remote command - state will update automatically
	}

	// Assign character to campaign (or remove from campaign if campaignId is null)
	async function assignCharacter(
		characterId: string,
		targetCampaignId: string | null,
		options?: { claimable?: boolean }
	): Promise<void> {
		if (!characterId) return;

		try {
			await assign_character_to_campaign({
				character_id: characterId,
				campaign_id: targetCampaignId,
				claimable: options?.claimable
			});
			// Query refresh is handled by the remote command - state will update automatically
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
			// Query refresh is handled by the remote command - state will update automatically
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to claim character');
		}
	}

	// Unassign a character (make it claimable)
	async function unassignCharacter(characterId: string): Promise<void> {
		const id = campaignId;
		if (!id || !characterId) return;

		try {
			await unassign_character({
				character_id: characterId,
				campaign_id: id
			});
			// Query refresh is handled by the remote command - state will update automatically
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to unassign character');
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

	// Join campaign
	async function joinCampaign(options?: {
		display_name?: string;
		character_id?: string;
	}): Promise<void> {
		const id = campaignId;
		if (!id) return;

		await join_campaign({
			campaign_id: id,
			display_name: options?.display_name,
			character_id: options?.character_id
		});

		// Refresh user's campaign list
		get_user_campaigns().refresh();

		// Navigate to the campaign page
		await goto(`/campaigns/${id}`);
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
			// Query refresh is handled by the remote command - state will update automatically
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
			// Query refresh is handled by the remote command - state will update automatically
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to remove item from vault');
		}
	}

	// Check if user can claim a character
	// Calculated locally using available state - server-side enforcement happens in claim_character command
	function canClaimCharacter(characterId: string): boolean {
		const id = campaignId;
		if (!id || !characterId) return false;

		// Get the character from campaign state
		const character = characters[characterId];
		if (!character) return false;

		// Character must be claimable
		if (!character.claimable) return false;

		// User must be a member of the campaign
		if (!userMembership) return false;

		// User must be a player (not GM)
		if (userMembership.role === 'gm') return false;

		// Player must not already have a non-claimable character in this campaign
		const currentUserId = userContext.user?.clerk_id;
		if (!currentUserId) return false;

		const hasExistingCharacter = Object.values(characters).some(
			(char) => char.owner_user_id === currentUserId && !char.claimable
		);

		if (hasExistingCharacter) return false;

		// Check character limit
		const characterCount = userContext.all_characters?.length ?? 0;
		if (characterCount >= UI_CHARACTER_LIMIT) return false;

		return true;
	}

	// Auto-load when campaign ID changes
	$effect(() => {
		const id = campaignId;
		// Only reset sync state when campaign ID actually changes
		if (id !== currentCampaignIdForSync) {
			initialSyncComplete = false;
			currentCampaignIdForSync = id;
			// Clear any existing sync timeout
			if (syncTimeout) {
				clearTimeout(syncTimeout);
				syncTimeout = null;
			}
		}
		if (id) {
			load().then(() => {
				// initialSyncComplete is now set immediately after D1 data assignment in load()
				// WebSocket enhances with real-time updates but doesn't block rendering

				// After initial load, connect WebSocket for real-time updates
				if (typeof window !== 'undefined') {
					// Only create new connection if we don't have one or it's disconnected
					// Check if existing connection is still valid (connected or connecting)
					if (
						wsConnection &&
						(wsConnection.connected ||
							wsConnection.status === 'connecting' ||
							wsConnection.status === 'reconnecting')
					) {
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
								// Initial state sync or rejoin sync - now receives CampaignCharacterSummary objects directly
								if (message.state) {
									// Preserve read-only fields from D1 if received values are invalid (D1 is source of truth)
									const preservedInviteCode = 
										message.state.invite_code && message.state.invite_code.trim() !== ''
											? message.state.invite_code
											: campaignState?.invite_code || message.state.invite_code;
									const preservedCampaignId = 
										message.state.campaign_id && message.state.campaign_id === id
											? message.state.campaign_id
											: id || campaignState?.campaign_id || message.state.campaign_id;
									campaignState = {
										...message.state,
										invite_code: preservedInviteCode,
										campaign_id: preservedCampaignId
									};
									// Update lastSavedCampaignState to prevent auto-save from triggering
									lastSavedCampaignState = JSON.stringify(campaignState);
								}
								// Characters are now CampaignCharacterSummary objects directly
								if (message.characters) {
									const claimableMap = message.characterClaimable ?? {};
									const merged: Record<string, CampaignCharacterSummary> = { ...characters };
									for (const [id, charSummary] of Object.entries(message.characters)) {
										const claimable = claimableMap[id] ?? false;
										merged[id] = {
											...charSummary,
											claimable
										};
									}
									characters = merged;
								}
								initialSyncComplete = true;
								// Clear timeout since sync completed successfully
								if (syncTimeout) {
									clearTimeout(syncTimeout);
									syncTimeout = null;
								}
								break;
							case 'already_synced':
								// Client is already in sync, no action needed
								initialSyncComplete = true;
								// Clear timeout since sync completed successfully
								if (syncTimeout) {
									clearTimeout(syncTimeout);
									syncTimeout = null;
								}
								break;
							case 'state_update':
								if (message.state) {
									// Preserve read-only fields from D1 if received values are invalid (D1 is source of truth)
									const preservedInviteCode = 
										message.state.invite_code && message.state.invite_code.trim() !== ''
											? message.state.invite_code
											: campaignState?.invite_code || message.state.invite_code;
									const preservedCampaignId = 
										message.state.campaign_id && message.state.campaign_id === id
											? message.state.campaign_id
											: id || campaignState?.campaign_id || message.state.campaign_id;
									campaignState = {
										...message.state,
										invite_code: preservedInviteCode,
										campaign_id: preservedCampaignId
									};
									// Update lastSavedCampaignState to prevent auto-save from triggering
									lastSavedCampaignState = JSON.stringify(campaignState);
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
										// Update claimable if provided
										if (message.claimable !== undefined) {
											mergedChar.claimable = message.claimable;
										}
										characters = {
											...characters,
											[message.characterId]: mergedChar
										};
									}
								}
								break;
							case 'character_added':
								// Add new character to state - now receives CampaignCharacterSummary directly
								if (message.character) {
									characters = {
										...characters,
										[message.character.id]: {
											...message.character,
											claimable: message.claimable ?? false
										}
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
							case 'character_diff_update':
								// Merge diff into existing character
								if (message.characterId && message.updates) {
									const mergedChar = mergeCharacterLiveUpdate(
										characters[message.characterId],
										message.updates
									);
									if (mergedChar) {
										// Update claimable if provided
										if (message.claimable !== undefined) {
											mergedChar.claimable = message.claimable;
										}
										characters = {
											...characters,
											[message.characterId]: mergedChar
										};
									}
								}
								break;
							case 'member_updated':
								// Update member display name and refresh character owner_name
								if (message.userId) {
									// Update members list
									members = members.map((m) =>
										m.user_id === message.userId ? { ...m, display_name: message.displayName } : m
									);
									// Update userMembership if this is the current user
									const currentUserId = userContext.user?.clerk_id;
									if (currentUserId && message.userId === currentUserId && userMembership) {
										userMembership = { ...userMembership, display_name: message.displayName };
										// Update lastSavedUserMembership to prevent auto-save from triggering
										lastSavedUserMembership = JSON.stringify({ display_name: message.displayName });
									}
									// Update owner_name in characters owned by this user
									const updatedChars = { ...characters };
									for (const [charId, char] of Object.entries(updatedChars)) {
										if (char.owner_user_id === message.userId) {
											updatedChars[charId] = {
												...char,
												owner_name: message.displayName ?? undefined
											};
										}
									}
									characters = updatedChars;
								}
								break;
							case 'refresh_required':
								// Client is behind server version - reload from D1
								load();
								break;
							case 'error':
								console.error('WebSocket error:', message.message);
								// If we get an error and haven't synced yet, mark as complete to prevent infinite loading
								// This handles cases where the Durable Object is unreachable
								if (!initialSyncComplete) {
									console.warn('WebSocket error before sync - marking as complete');
									initialSyncComplete = true;
									if (syncTimeout) {
										clearTimeout(syncTimeout);
										syncTimeout = null;
									}
								}
								break;
						}
					});

					// Connect
					wsConnection.connect();

					// Set a timeout to mark sync as complete if WebSocket doesn't connect/sync within 15 seconds
					// This prevents the page from loading forever if the Durable Object is unreachable
					// Only set timeout if sync isn't already complete and we don't already have a timeout
					if (!initialSyncComplete && !syncTimeout) {
						syncTimeout = setTimeout(() => {
							if (!initialSyncComplete) {
								console.warn(
									'WebSocket sync timeout - marking as complete to prevent infinite loading'
								);
								initialSyncComplete = true;
							}
							syncTimeout = null;
						}, 2000);
					}
				} else {
					// Not in browser environment (SSR), mark sync as complete
					initialSyncComplete = true;
				}
			});
		} else {
			// Disconnect WebSocket if no campaign ID
			if (wsConnection) {
				wsConnection.disconnect();
				wsConnection = null;
			}
			// Clear sync timeout
			if (syncTimeout) {
				clearTimeout(syncTimeout);
				syncTimeout = null;
			}
			// Reset tracking when campaign ID is cleared
			currentCampaignIdForSync = undefined;
		}

		// Cleanup on unmount or when campaign ID changes
		// Only disconnect if campaign ID is actually changing or becoming undefined
		return () => {
			const currentId = campaignId;
			// Only disconnect if campaign ID changed or is now undefined
			// This prevents disconnecting when the effect re-runs for other reasons
			if (currentId !== id && wsConnection) {
				wsConnection.disconnect();
				wsConnection = null;
			}
			if (syncTimeout) {
				clearTimeout(syncTimeout);
				syncTimeout = null;
			}
		};
	});

	// Track when campaign is first loaded
	$effect(() => {
		if (campaign && !initialLoadComplete) {
			initialLoadComplete = true;
			lastSavedCampaign = JSON.stringify({
				name: campaign.name,
				description: campaign.description
			});
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
					lastSavedCampaign = JSON.stringify({
						name: campaign.name,
						description: campaign.description
					});
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

	// Debounced auto-save effect for campaignState (fear_track, countdowns, notes, etc.)
	$effect(() => {
		if (!campaignState || lastSavedCampaignState === null) return;

		const currentJson = JSON.stringify(campaignState);
		// Only save if the state actually changed from the last saved state
		if (currentJson === lastSavedCampaignState) return;

		// Clear any existing debounce timer
		if (campaignStateDebounceTimer) {
			clearTimeout(campaignStateDebounceTimer);
			campaignStateDebounceTimer = null;
		}

		// Debounce: wait 300ms before triggering save
		campaignStateDebounceTimer = setTimeout(() => {
			campaignStateDebounceTimer = null;
			if (!campaignState) return; // Guard against null state

			// Don't start a new save if one is already in flight
			if (campaignStateInFlightSave) {
				return;
			}

			const id = campaignId;
			if (!id) return;

			// Always save to D1 first (source of truth), then broadcast via WebSocket
			const savePromise = update_campaign_state({
				campaign_id: id,
				fear_track: campaignState.fear_track,
				countdowns: campaignState.countdowns,
				notes: campaignState.notes,
				fear_visible_to_players: campaignState.fear_visible_to_players
			})
				.then(() => {
					if (!campaignState) return;
					// Update lastSaved after successful D1 save
					lastSavedCampaignState = JSON.stringify(campaignState);

					// Then send via WebSocket for live broadcast to other clients
					// Use the send() method which handles connection checking internally
					if (wsConnection) {
						wsConnection.send({
							type: 'update_state',
							updates: {
								fear_track: campaignState.fear_track,
								countdowns: campaignState.countdowns,
								notes: campaignState.notes,
								fear_visible_to_players: campaignState.fear_visible_to_players,
								updated_at: Date.now()
							}
						});
					}
				})
				.catch((err) => {
					console.error('Failed to auto-save campaign state:', err);
				})
				.finally(() => {
					if (campaignStateInFlightSave === savePromise) {
						campaignStateInFlightSave = null;
					}
				});

			campaignStateInFlightSave = savePromise;
		}, 300);

		return () => {
			if (campaignStateDebounceTimer) {
				clearTimeout(campaignStateDebounceTimer);
				campaignStateDebounceTimer = null;
			}
		};
	});

	// Debounced auto-save effect for userMembership (display_name)
	$effect(() => {
		if (!userMembership || lastSavedUserMembership === null) return;

		const currentJson = JSON.stringify({ display_name: userMembership.display_name });
		// Only save if the membership actually changed from the last saved state
		if (currentJson === lastSavedUserMembership) return;

		// Clear any existing debounce timer
		if (userMembershipDebounceTimer) {
			clearTimeout(userMembershipDebounceTimer);
			userMembershipDebounceTimer = null;
		}

		// Debounce: wait 300ms before triggering save
		userMembershipDebounceTimer = setTimeout(() => {
			userMembershipDebounceTimer = null;
			if (!userMembership) return; // Guard against null membership

			// Don't start a new save if one is already in flight
			if (userMembershipInFlightSave) {
				return;
			}

			const id = campaignId;
			if (!id) return;

			const savePromise = update_campaign_member({
				campaign_id: id,
				display_name: userMembership.display_name ?? undefined
			})
				.then(() => {
					if (!userMembership) return;
					// Only update lastSavedUserMembership after successful save
					lastSavedUserMembership = JSON.stringify({ display_name: userMembership.display_name });
					// Also update the members array to keep it in sync
					const currentUserId = userContext.user?.clerk_id;
					if (currentUserId) {
						members = members.map((m) =>
							m.user_id === currentUserId ? { ...m, display_name: userMembership!.display_name } : m
						);
					}
				})
				.catch((err) => {
					console.error('Failed to auto-save user membership:', err);
					// Leave lastSavedUserMembership unchanged so the next debounced change will retry
				})
				.finally(() => {
					if (userMembershipInFlightSave === savePromise) {
						userMembershipInFlightSave = null;
					}
				});

			userMembershipInFlightSave = savePromise;
		}, 300);

		return () => {
			if (userMembershipDebounceTimer) {
				clearTimeout(userMembershipDebounceTimer);
				userMembershipDebounceTimer = null;
			}
		};
	});

	return {
		get campaignId() {
			return campaignId;
		},
		set campaignId(value: string | undefined) {
			campaignId = value;
		},
		get campaign() {
			return campaign;
		},
		get members() {
			return members;
		},
		get userMembership() {
			return userMembership;
		},
		set userMembership(value: CampaignMember | null) {
			userMembership = value;
		},
		get campaignState() {
			return campaignState;
		},
		set campaignState(value: CampaignState | null) {
			campaignState = value;
		},
		get characters() {
			return characters;
		},
		get vaultItems() {
			return vaultItems;
		},
		get loading() {
			return loading || !initialSyncComplete;
		},
		load,
		deleteCampaign,
		resetInviteCode,
		assignCharacter,
		claimCharacter,
		unassignCharacter,
		leaveCampaign,
		joinCampaign,
		addToVault,
		removeFromVault,
		canClaimCharacter
	};
}

const CAMPAIGN_CONTEXT_KEY = Symbol('CampaignContext');

export const setCampaignContext = () => {
	const newCampaignContext = campaignContext();
	return setContext(CAMPAIGN_CONTEXT_KEY, newCampaignContext);
};

export const getCampaignContext = (): ReturnType<typeof setCampaignContext> => {
	return getContext(CAMPAIGN_CONTEXT_KEY);
};
