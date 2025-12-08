import type { DomainCard } from '$lib/types/compendium-types';

export const SAGE_DOMAIN_CARDS = {
	// todo: verify everything below
	gifted_tracker: {
		compendium_id: 'gifted_tracker',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Ernanda Souza',
		image_url: '/api/images/card/art/domains/sage/gifted-tracker.webp',
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
				description_html: `<p>When you're tracking a specific creature or group of creatures based on signs of their passage, you can <b>spend any number of Hope</b> and ask the GM that many questions from the following list:</p>
                     <ul class="list-disc list-inside ml-2">
                        <li>What direction did they go?</li>
                        <li>How long ago did they pass through?</li>
                        <li>What were they doing in this location?</li>
                        <li>How many of them were here?</li>
                     </ul>
                     <p>When you encounter creatures you've tracked in this way, gain a +1 bonus to your Evasion against them.</p>`,
				character_modifiers: []
			}
		]
	},
	natures_tongue: {
		compendium_id: 'natures_tongue',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Simon Pape',
		image_url: '/api/images/card/art/domains/sage/natures-tongue.webp',
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
				description_html: `<p>You can speak the language of the natural world. When you want to speak to the plants and animals around you, make an <b>Instinct Roll (12)</b>. On a success, they'll give you the information they know. On a roll with Fear, their knowledge might be limited or come at a cost.</p>
                     <p>Additionally, before you make a <b>Spellcast Roll</b> while within a natural environment, you can <b>spend a Hope</b> to gain a +2 bonus to the roll.</p>`,
				character_modifiers: []
			}
		]
	},
	vicious_entangle: {
		compendium_id: 'vicious_entangle',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Leesha Hannigan',
		image_url: '/api/images/card/art/domains/sage/vicious-entangle.webp',
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
				description_html: `<p>Make a <b>Spellcast Roll</b> against a target within Far range. On a success, roots and vines reach out from the ground, dealing <b>1d8+1</b> physical damage and temporarily <em>Restraining</em> the target.</p>
                     <p>Additionally on a success, you can <b>spend a Hope</b> to temporarily Restrain another adversary within Very Close range of your target.</p>`,
				character_modifiers: []
			}
		]
	},
	conjure_swarm: {
		compendium_id: 'conjure_swarm',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Jen Estridain Pattison',
		image_url: '/api/images/card/art/domains/sage/conjure-swarm.webp',
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
				description_html: `<p><b><em>Tekaira Armored Beetles:</em></b> <b>Mark a Stress</b> to conjure armored beetles that encircle you. When you next take damage, reduce the severity by one threshold. You can <b>spend a Hope</b> to keep the beetles conjured after taking damage.</p>
                     <p><b><em>Fire Flies:</em></b> Make a <b>Spellcast Roll</b> against all adversaries within Close range. <b>Spend a Hope</b> to deal <b>2d8+3</b> magic damage to targets you succeeded against.</p>`,
				character_modifiers: []
			}
		]
	},
	natural_familiar: {
		compendium_id: 'natural_familiar',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Leesha Hannigan',
		image_url: '/api/images/card/art/domains/sage/natural-familiar.webp',
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
				description_html: `<p><b>Spend a Hope</b> to summon a small nature spirit or forest critter to your side until your next rest, you cast Natural Familiar again, or the familiar is targeted by an attack. If you <b>spend an additional Hope</b>, you can summon a familiar that flies.</p>
                     <p>You can communicate with them, make a <b>Spellcast Roll</b> to command them to perform simple tasks, and <b>mark a Stress</b> to see through their eyes.</p>
                     <p>When you deal damage to an adversary within Melee range of your familiar, you add a <b>d6</b> to your damage roll.</p>`,
				character_modifiers: []
			}
		]
	},
	corrosive_projectile: {
		compendium_id: 'corrosive_projectile',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Anthony Jones',
		image_url: '/api/images/card/art/domains/sage/corrosive-projectile.webp',
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
				description_html: `<p>Make a <b>Spellcast Roll</b> against a target within Far range. On a success, deal <b>d6+4</b> magic damage using your Proficiency.</p>
                     <p>Additionally, <b>mark 2 or more Stress</b> to make them permanently <em>Corroded</em>. While a target is Corroded, they gain a −1 penalty to their Difficulty for every 2 Stress you spent. This condition can stack.</p>`,
				character_modifiers: []
			}
		]
	},
	towering_stalk: {
		compendium_id: 'towering_stalk',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Anthony Avon',
		image_url: '/api/images/card/art/domains/sage/towering-stalk.webp',
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
				description_html: `<p>Once per rest, you can conjure a thick, twisting stalk within Close range that can be easily climbed. Its height can grow up to Far range.</p>
                     <p><b>Mark a Stress</b> to use this spell as an attack. Make a <b>Spellcast Roll</b> against an adversary or group of adversaries within Close range. The erupting stalk lifts targets you succeed against into the air and drops them, dealing <b>d8</b> physical damage using your Proficiency.</p>`,
				character_modifiers: []
			}
		]
	},
	death_grip: {
		compendium_id: 'death_grip',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Arturo G. González',
		image_url: '/api/images/card/art/domains/sage/death-grip.webp',
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
				description_html: `<p>Make a <b>Spellcast Roll</b> against a target within Close range and choose one of the following options:</p>
                     <ul class="list-disc list-inside ml-2">
                        <li>You pull the target into Melee range or pull yourself into Melee range of them.</li>
                        <li>You constrict the target and force them to <b>mark 2 Stress</b>.</li>
                        <li>All adversaries between you and the target must succeed on a <b>Reaction Roll (13)</b> or be hit by vines, taking <b>3d6+2</b> physical damage.</li>
                     </ul>
                     <p>On a success, vines reach out from your hands, causing the chosen effect and temporarily <em>Restraining</em> the target.</p>`,
				character_modifiers: []
			}
		]
	},
	healing_field: {
		compendium_id: 'healing_field',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Bear Frymire',
		image_url: '/api/images/card/art/domains/sage/healing-field.webp',
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
				description_html: `<p>Once per long rest, you can conjure a field of healing plants around you. Everywhere within Close range of you bursts to life with vibrant nature, allowing you and all allies in the area to clear a Hit Point.</p>
                     <p><b>Spend 2 Hope</b> to allow you and all allies to clear 2 Hit Points instead.</p>`,
				character_modifiers: []
			}
		]
	},
	thorn_skin: {
		compendium_id: 'thorn_skin',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Jack Jones',
		image_url: '/api/images/card/art/domains/sage/thorn-skin.webp',
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
				description_html: `<p>Once per rest, <b>spend a Hope</b> to sprout thorns all over your body. When you do, place a number of tokens equal to your Spellcast trait on this card.</p>
                     <p>When you take damage, you can spend any number of tokens to roll that number of <b>d6s</b>. Add the results together and reduce the incoming damage by that amount. If you're within Melee range of the attacker, deal that amount of damage back to them.</p>
                     <p>When you take a rest, clear all unspent tokens.</p>`,
				character_modifiers: []
			}
		]
	},
	wild_fortress: {
		compendium_id: 'wild_fortress',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Bear Frymire',
		image_url: '/api/images/card/art/domains/sage/wild-fortress.webp',
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
				description_html: `<p>Make a <b>Spellcast Roll (13)</b>. On a success, <b>spend 2 Hope</b> to grow a natural barricade in the shape of a dome that you and one ally can take cover within.</p>
                     <p>While inside the dome, a creature can't be targeted by attacks and can't make attacks. Attacks made against the dome automatically succeed.</p>
                     <p>The dome has the following damage thresholds and lasts until it marks 3 Hit Points. Place tokens on this card to represent marking Hit Points. <b>Thresholds: 15/30</b></p>`,
				character_modifiers: []
			}
		]
	},
	conjured_steeds: {
		compendium_id: 'conjured_steeds',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Juan S. Almencion',
		image_url: '/api/images/card/art/domains/sage/conjured-steeds.webp',
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
				description_html: `<p><b>Spend any number of Hope</b> to conjure that many magical steeds (such as horses, camels, or elephants) that you and your allies can ride until your next long rest or the steeds take any damage.</p>
                     <p>The steeds double your land speed while traveling and, when in danger, allow you to move within Far range without having to roll. Creatures riding a steed gain a −2 penalty to attack rolls and a +2 bonus to damage rolls.</p>`,
				character_modifiers: []
			}
		]
	},
	forager: {
		compendium_id: 'forager',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Anthony Jones',
		image_url: '/api/images/card/art/domains/sage/forager.webp',
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
				description_html: `<p>As an additional downtime move you can choose, roll a <b>d6</b> to see what you forage. Work with the GM to describe it and add it to your inventory as a consumable. Your party can carry up to five foraged consumables at a time.</p>
                     <ul class="list-disc list-inside ml-2">
                        <li>1. A unique food (Clear 2 Stress)</li>
                        <li>2. A beautiful relic (Gain 2 Hope)</li>
                        <li>3. An arcane rune (+2 to a Spellcast Roll)</li>
                        <li>4. A healing vial (Clear 2 Hit Points)</li>
                        <li>5. A luck charm (Reroll any die)</li>
                        <li>6. Choose one of the options above.</li>
                     </ul>`,
				character_modifiers: []
			}
		]
	},
	sage_touched: {
		compendium_id: 'sage_touched',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Juan S. Almenicon',
		image_url: '/api/images/card/art/domains/sage/sage-touched.webp',
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
				description_html: `<p>When 4 or more of the domain cards in your loadout are from the Sage domain, gain the following benefits:</p>
                     <ul class="list-disc list-inside ml-2">
                        <li>While you're in a natural environment, you gain a +2 bonus to your Spellcast Rolls.</li>
                        <li>Once per rest, you can double your Agility or Instinct when making a roll that uses that trait. You must choose to do this before you roll.</li>
                     </ul>`,
				character_modifiers: []
			}
		]
	},
	wild_surge: {
		compendium_id: 'wild_surge',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Ryan Christian Rodero',
		image_url: '/api/images/card/art/domains/sage/wild-surge.webp',
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
				description_html: `<p>Once per long rest, <b>mark a Stress</b> to channel the natural world around you and enhance yourself. Describe how your appearance changes, then place a <b>d6</b> on this card with the 1 value facing up.</p>
                     <p>While the Wild Surge Die is active, you add its value to every action roll you make. After you add its value to a roll, increase the Wild Surge Die's value by one.</p>
                     <p>When the die's value would exceed 6 or you take a rest, this form drops and you must <b>mark an additional Stress</b>.</p>`,
				character_modifiers: []
			}
		]
	},
	forest_sprites: {
		compendium_id: 'forest_sprites',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Ilya Royz',
		image_url: '/api/images/card/art/domains/sage/forest-sprites.webp',
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
				description_html: `<p>Make a <b>Spellcast Roll (13)</b>. On a success, <b>spend any number of Hope</b> to create an equal number of small forest sprites who appear at points you choose within Far range, providing the following benefits:</p>
                     <ul class="list-disc list-inside ml-2">
                        <li>Your allies gain a +3 bonus to attack rolls against adversaries within Melee range of a sprite.</li>
                        <li>An ally who marks an Armor Slot while within Melee range of a sprite can mark an additional Armor Slot.</li>
                     </ul>
                     <p>A sprite vanishes after granting a benefit or taking any damage.</p>`,
				character_modifiers: []
			}
		]
	},
	rejuvenation_barrier: {
		compendium_id: 'rejuvenation_barrier',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Bear Frymire',
		image_url: '/api/images/card/art/domains/sage/rejuvenation-barrier.webp',
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
				description_html: `<p>Make a <b>Spellcast Roll (15)</b>. Once per rest on a success, create a temporary barrier of protective energy around you at Very Close range. You and all allies within the barrier when this spell is cast clear <b>1d4 Hit Points</b>.</p>
                     <p>While the barrier is up, you and all allies within have resistance to physical damage from outside the barrier. When you move, the barrier follows you.</p>`,
				character_modifiers: []
			}
		]
	},
	fane_of_the_wilds: {
		compendium_id: 'fane_of_the_wilds',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Anthony Avon',
		image_url: '/api/images/card/art/domains/sage/fane-of-the-wilds.webp',
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
				description_html: `<p>After a long rest, place a number of tokens equal to the number of Sage domain cards in your loadout and vault on this card.</p>
                     <p>When you would make a Spellcast Roll, you can spend any number of tokens after the roll to gain a +1 bonus for each token spent.</p>
                     <p>When you critically succeed on a Spellcast Roll for a Sage domain spell, gain a token.</p>
                     <p>When you take a long rest, clear all unspent tokens.</p>`,
				character_modifiers: []
			}
		]
	},
	plant_dominion: {
		compendium_id: 'plant_dominion',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Anthony Jones',
		image_url: '/api/images/card/art/domains/sage/plant-dominion.webp',
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
				description_html: `<p>Make a <b>Spellcast Roll (18)</b>. Once per long rest on a success, you reshape the natural world, changing the surrounding plant life anywhere within Far range of you.</p>
                     <p>For example, you can grow trees instantly, clear a path through dense vines, or create a wall of roots.</p>`,
				character_modifiers: []
			}
		]
	},
	force_of_nature: {
		compendium_id: 'force_of_nature',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Carlos C Díaz',
		image_url: '/api/images/card/art/domains/sage/force-of-nature.webp',
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
				description_html: `<p><b>Mark a Stress</b> to transform into a hulking nature spirit, gaining the following benefits:</p>
                     <ul class="list-disc list-inside ml-2">
                        <li>When you succeed on an attack or Spellcast Roll, gain a +10 bonus to the damage roll.</li>
                        <li>When you deal enough damage to defeat a creature within Close range, you absorb them and clear an Armor Slot.</li>
                        <li>You can't be Restrained.</li>
                     </ul>
                     <p>Before you make an action roll, you must <b>spend a Hope</b>. If you can't, you revert to your normal form.</p>`,
				character_modifiers: []
			}
		]
	},
	tempest: {
		compendium_id: 'tempest',
		source_id: 'Void 1.5',
		card_type: 'domain',
		domain_id: 'sage',
		artist_name: 'Samantha Kung',
		image_url: '/api/images/card/art/domains/sage/tempest.webp',
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
				description_html: `<p>Choose one of the following tempests and make a <b>Spellcast Roll</b> against all targets within Far range. Targets you succeed against experience its effects until the GM spends a Fear on their turn to end this spell:</p>
                     <ul class="list-disc list-inside ml-2">
                        <li><b>Blizzard:</b> Deal <b>2d20+8</b> magic damage and targets are temporarily <em>Vulnerable</em>.</li>
                        <li><b>Hurricane:</b> Deal <b>3d10+10</b> magic damage and choose a direction the wind is blowing. Targets can't move against the wind.</li>
                        <li><b>Sandstorm:</b> Deal <b>5d6+9</b> magic damage. Attacks made from beyond Melee range have disadvantage.</li>
                     </ul>`,
				character_modifiers: []
			}
		]
	}
} as const satisfies Record<string, DomainCard>;
