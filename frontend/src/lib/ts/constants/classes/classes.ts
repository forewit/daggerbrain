import type { Card, Class } from "$lib/ts/character/types";

export const SUBCLASS_CARDS = {
    executioners_guild_foundation: {
        card_type: "subclass_foundation",
        artist_name: "",
        image_url: "/images/wip.avif",
        title: "Executioners Guild",
        description_html: "Foundation",
        spellcast_trait: "agility",
        class_name: "assassin",
        features: [
            {
                title: "First Strike",
                description_html: "The first time in a scene you succeed on an attack roll, double the damage of the attack.",
                modifier_ids: []
            },
            {
                title: "Ambush",
                description_html: 'Your "Marked for Death" feature uses <b>d6s</b> instead of <b>d4s</b>.',
                modifier_ids: []
            },
        ],
    } satisfies Card<"subclass_foundation">,
    executioners_guild_specialization: {
        card_type: "subclass_specialization",
        artist_name: "",
        image_url: "/images/wip.avif",
        title: "Executioners Guild",
        description_html: "Specialization",
        class_name: "assassin",
        features: [
            {
                title: "Death Strike",
                description_html: "When you deal Severe damage to a creature, you can <b>mark a stress</b> to make them mark an additional Hit Point.",
                modifier_ids: []
            },
            {
                title: "Scorpion's Poise",
                description_html: "You gain a <b>+2</b> bonus to your Evasion against any attacks made by a creature <i>Marked for Death</i>.",
                modifier_ids: []
            }
        ],
    } satisfies Card<"subclass_specialization">,
    executioners_guild_mastery: {
        card_type: "subclass_mastery",
        artist_name: "",
        image_url: "/images/wip.avif",
        title: "Executioners Guild",
        description_html: "Mastery",
        class_name: "assassin",
        features: [
            {
                title: "True Strike",
                description_html: "Once per long rest, when you fail an attack roll, you can <b>spend a hope</b> to make it a success instead.",
                modifier_ids: []
            },
            {
                title: "Backstab",
                description_html: 'Your "Marked for Death" feature uses <b>d8s</b> instead of <b>d6s</b>.',
                modifier_ids: []
            }
        ],
    } satisfies Card<"subclass_mastery">,
} as const satisfies Record<string, Card<"subclass_foundation" | "subclass_specialization" | "subclass_mastery">>

export const CLASSES = {
    assassin: {
        source: "void_1_5",
        starting_evasion: 12,
        starting_max_hp: 5,
        suggested_traits: {
            agility: 2,
            strength: -1,
            finesse: 1,
            instinct: 0,
            presence: 0,
            knowledge: 1,
        },
        name: "Assassin",
        image_url: "/images/wip.avif",
        description_html: "As an assassin, you utilize unmatched stealth and precision to ambush the unwary.",
        hope_feature: {
            title: "Grim Resolve",
            description_html: "<p><b>Spend 3 Hope</b> to clear 2 Stress.</p>",
            modifier_ids: []
        },
        primary_domain_id: "blade",
        secondary_domain_id: "midnight",
        class_features: [
            {
                title: "Marked for Death",
                description_html: `<p>On a successful weapon attack, you can <b>mark a Stress</b> to make the target 
              <i>Marked for Death</i>. Attacks you make against a target that's <i>Marked for 
              Death</i> gain a bonus to damage equal to <b>+1d4</b> per tier.</p>
          
              <p>You can only have one adversary <i>Marked for Death</i> at a time, and can't transfer or 
              remove the condition except by defeating the target. The GM can spend a number of Fear equal 
              to your Proficiency to remove the <i>Marked for Death</i> condition. Otherwise, it ends
              automatically when you take a rest.</p>`,
                modifier_ids: []
            },
            {
                title: "Get In & Get Out",
                description_html: `<p><b>Spend a Hope</b> to ask the GM for either a quick or inconspicuous way 
              into or out of a building or structure you can see. The next roll you make that capitalizes 
              on this information has advantage.</p>`,
                modifier_ids: []
            },
        ],
        subclasses: {
            executioners_guild: {
                name: "Executioners Guild",
                description_html: "<p>Skilled in the art of assassination, the Executioners Guild is known for their precision and efficiency.</p>",
                foundation_card: SUBCLASS_CARDS.executioners_guild_foundation,
                specialization_card: SUBCLASS_CARDS.executioners_guild_specialization,
                mastery_card: SUBCLASS_CARDS.executioners_guild_mastery,
            }
        },
    }
} as const satisfies Record<string, Class>
