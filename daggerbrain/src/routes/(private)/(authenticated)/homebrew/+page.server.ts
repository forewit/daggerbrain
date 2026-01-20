import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Check feature flag directly from auth
	const auth = locals.auth();
	const hasHomebrew = auth.has({ feature: 'homebrew' });

	return {
		has_homebrew: hasHomebrew
	};
};
