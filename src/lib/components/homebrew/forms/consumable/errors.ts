import type { HomebrewErrorSummary } from '../helpers';

export function summarizeConsumableFormErrors(summary: HomebrewErrorSummary): string[] {
	return summary.fieldErrors.map(
		(error) => `${error.path[0] === 'title' ? 'Name' : 'Description'}: ${error.message}`
	);
}
