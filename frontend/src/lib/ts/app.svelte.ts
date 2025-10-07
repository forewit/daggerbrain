import { isDark } from '$lib/utils';
import type { State } from './types';
import { getContext, setContext } from 'svelte';
import { loadState, saveState } from './data';

const DEFAULT_STATE: State = {}

function createApp() {
  // --- ephemeral state ---

  // --- persistant state --- 
  let state: State = $state({})

  // --- derived state ---

  // --- helper functions ---


  // --- loading and saving handlers ---
  let initialLoad = $state(false)
  $effect(() => {
    if (initialLoad) return;
    state = loadState(DEFAULT_STATE)
    initialLoad = true;
  })
  $effect(() => {
    state
    if (!initialLoad) return
    saveState(state)
  })

  // --- cleanup ---
  const destroy = () => { }

  return {
    // read only

    // helper functions
    destroy,

    // read/write
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