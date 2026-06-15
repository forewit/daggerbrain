import { buildClerkProps } from 'svelte-clerk/server';

export const load = async ({ locals }) => {
	const auth = locals.auth();

	return {
		...buildClerkProps(auth)
	};
};
