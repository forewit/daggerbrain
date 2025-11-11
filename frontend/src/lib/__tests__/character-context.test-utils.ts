import type { Character } from '$lib/ts/types';
import { NEW_CHARACTER } from '$lib/ts/constants/constants';
import CharacterHarness from '$lib/__tests__/CharacterHarness.svelte';
import { setCharacterContext } from '$lib/ts/character.svelte';
import { mount, tick, unmount } from 'svelte';

export type MockAppContext = {
    characters: Character[];
};

/**
 * Creates a deep clone of the NEW_CHARACTER template so tests can mutate safely.
 */
export function createBlankCharacter(): Character {
    // Node >= 18 exposes structuredClone natively.
    return structuredClone(NEW_CHARACTER);
}

export type CharacterContextHandle = ReturnType<typeof setCharacterContext>;

export type SetupCharacterOptions = {
    /**
     * Provide a preconfigured character. If omitted a fresh clone of NEW_CHARACTER is used.
     */
    character?: Character;
    /**
     * Optional callback to mutate the character before it is stored in the mock app context.
     */
    prepare?: (character: Character) => void;
    /**
     * Controls which UID to bind. Defaults to the character's uid.
     */
    uid?: string;
};

export type SetupCharacterResult = {
    context: CharacterContextHandle;
    character: Character;
    destroy: () => void;
};

const activeDestroyers = new Set<() => void>();

/**
 * Initialise the Svelte runes-based character context in a test environment.
 *
 * This handles setting up a faux component context (via push/pop), wiring the
 * mock app context so the character can be located, and returning the
 * resulting context/character reference for assertions.
 */
export function setupCharacterContext(mockApp: MockAppContext, options: SetupCharacterOptions = {}): SetupCharacterResult {
    const character = options.character ? structuredClone(options.character) : createBlankCharacter();
    const uid = options.uid ?? character.uid ?? 'test-character';
    character.uid = uid;

    if (options.prepare) {
        options.prepare(character);
    }

    mockApp.characters = [character];

    let capturedContext: CharacterContextHandle | null = null;
    const target = document.createElement('div');
    document.body.appendChild(target);

    const harness = mount(CharacterHarness, {
        target,
        props: {
            uid,
            notify: (ctx: CharacterContextHandle) => {
                capturedContext = ctx;
            },
        },
    });

    if (!capturedContext) {
        throw new Error('Failed to capture character context from harness');
    }

    const destroy = () => {
        if (!activeDestroyers.has(destroy)) return;
        activeDestroyers.delete(destroy);
        void unmount(harness);
        target.remove();
    };

    activeDestroyers.add(destroy);

    return { context: capturedContext, character: capturedContext.character!, destroy };
}

/**
 * Await all pending Svelte microtasks so that `$effect` reactions have a
 * chance to run before assertions execute.
 */
export async function flushEffects(times = 1): Promise<void> {
    for (let i = 0; i < times; i++) {
        await tick();
    }
}

export function cleanupHarnesses(): void {
    for (const destroy of [...activeDestroyers]) {
        destroy();
    }
    activeDestroyers.clear();
}
