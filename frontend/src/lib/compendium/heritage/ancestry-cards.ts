import type { AncestryCard } from '$lib/types/compendium-types';

export const ANCESTRY_CARDS = {
	half_clank: {
		id: 'half_clank',
		source_id: 'Homebrew',
		card_type: 'ancestry',
		image_url: '/images/card/art/ancestries/clank.webp',
		title: 'Half-Clank',
		description_html: 'Half sentient mechanical being, half human.',
		artist_name: 'Mat Wilma',
		features: [
			{
				weapon_modifiers: [],
				title: 'High Stamina',
				description_html: 'Gain an additional Stress slot at character creation.',
				character_modifiers: [
					{
						behaviour: 'bonus',
						target: 'max_stress',
						type: 'flat',
						value: 1,
						character_conditions: []
					}
				]
			},
			{
				title: 'Efficient',
				description_html:
					'When you take a short rest, you can choose a long rest move instead of a short rest move.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	drakona: {
		id: 'drakona',
		source_id: 'SRD',
		card_type: 'ancestry',
		image_url: '/images/card/art/ancestries/drakona.webp',
		title: 'Drakona',
		description_html:
			'Drakona resemble wingless dragons in humanoid form and possess a powerful elemental breath.',
		artist_name: 'Mat Wilma',
		features: [
			{
				title: 'Scales',
				description_html:
					'Your scales act as natural protection. When you would take Severe damage, you can <b>mark a Stress</b> to mark 1 fewer Hit Points.',
				character_modifiers: [],
				weapon_modifiers: []
			},
			{
				title: 'Elemental Breath',
				description_html:
					'Choose an element for your breath (such as electricity, fire, or ice). You can use this breath against a target or group of targets within Very Close range, treating it as an Instinct weapon that deals <b>d8</b> magic damage using your Proficiency.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	}
} as const satisfies Record<string, AncestryCard>;
