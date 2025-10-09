<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { HOPE_MAX } from "$lib/components/app/sheet/constants";
  import Deck from "$lib/components/app/sheet/deck.svelte";
  import Sheet from "$lib/components/app/sheet/sheet.svelte";
  import type { Character } from "$lib/components/app/sheet/types";

  let character: Character = $state({
    name: "Just-James",
    image:
      "https://pub-cdae2c597d234591b04eed47a98f233c.r2.dev/v1/card-header-images/domains/blade/whirlwind.webp",
    level: 1,
    proficiency: 2,
    evasion: 12,
    damage_thresholds: {
      major: 9,
      severe: 19,
    },
    armor: {
      max: 8,
      marked: 0,
    },
    hp: {
      max: 6,
      marked: 0,
    },
    stress: {
      max: 7,
      marked: 0,
    },
    hope: {
      max: HOPE_MAX,
      marked: 0,
    },
    traits: {
      agility: 2,
      strength: 1,
      finesse: 1,
      instinct: 0,
      presence: 0,
      knowledge: -1,
    },
    heritage: {
      ancestry: {
        name: "Half-Clank",
        top_feature: {
          title: "Elven Grace",
          description: "You have advantage on Dexterity saving throws.",
        },
        bottom_feature: {
          title: "Fey Ancestry",
          description: "You have resistance to being charmed.",
        },
      },
      community: {
        name: "Warborne",
        description: "A close-knit group of adventurers who have sworn to protect the realm.",
        features: [
          {
            title: "Community Bond",
            description: "You can call upon your community for aid once per long rest.",
          },
        ],
      },
    },
    transformation: {
      features: [
        {
          title: "Awakened Potential",
          description: "Your connection to the magical realm has awakened latent abilities.",
        },
      ],
    },
    class: {
      name: "Assassin",
      hope_feature: {
        title: "Grim Resolve",
        description: "<b>Spend 3 Hope</b> to clear 2 Stress.",
      },
      primary_domain: "blade",
      secondary_domain: "midnight",
      features: [
        {
          title: "Marked for Death",
          description: `<p>On a successful weapon attack, you can <b>mark a Stress</b> to make the target 
			<i>Marked for Death</i>. Attacks you make against a target that's <i>Marked for 
			Death</i> gain a bonus to damage equal to <b>+1d4</b> per tier.</p>
		
			<p>You can only have one adversary <i>Marked for Death</i> at a time, and can't transfer or 
			remove the condition except by defeating the target. The GM can spend a number of Fear equal 
			to your Proficiency to remove the <i>Marked for Death</i> condition. Otherwise, it ends
			automatically when you take a rest.</p>`,
        },
        {
          title: "Get In & Get Out",
          description: `<p><b>Spend a Hope</b> to ask the GM for either a quick or inconspicuous way 
			into or out of a building or structure you can see. The next roll you make that capitalizes 
			on this information has advantage.</p>`,
        },
      ],
    },
    subclass: {
      name: "Guild Executioner",
      spellcast_trait: "knowledge",
      foundation_features: [
        {
          title: "Spellcasting",
          description: "You can cast a limited number of spells using your knowledge trait.",
        },
      ],
      specialization_features: [
        {
          title: "Mage Hand Legerdemain",
          description:
            "Your Mage Hand can perform additional tasks like picking locks and disarming traps.",
        },
      ],
      mastery_features: [
        {
          title: "Spell Thief",
          description: "You can steal spells from enemies and use them yourself.",
        },
      ],
    },
  });
</script>

<div class="h-screen overflow-y-auto pb-12" style="scrollbar-width: none;">
  <Sheet bind:character class="max-w-2xl mx-auto" />

  <!-- deck -->
  <Deck {character} class="mx-2" />
</div>
