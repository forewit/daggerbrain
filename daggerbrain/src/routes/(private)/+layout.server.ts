import { page } from '$app/state';
import { PUBLIC_SIGN_IN_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	const { userId } = locals.auth();

	if (!userId) {
		return redirect(307, PUBLIC_SIGN_IN_URL + `?redirect_url=${encodeURIComponent(url.href)}`);
	}

	return {
		userId
	};
};
