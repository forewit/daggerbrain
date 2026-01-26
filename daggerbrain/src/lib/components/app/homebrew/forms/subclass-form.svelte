<script lang="ts">
	import type { Subclass, CharacterClass } from '@shared/types/compendium.types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs';
	import { cn } from '$lib/utils';
	import SubclassCardEditor from '../features/subclass-card-editor.svelte';
	import Dropdown from '../../leveling/dropdown.svelte';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import {
		SubclassFormSchema,
		extractFieldErrors,
		type SubclassFormErrors,
		type FeatureValidationErrors
	} from '../form-schemas';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import Loader2 from '@lucide/svelte/icons/loader-2';

	let {
		item = $bindable(),
		hasChanges = $bindable(),
		hasErrors = $bindable(),
		unsavedItem = $bindable(),
		formTab = $bindable(),
		onSubmit,
		onReset
	}: {
		formTab: 'foundation' | 'specialization' | 'mastery';
		item: Subclass;
		hasChanges?: boolean;
		hasErrors?: boolean;
		unsavedItem?: Subclass | null;
		onSubmit?: (e?: SubmitEvent) => void;
		onReset?: () => void;
	} = $props();

	const compendium = getCompendiumContext();
	const homebrew = getHomebrewContext();

	// References to card editor components
	let foundationEditor: {
		uploadPendingImage: () => Promise<void>;
		markValidationAttempted: () => void;
		getErrors: () => Map<number, FeatureValidationErrors>;
	} | null = $state(null);
	let specializationEditor: {
		uploadPendingImage: () => Promise<void>;
		markValidationAttempted: () => void;
		getErrors: () => Map<number, FeatureValidationErrors>;
	} | null = $state(null);
	let masteryEditor: {
		uploadPendingImage: () => Promise<void>;
		markValidationAttempted: () => void;
		getErrors: () => Map<number, FeatureValidationErrors>;
	} | null = $state(null);

	// Track pending image files from card editors
	let foundationHasPendingFile = $state(false);
	let specializationHasPendingFile = $state(false);
	let masteryHasPendingFile = $state(false);

	// Form state - initialized from subclass prop
	let formName = $state('');
	let formDescriptionHtml = $state('');
	let formClassId = $state('');

	// Form state for cards - separate from item to prevent auto-save
	// Initialize with deep copies to prevent mutations from affecting item directly
	let formFoundationCard = $state(JSON.parse(JSON.stringify(item.foundation_card)));
	let formSpecializationCard = $state(JSON.parse(JSON.stringify(item.specialization_card)));
	let formMasteryCard = $state(JSON.parse(JSON.stringify(item.mastery_card)));

	// Validation errors state
	let errors = $state<SubclassFormErrors>({});

	// Feature validation state - track detailed errors for each card
	const foundationFeatureErrors = new Map<number, FeatureValidationErrors>();
	const specializationFeatureErrors = new Map<number, FeatureValidationErrors>();
	const masteryFeatureErrors = new Map<number, FeatureValidationErrors>();

	// Track if validation has been attempted (to show errors only after first submit attempt)
	let validationAttempted = $state(false);

	// Get all available classes (compendium + homebrew)
	let availableClasses = $derived.by(() => {
		const classes: Array<{ id: string; name: string; source: 'compendium' | 'homebrew' }> = [];
		// Add compendium classes
		for (const [id, cls] of Object.entries(compendium.classes)) {
			classes.push({ id, name: cls.name, source: 'compendium' });
		}
		// Add homebrew classes
		for (const [id, cls] of Object.entries(homebrew.classes)) {
			classes.push({ id, name: cls.name, source: 'homebrew' });
		}
		return classes.sort((a, b) => a.name.localeCompare(b.name));
	});

	// Check if form has changes compared to the item prop
	let formHasChanges = $derived.by(() => {
		if (!item) return false;

		const nameMatch = formName.trim() === item.name;
		const descriptionMatch = formDescriptionHtml === item.description_html;
		const classIdMatch = formClassId === item.class_id;

		// Compare cards (deep comparison) - compare form state to item state
		const foundationMatch =
			JSON.stringify(formFoundationCard) === JSON.stringify(item.foundation_card);
		const specializationMatch =
			JSON.stringify(formSpecializationCard) === JSON.stringify(item.specialization_card);
		const masteryMatch = JSON.stringify(formMasteryCard) === JSON.stringify(item.mastery_card);

		// Check for pending image files
		const hasPendingImageFile =
			foundationHasPendingFile || specializationHasPendingFile || masteryHasPendingFile;

		return !(
			nameMatch &&
			descriptionMatch &&
			classIdMatch &&
			foundationMatch &&
			specializationMatch &&
			masteryMatch &&
			!hasPendingImageFile
		);
	});

	// Build unsaved subclass from current form state
	let unsavedSubclass = $derived.by(() => {
		if (!item) return null;

		// Track all form fields to ensure reactivity
		formName;
		formDescriptionHtml;
		formClassId;
		formFoundationCard;
		formSpecializationCard;
		formMasteryCard;

		// Explicitly track class_id in each card to ensure reactivity
		formFoundationCard?.class_id;
		formSpecializationCard?.class_id;
		formMasteryCard?.class_id;

		// Build the unsaved subclass by merging item with form data
		return {
			...item,
			...buildFormData()
		} as Subclass;
	});

	// Sync hasChanges to bindable prop
	$effect(() => {
		hasChanges = formHasChanges;
	});

	// Sync unsavedSubclass to bindable prop
	$effect(() => {
		unsavedItem = unsavedSubclass;
	});

	// Check if there are any validation errors
	let hasValidationErrors = $derived.by(() => {
		// Check form-level errors
		if (Object.keys(errors).length > 0) {
			return true;
		}
		// Check feature errors from all cards
		if (
			foundationFeatureErrors.size > 0 ||
			specializationFeatureErrors.size > 0 ||
			masteryFeatureErrors.size > 0
		) {
			return true;
		}
		return false;
	});

	// Collect all error messages for display
	let allErrorMessages = $derived.by(() => {
		const messages: string[] = [];

		// Add form-level errors (exclude 'foundation_card', 'specialization_card', 'mastery_card' since individual errors are shown)
		for (const [key, value] of Object.entries(errors)) {
			if (
				value &&
				key !== 'foundation_card' &&
				key !== 'specialization_card' &&
				key !== 'mastery_card'
			) {
				messages.push(`${key}: ${value}`);
			}
		}

		// Add foundation card feature errors
		for (const [index, featureError] of foundationFeatureErrors) {
			const featureTitle =
				formFoundationCard.features[index]?.title || `Foundation Feature ${index + 1}`;
			if (featureError.title) {
				messages.push(`Foundation Card, ${featureTitle}, Title: ${featureError.title}`);
			}
			if (featureError.description_html) {
				messages.push(
					`Foundation Card, ${featureTitle}, Description: ${featureError.description_html}`
				);
			}
			if (featureError.character_modifiers) {
				for (const [modIndex, modErrors] of featureError.character_modifiers) {
					for (const error of modErrors) {
						messages.push(
							`Foundation Card, ${featureTitle}, Character Modifier ${modIndex + 1}: ${error}`
						);
					}
				}
			}
			if (featureError.weapon_modifiers) {
				for (const [modIndex, modErrors] of featureError.weapon_modifiers) {
					for (const error of modErrors) {
						messages.push(
							`Foundation Card, ${featureTitle}, Weapon Modifier ${modIndex + 1}: ${error}`
						);
					}
				}
			}
		}

		// Add specialization card feature errors
		for (const [index, featureError] of specializationFeatureErrors) {
			const featureTitle =
				formSpecializationCard.features[index]?.title || `Specialization Feature ${index + 1}`;
			if (featureError.title) {
				messages.push(`Specialization Card, ${featureTitle}, Title: ${featureError.title}`);
			}
			if (featureError.description_html) {
				messages.push(
					`Specialization Card, ${featureTitle}, Description: ${featureError.description_html}`
				);
			}
			if (featureError.character_modifiers) {
				for (const [modIndex, modErrors] of featureError.character_modifiers) {
					for (const error of modErrors) {
						messages.push(
							`Specialization Card, ${featureTitle}, Character Modifier ${modIndex + 1}: ${error}`
						);
					}
				}
			}
			if (featureError.weapon_modifiers) {
				for (const [modIndex, modErrors] of featureError.weapon_modifiers) {
					for (const error of modErrors) {
						messages.push(
							`Specialization Card, ${featureTitle}, Weapon Modifier ${modIndex + 1}: ${error}`
						);
					}
				}
			}
		}

		// Add mastery card feature errors
		for (const [index, featureError] of masteryFeatureErrors) {
			const featureTitle = formMasteryCard.features[index]?.title || `Mastery Feature ${index + 1}`;
			if (featureError.title) {
				messages.push(`Mastery Card, ${featureTitle}, Title: ${featureError.title}`);
			}
			if (featureError.description_html) {
				messages.push(
					`Mastery Card, ${featureTitle}, Description: ${featureError.description_html}`
				);
			}
			if (featureError.character_modifiers) {
				for (const [modIndex, modErrors] of featureError.character_modifiers) {
					for (const error of modErrors) {
						messages.push(
							`Mastery Card, ${featureTitle}, Character Modifier ${modIndex + 1}: ${error}`
						);
					}
				}
			}
			if (featureError.weapon_modifiers) {
				for (const [modIndex, modErrors] of featureError.weapon_modifiers) {
					for (const error of modErrors) {
						messages.push(
							`Mastery Card, ${featureTitle}, Weapon Modifier ${modIndex + 1}: ${error}`
						);
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
			formDescriptionHtml = item.description_html;
			formClassId = item.class_id;
			// Deep copy cards to form state
			formFoundationCard = JSON.parse(JSON.stringify(item.foundation_card));
			formSpecializationCard = JSON.parse(JSON.stringify(item.specialization_card));
			formMasteryCard = JSON.parse(JSON.stringify(item.mastery_card));
			// Clear pending image files when item changes
			foundationHasPendingFile = false;
			specializationHasPendingFile = false;
			masteryHasPendingFile = false;
			// Clear errors when subclass changes
			errors = {};
			foundationFeatureErrors.clear();
			specializationFeatureErrors.clear();
			masteryFeatureErrors.clear();
			validationAttempted = false;
		}
	});

	function buildFormData() {
		return {
			name: formName.trim(),
			description_html: formDescriptionHtml,
			class_id: formClassId,
			foundation_card: JSON.parse(JSON.stringify(formFoundationCard)),
			specialization_card: JSON.parse(JSON.stringify(formSpecializationCard)),
			mastery_card: JSON.parse(JSON.stringify(formMasteryCard))
		};
	}

	// Validate features from all card editors (initial validation - marks validation as attempted)
	function validateFeaturesInitial() {
		if (foundationEditor) {
			foundationEditor.markValidationAttempted();
			const errors = foundationEditor.getErrors();
			foundationFeatureErrors.clear();
			for (const [index, error] of errors) {
				foundationFeatureErrors.set(index, error);
			}
		}
		if (specializationEditor) {
			specializationEditor.markValidationAttempted();
			const errors = specializationEditor.getErrors();
			specializationFeatureErrors.clear();
			for (const [index, error] of errors) {
				specializationFeatureErrors.set(index, error);
			}
		}
		if (masteryEditor) {
			masteryEditor.markValidationAttempted();
			const errors = masteryEditor.getErrors();
			masteryFeatureErrors.clear();
			for (const [index, error] of errors) {
				masteryFeatureErrors.set(index, error);
			}
		}
	}

	// Re-validate features without marking validation as attempted (for reactive updates)
	function revalidateFeatures() {
		if (foundationEditor) {
			const errors = foundationEditor.getErrors();
			foundationFeatureErrors.clear();
			for (const [index, error] of errors) {
				foundationFeatureErrors.set(index, error);
			}
		}
		if (specializationEditor) {
			const errors = specializationEditor.getErrors();
			specializationFeatureErrors.clear();
			for (const [index, error] of errors) {
				specializationFeatureErrors.set(index, error);
			}
		}
		if (masteryEditor) {
			const errors = masteryEditor.getErrors();
			masteryFeatureErrors.clear();
			for (const [index, error] of errors) {
				masteryFeatureErrors.set(index, error);
			}
		}
	}

	// Validate form-level fields
	function validateFormFields() {
		const formData = buildFormData();
		const result = SubclassFormSchema.safeParse(formData);
		if (!result.success) {
			errors = extractFieldErrors(result.error);
		} else {
			errors = {};
		}
	}

	// Reactive validation - re-validate when form data changes (only after first validation attempt)
	$effect(() => {
		if (!validationAttempted) return;

		// Re-validate features when they change (without marking validation attempted to prevent loops)
		revalidateFeatures();
	});

	// Re-validate form fields when they change
	$effect(() => {
		if (!validationAttempted) return;

		// Track form field changes
		formName;
		formDescriptionHtml;
		formClassId;
		formFoundationCard;
		formSpecializationCard;
		formMasteryCard;

		validateFormFields();
	});

	export async function handleSubmit(e?: SubmitEvent) {
		if (e) {
			e.preventDefault();
		}
		if (!item) return;

		// Upload pending images for all cards
		try {
			if (foundationEditor) await foundationEditor.uploadPendingImage();
			if (specializationEditor) await specializationEditor.uploadPendingImage();
			if (masteryEditor) await masteryEditor.uploadPendingImage();
		} catch (error) {
			console.error('Failed to upload image:', error);
			alert('Failed to upload image. Please try again.');
			return;
		}

		// Mark that validation has been attempted
		validationAttempted = true;

		// Validate all features (initial validation - marks validation as attempted)
		validateFeaturesInitial();

		// Validate form-level fields
		validateFormFields();

		// Check if there are any validation errors
		const hasFormErrors = Object.keys(errors).length > 0;
		const hasFeatureErrors =
			foundationFeatureErrors.size > 0 ||
			specializationFeatureErrors.size > 0 ||
			masteryFeatureErrors.size > 0;

		if (hasFormErrors || hasFeatureErrors) {
			// Don't set generic error message - errors are shown inline
			return;
		}

		// Build form data (validation already passed, so we can use it)
		const formData = buildFormData();

		// Save the original subclass reference to find it in homebrew state
		const originalSubclass = item;
		// Update the subclass prop with validated form values
		const updatedSubclass = {
			...item,
			...formData
		};
		item = updatedSubclass;

		// Update the homebrew state record so auto-save can detect the change
		// Find the subclass using compendium_id
		const newSubclassRef = JSON.parse(JSON.stringify(updatedSubclass));
		for (const [subclassId, subclass] of Object.entries(homebrew.subclasses)) {
			if (subclass.compendium_id === originalSubclass.compendium_id) {
				homebrew.subclasses[subclassId] = newSubclassRef;
				break;
			}
		}

		// Clear errors on success
		errors = {};
		foundationFeatureErrors.clear();
		specializationFeatureErrors.clear();
		masteryFeatureErrors.clear();
		validationAttempted = false;

		// Call callback if provided
		if (onSubmit && e) {
			onSubmit(e);
		}
	}

	export function handleReset() {
		if (!item) return;
		// Re-sync form from subclass prop
		formName = item.name;
		formDescriptionHtml = item.description_html;
		formClassId = item.class_id;
		// Deep copy cards to form state
		formFoundationCard = JSON.parse(JSON.stringify(item.foundation_card));
		formSpecializationCard = JSON.parse(JSON.stringify(item.specialization_card));
		formMasteryCard = JSON.parse(JSON.stringify(item.mastery_card));
		// Clear pending image files on reset
		foundationHasPendingFile = false;
		specializationHasPendingFile = false;
		masteryHasPendingFile = false;
		// Clear errors on reset
		errors = {};
		foundationFeatureErrors.clear();
		specializationFeatureErrors.clear();
		masteryFeatureErrors.clear();
		validationAttempted = false;

		// Note: onReset callback removed to prevent infinite recursion
		// The parent component should handle any additional reset logic if needed
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">
	<!-- Name -->
	<div class="flex flex-col gap-1">
		<label
			for="hb-subclass-name"
			class={cn('text-xs font-medium text-muted-foreground', errors.name && 'text-destructive')}
			>Name</label
		>
		<Input
			id="hb-subclass-name"
			bind:value={formName}
			placeholder="Subclass name"
			aria-invalid={!!errors.name}
		/>
		{#if errors.name}
			<p class="text-xs text-destructive">{errors.name}</p>
		{/if}
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-1">
		<label for="hb-subclass-description" class="text-xs font-medium text-muted-foreground"
			>Description</label
		>
		<Textarea
			id="hb-subclass-description"
			bind:value={formDescriptionHtml}
			placeholder="Subclass description"
			rows={3}
		/>
	</div>

	<!-- Class ID -->
	<div class="flex flex-col gap-1">
		<label
			for="hb-subclass-class-id"
			class={cn('text-xs font-medium text-muted-foreground', errors.class_id && 'text-destructive')}
			>Class</label
		>
		<Select.Root type="single" bind:value={formClassId}>
			<Select.Trigger id="hb-subclass-class-id" class="w-full">
				<p class="truncate">
					{availableClasses.find((c) => c.id === formClassId)?.name || 'Select a class'}
				</p>
			</Select.Trigger>
			<Select.Content>
				{#each availableClasses as cls}
					<Select.Item value={cls.id}>
						{cls.name} ({cls.source === 'homebrew' ? 'Homebrew' : 'Compendium'})
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		{#if errors.class_id}
			<p class="text-xs text-destructive">{errors.class_id}</p>
		{/if}
	</div>

	<Tabs.Root bind:value={formTab}>
		<Tabs.List class="mx-auto">
			<Tabs.Trigger value="foundation">Foundation</Tabs.Trigger>
			<Tabs.Trigger value="specialization">Specialization</Tabs.Trigger>
			<Tabs.Trigger value="mastery">Mastery</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="foundation">
			<SubclassCardEditor
				bind:this={foundationEditor}
				bind:card={formFoundationCard}
				cardType="foundation"
				classId={formClassId}
				bind:title={formName}
				bind:hasPendingFile={foundationHasPendingFile}
			/>
		</Tabs.Content>
		<Tabs.Content value="specialization">
			<SubclassCardEditor
				bind:this={specializationEditor}
				bind:card={formSpecializationCard}
				cardType="specialization"
				classId={formClassId}
				bind:title={formName}
				bind:hasPendingFile={specializationHasPendingFile}
			/>
		</Tabs.Content>
		<Tabs.Content value="mastery">
			<SubclassCardEditor
				bind:this={masteryEditor}
				bind:card={formMasteryCard}
				cardType="mastery"
				classId={formClassId}
				bind:title={formName}
				bind:hasPendingFile={masteryHasPendingFile}
			/>
		</Tabs.Content>
	</Tabs.Root>

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
