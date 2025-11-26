import type { DomainIds, Domain } from '$lib/types/compendium-types';

export const DOMAINS = {
	arcana: {
		id: 'arcana',
		source_id: 'Void 1.5',
		name: 'Arcana',
		description_html: '',
		color: '#4e345b',
		foreground_color: '#ffffff'
	},
	blade: {
		id: 'blade',
		source_id: 'Void 1.5',
		name: 'Blade',
		foreground_color: '#ffffff',
		description_html: `<p>Blade is the domain of <b>weapon mastery</b>. Whether by steel,
            bow, or perhaps a more specialized arm, those who follow this
            path have the skill to cut short the lives of others. Wielders of
            Blade dedicate themselves to achieving inexorable power over
            death. The Blade domain can be accessed by the <b>Guardian</b>
            and <b>Warrior</b> classes.</p>`,
		color: '#af231c'
	},
	bone: {
		id: 'bone',
		source_id: 'Void 1.5',
		name: 'Bone',
		color: '#a4a9a8',
		foreground_color: '#000000',
		description_html: `<p>Bone is the domain of <b>tactics and the body</b>. Practitioners
            of this domain have an uncanny control over their own
            physical abilities and an eye for predicting the behaviors of
            others in combat. Adherents to Bone gain an unparalleled
            understanding of bodies and their movements. The Bone
            domain can be accessed by the <b>Ranger</b> & <b>Warrior</b> classes.</p>`
	},
	codex: {
		id: 'codex',
		source_id: 'Void 1.5',
		name: 'Codex',
		description_html: '',
		color: '#24395d',
		foreground_color: '#ffffff'
	},
	grace: {
		id: 'grace',
		source_id: 'Void 1.5',
		name: 'Grace',
		description_html: '',
		color: '#8d3965',
		foreground_color: '#ffffff'
	},
	midnight: {
		id: 'midnight',
		source_id: 'Void 1.5',
		name: 'Midnight',
		description_html: `<p>Midnight is the domain of <b>shadows and secrecy</b>. Whether
            by clever tricks, deft magic, or the cloak of night, those who
            channel these forces practice the art of obscurity and can
            uncover sequestered treasures. Midnight offers practitioners
            the power to control and create enigmas. The Midnight
            domain can be accessed by the <b>Rogue</b> and <b>Sorcerer</b> classes.</p>`,
		color: '#1e201f',
		foreground_color: '#ffffff'
	},
	sage: {
		id: 'sage',
		source_id: 'Void 1.5',
		name: 'Sage',
		description_html: '',
		color: '#244e30',
		foreground_color: '#ffffff'
	},
	splendor: {
		id: 'splendor',
		source_id: 'Void 1.5',
		name: 'Splendor',
		description_html: '',
		color: '#b8a342',
		foreground_color: '#000000'
	},
	valor: {
		id: 'valor',
		source_id: 'Void 1.5',
		name: 'Valor',
		description_html: `<p>Valor is the domain of <b>protection</b>. Whether through attack or
            defense, those who choose this discipline channel formidable
            strength to protect their allies in battle. Valor offers great
            power to those who raise their shields in defense of others.
            The Valor domain can be accessed by the <b>Guardian</b> and
            <b>Seraph</b> classes.</p>`,
		color: '#e2680e',
		foreground_color: '#ffffff'
	}
} as const satisfies Record<DomainIds, Domain>;
