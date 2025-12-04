<script lang="ts">
	import { cn, capitalize, applyProficiencyToDice } from '$lib/utils';
	import * as Select from '$lib/components/ui/select/';
	import type { Weapon, Traits, DamageTypes } from '$lib/types/compendium-types';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import Check from '@lucide/svelte/icons/check';
	import { TRAITS } from '$lib/types/rules';

	let {
		weapon,
		showEquipButton = false,
		quantity = 1,
		class: className = '',
		onclick
	}: {
		weapon: Weapon;
		showEquipButton?: boolean;
		quantity?: number;
		class?: string;
		onclick?: () => void;
	} = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);
	let traits = $derived(context.traits);
	let proficiency = $derived(context.proficiency);

	// Determine weapon type for equip/unequip functions
	let weaponType = $derived.by(() => {
		if (weapon.category === 'Primary') return 'primary_weapon' as const;
		if (weapon.category === 'Secondary') return 'secondary_weapon' as const;
		return null;
	});

	// Check if this weapon is currently equipped
	let isEquipped = $derived.by(() => {
		if (!weaponType) return false;
		return context.isItemEquipped(weapon, weaponType);
	});

	// Toggle equip/unequip
	function toggleEquip(e: MouseEvent) {
		e.stopPropagation();
		if (!weaponType) return;

		if (isEquipped) {
			context.unequipItem(weapon, weaponType);
		} else {
			context.equipItem(weapon, weaponType);
		}
	}

	// Get weapon choices from inventory based on weapon type
	let weaponChoices = $derived.by(() => {
		if (!character) return null;

		if (weapon.category === 'Unarmed') {
			return character.unarmed_attack_choices;
		} else if (weapon.category === 'Primary') {
			return character.inventory.primary_weapons[weapon.id]?.choices ?? null;
		} else if (weapon.category === 'Secondary') {
			return character.inventory.secondary_weapons[weapon.id]?.choices ?? null;
		}
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

	// Calculate to hit: weapon attack_roll_bonus + character trait value
	let toHit = $derived.by(() => {
		if (!currentTrait || !traits) return weapon.attack_roll_bonus;
		const traitValue = traits[currentTrait] || 0;
		return weapon.attack_roll_bonus + traitValue;
	});

	// Format to hit for display
	let formattedToHit = $derived(toHit >= 0 ? `+${toHit}` : `${toHit}`);

	// Format damage for Damage column (with proficiency applied)
	let formattedDamage = $derived.by(() => {
		const diceWithProficiency = applyProficiencyToDice(weapon.damage_dice, proficiency);
		return `${diceWithProficiency}${currentDamageType ? ' ' + currentDamageType : ''}`;
	});
</script>

<tr
	class={cn('cursor-pointer text-xs', className)}
	onclick={(e) => {
		// Don't trigger onclick if clicking on interactive elements (but allow the row itself)
		const target = e.target as HTMLElement;
		const interactive = target.closest('button, select, input');
		if (interactive && interactive !== e.currentTarget) {
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
	<td class="px-4 py-2">
		<div class="flex items-center gap-1">
			{#if showEquipButton && weaponType}
				<button
					class="group -my-2 -ml-4 self-stretch pr-1 pl-4"
					onclick={toggleEquip}
					title={isEquipped ? 'Unequip' : 'Equip'}
				>
					<div
						class="flex size-[16px] items-center justify-center rounded-full border-2 border-muted-foreground transition-colors group-hover:border-foreground"
					>
						{#if isEquipped}
							<div class="size-[8px] rounded-full bg-muted-foreground"></div>
						{/if}
					</div>
				</button>
			{/if}
			{#if weapon.category !== 'Unarmed'}
				<div class="-mb-1">
					<p>{weapon.title}</p>
					<p class="text-[10px] text-muted-foreground">{weapon.category}</p>
				</div>
			{:else}
				<p>{weapon.title}</p>
			{/if}

			{#if quantity > 1}
				<span class="text-muted-foreground italic">×{quantity}</span>
			{/if}
		</div>
	</td>
	<td class="py-2 pr-4 text-center whitespace-nowrap">{weapon.range}</td>
	<td class="py-2 pr-4 whitespace-nowrap">
		<div class="mx-auto w-min rounded-full border bg-foreground/5 px-2 py-1 text-xs">
			{formattedToHit}
			{#if currentTrait}
				<span class="text-xs">{TRAITS[currentTrait].short_name}</span>
			{/if}
		</div>
	</td>
	<td class="py-2 pr-4 text-right whitespace-nowrap sm:text-center">
		<div class="ml-auto w-min rounded-full border bg-foreground/5 px-2 py-1 text-xs sm:mx-auto">
			{formattedDamage}
		</div>
	</td>
	<td class="hidden py-2 pr-4 text-right text-xs sm:table-cell">
		<div class="ml-auto w-min text-right">
			{weapon.features.map((f) => f.title).join(', ') || '—'}
		</div>
	</td>
</tr>
