import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	return { uid: event.params.uid, type: event.params.type };
};
