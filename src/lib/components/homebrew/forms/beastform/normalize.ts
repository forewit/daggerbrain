import { BeastformSchema, type Beastform } from '@convex/schemas/compendium';
import type { Feature } from '@convex/schemas/rules';
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

function normalizeFeature(feature: Feature): Feature {
	return {
		...feature,
		title: feature.title.trim(),
		description_html: stripRawHtml(feature.description_html)
	} as Feature;
}

export function beastformToFormData(item: Beastform): Beastform {
	return cloneFormValue(item);
}

export function beastformFormDataToItem(formData: Beastform): Beastform {
	return {
		...formData,
		source_key: 'Homebrew',
		title: formData.title.trim(),
		category: formData.category.trim(),
		attack: {
			...formData.attack,
			damage_dice: formData.attack.damage_dice.trim()
		},
		advantages: formData.advantages.map((advantage) => advantage.trim()).filter(Boolean),
		features: formData.features.map(normalizeFeature),
		special_case: formData.special_case || undefined
	};
}

export function normalizeBeastform(item: Beastform): Beastform {
	return BeastformSchema.parse(beastformFormDataToItem(item));
}
