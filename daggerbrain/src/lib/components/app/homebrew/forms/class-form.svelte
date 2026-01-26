<script lang="ts">
	import type {
		CharacterClass,
		Feature,
		DomainIds,
		Traits,
		TraitIds,
		AdventuringGear,
		Subclass
	} from '@shared/types/compendium.types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { cn, capitalize } from '$lib/utils';
	import HomebrewFeatureForm from '../features/feature-form.svelte';
	import Dropdown from '../../leveling/dropdown.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import X from '@lucide/svelte/icons/x';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import ImageUrlInput from '../image-url-input.svelte';
	import ItemSelectorSheet from '../features/item-selector-sheet.svelte';
	import Gold from '../../sheet/gold.svelte';
	import {
		ClassFormSchema,
		FeatureSchema,
		extractFieldErrors,
		extractFeatureErrors,
		type ClassFormErrors,
		type FeatureValidationErrors
	} from '../form-schemas';
	import { SvelteMap } from 'svelte/reactivity';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { tick } from 'svelte';
	import Loader2 from '@lucide/svelte/icons/loader-2';

	let {
		item = $bindable(),
		hasChanges = $bindable(),
		hasErrors = $bindable(),
		unsavedItem = $bindable(),
		onSubmit,
		onReset
	}: {
		item: CharacterClass;
		hasChanges?: boolean;
		hasErrors?: boolean;
		unsavedItem?: CharacterClass | null;
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

	// Sheet state for item selectors
	let freeGearSheetOpen = $state(false);
	let lootOrConsumableSheetOpen = $state(false);
	let classGearSheetOpen = $state(false);
	let primaryWeaponSheetOpen = $state(false);
	let secondaryWeaponSheetOpen = $state(false);
	let armorSheetOpen = $state(false);

	// Form state - initialized from characterClass prop
	let formName = $state('');
	let formDescriptionHtml = $state('');
	let formImageUrl = $state('');
	let formStartingEvasion = $state('');
	let formStartingMaxHp = $state('');
	let formPrimaryDomainId = $state<DomainIds>('arcana');
	let formSecondaryDomainId = $state<DomainIds>('arcana');
	let formHopeFeature = $state<Feature | null>(null);
	let formClassFeatures = $state<Feature[]>([]);
	let formSubclassIds = $state<string[]>([]);
	let formSuggestedTraits = $state<Traits>({
		agility: null,
		strength: null,
		finesse: null,
		instinct: null,
		presence: null,
		knowledge: null
	});
	let formSuggestedPrimaryWeaponId = $state<string | null>(null);
	let formSuggestedSecondaryWeaponId = $state<string | null>(null);
	let formSuggestedArmorId = $state<string | null>(null);
	let formGoldCoins = $state(0);
	let formFreeGear = $state<AdventuringGear[]>([]);
	let formLootOrConsumableOptions = $state<string[]>([]);
	let formClassGearOptions = $state<AdventuringGear[]>([]);
	let formSpellbookPrompt = $state('');
	let formBackgroundQuestions = $state<string[]>([]);
	let formConnectionQuestions = $state<string[]>([]);
	let formClothes = $state('');
	let formEyes = $state('');
	let formBody = $state('');
	let formSkin = $state('');
	let formAttitude = $state('');

	// Validation errors state
	let errors = $state<ClassFormErrors>({});

	// Feature validation state - track detailed errors for each feature
	const featureErrors = new SvelteMap<number, FeatureValidationErrors>();
	let hopeFeatureError = $state<FeatureValidationErrors | null>(null);

	// Track if validation has been attempted (to show errors only after first submit attempt)
	let validationAttempted = $state(false);

	// Track which modifiers existed at the last validation attempt
	// New modifiers added after validation should not show errors until next submit
	const validatedModifierKeys = new SvelteMap<string, boolean>();

	// Generate a key for a modifier to track it
	function getModifierKey(
		featureIndex: number | 'hope',
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

	const traitOptions: TraitIds[] = [
		'agility',
		'strength',
		'finesse',
		'instinct',
		'presence',
		'knowledge'
	];

	// Get all available subclasses (compendium + homebrew) - kept for reference but not used in UI
	let availableSubclasses = $derived.by(() => {
		const subclasses: Array<{ id: string; name: string; source: 'compendium' | 'homebrew' }> = [];
		// Add compendium subclasses
		for (const [id, subclass] of Object.entries(compendium.subclasses)) {
			subclasses.push({ id, name: subclass.name, source: 'compendium' });
		}
		// Add homebrew subclasses
		for (const [id, subclass] of Object.entries(homebrew.subclasses)) {
			subclasses.push({ id, name: subclass.name, source: 'homebrew' });
		}
		return subclasses.sort((a, b) => a.name.localeCompare(b.name));
	});

	// Get the current class ID (UID for homebrew, compendium_id for compendium)
	let currentClassId = $derived.by(() => {
		if (!item) return null;
		// Check if it's in compendium classes
		for (const [id, cls] of Object.entries(compendium.classes)) {
			if (cls === item) {
				return id; // compendium_id
			}
		}
		// Check if it's in homebrew classes
		for (const [uid, cls] of Object.entries(homebrew.classes)) {
			if (cls === item) {
				return uid; // UID
			}
		}
		return null;
	});

	// Get available subclasses for the current class being edited
	let availableSubclassesForClass = $derived.by(() => {
		if (!currentClassId) return [];
		const subclasses: Array<{ id: string; name: string; source: 'compendium' | 'homebrew' }> = [];
		// Add compendium subclasses that match this class
		for (const [id, subclass] of Object.entries(compendium.subclasses)) {
			if (subclass.class_id === currentClassId) {
				subclasses.push({ id, name: subclass.name, source: 'compendium' });
			}
		}
		// Add homebrew subclasses that match this class
		for (const [id, subclass] of Object.entries(homebrew.subclasses)) {
			if (subclass.class_id === currentClassId) {
				subclasses.push({ id, name: subclass.name, source: 'homebrew' });
			}
		}
		return subclasses.sort((a, b) => a.name.localeCompare(b.name));
	});

	// Get all available weapons and armor (compendium + homebrew)
	let availablePrimaryWeapons = $derived.by(() => {
		const weapons: Array<{ id: string; title: string; source: 'compendium' | 'homebrew' }> = [];
		for (const [id, weapon] of Object.entries(compendium.primary_weapons)) {
			weapons.push({ id, title: weapon.title, source: 'compendium' });
		}
		for (const [id, weapon] of Object.entries(homebrew.primary_weapons)) {
			weapons.push({ id, title: weapon.title, source: 'homebrew' });
		}
		return weapons.sort((a, b) => a.title.localeCompare(b.title));
	});

	let availableSecondaryWeapons = $derived.by(() => {
		const weapons: Array<{ id: string; title: string; source: 'compendium' | 'homebrew' }> = [];
		for (const [id, weapon] of Object.entries(compendium.secondary_weapons)) {
			weapons.push({ id, title: weapon.title, source: 'compendium' });
		}
		for (const [id, weapon] of Object.entries(homebrew.secondary_weapons)) {
			weapons.push({ id, title: weapon.title, source: 'homebrew' });
		}
		return weapons.sort((a, b) => a.title.localeCompare(b.title));
	});

	let availableArmor = $derived.by(() => {
		const armor: Array<{ id: string; title: string; source: 'compendium' | 'homebrew' }> = [];
		for (const [id, item] of Object.entries(compendium.armor)) {
			armor.push({ id, title: item.title, source: 'compendium' });
		}
		for (const [id, item] of Object.entries(homebrew.armor)) {
			armor.push({ id, title: item.title, source: 'homebrew' });
		}
		return armor.sort((a, b) => a.title.localeCompare(b.title));
	});

	// Build unsaved class from current form state
	let unsavedClass = $derived.by(() => {
		if (!item) return null;

		// Track all form fields to ensure reactivity
		formName;
		formDescriptionHtml;
		formImageUrl;
		formStartingEvasion;
		formStartingMaxHp;
		formPrimaryDomainId;
		formSecondaryDomainId;
		formHopeFeature;
		formClassFeatures;
		formSubclassIds;
		formSuggestedTraits;
		formSuggestedPrimaryWeaponId;
		formSuggestedSecondaryWeaponId;
		formSuggestedArmorId;
		formGoldCoins;
		formFreeGear;
		formLootOrConsumableOptions;
		formClassGearOptions;
		formSpellbookPrompt;
		formBackgroundQuestions;
		formConnectionQuestions;
		formClothes;
		formEyes;
		formBody;
		formSkin;
		formAttitude;
		hasPendingImageFile;

		// Get preview URL if there's a pending file
		const previewUrl = hasPendingImageFile && imageInput ? imageInput.getPreviewUrl() : null;

		// Build the unsaved class by merging item with form data
		const formData = buildFormData();

		// Use preview URL if available, otherwise use formImageUrl
		return {
			...item,
			...formData,
			image_url: previewUrl || formData.image_url
		} as CharacterClass;
	});

	// Check if form has changes
	let formHasChanges = $derived.by(() => {
		if (!item) return false;
		// This is complex - we'll do a deep comparison
		const current = JSON.stringify(buildFormData());
		const original = JSON.stringify(item);
		return current !== original || hasPendingImageFile;
	});

	// Sync hasChanges to bindable prop
	$effect(() => {
		hasChanges = formHasChanges;
	});

	// Sync unsavedClass to bindable prop
	$effect(() => {
		unsavedItem = unsavedClass;
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
		// Check hope feature error
		if (hopeFeatureError) {
			return true;
		}
		return false;
	});

	// Collect all error messages for display
	let allErrorMessages = $derived.by(() => {
		const messages: string[] = [];

		// Add form-level errors (exclude 'hope_feature' and 'class_features' since individual feature errors are shown)
		for (const [key, value] of Object.entries(errors)) {
			if (value && key !== 'hope_feature' && key !== 'class_features') {
				messages.push(`${key}: ${value}`);
			}
		}

		// Add hope feature errors
		if (hopeFeatureError) {
			const featureTitle = formHopeFeature?.title || 'Hope Feature';
			if (hopeFeatureError.title) {
				messages.push(`${featureTitle}, Title: ${hopeFeatureError.title}`);
			}
			if (hopeFeatureError.description_html) {
				messages.push(`${featureTitle}, Description: ${hopeFeatureError.description_html}`);
			}
			if (hopeFeatureError.character_modifiers) {
				for (const [modIndex, modErrors] of hopeFeatureError.character_modifiers) {
					for (const error of modErrors) {
						messages.push(`${featureTitle}, Character Modifier ${modIndex + 1}: ${error}`);
					}
				}
			}
			if (hopeFeatureError.weapon_modifiers) {
				for (const [modIndex, modErrors] of hopeFeatureError.weapon_modifiers) {
					for (const error of modErrors) {
						messages.push(`${featureTitle}, Weapon Modifier ${modIndex + 1}: ${error}`);
					}
				}
			}
		}

		// Add class feature errors
		for (const [index, featureError] of featureErrors) {
			const featureTitle = formClassFeatures[index]?.title || `Feature ${index + 1}`;
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
			formName = item.name;
			formDescriptionHtml = item.description_html;
			formImageUrl = item.image_url;
			formStartingEvasion = String(item.starting_evasion);
			formStartingMaxHp = String(item.starting_max_hp);
			formPrimaryDomainId = item.primary_domain_id;
			formSecondaryDomainId = item.secondary_domain_id;
			formHopeFeature = JSON.parse(JSON.stringify(item.hope_feature));
			formClassFeatures = JSON.parse(JSON.stringify(item.class_features));
			formSubclassIds = [...item.subclass_ids];
			formSuggestedTraits = JSON.parse(JSON.stringify(item.suggested_traits));
			formSuggestedPrimaryWeaponId = item.suggested_primary_weapon_id;
			formSuggestedSecondaryWeaponId = item.suggested_secondary_weapon_id;
			formSuggestedArmorId = item.suggested_armor_id;
			formGoldCoins = item.starting_inventory.gold_coins;
			formFreeGear = JSON.parse(JSON.stringify(item.starting_inventory.free_gear));
			formLootOrConsumableOptions = [...item.starting_inventory.loot_or_consumable_options];
			formClassGearOptions = JSON.parse(JSON.stringify(item.starting_inventory.class_gear_options));
			formSpellbookPrompt = item.starting_inventory.spellbook_prompt || '';
			formBackgroundQuestions = [...item.background_questions];
			formConnectionQuestions = [...item.connection_questions];
			formClothes = item.character_description_suggestions.clothes;
			formEyes = item.character_description_suggestions.eyes;
			formBody = item.character_description_suggestions.body;
			formSkin = item.character_description_suggestions.skin;
			formAttitude = item.character_description_suggestions.attitude;
			// Clear pending image file when item changes
			hasPendingImageFile = false;
			// Clear errors
			errors = {};
			featureErrors.clear();
			hopeFeatureError = null;
			validationAttempted = false;
			validatedModifierKeys.clear();
		}
	});

	function buildFormData() {
		return {
			name: formName.trim(),
			description_html: formDescriptionHtml,
			image_url: formImageUrl,
			starting_evasion: Number(formStartingEvasion),
			starting_max_hp: Number(formStartingMaxHp),
			hope_feature: formHopeFeature ? JSON.parse(JSON.stringify(formHopeFeature)) : null,
			primary_domain_id: formPrimaryDomainId,
			secondary_domain_id: formSecondaryDomainId,
			class_features: JSON.parse(JSON.stringify(formClassFeatures)),
			subclass_ids: [...formSubclassIds],
			suggested_traits: JSON.parse(JSON.stringify(formSuggestedTraits)),
			suggested_primary_weapon_id: formSuggestedPrimaryWeaponId,
			suggested_secondary_weapon_id: formSuggestedSecondaryWeaponId,
			suggested_armor_id: formSuggestedArmorId,
			starting_inventory: {
				gold_coins: formGoldCoins,
				free_gear: JSON.parse(JSON.stringify(formFreeGear)),
				loot_or_consumable_options: [...formLootOrConsumableOptions],
				class_gear_options: JSON.parse(JSON.stringify(formClassGearOptions)),
				spellbook_prompt: formSpellbookPrompt || null
			},
			background_questions: [...formBackgroundQuestions],
			connection_questions: [...formConnectionQuestions],
			character_description_suggestions: {
				clothes: formClothes,
				eyes: formEyes,
				body: formBody,
				skin: formSkin,
				attitude: formAttitude
			}
		};
	}

	// Validate features and update error state
	function validateFeatures() {
		// Validate hope feature
		if (formHopeFeature) {
			const result = FeatureSchema.safeParse(formHopeFeature);

			if (!result.success) {
				const featureErrorsData = extractFeatureErrors(result.error);

				// Filter out errors for modifiers that weren't validated yet (newly added)
				if (featureErrorsData.character_modifiers) {
					const filteredCharModifiers = new Map<number, string[]>();
					for (const [modIndex, errors] of featureErrorsData.character_modifiers) {
						const key = getModifierKey('hope', 'character', modIndex);
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
						const key = getModifierKey('hope', 'weapon', modIndex);
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
					hopeFeatureError = featureErrorsData;
				} else {
					hopeFeatureError = null;
				}
			} else {
				hopeFeatureError = null;
			}
		} else {
			hopeFeatureError = null;
		}

		// Validate class features
		for (let i = 0; i < formClassFeatures.length; i++) {
			const result = FeatureSchema.safeParse(formClassFeatures[i]);

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
		const result = ClassFormSchema.safeParse(formData);
		if (!result.success) {
			const allErrors = extractFieldErrors(result.error);
			// Filter out feature array errors since we handle individual feature errors separately
			const { hope_feature, class_features, ...formErrors } = allErrors;
			errors = formErrors;
		} else {
			errors = {};
		}
	}

	// Reactive validation - re-validate when form data changes (only after first validation attempt)
	$effect(() => {
		if (!validationAttempted) return;

		// Track feature changes
		formHopeFeature;
		formClassFeatures;

		// Re-validate features when they change
		validateFeatures();
	});

	// Re-validate form fields when they change
	$effect(() => {
		if (!validationAttempted) return;

		// Track form field changes
		formName;
		formDescriptionHtml;
		formImageUrl;
		formStartingEvasion;
		formStartingMaxHp;
		formPrimaryDomainId;
		formSecondaryDomainId;
		formSubclassIds;
		formSuggestedTraits;
		formSuggestedPrimaryWeaponId;
		formSuggestedSecondaryWeaponId;
		formSuggestedArmorId;
		formGoldCoins;
		formFreeGear;
		formLootOrConsumableOptions;
		formClassGearOptions;
		formSpellbookPrompt;
		formBackgroundQuestions;
		formConnectionQuestions;
		formClothes;
		formEyes;
		formBody;
		formSkin;
		formAttitude;

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

		// Mark hope feature modifiers
		if (formHopeFeature) {
			for (let j = 0; j < formHopeFeature.character_modifiers.length; j++) {
				validatedModifierKeys.set(getModifierKey('hope', 'character', j), true);
			}
			for (let j = 0; j < formHopeFeature.weapon_modifiers.length; j++) {
				validatedModifierKeys.set(getModifierKey('hope', 'weapon', j), true);
			}
		}

		// Mark class feature modifiers
		for (let i = 0; i < formClassFeatures.length; i++) {
			const feature = formClassFeatures[i];
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
		const hasHopeFeatureError = hopeFeatureError !== null;

		if (hasFormErrors || hasFeatureErrors || hasHopeFeatureError) {
			// Don't set generic error message - errors are shown inline in each feature
			return;
		}

		// Build form data (validation already passed, so we can use it)
		const formData = buildFormData();

		// Save the original class reference to find it in homebrew state
		const originalClass = item;
		// Update the class prop with validated form values
		const updatedClass = {
			...item,
			...formData
		};
		item = updatedClass;

		// Update the homebrew state record so auto-save can detect the change
		// Find the class's UID in the collection using the original reference
		const newClassRef = JSON.parse(JSON.stringify(updatedClass));
		for (const [uid, c] of Object.entries(homebrew.classes)) {
			if (c === originalClass) {
				homebrew.classes[uid] = newClassRef;
				break;
			}
		}

		// Clear errors on success
		errors = {};
		featureErrors.clear();
		hopeFeatureError = null;
		validationAttempted = false;

		// Call callback if provided
		if (onSubmit && e) {
			onSubmit(e);
		}
	}

	export function handleReset() {
		if (!item) return;
		// Re-sync form from characterClass prop
		formName = item.name;
		formDescriptionHtml = item.description_html;
		formImageUrl = item.image_url;
		formStartingEvasion = String(item.starting_evasion);
		formStartingMaxHp = String(item.starting_max_hp);
		formPrimaryDomainId = item.primary_domain_id;
		formSecondaryDomainId = item.secondary_domain_id;
		formHopeFeature = JSON.parse(JSON.stringify(item.hope_feature));
		formClassFeatures = JSON.parse(JSON.stringify(item.class_features));
		formSubclassIds = [...item.subclass_ids];
		formSuggestedTraits = JSON.parse(JSON.stringify(item.suggested_traits));
		formSuggestedPrimaryWeaponId = item.suggested_primary_weapon_id;
		formSuggestedSecondaryWeaponId = item.suggested_secondary_weapon_id;
		formSuggestedArmorId = item.suggested_armor_id;
		formGoldCoins = item.starting_inventory.gold_coins;
		formFreeGear = JSON.parse(JSON.stringify(item.starting_inventory.free_gear));
		formLootOrConsumableOptions = [...item.starting_inventory.loot_or_consumable_options];
		formClassGearOptions = JSON.parse(JSON.stringify(item.starting_inventory.class_gear_options));
		formSpellbookPrompt = item.starting_inventory.spellbook_prompt || '';
		formBackgroundQuestions = [...item.background_questions];
		formConnectionQuestions = [...item.connection_questions];
		formClothes = item.character_description_suggestions.clothes;
		formEyes = item.character_description_suggestions.eyes;
		formBody = item.character_description_suggestions.body;
		formSkin = item.character_description_suggestions.skin;
		formAttitude = item.character_description_suggestions.attitude;
		// Clear pending image file on reset
		imageInput?.clearPendingFile();
		hasPendingImageFile = false;
		// Clear errors
		errors = {};
		featureErrors.clear();
		hopeFeatureError = null;
		validationAttempted = false;
		validatedModifierKeys.clear();

		// Note: onReset callback removed to prevent infinite recursion
		// The parent component should handle any additional reset logic if needed
	}

	function addClassFeature() {
		const index = formClassFeatures.length;
		dropdownOpenIndex = index;
		const newFeature: Feature = {
			title: '',
			description_html: '',
			character_modifiers: [],
			weapon_modifiers: []
		};
		formClassFeatures = [...formClassFeatures, newFeature];

		tick().then(() => {
			dropdownOpenIndex = -1;
		});
	}

	function removeClassFeature(index: number) {
		formClassFeatures = formClassFeatures.filter((_, i) => i !== index);
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

	function addFreeGear() {
		formFreeGear = [...formFreeGear, { title: '' }];
	}

	function removeFreeGear(index: number) {
		formFreeGear = formFreeGear.filter((_, i) => i !== index);
	}

	function addClassGear() {
		formClassGearOptions = [...formClassGearOptions, { title: '' }];
	}

	function removeClassGear(index: number) {
		formClassGearOptions = formClassGearOptions.filter((_, i) => i !== index);
	}

	function addLootOrConsumableOption() {
		formLootOrConsumableOptions = [...formLootOrConsumableOptions, ''];
	}

	function removeLootOrConsumableOption(index: number) {
		formLootOrConsumableOptions = formLootOrConsumableOptions.filter((_, i) => i !== index);
	}

	function addBackgroundQuestion() {
		formBackgroundQuestions = [...formBackgroundQuestions, ''];
	}

	function removeBackgroundQuestion(index: number) {
		formBackgroundQuestions = formBackgroundQuestions.filter((_, i) => i !== index);
	}

	function addConnectionQuestion() {
		formConnectionQuestions = [...formConnectionQuestions, ''];
	}

	function removeConnectionQuestion(index: number) {
		formConnectionQuestions = formConnectionQuestions.filter((_, i) => i !== index);
	}

	// Helper function to resolve item ID to name
	function getItemName(itemId: string): string {
		// Check loot
		const loot = compendium.loot[itemId] || homebrew.loot[itemId];
		if (loot) return loot.title;

		// Check consumables
		const consumable = compendium.consumables[itemId] || homebrew.consumables[itemId];
		if (consumable) return consumable.title;

		// Check weapons
		const primaryWeapon = compendium.primary_weapons[itemId] || homebrew.primary_weapons[itemId];
		if (primaryWeapon) return primaryWeapon.title;

		const secondaryWeapon =
			compendium.secondary_weapons[itemId] || homebrew.secondary_weapons[itemId];
		if (secondaryWeapon) return secondaryWeapon.title;

		// Check armor
		const armor = compendium.armor[itemId] || homebrew.armor[itemId];
		if (armor) return armor.title;

		// Fallback to ID if not found
		return itemId;
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">
	<!-- Name -->
	<div class="flex flex-col gap-1">
		<label
			for="hb-class-name"
			class={cn('text-xs font-medium text-muted-foreground', errors.name && 'text-destructive')}
			>Name</label
		>
		<Input
			id="hb-class-name"
			bind:value={formName}
			placeholder="Class name"
			aria-invalid={!!errors.name}
		/>
		{#if errors.name}
			<p class="text-xs text-destructive">{errors.name}</p>
		{/if}
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-1">
		<label for="hb-class-description" class="text-xs font-medium text-muted-foreground"
			>Description</label
		>
		<Textarea
			id="hb-class-description"
			bind:value={formDescriptionHtml}
			placeholder="Class description"
			rows={3}
		/>
	</div>

	<div class="flex gap-2">
		<!-- Image -->
		<div class="flex flex-col gap-1">
			<label for="hb-class-image-url" class="text-xs font-medium text-muted-foreground">Image</label
			>
			<ImageUrlInput
				bind:this={imageInput}
				id="hb-class-image-url"
				bind:value={formImageUrl}
				bind:hasPendingFile={hasPendingImageFile}
				alt="Class image"
				class="w-26"
			/>
		</div>

		<!-- Domains -->
		<div class="flex grow flex-col gap-2">
			<div class="flex flex-col gap-1">
				<label for="hb-class-primary-domain" class="text-xs font-medium text-muted-foreground"
					>Primary Domain</label
				>
				<Select.Root type="single" bind:value={formPrimaryDomainId}>
					<Select.Trigger id="hb-class-primary-domain" class="w-full">
						<p class="truncate">{formPrimaryDomainId}</p>
					</Select.Trigger>
					<Select.Content>
						{#each domainOptions as domain}
							<Select.Item value={domain}>{domain}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-col gap-1">
				<label for="hb-class-secondary-domain" class="text-xs font-medium text-muted-foreground"
					>Secondary Domain</label
				>
				<Select.Root type="single" bind:value={formSecondaryDomainId}>
					<Select.Trigger id="hb-class-secondary-domain" class="w-full">
						<p class="truncate">{formSecondaryDomainId}</p>
					</Select.Trigger>
					<Select.Content>
						{#each domainOptions as domain}
							<Select.Item value={domain}>{domain}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>
	</div>

	<!-- Starting Stats -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-class-starting-evasion" class="text-xs font-medium text-muted-foreground"
				>Starting Evasion</label
			>
			<Input
				id="hb-class-starting-evasion"
				type="number"
				inputmode="numeric"
				bind:value={formStartingEvasion}
				placeholder="0"
			/>
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-class-starting-max-hp" class="text-xs font-medium text-muted-foreground"
				>Starting Max HP</label
			>
			<Input
				id="hb-class-starting-max-hp"
				type="number"
				inputmode="numeric"
				bind:value={formStartingMaxHp}
				placeholder="0"
			/>
		</div>
	</div>

	<!-- Hope Feature -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p
				class={cn(
					'text-xs font-medium text-muted-foreground',
					errors.hope_feature && 'text-destructive'
				)}
			>
				Hope Feature
			</p>
		</div>
		{#if errors.hope_feature}
			<p class="text-xs text-destructive">{errors.hope_feature}</p>
		{/if}
		{#if formHopeFeature}
			<Dropdown
				title={formHopeFeature.title || 'Hope Feature'}
				class={hopeFeatureError
					? 'data-[open=false]:border data-[open=false]:border-destructive'
					: ''}
			>
				<HomebrewFeatureForm
					bind:feature={formHopeFeature}
					errors={hopeFeatureError ?? undefined}
				/>
			</Dropdown>
		{:else}
			<Button
				type="button"
				size="sm"
				variant="outline"
				onclick={() => {
					formHopeFeature = {
						title: '',
						description_html: '',
						character_modifiers: [],
						weapon_modifiers: []
					};
				}}
			>
				<Plus class="size-3.5" />
				Add Hope Feature
			</Button>
		{/if}
	</div>

	<!-- Class Features -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p
				class={cn(
					'text-xs font-medium text-muted-foreground',
					errors.class_features && 'text-destructive'
				)}
			>
				Class Features
			</p>
			<Button type="button" size="sm" variant="outline" onclick={addClassFeature}>
				<Plus class="size-3.5" />
				Add Feature
			</Button>
		</div>
		{#if errors.class_features}
			<p class="text-xs text-destructive">{errors.class_features}</p>
		{/if}
		<div class="flex flex-col gap-2">
			{#each formClassFeatures as feature, index (index)}
				<Dropdown
					title={feature.title || `Unnamed feature`}
					class={featureErrors.has(index)
						? 'data-[open=false]:border data-[open=false]:border-destructive'
						: ''}
					open={dropdownOpenIndex === index}
				>
					<HomebrewFeatureForm
						bind:feature={formClassFeatures[index]}
						onRemove={() => removeClassFeature(index)}
						errors={featureErrors.get(index)}
					/>
				</Dropdown>
			{:else}
				<p class="text-xs italic text-muted-foreground">No class features added</p>
			{/each}
		</div>
	</div>

	<!-- Subclasses -->
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium text-muted-foreground">Subclasses</p>

		{#if availableSubclassesForClass.length > 0}
			<Select.Root
				type="multiple"
				value={formSubclassIds}
				onValueChange={(value) => {
					formSubclassIds = value.filter((v) => !!v);
				}}
			>
				<Select.Trigger class="w-full">
					<p class="truncate">
						{#if formSubclassIds.length === 0 || availableSubclassesForClass.length === 0}
							None
						{:else}
							{formSubclassIds.length} selected
						{/if}
					</p>
				</Select.Trigger>
				<Select.Content>
					{#each availableSubclassesForClass as subclass}
						<Select.Item value={subclass.id}>
							{subclass.name} ({subclass.source === 'homebrew' ? 'Homebrew' : 'Compendium'})
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		{:else}
			<p class="text-xs text-muted-foreground italic">
				No subclasses have been created for this class yet.
			</p>
		{/if}
	</div>

	<!-- Suggested Traits -->
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium text-muted-foreground">Suggested Traits</p>
		<div class="grid grid-cols-3 gap-3">
			{#each traitOptions as trait}
				<div class="flex flex-col gap-1">
					<label for="class-suggested-trait-{trait}" class="text-xs text-muted-foreground"
						>{capitalize(trait)}</label
					>
					<Input
						id="class-suggested-trait-{trait}"
						type="number"
						value={formSuggestedTraits[trait] === null ? '' : String(formSuggestedTraits[trait])}
						oninput={(e) => {
							const value = e.currentTarget.value;
							formSuggestedTraits = {
								...formSuggestedTraits,
								[trait]: value === '' ? null : Number(value)
							};
						}}
						placeholder="null"
					/>
				</div>
			{/each}
		</div>
	</div>

	<!-- Suggested Equipment -->
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium text-muted-foreground">Suggested Equipment</p>
		<div class="flex flex-col gap-3">
			<!-- Primary Weapon -->
			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between">
					<label for="class-primary-weapon" class="text-xs text-muted-foreground"
						>Primary Weapon</label
					>
					{#if !formSuggestedPrimaryWeaponId}
						<Button
							type="button"
							size="sm"
							variant="outline"
							onclick={() => (primaryWeaponSheetOpen = true)}
						>
							<Plus class="size-3.5" />
							Select
						</Button>
					{/if}
				</div>
				{#if formSuggestedPrimaryWeaponId}
					<div class="flex items-center gap-2">
						<span class="flex-1 text-sm">{getItemName(formSuggestedPrimaryWeaponId)}</span>
						<Button
							type="button"
							size="sm"
							variant="ghost"
							onclick={() => (formSuggestedPrimaryWeaponId = null)}
						>
							<X class="size-3.5" />
						</Button>
					</div>
				{/if}
			</div>

			<!-- Secondary Weapon -->
			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between">
					<label for="class-secondary-weapon" class="text-xs text-muted-foreground"
						>Secondary Weapon</label
					>
					{#if !formSuggestedSecondaryWeaponId}
						<Button
							type="button"
							size="sm"
							variant="outline"
							onclick={() => (secondaryWeaponSheetOpen = true)}
						>
							<Plus class="size-3.5" />
							Select
						</Button>
					{/if}
				</div>
				{#if formSuggestedSecondaryWeaponId}
					<div class="flex items-center gap-2">
						<span class="flex-1 text-sm">{getItemName(formSuggestedSecondaryWeaponId)}</span>
						<Button
							type="button"
							size="sm"
							variant="ghost"
							onclick={() => (formSuggestedSecondaryWeaponId = null)}
						>
							<X class="size-3.5" />
						</Button>
					</div>
				{/if}
			</div>

			<!-- Armor -->
			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between">
					<label for="class-armor" class="text-xs text-muted-foreground">Armor</label>
					{#if !formSuggestedArmorId}
						<Button
							type="button"
							size="sm"
							variant="outline"
							onclick={() => (armorSheetOpen = true)}
						>
							<Plus class="size-3.5" />
							Select
						</Button>
					{/if}
				</div>
				{#if formSuggestedArmorId}
					<div class="flex items-center gap-2">
						<span class="flex-1 text-sm">{getItemName(formSuggestedArmorId)}</span>
						<Button
							type="button"
							size="sm"
							variant="ghost"
							onclick={() => (formSuggestedArmorId = null)}
						>
							<X class="size-3.5" />
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Item Selector Sheets for Suggested Equipment -->
	<ItemSelectorSheet
		bind:open={primaryWeaponSheetOpen}
		itemTypes={['weapon']}
		title="Select Primary Weapon"
		description="Select a primary weapon from the catalog"
		onSelect={(item) => {
			formSuggestedPrimaryWeaponId = item.id;
			primaryWeaponSheetOpen = false;
		}}
	/>

	<ItemSelectorSheet
		bind:open={secondaryWeaponSheetOpen}
		itemTypes={['weapon']}
		title="Select Secondary Weapon"
		description="Select a secondary weapon from the catalog"
		onSelect={(item) => {
			formSuggestedSecondaryWeaponId = item.id;
			secondaryWeaponSheetOpen = false;
		}}
	/>

	<ItemSelectorSheet
		bind:open={armorSheetOpen}
		itemTypes={['armor']}
		title="Select Armor"
		description="Select armor from the catalog"
		onSelect={(item) => {
			formSuggestedArmorId = item.id;
			armorSheetOpen = false;
		}}
	/>

	<!-- Starting Inventory -->
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium text-muted-foreground">Starting Inventory</p>
		<div class="space-y-3 rounded-lg border bg-muted p-3">
			<!-- Gold  -->
			<Gold bind:gold_coins={formGoldCoins} canEdit />

			<!-- Free Gear -->
			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between">
					<p class="text-xs text-muted-foreground">Free Gear</p>
					<Button
						type="button"
						size="sm"
						variant="outline"
						onclick={() => (freeGearSheetOpen = true)}
					>
						<Plus class="size-3.5" />
						Add
					</Button>
				</div>
				<div class="flex flex-col gap-2">
					{#each formFreeGear as gear, index (index)}
						<div class="flex items-center gap-2">
							<Input
								bind:value={formFreeGear[index].title}
								placeholder="Gear name"
								class="flex-1"
							/>
							<Button type="button" size="sm" variant="ghost" onclick={() => removeFreeGear(index)}>
								<X class="size-3.5" />
							</Button>
						</div>
					{/each}
				</div>
			</div>

			<ItemSelectorSheet
				bind:open={freeGearSheetOpen}
				itemTypes={['weapon', 'armor', 'consumable', 'loot', 'gear']}
				allowCustom={true}
				title="Add Free Gear"
				description="Select an item from the catalog or enter a custom item name"
				onSelect={(item) => {
					formFreeGear = [...formFreeGear, { title: item.title }];
					freeGearSheetOpen = false;
				}}
			/>

			<!-- Loot or Consumable Options -->
			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between">
					<p class="text-xs text-muted-foreground">Loot or Consumable Options</p>
					<Button
						type="button"
						size="sm"
						variant="outline"
						onclick={() => (lootOrConsumableSheetOpen = true)}
					>
						<Plus class="size-3.5" />
						Add
					</Button>
				</div>
				<div class="flex flex-col gap-2">
					{#each formLootOrConsumableOptions as option, index (index)}
						<div class="flex items-center gap-2">
							<span class="flex-1 text-sm">{getItemName(option)}</span>
							<Button
								type="button"
								size="sm"
								variant="ghost"
								onclick={() => removeLootOrConsumableOption(index)}
							>
								<X class="size-3.5" />
							</Button>
						</div>
					{/each}
				</div>
			</div>

			<ItemSelectorSheet
				bind:open={lootOrConsumableSheetOpen}
				itemTypes={['loot', 'consumable']}
				title="Add Loot or Consumable"
				description="Select a loot item or consumable from the catalog"
				onSelect={(item) => {
					formLootOrConsumableOptions = [...formLootOrConsumableOptions, item.id];
					lootOrConsumableSheetOpen = false;
				}}
			/>

			<!-- Class Gear Options -->
			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between">
					<p class="text-xs text-muted-foreground">Class Gear Options</p>
					<Button
						type="button"
						size="sm"
						variant="outline"
						onclick={() => (classGearSheetOpen = true)}
					>
						<Plus class="size-3.5" />
						Add
					</Button>
				</div>
				<div class="flex flex-col gap-2">
					{#each formClassGearOptions as gear, index (index)}
						<div class="flex items-center gap-2">
							<Input
								bind:value={formClassGearOptions[index].title}
								placeholder="Gear name"
								class="flex-1"
							/>
							<Button
								type="button"
								size="sm"
								variant="ghost"
								onclick={() => removeClassGear(index)}
							>
								<X class="size-3.5" />
							</Button>
						</div>
					{/each}
				</div>
			</div>

			<ItemSelectorSheet
				bind:open={classGearSheetOpen}
				itemTypes={['weapon', 'armor', 'consumable', 'loot', 'gear']}
				allowCustom={true}
				title="Add Class Gear"
				description="Select an item from the catalog or enter a custom item name"
				onSelect={(item) => {
					formClassGearOptions = [...formClassGearOptions, { title: item.title }];
					classGearSheetOpen = false;
				}}
			/>

			<!-- Spellbook Prompt -->
			<div class="flex flex-col gap-1">
				<label for="class-spellbook-prompt" class="text-xs text-muted-foreground"
					>Spellbook Prompt (Optional)</label
				>
				<Input
					id="class-spellbook-prompt"
					bind:value={formSpellbookPrompt}
					placeholder="Spellbook prompt"
				/>
			</div>
		</div>
	</div>

	<!-- Background Questions -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Background Questions</p>
			<Button type="button" size="sm" variant="outline" onclick={addBackgroundQuestion}>
				<Plus class="size-3.5" />
				Add Question
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each formBackgroundQuestions as question, index (index)}
				<div class="flex items-center gap-2">
					<Textarea
						bind:value={formBackgroundQuestions[index]}
						placeholder="Question"
						rows={2}
						class="flex-1"
					/>
					<Button
						type="button"
						size="sm"
						variant="ghost"
						onclick={() => removeBackgroundQuestion(index)}
					>
						<X class="size-3.5" />
					</Button>
				</div>
			{/each}
		</div>
	</div>

	<!-- Connection Questions -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Connection Questions</p>
			<Button type="button" size="sm" variant="outline" onclick={addConnectionQuestion}>
				<Plus class="size-3.5" />
				Add Question
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each formConnectionQuestions as question, index (index)}
				<div class="flex items-center gap-2">
					<Textarea
						bind:value={formConnectionQuestions[index]}
						placeholder="Question"
						rows={2}
						class="flex-1"
					/>
					<Button
						type="button"
						size="sm"
						variant="ghost"
						onclick={() => removeConnectionQuestion(index)}
					>
						<X class="size-3.5" />
					</Button>
				</div>
			{/each}
		</div>
	</div>

	<!-- Character Description Suggestions -->
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium text-muted-foreground">Character Description Suggestions</p>
		<div class="space-y-3 rounded-lg border bg-muted p-3">
			<div class="flex flex-col gap-1">
				<label for="class-clothes" class="text-xs text-muted-foreground">Clothes</label>
				<Input id="class-clothes" bind:value={formClothes} placeholder="Clothes suggestion" />
			</div>
			<div class="flex flex-col gap-1">
				<label for="class-eyes" class="text-xs text-muted-foreground">Eyes</label>
				<Input id="class-eyes" bind:value={formEyes} placeholder="Eyes suggestion" />
			</div>
			<div class="flex flex-col gap-1">
				<label for="class-body" class="text-xs text-muted-foreground">Body</label>
				<Input id="class-body" bind:value={formBody} placeholder="Body suggestion" />
			</div>
			<div class="flex flex-col gap-1">
				<label for="class-skin" class="text-xs text-muted-foreground">Skin</label>
				<Input id="class-skin" bind:value={formSkin} placeholder="Skin suggestion" />
			</div>
			<div class="flex flex-col gap-1">
				<label for="class-attitude" class="text-xs text-muted-foreground">Attitude</label>
				<Input id="class-attitude" bind:value={formAttitude} placeholder="Attitude suggestion" />
			</div>
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
