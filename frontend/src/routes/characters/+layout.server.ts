import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const userId = locals.auth?.().userId;
	if (!userId) {
		throw redirect(302, `/sign-in?redirectUrl=${encodeURIComponent(url.pathname)}`);
	}
	return {};
};

