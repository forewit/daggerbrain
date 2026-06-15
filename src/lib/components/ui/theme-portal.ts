import { getContext, setContext } from 'svelte';
import { readable, writable, type Readable, type Writable } from 'svelte/store';

const THEME_PORTAL_TARGET_KEY = Symbol('theme-portal-target');
const EMPTY_THEME_PORTAL_TARGET = readable<Element | null>(null);

export function createThemePortalTargetStore(): Writable<Element | null> {
	return writable<Element | null>(null);
}

export function setThemePortalTargetContext(target: Readable<Element | null>) {
	return setContext(THEME_PORTAL_TARGET_KEY, target);
}

export function getThemePortalTargetContext(): Readable<Element | null> {
	return getContext<Readable<Element | null>>(THEME_PORTAL_TARGET_KEY) ?? EMPTY_THEME_PORTAL_TARGET;
}
