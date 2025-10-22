import { getAppContext } from './app.svelte';
import type { Character, LevelUpOption } from './types';
import { getContext, setContext } from 'svelte';

function createCharacter(uid: string) {
    const app = getAppContext();
    let character: Character | null = $state(null);


    // load character from app context
    $effect(() => {
        character = app.characters.find((c) => c.uid === uid) || null;
    });

    // keep experiences array length in sync with max_experiences
    $effect(() => {
        if (!character) return;
        if (character.experiences.length < character.derieved_stats.max_experiences) {
            character.experiences.push({
                title: "",
                modifier: 2,
            });
        } else if (character.experiences.length > character.derieved_stats.max_experiences) {
            character.experiences.pop();
        }
    });

    // --- cleanup ---
    const destroy = () => { }

    return {
        get character() { return character },
        set character(value) { character = value },

        // helper functions
        destroy,
    }
}

const CHARACTER_KEY = Symbol('Character')

export const setCharacterContext = (uid: string) => {
    const newCharacter = createCharacter(uid);
    return setContext(CHARACTER_KEY, newCharacter)
}

export const getCharacterContext = (): ReturnType<typeof setCharacterContext> => {
    return getContext(CHARACTER_KEY)
}