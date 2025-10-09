<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { HOPE_MAX } from "$lib/components/app/sheet/constants";
  import Sheet from "$lib/components/app/sheet/sheet.svelte";
  import type { Character } from "$lib/components/app/sheet/types";

  let character: Character = $state({
    name: "Just-James",
    image: "https://pub-cdae2c597d234591b04eed47a98f233c.r2.dev/v1/card-header-images/domains/blade/whirlwind.webp",
    level: 1,
    proficiency: 2,
    evasion: 12,
    damage_thresholds: {
      major: 9,
      severe: 19,
    },
    armor: {
      max: 3,
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
        name: "Halfclank",
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
        description: "<strong>Spend 3 Hope</strong> to clear 2 Stress.",
      },
      primary_domain: "blade",
      secondary_domain: "midnight",
      features: [
        {
          title: "Sneak Attack",
          description:
            "Once per turn, you can deal extra damage when you have advantage on an attack.",
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

<div class="max-w-2xl mx-auto">
  <Sheet bind:character />
</div>
