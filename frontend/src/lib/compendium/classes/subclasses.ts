import type { Subclass } from '$lib/types/compendium-types';

export const SUBCLASSES = {
	assassin_executioners_guild: {
		id: 'executioners_guild',
		source_id: 'Void 1.5',
		class_id: 'assassin',
		name: 'Executioners Guild',
		description_html:
			'<p>Skilled in the art of assassination, the Executioners Guild is known for their precision and efficiency.</p>',
		foundation_card: {
			id: 'executioners_guild_foundation',
			card_type: 'subclass_foundation',
			artist_name: '',
			image_url: '/images/wip.avif',
			title: 'Executioners Guild',
			description_html: 'Foundation',
			spellcast_trait: 'agility',
			class_id: 'assassin',
			features: [
				{
					title: 'First Strike',
					description_html:
						'<p>The first time in a scene you succeed on an attack roll, double the damage of the attack.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Ambush',
					description_html:
						'<p>Your "Marked for Death" feature uses <b>d6s</b> instead of <b>d4s</b>.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			id: 'executioners_guild_specialization',
			card_type: 'subclass_specialization',
			artist_name: '',
			image_url: '/images/wip.avif',
			title: 'Executioners Guild',
			description_html: 'Specialization',
			class_id: 'assassin',
			features: [
				{
					title: 'Death Strike',
					description_html:
						'<p>When you deal Severe damage to a creature, you can <b>mark a stress</b> to make them mark an additional Hit Point.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: "Scorpion's Poise",
					description_html:
						'<p>You gain a <b>+2</b> bonus to your Evasion against any attacks made by a creature <i>Marked for Death</i>.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			id: 'executioners_guild_mastery',
			card_type: 'subclass_mastery',
			artist_name: '',
			image_url: '/images/wip.avif',
			title: 'Executioners Guild',
			description_html: 'Mastery',
			class_id: 'assassin',
			features: [
				{
					title: 'True Strike',
					description_html:
						'<p>Once per long rest, when you fail an attack roll, you can <b>spend a hope</b> to make it a success instead.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Backstab',
					description_html:
						'<p>Your "Marked for Death" feature uses <b>d8s</b> instead of <b>d6s</b>.</p>',
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	},
	brawler_juggernaut: {
		id: 'juggernaut',
		source_id: 'Void 1.5',
		class_id: 'brawler',
		name: 'Juggernaut',
		description_html: '<p></p>',
		foundation_card: {
			id: 'juggernaut_foundation',
			card_type: 'subclass_foundation',
			artist_name: '',
			image_url: '/images/wip.avif',
			title: 'Juggernaut',
			description_html: 'Foundation',
			class_id: 'brawler',
			spellcast_trait: null,
			features: [
				{
					title: 'Powerhouse',
					description_html: `<p>Increase the <b>d8</b> damage dice for your unarmed attack to <b>d10s</b>. Additionally, you can mark a Stress to target two creatures within Melee range with a single attack roll.</p>`,
					character_modifiers: [],
					weapon_modifiers: [
						{
							behaviour: 'base',
							target_weapon: 'unarmed',
							character_conditions: [],
							target_stat: 'damage_dice',
							dice: '1d10'
						}
					]
				},
				{
					title: 'Overwhelm',
					description_html: `<p>On a successful attack, you can spend a Hope to force the target to mark a Stress or to throw them within Close range.</p>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		specialization_card: {
			id: 'juggernaut_specialization',
			card_type: 'subclass_specialization',
			artist_name: '',
			image_url: '/images/wip.avif',
			title: 'Juggernaut',
			description_html: 'Specialization',
			class_id: 'brawler',
			features: [
				{
					title: 'Rugged',
					description_html: `<p>Gain a permanent +3 bonus to your Severe damage threshold. Additionally, your "Powerhouse" feature can target up to three creatures instead of two.</p>`,
					character_modifiers: [
						{
							behaviour: 'bonus',
							type: 'flat',
							value: 3,
							target: 'severe_damage_threshold',
							character_conditions: []
						}
					],
					weapon_modifiers: []
				},
				{
					title: 'Eye for an Eye',
					description_html: `<p>When you mark more than one Hit Point from an attack in Melee range, the attacker must make a Reaction Roll (13). On a failure, once per rest, they immediately mark the same number of Hit Points in return.</p>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		},
		mastery_card: {
			id: 'juggernaut_mastery',
			card_type: 'subclass_mastery',
			artist_name: '',
			image_url: '/images/wip.avif',
			title: 'Juggernaut',
			description_html: 'Mastery',
			class_id: 'brawler',
			features: [
				{
					title: 'Pummeljoy',
					description_html: `<p>When you critically succeed on a weapon attack in Melee range, you gain an additional Hope, clear an additional Stress, and gain a +1 bonus to your Proficiency for the attack.</p>`,
					character_modifiers: [],
					weapon_modifiers: []
				},
				{
					title: 'Not Done Yet',
					description_html: `<p>When you mark more than one HP from an attack, you can gain a Hope or clear a Stress.</p>`,
					character_modifiers: [],
					weapon_modifiers: []
				}
			]
		}
	}
} as const satisfies Record<string, Subclass>;
