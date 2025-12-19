<script lang="ts">
	import type {
		CharacterModifier,
		CharacterCondition,
		TraitIds
	} from '$lib/types/compendium-types';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import HomebrewCharacterConditions from './conditions-select.svelte';
	import { cn, capitalize } from '$lib/utils';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';

	let {
		modifier = $bindable(),
		onModifierChange,
		onRemove
	}: {
		modifier?: CharacterModifier;
		onModifierChange?: (modifier: CharacterModifier) => void;
		onRemove?: (() => void) | undefined;
	} = $props();

	// Use internal state if callback is provided
	let internalModifier = $state<CharacterModifier | null>(null);
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
					type: 'flat',
					value: 0,
					target: 'evasion'
				};
			}
		}
	});

	// Update modifier helper
	function updateModifier(newModifier: CharacterModifier) {
		if (onModifierChange) {
			internalModifier = newModifier;
			onModifierChange(newModifier);
		} else {
			modifier = newModifier;
		}
	}

	const compendium = getCompendiumContext();

	// Extract types from CharacterModifier
	type ModifierBehaviour = CharacterModifier['behaviour'];
	type ModifierType = CharacterModifier['type'];
	type ModifierTarget = CharacterModifier['target'];

	// Filter out removed experience targets - only keep simple targets and trait
	type SimpleTarget = Exclude<
		ModifierTarget,
		| 'trait'
		| 'experience_from_domain_card_choice_selection'
		| 'experience_from_ancestry_card_choice_selection'
	>;
	type ValidTarget = SimpleTarget | 'trait';

	// Behaviour options - extracted from type
	const behaviourOptions: readonly ModifierBehaviour[] = ['bonus', 'base', 'override'] as const;

	// Map of behaviour IDs to their display labels
	const behaviourLabels: Record<ModifierBehaviour, string> = {
		bonus: 'Bonus',
		base: 'Base',
		override: 'Override'
	};

	// Type options - extracted from type
	const typeOptions: readonly ModifierType[] = [
		'flat',
		'derived_from_trait',
		'derived_from_proficiency',
		'derived_from_level'
	] as const;

	// Map of type IDs to their display labels
	const typeLabels: Record<ModifierType, string> = {
		flat: 'Flat',
		derived_from_trait: 'Derived from Trait',
		derived_from_proficiency: 'Derived from Proficiency',
		derived_from_level: 'Derived from Level'
	};

	// Target options (simple enum targets only, excluding trait and removed experience options)
	const simpleTargetOptions: readonly SimpleTarget[] = [
		'evasion',
		'max_hp',
		'max_stress',
		'max_experiences',
		'major_damage_threshold',
		'severe_damage_threshold',
		'primary_class_mastery_level',
		'secondary_class_mastery_level',
		'max_loadout',
		'max_hope',
		'proficiency',
		'max_armor',
		'max_burden',
		'spellcast_roll_bonus',
		'max_short_rest_actions',
		'max_long_rest_actions'
	] as const;

	// Map of target IDs to their display labels
	const targetLabels: Record<ValidTarget, string> = {
		evasion: 'Evasion',
		max_hp: 'Max HP',
		max_stress: 'Max Stress',
		max_experiences: 'Max Experiences',
		major_damage_threshold: 'Major Damage Threshold',
		severe_damage_threshold: 'Severe Damage Threshold',
		primary_class_mastery_level: 'Primary Class Mastery Level',
		secondary_class_mastery_level: 'Secondary Class Mastery Level',
		max_loadout: 'Max Loadout',
		max_hope: 'Max Hope',
		proficiency: 'Proficiency',
		max_armor: 'Max Armor',
		max_burden: 'Max Burden',
		spellcast_roll_bonus: 'Spellcast Roll Bonus',
		max_short_rest_actions: 'Max Short Rest Actions',
		max_long_rest_actions: 'Max Long Rest Actions',
		trait: 'Trait'
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

	// Get current type
	let currentType = $derived(effectiveModifier?.type || 'flat');

	// Track UI selection state (can be empty for "-- none selected --")
	let selectedTarget = $state<string>('');
	let isExplicitlyNoneSelected = $state(false);

	// Get current target from modifier
	let currentTarget = $derived(effectiveModifier?.target || '');

	// Sync selectedTarget with currentTarget when modifier changes externally
	// (but not if user explicitly selected "-- none selected --")
	$effect(() => {
		if (!isExplicitlyNoneSelected && currentTarget && selectedTarget !== currentTarget) {
			selectedTarget = currentTarget;
		}
	});

	// Initialize modifier if needed
	$effect(() => {
		if (!modifier) {
			modifier = {
				behaviour: 'bonus',
				character_conditions: [],
				type: 'flat',
				value: 0,
				target: 'evasion'
			};
		}
	});

	// Update type
	function updateType(newType: ModifierType) {
		if (!modifier) return;
		// Preserve base properties
		const baseProps = {
			behaviour: modifier.behaviour,
			character_conditions: modifier.character_conditions,
			target: modifier.target
		};

		// Set type-specific properties
		if (newType === 'derived_from_trait') {
			modifier = {
				...baseProps,
				type: 'derived_from_trait',
				trait: 'agility',
				multiplier: 1
			} as CharacterModifier;
		} else if (newType === 'flat') {
			modifier = {
				...baseProps,
				type: 'flat',
				value: 0
			} as CharacterModifier;
		} else if (newType === 'derived_from_proficiency') {
			modifier = {
				...baseProps,
				type: 'derived_from_proficiency',
				multiplier: 1
			} as CharacterModifier;
		} else if (newType === 'derived_from_level') {
			modifier = {
				...baseProps,
				type: 'derived_from_level',
				multiplier: 1
			} as CharacterModifier;
		}
	}

	// Update target
	function updateTarget(newTarget: ValidTarget | '') {
		if (!modifier) return;
		// If empty string, don't update modifier (just update UI to show "-- none selected --")
		if (newTarget === '') {
			return;
		}
		// Preserve base properties
		const baseProps = {
			behaviour: modifier.behaviour,
			character_conditions: modifier.character_conditions,
			type: modifier.type
		};

		// Preserve type-specific properties
		const typeProps: any = {};
		if (modifier.type === 'derived_from_trait') {
			typeProps.trait = modifier.trait;
			typeProps.multiplier = modifier.multiplier;
		} else if (modifier.type === 'flat') {
			typeProps.value = modifier.value;
		} else if (
			modifier.type === 'derived_from_proficiency' ||
			modifier.type === 'derived_from_level'
		) {
			typeProps.multiplier = modifier.multiplier;
		}

		// Set target-specific properties
		if (newTarget === 'trait') {
			modifier = {
				...baseProps,
				...typeProps,
				target: 'trait',
				trait: 'agility'
			} as CharacterModifier;
		} else {
			// Simple target
			modifier = {
				...baseProps,
				...typeProps,
				target: newTarget
			} as CharacterModifier;
		}
	}
</script>

<div class="flex flex-col gap-3 rounded-lg border bg-muted p-3">
	<!-- Target -->
	<div class="flex flex-col gap-1">
		<label for="target-select" class="text-xs font-medium text-muted-foreground"
			>Character attribute to modify</label
		>
		<Select.Root
			type="single"
			value={selectedTarget || ''}
			onValueChange={(value) => {
				const newValue = value || '';
				selectedTarget = newValue;
				isExplicitlyNoneSelected = newValue === '';
				updateTarget(newValue as ValidTarget | '');
			}}
		>
			<Select.Trigger id="target-select" class="w-full">
				<p class="truncate">
					{selectedTarget &&
					(simpleTargetOptions.includes(selectedTarget as SimpleTarget) ||
						selectedTarget === 'trait')
						? targetLabels[selectedTarget as ValidTarget]
						: 'None selected'}
				</p>
			</Select.Trigger>
			<Select.Content>
				<Select.Item
					value=""
					disabled={selectedTarget === ''}
					class="justify-center text-muted-foreground">-- none selected --</Select.Item
				>
				{#each simpleTargetOptions as target}
					<Select.Item value={target}>{targetLabels[target]}</Select.Item>
				{/each}
				<Select.Item value="trait">{targetLabels.trait}</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>

	<!-- Target-specific fields -->
	{#if currentTarget === 'trait' && modifier && modifier.target === 'trait'}
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

	<!-- Behaviour and Type -->
	<div class="grid grid-cols-2 gap-2">
		<div class="flex flex-col gap-1">
			<label for="behaviour-select" class="text-xs font-medium text-muted-foreground"
				>Behaviour</label
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
		<div class="flex flex-col gap-1">
			<label for="type-select" class="text-xs font-medium text-muted-foreground">Type</label>
			<Select.Root
				type="single"
				value={currentType}
				onValueChange={(value) => {
					if (value) {
						updateType(value as ModifierType);
					}
				}}
			>
				<Select.Trigger id="type-select" class="w-full">
					<p class="truncate">{typeLabels[currentType]}</p>
				</Select.Trigger>
				<Select.Content>
					{#each typeOptions as type}
						<Select.Item value={type}>{typeLabels[type]}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<!-- Type-specific fields -->
	{#if currentType === 'derived_from_trait' && modifier && modifier.type === 'derived_from_trait'}
		{@const traitModifier = modifier}
		<div class="grid grid-cols-2 gap-2">
			<div class="flex flex-col gap-1">
				<label for="trait-select" class="text-xs font-medium text-muted-foreground">Trait</label>
				<Select.Root
					type="single"
					value={traitModifier.trait}
					onValueChange={(value) => {
						if (value && traitOptions.includes(value as TraitIds)) {
							modifier = {
								...traitModifier,
								trait: value as TraitIds
							};
						}
					}}
				>
					<Select.Trigger id="trait-select" class="w-full">
						<p class="truncate">{capitalize(traitModifier.trait)}</p>
					</Select.Trigger>
					<Select.Content>
						{#each traitOptions as trait}
							<Select.Item value={trait}>{capitalize(trait)}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-col gap-1">
				<label for="trait-multiplier-input" class="text-xs font-medium text-muted-foreground"
					>Multiplier</label
				>
				<Input
					id="trait-multiplier-input"
					type="number"
					value={String(traitModifier.multiplier)}
					oninput={(e) => {
						const intValue = parseInt(e.currentTarget.value, 10) || 0;
						modifier = {
							...traitModifier,
							multiplier: intValue
						};
					}}
					step="1"
				/>
			</div>
		</div>
	{:else if currentType === 'flat' && modifier && modifier.type === 'flat'}
		{@const flatModifier = modifier}
		<div class="flex flex-col gap-1">
			<label for="flat-value-input" class="text-xs font-medium text-muted-foreground">Value</label>
			<Input
				id="flat-value-input"
				type="number"
				value={String(flatModifier.value)}
				oninput={(e) => {
					modifier = {
						...flatModifier,
						value: Number(e.currentTarget.value)
					};
				}}
			/>
		</div>
	{:else if (currentType === 'derived_from_proficiency' || currentType === 'derived_from_level') && modifier && (modifier.type === 'derived_from_proficiency' || modifier.type === 'derived_from_level')}
		{@const multiplierModifier = modifier}
		<div class="flex flex-col gap-1">
			<label for="multiplier-input" class="text-xs font-medium text-muted-foreground"
				>Multiplier</label
			>
			<Input
				id="multiplier-input"
				type="number"
				value={String(multiplierModifier.multiplier)}
				oninput={(e) => {
					const intValue = parseInt(e.currentTarget.value, 10) || 0;
					modifier = {
						...multiplierModifier,
						multiplier: intValue
					};
				}}
				step="1"
			/>
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
			Delete Character Modifier
		</Button>
	{/if}
</div>
