import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const redirectUrl = url.searchParams.get('redirectUrl') ?? '/characters';
	if (locals.auth?.().userId) {
		throw redirect(302, redirectUrl);
	}
	return {
		redirectUrl
	};
};

