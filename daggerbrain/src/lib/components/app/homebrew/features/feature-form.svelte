<script lang="ts">
	import type {
		Feature,
		CharacterModifier,
		WeaponModifier,
		DomainCardChoice,
		AncestryCardChoice
	} from '@shared/types/compendium.types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import HomebrewCharacterModifierEditor from './character-modifier-editor.svelte';
	import HomebrewWeaponModifierEditor from './weapon-modifier-editor.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import { cn } from '$lib/utils';

	let {
		feature = $bindable(),
		onRemove,
		errors,
		domainCardChoices = $bindable(),
		domainCardId,
		ancestryCardChoices = $bindable(),
		ancestryCardId
	}: {
		feature: Feature;
		onRemove?: (() => void) | undefined;
		errors?: {
			character_modifiers?: Map<number, string[]>;
			weapon_modifiers?: Map<number, string[]>;
			title?: string;
			description_html?: string;
		};
		domainCardChoices?: DomainCardChoice[];
		domainCardId?: string;
		ancestryCardChoices?: AncestryCardChoice[];
		ancestryCardId?: string;
	} = $props();

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
		<label
			for="hb-feature-title"
			class={cn('text-xs font-medium text-muted-foreground', errors?.title && 'text-destructive')}
		>
			Name
			{domainCardId && '(optional)'}
		</label>
		<Input
			id="hb-feature-title"
			value={feature.title}
			oninput={(e) => updateTitle(e.currentTarget.value)}
			placeholder="Feature name"
			class={errors?.title ? 'border-destructive' : ''}
		/>
		{#if errors?.title}
			<p class="text-xs text-destructive">{errors.title}</p>
		{/if}
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-1">
		<label
			for="hb-feature-description"
			class={cn(
				'text-xs font-medium text-muted-foreground',
				errors?.description_html && 'text-destructive'
			)}>Description</label
		>
		<Textarea
			id="hb-feature-description"
			value={feature.description_html}
			oninput={(e) => updateDescription(e.currentTarget.value)}
			placeholder="Feature description"
			rows={4}
			class={errors?.description_html ? 'border-destructive' : ''}
		/>
		{#if errors?.description_html}
			<p class="text-xs text-destructive">{errors.description_html}</p>
		{/if}
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
						errors={errors?.character_modifiers?.get(index)}
						bind:domainCardChoices
						{domainCardId}
						bind:ancestryCardChoices
						{ancestryCardId}
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
						errors={errors?.weapon_modifiers?.get(index)}
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
