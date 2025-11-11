import type { Armor } from "../../character/types";


export const TIER_1_ARMOR = {
    gambeson_armor: {
        title: "Gambeson Armor",
        description_html: "",
        level_requirement: 1,
        max_armor: 3,
        damage_thresholds: {
            major: 5,
            severe: 11
        },
        features: [{
            title: "Flexible",
            description_html: "<p>+1 to Evasion</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 1,
                target: "evasion"
            }]
        }]
    },
    leather_armor: {
        title: "Leather Armor",
        description_html: "",
        level_requirement: 1,
        max_armor: 3,
        damage_thresholds: {
            major: 6,
            severe: 13
        },
        features: []
    },
    chainmail_armor: {
        title: "Chainmail Armor",
        description_html: "",
        level_requirement: 1,
        max_armor: 4,
        damage_thresholds: {
            major: 7,
            severe: 15
        },
        features: [{
            title: "Heavy",
            description_html: "<p>−1 to Evasion</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    full_plate_armor: {
        title: "Full Plate Armor",
        description_html: "",
        level_requirement: 1,
        max_armor: 4,
        damage_thresholds: {
            major: 8,
            severe: 17
        },
        features: [{
            title: "Very Heavy",
            description_html: "<p>−2 to Evasion; −1 to Agility</p>",
            modifiers: [
                {
                    behavior: "bonus",
                    conditions: [],
                    type: "flat",
                    value: -2,
                    target: "evasion"
                },
                {
                    behavior: "bonus",
                    conditions: [],
                    type: "flat",
                    value: -1,
                    target: "trait",
                    trait: "agility"
                }
            ]
        }]
    }
} as const satisfies Record<string, Armor>;

export const TIER_2_ARMOR = {
    improved_gambeson_armor: {
        title: "Improved Gambeson Armor",
        description_html: "",
        level_requirement: 2,
        max_armor: 4,
        damage_thresholds: {
            major: 7,
            severe: 16
        },
        features: [{
            title: "Flexible",
            description_html: "<p>+1 to Evasion</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 1,
                target: "evasion"
            }]
        }]
    },
    improved_leather_armor: {
        title: "Improved Leather Armor",
        description_html: "",
        level_requirement: 2,
        max_armor: 4,
        damage_thresholds: {
            major: 9,
            severe: 20
        },
        features: []
    },
    improved_chainmail_armor: {
        title: "Improved Chainmail Armor",
        description_html: "",
        level_requirement: 2,
        max_armor: 5,
        damage_thresholds: {
            major: 11,
            severe: 24
        },
        features: [{
            title: "Heavy",
            description_html: "<p>−1 to Evasion</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    improved_full_plate_armor: {
        title: "Improved Full Plate Armor",
        description_html: "",
        level_requirement: 2,
        max_armor: 5,
        damage_thresholds: {
            major: 13,
            severe: 28
        },
        features: [{
            title: "Very Heavy",
            description_html: "<p>−2 to Evasion; −1 to Agility</p>",
            modifiers: [
                {
                    behavior: "bonus",
                    conditions: [],
                    type: "flat",
                    value: -2,
                    target: "evasion"
                },
                {
                    behavior: "bonus",
                    conditions: [],
                    type: "flat",
                    value: -1,
                    target: "trait",
                    trait: "agility"
                }
            ]
        }]
    },
    elundrian_chain_armor: {
        title: "Elundrian Chain Armor",
        description_html: "",
        level_requirement: 2,
        max_armor: 4,
        damage_thresholds: {
            major: 9,
            severe: 21
        },
        features: [{
            title: "Warded",
            description_html: "<p>You reduce incoming magic damage by your Armor Score before applying it to your damage thresholds.</p>",
            modifiers: []
        }]
    },
    harrowbone_armor: {
        title: "Harrowbone Armor",
        description_html: "",
        level_requirement: 2,
        max_armor: 4,
        damage_thresholds: {
            major: 9,
            severe: 21
        },
        features: [{
            title: "Resilient",
            description_html: "<p>Before you mark your last Armor Slot, roll a d6. On a result of 6, reduce the severity by one threshold without marking an Armor Slot.</p>",
            modifiers: []
        }]
    },
    irontree_breastplate_armor: {
        title: "Irontree Breastplate Armor",
        description_html: "",
        level_requirement: 2,
        max_armor: 4,
        damage_thresholds: {
            major: 9,
            severe: 20
        },
        features: [{
            title: "Reinforced",
            description_html: "<p>When you mark your last Armor Slot, increase your damage thresholds by +2 until you clear at least 1 Armor Slot.</p>",
            modifiers: []
        }]
    },
    runetan_floating_armor: {
        title: "Runetan Floating Armor",
        description_html: "",
        level_requirement: 2,
        max_armor: 4,
        damage_thresholds: {
            major: 9,
            severe: 20
        },
        features: [{
            title: "Shifting",
            description_html: "<p>When you are targeted for an attack, you can mark an Armor Slot to give the attack roll against you disadvantage.</p>",
            modifiers: []
        }]
    },
    tyris_soft_armor: {
        title: "Tyris Soft Armor",
        description_html: "",
        level_requirement: 2,
        max_armor: 5,
        damage_thresholds: {
            major: 8,
            severe: 18
        },
        features: [{
            title: "Quiet",
            description_html: "<p>You gain a +2 bonus to rolls you make to move silently.</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 2,
                target: "spellcast_roll_bonus" // representing stealth/silence rolls
            }]
        }]
    },
    rosewild_armor: {
        title: "Rosewild Armor",
        description_html: "",
        level_requirement: 2,
        max_armor: 5,
        damage_thresholds: {
            major: 11,
            severe: 23
        },
        features: [{
            title: "Hopeful",
            description_html: "<p>When you would spend a Hope, you can mark an Armor Slot instead.</p>",
            modifiers: []
        }]
    }
} as const satisfies Record<string, Armor>;

