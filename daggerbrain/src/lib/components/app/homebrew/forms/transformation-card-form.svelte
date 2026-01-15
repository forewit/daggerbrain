<script lang="ts">
	import type { Feature, TransformationCard } from '@shared/types/compendium.types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import HomebrewFeatureForm from '../features/feature-form.svelte';
	import Dropdown from '../../leveling/dropdown.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import ImageUrlInput from '../image-url-input.svelte';
	import {
		TransformationCardFormSchema,
		FeatureSchema,
		extractFieldErrors,
		type TransformationCardFormErrors
	} from '../form-schemas';
	import { SvelteMap } from 'svelte/reactivity';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import Loader2 from '@lucide/svelte/icons/loader-2';

	let {
		item = $bindable(),
		hasChanges = $bindable(),
		hasErrors = $bindable(),
		onSubmit,
		onReset
	}: {
		item: TransformationCard;
		hasChanges?: boolean;
		hasErrors?: boolean;
		onSubmit?: (e?: SubmitEvent) => void;
		onReset?: () => void;
	} = $props();

	const homebrew = getHomebrewContext();

	// Reference to image input component
	let imageInput: { uploadPendingFile: () => Promise<string | null> } | null = $state(null);

	// Form state - initialized from transformationCard prop
	let formTitle = $state('');
	let formDescriptionHtml = $state('');
	let formImageUrl = $state('');
	let formFeatures = $state<Feature[]>([]);

	// Validation errors state
	let errors = $state<TransformationCardFormErrors>({});

	// Feature validation state - track which features have errors
	const featureErrors = new SvelteMap<number, boolean>();

	// Check if form has changes compared to the item prop
	let formHasChanges = $derived.by(() => {
		if (!item) return false;

		const titleMatch = formTitle.trim() === item.title;
		const descriptionMatch = formDescriptionHtml === item.description_html;
		const imageUrlMatch = formImageUrl === item.image_url;

		// Compare features (deep comparison)
		const featuresMatch = JSON.stringify(formFeatures) === JSON.stringify(item.features);

		return !(titleMatch && descriptionMatch && imageUrlMatch && featuresMatch);
	});

	// Sync hasChanges to bindable prop
	$effect(() => {
		hasChanges = formHasChanges;
	});

	// Check if there are validation errors
	let hasValidationErrors = $derived.by(() => {
		return Object.keys(errors).length > 0 || featureErrors.size > 0;
	});

	// Sync hasValidationErrors to bindable prop
	$effect(() => {
		hasErrors = hasValidationErrors;
	});

	// Sync form state when item prop changes
	$effect(() => {
		if (item) {
			formTitle = item.title;
			formDescriptionHtml = item.description_html;
			formImageUrl = item.image_url;
			formFeatures = JSON.parse(JSON.stringify(item.features));
			// Clear errors when transformationCard changes
			errors = {};
			featureErrors.clear();
		}
	});

	function buildFormData() {
		return {
			card_type: 'transformation' as const,
			title: formTitle.trim(),
			description_html: formDescriptionHtml,
			image_url: formImageUrl,
			artist_name: '',
			features: JSON.parse(JSON.stringify(formFeatures))
		};
	}

	export async function handleSubmit(e?: SubmitEvent) {
		if (e) {
			e.preventDefault();
		}
		if (!item) return;

		// Clear previous errors
		errors = {};
		featureErrors.clear();

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

		// Validate all features directly
		let allFeaturesValid = true;
		for (let i = 0; i < formFeatures.length; i++) {
			const result = FeatureSchema.safeParse(formFeatures[i]);
			if (!result.success) {
				allFeaturesValid = false;
				featureErrors.set(i, true);
			}
		}

		// Build form data
		const formData = buildFormData();

		// Validate with Zod
		const result = TransformationCardFormSchema.safeParse(formData);

		if (!result.success) {
			errors = extractFieldErrors(result.error);
			return;
		}

		if (!allFeaturesValid) {
			errors = { ...errors, features: 'One or more features have validation errors' };
			return;
		}

		// Update the transformationCard prop with validated form values
		item = {
			...item,
			...result.data
		};

		// Clear errors on success
		errors = {};
		featureErrors.clear();

		// Call callback if provided
		if (onSubmit && e) {
			onSubmit(e);
		}
	}

	export function handleReset() {
		if (!item) return;
		// Re-sync form from transformationCard prop
		formTitle = item.title;
		formDescriptionHtml = item.description_html;
		formImageUrl = item.image_url;
		formFeatures = JSON.parse(JSON.stringify(item.features));
		// Clear errors on reset
		errors = {};
		featureErrors.clear();

		// Call callback if provided
		if (onReset) {
			onReset();
		}
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
		const errorsToReindex: [number, boolean][] = [];
		for (const [i, hasError] of featureErrors) {
			if (i > index) {
				errorsToReindex.push([i, hasError]);
			}
		}

		// Delete old keys and set new ones
		for (const [i] of errorsToReindex) {
			featureErrors.delete(i);
		}
		for (const [i, hasError] of errorsToReindex) {
			featureErrors.set(i - 1, hasError);
		}
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">
	<!-- Title -->
	<div class="flex flex-col gap-1">
		<label
			for="hb-transformation-card-title"
			class={cn('text-xs font-medium text-muted-foreground', errors.title && 'text-destructive')}
			>Name</label
		>
		<Input
			id="hb-transformation-card-title"
			bind:value={formTitle}
			placeholder="Transformation card name"
			aria-invalid={!!errors.title}
		/>
		{#if errors.title}
			<p class="text-xs text-destructive">{errors.title}</p>
		{/if}
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-1">
		<label
			for="hb-transformation-card-description"
			class="text-xs font-medium text-muted-foreground">Description</label
		>
		<Textarea
			id="hb-transformation-card-description"
			bind:value={formDescriptionHtml}
			placeholder="Transformation card description"
			rows={3}
		/>
	</div>

	<!-- Image -->
	<div class="flex flex-col gap-1">
		<label for="hb-transformation-card-image-url" class="text-xs font-medium text-muted-foreground"
			>Image</label
		>
		<ImageUrlInput
			bind:this={imageInput}
			id="hb-transformation-card-image-url"
			bind:value={formImageUrl}
			alt="Transformation card image"
		/>
	</div>

	<!-- Features -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p
				class={cn(
					'text-xs font-medium text-muted-foreground',
					errors.features && 'text-destructive'
				)}
			>
				Features
			</p>
			<Button type="button" size="sm" variant="outline" onclick={addFeature}>
				<Plus class="size-3.5" />
				Add Feature
			</Button>
		</div>
		{#if errors.features}
			<p class="text-xs text-destructive">{errors.features}</p>
		{/if}
		<div class="flex flex-col gap-2">
			{#each formFeatures as feature, index (index)}
				<Dropdown
					title={feature.title || `Unnamed feature`}
					class={featureErrors.get(index) ? 'border-destructive' : ''}
				>
					<HomebrewFeatureForm
						bind:feature={formFeatures[index]}
						onRemove={() => removeFeature(index)}
					/>
				</Dropdown>
			{:else}
				<p class="text-xs italic text-muted-foreground">No features added</p>
			{/each}
		</div>
	</div>

	<!-- Actions -->
	<div class="flex gap-2 pt-2">
		<Button type="submit" size="sm" disabled={!formHasChanges || homebrew.saving} class="h-7">
			{#if homebrew.saving}
				<Loader2 class="size-3.5 animate-spin" />
				Saving...
			{:else}
				Save
			{/if}
		</Button>
		{#if formHasChanges}
			<Button type="button" size="sm" variant="link" onclick={handleReset} class="h-7"
				>Discard</Button
			>
		{/if}
	</div>
</form>
