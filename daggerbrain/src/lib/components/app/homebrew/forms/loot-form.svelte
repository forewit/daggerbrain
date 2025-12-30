<script lang="ts">
	import type { Loot, CharacterModifier, WeaponModifier } from '$lib/types/compendium-types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import HomebrewCharacterModifierEditor from '../features/character-modifier-editor.svelte';
	import HomebrewWeaponModifierEditor from '../features/weapon-modifier-editor.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import Dropdown from '../../leveling/dropdown.svelte';
	import { LootFormSchema, extractFieldErrors, type LootFormErrors } from '../form-schemas';
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

	// Check if there are validation errors
	let hasValidationErrors = $derived.by(() => {
		return Object.keys(errors).length > 0;
	});

	// Sync hasValidationErrors to bindable prop
	$effect(() => {
		hasErrors = hasValidationErrors;
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
		const result = LootFormSchema.safeParse(formData);

		if (!result.success) {
			errors = extractFieldErrors(result.error);
			return;
		}

		// Update the loot prop with validated form values
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
		// Re-sync form from loot prop
		formTitle = item.title;
		formDescriptionHtml = item.description_html;
		formCharacterModifiers = JSON.parse(JSON.stringify(item.character_modifiers));
		formWeaponModifiers = JSON.parse(JSON.stringify(item.weapon_modifiers));
		// Clear errors on reset
		errors = {};

		// Call callback if provided
		if (onReset) {
			onReset();
		}
	}

	function addCharacterModifier() {
		const newModifier: CharacterModifier = {
			behaviour: 'bonus',
			character_conditions: [],
			type: 'flat',
			value: 0,
			target: 'evasion'
		};
		formCharacterModifiers = [...formCharacterModifiers, newModifier];
	}

	function removeCharacterModifier(index: number) {
		formCharacterModifiers = formCharacterModifiers.filter((_, i) => i !== index);
	}

	function addWeaponModifier() {
		const newModifier: WeaponModifier = {
			behaviour: 'bonus',
			character_conditions: [],
			target_weapon: 'all',
			target_stat: 'attack_roll',
			value: 0
		};
		formWeaponModifiers = [...formWeaponModifiers, newModifier];
	}

	function removeWeaponModifier(index: number) {
		formWeaponModifiers = formWeaponModifiers.filter((_, i) => i !== index);
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
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Character Modifiers</p>
			<Button type="button" size="sm" variant="outline" onclick={addCharacterModifier}>
				<Plus class="size-3.5" />
				Add Character Modifier
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each formCharacterModifiers as modifier, index (index)}
				<Dropdown title={`Character Modifier ${index + 1}`}>
					<HomebrewCharacterModifierEditor
						bind:modifier={formCharacterModifiers[index]}
						onRemove={() => removeCharacterModifier(index)}
					/>
				</Dropdown>
			{:else}
				<p class="text-xs italic text-muted-foreground">No character modifiers added</p>
			{/each}
		</div>
	</div>

	<!-- Weapon Modifiers -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Weapon Modifiers</p>
			<Button type="button" size="sm" variant="outline" onclick={addWeaponModifier}>
				<Plus class="size-3.5" />
				Add Weapon Modifier
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each formWeaponModifiers as modifier, index (index)}
				<Dropdown title={`Weapon Modifier ${index + 1}`}>
					<HomebrewWeaponModifierEditor
						bind:modifier={formWeaponModifiers[index]}
						onRemove={() => removeWeaponModifier(index)}
					/>
				</Dropdown>
			{:else}
				<p class="text-xs italic text-muted-foreground">No weapon modifiers added</p>
			{/each}
		</div>
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