export const TIER_3_ARMOR = {
    advanced_gambeson_armor: {
        title: "Advanced Gambeson Armor",
        description_html: "",
        level_requirement: 5,
        max_armor: 5,
        damage_thresholds: {
            major: 9,
            severe: 23
        },
        features: [{
            title: "Flexible",
            description_html: "<p>+1 to Evasion</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 1,
                target: "evasion"
            }]
        }]
    },
    advanced_leather_armor: {
        title: "Advanced Leather Armor",
        description_html: "",
        level_requirement: 5,
        max_armor: 5,
        damage_thresholds: {
            major: 11,
            severe: 27
        },
        features: []
    },
    advanced_chainmail_armor: {
        title: "Advanced Chainmail Armor",
        description_html: "",
        level_requirement: 5,
        max_armor: 6,
        damage_thresholds: {
            major: 13,
            severe: 31
        },
        features: [{
            title: "Heavy",
            description_html: "<p>−1 to Evasion</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    advanced_full_plate_armor: {
        title: "Advanced Full Plate Armor",
        description_html: "",
        level_requirement: 5,
        max_armor: 6,
        damage_thresholds: {
            major: 15,
            severe: 35
        },
        features: [{
            title: "Very Heavy",
            description_html: "<p>−2 to Evasion; −1 to Agility</p>",
            modifiers: [
                {
                    behavior: "bonus",
                    conditions: [],
                    type: "flat",
                    value: -2,
                    target: "evasion"
                },
                {
                    behavior: "bonus",
                    conditions: [],
                    type: "flat",
                    value: -1,
                    target: "trait",
                    trait: "agility"
                }
            ]
        }]
    },
    bellamoi_fine_armor: {
        title: "Bellamoi Fine Armor",
        description_html: "",
        level_requirement: 5,
        max_armor: 5,
        damage_thresholds: {
            major: 11,
            severe: 27
        },
        features: [{
            title: "Gilded",
            description_html: "<p>+1 to Presence</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 1,
                target: "trait",
                trait: "presence"
            }]
        }]
    },
    dragonscale_armor: {
        title: "Dragonscale Armor",
        description_html: "",
        level_requirement: 5,
        max_armor: 5,
        damage_thresholds: {
            major: 11,
            severe: 27
        },
        features: [{
            title: "Impenetrable",
            description_html: "<p>Once per short rest, when you would mark your last Hit Point, you can instead mark a Stress.</p>",
            modifiers: []
        }]
    },
    spiked_plate_armor: {
        title: "Spiked Plate Armor",
        description_html: "",
        level_requirement: 5,
        max_armor: 5,
        damage_thresholds: {
            major: 10,
            severe: 25
        },
        features: [{
            title: "Sharp",
            description_html: "<p>On a successful attack against a target within Melee range, add a d4 to the damage roll.</p>",
            modifiers: []
        }]
    },
    bladefare_armor: {
        title: "Bladefare Armor",
        description_html: "",
        level_requirement: 5,
        max_armor: 6,
        damage_thresholds: {
            major: 16,
            severe: 39
        },
        features: [{
            title: "Physical",
            description_html: "<p>You can’t mark an Armor Slot to reduce magic damage.</p>",
            modifiers: []
        }]
    },
    monetts_cloak: {
        title: "Monett’s Cloak",
        description_html: "",
        level_requirement: 5,
        max_armor: 6,
        damage_thresholds: {
            major: 16,
            severe: 39
        },
        features: [{
            title: "Magic",
            description_html: "<p>You can’t mark an Armor Slot to reduce physical damage.</p>",
            modifiers: []
        }]
    },
    runes_of_fortification: {
        title: "Runes of Fortification",
        description_html: "",
        level_requirement: 5,
        max_armor: 6,
        damage_thresholds: {
            major: 17,
            severe: 43
        },
        features: [{
            title: "Painful",
            description_html: "<p>Each time you mark an Armor Slot, you must mark a Stress.</p>",
            modifiers: []
        }]
    }
} as const satisfies Record<string, Armor>;

