<script lang="ts">
	import { ConsumableSchema, type Consumable } from '@convex/schemas/compendium';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { cn } from '$lib/utils';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { get } from 'svelte/store';
	import { tick } from 'svelte';
	import { summarizeSuperformErrors } from '$lib/components/homebrew/forms/helpers';
	import { consumableFormDataToItem, consumableToFormData, normalizeConsumable } from './normalize';
	import { summarizeConsumableFormErrors } from './errors';

	let {
		itemId,
		formId,
		item = $bindable(),
		hasChanges = $bindable(false),
		hasErrors = $bindable(false),
		unsavedItem = $bindable<Consumable | null>(null),
		saving = $bindable(false),
		onSaveSuccess,
		onSaveError
	}: {
		itemId: string;
		formId: string;
		item: Consumable;
		hasChanges?: boolean;
		hasErrors?: boolean;
		unsavedItem?: Consumable | null;
		saving?: boolean;
		onSaveSuccess?: () => void;
		onSaveError?: () => void;
	} = $props();

	const homebrew = getHomebrewContext();
	const consumableForm = superForm<Consumable>(consumableToFormData(item), {
		SPA: true,
		dataType: 'json',
		validators: zod4Client(ConsumableSchema),
		async onUpdate({ form: validatedForm }) {
			if (!validatedForm.valid) return;
			await saveConsumable();
		},
		resetForm: false,
		taintedMessage: false
	});
	const { form, errors, allErrors, tainted, enhance } = consumableForm;

	function buildFormData(formData = get(form)): Consumable {
		return consumableFormDataToItem(formData);
	}

	const errorSummary = $derived(summarizeSuperformErrors($allErrors));
	const errorSummaryMessages = $derived(summarizeConsumableFormErrors(errorSummary));
	const formHasChanges = $derived(Boolean($tainted));
	const titleError = $derived($errors.title?.[0]);

	$effect(() => {
		consumableForm.reset({ data: consumableToFormData(item) });
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

	async function saveConsumable() {
		saving = true;
		try {
			const nextItem = normalizeConsumable(buildFormData());
			await homebrew.updateItem({ type: 'consumables', id: itemId as never, item: nextItem });
			item = nextItem;
			consumableForm.reset({ data: consumableToFormData(nextItem) });
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
		consumableForm.reset({ data: consumableToFormData(item) });
		form.update((formData) => formData, { taint: 'untaint-all' });
	}
</script>

<form id={formId} method="POST" use:enhance onreset={handleReset} class="flex flex-col gap-4">
	<div class="flex flex-col gap-1">
		<label
			class={cn('text-xs font-medium text-muted-foreground', titleError && 'text-destructive')}
			for="consumable-name">Name</label
		>
		<Input
			id="consumable-name"
			bind:value={$form.title}
			placeholder="Consumable name"
			aria-invalid={Boolean(titleError)}
		/>
	</div>
	<div class="flex flex-col gap-1">
		<label class="text-xs font-medium text-muted-foreground" for="consumable-description"
			>Description</label
		>
		<Textarea
			id="consumable-description"
			bind:value={$form.description_html}
			placeholder="Consumable description"
			rows={3}
		/>
	</div>
	{#if errorSummaryMessages.length > 0}
		<ul class="list-inside list-disc space-y-1 pt-2">
			{#each errorSummaryMessages as error}<li class="text-xs text-destructive">{error}</li>{/each}
		</ul>
	{/if}
</form>
