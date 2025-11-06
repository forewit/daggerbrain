import type { Card } from "$lib/ts/character/types";

export const MIDNIGHT_DOMAIN_CARDS = {
    pick_and_pull: {
        id: "pick_and_pull",
        card_type: "domain",
        domain_id: "midnight",
        artist_name: "Benjamin Ee",
        image_url: "/images/card/art/domains/midnight/pick-and-pull.webp",
        type: "ability",
        title: "Pick and Pull",
        description_html: "",
        level_requirement: 1,
        recall_cost: 0,
        applies_in_vault: false,
        choices: [],
        features: [
            {
                title: "",
                description_html: "<p>You have advantage on action rolls to pick nonmagical locks, disarm nonmagical traps, or steal items from a target (either through stealth or by force).</p>",
                modifiers: []
            }
        ],
    },
    rain_of_blades: {
        id: "rain_of_blades",
        card_type: "domain",
        domain_id: "midnight",
        artist_name: "Linda Lithén",
        image_url: "/images/card/art/domains/midnight/rain-of-blades.webp",
        type: "spell",
        title: "Rain of Blades",
        description_html: "",
        level_requirement: 1,
        recall_cost: 1,
        applies_in_vault: false,
        choices: [],
        features: [
            {
                title: "",
                description_html: "<p><b>Spend a Hope</b> to make a <b>Spellcast Roll</b> and conjure throwing blades that strike out at all targets within Very Close range. Targets you succeed against take <b>d8+2</b> magic damage using your Proficiency.</p><p>If a target you hit is <em>Vulnerable</em>, they take an extra <b>1d8</b> damage.</p>",
                modifiers: []
            }
        ],
    },
    // todo: add spell tokens to this card
    uncanny_disguise: {
        id: "uncanny_disguise",
        card_type: "domain",
        domain_id: "midnight",
        artist_name: "Linda Lithén",
        image_url: "/images/card/art/domains/midnight/uncanny-disguise.webp",
        type: "spell",
        title: "Uncanny Disguise",
        description_html: "",
        level_requirement: 1,
        recall_cost: 0,
        applies_in_vault: false,
        choices: [],
        features: [
            {
                title: "",
                description_html: "<p>When you have a few minutes to prepare, you can <b>mark a Stress</b> to don the facade of any humanoid you can picture clearly in your mind. While disguised, you have advantage on Presence Rolls to avoid scrutiny.</p><p>Place a number of tokens equal to your Spellcast trait on this card. When you take an action while disguised, spend a token from this card. After the action that spends the last token is resolved, the disguise drops.</p>",
                modifiers: []
            }
        ],
    }
} as const satisfies Record<string, Card<"domain">>
