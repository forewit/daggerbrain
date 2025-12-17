<script lang="ts">
	import HomebrewWeaponWeaponForm from "$lib/components/app/homebrew/homebrew-weapon-weapon-form.svelte";
	import type { Weapon } from "$lib/types/compendium-types";

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

</script>

<div class="p-2 w-[300px] m-4 bg-card rounded-lg shadow">
    <HomebrewWeaponWeaponForm bind:weapon/>
</div>