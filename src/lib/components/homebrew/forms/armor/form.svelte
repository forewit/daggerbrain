<script lang="ts">
	import { ArmorSchema, type Armor } from '@convex/schemas/compendium';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import FeaturesForm from '../shared/features/form.svelte';
	import { cn, level_to_tier, tier_to_min_level } from '$lib/utils';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { superForm, intProxy } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { get } from 'svelte/store';
	import { tick } from 'svelte';
	import { summarizeSuperformErrors } from '$lib/components/homebrew/forms/helpers';
	import { armorFormDataToItem, armorToFormData, normalizeArmor } from './normalize';
	import { summarizeArmorFormErrors } from './errors';

	let {
		itemId,
		formId,
		item = $bindable(),
		hasChanges = $bindable(false),
		hasErrors = $bindable(false),
		unsavedItem = $bindable<Armor | null>(null),
		saving = $bindable(false),
		onSaveSuccess,
		onSaveError
	}: {
		itemId: string;
		formId: string;
		item: Armor;
		hasChanges?: boolean;
		hasErrors?: boolean;
		unsavedItem?: Armor | null;
		saving?: boolean;
		onSaveSuccess?: () => void;
		onSaveError?: () => void;
	} = $props();

	const homebrew = getHomebrewContext();
	const armorForm = superForm<Armor>(armorToFormData(item), {
		SPA: true,
		dataType: 'json',
		validators: zod4Client(ArmorSchema),
		async onUpdate({ form: validatedForm }) {
			if (!validatedForm.valid) return;
			await saveArmor();
		},
		resetForm: false,
		taintedMessage: false
	});
	const { form, errors, allErrors, tainted, enhance } = armorForm;
	const maxArmor = intProxy(armorForm, 'max_armor', { empty: 'zero' });
	const majorThreshold = intProxy(armorForm, 'damage_thresholds.major', { empty: 'zero' });
	const severeThreshold = intProxy(armorForm, 'damage_thresholds.severe', { empty: 'zero' });
	const tier = $derived(String(level_to_tier($form.level_requirement)));

	function setTier(value: string) {
		$form.level_requirement = tier_to_min_level(Number(value || '1'));
	}

	function buildFormData(formData = get(form)): Armor {
		return armorFormDataToItem(formData);
	}

	const errorSummary = $derived(summarizeSuperformErrors($allErrors));
	const errorSummaryMessages = $derived(summarizeArmorFormErrors(errorSummary));
	const formHasChanges = $derived(Boolean($tainted));
	const titleError = $derived($errors.title?.[0]);
	const maxArmorError = $derived($errors.max_armor?.[0]);
	const damageThresholdError = $derived($errors.damage_thresholds?._errors?.[0]);

	$effect(() => {
		armorForm.reset({ data: armorToFormData(item) });
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

	async function saveArmor() {
		saving = true;
		try {
			const nextItem = normalizeArmor(buildFormData());
			await homebrew.updateItem({ type: 'armor', id: itemId as never, item: nextItem });
			item = nextItem;
			armorForm.reset({ data: armorToFormData(nextItem) });
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
		armorForm.reset({ data: armorToFormData(item) });
		form.update((formData) => formData, { taint: 'untaint-all' });
	}
</script>

<form id={formId} method="POST" use:enhance onreset={handleReset} class="flex flex-col gap-4">
	<div class="flex flex-col gap-1">
		<label
			class={cn('text-xs font-medium text-muted-foreground', titleError && 'text-destructive')}
			for="armor-name">Name</label
		>
		<Input
			id="armor-name"
			bind:value={$form.title}
			placeholder="Armor name"
			aria-invalid={Boolean(titleError)}
		/>
	</div>
	<div class="flex flex-col gap-1">
		<label class="text-xs font-medium text-muted-foreground" for="armor-description"
			>Description</label
		>
		<Textarea
			id="armor-description"
			bind:value={$form.description_html}
			placeholder="Armor description"
			rows={3}
		/>
	</div>
	<div class="flex flex-col gap-1">
		<label class="text-xs font-medium text-muted-foreground" for="armor-tier">Tier</label>
		<Select.Root type="single" value={tier} onValueChange={(value) => value && setTier(value)}>
			<Select.Trigger id="armor-tier" class="w-full"><p class="truncate">{tier}</p></Select.Trigger>
			<Select.Content
				>{#each ['1', '2', '3', '4'] as option}<Select.Item value={option}>{option}</Select.Item
					>{/each}</Select.Content
			>
		</Select.Root>
	</div>
	<div class="flex flex-col gap-1">
		<label
			class={cn('text-xs font-medium text-muted-foreground', maxArmorError && 'text-destructive')}
			for="armor-score">Base Armor Score</label
		>
		<Input
			id="armor-score"
			type="number"
			min="0"
			step="1"
			inputmode="numeric"
			bind:value={$maxArmor}
			aria-invalid={Boolean(maxArmorError)}
		/>
	</div>
	<div class="flex flex-col gap-1">
		<p
			class={cn(
				'text-xs font-medium text-muted-foreground',
				damageThresholdError && 'text-destructive'
			)}
		>
			Base Damage Thresholds
		</p>
		<div class="grid grid-cols-2 gap-3">
			<div class="flex flex-col gap-1">
				<label class="text-xs text-muted-foreground" for="armor-major-threshold">Major</label><Input
					id="armor-major-threshold"
					type="number"
					min="0"
					step="1"
					inputmode="numeric"
					bind:value={$majorThreshold}
				/>
			</div>
			<div class="flex flex-col gap-1">
				<label class="text-xs text-muted-foreground" for="armor-severe-threshold">Severe</label
				><Input
					id="armor-severe-threshold"
					type="number"
					min="0"
					step="1"
					inputmode="numeric"
					bind:value={$severeThreshold}
				/>
			</div>
		</div>
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
