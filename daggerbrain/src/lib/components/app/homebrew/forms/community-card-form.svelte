<script lang="ts">
	import type { Feature, CommunityCard } from '@shared/types/compendium.types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { cn } from '$lib/utils';
	import HomebrewFeatureForm from '../features/feature-form.svelte';
	import Dropdown from '../../leveling/dropdown.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import ImageUrlInput from '../image-url-input.svelte';
	import {
		CONDITIONS_CHOICE_REQUIRED,
		CommunityCardFormSchema,
		FeatureSchema,
		extractFieldErrors,
		extractFeatureErrors,
		type CommunityCardFormErrors,
		type FeatureValidationErrors
	} from '../form-schemas';
	import { SvelteMap } from 'svelte/reactivity';
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
		item: CommunityCard;
		hasChanges?: boolean;
		hasErrors?: boolean;
		unsavedItem?: CommunityCard | null;
		onSubmit?: (e?: SubmitEvent) => void;
		onReset?: () => void;
	} = $props();

	const homebrew = getHomebrewContext();

	// Reference to image input component
	let imageInput: {
		uploadPendingFile: () => Promise<string | null>;
		getPreviewUrl: () => string | null;
		clearPendingFile: () => void;
	} | null = $state(null);

	// Track if there's a pending image file
	let hasPendingImageFile = $state(false);

	// Form state - initialized from communityCard prop
	let formTitle = $state('');
	let formDescriptionHtml = $state('');
	let formImageUrl = $state('');
	let formArtistName = $state('');
	let formTokens = $state(false);
	let formFeatures = $state<Feature[]>([]);

	// Validation errors state
	let errors = $state<CommunityCardFormErrors>({});

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

	// Check if form has changes compared to the item prop
	let formHasChanges = $derived.by(() => {
		if (!item) return false;

		const titleMatch = formTitle.trim() === item.title;
		const descriptionMatch = formDescriptionHtml === item.description_html;
		const imageUrlMatch = formImageUrl === item.image_url;
		const artistNameMatch = formArtistName.trim() === item.artist_name;
		const tokensMatch = formTokens === item.tokens;

		// Compare features (deep comparison)
		const featuresMatch = JSON.stringify(formFeatures) === JSON.stringify(item.features);

		return !(
			titleMatch &&
			descriptionMatch &&
			imageUrlMatch &&
			artistNameMatch &&
			!hasPendingImageFile &&
			tokensMatch &&
			featuresMatch
		);
	});

	// Build unsaved community card from current form state
	let unsavedCommunityCard = $derived.by(() => {
		if (!item) return null;

		// Track all form fields to ensure reactivity
		formTitle;
		formDescriptionHtml;
		formImageUrl;
		formArtistName;
		formTokens;
		formFeatures;
		hasPendingImageFile;

		// Get preview URL if there's a pending file
		const previewUrl = hasPendingImageFile && imageInput ? imageInput.getPreviewUrl() : null;

		// Build the unsaved community card by merging item with form data
		const formData = buildFormData();

		// Use preview URL if available, otherwise use formImageUrl
		return {
			...item,
			...formData,
			image_url: previewUrl || formData.image_url
		} as CommunityCard;
	});

	// Sync hasChanges to bindable prop
	$effect(() => {
		hasChanges = formHasChanges;
	});

	// Sync unsavedCommunityCard to bindable prop
	$effect(() => {
		unsavedItem = unsavedCommunityCard;
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

		// Add form-level errors (exclude 'features' since individual errors are shown)
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
			formTitle = item.title;
			formDescriptionHtml = item.description_html;
			formImageUrl = item.image_url;
			formArtistName = item.artist_name;
			formTokens = item.tokens;
			formFeatures = JSON.parse(JSON.stringify(item.features));
			// Clear pending image file when item changes
			hasPendingImageFile = false;
			// Clear errors when communityCard changes
			errors = {};
			featureErrors.clear();
			validationAttempted = false;
			validatedModifierKeys.clear();
		}
	});

	function buildFormData() {
		return {
			card_type: 'community' as const,
			title: formTitle.trim(),
			description_html: formDescriptionHtml,
			image_url: formImageUrl,
			artist_name: formArtistName.trim(),
			tokens: formTokens,
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
		const result = CommunityCardFormSchema.safeParse(formData);
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
		formImageUrl;
		formTokens;

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

		// Check if there are any validation errors
		const hasFormErrors = Object.keys(errors).length > 0;
		const hasFeatureErrors = featureErrors.size > 0;

		if (hasFormErrors || hasFeatureErrors) {
			// Don't set generic error message - errors are shown inline in each feature
			return;
		}

		// Build form data (validation already passed, so we can use it)
		const formData = buildFormData();

		// Save the original community card reference to find it in homebrew state
		const originalCommunityCard = item;
		// Update the communityCard prop with validated form values
		const updatedCommunityCard = {
			...item,
			...formData
		};
		item = updatedCommunityCard;

		// Update the homebrew state record so auto-save can detect the change
		// Find the community card in the nested structure using the original reference
		const newCommunityCardRef = JSON.parse(JSON.stringify(updatedCommunityCard));
		for (const [cardId, card] of Object.entries(homebrew.community_cards)) {
			if (card === originalCommunityCard) {
				homebrew.community_cards[cardId] = newCommunityCardRef;
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
		// Re-sync form from communityCard prop
		formTitle = item.title;
		formDescriptionHtml = item.description_html;
		formImageUrl = item.image_url;
		formArtistName = item.artist_name;
		formTokens = item.tokens;
		formFeatures = JSON.parse(JSON.stringify(item.features));
		// Clear pending image file on reset
		imageInput?.clearPendingFile();
		hasPendingImageFile = false;
		// Clear errors on reset
		errors = {};
		featureErrors.clear();
		validationAttempted = false;
		validatedModifierKeys.clear();

		// Note: onReset callback removed to prevent infinite recursion
		// The parent component should handle any additional reset logic if needed
	}

	function addFeature() {
		const newFeature: Feature = {
			title: '',
			description_html: '',
			character_modifiers: [],
			weapon_modifiers: []
		};
		formFeatures = [...formFeatures, newFeature];
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
			for="hb-community-card-title"
			class={cn('text-xs font-medium text-muted-foreground', errors.title && 'text-destructive')}
			>Name</label
		>
		<Input
			id="hb-community-card-title"
			bind:value={formTitle}
			placeholder="Community card name"
			aria-invalid={!!errors.title}
		/>
		{#if errors.title}
			<p class="text-xs text-destructive">{errors.title}</p>
		{/if}
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-1">
		<label for="hb-community-card-description" class="text-xs font-medium text-muted-foreground"
			>Description</label
		>
		<Textarea
			id="hb-community-card-description"
			bind:value={formDescriptionHtml}
			placeholder="Community card description"
			rows={3}
		/>
	</div>

	<!-- Image & Artist Name -->
	<div class="flex gap-2">
		<div class="flex flex-col gap-1">
			<label for="hb-community-card-image-url" class="text-xs font-medium text-muted-foreground"
				>Artwork</label
			>
			<ImageUrlInput
				bind:this={imageInput}
				id="hb-community-card-image-url"
				bind:value={formImageUrl}
				bind:hasPendingFile={hasPendingImageFile}
				alt="Community card image"
				class="w-26"
			/>
		</div>

		<div class="flex grow flex-col gap-1">
			<!-- Artist name -->
			<div class="flex flex-col gap-1">
				<label for="hb-community-card-artist-name" class="text-xs font-medium text-muted-foreground"
					>Artist Name</label
				>
				<Input
					id="hb-community-card-artist-name"
					bind:value={formArtistName}
					placeholder="Artist name"
				/>
			</div>
		</div>
	</div>

	<!-- Tokens -->
	<div class="flex items-center gap-2">
		<Checkbox id="hb-community-card-tokens" bind:checked={formTokens} />
		<label for="hb-community-card-tokens" class="text-xs font-medium text-muted-foreground"
			>Uses Tokens</label
		>
	</div>

	<!-- Features -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Features</p>
			<Button type="button" size="sm" variant="outline" onclick={addFeature}>
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
