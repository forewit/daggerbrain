import { LootSchema, type Loot } from '@convex/schemas/compendium';
import DOMPurify from 'dompurify';

function cloneFormValue<T>(value: T): T {
	if (Array.isArray(value)) return value.map(cloneFormValue) as T;
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([key, entry]) => [key, cloneFormValue(entry)])
		) as T;
	}
	return value;
}

function stripRawHtml(value: string): string {
	return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [], KEEP_CONTENT: true });
}

export function lootToFormData(item: Loot): Loot {
	return cloneFormValue(item);
}

export function lootFormDataToItem(formData: Loot): Loot {
	return {
		...formData,
		source_key: 'Homebrew',
		title: formData.title.trim(),
		description_html: stripRawHtml(formData.description_html),
		character_modifiers: cloneFormValue(formData.character_modifiers),
		weapon_modifiers: cloneFormValue(formData.weapon_modifiers)
	};
}

export function normalizeLoot(item: Loot): Loot {
	return LootSchema.parse(lootFormDataToItem(item));
}
