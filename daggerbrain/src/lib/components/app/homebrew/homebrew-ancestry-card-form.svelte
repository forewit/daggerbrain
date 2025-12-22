<script lang="ts">
	import type { Feature, AncestryCard, AncestryCardChoice } from '$lib/types/compendium-types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import HomebrewFeatureForm from './features/feature-form.svelte';
	import AncestryChoicesEditor from './features/ancestry-choices-editor.svelte';
	import Dropdown from '../leveling/dropdown.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import {
		AncestryCardFormSchema,
		FeatureSchema,
		extractFieldErrors,
		type AncestryCardFormErrors
	} from './form-schemas';
	import { SvelteMap } from 'svelte/reactivity';

	let { ancestryCard = $bindable() }: { ancestryCard: AncestryCard } = $props();

	// Form state - initialized from ancestryCard prop
	let formTitle = $state('');
	let formDescriptionHtml = $state('');
	let formImageUrl = $state('');
	let formArtistName = $state('');
	let formFeatures = $state<Feature[]>([]);
	let formChoices = $state<AncestryCardChoice[]>([]);

	// Validation errors state
	let errors = $state<AncestryCardFormErrors>({});

	// Feature validation state - track which features have errors
	const featureErrors = new SvelteMap<number, boolean>();

	// Check if form has changes compared to the ancestryCard prop
	let hasChanges = $derived.by(() => {
		if (!ancestryCard) return false;

		const titleMatch = formTitle.trim() === ancestryCard.title;
		const descriptionMatch = formDescriptionHtml === ancestryCard.description_html;
		const imageUrlMatch = formImageUrl === ancestryCard.image_url;
		const artistNameMatch = formArtistName === ancestryCard.artist_name;

		// Compare features (deep comparison)
		const featuresMatch = JSON.stringify(formFeatures) === JSON.stringify(ancestryCard.features);
		// Compare choices (deep comparison)
		const choicesMatch = JSON.stringify(formChoices) === JSON.stringify(ancestryCard.choices);

		return !(titleMatch && descriptionMatch && imageUrlMatch && artistNameMatch && featuresMatch && choicesMatch);
	});

	// Sync form state when ancestryCard prop changes
	$effect(() => {
		if (ancestryCard) {
			formTitle = ancestryCard.title;
			formDescriptionHtml = ancestryCard.description_html;
			formImageUrl = ancestryCard.image_url;
			formArtistName = ancestryCard.artist_name;
			formFeatures = JSON.parse(JSON.stringify(ancestryCard.features));
			formChoices = JSON.parse(JSON.stringify(ancestryCard.choices));
			// Clear errors when ancestryCard changes
			errors = {};
			featureErrors.clear();
		}
	});

	function buildFormData() {
		return {
			card_type: 'ancestry' as const,
			title: formTitle.trim(),
			description_html: formDescriptionHtml,
			image_url: formImageUrl,
			artist_name: formArtistName,
			features: JSON.parse(JSON.stringify(formFeatures)),
			choices: JSON.parse(JSON.stringify(formChoices))
		};
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!ancestryCard) return;

		// Clear previous errors
		errors = {};
		featureErrors.clear();

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
		const result = AncestryCardFormSchema.safeParse(formData);

		if (!result.success) {
			errors = extractFieldErrors(result.error);
			return;
		}

		if (!allFeaturesValid) {
			errors = { ...errors, features: 'One or more features have validation errors' };
			return;
		}

		// Update the ancestryCard prop with validated form values
		ancestryCard = {
			...ancestryCard,
			...result.data
		};

		// Clear errors on success
		errors = {};
		featureErrors.clear();
	}

	function handleReset() {
		if (!ancestryCard) return;
		// Re-sync form from ancestryCard prop
		formTitle = ancestryCard.title;
		formDescriptionHtml = ancestryCard.description_html;
		formImageUrl = ancestryCard.image_url;
		formArtistName = ancestryCard.artist_name;
		formFeatures = JSON.parse(JSON.stringify(ancestryCard.features));
		formChoices = JSON.parse(JSON.stringify(ancestryCard.choices));
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

	<!-- Image URL -->
	<div class="flex flex-col gap-1">
		<label for="hb-ancestry-card-image-url" class="text-xs font-medium text-muted-foreground"
			>Image URL</label
		>
		<Input
			id="hb-ancestry-card-image-url"
			bind:value={formImageUrl}
			placeholder="https://example.com/image.jpg"
		/>
	</div>

	<!-- Artist Name -->
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

	<!-- Choices -->
	<div class="flex flex-col gap-2">
		<AncestryChoicesEditor bind:choices={formChoices} featureCount={formFeatures.length} />
	</div>

	<!-- Actions -->
	<div class="flex gap-2 pt-2">
		<Button type="submit" size="sm" disabled={!hasChanges}>Save</Button>
		{#if hasChanges}
			<Button type="button" size="sm" variant="link" onclick={handleReset}>Discard changes</Button>
		{/if}
	</div>
</form>
