<script lang="ts">
	import type { WeaponModifier, Ranges, DamageTypes, TraitIds } from '$lib/types/compendium-types';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import HomebrewCharacterConditions from './conditions-select.svelte';
	import DicePicker from '$lib/components/app/dice/dice-picker.svelte';
	import { capitalize } from '$lib/utils';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

	let {
		modifier = $bindable(),
		onModifierChange,
		onRemove
	}: {
		modifier?: WeaponModifier;
		onModifierChange?: (modifier: WeaponModifier) => void;
		onRemove?: (() => void) | undefined;
	} = $props();

	// Use internal state if callback is provided
	let internalModifier = $state<WeaponModifier | null>(null);
	let effectiveModifier = $derived(onModifierChange ? internalModifier : modifier || null);

	// Initialize internal modifier if using callback
	$effect(() => {
		if (onModifierChange) {
			if (modifier) {
				internalModifier = modifier;
			} else if (!internalModifier) {
				// Initialize with default
				internalModifier = {
					behaviour: 'bonus',
					character_conditions: [],
					target_weapon: 'all',
					target_stat: 'attack_roll',
					value: 0
				};
			}
		}
	});

	// Extract types from WeaponModifier
	type ModifierBehaviour = WeaponModifier['behaviour'];
	type ModifierTargetWeapon = WeaponModifier['target_weapon'];
	type ModifierTargetStat = WeaponModifier['target_stat'];

	// Behaviour options - extracted from type
	const behaviourOptions: readonly ModifierBehaviour[] = ['bonus', 'base', 'override'] as const;

	// Map of behaviour IDs to their display labels
	const behaviourLabels: Record<ModifierBehaviour, string> = {
		bonus: 'Bonus',
		base: 'Base',
		override: 'Override'
	};

	// Target weapon options
	const targetWeaponOptions: readonly ModifierTargetWeapon[] = [
		'primary',
		'secondary',
		'unarmed',
		'all'
	] as const;

	// Map of target weapon IDs to their display labels
	const targetWeaponLabels: Record<ModifierTargetWeapon, string> = {
		primary: 'Primary',
		secondary: 'Secondary',
		unarmed: 'Unarmed',
		all: 'All'
	};

	// Target stat options
	const targetStatOptions: readonly ModifierTargetStat[] = [
		'attack_roll',
		'damage_bonus',
		'damage_dice',
		'damage_type',
		'range',
		'trait'
	] as const;

	// Map of target stat IDs to their display labels
	const targetStatLabels: Record<ModifierTargetStat, string> = {
		attack_roll: 'Attack Roll',
		damage_bonus: 'Damage Bonus',
		damage_dice: 'Damage Dice',
		damage_type: 'Damage Type',
		range: 'Range',
		trait: 'Trait'
	};

	// Range options
	const rangeOptions: Ranges[] = ['Melee', 'Very Close', 'Close', 'Far', 'Very Far'];

	// Damage type options
	const damageTypeOptions: DamageTypes[] = ['phy', 'mag'];

	// Map of damage type IDs to their display labels
	const damageTypeMap: Record<DamageTypes, string> = {
		phy: 'Physical',
		mag: 'Magical'
	};

	// Trait options - using TraitIds type
	const traitOptions: TraitIds[] = [
		'agility',
		'strength',
		'finesse',
		'instinct',
		'presence',
		'knowledge'
	];

	// Get current target stat
	let currentTargetStat = $derived(effectiveModifier?.target_stat || 'attack_roll');

	// Track UI selection state (can be empty for "-- none selected --")
	let selectedTargetStat = $state<string>('');
	let isExplicitlyNoneSelected = $state(false);

	// Get current target stat from modifier
	let currentTargetStatValue = $derived(effectiveModifier?.target_stat || '');

	// Sync selectedTargetStat with currentTargetStatValue when modifier changes externally
	// (but not if user explicitly selected "-- none selected --")
	$effect(() => {
		if (
			!isExplicitlyNoneSelected &&
			currentTargetStatValue &&
			selectedTargetStat !== currentTargetStatValue
		) {
			selectedTargetStat = currentTargetStatValue;
		}
	});

	// Initialize modifier if needed
	$effect(() => {
		if (!modifier) {
			modifier = {
				behaviour: 'bonus',
				character_conditions: [],
				target_weapon: 'all',
				target_stat: 'attack_roll',
				value: 0
			};
		}
	});

	// Update target stat
	function updateTargetStat(newTargetStat: ModifierTargetStat | '') {
		if (!modifier) return;
		// If empty string, don't update modifier (just update UI to show "-- none selected --")
		if (newTargetStat === '') {
			return;
		}
		// Preserve base properties
		const baseProps = {
			behaviour: modifier.behaviour,
			character_conditions: modifier.character_conditions,
			target_weapon: modifier.target_weapon
		};

		// Set target stat-specific properties
		if (newTargetStat === 'attack_roll' || newTargetStat === 'damage_bonus') {
			modifier = {
				...baseProps,
				target_stat: newTargetStat,
				value: 0
			};
		} else if (newTargetStat === 'damage_dice') {
			modifier = {
				...baseProps,
				target_stat: 'damage_dice',
				dice: ''
			};
		} else if (newTargetStat === 'damage_type') {
			modifier = {
				...baseProps,
				target_stat: 'damage_type',
				damage_type: 'phy'
			};
		} else if (newTargetStat === 'range') {
			modifier = {
				...baseProps,
				target_stat: 'range',
				range: 'Melee'
			};
		} else if (newTargetStat === 'trait') {
			modifier = {
				...baseProps,
				target_stat: 'trait',
				trait: 'agility'
			};
		}
	}
