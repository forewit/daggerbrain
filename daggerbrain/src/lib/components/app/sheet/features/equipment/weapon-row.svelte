<script lang="ts">
	import { cn, applyProficiencyToDice } from '$lib/utils';
	import type { Traits, DamageTypes } from '@shared/types/compendium.types';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { TRAITS } from '@shared/constants/rules';
	import RollButton from '$lib/components/app/dice/roll-button.svelte';

	let {
		id,
		showEquipButton = false,
		class: className = '',
		onclick
	}: {
		id: string;
		showEquipButton?: boolean;
		class?: string;
		onclick?: () => void;
	} = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);
	let traits = $derived(context.traits);
	let proficiency = $derived(context.proficiency);

	// Look up the weapon from inventory or derived weapons (for equipped weapons with modifiers)
	let weapon = $derived.by(() => {
		// Check derived weapons first (for equipped weapons with modifiers applied)
		if (context.derived_primary_weapon?.id === id) return context.derived_primary_weapon;
		if (context.derived_secondary_weapon?.id === id) return context.derived_secondary_weapon;
		if (context.derived_unarmed_attack?.id === id) return context.derived_unarmed_attack;
		// Fall back to inventory weapons (for unequipped weapons)
		return (
			context.inventory_primary_weapons.find((w) => w.id === id) ||
			context.inventory_secondary_weapons.find((w) => w.id === id) ||
			null
		);
	});

	// Determine weapon type for equip/unequip functions
	let weaponType = $derived.by(() => {
		if (!weapon) return null;
		if (weapon.category === 'Primary') return 'primary_weapon' as const;
		if (weapon.category === 'Secondary') return 'secondary_weapon' as const;
		return null;
	});

	// Check if this weapon is currently equipped
	let isEquipped = $derived.by(() => {
		if (!weapon || !weaponType) return false;
		return context.isItemEquipped(weapon, weaponType);
	});

	// Toggle equip/unequip
	function toggleEquip(e: MouseEvent) {
		e.stopPropagation();
		if (!weapon || !weaponType) return;

		if (isEquipped) {
			context.unequipItem(weapon, weaponType);
		} else {
			context.equipItem(weapon, weaponType);
		}
	}

	// Get weapon choices from inventory based on weapon type
	let weaponChoices = $derived.by(() => {
		if (!character || !weapon) return null;

		if (weapon.category === 'Unarmed') {
			return character.unarmed_attack_choices;
		} else if (weapon.category === 'Primary') {
			return character.inventory.primary_weapons[weapon.id]?.choices ?? null;
		} else if (weapon.category === 'Secondary') {
			return character.inventory.secondary_weapons[weapon.id]?.choices ?? null;
		}
		return null;
	});

	// Get current damage type and trait values from inventory choices
	let currentDamageType = $derived.by(() => {
		if (!weapon) return undefined;
		const choices = weaponChoices?.['damage_type'];
		if (choices && choices.length > 0) {
			return choices[0] as DamageTypes;
		}
		return weapon.available_damage_types[0] || undefined;
	});

	let currentTrait = $derived.by(() => {
		if (!weapon) return undefined;
		const choices = weaponChoices?.['trait'];
		if (choices && choices.length > 0) {
			return choices[0] as keyof Traits;
		}
		return weapon.available_traits[0] || undefined;
	});

	// Calculate to hit: weapon attack_roll_bonus + character trait value
	let toHit = $derived.by(() => {
		if (!weapon) return 0;
		if (!currentTrait || !traits) return weapon.attack_roll_bonus;
		const traitValue = traits[currentTrait] ?? 0;
		return weapon.attack_roll_bonus + traitValue;
	});
</script>

{#if weapon}
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
						<p class="text-[10px] text-muted-foreground">
							Tier {context.level_to_tier(weapon.level_requirement)}
							{weapon.category.toLocaleLowerCase()}
						</p>
					</div>
				{:else}
					<p>{weapon.title}</p>
				{/if}
			</div>
		</td>
		<td class="py-2 pr-4 text-center whitespace-nowrap">{weapon.range}</td>
		<td class="py-2 pr-4 whitespace-nowrap">
			<RollButton
				type="duality"
				modifier={toHit}
				traitId={currentTrait}
				name={weapon.title}
				class="mx-auto"
			/>
		</td>
		<td class="py-2 pr-4 text-right whitespace-nowrap sm:text-center">
			<RollButton
				name="Damage"
				class="ml-auto sm:mx-auto"
				applyProficiency
				type="base"
				diceString={weapon.damage_dice}
				modifier={weapon.damage_bonus}
				damageType={currentDamageType}
			/>
		</td>
		<td class="hidden py-2 pr-4 text-right text-xs sm:table-cell">
			<div class="ml-auto w-min text-right">
				{weapon.features.map((f) => f.title).join(', ') || '—'}
			</div>
		</td>
	</tr>
{/if}
