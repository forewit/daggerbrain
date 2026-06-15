import { ArmorSchema, type Armor } from '@convex/schemas/compendium';
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

function toInteger(value: number): number {
	return Number.isFinite(value) ? Math.trunc(value) : value;
}

function normalizeFeature(feature: Feature): Feature {
	return {
		...feature,
		title: feature.title.trim(),
		description_html: stripRawHtml(feature.description_html)
	} as Feature;
}

export function armorToFormData(item: Armor): Armor {
	return cloneFormValue(item);
}

export function armorFormDataToItem(formData: Armor): Armor {
	return {
		...formData,
		source_key: 'Homebrew',
		title: formData.title.trim(),
		description_html: stripRawHtml(formData.description_html),
		level_requirement: toInteger(formData.level_requirement),
		max_armor: toInteger(formData.max_armor),
		damage_thresholds: {
			major: toInteger(formData.damage_thresholds.major),
			severe: toInteger(formData.damage_thresholds.severe)
		},
		features: formData.features.map(normalizeFeature)
	};
}

export function normalizeArmor(item: Armor): Armor {
	return ArmorSchema.parse(armorFormDataToItem(item));
}
