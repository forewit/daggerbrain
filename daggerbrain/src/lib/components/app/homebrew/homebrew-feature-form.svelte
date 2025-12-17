<script lang="ts">
	import type { Feature, CharacterModifier, WeaponModifier } from '$lib/types/compendium-types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import HomebrewCharacterModifierEditor from './homebrew-character-modifier-editor.svelte';
	import HomebrewWeaponModifierEditor from './homebrew-weapon-modifier-editor.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import X from '@lucide/svelte/icons/x';

	let { feature = $bindable() }: { feature: Feature } = $props();

	// Form state - initialized from feature prop
	let formTitle = $state('');
	let formDescriptionHtml = $state('');
	let formCharacterModifiers = $state<CharacterModifier[]>([]);
	let formWeaponModifiers = $state<WeaponModifier[]>([]);

	// Check if form has changes compared to the feature prop
	let hasChanges = $derived.by(() => {
		if (!feature) return false;

		const titleMatch = formTitle.trim() === feature.title;
		const descriptionMatch = formDescriptionHtml === feature.description_html;

		// Compare character modifiers (deep comparison)
		const charModsMatch =
			JSON.stringify(formCharacterModifiers) === JSON.stringify(feature.character_modifiers);

		// Compare weapon modifiers (deep comparison)
		const weaponModsMatch =
			JSON.stringify(formWeaponModifiers) === JSON.stringify(feature.weapon_modifiers);

		return !(titleMatch && descriptionMatch && charModsMatch && weaponModsMatch);
	});

	// Sync form state when feature prop changes
	$effect(() => {
		if (feature) {
			formTitle = feature.title;
			formDescriptionHtml = feature.description_html;
			formCharacterModifiers = JSON.parse(JSON.stringify(feature.character_modifiers));
			formWeaponModifiers = JSON.parse(JSON.stringify(feature.weapon_modifiers));
		}
	});

	function handleSave() {
		if (!feature) return;

		// Update the feature prop with form values
		feature = {
			...feature,
			title: formTitle.trim(),
			description_html: formDescriptionHtml,
			character_modifiers: JSON.parse(JSON.stringify(formCharacterModifiers)),
			weapon_modifiers: JSON.parse(JSON.stringify(formWeaponModifiers))
		};
	}

	function handleReset() {
		if (!feature) return;
		// Re-sync form from feature prop
		formTitle = feature.title;
		formDescriptionHtml = feature.description_html;
		formCharacterModifiers = JSON.parse(JSON.stringify(feature.character_modifiers));
		formWeaponModifiers = JSON.parse(JSON.stringify(feature.weapon_modifiers));
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

<div class="flex flex-col gap-4">
	<!-- Title -->
	<div class="flex flex-col gap-1">
		<label for="hb-feature-title" class="text-xs font-medium text-muted-foreground">Title</label>
		<Input id="hb-feature-title" bind:value={formTitle} placeholder="Feature title" />
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-1">
		<label for="hb-feature-description" class="text-xs font-medium text-muted-foreground"
			>Description</label
		>
		<Textarea
			id="hb-feature-description"
			bind:value={formDescriptionHtml}
			placeholder="Feature description (supports HTML)"
			rows={4}
		/>
	</div>

	<!-- Character Modifiers -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<label class="text-xs font-medium text-muted-foreground">Character Modifiers</label>
			<Button size="sm" variant="outline" onclick={addCharacterModifier}>
				<Plus class="size-3.5" />
				Add Modifier
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each formCharacterModifiers as modifier, index}
				<div class="flex items-start gap-2">
					<div class="flex-1">
						<HomebrewCharacterModifierEditor bind:modifier={modifier} />
					</div>
					<Button
						size="sm"
						variant="ghost"
						onclick={() => removeCharacterModifier(index)}
						class="mt-1"
					>
						<X class="size-4" />
					</Button>
				</div>
			{:else}
				<p class="text-xs text-muted-foreground italic">No character modifiers added</p>
			{/each}
		</div>
	</div>

	<!-- Weapon Modifiers -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<label class="text-xs font-medium text-muted-foreground">Weapon Modifiers</label>
			<Button size="sm" variant="outline" onclick={addWeaponModifier}>
				<Plus class="size-3.5" />
				Add Modifier
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each formWeaponModifiers as modifier, index}
				<div class="flex items-start gap-2">
					<div class="flex-1">
						<HomebrewWeaponModifierEditor bind:modifier={modifier} />
					</div>
					<Button
						size="sm"
						variant="ghost"
						onclick={() => removeWeaponModifier(index)}
						class="mt-1"
					>
						<X class="size-4" />
					</Button>
				</div>
			{:else}
				<p class="text-xs text-muted-foreground italic">No weapon modifiers added</p>
			{/each}
		</div>
	</div>

	<!-- Actions -->
	<div class="flex gap-2 pt-2">
		<Button size="sm" onclick={handleSave} disabled={!hasChanges}>Save</Button>
		{#if hasChanges}
			<Button size="sm" variant="outline" onclick={handleReset}>Reset</Button>
		{/if}
	</div>
</div>
