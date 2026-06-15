<script lang="ts">
	import type { CardOption, Feature } from '@convex/schemas/rules';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Dropdown from '$lib/components/utility/dropdown.svelte';
	import CharacterModifierForm from '../character-modifier/form.svelte';
	import WeaponModifierForm from '../weapon-modifier/form.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import { cn } from '$lib/utils';
	import { emptyCharacterModifier, emptyFeature, emptyWeaponModifier } from './defaults';
	import {
		firstHomebrewErrorAt,
		homebrewHasErrorsBelow,
		type HomebrewErrorSummary,
		type HomebrewErrorPath
	} from '$lib/components/homebrew/forms/helpers';

	let {
		features = $bindable(),
		choiceOptions = $bindable([]),
		choiceSourceId,
		errorSummary,
		path = ['features'],
		allowAddRemove = false,
		featureLabel = 'Feature',
		staticTitles = undefined,
		allowChoiceConditions = false,
		allowExperienceTargets = false
	}: {
		features: Feature[];
		choiceOptions?: CardOption[];
		choiceSourceId?: string;
		errorSummary: HomebrewErrorSummary;
		path?: HomebrewErrorPath;
		allowAddRemove?: boolean;
		featureLabel?: string;
		staticTitles?: string[];
		allowChoiceConditions?: boolean;
		allowExperienceTargets?: boolean;
	} = $props();

	function featurePath(featureIndex: number, ...suffix: HomebrewErrorPath): HomebrewErrorPath {
		return [...path, featureIndex, ...suffix];
	}

	function addCharacterModifier(featureIndex: number) {
		const modifier = emptyCharacterModifier();

		features = features.map((feature, index) =>
			index === featureIndex
				? { ...feature, character_modifiers: [...feature.character_modifiers, modifier] }
				: feature
		);
	}

	function removeCharacterModifier(featureIndex: number, modifierIndex: number) {
		features = features.map((feature, index) =>
			index === featureIndex
				? {
						...feature,
						character_modifiers: feature.character_modifiers.filter(
							(_, current) => current !== modifierIndex
						)
					}
				: feature
		);
	}

	function updateCharacterModifier(
		featureIndex: number,
		modifierIndex: number,
		modifier: Feature['character_modifiers'][number]
	) {
		features = features.map((feature, index) =>
			index === featureIndex
				? {
						...feature,
						character_modifiers: feature.character_modifiers.map((current, currentIndex) =>
							currentIndex === modifierIndex ? modifier : current
						)
					}
				: feature
		);
	}

	function addWeaponModifier(featureIndex: number) {
		const modifier = emptyWeaponModifier();

		features = features.map((feature, index) =>
			index === featureIndex
				? { ...feature, weapon_modifiers: [...feature.weapon_modifiers, modifier] }
				: feature
		);
	}

	function removeWeaponModifier(featureIndex: number, modifierIndex: number) {
		features = features.map((feature, index) =>
			index === featureIndex
				? {
						...feature,
						weapon_modifiers: feature.weapon_modifiers.filter(
							(_, current) => current !== modifierIndex
						)
					}
				: feature
		);
	}

	function updateWeaponModifier(
		featureIndex: number,
		modifierIndex: number,
		modifier: Feature['weapon_modifiers'][number]
	) {
		features = features.map((feature, index) =>
			index === featureIndex
				? {
						...feature,
						weapon_modifiers: feature.weapon_modifiers.map((current, currentIndex) =>
							currentIndex === modifierIndex ? modifier : current
						)
					}
				: feature
		);
	}

	function updateFeatureField(
		featureIndex: number,
		field: 'title' | 'description_html',
		value: string
	) {
		features = features.map((feature, index) =>
			index === featureIndex ? { ...feature, [field]: value } : feature
		);
	}

	function addFeature() {
		features = [...features, emptyFeature()];
	}

	function removeFeature(featureIndex: number) {
		features = features.filter((_, index) => index !== featureIndex);
	}
</script>

