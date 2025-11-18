import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const userId = locals.auth?.().userId;
	if (!userId) {
		throw redirect(302, `/sign-in?redirectUrl=${encodeURIComponent(url.pathname)}`);
	}
	return {};
};

