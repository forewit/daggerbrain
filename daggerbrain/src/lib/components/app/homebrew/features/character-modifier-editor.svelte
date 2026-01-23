<script lang="ts">
	import type {
		CharacterModifier,
		CharacterCondition,
		TraitIds,
		DomainCardChoice
	} from '@shared/types/compendium.types';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import HomebrewCharacterConditions from './conditions-select.svelte';
	import { CONDITIONS_CHOICE_REQUIRED } from '../form-schemas';
	import { cn, capitalize } from '$lib/utils';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';

	let {
		modifier = $bindable(),
		onModifierChange,
		onRemove,
		errors,
		domainCardChoices = $bindable(),
		domainCardId
	}: {
		modifier?: CharacterModifier;
		onModifierChange?: (modifier: CharacterModifier) => void;
		onRemove?: (() => void) | undefined;
		errors?: string[];
		domainCardChoices?: DomainCardChoice[];
		domainCardId?: string;
	} = $props();

	// Use internal state if callback is provided
	let internalModifier = $state<CharacterModifier | null>(null);
	let effectiveModifier = $derived(onModifierChange ? internalModifier : modifier || null);

	// Initialize internal modifier if using callback
	$effect(() => {
		if (onModifierChange) {
			if (modifier) {
				internalModifier = modifier;
			}
			// Don't auto-initialize - wait for user to select a target
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

	// Split errors: target select vs conditions choice (routed to conditions-select)
	let targetErrors = $derived(errors?.filter((e) => e !== CONDITIONS_CHOICE_REQUIRED) ?? []);
	let conditionsChoiceError = $derived(errors?.find((e) => e === CONDITIONS_CHOICE_REQUIRED));

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
	type ValidTarget = SimpleTarget | 'trait' | 'experience_from_domain_card_choice_selection';

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
		trait: 'Trait',
		experience_from_domain_card_choice_selection: 'Experience'
	};

	// Generate sequential experience choice ID
	function generateExperienceChoiceId(choices: DomainCardChoice[]): string {
		let counter = 1;
		let candidateId = `experience_${counter}`;
		while (choices.some((c) => c.choice_id === candidateId)) {
			counter++;
			candidateId = `experience_${counter}`;
		}
		return candidateId;
	}

	// Ensure experience choice exists and return its choice_id
	function ensureExperienceChoice(max: number): string {
		if (!domainCardChoices) {
			domainCardChoices = [];
		}

		const existingChoiceId =
			effectiveModifier?.target === 'experience_from_domain_card_choice_selection'
				? (effectiveModifier as any).choice_id
				: null;

		// If modifier already has a choice_id, try to find or create that specific choice
		if (existingChoiceId) {
			const existingChoice = domainCardChoices.find(
				(c) => c.choice_id === existingChoiceId && c.type === 'experience'
			);

			if (existingChoice) {
				// Update max value by creating a new array
				domainCardChoices = domainCardChoices.map((c) =>
					c.choice_id === existingChoiceId && c.type === 'experience'
						? { ...c, max }
						: c
				);
				return existingChoiceId;
			} else {
				// Choice ID exists in modifier but choice doesn't exist - create it
				const newChoice: DomainCardChoice = {
					choice_id: existingChoiceId,
					type: 'experience',
					max: max,
					conditional_choice: null
				};
				domainCardChoices = [...domainCardChoices, newChoice];
				return existingChoiceId;
			}
		}

		// No existing choice_id - create new one with generated ID
		const newChoiceId = generateExperienceChoiceId(domainCardChoices);
		const newChoice: DomainCardChoice = {
			choice_id: newChoiceId,
			type: 'experience',
			max: max,
			conditional_choice: null
		};

		domainCardChoices = [...domainCardChoices, newChoice];
		return newChoiceId;
	}

	// Remove experience choice when modifier is removed
	function removeExperienceChoice(choiceId: string) {
		if (!domainCardChoices || !choiceId) return;
		domainCardChoices = domainCardChoices.filter((c) => c.choice_id !== choiceId);
	}

	// Get experience-type choices for dropdown

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
	let isExplicitlyNoneSelected = $state(true); // Start with "none selected" by default

	// Get current target from modifier
	let currentTarget = $derived(effectiveModifier?.target || '');

	// Initialize selectedTarget from modifier on mount or when modifier changes externally
	$effect(() => {
		if (currentTarget) {
			// If we have a value in the modifier, sync it to the UI state
			if (selectedTarget !== currentTarget) {
				selectedTarget = currentTarget;
				isExplicitlyNoneSelected = false;
			}
		} else if (!isExplicitlyNoneSelected && !currentTarget) {
			// If modifier has no value and user hasn't explicitly selected "none",
			// keep UI in sync (but don't change isExplicitlyNoneSelected)
			selectedTarget = '';
		}
	});

	// Don't auto-initialize modifier - let it remain undefined until user selects a target

	// Update type
	function updateType(newType: ModifierType) {
		// Need a modifier with a target to update type
		if (!effectiveModifier) {
			return;
		}

		// Preserve base properties
		const baseProps = {
			behaviour: effectiveModifier.behaviour,
			character_conditions: effectiveModifier.character_conditions,
			target: effectiveModifier.target
		};

		// Set type-specific properties
		let newModifier: CharacterModifier;
		if (newType === 'derived_from_trait') {
			newModifier = {
				...baseProps,
				type: 'derived_from_trait',
				trait: 'agility',
				multiplier: 1
			} as CharacterModifier;
		} else if (newType === 'flat') {
			newModifier = {
				...baseProps,
				type: 'flat',
				value: 0
			} as CharacterModifier;
		} else if (newType === 'derived_from_proficiency') {
			newModifier = {
				...baseProps,
				type: 'derived_from_proficiency',
				multiplier: 1
			} as CharacterModifier;
		} else if (newType === 'derived_from_level') {
			newModifier = {
				...baseProps,
				type: 'derived_from_level',
				multiplier: 1
			} as CharacterModifier;
		} else {
			return;
		}

		updateModifier(newModifier);
	}

	// Update target
	function updateTarget(newTarget: ValidTarget | '') {
		// If empty string, clear the target from the modifier (make it invalid for validation)
		if (newTarget === '') {
			// If modifier exists, remove the target property to make it invalid
			// This ensures validation will fail when the user tries to save
			if (effectiveModifier) {
				// Create a modifier without target (will fail validation)
				const invalidModifier = {
					behaviour: effectiveModifier.behaviour,
					character_conditions: effectiveModifier.character_conditions,
					type: effectiveModifier.type,
					...(effectiveModifier.type === 'flat' && { value: effectiveModifier.value }),
					...(effectiveModifier.type === 'derived_from_trait' && {
						trait: effectiveModifier.trait,
						multiplier: effectiveModifier.multiplier
					}),
					...(effectiveModifier.type === 'derived_from_proficiency' && {
						multiplier: effectiveModifier.multiplier
					}),
					...(effectiveModifier.type === 'derived_from_level' && {
						multiplier: effectiveModifier.multiplier
					})
					// Intentionally missing 'target' property - will fail CharacterModifierSchema validation
				} as any as CharacterModifier;

				updateModifier(invalidModifier);
			}
			return;
		}

		// Get current modifier or create default
		const currentModifier = effectiveModifier || {
			behaviour: 'bonus' as const,
			character_conditions: [],
			type: 'flat' as const,
			value: 0
		};

		// Preserve base properties
		const baseProps = {
			behaviour: currentModifier.behaviour,
			character_conditions: currentModifier.character_conditions,
			type: currentModifier.type
		};

		// Preserve type-specific properties
		const typeProps: any = {};
		if (currentModifier.type === 'derived_from_trait') {
			typeProps.trait = currentModifier.trait;
			typeProps.multiplier = currentModifier.multiplier;
		} else if (currentModifier.type === 'flat') {
			typeProps.value = currentModifier.value;
		} else if (
			currentModifier.type === 'derived_from_proficiency' ||
			currentModifier.type === 'derived_from_level'
		) {
			typeProps.multiplier = currentModifier.multiplier;
		}

		// Set target-specific properties
		let newModifier: CharacterModifier;
		if (newTarget === 'trait') {
			// Preserve trait if already set, otherwise use default
			const existingTrait =
				'target' in currentModifier && currentModifier.target === 'trait'
					? ((currentModifier as any).trait ?? 'agility')
					: 'agility';
			newModifier = {
				...baseProps,
				...typeProps,
				target: 'trait',
				trait: existingTrait
			} as CharacterModifier;
		} else if (newTarget === 'experience_from_domain_card_choice_selection') {
			// Create or get existing experience choice
			const choiceId = ensureExperienceChoice(1); // Default max is 1
			newModifier = {
				...baseProps,
				...typeProps,
				target: 'experience_from_domain_card_choice_selection',
				domain_card_id: domainCardId || '',
				choice_id: choiceId
			} as CharacterModifier;
		} else {
			// Simple target
			newModifier = {
				...baseProps,
				...typeProps,
				target: newTarget
			} as CharacterModifier;
		}

		updateModifier(newModifier);
	}
</script>

<div class="flex flex-col gap-3 rounded-lg border bg-muted p-3">
	<!-- Target -->
	<div class="flex flex-col gap-1">
		<label
			for="target-select"
			class={cn(
				'text-xs font-medium text-muted-foreground',
				targetErrors.length > 0 && 'text-destructive'
			)}>Character attribute to modify</label
		>
		<Select.Root
			type="single"
			value={selectedTarget || ''}
			onValueChange={(value) => {
				if (value) {
					const newValue = value;
					selectedTarget = newValue;
					isExplicitlyNoneSelected = false;
					updateTarget(newValue as ValidTarget);
				}
			}}
		>
			<Select.Trigger
				id="target-select"
				class={cn('w-full', targetErrors.length > 0 && 'border-destructive')}
			>
				<p class="truncate">
					{selectedTarget &&
					(simpleTargetOptions.includes(selectedTarget as SimpleTarget) ||
						selectedTarget === 'trait' ||
						selectedTarget === 'experience_from_domain_card_choice_selection')
						? targetLabels[selectedTarget as ValidTarget]
						: 'None selected'}
				</p>
			</Select.Trigger>
			<Select.Content>
				{#each simpleTargetOptions as target}
					<Select.Item value={target}>{targetLabels[target]}</Select.Item>
				{/each}
				<Select.Item value="trait">{targetLabels.trait}</Select.Item>
				{#if domainCardChoices}
					<Select.Item value="experience_from_domain_card_choice_selection">
						{targetLabels.experience_from_domain_card_choice_selection}
					</Select.Item>
				{/if}
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

	<!-- Experience from Domain Card Choice Selection fields -->
	{#if currentTarget === 'experience_from_domain_card_choice_selection' && modifier && modifier.target === 'experience_from_domain_card_choice_selection'}
		{@const experienceModifier = modifier}
		{@const experienceChoice = domainCardChoices?.find((c) => c.choice_id === experienceModifier.choice_id && c.type === 'experience')}
		<div class="flex flex-col gap-2">
			<div class="flex flex-col gap-1">
				<label for="max-experiences-input" class="text-xs font-medium text-muted-foreground"
					>Max number of experiences</label
				>
				<Input
					id="max-experiences-input"
					type="number"
					value={experienceChoice ? String(experienceChoice.max) : '1'}
					oninput={(e) => {
						const maxValue = Number(e.currentTarget.value) || 1;
						const choiceId = ensureExperienceChoice(maxValue);
						updateModifier({
							...experienceModifier,
							choice_id: choiceId,
							domain_card_id: domainCardId || experienceModifier.domain_card_id || ''
						});
					}}
					min="1"
					step="1"
				/>
			</div>
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
					if (value && effectiveModifier && behaviourOptions.includes(value as ModifierBehaviour)) {
						updateModifier({ ...effectiveModifier, behaviour: value as ModifierBehaviour });
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
							updateModifier({
								...traitModifier,
								trait: value as TraitIds
							});
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
						updateModifier({
							...traitModifier,
							multiplier: intValue
						});
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
					updateModifier({
						...flatModifier,
						value: Number(e.currentTarget.value)
					});
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
					updateModifier({
						...multiplierModifier,
						multiplier: intValue
					});
				}}
				step="1"
			/>
		</div>
	{/if}

	<!-- Character Conditions -->
	{#if modifier}
		<div class="flex flex-col gap-1">
			<p class="text-xs font-medium text-muted-foreground">Conditions</p>
			<HomebrewCharacterConditions
				bind:conditions={modifier.character_conditions}
				choiceRequiredError={conditionsChoiceError}
				domainCardChoices={domainCardChoices}
				domainCardId={domainCardId}
			/>
		</div>
	{/if}

	<!-- Remove Button -->
	{#if onRemove}
		<Button
			type="button"
			size="sm"
			variant="link"
			onclick={() => {
				// Remove associated experience choice if it exists
				if (
					effectiveModifier?.target === 'experience_from_domain_card_choice_selection' &&
					(effectiveModifier as any).choice_id
				) {
					removeExperienceChoice((effectiveModifier as any).choice_id);
				}
				onRemove();
			}}
			class="mx-auto w-min text-destructive"
		>
			Delete Character Modifier
		</Button>
	{/if}
</div>
