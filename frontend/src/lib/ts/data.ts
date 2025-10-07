// src/lib/data.ts
import type { State } from "./types"

const STATE_KEY = "daggerbrain:state"

// --- helpers ---
function safeParse<T>(raw: string | null, fallback: T): T {
    if (!raw) return fallback
    try {
        return JSON.parse(raw) as T
    } catch {
        return fallback
    }
}

// --- current state ---
export function loadState(fallback: State): State {
    const raw = localStorage.getItem(STATE_KEY)
    if (raw === null) saveState(fallback)
    return safeParse<State>(raw, fallback)
}

export function saveState(state: State): void {
    localStorage.setItem(STATE_KEY, JSON.stringify(state))
}