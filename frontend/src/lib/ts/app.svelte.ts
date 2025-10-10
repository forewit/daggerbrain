import type { Character } from './types';
import { getContext, setContext } from 'svelte';
import { loadCharacters, saveCharacters } from './data';
import { MAX_HOPE, ANCESTRY_CARDS, COMMUNITY_CARDS, TRANSFORMATION_CARDS, CLASSES, DOMAINS } from './constants';

const NEW_CHARACTER: Character = {
  uid: "new-character",
  name: "New Character",
  image:
    "https://pub-cdae2c597d234591b04eed47a98f233c.r2.dev/v1/card-header-images/domains/blade/whirlwind.webp",
  level: 1,
  proficiency: 1,
  evasion: 10,
  damage_thresholds: {
    major: 6,
    severe: 13,
  },
  armor: {
    max: 3,
    marked: 0,
  },
  hp: {
    max: 6,
    marked: 0,
  },
  stress: {
    max: 7,
    marked: 0,
  },
  hope: {
    max: MAX_HOPE,
    marked: 0,
  },
  traits: {
    agility: 0,
    strength: 0,
    finesse: 0,
    instinct: 0,
    presence: 0,
    knowledge: 0,
  },
  heritage: {
    ancestry_card: null,
    community_card: null,
  },
  transformation_card: null,
  class: null,
  subclass: null,
  domain_card_loadout: [],
  domain_card_vault: [],
}

function createApp() {
  // --- ephemeral state ---
  let pwa = $state(false)

  // --- persistant state --- 
  let characters: Character[] = $state([])

  // --- derived state ---

  // --- helper functions ---
  function newCharacter(from?: string): string {
    const uid = crypto.randomUUID()
    if (from) {
      const character = characters.find((c) => c.uid === from)
      if (character) {
        characters.push({ ...character, uid })
      }
    } else {
      characters.push({...NEW_CHARACTER, uid})
    }
    return uid
  }



  function deleteCharacter(uid: string): void {
    characters = characters.filter((c) => c.uid !== uid)
  }

  // --- loading and saving handlers ---
  let initialLoad = $state(false)
  $effect(() => {
    if (initialLoad) return;
    characters = loadCharacters([])
    initialLoad = true;
  })
  $effect(() => {
    characters
    if (!initialLoad) return
    saveCharacters(characters)
  })


  // --- pwa ---
  $effect(() => {
    const displayModes = ["fullscreen", "standalone", "minimal-ui"];
    try {
      pwa = displayModes.some(
        (displayMode) => window.matchMedia(`(display-mode: ${displayMode})`).matches
      );
    } catch (e) {
      // In case matchMedia isn't supported or other errors, keep pwa=false
      pwa = false;
    }
  })

  // --- cleanup ---
  const destroy = () => { }

  return {
    // read only
    get pwa() { return pwa },
    get characters() { return characters },

    // helper functions
    destroy,
    newCharacter,
    deleteCharacter,
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