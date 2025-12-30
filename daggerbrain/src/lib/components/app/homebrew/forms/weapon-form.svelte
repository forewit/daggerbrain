<script lang="ts">
	import type {
		DamageTypes,
		Feature,
		Ranges,
		TraitIds,
		Weapon,
		WeaponCategories
	} from '$lib/types/compendium-types';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn, capitalize, tier_to_min_level, level_to_tier } from '$lib/utils';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Plus from '@lucide/svelte/icons/plus';
	import DicePicker from '$lib/components/app/dice/dice-picker.svelte';
	import HomebrewFeatureForm from '../features/feature-form.svelte';
	import Dropdown from '../../leveling/dropdown.svelte';
	import Hand from '@lucide/svelte/icons/hand';
	import {
		WeaponFormSchema,
		FeatureSchema,
		extractFieldErrors,
		extractFeatureErrors,
		type WeaponFormErrors,
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
		item: Weapon;
		hasChanges?: boolean;
		hasErrors?: boolean;
		onSubmit?: (e?: SubmitEvent) => void;
		onReset?: () => void;
	} = $props();

	const homebrew = getHomebrewContext();

	// Form state - initialized from weapon prop
	let formTitle = $state('');
	let formDescriptionHtml = $state('');
	let formTier = $state('');
	let formCategory = $state<WeaponCategories>('Primary');
	let formType = $state<'Physical' | 'Magical'>('Physical');
	let formRange = $state<Ranges>('Melee');
	let formAvailableTraits = $state<TraitIds[]>([]);
	let formDamageTypes = $state<DamageTypes[]>([]);
	let formBurden = $state<'0' | '1' | '2'>('1');
	let formDamageDice = $state('');
	let formDamageBonus = $state('');
	let formAttackRollBonus = $state('');
	let formFeatures = $state<Feature[]>([]);

	// Validation errors state
	let errors = $state<WeaponFormErrors>({});
	
	// Feature validation state - track detailed errors for each feature
	const featureErrors = new SvelteMap<number, FeatureValidationErrors>();
	
	// Track if validation has been attempted (to show errors only after first submit attempt)
	let validationAttempted = $state(false);
	
	// Track which modifiers existed at the last validation attempt
	// New modifiers added after validation should not show errors until next submit
	const validatedModifierKeys = new SvelteMap<string, boolean>();
	
	// Generate a key for a modifier to track it
	function getModifierKey(featureIndex: number, modifierType: 'character' | 'weapon', modifierIndex: number): string {
		return `${featureIndex}-${modifierType}-${modifierIndex}`;
	}

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

	const rangeOptions: Ranges[] = ['Melee', 'Very Close', 'Close', 'Far', 'Very Far'];
	const damageTypeOptions: DamageTypes[] = ['phy', 'mag'];
	const categoryOptions: WeaponCategories[] = ['Primary', 'Secondary'];
	const typeOptions: ('Physical' | 'Magical')[] = ['Physical', 'Magical'];
	const traitOptions: TraitIds[] = [
		'agility',
		'strength',
		'finesse',
		'instinct',
		'presence',
		'knowledge'
	];
	const burdenOptions: ('0' | '1' | '2')[] = ['0', '1', '2'];

	const damageTypeMap: Record<DamageTypes, string> = {
		phy: 'Physical',
		mag: 'Magical'
	};

	// Check if form has changes compared to the weapon prop
	let formHasChanges = $derived.by(() => {
		if (!item) return false;

		const titleMatch = formTitle.trim() === item.title;
		const descriptionMatch = formDescriptionHtml === item.description_html;

		// Compare tier/level
		const formLevelRequirement = formTier ? tier_to_min_level(Number(formTier)) : 1;
		const tierMatch = formLevelRequirement === item.level_requirement;

		const categoryMatch = formCategory === item.category;
		const typeMatch = formType === item.type;
		const rangeMatch = formRange === item.range;

		// Compare traits
		const sortedFormTraits = [...formAvailableTraits].sort();
		const sortedWeaponTraits = [...item.available_traits].sort();
		const traitsMatch = JSON.stringify(sortedFormTraits) === JSON.stringify(sortedWeaponTraits);

		// Compare damage types
		const sortedFormDamageTypes = [...formDamageTypes].sort();
		const sortedWeaponDamageTypes = [...item.available_damage_types].sort();
		const damageTypesMatch =
			JSON.stringify(sortedFormDamageTypes) === JSON.stringify(sortedWeaponDamageTypes);

		const burdenMatch = Number(formBurden) === item.burden;
		const damageDiceMatch = formDamageDice === item.damage_dice;

		const formDamageBonusNum = formDamageBonus === '' ? 0 : Number(formDamageBonus);
		const damageBonusMatch = formDamageBonusNum === item.damage_bonus;

		const formAttackRollBonusNum = formAttackRollBonus === '' ? 0 : Number(formAttackRollBonus);
		const attackRollBonusMatch = formAttackRollBonusNum === item.attack_roll_bonus;

		// Compare features (deep comparison)
		const featuresMatch = JSON.stringify(formFeatures) === JSON.stringify(item.features);

		return !(
			titleMatch &&
			descriptionMatch &&
			tierMatch &&
			categoryMatch &&
			typeMatch &&
			rangeMatch &&
			traitsMatch &&
			damageTypesMatch &&
			burdenMatch &&
			damageDiceMatch &&
			damageBonusMatch &&
			attackRollBonusMatch &&
			featuresMatch
		);
	});

	// Sync hasChanges to bindable prop
	$effect(() => {
		hasChanges = formHasChanges;
	});

	// Sync hasValidationErrors to bindable prop (only after validation attempted)
	$effect(() => {
		hasErrors = validationAttempted && hasValidationErrors;
	});

	// Sync form state when weapon prop changes
	$effect(() => {
		if (item) {
			formTitle = item.title;
			formDescriptionHtml = item.description_html;
			formTier = String(level_to_tier(item.level_requirement));
			formCategory = item.category;
			formType = item.type;
			formRange = item.range;
			formAvailableTraits = [...item.available_traits];
			formDamageTypes = [...item.available_damage_types];
			formBurden = String(item.burden) as '0' | '1' | '2';
			formDamageDice = item.damage_dice;
			formDamageBonus = item.damage_bonus === 0 ? '' : String(item.damage_bonus);
			formAttackRollBonus = item.attack_roll_bonus === 0 ? '' : String(item.attack_roll_bonus);
			formFeatures = JSON.parse(JSON.stringify(item.features));
			// Clear errors when weapon changes
			errors = {};
			featureErrors.clear();
			validationAttempted = false;
			validatedModifierKeys.clear();
		}
	});

	function buildFormData() {
		return {
			title: formTitle.trim(),
			description_html: formDescriptionHtml,
			level_requirement: formTier ? tier_to_min_level(Number(formTier)) : 1,
			category: formCategory,
			type: formType,
			range: formRange,
			available_traits: [...formAvailableTraits],
			available_damage_types: [...formDamageTypes],
			burden: Number(formBurden) as 0 | 1 | 2,
			damage_dice: formDamageDice,
			damage_bonus: formDamageBonus === '' ? 0 : Number(formDamageBonus),
			attack_roll_bonus: formAttackRollBonus === '' ? 0 : Number(formAttackRollBonus),
			features: JSON.parse(JSON.stringify(formFeatures))
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
				const hasCharModifierErrors = featureErrorsData.character_modifiers && featureErrorsData.character_modifiers.size > 0;
				const hasWeaponModifierErrors = featureErrorsData.weapon_modifiers && featureErrorsData.weapon_modifiers.size > 0;
				if (hasCharModifierErrors || 
				    hasWeaponModifierErrors ||
				    featureErrorsData.title || 
				    featureErrorsData.description_html) {
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
		const result = WeaponFormSchema.safeParse(formData);
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
		formTitle;
		formDescriptionHtml;
		formTier;
		formCategory;
		formType;
		formRange;
		formAvailableTraits;
		formDamageTypes;
		formBurden;
		formDamageDice;
		formDamageBonus;
		formAttackRollBonus;
		
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

		// Save the original weapon reference to find it in homebrew state
		const originalWeapon = item;
		// Update the weapon prop with validated form values
		const updatedWeapon = {
			...item,
			...formData
		};
		item = updatedWeapon;

		// Update the homebrew state record so auto-save can detect the change
		// Find the weapon's UID in both collections using the original reference
		const newWeaponRef = JSON.parse(JSON.stringify(updatedWeapon));
		for (const [uid, w] of Object.entries(homebrew.primary_weapons)) {
			if (w === originalWeapon) {
				homebrew.primary_weapons[uid] = newWeaponRef;
				break;
			}
		}
		for (const [uid, w] of Object.entries(homebrew.secondary_weapons)) {
			if (w === originalWeapon) {
				homebrew.secondary_weapons[uid] = newWeaponRef;
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
		// Re-sync form from weapon prop
		formTitle = item.title;
		formDescriptionHtml = item.description_html;
		formTier = String(level_to_tier(item.level_requirement));
		formCategory = item.category;
		formType = item.type;
		formRange = item.range;
		formAvailableTraits = [...item.available_traits];
		formDamageTypes = [...item.available_damage_types];
		formBurden = String(item.burden) as '0' | '1' | '2';
		formDamageDice = item.damage_dice;
		formDamageBonus = item.damage_bonus === 0 ? '' : String(item.damage_bonus);
		formAttackRollBonus = item.attack_roll_bonus === 0 ? '' : String(item.attack_roll_bonus);
		formFeatures = JSON.parse(JSON.stringify(item.features));
		// Clear errors on reset
		errors = {};
		featureErrors.clear();
		validationAttempted = false;
		validatedModifierKeys.clear();

		// Note: onReset callback removed to prevent infinite recursion
		// The parent component should handle any additional reset logic if needed
	}

	function toggleTrait(trait: TraitIds) {
		if (formAvailableTraits.includes(trait)) {
			formAvailableTraits = formAvailableTraits.filter((t) => t !== trait);
		} else {
			formAvailableTraits = [...formAvailableTraits, trait];
		}
		// Clear trait error when user makes a selection
		if (errors.available_traits) {
			errors = { ...errors, available_traits: undefined };
		}
	}

	function toggleDamageType(type: DamageTypes) {
		if (formDamageTypes.includes(type)) {
			formDamageTypes = formDamageTypes.filter((t) => t !== type);
		} else {
			formDamageTypes = [...formDamageTypes, type];
		}
		// Clear damage type error when user makes a selection
		if (errors.available_damage_types) {
			errors = { ...errors, available_damage_types: undefined };
		}
	}

	// svelte-ignore non_reactive_update
	let dropdownOpenIndex = -1;
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
	<!-- Title -->
	<div class="flex flex-col gap-1">
		<label for="hb-weapon-title" class="text-xs font-medium text-muted-foreground">Name</label>
		<Input
			id="hb-weapon-title"
			bind:value={formTitle}
			placeholder="Weapon name"
			aria-invalid={!!errors.title}
		/>
		{#if errors.title}
			<p class="text-xs text-destructive">{errors.title}</p>
		{/if}
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-1">
		<label for="hb-weapon-description" class="text-xs font-medium text-muted-foreground"
			>Description</label
		>
		<Textarea
			id="hb-weapon-description"
			bind:value={formDescriptionHtml}
			placeholder="Weapon description"
			rows={3}
		/>
	</div>

	<!-- Category & Tier Row -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-category" class="text-xs font-medium text-muted-foreground"
				>Category</label
			>
			<Select.Root type="single" bind:value={formCategory}>
				<Select.Trigger id="hb-weapon-category" class="w-full">
					<p class="truncate">{formCategory}</p>
				</Select.Trigger>
				<Select.Content>
					{#each categoryOptions as category}
						<Select.Item value={category}>{category}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-tier" class="text-xs font-medium text-muted-foreground">Tier</label>
			<Select.Root type="single" bind:value={formTier}>
				<Select.Trigger id="hb-weapon-tier" class="w-full">
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
	</div>

	<!-- Burden & Range Row -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-burden" class="text-xs font-medium text-muted-foreground">Burden</label>
			<Select.Root type="single" bind:value={formBurden}>
				<Select.Trigger id="hb-weapon-burden" class="w-full">
					<p class="truncate">{formBurden}</p>
					<Hand class="mr-auto" />
				</Select.Trigger>
				<Select.Content>
					{#each burdenOptions as burden}
						<Select.Item value={burden}>{burden}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-range" class="text-xs font-medium text-muted-foreground">Range</label>
			<Select.Root type="single" bind:value={formRange}>
				<Select.Trigger id="hb-weapon-range" class="w-full">
					<p class="truncate">{formRange}</p>
				</Select.Trigger>
				<Select.Content>
					{#each rangeOptions as range}
						<Select.Item value={range}>{range}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<!-- Available Traits -->
	<div class="flex flex-col gap-2">
		<p class={cn('text-xs font-medium text-muted-foreground', errors.available_traits && 'text-destructive')}>
			Weapon Trait
		</p>
		<div class="flex flex-wrap gap-3">
			{#each traitOptions as trait}
				<label class="flex items-center gap-2 text-xs">
					<input
						type="checkbox"
						checked={formAvailableTraits.includes(trait)}
						onchange={() => toggleTrait(trait)}
						class="accent-accent"
					/>
					{capitalize(trait)}
				</label>
			{/each}
		</div>
		{#if errors.available_traits}
			<p class="text-xs text-destructive">{errors.available_traits}</p>
		{/if}
	</div>

	<!-- Damage Type & Weapon Type Row -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-2">
			<p class={cn('text-xs font-medium text-muted-foreground', errors.available_damage_types && 'text-destructive')}>
				Damage Type
			</p>
			<div class="flex gap-4">
				{#each damageTypeOptions as type}
					<label class="flex items-center gap-2 text-xs">
						<input
							type="checkbox"
							checked={formDamageTypes.includes(type)}
							onchange={() => toggleDamageType(type)}
							class="accent-accent"
						/>
						{damageTypeMap[type]}
					</label>
				{/each}
			</div>
			{#if errors.available_damage_types}
				<p class="text-xs text-destructive">{errors.available_damage_types}</p>
			{/if}
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-type" class="text-xs font-medium text-muted-foreground"
				>Weapon Type</label
			>
			<Select.Root type="single" bind:value={formType}>
				<Select.Trigger id="hb-weapon-type" class="w-full">
					<p class="truncate">{formType}</p>
				</Select.Trigger>
				<Select.Content>
					{#each typeOptions as type}
						<Select.Item value={type}>{type}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<!-- Damage Dice -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<label for="hb-weapon-damage-dice" class="text-xs font-medium text-muted-foreground"
					>Damage Dice</label
				>
				{#if formDamageDice}
					<span class="text-xs text-muted-foreground">({formDamageDice})</span>
				{/if}
			</div>
			<button
				type="button"
				disabled={formDamageDice === ''}
				class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:hidden"
				onclick={() => (formDamageDice = '')}
				title="Reset damage dice"
			>
				Reset
				<RotateCcw class="size-3.5" />
			</button>
		</div>
		<DicePicker value={formDamageDice} onChange={(v) => (formDamageDice = v)} />
	</div>

	<!-- Damage Bonus & Attack Roll Bonus Row -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-damage-bonus" class="text-xs font-medium text-muted-foreground"
				>Damage Bonus</label
			>
			<Input
				id="hb-weapon-damage-bonus"
				type="number"
				inputmode="numeric"
				bind:value={formDamageBonus}
				placeholder="0"
			/>
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-attack-roll-bonus" class="text-xs font-medium text-muted-foreground"
				>Attack Roll Bonus</label
			>
			<Input
				id="hb-weapon-attack-roll-bonus"
				type="number"
				inputmode="numeric"
				bind:value={formAttackRollBonus}
				placeholder="0"
			/>
		</div>
	</div>

	<!-- Features -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">
				Features
			</p>
			<Button type="button" size="sm" variant="outline" onclick={()=>addFeature(formFeatures.length)}>
				<Plus class="size-3.5" />
				Add Feature
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each formFeatures as feature, index (index)}
				<Dropdown
					title={feature.title || `Unnamed feature`}
					class={featureErrors.has(index) ? 'data-[open=false]:border-destructive data-[open=false]:border' : ''}
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
		<div class="flex gap-2 justify-end">
			{#if formHasChanges}
				<Button type="button" size="sm" variant="link" onclick={handleReset}>
					<RotateCcw class="size-3.5" />
					Discard
				</Button>
			{/if}
			<Button
				type="submit"
				size="sm"
				disabled={!formHasChanges || homebrew.saving}
				class={hasValidationErrors ? 'border-destructive border' : ''}
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
				<ul class="list-disc list-inside space-y-1">
					{#each allErrorMessages as error}
						<li class="text-xs text-destructive">{error}</li>
					{/each}
				</ul>
		{/if}
	</div>
</form>
