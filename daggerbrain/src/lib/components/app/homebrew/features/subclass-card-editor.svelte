<script lang="ts">
	import type {
		SubclassFoundationCard,
		SubclassSpecializationCard,
		SubclassMasteryCard,
		Feature,
		TraitIds
	} from '@shared/types/compendium.types';
	import * as Select from '$lib/components/ui/select';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn, capitalize } from '$lib/utils';
	import HomebrewFeatureForm from './feature-form.svelte';
	import Dropdown from '../../leveling/dropdown.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import ImageUrlInput from '../image-url-input.svelte';
	import {
		FeatureSchema,
		extractFeatureErrors,
		type FeatureValidationErrors
	} from '../form-schemas';
	import { SvelteMap } from 'svelte/reactivity';
	import Input from '$lib/components/ui/input/input.svelte';

	type SubclassCard = SubclassFoundationCard | SubclassSpecializationCard | SubclassMasteryCard;

	let {
		card = $bindable(),
		cardType,
		classId,
		title = $bindable(),
		hasPendingFile = $bindable(false)
	}: {
		card: SubclassCard;
		cardType: 'foundation' | 'specialization' | 'mastery';
		classId: string;
		title: string;
		hasPendingFile?: boolean;
	} = $props();

	// Reference to image input component
	let imageInput: {
		uploadPendingFile: () => Promise<string | null>;
		getPreviewUrl: () => string | null;
	} | null = $state(null);

	// Form state
	let formImageUrl = $state('');
	let formArtistName = $state('');
	let formSpellcastTrait = $state<TraitIds | null>(null);
	let formFeatures = $state<Feature[]>([]);

	// Description is automatically set based on card type
	const descriptionHtml = $derived(capitalize(cardType));

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

	const traitOptions: TraitIds[] = [
		'agility',
		'strength',
		'finesse',
		'instinct',
		'presence',
		'knowledge'
	];

	// Track a serialized snapshot to detect external changes
	let lastCardSnapshot = $state<string>('');

	// Sync form state when card prop changes externally
	$effect(() => {
		if (!card) return;

		const currentSnapshot = JSON.stringify({
			compendium_id: card.compendium_id,
			title: card.title,
			image_url: card.image_url,
			artist_name: card.artist_name,
			features: card.features,
			class_id: card.class_id,
			spellcast_trait:
				cardType === 'foundation' && 'spellcast_trait' in card ? card.spellcast_trait : null
		});

		// Only sync if the snapshot changed (external change)
		if (currentSnapshot !== lastCardSnapshot) {
			lastCardSnapshot = currentSnapshot;
			title = card.title;
			formImageUrl = card.image_url;
			formArtistName = card.artist_name;
			formFeatures = JSON.parse(JSON.stringify(card.features));
			if (cardType === 'foundation' && 'spellcast_trait' in card) {
				formSpellcastTrait = card.spellcast_trait;
			} else {
				formSpellcastTrait = null;
			}
			featureErrors.clear();
			validationAttempted = false;
			validatedModifierKeys.clear();
			hasPendingFile = false;
		}
	});

	// Update card when form changes
	$effect(() => {
		if (!card) return;

		// Track classId and title to ensure reactivity
		classId;
		title;
		hasPendingFile;

		// Get preview URL if there's a pending file
		const previewUrl = hasPendingFile && imageInput ? imageInput.getPreviewUrl() : null;

		const baseCard = {
			compendium_id: card.compendium_id,
			image_url: previewUrl || formImageUrl,
			card_type: card.card_type,
			title: title.trim(),
			description_html: descriptionHtml,
			artist_name: formArtistName.trim(),
			features: JSON.parse(JSON.stringify(formFeatures)),
			class_id: classId
		};

		let updatedCard: SubclassCard;
		if (cardType === 'foundation') {
			updatedCard = {
				...baseCard,
				spellcast_trait: formSpellcastTrait
			} as SubclassFoundationCard;
		} else if (cardType === 'specialization') {
			updatedCard = baseCard as SubclassSpecializationCard;
		} else {
			updatedCard = baseCard as SubclassMasteryCard;
		}

		// Only update if values actually changed to prevent loops
		const hasChanges =
			card.title !== updatedCard.title ||
			card.image_url !== updatedCard.image_url ||
			card.artist_name !== updatedCard.artist_name ||
			card.class_id !== updatedCard.class_id ||
			JSON.stringify(card.features) !== JSON.stringify(updatedCard.features) ||
			(cardType === 'foundation' &&
				'spellcast_trait' in card &&
				card.spellcast_trait !== (updatedCard as SubclassFoundationCard).spellcast_trait);

		if (hasChanges) {
			card = updatedCard;
			// Update snapshot after internal update to prevent re-syncing
			lastCardSnapshot = JSON.stringify({
				compendium_id: card.compendium_id,
				title: card.title,
				image_url: card.image_url,
				artist_name: card.artist_name,
				features: card.features,
				class_id: card.class_id,
				spellcast_trait:
					cardType === 'foundation' && 'spellcast_trait' in card ? card.spellcast_trait : null
			});
		}
	});

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

		// Clean up validated modifier keys
		const keysToDelete: string[] = [];
		const keysToReindex: [string, string][] = [];
		for (const [key] of validatedModifierKeys) {
			const [featIdx, modType, modIdx] = key.split('-');
			const featIndex = Number(featIdx);
			if (featIndex === index) {
				keysToDelete.push(key);
			} else if (featIndex > index) {
				const newKey = `${featIndex - 1}-${modType}-${modIdx}`;
				keysToReindex.push([key, newKey]);
			}
		}
		for (const key of keysToDelete) {
			validatedModifierKeys.delete(key);
		}
		for (const [oldKey, newKey] of keysToReindex) {
			validatedModifierKeys.delete(oldKey);
			validatedModifierKeys.set(newKey, true);
		}
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

	// Expose validation function - returns true if all features are valid
	export function validate(): boolean {
		validateFeatures();
		return featureErrors.size === 0;
	}

	// Expose method to get current errors
	export function getErrors(): Map<number, FeatureValidationErrors> {
		return new Map(featureErrors);
	}

	// Expose upload function for parent to call on save
	export async function uploadPendingImage(): Promise<void> {
		if (imageInput) {
			try {
				const uploadedUrl = await imageInput.uploadPendingFile();
				if (uploadedUrl) {
					formImageUrl = uploadedUrl;
					hasPendingFile = false;
				}
			} catch (error) {
				console.error('Failed to upload image:', error);
				throw error;
			}
		}
	}

	// Expose method to mark validation attempted and validate all modifiers
	export function markValidationAttempted() {
		const wasAlreadyAttempted = validationAttempted;
		validationAttempted = true;

		// Only update validatedModifierKeys if this is the first time marking validation attempted
		// or if there are new modifiers that need to be marked
		if (!wasAlreadyAttempted) {
			// First time - clear and mark all current modifiers
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
		} else {
			// Already attempted - only add new modifiers that aren't already marked
			for (let i = 0; i < formFeatures.length; i++) {
				const feature = formFeatures[i];
				for (let j = 0; j < feature.character_modifiers.length; j++) {
					const key = getModifierKey(i, 'character', j);
					if (!validatedModifierKeys.has(key)) {
						validatedModifierKeys.set(key, true);
					}
				}
				for (let j = 0; j < feature.weapon_modifiers.length; j++) {
					const key = getModifierKey(i, 'weapon', j);
					if (!validatedModifierKeys.has(key)) {
						validatedModifierKeys.set(key, true);
					}
				}
			}
		}

		validateFeatures();
	}

	// Reactive validation - re-validate when form data changes (only after first validation attempt)
	$effect(() => {
		if (!validationAttempted) return;

		// If validation has been attempted, automatically mark any new modifiers as validated
		// so their errors will be shown
		for (let i = 0; i < formFeatures.length; i++) {
			const feature = formFeatures[i];
			for (let j = 0; j < feature.character_modifiers.length; j++) {
				const key = getModifierKey(i, 'character', j);
				if (!validatedModifierKeys.has(key)) {
					validatedModifierKeys.set(key, true);
				}
			}
			for (let j = 0; j < feature.weapon_modifiers.length; j++) {
				const key = getModifierKey(i, 'weapon', j);
				if (!validatedModifierKeys.has(key)) {
					validatedModifierKeys.set(key, true);
				}
			}
		}

		// Re-validate features when they change
		validateFeatures();
	});
