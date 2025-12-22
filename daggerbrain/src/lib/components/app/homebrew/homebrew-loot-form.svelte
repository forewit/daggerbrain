<script lang="ts">
	import type { Loot, CharacterModifier, WeaponModifier } from '$lib/types/compendium-types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import HomebrewCharacterModifierEditor from './features/character-modifier-editor.svelte';
	import HomebrewWeaponModifierEditor from './features/weapon-modifier-editor.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import Dropdown from '../leveling/dropdown.svelte';
	import {
		LootFormSchema,
		extractFieldErrors,
		type LootFormErrors
	} from './form-schemas';

	let { loot = $bindable() }: { loot: Loot } = $props();

	// Form state - initialized from loot prop
	let formTitle = $state('');
	let formDescriptionHtml = $state('');
	let formCharacterModifiers = $state<CharacterModifier[]>([]);
	let formWeaponModifiers = $state<WeaponModifier[]>([]);

	// Validation errors state
	let errors = $state<LootFormErrors>({});

	// Check if form has changes compared to the loot prop
	let hasChanges = $derived.by(() => {
		if (!loot) return false;

		const titleMatch = formTitle.trim() === loot.title;
		const descriptionMatch = formDescriptionHtml === loot.description_html;

		// Compare modifiers (deep comparison)
		const characterModifiersMatch =
			JSON.stringify(formCharacterModifiers) === JSON.stringify(loot.character_modifiers);
		const weaponModifiersMatch =
			JSON.stringify(formWeaponModifiers) === JSON.stringify(loot.weapon_modifiers);

		return !(titleMatch && descriptionMatch && characterModifiersMatch && weaponModifiersMatch);
	});

	// Sync form state when loot prop changes
	$effect(() => {
		if (loot) {
			formTitle = loot.title;
			formDescriptionHtml = loot.description_html;
			formCharacterModifiers = JSON.parse(JSON.stringify(loot.character_modifiers));
			formWeaponModifiers = JSON.parse(JSON.stringify(loot.weapon_modifiers));
			// Clear errors when loot changes
			errors = {};
		}
	});

	function buildFormData() {
		return {
			title: formTitle.trim(),
			description_html: formDescriptionHtml,
			rarity_roll: loot?.rarity_roll ?? 1,
			character_modifiers: JSON.parse(JSON.stringify(formCharacterModifiers)),
			weapon_modifiers: JSON.parse(JSON.stringify(formWeaponModifiers))
		};
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!loot) return;

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
		loot = {
			...loot,
			...result.data
		};

		// Clear errors on success
		errors = {};
	}

	function handleReset() {
		if (!loot) return;
		// Re-sync form from loot prop
		formTitle = loot.title;
		formDescriptionHtml = loot.description_html;
		formCharacterModifiers = JSON.parse(JSON.stringify(loot.character_modifiers));
		formWeaponModifiers = JSON.parse(JSON.stringify(loot.weapon_modifiers));
		// Clear errors on reset
		errors = {};
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
		<Button type="submit" size="sm" disabled={!hasChanges}>Save</Button>
		{#if hasChanges}
			<Button type="button" size="sm" variant="link" onclick={handleReset}>Discard changes</Button>
		{/if}
	</div>
</form>
