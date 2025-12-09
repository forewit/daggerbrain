import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Check feature flag directly from auth
	const auth = locals.auth();
	const hasUnlimited = auth.has({ feature: 'unlimited_slots' });

	return {
		has_unlimited_slots: hasUnlimited
	};
};
