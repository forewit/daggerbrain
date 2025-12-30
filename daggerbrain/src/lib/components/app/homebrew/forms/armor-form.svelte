<script lang="ts">
	import type { Feature, Armor } from '$lib/types/compendium-types';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import HomebrewFeatureForm from '../features/feature-form.svelte';
	import Dropdown from '../../leveling/dropdown.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import {
		ArmorFormSchema,
		FeatureSchema,
		extractFieldErrors,
		type ArmorFormErrors
	} from '../form-schemas';
	import { SvelteMap } from 'svelte/reactivity';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';

	let {
		item = $bindable(),
		hasChanges = $bindable(),
		onSubmit,
		onReset
	}: {
		item: Armor;
		hasChanges?: boolean;
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

	// Feature validation state - track which features have errors
	const featureErrors = new SvelteMap<number, boolean>();

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

	// Check if form has changes compared to the armor prop
	let formHasChanges = $derived.by(() => {
		if (!item) return false;

		const titleMatch = formTitle.trim() === item.title;
		const descriptionMatch = formDescriptionHtml === item.description_html;

		// Compare tier/level
		const formLevelRequirement = formTier ? tierToMinLevel(Number(formTier)) : 1;
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

	// Sync form state when armor prop changes
	$effect(() => {
		if (item) {
			formTitle = item.title;
			formDescriptionHtml = item.description_html;
			formTier = String(levelToTier(item.level_requirement));
			formMaxArmor = item.max_armor === 0 ? '' : String(item.max_armor);
			formMajorThreshold =
				item.damage_thresholds.major === 0 ? '' : String(item.damage_thresholds.major);
			formSevereThreshold =
				item.damage_thresholds.severe === 0 ? '' : String(item.damage_thresholds.severe);
			formFeatures = JSON.parse(JSON.stringify(item.features));
			// Clear errors when armor changes
			errors = {};
			featureErrors.clear();
		}
	});

	function buildFormData() {
		return {
			title: formTitle.trim(),
			description_html: formDescriptionHtml,
			level_requirement: formTier ? tierToMinLevel(Number(formTier)) : 1,
			max_armor: formMaxArmor === '' ? 0 : Number(formMaxArmor),
			damage_thresholds: {
				major: formMajorThreshold === '' ? 0 : Number(formMajorThreshold),
				severe: formSevereThreshold === '' ? 0 : Number(formSevereThreshold)
			},
			features: JSON.parse(JSON.stringify(formFeatures))
		};
	}

	export function handleSubmit(e?: SubmitEvent) {
		if (e) {
			e.preventDefault();
		}
		if (!item) return;

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
		const result = ArmorFormSchema.safeParse(formData);

		if (!result.success) {
			errors = extractFieldErrors(result.error);
			return;
		}

		if (!allFeaturesValid) {
			errors = { ...errors, features: 'One or more features have validation errors' };
			return;
		}

		// Save the original armor reference to find it in homebrew state
		const originalArmor = item;
		// Update the armor prop with validated form values
		const updatedArmor = {
			...item,
			...result.data
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
		formTier = String(levelToTier(item.level_requirement));
		formMaxArmor = item.max_armor === 0 ? '' : String(item.max_armor);
		formMajorThreshold =
			item.damage_thresholds.major === 0 ? '' : String(item.damage_thresholds.major);
		formSevereThreshold =
			item.damage_thresholds.severe === 0 ? '' : String(item.damage_thresholds.severe);
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
	<div class="flex gap-2 pt-2 justify-end">
		{#if formHasChanges}
			<Button type="button" size="sm" variant="link" onclick={handleReset}>
				<RotateCcw class="size-3.5" />
				Discard
			</Button>
		{/if}
		<Button type="submit" size="sm" disabled={!formHasChanges}>Save</Button>
		
	</div>
</form>
