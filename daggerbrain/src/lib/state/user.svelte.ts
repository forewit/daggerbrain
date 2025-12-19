import {
	get_all_characters,
	create_character,
	delete_character
} from '$lib/remote/characters.remote';
import { get_user_preferences } from '$lib/remote/users.remote';
import type { Character } from '$lib/types/character-types';
import { getContext, setContext } from 'svelte';
import { error } from '@sveltejs/kit';

type UserPreferences = {
	dismissed_popups: string[];
};

function userContext() {
	let all_characters = $state<Character[]>([]);
	let loading = $state(true);
	let user_preferences = $state<UserPreferences | null>(null);

	const isPopupDismissed = (popupId: string): boolean => {
		if (!user_preferences) return false;
		return user_preferences.dismissed_popups.includes(popupId);
	};

	$effect(() => {
		loading = true;
		Promise.all([get_all_characters(), get_user_preferences()])
			.then(([chars, prefs]) => {
				all_characters = chars;
				user_preferences = prefs;
			})
			.catch((err) => {
				error(500, err.message);
			})
			.finally(() => {
				loading = false;
			});
	});

	const destroy = () => {
		// noop for now
	};

	return {
		get all_characters() {
			return all_characters;
		},
		get loading() {
			return loading;
		},
		get user_preferences() {
			return user_preferences;
		},
		isPopupDismissed,
		create_character,
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
	return getContext(USER_CONTEXT_KEY);
};
