<script lang="ts">
	import type { Feature, Armor } from '@shared/types/compendium.types';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn, tier_to_min_level, level_to_tier } from '$lib/utils';
	import HomebrewFeatureForm from '../features/feature-form.svelte';
	import Dropdown from '../../leveling/dropdown.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import {
		ArmorFormSchema,
		FeatureSchema,
		extractFieldErrors,
		extractFeatureErrors,
		type ArmorFormErrors,
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
		item: Armor;
		hasChanges?: boolean;
		hasErrors?: boolean;
		onSubmit?: (e?: SubmitEvent) => void;
		onReset?: () => void;
	} = $props();

	const homebrew = getHomebrewContext();

	// Form state - initialized from armor prop
	let formTitle = $state('');
	let formDescriptionHtml = $state('');
	let formTier = $state('');
	let formMaxArmor = $state('');
	let formMajorThreshold = $state('');
	let formSevereThreshold = $state('');
	let formFeatures = $state<Feature[]>([]);

	// Validation errors state
	let errors = $state<ArmorFormErrors>({});

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

	// Check if form has changes compared to the armor prop
	let formHasChanges = $derived.by(() => {
		if (!item) return false;

		const titleMatch = formTitle.trim() === item.title;
		const descriptionMatch = formDescriptionHtml === item.description_html;

		// Compare tier/level
		const formLevelRequirement = formTier ? tier_to_min_level(Number(formTier)) : 1;
		const tierMatch = formLevelRequirement === item.level_requirement;

		// Compare max armor
		const formMaxArmorNum = formMaxArmor === '' ? 0 : Number(formMaxArmor);
		const maxArmorMatch = formMaxArmorNum === item.max_armor;

		// Compare damage thresholds
		const formMajorNum = formMajorThreshold === '' ? 0 : Number(formMajorThreshold);
		const formSevereNum = formSevereThreshold === '' ? 0 : Number(formSevereThreshold);
		const majorMatch = formMajorNum === item.damage_thresholds.major;
		const severeMatch = formSevereNum === item.damage_thresholds.severe;

		// Compare features (deep comparison)
		const featuresMatch = JSON.stringify(formFeatures) === JSON.stringify(item.features);

		return !(
			titleMatch &&
			descriptionMatch &&
			tierMatch &&
			maxArmorMatch &&
			majorMatch &&
			severeMatch &&
			featuresMatch
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

	// Sync form state when armor prop changes
	$effect(() => {
		if (item) {
			formTitle = item.title;
			formDescriptionHtml = item.description_html;
			formTier = String(level_to_tier(item.level_requirement));
			formMaxArmor = item.max_armor === 0 ? '' : String(item.max_armor);
			formMajorThreshold =
				item.damage_thresholds.major === 0 ? '' : String(item.damage_thresholds.major);
			formSevereThreshold =
				item.damage_thresholds.severe === 0 ? '' : String(item.damage_thresholds.severe);
			formFeatures = JSON.parse(JSON.stringify(item.features));
			// Clear errors when armor changes
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
			max_armor: formMaxArmor === '' ? 0 : Number(formMaxArmor),
			damage_thresholds: {
				major: formMajorThreshold === '' ? 0 : Number(formMajorThreshold),
				severe: formSevereThreshold === '' ? 0 : Number(formSevereThreshold)
			},
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
		const result = ArmorFormSchema.safeParse(formData);
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
		formMaxArmor;
		formMajorThreshold;
		formSevereThreshold;

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

		// Save the original armor reference to find it in homebrew state
		const originalArmor = item;
		// Update the armor prop with validated form values
		const updatedArmor = {
			...item,
			...formData
		};
		item = updatedArmor;

		// Update the homebrew state record so auto-save can detect the change
		// Find the armor's UID in the collection using the original reference
		const newArmorRef = JSON.parse(JSON.stringify(updatedArmor));
		for (const [uid, a] of Object.entries(homebrew.armor)) {
			if (a === originalArmor) {
				homebrew.armor[uid] = newArmorRef;
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
		// Re-sync form from armor prop
		formTitle = item.title;
		formDescriptionHtml = item.description_html;
		formTier = String(level_to_tier(item.level_requirement));
		formMaxArmor = item.max_armor === 0 ? '' : String(item.max_armor);
		formMajorThreshold =
			item.damage_thresholds.major === 0 ? '' : String(item.damage_thresholds.major);
		formSevereThreshold =
			item.damage_thresholds.severe === 0 ? '' : String(item.damage_thresholds.severe);
		formFeatures = JSON.parse(JSON.stringify(item.features));
		// Clear errors on reset
		errors = {};
		featureErrors.clear();
		validationAttempted = false;
		validatedModifierKeys.clear();

		// Note: onReset callback removed to prevent infinite recursion
		// The parent component should handle any additional reset logic if needed
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
	<!-- Title -->
	<div class="flex flex-col gap-1">
		<label
			for="hb-armor-title"
			class={cn('text-xs font-medium text-muted-foreground', errors.title && 'text-destructive')}
			>Name</label
		>
		<Input
			id="hb-armor-title"
			bind:value={formTitle}
			placeholder="Armor name"
			aria-invalid={!!errors.title}
		/>
		{#if errors.title}
			<p class="text-xs text-destructive">{errors.title}</p>
		{/if}
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-1">
		<label for="hb-armor-description" class="text-xs font-medium text-muted-foreground"
			>Description</label
		>
		<Textarea
			id="hb-armor-description"
			bind:value={formDescriptionHtml}
			placeholder="Armor description"
			rows={3}
		/>
	</div>

	<!-- Tier -->
	<div class="flex flex-col gap-1">
		<label for="hb-armor-tier" class="text-xs font-medium text-muted-foreground">Tier</label>
		<Select.Root type="single" bind:value={formTier}>
			<Select.Trigger id="hb-armor-tier" class="w-full">
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

	<!-- Max Armor -->
	<div class="flex flex-col gap-1">
		<label for="hb-armor-max-armor" class="text-xs font-medium text-muted-foreground"
			>Base Armor Score</label
		>
		<Input
			id="hb-armor-max-armor"
			type="number"
			inputmode="numeric"
			bind:value={formMaxArmor}
			placeholder="0"
			min="0"
			step="1"
		/>
	</div>

	<!-- Damage Thresholds -->
	<div class="flex flex-col gap-1">
		<p class="text-xs font-medium text-muted-foreground">Base Damage Thresholds</p>
		<div class="grid grid-cols-2 gap-3">
			<div class="flex flex-col gap-1">
				<label for="hb-armor-major-threshold" class="text-xs text-muted-foreground"
					>Major Threshold</label
				>
				<Input
					id="hb-armor-major-threshold"
					type="number"
					inputmode="numeric"
					bind:value={formMajorThreshold}
					placeholder="0"
					min="0"
					step="1"
				/>
			</div>
			<div class="flex flex-col gap-1">
				<label for="hb-armor-severe-threshold" class="text-xs text-muted-foreground"
					>Severe Threshold</label
				>
				<Input
					id="hb-armor-severe-threshold"
					type="number"
					inputmode="numeric"
					bind:value={formSevereThreshold}
					placeholder="0"
					min="0"
					step="1"
				/>
			</div>
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
