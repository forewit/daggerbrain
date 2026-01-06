import {
	get_all_characters,
	create_character,
	delete_character
} from '$lib/remote/characters.remote';
import { get_user, update_user } from '$lib/remote/users.remote';
import { get_user_campaigns } from '$lib/remote/campaigns.remote';
import type { User } from '$lib/types/user-types';
import type { Character } from '$lib/types/character-types';
import type { CampaignWithDetails } from '$lib/types/campaign-types';
import { getContext, setContext } from 'svelte';
import { error } from '@sveltejs/kit';

function userContext() {
	let all_characters = $state<Character[]>([]);
	let all_campaigns = $state<CampaignWithDetails[]>([]);
	let loading = $state(true);
	let user = $state<User | null>(null);

	// Auto-save state tracking
	let initialLoadComplete = $state(false);
	let lastSavedUser = $state<string | null>(null);
	let inFlightSave: Promise<void> | null = null;
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	const isPopupDismissed = (popupId: string): boolean => {
		if (!user) return false;
		return user.dismissed_popups.includes(popupId);
	};

	// Initial data fetch
	$effect(() => {
		loading = true;
		Promise.all([get_all_characters(), get_user(), get_user_campaigns()])
			.then(([chars, fetchedUser, campaigns]) => {
				all_characters = chars;
				user = fetchedUser;
				all_campaigns = campaigns;
			})
			.catch((err) => {
				error(500, err.message);
			})
			.finally(() => {
				loading = false;
			});
	});

	// Track when user is first loaded
	$effect(() => {
		if (user && !initialLoadComplete) {
			initialLoadComplete = true;
			lastSavedUser = JSON.stringify(user);
		}
	});

	// Debounced auto-save effect for user preferences
	$effect(() => {
		if (!user || !initialLoadComplete) return;

		const currentUserJson = JSON.stringify(user);
		if (currentUserJson === lastSavedUser) return;

		// Clear any existing debounce timer
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}

		// Debounce: wait 300ms before triggering save
		debounceTimer = setTimeout(() => {
			debounceTimer = null;
			if (!user) return;

			// Don't start a new save if one is already in flight
			if (inFlightSave) {
				return;
			}

			// Only send the updatable preferences fields
			const updates = { dismissed_popups: user.dismissed_popups };
			const savePromise = update_user(updates)
				.then(() => {
					if (!user) return;
					lastSavedUser = JSON.stringify(user);
				})
				.catch((error) => {
					console.error('Failed to auto-save user:', error);
				})
				.finally(() => {
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

	const destroy = () => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}
	};

	const create_character_in_campaign = async (campaign_id?: string) => {
		return create_character(campaign_id ? { campaign_id } : undefined);
	};

	return {
		get all_characters() {
			return all_characters;
		},
		get all_campaigns() {
			return all_campaigns;
		},
		get loading() {
			return loading;
		},
		get user() {
			return user;
		},
		set user(value: User | null) {
			user = value;
		},
		isPopupDismissed,
		create_character: create_character_in_campaign,
		delete_character,
		destroy
	};
}

const USER_CONTEXT_KEY = Symbol('UserContext');

export const setUserContext = () => {
	const newUserContext = userContext();
	return setContext(USER_CONTEXT_KEY, newUserContext);
};

export const getUserContext = (): ReturnType<typeof setUserContext> => {
	return getContext(USER_CONTEXT_KEY) as ReturnType<typeof setUserContext>;
};
