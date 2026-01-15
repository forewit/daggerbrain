<script lang="ts">
	import type { Consumable } from '@shared/types/compendium.types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import {
		ConsumableFormSchema,
		extractFieldErrors,
		type ConsumableFormErrors
	} from '../form-schemas';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import Loader2 from '@lucide/svelte/icons/loader-2';

	let {
		item = $bindable(),
		hasChanges = $bindable(),
		hasErrors = $bindable(),
		onSubmit,
		onReset
	}: {
		item: Consumable;
		hasChanges?: boolean;
		hasErrors?: boolean;
		onSubmit?: (e?: SubmitEvent) => void;
		onReset?: () => void;
	} = $props();

	const homebrew = getHomebrewContext();

	// Form state - initialized from consumable prop
	let formTitle = $state('');
	let formDescriptionHtml = $state('');

	// Validation errors state
	let errors = $state<ConsumableFormErrors>({});

	// Track if validation has been attempted (to show errors only after first submit attempt)
	let validationAttempted = $state(false);

	// Check if form has changes compared to the item prop
	let formHasChanges = $derived.by(() => {
		if (!item) return false;

		const titleMatch = formTitle.trim() === item.title;
		const descriptionMatch = formDescriptionHtml === item.description_html;

		return !(titleMatch && descriptionMatch);
	});

	// Sync hasChanges to bindable prop
	$effect(() => {
		hasChanges = formHasChanges;
	});

	// Check if there are any validation errors
	let hasValidationErrors = $derived.by(() => {
		return Object.keys(errors).length > 0;
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

		return messages;
	});

	// Sync hasValidationErrors to bindable prop (only after validation attempted)
	$effect(() => {
		hasErrors = validationAttempted && hasValidationErrors;
	});

	// Sync form state when consumable prop changes
	$effect(() => {
		if (item) {
			formTitle = item.title;
			formDescriptionHtml = item.description_html;
			// Clear errors when consumable changes
			errors = {};
			validationAttempted = false;
		}
	});

	function buildFormData() {
		return {
			title: formTitle.trim(),
			description_html: formDescriptionHtml,
			rarity_roll: item?.rarity_roll ?? 1
		};
	}

	// Validate form-level fields
	function validateFormFields() {
		const formData = buildFormData();
		const result = ConsumableFormSchema.safeParse(formData);
		if (!result.success) {
			const allErrors = extractFieldErrors(result.error);
			// Filter out rarity_roll errors since it's auto-generated
			const { rarity_roll, ...formErrors } = allErrors;
			errors = formErrors;
		} else {
			errors = {};
		}
	}

	// Reactive validation - re-validate when form data changes (only after first validation attempt)
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

		// Validate form-level fields
		validateFormFields();

		// Check if there are any validation errors
		const hasFormErrors = Object.keys(errors).length > 0;

		if (hasFormErrors) {
			// Don't set generic error message - errors are shown inline
			return;
		}

		// Build form data (validation already passed, so we can use it)
		const formData = buildFormData();

		// Save the original consumable reference to find it in homebrew state
		const originalConsumable = item;
		// Update the consumable prop with validated form values
		const updatedConsumable = {
			...item,
			...formData
		};
		item = updatedConsumable;

		// Update the homebrew state record so auto-save can detect the change
		// Find the consumable's UID in the collection using the original reference
		const newConsumableRef = JSON.parse(JSON.stringify(updatedConsumable));
		for (const [uid, c] of Object.entries(homebrew.consumables)) {
			if (c === originalConsumable) {
				homebrew.consumables[uid] = newConsumableRef;
				break;
			}
		}

		// Clear errors on success
		errors = {};
		validationAttempted = false;

		// Call callback if provided
		if (onSubmit && e) {
			onSubmit(e);
		}
	}

	export function handleReset() {
		if (!item) return;
		// Re-sync form from consumable prop
		formTitle = item.title;
		formDescriptionHtml = item.description_html;
		// Clear errors on reset
		errors = {};
		validationAttempted = false;

		// Note: onReset callback removed to prevent infinite recursion
		// The parent component should handle any additional reset logic if needed
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">
	<!-- Title -->
	<div class="flex flex-col gap-1">
		<label
			for="hb-consumable-title"
			class={cn('text-xs font-medium text-muted-foreground', errors.title && 'text-destructive')}
			>Name</label
		>
		<Input
			id="hb-consumable-title"
			bind:value={formTitle}
			placeholder="Consumable name"
			aria-invalid={!!errors.title}
		/>
		{#if errors.title}
			<p class="text-xs text-destructive">{errors.title}</p>
		{/if}
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-1">
		<label for="hb-consumable-description" class="text-xs font-medium text-muted-foreground"
			>Description</label
		>
		<Textarea
			id="hb-consumable-description"
			bind:value={formDescriptionHtml}
			placeholder="Consumable description"
			rows={3}
		/>
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
