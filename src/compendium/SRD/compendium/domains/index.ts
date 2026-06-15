import type { Domain } from '../../../../convex/schemas/compendium';
export const DOMAINS = {
	arcana: {
		source_key: 'SRD',
		title: 'Arcana',
		description_html: '',
		color: '#4e345b',
		foreground_color: '#ffffff',
		image_url: '/images/svgs/domains/arcana.svg',
		artist_name: ''
	},
	blade: {
		source_key: 'SRD',
		title: 'Blade',
		foreground_color: '#ffffff',
		description_html: `Blade is the domain of **weapon mastery**. Whether by steel, bow, or perhaps a more specialized arm, those who follow this path have the skill to cut short the lives of others. Wielders of Blade dedicate themselves to achieving inexorable power over death. The Blade domain can be accessed by the **Guardian** and **Warrior** classes.`,
		color: '#af231c',
		image_url: '/images/svgs/domains/blade.svg',
		artist_name: ''
	},
	bone: {
		source_key: 'SRD',
		title: 'Bone',
		color: '#a4a9a8',
		foreground_color: '#000000',
		description_html: `Bone is the domain of **tactics and the body**. Practitioners of this domain have an uncanny control over their own physical abilities and an eye for predicting the behaviors of others in combat. Adherents to Bone gain an unparalleled understanding of bodies and their movements. The Bone domain can be accessed by the **Ranger** & **Warrior** classes.`,
		image_url: '/images/svgs/domains/bone.svg',
		artist_name: ''
	},
	codex: {
		source_key: 'SRD',
		title: 'Codex',
		description_html: '',
		color: '#24395d',
		foreground_color: '#ffffff',
		image_url: '/images/svgs/domains/codex.svg',
		artist_name: ''
	},
	grace: {
		source_key: 'SRD',
		title: 'Grace',
		description_html: '',
		color: '#8d3965',
		foreground_color: '#ffffff',
		image_url: '/images/svgs/domains/grace.svg',
		artist_name: ''
	},
	midnight: {
		source_key: 'SRD',
		title: 'Midnight',
		description_html: `Midnight is the domain of **shadows and secrecy**. Whether by clever tricks, deft magic, or the cloak of night, those who channel these forces practice the art of obscurity and can uncover sequestered treasures. Midnight offers practitioners the power to control and create enigmas. The Midnight domain can be accessed by the **Rogue** and **Sorcerer** classes.`,
		color: '#1e201f',
		foreground_color: '#ffffff',
		image_url: '/images/svgs/domains/midnight.svg',
		artist_name: ''
	},
	sage: {
		source_key: 'SRD',
		title: 'Sage',
		description_html: '',
		color: '#244e30',
		foreground_color: '#ffffff',
		image_url: '/images/svgs/domains/sage.svg',
		artist_name: ''
	},
	splendor: {
		source_key: 'SRD',
		title: 'Splendor',
		description_html: '',
		color: '#b8a342',
		foreground_color: '#000000',
		image_url: '/images/svgs/domains/splendor.svg',
		artist_name: ''
	},
	valor: {
		source_key: 'SRD',
		title: 'Valor',
		description_html: `Valor is the domain of **protection**. Whether through attack or defense, those who choose this discipline channel formidable strength to protect their allies in battle. Valor offers great power to those who raise their shields in defense of others. The Valor domain can be accessed by the **Guardian** and **Seraph** classes.`,
		color: '#e2680e',
		foreground_color: '#ffffff',
		image_url: '/images/svgs/domains/valor.svg',
		artist_name: ''
	}
} as const satisfies Record<string, Domain>;
