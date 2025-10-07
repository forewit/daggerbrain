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
    if (raw === null) saveCharacters(fallback)
    return safeParse<Character[]>(raw, fallback)
}

export function saveCharacters(state: Character[]): void {
    localStorage.setItem(CHARACTERS_KEY, JSON.stringify(state))
}