import type { HomebrewErrorPath, HomebrewErrorSummary } from '../helpers';

export function summarizeEnvironmentFormErrors(summary: HomebrewErrorSummary): string[] {
	return summary.fieldErrors.map((error) => `${formatPath(error.path)}: ${error.message}`);
}

function formatPath(path: HomebrewErrorPath): string {
	const [section, index] = path;
	if (section === 'features' && typeof index === 'number') return `Feature ${index + 1}`;
	if (section === 'title') return 'Name';
	if (section === 'difficulty') return 'Difficulty';
	return 'Environment';
}