export const TIER_4_ARMOR = {
    legendary_gambeson_armor: {
        title: "Legendary Gambeson Armor",
        description_html: "",
        level_requirement: 8,
        max_armor: 6,
        damage_thresholds: {
            major: 11,
            severe: 32
        },
        features: [{
            title: "Flexible",
            description_html: "<p>+1 to Evasion</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 1,
                target: "evasion"
            }]
        }]
    },
    legendary_leather_armor: {
        title: "Legendary Leather Armor",
        description_html: "",
        level_requirement: 8,
        max_armor: 6,
        damage_thresholds: {
            major: 13,
            severe: 36
        },
        features: []
    },
    legendary_chainmail_armor: {
        title: "Legendary Chainmail Armor",
        description_html: "",
        level_requirement: 8,
        max_armor: 7,
        damage_thresholds: {
            major: 15,
            severe: 40
        },
        features: [{
            title: "Heavy",
            description_html: "<p>−1 to Evasion</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: -1,
                target: "evasion"
            }]
        }]
    },
    legendary_full_plate_armor: {
        title: "Legendary Full Plate Armor",
        description_html: "",
        level_requirement: 8,
        max_armor: 7,
        damage_thresholds: {
            major: 17,
            severe: 44
        },
        features: [{
            title: "Very Heavy",
            description_html: "<p>−2 to Evasion; −1 to Agility</p>",
            modifiers: [
                {
                    behavior: "bonus",
                    conditions: [],
                    type: "flat",
                    value: -2,
                    target: "evasion"
                },
                {
                    behavior: "bonus",
                    conditions: [],
                    type: "flat",
                    value: -1,
                    target: "trait",
                    trait: "agility"
                }
            ]
        }]
    },
    dunamis_silkchain: {
        title: "Dunamis Silkchain",
        description_html: "",
        level_requirement: 8,
        max_armor: 7,
        damage_thresholds: {
            major: 13,
            severe: 36
        },
        features: [{
            title: "Timeslowing",
            description_html: "<p>Mark an Armor Slot to roll a d4 and add its result as a bonus to your Evasion against an incoming attack.</p>",
            modifiers: []
        }]
    },
    channeling_armor: {
        title: "Channeling Armor",
        description_html: "",
        level_requirement: 8,
        max_armor: 5,
        damage_thresholds: {
            major: 13,
            severe: 36
        },
        features: [{
            title: "Channeling",
            description_html: "<p>+1 to Spellcast Rolls</p>",
            modifiers: [{
                behavior: "bonus",
                conditions: [],
                type: "flat",
                value: 1,
                target: "spellcast_roll_bonus"
            }]
        }]
    },
    emberwoven_armor: {
        title: "Emberwoven Armor",
        description_html: "",
        level_requirement: 8,
        max_armor: 6,
        damage_thresholds: {
            major: 13,
            severe: 36
        },
        features: [{
            title: "Burning",
            description_html: "<p>When an adversary attacks you within Melee range, they mark a Stress.</p>",
            modifiers: []
        }]
    },
    full_fortified_armor: {
        title: "Full Fortified Armor",
        description_html: "",
        level_requirement: 8,
        max_armor: 4,
        damage_thresholds: {
            major: 15,
            severe: 40
        },
        features: [{
            title: "Fortified",
            description_html: "<p>When you mark an Armor Slot, you reduce the severity of an attack by two thresholds instead of one.</p>",
            modifiers: []
        }]
    },
    veritas_opal_armor: {
        title: "Veritas Opal Armor",
        description_html: "",
        level_requirement: 8,
        max_armor: 6,
        damage_thresholds: {
            major: 13,
            severe: 36
        },
        features: [{
            title: "Truthseeking",
            description_html: "<p>This armor glows when another creature within Close range tells a lie.</p>",
            modifiers: []
        }]
    },
    savior_chainmail: {
        title: "Savior Chainmail",
        description_html: "",
        level_requirement: 8,
        max_armor: 8,
        damage_thresholds: {
            major: 18,
            severe: 48
        },
        features: [{
            title: "Difficult",
            description_html: "<p>−1 to all character traits and Evasion</p>",
            modifiers: [
                {
                    behavior: "bonus",
                    conditions: [],
                    type: "flat",
                    value: -1,
                    target: "evasion"
                },
                {
                    behavior: "bonus",
                    conditions: [],
                    type: "flat",
                    value: -1,
                    target: "trait",
                    trait: "strength"
                },
                {
                    behavior: "bonus",
                    conditions: [],
                    type: "flat",
                    value: -1,
                    target: "trait",
                    trait: "agility"
                },
                {
                    behavior: "bonus",
                    conditions: [],
                    type: "flat",
                    value: -1,
                    target: "trait",
                    trait: "finesse"
                },
                {
                    behavior: "bonus",
                    conditions: [],
                    type: "flat",
                    value: -1,
                    target: "trait",
                    trait: "presence"
                },
                {
                    behavior: "bonus",
                    conditions: [],
                    type: "flat",
                    value: -1,
                    target: "trait",
                    trait: "knowledge"
                },
                {
                    behavior: "bonus",
                    conditions: [],
                    type: "flat",
                    value: -1,
                    target: "trait",
                    trait: "instinct"
                }
            ]
        }]
    }
} as const satisfies Record<string, Armor>;
