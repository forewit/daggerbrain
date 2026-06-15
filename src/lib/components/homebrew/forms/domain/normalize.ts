import { DomainSchema, type Domain } from '@convex/schemas/compendium';
import DOMPurify from 'dompurify';

function stripRawHtml(value: string): string {
	return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [], KEEP_CONTENT: true });
}

export function domainToFormData(item: Domain): Domain {
	return { ...item };
}

export function domainFormDataToItem(formData: Domain): Domain {
	return {
		...formData,
		source_key: 'Homebrew',
		title: formData.title.trim(),
		description_html: stripRawHtml(formData.description_html),
		color: formData.color.trim(),
		foreground_color: formData.foreground_color.trim(),
		artist_name: formData.artist_name.trim()
	};
}

export function normalizeDomain(item: Domain): Domain {
	return DomainSchema.parse(domainFormDataToItem(item));
}
