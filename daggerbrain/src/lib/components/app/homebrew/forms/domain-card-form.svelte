<script lang="ts">
	import type { Feature, DomainCard, DomainIds, DomainCardChoice } from '@shared/types/compendium.types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import * as Select from '$lib/components/ui/select';
	import { cn } from '$lib/utils';
	import HomebrewFeatureForm from '../features/feature-form.svelte';
	import HomebrewDomainChoicesEditor from '../features/domain-choices-editor.svelte';
	import Dropdown from '../../leveling/dropdown.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import ImageUrlInput from '../image-url-input.svelte';
	import {
		CONDITIONS_CHOICE_REQUIRED,
		DomainCardFormSchema,
		FeatureSchema,
		extractFieldErrors,
		extractFeatureErrors,
		type DomainCardFormErrors,
		type FeatureValidationErrors
	} from '../form-schemas';
	import { SvelteMap } from 'svelte/reactivity';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { tick, untrack } from 'svelte';
	import Loader2 from '@lucide/svelte/icons/loader-2';

	let {
		item = $bindable(),
		hasChanges = $bindable(),
		hasErrors = $bindable(),
		onSubmit,
		onReset
	}: {
		item: DomainCard;
		hasChanges?: boolean;
		hasErrors?: boolean;
		onSubmit?: (e?: SubmitEvent) => void;
		onReset?: () => void;
	} = $props();

	const compendium = getCompendiumContext();
	const homebrew = getHomebrewContext();

	// Reference to image input component
	let imageInput: { uploadPendingFile: () => Promise<string | null> } | null = $state(null);
	
	// Track if there's a pending image file
	let hasPendingImageFile = $state(false);

	// Form state - initialized from domainCard prop
	let formTitle = $state('');
	let formImageUrl = $state('');
	let formDomainId = $state<DomainIds>('arcana');
	let formLevelRequirement = $state('');
	let formRecallCost = $state('');
	let formCategory = $state<'ability' | 'spell' | 'grimoire'>('ability');
	let formTokens = $state(false);
	let formAppliesInVault = $state(false);
	let formForcedInLoadout = $state(false);
	let formForcedInVault = $state(false);
	let formFeatures = $state<Feature[]>([]);
	let formChoices = $state<DomainCardChoice[]>([]);

	// Validation errors state
	let errors = $state<DomainCardFormErrors>({});

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

	// svelte-ignore non_reactive_update
	let dropdownOpenIndex = -1;

	const domainOptions: DomainIds[] = [
		'arcana',
		'blade',
		'bone',
		'codex',
		'grace',
		'midnight',
		'sage',
		'splendor',
		'valor'
	];

	const categoryOptions: ('ability' | 'spell' | 'grimoire')[] = ['ability', 'spell', 'grimoire'];

	// Check if form has changes compared to the item prop
	let formHasChanges = $derived.by(() => {
		if (!item) return false;

		const titleMatch = formTitle.trim() === item.title;
		const imageUrlMatch = formImageUrl === item.image_url;
		const domainMatch = formDomainId === item.domain_id;
		const formLevelNum = formLevelRequirement === '' ? 0 : Number(formLevelRequirement);
		const levelMatch = formLevelNum === item.level_requirement;
		const formRecallCostNum = formRecallCost === '' ? 0 : Number(formRecallCost);
		const recallCostMatch = formRecallCostNum === item.recall_cost;
		const categoryMatch = formCategory === item.category;
		const tokensMatch = formTokens === item.tokens;
		const appliesInVaultMatch = formAppliesInVault === item.applies_in_vault;
		const forcedInLoadoutMatch = formForcedInLoadout === item.forced_in_loadout;
		const forcedInVaultMatch = formForcedInVault === item.forced_in_vault;

		// Compare features (deep comparison)
		const featuresMatch = JSON.stringify(formFeatures) === JSON.stringify(item.features);

		// Compare choices (deep comparison)
		const choicesMatch = JSON.stringify(formChoices) === JSON.stringify(item.choices);

		return !(
			titleMatch &&
			imageUrlMatch &&
			!hasPendingImageFile &&
			domainMatch &&
			levelMatch &&
			recallCostMatch &&
			categoryMatch &&
			tokensMatch &&
			appliesInVaultMatch &&
			forcedInLoadoutMatch &&
			forcedInVaultMatch &&
			featuresMatch &&
			choicesMatch
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
		const arbitraryChoices = formChoices.filter(c => c.type === 'arbitrary');
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
				(m) =>
					m.target === 'experience_from_domain_card_choice_selection' &&
					(m as any).choice_id
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

				const newChoice: DomainCardChoice = {
					choice_id: choiceId,
					type: 'experience',
					max: originalChoice?.max || 1, // Use original max or default to 1
					conditional_choice: originalChoice?.conditional_choice || null
				};
				formChoices = [...formChoices, newChoice];
			}
		}
	}

	// Sync form state when item prop changes
	$effect(() => {
		if (item) {
			formTitle = item.title;
			formImageUrl = item.image_url;
			formDomainId = item.domain_id;
			formLevelRequirement = item.level_requirement === 0 ? '' : String(item.level_requirement);
			formRecallCost = item.recall_cost === 0 ? '' : String(item.recall_cost);
			formCategory = item.category;
			formTokens = item.tokens;
			formAppliesInVault = item.applies_in_vault;
			formForcedInLoadout = item.forced_in_loadout;
			formForcedInVault = item.forced_in_vault;
			formFeatures = JSON.parse(JSON.stringify(item.features));
			formChoices = JSON.parse(JSON.stringify(item.choices));
			// Ensure experience choices exist for modifiers (untrack to avoid effect re-running when formChoices is updated)
			untrack(() => ensureExperienceChoicesForModifiers());
			// Clear pending image file when item changes
			hasPendingImageFile = false;
			// Clear errors when domainCard changes
			errors = {};
			featureErrors.clear();
			choiceErrors = new Map();
			validationAttempted = false;
			validatedModifierKeys.clear();
		}
	});

	function buildFormData() {
		return {
			card_type: 'domain' as const,
			domain_id: formDomainId,
			title: formTitle.trim(),
			image_url: formImageUrl,
			artist_name: '',
			level_requirement: formLevelRequirement === '' ? 0 : Number(formLevelRequirement),
			recall_cost: formRecallCost === '' ? 0 : Number(formRecallCost),
			category: formCategory,
			tokens: formTokens,
			applies_in_vault: formAppliesInVault,
			forced_in_loadout: formForcedInLoadout,
			forced_in_vault: formForcedInVault,
			features: JSON.parse(JSON.stringify(formFeatures)),
			choices: JSON.parse(JSON.stringify(formChoices))
		};
	}

	// Validate choices for blank and duplicate names
	function validateChoices() {
		const errors = new Map<number, string[]>();
		const arbitraryChoices = formChoices.filter(c => c.type === 'arbitrary');
		const nameCounts = new Map<string, number>();
		
		// Count occurrences of each name (case-insensitive, trimmed)
		arbitraryChoices.forEach((choice) => {
			const name = choice.choice_id.trim();
			const normalizedName = name.toLowerCase();
			nameCounts.set(normalizedName, (nameCounts.get(normalizedName) || 0) + 1);
		});
		
		// Check for blank and duplicate names
		arbitraryChoices.forEach((choice, index) => {
			const name = choice.choice_id.trim();
			const normalizedName = name.toLowerCase();
			const choiceErrorsList: string[] = [];
			
			if (!name) {
				choiceErrorsList.push('Name is required');
			} else if (nameCounts.get(normalizedName)! > 1) {
				choiceErrorsList.push('Name must be unique');
			}
			
			if (choiceErrorsList.length > 0) {
				errors.set(index, choiceErrorsList);
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

		// Second pass: domain_card_choice conditions with empty choice_id
		for (let i = 0; i < formFeatures.length; i++) {
			const f = formFeatures[i];
			for (let j = 0; j < f.character_modifiers.length; j++) {
				const mod = f.character_modifiers[j];
				const hasEmptyChoice = (mod.character_conditions || []).some(
					(c) =>
						c.type === 'domain_card_choice' &&
						(!c.choice_id || c.choice_id.trim() === '')
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
		const result = DomainCardFormSchema.safeParse(formData);
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
		formImageUrl;
		formDomainId;
		formLevelRequirement;
		formRecallCost;
		formCategory;
		formTokens;
		formAppliesInVault;
		formForcedInLoadout;
		formForcedInVault;
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

		// Save the original domain card reference to find it in homebrew state
		const originalDomainCard = item;
		// Update the domainCard prop with validated form values
		const updatedDomainCard = {
			...item,
			...formData
		};
		item = updatedDomainCard;

		// Update the homebrew state record so auto-save can detect the change
		// Find the domain card in the nested structure using the original reference
		const newDomainCardRef = JSON.parse(JSON.stringify(updatedDomainCard));
		for (const [domainId, cards] of Object.entries(homebrew.domain_cards)) {
			for (const [cardId, card] of Object.entries(cards)) {
				if (card === originalDomainCard) {
					homebrew.domain_cards[domainId as DomainIds][cardId] = newDomainCardRef;
					break;
				}
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
		// Re-sync form from domainCard prop
		formTitle = item.title;
		formImageUrl = item.image_url;
		formDomainId = item.domain_id;
		formLevelRequirement = item.level_requirement === 0 ? '' : String(item.level_requirement);
		formRecallCost = item.recall_cost === 0 ? '' : String(item.recall_cost);
		formCategory = item.category;
		formTokens = item.tokens;
		formAppliesInVault = item.applies_in_vault;
		formForcedInLoadout = item.forced_in_loadout;
		formForcedInVault = item.forced_in_vault;
		formFeatures = JSON.parse(JSON.stringify(item.features));
		formChoices = JSON.parse(JSON.stringify(item.choices));
		ensureExperienceChoicesForModifiers();
		// Clear pending image file on reset
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
			for="hb-domain-card-title"
			class={cn('text-xs font-medium text-muted-foreground', errors.title && 'text-destructive')}
			>Name</label
		>
		<Input
			id="hb-domain-card-title"
			bind:value={formTitle}
			placeholder="Domain card name"
			aria-invalid={!!errors.title}
		/>
		{#if errors.title}
			<p class="text-xs text-destructive">{errors.title}</p>
		{/if}
	</div>

	<!-- Domain & Category Row -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-domain-card-domain" class="text-xs font-medium text-muted-foreground"
				>Domain</label
			>
			<Select.Root type="single" bind:value={formDomainId}>
				<Select.Trigger id="hb-domain-card-domain" class="w-full">
					<p class="truncate">{formDomainId}</p>
				</Select.Trigger>
				<Select.Content>
					{#each domainOptions as domain}
						<Select.Item value={domain}>{domain}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-domain-card-category" class="text-xs font-medium text-muted-foreground"
				>Category</label
			>
			<Select.Root type="single" bind:value={formCategory}>
				<Select.Trigger id="hb-domain-card-category" class="w-full">
					<p class="truncate capitalize">{formCategory}</p>
				</Select.Trigger>
				<Select.Content>
					{#each categoryOptions as category}
						<Select.Item value={category} class="capitalize">{category}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<!-- Level Requirement & Recall Cost Row -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-domain-card-level" class="text-xs font-medium text-muted-foreground"
				>Level Requirement</label
			>
			<Input
				id="hb-domain-card-level"
				type="number"
				inputmode="numeric"
				bind:value={formLevelRequirement}
				placeholder="1"
				min="1"
				max="10"
				step="1"
				aria-invalid={!!errors.level_requirement}
			/>
			{#if errors.level_requirement}
				<p class="text-xs text-destructive">{errors.level_requirement}</p>
			{/if}
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-domain-card-recall-cost" class="text-xs font-medium text-muted-foreground"
				>Recall Cost</label
			>
			<Input
				id="hb-domain-card-recall-cost"
				type="number"
				inputmode="numeric"
				bind:value={formRecallCost}
				placeholder="0"
				min="0"
				step="1"
			/>
		</div>
	</div>

	<!-- Image & card flags-->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-domain-card-image-url" class="text-xs font-medium text-muted-foreground"
				>Artwork</label
			>
			<ImageUrlInput
				bind:this={imageInput}
				id="hb-domain-card-image-url"
				bind:value={formImageUrl}
				bind:hasPendingFile={hasPendingImageFile}
				alt="Domain card image"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<p class="text-xs font-medium text-muted-foreground">Flags</p>
			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-2">
					<Checkbox id="hb-domain-card-tokens" bind:checked={formTokens} />
					<label for="hb-domain-card-tokens" class="text-xs">Has tokens</label>
				</div>
				<div class="flex items-center gap-2">
					<Checkbox id="hb-domain-card-applies-in-vault" bind:checked={formAppliesInVault} />
					<label for="hb-domain-card-applies-in-vault" class="text-xs cursor-pointer"						>
						<p>Applies in Vault</p>
						<p class="text-muted-foreground">Feature modifiers will be applied even if the card is in the vault.</p>
					</label>
				</div>
				<div class="flex items-center gap-2">
					<Checkbox id="hb-domain-card-forced-in-loadout" bind:checked={formForcedInLoadout} />
					<label for="hb-domain-card-forced-in-loadout" class="text-xs"
						>Forced in Loadout</label
					>
				</div>
				<div class="flex items-center gap-2">
					<Checkbox id="hb-domain-card-forced-in-vault" bind:checked={formForcedInVault} />
					<label for="hb-domain-card-forced-in-vault" class="text-xs"
						>Forced in Vault</label
					>
				</div>
			</div>
		</div>
	</div>

		<!-- Choices -->
		<div class="flex flex-col gap-2">
			<HomebrewDomainChoicesEditor bind:choices={formChoices} errors={choiceErrors} />
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
						bind:domainCardChoices={formChoices}
						domainCardId={item.compendium_id}
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
					hasValidationErrors && 'border border-destructive hover:bg-primary'
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
