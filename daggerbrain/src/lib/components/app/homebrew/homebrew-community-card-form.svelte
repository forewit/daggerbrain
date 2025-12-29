<script lang="ts">
	import type { Feature, CommunityCard } from '$lib/types/compendium-types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { cn } from '$lib/utils';
	import HomebrewFeatureForm from './features/feature-form.svelte';
	import Dropdown from '../leveling/dropdown.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import ImageUrlInput from './image-url-input.svelte';
	import {
		CommunityCardFormSchema,
		FeatureSchema,
		extractFieldErrors,
		type CommunityCardFormErrors
	} from './form-schemas';
	import { SvelteMap } from 'svelte/reactivity';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';

	let {
		communityCard = $bindable(),
		uid
	}: {
		communityCard: CommunityCard;
		uid?: string;
	} = $props();

	const homebrew = getHomebrewContext();

	// Reference to image input component
	let imageInput: { uploadPendingFile: () => Promise<string | null> } | null = $state(null);

	// Form state - initialized from communityCard prop
	let formTitle = $state('');
	let formDescriptionHtml = $state('');
	let formImageUrl = $state('');
	let formTokens = $state(false);
	let formFeatures = $state<Feature[]>([]);

	// Validation errors state
	let errors = $state<CommunityCardFormErrors>({});

	// Feature validation state - track which features have errors
	const featureErrors = new SvelteMap<number, boolean>();

	// Check if form has changes compared to the communityCard prop
	let hasChanges = $derived.by(() => {
		if (!communityCard) return false;

		const titleMatch = formTitle.trim() === communityCard.title;
		const descriptionMatch = formDescriptionHtml === communityCard.description_html;
		const imageUrlMatch = formImageUrl === communityCard.image_url;
		const tokensMatch = formTokens === communityCard.tokens;

		// Compare features (deep comparison)
		const featuresMatch = JSON.stringify(formFeatures) === JSON.stringify(communityCard.features);

		return !(titleMatch && descriptionMatch && imageUrlMatch && tokensMatch && featuresMatch);
	});

	// Sync form state when communityCard prop changes
	$effect(() => {
		if (communityCard) {
			formTitle = communityCard.title;
			formDescriptionHtml = communityCard.description_html;
			formImageUrl = communityCard.image_url;
			formTokens = communityCard.tokens;
			formFeatures = JSON.parse(JSON.stringify(communityCard.features));
			// Clear errors when communityCard changes
			errors = {};
			featureErrors.clear();
		}
	});

	function buildFormData() {
		return {
			card_type: 'community' as const,
			title: formTitle.trim(),
			description_html: formDescriptionHtml,
			image_url: formImageUrl,
			artist_name: '',
			tokens: formTokens,
			features: JSON.parse(JSON.stringify(formFeatures))
		};
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!communityCard) return;

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
		const result = CommunityCardFormSchema.safeParse(formData);

		if (!result.success) {
			errors = extractFieldErrors(result.error);
			return;
		}

		if (!allFeaturesValid) {
			errors = { ...errors, features: 'One or more features have validation errors' };
			return;
		}

		// Update the communityCard prop with validated form values
		communityCard = {
			...communityCard,
			...result.data
		};

		// Clear errors on success
		errors = {};
		featureErrors.clear();
	}

	function handleReset() {
		if (!communityCard) return;
		// Re-sync form from communityCard prop
		formTitle = communityCard.title;
		formDescriptionHtml = communityCard.description_html;
		formImageUrl = communityCard.image_url;
		formTokens = communityCard.tokens;
		formFeatures = JSON.parse(JSON.stringify(communityCard.features));
		// Clear errors on reset
		errors = {};
		featureErrors.clear();
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

	<!-- Image -->
	<div class="flex flex-col gap-1">
		<label for="hb-community-card-image-url" class="text-xs font-medium text-muted-foreground"
			>Image</label
		>
		<ImageUrlInput
			bind:this={imageInput}
			id="hb-community-card-image-url"
			bind:value={formImageUrl}
			alt="Community card image"
		/>
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
		<Button type="submit" size="sm" disabled={!hasChanges}>Save</Button>
		{#if hasChanges}
			<Button type="button" size="sm" variant="link" onclick={handleReset}>Discard changes</Button>
		{/if}
	</div>
</form>
