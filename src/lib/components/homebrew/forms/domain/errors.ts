import type { HomebrewErrorSummary } from '../helpers';

export function summarizeDomainFormErrors(summary: HomebrewErrorSummary): string[] {
	const labels: Record<string, string> = {
		title: 'Name',
		description_html: 'Description',
		color: 'Color',
		foreground_color: 'Foreground color',
		image_url: 'Image',
		artist_name: 'Artist'
	};
	return summary.fieldErrors.map(
		(error) => `${labels[String(error.path[0])] ?? 'Domain'}: ${error.message}`
	);
}
