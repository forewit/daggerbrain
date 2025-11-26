import { getContext, setContext } from 'svelte';
import type {
	Armor,
	Card,
	Class,
	Consumable,
	Domain,
	Loot,
	Weapon
} from '../character/types';

export type ContentStore = {
	domains: Record<string, Domain>;
	classes: Record<string, Class>;
	ancestryCards: Record<string, Card<'ancestry'>>;
	communityCards: Record<string, Card<'community'>>;
	transformationCards: Record<string, Card<'transformation'>>;
	weapons: Record<string, Weapon>;
	armor: Record<string, Armor>;
	loot: Record<string, Loot>;
	consumables: Record<string, Consumable>;
};

const CONTENT_KEY = Symbol('Content');

export function setContentContext(content: ContentStore) {
	setContext(CONTENT_KEY, content);
}

export function getContentContext(): ContentStore {
	const content = getContext<ContentStore>(CONTENT_KEY);
	if (!content) {
		throw new Error('Content context not found. Make sure content is provided in layout.');
	}
	return content;
}

