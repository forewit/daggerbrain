import type { Card } from "$lib/ts/character/types";

export const CODEX_DOMAIN_CARDS = {
    book_of_ava: {
        id: "book_of_ava",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Laura Galli",
        image_url: "/images/card/art/domains/codex/book-of-ava.webp",
        type: "grimoire",
        title: "Book of Ava",
        description_html: "",
        level_requirement: 1,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p><b><em>Power Push:</em></b> Make a <b>Spellcast Roll</b> against a target within Melee range. On a success, they're knocked back to Far range and take <b>d10+2</b> magic damage using your Proficiency.</p>
                    <p><b><em>Tava's Armor:</em></b> <b>Spend a Hope</b> to give a target you can touch a +1 bonus to their Armor Score until their next rest or you cast Tava's Armor again.</p>
                    <p><b><em>Ice Spike:</em></b> Make a <b>Spellcast Roll (12)</b> to summon a large ice spike within Far range. If you use it as a weapon, make the Spellcast Roll against the target's Difficulty instead. On a success, deal <b>d6</b> physical damage using your Proficiency.</p>`,
                modifiers: []
            }
        ],
    },
    book_of_illiat: {
        id: "book_of_illiat",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Ernanda Souza",
        image_url: "/images/card/art/domains/codex/book-of-illiat.webp",
        type: "grimoire",
        title: "Book of Illiat",
        description_html: "",
        level_requirement: 1,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p><b><em>Slumber:</em></b> Make a <b>Spellcast Roll</b> against a target within Very Close range. On a success, they're <em>Asleep</em> until they take damage or the GM spends a Fear on their turn to clear this condition.</p>
                    <p><b><em>Arcane Barrage:</em></b> Once per rest, <b>spend any number of Hope</b> and shoot magical projectiles that strike a target of your choice within Close range. Roll a number of <b>d6s</b> equal to the Hope spent and deal that much magic damage to the target.</p>
                    <p><b><em>Telepathy:</em></b> <b>Spend a Hope</b> to open a line of mental communication with one target you can see. This connection lasts until your next rest or you cast Telepathy again.</p>`,
                modifiers: []
            }
        ],
    },
    book_of_tyfar: {
        id: "book_of_tyfar",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Kristina Carroll",
        image_url: "/images/card/art/domains/codex/book-of-tyfar.webp",
        type: "grimoire",
        title: "Book of Tyfar",
        description_html: "",
        level_requirement: 1,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p><b><em>Wild Flame:</em></b> Make a <b>Spellcast Roll</b> against up to three adversaries within Melee range. Targets you succeed against take <b>2d6</b> magic damage and must mark a Stress as flames erupt from your hand.</p>
                    <p><b><em>Magic Hand:</em></b> You conjure a magical hand with the same size and strength as your own within Far range.</p>
                    <p><b><em>Mysterious Mist:</em></b> Make a <b>Spellcast Roll (13)</b> to cast a temporary thick fog that gathers in a stationary area within Very Close range. The fog heavily obscures this area and everything in it.</p>`,
                modifiers: []
            }
        ],
    },
    book_of_sitil: {
        id: "book_of_sitil",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Laura Galli",
        image_url: "/images/card/art/domains/codex/book-of-sitil.webp",
        type: "grimoire",
        title: "Book of Sitil",
        description_html: "",
        level_requirement: 2,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p><b><em>Adjust Appearance:</em></b> You magically shift your appearance and clothing to avoid recognition.</p>
                    <p><b><em>Parallela:</em></b> <b>Spend 2 Hope</b> to cast this spell on yourself or an ally within Close range. The next time the target makes an attack, they can hit an additional target within range that their attack roll would succeed against. You can only hold this spell on one creature at a time.</p>
                    <p><b><em>Illusion:</em></b> Make a <b>Spellcast Roll (14)</b>. On a success, create a temporary visual illusion no larger than you within Close range that lasts for as long as you look at it. It holds up to scrutiny until an observer is within Melee range.</p>`,
                modifiers: []
            }
        ],
    },
    book_of_vagras: {
        id: "book_of_vagras",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Mike Pape",
        image_url: "/images/card/art/domains/codex/book-of-vagras.webp",
        type: "grimoire",
        title: "Book of Vagras",
        description_html: "",
        level_requirement: 2,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p><b><em>Runic Lock:</em></b> Make a <b>Spellcast Roll (15)</b> on an object you're touching that can close (such as a lock, chest, or box). Once per rest on a success, you can lock the object so it can only be opened by creatures of your choice. Someone with access to magic and an hour of time to study the spell can break it.</p>
                    <p><b><em>Arcane Door:</em></b> When you have no adversaries within Melee range, make a <b>Spellcast Roll (13)</b>. On a success, <b>spend a Hope</b> to create a portal from where you are to a point within Far range you can see. It closes once a creature has passed through it.</p>
                    <p><b><em>Reveal:</em></b> Make a <b>Spellcast Roll</b>. If there is anything magically hidden within Close range, the roll would succeed against, it is revealed.</p>`,
                modifiers: []
            }
        ],
    },
    // todo: verify everything below
    book_of_korvax: {
        id: "book_of_korvax",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Rick Hefner",
        image_url: "/images/card/art/domains/codex/book-of-korvax.webp",
        type: "grimoire",
        title: "Book of Korvax",
        description_html: "",
        level_requirement: 3,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p><b><em>Levitation:</em></b> Make a <b>Spellcast Roll</b> to temporarily lift a target you can see up into the air and move them within Close range of their original position.</p>
                     <p><b><em>Recant:</em></b> <b>Spend a Hope</b> to force a target within Melee range to make a <b>Reaction Roll (15)</b>. On a failure, they forget the last minute of your conversation.</p>
                     <p><b><em>Rune Circle:</em></b> <b>Mark a Stress</b> to create a temporary magical circle on the ground where you stand. All adversaries within Melee range, or who enter Melee range, take <b>2d12+4</b> magic damage and are knocked back to Very Close range.</p>`,
                modifiers: []
            }
        ],
    },
    book_of_norai: {
        id: "book_of_norai",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Simon Pape",
        image_url: "/images/card/art/domains/codex/book-of-norai.webp",
        type: "grimoire",
        title: "Book of Norai",
        description_html: "",
        level_requirement: 3,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p><b><em>Mystic Tether:</em></b> Make a <b>Spellcast Roll</b> against a target within Far range. On a success, they're temporarily <em>Restrained</em> and must mark a Stress. If you target a flying creature, this spell grounds and temporarily Restrains them.</p>
                     <p><b><em>Fireball:</em></b> Make a <b>Spellcast Roll</b> against a target within Very Far range. On a success, hurl a sphere of fire toward them that explodes on impact. The target and all creatures within Very Close range of them must make a <b>Reaction Roll (13)</b>. Targets who fail take <b>d20+5</b> magic damage using your Proficiency. Targets who succeed take half damage.</p>`,
                modifiers: []
            }
        ],
    },
    book_of_exota: {
        id: "book_of_exota",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Laura Galli",
        image_url: "/images/card/art/domains/codex/book-of-exota.webp",
        type: "grimoire",
        title: "Book of Exota",
        description_html: "",
        level_requirement: 4,
        recall_cost: 3,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p><b><em>Repudiate:</em></b> You can interrupt a magical effect taking place. Make a <b>Reaction Roll</b> using your Spellcast trait. Once per rest on a success, the effect stops and any consequences are avoided.</p>
                     <p><b><em>Create Construct:</em></b> <b>Spend a Hope</b> to choose a group of objects around you and create an animated construct from them that obeys basic commands. Make a <b>Spellcast Roll</b> to command them to take action. When necessary, they share your Evasion and traits and their attacks deal <b>2d10+3</b> physical damage. You can only maintain one construct at a time, and they fall apart when they take any amount of damage.</p>`,
                modifiers: []
            }
        ],
    },
    book_of_grynn: {
        id: "book_of_grynn",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Cybercatbug",
        image_url: "/images/card/art/domains/codex/book-of-grynn.webp",
        type: "grimoire",
        title: "Book of Grynn",
        description_html: "",
        level_requirement: 4,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p><b><em>Arcane Deflection:</em></b> Once per long rest, <b>spend a Hope</b> to negate the damage of an attack targeting you or an ally within Very Close range.</p>
                     <p><b><em>Time Lock:</em></b> Target an object within Far range. That object stops in time and space exactly where it is until your next rest. If a creature tries to move it, make a <b>Spellcast Roll</b> against them to maintain this spell.</p>
                     <p><b><em>Wall of Flame:</em></b> Make a <b>Spellcast Roll (15)</b>. On a success, create a wall of magical flame between two points within Far range. All creatures in its path must choose a side to be on, and anything that subsequently passes through the wall takes <b>4d10+3</b> magic damage.</p>`,
                modifiers: []
            }
        ],
    },
    manifest_wall: {
        id: "manifest_wall",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Ilya Royz",
        image_url: "/images/card/art/domains/codex/manifest-wall.webp",
        type: "spell",
        title: "Manifest Wall",
        description_html: "",
        level_requirement: 5,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>Make a <b>Spellcast Roll (15)</b>. Once per rest on a success, <b>spend a Hope</b> to create a temporary magical wall between two points within Far range. It can be up to 50 feet high and form at any angle. Creatures or objects in its path are shunted to a side of your choice. The wall stays up until your next rest or you cast Manifest Wall again.</p>`,
                modifiers: []
            }
        ],
    },
    teleport: {
        id: "teleport",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Henry Peters",
        image_url: "/images/card/art/domains/codex/teleport.webp",
        type: "spell",
        title: "Teleport",
        description_html: "",
        level_requirement: 5,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>Once per long rest, you can instantly teleport yourself and any number of willing targets within Close range to a place you've been before. Choose one of the following options, then make a <b>Spellcast Roll (16)</b>:</p>
                     <ul class="list-disc list-inside ml-2">
                        <li>If you know the place very well, gain a +3 bonus.</li>
                        <li>If you've visited the place frequently, gain a +1 bonus.</li>
                        <li>If you've visited the place infrequently, gain no modifier.</li>
                        <li>If you've only been there once, gain a −2 penalty.</li>
                     </ul>
                     <p>On a success, you appear where you were intending to go. On a failure, you appear off course, with the range of failure determining how far off course.</p>`,
                modifiers: []
            }
        ],
    },
    banish: {
        id: "banish",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Bear Frymire",
        image_url: "/images/card/art/domains/codex/banish.webp",
        type: "spell",
        title: "Banish",
        description_html: "",
        level_requirement: 6,
        recall_cost: 0,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>Make a <b>Spellcast Roll</b> against a target within Close range. On a success, roll a number of <b>d20s</b> equal to your Spellcast trait. The target must make a reaction roll with a Difficulty equal to your highest result. On a success, the target must mark a Stress but isn't banished. Once per rest on a failure, they are banished from this realm.</p>
                     <p>When the PCs roll with Fear, the Difficulty gains a −1 penalty and the target makes another reaction roll. On a success, they return from banishment.</p>`,
                modifiers: []
            }
        ],
    },
    sigil_of_retribution: {
        id: "sigil_of_retribution",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Rick Hefner",
        image_url: "/images/card/art/domains/codex/sigil-of-retribution.webp",
        type: "spell",
        title: "Sigil of Retribution",
        description_html: "",
        level_requirement: 6,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>Mark an adversary within Close range with a sigil of retribution. The GM gains a Fear. When the marked adversary deals damage to you or your allies, place a <b>d8</b> on this card. You can hold a number of d8s equal to your level.</p>
                     <p>When you successfully attack the marked adversary, roll the dice on this card and add the total to your damage roll, then clear the dice. This effect ends when the marked adversary is defeated or you cast Sigil of Retribution again.</p>`,
                modifiers: []
            }
        ],
    },
    book_of_homet: {
        id: "book_of_homet",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Geoffrey Ernault",
        image_url: "/images/card/art/domains/codex/book-of-homet.webp",
        type: "grimoire",
        title: "Book of Homet",
        description_html: "",
        level_requirement: 7,
        recall_cost: 0,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p><b><em>Pass Through:</em></b> Make a <b>Spellcast Roll (13)</b>. Once per rest on a success, you and all creatures touching you can pass through a wall or door within Close range. The effect ends once everyone is on the other side.</p>
                     <p><b><em>Plane Gate:</em></b> Make a <b>Spellcast Roll (14)</b>. Once per long rest on a success, open a gateway to a location in another dimension or plane of existence you've been to before. This gateway lasts until your next rest.</p>`,
                modifiers: []
            }
        ],
    },
    codex_touched: {
        id: "codex_touched",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Cybercatbug",
        image_url: "/images/card/art/domains/codex/codex-touched.webp",
        type: "ability",
        title: "Codex-Touched",
        description_html: "",
        level_requirement: 7,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>When 4 or more of the domain cards in your loadout are from the Codex domain, gain the following benefits:</p>
                     <ul class="list-disc list-inside ml-2">
                        <li>You can mark a Stress to add your Proficiency to a Spellcast Roll.</li>
                        <li>Once per rest, replace this card with any card from your vault without paying its Recall Cost.</li>
                     </ul>`,
                modifiers: []
            }
        ],
    },
    book_of_vyola: {
        id: "book_of_vyola",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Eliot Baum",
        image_url: "/images/card/art/domains/codex/book-of-vyola.webp",
        type: "grimoire",
        title: "Book of Vyola",
        description_html: "",
        level_requirement: 8,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p><b><em>Memory Delve:</em></b> Make a <b>Spellcast Roll</b> against a target within Far range. On a success, peer into the target's mind and ask the GM a question. The GM describes any memories the target has pertaining to the answer.</p>
                     <p><b><em>Shared Clarity:</em></b> Once per long rest, <b>spend a Hope</b> to choose two willing creatures. When one of them would mark Stress, they can choose between the two of them who marks it. This spell lasts until their next rest.</p>`,
                modifiers: []
            }
        ],
    },
    safe_haven: {
        id: "safe_haven",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Dominik Mayer",
        image_url: "/images/card/art/domains/codex/safe-haven.webp",
        type: "spell",
        title: "Safe Haven",
        description_html: "",
        level_requirement: 8,
        recall_cost: 3,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>When you have a few minutes of calm to focus, you can <b>spend 2 Hope</b> to summon your Safe Haven, a large interdimensional home where you and your allies can take shelter.</p>
                     <p>When you do, a magical door appears somewhere within Close range. Only creatures of your choice can enter. Once inside, you can make the entrance invisible. You and anyone else inside can always exit. Once you leave, the doorway must be summoned again.</p>
                     <p>When you take a rest within your own Safe Haven, you can choose an additional downtime move.</p>`,
                modifiers: []
            }
        ],
    },
    book_of_ronin: {
        id: "book_of_ronin",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Jenny Tan",
        image_url: "/images/card/art/domains/codex/book-of-ronin.webp",
        type: "grimoire",
        title: "Book of Ronin",
        description_html: "",
        level_requirement: 9,
        recall_cost: 4,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p><b><em>Transform:</em></b> Make a <b>Spellcast Roll (15)</b>. On a success, transform into an inanimate object no larger than twice your normal size. You can remain in this shape until you take damage.</p>
                     <p><b><em>Eternal Enervation:</em></b> Once per long rest, make a <b>Spellcast Roll</b> against a target within Close range. On a success, they become permanently <em>Vulnerable</em>. They can't clear this condition by any means.</p>`,
                modifiers: []
            }
        ],
    },
    disintegration_wave: {
        id: "disintegration_wave",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Nick Acuna",
        image_url: "/images/card/art/domains/codex/disintegration-wave.webp",
        type: "spell",
        title: "Disintegration Wave",
        description_html: "",
        level_requirement: 9,
        recall_cost: 4,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>Make a <b>Spellcast Roll (18)</b>. Once per long rest on a success, the GM tells you which adversaries within Far range have a Difficulty of 18 or lower. <b>Mark a Stress</b> for each one you wish to hit with this spell. They are killed and can't come back to life by any means.</p>`,
                modifiers: []
            }
        ],
    },
    book_of_yarrow: {
        id: "book_of_yarrow",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Daarken",
        image_url: "/images/card/art/domains/codex/book-of-yarrow.webp",
        type: "grimoire",
        title: "Book of Yarrow",
        description_html: "",
        level_requirement: 10,
        recall_cost: 2,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p><b><em>Timejammer:</em></b> Make a <b>Spellcast Roll (18)</b>. On a success, time temporarily slows to a halt for everyone within Far range except for you. It resumes the next time you make an action roll that targets another creature.</p>
                     <p><b><em>Magic Immunity:</em></b> <b>Spend 5 Hope</b> to become immune to magic damage until your next rest.</p>`,
                modifiers: []
            }
        ],
    },
    transcendent_union: {
        id: "transcendent_union",
        card_type: "domain",
        domain_id: "codex",
        artist_name: "Bear Frymire",
        image_url: "/images/card/art/domains/codex/transcendent-union.webp",
        type: "spell",
        title: "Transcendent Union",
        description_html: "",
        level_requirement: 10,
        recall_cost: 1,
        applies_in_vault: false,
        forced_in_loadout: false,
        choices: [],
        tokens: false,
        features: [
            {
                title: "",
                description_html:
                    `<p>Once per long rest, <b>spend 5 Hope</b> to cast this spell on two or more willing creatures. Until your next rest, when a creature connected by this union would mark Stress or Hit Points, the connected creatures can choose who marks it.</p>`,
                modifiers: []
            }
        ],
    }    
} as const satisfies Record<string, Card<"domain">>
