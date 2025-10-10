import type { Load } from '@sveltejs/kit';

export const load: Load = (event) => {
    const { uid } = event.params;
    return { uid };
};