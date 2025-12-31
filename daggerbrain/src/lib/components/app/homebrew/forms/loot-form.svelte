<script lang="ts">
	import type { Loot, CharacterModifier, WeaponModifier } from '$lib/types/compendium-types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import HomebrewCharacterModifierEditor from '../features/character-modifier-editor.svelte';
	import HomebrewWeaponModifierEditor from '../features/weapon-modifier-editor.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import {
		LootFormSchema,
		CharacterModifierSchema,
		WeaponModifierSchema,
		extractFieldErrors,
		type LootFormErrors
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
		item: Loot;
		hasChanges?: boolean;
		hasErrors?: boolean;
		onSubmit?: (e?: SubmitEvent) => void;
		onReset?: () => void;
	} = $props();

	const homebrew = getHomebrewContext();

	// Form state - initialized from loot prop
	let formTitle = $state('');
	let formDescriptionHtml = $state('');
	let formCharacterModifiers = $state<CharacterModifier[]>([]);
	let formWeaponModifiers = $state<WeaponModifier[]>([]);

	// Validation errors state
	let errors = $state<LootFormErrors>({});

	// Modifier error tracking
	const characterModifierErrors = new SvelteMap<number, string[]>();
	const weaponModifierErrors = new SvelteMap<number, string[]>();

	// Track if validation has been attempted (to show errors only after first submit attempt)
	let validationAttempted = $state(false);

	// Track which modifiers existed at the last validation attempt
	// New modifiers added after validation should not show errors until next submit
	const validatedModifierKeys = new SvelteMap<string, boolean>();

	// Generate a key for a modifier to track it
	function getModifierKey(modifierType: 'character' | 'weapon', modifierIndex: number): string {
		return `${modifierType}-${modifierIndex}`;
	}

	// Check if form has changes compared to the item prop
	let formHasChanges = $derived.by(() => {
		if (!item) return false;

		const titleMatch = formTitle.trim() === item.title;
		const descriptionMatch = formDescriptionHtml === item.description_html;

		// Compare modifiers (deep comparison)
		const characterModifiersMatch =
			JSON.stringify(formCharacterModifiers) === JSON.stringify(item.character_modifiers);
		const weaponModifiersMatch =
			JSON.stringify(formWeaponModifiers) === JSON.stringify(item.weapon_modifiers);

		return !(titleMatch && descriptionMatch && characterModifiersMatch && weaponModifiersMatch);
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
		// Check modifier errors
		if (characterModifierErrors.size > 0 || weaponModifierErrors.size > 0) {
			return true;
		}
		return false;
	});

	// Collect all error messages for display
	let allErrorMessages = $derived.by(() => {
		const messages: string[] = [];

		// Add form-level errors
		for (const [key, value] of Object.entries(errors)) {
			if (value) {
				messages.push(`${key}: ${value}`);
			}
		}

		// Add character modifier errors
		for (const [index, modErrors] of characterModifierErrors) {
			for (const error of modErrors) {
				messages.push(`Character Modifier ${index + 1}: ${error}`);
			}
		}

		// Add weapon modifier errors
		for (const [index, modErrors] of weaponModifierErrors) {
			for (const error of modErrors) {
				messages.push(`Weapon Modifier ${index + 1}: ${error}`);
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
			formCharacterModifiers = JSON.parse(JSON.stringify(item.character_modifiers));
			formWeaponModifiers = JSON.parse(JSON.stringify(item.weapon_modifiers));
			// Clear errors when loot changes
			errors = {};
			characterModifierErrors.clear();
			weaponModifierErrors.clear();
			validationAttempted = false;
			validatedModifierKeys.clear();
		}
	});

	function buildFormData() {
		return {
			title: formTitle.trim(),
			description_html: formDescriptionHtml,
			rarity_roll: item?.rarity_roll ?? 1,
			character_modifiers: JSON.parse(JSON.stringify(formCharacterModifiers)),
			weapon_modifiers: JSON.parse(JSON.stringify(formWeaponModifiers))
		};
	}

	// Helper to process modifier errors
	function processModifierError(
		issue: { path: readonly PropertyKey[]; message: string; code?: string },
		targetField: 'target' | 'target_stat',
		requiredMessage: string
	): string {
		const nestedPath = issue.path.slice(1);

		if (nestedPath.length > 0) {
			const fieldName = nestedPath.map(String).join('.');
			if (fieldName === targetField || issue.message.includes(targetField)) {
				return requiredMessage;
			}
			return `${fieldName}: ${issue.message}`;
		}

		// Handle discriminated union errors (missing target/target_stat)
		if (issue.message.includes(targetField) || issue.code === 'invalid_union') {
			return requiredMessage;
		}

		return issue.message;
	}

	// Validate modifiers and update error state
	function validateModifiers() {
		// Validate character modifiers
		for (let i = 0; i < formCharacterModifiers.length; i++) {
			const result = CharacterModifierSchema.safeParse(formCharacterModifiers[i]);

			if (!result.success) {
				const modifierErrors: string[] = [];
				for (const issue of result.error.issues) {
					const errorMessage = processModifierError(
						issue,
						'target',
						'Character attribute to modify is required'
					);
					modifierErrors.push(errorMessage);
				}

				const key = getModifierKey('character', i);
				if (validatedModifierKeys.has(key)) {
					characterModifierErrors.set(i, modifierErrors);
				} else {
					characterModifierErrors.delete(i);
				}
			} else {
				characterModifierErrors.delete(i);
			}
		}

		// Validate weapon modifiers
		for (let i = 0; i < formWeaponModifiers.length; i++) {
			const result = WeaponModifierSchema.safeParse(formWeaponModifiers[i]);

			if (!result.success) {
				const modifierErrors: string[] = [];
				for (const issue of result.error.issues) {
					const errorMessage = processModifierError(
						issue,
						'target_stat',
						'Weapon stat to modify is required'
					);
					modifierErrors.push(errorMessage);
				}

				const key = getModifierKey('weapon', i);
				if (validatedModifierKeys.has(key)) {
					weaponModifierErrors.set(i, modifierErrors);
				} else {
					weaponModifierErrors.delete(i);
				}
			} else {
				weaponModifierErrors.delete(i);
			}
		}
	}

	// Validate form-level fields
	function validateFormFields() {
		const formData = buildFormData();
		const result = LootFormSchema.safeParse(formData);
		if (!result.success) {
			const allErrors = extractFieldErrors(result.error);
			// Filter out modifier array errors since we handle individual modifier errors separately
			const { character_modifiers, weapon_modifiers, ...formErrors } = allErrors;
			errors = formErrors;
		} else {
			errors = {};
		}
	}

	// Reactive validation - re-validate when form data changes (only after first validation attempt)
	$effect(() => {
		if (!validationAttempted) return;

		// Re-validate modifiers when they change
		validateModifiers();
	});

	// Re-validate form fields when they change
	$effect(() => {
		if (!validationAttempted) return;

		// Track form field changes
		formTitle;
		formDescriptionHtml;

		validateFormFields();
	});

	export function handleSubmit(e?: SubmitEvent) {
		if (e) {
			e.preventDefault();
		}
		if (!item) return;

		// Mark that validation has been attempted
		validationAttempted = true;

		// Mark all current modifiers as validated (so errors will show for them)
		validatedModifierKeys.clear();
		for (let i = 0; i < formCharacterModifiers.length; i++) {
			validatedModifierKeys.set(getModifierKey('character', i), true);
		}
		for (let i = 0; i < formWeaponModifiers.length; i++) {
			validatedModifierKeys.set(getModifierKey('weapon', i), true);
		}

		// Validate all modifiers
		validateModifiers();

		// Validate form-level fields
		validateFormFields();

		// Check if there are any validation errors
		const hasFormErrors = Object.keys(errors).length > 0;
		const hasModifierErrors = characterModifierErrors.size > 0 || weaponModifierErrors.size > 0;

		if (hasFormErrors || hasModifierErrors) {
			// Don't set generic error message - errors are shown inline
			return;
		}

		// Build form data (validation already passed, so we can use it)
		const formData = buildFormData();

		// Save the original loot reference to find it in homebrew state
		const originalLoot = item;
		// Update the loot prop with validated form values
		const updatedLoot = {
			...item,
			...formData
		};
		item = updatedLoot;

		// Update the homebrew state record so auto-save can detect the change
		// Find the loot's UID in the collection using the original reference
		const newLootRef = JSON.parse(JSON.stringify(updatedLoot));
		for (const [uid, l] of Object.entries(homebrew.loot)) {
			if (l === originalLoot) {
				homebrew.loot[uid] = newLootRef;
				break;
			}
		}

		// Clear errors on success
		errors = {};
		characterModifierErrors.clear();
		weaponModifierErrors.clear();
		validationAttempted = false;

		// Call callback if provided
		if (onSubmit && e) {
			onSubmit(e);
		}
	}

	export function handleReset() {
		if (!item) return;
		// Re-sync form from loot prop
		formTitle = item.title;
		formDescriptionHtml = item.description_html;
		formCharacterModifiers = JSON.parse(JSON.stringify(item.character_modifiers));
		formWeaponModifiers = JSON.parse(JSON.stringify(item.weapon_modifiers));
		// Clear errors on reset
		errors = {};
		characterModifierErrors.clear();
		weaponModifierErrors.clear();
		validationAttempted = false;
		validatedModifierKeys.clear();

		// Note: onReset callback removed to prevent infinite recursion
		// The parent component should handle any additional reset logic if needed
	}

	function addCharacterModifier() {
		// Create a modifier without a valid target - this will fail Zod validation
		// until the user selects a target in the editor.
		// The CharacterModifierSchema requires a target through a discriminated union,
		// so a modifier without a target will fail validation.
		// Using 'as any' to bypass TypeScript type checking since we intentionally
		// want to create an invalid modifier that validation will catch.
		const newModifier = {
			behaviour: 'bonus' as const,
			character_conditions: [],
			type: 'flat' as const,
			value: 0
			// Intentionally missing 'target' property - will fail CharacterModifierSchema validation
		} as any as CharacterModifier;
		formCharacterModifiers = [...formCharacterModifiers, newModifier];
	}

	function removeCharacterModifier(index: number) {
		formCharacterModifiers = formCharacterModifiers.filter((_, i) => i !== index);
		// Clean up errors and re-index for items after the removed one
		characterModifierErrors.delete(index);

		// Collect entries that need re-indexing
		const errorsToReindex: [number, string[]][] = [];
		for (const [i, errorData] of characterModifierErrors) {
			if (i > index) {
				errorsToReindex.push([i, errorData]);
			}
		}

		// Delete old keys and set new ones
		for (const [i] of errorsToReindex) {
			characterModifierErrors.delete(i);
		}
		for (const [i, errorData] of errorsToReindex) {
			characterModifierErrors.set(i - 1, errorData);
		}
	}

	function addWeaponModifier() {
		// Create a modifier without a valid target_stat - this will fail Zod validation
		// until the user selects a target stat in the editor.
		// The WeaponModifierSchema requires a target_stat through a discriminated union,
		// so a modifier without a target_stat will fail validation.
		// Using 'as any' to bypass TypeScript type checking since we intentionally
		// want to create an invalid modifier that validation will catch.
		const newModifier = {
			behaviour: 'bonus' as const,
			character_conditions: [],
			target_weapon: 'all' as const
			// Intentionally missing 'target_stat' property - will fail WeaponModifierSchema validation
		} as any as WeaponModifier;
		formWeaponModifiers = [...formWeaponModifiers, newModifier];
	}

	function removeWeaponModifier(index: number) {
		formWeaponModifiers = formWeaponModifiers.filter((_, i) => i !== index);
		// Clean up errors and re-index for items after the removed one
		weaponModifierErrors.delete(index);

		// Collect entries that need re-indexing
		const errorsToReindex: [number, string[]][] = [];
		for (const [i, errorData] of weaponModifierErrors) {
			if (i > index) {
				errorsToReindex.push([i, errorData]);
			}
		}

		// Delete old keys and set new ones
		for (const [i] of errorsToReindex) {
			weaponModifierErrors.delete(i);
		}
		for (const [i, errorData] of errorsToReindex) {
			weaponModifierErrors.set(i - 1, errorData);
		}
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">
	<!-- Title -->
	<div class="flex flex-col gap-1">
		<label
			for="hb-loot-title"
			class={cn('text-xs font-medium text-muted-foreground', errors.title && 'text-destructive')}
			>Name</label
		>
		<Input
			id="hb-loot-title"
			bind:value={formTitle}
			placeholder="Loot name"
			aria-invalid={!!errors.title}
		/>
		{#if errors.title}
			<p class="text-xs text-destructive">{errors.title}</p>
		{/if}
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-1">
		<label for="hb-loot-description" class="text-xs font-medium text-muted-foreground"
			>Description</label
		>
		<Textarea
			id="hb-loot-description"
			bind:value={formDescriptionHtml}
			placeholder="Loot description"
			rows={3}
		/>
	</div>

	<!-- Character Modifiers -->
	<div class="flex flex-col gap-2">
		<Button type="button" size="sm" variant="outline" onclick={addCharacterModifier} class="w-min">
			<Plus class="size-3.5" />
			Add Character Modifier
		</Button>
		{#if formCharacterModifiers.length > 0}
			<div class="flex flex-col gap-2">
				{#each formCharacterModifiers as modifier, index (index)}
					<HomebrewCharacterModifierEditor
						bind:modifier={formCharacterModifiers[index]}
						onRemove={() => removeCharacterModifier(index)}
						errors={characterModifierErrors.get(index)}
					/>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Weapon Modifiers -->
	<div class="flex flex-col gap-2">
		<Button type="button" size="sm" variant="outline" onclick={addWeaponModifier} class="w-min">
			<Plus class="size-3.5" />
			Add Weapon Modifier
		</Button>
		{#if formWeaponModifiers.length > 0}
			<div class="flex flex-col gap-2">
				{#each formWeaponModifiers as modifier, index (index)}
					<HomebrewWeaponModifierEditor
						bind:modifier={formWeaponModifiers[index]}
						onRemove={() => removeWeaponModifier(index)}
						errors={weaponModifierErrors.get(index)}
					/>
				{/each}
			</div>
		{/if}
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
					hasValidationErrors && 'cursor-not-allowed border border-destructive hover:bg-primary'
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
