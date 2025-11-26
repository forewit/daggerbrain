import type { CommunityCard } from '$lib/types/compendium-types';

export const COMMUNITY_CARDS = {
	warborne: {
		id: 'warborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: '',
		image_url: '/images/wip.avif',
		title: 'Warborne',
		description_html:
			'Being part of a warborne community means you come from a place that is, or was, ravaged by war.',
		features: [
			{
				title: 'Brave Face',
				description_html:
					'Once per session, when an attack would cause you to <b>mark a stress</b>, you can <b>spend a hope</b> instead.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	}
} as const satisfies Record<string, CommunityCard>;
