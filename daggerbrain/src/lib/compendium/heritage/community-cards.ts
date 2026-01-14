import type { CommunityCard } from '@shared/types/compendium.types';

export const COMMUNITY_CARDS = {
	warborne: {
		compendium_id: 'warborne',
		source_id: 'Void 1.5',
		card_type: 'community',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		tokens: false,
		title: 'Warborne',
		description_html:
			'Being part of a warborne community means you come from a place that is, or was, ravaged by war.',
		features: [
			{
				title: 'Brave Face',
				description_html:
					'Once per session, when an attack would cause you to **mark a stress**, you can **spend a hope** instead.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	highborne: {
		compendium_id: 'highborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		tokens: false,
		title: 'Highborne',
		description_html:
			"Being part of a highborne community means you're accustomed to a life of elegance, opulence, and prestige within the upper echelons of society.",
		features: [
			{
				title: 'Privilege',
				description_html:
					'You have advantage on rolls to consort with nobles, negotiate prices, or leverage your reputation to get what you want.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	loreborne: {
		compendium_id: 'loreborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		tokens: false,
		title: 'Loreborne',
		description_html:
			'Being part of a loreborne community means you come from a place steeped in ancient knowledge, history, and powerful traditions.',
		features: [
			{
				title: 'Ancient Knowledge',
				description_html:
					'You have advantage on rolls related to history, ancient lore, or identifying magical or historical artifacts.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	orderborne: {
		compendium_id: 'orderborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		tokens: false,
		title: 'Orderborne',
		description_html:
			"Being part of an orderborne community means you're from a collective that focuses on discipline or faith, and you uphold a set of principles that reflect your experience there.",
		features: [
			{
				title: 'Dedicated',
				description_html:
					"Record three sayings or values your upbringing instilled in you. Once per rest, when you describe how you're embodying one of these principles through your current action, you can roll a **d20** as your Hope Die.",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	ridgeborne: {
		compendium_id: 'ridgeborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		tokens: false,
		title: 'Ridgeborne',
		description_html:
			"Being part of a ridgeborne community means you've called the rocky peaks and sharp cliffs of the mountainside home.",
		features: [
			{
				title: 'Steady',
				description_html:
					'You have advantage on rolls to traverse dangerous cliffs and ledges, navigate harsh environments, and use your survival knowledge.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	seaborne: {
		compendium_id: 'seaborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		tokens: true,
		title: 'Seaborne',
		description_html:
			'Being part of a seaborne community means you lived on or near a large body of water.',
		features: [
			{
				title: 'Know the Tide',
				description_html:
					'You can sense the ebb and flow of life. When you roll with Fear, place a token on this card. You can hold a number of tokens equal to your level. Before you make an action roll, you can spend any number of these tokens to gain a +1 bonus to the roll for each token spent. At the end of each session, clear all unspent tokens.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	slyborne: {
		compendium_id: 'slyborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		tokens: false,
		title: 'Slyborne',
		description_html:
			'Being part of a slyborne community means you come from a group that operates outside the law, including all manner of criminals, grifters, and con artists.',
		features: [
			{
				title: 'Scoundrel',
				description_html:
					'You have advantage on rolls to negotiate with criminals, detect lies, or find a safe place to hide.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	underborne: {
		compendium_id: 'underborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		tokens: false,
		title: 'Underborne',
		description_html:
			"Being part of an underborne community means you're from a subterranean society.",
		features: [
			{
				title: 'Low-Light Living',
				description_html:
					"When you're in an area with low light or heavy shadow, you have advantage on rolls to hide, investigate, or perceive details within that area.",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	wanderborne: {
		compendium_id: 'wanderborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		tokens: false,
		title: 'Wanderborne',
		description_html:
			"Being part of a wanderborne community means you've lived as a nomad, forgoing a permanent home and experiencing a wide variety of cultures.",
		features: [
			{
				title: 'Nomadic Pack',
				description_html:
					"Add a Nomadic Pack to your inventory. Once per session, you can **spend a Hope** to reach into this pack and pull out a mundane item that's useful to your situation. Work with the GM to figure out what item you take out.",
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	wildborne: {
		compendium_id: 'wildborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		tokens: false,
		title: 'Wildborne',
		description_html: 'Being part of a wildborne community means you lived deep within the forest.',
		features: [
			{
				title: 'Lightfoot',
				description_html:
					'Your movement is naturally silent. You have advantage on rolls to move without being heard.',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	}
} as const satisfies Record<string, CommunityCard>;
