<script lang="ts">
	import type {
		DamageTypes,
		Feature,
		Ranges,
		TraitIds,
		Weapon,
		WeaponCategories
	} from '$lib/types/compendium-types';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn, capitalize } from '$lib/utils';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Plus from '@lucide/svelte/icons/plus';
	import DicePicker from '$lib/components/app/dice/dice-picker.svelte';
	import HomebrewFeatureForm from './features/feature-form.svelte';
	import Dropdown from '../leveling/dropdown.svelte';
	import Hand from '@lucide/svelte/icons/hand';
	import {
		WeaponFormSchema,
		FeatureSchema,
		extractFieldErrors,
		type WeaponFormErrors
	} from './form-schemas';
	import { SvelteMap } from 'svelte/reactivity';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';

	let {
		weapon = $bindable(),
		hasChanges = $bindable(),
		onSubmit,
		onReset
	}: {
		weapon: Weapon;
		hasChanges?: boolean;
		onSubmit?: (e: SubmitEvent) => void;
		onReset?: () => void;
	} = $props();

	const homebrew = getHomebrewContext();

	// Form state - initialized from weapon prop
	let formTitle = $state('');
	let formDescriptionHtml = $state('');
	let formTier = $state('');
	let formCategory = $state<WeaponCategories>('Primary');
	let formType = $state<'Physical' | 'Magical'>('Physical');
	let formRange = $state<Ranges>('Melee');
	let formAvailableTraits = $state<TraitIds[]>([]);
	let formDamageTypes = $state<DamageTypes[]>([]);
	let formBurden = $state<'0' | '1' | '2'>('1');
	let formDamageDice = $state('');
	let formDamageBonus = $state('');
	let formAttackRollBonus = $state('');
	let formFeatures = $state<Feature[]>([]);

	// Validation errors state
	let errors = $state<WeaponFormErrors>({});

	// Feature validation state - track which features have errors
	const featureErrors = new SvelteMap<number, boolean>();

	const rangeOptions: Ranges[] = ['Melee', 'Very Close', 'Close', 'Far', 'Very Far'];
	const damageTypeOptions: DamageTypes[] = ['phy', 'mag'];
	const categoryOptions: WeaponCategories[] = ['Primary', 'Secondary'];
	const typeOptions: ('Physical' | 'Magical')[] = ['Physical', 'Magical'];
	const traitOptions: TraitIds[] = [
		'agility',
		'strength',
		'finesse',
		'instinct',
		'presence',
		'knowledge'
	];
	const burdenOptions: ('0' | '1' | '2')[] = ['0', '1', '2'];

	const damageTypeMap: Record<DamageTypes, string> = {
		phy: 'Physical',
		mag: 'Magical'
	};

	// Helper to convert tier to level requirement
	function tierToMinLevel(tier: number): number {
		if (tier === 1) return 1;
		if (tier === 2) return 2;
		if (tier === 3) return 5;
		if (tier === 4) return 8;
		return 1;
	}

	// Helper to convert level requirement to tier
	function levelToTier(level: number): number {
		if (level >= 8) return 4;
		if (level >= 5) return 3;
		if (level >= 2) return 2;
		return 1;
	}

	// Check if form has changes compared to the weapon prop
	let formHasChanges = $derived.by(() => {
		if (!weapon) return false;

		const titleMatch = formTitle.trim() === weapon.title;
		const descriptionMatch = formDescriptionHtml === weapon.description_html;

		// Compare tier/level
		const formLevelRequirement = formTier ? tierToMinLevel(Number(formTier)) : 1;
		const tierMatch = formLevelRequirement === weapon.level_requirement;

		const categoryMatch = formCategory === weapon.category;
		const typeMatch = formType === weapon.type;
		const rangeMatch = formRange === weapon.range;

		// Compare traits
		const sortedFormTraits = [...formAvailableTraits].sort();
		const sortedWeaponTraits = [...weapon.available_traits].sort();
		const traitsMatch = JSON.stringify(sortedFormTraits) === JSON.stringify(sortedWeaponTraits);

		// Compare damage types
		const sortedFormDamageTypes = [...formDamageTypes].sort();
		const sortedWeaponDamageTypes = [...weapon.available_damage_types].sort();
		const damageTypesMatch =
			JSON.stringify(sortedFormDamageTypes) === JSON.stringify(sortedWeaponDamageTypes);

		const burdenMatch = Number(formBurden) === weapon.burden;
		const damageDiceMatch = formDamageDice === weapon.damage_dice;

		const formDamageBonusNum = formDamageBonus === '' ? 0 : Number(formDamageBonus);
		const damageBonusMatch = formDamageBonusNum === weapon.damage_bonus;

		const formAttackRollBonusNum = formAttackRollBonus === '' ? 0 : Number(formAttackRollBonus);
		const attackRollBonusMatch = formAttackRollBonusNum === weapon.attack_roll_bonus;

		// Compare features (deep comparison)
		const featuresMatch = JSON.stringify(formFeatures) === JSON.stringify(weapon.features);

		return !(
			titleMatch &&
			descriptionMatch &&
			tierMatch &&
			categoryMatch &&
			typeMatch &&
			rangeMatch &&
			traitsMatch &&
			damageTypesMatch &&
			burdenMatch &&
			damageDiceMatch &&
			damageBonusMatch &&
			attackRollBonusMatch &&
			featuresMatch
		);
	});

	// Sync hasChanges to bindable prop
	$effect(() => {
		hasChanges = formHasChanges;
	});

	// Sync form state when weapon prop changes
	$effect(() => {
		if (weapon) {
			formTitle = weapon.title;
			formDescriptionHtml = weapon.description_html;
			formTier = String(levelToTier(weapon.level_requirement));
			formCategory = weapon.category;
			formType = weapon.type;
			formRange = weapon.range;
			formAvailableTraits = [...weapon.available_traits];
			formDamageTypes = [...weapon.available_damage_types];
			formBurden = String(weapon.burden) as '0' | '1' | '2';
			formDamageDice = weapon.damage_dice;
			formDamageBonus = weapon.damage_bonus === 0 ? '' : String(weapon.damage_bonus);
			formAttackRollBonus = weapon.attack_roll_bonus === 0 ? '' : String(weapon.attack_roll_bonus);
			formFeatures = JSON.parse(JSON.stringify(weapon.features));
			// Clear errors when weapon changes
			errors = {};
			featureErrors.clear();
		}
	});

	function buildFormData() {
		return {
			title: formTitle.trim(),
			description_html: formDescriptionHtml,
			level_requirement: formTier ? tierToMinLevel(Number(formTier)) : 1,
			category: formCategory,
			type: formType,
			range: formRange,
			available_traits: [...formAvailableTraits],
			available_damage_types: [...formDamageTypes],
			burden: Number(formBurden) as 0 | 1 | 2,
			damage_dice: formDamageDice,
			damage_bonus: formDamageBonus === '' ? 0 : Number(formDamageBonus),
			attack_roll_bonus: formAttackRollBonus === '' ? 0 : Number(formAttackRollBonus),
			features: JSON.parse(JSON.stringify(formFeatures))
		};
	}

	export function handleSubmit(e?: SubmitEvent) {
		if (e) {
			e.preventDefault();
		}
		if (!weapon) return;

		// Clear previous errors
		errors = {};
		featureErrors.clear();

		// Validate all features directly
		let allFeaturesValid = true;
		for (let i = 0; i < formFeatures.length; i++) {
			const result = FeatureSchema.safeParse(formFeatures[i]);
			if (!result.success) {
				allFeaturesValid = false;
				featureErrors.set(i, true);
			}
		}

		// Build form data
		const formData = buildFormData();

		// Validate with Zod
		const result = WeaponFormSchema.safeParse(formData);

		if (!result.success) {
			errors = extractFieldErrors(result.error);
			return;
		}

		if (!allFeaturesValid) {
			errors = { ...errors, features: 'One or more features have validation errors' };
			return;
		}

		// Update the weapon prop with validated form values
		weapon = {
			...weapon,
			...result.data
		};

		// Clear errors on success
		errors = {};
		featureErrors.clear();

		// Call callback if provided
		if (onSubmit && e) {
			onSubmit(e);
		}
	}

	export function handleReset() {
		if (!weapon) return;
		// Re-sync form from weapon prop
		formTitle = weapon.title;
		formDescriptionHtml = weapon.description_html;
		formTier = String(levelToTier(weapon.level_requirement));
		formCategory = weapon.category;
		formType = weapon.type;
		formRange = weapon.range;
		formAvailableTraits = [...weapon.available_traits];
		formDamageTypes = [...weapon.available_damage_types];
		formBurden = String(weapon.burden) as '0' | '1' | '2';
		formDamageDice = weapon.damage_dice;
		formDamageBonus = weapon.damage_bonus === 0 ? '' : String(weapon.damage_bonus);
		formAttackRollBonus = weapon.attack_roll_bonus === 0 ? '' : String(weapon.attack_roll_bonus);
		formFeatures = JSON.parse(JSON.stringify(weapon.features));
		// Clear errors on reset
		errors = {};
		featureErrors.clear();

		// Call callback if provided
		if (onReset) {
			onReset();
		}
	}

	function toggleTrait(trait: TraitIds) {
		if (formAvailableTraits.includes(trait)) {
			formAvailableTraits = formAvailableTraits.filter((t) => t !== trait);
		} else {
			formAvailableTraits = [...formAvailableTraits, trait];
		}
		// Clear trait error when user makes a selection
		if (errors.available_traits) {
			errors = { ...errors, available_traits: undefined };
		}
	}

	function toggleDamageType(type: DamageTypes) {
		if (formDamageTypes.includes(type)) {
			formDamageTypes = formDamageTypes.filter((t) => t !== type);
		} else {
			formDamageTypes = [...formDamageTypes, type];
		}
		// Clear damage type error when user makes a selection
		if (errors.available_damage_types) {
			errors = { ...errors, available_damage_types: undefined };
		}
	}

	function addFeature() {
		const newFeature: Feature = {
			title: '',
			description_html: '',
			character_modifiers: [],
			weapon_modifiers: []
		};
		formFeatures = [...formFeatures, newFeature];
	}

	function removeFeature(index: number) {
		formFeatures = formFeatures.filter((_, i) => i !== index);
		// Clean up errors and re-index for items after the removed one
		featureErrors.delete(index);

		// Collect entries that need re-indexing
		const errorsToReindex: [number, boolean][] = [];
		for (const [i, hasError] of featureErrors) {
			if (i > index) {
				errorsToReindex.push([i, hasError]);
			}
		}

		// Delete old keys and set new ones
		for (const [i] of errorsToReindex) {
			featureErrors.delete(i);
		}
		for (const [i, hasError] of errorsToReindex) {
			featureErrors.set(i - 1, hasError);
		}
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">
	<!-- Title -->
	<div class="flex flex-col gap-1">
		<label for="hb-weapon-title" class="text-xs font-medium text-muted-foreground">Name</label>
		<Input
			id="hb-weapon-title"
			bind:value={formTitle}
			placeholder="Weapon name"
			aria-invalid={!!errors.title}
		/>
		{#if errors.title}
			<p class="text-xs text-destructive">{errors.title}</p>
		{/if}
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-1">
		<label for="hb-weapon-description" class="text-xs font-medium text-muted-foreground"
			>Description</label
		>
		<Textarea
			id="hb-weapon-description"
			bind:value={formDescriptionHtml}
			placeholder="Weapon description"
			rows={3}
		/>
	</div>

	<!-- Category & Tier Row -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-category" class="text-xs font-medium text-muted-foreground"
				>Category</label
			>
			<Select.Root type="single" bind:value={formCategory}>
				<Select.Trigger id="hb-weapon-category" class="w-full">
					<p class="truncate">{formCategory}</p>
				</Select.Trigger>
				<Select.Content>
					{#each categoryOptions as category}
						<Select.Item value={category}>{category}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-tier" class="text-xs font-medium text-muted-foreground">Tier</label>
			<Select.Root type="single" bind:value={formTier}>
				<Select.Trigger id="hb-weapon-tier" class="w-full">
					<p class="truncate">{formTier || 'Select tier'}</p>
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="1">1</Select.Item>
					<Select.Item value="2">2</Select.Item>
					<Select.Item value="3">3</Select.Item>
					<Select.Item value="4">4</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<!-- Burden & Range Row -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-burden" class="text-xs font-medium text-muted-foreground">Burden</label>
			<Select.Root type="single" bind:value={formBurden}>
				<Select.Trigger id="hb-weapon-burden" class="w-full">
					<p class="truncate">{formBurden}</p>
					<Hand class="mr-auto" />
				</Select.Trigger>
				<Select.Content>
					{#each burdenOptions as burden}
						<Select.Item value={burden}>{burden}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-range" class="text-xs font-medium text-muted-foreground">Range</label>
			<Select.Root type="single" bind:value={formRange}>
				<Select.Trigger id="hb-weapon-range" class="w-full">
					<p class="truncate">{formRange}</p>
				</Select.Trigger>
				<Select.Content>
					{#each rangeOptions as range}
						<Select.Item value={range}>{range}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<!-- Available Traits -->
	<div class="flex flex-col gap-2">
		<p class={cn('text-xs font-medium text-muted-foreground', errors.available_traits && 'text-destructive')}>
			Weapon Trait
		</p>
		<div class="flex flex-wrap gap-3">
			{#each traitOptions as trait}
				<label class="flex items-center gap-2 text-xs">
					<input
						type="checkbox"
						checked={formAvailableTraits.includes(trait)}
						onchange={() => toggleTrait(trait)}
						class="accent-accent"
					/>
					{capitalize(trait)}
				</label>
			{/each}
		</div>
		{#if errors.available_traits}
			<p class="text-xs text-destructive">{errors.available_traits}</p>
		{/if}
	</div>

	<!-- Damage Type & Weapon Type Row -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-2">
			<p class={cn('text-xs font-medium text-muted-foreground', errors.available_damage_types && 'text-destructive')}>
				Damage Type
			</p>
			<div class="flex gap-4">
				{#each damageTypeOptions as type}
					<label class="flex items-center gap-2 text-xs">
						<input
							type="checkbox"
							checked={formDamageTypes.includes(type)}
							onchange={() => toggleDamageType(type)}
							class="accent-accent"
						/>
						{damageTypeMap[type]}
					</label>
				{/each}
			</div>
			{#if errors.available_damage_types}
				<p class="text-xs text-destructive">{errors.available_damage_types}</p>
			{/if}
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-type" class="text-xs font-medium text-muted-foreground"
				>Weapon Type</label
			>
			<Select.Root type="single" bind:value={formType}>
				<Select.Trigger id="hb-weapon-type" class="w-full">
					<p class="truncate">{formType}</p>
				</Select.Trigger>
				<Select.Content>
					{#each typeOptions as type}
						<Select.Item value={type}>{type}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<!-- Damage Dice -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<label for="hb-weapon-damage-dice" class="text-xs font-medium text-muted-foreground"
					>Damage Dice</label
				>
				{#if formDamageDice}
					<span class="text-xs text-muted-foreground">({formDamageDice})</span>
				{/if}
			</div>
			<button
				type="button"
				disabled={formDamageDice === ''}
				class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:hidden"
				onclick={() => (formDamageDice = '')}
				title="Reset damage dice"
			>
				Reset
				<RotateCcw class="size-3.5" />
			</button>
		</div>
		<DicePicker value={formDamageDice} onChange={(v) => (formDamageDice = v)} />
	</div>

	<!-- Damage Bonus & Attack Roll Bonus Row -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-damage-bonus" class="text-xs font-medium text-muted-foreground"
				>Damage Bonus</label
			>
			<Input
				id="hb-weapon-damage-bonus"
				type="number"
				inputmode="numeric"
				bind:value={formDamageBonus}
				placeholder="0"
			/>
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-attack-roll-bonus" class="text-xs font-medium text-muted-foreground"
				>Attack Roll Bonus</label
			>
			<Input
				id="hb-weapon-attack-roll-bonus"
				type="number"
				inputmode="numeric"
				bind:value={formAttackRollBonus}
				placeholder="0"
			/>
		</div>
	</div>

	<!-- Features -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class={cn('text-xs font-medium text-muted-foreground', errors.features && 'text-destructive')}>
				Features
			</p>
			<Button type="button" size="sm" variant="outline" onclick={addFeature}>
				<Plus class="size-3.5" />
				Add Feature
			</Button>
		</div>
		{#if errors.features}
			<p class="text-xs text-destructive">{errors.features}</p>
		{/if}
		<div class="flex flex-col gap-2">
			{#each formFeatures as feature, index (index)}
				<Dropdown
					title={feature.title || `Unnamed feature`}
					class={featureErrors.get(index) ? 'border-destructive' : ''}
				>
					<HomebrewFeatureForm
						bind:feature={formFeatures[index]}
						onRemove={() => removeFeature(index)}
					/>
				</Dropdown>
			{:else}
				<p class="text-xs italic text-muted-foreground">No features added</p>
			{/each}
		</div>
	</div>

	<!-- Actions -->
	<div class="flex gap-2 pt-2">
		<Button type="submit" size="sm" disabled={!formHasChanges}>Save</Button>
		{#if formHasChanges}
			<Button type="button" size="sm" variant="link" onclick={handleReset}>
				<RotateCcw class="size-3.5" />
				Discard
			</Button>
		{/if}
	</div>
</form>
