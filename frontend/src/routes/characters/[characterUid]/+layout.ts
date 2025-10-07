import type { Load } from '@sveltejs/kit';

export const load: Load = (event) => {
    const { characterUid } = event.params;
    return { characterUid };
};