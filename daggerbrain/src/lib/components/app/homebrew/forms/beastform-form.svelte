<script lang="ts">
	import type {
		DamageTypes,
		Feature,
		Ranges,
		TraitIds,
		Beastform
	} from '@shared/types/compendium.types';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn, capitalize } from '$lib/utils';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Plus from '@lucide/svelte/icons/plus';
	import X from '@lucide/svelte/icons/x';
	import DicePicker from '$lib/components/app/dice/dice-picker.svelte';
	import HomebrewFeatureForm from '../features/feature-form.svelte';
	import Dropdown from '../../leveling/dropdown.svelte';
	import {
		BeastformFormSchema,
		FeatureSchema,
		extractFieldErrors,
		extractFeatureErrors,
		type BeastformFormErrors,
		type FeatureValidationErrors
	} from '../form-schemas';
	import { SvelteMap } from 'svelte/reactivity';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { tick } from 'svelte';
	import Loader2 from '@lucide/svelte/icons/loader-2';

	let {
		item = $bindable(),
		hasChanges = $bindable(),
		hasErrors = $bindable(),
		onSubmit,
		onReset
	}: {
		item: Beastform;
		hasChanges?: boolean;
		hasErrors?: boolean;
		onSubmit?: (e?: SubmitEvent) => void;
		onReset?: () => void;
	} = $props();

	const homebrew = getHomebrewContext();

	// Form state - initialized from beastform prop
	let formName = $state('');
	let formCategory = $state('');
	let formTier = $state('');
	let formCharacterTrait = $state<TraitIds>('agility');
	let formCharacterTraitBonus = $state('');
	let formAttackRange = $state<Ranges>('Melee');
	let formAttackTrait = $state<TraitIds>('agility');
	let formAttackDamageDice = $state('');
	let formAttackDamageBonus = $state('');
	let formAttackDamageType = $state<DamageTypes>('phy');
	let formAdvantages = $state<string[]>([]);
	let formEvasionBonus = $state('');
	let formFeatures = $state<Feature[]>([]);
	let formSpecialCase = $state<
		'legendary_beast' | 'legendary_hybrid' | 'mythic_beast' | 'mythic_hybrid' | ''
	>('');

	// Validation errors state
	let errors = $state<BeastformFormErrors>({});

	// Feature validation state - track detailed errors for each feature
	const featureErrors = new SvelteMap<number, FeatureValidationErrors>();

	// Track if validation has been attempted (to show errors only after first submit attempt)
	let validationAttempted = $state(false);

	// Track which modifiers existed at the last validation attempt
	// New modifiers added after validation should not show errors until next submit
	const validatedModifierKeys = new SvelteMap<string, boolean>();

	// Generate a key for a modifier to track it
	function getModifierKey(
		featureIndex: number,
		modifierType: 'character' | 'weapon',
		modifierIndex: number
	): string {
		return `${featureIndex}-${modifierType}-${modifierIndex}`;
	}

	// svelte-ignore non_reactive_update
	let dropdownOpenIndex = -1;

	const rangeOptions: Ranges[] = ['Melee', 'Very Close', 'Close', 'Far', 'Very Far'];
	const damageTypeOptions: DamageTypes[] = ['phy', 'mag'];
	const traitOptions: TraitIds[] = [
		'agility',
		'strength',
		'finesse',
		'instinct',
		'presence',
		'knowledge'
	];

	const damageTypeMap: Record<DamageTypes, string> = {
		phy: 'Physical',
		mag: 'Magical'
	};

	// Helper to convert tier to level requirement
	function tierToMinLevel(tier: number): number {
		if (tier === 1) return 1;
		if (tier === 2) return 2;
		if (tier === 3) return 5;
		if (tier === 4) return 8;
		return 1;
	}

	// Helper to convert level requirement to tier
	function levelToTier(level: number): number {
		if (level >= 8) return 4;
		if (level >= 5) return 3;
		if (level >= 2) return 2;
		return 1;
	}

	// Check if form has changes compared to the item prop
	let formHasChanges = $derived.by(() => {
		if (!item) return false;

		const nameMatch = formName.trim() === item.name;
		const categoryMatch = formCategory.trim() === item.category;

		// Compare tier/level
		const formLevelRequirement = formTier ? tierToMinLevel(Number(formTier)) : 1;
		const tierMatch = formLevelRequirement === item.level_requirement;

		// Compare character trait
		const formCharacterTraitBonusNum =
			formCharacterTraitBonus === '' ? 0 : Number(formCharacterTraitBonus);
		const characterTraitMatch =
			formCharacterTrait === item.character_trait.trait &&
			formCharacterTraitBonusNum === item.character_trait.bonus;

		// Compare attack
		const formAttackDamageBonusNum =
			formAttackDamageBonus === '' ? 0 : Number(formAttackDamageBonus);
		const attackMatch =
			formAttackRange === item.attack.range &&
			formAttackTrait === item.attack.trait &&
			formAttackDamageDice === item.attack.damage_dice &&
			formAttackDamageBonusNum === item.attack.damage_bonus &&
			formAttackDamageType === item.attack.damage_type;

		// Compare advantages
		const sortedFormAdvantages = [...formAdvantages].sort();
		const sortedBeastformAdvantages = [...item.advantages].sort();
		const advantagesMatch =
			JSON.stringify(sortedFormAdvantages) === JSON.stringify(sortedBeastformAdvantages);

		// Compare evasion bonus
		const formEvasionBonusNum = formEvasionBonus === '' ? 0 : Number(formEvasionBonus);
		const evasionMatch = formEvasionBonusNum === item.evasion_bonus;

		// Compare features (deep comparison)
		const featuresMatch = JSON.stringify(formFeatures) === JSON.stringify(item.features);

		// Compare special_case (normalize empty string to undefined for comparison)
		const formSpecialCaseNormalized = formSpecialCase === '' ? undefined : formSpecialCase;
		const specialCaseMatch = formSpecialCaseNormalized === item.special_case;

		return !(
			nameMatch &&
			categoryMatch &&
			tierMatch &&
			characterTraitMatch &&
			attackMatch &&
			advantagesMatch &&
			evasionMatch &&
			featuresMatch &&
			specialCaseMatch
		);
	});

	// Sync hasChanges to bindable prop
	$effect(() => {
		hasChanges = formHasChanges;
	});

	// Check if there are any validation errors
	let hasValidationErrors = $derived.by(() => {
		// Check form-level errors
		if (Object.keys(errors).length > 0) {
			return true;
		}
		// Check feature errors
		if (featureErrors.size > 0) {
			return true;
		}
		return false;
	});

	// Collect all error messages for display
	let allErrorMessages = $derived.by(() => {
		const messages: string[] = [];

		// Add form-level errors (exclude 'features' since individual feature errors are shown)
		for (const [key, value] of Object.entries(errors)) {
			if (value && key !== 'features') {
				messages.push(`${key}: ${value}`);
			}
		}

		// Add feature errors
		for (const [index, featureError] of featureErrors) {
			const featureTitle = formFeatures[index]?.title || `Feature ${index + 1}`;
			if (featureError.title) {
				messages.push(`${featureTitle}, Title: ${featureError.title}`);
			}
			if (featureError.description_html) {
				messages.push(`${featureTitle}, Description: ${featureError.description_html}`);
			}
			if (featureError.character_modifiers) {
				for (const [modIndex, modErrors] of featureError.character_modifiers) {
					for (const error of modErrors) {
						messages.push(`${featureTitle}, Character Modifier ${modIndex + 1}: ${error}`);
					}
				}
			}
			if (featureError.weapon_modifiers) {
				for (const [modIndex, modErrors] of featureError.weapon_modifiers) {
					for (const error of modErrors) {
						messages.push(`${featureTitle}, Weapon Modifier ${modIndex + 1}: ${error}`);
					}
				}
			}
		}

		return messages;
	});

	// Sync hasValidationErrors to bindable prop (only after validation attempted)
	$effect(() => {
		hasErrors = validationAttempted && hasValidationErrors;
	});

	// Sync form state when item prop changes
	$effect(() => {
		if (item) {
			formName = item.name;
			formCategory = item.category;
			formTier = String(levelToTier(item.level_requirement));
			formCharacterTrait = item.character_trait.trait;
			formCharacterTraitBonus =
				item.character_trait.bonus === 0 ? '' : String(item.character_trait.bonus);
			formAttackRange = item.attack.range;
			formAttackTrait = item.attack.trait;
			formAttackDamageDice = item.attack.damage_dice;
			formAttackDamageBonus =
				item.attack.damage_bonus === 0 ? '' : String(item.attack.damage_bonus);
			formAttackDamageType = item.attack.damage_type;
			formAdvantages = [...item.advantages];
			formEvasionBonus = item.evasion_bonus === 0 ? '' : String(item.evasion_bonus);
			formFeatures = JSON.parse(JSON.stringify(item.features));
			formSpecialCase = item.special_case ?? '';
			// Clear errors when beastform changes
			errors = {};
			featureErrors.clear();
			validationAttempted = false;
			validatedModifierKeys.clear();
		}
	});

	function buildFormData() {
		return {
			name: formName.trim(),
			category: formCategory.trim(),
			level_requirement: formTier ? tierToMinLevel(Number(formTier)) : 1,
			character_trait: {
				trait: formCharacterTrait,
				bonus: formCharacterTraitBonus === '' ? 0 : Number(formCharacterTraitBonus)
			},
			attack: {
				range: formAttackRange,
				trait: formAttackTrait,
				damage_dice: formAttackDamageDice,
				damage_bonus: formAttackDamageBonus === '' ? 0 : Number(formAttackDamageBonus),
				damage_type: formAttackDamageType
			},
			advantages: [...formAdvantages],
			evasion_bonus: formEvasionBonus === '' ? 0 : Number(formEvasionBonus),
			features: JSON.parse(JSON.stringify(formFeatures)),
			special_case: formSpecialCase || undefined
		};
	}

	// Validate features and update error state
	function validateFeatures() {
		for (let i = 0; i < formFeatures.length; i++) {
			const result = FeatureSchema.safeParse(formFeatures[i]);

			if (!result.success) {
				const featureErrorsData = extractFeatureErrors(result.error);

				// Filter out errors for modifiers that weren't validated yet (newly added)
				if (featureErrorsData.character_modifiers) {
					const filteredCharModifiers = new Map<number, string[]>();
					for (const [modIndex, errors] of featureErrorsData.character_modifiers) {
						const key = getModifierKey(i, 'character', modIndex);
						if (validatedModifierKeys.has(key)) {
							filteredCharModifiers.set(modIndex, errors);
						}
					}
					if (filteredCharModifiers.size > 0) {
						featureErrorsData.character_modifiers = filteredCharModifiers;
					} else {
						delete featureErrorsData.character_modifiers;
					}
				}

				if (featureErrorsData.weapon_modifiers) {
					const filteredWeaponModifiers = new Map<number, string[]>();
					for (const [modIndex, errors] of featureErrorsData.weapon_modifiers) {
						const key = getModifierKey(i, 'weapon', modIndex);
						if (validatedModifierKeys.has(key)) {
							filteredWeaponModifiers.set(modIndex, errors);
						}
					}
					if (filteredWeaponModifiers.size > 0) {
						featureErrorsData.weapon_modifiers = filteredWeaponModifiers;
					} else {
						delete featureErrorsData.weapon_modifiers;
					}
				}

				// Only set errors if there are any remaining after filtering
				const hasCharModifierErrors =
					featureErrorsData.character_modifiers && featureErrorsData.character_modifiers.size > 0;
				const hasWeaponModifierErrors =
					featureErrorsData.weapon_modifiers && featureErrorsData.weapon_modifiers.size > 0;
				if (
					hasCharModifierErrors ||
					hasWeaponModifierErrors ||
					featureErrorsData.title ||
					featureErrorsData.description_html
				) {
					featureErrors.set(i, featureErrorsData);
				} else {
					featureErrors.delete(i);
				}
			} else {
				featureErrors.delete(i);
			}
		}
	}

	// Validate form-level fields
	function validateFormFields() {
		const formData = buildFormData();
		const result = BeastformFormSchema.safeParse(formData);
		if (!result.success) {
			errors = extractFieldErrors(result.error);
		} else {
			errors = {};
		}
	}

	// Reactive validation - re-validate when form data changes (only after first validation attempt)
	$effect(() => {
		if (!validationAttempted) return;

		// Re-validate features when they change
		validateFeatures();
	});

	// Re-validate form fields when they change
	$effect(() => {
		if (!validationAttempted) return;

		// Track form field changes
		formName;
		formCategory;
		formTier;
		formCharacterTrait;
		formCharacterTraitBonus;
		formAttackRange;
		formAttackTrait;
		formAttackDamageDice;
		formAttackDamageBonus;
		formAttackDamageType;
		formAdvantages;
		formEvasionBonus;

		validateFormFields();
	});

	export function handleSubmit(e?: SubmitEvent) {
		if (e) {
			e.preventDefault();
		}
		if (!item) return;

		// Mark that validation has been attempted
		validationAttempted = true;

		// Mark all current modifiers as validated (so errors will show for them)
		validatedModifierKeys.clear();
		for (let i = 0; i < formFeatures.length; i++) {
			const feature = formFeatures[i];
			for (let j = 0; j < feature.character_modifiers.length; j++) {
				validatedModifierKeys.set(getModifierKey(i, 'character', j), true);
			}
			for (let j = 0; j < feature.weapon_modifiers.length; j++) {
				validatedModifierKeys.set(getModifierKey(i, 'weapon', j), true);
			}
		}

		// Validate all features
		validateFeatures();

		// Validate form-level fields
		validateFormFields();

		// Check if there are any validation errors
		const hasFormErrors = Object.keys(errors).length > 0;
		const hasFeatureErrors = featureErrors.size > 0;

		if (hasFormErrors || hasFeatureErrors) {
			// Don't set generic error message - errors are shown inline in each feature
			return;
		}

		// Build form data (validation already passed, so we can use it)
		const formData = buildFormData();

		// Save the original beastform reference to find it in homebrew state
		const originalBeastform = item;
		// Update the beastform prop with validated form values
		const updatedBeastform = {
			...item,
			...formData
		};
		item = updatedBeastform;

		// Update the homebrew state record so auto-save can detect the change
		// Find the beastform's UID in the collection using the original reference
		const newBeastformRef = JSON.parse(JSON.stringify(updatedBeastform));
		for (const [uid, b] of Object.entries(homebrew.beastforms)) {
			if (b === originalBeastform) {
				homebrew.beastforms[uid] = newBeastformRef;
				break;
			}
		}

		// Clear errors on success
		errors = {};
		featureErrors.clear();
		validationAttempted = false;

		// Call callback if provided
		if (onSubmit && e) {
			onSubmit(e);
		}
	}

	export function handleReset() {
		if (!item) return;
		// Re-sync form from beastform prop
		formName = item.name;
		formCategory = item.category;
		formTier = String(levelToTier(item.level_requirement));
		formCharacterTrait = item.character_trait.trait;
		formCharacterTraitBonus =
			item.character_trait.bonus === 0 ? '' : String(item.character_trait.bonus);
		formAttackRange = item.attack.range;
		formAttackTrait = item.attack.trait;
		formAttackDamageDice = item.attack.damage_dice;
		formAttackDamageBonus = item.attack.damage_bonus === 0 ? '' : String(item.attack.damage_bonus);
		formAttackDamageType = item.attack.damage_type;
		formAdvantages = [...item.advantages];
		formEvasionBonus = item.evasion_bonus === 0 ? '' : String(item.evasion_bonus);
		formFeatures = JSON.parse(JSON.stringify(item.features));
		formSpecialCase = item.special_case ?? '';
		// Clear errors on reset
		errors = {};
		featureErrors.clear();
		validationAttempted = false;
		validatedModifierKeys.clear();

		// Note: onReset callback removed to prevent infinite recursion
		// The parent component should handle any additional reset logic if needed
	}

	function addAdvantage() {
		formAdvantages = [...formAdvantages, ''];
	}

	function removeAdvantage(index: number) {
		formAdvantages = formAdvantages.filter((_, i) => i !== index);
	}

	function addFeature(index: number) {
		dropdownOpenIndex = index;
		const newFeature: Feature = {
			title: '',
			description_html: '',
			character_modifiers: [],
			weapon_modifiers: []
		};
		formFeatures = [...formFeatures, newFeature];

		tick().then(() => {
			dropdownOpenIndex = -1;
		});
	}

	function removeFeature(index: number) {
		formFeatures = formFeatures.filter((_, i) => i !== index);
		// Clean up errors and re-index for items after the removed one
		featureErrors.delete(index);

		// Collect entries that need re-indexing
		const errorsToReindex: [number, FeatureValidationErrors][] = [];
		for (const [i, errorData] of featureErrors) {
			if (i > index) {
				errorsToReindex.push([i, errorData]);
			}
		}

		// Delete old keys and set new ones
		for (const [i] of errorsToReindex) {
			featureErrors.delete(i);
		}
		for (const [i, errorData] of errorsToReindex) {
			featureErrors.set(i - 1, errorData);
		}
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">
	<!-- Name -->
	<div class="flex flex-col gap-1">
		<label
			for="hb-beastform-name"
			class={cn('text-xs font-medium text-muted-foreground', errors.name && 'text-destructive')}
			>Name</label
		>
		<Input
			id="hb-beastform-name"
			bind:value={formName}
			placeholder="Beastform name"
			aria-invalid={!!errors.name}
		/>
		{#if errors.name}
			<p class="text-xs text-destructive">{errors.name}</p>
		{/if}
	</div>

	<!-- Category -->
	<div class="flex flex-col gap-1">
		<label
			for="hb-beastform-category"
			class={cn('text-xs font-medium text-muted-foreground', errors.category && 'text-destructive')}
			>Category</label
		>
		<Input
			id="hb-beastform-category"
			bind:value={formCategory}
			placeholder="e.g., Fox, Mouse, Weasel, etc."
			aria-invalid={!!errors.category}
		/>
		{#if errors.category}
			<p class="text-xs text-destructive">{errors.category}</p>
		{/if}
	</div>

	<!-- Tier -->
	<div class="flex flex-col gap-1">
		<label for="hb-beastform-tier" class="text-xs font-medium text-muted-foreground">Tier</label>
		<Select.Root type="single" bind:value={formTier}>
			<Select.Trigger id="hb-beastform-tier" class="w-full">
				<p class="truncate">{formTier || 'Select tier'}</p>
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="1">1</Select.Item>
				<Select.Item value="2">2</Select.Item>
				<Select.Item value="3">3</Select.Item>
				<Select.Item value="4">4</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>

	<!-- Character Trait -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-beastform-character-trait" class="text-xs font-medium text-muted-foreground"
				>Character Trait</label
			>
			<Select.Root type="single" bind:value={formCharacterTrait}>
				<Select.Trigger id="hb-beastform-character-trait" class="w-full">
					<p class="truncate">{capitalize(formCharacterTrait)}</p>
				</Select.Trigger>
				<Select.Content>
					{#each traitOptions as trait}
						<Select.Item value={trait}>{capitalize(trait)}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-col gap-1">
			<label
				for="hb-beastform-character-trait-bonus"
				class="text-xs font-medium text-muted-foreground">Character Trait Bonus</label
			>
			<Input
				id="hb-beastform-character-trait-bonus"
				type="number"
				inputmode="numeric"
				bind:value={formCharacterTraitBonus}
				placeholder="0"
			/>
		</div>
	</div>

	<!-- Evasion Bonus -->
	<div class="flex flex-col gap-1">
		<label for="hb-beastform-evasion-bonus" class="text-xs font-medium text-muted-foreground"
			>Evasion Bonus</label
		>
		<Input
			id="hb-beastform-evasion-bonus"
			type="number"
			inputmode="numeric"
			bind:value={formEvasionBonus}
			placeholder="0"
		/>
	</div>

	<!-- Attack Section -->
	<div class="flex flex-col gap-1">
		<p class="text-xs font-medium text-muted-foreground">Attack</p>

		<div class="flex flex-col gap-3 rounded-lg border bg-muted p-3">
			<!-- Attack Range & Trait Row -->
			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col gap-1">
					<label for="hb-beastform-attack-range" class="text-xs font-medium text-muted-foreground"
						>Range</label
					>
					<Select.Root type="single" bind:value={formAttackRange}>
						<Select.Trigger id="hb-beastform-attack-range" class="w-full">
							<p class="truncate">{formAttackRange}</p>
						</Select.Trigger>
						<Select.Content>
							{#each rangeOptions as range}
								<Select.Item value={range}>{range}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="flex flex-col gap-1">
					<label for="hb-beastform-attack-trait" class="text-xs font-medium text-muted-foreground"
						>Attack Trait</label
					>
					<Select.Root type="single" bind:value={formAttackTrait}>
						<Select.Trigger id="hb-beastform-attack-trait" class="w-full">
							<p class="truncate">{capitalize(formAttackTrait)}</p>
						</Select.Trigger>
						<Select.Content>
							{#each traitOptions as trait}
								<Select.Item value={trait}>{capitalize(trait)}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</div>

			<!-- Damage Dice -->
			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<label
							for="hb-beastform-attack-damage-dice"
							class="text-xs font-medium text-muted-foreground">Damage Dice</label
						>
						{#if formAttackDamageDice}
							<span class="text-xs text-muted-foreground">({formAttackDamageDice})</span>
						{/if}
					</div>
					<button
						type="button"
						disabled={formAttackDamageDice === ''}
						class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:hidden"
						onclick={() => (formAttackDamageDice = '')}
						title="Reset damage dice"
					>
						Reset
						<RotateCcw class="size-3.5" />
					</button>
				</div>
				<DicePicker value={formAttackDamageDice} onChange={(v) => (formAttackDamageDice = v)} />
			</div>

			<!-- Damage Bonus & Damage Type Row -->
			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col gap-1">
					<label
						for="hb-beastform-attack-damage-bonus"
						class="text-xs font-medium text-muted-foreground">Damage Bonus</label
					>
					<Input
						id="hb-beastform-attack-damage-bonus"
						type="number"
						inputmode="numeric"
						bind:value={formAttackDamageBonus}
						placeholder="0"
					/>
				</div>
				<div class="flex flex-col gap-1">
					<label
						for="hb-beastform-attack-damage-type"
						class="text-xs font-medium text-muted-foreground">Damage Type</label
					>
					<Select.Root type="single" bind:value={formAttackDamageType}>
						<Select.Trigger id="hb-beastform-attack-damage-type" class="w-full">
							<p class="truncate">{damageTypeMap[formAttackDamageType]}</p>
						</Select.Trigger>
						<Select.Content>
							{#each damageTypeOptions as type}
								<Select.Item value={type}>{damageTypeMap[type]}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</div>
	</div>

	<!-- Special Case -->
	<div class="flex flex-col gap-1">
		<label for="hb-beastform-special-case" class="text-xs font-medium text-muted-foreground"
			>Evolved Beast and Hybrid options</label
		>
		<Select.Root type="single" bind:value={formSpecialCase}>
			<Select.Trigger id="hb-beastform-special-case" class="w-full">
				<p class="truncate">
					{formSpecialCase === 'legendary_beast'
						? 'Legendary Beast'
						: formSpecialCase === 'legendary_hybrid'
							? 'Legendary Hybrid'
							: formSpecialCase === 'mythic_beast'
								? 'Mythic Beast'
								: formSpecialCase === 'mythic_hybrid'
									? 'Mythic Hybrid'
									: 'None'}
				</p>
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="">None</Select.Item>
				<Select.Item value="legendary_beast">Legendary Beast</Select.Item>
				<Select.Item value="legendary_hybrid">Legendary Hybrid</Select.Item>
				<Select.Item value="mythic_beast">Mythic Beast</Select.Item>
				<Select.Item value="mythic_hybrid">Mythic Hybrid</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>

	<!-- Advantages -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Advantages</p>
			<Button type="button" size="sm" variant="outline" onclick={addAdvantage}>
				<Plus class="size-3.5" />
				Add Advantage
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each formAdvantages as advantage, index}
				<div class="flex items-center gap-2">
					<Input
						bind:value={formAdvantages[index]}
						placeholder="e.g., deceive, locate, sneak"
						class="flex-1"
					/>
					<Button type="button" size="sm" variant="ghost" onclick={() => removeAdvantage(index)}>
						<X class="size-3.5" />
					</Button>
				</div>
			{:else}
				<p class="text-xs italic text-muted-foreground">No advantages added</p>
			{/each}
		</div>
	</div>

	<!-- Features -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Features</p>
			<Button
				type="button"
				size="sm"
				variant="outline"
				onclick={() => addFeature(formFeatures.length)}
			>
				<Plus class="size-3.5" />
				Add Feature
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each formFeatures as feature, index (index)}
				<Dropdown
					title={feature.title || `Unnamed feature`}
					class={featureErrors.has(index)
						? 'data-[open=false]:border data-[open=false]:border-destructive'
						: ''}
					open={dropdownOpenIndex === index}
				>
					<HomebrewFeatureForm
						bind:feature={formFeatures[index]}
						onRemove={() => removeFeature(index)}
						errors={featureErrors.get(index)}
					/>
				</Dropdown>
			{:else}
				<p class="text-xs italic text-muted-foreground">No features added</p>
			{/each}
		</div>
	</div>

	<!-- Actions -->
	<div class="flex flex-col gap-2 pt-2">
		<div class="flex justify-end gap-2">
			{#if formHasChanges}
				<Button type="button" size="sm" variant="link" onclick={handleReset} class="h-7">
					<RotateCcw class="size-3.5" />
					Discard
				</Button>
			{/if}
			<Button
				type="submit"
				size="sm"
				disabled={!formHasChanges || homebrew.saving}
				class={cn(
					'h-7',
					hasValidationErrors && 'cursor-not-allowed border border-destructive hover:bg-primary'
				)}
			>
				{#if homebrew.saving}
					<Loader2 class="size-3.5 animate-spin" />
					Saving...
				{:else}
					Save
				{/if}
			</Button>
		</div>
		{#if hasValidationErrors && allErrorMessages.length > 0}
			<ul class="list-inside list-disc space-y-1">
				{#each allErrorMessages as error}
					<li class="text-xs text-destructive">{error}</li>
				{/each}
			</ul>
		{/if}
	</div>
</form>
