import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	// Character data is loaded in layout
	const { character } = await parent();
	return {
		character
	};
};

