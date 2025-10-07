import type { Character, Deck, } from './types';
import { getContext, setContext } from 'svelte';
import { loadCharacters, saveCharacters } from './data';




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
      characters.push({ uid, name: "New Character", image: "", deck: { Ancestry: [], Community: [], Subclass: [], Domain: [] } })
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