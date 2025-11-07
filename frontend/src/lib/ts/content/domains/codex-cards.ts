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
} as const satisfies Record<string, Card<"domain">>