</script>

<div class="flex flex-col gap-3 rounded-lg border bg-muted p-3">
	<!-- Target Weapon -->
	<div class="flex flex-col gap-1">
		<label for="target-weapon-select" class="text-xs font-medium text-muted-foreground"
			>Target weapon</label
		>
		<Select.Root
			type="single"
			value={modifier?.target_weapon ?? 'all'}
			onValueChange={(value) => {
				if (value && modifier && targetWeaponOptions.includes(value as ModifierTargetWeapon)) {
					modifier = {
						...modifier,
						target_weapon: value as ModifierTargetWeapon
					};
				}
			}}
		>
			<Select.Trigger id="target-weapon-select" class="w-full">
				<p class="truncate">
					{targetWeaponLabels[modifier?.target_weapon ?? 'all']}
				</p>
			</Select.Trigger>
			<Select.Content>
				{#each targetWeaponOptions as weapon}
					<Select.Item value={weapon}>{targetWeaponLabels[weapon]}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<!-- Target Stat -->
	<div class="flex flex-col gap-1">
		<label for="target-stat-select" class="text-xs font-medium text-muted-foreground"
			>Weapon stat to modify</label
		>
		<Select.Root
			type="single"
			value={selectedTargetStat || ''}
			onValueChange={(value) => {
				const newValue = value || '';
				selectedTargetStat = newValue;
				isExplicitlyNoneSelected = newValue === '';
				updateTargetStat(newValue as ModifierTargetStat | '');
			}}
		>
			<Select.Trigger id="target-stat-select" class="w-full">
				<p class="truncate">
					{selectedTargetStat &&
					targetStatOptions.includes(selectedTargetStat as ModifierTargetStat)
						? targetStatLabels[selectedTargetStat as ModifierTargetStat]
						: 'None selected'}
				</p>
			</Select.Trigger>
			<Select.Content>
				<Select.Item
					value=""
					disabled={selectedTargetStat === ''}
					class="justify-center text-muted-foreground">-- none selected --</Select.Item
				>
				{#each targetStatOptions as stat}
					<Select.Item value={stat}>{targetStatLabels[stat]}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<!-- Target Stat-specific fields -->
	{#if currentTargetStat === 'trait' && modifier && modifier.target_stat === 'trait'}
		{@const traitTargetModifier = modifier}
		<div class="flex flex-col gap-1">
			<label for="target-trait-select" class="text-xs font-medium text-muted-foreground"
				>Choose a trait</label
			>
			<Select.Root
				type="single"
				value={traitTargetModifier.trait}
				onValueChange={(value) => {
					if (value && traitOptions.includes(value as TraitIds)) {
						modifier = {
							...traitTargetModifier,
							trait: value as TraitIds
						};
					}
				}}
			>
				<Select.Trigger id="target-trait-select" class="w-full">
					<p class="truncate">{capitalize(traitTargetModifier.trait)}</p>
				</Select.Trigger>
				<Select.Content>
					{#each traitOptions as trait}
						<Select.Item value={trait}>{capitalize(trait)}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	{/if}

	<!-- Behaviour -->
	<div class="flex flex-col gap-1">
		<label for="behaviour-select" class="text-xs font-medium text-muted-foreground">Behaviour</label
		>
		<Select.Root
			type="single"
			value={modifier?.behaviour ?? 'bonus'}
			onValueChange={(value) => {
				if (value && modifier && behaviourOptions.includes(value as ModifierBehaviour)) {
					modifier = { ...modifier, behaviour: value as ModifierBehaviour };
				}
			}}
		>
			<Select.Trigger id="behaviour-select" class="w-full">
				<p class="truncate">{behaviourLabels[modifier?.behaviour ?? 'bonus']}</p>
			</Select.Trigger>
			<Select.Content>
				{#each behaviourOptions as behaviour}
					<Select.Item value={behaviour}>{behaviourLabels[behaviour]}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<!-- Target Stat-specific fields -->
	{#if (currentTargetStat === 'attack_roll' || currentTargetStat === 'damage_bonus') && modifier && (modifier.target_stat === 'attack_roll' || modifier.target_stat === 'damage_bonus')}
		{@const valueModifier = modifier}
		<div class="flex flex-col gap-1">
			<label for="weapon-value-input" class="text-xs font-medium text-muted-foreground">Value</label
			>
			<Input
				id="weapon-value-input"
				type="number"
				value={String(valueModifier.value)}
				oninput={(e) => {
					modifier = {
						...valueModifier,
						value: Number(e.currentTarget.value)
					};
				}}
			/>
		</div>
	{:else if currentTargetStat === 'damage_dice' && modifier && modifier.target_stat === 'damage_dice'}
		{@const diceModifier = modifier}
		<div class="flex flex-col gap-2">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<label for="dice-picker" class="text-xs font-medium text-muted-foreground">Dice</label>
					{#if diceModifier.dice}
						<span class="text-xs text-muted-foreground">({diceModifier.dice})</span>
					{/if}
				</div>
				<button
					type="button"
					disabled={!diceModifier.dice || diceModifier.dice === ''}
					class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:hidden"
					onclick={() => {
						modifier = {
							...diceModifier,
							dice: ''
						};
					}}
					title="Reset dice"
				>
					Reset
					<RotateCcw class="size-3.5" />
				</button>
			</div>
			<DicePicker
				value={diceModifier.dice || ''}
				onChange={(v) => {
					modifier = {
						...diceModifier,
						dice: v
					};
				}}
			/>
		</div>
	{:else if currentTargetStat === 'damage_type' && modifier && modifier.target_stat === 'damage_type'}
		{@const damageTypeModifier = modifier}
		<div class="flex flex-col gap-1">
			<label for="damage-type-select" class="text-xs font-medium text-muted-foreground"
				>Damage Type</label
			>
			<Select.Root
				type="single"
				value={damageTypeModifier.damage_type}
				onValueChange={(value) => {
					if (value && damageTypeOptions.includes(value as DamageTypes)) {
						modifier = {
							...damageTypeModifier,
							damage_type: value as DamageTypes
						};
					}
				}}
			>
				<Select.Trigger id="damage-type-select" class="w-full">
					<p class="truncate">{damageTypeMap[damageTypeModifier.damage_type]}</p>
				</Select.Trigger>
				<Select.Content>
					{#each damageTypeOptions as type}
						<Select.Item value={type}>{damageTypeMap[type]}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	{:else if currentTargetStat === 'range' && modifier && modifier.target_stat === 'range'}
		{@const rangeModifier = modifier}
		<div class="flex flex-col gap-1">
			<label for="range-select" class="text-xs font-medium text-muted-foreground">Range</label>
			<Select.Root
				type="single"
				value={rangeModifier.range}
				onValueChange={(value) => {
					if (value && rangeOptions.includes(value as Ranges)) {
						modifier = {
							...rangeModifier,
							range: value as Ranges
						};
					}
				}}
			>
				<Select.Trigger id="range-select" class="w-full">
					<p class="truncate">{rangeModifier.range}</p>
				</Select.Trigger>
				<Select.Content>
					{#each rangeOptions as range}
						<Select.Item value={range}>{range}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	{/if}

	<!-- Character Conditions -->
	{#if modifier}
		<div class="flex flex-col gap-1">
			<p class="text-xs font-medium text-muted-foreground">Conditions</p>
			<HomebrewCharacterConditions bind:conditions={modifier.character_conditions} />
		</div>
	{/if}

	<!-- Remove Button -->
	{#if onRemove}
		<Button
			type="button"
			size="sm"
			variant="link"
			onclick={onRemove}
			class="mx-auto w-min text-destructive"
		>
			Delete Weapon Modifier
		</Button>
	{/if}
</div>
