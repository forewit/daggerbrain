<!-- src/routes/+page.svelte -->
<script lang="ts">
	import DaggerSheet from "./dagger-sheet.svelte";
	import type { Character } from "./types";
  
	// initial character data (typed)
	let character: Character = {
	  name: "Lyra Daggerheart",
	  heritage: "Varnish",
	  pronouns: "she/her",
	  className: "Rogue",
	  subclass: "Shadowblade",
	  level: 3,
	  traits: {
		agility: { value: 4, notes: "Quick feet" },
		strength: { value: 2 },
		finesse: { value: 3 },
		instinct: { value: 3 },
		presence: { value: 2 },
		knowledge: { value: 2 }
	  },
	  hp: { max: 12, current: 12, stress: 0, minor: [false, false, false], major: [false, false], severe: [false] },
	  hope: { max: 3, current: 1, feature: "Inspire" },
	  proficiency: { die: "d8", circles: 2 },
	  weapons: {
		primary: { name: "Short Sword", feature: "Swift Strike", trait: "finesse", range: "melee", damage: "1d6+2", equipped: true },
		secondary: { name: "Dagger", feature: "Throwing", trait: "finesse", range: "thrown", damage: "1d4", equipped: false },
		inventory: [{ name: "Climbing Rope" }, { name: "Healing Salve" }]
	  },
	  armor: { name: "Leather Guard", feature: "Light", baseThresholds: "", baseScore: 1 },
	  gold: { handfuls: 2, bags: 1, chest: 0, total: 12 },
	  experience: ["Defeated the bandit captain"],
	  classFeature: "Shadowstep: teleport short distance from darkness"
	};
  </script>
  
  <svelte:head>
	<title>Daggerheart — Character Sheet Demo</title>
  </svelte:head>
  
  <div class="p-6 bg-slate-100 min-h-screen">
	<h1 class="text-3xl font-bold mb-4">Daggerheart — Sheet demo</h1>
  
	<!-- bind:char so parent and component share updates -->
	<DaggerSheet bind:char={character} />
  </div>
  