<div class="flex flex-col gap-2">
	<div class="flex items-center justify-between gap-2">
		<p class="text-xs font-medium text-muted-foreground">Features</p>
		{#if allowAddRemove}
			<Button type="button" size="sm" variant="outline" onclick={addFeature}>
				<Plus class="size-3.5" />
				Add {featureLabel}
			</Button>
		{/if}
	</div>
	<div class="flex flex-col gap-2">
		{#each features as feature, featureIndex (featureIndex)}
			{@const hasErrors = homebrewHasErrorsBelow(errorSummary, featurePath(featureIndex))}
			{@const titleError = firstHomebrewErrorAt(errorSummary, featurePath(featureIndex, 'title'))}
			{@const descriptionError = firstHomebrewErrorAt(
				errorSummary,
				featurePath(featureIndex, 'description_html')
			)}
			<Dropdown
				title={staticTitles?.[featureIndex] ??
					(allowAddRemove
						? feature.title || `Unnamed ${featureLabel}`
						: featureIndex === 0
							? 'Top Feature'
							: 'Bottom Feature')}
				class={hasErrors ? 'data-[open=false]:border data-[open=false]:border-destructive' : ''}
			>
				<div class="flex flex-col gap-3">
					<div class="flex flex-col gap-1">
						<label
							for={`feature-name-${featureIndex}`}
							class={cn(
								'text-xs font-medium text-muted-foreground',
								titleError && 'text-destructive'
							)}
						>
							Name
						</label>
						<Input
							id={`feature-name-${featureIndex}`}
							value={feature.title}
							placeholder="Feature name"
							class={titleError ? 'border-destructive' : ''}
							oninput={(event) =>
								updateFeatureField(featureIndex, 'title', event.currentTarget.value)}
						/>
					</div>

					<div class="flex flex-col gap-1">
						<label
							for={`feature-description-${featureIndex}`}
							class={cn(
								'text-xs font-medium text-muted-foreground',
								descriptionError && 'text-destructive'
							)}
						>
							Description
						</label>
						<Textarea
							id={`feature-description-${featureIndex}`}
							rows={4}
							value={feature.description_html}
							placeholder="Feature description"
							class={descriptionError ? 'border-destructive' : ''}
							oninput={(event) =>
								updateFeatureField(featureIndex, 'description_html', event.currentTarget.value)}
						/>
					</div>

					<div class="flex flex-col gap-2">
						<Button
							type="button"
							size="sm"
							variant="outline"
							class="w-min"
							onclick={() => addCharacterModifier(featureIndex)}
						>
							<Plus class="size-3.5" />
							Add Character Modifier
						</Button>
						{#if feature.character_modifiers.length > 0}
							<div class="flex flex-col gap-2">
								{#each feature.character_modifiers as modifier, modifierIndex (modifierIndex)}
									<CharacterModifierForm
										bind:modifier={
											() => modifier,
											(value) => updateCharacterModifier(featureIndex, modifierIndex, value)
										}
										bind:choiceOptions
										{choiceSourceId}
										{allowChoiceConditions}
										{allowExperienceTargets}
										{errorSummary}
										path={featurePath(featureIndex, 'character_modifiers', modifierIndex)}
										onRemove={() => removeCharacterModifier(featureIndex, modifierIndex)}
									/>
								{/each}
							</div>
						{/if}
					</div>

					<div class="flex flex-col gap-2">
						<Button
							type="button"
							size="sm"
							variant="outline"
							class="w-min"
							onclick={() => addWeaponModifier(featureIndex)}
						>
							<Plus class="size-3.5" />
							Add Weapon Modifier
						</Button>
						{#if feature.weapon_modifiers.length > 0}
							<div class="flex flex-col gap-2">
								{#each feature.weapon_modifiers as modifier, modifierIndex (modifierIndex)}
									<WeaponModifierForm
										bind:modifier={
											() => modifier,
											(value) => updateWeaponModifier(featureIndex, modifierIndex, value)
										}
										bind:choiceOptions
										{choiceSourceId}
										{allowChoiceConditions}
										{errorSummary}
										path={featurePath(featureIndex, 'weapon_modifiers', modifierIndex)}
										onRemove={() => removeWeaponModifier(featureIndex, modifierIndex)}
									/>
								{/each}
							</div>
						{/if}
					</div>

					{#if allowAddRemove}
						<div class="flex justify-end">
							<Button
								type="button"
								size="sm"
								variant="link"
								class="text-destructive"
								onclick={() => removeFeature(featureIndex)}
							>
								Delete {featureLabel}
							</Button>
						</div>
					{/if}
				</div>
			</Dropdown>
		{:else}
			<p class="text-xs italic text-muted-foreground">No features added</p>
		{/each}
	</div>
</div>
