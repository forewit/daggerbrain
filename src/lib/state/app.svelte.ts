import { DEFAULT_CHARACTER } from '$lib/daggerbrain/library/characters/prebuilt_characters';
import type { Character } from '$lib/daggerbrain/types/characters';
import { getContext, setContext } from 'svelte';

function createApp() {
    let myCharacter: Character = $state(DEFAULT_CHARACTER)


    const fetchCharacter = async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        myCharacter = DEFAULT_CHARACTER;
    }

    const destroy = () => { }

    return {
        get myCharacter() { return myCharacter },
        set myCharacter(value) { myCharacter = value },
        fetchCharacter,
        destroy
    }
}

const APP_KEY = Symbol('App')

export const setAppContext = () => {
    const newApp = createApp();
    return setContext(APP_KEY, newApp)
}

export const getAppContext = (): ReturnType<typeof setAppContext> => {
    return getContext(APP_KEY)
}