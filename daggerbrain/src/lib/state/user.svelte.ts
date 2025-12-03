import {
	get_all_characters,
	create_character,
	delete_character
} from '$lib/remote/characters.remote';
import type { Character } from '$lib/types/character-types';
import { getContext, setContext } from 'svelte';
import { error } from '@sveltejs/kit';

function userContext() {
	let all_characters = $state<Character[]>([]);
	let loading = $state(true);

	$effect(() => {
		loading = true;
		get_all_characters()
			.then((chars) => {
				all_characters = chars;
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
