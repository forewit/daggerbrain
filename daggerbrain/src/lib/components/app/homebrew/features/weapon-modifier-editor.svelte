<script lang="ts">
	import type {
		WeaponModifier,
		Ranges,
		DamageTypes,
		TraitIds
	} from '@shared/types/compendium.types';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import HomebrewCharacterConditions from './conditions-select.svelte';
	import DicePicker from '$lib/components/app/dice/dice-picker.svelte';
	import { capitalize, cn } from '$lib/utils';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

	let {
		modifier = $bindable(),
		onModifierChange,
		onRemove,
		errors
	}: {
		modifier?: WeaponModifier;
		onModifierChange?: (modifier: WeaponModifier) => void;
		onRemove?: (() => void) | undefined;
		errors?: string[];
	} = $props();

	// Use internal state if callback is provided
	let internalModifier = $state<WeaponModifier | null>(null);
	let effectiveModifier = $derived(onModifierChange ? internalModifier : modifier || null);

	// Initialize internal modifier if using callback
	$effect(() => {
		if (onModifierChange) {
			if (modifier) {
				internalModifier = modifier;
			}
			// Don't auto-initialize - wait for user to select a target stat
		}
	});

	// Update modifier helper
	function updateModifier(newModifier: WeaponModifier) {
		if (onModifierChange) {
			internalModifier = newModifier;
			onModifierChange(newModifier);
		} else {
			modifier = newModifier;
		}
	}

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
	let currentTargetStat = $derived(effectiveModifier?.target_stat || '');

	// Track UI selection state (can be empty for "-- none selected --")
	let selectedTargetStat = $state<string>('');
	let isExplicitlyNoneSelected = $state(true); // Start with "none selected" by default

	// Get current target stat from modifier
	let currentTargetStatValue = $derived(effectiveModifier?.target_stat || '');

	// Initialize selectedTargetStat from modifier on mount or when modifier changes externally
	$effect(() => {
		if (currentTargetStatValue) {
			// If we have a value in the modifier, sync it to the UI state
			if (selectedTargetStat !== currentTargetStatValue) {
				selectedTargetStat = currentTargetStatValue;
				isExplicitlyNoneSelected = false;
			}
		} else if (!isExplicitlyNoneSelected && !currentTargetStatValue) {
			// If modifier has no value and user hasn't explicitly selected "none",
			// keep UI in sync (but don't change isExplicitlyNoneSelected)
			selectedTargetStat = '';
		}
	});

	// Don't auto-initialize modifier - let it remain undefined until user selects a target stat

	// Update target stat
	function updateTargetStat(newTargetStat: ModifierTargetStat | '') {
		// If empty string, don't update modifier (just update UI to show "-- none selected --")
		if (newTargetStat === '') {
			return;
		}

		// Get current modifier or create default base properties
		const baseProps = effectiveModifier
			? {
					behaviour: effectiveModifier.behaviour,
					character_conditions: effectiveModifier.character_conditions,
					target_weapon: effectiveModifier.target_weapon
				}
			: {
					behaviour: 'bonus' as const,
					character_conditions: [],
					target_weapon: 'all' as const
				};

		// Set target stat-specific properties
		// Preserve existing values when compatible, otherwise use defaults
		let newModifier: WeaponModifier;
		if (newTargetStat === 'attack_roll' || newTargetStat === 'damage_bonus') {
			// Preserve value if switching between attack_roll and damage_bonus
			const existingValue =
				effectiveModifier &&
				(effectiveModifier.target_stat === 'attack_roll' ||
					effectiveModifier.target_stat === 'damage_bonus')
					? effectiveModifier.value
					: 0;
			newModifier = {
				...baseProps,
				target_stat: newTargetStat,
				value: existingValue
			};
		} else if (newTargetStat === 'damage_dice') {
			// Preserve dice if already set
			const existingDice =
				effectiveModifier && effectiveModifier.target_stat === 'damage_dice'
					? effectiveModifier.dice
					: '';
			newModifier = {
				...baseProps,
				target_stat: 'damage_dice',
				dice: existingDice
			};
		} else if (newTargetStat === 'damage_type') {
			// Preserve damage_type if already set
			const existingDamageType =
				effectiveModifier && effectiveModifier.target_stat === 'damage_type'
					? effectiveModifier.damage_type
					: 'phy';
			newModifier = {
				...baseProps,
				target_stat: 'damage_type',
				damage_type: existingDamageType
			};
		} else if (newTargetStat === 'range') {
			// Preserve range if already set
			const existingRange =
				effectiveModifier && effectiveModifier.target_stat === 'range'
					? effectiveModifier.range
					: 'Melee';
			newModifier = {
				...baseProps,
				target_stat: 'range',
				range: existingRange
			};
		} else if (newTargetStat === 'trait') {
			// Preserve trait if already set
			const existingTrait =
				effectiveModifier && effectiveModifier.target_stat === 'trait'
					? effectiveModifier.trait
					: 'agility';
			newModifier = {
				...baseProps,
				target_stat: 'trait',
				trait: existingTrait
			};
		} else {
			return;
		}

		updateModifier(newModifier);
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
			value={effectiveModifier?.target_weapon ?? 'all'}
			onValueChange={(value) => {
				if (
					value &&
					effectiveModifier &&
					targetWeaponOptions.includes(value as ModifierTargetWeapon)
				) {
					updateModifier({ ...effectiveModifier, target_weapon: value as ModifierTargetWeapon });
				}
			}}
		>
			<Select.Trigger id="target-weapon-select" class="w-full">
				<p class="truncate">
					{targetWeaponLabels[effectiveModifier?.target_weapon ?? 'all']}
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
		<label
			for="target-stat-select"
			class={cn(
				'text-xs font-medium text-muted-foreground',
				errors && errors.length > 0 && 'text-destructive'
			)}>Weapon stat to modify</label
		>
		<Select.Root
			type="single"
			value={selectedTargetStat || ''}
			onValueChange={(value) => {
				if (value) {
					const newValue = value;
					selectedTargetStat = newValue;
					isExplicitlyNoneSelected = false;
					updateTargetStat(newValue as ModifierTargetStat);
				}
			}}
		>
			<Select.Trigger
				id="target-stat-select"
				class={cn('w-full', errors && errors.length > 0 && 'border-destructive')}
			>
				<p class="truncate">
					{selectedTargetStat &&
					targetStatOptions.includes(selectedTargetStat as ModifierTargetStat)
						? targetStatLabels[selectedTargetStat as ModifierTargetStat]
						: 'None selected'}
				</p>
			</Select.Trigger>
			<Select.Content>
				{#each targetStatOptions as stat}
					<Select.Item value={stat}>{targetStatLabels[stat]}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<!-- Target Stat-specific fields -->
	{#if currentTargetStat === 'trait' && effectiveModifier && effectiveModifier.target_stat === 'trait'}
		{@const traitTargetModifier = effectiveModifier}
		<div class="flex flex-col gap-1">
			<label for="target-trait-select" class="text-xs font-medium text-muted-foreground"
				>Choose a trait</label
			>
			<Select.Root
				type="single"
				value={traitTargetModifier.trait}
				onValueChange={(value) => {
					if (value && traitOptions.includes(value as TraitIds)) {
						updateModifier({
							...traitTargetModifier,
							trait: value as TraitIds
						});
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
			value={effectiveModifier?.behaviour ?? 'bonus'}
			onValueChange={(value) => {
				if (value && effectiveModifier && behaviourOptions.includes(value as ModifierBehaviour)) {
					updateModifier({ ...effectiveModifier, behaviour: value as ModifierBehaviour });
				}
			}}
		>
			<Select.Trigger id="behaviour-select" class="w-full">
				<p class="truncate">{behaviourLabels[effectiveModifier?.behaviour ?? 'bonus']}</p>
			</Select.Trigger>
			<Select.Content>
				{#each behaviourOptions as behaviour}
					<Select.Item value={behaviour}>{behaviourLabels[behaviour]}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<!-- Target Stat-specific fields -->
	{#if (currentTargetStat === 'attack_roll' || currentTargetStat === 'damage_bonus') && effectiveModifier && (effectiveModifier.target_stat === 'attack_roll' || effectiveModifier.target_stat === 'damage_bonus')}
		{@const valueModifier = effectiveModifier}
		<div class="flex flex-col gap-1">
			<label for="weapon-value-input" class="text-xs font-medium text-muted-foreground">Value</label
			>
			<Input
				id="weapon-value-input"
				type="number"
				value={String(valueModifier.value)}
				oninput={(e) => {
					updateModifier({
						...valueModifier,
						value: Number(e.currentTarget.value)
					});
				}}
			/>
		</div>
	{:else if currentTargetStat === 'damage_dice' && effectiveModifier && effectiveModifier.target_stat === 'damage_dice'}
		{@const diceModifier = effectiveModifier}
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
						updateModifier({
							...diceModifier,
							dice: ''
						});
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
					updateModifier({
						...diceModifier,
						dice: v
					});
				}}
			/>
		</div>
	{:else if currentTargetStat === 'damage_type' && effectiveModifier && effectiveModifier.target_stat === 'damage_type'}
		{@const damageTypeModifier = effectiveModifier}
		<div class="flex flex-col gap-1">
			<label for="damage-type-select" class="text-xs font-medium text-muted-foreground"
				>Damage Type</label
			>
			<Select.Root
				type="single"
				value={damageTypeModifier.damage_type}
				onValueChange={(value) => {
					if (value && damageTypeOptions.includes(value as DamageTypes)) {
						updateModifier({
							...damageTypeModifier,
							damage_type: value as DamageTypes
						});
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
	{:else if currentTargetStat === 'range' && effectiveModifier && effectiveModifier.target_stat === 'range'}
		{@const rangeModifier = effectiveModifier}
		<div class="flex flex-col gap-1">
			<label for="range-select" class="text-xs font-medium text-muted-foreground">Range</label>
			<Select.Root
				type="single"
				value={rangeModifier.range}
				onValueChange={(value) => {
					if (value && rangeOptions.includes(value as Ranges)) {
						updateModifier({
							...rangeModifier,
							range: value as Ranges
						});
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
