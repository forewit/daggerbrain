import type { TransformationCard } from '$lib/types/compendium-types';

export const TRANSFORMATION_CARDS = {
	werewolf: {
		compendium_id: 'werewolf',
		source_id: 'Void 1.5',
		card_type: 'transformation',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		title: 'Werewolf',
		description_html: 'Werewolves are creatures who transform into supernatural wolves.',
		features: [
			{
				title: 'Wolf Form',
				description_html:
					'When you mark one or more Hit Points, you can also **mark a stress** to enter your Wolf Form. While in this form, gain a **d10** Wolf Die that you add to all attack and damage rolls. When you would gain a Hope while in Wolf Form, you mark a Stress instead.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Frenzy',
				description_html:
					'When you mark your last Stress while in Wolf Form, you go into a Frenzy. Roll a number of **d20s** equal to your tier and automatically deal that much physical damage to all creatures within Very Close Range. Then drop out of Wolf Form.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	}
} as const satisfies Record<string, TransformationCard>;
