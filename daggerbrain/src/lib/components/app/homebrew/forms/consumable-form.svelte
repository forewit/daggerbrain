<script lang="ts">
	import type { Consumable } from '$lib/types/compendium-types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
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

	// Check if there are validation errors
	let hasValidationErrors = $derived.by(() => {
		return Object.keys(errors).length > 0;
	});

	// Sync hasValidationErrors to bindable prop
	$effect(() => {
		hasErrors = hasValidationErrors;
	});

	// Sync form state when consumable prop changes
	$effect(() => {
		if (item) {
			formTitle = item.title;
			formDescriptionHtml = item.description_html;
			// Clear errors when consumable changes
			errors = {};
		}
	});

	function buildFormData() {
		return {
			title: formTitle.trim(),
			description_html: formDescriptionHtml,
			rarity_roll: item?.rarity_roll ?? 1
		};
	}

	export function handleSubmit(e?: SubmitEvent) {
		if (e) {
			e.preventDefault();
		}
		if (!item) return;

		// Clear previous errors
		errors = {};

		// Build form data
		const formData = buildFormData();

		// Validate with Zod
		const result = ConsumableFormSchema.safeParse(formData);

		if (!result.success) {
			errors = extractFieldErrors(result.error);
			return;
		}

		// Update the consumable prop with validated form values
		item = {
			...item,
			...result.data
		};

		// Clear errors on success
		errors = {};

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

		// Call callback if provided
		if (onReset) {
			onReset();
		}
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
	<div class="flex gap-2 pt-2">
		<Button type="submit" size="sm" disabled={!formHasChanges || homebrew.saving}>
			{#if homebrew.saving}
				<Loader2 class="size-3.5 animate-spin" />
				Saving...
			{:else}
				Save
			{/if}
		</Button>
		{#if formHasChanges}
			<Button type="button" size="sm" variant="link" onclick={handleReset}>Discard changes</Button>
		{/if}
	</div>
</form>
