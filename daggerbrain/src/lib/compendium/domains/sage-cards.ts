import type { DomainCard } from '$lib/types/compendium-types';

export const SAGE_DOMAIN_CARDS = {
	// todo: verify everything below
	gifted_tracker: {
		compendium_id: 'gifted_tracker',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Gifted Tracker',
		level_requirement: 1,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `When you're tracking a specific creature or group of creatures based on signs of their passage, you can **spend any number of Hope** and ask the GM that many questions from the following list:

- What direction did they go?
- How long ago did they pass through?
- What were they doing in this location?
- How many of them were here?

When you encounter creatures you've tracked in this way, gain a +1 bonus to your Evasion against them.`,
				character_modifiers: []
			}
		]
	},
	natures_tongue: {
		compendium_id: 'natures_tongue',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: "Nature's Tongue",
		level_requirement: 1,
		recall_cost: 0,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `You can speak the language of the natural world. When you want to speak to the plants and animals around you, make an **Instinct Roll (12)**. On a success, they'll give you the information they know. On a roll with Fear, their knowledge might be limited or come at a cost.

Additionally, before you make a **Spellcast Roll** while within a natural environment, you can **spend a Hope** to gain a +2 bonus to the roll.`,
				character_modifiers: []
			}
		]
	},
	vicious_entangle: {
		compendium_id: 'vicious_entangle',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Vicious Entangle',
		level_requirement: 1,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Make a **Spellcast Roll** against a target within Far range. On a success, roots and vines reach out from the ground, dealing **1d8+1** physical damage and temporarily *Restraining* the target.

Additionally on a success, you can **spend a Hope** to temporarily Restrain another adversary within Very Close range of your target.`,
				character_modifiers: []
			}
		]
	},
	conjure_swarm: {
		compendium_id: 'conjure_swarm',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Conjure Swarm',
		level_requirement: 2,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `***Tekaira Armored Beetles:*** **Mark a Stress** to conjure armored beetles that encircle you. When you next take damage, reduce the severity by one threshold. You can **spend a Hope** to keep the beetles conjured after taking damage.

***Fire Flies:*** Make a **Spellcast Roll** against all adversaries within Close range. **Spend a Hope** to deal **2d8+3** magic damage to targets you succeeded against.`,
				character_modifiers: []
			}
		]
	},
	natural_familiar: {
		compendium_id: 'natural_familiar',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Natural Familiar',
		level_requirement: 2,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `**Spend a Hope** to summon a small nature spirit or forest critter to your side until your next rest, you cast Natural Familiar again, or the familiar is targeted by an attack. If you **spend an additional Hope**, you can summon a familiar that flies.

You can communicate with them, make a **Spellcast Roll** to command them to perform simple tasks, and **mark a Stress** to see through their eyes.

When you deal damage to an adversary within Melee range of your familiar, you add a **d6** to your damage roll.`,
				character_modifiers: []
			}
		]
	},
	corrosive_projectile: {
		compendium_id: 'corrosive_projectile',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Corrosive Projectile',
		level_requirement: 3,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Make a **Spellcast Roll** against a target within Far range. On a success, deal **d6+4** magic damage using your Proficiency.

Additionally, **mark 2 or more Stress** to make them permanently *Corroded*. While a target is Corroded, they gain a −1 penalty to their Difficulty for every 2 Stress you spent. This condition can stack.`,
				character_modifiers: []
			}
		]
	},
	towering_stalk: {
		compendium_id: 'towering_stalk',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Towering Stalk',
		level_requirement: 3,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Once per rest, you can conjure a thick, twisting stalk within Close range that can be easily climbed. Its height can grow up to Far range.

**Mark a Stress** to use this spell as an attack. Make a **Spellcast Roll** against an adversary or group of adversaries within Close range. The erupting stalk lifts targets you succeed against into the air and drops them, dealing **d8** physical damage using your Proficiency.`,
				character_modifiers: []
			}
		]
	},
	death_grip: {
		compendium_id: 'death_grip',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Death Grip',
		level_requirement: 4,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Make a **Spellcast Roll** against a target within Close range and choose one of the following options:

- You pull the target into Melee range or pull yourself into Melee range of them.
- You constrict the target and force them to **mark 2 Stress**.
- All adversaries between you and the target must succeed on a **Reaction Roll (13)** or be hit by vines, taking **3d6+2** physical damage.

On a success, vines reach out from your hands, causing the chosen effect and temporarily *Restraining* the target.`,
				character_modifiers: []
			}
		]
	},
	healing_field: {
		compendium_id: 'healing_field',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Healing Field',
		level_requirement: 4,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Once per long rest, you can conjure a field of healing plants around you. Everywhere within Close range of you bursts to life with vibrant nature, allowing you and all allies in the area to clear a Hit Point.

**Spend 2 Hope** to allow you and all allies to clear 2 Hit Points instead.`,
				character_modifiers: []
			}
		]
	},
	thorn_skin: {
		compendium_id: 'thorn_skin',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Thorn Skin',
		level_requirement: 5,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: true,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Once per rest, **spend a Hope** to sprout thorns all over your body. When you do, place a number of tokens equal to your Spellcast trait on this card.

When you take damage, you can spend any number of tokens to roll that number of **d6s**. Add the results together and reduce the incoming damage by that amount. If you're within Melee range of the attacker, deal that amount of damage back to them.

When you take a rest, clear all unspent tokens.`,
				character_modifiers: []
			}
		]
	},
	wild_fortress: {
		compendium_id: 'wild_fortress',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Wild Fortress',
		level_requirement: 5,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: true,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Make a **Spellcast Roll (13)**. On a success, **spend 2 Hope** to grow a natural barricade in the shape of a dome that you and one ally can take cover within.

While inside the dome, a creature can't be targeted by attacks and can't make attacks. Attacks made against the dome automatically succeed.

The dome has the following damage thresholds and lasts until it marks 3 Hit Points. Place tokens on this card to represent marking Hit Points. **Thresholds: 15/30**`,
				character_modifiers: []
			}
		]
	},
	conjured_steeds: {
		compendium_id: 'conjured_steeds',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Conjured Steeds',
		level_requirement: 6,
		recall_cost: 0,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `**Spend any number of Hope** to conjure that many magical steeds (such as horses, camels, or elephants) that you and your allies can ride until your next long rest or the steeds take any damage.

The steeds double your land speed while traveling and, when in danger, allow you to move within Far range without having to roll. Creatures riding a steed gain a −2 penalty to attack rolls and a +2 bonus to damage rolls.`,
				character_modifiers: []
			}
		]
	},
	forager: {
		compendium_id: 'forager',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Forager',
		level_requirement: 6,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `As an additional downtime move you can choose, roll a **d6** to see what you forage. Work with the GM to describe it and add it to your inventory as a consumable. Your party can carry up to five foraged consumables at a time.

- 1. A unique food (Clear 2 Stress)
- 2. A beautiful relic (Gain 2 Hope)
- 3. An arcane rune (+2 to a Spellcast Roll)
- 4. A healing vial (Clear 2 Hit Points)
- 5. A luck charm (Reroll any die)
- 6. Choose one of the options above.`,
				character_modifiers: []
			}
		]
	},
	sage_touched: {
		compendium_id: 'sage_touched',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Sage-Touched',
		level_requirement: 7,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `When 4 or more of the domain cards in your loadout are from the Sage domain, gain the following benefits:

- While you're in a natural environment, you gain a +2 bonus to your Spellcast Rolls.
- Once per rest, you can double your Agility or Instinct when making a roll that uses that trait. You must choose to do this before you roll.`,
				character_modifiers: []
			}
		]
	},
	wild_surge: {
		compendium_id: 'wild_surge',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Wild Surge',
		level_requirement: 7,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: true,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Once per long rest, **mark a Stress** to channel the natural world around you and enhance yourself. Describe how your appearance changes, then place a **d6** on this card with the 1 value facing up.

While the Wild Surge Die is active, you add its value to every action roll you make. After you add its value to a roll, increase the Wild Surge Die's value by one.

When the die's value would exceed 6 or you take a rest, this form drops and you must **mark an additional Stress**.`,
				character_modifiers: []
			}
		]
	},
	forest_sprites: {
		compendium_id: 'forest_sprites',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Forest Sprites',
		level_requirement: 8,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Make a **Spellcast Roll (13)**. On a success, **spend any number of Hope** to create an equal number of small forest sprites who appear at points you choose within Far range, providing the following benefits:

- Your allies gain a +3 bonus to attack rolls against adversaries within Melee range of a sprite.
- An ally who marks an Armor Slot while within Melee range of a sprite can mark an additional Armor Slot.

A sprite vanishes after granting a benefit or taking any damage.`,
				character_modifiers: []
			}
		]
	},
	rejuvenation_barrier: {
		compendium_id: 'rejuvenation_barrier',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Rejuvenation Barrier',
		level_requirement: 8,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Make a **Spellcast Roll (15)**. Once per rest on a success, create a temporary barrier of protective energy around you at Very Close range. You and all allies within the barrier when this spell is cast clear **1d4 Hit Points**.

While the barrier is up, you and all allies within have resistance to physical damage from outside the barrier. When you move, the barrier follows you.`,
				character_modifiers: []
			}
		]
	},
	fane_of_the_wilds: {
		compendium_id: 'fane_of_the_wilds',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'ability',
		title: 'Fane of the Wilds',
		level_requirement: 9,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: true,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `After a long rest, place a number of tokens equal to the number of Sage domain cards in your loadout and vault on this card.

When you would make a Spellcast Roll, you can spend any number of tokens after the roll to gain a +1 bonus for each token spent.

When you critically succeed on a Spellcast Roll for a Sage domain spell, gain a token.

When you take a long rest, clear all unspent tokens.`,
				character_modifiers: []
			}
		]
	},
	plant_dominion: {
		compendium_id: 'plant_dominion',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Plant Dominion',
		level_requirement: 9,
		recall_cost: 1,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Make a **Spellcast Roll (18)**. Once per long rest on a success, you reshape the natural world, changing the surrounding plant life anywhere within Far range of you.

For example, you can grow trees instantly, clear a path through dense vines, or create a wall of roots.`,
				character_modifiers: []
			}
		]
	},
	force_of_nature: {
		compendium_id: 'force_of_nature',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Force of Nature',
		level_requirement: 10,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `**Mark a Stress** to transform into a hulking nature spirit, gaining the following benefits:

- When you succeed on an attack or Spellcast Roll, gain a +10 bonus to the damage roll.
- When you deal enough damage to defeat a creature within Close range, you absorb them and clear an Armor Slot.
- You can't be Restrained.

Before you make an action roll, you must **spend a Hope**. If you can't, you revert to your normal form.`,
				character_modifiers: []
			}
		]
	},
	tempest: {
		compendium_id: 'tempest',
		source_id: 'SRD',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: '',
		image_url: '/images/art/placeholder-art.webp',
		category: 'spell',
		title: 'Tempest',
		level_requirement: 10,
		recall_cost: 2,
		applies_in_vault: false,
		forced_in_loadout: false,
		forced_in_vault: false,
		choices: [],
		tokens: false,
		features: [
			{
				weapon_modifiers: [],
				title: '',
				description_html: `Choose one of the following tempests and make a **Spellcast Roll** against all targets within Far range. Targets you succeed against experience its effects until the GM spends a Fear on their turn to end this spell:

- **Blizzard:** Deal **2d20+8** magic damage and targets are temporarily *Vulnerable*.
- **Hurricane:** Deal **3d10+10** magic damage and choose a direction the wind is blowing. Targets can't move against the wind.
- **Sandstorm:** Deal **5d6+9** magic damage. Attacks made from beyond Melee range have disadvantage.`,
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, DomainCard>;
