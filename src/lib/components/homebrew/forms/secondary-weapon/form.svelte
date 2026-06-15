<script lang="ts">
	import { SecondaryWeaponSchema, type SecondaryWeapon } from '@convex/schemas/compendium';
	import type { DamageType, Range, TraitId, WeaponType } from '@convex/schemas/rules';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import DicePicker from '$lib/components/dice/dice-picker.svelte';
	import FeaturesForm from '../shared/features/form.svelte';
	import { capitalize, cn, level_to_tier, tier_to_min_level } from '$lib/utils';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { superForm, intProxy } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { get } from 'svelte/store';
	import { tick } from 'svelte';
	import { summarizeSuperformErrors } from '$lib/components/homebrew/forms/helpers';
	import {
		normalizeSecondaryWeapon,
		secondaryWeaponFormDataToItem,
		secondaryWeaponToFormData
	} from './normalize';
	import { summarizeSecondaryWeaponFormErrors } from './errors';

	const rangeOptions: Range[] = ['Melee', 'Very Close', 'Close', 'Far', 'Very Far'];
	const damageTypeOptions: DamageType[] = ['phy', 'mag'];
	const weaponTypeOptions: WeaponType[] = ['Physical', 'Magical'];
	const traitOptions: TraitId[] = [
		'agility',
		'strength',
		'finesse',
		'instinct',
		'presence',
		'knowledge'
	];
	const damageTypeLabels: Record<DamageType, string> = { phy: 'Physical', mag: 'Magical' };

	let {
		itemId,
		formId,
		item = $bindable(),
		hasChanges = $bindable(false),
		hasErrors = $bindable(false),
		unsavedItem = $bindable<SecondaryWeapon | null>(null),
		saving = $bindable(false),
		onSaveSuccess,
		onSaveError
	}: {
		itemId: string;
		formId: string;
		item: SecondaryWeapon;
		hasChanges?: boolean;
		hasErrors?: boolean;
		unsavedItem?: SecondaryWeapon | null;
		saving?: boolean;
		onSaveSuccess?: () => void;
		onSaveError?: () => void;
	} = $props();

	const homebrew = getHomebrewContext();
	const weaponForm = superForm<SecondaryWeapon>(secondaryWeaponToFormData(item), {
		SPA: true,
		dataType: 'json',
		validators: zod4Client(SecondaryWeaponSchema),
		async onUpdate({ form: validatedForm }) {
			if (!validatedForm.valid) return;
			await saveWeapon();
		},
		resetForm: false,
		taintedMessage: false
	});

	const { form, errors, allErrors, tainted, enhance } = weaponForm;
	const levelRequirement = intProxy(weaponForm, 'level_requirement', { empty: 'zero' });
	const attackRollBonus = intProxy(weaponForm, 'attack_roll_bonus', { empty: 'zero' });
	const damageBonus = intProxy(weaponForm, 'damage_bonus', { empty: 'zero' });
	const tier = $derived(String(level_to_tier($form.level_requirement)));

	function setTier(value: string) {
		$form.level_requirement = tier_to_min_level(Number(value || '1'));
	}

	function toggleTrait(trait: TraitId) {
		$form.available_traits = $form.available_traits.includes(trait)
			? $form.available_traits.filter((current) => current !== trait)
			: [...$form.available_traits, trait];
	}

	function toggleDamageType(type: DamageType) {
		$form.available_damage_types = $form.available_damage_types.includes(type)
			? $form.available_damage_types.filter((current) => current !== type)
			: [...$form.available_damage_types, type];
	}

	function buildFormData(formData = get(form)): SecondaryWeapon {
		return secondaryWeaponFormDataToItem(formData);
	}

	const errorSummary = $derived(summarizeSuperformErrors($allErrors));
	const errorSummaryMessages = $derived(summarizeSecondaryWeaponFormErrors(errorSummary));
	const formHasChanges = $derived(Boolean($tainted));
	const titleError = $derived($errors.title?.[0]);
	const traitsError = $derived($errors.available_traits?.[0]);
	const damageTypesError = $derived($errors.available_damage_types?.[0]);
	const damageDiceError = $derived($errors.damage_dice?.[0]);

	$effect(() => {
		weaponForm.reset({ data: secondaryWeaponToFormData(item) });
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

	async function saveWeapon() {
		saving = true;
		try {
			const nextItem = normalizeSecondaryWeapon(buildFormData());
			await homebrew.updateItem({ type: 'secondary_weapons', id: itemId as never, item: nextItem });
			item = nextItem;
			weaponForm.reset({ data: secondaryWeaponToFormData(nextItem) });
			form.update((formData) => formData, { taint: 'untaint-all' });
			await tick();
			onSaveSuccess?.();
		} catch (error) {
			onSaveError?.();
			throw error;
		} finally {
			saving = false;
		}
	}

	function handleReset(event?: Event) {
		event?.preventDefault();
		weaponForm.reset({ data: secondaryWeaponToFormData(item) });
		form.update((formData) => formData, { taint: 'untaint-all' });
	}
</script>

<form id={formId} method="POST" use:enhance onreset={handleReset} class="flex flex-col gap-4">
	<div class="flex flex-col gap-1">
		<label
			class={cn('text-xs font-medium text-muted-foreground', titleError && 'text-destructive')}
			for="secondary-weapon-name">Name</label
		>
		<Input
			id="secondary-weapon-name"
			bind:value={$form.title}
			placeholder="Secondary Weapon name"
			aria-invalid={Boolean(titleError)}
		/>
	</div>
	<div class="flex flex-col gap-1">
		<label class="text-xs font-medium text-muted-foreground" for="secondary-weapon-description"
			>Description</label
		>
		<Textarea
			id="secondary-weapon-description"
			bind:value={$form.description_html}
			placeholder="Secondary Weapon description"
			rows={3}
		/>
	</div>
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground" for="secondary-weapon-tier"
				>Tier</label
			>
			<Select.Root type="single" value={tier} onValueChange={(value) => value && setTier(value)}>
				<Select.Trigger id="secondary-weapon-tier" class="w-full"
					><p class="truncate">{tier}</p></Select.Trigger
				>
				<Select.Content>
					{#each ['1', '2', '3', '4'] as option}<Select.Item value={option}>{option}</Select.Item
						>{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground" for="secondary-weapon-type"
				>Weapon Type</label
			>
			<Select.Root type="single" bind:value={$form.type}>
				<Select.Trigger id="secondary-weapon-type" class="w-full"
					><p class="truncate">{$form.type}</p></Select.Trigger
				>
				<Select.Content
					>{#each weaponTypeOptions as option}<Select.Item value={option}>{option}</Select.Item
						>{/each}</Select.Content
				>
			</Select.Root>
		</div>
	</div>
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground" for="secondary-weapon-range"
				>Range</label
			>
			<Select.Root type="single" bind:value={$form.range}>
				<Select.Trigger id="secondary-weapon-range" class="w-full"
					><p class="truncate">{$form.range}</p></Select.Trigger
				>
				<Select.Content
					>{#each rangeOptions as option}<Select.Item value={option}>{option}</Select.Item
						>{/each}</Select.Content
				>
			</Select.Root>
		</div>
		<div class="flex flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground" for="secondary-weapon-burden"
				>Burden</label
			>
			<Select.Root
				type="single"
				value={String($form.burden)}
				onValueChange={(value) => ($form.burden = Number(value) as SecondaryWeapon['burden'])}
			>
				<Select.Trigger id="secondary-weapon-burden" class="w-full"
					><p class="truncate">{$form.burden}</p></Select.Trigger
				>
				<Select.Content
					>{#each ['0', '1', '2'] as option}<Select.Item value={option}>{option}</Select.Item
						>{/each}</Select.Content
				>
			</Select.Root>
		</div>
	</div>
	<div class="flex flex-col gap-2">
		<p class={cn('text-xs font-medium text-muted-foreground', traitsError && 'text-destructive')}>
			Traits
		</p>
		<div class="flex flex-wrap gap-3">
			{#each traitOptions as trait}
				<label class="flex items-center gap-2 text-xs"
					><input
						type="checkbox"
						checked={$form.available_traits.includes(trait)}
						onchange={() => toggleTrait(trait)}
						class="accent-accent"
					/>{capitalize(trait)}</label
				>
			{/each}
		</div>
	</div>
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		<div class="flex flex-col gap-2">
			<p
				class={cn(
					'text-xs font-medium text-muted-foreground',
					damageTypesError && 'text-destructive'
				)}
			>
				Damage Types
			</p>
			<div class="flex gap-4">
				{#each damageTypeOptions as type}
					<label class="flex items-center gap-2 text-xs"
						><input
							type="checkbox"
							checked={$form.available_damage_types.includes(type)}
							onchange={() => toggleDamageType(type)}
							class="accent-accent"
						/>{damageTypeLabels[type]}</label
					>
				{/each}
			</div>
		</div>
		<div class="grid grid-cols-2 gap-3">
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground" for="secondary-weapon-attack-bonus"
					>Attack Bonus</label
				><Input
					id="secondary-weapon-attack-bonus"
					type="number"
					inputmode="numeric"
					bind:value={$attackRollBonus}
				/>
			</div>
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground" for="secondary-weapon-damage-bonus"
					>Damage Bonus</label
				><Input
					id="secondary-weapon-damage-bonus"
					type="number"
					inputmode="numeric"
					bind:value={$damageBonus}
				/>
			</div>
		</div>
	</div>
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between gap-2">
			<div class="flex items-center gap-2 truncate">
				<label
					class={cn(
						'text-xs font-medium text-nowrap text-muted-foreground',
						damageDiceError && 'text-destructive'
					)}
					for="secondary-weapon-damage-dice">Damage Dice</label
				>
				{#if $form.damage_dice}<span class="truncate text-xs text-muted-foreground"
						>({$form.damage_dice})</span
					>{/if}
			</div>
			<button
				type="button"
				disabled={$form.damage_dice === ''}
				class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:hidden"
				onclick={() => ($form.damage_dice = '')}
				title="Reset damage dice">Reset<RotateCcw class="size-3.5" /></button
			>
		</div>
		<DicePicker value={$form.damage_dice} onChange={(value) => ($form.damage_dice = value)} />
	</div>
	<FeaturesForm
		bind:features={$form.features}
		allowAddRemove
		featureLabel="Feature"
		{errorSummary}
	/>
	{#if errorSummaryMessages.length > 0}
		<ul class="list-inside list-disc space-y-1 pt-2">
			{#each errorSummaryMessages as error}<li class="text-xs text-destructive">{error}</li>{/each}
		</ul>
	{/if}
</form>
