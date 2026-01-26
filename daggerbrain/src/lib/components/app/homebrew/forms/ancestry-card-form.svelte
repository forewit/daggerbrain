<script lang="ts">
	import type { Feature, AncestryCard, AncestryCardChoice } from '@shared/types/compendium.types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import HomebrewFeatureForm from '../features/feature-form.svelte';
	import HomebrewAncestryChoicesEditor from '../features/ancestry-choices-editor.svelte';
	import Dropdown from '../../leveling/dropdown.svelte';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import ImageUrlInput from '../image-url-input.svelte';
	import {
		CONDITIONS_CHOICE_REQUIRED,
		AncestryCardFormSchema,
		FeatureSchema,
		extractFieldErrors,
		extractFeatureErrors,
		type AncestryCardFormErrors,
		type FeatureValidationErrors
	} from '../form-schemas';
	import { SvelteMap } from 'svelte/reactivity';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { untrack } from 'svelte';
	import Loader2 from '@lucide/svelte/icons/loader-2';

	let {
		item = $bindable(),
		hasChanges = $bindable(),
		hasErrors = $bindable(),
		unsavedItem = $bindable(),
		onSubmit,
		onReset
	}: {
		item: AncestryCard;
		hasChanges?: boolean;
		hasErrors?: boolean;
		unsavedItem?: AncestryCard | null;
		onSubmit?: (e?: SubmitEvent) => void;
		onReset?: () => void;
	} = $props();

	const compendium = getCompendiumContext();
	const homebrew = getHomebrewContext();

	// Reference to image input component
	let imageInput: {
		uploadPendingFile: () => Promise<string | null>;
		getPreviewUrl: () => string | null;
		clearPendingFile: () => void;
	} | null = $state(null);

	// Track if there's a pending image file
	let hasPendingImageFile = $state(false);

	// Form state - initialized from ancestryCard prop
	let formTitle = $state('');
	let formDescriptionHtml = $state('');
	let formImageUrl = $state('');
	let formArtistName = $state('');
	let formFeatures = $state<Feature[]>([]);
	let formChoices = $state<AncestryCardChoice[]>([]);

	// Validation errors state
	let errors = $state<AncestryCardFormErrors>({});

	// Feature validation state - track detailed errors for each feature
	const featureErrors = new SvelteMap<number, FeatureValidationErrors>();

	// Choice validation state - track errors for each choice by index in arbitraryChoices array
	let choiceErrors = $state<Map<number, string[]>>(new Map());

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

	// Check if form has changes compared to the item prop
	let formHasChanges = $derived.by(() => {
		if (!item) return false;

		const titleMatch = formTitle.trim() === item.title;
		const descriptionMatch = formDescriptionHtml === item.description_html;
		const imageUrlMatch = formImageUrl === item.image_url;
		const artistNameMatch = formArtistName.trim() === item.artist_name;

		// Compare features (deep comparison)
		const featuresMatch = JSON.stringify(formFeatures) === JSON.stringify(item.features);

		// Compare choices (deep comparison)
		const choicesMatch = JSON.stringify(formChoices) === JSON.stringify(item.choices);

		return !(
			titleMatch &&
			descriptionMatch &&
			imageUrlMatch &&
			artistNameMatch &&
			!hasPendingImageFile &&
			featuresMatch &&
			choicesMatch
		);
	});

	// Build unsaved ancestry card from current form state
	let unsavedAncestryCard = $derived.by(() => {
		if (!item) return null;

		// Track all form fields to ensure reactivity
		formTitle;
		formDescriptionHtml;
		formImageUrl;
		formArtistName;
		formFeatures;
		formChoices;
		hasPendingImageFile;

		// Get preview URL if there's a pending file
		const previewUrl = hasPendingImageFile && imageInput ? imageInput.getPreviewUrl() : null;

		// Build the unsaved ancestry card by merging item with form data
		const formData = buildFormData();

		// Use preview URL if available, otherwise use formImageUrl
		return {
			...item,
			...formData,
			image_url: previewUrl || formData.image_url
		} as AncestryCard;
	});

	// Sync hasChanges to bindable prop
	$effect(() => {
		hasChanges = formHasChanges;
	});

	// Sync unsavedAncestryCard to bindable prop
	$effect(() => {
		unsavedItem = unsavedAncestryCard;
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
		// Check choice errors
		if (choiceErrors.size > 0) {
			return true;
		}
		return false;
	});

	// Collect all error messages for display
	let allErrorMessages = $derived.by(() => {
		const messages: string[] = [];

		// Add form-level errors (exclude 'features' and 'choices' since individual errors are shown)
		for (const [key, value] of Object.entries(errors)) {
			if (value && key !== 'features' && key !== 'choices') {
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

		// Add choice errors
		const arbitraryChoices = formChoices.filter((c) => c.type === 'arbitrary');
		for (const [index, choiceErrorsList] of choiceErrors) {
			const choice = arbitraryChoices[index];
			const choiceName = choice?.choice_id || `Choice ${index + 1}`;
			for (const error of choiceErrorsList) {
				messages.push(`${choiceName}: ${error}`);
			}
		}

		return messages;
	});

	// Sync hasValidationErrors to bindable prop (only after validation attempted)
	$effect(() => {
		hasErrors = validationAttempted && hasValidationErrors;
	});

	// Ensure experience choices exist for character modifiers
	function ensureExperienceChoicesForModifiers() {
		// Find all character modifiers that target experience choices
		const experienceModifiers = formFeatures.flatMap((f) =>
			f.character_modifiers.filter(
				(m) => m.target === 'experience_from_ancestry_card_choice_selection' && (m as any).choice_id
			)
		);

		// For each modifier, ensure the referenced experience choice exists
		for (const modifier of experienceModifiers) {
			const choiceId = (modifier as any).choice_id;
			const existingChoice = formChoices.find(
				(c) => c.choice_id === choiceId && c.type === 'experience'
			);

			if (!existingChoice) {
				// Try to find the choice in the original item (if cloning)
				const originalChoice = item.choices?.find(
					(c) => c.choice_id === choiceId && c.type === 'experience'
				);

				const newChoice: AncestryCardChoice = {
					choice_id: choiceId,
					feature_index: originalChoice?.feature_index || 0, // Default to first feature
					type: 'experience',
					max: originalChoice?.max || 1, // Use original max or default to 1
					conditional_choice: originalChoice?.conditional_choice || null
				};
				formChoices = [...formChoices, newChoice];
			}
		}
	}

	// Helper function to ensure exactly 2 features
	function ensureTwoFeatures(features: Feature[]): Feature[] {
		const emptyFeature: Feature = {
			title: '',
			description_html: '',
			character_modifiers: [],
			weapon_modifiers: []
		};

		// Ensure we have exactly 2 features
		const result = [...features];
		while (result.length < 2) {
			result.push({ ...emptyFeature });
		}
		return result.slice(0, 2);
	}

	// Sync form state when item prop changes
	$effect(() => {
		if (item) {
			formTitle = item.title;
			formDescriptionHtml = item.description_html;
			formImageUrl = item.image_url;
			formArtistName = item.artist_name;
			// Ensure exactly 2 features
			const itemFeatures = JSON.parse(JSON.stringify(item.features));
			formFeatures = ensureTwoFeatures(itemFeatures);
			formChoices = JSON.parse(JSON.stringify(item.choices));
			// Ensure experience choices exist for modifiers (untrack to avoid effect re-running when formChoices is updated)
			untrack(() => ensureExperienceChoicesForModifiers());
			// Clear pending image file when item changes
			hasPendingImageFile = false;
			// Clear errors when item changes
			errors = {};
			featureErrors.clear();
			choiceErrors = new Map();
			validationAttempted = false;
			validatedModifierKeys.clear();
		}
	});

	function buildFormData() {
		return {
			card_type: 'ancestry' as const,
			title: formTitle.trim(),
			description_html: formDescriptionHtml,
			image_url: formImageUrl,
			artist_name: formArtistName.trim(),
			features: JSON.parse(JSON.stringify(formFeatures)),
			choices: JSON.parse(JSON.stringify(formChoices))
		};
	}

	// Validate choices for blank and duplicate names
	function validateChoices() {
		const errors = new Map<number, string[]>();
		const arbitraryChoices = formChoices.filter((c) => c.type === 'arbitrary');
		const nameCounts = new Map<string, number>();

		// Count occurrences of each name (case-insensitive, trimmed)
		arbitraryChoices.forEach((choice) => {
			const name = choice.choice_id.trim();
			const normalizedName = name.toLowerCase();
			nameCounts.set(normalizedName, (nameCounts.get(normalizedName) || 0) + 1);
		});

		// Check for blank and duplicate names, and invalid feature_index
		formChoices.forEach((choice, index) => {
			const name = choice.choice_id.trim();
			const normalizedName = name.toLowerCase();
			const choiceErrorsList: string[] = [];

			if (!name) {
				choiceErrorsList.push('Name is required');
			} else if (choice.type === 'arbitrary' && nameCounts.get(normalizedName)! > 1) {
				choiceErrorsList.push('Name must be unique');
			}

			// Validate feature_index is 0 or 1 (ancestry cards always have exactly 2 features)
			if (choice.feature_index !== 0 && choice.feature_index !== 1) {
				choiceErrorsList.push('Feature index must be 0 (Top Feature) or 1 (Bottom Feature)');
			}

			if (choiceErrorsList.length > 0) {
				// Map to index in arbitraryChoices array for display
				const arbitraryIndex = arbitraryChoices.findIndex((c) => c === choice);
				if (arbitraryIndex !== -1) {
					errors.set(arbitraryIndex, choiceErrorsList);
				}
			}
		});

		choiceErrors = errors;
		return errors.size === 0;
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

		// Second pass: ancestry_card_choice conditions with empty choice_id
		for (let i = 0; i < formFeatures.length; i++) {
			const f = formFeatures[i];
			for (let j = 0; j < f.character_modifiers.length; j++) {
				const mod = f.character_modifiers[j];
				const hasEmptyChoice = (mod.character_conditions || []).some(
					(c) => c.type === 'ancestry_card_choice' && (!c.choice_id || c.choice_id.trim() === '')
				);
				if (!hasEmptyChoice) continue;
				if (!validatedModifierKeys.has(getModifierKey(i, 'character', j))) continue;

				const existing = untrack(() => featureErrors.get(i) || {});
				const charMods = new Map(existing.character_modifiers || []);
				const arr = charMods.get(j) || [];
				if (!arr.includes(CONDITIONS_CHOICE_REQUIRED)) {
					charMods.set(j, [...arr, CONDITIONS_CHOICE_REQUIRED]);
				}
				featureErrors.set(i, { ...existing, character_modifiers: charMods });
			}
		}
	}

	// Validate form-level fields
	function validateFormFields() {
		const formData = buildFormData();
		const result = AncestryCardFormSchema.safeParse(formData);
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

		// Re-validate choices when they change
		validateChoices();
	});

	// Re-validate form fields when they change
	$effect(() => {
		if (!validationAttempted) return;

		// Track form field changes
		formTitle;
		formDescriptionHtml;
		formImageUrl;
		formChoices; // Track choices changes for validation

		validateFormFields();
	});

	export async function handleSubmit(e?: SubmitEvent) {
		if (e) {
			e.preventDefault();
		}
		if (!item) return;

		// Upload pending image if there is one
		if (imageInput) {
			try {
				const uploadedUrl = await imageInput.uploadPendingFile();
				if (uploadedUrl) {
					formImageUrl = uploadedUrl;
				}
			} catch (error) {
				console.error('Failed to upload image:', error);
				alert('Failed to upload image. Please try again.');
				return;
			}
		}

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

		// Validate choices
		validateChoices();

		// Check if there are any validation errors
		const hasFormErrors = Object.keys(errors).length > 0;
		const hasFeatureErrors = featureErrors.size > 0;
		const hasChoiceErrors = choiceErrors.size > 0;

		if (hasFormErrors || hasFeatureErrors || hasChoiceErrors) {
			// Don't set generic error message - errors are shown inline in each feature
			return;
		}

		// Build form data (validation already passed, so we can use it)
		const formData = buildFormData();

		// Save the original ancestry card reference to find it in homebrew state
		const originalAncestryCard = item;
		// Update the ancestryCard prop with validated form values
		const updatedAncestryCard = {
			...item,
			...formData
		};
		item = updatedAncestryCard;

		// Update the homebrew state record so auto-save can detect the change
		// Find the ancestry card in the nested structure using the original reference
		const newAncestryCardRef = JSON.parse(JSON.stringify(updatedAncestryCard));
		for (const [cardId, card] of Object.entries(homebrew.ancestry_cards)) {
			if (card === originalAncestryCard) {
				homebrew.ancestry_cards[cardId] = newAncestryCardRef;
				break;
			}
		}

		// Clear errors on success
		errors = {};
		featureErrors.clear();
		choiceErrors = new Map();
		validationAttempted = false;

		// Call callback if provided
		if (onSubmit && e) {
			onSubmit(e);
		}
	}

	export function handleReset() {
		if (!item) return;
		// Re-sync form from ancestryCard prop
		formTitle = item.title;
		formDescriptionHtml = item.description_html;
		formImageUrl = item.image_url;
		formArtistName = item.artist_name;
		// Ensure exactly 2 features
		const itemFeatures = JSON.parse(JSON.stringify(item.features));
		formFeatures = ensureTwoFeatures(itemFeatures);
		formChoices = JSON.parse(JSON.stringify(item.choices));
		ensureExperienceChoicesForModifiers();
		// Clear pending image file on reset
		imageInput?.clearPendingFile();
		hasPendingImageFile = false;
		// Clear errors on reset
		errors = {};
		featureErrors.clear();
		choiceErrors = new Map();
		validationAttempted = false;
		validatedModifierKeys.clear();

		// Note: onReset callback removed to prevent infinite recursion
		// The parent component should handle any additional reset logic if needed
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">
	<!-- Title -->
	<div class="flex flex-col gap-1">
		<label
			for="hb-ancestry-card-title"
			class={cn('text-xs font-medium text-muted-foreground', errors.title && 'text-destructive')}
			>Name</label
		>
		<Input
			id="hb-ancestry-card-title"
			bind:value={formTitle}
			placeholder="Ancestry card name"
			aria-invalid={!!errors.title}
		/>
		{#if errors.title}
			<p class="text-xs text-destructive">{errors.title}</p>
		{/if}
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-1">
		<label for="hb-ancestry-card-description" class="text-xs font-medium text-muted-foreground"
			>Description</label
		>
		<Textarea
			id="hb-ancestry-card-description"
			bind:value={formDescriptionHtml}
			placeholder="Ancestry card description"
			rows={3}
		/>
	</div>

	<!-- Image & Artist Name -->
	<div class="flex gap-2">
		<div class="flex flex-col gap-1">
			<label for="hb-ancestry-card-image-url" class="text-xs font-medium text-muted-foreground"
				>Artwork</label
			>
			<ImageUrlInput
				bind:this={imageInput}
				id="hb-ancestry-card-image-url"
				bind:value={formImageUrl}
				bind:hasPendingFile={hasPendingImageFile}
				alt="Ancestry card image"
				class="w-26"
			/>
		</div>

		<div class="flex grow flex-col gap-1">
			<!-- Artist name -->
			<div class="flex flex-col gap-1">
				<label for="hb-ancestry-card-artist-name" class="text-xs font-medium text-muted-foreground"
					>Artist Name</label
				>
				<Input
					id="hb-ancestry-card-artist-name"
					bind:value={formArtistName}
					placeholder="Artist name"
				/>
			</div>
		</div>
	</div>

	<!-- Choices -->
	<div class="flex flex-col gap-2">
		<HomebrewAncestryChoicesEditor
			bind:choices={formChoices}
			errors={choiceErrors}
			featureCount={formFeatures.length}
		/>
	</div>

	<!-- Features -->
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium text-muted-foreground">Features</p>
		<div class="flex flex-col gap-2">
			{#each formFeatures as feature, index (index)}
				<Dropdown
					title={index === 0 ? 'Top Feature' : 'Bottom Feature'}
					class={featureErrors.has(index)
						? 'data-[open=false]:border data-[open=false]:border-destructive'
						: ''}
				>
					<HomebrewFeatureForm
						bind:feature={formFeatures[index]}
						errors={featureErrors.get(index)}
						bind:ancestryCardChoices={formChoices}
						ancestryCardId={item.compendium_id}
					/>
				</Dropdown>
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
				class={cn('h-7', hasValidationErrors && 'border border-destructive hover:bg-primary')}
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
