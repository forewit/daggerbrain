import type { Card } from "$lib/ts/character/types";

export const BLADE_DOMAIN_CARDS = {
    get_back_up: {
        card_type: "domain",
        domain_id: "blade",
        artist_name: "Jenny Tan",
        image_url: "/images/card/art/domains/blade/get-back-up.webp",
        type: "ability",
        title: "Get Back Up",
        description_html: "",
        level_requirement: 1,
        recall_cost: 1,
        applies_in_vault: false,
        choices: [],
        features: [
            {
                title: "",
                description_html: "<p>When you take Severe damage, you can <b>mark a Stress</b> to reduce the severity by one threshold.</p>",
                modifiers: []
            }
        ],
    },
    whirlwind: {
        card_type: "domain",
        domain_id: "blade",
        artist_name: "Mike Pape",
        image_url: "/images/card/art/domains/blade/whirlwind.webp",
        type: "ability",
        title: "Whrilwind",
        description_html: "",
        level_requirement: 1,
        recall_cost: 0,
        applies_in_vault: false,
        choices: [],
        features: [
            {
                title: "",
                description_html: "<p>When you make a successful attack agains a target within Very Close range, you can <b>spend a Hope</b> to use the attack against all other targets within Very Close range.</p>",
                modifiers: []
            }
        ],
    },
    not_good_enough: {
        card_type: "domain",
        domain_id: "blade",
        artist_name: "Juan S. Almencion",
        image_url: "/images/card/art/domains/blade/not-good-enough.webp",
        type: "ability",
        title: "Not Good Enough",
        description_html: "",
        level_requirement: 1,
        recall_cost: 1,
        applies_in_vault: false,
        choices: [],
        features: [
            {
                title: "",
                description_html: "<p>When you roll your damage dice, you can reroll any 1s or 2s.</p>",
                modifiers: []
            }
        ],
    },
    reckless: {
        card_type: "domain",
        domain_id: "blade",
        artist_name: "Jenny Tan",
        image_url: "/images/card/art/domains/blade/reckless.webp",
        type: "ability",
        title: "Reckless",
        description_html: "",
        level_requirement: 2,
        recall_cost: 1,
        applies_in_vault: false,
        choices: [],
        features: [
            {
                title: "",
                description_html: "<p><b>Mark a Stress</b> to gain advantage on an attack.</p>",
                modifiers: []
            }
        ],
    },
    a_soldiers_bond: {
        card_type: "domain",
        domain_id: "blade",
        artist_name: "Mila Pesic",
        image_url: "/images/card/art/domains/blade/a-soldiers-bond.webp",
        type: "ability",
        title: "A Soldier's Bond",
        description_html: "",
        level_requirement: 2,
        recall_cost: 1,
        applies_in_vault: false,
        choices: [],
        features: [
            {
                title: "",
                description_html: "Once per long rest, when you compliment someone or ask them about something they're good at, you can both gain 3 Hope.",
                modifiers: []
            }
        ],
    },
    scramble: {
        card_type: "domain",
        domain_id: "blade",
        artist_name: "Ilya Royz",
        image_url: "/images/card/art/domains/blade/scramble.webp",
        type: "ability",
        title: "Scramble",
        description_html: "",
        level_requirement: 3,
        recall_cost: 1,
        applies_in_vault: false,
        choices: [],
        features: [
            {
                title: "",
                description_html: "<p>Once per rest, when a creature within Melee range would deal damage to you, you can avoid the attack and safely move out of Melee range of the enemy.</p>",
                modifiers: []
            }
        ],
    },
    versatile_fighter: {
        card_type: "domain",
        domain_id: "blade",
        artist_name: "KarrahE",
        image_url: "/images/card/art/domains/blade/versatile-fighter.webp",
        type: "ability",
        title: "Versatile Fighter",
        description_html: "",
        level_requirement: 3,
        recall_cost: 1,
        applies_in_vault: false,
        choices: [],
        features: [
            {
                title: "",
                description_html: "<p>You can use a different character trait for an equipped weapon, rather than the trait the weapon calls for. When you deal damage, you can <b>mark a Stress</b> to use the maximum result of one of your damage dice instead of rolling it.</p>",
                modifiers: []
            }
        ],
    },
    deadly_focus: {
        card_type: "domain",
        domain_id: "blade",
        artist_name: "Rafater",
        image_url: "/images/card/art/domains/blade/deadly-focus.webp",
        type: "ability",
        title: "Deadly Focus",
        description_html: "",
        level_requirement: 4,
        recall_cost: 2,
        applies_in_vault: false,
        choices: [],
        features: [
            {
                title: "",
                description_html: "<p>Once per rest, you can apply all your focus toward a target of your choice. Until you attack another creature, you defeat the target, or the battle ends, gain a +1 bonus to your Proficiency.</p>",
                modifiers: []
            }
        ],
    },
    fortified_armor: {
        card_type: "domain",
        domain_id: "blade",
        artist_name: "Henrik Rosenborg",
        image_url: "/images/card/art/domains/blade/fortified-armor.webp",
        type: "ability",
        title: "Fortified Armor",
        description_html: "",
        level_requirement: 4,
        recall_cost: 0,
        applies_in_vault: false,
        choices: [],
        features: [
            {
                title: "",
                description_html: "<p>While you are wearing armor, gain a +2 bonus to your damage thresholds.</p>",
                modifiers: [{
                    behavior: "bonus",
                    target: "major_damage_threshold",
                    type: "flat",
                    value: 2,
					conditions: [{
						type: "armor_equipped",
						value: true
					}, {
						type: "level",
						min_level: 4,
						max_level: 10
					}]
                }, {
                    behavior: "bonus",
                    target: "severe_damage_threshold",
                    type: "flat",
                    value: 2,
					conditions: [{
						type: "armor_equipped",
						value: true
					}, {
						type: "level",
						min_level: 4,
						max_level: 10
					}]
                }]
            }
        ],
    },
    champions_edge: {
        card_type: "domain",
        domain_id: "blade",
        artist_name: "Samantha B. Lucas",
        image_url: "/images/card/art/domains/blade/champions-edge.webp",
        type: "ability",
        title: "Champion's Edge",
        description_html: "",
        level_requirement: 5,
        recall_cost: 1,
        applies_in_vault: false,
        choices: [],
        features: [
            {
                title: "",
                description_html: `<p>When you critically succeed on an attack, you can <b>spend up to 3 Hope</b> and choose one of the following options for each Hope spent:</p>
                                    <ul class="list-disc list-inside ml-2">
                                        <li>You clear a Hit Point.</li>
                                        <li>You clear an Armor Slot.</li>
                                        <li>The target must mark an additional Hit Point.</li>
                                    </ul>
                                    <p>You can't choose the same option more than once.</p>`,
                modifiers: []
            }
        ],
    },

    // TODO: still working on this one. finish before moving on
    vitality: {
        card_type: "domain",
        domain_id: "blade",
        artist_name: "Juan S. Almencion",
        image_url: "/images/card/art/domains/blade/vitality.webp",
        type: "ability",
        title: "Vitality",
        description_html: "",
        level_requirement: 5,
        recall_cost: 0,
        applies_in_vault: true,
        choices: [],
        features: [
            {
                title: "",
                description_html: `<p>When you choose this card, permanently gain two of the following benefits:</p>
                                    <ul class="list-disc list-inside ml-2">
                                        <li>One Stress slot</li>
                                        <li>One Hit Point slot</li>
                                        <li>+2 bonus to your damage thresholds</li>
                                    </ul>
                                    <p>Then place this card in your vault permanently.</p>`,
                modifiers: []
            }
        ],
    }
} as const satisfies Record<string, Card<"domain">>
