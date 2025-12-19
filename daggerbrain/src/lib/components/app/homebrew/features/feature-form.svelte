<script lang="ts">
	import type { Feature, CharacterModifier, WeaponModifier } from '$lib/types/compendium-types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import HomebrewCharacterModifierEditor from './character-modifier-editor.svelte';
	import HomebrewWeaponModifierEditor from './weapon-modifier-editor.svelte';
	import Plus from '@lucide/svelte/icons/plus';

	let {
		feature = $bindable(),
		onRemove
	}: {
		feature: Feature;
		onRemove?: (() => void) | undefined;
	} = $props();

	function addCharacterModifier() {
		const newModifier: CharacterModifier = {
			behaviour: 'bonus',
			character_conditions: [],
			type: 'flat',
			value: 0,
			target: 'evasion'
		};
		feature = {
			...feature,
			character_modifiers: [...feature.character_modifiers, newModifier]
		};
	}

	function removeCharacterModifier(index: number) {
		feature = {
			...feature,
			character_modifiers: feature.character_modifiers.filter((_, i) => i !== index)
		};
	}

	function addWeaponModifier() {
		const newModifier: WeaponModifier = {
			behaviour: 'bonus',
			character_conditions: [],
			target_weapon: 'all',
			target_stat: 'attack_roll',
			value: 0
		};
		feature = {
			...feature,
			weapon_modifiers: [...feature.weapon_modifiers, newModifier]
		};
	}

	function removeWeaponModifier(index: number) {
		feature = {
			...feature,
			weapon_modifiers: feature.weapon_modifiers.filter((_, i) => i !== index)
		};
	}

	function updateTitle(value: string) {
		feature = { ...feature, title: value };
	}

	function updateDescription(value: string) {
		feature = { ...feature, description_html: value };
	}
</script>

<div class="flex flex-col gap-3">
	<!-- Title -->
	<div class="flex flex-col gap-1">
		<label for="hb-feature-title" class="text-xs font-medium text-muted-foreground">Title</label>
		<Input
			id="hb-feature-title"
			value={feature.title}
			oninput={(e) => updateTitle(e.currentTarget.value)}
			placeholder="Feature title"
		/>
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-1">
		<label for="hb-feature-description" class="text-xs font-medium text-muted-foreground"
			>Description</label
		>
		<Textarea
			id="hb-feature-description"
			value={feature.description_html}
			oninput={(e) => updateDescription(e.currentTarget.value)}
			placeholder="Feature description"
			rows={4}
		/>
	</div>

	<!-- Character Modifiers -->
	<div class="flex flex-col gap-2">
		<Button type="button" size="sm" variant="outline" onclick={addCharacterModifier} class="w-min">
			<Plus class="size-3.5" />
			Add Character Modifier
		</Button>
		{#if feature.character_modifiers.length > 0}
			<div class="flex flex-col gap-2">
				{#each feature.character_modifiers as modifier, index (index)}
					<HomebrewCharacterModifierEditor
						bind:modifier={feature.character_modifiers[index]}
						onRemove={() => removeCharacterModifier(index)}
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
		{#if feature.weapon_modifiers.length > 0}
			<div class="flex flex-col gap-2">
				{#each feature.weapon_modifiers as modifier, index (index)}
					<HomebrewWeaponModifierEditor
						bind:modifier={feature.weapon_modifiers[index]}
						onRemove={() => removeWeaponModifier(index)}
					/>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Delete Feature Button -->
	{#if onRemove}
		<div class="flex justify-end pt-2">
			<Button
				type="button"
				size="sm"
				variant="link"
				onclick={onRemove}
				class="text-destructive"
				title="Remove feature"
			>
				Delete Feature
			</Button>
		</div>
	{/if}
</div>
