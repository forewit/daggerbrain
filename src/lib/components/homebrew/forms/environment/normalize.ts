import { EnvironmentSchema, type Environment } from '@convex/schemas/compendium';
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

export function environmentToFormData(item: Environment): Environment {
	return cloneFormValue(item);
}

export function environmentFormDataToItem(formData: Environment): Environment {
	return {
		...formData,
		source_key: 'Homebrew',
		title: formData.title.trim(),
		artist_name: formData.artist_name.trim(),
		description: stripRawHtml(formData.description),
		impulses: formData.impulses.trim(),
		potential_adversaries: formData.potential_adversaries.trim(),
		potential_adversaries_ids: [...formData.potential_adversaries_ids],
		features: formData.features.map((feature) => ({
			...feature,
			name: feature.name.trim(),
			description_html: stripRawHtml(feature.description_html),
			questions: feature.questions.trim()
		}))
	};
}

export function normalizeEnvironment(item: Environment): Environment {
	return EnvironmentSchema.parse(environmentFormDataToItem(item));
}
