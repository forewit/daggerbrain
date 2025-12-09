import type { PageServerLoad } from './$types';
import { get_auth } from '$lib/remote/utils';

export const load: PageServerLoad = async ({ locals }) => {
	// Check feature flag directly from auth
	const auth = locals.auth();
	const hasUnlimited = auth.has({ feature: 'unlimited_slots' });

	return {
		has_unlimited_slots: hasUnlimited
	};
};

