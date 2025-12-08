<script lang="ts">
	import { cn, capitalize } from '$lib/utils';
	import Hand from '@lucide/svelte/icons/hand';
	import * as Select from '$lib/components/ui/select/';
	import type { Weapon, Traits, DamageTypes } from '$lib/types/compendium-types';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let {
		weapon,
		bind_choices = false,
		class: className = ''
	}: {
		weapon: Weapon;
		bind_choices?: boolean;
		class?: string;
	} = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);

	// Get weapon choices from inventory.primary_weapons[weapon.id].choices
	// Structure: inventory.primary_weapons[weapon.id].choices[choice_id] = selection_id[]
	let weaponChoices = $derived.by(() => {
		if (!character || !character.inventory.primary_weapons[weapon.compendium_id]) return null;
		return character.inventory.primary_weapons[weapon.compendium_id].choices;
	});

	// Get current damage type and trait values from inventory choices
	// The choices are stored as arrays, so we take the first element
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
</script>

<div
	class={cn(
		'relative flex min-h-10 items-center justify-end gap-3 rounded-md bg-card/50 px-4 py-2',
		className
	)}
>
	<p class="grow text-sm">{weapon.title}</p>

	<div class="flex flex-wrap items-center justify-end gap-1">
		<div class="flex items-center gap-1 rounded-full bg-primary-muted px-2 py-1 text-xs">
			{weapon.burden}<Hand class="size-3.5" />
		</div>
		{#if showDamageTypeSelect}
			<Select.Root
				type="single"
				value={currentDamageType || ''}
				onValueChange={(value) => {
					if (!character) return;
					const inventoryItem = character.inventory.primary_weapons[weapon.compendium_id];
					if (inventoryItem) {
						// Update the damage_type choice (stored as array)
						inventoryItem.choices['damage_type'] = value === '' ? [] : [value];
					}
				}}
			>
				<Select.Trigger
					class="h-auto min-h-0 w-auto rounded-full border-0 bg-primary-muted px-2 py-1 text-xs shadow-none hover:bg-primary-muted/80 [&_svg]:size-3 [&_svg]:opacity-50"
				>
					<span class="flex items-center gap-1">
						{weapon.damage_dice}
						{currentDamageType ? capitalize(currentDamageType) : '—'}
					</span>
				</Select.Trigger>
				<Select.Content>
					{#each weapon.available_damage_types as dt}
						<Select.Item value={dt}>{capitalize(dt)}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		{:else}
			<div class="rounded-full bg-primary-muted px-2 py-1 text-xs">
				{weapon.damage_dice}
				{currentDamageType ? capitalize(currentDamageType) : ''}
			</div>
		{/if}
		{#if showTraitSelect}
			<Select.Root
				type="single"
				value={currentTrait || ''}
				onValueChange={(value) => {
					if (!character) return;
					const inventoryItem = character.inventory.primary_weapons[weapon.compendium_id];
					if (inventoryItem) {
						// Update the trait choice (stored as array)
						inventoryItem.choices['trait'] = value === '' ? [] : [value];
					}
				}}
			>
				<Select.Trigger
					class="h-auto min-h-0 w-auto rounded-full border-0 bg-primary-muted px-2 py-1 text-xs shadow-none hover:bg-primary-muted/80 [&_svg]:size-3 [&_svg]:opacity-50"
				>
					<span>{currentTrait ? capitalize(currentTrait) : '—'}</span>
				</Select.Trigger>
				<Select.Content>
					{#each weapon.available_traits as t}
						<Select.Item value={t}>{capitalize(t)}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		{:else}
			<div class="rounded-full bg-primary-muted px-2 py-1 text-xs">
				{currentTrait ? capitalize(currentTrait) : '—'}
			</div>
		{/if}
		<div class="rounded-full bg-primary-muted px-2 py-1 text-xs">
			{weapon.range}
		</div>
	</div>
</div>
