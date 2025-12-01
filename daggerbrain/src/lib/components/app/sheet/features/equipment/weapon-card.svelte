<script lang="ts">
	import { cn, capitalize } from '$lib/utils';
	import * as Select from '$lib/components/ui/select/';
	import type { Weapon, Traits, DamageTypes } from '$lib/types/compendium-types';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let {
		weapon,
		weaponType = 'primary',
		bind_choices = false,
		class: className = '',
		onclick
	}: {
		weapon: Weapon;
		weaponType?: 'primary' | 'secondary';
		bind_choices?: boolean;
		class?: string;
		onclick?: () => void;
	} = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);
	let traits = $derived(context.traits);

	// Get weapon choices from inventory based on weapon type
	let weaponChoices = $derived.by(() => {
		if (!character) return null;
		const inventory = weaponType === 'primary' 
			? character.inventory.primary_weapons 
			: character.inventory.secondary_weapons;
		if (!inventory[weapon.id]) return null;
		return inventory[weapon.id].choices;
	});

	// Get current damage type and trait values from inventory choices
	let currentDamageType = $derived.by(() => {
		const choices = weaponChoices?.['damage_type'];
		if (choices && choices.length > 0) {
			return choices[0] as DamageTypes;
		}
		return weapon.available_damage_types[0] || null;
	});

	let currentTrait = $derived.by(() => {
		const choices = weaponChoices?.['trait'];
		if (choices && choices.length > 0) {
			return choices[0] as keyof Traits;
		}
		return weapon.available_traits[0] || null;
	});

	// Determine if selects should be shown
	let showDamageTypeSelect = $derived(bind_choices && weapon.available_damage_types.length > 1);
	let showTraitSelect = $derived(bind_choices && weapon.available_traits.length > 1);

	// Calculate to hit: weapon attack_roll_bonus + character trait value
	let toHit = $derived.by(() => {
		if (!currentTrait || !traits) return weapon.attack_roll_bonus;
		const traitValue = traits[currentTrait] || 0;
		return weapon.attack_roll_bonus + traitValue;
	});

	// Format to hit for display
	let formattedToHit = $derived(
		toHit >= 0 ? `+${toHit}` : `${toHit}`
	);

	// Format damage for Damage column
	let formattedDamage = $derived(
		`${weapon.damage_dice}${currentDamageType ? ' ' + capitalize(currentDamageType) : ''}`
	);

	// Get the inventory object based on weapon type
	let getInventory = () => {
		return weaponType === 'primary'
			? character?.inventory.primary_weapons
			: character?.inventory.secondary_weapons;
	};
</script>

<tr
	class={cn('cursor-pointer text-xs', className)}
	onclick={(e) => {
		// Don't trigger onclick if clicking on interactive elements
		const target = e.target as HTMLElement;
		if (target.closest('button, [role="button"], select, input')) {
			return;
		}
		onclick?.();
	}}
	role="button"
	tabindex="0"
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick?.();
		}
	}}
>
	<td class="px-4 py-2">{weapon.title}</td>
	<td class="px-4 py-2 whitespace-nowrap">{weapon.range}</td>
	<td class="px-4 py-2 whitespace-nowrap">
		<div class="w-min mx-auto rounded-full border bg-foreground/5 px-2 py-1 text-xs">
			{formattedToHit}
		</div>
	</td>
	<td class="px-4 py-2 whitespace-nowrap">

			<div class="w-min mx-auto rounded-full border bg-foreground/5 px-2 py-1 text-xs">
				{formattedDamage}
			</div>
	
	</td>
	<td class="hidden px-4 py-2 text-xs sm:table-cell">
		<div class="w-min ml-auto text-right">
			{weapon.features.map(f => f.title).join(', ') || '—'}
		</div>
	</td>
</tr>

