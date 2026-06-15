<script lang="ts">
	import { BeastformSchema, type Beastform } from '@convex/schemas/compendium';
	import type { DamageType, Range, TraitId } from '@convex/schemas/rules';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import DicePicker from '$lib/components/dice/dice-picker.svelte';
	import FeaturesForm from '../shared/features/form.svelte';
	import { capitalize, cn, level_to_tier, tier_to_min_level } from '$lib/utils';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Plus from '@lucide/svelte/icons/plus';
	import X from '@lucide/svelte/icons/x';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { intProxy, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { tick } from 'svelte';
	import { summarizeSuperformErrors } from '$lib/components/homebrew/forms/helpers';
	import { beastformFormDataToItem, beastformToFormData, normalizeBeastform } from './normalize';
	import { summarizeBeastformFormErrors } from './errors';

	const traitOptions: TraitId[] = [
		'agility',
		'strength',
		'finesse',
		'instinct',
		'presence',
		'knowledge'
	];
	const rangeOptions: Range[] = ['Melee', 'Very Close', 'Close', 'Far', 'Very Far'];
	const damageTypeOptions: DamageType[] = ['phy', 'mag'];
	const damageTypeLabels: Record<DamageType, string> = {
		phy: 'Physical',
		mag: 'Magical'
	};
	const specialCaseOptions = [
		{ value: '', label: 'None' },
		{ value: 'legendary_beast', label: 'Legendary Beast' },
		{ value: 'legendary_hybrid', label: 'Legendary Hybrid' },
		{ value: 'mythic_beast', label: 'Mythic Beast' },
		{ value: 'mythic_hybrid', label: 'Mythic Hybrid' }
	] as const;

	let {
		itemId,
		formId,
		item = $bindable(),
		hasChanges = $bindable(false),
		hasErrors = $bindable(false),
		unsavedItem = $bindable<Beastform | null>(null),
		saving = $bindable(false),
		onSaveSuccess,
		onSaveError
	}: {
		itemId: string;
		formId: string;
		item: Beastform;
		hasChanges?: boolean;
		hasErrors?: boolean;
		unsavedItem?: Beastform | null;
		saving?: boolean;
		onSaveSuccess?: () => void;
		onSaveError?: () => void;
	} = $props();

	const homebrew = getHomebrewContext();
	const beastformForm = superForm<Beastform>(beastformToFormData(item), {
		SPA: true,
		dataType: 'json',
		validators: zod4Client(BeastformSchema),
		resetForm: false,
		taintedMessage: false
	});

	type BeastformSpecialCase = NonNullable<Beastform['special_case']> | '';

	function buildFormData(formData = $form): Beastform {
		return beastformFormDataToItem(formData);
	}

	const { form, allErrors, tainted } = beastformForm;
	const characterTraitBonus = intProxy(beastformForm, 'character_trait.bonus', { empty: 'zero' });
	const evasionBonus = intProxy(beastformForm, 'evasion_bonus', { empty: 'zero' });
	const attackDamageBonus = intProxy(beastformForm, 'attack.damage_bonus', { empty: 'zero' });
	const errorSummary = $derived(summarizeSuperformErrors($allErrors));
	const allErrorMessages = $derived(summarizeBeastformFormErrors(errorSummary));
	const formHasChanges = $derived(Boolean($tainted));
	const tier = $derived(String(level_to_tier($form.level_requirement)));
	const specialCase = $derived(($form.special_case ?? '') as BeastformSpecialCase);
	const titleError = $derived($allErrors.find((error) => error.path === 'title')?.messages[0]);
	const categoryError = $derived(
		$allErrors.find((error) => error.path === 'category')?.messages[0]
	);
	const traitBonusError = $derived(
		$allErrors.find((error) => error.path === 'character_trait.bonus')?.messages[0]
	);
	const evasionBonusError = $derived(
		$allErrors.find((error) => error.path === 'evasion_bonus')?.messages[0]
	);
	const damageDiceError = $derived(
		$allErrors.find((error) => error.path === 'attack.damage_dice')?.messages[0]
	);
	const damageBonusError = $derived(
		$allErrors.find((error) => error.path === 'attack.damage_bonus')?.messages[0]
	);

	function setTier(value: string) {
		$form.level_requirement = tier_to_min_level(Number(value || '1'));
	}

	function setSpecialCase(value: string) {
		$form.special_case = (value || undefined) as Beastform['special_case'];
	}

	$effect(() => {
		beastformForm.reset({ data: beastformToFormData(item) });
		form.update((formData) => formData, { taint: 'untaint-all' });
	});

	$effect(() => {
		hasChanges = formHasChanges;
	});

	$effect(() => {
		hasErrors = $allErrors.length > 0;
	});

	$effect(() => {
		unsavedItem = buildFormData($form);
	});

	function addAdvantage() {
		$form.advantages = [...$form.advantages, ''];
	}

	function updateAdvantage(index: number, value: string) {
		$form.advantages = $form.advantages.map((entry, current) =>
			current === index ? value : entry
		);
	}

	function removeAdvantage(index: number) {
		$form.advantages = $form.advantages.filter((_, current) => current !== index);
	}

	export async function handleSubmit(event?: SubmitEvent) {
		event?.preventDefault();
		saving = true;
		try {
			const validatedForm = await beastformForm.validateForm({ update: true });
			if (!validatedForm.valid) {
				hasErrors = true;
				return;
			}
			const nextItem = normalizeBeastform(buildFormData());
			await homebrew.updateItem({ type: 'beastforms', id: itemId as never, item: nextItem });
			item = nextItem;
			beastformForm.reset({ data: beastformToFormData(nextItem) });
			form.update((formData) => formData, { taint: 'untaint-all' });
			await tick();
			hasErrors = false;
			onSaveSuccess?.();
		} catch (error) {
			onSaveError?.();
			throw error;
		} finally {
			saving = false;
		}
	}

	export function handleReset() {
		beastformForm.reset({ data: beastformToFormData(item) });
		form.update((formData) => formData, { taint: 'untaint-all' });
		hasErrors = false;
	}
</script>

<form id={formId} onsubmit={handleSubmit} onreset={handleReset} class="flex flex-col gap-4">
	<div class="flex flex-col gap-1">
		<label
			class={cn('text-xs font-medium text-muted-foreground', titleError && 'text-destructive')}
			for="beastform-name">Name</label
		>
		<Input
			id="beastform-name"
			bind:value={$form.title}
			placeholder="Beastform name"
			aria-invalid={Boolean(titleError)}
		/>
		<!-- {#if titleError}
			<p class="text-xs text-destructive">{titleError}</p>
		{/if} -->
	</div>

	<div class="flex flex-col gap-1">
		<label
			class={cn('text-xs font-medium text-muted-foreground', categoryError && 'text-destructive')}
			for="beastform-category">Category</label
		>
		<Input
			id="beastform-category"
			bind:value={$form.category}
			placeholder="Fox, Bear, Serpent..."
			aria-invalid={Boolean(categoryError)}
		/>
		<!-- {#if categoryError}
			<p class="text-xs text-destructive">{categoryError}</p>
		{/if} -->
	</div>

	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground" for="beastform-tier">Tier</label>
			<Select.Root type="single" value={tier} onValueChange={(value) => value && setTier(value)}>
				<Select.Trigger id="beastform-tier" class="w-full">
					<p class="truncate">{tier}</p>
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="1">1</Select.Item>
					<Select.Item value="2">2</Select.Item>
					<Select.Item value="3">3</Select.Item>
					<Select.Item value="4">4</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>

		<div class="flex flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground" for="beastform-special-case"
				>Evolved Beast / Hybrid</label
			>
			<Select.Root
				type="single"
				value={specialCase}
				onValueChange={(value) => setSpecialCase(value ?? '')}
			>
				<Select.Trigger id="beastform-special-case" class="w-full">
					<p class="truncate">
						{specialCaseOptions.find((option) => option.value === specialCase)?.label ?? 'None'}
					</p>
				</Select.Trigger>
				<Select.Content>
					{#each specialCaseOptions as option}
						<Select.Item value={option.value}>{option.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground" for="beastform-character-trait"
				>Character Trait</label
			>
			<Select.Root type="single" bind:value={$form.character_trait.trait}>
				<Select.Trigger id="beastform-character-trait" class="w-full">
					<p class="truncate">{capitalize($form.character_trait.trait)}</p>
				</Select.Trigger>
				<Select.Content>
					{#each traitOptions as trait}
						<Select.Item value={trait}>{capitalize(trait)}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="flex flex-col gap-1">
			<label
				class={cn(
					'text-xs font-medium text-muted-foreground',
					traitBonusError && 'text-destructive'
				)}
				for="beastform-character-trait-bonus">Trait Bonus</label
			>
			<Input
				id="beastform-character-trait-bonus"
				type="number"
				inputmode="numeric"
				bind:value={$characterTraitBonus}
				aria-invalid={Boolean(traitBonusError)}
			/>
			<!-- {#if traitBonusError}
				<p class="text-xs text-destructive">{traitBonusError}</p>
			{/if} -->
		</div>
	</div>

	<div class="flex flex-col gap-1">
		<label
			class={cn(
				'text-xs font-medium text-muted-foreground',
				evasionBonusError && 'text-destructive'
			)}
			for="beastform-evasion-bonus">Evasion Bonus</label
		>
		<Input
			id="beastform-evasion-bonus"
			type="number"
			inputmode="numeric"
			bind:value={$evasionBonus}
			aria-invalid={Boolean(evasionBonusError)}
		/>
		<!-- {#if evasionBonusError}
			<p class="text-xs text-destructive">{evasionBonusError}</p>
		{/if} -->
	</div>

	<div class="flex flex-col gap-3 rounded-lg border bg-muted p-3">
		<p class="text-xs font-medium text-muted-foreground">Attack</p>

		<div class="grid grid-cols-2 gap-3">
			<div class="flex flex-col gap-1">
				<label class="text-xs text-muted-foreground" for="beastform-attack-range">Range</label>
				<Select.Root type="single" bind:value={$form.attack.range}>
					<Select.Trigger id="beastform-attack-range" class="w-full">
						<p class="truncate">{$form.attack.range}</p>
					</Select.Trigger>
					<Select.Content>
						{#each rangeOptions as range}
							<Select.Item value={range}>{range}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="flex flex-col gap-1">
				<label class="text-xs text-muted-foreground" for="beastform-attack-trait">Trait</label>
				<Select.Root type="single" bind:value={$form.attack.trait}>
					<Select.Trigger id="beastform-attack-trait" class="w-full">
						<p class="truncate">{capitalize($form.attack.trait)}</p>
					</Select.Trigger>
					<Select.Content>
						{#each traitOptions as trait}
							<Select.Item value={trait}>{capitalize(trait)}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<div class="flex flex-col gap-2">
			<div class="flex items-center justify-between gap-2">
				<div class="flex items-center gap-2 truncate">
					<p
						class={cn(
							'text-xs font-medium text-muted-foreground',
							damageDiceError && 'text-destructive'
						)}
					>
						Damage Dice
					</p>
					{#if $form.attack.damage_dice}
						<span class="truncate text-xs text-muted-foreground">({$form.attack.damage_dice})</span>
					{/if}
				</div>
				<button
					type="button"
					class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:hidden"
					disabled={$form.attack.damage_dice === ''}
					onclick={() => ($form.attack.damage_dice = '')}
				>
					Reset
					<RotateCcw class="size-3.5" />
				</button>
			</div>
			<DicePicker
				value={$form.attack.damage_dice}
				onChange={(value) => ($form.attack.damage_dice = value)}
			/>
			<!-- {#if damageDiceError}
				<p class="text-xs text-destructive">{damageDiceError}</p>
			{/if} -->
		</div>

		<div class="grid grid-cols-2 gap-3">
			<div class="flex flex-col gap-1">
				<label
					class={cn('text-xs text-muted-foreground', damageBonusError && 'text-destructive')}
					for="beastform-damage-bonus">Damage Bonus</label
				>
				<Input
					id="beastform-damage-bonus"
					type="number"
					inputmode="numeric"
					bind:value={$attackDamageBonus}
					aria-invalid={Boolean(damageBonusError)}
				/>
				<!-- {#if damageBonusError}
					<p class="text-xs text-destructive">{damageBonusError}</p>
				{/if} -->
			</div>

			<div class="flex flex-col gap-1">
				<label class="text-xs text-muted-foreground" for="beastform-damage-type">Damage Type</label>
				<Select.Root type="single" bind:value={$form.attack.damage_type}>
					<Select.Trigger id="beastform-damage-type" class="w-full">
						<p class="truncate">{damageTypeLabels[$form.attack.damage_type]}</p>
					</Select.Trigger>
					<Select.Content>
						{#each damageTypeOptions as damageType}
							<Select.Item value={damageType}>{damageTypeLabels[damageType]}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Advantages</p>
			<Button type="button" size="sm" variant="outline" onclick={addAdvantage}>
				<Plus class="size-3.5" />
				Add
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each $form.advantages as advantage, index (index)}
				<div class="flex items-center gap-2">
					<Input
						value={advantage}
						placeholder="Advantage"
						oninput={(event) => updateAdvantage(index, event.currentTarget.value)}
					/>
					<Button
						type="button"
						size="sm"
						variant="ghost"
						class="size-8 p-0"
						onclick={() => removeAdvantage(index)}
					>
						<X class="size-4" />
					</Button>
				</div>
			{:else}
				<p class="text-xs italic text-muted-foreground">No advantages added</p>
			{/each}
		</div>
	</div>

	<FeaturesForm
		bind:features={$form.features}
		allowAddRemove
		featureLabel="Feature"
		{errorSummary}
	/>

	{#if allErrorMessages.length > 0}
		<ul class="list-inside list-disc space-y-1 pt-2">
			{#each allErrorMessages as error}
				<li class="text-xs text-destructive">{error}</li>
			{/each}
		</ul>
	{/if}
</form>
