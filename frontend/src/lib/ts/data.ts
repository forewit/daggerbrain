// src/lib/data.ts
import type { Character } from "./types"

const CHARACTERS_KEY_PREFIX = "daggerbrain:character:"
const CHARACTERS_INDEX_KEY = "daggerbrain:characters_index"

// --- helpers ---
function safeParse<T>(raw: string | null, fallback: T): T {
    if (!raw) return fallback
    try {
        return JSON.parse(raw) as T
    } catch {
        return fallback
    }
}

// --- characters ---
export function loadCharacters(fallback: Character[]): Character[] {
    const indexRaw = localStorage.getItem(CHARACTERS_INDEX_KEY)
    if (indexRaw === null) {
        // No characters saved yet, save the fallback and return it
        saveCharacters(fallback)
        return fallback
    }

    const characterUids = safeParse<string[]>(indexRaw, [])
    const characters: Character[] = []
    
    for (const uid of characterUids) {
        const characterRaw = localStorage.getItem(`${CHARACTERS_KEY_PREFIX}${uid}`)
        if (characterRaw) {
            const character = safeParse<Character | null>(characterRaw, null)
            if (character) {
                characters.push(character)
            }
        }
    }

    return characters
}

export function saveCharacters(state: Character[]): void {
    // First, get the current index to see what characters we had before
    const currentIndexRaw = localStorage.getItem(CHARACTERS_INDEX_KEY)
    const currentIndex = safeParse<string[]>(currentIndexRaw, [])
    
    // Save each character individually
    const newIndex: string[] = []
    for (const character of state) {
        try {
            localStorage.setItem(`${CHARACTERS_KEY_PREFIX}${character.uid}`, JSON.stringify(character))
            newIndex.push(character.uid)
        } catch (error) {
            console.warn(`Failed to save character ${character.uid}:`, error)
            // Continue with other characters even if one fails
        }
    }
    
    // Update the index
    localStorage.setItem(CHARACTERS_INDEX_KEY, JSON.stringify(newIndex))
    
    // Clean up any characters that are no longer in the state
    for (const oldUid of currentIndex) {
        if (!newIndex.includes(oldUid)) {
            localStorage.removeItem(`${CHARACTERS_KEY_PREFIX}${oldUid}`)
        }
    }
}