import { PrimaryWeaponSchema, type PrimaryWeapon } from '@convex/schemas/compendium';
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
	return DOMPurify.sanitize(value, {
		ALLOWED_TAGS: [],
		ALLOWED_ATTR: [],
		KEEP_CONTENT: true
	});
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

export function primaryWeaponToFormData(item: PrimaryWeapon): PrimaryWeapon {
	return cloneFormValue(item);
}

export function primaryWeaponFormDataToItem(formData: PrimaryWeapon): PrimaryWeapon {
	return {
		...formData,
		source_key: 'Homebrew',
		title: formData.title.trim(),
		description_html: stripRawHtml(formData.description_html),
		level_requirement: toInteger(formData.level_requirement),
		features: formData.features.map(normalizeFeature),
		attack_roll_bonus: toInteger(formData.attack_roll_bonus),
		damage_bonus: toInteger(formData.damage_bonus),
		damage_dice: formData.damage_dice.trim(),
		available_traits: [...new Set(formData.available_traits)],
		available_damage_types: [...new Set(formData.available_damage_types)],
		burden: toInteger(formData.burden) as PrimaryWeapon['burden']
	};
}

export function normalizePrimaryWeapon(item: PrimaryWeapon): PrimaryWeapon {
	return PrimaryWeaponSchema.parse(primaryWeaponFormDataToItem(item));
}