</script>

<div class="flex flex-col gap-4">
	<div class="flex gap-2">
		<!-- Image -->
		<div class="flex flex-col gap-1">
			<label for="subclass-card-image-url" class="text-xs font-medium text-muted-foreground"
				>Image</label
			>
			<ImageUrlInput
				bind:this={imageInput}
				id="subclass-card-image-url"
				bind:value={formImageUrl}
				bind:hasPendingFile
				alt="Subclass card image"
				class="w-26"
			/>
		</div>

		<div class="flex grow flex-col gap-2">
			<!-- Artist name -->
			<div class="flex flex-col gap-1">
				<label for="subclass-card-artist-name" class="text-xs font-medium text-muted-foreground"
					>Artist Name</label
				>
				<Input
					id="subclass-card-artist-name"
					bind:value={formArtistName}
					placeholder="Artist name"
				/>
			</div>

			<!-- Spellcast Trait (Foundation only) -->
			{#if cardType === 'foundation'}
				<div class="flex grow flex-col gap-1">
					<label
						for="subclass-card-spellcast-trait"
						class="text-xs font-medium text-muted-foreground">Spellcast Trait</label
					>
					<Select.Root
						type="single"
						value={formSpellcastTrait || undefined}
						onValueChange={(v) => (formSpellcastTrait = (v as TraitIds) || null)}
					>
						<Select.Trigger id="subclass-card-spellcast-trait" class="w-full">
							<p class="truncate">{formSpellcastTrait ? capitalize(formSpellcastTrait) : 'None'}</p>
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="">None</Select.Item>
							{#each traitOptions as trait}
								<Select.Item value={trait}>{capitalize(trait)}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			{/if}
		</div>
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
</div>
