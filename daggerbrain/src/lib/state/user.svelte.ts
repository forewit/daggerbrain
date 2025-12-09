import {
	get_all_characters,
	create_character,
	delete_character
} from '$lib/remote/characters.remote';
import { get_user_slots } from '$lib/remote/users.remote';
import type { Character } from '$lib/types/character-types';
import { getContext, setContext } from 'svelte';
import { error } from '@sveltejs/kit';

type UserSlots = {
	character_slot_1: string | null;
	character_slot_2: string | null;
	character_slot_3: string | null;
	dismissed_popups: string[]; // Array of dismissed popup IDs
};

function userContext() {
	let all_characters = $state<Character[]>([]);
	let loading = $state(true);
	let user_slots = $state<UserSlots | null>(null);

	const isPopupDismissed = (popupId: string): boolean => {
		if (!user_slots) return false;
		return user_slots.dismissed_popups.includes(popupId);
	};

	$effect(() => {
		loading = true;
		Promise.all([get_all_characters(), get_user_slots()])
			.then(([chars, slots]) => {
				all_characters = chars;
				user_slots = slots;
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

	const getActiveSlotIds = (): string[] => {
		if (!user_slots) return [];
		return [
			user_slots.character_slot_1,
			user_slots.character_slot_2,
			user_slots.character_slot_3
		].filter((slot): slot is string => slot !== null);
	};

	return {
		get all_characters() {
			return all_characters;
		},
		get loading() {
			return loading;
		},
		get user_slots() {
			return user_slots;
		},
		isPopupDismissed,
		getActiveSlotIds,
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
