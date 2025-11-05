import type { Character } from './character/types';
import { getContext, setContext } from 'svelte';
import { loadCharacters, saveCharacters } from './data';
import { JUST_JAMES, NEW_CHARACTER } from './constants/constants';

function createApp() {
  // --- ephemeral state ---
  let showFooter = $state(true);

  // --- persistant state --- 
  let characters: Character[] = $state([])

  // --- derived state ---

  // --- helper functions ---
  function newCharacter(from?: string): string {
    const uid = crypto.randomUUID()
    if (from) {
      const character = characters.find((c) => c.uid === from)
      if (character) {
        characters.push({ ...JSON.parse(JSON.stringify(character)), uid })
      }
    } else {
      characters.push({ ...JSON.parse(JSON.stringify(NEW_CHARACTER)), uid })
    }
    return uid
  }

  function newJustJames(from?: string): string {
    const uid = crypto.randomUUID()
    characters.push({ ...JSON.parse(JSON.stringify(JUST_JAMES)), uid })

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

  // --- cleanup ---
  const destroy = () => { }

  return {
    // read only
    get initialLoad() { return initialLoad },
    get characters() { return characters },

    // helper functions
    destroy,
    newCharacter,
    newJustJames,
    deleteCharacter,

    get showFooter() { return showFooter },
    set showFooter(value) { showFooter = value },
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