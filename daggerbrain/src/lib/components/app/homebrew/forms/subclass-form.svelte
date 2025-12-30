<script lang="ts">
	import type { Subclass, CharacterClass } from '$lib/types/compendium-types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import { cn } from '$lib/utils';
	import SubclassCardEditor from '../features/subclass-card-editor.svelte';
	import Dropdown from '../../leveling/dropdown.svelte';
	import { SubclassFormSchema, extractFieldErrors, type SubclassFormErrors } from '../form-schemas';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';

	let {
		item = $bindable(),
		hasChanges = $bindable(),
		onSubmit,
		onReset
	}: {
		item: Subclass;
		hasChanges?: boolean;
		onSubmit?: (e?: SubmitEvent) => void;
		onReset?: () => void;
	} = $props();

	const compendium = getCompendiumContext();
	const homebrew = getHomebrewContext();

	// References to card editor components
	let foundationEditor: { uploadPendingImage: () => Promise<void> } | null = $state(null);
	let specializationEditor: { uploadPendingImage: () => Promise<void> } | null = $state(null);
	let masteryEditor: { uploadPendingImage: () => Promise<void> } | null = $state(null);

	// Form state - initialized from subclass prop
	let formName = $state('');
	let formDescriptionHtml = $state('');
	let formClassId = $state('');

	// Validation errors state
	let errors = $state<SubclassFormErrors>({});

	// Get all available classes (compendium + homebrew)
	let availableClasses = $derived.by(() => {
		const classes: Array<{ id: string; name: string; source: 'compendium' | 'homebrew' }> = [];
		// Add compendium classes
		for (const [id, cls] of Object.entries(compendium.classes)) {
			classes.push({ id, name: cls.name, source: 'compendium' });
		}
		// Add homebrew classes
		for (const [id, cls] of Object.entries(homebrew.classes)) {
			classes.push({ id, name: cls.name, source: 'homebrew' });
		}
		return classes.sort((a, b) => a.name.localeCompare(b.name));
	});

	// Check if form has changes compared to the item prop
	let formHasChanges = $derived.by(() => {
		if (!item) return false;

		const nameMatch = formName.trim() === item.name;
		const descriptionMatch = formDescriptionHtml === item.description_html;
		const classIdMatch = formClassId === item.class_id;

		// Compare cards (deep comparison)
		const foundationMatch =
			JSON.stringify(item.foundation_card) === JSON.stringify(item.foundation_card);
		const specializationMatch =
			JSON.stringify(item.specialization_card) === JSON.stringify(item.specialization_card);
		const masteryMatch =
			JSON.stringify(item.mastery_card) === JSON.stringify(item.mastery_card);

		return !(
			nameMatch &&
			descriptionMatch &&
			classIdMatch &&
			foundationMatch &&
			specializationMatch &&
			masteryMatch
		);
	});

	// Sync hasChanges to bindable prop
	$effect(() => {
		hasChanges = formHasChanges;
	});

	// Sync form state when item prop changes
	$effect(() => {
		if (item) {
			formName = item.name;
			formDescriptionHtml = item.description_html;
			formClassId = item.class_id;
			// Clear errors when subclass changes
			errors = {};
		}
	});

	function buildFormData() {
		return {
			name: formName.trim(),
			description_html: formDescriptionHtml,
			class_id: formClassId,
			foundation_card: item.foundation_card,
			specialization_card: item.specialization_card,
			mastery_card: item.mastery_card
		};
	}

	export async function handleSubmit(e?: SubmitEvent) {
		if (e) {
			e.preventDefault();
		}
		if (!item) return;

		// Clear previous errors
		errors = {};

		// Upload pending images for all cards
		try {
			if (foundationEditor) await foundationEditor.uploadPendingImage();
			if (specializationEditor) await specializationEditor.uploadPendingImage();
			if (masteryEditor) await masteryEditor.uploadPendingImage();
		} catch (error) {
			console.error('Failed to upload image:', error);
			alert('Failed to upload image. Please try again.');
			return;
		}

		// Build form data
		const formData = buildFormData();

		// Validate with Zod
		const result = SubclassFormSchema.safeParse(formData);

		if (!result.success) {
			errors = extractFieldErrors(result.error);
			return;
		}

		// Update the subclass prop with validated form values
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
		// Re-sync form from subclass prop
		formName = item.name;
		formDescriptionHtml = item.description_html;
		formClassId = item.class_id;
		// Clear errors on reset
		errors = {};

		// Call callback if provided
		if (onReset) {
			onReset();
		}
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">
	<!-- Name -->
	<div class="flex flex-col gap-1">
		<label
			for="hb-subclass-name"
			class={cn('text-xs font-medium text-muted-foreground', errors.name && 'text-destructive')}
			>Name</label
		>
		<Input
			id="hb-subclass-name"
			bind:value={formName}
			placeholder="Subclass name"
			aria-invalid={!!errors.name}
		/>
		{#if errors.name}
			<p class="text-xs text-destructive">{errors.name}</p>
		{/if}
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-1">
		<label for="hb-subclass-description" class="text-xs font-medium text-muted-foreground"
			>Description</label
		>
		<Textarea
			id="hb-subclass-description"
			bind:value={formDescriptionHtml}
			placeholder="Subclass description"
			rows={3}
		/>
	</div>

	<!-- Class ID -->
	<div class="flex flex-col gap-1">
		<label
			for="hb-subclass-class-id"
			class={cn('text-xs font-medium text-muted-foreground', errors.class_id && 'text-destructive')}
			>Class</label
		>
		<Select.Root type="single" bind:value={formClassId}>
			<Select.Trigger id="hb-subclass-class-id" class="w-full">
				<p class="truncate">
					{availableClasses.find((c) => c.id === formClassId)?.name || 'Select a class'}
				</p>
			</Select.Trigger>
			<Select.Content>
				{#each availableClasses as cls}
					<Select.Item value={cls.id}>
						{cls.name} ({cls.source === 'homebrew' ? 'Homebrew' : 'Compendium'})
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		{#if errors.class_id}
			<p class="text-xs text-destructive">{errors.class_id}</p>
		{/if}
	</div>

	<!-- Foundation Card -->
	<div class="flex flex-col gap-2">
		<Dropdown
			title={item.foundation_card.title || 'Foundation Card'}
			class={errors.foundation_card ? 'border-destructive' : ''}
		>
			<SubclassCardEditor
				bind:this={foundationEditor}
				bind:card={item.foundation_card}
				cardType="foundation"
				classId={formClassId}
			/>
		</Dropdown>
		{#if errors.foundation_card}
			<p class="text-xs text-destructive">{errors.foundation_card}</p>
		{/if}
	</div>

	<!-- Specialization Card -->
	<div class="flex flex-col gap-2">
		<Dropdown
			title={item.specialization_card.title || 'Specialization Card'}
			class={errors.specialization_card ? 'border-destructive' : ''}
		>
			<SubclassCardEditor
				bind:this={specializationEditor}
				bind:card={item.specialization_card}
				cardType="specialization"
				classId={formClassId}
			/>
		</Dropdown>
		{#if errors.specialization_card}
			<p class="text-xs text-destructive">{errors.specialization_card}</p>
		{/if}
	</div>

	<!-- Mastery Card -->
	<div class="flex flex-col gap-2">
		<Dropdown
			title={item.mastery_card.title || 'Mastery Card'}
			class={errors.mastery_card ? 'border-destructive' : ''}
		>
			<SubclassCardEditor
				bind:this={masteryEditor}
				bind:card={item.mastery_card}
				cardType="mastery"
				classId={formClassId}
			/>
		</Dropdown>
		{#if errors.mastery_card}
			<p class="text-xs text-destructive">{errors.mastery_card}</p>
		{/if}
	</div>

	<!-- Actions -->
	<div class="flex gap-2 pt-2">
		<Button type="submit" size="sm" disabled={!formHasChanges}>Save</Button>
		{#if formHasChanges}
			<Button type="button" size="sm" variant="link" onclick={handleReset}>Discard changes</Button>
		{/if}
	</div>
</form>
