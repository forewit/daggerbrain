// src/lib/data.ts
import type { Character } from "./types"

const CHARACTERS_KEY = "daggerbrain:characters"

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
    const raw = localStorage.getItem(CHARACTERS_KEY)
    if (raw === null) {
        saveCharacters(fallback)
        return fallback
    }
    
    const characters = safeParse<Character[]>(raw, fallback)
    
    // Migrate old data: ensure deck.urls and description exists
    const migratedCharacters = characters.map(char => {
        if (!char.deck) {
            char.deck = { urls: [] }
        } else if (!char.deck.urls) {
            // @ts-ignore - Handle old deck format
            char.deck.urls = char.deck.Ancestry || []
        }
        if (!char.description) {
            char.description = ""
        }
        return char
    })
    
    // Save migrated data
    if (migratedCharacters !== characters) {
        saveCharacters(migratedCharacters)
    }
    
    return migratedCharacters
}

export function saveCharacters(state: Character[]): void {
    localStorage.setItem(CHARACTERS_KEY, JSON.stringify(state))
}