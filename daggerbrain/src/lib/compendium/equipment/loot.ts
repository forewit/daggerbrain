import type { Loot } from '@shared/types/compendium.types';

// todo: verify everything below
export const LOOT = {
	premium_bedroll: {
		compendium_id: 'premium_bedroll',
		source_id: 'SRD',
		rarity_roll: 1,
		title: 'Premium Bedroll',
		description_html: 'During downtime, you automatically clear a Stress.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	piper_whistle: {
		compendium_id: 'piper_whistle',
		source_id: 'SRD',
		rarity_roll: 2,
		title: 'Piper Whistle',
		description_html:
			'This handcrafted whistle has a distinctive sound. When you blow this whistle, its piercing tone can be heard within a 1-mile radius.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	charging_quiver: {
		compendium_id: 'charging_quiver',
		source_id: 'SRD',
		rarity_roll: 3,
		title: 'Charging Quiver',
		description_html:
			'When you succeed on an attack with an arrow stored in this quiver, gain a bonus to the damage roll equal to your current tier.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	alistairs_torch: {
		compendium_id: 'alistairs_torch',
		source_id: 'SRD',
		rarity_roll: 4,
		title: "Alistair's Torch",
		description_html:
			"You can light this magic torch at will. The flame's light fills a much larger space than it should, enough to illuminate a cave bright as day.",
		character_modifiers: [],
		weapon_modifiers: []
	},
	speaking_orbs: {
		compendium_id: 'speaking_orbs',
		source_id: 'SRD',
		rarity_roll: 5,
		title: 'Speaking Orbs',
		description_html:
			'This pair of orbs allows any creatures holding them to communicate with each other across any distance.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	manacles: {
		compendium_id: 'manacles',
		source_id: 'SRD',
		rarity_roll: 6,
		title: 'Manacles',
		description_html: 'This pair of locking cuffs comes with a key.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	arcane_cloak: {
		compendium_id: 'arcane_cloak',
		source_id: 'SRD',
		rarity_roll: 7,
		title: 'Arcane Cloak',
		description_html:
			'A creature with a Spellcast trait wearing this cloak can adjust its color, texture, and size at will.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	woven_net: {
		compendium_id: 'woven_net',
		source_id: 'SRD',
		rarity_roll: 8,
		title: 'Woven Net',
		description_html:
			'You can make a Finesse Roll using this net to trap a small creature. A trapped target can break free with a successful Attack Roll (16).',
		character_modifiers: [],
		weapon_modifiers: []
	},
	fire_jar: {
		compendium_id: 'fire_jar',
		source_id: 'SRD',
		rarity_roll: 9,
		title: 'Fire Jar',
		description_html:
			'You can pour out the strange liquid contents of this jar to instantly produce fire. The contents regenerate when you take a long rest.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	suspended_rod: {
		compendium_id: 'suspended_rod',
		source_id: 'SRD',
		rarity_roll: 10,
		title: 'Suspended Rod',
		description_html:
			"This flat rod is inscribed with runes. When you activate the rod, it is immediately suspended in place. Until the rod is deactivated, it can't move, doesn't abide by the rules of gravity, and remains in place.",
		character_modifiers: [],
		weapon_modifiers: []
	},
	glamour_stone: {
		compendium_id: 'glamour_stone',
		source_id: 'SRD',
		rarity_roll: 11,
		title: 'Glamour Stone',
		description_html:
			'Activate this pebble-sized stone to memorize the appearance of someone you can see. Spend a Hope to magically recreate this guise on yourself as an illusion.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	empty_chest: {
		compendium_id: 'empty_chest',
		source_id: 'SRD',
		rarity_roll: 12,
		title: 'Empty Chest',
		description_html:
			'This magical chest appears empty. When you speak a specific trigger word or action and open the chest, you can see the items stored within it.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	companion_case: {
		compendium_id: 'companion_case',
		source_id: 'SRD',
		rarity_roll: 13,
		title: 'Companion Case',
		description_html:
			'This case can fit a small animal companion. While the companion is inside, the animal and case are immune to all damage and harmful effects.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	piercing_arrows: {
		compendium_id: 'piercing_arrows',
		source_id: 'SRD',
		rarity_roll: 14,
		title: 'Piercing Arrows',
		description_html:
			'Three times per rest when you succeed on an attack with one of these arrows, you can add your Proficiency to the damage roll.',
		character_modifiers: [],
		weapon_modifiers: [] // Note: Proficiency-based damage bonus with "three times per rest" limitation requires manual tracking
	},
	valorstone: {
		compendium_id: 'valorstone',
		source_id: 'SRD',
		rarity_roll: 15,
		title: 'Valorstone',
		description_html:
			"You can attach this stone to armor that doesn't already have a feature. The armor gains the following feature.\n\n**Resilient:** Before you mark your last Armor Slot, roll a d6. On a result of 6, reduce the severity by one threshold without marking an Armor Slot.",
		character_modifiers: [],
		weapon_modifiers: []
	},
	skeleton_key: {
		compendium_id: 'skeleton_key',
		source_id: 'SRD',
		rarity_roll: 16,
		title: 'Skeleton Key',
		description_html:
			'When you use this key to open a locked door, you gain advantage on the Finesse Roll.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	arcane_prism: {
		compendium_id: 'arcane_prism',
		source_id: 'SRD',
		rarity_roll: 17,
		title: 'Arcane Prism',
		description_html:
			"Position this prism in a location of your choosing and activate it. All allies within Close range of it gain a +1 bonus to their Spellcast Rolls. While activated, the prism can't be moved. Once the prism is deactivated, it can't be activated again until your next long rest.",
		character_modifiers: [],
		weapon_modifiers: [] // Note: Area effect for allies requires manual application by GM
	},
	minor_stamina_potion_recipe: {
		compendium_id: 'minor_stamina_potion_recipe',
		source_id: 'SRD',
		rarity_roll: 18,
		title: 'Minor Stamina Potion Recipe',
		description_html:
			'As a downtime move, you can use the bone of a creature to craft a Minor Stamina Potion.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	minor_health_potion_recipe: {
		compendium_id: 'minor_health_potion_recipe',
		source_id: 'SRD',
		rarity_roll: 19,
		title: 'Minor Health Potion Recipe',
		description_html:
			'As a downtime move, you can use a vial of blood to craft a Minor Health Potion.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	homing_compasses: {
		compendium_id: 'homing_compasses',
		source_id: 'SRD',
		rarity_roll: 20,
		title: 'Homing Compasses',
		description_html:
			'These two compasses point toward each other no matter how far apart they are.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	corrector_sprite: {
		compendium_id: 'corrector_sprite',
		source_id: 'SRD',
		rarity_roll: 21,
		title: 'Corrector Sprite',
		description_html:
			'This tiny sprite sits in the curve of your ear canal and whispers helpful advice during combat. Once per short rest, you can gain advantage on an attack roll.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	gecko_gloves: {
		compendium_id: 'gecko_gloves',
		source_id: 'SRD',
		rarity_roll: 22,
		title: 'Gecko Gloves',
		description_html: 'You can climb up vertical surfaces and across ceilings.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	lorekeeper: {
		compendium_id: 'lorekeeper',
		source_id: 'SRD',
		rarity_roll: 23,
		title: 'Lorekeeper',
		description_html:
			'You can store the name and details of up to three hostile creatures inside this book. You gain a +1 bonus to action rolls against those creatures.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	vial_of_darksmoke_recipe: {
		compendium_id: 'vial_of_darksmoke_recipe',
		source_id: 'SRD',
		rarity_roll: 24,
		title: 'Vial of Darksmoke Recipe',
		description_html: 'As a downtime move, you can mark a Stress to craft a Vial of Darksmoke.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	bloodstone: {
		compendium_id: 'bloodstone',
		source_id: 'SRD',
		rarity_roll: 25,
		title: 'Bloodstone',
		description_html:
			"You can attach this stone to a weapon that doesn't already have a feature. The weapon gains the following feature.\n\n**Brutal:** When you roll the maximum value on a damage die, roll an additional damage die.",
		character_modifiers: [],
		weapon_modifiers: []
	},
	greatstone: {
		compendium_id: 'greatstone',
		source_id: 'SRD',
		rarity_roll: 26,
		title: 'Greatstone',
		description_html:
			"You can attach this stone to a weapon that doesn't already have a feature. The weapon gains the following feature.\n\n**Powerful:** On a successful attack, roll an additional damage die and discard the lowest result.",
		character_modifiers: [],
		weapon_modifiers: []
	},
	glider: {
		compendium_id: 'glider',
		source_id: 'SRD',
		rarity_roll: 27,
		title: 'Glider',
		description_html:
			'While falling, you can mark a Stress to deploy this small parachute and glide safely to the ground.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	ring_of_silence: {
		compendium_id: 'ring_of_silence',
		source_id: 'SRD',
		rarity_roll: 28,
		title: 'Ring of Silence',
		description_html:
			'Spend a Hope to activate this ring. Your footsteps are silent until your next rest.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	calming_pendant: {
		compendium_id: 'calming_pendant',
		source_id: 'SRD',
		rarity_roll: 29,
		title: 'Calming Pendant',
		description_html:
			"When you would mark your last Stress, roll a d6. On a result of 5 or higher, don't mark it.",
		character_modifiers: [],
		weapon_modifiers: []
	},
	dual_flask: {
		compendium_id: 'dual_flask',
		source_id: 'SRD',
		rarity_roll: 30,
		title: 'Dual Flask',
		description_html:
			"This flask can hold two different liquids. You can swap between them by flipping a small switch on the flask's side.",
		character_modifiers: [],
		weapon_modifiers: []
	},
	bag_of_ficklesand: {
		compendium_id: 'bag_of_ficklesand',
		source_id: 'SRD',
		rarity_roll: 31,
		title: 'Bag of Ficklesand',
		description_html:
			"You can convince this small bag of sand to be much heavier or lighter with a successful Presence Roll (10). Additionally, on a successful Finesse Roll (10), you can blow a bit of sand into a target's face to make them temporarily Vulnerable.",
		character_modifiers: [],
		weapon_modifiers: []
	},
	ring_of_resistance: {
		compendium_id: 'ring_of_resistance',
		source_id: 'SRD',
		rarity_roll: 32,
		title: 'Ring of Resistance',
		description_html:
			'Once per long rest, you can activate this ring after a successful attack against you to halve the damage.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	phoenix_feather: {
		compendium_id: 'phoenix_feather',
		source_id: 'SRD',
		rarity_roll: 33,
		title: 'Phoenix Feather',
		description_html:
			'If you have at least one Phoenix Feather on you when you fall unconscious, you gain a +1 bonus to the roll you make to determine whether you gain a scar.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	box_of_many_goods: {
		compendium_id: 'box_of_many_goods',
		source_id: 'SRD',
		rarity_roll: 34,
		title: 'Box of Many Goods',
		description_html:
			"Once per long rest, you can open this small box and roll a d12. On a result of 1–6, it's empty. On a result of 7–10, it contains one random common consumable. On a result of 11–12, it contains two random common consumables.",
		character_modifiers: [],
		weapon_modifiers: []
	},
	airblade_charm: {
		compendium_id: 'airblade_charm',
		source_id: 'SRD',
		rarity_roll: 35,
		title: 'Airblade Charm',
		description_html:
			'You can attach this charm to a weapon with a Melee range. Three times per rest, you can activate the charm and attack a target within Close range.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	portal_seed: {
		compendium_id: 'portal_seed',
		source_id: 'SRD',
		rarity_roll: 36,
		title: 'Portal Seed',
		description_html:
			'You can plant this seed in the ground to grow a portal in that spot. The portal is ready to use in 24 hours. You can use this portal to travel to any other location where you planted a portal seed. A portal can be destroyed by dealing any amount of magic damage to it.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	paragons_chain: {
		compendium_id: 'paragons_chain',
		source_id: 'SRD',
		rarity_roll: 37,
		title: "Paragon's Chain",
		description_html:
			'As a downtime move, you can meditate on an ideal or principle you hold dear and focus your will into this chain. Once per long rest, you can spend a Hope to roll a d20 as your Hope Die for rolls that directly align with that principle.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	elusive_amulet: {
		compendium_id: 'elusive_amulet',
		source_id: 'SRD',
		rarity_roll: 38,
		title: 'Elusive Amulet',
		description_html:
			'Once per long rest, you can activate this amulet to become Hidden until you move. While Hidden in this way, you remain unseen even if an adversary moves to where they would normally see you.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	hopekeeper_locket: {
		compendium_id: 'hopekeeper_locket',
		source_id: 'SRD',
		rarity_roll: 39,
		title: 'Hopekeeper Locket',
		description_html:
			'During a long rest, if you have 6 Hope, you can spend a Hope to imbue this locket with your bountiful resolve. When you have 0 Hope, you can use the locket to immediately gain a Hope. The locket must be re-imbued before it can be used this way again.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	infinite_bag: {
		compendium_id: 'infinite_bag',
		source_id: 'SRD',
		rarity_roll: 40,
		title: 'Infinite Bag',
		description_html:
			'When you store items in this bag, they are kept in a pocket dimension that never runs out of space. You can retrieve an item at any time.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	stride_relic: {
		compendium_id: 'stride_relic',
		source_id: 'SRD',
		rarity_roll: 41,
		title: 'Stride Relic',
		description_html: 'You gain a +1 bonus to your Agility. You can only carry one relic.',
		character_modifiers: [
			{
				behaviour: 'bonus',
				type: 'flat',
				value: 1,
				target: 'trait',
				trait: 'agility',
				character_conditions: []
			}
		],
		weapon_modifiers: []
	},
	bolster_relic: {
		compendium_id: 'bolster_relic',
		source_id: 'SRD',
		rarity_roll: 42,
		title: 'Bolster Relic',
		description_html: 'You gain a +1 bonus to your Strength. You can only carry one relic.',
		character_modifiers: [
			{
				behaviour: 'bonus',
				type: 'flat',
				value: 1,
				target: 'trait',
				trait: 'strength',
				character_conditions: []
			}
		],
		weapon_modifiers: []
	},
	control_relic: {
		compendium_id: 'control_relic',
		source_id: 'SRD',
		rarity_roll: 43,
		title: 'Control Relic',
		description_html: 'You gain a +1 bonus to your Finesse. You can only carry one relic.',
		character_modifiers: [
			{
				behaviour: 'bonus',
				type: 'flat',
				value: 1,
				target: 'trait',
				trait: 'finesse',
				character_conditions: []
			}
		],
		weapon_modifiers: []
	},
	attune_relic: {
		compendium_id: 'attune_relic',
		source_id: 'SRD',
		rarity_roll: 44,
		title: 'Attune Relic',
		description_html: 'You gain a +1 bonus to your Instinct. You can only carry one relic.',
		character_modifiers: [
			{
				behaviour: 'bonus',
				type: 'flat',
				value: 1,
				target: 'trait',
				trait: 'instinct',
				character_conditions: []
			}
		],
		weapon_modifiers: []
	},
	charm_relic: {
		compendium_id: 'charm_relic',
		source_id: 'SRD',
		rarity_roll: 45,
		title: 'Charm Relic',
		description_html: 'You gain a +1 bonus to your Presence. You can only carry one relic.',
		character_modifiers: [
			{
				behaviour: 'bonus',
				type: 'flat',
				value: 1,
				target: 'trait',
				trait: 'presence',
				character_conditions: []
			}
		],
		weapon_modifiers: []
	},
	enlighten_relic: {
		compendium_id: 'enlighten_relic',
		source_id: 'SRD',
		rarity_roll: 46,
		title: 'Enlighten Relic',
		description_html: 'You gain a +1 bonus to your Knowledge. You can only carry one relic.',
		character_modifiers: [
			{
				behaviour: 'bonus',
				type: 'flat',
				value: 1,
				target: 'trait',
				trait: 'knowledge',
				character_conditions: []
			}
		],
		weapon_modifiers: []
	},
	honing_relic: {
		compendium_id: 'honing_relic',
		source_id: 'SRD',
		rarity_roll: 47,
		title: 'Honing Relic',
		description_html:
			'You gain a +1 bonus to an Experience of your choice. You can only carry one relic.',
		character_modifiers: [], // Note: Experience bonus requires manual selection and tracking
		weapon_modifiers: []
	},
	flickerfly_pendant: {
		compendium_id: 'flickerfly_pendant',
		source_id: 'SRD',
		rarity_roll: 48,
		title: 'Flickerfly Pendant',
		description_html:
			'While you carry this pendant, your weapons with a Melee range that deal physical damage have a gossamer sheen and can attack targets within Very Close range.',
		character_modifiers: [],
		weapon_modifiers: [
			{
				behaviour: 'bonus',
				target_weapon: 'all',
				character_conditions: [],
				target_stat: 'range',
				range: 'Very Close'
			}
		]
	},
	lakestrider_boots: {
		compendium_id: 'lakestrider_boots',
		source_id: 'SRD',
		rarity_roll: 49,
		title: 'Lakestrider Boots',
		description_html: 'You can walk on the surface of water as if it were soft ground.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	clay_companion: {
		compendium_id: 'clay_companion',
		source_id: 'SRD',
		rarity_roll: 50,
		title: 'Clay Companion',
		description_html:
			'When you sculpt this ball of clay into a clay animal companion, it behaves as that animal. For example, a clay spider can spin clay webs, while a clay bird can fly. The clay companion retains memory and identity across different shapes, but they can adopt new mannerisms with each form.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	mythic_dust_recipe: {
		compendium_id: 'mythic_dust_recipe',
		source_id: 'SRD',
		rarity_roll: 51,
		title: 'Mythic Dust Recipe',
		description_html:
			'As a downtime move, you can use a handful of fine gold dust to craft Mythic Dust.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	shard_of_memory: {
		compendium_id: 'shard_of_memory',
		source_id: 'SRD',
		rarity_roll: 52,
		title: 'Shard of Memory',
		description_html:
			'Once per long rest, you can spend 2 Hope to recall a domain card from your vault instead of paying its Recall Cost.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	gem_of_alacrity: {
		compendium_id: 'gem_of_alacrity',
		source_id: 'SRD',
		rarity_roll: 53,
		title: 'Gem of Alacrity',
		description_html:
			'You can attach this gem to a weapon, allowing you to use your Agility when making an attack with that weapon.',
		character_modifiers: [],
		weapon_modifiers: [
			{
				behaviour: 'bonus',
				target_weapon: 'all',
				character_conditions: [],
				target_stat: 'trait',
				trait: 'agility'
			}
		]
	},
	gem_of_might: {
		compendium_id: 'gem_of_might',
		source_id: 'SRD',
		rarity_roll: 54,
		title: 'Gem of Might',
		description_html:
			'You can attach this gem to a weapon, allowing you to use your Strength when making an attack with that weapon.',
		character_modifiers: [],
		weapon_modifiers: [
			{
				behaviour: 'bonus',
				target_weapon: 'all',
				character_conditions: [],
				target_stat: 'trait',
				trait: 'strength'
			}
		]
	},
	gem_of_precision: {
		compendium_id: 'gem_of_precision',
		source_id: 'SRD',
		rarity_roll: 55,
		title: 'Gem of Precision',
		description_html:
			'You can attach this gem to a weapon, allowing you to use your Finesse when making an attack with that weapon.',
		character_modifiers: [],
		weapon_modifiers: [
			{
				behaviour: 'bonus',
				target_weapon: 'all',
				character_conditions: [],
				target_stat: 'trait',
				trait: 'finesse'
			}
		]
	},
	gem_of_insight: {
		compendium_id: 'gem_of_insight',
		source_id: 'SRD',
		rarity_roll: 56,
		title: 'Gem of Insight',
		description_html:
			'You can attach this gem to a weapon, allowing you to use your Instinct when making an attack with that weapon.',
		character_modifiers: [],
		weapon_modifiers: [
			{
				behaviour: 'bonus',
				target_weapon: 'all',
				character_conditions: [],
				target_stat: 'trait',
				trait: 'instinct'
			}
		]
	},
	gem_of_audacity: {
		compendium_id: 'gem_of_audacity',
		source_id: 'SRD',
		rarity_roll: 57,
		title: 'Gem of Audacity',
		description_html:
			'You can attach this gem to a weapon, allowing you to use your Presence when making an attack with that weapon.',
		character_modifiers: [],
		weapon_modifiers: [
			{
				behaviour: 'bonus',
				target_weapon: 'all',
				character_conditions: [],
				target_stat: 'trait',
				trait: 'presence'
			}
		]
	},
	gem_of_sagacity: {
		compendium_id: 'gem_of_sagacity',
		source_id: 'SRD',
		rarity_roll: 58,
		title: 'Gem of Sagacity',
		description_html:
			'You can attach this gem to a weapon, allowing you to use your Knowledge when making an attack with that weapon.',
		character_modifiers: [],
		weapon_modifiers: [
			{
				behaviour: 'bonus',
				target_weapon: 'all',
				character_conditions: [],
				target_stat: 'trait',
				trait: 'knowledge'
			}
		]
	},
	ring_of_unbreakable_resolve: {
		compendium_id: 'ring_of_unbreakable_resolve',
		source_id: 'SRD',
		rarity_roll: 59,
		title: 'Ring of Unbreakable Resolve',
		description_html:
			'Once per session, when the GM spends a Fear, you can spend 4 Hope to cancel the effects of that spent Fear.',
		character_modifiers: [],
		weapon_modifiers: []
	},
	belt_of_unity: {
		compendium_id: 'belt_of_unity',
		source_id: 'SRD',
		rarity_roll: 60,
		title: 'Belt of Unity',
		description_html:
			'Once per session, you can spend 5 Hope to lead a Tag Team Roll with three PCs instead of two.',
		character_modifiers: [],
		weapon_modifiers: []
	}
} as const satisfies Record<string, Loot>;
