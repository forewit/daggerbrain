import type { Character } from './character/types';
import { getContext, setContext } from 'svelte';
import { loadCharacters } from './data';
import {
	createCharacter as createCharacterCommand,
	createJustJames as createJustJamesCommand,
	deleteCharacter as deleteCharacterCommand,
	getCharacters
} from './characters.remote';

function createApp(initialCharacters: Character[] = []) {
	let showFooter = $state(true);
	let characters: Character[] = $state(structuredClone(initialCharacters));

	async function refreshCharacters() {
		try {
			const latest = await loadCharacters();
			characters = structuredClone(latest);
		} catch (error) {
			console.error('Failed to refresh characters', error);
		}
	}

	async function newCharacter(from?: string): Promise<string> {
		try {
			const response = await createCharacterCommand({ fromUid: from ?? null }).updates(
				getCharacters()
			);
			await refreshCharacters();
			return response.uid;
		} catch (error) {
			console.error('Failed to create character', error);
			throw error;
		}
	}

	async function newJustJames(): Promise<string> {
		try {
			const response = await createJustJamesCommand().updates(getCharacters());
			await refreshCharacters();
			return response.uid;
		} catch (error) {
			console.error('Failed to create Just-James', error);
			throw error;
		}
	}

	async function deleteCharacter(uid: string): Promise<void> {
		try {
			await deleteCharacterCommand({ uid }).updates(getCharacters());
			await refreshCharacters();
		} catch (error) {
			console.error('Failed to delete character', error);
			throw error;
		}
	}

	const destroy = () => {
		// noop for now
	};

	return {
		get characters() {
			return characters;
		},
		newCharacter,
		newJustJames,
		deleteCharacter,
		refreshCharacters,
		destroy,
		get showFooter() {
			return showFooter;
		},
		set showFooter(value: boolean) {
			showFooter = value;
		}
	};
}

const APP_KEY = Symbol('App');

export const setAppContext = (initialCharacters: Character[] = []) => {
	const newApp = createApp(initialCharacters);
	return setContext(APP_KEY, newApp);
};

export const getAppContext = (): ReturnType<typeof setAppContext> => {
	return getContext(APP_KEY);
};