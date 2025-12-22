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
	} from './form-schemas';

	let { consumable = $bindable() }: { consumable: Consumable } = $props();

	// Form state - initialized from consumable prop
	let formTitle = $state('');
	let formDescriptionHtml = $state('');
	let formRarityRoll = $state('');

	// Validation errors state
	let errors = $state<ConsumableFormErrors>({});

	// Check if form has changes compared to the consumable prop
	let hasChanges = $derived.by(() => {
		if (!consumable) return false;

		const titleMatch = formTitle.trim() === consumable.title;
		const descriptionMatch = formDescriptionHtml === consumable.description_html;
		const formRarityRollNum = formRarityRoll === '' ? 0 : Number(formRarityRoll);
		const rarityMatch = formRarityRollNum === consumable.rarity_roll;

		return !(titleMatch && descriptionMatch && rarityMatch);
	});

	// Sync form state when consumable prop changes
	$effect(() => {
		if (consumable) {
			formTitle = consumable.title;
			formDescriptionHtml = consumable.description_html;
			formRarityRoll = consumable.rarity_roll === 0 ? '' : String(consumable.rarity_roll);
			// Clear errors when consumable changes
			errors = {};
		}
	});

	function buildFormData() {
		return {
			title: formTitle.trim(),
			description_html: formDescriptionHtml,
			rarity_roll: formRarityRoll === '' ? 0 : Number(formRarityRoll)
		};
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!consumable) return;

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
		consumable = {
			...consumable,
			...result.data
		};

		// Clear errors on success
		errors = {};
	}

	function handleReset() {
		if (!consumable) return;
		// Re-sync form from consumable prop
		formTitle = consumable.title;
		formDescriptionHtml = consumable.description_html;
		formRarityRoll = consumable.rarity_roll === 0 ? '' : String(consumable.rarity_roll);
		// Clear errors on reset
		errors = {};
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

	<!-- Rarity Roll -->
	<div class="flex flex-col gap-1">
		<label
			for="hb-consumable-rarity-roll"
			class={cn(
				'text-xs font-medium text-muted-foreground',
				errors.rarity_roll && 'text-destructive'
			)}
			>Rarity Roll (1-20)</label
		>
		<Input
			id="hb-consumable-rarity-roll"
			type="number"
			inputmode="numeric"
			bind:value={formRarityRoll}
			placeholder="1"
			min="1"
			max="20"
			step="1"
			aria-invalid={!!errors.rarity_roll}
		/>
		{#if errors.rarity_roll}
			<p class="text-xs text-destructive">{errors.rarity_roll}</p>
		{/if}
	</div>

	<!-- Actions -->
	<div class="flex gap-2 pt-2">
		<Button type="submit" size="sm" disabled={!hasChanges}>Save</Button>
		{#if hasChanges}
			<Button type="button" size="sm" variant="link" onclick={handleReset}>Discard changes</Button>
		{/if}
	</div>
</form>
