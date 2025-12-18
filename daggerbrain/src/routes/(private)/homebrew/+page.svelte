<script lang="ts">
	import HomebrewArmorForm from "$lib/components/app/homebrew/homebrew-armor-form.svelte";
	import HomebrewBeastformForm from "$lib/components/app/homebrew/homebrew-beastform-form.svelte";
	import HomebrewWeaponForm from "$lib/components/app/homebrew/homebrew-weapon-form.svelte";
	import type { Armor, Beastform, Weapon } from "$lib/types/compendium-types";

	let weapon = $state<Weapon>({
		compendium_id: '',
		source_id: 'Homebrew',
		title: '',
		description_html: '',
		level_requirement: 1,
		category: 'Primary',
		type: 'Physical',
		available_traits: [],
		range: 'Melee',
		features: [],
		attack_roll_bonus: 0,
		damage_bonus: 0,
		damage_dice: '1d6',
		available_damage_types: [],
		burden: 1,
	});

	let armor = $state<Armor>({
		compendium_id: '',
		source_id: 'Homebrew',
		title: '',
		description_html: '',
		level_requirement: 1,
		max_armor: 0,
		damage_thresholds: { major: 0, severe: 0 },
		features: [],
	});

	let beastform = $state<Beastform>({
		compendium_id: '',
		source_id: 'Homebrew',
		level_requirement: 1,
		name: '',
		category: '',
		character_trait: {
			trait: 'agility',
			bonus: 0
		},
		attack: {
			range: 'Melee',
			trait: 'agility',
			damage_dice: 'd4',
			damage_bonus: 0,
			damage_type: 'phy'
		},
		advantages: [],
		evasion_bonus: 0,
		features: []
	});

</script>

<div class="m-4 flex flex-wrap gap-4">
		    <HomebrewWeaponForm bind:weapon/>
		    <HomebrewArmorForm bind:armor/>
			<HomebrewBeastformForm bind:beastform/>
</div>
