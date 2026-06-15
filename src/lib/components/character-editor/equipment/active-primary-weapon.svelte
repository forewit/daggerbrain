<script lang="ts">
	import { cn, capitalize } from '$lib/utils';
	import Hand from '@lucide/svelte/icons/hand';
	import * as Select from '$lib/components/ui/select/';
	import type { DamageType, TraitId } from '@convex/schemas/rules';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let {
		inventory_id,
		bind_choices = false,
		class: className = ''
	}: {
		inventory_id: string;
		bind_choices?: boolean;
		class?: string;
	} = $props();

	const characterCtx = getCharacterContext();
	const derived_character_data = $derived(characterCtx.derived_character_data);
	const character = $derived(characterCtx.character);

	const equippedWeapon = $derived(
		derived_character_data?.derived_primary_weapon?.inventory_id === inventory_id
			? derived_character_data.derived_primary_weapon
			: undefined
	);

	// Prefer the derived equipped weapon so active displays reflect feature-based changes.
	const weapon = $derived(
		equippedWeapon ??
			(derived_character_data?.inventory_primary_weapons ?? []).find(
				(w) => w.inventory_id === inventory_id
			)
	);

	const inventoryItem = $derived(
		(character?.inventory.primary_weapons ?? []).find((w) => w.inventory_id === inventory_id)
	);

	// Get current damage type and trait values from inventory choices
	// The choices are stored as arrays, so we take the first element
	const currentDamageType = $derived.by(() => {
		const choices = inventoryItem?.choices['damage_type'];
		if (choices && choices.length > 0) {
			return choices[0] as DamageType;
		}
		return weapon?.available_damage_types[0];
	});

	const currentTrait = $derived.by(() => {
		const choices = inventoryItem?.choices['trait'];
		if (choices && choices.length > 0) {
			return choices[0] as TraitId;
		}
		return weapon?.available_traits[0];
	});

	// Determine if selects should be shown
	const showDamageTypeSelect = $derived(
		bind_choices && weapon && weapon.available_damage_types.length > 1
	);
	const showTraitSelect = $derived(bind_choices && weapon && weapon.available_traits.length > 1);
</script>

{#if weapon}
	<div
		class={cn(
			'relative flex min-h-10 items-center justify-end gap-3 rounded-md bg-card/80 px-4 py-2',
			className
		)}
	>
		<p class="grow text-sm">{weapon.title}</p>

		<div class="flex flex-wrap items-center justify-end gap-1">
			<div class="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
				{weapon.burden}<Hand class="size-3.5" />
			</div>
			{#if showDamageTypeSelect}
				<Select.Root
					type="single"
					value={currentDamageType || ''}
					onValueChange={(value) => {
						if (!inventoryItem) return;
						// Update the damage_type choice (stored as array)
						inventoryItem.choices['damage_type'] = value === '' ? [] : [value];
					}}
				>
					<Select.Trigger
						class="h-auto min-h-0 w-auto rounded-full border-0 bg-muted px-2 py-1 text-xs shadow-none hover:bg-primary-muted/80 [&_svg]:size-3 [&_svg]:opacity-50"
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
				<div class="rounded-full bg-muted px-2 py-1 text-xs">
					{weapon.damage_dice}
					{currentDamageType ? capitalize(currentDamageType) : ''}
				</div>
			{/if}
			{#if showTraitSelect}
				<Select.Root
					type="single"
					value={currentTrait || ''}
					onValueChange={(value) => {
						if (!inventoryItem) return;

						// Update the trait choice (stored as array)
						inventoryItem.choices['trait'] = value === '' ? [] : [value];
					}}
				>
					<Select.Trigger
						class="h-auto min-h-0 w-auto rounded-full border-0 bg-muted px-2 py-1 text-xs shadow-none hover:bg-primary-muted/80 [&_svg]:size-3 [&_svg]:opacity-50"
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
				<div class="rounded-full bg-muted px-2 py-1 text-xs">
					{currentTrait ? capitalize(currentTrait) : '—'}
				</div>
			{/if}
			<div class="rounded-full bg-muted px-2 py-1 text-xs">
				{weapon.range}
			</div>
		</div>
	</div>
{/if}
