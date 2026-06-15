import { DomainCardSchema, type DomainCard } from '@convex/schemas/compendium';
import type { Feature } from '@convex/schemas/rules';
import DOMPurify from 'dompurify';

function cloneFormValue<T>(value: T): T {
	if (Array.isArray(value)) {
		return value.map(cloneFormValue) as T;
	}

	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([key, entry]) => [key, cloneFormValue(entry)])
		) as T;
	}

	return value;
}

export function domainCardToFormData(item: DomainCard): DomainCard {
	return cloneFormValue({
		...item,
		options: item.options ?? [],
		tokens_enabled: item.tokens_enabled ?? false,
		applies_in_vault: item.applies_in_vault ?? false,
		forced_in_loadout: item.forced_in_loadout ?? false,
		forced_in_vault: item.forced_in_vault ?? false
	});
}

function optionalTrimmedString(value: string | undefined): string | undefined {
	if (value === undefined) return undefined;
	const trimmed = value.trim();
	return trimmed === '' ? undefined : trimmed;
}

function toInteger(value: number): number {
	return Number.isFinite(value) ? Math.trunc(value) : value;
}

function stripRawHtml(value: string): string {
	return DOMPurify.sanitize(value, {
		ALLOWED_TAGS: [],
		ALLOWED_ATTR: [],
		KEEP_CONTENT: true
	});
}

function normalizeFeature(feature: Feature): Feature {
	return {
		...feature,
		title: feature.title.trim(),
		description_html: stripRawHtml(feature.description_html)
	} as Feature;
}

export function domainCardFormDataToItem(formData: DomainCard): DomainCard {
	return {
		...formData,
		source_key: 'Homebrew',
		title: formData.title.trim(),
		domain_id: optionalTrimmedString(formData.domain_id),
		artist_name: formData.artist_name.trim(),
		level_requirement: toInteger(formData.level_requirement),
		recall_cost: toInteger(formData.recall_cost),
		options: cloneFormValue(formData.options ?? []),
		features: formData.features.map(normalizeFeature),
		tokens_enabled: formData.tokens_enabled || undefined,
		applies_in_vault: formData.applies_in_vault || undefined,
		forced_in_loadout: formData.forced_in_loadout || undefined,
		forced_in_vault: formData.forced_in_vault || undefined
	};
}

export function normalizeDomainCard(item: DomainCard): DomainCard {
	return DomainCardSchema.parse(domainCardFormDataToItem(item));
}
