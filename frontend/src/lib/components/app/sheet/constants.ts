import type { Domain } from "./types";


export const DOMAINS = {
    arcana: {
        name: "Arcana",
        color: "#4e345b",
        cards: []
    } as Domain,
    blade: {
        name: "Blade",
        color: "#af231c",
        cards: []
    } as Domain,
    bone: {
        name: "Bone",
        color: "#a4a9a8",
        cards: []
    } as Domain,
    codex: {
        name: "Codex",
        color: "#24395d",
        cards: []
    } as Domain,
    grace: {
        name: "Grace",
        color: "#8d3965",
        cards: []
    } as Domain,
    midnight: {
        name: "Midnight",
        color: "#1e201f",
        cards: []
    } as Domain,
    sage: {
        name: "Sage",
        color: "#244e30",
        cards: []
    } as Domain,
    splendor: {
        name: "Splendor",
        color: "#b8a342",
        cards: []
    } as Domain,
    valor: {
        name: "Valor",
        color: "#e2680e",
        cards: []
    } as Domain
} as const

export const TRAITS = {
    agility: {
        name: "Agility",
        examples: ["Sprint", "Leap", "Maneuver"]
    },
    strength: {
        name: "Strength",
        examples: ["Lift", "Smash", "Grapple"]
    },
    finesse: {
        name: "Finesse",
        examples: ["Control", "Hide", "Tinker"]
    },
    instinct: {
        name: "Instinct",
        examples: ["Perceive", "Sense", "Navigate"]
    },
    presence: {
        name: "Presence",
        examples: ["Charm", "Perform", "Deceive"]
    },
    knowledge: {
        name: "Knowledge",
        examples: ["Recall", "Analyze", "Comprehend"]
    }
} as const