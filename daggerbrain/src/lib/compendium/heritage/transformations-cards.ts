import type { TransformationCard } from '$lib/types/compendium-types';

export const TRANSFORMATION_CARDS = {
	werewolf: {
		id: 'werewolf',
		source_id: 'Void 1.5',
		card_type: 'transformation',
		artist_name: '',
		image_url: '/images/wip.avif',
		title: 'Werewolf',
		description_html: '<p>Werewolves are creatures who transform into supernatural wolves.</p>',
		features: [
			{
				title: 'Wolf Form',
				description_html:
					'<span>When you mark one or more Hit Points, you can also <b>mark a stress</b> to enter your Wolf Form. While in this form, gain a <b>d10</b> Wolf Die that you add to all attack and damage rolls. When you would gain a Hope while in Wolf Form, you mark a Stress instead.</span>',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Frenzy',
				description_html:
					'<span>When you mark your last Stress while in Wolf Form, you go into a Frenzy. Roll a number of <b>d20s</b> equal to your tier and automatically deal that much physical damage to all creatures within Very Close Range. Then drop out of Wolf Form.</span>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	}
} as const satisfies Record<string, TransformationCard>;
