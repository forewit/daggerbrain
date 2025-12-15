import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/public';


export const load: LayoutServerLoad = async ({ locals, url }) => {
	const { userId } = locals.auth();

	if (!userId) {
		throw redirect(307, env.PUBLIC_SIGN_IN_URL + '?redirect_url=' + url);
	}
};
