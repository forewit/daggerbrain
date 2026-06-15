import { ConsumableSchema, type Consumable } from '@convex/schemas/compendium';
import DOMPurify from 'dompurify';

function stripRawHtml(value: string): string {
	return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [], KEEP_CONTENT: true });
}

export function consumableToFormData(item: Consumable): Consumable {
	return { ...item };
}

export function consumableFormDataToItem(formData: Consumable): Consumable {
	return {
		...formData,
		source_key: 'Homebrew',
		title: formData.title.trim(),
		description_html: stripRawHtml(formData.description_html)
	};
}

export function normalizeConsumable(item: Consumable): Consumable {
	return ConsumableSchema.parse(consumableFormDataToItem(item));
}
