import { TransformationCardSchema, type TransformationCard } from '@convex/schemas/compendium';
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

export function transformationCardToFormData(item: TransformationCard): TransformationCard {
	return cloneFormValue({
		...item,
		options: item.options ?? [],
		tokens_enabled: item.tokens_enabled ?? false
	});
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

export function transformationCardFormDataToItem(formData: TransformationCard): TransformationCard {
	return {
		...formData,
		source_key: 'Homebrew',
		title: formData.title.trim(),
		description_html: stripRawHtml(formData.description_html),
		artist_name: formData.artist_name.trim(),
		features: formData.features.map(normalizeFeature),
		options: cloneFormValue(formData.options ?? []),
		tokens_enabled: formData.tokens_enabled || undefined
	};
}

export function normalizeTransformationCard(item: TransformationCard): TransformationCard {
	return TransformationCardSchema.parse(transformationCardFormDataToItem(item));
}
