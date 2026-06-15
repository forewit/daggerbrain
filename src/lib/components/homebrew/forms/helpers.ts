export type HomebrewErrorPath = readonly (string | number)[];

export type HomebrewFieldError = {
	path: HomebrewErrorPath;
	message: string;
};

export type HomebrewErrorSummary = {
	fieldErrors: HomebrewFieldError[];
	messages: string[];
};

export function summarizeSuperformErrors(
	allErrors: readonly { path: string; messages: string[] }[]
): HomebrewErrorSummary {
	const fieldErrors: HomebrewFieldError[] = [];
	const messages: string[] = [];

	for (const error of allErrors) {
		const path = parseSuperformPath(error.path);
		for (const message of error.messages) {
			fieldErrors.push({ path, message });
			messages.push(error.path === '' ? message : `${error.path}: ${message}`);
		}
	}

	return { fieldErrors, messages };
}

function parseSuperformPath(path: string): HomebrewErrorPath {
	if (path === '') return [];
	return path
		.replace(/\[(\d+)\]/g, '.$1')
		.split('.')
		.filter(Boolean)
		.map((segment) => {
			const numeric = Number(segment);
			return Number.isInteger(numeric) && String(numeric) === segment ? numeric : segment;
		});
}

export function pathStartsWith(path: HomebrewErrorPath, prefix: HomebrewErrorPath): boolean {
	if (prefix.length > path.length) return false;
	return prefix.every((segment, index) => path[index] === segment);
}

export function homebrewErrorsAt(summary: HomebrewErrorSummary, path: HomebrewErrorPath): string[] {
	return summary.fieldErrors
		.filter((error) => error.path.length === path.length && pathStartsWith(error.path, path))
		.map((error) => error.message);
}

export function firstHomebrewErrorAt(
	summary: HomebrewErrorSummary,
	path: HomebrewErrorPath
): string | undefined {
	return homebrewErrorsAt(summary, path)[0];
}

export function homebrewHasErrorsBelow(
	summary: HomebrewErrorSummary,
	path: HomebrewErrorPath
): boolean {
	return summary.fieldErrors.some((error) => pathStartsWith(error.path, path));
}

export function homebrewMessagesBelow(
	summary: HomebrewErrorSummary,
	path: HomebrewErrorPath
): string[] {
	return summary.fieldErrors
		.filter((error) => pathStartsWith(error.path, path))
		.map((error) => error.message);
}
