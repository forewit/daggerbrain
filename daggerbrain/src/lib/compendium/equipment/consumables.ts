import type { Consumable } from '$lib/types/compendium-types';

export const CONSUMABLES = {
	stride_potion: {
		compendium_id: 'stride_potion',
		source_id: 'SRD',
		rarity_roll: 1,
		title: 'Stride Potion',
		description_html: 'You gain a +1 bonus to your next Agility Roll'
	},
	bolster_potion: {
		compendium_id: 'bolster_potion',
		source_id: 'SRD',
		rarity_roll: 2,
		title: 'Bolster Potion',
		description_html: 'You gain a +1 bonus to your next Strength Roll'
	},
	control_potion: {
		compendium_id: 'control_potion',
		source_id: 'SRD',
		rarity_roll: 3,
		title: 'Control Potion',
		description_html: 'You gain a +1 bonus to your next Finesse Roll'
	},
	attune_potion: {
		compendium_id: 'attune_potion',
		source_id: 'SRD',
		rarity_roll: 4,
		title: 'Attune Potion',
		description_html: 'You gain a +1 bonus to your next Instinct Roll'
	},
	charm_potion: {
		compendium_id: 'charm_potion',
		source_id: 'SRD',
		rarity_roll: 5,
		title: 'Charm Potion',
		description_html: 'You gain a +1 bonus to your next Presence Roll'
	},
	enlighten_potion: {
		compendium_id: 'enlighten_potion',
		source_id: 'SRD',
		rarity_roll: 6,
		title: 'Enlighten Potion',
		description_html: 'You gain a +1 bonus to your next Knowledge Roll'
	},
	minor_health_potion: {
		compendium_id: 'minor_health_potion',
		source_id: 'SRD',
		rarity_roll: 7,
		title: 'Minor Health Potion',
		description_html: 'Clear 1d4 HP'
	},
	minor_stamina_potion: {
		compendium_id: 'minor_stamina_potion',
		source_id: 'SRD',
		rarity_roll: 8,
		title: 'Minor Stamina Potion',
		description_html: 'Clear 1d4 Stress'
	},
	morphing_clay: {
		compendium_id: 'morphing_clay',
		source_id: 'SRD',
		rarity_roll: 15,
		title: 'Morphing Clay',
		description_html:
			'<p>You can spend a Hope to use this clay, altering your face enough to make you unrecognizable until your next rest'
	},
	vial_of_darksmoke: {
		compendium_id: 'vial_of_darksmoke',
		source_id: 'SRD',
		rarity_roll: 16,
		title: 'Vial of Darksmoke',
		description_html:
			'<p>When an adversary attacks you, use this vial and roll a number of d6s equal to your Agility. Add the highest result to your Evasion against the attack'
	},
	jumping_root: {
		compendium_id: 'jumping_root',
		source_id: 'SRD',
		rarity_roll: 17,
		title: 'Jumping Root',
		description_html: 'Eat this root to leap up to Far range once without needing to roll'
	},
	snap_powder: {
		compendium_id: 'snap_powder',
		source_id: 'SRD',
		rarity_roll: 18,
		title: 'Snap Powder',
		description_html: 'Mark a Stress and clear a HP'
	},
	health_potion: {
		compendium_id: 'health_potion',
		source_id: 'SRD',
		rarity_roll: 19,
		title: 'Health Potion',
		description_html: 'Clear 1d4+1 HP'
	},
	stamina_potion: {
		compendium_id: 'stamina_potion',
		source_id: 'SRD',
		rarity_roll: 20,
		title: 'Stamina Potion',
		description_html: 'Clear 1d4+1 Stress'
	},
	armor_stitcher: {
		compendium_id: 'armor_stitcher',
		source_id: 'SRD',
		rarity_roll: 21,
		title: 'Armor Stitcher',
		description_html:
			'<p>You can use this stitcher to spend any number of Hope and clear that many Armor Slots'
	},
	gill_salve: {
		compendium_id: 'gill_salve',
		source_id: 'SRD',
		rarity_roll: 22,
		title: 'Gill Salve',
		description_html:
			'<p>You can apply this salve to your neck to breathe underwater for a number of minutes equal to your level'
	},
	replication_parchment: {
		compendium_id: 'replication_parchment',
		source_id: 'SRD',
		rarity_roll: 23,
		title: 'Replication Parchment',
		description_html:
			"<p>By touching this piece of parchment to another, you can perfectly copy the second parchment's contents. Once used, this parchment becomes mundane paper</p>"
	},
	improved_arcane_shard: {
		compendium_id: 'improved_arcane_shard',
		source_id: 'SRD',
		rarity_roll: 24,
		title: 'Improved Arcane Shard',
		description_html:
			'<p>You can make a Finesse Roll to throw this shard at a group of adversaries within Far range. Targets you succeed against take 2d20 magic damage'
	},
	major_stride_potion: {
		compendium_id: 'major_stride_potion',
		source_id: 'SRD',
		rarity_roll: 25,
		title: 'Major Stride Potion',
		description_html: 'You gain a +1 bonus to your Agility until your next rest'
	},
	major_bolster_potion: {
		compendium_id: 'major_bolster_potion',
		source_id: 'SRD',
		rarity_roll: 26,
		title: 'Major Bolster Potion',
		description_html: 'You gain a +1 bonus to your Strength until your next rest'
	},
	major_control_potion: {
		compendium_id: 'major_control_potion',
		source_id: 'SRD',
		rarity_roll: 27,
		title: 'Major Control Potion',
		description_html: 'You gain a +1 bonus to your Finesse until your next rest'
	},
	major_attune_potion: {
		compendium_id: 'major_attune_potion',
		source_id: 'SRD',
		rarity_roll: 28,
		title: 'Major Attune Potion',
		description_html: 'You gain a +1 bonus to your Instinct until your next rest'
	},
	major_charm_potion: {
		compendium_id: 'major_charm_potion',
		source_id: 'SRD',
		rarity_roll: 29,
		title: 'Major Charm Potion',
		description_html: 'You gain a +1 bonus to your Presence until your next rest'
	},
	major_enlighten_potion: {
		compendium_id: 'major_enlighten_potion',
		source_id: 'SRD',
		rarity_roll: 30,
		title: 'Major Enlighten Potion',
		description_html: 'You gain a +1 bonus to your Knowledge until your next rest'
	},
	blood_of_the_yorgi: {
		compendium_id: 'blood_of_the_yorgi',
		source_id: 'SRD',
		rarity_roll: 31,
		title: 'Blood of the Yorgi',
		description_html:
			'<p>You can drink this blood to disappear from where you are and immediately reappear at a point you can see within Very Far range'
	},
	homets_secret_potion: {
		compendium_id: 'homets_secret_potion',
		source_id: 'SRD',
		rarity_roll: 32,
		title: "Homet's Secret Potion",
		description_html:
			'<p>After drinking this potion, the next successful attack you make critically succeeds'
	},
	redthorn_saliva: {
		compendium_id: 'redthorn_saliva',
		source_id: 'SRD',
		rarity_roll: 33,
		title: 'Redthorn Saliva',
		description_html:
			'<p>You can apply this saliva to a weapon that deals physical damage to add a d12 to your next damage roll with that weapon'
	},
	channelstone: {
		compendium_id: 'channelstone',
		source_id: 'SRD',
		rarity_roll: 34,
		title: 'Channelstone',
		description_html:
			'<p>You can use this stone to take a spell or grimoire from your vault, use it once, and return it to your vault'
	},
	mythic_dust: {
		compendium_id: 'mythic_dust',
		source_id: 'SRD',
		rarity_roll: 35,
		title: 'Mythic Dust',
		description_html:
			'<p>You can apply this dust to a weapon that deals magic damage to add a d12 to your next damage roll with that weapon'
	},
	acidpaste: {
		compendium_id: 'acidpaste',
		source_id: 'SRD',
		rarity_roll: 36,
		title: 'Acidpaste',
		description_html: 'This paste eats away walls and other surfaces in bright flashes'
	},
	hopehold_flare: {
		compendium_id: 'hopehold_flare',
		source_id: 'SRD',
		rarity_roll: 37,
		title: 'Hopehold Flare',
		description_html:
			'<p>When you use this flare, allies within Close range roll a d6 when they spend a Hope. On a result of 6, they gain the effect of that Hope without spending it. The flare lasts until the end of the scene'
	},
	major_arcane_shard: {
		compendium_id: 'major_arcane_shard',
		source_id: 'SRD',
		rarity_roll: 38,
		title: 'Major Arcane Shard',
		description_html:
			'<p>You can make a Finesse Roll to throw this shard at a group of adversaries within Far range. Targets you succeed against take 4d20 magic damage'
	},
	featherbone: {
		compendium_id: 'featherbone',
		source_id: 'SRD',
		rarity_roll: 39,
		title: 'Featherbone',
		description_html:
			'<p>You can use this bone to control your falling speed for a number of minutes equal to your level'
	},
	circle_of_the_void: {
		compendium_id: 'circle_of_the_void',
		source_id: 'SRD',
		rarity_roll: 40,
		title: 'Circle of the Void',
		description_html:
			'<p>Mark a Stress to create a void that extends up to Far range. No magic can be cast inside the void, and creatures within the void are immune to magic damage'
	},
	sun_tree_sap: {
		compendium_id: 'sun_tree_sap',
		source_id: 'SRD',
		rarity_roll: 41,
		title: 'Sun Tree Sap',
		description_html:
			'<p>Consume this sap to roll a d6. On a result of 5–6, clear 2 HP. On a result of 2–4, clear 3 Stress. On a result of 1, see through the veil of death and return changed, gaining one scar'
	},
	dripfang_poison: {
		compendium_id: 'dripfang_poison',
		source_id: 'SRD',
		rarity_roll: 42,
		title: 'Dripfang Poison',
		description_html: 'A creature who consumes this poison takes 8d10 direct magic damage'
	},
	major_health_potion: {
		compendium_id: 'major_health_potion',
		source_id: 'SRD',
		rarity_roll: 43,
		title: 'Major Health Potion',
		description_html: 'Clear 1d4+2 HP'
	},
	major_stamina_potion: {
		compendium_id: 'major_stamina_potion',
		source_id: 'SRD',
		rarity_roll: 44,
		title: 'Major Stamina Potion',
		description_html: 'Clear 1d4+2 Stress'
	},
	ogre_musk: {
		compendium_id: 'ogre_musk',
		source_id: 'SRD',
		rarity_roll: 45,
		title: 'Ogre Musk',
		description_html:
			'<p>You can use this musk to prevent anyone from tracking you by mundane or magical means until your next rest'
	},
	wingsprout: {
		compendium_id: 'wingsprout',
		source_id: 'SRD',
		rarity_roll: 46,
		title: 'Wingsprout',
		description_html:
			'<p>You gain magic wings that allow you to fly for a number of minutes equal to your level'
	},
	jar_of_lost_voices: {
		compendium_id: 'jar_of_lost_voices',
		source_id: 'SRD',
		rarity_roll: 47,
		title: 'Jar of Lost Voices',
		description_html:
			'<p>You can open this jar to release a deafening echo of voices for a number of minutes equal to your Instinct. Creatures within Far range unprepared for the sound take 6d8 magic damage'
	},
	dragonbloom_tea: {
		compendium_id: 'dragonbloom_tea',
		source_id: 'SRD',
		rarity_roll: 48,
		title: 'Dragonbloom Tea',
		description_html:
			'<p>You can drink this tea to unleash a fiery breath attack. Make an Instinct Roll against all adversaries in front of you within Close range. Targets you succeed against take d20 physical damage using your Proficiency'
	},
	bridge_seed: {
		compendium_id: 'bridge_seed',
		source_id: 'SRD',
		rarity_roll: 49,
		title: 'Bridge Seed',
		description_html:
			'<p>Thick vines grow from your location to a point of your choice within Far range, allowing you to climb up or across them. The vines dissipate on your next short rest'
	},
	sleeping_sap: {
		compendium_id: 'sleeping_sap',
		source_id: 'SRD',
		rarity_roll: 50,
		title: 'Sleeping Sap',
		description_html:
			"<p>You can drink this potion to fall asleep for a full night's rest. You clear all Stress upon waking</p>"
	},
	feast_of_xuria: {
		compendium_id: 'feast_of_xuria',
		source_id: 'SRD',
		rarity_roll: 51,
		title: 'Feast of Xuria',
		description_html: 'You can eat this meal to clear all HP and Stress and gain 1d4 Hope'
	},
	bonding_honey: {
		compendium_id: 'bonding_honey',
		source_id: 'SRD',
		rarity_roll: 52,
		title: 'Bonding Honey',
		description_html: 'This honey can be used to glue two objects together permanently'
	},
	shrinking_potion: {
		compendium_id: 'shrinking_potion',
		source_id: 'SRD',
		rarity_roll: 53,
		title: 'Shrinking Potion',
		description_html:
			'<p>You can drink this potion to halve your size until you choose to drop this form or your next rest. While in this form, you have a +2 bonus to Agility and a −1 penalty to your Proficiency'
	},
	growing_potion: {
		compendium_id: 'growing_potion',
		source_id: 'SRD',
		rarity_roll: 54,
		title: 'Growing Potion',
		description_html:
			'<p>You can drink this potion to double your size until you choose to drop this form or your next rest. While in this form, you have a +2 bonus to Strength and a +1 bonus to your Proficiency'
	},
	knowledge_stone: {
		compendium_id: 'knowledge_stone',
		source_id: 'SRD',
		rarity_roll: 55,
		title: 'Knowledge Stone',
		description_html:
			'<p>If you die while holding this stone, an ally can take a card from your loadout to place in their loadout or vault. After they take this knowledge, the stone crumbles'
	},
	sweet_moss: {
		compendium_id: 'sweet_moss',
		source_id: 'SRD',
		rarity_roll: 56,
		title: 'Sweet Moss',
		description_html:
			'<p>You can consume this moss during a rest to clear 1d10 HP or 1d10 Stress'
	},
	blinding_orb: {
		compendium_id: 'blinding_orb',
		source_id: 'SRD',
		rarity_roll: 57,
		title: 'Blinding Orb',
		description_html:
			'<p>You can activate this orb to create a flash of bright light. All targets within Close range become Vulnerable until they mark HP'
	},
	death_tea: {
		compendium_id: 'death_tea',
		source_id: 'SRD',
		rarity_roll: 58,
		title: 'Death Tea',
		description_html:
			"<p>After you drink this tea, you instantly kill your target when you critically succeed on an attack. If you don't critically succeed on an attack before your next long rest, you die</p>"
	},
	mirror_of_marigold: {
		compendium_id: 'mirror_of_marigold',
		source_id: 'SRD',
		rarity_roll: 59,
		title: 'Mirror of Marigold',
		description_html:
			'<p>When you take damage, you can spend a Hope to negate that damage, after which the mirror shatters'
	},
	stardrop: {
		compendium_id: 'stardrop',
		source_id: 'SRD',
		rarity_roll: 60,
		title: 'Stardrop',
		description_html:
			'<p>You can use this stardrop to summon a hailstorm of comets that deals 8d20 physical damage to all targets within Very Far range'
	}
} as const satisfies Record<string, Consumable>;
