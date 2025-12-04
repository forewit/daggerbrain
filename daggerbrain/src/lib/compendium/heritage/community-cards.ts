import type { CommunityCard } from '$lib/types/compendium-types';

export const COMMUNITY_CARDS = {
	warborne: {
		id: 'warborne',
		source_id: 'Void 1.5',
		card_type: 'community',
		artist_name: '',
		image_url: '/images/wip.avif',
		tokens: false,
		title: 'Warborne',
		description_html:
			'<p>Being part of a warborne community means you come from a place that is, or was, ravaged by war.</p>',
		features: [
			{
				title: 'Brave Face',
				description_html:
					'<span>Once per session, when an attack would cause you to <b>mark a stress</b>, you can <b>spend a hope</b> instead.</span>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	highborne: {
		id: 'highborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: 'Julia Metzger',
		image_url: '/api/images/card/art/communities/highborne.webp',
		tokens: false,
		title: 'Highborne',
		description_html:
			'<p>Being part of a highborne community means you\'re accustomed to a life of elegance, opulence, and prestige within the upper echelons of society.</p>',
		features: [
			{
				title: 'Privilege',
				description_html:
					'<span>You have advantage on rolls to consort with nobles, negotiate prices, or leverage your reputation to get what you want.</span>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	loreborne: {
		id: 'loreborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: '',
		image_url: '/api/images/card/art/communities/loreborne.webp',
		tokens: false,
		title: 'Loreborne',
		description_html:
			'<p>Being part of a loreborne community means you come from a place steeped in ancient knowledge, history, and powerful traditions.</p>',
		features: [
			{
				title: 'Ancient Knowledge',
				description_html:
					'<span>You have advantage on rolls related to history, ancient lore, or identifying magical or historical artifacts.</span>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	orderborne: {
		id: 'orderborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: 'Rafater',
		image_url: '/api/images/card/art/communities/orderborne.webp',
		tokens: false,
		title: 'Orderborne',
		description_html:
			'<p>Being part of an orderborne community means you\'re from a collective that focuses on discipline or faith, and you uphold a set of principles that reflect your experience there.</p>',
		features: [
			{
				title: 'Dedicated',
				description_html:
					'<span>Record three sayings or values your upbringing instilled in you. Once per rest, when you describe how you\'re embodying one of these principles through your current action, you can roll a <b>d20</b> as your Hope Die.</span>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	ridgeborne: {
		id: 'ridgeborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: 'Daarken',
		image_url: '/api/images/card/art/communities/ridgeborne.webp',
		tokens: false,
		title: 'Ridgeborne',
		description_html:
			'<p>Being part of a ridgeborne community means you\'ve called the rocky peaks and sharp cliffs of the mountainside home.</p>',
		features: [
			{
				title: 'Steady',
				description_html:
					'<span>You have advantage on rolls to traverse dangerous cliffs and ledges, navigate harsh environments, and use your survival knowledge.</span>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	seaborne: {
		id: 'seaborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: 'Sam Key',
		image_url: '/api/images/card/art/communities/seaborne.webp',
		tokens: true,
		title: 'Seaborne',
		description_html:
			'<p>Being part of a seaborne community means you lived on or near a large body of water.</p>',
		features: [
			{
				title: 'Know the Tide',
				description_html:
					'<span>You can sense the ebb and flow of life. When you roll with Fear, place a token on this card. You can hold a number of tokens equal to your level. Before you make an action roll, you can spend any number of these tokens to gain a +1 bonus to the roll for each token spent. At the end of each session, clear all unspent tokens.</span>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	slyborne: {
		id: 'slyborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: 'Paul Scott Canavan',
		image_url: '/api/images/card/art/communities/slyborne.webp',
		tokens: false,
		title: 'Slyborne',
		description_html:
			'<p>Being part of a slyborne community means you come from a group that operates outside the law, including all manner of criminals, grifters, and con artists.</p>',
		features: [
			{
				title: 'Scoundrel',
				description_html:
					'<span>You have advantage on rolls to negotiate with criminals, detect lies, or find a safe place to hide.</span>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	underborne: {
		id: 'underborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: 'Irina Nordsol',
		image_url: '/api/images/card/art/communities/underborne.webp',
		tokens: false,
		title: 'Underborne',
		description_html:
			'<p>Being part of an underborne community means you\'re from a subterranean society.</p>',
		features: [
			{
				title: 'Low-Light Living',
				description_html:
					'<span>When you\'re in an area with low light or heavy shadow, you have advantage on rolls to hide, investigate, or perceive details within that area.</span>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	wanderborne: {
		id: 'wanderborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: 'Paul Scott Canavan',
		image_url: '/api/images/card/art/communities/wanderborne.webp',
		tokens: false,
		title: 'Wanderborne',
		description_html:
			'<p>Being part of a wanderborne community means you\'ve lived as a nomad, forgoing a permanent home and experiencing a wide variety of cultures.</p>',
		features: [
			{
				title: 'Nomadic Pack',
				description_html:
					'<span>Add a Nomadic Pack to your inventory. Once per session, you can <b>spend a Hope</b> to reach into this pack and pull out a mundane item that\'s useful to your situation. Work with the GM to figure out what item you take out.</span>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	},
	wildborne: {
		id: 'wildborne',
		source_id: 'SRD',
		card_type: 'community',
		artist_name: 'Andreas Rocha',
		image_url: '/api/images/card/art/communities/wildborne.webp',
		tokens: false,
		title: 'Wildborne',
		description_html:
			'<p>Being part of a wildborne community means you lived deep within the forest.</p>',
		features: [
			{
				title: 'Lightfoot',
				description_html:
					'<span>Your movement is naturally silent. You have advantage on rolls to move without being heard.</span>',
				character_modifiers: [],
				weapon_modifiers: []
			}
		]
	}
} as const satisfies Record<string, CommunityCard>;
